import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { NavigationEnum } from 'src/app/model/enums/navigation.enum';
import { Localizacao } from 'src/app/model/vo/localizacao';
import { Ocorrencia } from 'src/app/model/vo/ocorrencia';
import { Tenancy } from 'src/app/model/vo/tenancy';
import { Usuario } from 'src/app/model/vo/usuario';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ComboService } from 'src/app/services/combos/combo.service';
import { CommomService } from 'src/app/services/commons/common.service';
import { OcorrenciaService } from 'src/app/services/ocorrencias/ocorrencia-service';
import MessageUtils from 'src/app/utils/message-util';
import {DialogService, DynamicDialogModule} from 'primeng/dynamicdialog';
import { AceiteOcorrenciasComponent } from '../aceite/aceite-ocorrencias.component';

@Component({
  selector: 'app-nova-ocorrencia',
  templateUrl: './nova-ocorrencia.component.html',
  providers: [MessageService, DialogService]
})
export class NovaOcorrenciaComponent implements OnInit {

  ocorrencia: Ocorrencia = {};

  ocorrencias: Ocorrencia[] = [];

  id?: number;

  itens = [{}]

  usuarioLogado = new Usuario();  

  
  constructor(private messageService: MessageService, 
                private commomService: CommomService, 
                private comboService: ComboService, 
                private ocorrenciaService: OcorrenciaService,
                private authService: AuthService,
                public dialogService: DialogService) { }

  ngOnInit(): void {
    this.carregarCombos()
    if(this.authService.jwtIsLoad()){
      this.loadUsuarioLogado();
    }
  }

  salvar(form: NgForm){
    this.ocorrencia = this.parseData(form)
    this.adicionarOcorrencia(form);
  }

 private adicionarOcorrencia(form: NgForm){
  this.ocorrenciaService.create(this.ocorrencia).subscribe((data: any) => {
    console.log(data);
    this.id = data.id;
    console.log(this.id);
      this.messageService.add(MessageUtils.onSuccessMessage("Ocorrencia cadastrada, buscando prestador"));       
    },error => {
      this.messageService.add(MessageUtils.onErrorMessage(error));        
    },() => {
      this.limpar(form);
      this.show();
      //this.commomService.navigate(NavigationEnum.LISTAR_OCORRENCIAS);   
    } 
  );      
 }

 private parseData(form: NgForm) : Ocorrencia{
  let ocorrencia: Ocorrencia = {};
  let localizacao: Localizacao = {};
  let loc =  form.value.localizacao.split(',')
  let latitude = loc[0];
  let longitude = loc[1];

  console.log("antenista", form.value.antenista);
  console.log("escoltaArmado", form.value.escoltaArmado);

  localizacao.latitude = latitude.replace(/ /g, "");
  localizacao.longitude = longitude.replace(/ /g, "");
  ocorrencia.tenancyCliente = this.usuarioLogado.tenancy;
  ocorrencia.localizacao = localizacao;
  ocorrencia.observacoes = form.value.observacoes;
  ocorrencia.numeroProcesso = form.value.numProcesso;
  ocorrencia.motivo = form.value.motivo;
  ocorrencia.antenista = form.value.antenista == 1 ? true : false;
  ocorrencia.escoltaArmado = form.value.escoltaArmado == 1 ? true : false;
  ocorrencia.reguladorSinis = false;

  return ocorrencia;  
}

 private limpar(form: NgForm){
  form.resetForm(); 
}

carregarCombos(){
  this.itens = this.comboService.getSimNaoOptions()
 }

 private loadUsuarioLogado(){
  if(this.authService.jwtIsLoad()){
    let idTenancy =  <number> this.authService.getUsuarioLogado().id_tenancy
    this.usuarioLogado.id = this.authService.getUsuarioLogado().id_usuario;
    this.usuarioLogado.tenancy = new Tenancy(idTenancy);

  }
}

show() {
  const ref = this.dialogService.open(AceiteOcorrenciasComponent, {
    data: {
        idOcorrencia: this.id
      },
      header: 'Lista de Prestadores proximos',
      width: '70%'
  });
  
}

}
