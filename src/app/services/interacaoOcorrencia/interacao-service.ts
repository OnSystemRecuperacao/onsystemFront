import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { InteracaoOcorrencia } from "src/app/model/vo/interacao-ocorrencia";
import Utils from "src/app/utils/utils";
import { Injectable } from '@angular/core';
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: 'root',
})
export class InteracaoService{

    data = {}

    constructor(private httpClient: HttpClient) { }

    BASE_URL: string = Utils.makeURLRequest("/interacaoOcorrencia");

    // Headers
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    
  readByOcorrencia(idOcorrencia: number): Promise <any> {
    const url = `${this.BASE_URL}/${idOcorrencia}`;
    return this.httpClient.get<any>(url, this.httpOptions).toPromise();
  }

  create(interacao: InteracaoOcorrencia): Observable<InteracaoOcorrencia> {
    this.data = this.parseData(interacao);      
    return this.httpClient.post<any>(this.BASE_URL, this.data, this.httpOptions).pipe(catchError(this.handleError));
  }

  private parseData(interacao: InteracaoOcorrencia): any{
    let data = interacao;
   console.log(JSON.parse(JSON.stringify(data)));
   return data;
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