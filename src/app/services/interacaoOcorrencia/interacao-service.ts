import { HttpClient, HttpHeaders } from "@angular/common/http";
import { InteracaoOcorrencia } from "src/app/model/vo/interacao-ocorrencia";
import Utils from "src/app/utils/utils";
import { Injectable } from '@angular/core';

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

}