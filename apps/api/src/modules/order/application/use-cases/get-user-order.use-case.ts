import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { ORDER_REPOSITORY, type IOrderRepository } from '../../domain';
import { OrderResponseDto } from '../dto/order.dto';

@Injectable()
export class GetUserOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(user: UserEntity, orderUid: string): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findByUid(orderUid);
    if (!order || order.userId !== user.id) {
      throw new NotFoundException(`Order with UID "${orderUid}" not found`);
    }

    return OrderResponseDto.fromEntity(order);
  }
}
