# NestJS MVP Backend — Clean Architecture + DDD

## Tech Stack
- **NestJS** + TypeScript
- **PostgreSQL** + **Prisma** ORM
- **JWT** auth (no Passport — plain `CanActivate` guard)
- **class-validator** / **class-transformer** for DTO validation
- **bcryptjs** for password hashing

## Directory Structure
```
ppc-back/
├── prisma/schema.prisma
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── shared/
│   │   ├── domain/
│   │   │   ├── entity.base.ts          # Abstract Entity<T> with id, equals()
│   │   │   ├── value-object.base.ts    # Abstract ValueObject<T>
│   │   │   └── unique-id.vo.ts         # UniqueId VO (uuid)
│   │   ├── application/
│   │   │   └── use-case.base.ts        # Abstract UseCase<I, O>
│   │   └── infrastructure/
│   │       ├── prisma/
│   │       │   ├── prisma.service.ts   # PrismaService extends PrismaClient
│   │       │   └── prisma.module.ts
│   │       └── guards/
│   │           └── jwt-auth.guard.ts   # CanActivate — reads Bearer token, verifies JWT
│   └── modules/
│       ├── auth/
│       │   ├── domain/
│       │   │   ├── entities/user.entity.ts
│       │   │   ├── value-objects/email.vo.ts
│       │   │   ├── value-objects/password.vo.ts
│       │   │   └── repositories/user.repository.ts
│       │   ├── application/
│       │   │   ├── use-cases/register.use-case.ts
│       │   │   ├── use-cases/login.use-case.ts
│       │   │   ├── dto/register.dto.ts
│       │   │   ├── dto/login.dto.ts
│       │   │   └── ports/jwt.port.ts
│       │   ├── infrastructure/
│       │   │   ├── prisma/prisma-user.repository.ts
│       │   │   ├── jwt/jwt.service.ts
│       │   │   └── auth.module.ts
│       │   └── presentation/
│       │       ├── auth.controller.ts
│       │       └── auth.module.ts
│       ├── product/
│       │   ├── domain/
│       │   │   ├── entities/product.entity.ts
│       │   │   ├── value-objects/money.vo.ts
│       │   │   └── repositories/product.repository.ts
│       │   ├── application/
│       │   │   ├── use-cases/list-products.use-case.ts
│       │   │   ├── use-cases/get-product.use-case.ts
│       │   │   └── dto/product.dto.ts
│       │   ├── infrastructure/
│       │   │   ├── prisma/prisma-product.repository.ts
│       │   │   └── product.module.ts
│       │   └── presentation/
│       │       ├── product.controller.ts
│       │       └── product.module.ts
│       ├── cart/
│       │   ├── domain/
│       │   │   ├── entities/cart.entity.ts
│       │   │   ├── value-objects/cart-item.vo.ts
│       │   │   └── repositories/cart.repository.ts
│       │   ├── application/
│       │   │   ├── use-cases/get-cart.use-case.ts
│       │   │   ├── use-cases/add-item.use-case.ts
│       │   │   ├── use-cases/remove-item.use-case.ts
│       │   │   └── dto/cart.dto.ts
│       │   ├── infrastructure/
│       │   │   ├── prisma/prisma-cart.repository.ts
│       │   │   └── cart.module.ts
│       │   └── presentation/
│       │       ├── cart.controller.ts
│       │       └── cart.module.ts
│       └── payment/
│           ├── domain/
│           │   ├── entities/payment.entity.ts
│           │   ├── value-objects/payment-status.vo.ts
│           │   └── repositories/payment.repository.ts
│           ├── application/
│           │   ├── use-cases/create-payment.use-case.ts
│           │   └── dto/payment.dto.ts
│           ├── infrastructure/
│           │   ├── prisma/prisma-payment.repository.ts
│           │   └── payment.module.ts
│           └── presentation/
│               ├── payment.controller.ts
│               └── payment.module.ts
├── .env
├── .env.example
├── tsconfig.json
├── nest-cli.json
└── package.json
```

## Prisma Schema
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  cart      Cart?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Product {
  id          String     @id @default(uuid())
  name        String
  description String
  price       Decimal    @db.Decimal(10, 2)
  stock       Int        @default(0)
  cartItems   CartItem[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

model Cart {
  id        String     @id @default(uuid())
  userId    String     @unique
  user      User       @relation(fields: [userId], references: [id])
  items     CartItem[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

model CartItem {
  id        String  @id @default(uuid())
  cartId    String
  cart      Cart    @relation(fields: [cartId], references: [id], onDelete: Cascade)
  productId String
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int     @default(1)

  @@unique([cartId, productId])
}

model Payment {
  id        String   @id @default(uuid())
  cartId    String
  amount    Decimal  @db.Decimal(10, 2)
  status    String   @default("COMPLETED")
  createdAt DateTime @default(now())
}
```

## API Endpoints
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Register, returns `{ accessToken }` |
| POST | `/api/auth/login` | No | Login, returns `{ accessToken }` |
| GET | `/api/products` | No | List all products |
| GET | `/api/products/:id` | No | Get product by ID |
| GET | `/api/cart` | Yes | Get current user's cart |
| POST | `/api/cart/items` | Yes | Add item `{ productId, quantity }` |
| DELETE | `/api/cart/items/:productId` | Yes | Remove item from cart |
| POST | `/api/payments` | Yes | Mock pay cart → Payment record |

## NPM Packages
**Runtime:** `@nestjs/config`, `@prisma/client`, `bcryptjs`, `jsonwebtoken`, `class-validator`, `class-transformer`
**Dev:** `prisma`, `@types/bcryptjs`, `@types/jsonwebtoken`

## Implementation Phases

### Phase 1: Project Bootstrap
1. Scaffold NestJS project with CLI
2. Install all dependencies
3. Init Prisma, write schema, run migration
4. Create shared base classes (Entity, ValueObject, UniqueId, UseCase)
5. Create PrismaService, configure `.env`

### Phase 2: Auth Module
1. Domain: User entity, Email/Password VOs, UserRepository interface
2. Infrastructure: PrismaUserRepository, JwtService
3. Application: RegisterUseCase, LoginUseCase, DTOs
4. Presentation: AuthController, JwtAuthGuard
5. Seed a test user via migration seed script

### Phase 3: Product Module
1. Domain: Product entity, Money VO, ProductRepository interface
2. Infrastructure: PrismaProductRepository
3. Application: ListProductsUseCase, GetProductUseCase
4. Presentation: ProductController (public endpoints)
5. Seed 3 sample products

### Phase 4: Cart Module
1. Domain: Cart entity, CartItem VO, CartRepository interface
2. Infrastructure: PrismaCartRepository (with product relation)
3. Application: GetCartUseCase, AddItemUseCase (upsert), RemoveItemUseCase
4. Presentation: CartController (all require auth)

### Phase 5: Payment Module
1. Domain: Payment entity, PaymentStatus VO, PaymentRepository interface
2. Infrastructure: PrismaPaymentRepository
3. Application: CreatePaymentUseCase (calculates total from cart items × prices server-side)
4. Presentation: PaymentController

### Phase 6: Polish
1. Wire all modules into AppModule
2. Add global ValidationPipe with whitelist
3. Add `/api` prefix globally
4. Test end-to-end

## Verification
```bash
npm install
npx prisma migrate dev --name init
npm run start:dev

# Register → Login → List Products → Add to Cart → View Cart → Pay
# Verify 401 on protected routes without token
# Verify prisma studio shows all records
```

## Key Design Decisions
- **1 Cart per User** (1:1 relationship) — no multi-cart complexity for MVP
- **CartItem is a value object** inside Cart aggregate, not a standalone entity
- **Payment calculates total server-side** from cart items × product prices (never trusts client amount)
- **`@@unique([cartId, productId])`** prevents duplicate products in same cart
- **No Passport** — plain NestJS `CanActivate` guard for JWT verification
