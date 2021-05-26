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


@Component({
  selector: 'adicionar-prestador',
  templateUrl: './adicionar-prestador.component.html',
  styleUrls: ['./adicionar-prestador.component.css'],
  providers: [MessageService]
})
export class AdicionarPrestadorComponent implements OnInit{

   itens = [{}]
  
   prestador: Prestador = {}

   constructor(
      private messageService: MessageService, 
      private commomService: CommomService, 
      private comboService: ComboService, 
      private prestadorService: PrestadorService
   ) { }

   ngOnInit(): void {
    this.carregarCombos()
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
      prestador.nomePrestador = form.value.nome;
      prestador.rg = form.value.rg; 
      prestador.numCpf = form.value.cpf;
      prestador.numCnh = form.value.cnh;
      prestador.categoriaCnh = form.value.categoria;
      prestador.endereco = this.getDadosEndereco(form);
      prestador.contaBancaria = this.getDadosBancarios(form);
      prestador.telefone = form.value.telefone;
      prestador.emailPrestador = form.value.email;
      prestador.antenista = form.value.antenista == 1 ? true : false;
      prestador.escoltaArmado = form.value.escoltaArmada == 1 ? true : false;
      prestador.regSinistro = false;
      prestador.dataInclusao = new Date();
      return prestador;  
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