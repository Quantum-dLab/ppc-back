import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CreateCartUseCase } from '../application/use-cases/cart/create-cart.use-case';
import { GetCartUseCase } from '../application/use-cases/cart/get-cart.use-case';
import { ListCartsUseCase } from '../application/use-cases/cart/list-cart.use-case';

import { PagingDto, PagingResponseDto } from '@libs/shared';
import { HttpStatus } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { ApiDoc } from '../common/decorators';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserPanel } from '../common/decorators/swagger.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ApiCustomResponse } from '../common/types';
import { CartEntity } from '../domain/entities/cart.entity';
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
  @ApiDoc({
    summary: 'Create a new cart',
    description: 'Creates a new cart for a user',
    successStatus: HttpStatus.CREATED,
    successDescription: 'Cart created successfully',
    successResponse: ApiCustomResponse<Promise<CartEntity>>,
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
  async create(@CurrentUser() user: UserEntity) {
    return await this.createCart.execute({ uid: user.uid });
  }

  @Get()
  @ApiDoc({
    summary: 'Get all carts',
    successResponse: ApiCustomResponse<PagingResponseDto<CartEntity>>,
    isPaginated: true,
    successDescription: 'Carts retrieved successfully',
    errors: [HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN],
  })
  async list(@Query() dto: PagingDto): Promise<PagingResponseDto<CartEntity>> {
    return await this.listCarts.execute(dto);
  }

  @Get(':uid')
  @ApiDoc({
    summary: 'Get cart by uid',
    successResponse: ApiCustomResponse<Promise<CartEntity>>,
    successDescription: 'Cart retrieved successfully',
    errors: [
      HttpStatus.UNAUTHORIZED,
      HttpStatus.FORBIDDEN,
      HttpStatus.NOT_FOUND,
    ],
  })
  @ApiParam({
    name: 'uid',
    description: 'Cart unique identifier',
    example: 'a1b2c3-uuid',
  })
  async get(@Param('uid') uid: string) {
    return await this.getCart.execute(uid);
  }
}
