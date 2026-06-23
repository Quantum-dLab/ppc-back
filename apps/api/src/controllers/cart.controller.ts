
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UpdateCartDto } from '../application/dto/cart/update-cart.dto';
import { CreateCartDto } from '../application/dto/cart/create-cart.dto';
import { UpdateCartUseCase } from '../application/use-cases/cart/update-cart.use-case';
import { CreateCartUseCase } from '../application/use-cases/cart/create-cart.use-case';
import { GetCartUseCase } from '../application/use-cases/cart/get-cart.use-case';
import { ListCartsUseCase } from '../application/use-cases/cart/list-cart.use-case';

@Controller('carts')
export class CartsController {
  constructor(
    private readonly createCart: CreateCartUseCase,
    private readonly getCart: GetCartUseCase,
    private readonly listCarts: ListCartsUseCase,
    private readonly updateCart: UpdateCartUseCase,
  ) {}

  @Post()
  create(@Body() dto: CreateCartDto) {
    return this.createCart.execute(dto);
  }

  @Get()
  list() {
    return this.listCarts.execute();
  }

  @Get(':uid')
  get(@Param('uid') uid: string) {
    return this.getCart.execute(uid);
  }

  @Patch(':uid')
  update(@Param('uid') uid: string, @Body() dto: UpdateCartDto) {
    return this.updateCart.execute(uid, dto);
  }
}
