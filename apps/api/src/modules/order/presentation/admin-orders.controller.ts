import { PagingDto, PagingResponseDto } from '@libs/shared';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ApiDoc } from '../../../common/decorators';
import { Roles } from '../../../common/decorators/roles.decorator';
import { AdminPanel } from '../../../common/decorators/swagger.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { UserRole } from '../../../domain/entities/user.entity';
import {
  OrderResponseDto,
  UpdateOrderStatusRequestDto,
} from '../application/dto/order.dto';
import {
  ListOrdersUseCase,
  UpdateOrderStatusUseCase,
} from '../application/use-cases';

@AdminPanel('Orders')
@Controller('admin/orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminOrdersController {
  constructor(
    private readonly listOrders: ListOrdersUseCase,
    private readonly updateOrderStatus: UpdateOrderStatusUseCase,
  ) {}

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
    summary: 'Get All Orders',
    description: 'Returns paginated orders for admin management.',
    successDescription: 'Orders retrieved successfully',
    successResponse: OrderResponseDto,
    isPaginated: true,
    errors: [HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN],
  })
  async list(
    @Query() query: PagingDto,
  ): Promise<PagingResponseDto<OrderResponseDto>> {
    return this.listOrders.execute(query);
  }

  @Patch(':uid/status')
  @ApiBearerAuth('Authorization')
  @ApiParam({
    name: 'uid',
    description: 'Order public unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174100',
  })
  @ApiDoc({
    summary: 'Update Order Status',
    description: 'Updates an order status from the admin panel.',
    body: UpdateOrderStatusRequestDto,
    successDescription: 'Order status updated successfully',
    successResponse: OrderResponseDto,
    errors: [
      HttpStatus.BAD_REQUEST,
      HttpStatus.UNAUTHORIZED,
      HttpStatus.FORBIDDEN,
      HttpStatus.NOT_FOUND,
    ],
  })
  async updateStatus(
    @Param('uid') uid: string,
    @Body() dto: UpdateOrderStatusRequestDto,
  ): Promise<OrderResponseDto> {
    return this.updateOrderStatus.execute(uid, dto);
  }
}
