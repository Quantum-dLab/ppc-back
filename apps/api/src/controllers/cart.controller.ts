import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CreateCartUseCase } from '../application/use-cases/cart/create-cart.use-case';
import { GetCartUseCase } from '../application/use-cases/cart/get-cart.use-case';
import { ListCartsUseCase } from '../application/use-cases/cart/list-cart.use-case';

import { PagingDto, PagingResponseDto } from '@libs/shared';
import { CartResponseDto } from '../application/dto/cart/cart-response.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserPanel } from '../common/decorators/swagger.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import {
  ApiCreateCartDocs,
  ApiGetCartDocs,
  ApiListCartsDocs,
} from '../common/core-swagger.decorator';
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
  @ApiCreateCartDocs()
  async create(@CurrentUser() user: UserEntity): Promise<CartResponseDto> {
    return CartResponseDto.fromEntity(
      await this.createCart.execute({ uid: user.uid }),
    );
  }

  @Get()
  @ApiListCartsDocs()
  async list(
    @Query() dto: PagingDto,
  ): Promise<PagingResponseDto<CartResponseDto>> {
    return CartResponseDto.fromPaging(await this.listCarts.execute(dto));
  }

  @Get(':uid')
  @ApiGetCartDocs()
  async get(@Param('uid') uid: string): Promise<CartResponseDto> {
    return CartResponseDto.fromEntity(await this.getCart.execute(uid));
  }
}
