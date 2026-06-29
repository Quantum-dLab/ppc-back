import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ORDER_REPOSITORY, type IOrderRepository } from '../../domain';
import {
  OrderResponseDto,
  UpdateOrderStatusRequestDto,
} from '../dto/order.dto';

@Injectable()
export class UpdateOrderStatusUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(
    orderUid: string,
    dto: UpdateOrderStatusRequestDto,
  ): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findByUid(orderUid);
    if (!order) {
      throw new NotFoundException(`Order with UID "${orderUid}" not found`);
    }

    const updatedOrder = await this.orderRepository.updateStatus(
      orderUid,
      dto.status,
    );
    return OrderResponseDto.fromEntity(updatedOrder);
  }
}
