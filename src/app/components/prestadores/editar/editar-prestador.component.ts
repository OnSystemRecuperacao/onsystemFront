import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { MessageService } from "primeng/api";
import { NavigationEnum } from "src/app/model/enums/navigation.enum";
import { DadosBancarios } from "src/app/model/vo/dados-bancarios";
import { Endereco } from "src/app/model/vo/endereco";
import { Prestador } from "src/app/model/vo/prestador";
import { ComboService } from "src/app/services/combos/combo.service";
import { CommomService } from "src/app/services/commons/common.service";
import { PrestadorService } from "src/app/services/prestadores/prestador-service";
import MessageUtils from "src/app/utils/message-util";

@Component({
    selector: 'editar-prestador',
    templateUrl: './editar-prestador.component.html',
    styleUrls: ['./editar-prestador.component.css'],
    providers: [MessageService]
})
export class EditarPrestadorComponent implements OnInit{

   prestador: Prestador = {}

   itens = [{}]
    
   constructor(
        private messageService: MessageService, 
        private commomService: CommomService, 
        private comboService: ComboService, 
        private prestadorService: PrestadorService,
        private route: ActivatedRoute
   ) { }

   ngOnInit(): void {
      this.buscarPrestador();      
   }  
    
   salvar(form: NgForm){
      console.log(form); 
      this.prestador = this.parseData(form)
      //this.adicionarPrestador(form);
   }

   cancelar(){
      this.commomService.navigate(NavigationEnum.LISTAR_PRESTADORES)
   }

   private buscarPrestador(){
      let idPrestador = <number> this.route.snapshot.params['id'];
      this.prestadorService.readByID(idPrestador).subscribe((data: Prestador) => {
           console.log(data);                  
         }, error => {
           this.messageService.add(MessageUtils.onErrorMessage(error));                   
         } 
      );      
   }

   private carregarCombos(){      
      this.itens = this.comboService.getSimNaoOptions()
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