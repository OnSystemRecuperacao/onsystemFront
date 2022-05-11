import { Component, OnInit } from "@angular/core";
import { ConfirmationService, MessageService } from "primeng/api";
import { Prestador } from "src/app/model/vo/prestador";
import { Tenancy } from "src/app/model/vo/tenancy";
import { Usuario } from "src/app/model/vo/usuario";
import { AuthService } from "src/app/services/auth/auth.service";
import { CommomService } from "src/app/services/commons/common.service";
import { PrestadorService } from "src/app/services/prestadores/prestador-service";
import MessageUtils from "src/app/utils/message-util";

@Component({
    selector: 'dashboard-component',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    providers: [MessageService, ConfirmationService]
})
export class DashboardComponent implements OnInit {

    prestadoresData: any;

    clientesData: any;

    usuariosData: any;

    ocorrenciasData: any;

    options: any;

    prestadores: Prestador[] = [];

    usuarioLogado = new Usuario();
    ocorrencia: string | undefined;


    constructor(
        private prestadorService: PrestadorService,
        private commomService: CommomService,
        private authService: AuthService,
        private messageService: MessageService,

    ) { }

    ngOnInit() {
        if (this.authService.jwtIsLoad()) {
            this.loadUsuarioLogado();
        }
        this.commomService.setNovaOcorrencia("teste")
        this.messageService.add(MessageUtils.onWarningMessage("Nova Ocorrencia aceita - "));
        console.log(this.usuarioLogado)
        if (this.usuarioLogado.tipo!.id === 0) {
            this.commomService.getNovaOcorrencia().subscribe((oco) => {
                this.ocorrencia = oco;
                console.log("Ocorrencia - ", this.ocorrencia)
                if (this.ocorrencia) {
                    this.messageService.add(MessageUtils.onWarningMessage("Nova Ocorrencia aceita - " + this.ocorrencia));
                }
            });
        }
    }

    private loadUsuarioLogado() {
        if (this.authService.jwtIsLoad()) {
            let idTenancy = <number>this.authService.getUsuarioLogado().id_tenancy
            this.usuarioLogado.id = this.authService.getUsuarioLogado().id_usuario;
            this.usuarioLogado.tipo = this.authService.getUsuarioLogado().tipo_tenancy
            this.usuarioLogado.tenancy = new Tenancy(idTenancy);

        }
    }

}