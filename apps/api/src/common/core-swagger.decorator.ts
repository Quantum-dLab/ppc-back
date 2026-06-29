import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import {
  AuthTokenResponseDto,
  MessageResponseDto,
} from '../application/dto/auth/auth-response.dto';
import { LoginDto } from '../application/dto/auth/login.dto';
import { RefreshTokenDto } from '../application/dto/auth/refresh-token.dto';
import { RegisterDto } from '../application/dto/auth/register.dto';
import { CartItemResponseDto } from '../application/dto/cart-item/cart-item-response.dto';
import { CreateCartItemDto } from '../application/dto/cart-item/create-cart-item.dto';
import { UpdateCartItemDto } from '../application/dto/cart-item/update-cart-item.dto';
import { CartResponseDto } from '../application/dto/cart/cart-response.dto';
import { CreateProductDto } from '../application/dto/product/create-product.dto';
import { ProductResponseDto } from '../application/dto/product/product-response.dto';
import { UpdateProductDto } from '../application/dto/product/update-product.dto';
import { UpdateUserDto } from '../application/dto/user/update-user.dto';
import { UserResponseDto } from '../application/dto/user/user-response.dto';
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

const UidParam = (resource: string) =>
  ApiParam({
    name: 'uid',
    description: `${resource} public unique identifier`,
    example: '123e4567-e89b-12d3-a456-426614174000',
  });

export const ApiRegisterDocs = () =>
  applyDecorators(
    ApiDoc({
      summary: 'Register User',
      description: 'Creates a user account and returns authentication tokens.',
      body: RegisterDto,
      successStatus: HttpStatus.CREATED,
      successDescription: 'User registered successfully',
      successResponse: AuthTokenResponseDto,
      errors: [
        HttpStatus.BAD_REQUEST,
        {
          status: HttpStatus.CONFLICT,
          description: 'User with this email already exists',
        },
      ],
    }),
  );

export const ApiLoginDocs = () =>
  applyDecorators(
    ApiDoc({
      summary: 'Login User',
      description: 'Authenticates a user with email and password.',
      body: LoginDto,
      successDescription: 'Login successful',
      successResponse: AuthTokenResponseDto,
      errors: [
        HttpStatus.BAD_REQUEST,
        {
          status: HttpStatus.UNAUTHORIZED,
          description: 'Invalid email or password',
        },
      ],
    }),
  );

export const ApiRefreshTokenDocs = () =>
  applyDecorators(
    ApiDoc({
      summary: 'Refresh Token',
      description: 'Issues a new access token and refresh token pair.',
      body: RefreshTokenDto,
      successDescription: 'Token refreshed successfully',
      successResponse: AuthTokenResponseDto,
      errors: [
        HttpStatus.BAD_REQUEST,
        {
          status: HttpStatus.UNAUTHORIZED,
          description: 'Invalid or expired refresh token',
        },
      ],
    }),
  );

export const ApiLogoutDocs = () =>
  applyDecorators(
    BearerAuth(),
    ApiDoc({
      summary: 'Logout User',
      description: 'Revokes the stored refresh token for the current session.',
      successDescription: 'Logout successful',
      successResponse: MessageResponseDto,
      errors: [HttpStatus.UNAUTHORIZED],
    }),
  );

export const ApiGoogleLoginDocs = () =>
  applyDecorators(
    ApiDoc({
      summary: 'Google OAuth Login',
      description: 'Redirects the user to the Google OAuth consent screen.',
      successDescription: 'Redirected to Google consent screen',
      errors: [HttpStatus.BAD_REQUEST],
    }),
  );

export const ApiGoogleCallbackDocs = () =>
  applyDecorators(
    ApiDoc({
      summary: 'Google OAuth Callback',
      description: 'Handles Google OAuth callback and returns tokens.',
      successDescription: 'Google authentication successful',
      successResponse: AuthTokenResponseDto,
      errors: [HttpStatus.BAD_REQUEST, HttpStatus.UNAUTHORIZED],
    }),
  );

export const ApiGetMeDocs = () =>
  applyDecorators(
    BearerAuth(),
    ApiDoc({
      summary: 'Get Current User',
      description: 'Returns the authenticated user profile.',
      successDescription: 'User profile retrieved successfully',
      successResponse: UserResponseDto,
      errors: [HttpStatus.UNAUTHORIZED],
    }),
  );

export const ApiListUsersDocs = () =>
  applyDecorators(
    BearerAuth(),
    ApiDoc({
      summary: 'Get Users',
      description: 'Returns all users for admin management.',
      successDescription: 'Users retrieved successfully',
      successResponse: UserResponseDto,
      isArray: true,
      errors: [HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN],
    }),
  );

export const ApiGetUserDocs = () =>
  applyDecorators(
    BearerAuth(),
    UidParam('User'),
    ApiDoc({
      summary: 'Get User',
      description: 'Returns a user by public unique identifier.',
      successDescription: 'User retrieved successfully',
      successResponse: UserResponseDto,
      errors: [
        HttpStatus.UNAUTHORIZED,
        HttpStatus.FORBIDDEN,
        HttpStatus.NOT_FOUND,
      ],
    }),
  );

export const ApiUpdateUserDocs = () =>
  applyDecorators(
    BearerAuth(),
    UidParam('User'),
    ApiDoc({
      summary: 'Update User',
      description: 'Updates admin-managed user fields.',
      body: UpdateUserDto,
      successDescription: 'User updated successfully',
      successResponse: UserResponseDto,
      errors: [
        HttpStatus.BAD_REQUEST,
        HttpStatus.UNAUTHORIZED,
        HttpStatus.FORBIDDEN,
        HttpStatus.NOT_FOUND,
      ],
    }),
  );

export const ApiCreateProductDocs = () =>
  applyDecorators(
    ApiDoc({
      summary: 'Create Product',
      description: 'Creates a product with an optional image upload.',
      body: CreateProductDto,
      multipart: true,
      successStatus: HttpStatus.CREATED,
      successDescription: 'Product created successfully',
      successResponse: ProductResponseDto,
      errors: [
        HttpStatus.BAD_REQUEST,
        HttpStatus.UNAUTHORIZED,
        HttpStatus.FORBIDDEN,
        {
          status: HttpStatus.CONFLICT,
          description: 'Product with this slug already exists',
        },
      ],
    }),
  );

export const ApiListProductsDocs = () =>
  applyDecorators(
    PaginationDocs(),
    ApiDoc({
      summary: 'Get Products',
      description: 'Returns paginated products.',
      successDescription: 'Products retrieved successfully',
      successResponse: ProductResponseDto,
      isPaginated: true,
      errors: [HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN],
    }),
  );

export const ApiGetProductBySlugDocs = () =>
  applyDecorators(
    ApiParam({
      name: 'slug',
      description: 'Product slug',
      example: 'iphone-15-pro',
    }),
    ApiDoc({
      summary: 'Get Product By Slug',
      description: 'Returns a product by slug.',
      successDescription: 'Product retrieved successfully',
      successResponse: ProductResponseDto,
      errors: [HttpStatus.UNAUTHORIZED, HttpStatus.NOT_FOUND],
    }),
  );

export const ApiGetProductDocs = () =>
  applyDecorators(
    UidParam('Product'),
    ApiDoc({
      summary: 'Get Product',
      description: 'Returns a product by public unique identifier.',
      successDescription: 'Product retrieved successfully',
      successResponse: ProductResponseDto,
      errors: [
        HttpStatus.UNAUTHORIZED,
        HttpStatus.FORBIDDEN,
        HttpStatus.NOT_FOUND,
      ],
    }),
  );

export const ApiUpdateProductDocs = () =>
  applyDecorators(
    UidParam('Product'),
    ApiDoc({
      summary: 'Update Product',
      description: 'Updates product fields. Only provided fields are changed.',
      body: UpdateProductDto,
      multipart: true,
      successDescription: 'Product updated successfully',
      successResponse: ProductResponseDto,
      errors: [
        HttpStatus.BAD_REQUEST,
        HttpStatus.UNAUTHORIZED,
        HttpStatus.FORBIDDEN,
        HttpStatus.NOT_FOUND,
        { status: HttpStatus.CONFLICT, description: 'Slug already exists' },
      ],
    }),
  );

export const ApiCreateCartDocs = () =>
  applyDecorators(
    BearerAuth(),
    ApiDoc({
      summary: 'Create Cart',
      description: 'Creates a cart for the authenticated user.',
      successStatus: HttpStatus.CREATED,
      successDescription: 'Cart created successfully',
      successResponse: CartResponseDto,
      errors: [
        HttpStatus.BAD_REQUEST,
        HttpStatus.UNAUTHORIZED,
        HttpStatus.FORBIDDEN,
        {
          status: HttpStatus.CONFLICT,
          description: 'Cart already exists for this user',
        },
      ],
    }),
  );

export const ApiListCartsDocs = () =>
  applyDecorators(
    PaginationDocs(),
    ApiDoc({
      summary: 'Get Carts',
      description: 'Returns paginated carts.',
      successDescription: 'Carts retrieved successfully',
      successResponse: CartResponseDto,
      isPaginated: true,
      errors: [HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN],
    }),
  );

export const ApiGetCartDocs = () =>
  applyDecorators(
    UidParam('Cart'),
    ApiDoc({
      summary: 'Get Cart',
      description: 'Returns a cart by public unique identifier.',
      successDescription: 'Cart retrieved successfully',
      successResponse: CartResponseDto,
      errors: [
        HttpStatus.UNAUTHORIZED,
        HttpStatus.FORBIDDEN,
        HttpStatus.NOT_FOUND,
      ],
    }),
  );

export const ApiCreateCartItemDocs = () =>
  applyDecorators(
    ApiDoc({
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
    }),
  );

export const ApiListCartItemsDocs = () =>
  applyDecorators(
    ApiDoc({
      summary: 'Get Cart Items',
      description: 'Returns all cart items.',
      successDescription: 'Cart items retrieved successfully',
      successResponse: CartItemResponseDto,
      isArray: true,
      errors: [HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN],
    }),
  );

export const ApiGetCartItemDocs = () =>
  applyDecorators(
    UidParam('Cart item'),
    ApiDoc({
      summary: 'Get Cart Item',
      description: 'Returns a cart item by public unique identifier.',
      successDescription: 'Cart item retrieved successfully',
      successResponse: CartItemResponseDto,
      errors: [
        HttpStatus.UNAUTHORIZED,
        HttpStatus.FORBIDDEN,
        HttpStatus.NOT_FOUND,
      ],
    }),
  );

export const ApiUpdateCartItemDocs = () =>
  applyDecorators(
    UidParam('Cart item'),
    ApiDoc({
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
    }),
  );
