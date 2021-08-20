import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';

@Injectable()
export class JwtAuthenticationInterceptor implements HttpInterceptor {
  constructor(private service: UserService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const currentUser = this.service.getCurrentUser();

    if (currentUser !== null) {
      const jwtAuthenticationRequest = request.clone({
        headers: request.headers.set(
          'Authorization',
          'Bearer ' + currentUser.jwt
        ),
      });

      return next.handle(jwtAuthenticationRequest);
    }

    return next.handle(request);
  }
}

export const jwtAuthenticationInterceptor = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: JwtAuthenticationInterceptor,
    multi: true,
  },
];
