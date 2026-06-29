import { PagingDto, PagingResponseDto } from '@libs/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ORDER_REPOSITORY, type IOrderRepository } from '../../domain';
import { OrderResponseDto } from '../dto/order.dto';

@Injectable()
export class ListOrdersUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(
    query: PagingDto,
  ): Promise<PagingResponseDto<OrderResponseDto>> {
    const orders = await this.orderRepository.findAll(query);
    return OrderResponseDto.fromPaging(orders);
  }
}
