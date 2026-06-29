import { PagingDto, PagingResponseDto } from '@libs/shared';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Roles } from '../../../common/decorators/roles.decorator';
import { AdminPanel } from '../../../common/decorators/swagger.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { ApiGetAllPaymentsDocs } from '../../../common/order-payment-swagger.decorator';
import { UserRole } from '../../../domain/entities/user.entity';
import { PaymentResponseDto } from '../application/dto/payment.dto';
import { ListPaymentsUseCase } from '../application/use-cases';

@AdminPanel("Payment")
@Controller('admin/payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminPaymentsController {
  constructor(private readonly listPayments: ListPaymentsUseCase) {}

  @Get()
  @ApiGetAllPaymentsDocs()
  async list(
    @Query() query: PagingDto,
  ): Promise<PagingResponseDto<PaymentResponseDto>> {
    return this.listPayments.execute(query);
  }
}
