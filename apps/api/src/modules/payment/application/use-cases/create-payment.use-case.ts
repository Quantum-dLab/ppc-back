import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { ORDER_REPOSITORY, type IOrderRepository } from '../../../order/domain';
import { PaymentStatus } from '../../domain/enums/payment-status.enum';
import { PAYMENT_REPOSITORY, type IPaymentRepository } from '../../domain';
import {
  CreatePaymentRequestDto,
  PaymentResponseDto,
} from '../dto/payment.dto';

@Injectable()
export class CreatePaymentUseCase {
  private readonly activePaymentStatuses = [
    PaymentStatus.PENDING,
    PaymentStatus.PROCESSING,
    PaymentStatus.SUCCESS,
  ];

  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(
    user: UserEntity,
    dto: CreatePaymentRequestDto,
  ): Promise<PaymentResponseDto> {
    const order = await this.orderRepository.findByUid(dto.orderUid);
    if (!order || order.userId !== user.id) {
      throw new NotFoundException(`Order with UID "${dto.orderUid}" not found`);
    }

    if (!order.canBePaid()) {
      throw new BadRequestException('Order is not payable');
    }

    const existingPayments = await this.paymentRepository.findByOrderId(
      order.id,
    );
    const activePayment = existingPayments.find((payment) =>
      this.activePaymentStatuses.includes(payment.status),
    );
    if (activePayment) {
      throw new ConflictException(
        'An active payment already exists for this order',
      );
    }

    const payment = await this.paymentRepository.create({
      orderId: order.id,
      amount: order.totalPrice,
      status: PaymentStatus.PENDING,
      authority: randomUUID(),
      description: dto.description,
    });

    return PaymentResponseDto.fromEntity(payment);
  }
}
