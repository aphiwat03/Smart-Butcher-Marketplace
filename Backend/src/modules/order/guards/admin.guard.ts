import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      throw new UnauthorizedException('กรุณาเข้าสู่ระบบก่อน');
    }

    if (!request.user.role) {
      throw new UnauthorizedException('ไม่สามารถตรวจสอบบทบาท');
    }

    // Check if user is admin
    if (request.user.role !== 'ADMIN') {
      throw new ForbiddenException('เฉพาะผู้ดูแลระบบเท่านั้น');
    }

    return true;
  }
}
