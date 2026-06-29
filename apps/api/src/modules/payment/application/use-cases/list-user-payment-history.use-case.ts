import { PagingDto, PagingResponseDto } from '@libs/shared';
import { Inject, Injectable } from '@nestjs/common';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { PAYMENT_REPOSITORY, type IPaymentRepository } from '../../domain';
import { PaymentResponseDto } from '../dto/payment.dto';

@Injectable()
export class ListUserPaymentHistoryUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
  ) {}

  async execute(
    user: UserEntity,
    query: PagingDto,
  ): Promise<PagingResponseDto<PaymentResponseDto>> {
    const payments = await this.paymentRepository.findByUserId(user.id, query);
    return PaymentResponseDto.fromPaging(payments);
  }
}
