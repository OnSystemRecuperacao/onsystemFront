import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Prestador } from '../../../model/vo/prestador';
import { PrestadorService } from 'src/app/services/prestadores/prestador-service';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import MessageUtils from 'src/app/utils/message-util';
import { CommomService } from 'src/app/services/commons/common.service';
import { NavigationEnum } from 'src/app/model/enums/navigation.enum';
import { NotAuthenticatedError } from 'src/app/interceptors/auth.http.interceptor';
import { DialogService } from 'primeng/dynamicdialog';
import { getDatabase, onChildAdded, ref } from 'firebase/database';
import { MensagemFirebase } from 'src/app/model/vo/mensagem.firebase.model';



@Component({
  selector: 'listar-prestador-inativo',
  templateUrl: './listar-prestador-inativo.component.html',
  styleUrls: ['./listar-prestador-inativo.component.css'],
  providers: [ConfirmationService, MessageService, DialogService]
})
export class ListarPrestadorInativoComponent implements OnInit {

  loading: boolean = true;

  prestador = new Prestador();

  prestadores: Prestador[] = [];

  position = "top";

  itens = [{}]
  displayBasic2: boolean = false;
  fotoCnh: string = "";
  imgResultAfterCompress: string = "";
  fotoPrestador: string = "";

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private commomService: CommomService,
    private prestadorService: PrestadorService,
    public dialogService: DialogService
  ) { }


  ngOnInit(): void {
    this.loading = true;
    this.listarPrestadoresInativos()
  }


  novoPrestador() {
    this.commomService.navigate(NavigationEnum.ADICIONAR_PRESTADORES)
  };

  reload() {
    this.commomService.reloadComponent();
  }

  listarPrestadoresInativos() {
    this.prestadorService.listarPrestadoresInativos().subscribe(data => {
      this.prestadores = data;
      this.loading = false;
    }, error => {
      console.error(error)
      if (error instanceof NotAuthenticatedError) {
        this.messageService.add(MessageUtils.onErrorMessage("Sua Sessão Expirou, faça Login Novamente"));
        this.commomService.navigate(NavigationEnum.LOGIN);
      }
      this.messageService.add(MessageUtils.onErrorMessage(error));
      this.loading = false;
    })
  }

  aprovacao(prestadorSelecionado: Prestador) {
    this.displayBasic2 = true;
    this.prestador = prestadorSelecionado;
    this.carregarCnh(this.callback);
    this.carregarFotoPerfil(this.callback)
  }

  reprovar(){
    this.displayBasic2 = false;
  }

  carregarCnh(callback: any) {
    const db = getDatabase();
    console.log("updateMessages")
    console.log("fotoCnhPrestador-" + this.prestador.id)
    const commentsRef = ref(db, "fotoCnhPrestador-" + this.prestador.id);
    onChildAdded(commentsRef, (data) => {
      let teste = callback(this.parse(data));
      console.log("DEPOIS DO BACK")
      this.fotoCnh = teste.text;
      console.log(this.fotoCnh)
    });
  }

  carregarFotoPerfil(callback: any) {
    const db = getDatabase();
    console.log("updateMessages")
    const commentsRef = ref(db, "fotoPerfilPrestador-" + this.prestador.id);
    onChildAdded(commentsRef, (data) => {
      console.log(data)
      let teste = callback(this.parse(data));
      console.log("DEPOIS DO BACK")
      this.fotoPrestador = teste.text;
      console.log(this.fotoCnh)
    });
  }


  callback(data: any) {
    console.log("CALLBACK")
    let msg: MensagemFirebase = new MensagemFirebase();
    msg = data;
    return msg;
  }

  private parse(snapshot: any) {
    const { createdAt, text } = snapshot.val();
    const { key: _id } = snapshot;
    const message = { _id, createdAt, text };
    return message;
  };

  aprovar() {
    this.prestadorService.aprovarPrestador(this.prestador.id).subscribe(response => {
      this.messageService.add(MessageUtils.onSuccessMessage("Prestador aprovado"));
    }, erro =>
      this.messageService.add(MessageUtils.onErrorMessage(erro))
    );
  }

}
