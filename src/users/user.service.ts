import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import { ethers } from 'ethers';
import ContractABI from '../contracts/SkillToken.abi.json';
import { SetAddressDto } from './dto/setAddress.dto';
import { plainToInstance } from 'class-transformer';
import { CreateUserInput } from './interfaces/createUserInput.interface';
import { UpdateUserProfileDto } from './dto/updateUserProfile.dto';
import { GetUsersQueryDto } from './dto/getUsers.dto';
import { LanguageDto } from '../common/dto/language.dto';
import { UserSkillInputDto } from './dto/updateUserSkills.dto';
import { ConfirmSkillDto } from './dto/confirmSkill.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async getUsers(query: GetUsersQueryDto): Promise<UserDto[]> {
    if (query.search) {
      const users = await this.prisma.$queryRawUnsafe<
        Array<{
          id: number;
          firstName: string;
          lastName: string;
          email?: string;
          job: string | null;
          description: string | null;
          gitUrl: string | null;
          linkedinUrl: string | null;
          linkedinVisits: number;
          githubVisits: number;
          imgUrl: string | null;
        }>
      >(
        `SELECT id, "firstName", "lastName", "email", "job", "description", "gitUrl", "linkedinUrl",
        "linkedinVisits", "githubVisits", "imgUrl"
        FROM "User" WHERE similarity("firstName", $1) > 0.2 OR similarity("lastName", $1) > 0.2
        ORDER BY GREATEST(similarity("firstName", $1), similarity("lastName", $1)) DESC`,
        query.search,
      );
      return plainToInstance(UserDto, users);
    } else {
      const users = await this.prisma.user.findMany();
      return plainToInstance(UserDto, users);
    }
  }

  async findOneUser(id: number): Promise<UserDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user ? plainToInstance(UserDto, user) : null;
  }

  async findByLinkedinId(linkedinId: string): Promise<UserDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { linkedinId },
    });
    return user ? plainToInstance(UserDto, user) : null;
  }

  async create(userData: CreateUserInput): Promise<UserDto> {
    const createdUser = await this.prisma.user.create({
      data: userData,
    });
    return plainToInstance(UserDto, createdUser);
  }

  async updateProfile(id: number, data: UpdateUserProfileDto): Promise<UserDto> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async getUserLanguages(userId: number): Promise<LanguageDto[]> {
    const userLanguages = await this.prisma.userLanguage.findMany({
      where: { userId },
      include: { language: true },
    });
    return userLanguages
      .filter(ul => ul.language)
      .map(ul => ({
        id: ul.language.id,
        name: ul.language.name,
      }));
  }

  async incrementVisits(userId: number, type: 'linkedin' | 'github'): Promise<void> {
    if (type === 'linkedin') {
      await this.prisma.user.update({
        where: { id: userId },
        data: { linkedinVisits: { increment: 1 } },
      });
    } else if (type === 'github') {
      await this.prisma.user.update({
        where: { id: userId },
        data: { githubVisits: { increment: 1 } },
      });
    }
  }

  // Post new language for a user
  async updateUserLanguages(userId: number, languageIds: number[]) {
    await this.prisma.userLanguage.deleteMany({ where: { userId } });
    if (languageIds.length > 0) {
      await this.prisma.userLanguage.createMany({
        data: languageIds.map(languageId => ({ userId, languageId })),
      });
    }
    const userLanguages = await this.prisma.userLanguage.findMany({
      where: { userId },
      include: { language: true },
    });
    return plainToInstance(
      LanguageDto,
      userLanguages.map(ul => ({
        id: ul.language.id,
        name: ul.language.name,
      })),
    );
  }

  async setSkillsForUser(
    userId: number,
    skills: UserSkillInputDto[],
  ): Promise<UserSkillInputDto[]> {
    await this.prisma.userSkill.deleteMany({ where: { userId } });
    if (skills.length > 0) {
      await this.prisma.userSkill.createMany({
        data: skills.map(skill => ({
          userId,
          skillId: skill.skillId,
          description: skill.description ?? null,
        })),
      });
    }
    const dbSkills = await this.prisma.userSkill.findMany({
      where: { userId },
      select: { skillId: true, description: true },
    });
    return plainToInstance(UserSkillInputDto, dbSkills);
  }

  async setWalletAddress(userId: number, setAddressDto: SetAddressDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user!.walletAddress)
      throw new ForbiddenException('Wallet address already set and cannot be changed');
    const message = JSON.stringify({ id: userId });
    const isValid = this.verifyWalletSignature(
      setAddressDto.walletAddress,
      setAddressDto.signature,
      message,
    );
    if (!isValid) throw new ForbiddenException('Invalid wallet signature');

    return this.prisma.user.update({
      where: { id: userId },
      data: { walletAddress: setAddressDto.walletAddress },
    });
  }

  verifyWalletSignature(walletAddress: string, signature: string, message: string): boolean {
    try {
      const signer = ethers.verifyMessage(message, signature);
      return signer.toLowerCase() === walletAddress.toLowerCase();
    } catch {
      return false;
    }
  }

  async confirmSkill(
    approverId: number,
    approverAddress: string,
    confirmSkillDto: ConfirmSkillDto,
  ) {
    const provider = new ethers.JsonRpcProvider(this.configService.get<string>('RPC_URL'));
    const contractAddress = this.configService.get<string>('CONTRACT_ADDRESS');
    const txnHash = await provider.getTransaction(confirmSkillDto.txnHash);
    const receipt = await provider.getTransactionReceipt(confirmSkillDto.txnHash);
    const iface = new ethers.Interface(ContractABI);

    if (!txnHash) {
      throw new ForbiddenException('Transaction not found');
    }
    if (!receipt || receipt.logs.length === 0) {
      throw new ForbiddenException('No events found for this transaction');
    }
    if (!approverAddress) {
      throw new ForbiddenException('Approver wallet address not found');
    }

    const receiver = await this.prisma.user.findUnique({
      where: { walletAddress: confirmSkillDto.receiverWallet },
    });
    if (!receiver) {
      throw new ForbiddenException('Receiver wallet address not found');
    }

    const relevantLogs = receipt.logs.filter(
      log => log.address.toLowerCase() === contractAddress!.toLowerCase(),
    );
    const foundEvent = relevantLogs.some(log => {
      try {
        const parsedLog = iface.parseLog(log);
        return (
          parsedLog!.name === 'TokenMinted' &&
          parsedLog!.args.from.toLowerCase() === approverAddress.toLowerCase() &&
          parsedLog!.args.to.toLowerCase() === confirmSkillDto.receiverWallet.toLowerCase() &&
          parsedLog!.args.skillId.toString() === confirmSkillDto.skillId.toString()
        );
      } catch {
        return false;
      }
    });
    if (!foundEvent) {
      throw new ForbiddenException('No matching TokenMinted event found in transaction');
    }
    const newConfirmation = await this.prisma.confirmation.create({
      data: {
        skillId: confirmSkillDto.skillId,
        receiverId: receiver.id,
        approverId,
        txnHash: confirmSkillDto.txnHash,
      },
    });
    return plainToInstance(ConfirmSkillDto, newConfirmation);
  }
}
