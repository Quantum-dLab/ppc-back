import {
  CreateCartItemUseCase,
  GetCartItemUseCase,
  ListCartItemUseCase,
  UpdateCartItemUseCase,
} from '../application/use-cases/cart-item';
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateCartItemDto } from '../application/dto/cart-item/create-cart-item.dto';
import { UpdateCartItemDto } from '../application/dto/cart-item/update-cart-item.dto';

@Controller('cart-items')
export class CartItemsController {
  constructor(
    private readonly createCartItem: CreateCartItemUseCase,
    private readonly getCartItem: GetCartItemUseCase,
    private readonly listCartItems: ListCartItemUseCase,
    private readonly updateCartItem: UpdateCartItemUseCase,
  ) {}

  @Post()
  create(@Body() dto: CreateCartItemDto) {
    return this.createCartItem.execute(dto);
  }

  @Get()
  list() {
    return this.listCartItems.execute();
  }

  @Get(':uid')
  get(@Param('uid') uid: string) {
    return this.getCartItem.execute(uid);
  }

  @Patch(':uid')
  update(@Param('uid') uid: string, @Body() dto: UpdateCartItemDto) {
    return this.updateCartItem.execute(uid, dto);
  }
}
