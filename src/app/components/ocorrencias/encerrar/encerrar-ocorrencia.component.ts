import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { NavigationEnum } from 'src/app/model/enums/navigation.enum';
import { Ocorrencia } from 'src/app/model/vo/ocorrencia';
import { CommomService } from 'src/app/services/commons/common.service';
import { OcorrenciaService } from 'src/app/services/ocorrencias/ocorrencia-service';
import MessageUtils from 'src/app/utils/message-util';
import * as FileSaver from 'file-saver';
import { LocalizacaoPrestador } from 'src/app/model/vo/localizacao-prestador';
import { Form, NgForm } from '@angular/forms';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TempoPrestadorOcorrencia } from 'src/app/model/vo/tempo-prestador-ocorrencia';
import { NotificacaoService } from 'src/app/services/notificacao/notificacao-service';
import { LocalizacaoPrestadorService } from 'src/app/services/localizacaoPrestador/localizacaoPrestador-service';
import { NotificacaoPrestadorOcorrencia } from 'src/app/model/vo/notificacao-prestador-ocorrencia';
import { Prestador } from 'src/app/model/vo/prestador';
import { Tenancy } from 'src/app/model/vo/tenancy';


@Component({
  selector: 'app-ocorrencias',
  templateUrl: './encerrar-ocorrencia.component.html',
  providers: [MessageService]
})
export class EncerrarOcorrenciaComponent implements OnInit {

  dialog: boolean = false;

  prestador: LocalizacaoPrestador = {}

  prestadores: LocalizacaoPrestador[] = [];

  tempoPrestadorOcorrencia: TempoPrestadorOcorrencia = {};

  tempoPrestadorOcorrencias: TempoPrestadorOcorrencia[] = [];

  ocorrencia: Ocorrencia = {};

  notificacao: NotificacaoPrestadorOcorrencia = {};
 
  pre: Prestador = {};

  loading: boolean = true;


  constructor(private messageService: MessageService, 
    private localizacaoPrestadorService: LocalizacaoPrestadorService,
    private notificacaoService: NotificacaoService,
    private commomService: CommomService,
    public dialogService: DialogService,
    public ref: DynamicDialogRef, 
    public config: DynamicDialogConfig,
    private ocorrenciaService: OcorrenciaService) { }
  

  ngOnInit() {
    console.log(this.config.data.idOcorrencia);
    this.buscarPrestadores()
  }

  buscarPrestadores(){
    this.ocorrencia = this.config.data.novaOcorrencia;
    console.log(this.config.data.idOcorrencia)
    this.localizacaoPrestadorService.buscarPrestadorLocalizacao(this.config.data.idOcorrencia).then(response => {
      this.tempoPrestadorOcorrencias = response; 
      console.log(this.tempoPrestadorOcorrencias);
      this.loading = false;      
    }).catch(error => 
      this.messageService.add(MessageUtils.onErrorMessage(error))
    );    
  }

  salvar(form: NgForm){
    let obs = form.value.observacao;
    let ocorrencia = this.config.data.idOcorrencia;
    this.ocorrenciaService.encerrarOcorrencia(obs, ocorrencia).then(response => {
      console.log(response)
      
    }).catch(error => 
      this.messageService.add(MessageUtils.onErrorMessage(error))
    );    
    this.messageService.add(MessageUtils.onSuccessMessage("Ocorrencia encerrada"));  
    this.ref.close();
    this.commomService.navigateByUrl(NavigationEnum.LISTAR_OCORRENCIAS)   

    
    
  }

  redirectToList(event: any){
    this.commomService.navigateByUrl(NavigationEnum.LISTAR_OCORRENCIAS)
  }

}


