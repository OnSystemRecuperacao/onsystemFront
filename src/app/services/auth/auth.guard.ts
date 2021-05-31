import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { NavigationEnum } from 'src/app/model/enums/navigation.enum';
import { CommomService } from '../commons/common.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private commomService: CommomService,     
   ){}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let possuiPermissao = false;  
    if(route.data.roles){
      if(this.veriricaLogin()){
        possuiPermissao = this.verificaPermissao(route.data.roles);
        if(!possuiPermissao){
          this.commomService.navigate(NavigationEnum.DASHBOARD);
        }
      }else{
        this.commomService.navigate(NavigationEnum.LOGIN);
      }      
    }
    return possuiPermissao;
  }

  private veriricaLogin(){
    return this.authService.jwtIsLoad();
  }

  private verificaPermissao(roles: []){
    return this.authService.possuiPermissaoAcesso(roles);
  }
  
}
