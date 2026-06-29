import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateCartUseCase } from '../application/use-cases/cart/create-cart.use-case';
import { GetCartUseCase } from '../application/use-cases/cart/get-cart.use-case';
import { ListCartsUseCase } from '../application/use-cases/cart/list-cart.use-case';

import { PagingDto, PagingResponseDto } from '@libs/shared';
import { CartResponseDto } from '../application/dto/cart/cart-response.dto';
import { ApiDoc } from '../common/decorators';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserPanel } from '../common/decorators/swagger.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UserEntity } from '../domain/entities/user.entity';

@UserPanel('Carts')
@Controller('carts')
export class CartsController {
  constructor(
    private readonly createCart: CreateCartUseCase,
    private readonly getCart: GetCartUseCase,
    private readonly listCarts: ListCartsUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth('Authorization')
  @ApiDoc({
    summary: 'Create Cart',
    description: 'Creates a cart for the authenticated user.',
    successStatus: HttpStatus.CREATED,
    successDescription: 'Cart created successfully',
    successResponse: CartResponseDto,
    errors: [
      HttpStatus.BAD_REQUEST,
      HttpStatus.UNAUTHORIZED,
      HttpStatus.FORBIDDEN,
      {
        status: HttpStatus.CONFLICT,
        description: 'Cart already exists for this user',
      },
    ],
  })
  async create(@CurrentUser() user: UserEntity): Promise<CartResponseDto> {
    return CartResponseDto.fromEntity(
      await this.createCart.execute({ uid: user.uid }),
    );
  }

  @Get()
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Requested page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Items per page',
  })
  @ApiDoc({
    summary: 'Get Carts',
    description: 'Returns paginated carts.',
    successDescription: 'Carts retrieved successfully',
    successResponse: CartResponseDto,
    isPaginated: true,
    errors: [HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN],
  })
  async list(
    @Query() dto: PagingDto,
  ): Promise<PagingResponseDto<CartResponseDto>> {
    return CartResponseDto.fromPaging(await this.listCarts.execute(dto));
  }

  @Get(':uid')
  @ApiParam({
    name: 'uid',
    description: 'Cart public unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174010',
  })
  @ApiDoc({
    summary: 'Get Cart',
    description: 'Returns a cart by public unique identifier.',
    successDescription: 'Cart retrieved successfully',
    successResponse: CartResponseDto,
    errors: [
      HttpStatus.UNAUTHORIZED,
      HttpStatus.FORBIDDEN,
      HttpStatus.NOT_FOUND,
    ],
  })
  async get(@Param('uid') uid: string): Promise<CartResponseDto> {
    return CartResponseDto.fromEntity(await this.getCart.execute(uid));
  }
}
