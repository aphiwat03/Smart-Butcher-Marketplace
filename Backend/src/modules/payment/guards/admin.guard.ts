import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (request.user.role !== 'ADMIN') {
      throw new UnauthorizedException(
        'สิทธิ์การเข้าถึงถูกปฏิเสธ: เฉพาะผู้ดูแลระบบเท่านั้น',
      );
    }

    return true;
  }
}
