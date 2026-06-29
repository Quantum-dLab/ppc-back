import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from '../../../../domain/entities/user.entity';
import {
  PRODUCT_REPOSITORY,
  type IProductRepository,
} from '../../../../domain/repositories/product.repository.interface';
import {
  OrderEntity,
  ORDER_REPOSITORY,
  type IOrderRepository,
} from '../../domain';
import { CreateOrderRequestDto, OrderResponseDto } from '../dto/order.dto';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(
    user: UserEntity,
    dto: CreateOrderRequestDto,
  ): Promise<OrderResponseDto> {
    const normalizedItems = this.normalizeItems(dto);
    const products = await Promise.all(
      normalizedItems.map(async (item) => {
        const product = await this.productRepository.findByUid(item.productUid);
        if (!product) {
          throw new NotFoundException(
            `Product with UID "${item.productUid}" not found`,
          );
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`,
          );
        }

        return {
          product,
          quantity: item.quantity,
        };
      }),
    );

    const order = OrderEntity.createPending({
      userId: user.id,
      items: products.map(({ product, quantity }) => ({
        productId: product.id,
        productUid: product.uid,
        productName: product.name,
        quantity,
        unitPrice: product.price,
      })),
    });

    const createdOrder = await this.orderRepository.create({
      userId: order.userId,
      status: order.status,
      totalPrice: order.totalPrice,
      items: order.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    });

    return OrderResponseDto.fromEntity(createdOrder);
  }

  private normalizeItems(
    dto: CreateOrderRequestDto,
  ): CreateOrderRequestDto['items'] {
    const itemsByProduct = new Map<string, number>();

    for (const item of dto.items) {
      itemsByProduct.set(
        item.productUid,
        (itemsByProduct.get(item.productUid) ?? 0) + item.quantity,
      );
    }

    return Array.from(itemsByProduct.entries()).map(
      ([productUid, quantity]) => ({
        productUid,
        quantity,
      }),
    );
  }
}
