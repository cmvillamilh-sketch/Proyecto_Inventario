import { Matches } from 'class-validator';
import { PASSWORD_MESSAGE, PASSWORD_REGEX } from './create-user.dto';

export class ResetPasswordDto {
  @Matches(PASSWORD_REGEX, { message: PASSWORD_MESSAGE })
  newPassword: string;
}
