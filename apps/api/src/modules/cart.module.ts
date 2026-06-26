import { Module } from '@nestjs/common';

import { CreateCartItemUseCase } from '../application/use-cases/cart-item/create-cart-item.use-case';
import { GetCartItemUseCase } from '../application/use-cases/cart-item/get-cart-item.use-case';
import { ListCartItemUseCase } from '../application/use-cases/cart-item/list-cart-item.use-case';
import { UpdateCartItemUseCase } from '../application/use-cases/cart-item/update-cart-item.use-case';
import { CreateCartUseCase } from '../application/use-cases/cart/create-cart.use-case';
import { GetCartUseCase } from '../application/use-cases/cart/get-cart.use-case';
import { ListCartsUseCase } from '../application/use-cases/cart/list-cart.use-case';
import { CartItemsController } from '../controllers/cart-item.controller';
import { CartsController } from '../controllers/cart.controller';
import { CART_ITEM_REPOSITORY } from '../domain/repositories/cart-item.repository.interface';
import { CART_REPOSITORY } from '../domain/repositories/cart.repository.interface';
import { PrismaCartItemRepository } from '../infrastructure/repositories/prisma-cart-item.repository';
import { PrismaCartRepository } from '../infrastructure/repositories/prisma-cart.repository';
import { ProductModule } from './product.module';

const CART_USE_CASES = [CreateCartUseCase, GetCartUseCase, ListCartsUseCase];

const CART_ITEM_USE_CASES = [
  CreateCartItemUseCase,
  GetCartItemUseCase,
  ListCartItemUseCase,
  UpdateCartItemUseCase,
];

@Module({
  imports: [ProductModule],
  controllers: [CartsController, CartItemsController],
  providers: [
    { provide: CART_REPOSITORY, useClass: PrismaCartRepository },
    { provide: CART_ITEM_REPOSITORY, useClass: PrismaCartItemRepository },
    ...CART_USE_CASES,
    ...CART_ITEM_USE_CASES,
  ],
  exports: [...CART_USE_CASES, ...CART_ITEM_USE_CASES],
})
export class CartModule {}
