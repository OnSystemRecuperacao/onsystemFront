import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Usuario } from "src/app/model/vo/usuario";
import Utils from "src/app/utils/utils";
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from "rxjs/operators";
import { Tenancy } from "src/app/model/vo/tenancy";

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

    create(usuario: Usuario): Promise<Usuario> {  
       console.log(usuario)  
       return this.httpClient.post<Usuario>(this.BASE_URL, usuario, this.httpOptions).toPromise();
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

    // Manipulação de erros
    handleError(error: HttpErrorResponse) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {      
            errorMessage =  error.error.message      
        } else {  
            errorMessage =  error.message       
        }    
        return throwError(errorMessage);
      }

}