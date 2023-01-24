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
import { AuthService } from 'src/app/services/auth/auth.service';
import { getDatabase, onChildAdded, push, ref } from 'firebase/database';


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
  idBancoFirebase: string = "";

  user = {
    _id: 0,
    tipoTenancy: 0,
    name: '',
    avatar: "https://firebasestorage.googleapis.com/v0/b/onsystemapp-38e3c.appspot.com/o/logo.png?alt=media&token=d4969140-f893-4ce1-b877-f60b4458a291"
  }


  constructor(private messageService: MessageService,
    private commomService: CommomService,
    public dialogService: DialogService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private ocorrenciaService: OcorrenciaService,
    private authService: AuthService,) { }


  ngOnInit() {
    this.idBancoFirebase = this.config.data.idFirebase
  }

  salvar(form: NgForm) {
    let obs = form.value.observacao;
    let ocorrencia = this.config.data.idOcorrencia;
    this.ocorrenciaService.encerrarOcorrencia(obs, ocorrencia).then(response => {
      this.enviarMensagem(obs);
      setTimeout(() => {
        this.messageService.add(MessageUtils.onSuccessMessage("Ocorrencia encerrada"));
        this.ref.close();
        this.commomService.navigateByUrl(NavigationEnum.LISTAR_OCORRENCIAS)
      }, 1000);

    }).catch(error =>
      this.messageService.add(MessageUtils.onErrorMessage(error))
    );





  }

  redirectToList(event: any) {
    this.commomService.navigateByUrl(NavigationEnum.LISTAR_OCORRENCIAS)
  }

  enviarMensagem(obs: any) {
    this.user = {
      _id: <number>this.authService.getUsuarioLogado().id_tenancy,
      tipoTenancy: this.authService.getUsuarioLogado()["tipo_tenancy"].id,
      name: this.authService.getUsuarioLogado()["nome_usuario"],
      avatar: "https://firebasestorage.googleapis.com/v0/b/onsystemapp-38e3c.appspot.com/o/logo.png?alt=media&token=d4969140-f893-4ce1-b877-f60b4458a291"
    }

    const db = getDatabase();

    push(ref(db, this.idBancoFirebase), {
      text: "Ocorrencia encerrada pelo cliente: Considerações finais - " + obs,
      image: "",
      user: this.user,
      createdAt: new Date().getTime()
    });

  }

}


