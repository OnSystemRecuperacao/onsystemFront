import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Ocorrencia } from 'src/app/model/vo/ocorrencia';
import { OcorrenciaService } from 'src/app/services/ocorrencias/ocorrencia-service';
import MessageUtils from 'src/app/utils/message-util';

@Component({
  selector: 'app-ocorrencias',
  templateUrl: './ocorrencias.component.html',
  styleUrls: ['./ocorrencias.component.scss'],
  providers: [MessageService]
})
export class OcorrenciasComponent implements OnInit {

  dialog: boolean = false;

  ocorrencia: Ocorrencia = {};

  ocorrencias: Ocorrencia[] = [];


  constructor(private messageService: MessageService, private ocorrenciaService: OcorrenciaService) { }
  

  ngOnInit(): void {
    this.listarOcorrencias()
  }

  openNew(){
    this.ocorrencia = {};
    this.dialog = true;
  };

  listarOcorrencias(){
    this.ocorrenciaService.read().subscribe(
      (data: Ocorrencia[]) => {
        this.ocorrencias = data;
        console.log(data)
      }, error => {
        this.messageService.add(MessageUtils.onErrorMessage(error));        
      } 
    );
  }

}
