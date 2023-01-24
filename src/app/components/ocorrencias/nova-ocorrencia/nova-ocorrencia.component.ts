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
import { Prestador } from 'src/app/model/vo/prestador';
import { PrestadorService } from 'src/app/services/prestadores/prestador-service';
import { NotAuthenticatedError } from 'src/app/interceptors/auth.http.interceptor';

interface Estado{
  nome: string,
  sigla: string

}

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

  prestadores!: Prestador[];
  prestadoresSelect: Prestador[] | undefined;

  estados!: Estado[];
  estadoSelecionado: Estado | undefined;

  constructor(private messageService: MessageService, 
                private commomService: CommomService, 
                private comboService: ComboService, 
                private ocorrenciaService: OcorrenciaService,
                private authService: AuthService,
                public dialogService: DialogService,
                private prestadorService: PrestadorService) {
                  
                  this.estados = [
                    {"nome": "Acre", "sigla": "AC"},
                    {"nome": "Alagoas", "sigla": "AL"},
                    {"nome": "Amapá", "sigla": "AP"},
                    {"nome": "Amazonas", "sigla": "AM"},
                    {"nome": "Bahia", "sigla": "BA"},
                    {"nome": "Ceará", "sigla": "CE"},
                    {"nome": "Distrito Federal", "sigla": "DF"},
                    {"nome": "Espírito Santo", "sigla": "ES"},
                    {"nome": "Goiás", "sigla": "GO"},
                    {"nome": "Maranhão", "sigla": "MA"},
                    {"nome": "Mato Grosso", "sigla": "MT"},
                    {"nome": "Mato Grosso do Sul", "sigla": "MS"},
                    {"nome": "Minas Gerais", "sigla": "MG"},
                    {"nome": "Pará", "sigla": "PA"},
                    {"nome": "Paraíba", "sigla": "PB"},
                    {"nome": "Paraná", "sigla": "PR"},
                    {"nome": "Pernambuco", "sigla": "PE"},
                    {"nome": "Piauí", "sigla": "PI"},
                    {"nome": "Rio de Janeiro", "sigla": "RJ"},
                    {"nome": "Rio Grande do Norte", "sigla": "RN"},
                    {"nome": "Rio Grande do Sul", "sigla": "RS"},
                    {"nome": "Rondônia", "sigla": "RO"},
                    {"nome": "Roraima", "sigla": "RR"},
                    {"nome": "Santa Catarina", "sigla": "SC"},
                    {"nome": "São Paulo", "sigla": "SP"},
                    {"nome": "Sergipe", "sigla": "SE"},
                    {"nome": "Tocantins", "sigla": "TO"}
                ]
                
                 }

  ngOnInit(): void {
    this.carregarCombos()
    if(this.authService.jwtIsLoad()){
      this.loadUsuarioLogado();
      this.carregarPrestadores();
    }
  }

  salvar(form: NgForm){
    this.ocorrencia = this.parseData(form)
    this.adicionarOcorrencia(form);
  }

  private carregarPrestadores(){
    this.prestadorService.read().then(data => {
      this.prestadores = data;
  
    }).catch(error => {
      console.error(error)
      if(error.includes('404')){
        this.messageService.add(MessageUtils.onErrorMessage("Erro ao carregar prestadores"));
      }
      if (error instanceof NotAuthenticatedError) {
        this.messageService.add(MessageUtils.onErrorMessage("Sua Sessão Expirou, faça Login Novamente")); 
        this.commomService.navigate(NavigationEnum.LOGIN);   
      }
      this.messageService.add(MessageUtils.onErrorMessage(error));
    })
  }

 private adicionarOcorrencia(form: NgForm){
  this.ocorrenciaService.create(this.ocorrencia).subscribe((data: any) => {
    this.id = data.id;
      this.messageService.add(MessageUtils.onSuccessMessage("Ocorrencia cadastrada, buscando prestador"));       
    },error => {
      this.messageService.add(MessageUtils.onErrorMessage(error));        
    },() => {
      this.show(form.value.estado);
      this.limpar(form);
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

  localizacao.latitude = latitude.replace(/ /g, "");
  localizacao.longitude = longitude.replace(/ /g, "");
  ocorrencia.tenancyCliente = this.usuarioLogado.tenancy;
  ocorrencia.prestadoresSelecionados = this.prestadoresSelect;
  ocorrencia.estados = form.value.estado;
  ocorrencia.localizacao = localizacao;
  ocorrencia.observacoes = form.value.observacoes;
  ocorrencia.numeroProcesso = form.value.numProcesso;
  ocorrencia.motivo = form.value.motivo;
  ocorrencia.placa = form.value.placa;
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

show(estado: any) {
  const ref = this.dialogService.open(AceiteOcorrenciasComponent, {
    data: {
        idOcorrencia: this.id,
        prestadores: this.prestadoresSelect !== undefined ? this.prestadoresSelect : null,
        estados: estado != null && estado.nome !== undefined ? estado : null
      },
      header: 'Lista de Prestadores proximos',
      width: '70%'
  });
  
}

prestadoresChange(event: any) {
  this.prestadoresSelect = event.value;
}

}
