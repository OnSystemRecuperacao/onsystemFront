import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Usuario } from "src/app/model/vo/usuario";
import Utils from "src/app/utils/utils";
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from "rxjs/operators";
import { Tenancy } from "src/app/model/vo/tenancy";
import { environment } from "src/environments/environment";
import { Login } from "src/app/model/vo/login";

@Injectable({
    providedIn: 'root',
})
export class UsuarioService{
  

     // Headers
     httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    
    constructor(private httpClient: HttpClient) { }

    BASE_URL: string = Utils.makeURLRequest("/usuarios");

    create(usuario: Usuario): Observable<Usuario> {  
       console.log(usuario)  
       return this.httpClient.post<Usuario>(this.BASE_URL, usuario, this.httpOptions).pipe(catchError(this.handleError));
    }
        
    read(idTenancy: number): Promise<any> {
        const url = `${this.BASE_URL}/${idTenancy}`;
        return this.httpClient.get<any>(url, this.httpOptions).toPromise();
    }

    readByID(idTenancy: number, idUsuario: number): Promise<any> {
        const url = `${this.BASE_URL}/${idTenancy}/${idUsuario}`;
        return this.httpClient.get<any>(url, this.httpOptions).toPromise();
    }

    updateUserStatus(usuario: Usuario): Promise<Usuario> {  
        console.log(usuario)
        const url = `${this.BASE_URL}/${usuario.id}`;  
        return this.httpClient.patch<Usuario>(url, usuario, this.httpOptions).toPromise();
     }

    delete(id: number): Observable<{}> {
        const url = `${this.BASE_URL}/${id}`; 
        console.log(url)
        return this.httpClient.delete(url, this.httpOptions).pipe(catchError(this.handleError));
      }

      esqueciSenha(dto: {}): Observable<any> {
        const url = `${environment.baseUrl}/senhaUsuario/esqueciSenha`; 
        return this.httpClient.post(url, dto, this.httpOptions).pipe(catchError(this.handleError));
      }

      validaSenhaAdm(login: any): Promise<any> {
        const url = `${this.BASE_URL}/validaSenha`;
        console.log(url)
        return this.httpClient.post(url, login,this.httpOptions).toPromise();
    }

    // Manipulação de erros
    handleError(error: HttpErrorResponse) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {      
            errorMessage =  error.error.message     
        } else {  
            errorMessage =  error.error       
        }    
        return throwError(errorMessage);
      }

}