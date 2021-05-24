import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Ocorrencia } from 'src/app/model/vo/ocorrencia';
import { ComboService } from 'src/app/services/combos/combo.service';
import { CommomService } from 'src/app/services/commons/common.service';
import { OcorrenciaService } from 'src/app/services/ocorrencias/ocorrencia-service';
import MessageUtils from 'src/app/utils/message-util';

@Component({
  selector: 'app-nova-ocorrencia',
  templateUrl: './nova-ocorrencia.component.html',
  styleUrls: ['./nova-ocorrencia.component.scss'],
  providers: [MessageService]
})
export class NovaOcorrenciaComponent implements OnInit {

  ocorrencia: Ocorrencia = {};

  ocorrencias: Ocorrencia[] = [];

  itens = [{}]

  
  constructor(private messageService: MessageService, private commomService: CommomService, private comboService: ComboService, private ocorrenciaService: OcorrenciaService) { }

  ngOnInit(): void {
    this.carregarCombos()
  }

  salvar(form: NgForm){
    this.ocorrencia = this.parseData(form)
    this.adicionarOcorrencia(form);
  }

 private adicionarOcorrencia(form: NgForm){
  this.ocorrenciaService.create(this.ocorrencia).subscribe((data: any) => {
      this.messageService.add(MessageUtils.onSuccessMessage("Ocorrencia cadastrada"));       
    },error => {
      this.messageService.add(MessageUtils.onErrorMessage(error));        
    },() => {
      this.limpar(form);
    } 
  );      
 }

 private parseData(form: NgForm) : Ocorrencia{
  let ocorrencia: Ocorrencia = {};
  
  return ocorrencia;  
}

 private limpar(form: NgForm){
  form.resetForm(); 
}

carregarCombos(){
  this.itens = this.comboService.getSimNaoOptions()
 }

}
