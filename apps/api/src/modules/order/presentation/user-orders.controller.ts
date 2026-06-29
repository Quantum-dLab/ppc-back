import { PagingDto, PagingResponseDto } from '@libs/shared';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { UserPanel } from '../../../common/decorators/swagger.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import {
  ApiCreateOrderDocs,
  ApiGetUserOrderDetailsDocs,
  ApiGetUserOrdersDocs,
} from '../../../common/order-payment-swagger.decorator';
import { UserEntity } from '../../../domain/entities/user.entity';
import {
  CreateOrderRequestDto,
  OrderResponseDto,
} from '../application/dto/order.dto';
import {
  CreateOrderUseCase,
  GetUserOrderUseCase,
  ListUserOrdersUseCase,
} from '../application/use-cases';

@UserPanel('User Orders')
@Controller('user/orders')
@UseGuards(JwtAuthGuard)
export class UserOrdersController {
  constructor(
    private readonly createOrder: CreateOrderUseCase,
    private readonly listUserOrders: ListUserOrdersUseCase,
    private readonly getUserOrder: GetUserOrderUseCase,
  ) {}

  @Post()
  @ApiCreateOrderDocs()
  async create(
    @CurrentUser() user: UserEntity,
    @Body() dto: CreateOrderRequestDto,
  ): Promise<OrderResponseDto> {
    return this.createOrder.execute(user, dto);
  }

  @Get()
  @ApiGetUserOrdersDocs()
  async list(
    @CurrentUser() user: UserEntity,
    @Query() query: PagingDto,
  ): Promise<PagingResponseDto<OrderResponseDto>> {
    return this.listUserOrders.execute(user, query);
  }

  @Get(':uid')
  @ApiGetUserOrderDetailsDocs()
  async get(
    @CurrentUser() user: UserEntity,
    @Param('uid') uid: string,
  ): Promise<OrderResponseDto> {
    return this.getUserOrder.execute(user, uid);
  }
}
