import {
  CreateCartItemUseCase,
  GetCartItemUseCase,
  ListCartItemUseCase,
  UpdateCartItemUseCase,
} from '../application/use-cases/cart-item';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { CreateCartItemDto } from '../application/dto/cart-item/create-cart-item.dto';
import { CartItemResponseDto } from '../application/dto/cart-item/cart-item-response.dto';
import { UpdateCartItemDto } from '../application/dto/cart-item/update-cart-item.dto';
import { ApiDoc } from '../common/decorators';
import { UserPanel } from '../common/decorators/swagger.decorator';

@UserPanel('Cart Items')
@Controller('cart-items')
export class CartItemsController {
  constructor(
    private readonly createCartItem: CreateCartItemUseCase,
    private readonly getCartItem: GetCartItemUseCase,
    private readonly listCartItems: ListCartItemUseCase,
    private readonly updateCartItem: UpdateCartItemUseCase,
  ) {}

  @Post()
  @ApiDoc({
    summary: 'Create Cart Item',
    description: 'Adds a product to a cart.',
    body: CreateCartItemDto,
    successStatus: HttpStatus.CREATED,
    successDescription: 'Cart item created successfully',
    successResponse: CartItemResponseDto,
    errors: [
      HttpStatus.BAD_REQUEST,
      HttpStatus.UNAUTHORIZED,
      HttpStatus.FORBIDDEN,
      HttpStatus.NOT_FOUND,
    ],
  })
  async create(@Body() dto: CreateCartItemDto): Promise<CartItemResponseDto> {
    return CartItemResponseDto.fromEntity(
      await this.createCartItem.execute(dto),
    );
  }

  @Get()
  @ApiDoc({
    summary: 'Get Cart Items',
    description: 'Returns all cart items.',
    successDescription: 'Cart items retrieved successfully',
    successResponse: CartItemResponseDto,
    isArray: true,
    errors: [HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN],
  })
  async list(): Promise<CartItemResponseDto[]> {
    const items = await this.listCartItems.execute();
    return items.map((item) => CartItemResponseDto.fromEntity(item));
  }

  @Get(':uid')
  @ApiParam({
    name: 'uid',
    description: 'Cart item public unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174020',
  })
  @ApiDoc({
    summary: 'Get Cart Item',
    description: 'Returns a cart item by public unique identifier.',
    successDescription: 'Cart item retrieved successfully',
    successResponse: CartItemResponseDto,
    errors: [
      HttpStatus.UNAUTHORIZED,
      HttpStatus.FORBIDDEN,
      HttpStatus.NOT_FOUND,
    ],
  })
  async get(@Param('uid') uid: string): Promise<CartItemResponseDto> {
    return CartItemResponseDto.fromEntity(await this.getCartItem.execute(uid));
  }

  @Patch(':uid')
  @ApiParam({
    name: 'uid',
    description: 'Cart item public unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174020',
  })
  @ApiDoc({
    summary: 'Update Cart Item',
    description: 'Updates cart item quantity.',
    body: UpdateCartItemDto,
    successDescription: 'Cart item updated successfully',
    successResponse: CartItemResponseDto,
    errors: [
      HttpStatus.BAD_REQUEST,
      HttpStatus.UNAUTHORIZED,
      HttpStatus.FORBIDDEN,
      HttpStatus.NOT_FOUND,
    ],
  })
  async update(
    @Param('uid') uid: string,
    @Body() dto: UpdateCartItemDto,
  ): Promise<CartItemResponseDto> {
    return CartItemResponseDto.fromEntity(
      await this.updateCartItem.execute(uid, dto),
    );
  }
}
