import { PagingDto, PagingResponseDto } from '@libs/shared';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../../../common/decorators/roles.decorator';
import { AdminPanel } from '../../../common/decorators/swagger.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import {
  ApiGetAllOrdersDocs,
  ApiUpdateOrderStatusDocs,
} from '../../../common/order-payment-swagger.decorator';
import { UserRole } from '../../../domain/entities/user.entity';
import {
  OrderResponseDto,
  UpdateOrderStatusRequestDto,
} from '../application/dto/order.dto';
import {
  ListOrdersUseCase,
  UpdateOrderStatusUseCase,
} from '../application/use-cases';

@AdminPanel('Admin Orders')
@Controller('admin/orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminOrdersController {
  constructor(
    private readonly listOrders: ListOrdersUseCase,
    private readonly updateOrderStatus: UpdateOrderStatusUseCase,
  ) {}

  @Get()
  @ApiGetAllOrdersDocs()
  async list(
    @Query() query: PagingDto,
  ): Promise<PagingResponseDto<OrderResponseDto>> {
    return this.listOrders.execute(query);
  }

  @Patch(':uid/status')
  @ApiUpdateOrderStatusDocs()
  async updateStatus(
    @Param('uid') uid: string,
    @Body() dto: UpdateOrderStatusRequestDto,
  ): Promise<OrderResponseDto> {
    return this.updateOrderStatus.execute(uid, dto);
  }
}
