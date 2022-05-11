import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
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
import { finalize } from 'rxjs/operators';
import { getDatabase, onChildAdded, push, ref } from 'firebase/database';
import { MensagemFirebase } from 'src/app/model/vo/mensagem.firebase.model';


@Component({
  selector: 'app-ocorrencias',
  templateUrl: './aceite-ocorrencias.component.html',
  providers: [MessageService, ConfirmationService]
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
  mensagemInfo: boolean = false;
  aceiteOcorrencia: boolean = false;


  constructor(private messageService: MessageService,
    private localizacaoPrestadorService: LocalizacaoPrestadorService,
    private notificacaoService: NotificacaoService,
    private commomService: CommomService,
    public dialogService: DialogService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private confirmationService: ConfirmationService) { }


  ngOnInit() {
    console.log(this.config.data.idOcorrencia);
    this.buscarPrestadores()
  }

  buscarPrestadores() {
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

  aprovar(tempo: TempoPrestadorOcorrencia) {
    this.tempoPrestadorOcorrencia = {};
    this.ocorrencia = {};
    this.pre = {};
    this.tempoPrestadorOcorrencia = tempo;
    this.pre.id = this.tempoPrestadorOcorrencia.localizacao?.prestador?.id;
    this.ocorrencia.id = this.config.data.idOcorrencia;

    this.notificacao.prestador = new Tenancy(tempo.idPrestador!);
    this.notificacao.ocorrencia = this.ocorrencia;
    console.log(this.notificacao);
    this.notificacaoService.notificarPrestador(this.notificacao).pipe(finalize(() => {
      setTimeout(() => {
        this.verificarControleAceite(this.callback, this.notificacao.ocorrencia?.id);
      }, 29000);

    })).subscribe(response => {
      // this.tempoPrestadorOcorrencias = response; 
      if (response) {
        console.log(this.tempoPrestadorOcorrencias);
        this.loading = false;
        this.gravarControleAceite(this.notificacao)
        this.mensagemInfo = true;
        this.messageService.add(MessageUtils.onInfoMessage("Prestador notificado, aguardando resposta"));
      }

    }, error =>
      this.messageService.add(MessageUtils.onErrorMessage("Não foi possivel notificar esse prestador, por favor, escolha outro."))
    );


    // this.ref.close();
    // this.commomService.navigateByUrl(NavigationEnum.LISTAR_OCORRENCIAS)
  }

  redirectToList(event: any) {
    this.commomService.navigateByUrl(NavigationEnum.LISTAR_OCORRENCIAS)
  }

  gravarControleAceite(oco: NotificacaoPrestadorOcorrencia) {
    let controleAceite = 'controleAceite - ' + oco.ocorrencia?.id;
  
    const db = getDatabase();

    push(ref(db, controleAceite), {
      id: oco.ocorrencia?.id,
      aceito: 0,
    });

  }

  verificarControleAceite(callback: any, id: any) {
    const db = getDatabase();
    let controleAceite = 'controleAceite - ' + id;
    const commentsRef = ref(db, controleAceite);
    let retorno = {
      id: 0,
      aceito: false
    };
    onChildAdded(commentsRef, (data) => {
      retorno = callback(this.parse(data));
      console.log("DEPOIS DO BACK")
      console.log(retorno)
      

    });

    setTimeout(() => {
      console.log("Aceite");
    console.log(retorno.aceito);
    if (retorno.aceito) {
      this.confirm(id);
    }
    else {
      this.messageService.add(MessageUtils.onWarningMessage("Prestador não respondeu, por favor, escolha outro."));
    }
    }, 1000);

  }

  callback(data: any) {
    let retorno = {
      id: data.id,
      aceito: data.aceito == 0 ? false : true
    }
    console.log("CALLBACK")
    console.log(retorno)
    return retorno;
  }

  private parse(snapshot: any) {
    const { id, aceito } = snapshot.val();
    const { key: _id } = snapshot;
    const message = { id, aceito };
    return message;
  };

  confirm(id: any) {
    this.confirmationService.confirm({
      message: 'Ocorrencia aceita pelo prestador, você será encaminhado para tela de interação.',
      header: 'Ocorrencia iniciada',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let teste =  this.ocorrencia.idCentral!;
        this.commomService.setNovaOcorrencia(teste);
        this.ref.close();
        this.commomService.navigateWithParams(NavigationEnum.VISUALIZAR_OCORRENCIA, id);
      }

    });
  }

}


