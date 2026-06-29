import { PagingDto, PagingResponseDto } from '@libs/shared';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ApiDoc } from '../../../common/decorators';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { UserPanel } from '../../../common/decorators/swagger.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { UserEntity } from '../../../domain/entities/user.entity';
import {
  CreatePaymentRequestDto,
  PaymentResponseDto,
  VerifyPaymentRequestDto,
} from '../application/dto/payment.dto';
import {
  CreatePaymentUseCase,
  ListUserPaymentHistoryUseCase,
  VerifyPaymentUseCase,
} from '../application/use-cases';

@UserPanel('Payments')
@Controller('user/payments')
export class UserPaymentsController {
  constructor(
    private readonly createPayment: CreatePaymentUseCase,
    private readonly listPaymentHistory: ListUserPaymentHistoryUseCase,
    private readonly verifyPayment: VerifyPaymentUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiDoc({
    summary: 'Create Payment for Order',
    description:
      'Creates a pending payment authority for an authenticated user order.',
    body: CreatePaymentRequestDto,
    successStatus: HttpStatus.CREATED,
    successDescription: 'Payment created successfully',
    successResponse: PaymentResponseDto,
    errors: [
      HttpStatus.BAD_REQUEST,
      HttpStatus.UNAUTHORIZED,
      HttpStatus.NOT_FOUND,
      HttpStatus.CONFLICT,
    ],
  })
  async create(
    @CurrentUser() user: UserEntity,
    @Body() dto: CreatePaymentRequestDto,
  ): Promise<PaymentResponseDto> {
    return this.createPayment.execute(user, dto);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiDoc({
    summary: 'Verify Payment',
    description:
      'Verifies a payment authority from the user return flow or a trusted system callback.',
    body: VerifyPaymentRequestDto,
    successDescription: 'Payment verified successfully',
    successResponse: PaymentResponseDto,
    errors: [HttpStatus.BAD_REQUEST, HttpStatus.NOT_FOUND, HttpStatus.CONFLICT],
  })
  async verify(
    @Body() dto: VerifyPaymentRequestDto,
  ): Promise<PaymentResponseDto> {
    return this.verifyPayment.execute(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
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
    summary: 'Get Payment History',
    description:
      'Returns paginated payment history for the authenticated user.',
    successDescription: 'Payment history retrieved successfully',
    successResponse: PaymentResponseDto,
    isPaginated: true,
    errors: [HttpStatus.UNAUTHORIZED],
  })
  async history(
    @CurrentUser() user: UserEntity,
    @Query() query: PagingDto,
  ): Promise<PagingResponseDto<PaymentResponseDto>> {
    return this.listPaymentHistory.execute(user, query);
  }
}
