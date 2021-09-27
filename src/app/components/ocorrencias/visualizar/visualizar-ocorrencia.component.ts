import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ComboService } from 'src/app/services/combos/combo.service';
import { PrestadorService } from 'src/app/services/prestadores/prestador-service';
import {MessageService} from 'primeng/api';
import  MessageUtils from 'src/app/utils/message-util';
import { CommomService } from 'src/app/services/commons/common.service';
import { NavigationEnum } from 'src/app/model/enums/navigation.enum';
import { FormBuilder, FormGroup, NgForm, Validators  } from '@angular/forms';
import { Prestador } from 'src/app/model/vo/prestador';
import { Endereco } from 'src/app/model/vo/endereco';
import { DadosBancarios } from 'src/app/model/vo/dados-bancarios';
import { ClienteService } from 'src/app/services/clientes/cliente-service';
import { Cliente } from 'src/app/model/vo/cliente';
import { ActivatedRoute } from '@angular/router';
import Utils from 'src/app/utils/utils';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { cpf, cnpj } from 'cpf-cnpj-validator'; 
import { ListaBancos } from 'src/app/model/vo/lista-bancos';
import { InteracaoOcorrencia } from 'src/app/model/vo/interacao-ocorrencia';
import { InteracaoService } from 'src/app/services/interacaoOcorrencia/interacao-service';
import { Ocorrencia } from 'src/app/model/vo/ocorrencia';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Usuario } from 'src/app/model/vo/usuario';
import { Tenancy } from 'src/app/model/vo/tenancy';
import { OcorrenciaService } from 'src/app/services/ocorrencias/ocorrencia-service';

import * as firebase from 'firebase/app';
import * as database from 'firebase/database';
import { getDatabase, onValue, ref, set } from 'firebase/database';
import { ThisReceiver } from '@angular/compiler';
import { UsuarioService } from 'src/app/services/usuario/usuario-service';

export const snapshotToArray = (snapshot: any, identificacaoMsg?: any[]) => {
  const returnArr: any[] = [];

  snapshot.forEach((childSnapshot: any) => {
    identificacaoMsg?.forEach(function(i){
      if(childSnapshot.key == i){
        const item = childSnapshot.val();
        console.log("SNAP OCORRENCIA")
        console.log(childSnapshot)
        console.log(childSnapshot.key)
        item.key = childSnapshot.key;
        returnArr.push(item);
      }
    })
    

  });

  return returnArr;
};

@Component({
  selector: 'visualizar-ocorrencia',
  templateUrl: './visualizar-ocorrencia.component.html',
  //styleUrls: ['./visualizar-ocorrencia.component.css'],
  providers: [MessageService, FormBuilder]
})
export class VisualizarOcorrenciaComponent implements OnInit{
    

    tipoPessoa = [{}];

    tipoPessoaSelecionada = 1;
     
    idOcorrencia = 0;

    ocorrencia?: Ocorrencia = {};

    cliente?: Cliente = {};

    interacaoOcorrencia: InteracaoOcorrencia[] = [];

    loading: boolean = true;

    mensagem: string = "";

    interacao: InteracaoOcorrencia = {};

    usuarioLogado = new Usuario();  

    chatForm?: FormGroup;

    chats: any[] | undefined;

    identificacaoMsg: String[] = [];

    @ViewChild('chatcontent') chatcontent: ElementRef | undefined;
    
    scrolltop: number = 0;

    roomname = '';

    ngOnInit() {
        this.buscarOcorrencia();
        if(this.authService.jwtIsLoad()){
          this.loadUsuarioLogado();
        }

        this.chatForm = this.formBuilder.group({
          'message' : [null, Validators.required]
        });

      this.buscarMensagens();

     
    }

    constructor(
        private messageService: MessageService, 
        private commomService: CommomService, 
        private comboService: ComboService, 
        private interacaoService: InteracaoService,
        private route: ActivatedRoute,
        private authService: AuthService,
        private ocorrenciaService: OcorrenciaService,
        private formBuilder: FormBuilder,
        private usuarioService: UsuarioService
     ) { 

      const db = getDatabase();
      const starCountRef = ref(db, '/ocorrencia');
      onValue(starCountRef, (snapshot) => {
        this.chats = [];
        this.chats = snapshotToArray(snapshot, this.identificacaoMsg);
       
      });
       
     }

     writeUserData() {
      const db = getDatabase();
      var date = new Date().toString();
      console.log(date);

      set(ref(db, 'ocorrencia/' + this.ocorrencia?.id + '/' + date), {
        username:  this.usuarioLogado.nome,
        email:  this.usuarioLogado.email,
        message: 'teste5',
        idOcorrencia: this.ocorrencia?.id
        //profile_picture : imageUrl
      });
    }

  
    validaMensagem(idOcorrencia: string){
      return this.ocorrencia?.id?.toString() == idOcorrencia;

    }

    buscarMensagens() {
      let idOcorrencia  = <number> this.route.snapshot.params['id'];
      const db = getDatabase();
      const starCountRef = ref(db, '/ocorrencia');
      onValue(starCountRef, (snapshot) => {
        this.chats = [];
        this.chats = snapshotToArray(snapshot, this.identificacaoMsg);
        //setTimeout(() => this.scrolltop = this.chatcontent.nativeElement.scrollHeight, 500);
      });
    }


  
    tipoPessoaChange(event: any){
        this.tipoPessoaSelecionada = event.value;
    }
 

    private buscarOcorrencia(){
      //let idOcorrencia = <number> this.route.snapshot.params['id'];
      console.log(<number> this.route.snapshot.params['id'] + "- ID SNAP");
      let idOcorrencia  = <number> this.route.snapshot.params['id'];

      this.interacaoService.readByOcorrencia(idOcorrencia).then(response => {
           console.log(response);    
           this.interacaoOcorrencia = response;
           console.log(this.cliente); 
                      
         }, error => {
           this.messageService.add(MessageUtils.onErrorMessage(error));                   
         } 
      ); 

      this.ocorrenciaService.readById(idOcorrencia).then(response => {
        console.log(response);    
        this.ocorrencia = response;
        this.idOcorrencia = idOcorrencia;
        this.cliente = this.ocorrencia?.tenancyCliente;

        console.log(this.cliente); 
                   
      }, error => {
        this.messageService.add(MessageUtils.onErrorMessage(error));                   
      } 
   );

    this.loading = false;

    }

    salvarMensagem(){
      console.log(this.ocorrencia?.id);

      const db = getDatabase();
      var tipo_tenancy = <String> this.authService.getUsuarioLogado()["tipo_tenancy"].id
      var date = new Date().toString();
      var array = new Uint32Array(1);
      var newIdOcorrencia = window.crypto.getRandomValues(array).toString() + this.ocorrencia?.id;
      console.log(newIdOcorrencia);
      this.identificacaoMsg?.push(newIdOcorrencia);
      console.log("AQUI")
      
      console.log(this.identificacaoMsg)
   
      set(ref(db, 'ocorrencia/' +  newIdOcorrencia), {
        usuario:  this.usuarioLogado.nome,
        tenancy: this.usuarioLogado.tenancy?.id,
        email:  this.usuarioLogado.email,
        mensagem: this.mensagem,
        idOcorrencia: this.ocorrencia?.id,
        tipoTenancy: tipo_tenancy,
        imagem : "",
        dataHora: date
      });
      this.messageService.add(MessageUtils.onSuccessMessage("Mensagem enviada"));
      this.mensagem = "";

    //   console.log('testando chat');
    //   this.writeUserData();
    //   console.log(this.chats);
    //   let oco = new Ocorrencia();
    //   oco.id = this.ocorrencia?.id; 
    //   this.interacao.mensagem = this.mensagem;
    //   this.interacao.ocorrencia = oco;
    //   this.interacao.tipoTenancy = this.usuarioLogado.tenancy;

    //   console.log(this.interacao);

    //   this.interacaoService.create(this.interacao).subscribe((data: any) => {
    //     this.messageService.add(MessageUtils.onSuccessMessage("Mensagem enviada"));       
    //   },error => {
    //     this.messageService.add(MessageUtils.onErrorMessage(error));        
    //   },() => {
        
    //     window.location.reload();  
    //   } 
    // );
    //   this.interacao = {};
    //   this.mensagem = "";
    //   this.commomService.navigateWithParams(NavigationEnum.VISUALIZAR_OCORRENCIA, oco.id);
    //   console.log(this.mensagem);
    }

    private loadUsuarioLogado(){
      if(this.authService.jwtIsLoad()){
        let idTenancy =  <number> this.authService.getUsuarioLogado().id_tenancy
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

  
     private limpar(form: NgForm){
        form.resetForm(); 
     }
}


