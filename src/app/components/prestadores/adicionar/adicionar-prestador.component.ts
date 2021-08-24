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
import {FileUploadModule} from 'primeng/fileupload';
import {HttpClientModule} from '@angular/common/http';

import { cpf, cnpj } from 'cpf-cnpj-validator'; 
import { ListaBancos } from 'src/app/model/vo/lista-bancos';


@Component({
  selector: 'adicionar-prestador',
  templateUrl: './adicionar-prestador.component.html',
  styleUrls: ['./adicionar-prestador.component.css'],
  providers: [MessageService]
})
export class AdicionarPrestadorComponent implements OnInit{

   itens = [{}]
  
   prestador: Prestador = {}

   endereco: Endereco = new Endereco();

   listaBancos: ListaBancos[] = [];

   bancoSelecionado!: ListaBancos;

   constructor(
      private messageService: MessageService, 
      private commomService: CommomService, 
      private comboService: ComboService, 
      private prestadorService: PrestadorService
   ) { }

   ngOnInit(): void {
    this.carregarCombos()
    this.commomService.getListaBancos().subscribe(dados => {
      console.log(dados);
      this.listaBancos = dados;
    });
   }

   bancoChange(event: any){
      this.bancoSelecionado = event.value;
  }
  
   buscaCep(cep: String){

      this.commomService.buscaCep(cep).subscribe((data: Endereco) => {
        console.log(data);    
        this.endereco = data;           
      }, error => {
        this.messageService.add(MessageUtils.onErrorMessage(error));                   
      } 
   ); 
    
    }

   validaDocumento(documento: string){
      if(documento != ""){
         return cpf.isValid(documento);
      }
      else return true;
        
    }

   salvar(form: NgForm){     
     this.prestador = this.parseData(form)
     this.adicionarPrestador(form);
    }      

   cancelar(){
      this.commomService.navigate(NavigationEnum.LISTAR_PRESTADORES)
   }

   carregarCombos(){
    this.itens = this.comboService.getSimNaoOptions()
   }

   private adicionarPrestador(form: NgForm){
    this.prestadorService.create(this.prestador).subscribe((data: any) => {
        this.messageService.add(MessageUtils.onSuccessMessage("O prestador foi cadastrado com sucesso"));       
      },error => {
        this.messageService.add(MessageUtils.onErrorMessage(error));        
      },() => {
        this.limpar(form);
      } 
    );      
   }

   private parseData(form: NgForm) : Prestador{
      let prestador: Prestador = {};
      prestador.nome = form.value.nome;
      prestador.cpfCnpj = form.value.cpf;
      prestador.rg = form.value.rg;
      prestador.cnh = form.value.cnh;
      prestador.categoriaCNH = form.value.categoria;
      prestador.endereco = this.getDadosEndereco(form);
      prestador.contaBancaria = this.getDadosBancarios(form);
      prestador.telefone = form.value.telefone;
      prestador.email = form.value.email;
      prestador.antenista = form.value.antenista == 1 ? "SIM" : "NAO";
      prestador.escoltaArmado = form.value.escoltaArmada == 1 ? "SIM" : "NAO";
      prestador.regSinistro = form.value.regSinistro == 1 ? "SIM" : "NAO";
      prestador.observacoes = "";
      prestador.fotoPrestador = ""
      prestador.situacao = "ATIVO";      
      return prestador;  
   }

   private getDadosEndereco(form: NgForm): Endereco{
      let endereco: Endereco = {};
      endereco.bairro = form.value.bairro;
      endereco.cep = form.value.cep;
      endereco.cidade = form.value.cidade;
      endereco.complemento = "";
      endereco.estado = form.value.estado;
      endereco.logradouro = form.value.endereco;
      endereco.numero = form.value.numero;
      endereco.pais = "BRASIL"
      return endereco;
   }

   private getDadosBancarios(form: NgForm): DadosBancarios{
     let contaBancaria: DadosBancarios = {};
     //contaBancaria.banco = form.value.banco;
     contaBancaria.banco = this.bancoSelecionado.codigo;
     contaBancaria.agencia = form.value.agencia;
     contaBancaria.conta = form.value.conta;     
     return contaBancaria;
   }

   private limpar(form: NgForm){
      form.resetForm(); 
   }

}