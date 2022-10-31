import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { HistoricoFirebase } from "src/app/model/vo/historico-firebase";
import Utils from "src/app/utils/utils";

@Injectable({
    providedIn: 'root',
})
export class RelatorioService{
    constructor(private httpClient: HttpClient) { }

    BASE_URL: string = Utils.makeURLRequest("/historico");

    data = {}

    // Headers
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    read(id: string): Observable<HistoricoFirebase[]> {
        let url = this.BASE_URL +  '/' + id;
        return this.httpClient.get<HistoricoFirebase[]>(url).pipe(retry(2), catchError(this.handleError))
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