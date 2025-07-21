import { UserDto } from 'src/users/dto/users.dto';
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    linkedinState?: string;
    user?: UserDto
  }
}
