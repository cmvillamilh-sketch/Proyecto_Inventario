import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';
import { Role } from '../../auth/enums/role.enum';

export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
export const PASSWORD_MESSAGE = 'Mínimo 8 caracteres, con mayúscula, minúscula y número';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @Matches(PASSWORD_REGEX, { message: PASSWORD_MESSAGE })
  password: string;

  @IsEnum(Role)
  role: Role;
}
