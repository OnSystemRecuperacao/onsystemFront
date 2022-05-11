import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { LocalizacaoPrestador } from 'src/app/model/vo/localizacao-prestador';
import { Localizacao } from 'src/app/model/vo/localizacao';
import { LocalizacaoFireBase } from 'src/app/model/vo/LocalizacaoFireBase';

@Component({
  selector: 'visualizar-ocorrencia',
  templateUrl: './visualizar-ocorrencia.component.html',
  styleUrls: ['./visualizar-ocorrencia.component.css'],
  providers: [MessageService, FormBuilder, ConfirmationService, DialogService]
})


export class VisualizarOcorrenciaComponent implements OnInit, AfterViewInit {


  idOcorrencia = 0;

  ocorrencia?: Ocorrencia = {};

  cliente?: Cliente = {};

  loading: boolean = true;

  usuarioLogado = new Usuario();

  chats: MensagemFirebase[] = []

  localizacao: LocalizacaoFireBase = new LocalizacaoFireBase();

  mensagem: MensagemFirebase = {};

  mensagemEnviar: string = ""

  idBancoFirebase: string = "";

  rota = false;

  user = {
    _id: '',
    tipoTenancy: 0,
    name: '',
    avatar: "https://firebasestorage.googleapis.com/v0/b/onsystemapp-38e3c.appspot.com/o/logo.png?alt=media&token=d4969140-f893-4ce1-b877-f60b4458a291"
  }

  lat = -23.548292555642472;
  lng = -46.55468821799813;

  origin = { lat: -23.53396135665954, lng: -46.49964524856933 };
  destination = { lat: -23.5604483, lng: -46.5595737 };

  origem = {};
  destino = {};

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
    this.updateLocalizacao(this.callbackLocalizacao);
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
      this.updateLocalizacao(this.callbackLocalizacao);

    console.log("ID BANCO")
    console.log(this.idBancoFirebase)

      console.log(this.cliente);

    }, error => {
      this.messageService.add(MessageUtils.onErrorMessage(error));
    }
    );

    this.loading = false;

  }

  exibirRota(){
    this.updateLocalizacao(this.callbackLocalizacao);
    this.origem = {
      lat: this.localizacao!.latitude,
      lng: this.localizacao!.longitude
    }
    this.destino = {
      lat: parseFloat(this.ocorrencia!.localizacao!.latitude!),
      lng: parseFloat(this.ocorrencia!.localizacao!.longitude!)
    }
    console.log(this.origem)
    console.log( this.destino)

    this.rota = !this.rota
  }

  markerOptions = {
    origin: {
        icon: 'https://img.icons8.com/material-rounded/24/000000/public.png',
        draggable: true,
    },
    destination: {
        icon: 'https://img.icons8.com/material-sharp/24/000000/cancel--v2.png',
        draggable: true,
    },
}

renderOptions = {
  suppressMarkers: true,
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
    this.updateLocalizacao(this.callbackLocalizacao);

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
        this.updateLocalizacao(this.callbackLocalizacao);
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

  updateLocalizacao(callbackLocalizacao: any){

    const db = getDatabase();
    console.log("updateLocalizacao")
    console.log(this.ocorrencia!.idPrestador)
    
    let id = "localizacao-prestador-" + this.ocorrencia!.idPrestador;
    // let id = "localizacao-prestador-" + 10;
    console.log(id)
    
      const commentsRef = ref(db, id);
      onChildAdded(commentsRef, (data) => {
        let teste = callbackLocalizacao(this.parseLocalizacao(data));
        console.log("DEPOIS DO BACK LOCALIZACAO")
        this.localizacao.latitude = parseFloat(teste['latitude']);
        this.localizacao.longitude = parseFloat(teste['longitude']);
        console.log(this.localizacao)
      });
    
   
  }

  callbackLocalizacao(data: any){
    console.log("CALLBACK")
    let localizacao: LocalizacaoFireBase = new LocalizacaoFireBase();
    localizacao = data;
    return localizacao;
  }

  private parseLocalizacao(snapshot: any){
    console.log(snapshot.val())
    const { latitude,longitude, usuario } = snapshot.val();
    const { key: _id } = snapshot;
    const message = { latitude, longitude, usuario };
    return message;
  };

  


}


