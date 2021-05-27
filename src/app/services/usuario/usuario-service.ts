import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Usuario } from "src/app/model/vo/usuario";
import Utils from "src/app/utils/utils";
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from "rxjs/operators";

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
    
    read(): Observable<Usuario[]> {
        return this.httpClient.get<Usuario[]>(this.BASE_URL).pipe(retry(2), catchError(this.handleError))
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