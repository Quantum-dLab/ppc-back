import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import {
  CreateOrderRequestDto,
  OrderResponseDto,
  UpdateOrderStatusRequestDto,
} from '../modules/order/application/dto/order.dto';
import {
  CreatePaymentRequestDto,
  PaymentResponseDto,
  VerifyPaymentRequestDto,
} from '../modules/payment/application/dto/payment.dto';
import { ApiDoc } from './decorators';

const BearerAuth = () => ApiBearerAuth('Authorization');

const PaginationDocs = () =>
  applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      example: 1,
      description: 'Requested page number',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      example: 10,
      description: 'Items per page',
    }),
  );

export const ApiCreateOrderDocs = () =>
  applyDecorators(
    BearerAuth(),
    ApiDoc({
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
    }),
  );

export const ApiGetUserOrdersDocs = () =>
  applyDecorators(
    BearerAuth(),
    PaginationDocs(),
    ApiDoc({
      summary: 'Get User Orders',
      description: 'Returns paginated orders owned by the authenticated user.',
      successDescription: 'User orders retrieved successfully',
      successResponse: OrderResponseDto,
      isPaginated: true,
      errors: [HttpStatus.UNAUTHORIZED],
    }),
  );

export const ApiGetUserOrderDetailsDocs = () =>
  applyDecorators(
    BearerAuth(),
    ApiParam({
      name: 'uid',
      description: 'Order public unique identifier',
      example: '123e4567-e89b-12d3-a456-426614174100',
    }),
    ApiDoc({
      summary: 'Get Order Details',
      description:
        'Returns details for an order owned by the authenticated user.',
      successDescription: 'Order details retrieved successfully',
      successResponse: OrderResponseDto,
      errors: [HttpStatus.UNAUTHORIZED, HttpStatus.NOT_FOUND],
    }),
  );

export const ApiGetAllOrdersDocs = () =>
  applyDecorators(
    BearerAuth(),
    PaginationDocs(),
    ApiDoc({
      summary: 'Get All Orders',
      description: 'Returns paginated orders for admin management.',
      successDescription: 'Orders retrieved successfully',
      successResponse: OrderResponseDto,
      isPaginated: true,
      errors: [HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN],
    }),
  );

export const ApiUpdateOrderStatusDocs = () =>
  applyDecorators(
    BearerAuth(),
    ApiParam({
      name: 'uid',
      description: 'Order public unique identifier',
      example: '123e4567-e89b-12d3-a456-426614174100',
    }),
    ApiDoc({
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
    }),
  );

export const ApiCreatePaymentDocs = () =>
  applyDecorators(
    BearerAuth(),
    ApiDoc({
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
    }),
  );

export const ApiVerifyPaymentDocs = () =>
  applyDecorators(
    ApiDoc({
      summary: 'Verify Payment',
      description:
        'Verifies a payment authority from the user return flow or a trusted system callback.',
      body: VerifyPaymentRequestDto,
      successDescription: 'Payment verified successfully',
      successResponse: PaymentResponseDto,
      errors: [
        HttpStatus.BAD_REQUEST,
        HttpStatus.NOT_FOUND,
        HttpStatus.CONFLICT,
      ],
    }),
  );

export const ApiGetPaymentHistoryDocs = () =>
  applyDecorators(
    BearerAuth(),
    PaginationDocs(),
    ApiDoc({
      summary: 'Get Payment History',
      description:
        'Returns paginated payment history for the authenticated user.',
      successDescription: 'Payment history retrieved successfully',
      successResponse: PaymentResponseDto,
      isPaginated: true,
      errors: [HttpStatus.UNAUTHORIZED],
    }),
  );

export const ApiGetAllPaymentsDocs = () =>
  applyDecorators(
    BearerAuth(),
    PaginationDocs(),
    ApiDoc({
      summary: 'Get All Payments',
      description: 'Returns paginated payments for admin management.',
      successDescription: 'Payments retrieved successfully',
      successResponse: PaymentResponseDto,
      isPaginated: true,
      errors: [HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN],
    }),
  );
