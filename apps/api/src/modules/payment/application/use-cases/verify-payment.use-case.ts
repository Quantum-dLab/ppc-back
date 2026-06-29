import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ORDER_REPOSITORY,
  OrderStatus,
  type IOrderRepository,
} from '../../../order/domain';
import { PaymentStatus } from '../../domain/enums/payment-status.enum';
import { PAYMENT_REPOSITORY, type IPaymentRepository } from '../../domain';
import {
  PaymentResponseDto,
  VerifyPaymentRequestDto,
} from '../dto/payment.dto';

@Injectable()
export class VerifyPaymentUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(dto: VerifyPaymentRequestDto): Promise<PaymentResponseDto> {
    const payment = await this.paymentRepository.findByAuthority(dto.authority);
    if (!payment) {
      throw new NotFoundException('Payment authority not found');
    }

    if (payment.isSuccessful()) {
      return PaymentResponseDto.fromEntity(payment);
    }

    if (dto.success && !dto.refId) {
      throw new BadRequestException(
        'refId is required for successful payments',
      );
    }

    if (dto.refId) {
      const paymentWithRef = await this.paymentRepository.findByRefId(
        dto.refId,
      );
      if (paymentWithRef && paymentWithRef.uid !== payment.uid) {
        throw new ConflictException('Payment reference id already exists');
      }
    }

    const now = new Date();
    const updatedPayment = await this.paymentRepository.update(payment.uid, {
      status: dto.success ? PaymentStatus.SUCCESS : PaymentStatus.FAILED,
      refId: dto.success ? dto.refId : undefined,
      gatewayResponse: dto.gatewayResponse,
      paidAt: dto.success ? now : null,
      failedAt: dto.success ? null : now,
    });

    await this.orderRepository.updateStatusById(
      payment.orderId,
      dto.success ? OrderStatus.PAID : OrderStatus.FAILED,
    );

    return PaymentResponseDto.fromEntity(updatedPayment);
  }
}
