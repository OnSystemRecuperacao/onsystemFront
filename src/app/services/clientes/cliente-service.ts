import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import Utils from 'src/app/utils/utils';
import { Cliente } from 'src/app/model/vo/cliente';

@Injectable({
    providedIn: 'root',
})
export class ClienteService {

    constructor(private httpClient: HttpClient) { }

    BASE_URL: string = Utils.makeURLRequest("/clientes");

    data = {}

    // Headers
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    
    read(): Observable<Cliente[]> {
        return this.httpClient.get<Cliente[]>(this.BASE_URL).pipe(retry(2), catchError(this.handleError))
    }

    readByID(id: number): Observable<Cliente> {
      const url = `${this.BASE_URL}/${id}`;
      return this.httpClient.get<Cliente>(url, this.httpOptions).pipe(catchError(this.handleError));
    }

    create(cliente: Cliente): Observable<Cliente> {
      this.data = this.parseData(cliente);      
      return this.httpClient.post<any>(this.BASE_URL, this.data, this.httpOptions).pipe(catchError(this.handleError));
    }

    update(cliente: Cliente): Observable<Cliente> {
      const url = `${this.BASE_URL}/${cliente.id}`;
      this.data = this.parseData(cliente); 
      return this.httpClient.put<Cliente>(url, this.data, this.httpOptions).pipe(catchError(this.handleError));
    }

    delete(id: number): Observable<{}> {
      const url = `${this.BASE_URL}/${id}`;       
      return this.httpClient.delete(url, this.httpOptions).pipe(catchError(this.handleError));
    }

    private parseData(cliente: Cliente): any{
       let data = cliente;
       console.log(JSON.parse(JSON.stringify(data)));
       return data;
    }

    // Manipulação de erros
    handleError(error: any) {
      let errorMessage = '';
      console.log("handleError", error)
      if (error.error instanceof ErrorEvent) {      
          errorMessage =  error.error.mensagem      
      } else {  
          errorMessage =  error.error.mensagem       
      }    
      return throwError(errorMessage);
    }


}