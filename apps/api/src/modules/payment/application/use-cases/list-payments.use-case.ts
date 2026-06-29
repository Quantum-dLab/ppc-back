import { PagingDto, PagingResponseDto } from '@libs/shared';
import { Inject, Injectable } from '@nestjs/common';
import { PAYMENT_REPOSITORY, type IPaymentRepository } from '../../domain';
import { PaymentResponseDto } from '../dto/payment.dto';

@Injectable()
export class ListPaymentsUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
  ) {}

  async execute(
    query: PagingDto,
  ): Promise<PagingResponseDto<PaymentResponseDto>> {
    const payments = await this.paymentRepository.findAll(query);
    return PaymentResponseDto.fromPaging(payments);
  }
}
