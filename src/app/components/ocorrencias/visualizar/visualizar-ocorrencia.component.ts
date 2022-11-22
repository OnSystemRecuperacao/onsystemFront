import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import MessageUtils from 'src/app/utils/message-util';
import { UntypedFormBuilder } from '@angular/forms';
import { Cliente } from 'src/app/model/vo/cliente';
import { ActivatedRoute } from '@angular/router';
import { Ocorrencia } from 'src/app/model/vo/ocorrencia';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Usuario } from 'src/app/model/vo/usuario';
import { Tenancy } from 'src/app/model/vo/tenancy';
import { OcorrenciaService } from 'src/app/services/ocorrencias/ocorrencia-service';
import { getDatabase, onChildAdded, push, ref } from 'firebase/database';
import { UsuarioService } from 'src/app/services/usuario/usuario-service';
import { DialogService } from 'primeng/dynamicdialog';
import { EncerrarOcorrenciaComponent } from '../encerrar/encerrar-ocorrencia.component';
import { MensagemFirebase } from 'src/app/model/vo/mensagem.firebase.model';
import { LocalizacaoFireBase } from 'src/app/model/vo/LocalizacaoFireBase';
import { getDownloadURL, getStorage, uploadBytesResumable } from 'firebase/storage';
import { ref as refStorage, uploadBytes  } from 'firebase/storage';
import { DocumentCreator } from 'src/app/services/relatorioOcorrencia/DocumentCreator';
import { Packer } from 'docx';
import * as saveAs from 'file-saver';
import { RelatorioService } from 'src/app/services/relatorioOcorrencia/relatorio-service';
import { HistoricoFirebase } from 'src/app/model/vo/historico-firebase';
import { Observable, Observer } from 'rxjs';
import * as JSZip from 'jszip';
import JSZipUtils from 'jszip-utils'
import { NotificacaoPrestadorOcorrencia } from 'src/app/model/vo/notificacao-prestador-ocorrencia';
import { NotificacaoService } from 'src/app/services/notificacao/notificacao-service';

@Component({
  selector: 'visualizar-ocorrencia',
  templateUrl: './visualizar-ocorrencia.component.html',
  styleUrls: ['./visualizar-ocorrencia.component.css'],
  providers: [MessageService, UntypedFormBuilder, ConfirmationService, DialogService]
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

  imagemEnviar: string = "";

  imagem: any;

  idBancoFirebase: string = "";

  rota = false;

  user = {
    _id: 0,
    tipoTenancy: 0,
    name: '',
    avatar: "https://firebasestorage.googleapis.com/v0/b/onsystemapp-38e3c.appspot.com/o/logo.png?alt=media&token=d4969140-f893-4ce1-b877-f60b4458a291"
  }

  urls: any = [];


  origem = {};
  destino = {};

  @ViewChild('chatcontent') chatcontent: ElementRef | undefined;

  scrolltop: number = 0;

  roomname = '';

  position = "top";
  tipoTenancy!: number;
  carregandoDoc: boolean = false;

  observacoesRelatorio!: string;
  relatorioOcorrencia: boolean = false;
  base64Image: any;

  ngOnInit() {
    this.buscarOcorrencia();
    if (this.authService.jwtIsLoad()) {
      this.loadUsuarioLogado();
      this.tipoTenancy = <number>this.authService.getUsuarioLogado().tipo_tenancy.id
    }


  }

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private notificacaoService: NotificacaoService,
    private ocorrenciaService: OcorrenciaService,
    private usuarioService: UsuarioService,
    private confirmationService: ConfirmationService,
    public dialogService: DialogService,
    private relatorioService: RelatorioService
  ) {

  }
  ngAfterViewInit(): void {
    this.updateMessages(this.callback);
    this.updateLocalizacao(this.callbackLocalizacao);
  }

  private buscarOcorrencia() {
    //let idOcorrencia = <number> this.route.snapshot.params['id'];
    let idOcorrencia = <number>this.route.snapshot.params['id'];

    this.ocorrenciaService.readById(idOcorrencia).then(response => {
      this.ocorrencia = response;
      this.idOcorrencia = idOcorrencia;
      this.cliente = this.ocorrencia?.tenancyCliente;
      this.idBancoFirebase = idOcorrencia + "-" + this.ocorrencia?.idCentral + "-" + this.cliente?.id
      this.updateMessages(this.callback);
      this.updateLocalizacao(this.callbackLocalizacao);


    }, error => {
      this.messageService.add(MessageUtils.onErrorMessage(error));
    }
    );

    this.loading = false;

  }

  exibirRota() {
    this.updateLocalizacao(this.callbackLocalizacao);
    setTimeout(() => {
      this.origem = {
        lat: this.localizacao!.latitude,
        lng: this.localizacao!.longitude
      }
      this.destino = {
        lat: parseFloat(this.ocorrencia!.localizacao!.latitude!),
        lng: parseFloat(this.ocorrencia!.localizacao!.longitude!)
      }
    
      this.rota = !this.rota
    }, 1000);

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
      _id: this.cliente!.id!,
      tipoTenancy: this.authService.getUsuarioLogado()["tipo_tenancy"].id,
      name: this.authService.getUsuarioLogado()["nome_usuario"],
      avatar: "https://firebasestorage.googleapis.com/v0/b/onsystemapp-38e3c.appspot.com/o/logo.png?alt=media&token=d4969140-f893-4ce1-b877-f60b4458a291"
    }

    const db = getDatabase();

    push(ref(db, this.idBancoFirebase), {
      _id: new Date().getTime(),
      text: this.mensagemEnviar,
      image: this.imagemEnviar,
      user: this.user,
      createdAt: new Date().getTime()
    });
    this.notificarPrestador(this.mensagemEnviar);
    this.messageService.add(MessageUtils.onSuccessMessage("Mensagem enviada"));
    this.mensagemEnviar = "";
    
    this.updateLocalizacao(this.callbackLocalizacao);

  }
  notificarPrestador(msg: any) {
    const notificacao = {
      prestador: new Tenancy(this.ocorrencia!.idPrestador!),
      mensagem: msg
    }

    this.notificacaoService.notificarPrestadorChat(notificacao).subscribe(response => {

    }, error =>
      this.messageService.add(MessageUtils.onErrorMessage("Erro ao notificar prestador"))
    );
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
            idOcorrencia: ocorrencia,
            idFirebase: this.idBancoFirebase
          },
          header: 'Observação de encerramento',
          width: '70%'
        });

      },
      key: "positionDialog"
    });
  }

  updateMessages(callback: any) {

    const db = getDatabase();
    if (this.idBancoFirebase) {
      const commentsRef = ref(db, this.idBancoFirebase);
      onChildAdded(commentsRef, (data) => {
        let teste = callback(this.parse(data));
        this.chats.push(teste)
        this.updateLocalizacao(this.callbackLocalizacao);
      });

    }

  }

  callback(data: any) {
    let msg: MensagemFirebase = new MensagemFirebase();
    msg = data;
    return msg;
  }

  private parse(snapshot: any) {
    const { createdAt, text, audio, image, user } = snapshot.val();
    const { key: _id } = snapshot;
    const message = { _id, createdAt, text, audio, image, user };
    return message;
  };

  updateLocalizacao(callbackLocalizacao: any) {

    const db = getDatabase();

    let id = "localizacao-prestador-" + this.ocorrencia!.idPrestador;
    // let id = "localizacao-prestador-" + 10;

    const commentsRef = ref(db, id);
    onChildAdded(commentsRef, (data) => {
      let teste = callbackLocalizacao(this.parseLocalizacao(data));
      this.localizacao.latitude = parseFloat(teste['latitude']);
      this.localizacao.longitude = parseFloat(teste['longitude']);
    });


  }

  callbackLocalizacao(data: any) {
    let localizacao: LocalizacaoFireBase = new LocalizacaoFireBase();
    localizacao = data;
    return localizacao;
  }

  private parseLocalizacao(snapshot: any) {
    const { latitude, longitude, usuario } = snapshot.val();
    const { key: _id } = snapshot;
    const message = { latitude, longitude, usuario };
    return message;
  };

  onUpload(event: any) {
    for (let file of event.files) {
      this.imagem = file;
    }

    const storage = getStorage();
    var id = Math.floor(Date.now() * Math.random()).toString(36);
    var ext = this.imagem.type.split('/', 3)[1];
    var nome = id + '.' + ext;
    var nomeStorage = "chat/" + this.idBancoFirebase + "/" + nome;
    const storageRef = refStorage(storage, nomeStorage);

    const uploadTask = uploadBytesResumable(storageRef, this.imagem);

    uploadTask.on('state_changed',
      (snapshot) => {
      },
      (error) => {
        switch (error.code) {
          case 'storage/unauthorized':
            console.error('storage/unauthorized - ', error);
            break;
          case 'storage/canceled':
            console.error('storage/canceled - ', error);
            break;
          case 'storage/unknown':
            console.error('storage/unknown - ', error);
            break;
        }
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          this.imagemEnviar = downloadURL;
          this.enviarMensagem();
          location.reload();
        });
      }
    );

    this.messageService.add({ severity: 'info', summary: 'Arquivo carregado' });
  }

  onUploadPdf(event: any) {
    const file:File = event.files[0];
 
    const storage = getStorage();
    var id = Math.floor(Date.now() * Math.random()).toString(36);
    var nome = id + '.pdf';
    var nomeStorage = "chat/" + this.idBancoFirebase + "/" + nome;
    const storageRef = refStorage(storage, nomeStorage);

    const uploadTask = uploadBytesResumable(storageRef, file);
    
    uploadTask.on('state_changed',
      (snapshot) => {
      },
      (error) => {
        switch (error.code) {
          case 'storage/unauthorized':
            console.error('storage/unauthorized - ', error);
            break;
          case 'storage/canceled':
            console.error('storage/canceled - ', error);
            break;
          case 'storage/unknown':
            console.error('storage/unknown - ', error);
            break;
        }
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          this.mensagemEnviar = downloadURL;
          this.enviarMensagem();
          location.reload();
        });
      }
    );

    this.messageService.add({ severity: 'info', summary: 'Arquivo carregado' });
  }

  public relatorioOco(): void {
    if (this.relatorioOcorrencia) {
      this.relatorioOcorrencia = false;
    } else this.relatorioOcorrencia = true;
  }

  public download(): void {
    this.carregandoDoc = true;
    let observacoes = ""
    this.relatorioService.read(this.idBancoFirebase).subscribe((data: HistoricoFirebase[]) => {
      let prestador = "";
      for (let a of data) {
        if (a.user!.tipoTenancy! === 3) {
          prestador = a.user!.name!;
          break;
        }
      }

      data.forEach((url) => {
        if (url.image != '') {
          this.urls.push(url.image!)
        }
      })

      this.carregandoDoc = false;
      const teste = data[0].bufferImagem;
      const documentCreator = new DocumentCreator();
      const doc = documentCreator.create(this.idBancoFirebase, data, this.observacoesRelatorio,
        this.ocorrencia!.numeroProcesso, this.ocorrencia!.tenancyCliente!.nome, this.ocorrencia!.motivo, prestador, this.ocorrencia!.observacoes);

      Packer.toBlob(doc).then(blob => {
        saveAs(blob, `Relatório ocorrencia - ` + this.ocorrencia!.idCentral);
        this.observacoesRelatorio = "";
        this.relatorioOcorrencia = false;
        this.downloadAsZip();
      });

    }, error => {

    }, () => {

    })

  }

  downloadAsZip(): void {
    let count = 0;
    const zip = new JSZip();

    this.urls.forEach((url) => {
        const split = url.split('/')[url.split('/').length - 1];
        const filename = split.split('?')[0]
        JSZipUtils.getBinaryContent(url, (err, data) => {
          if (err) {
            console.log(err)
            throw err;
          }

          zip.file(filename, data, { binary: true });
          count++;

          if (count === this.urls.length) {
            zip.generateAsync({ type: 'blob' }).then((content) => {
              const objectUrl: string = URL.createObjectURL(content);
              const link: any = document.createElement('a');

              link.download = `Imagens da ocorrencia - ` + this.ocorrencia!.idCentral;
              link.href = objectUrl;
              link.click();
            });
          }
        });
      

    });
  }

  isVideo(message: any){
    if(message  && message.includes('mp4')){
      return true;
    }else{return false}
  }

  isImage(message: any){
    if(message  && message.includes('mp4')){
      return false;
    }else{return true}
  }

  isPdf(message: any){
    if(message.includes('com.android.providers.media.documents') || message.includes('.pdf')){
      return true;
    }else return false;

  }

  abrirPdf(message:any){
    window.open(message, "_blank");
  }




}


