import { PagingDto, PagingResponseDto } from '@libs/shared';
import { Inject, Injectable } from '@nestjs/common';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { ORDER_REPOSITORY, type IOrderRepository } from '../../domain';
import { OrderResponseDto } from '../dto/order.dto';

@Injectable()
export class ListUserOrdersUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(
    user: UserEntity,
    query: PagingDto,
  ): Promise<PagingResponseDto<OrderResponseDto>> {
    const orders = await this.orderRepository.findByUserId(user.id, query);
    return OrderResponseDto.fromPaging(orders);
  }
}
