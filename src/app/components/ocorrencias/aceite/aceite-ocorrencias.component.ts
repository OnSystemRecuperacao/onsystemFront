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


@Component({
  selector: 'app-ocorrencias',
  templateUrl: './aceite-ocorrencias.component.html',
  providers: [MessageService]
})
export class AceiteOcorrenciasComponent implements OnInit {

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
    public config: DynamicDialogConfig) { }
  

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

  aprovar(tempo: TempoPrestadorOcorrencia){
    this.tempoPrestadorOcorrencia = {};
    this.ocorrencia = {};
    this.pre = {};
    this.tempoPrestadorOcorrencia = tempo;
    this.pre.id = tempo.localizacao?.prestador?.id;
    this.ocorrencia.id = this.config.data.idOcorrencia;
    console.log("TEMPO PRESTADOR - ");
    console.log(this.pre);
    console.log("OCORRENCIA - ");
    console.log(this.ocorrencia);

    this.notificacao.prestador = this.pre;
    this.notificacao.ocorrencia = this.ocorrencia;
    console.log(this.notificacao);
    this.notificacaoService.notificarPrestador(this.notificacao).then(response => {
      this.tempoPrestadorOcorrencias = response; 
      console.log(this.tempoPrestadorOcorrencias);
      this.loading = false;      
    }).catch(error => 
      this.messageService.add(MessageUtils.onErrorMessage(error))
    );    

    this.messageService.add(MessageUtils.onSuccessMessage("Prestador notificado"));
    this.ref.close();
    this.commomService.navigateByUrl(NavigationEnum.LISTAR_OCORRENCIAS)
  }

  redirectToList(event: any){
    this.commomService.navigateByUrl(NavigationEnum.LISTAR_OCORRENCIAS)
  }

}


