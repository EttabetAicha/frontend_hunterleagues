import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from './loginService.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private loginService: LoginService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.loginService.getToken();
    // console.log('Token:', token);
    if (token && !req.url.includes('/login')) {
      const authReq = req.clone({
        headers: req.headers
          .set('Authorization', `Bearer ${token}`)
          .set('Content-Type', 'application/json')
      });
      return next.handle(authReq);
    }
    return next.handle(req);
  }
}
