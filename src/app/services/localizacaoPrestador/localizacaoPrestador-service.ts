import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Prestador } from 'src/app/model/vo/prestador';
import Utils from 'src/app/utils/utils';
import { LocalizacaoPrestador } from 'src/app/model/vo/localizacao-prestador';
import { Localizacao } from 'src/app/model/vo/localizacao';

@Injectable({
    providedIn: 'root',
})
export class LocalizacaoPrestadorService {

    constructor(private httpClient: HttpClient) { }

    BASE_URL: string = Utils.makeURLRequest("/localizacaoPrestador");

    data = {}

    loc: Localizacao = {};

    // Headers
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    buscarPrestadorLocalizacao(idOcorrencia: number ): Promise<any> {
        const url = `${this.BASE_URL}` + '?idOcorrencia=' + idOcorrencia;   
        return this.httpClient.get<any>(url, this.httpOptions).toPromise();
      
    }
   
    private parseData(prestador: Prestador): any{
       let data = prestador;
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


 
 
 