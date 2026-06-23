import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateCartDto {
  @IsNotEmpty({ message: 'userId is required' })
  @IsInt({ message: 'userId must be an integer' })
  @IsPositive({ message: 'userId must be a positive number' })
  userId: number;
}
