import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common'
import { Request } from 'express'
import { map, Observable } from 'rxjs'

@Injectable()
export class OnlyPrivateInterceptor implements NestInterceptor {
  // 실제 유저인지 판별하는 인터셉터
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest()
    const user = request.user
    if (user) return next.handle().pipe(map((data) => data))
    else throw new UnauthorizedException('인증에 문제가 있습니다.')
  }
}
