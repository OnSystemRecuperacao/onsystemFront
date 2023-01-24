import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import Utils from 'src/app/utils/utils';
import { Login } from 'src/app/model/vo/login';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
    providedIn: 'root',
})
export class AuthService {

    BASE_URL: string = Utils.makeURLRequest("/oauth/token");

    // Headers
    httpOptions = {
        headers: new HttpHeaders(
          { 
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': 'Basic b25zeXN0ZW0tY2xpZW50Om9uc3lzdGVtQHJlY3VwZXJhY29lcw=='        
          }          
        )
    }

    jwtPayload: any;

    constructor(
        private httpClient: HttpClient,
        private jwtHelper: JwtHelperService       
    ){
        this.loadToken();
     }

     isAccessTokenInvalido(){
         const token = localStorage.getItem("access_token");
         return !token || this.jwtHelper.isTokenExpired(token);
     }

     obterNovoAccessToken(): Promise<void> {
        const body = 'grant_type=refresh_token';        
       return this.httpClient.post<any>(this.BASE_URL, body, this.httpOptions).toPromise()
       .then(response =>{
            this.decodeToken(response['access_token'])    
            return Promise.resolve();
       }).catch( response =>{
            return Promise.resolve();
       });        
    }


    login(login: Login): Promise<void>{
        const data = `username=${login.email}&password=${login.senha}&grant_type=password`;
        return this.httpClient.post<any>(this.BASE_URL, data, this.httpOptions).toPromise()
        .then(response => {
          this.decodeToken(response['access_token'])
          
        })
        .catch(response => {
          if(response.status === 400){
              if(response["error"].error === "invalid_grant"){
                  return Promise.reject("Usuário ou senha Inválidos !!");
              }
          }
          if(response.status === 0){
              return Promise.reject("Erro de comunicação com o servidor!!");            
          }
          return Promise.reject(response)
        });
    }

    jwtIsLoad(){
        return localStorage.getItem("access_token") != null;
    }

    getUsuarioLogado(): any{
        let token = localStorage.getItem("access_token");
        let payload = {};
        if(token){
            this.decodeToken(token);
            payload = this.jwtPayload;
        }
        return payload;
    }

    possuiPermissaoAcesso(roles: []){
        for(const role of roles){
            if(this.verificaPermissao(role)){
                return true;
            }
        }
        return false;
    }

    private verificaPermissao(role: string){
        return this.jwtPayload && this.jwtPayload["tipo_tenancy"].descricao == role;
    }

    private decodeToken(token : string){
        this.jwtPayload = this.jwtHelper.decodeToken(token);
        localStorage.setItem("access_token", token);  
        localStorage.setItem("id_usuario", this.jwtPayload["id_usuario"])
    }

   
    private loadToken(){
        let token = localStorage.getItem("access_token");
        if(token){
            this.decodeToken(token);
        }
    }

}