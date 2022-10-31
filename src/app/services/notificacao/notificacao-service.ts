import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Prestador } from 'src/app/model/vo/prestador';
import Utils from 'src/app/utils/utils';
import { LocalizacaoPrestador } from 'src/app/model/vo/localizacao-prestador';
import { Localizacao } from 'src/app/model/vo/localizacao';
import { NotificacaoPrestadorOcorrencia } from 'src/app/model/vo/notificacao-prestador-ocorrencia';

@Injectable({
    providedIn: 'root',
})
export class NotificacaoService {

    constructor(private httpClient: HttpClient) {}

    BASE_URL: string = Utils.makeURLRequest("/localizacaoPrestador");
    
    data = {};

    // Headers
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    notificarPrestador(notificacao: NotificacaoPrestadorOcorrencia): Observable<any> {
        console.log(notificacao)
        this.data = this.parseData(notificacao);  
        console.log("DADOS NOTIFICAÇÃO - " + this.data);
        const url = `${this.BASE_URL}` + '/notificarPrestador';  
        return this.httpClient.post<any>(url, this.data, this.httpOptions).pipe(catchError(this.handleError));     
    }

    notificarPrestadorChat(notificacao: any): Observable<any> {
        console.log(notificacao)
        this.data = this.parseData(notificacao);  
        const url = `${this.BASE_URL}` + '/notificarPrestadorChat';  
        return this.httpClient.post<any>(url, this.data, this.httpOptions).pipe(catchError(this.handleError));     
    }
   
    private parseData(notificacao: NotificacaoPrestadorOcorrencia): any{
       let data = notificacao;
       console.log("DADOS NOTIFICAÇÃO - " + JSON.parse(JSON.stringify(data)));
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


 
 
 