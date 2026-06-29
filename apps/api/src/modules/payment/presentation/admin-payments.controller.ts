import { PagingDto, PagingResponseDto } from '@libs/shared';
import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ApiDoc } from '../../../common/decorators';
import { Roles } from '../../../common/decorators/roles.decorator';
import { AdminPanel } from '../../../common/decorators/swagger.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { UserRole } from '../../../domain/entities/user.entity';
import { PaymentResponseDto } from '../application/dto/payment.dto';
import { ListPaymentsUseCase } from '../application/use-cases';

@AdminPanel('Payments')
@Controller('admin/payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminPaymentsController {
  constructor(private readonly listPayments: ListPaymentsUseCase) {}

  @Get()
  @ApiBearerAuth('Authorization')
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Requested page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Items per page',
  })
  @ApiDoc({
    summary: 'Get All Payments',
    description: 'Returns paginated payments for admin management.',
    successDescription: 'Payments retrieved successfully',
    successResponse: PaymentResponseDto,
    isPaginated: true,
    errors: [HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN],
  })
  async list(
    @Query() query: PagingDto,
  ): Promise<PagingResponseDto<PaymentResponseDto>> {
    return this.listPayments.execute(query);
  }
}
