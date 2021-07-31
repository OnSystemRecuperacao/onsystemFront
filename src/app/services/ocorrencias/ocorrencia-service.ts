import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { retry,  catchError } from "rxjs/operators";
import { Ocorrencia } from "src/app/model/vo/ocorrencia";
import Utils from "src/app/utils/utils";

@Injectable({
    providedIn: 'root',
})

export class OcorrenciaService{

    data = {}

    constructor(private httpClient: HttpClient) { }

    BASE_URL: string = Utils.makeURLRequest("/ocorrencias");

    // Headers
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    
    read(): Promise<any> {
        let dados = this.httpClient.get<any>(this.BASE_URL, this.httpOptions).toPromise();
        console.log(dados);
        //return this.httpClient.get<any>(this.BASE_URL).pipe(retry(2), catchError(this.handleError))
        return this.httpClient.get<any>(this.BASE_URL, this.httpOptions).toPromise();
    }

    create(ocorrencia: Ocorrencia): Observable<Ocorrencia> {
        this.data = this.parseData(ocorrencia);      
        return this.httpClient.post<any>(this.BASE_URL, this.data, this.httpOptions).pipe(catchError(this.handleError));
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

      private parseData(ocorrencia: Ocorrencia): any{
        let data = ocorrencia;
       console.log(JSON.parse(JSON.stringify(data)));
       return data;
     }
}