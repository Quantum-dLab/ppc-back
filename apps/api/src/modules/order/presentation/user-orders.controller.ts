import { PagingDto, PagingResponseDto } from '@libs/shared';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ApiDoc } from '../../../common/decorators';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { UserPanel } from '../../../common/decorators/swagger.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
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
  @ApiBearerAuth('Authorization')
  @ApiDoc({
    summary: 'Create Order',
    description:
      'Creates a pending order for the authenticated user from one or more product items.',
    body: CreateOrderRequestDto,
    successStatus: HttpStatus.CREATED,
    successDescription: 'Order created successfully',
    successResponse: OrderResponseDto,
    errors: [
      HttpStatus.BAD_REQUEST,
      HttpStatus.UNAUTHORIZED,
      HttpStatus.NOT_FOUND,
    ],
  })
  async create(
    @CurrentUser() user: UserEntity,
    @Body() dto: CreateOrderRequestDto,
  ): Promise<OrderResponseDto> {
    return this.createOrder.execute(user, dto);
  }

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
    summary: 'Get User Orders',
    description: 'Returns paginated orders owned by the authenticated user.',
    successDescription: 'User orders retrieved successfully',
    successResponse: OrderResponseDto,
    isPaginated: true,
    errors: [HttpStatus.UNAUTHORIZED],
  })
  async list(
    @CurrentUser() user: UserEntity,
    @Query() query: PagingDto,
  ): Promise<PagingResponseDto<OrderResponseDto>> {
    return this.listUserOrders.execute(user, query);
  }

  @Get(':uid')
  @ApiBearerAuth('Authorization')
  @ApiParam({
    name: 'uid',
    description: 'Order public unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174100',
  })
  @ApiDoc({
    summary: 'Get Order Details',
    description:
      'Returns details for an order owned by the authenticated user.',
    successDescription: 'Order details retrieved successfully',
    successResponse: OrderResponseDto,
    errors: [HttpStatus.UNAUTHORIZED, HttpStatus.NOT_FOUND],
  })
  async get(
    @CurrentUser() user: UserEntity,
    @Param('uid') uid: string,
  ): Promise<OrderResponseDto> {
    return this.getUserOrder.execute(user, uid);
  }
}
