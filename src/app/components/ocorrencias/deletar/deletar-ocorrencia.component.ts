import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { DialogService, DynamicDialogConfig } from "primeng/dynamicdialog";
import { Login } from "src/app/model/vo/login";
import { Ocorrencia } from "src/app/model/vo/ocorrencia";
import { AuthService } from "src/app/services/auth/auth.service";
import { OcorrenciaService } from "src/app/services/ocorrencias/ocorrencia-service";
import { UsuarioService } from "src/app/services/usuario/usuario-service";
import MessageUtils from "src/app/utils/message-util";

@Component({
    templateUrl: './deletar-ocorrencia.component.html',
    //styleUrls: ['./ocorrencias.component.scss'],
    providers: [MessageService, ConfirmationService, DialogService]
})
export class DeleteOcorrenciaComponent implements OnInit {

    ngOnInit(): void {
    }

    constructor(private messageService: MessageService,
        private ocorrenciaService: OcorrenciaService,
        private confirmationService: ConfirmationService,
        private usuarioService: UsuarioService,
        private authService: AuthService,
        public config: DynamicDialogConfig,
        public dialogService: DialogService) { }

    submit(form: NgForm) {
        let login = {
            loginUsuario: this.authService.getUsuarioLogado().user_name,
            senhaUsuario: form.value.password
        }

        this.usuarioService.validaSenhaAdm(login).then(response => {
            this.removerOcorrencia(this.config.data.idOcorrencia);      
          }).catch(error => {
            console.log(error)
            this.messageService.add(MessageUtils.onErrorMessage("Senha invalida"))
          }
            
        );

       
    }

    removerOcorrencia(id: any) {
        this.ocorrenciaService.delete(id).subscribe(response => {
            this.messageService.add(MessageUtils.onSuccessMessage("Ocorrencia excluida com sucesso"));
            window.location.reload();

        }, error => {
            this.messageService.add(MessageUtils.onErrorMessage("Erro ao excluir ocorrencia"));
        })

    }

}