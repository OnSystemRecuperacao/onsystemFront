import { Component, OnInit } from '@angular/core';
import { ComboService } from 'src/app/services/combos/combo.service';
import { PrestadorService } from 'src/app/services/prestadores/prestador-service';
import {MessageService} from 'primeng/api';
import  MessageUtils from 'src/app/utils/message-util';
import { CommomService } from 'src/app/services/commons/common.service';
import { NavigationEnum } from 'src/app/model/enums/navigation.enum';
import { NgForm } from '@angular/forms';
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


@Component({
  selector: 'visualizar-ocorrencia',
  templateUrl: './visualizar-ocorrencia.component.html',
  //styleUrls: ['./visualizar-ocorrencia.component.css'],
  providers: [MessageService]
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

    ngOnInit() {
        this.buscarOcorrencia();
        if(this.authService.jwtIsLoad()){
          this.loadUsuarioLogado();
        }
    }

    constructor(
        private messageService: MessageService, 
        private commomService: CommomService, 
        private comboService: ComboService, 
        private interacaoService: InteracaoService,
        private route: ActivatedRoute,
        private authService: AuthService,
        private ocorrenciaService: OcorrenciaService
     ) { }

  


    // salvar(form : NgForm){
    //     this.cliente = this.parseData(form);        
    //     this.editarCliente(form);
    // }
    
    cancelar(){
       this.commomService.navigate(NavigationEnum.LISTAR_CLIENTES)
    }

    tipoPessoaChange(event: any){
        this.tipoPessoaSelecionada = event.value;
    }

    redirectToList(event: any){
      this.commomService.navigateByUrl(NavigationEnum.LISTAR_CLIENTES)
    }

    validaDocumento(documento: string, tipoPessoa: number){
      console.log(documento);
      if(tipoPessoa == 1 && documento != ""){
        return cpf.isValid(documento);
      }
      else if(tipoPessoa == 2 && documento != "") {
        return cnpj.isValid(documento);
      }
      else return true;
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
      let oco = new Ocorrencia();
      oco.id = this.ocorrencia?.id; 
      this.interacao.mensagem = this.mensagem;
      this.interacao.ocorrencia = oco;
      this.interacao.tipoTenancy = this.usuarioLogado.tenancy;

      console.log(this.interacao);

      this.interacaoService.create(this.interacao).subscribe((data: any) => {
        this.messageService.add(MessageUtils.onSuccessMessage("Mensagem enviada"));       
      },error => {
        this.messageService.add(MessageUtils.onErrorMessage(error));        
      },() => {
        this.interacao = {};
        this.mensagem = "";
        window.location.reload();  
      } 
    );
      console.log(this.mensagem);
    }

    private loadUsuarioLogado(){
      if(this.authService.jwtIsLoad()){
        let idTenancy =  <number> this.authService.getUsuarioLogado().id_tenancy
        this.usuarioLogado.id = this.authService.getUsuarioLogado().id_usuario;
        this.usuarioLogado.tenancy = new Tenancy(idTenancy);
      }
    }

  
     private limpar(form: NgForm){
        form.resetForm(); 
     }
}