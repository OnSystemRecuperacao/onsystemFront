import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';

import { Observable, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';
import { CommomService } from '../services/commons/common.service';
import { NavigationEnum } from '../model/enums/navigation.enum';

export class NotAuthenticatedError{}

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService, private commomService: CommomService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.url.includes('/oauth/token') && this.auth.isAccessTokenInvalido()) {
      localStorage.setItem("access_token", ""); 
      this.commomService.navigateByUrl(NavigationEnum.NAO_AUTORIZADO);
    }
    return next.handle(req);
  }
}