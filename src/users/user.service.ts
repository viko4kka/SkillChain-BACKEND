import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import { ethers } from 'ethers';
import { SetAddressDto } from './dto/setAddress.dto';
import { plainToInstance } from 'class-transformer';
import { CreateUserInput } from './interfaces/createUserInput.interface';
import { UpdateUserProfileDto } from './dto/updateUserProfile.dto';
import { GetUsersQueryDto } from './dto/getUsers.dto';
import { UserSkillInputDto } from './dto/updateUserSkills.dto';
import { ConfirmSkillDto } from './dto/confirmSkill.dto';
import { ConfigService } from '@nestjs/config';
import { DisplayUserDto } from './dto/displayUser.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async getUsers(query: GetUsersQueryDto): Promise<DisplayUserDto[]> {
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
        skills: string | null;
        locationName: string | null;
      }>
    >(
      `SELECT u.id, u."firstName", u."lastName", u."email", u."job", u."description", u."gitUrl", u."linkedinUrl",
      u."linkedinVisits", u."githubVisits", u."imgUrl", 
      COALESCE(string_agg(s.name, ', ' ORDER BY s.name), '') as "skills",
      l.name as "locationName"
      FROM "User" u
      LEFT JOIN "UserSkill" us ON u.id = us."userId"
      LEFT JOIN "Skill" s ON us."skillId" = s.id
      LEFT JOIN "Location" l ON u."locationId" = l.id
      ${query.search ? 'WHERE similarity(u."firstName", $1) > 0.2 OR similarity(u."lastName", $1) > 0.2' : ''}
      GROUP BY u.id, u."firstName", u."lastName", u."email", u."job", u."description", u."gitUrl", u."linkedinUrl",
      u."linkedinVisits", u."githubVisits", u."imgUrl", l."name"
      ${query.search ? 'ORDER BY GREATEST(similarity(u."firstName", $1), similarity(u."lastName", $1)) DESC' : 'ORDER BY u."firstName", u."lastName"'}`,
      ...(query.search ? [query.search] : []),
    );
    return plainToInstance(DisplayUserDto, users);
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

  async getSkillsForUser(userId: number) {
    return this.prisma.userSkill.findMany({
      where: { userId },
      include: { skill: true }, // if you want skill details
    });
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
    const abi = [
      'event TokenMinted(address indexed from, address indexed to, uint256 indexed skillId)',
    ];

    const txnHash = await provider.getTransaction(confirmSkillDto.txnHash);
    if (!txnHash) throw new ForbiddenException('Transaction not found');

    const receipt = await provider.getTransactionReceipt(confirmSkillDto.txnHash);
    if (!receipt) throw new ForbiddenException('Transaction receipt not found');

    const iface = new ethers.Interface(abi);
    const events = receipt.logs
      .map(log => {
        try {
          return iface.parseLog(log);
        } catch {
          return null;
        }
      })
      .find(
        event =>
          event &&
          event.name === 'TokenMinted' &&
          (event.args.from as string).toLowerCase() === approverAddress.toLowerCase() &&
          (event.args.to as string).toLowerCase() ===
            confirmSkillDto.receiverWallet.toLowerCase() &&
          (event.args.skillId as string).toString() === confirmSkillDto.skillId.toString(),
      );

    if (!events) throw new ForbiddenException('Data invalid or not found in transaction events');

    const receiver = await this.prisma.user.findUnique({
      where: { walletAddress: confirmSkillDto.receiverWallet },
    });
    if (!receiver) throw new ForbiddenException('Receiver wallet address not found');

    const existingHash = await this.prisma.confirmation.findUnique({
      where: { txnHash: confirmSkillDto.txnHash },
    });
    if (existingHash) throw new ForbiddenException('Transaction hash already exists');

    const duplicateConfirmation = await this.prisma.confirmation.findFirst({
      where: {
        skillId: confirmSkillDto.skillId,
        receiverId: receiver.id,
        approverId,
      },
    });
    if (duplicateConfirmation)
      throw new ForbiddenException('Skill already confirmed for this user');

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
