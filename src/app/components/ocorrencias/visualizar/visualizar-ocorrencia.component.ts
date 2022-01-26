import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ComboService } from 'src/app/services/combos/combo.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import MessageUtils from 'src/app/utils/message-util';
import { CommomService } from 'src/app/services/commons/common.service';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Cliente } from 'src/app/model/vo/cliente';
import { ActivatedRoute } from '@angular/router';
import { InteracaoOcorrencia } from 'src/app/model/vo/interacao-ocorrencia';
import { InteracaoService } from 'src/app/services/interacaoOcorrencia/interacao-service';
import { Ocorrencia } from 'src/app/model/vo/ocorrencia';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Usuario } from 'src/app/model/vo/usuario';
import { Tenancy } from 'src/app/model/vo/tenancy';
import { OcorrenciaService } from 'src/app/services/ocorrencias/ocorrencia-service';
import { getDatabase, onChildAdded, onValue, push, ref, set } from 'firebase/database';
import { UsuarioService } from 'src/app/services/usuario/usuario-service';
import { DialogService } from 'primeng/dynamicdialog';
import { EncerrarOcorrenciaComponent } from '../encerrar/encerrar-ocorrencia.component';
import { MensagemFirebase } from 'src/app/model/vo/mensagem.firebase.model';

@Component({
  selector: 'visualizar-ocorrencia',
  templateUrl: './visualizar-ocorrencia.component.html',
  //styleUrls: ['./visualizar-ocorrencia.component.css'],
  providers: [MessageService, FormBuilder, ConfirmationService, DialogService]
})
export class VisualizarOcorrenciaComponent implements OnInit, AfterViewInit {


  idOcorrencia = 0;

  ocorrencia?: Ocorrencia = {};

  cliente?: Cliente = {};

  loading: boolean = true;

  usuarioLogado = new Usuario();

  chats: MensagemFirebase[] = []

  mensagem: MensagemFirebase = {};

  mensagemEnviar: string = ""

  idBancoFirebase: string = "";

  user = {
    _id: '',
    tipoTenancy: 0,
    name: '',
    avatar: "https://firebasestorage.googleapis.com/v0/b/onsystemapp-38e3c.appspot.com/o/logo.png?alt=media&token=d4969140-f893-4ce1-b877-f60b4458a291"
  }


  @ViewChild('chatcontent') chatcontent: ElementRef | undefined;

  scrolltop: number = 0;

  roomname = '';

  position = "top";

  ngOnInit() {
    this.buscarOcorrencia();
    if (this.authService.jwtIsLoad()) {
      this.loadUsuarioLogado();
    }    
    
  }

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private ocorrenciaService: OcorrenciaService,
    private usuarioService: UsuarioService,
    private confirmationService: ConfirmationService,
    public dialogService: DialogService
  ) {

  }
  ngAfterViewInit(): void {
    this.updateMessages(this.callback);
  }

  private buscarOcorrencia() {
    //let idOcorrencia = <number> this.route.snapshot.params['id'];
    console.log(<number>this.route.snapshot.params['id'] + "- ID SNAP");
    let idOcorrencia = <number>this.route.snapshot.params['id'];

    this.ocorrenciaService.readById(idOcorrencia).then(response => {
      console.log(response);
      this.ocorrencia = response;
      this.idOcorrencia = idOcorrencia;
      this.cliente = this.ocorrencia?.tenancyCliente;
      this.idBancoFirebase = idOcorrencia + "-" + this.ocorrencia?.idCentral + "-" + this.cliente?.id 
      this.updateMessages(this.callback);

    console.log("ID BANCO")
    console.log(this.idBancoFirebase)

      console.log(this.cliente);

    }, error => {
      this.messageService.add(MessageUtils.onErrorMessage(error));
    }
    );

    this.loading = false;

  }

  enviarMensagem() {
   
    this.user = {
      _id: this.cliente!.id!.toString(),
      tipoTenancy: this.authService.getUsuarioLogado()["tipo_tenancy"].id,
      name: this.authService.getUsuarioLogado()["nome_usuario"],
      avatar: "https://firebasestorage.googleapis.com/v0/b/onsystemapp-38e3c.appspot.com/o/logo.png?alt=media&token=d4969140-f893-4ce1-b877-f60b4458a291"
    }

    const db = getDatabase();

    push(ref(db, this.idBancoFirebase), {
      text: this.mensagemEnviar,
      image: '',
      user: this.user,
      createdAt: new Date().getTime()
    });

    this.messageService.add(MessageUtils.onSuccessMessage("Mensagem enviada"));
    this.mensagemEnviar = "";

  }

  private loadUsuarioLogado() {
    if (this.authService.jwtIsLoad()) {
      let idTenancy = <number>this.authService.getUsuarioLogado().id_tenancy
      this.usuarioService.readByID(idTenancy, this.authService.getUsuarioLogado().id_usuario).then(response => {
        this.usuarioLogado = response;

      }, error => {
        this.messageService.add(MessageUtils.onErrorMessage(error));
      }
      );
      //this.usuarioLogado.id = this.authService.getUsuarioLogado().id_usuario;
      this.usuarioLogado.tenancy = new Tenancy(idTenancy);
    }
  }



  encerrar() {
    let ocorrencia = this.ocorrencia?.id;
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja encerrar a ocorrencia ' + this.ocorrencia?.id + ' ?',
      header: 'Confirmação',
      icon: 'pi pi-info-circle',
      accept: () => {
        const ref = this.dialogService.open(EncerrarOcorrenciaComponent, {
          data: {
            idOcorrencia: ocorrencia
          },
          header: 'Observação de encerramento',
          width: '70%'
        });

      },
      key: "positionDialog"
    });
  }

  updateMessages(callback: any){

    const db = getDatabase();
    console.log("updateMessages")
    console.log(this.idBancoFirebase)

    if(this.idBancoFirebase){
      const commentsRef = ref(db, this.idBancoFirebase);
      onChildAdded(commentsRef, (data) => {
        let teste = callback(this.parse(data));
        console.log("DEPOIS DO BACK")
        this.chats.push(teste)
        console.log(this.chats)
      });
    }
   
  }

  callback(data: any){
    console.log("CALLBACK")
    let msg: MensagemFirebase = new MensagemFirebase();
    msg = data;
    return msg;
  }

  private parse(snapshot: any){
    const { createdAt, text,image, user } = snapshot.val();
    const { key: _id } = snapshot;
    const message = { _id, createdAt, text, image, user };
    return message;
  };


}


