import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserEntity, UserRole } from '../../domain/entities/user.entity';
import { PermissionDeniedException } from '@libs/shared/exceptions';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const { user } = context.switchToHttp().getRequest<{ user: UserEntity }>();
    if (!user) throw PermissionDeniedException();

    // Admins implicitly have access to every role-restricted endpoint.
    if (user.role === UserRole.ADMIN) return true;

    if (!requiredRoles.includes(user.role)) throw PermissionDeniedException();
    return true;
  }
}
