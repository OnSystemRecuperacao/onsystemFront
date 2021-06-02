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

   prestador: Prestador = new Prestador()

   itens = [{}]

   antenista = 0;

   escoltaArmada = 0;
    
   constructor(
        private messageService: MessageService, 
        private commomService: CommomService, 
        private comboService: ComboService, 
        private prestadorService: PrestadorService,
        private route: ActivatedRoute
   ) { }

   ngOnInit(): void {
      this.carregarCombos();
      this.buscarPrestador();      
   }  
    
   salvar(form: NgForm){
      console.log(form); 
      let prestador = this.parseData(form)
      this.adicionarPrestador(prestador);
   }

   private adicionarPrestador(prestador: Prestador){
      this.prestadorService.update(prestador).then(response => {
         console.log(response);
       }).catch(error => {
         console.error(error)
         this.messageService.add(MessageUtils.onErrorMessage(error));   
       })
     }

   cancelar(){
      this.commomService.navigate(NavigationEnum.LISTAR_PRESTADORES)
   }

   private buscarPrestador(){
      let idPrestador = <number> this.route.snapshot.params['id'];
      this.prestadorService.readByID(idPrestador).subscribe((data: Prestador) => {
           console.log(data)
           this.prestador = data; 
           this.antenista = data.antenista == 'SIM' ? 1: 2
           this.escoltaArmada = data.regSinistro == 'SIM' ? 1: 2                
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
      prestador.id = this.prestador.id;
      prestador.nome = form.value.nome;
      prestador.cpfCnpj = form.value.cpf;
      prestador.rg = form.value.rg;
      prestador.cnh = form.value.cnh;
      prestador.categoriaCNH = form.value.categoria;
      prestador.endereco = this.getDadosEndereco(form);
      prestador.contaBancaria = this.getDadosBancarios(form);
      prestador.telefone = form.value.telefone;
      prestador.email = form.value.email;
      prestador.antenista = this.antenista == 1 ? "SIM" : "NAO";
      prestador.escoltaArmado = this.escoltaArmada == 1 ? "SIM" : "NAO";
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
     contaBancaria.banco = form.value.banco;
     contaBancaria.agencia = form.value.agencia;
     contaBancaria.conta = form.value.conta;     
     return contaBancaria;
   }

   
    
  }