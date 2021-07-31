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

  usuarioLogado = new Usuario();  

  
  constructor(private messageService: MessageService, 
                private commomService: CommomService, 
                private comboService: ComboService, 
                private ocorrenciaService: OcorrenciaService,
                private authService: AuthService,) { }

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
      this.messageService.add(MessageUtils.onSuccessMessage("Ocorrencia cadastrada, buscando prestador"));       
    },error => {
      this.messageService.add(MessageUtils.onErrorMessage(error));        
    },() => {
      this.limpar(form);
      this.commomService.navigate(NavigationEnum.LISTAR_OCORRENCIAS);   
    } 
  );      
 }

 private parseData(form: NgForm) : Ocorrencia{
  let ocorrencia: Ocorrencia = {};
  let localizacao: Localizacao = {};

  localizacao.latitude = form.value.latitude;
  localizacao.longitude = form.value.longitude;
  ocorrencia.tenancyCliente = this.usuarioLogado.tenancy;
  ocorrencia.localizacao = localizacao;
  ocorrencia.observacoes = form.value.observacoes;
  ocorrencia.numeroProcesso = form.value.numProcesso;
  ocorrencia.motivo = form.value.motivo;
  ocorrencia.antenista = form.value.antenista;
  ocorrencia.escoltaArmado = form.value.escoltaArmado;
  ocorrencia.reguladorSinis = form.value.reguladorSinis;

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

}
