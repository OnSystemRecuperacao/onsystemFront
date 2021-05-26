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


@Component({
  selector: 'editar-cliente',
  templateUrl: './editar-cliente.component.html',
  styleUrls: ['./editar-cliente.component.css'],
  providers: [MessageService]
})
export class EditarClienteComponent implements OnInit{
    

    tipoPessoa = [{}];

    tipoPessoaSelecionada = 1;
     
    idCliente = 0;

    cliente = new Cliente()

    ngOnInit() {
        this.tipoPessoa = this.comboService.getTipoPessoa()
        this.buscarCliente()
    }

    constructor(
        private messageService: MessageService, 
        private commomService: CommomService, 
        private comboService: ComboService, 
        private clienteService: ClienteService,
        private route: ActivatedRoute
     ) { }


    salvar(form : NgForm){
        this.cliente = this.parseData(form);        
        this.editarCliente(form);
    }
    
    cancelar(){
       this.commomService.navigate(NavigationEnum.LISTAR_CLIENTES)
    }

    tipoPessoaChange(event: any){
        this.tipoPessoaSelecionada = event.value;
    }

    redirectToList(event: any){
      this.commomService.navigateByUrl(NavigationEnum.LISTAR_CLIENTES)
    }

    private buscarCliente(){
      let idCliente = <number> this.route.snapshot.params['id'];
      this.clienteService.readByID(idCliente).subscribe((data: Cliente) => {
           console.log(data);    
           this.cliente = data;
           this.idCliente = <number> data.idCliente
           this.cliente.telefoneCliente = Utils.leftPad(<string> this.cliente.telefoneCliente, 11);              
         }, error => {
           this.messageService.add(MessageUtils.onErrorMessage(error));                   
         } 
      );      
    }

    private editarCliente(form: NgForm){
      this.clienteService.update(this.cliente).subscribe((data: any) => {
          this.messageService.add(MessageUtils.onSuccessMessage("O cliente foi atualizado com sucesso"));       
      },error => {
          this.messageService.add(MessageUtils.onErrorMessage(error));        
      });      
    }

    private parseData(form: NgForm) : Cliente{
        let cliente: Cliente = {};
        cliente.idCliente = this.idCliente;
        cliente.contaBancaria = this.getDadosBancarios(form);
        cliente.emailCliente = form.value.email;
        cliente.endereco = this.getDadosEndereco(form);        
        cliente.informacaoContrato = form.value.informacaoContrato
        cliente.nomeCliente = form.value.nome
        cliente.nomeResponsavel = form.value.nomeResponsavel;
        cliente.numCpfCnpj = form.value.tipoPessoa == 1 ? form.value.cpf : form.value.cnpj;
        cliente.numInscricaoEstadual = form.value.numInscricaoEstadual;
        cliente.observacoesGerais = form.value.observacoes;
        cliente.telefoneCliente = form.value.telefone;
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
       return contaBancaria;
     }
  
     private limpar(form: NgForm){
        form.resetForm(); 
     }
}