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

    interacaoOcorrencia: InteracaoOcorrencia[] = [];

    loading: boolean = true;

    endereco: Endereco = new Endereco();

    listaBancos: ListaBancos[] = [];

    bancoSelecionado!: ListaBancos;

    ngOnInit() {
        this.tipoPessoa = this.comboService.getTipoPessoa()
        this.buscarOcorrencia();
        this.commomService.getListaBancos().subscribe(dados => {
          console.log(dados);
          this.listaBancos = dados;
        });
    }

    constructor(
        private messageService: MessageService, 
        private commomService: CommomService, 
        private comboService: ComboService, 
        private interacaoService: InteracaoService,
        private route: ActivatedRoute
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
      console.log(<number> this.route.snapshot.params['id']);
      let idOcorrencia  = 28;

      this.interacaoService.readByOcorrencia(idOcorrencia).then(response => {
           console.log(response);    
           this.interacaoOcorrencia = response;
           this.loading = false;
           this.ocorrencia = this.interacaoOcorrencia[0].ocorrencia;
           this.idOcorrencia = idOcorrencia;
                      
         }, error => {
           this.messageService.add(MessageUtils.onErrorMessage(error));                   
         } 
      ); 
         
    }

    // private editarCliente(form: NgForm){
    //   this.clienteService.update(this.cliente).subscribe((data: Cliente) => {
    //       this.messageService.add(MessageUtils.onSuccessMessage("O cliente foi atualizado com sucesso"));       
    //   },error => {
    //       this.messageService.add(MessageUtils.onErrorMessage(error));        
    //   });      
    // }

    private parseData(form: NgForm) : Cliente{
        let cliente: Cliente = {};
        cliente.id =1;
        cliente.contaBancaria = this.getDadosBancarios(form);
        cliente.email = form.value.email;
        cliente.endereco = this.getDadosEndereco(form);        
        cliente.informacaoContrato = form.value.informacaoContrato
        cliente.nome = form.value.nome
        cliente.nomeResponsavel = form.value.nomeResponsavel;
        cliente.cpfCnpj = form.value.tipoPessoa == 1 ? form.value.cpf : form.value.cnpj;
        cliente.incricaoEstadual = form.value.numInscricaoEstadual;
        cliente.observacoes = form.value.observacoes;
        cliente.telefone = form.value.telefone;
        cliente.tipoPessoa = form.value.tipoPessoa;
        cliente.situacao = "ATIVO"
        return cliente;  
     }

     private getDadosEndereco(form: NgForm): Endereco{
        let endereco: Endereco = {};
        endereco.logradouro = form.value.endereco
        endereco.numero = form.value.numero
        endereco.cidade = form.value.cidade
        endereco.bairro = form.value.bairro
        endereco.cep = form.value.cep
        endereco.estado = form.value.estado;
        endereco.pais = "BRASIL"
        return endereco;
     }
  
     private getDadosBancarios(form: NgForm): DadosBancarios{
       let contaBancaria: DadosBancarios = {};
       contaBancaria.banco = this.bancoSelecionado.codigo;
       contaBancaria.agencia = form.value.agencia;
       contaBancaria.conta = form.value.conta;       
       return contaBancaria;
     }
  
     private limpar(form: NgForm){
        form.resetForm(); 
     }
}