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
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { UserPanel } from '../../../common/decorators/swagger.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import {
  ApiCreatePaymentDocs,
  ApiGetPaymentHistoryDocs,
  ApiVerifyPaymentDocs,
} from '../../../common/order-payment-swagger.decorator';
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
  @ApiCreatePaymentDocs()
  async create(
    @CurrentUser() user: UserEntity,
    @Body() dto: CreatePaymentRequestDto,
  ): Promise<PaymentResponseDto> {
    return this.createPayment.execute(user, dto);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiVerifyPaymentDocs()
  async verify(
    @Body() dto: VerifyPaymentRequestDto,
  ): Promise<PaymentResponseDto> {
    return this.verifyPayment.execute(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiGetPaymentHistoryDocs()
  async history(
    @CurrentUser() user: UserEntity,
    @Query() query: PagingDto,
  ): Promise<PagingResponseDto<PaymentResponseDto>> {
    return this.listPaymentHistory.execute(user, query);
  }
}
