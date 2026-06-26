import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CartItemEntity } from 'apps/api/src/domain/entities/cart-item.entity';
import {
  CreateCartItemProps,
  CART_ITEM_REPOSITORY,
  type ICartItemRepository,
} from 'apps/api/src/domain/repositories/cart-item.repository.interface';
import {
  CART_REPOSITORY,
  type ICartRepository,
} from 'apps/api/src/domain/repositories/cart.repository.interface';
import {
  PRODUCT_REPOSITORY,
  type IProductRepository,
} from 'apps/api/src/domain/repositories/product.repository.interface';
import { CreateCartItemDto } from '../../dto/cart-item/create-cart-item.dto';

@Injectable()
export class CreateCartItemUseCase {
  constructor(
    @Inject(CART_ITEM_REPOSITORY)
    private readonly cartItemRepository: ICartItemRepository,
    @Inject(CART_REPOSITORY)
    private readonly cartRepository: ICartRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(dto: CreateCartItemDto): Promise<CartItemEntity> {
    const cart = await this.cartRepository.findByUid(dto.cartUid);
    if (!cart) {
      throw new NotFoundException(`Cart with UID "${dto.cartUid}" not found`);
    }

    const product = await this.productRepository.findByUid(dto.productUid);
    if (!product) {
      throw new NotFoundException(
        `Product with UID "${dto.productUid}" not found`,
      );
    }

    const requestedQuantity = dto.quantity || 1;
    if (product.stock < requestedQuantity) {
      throw new BadRequestException(
        `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${requestedQuantity}`,
      );
    }
    const createProps: CreateCartItemProps = {
      cartId: cart.id,
      productId: product.id,
      quantity: requestedQuantity,
    };

    return this.cartItemRepository.create(createProps);
  }
}
