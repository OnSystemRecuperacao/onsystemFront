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
import { ListaBancos } from 'src/app/model/vo/lista-bancos';

import { cpf, cnpj } from 'cpf-cnpj-validator'; 


@Component({
  selector: 'adicionar-cliente',
  templateUrl: './adicionar-cliente.component.html',
  styleUrls: ['./adicionar-cliente.component.css'],
  providers: [MessageService]
})
export class AdicionarClienteComponent implements OnInit{
    

    tipoPessoa = [{}];

    tipoPessoaSelecionada = 1;

    cliente: Cliente = {}

    endereco: Endereco = new Endereco();

    listaBancos: ListaBancos[] = [];

    bancoSelecionado!: ListaBancos;

    ngOnInit() {
        this.tipoPessoa = this.comboService.getTipoPessoa();
        this.commomService.getListaBancos().subscribe(dados => {
          this.listaBancos = dados;
        });
    }

    constructor(
        private messageService: MessageService, 
        private commomService: CommomService, 
        private comboService: ComboService, 
        private clienteService: ClienteService
        
     ) { }


    salvar(form : NgForm){
        this.cliente = this.parseData(form);
        this.adicionarCliente(form);
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

  buscaCep(cep: String) {

    if (cep != "") {
      this.commomService.buscaCep(cep).subscribe((data: Endereco) => {
        this.endereco = data;
      }, error => {
        this.messageService.add(MessageUtils.onInfoMessage('CEP não encontrado'));
      }
      );
    }
  }
    
    cancelar(){
       this.commomService.navigate(NavigationEnum.LISTAR_CLIENTES)
    }

    tipoPessoaChange(event: any){
        this.tipoPessoaSelecionada = event.value;
    }

    bancoChange(event: any){
      this.bancoSelecionado = event.value;
  }

    private adicionarCliente(form: NgForm){
        this.clienteService.create(this.cliente).subscribe((data: any) => {
            this.messageService.add(MessageUtils.onSuccessMessage("O cliente foi cadastrado com sucesso"));       
          },error => {
            this.messageService.add(MessageUtils.onErrorMessage(error));        
          },() => {
            this.limpar(form);
          } 
        );      
       }

    private parseData(form: NgForm) : Cliente{
        let cliente: Cliente = {};
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
       contaBancaria.banco = form.value.banco;
       contaBancaria.agencia = form.value.agencia;
       contaBancaria.conta = form.value.conta;      
       contaBancaria.chavePix = form.value.chavePix;
       return contaBancaria;
     }
  
     private limpar(form: NgForm){
        form.resetForm(); 
     }
}