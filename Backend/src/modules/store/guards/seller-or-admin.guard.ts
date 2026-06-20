import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class SellerOrAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (request.user.role !== 'SELLER' && request.user.role !== 'ADMIN') {
      throw new UnauthorizedException('ไม่มีสิทธิ์เข้าถึงข้อมูลนี้');
    }

    return true;
  }
}
