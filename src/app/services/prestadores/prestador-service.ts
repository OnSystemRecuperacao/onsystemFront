import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Prestador } from 'src/app/model/vo/prestador';
import Utils from 'src/app/utils/utils';

@Injectable({
    providedIn: 'root',
})
export class PrestadorService {

    constructor(private httpClient: HttpClient) { }

    BASE_URL: string = Utils.makeURLRequest("/prestadores");

    data = {}

    // Headers
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    
    read(): Observable<Prestador[]> {
        return this.httpClient.get<Prestador[]>(this.BASE_URL).pipe(retry(2), catchError(this.handleError))
    }

    readByID(id: number): Observable<Prestador> {
      const url = `${this.BASE_URL}/${id}`;
      return this.httpClient.get<Prestador>(url, this.httpOptions).pipe(catchError(this.handleError));
    }

    create(prestador: Prestador): Observable<Prestador> {
      this.data = this.parseData(prestador);      
      return this.httpClient.post<any>(this.BASE_URL, this.data, this.httpOptions).pipe(catchError(this.handleError));
    }

    update(prestador: Prestador): Observable<Prestador> {
      return this.httpClient.put<Prestador>(this.BASE_URL, prestador, this.httpOptions).pipe(catchError(this.handleError));
    }

    delete(id: number): Observable<{}> {
      const url = `${this.BASE_URL}/${id}`; 
      console.log(url)
      return this.httpClient.delete(url, this.httpOptions).pipe(catchError(this.handleError));
    }

    private parseData(prestador: Prestador): any{
       let data = prestador;      
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