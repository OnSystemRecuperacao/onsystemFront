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
import { CaptchaModule } from 'primeng/captcha';
import { cpf, cnpj } from 'cpf-cnpj-validator'; 
import { ComboService } from 'src/app/services/combos/combo.service';
import { UsuarioService } from 'src/app/services/usuario/usuario-service';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-ocorrencias',
  templateUrl: './esqueci-senha.component.html',
  providers: [MessageService]
})
export class EsqueciSenhaComponent implements OnInit {

  dialog: boolean = false;

  prestador: LocalizacaoPrestador = {}

  prestadores: LocalizacaoPrestador[] = [];

  tempoPrestadorOcorrencia: TempoPrestadorOcorrencia = {};

  tempoPrestadorOcorrencias: TempoPrestadorOcorrencia[] = [];

  ocorrencia: Ocorrencia = {};

  notificacao: NotificacaoPrestadorOcorrencia = {};

  pre: Prestador = {};

  loading: boolean = true;

  botao: boolean = true;
  tipoPessoaSelecionada = 1;
  tipoPessoa = [{}];


  constructor(private messageService: MessageService,
    private commomService: CommomService,
    public dialogService: DialogService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public comboService: ComboService,
    public usuarioService: UsuarioService) { }


  ngOnInit() {
    this.tipoPessoa = this.comboService.getTipoPessoa();
  }


  submit(form: NgForm) {
    var dto = {}
    if(this.tipoPessoaSelecionada == 1){
       dto = {
        email: form.value.email,
        cpfCnpj: form.value.cpf
      }
    }else{
       dto = {
        email: form.value.email,
        cpfCnpj: form.value.cnpj
      }
    }

    this.usuarioService.esqueciSenha(dto).pipe(finalize(() => {
      this.messageService.add(MessageUtils.onSuccessMessage("Senha enviada para o seu e-mail"));
      this.commomService.reloadComponent();
      this.commomService.navigate(NavigationEnum.LOGIN)   
      setTimeout(() => {
        this.ref.close();
      }, 1000);
      
      
    }))
    .subscribe(response => {
    },error => {
      this.messageService.add(MessageUtils.onErrorMessage(error));        
    });
  
  }

  showResponse(event: any) {
    this.botao = false;
  }

  validaDocumento(documento: string, tipoPessoa: number){
    if(tipoPessoa == 1 && documento != ""){
      return cpf.isValid(documento);
    }
    else if(tipoPessoa == 2 && documento != "") {
      return cnpj.isValid(documento);
    }
    else return true;
  }
  tipoPessoaChange(event: any){
    this.tipoPessoaSelecionada = event.value;
}

}


