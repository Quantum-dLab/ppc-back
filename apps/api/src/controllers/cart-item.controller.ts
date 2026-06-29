import {
  CreateCartItemUseCase,
  GetCartItemUseCase,
  ListCartItemUseCase,
  UpdateCartItemUseCase,
} from '../application/use-cases/cart-item';
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateCartItemDto } from '../application/dto/cart-item/create-cart-item.dto';
import { CartItemResponseDto } from '../application/dto/cart-item/cart-item-response.dto';
import { UpdateCartItemDto } from '../application/dto/cart-item/update-cart-item.dto';
import { UserPanel } from '../common/decorators/swagger.decorator';
import {
  ApiCreateCartItemDocs,
  ApiGetCartItemDocs,
  ApiListCartItemsDocs,
  ApiUpdateCartItemDocs,
} from '../common/core-swagger.decorator';

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
  @ApiCreateCartItemDocs()
  async create(@Body() dto: CreateCartItemDto): Promise<CartItemResponseDto> {
    return CartItemResponseDto.fromEntity(
      await this.createCartItem.execute(dto),
    );
  }

  @Get()
  @ApiListCartItemsDocs()
  async list(): Promise<CartItemResponseDto[]> {
    const items = await this.listCartItems.execute();
    return items.map((item) => CartItemResponseDto.fromEntity(item));
  }

  @Get(':uid')
  @ApiGetCartItemDocs()
  async get(@Param('uid') uid: string): Promise<CartItemResponseDto> {
    return CartItemResponseDto.fromEntity(await this.getCartItem.execute(uid));
  }

  @Patch(':uid')
  @ApiUpdateCartItemDocs()
  async update(
    @Param('uid') uid: string,
    @Body() dto: UpdateCartItemDto,
  ): Promise<CartItemResponseDto> {
    return CartItemResponseDto.fromEntity(
      await this.updateCartItem.execute(uid, dto),
    );
  }
}
