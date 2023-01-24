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
import { cpf, cnpj } from 'cpf-cnpj-validator'; 
import { ListaBancos } from "src/app/model/vo/lista-bancos";
import { getDatabase, onChildAdded, ref } from "firebase/database";
import { MensagemFirebase } from "src/app/model/vo/mensagem.firebase.model";

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

   endereco: Endereco = new Endereco();

   listaBancos: ListaBancos[] = [];

   bancoSelecionado!: ListaBancos;

   fotoCnh: string = "";
   fotoPrestador: string = "";
    
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
      this.commomService.getListaBancos().subscribe(dados => {
         this.listaBancos = dados;
       });      
   } 
   
   bancoChange(event: any){
      this.bancoSelecionado = event.value;
  }

   validaDocumento(documento: string){
      if(documento != ""){
         return cpf.isValid(documento);
      }
      else return true;
        
    }

   salvar(form: NgForm){
      let prestador = this.parseData(form)
      this.adicionarPrestador(prestador);
   }

   private adicionarPrestador(prestador: Prestador){
     this.prestadorService.update(prestador).then(response => {
       this.messageService.add(MessageUtils.onSuccessMessage("Prestador alterado com sucesso"));         
      }).catch(erro => 
       this.messageService.add(MessageUtils.onErrorMessage(erro))
     );
   }

   redirectToList(event: any){
      this.commomService.navigateByUrl(NavigationEnum.LISTAR_PRESTADORES)
    }

   cancelar(){
      this.commomService.navigate(NavigationEnum.LISTAR_PRESTADORES)
   }

   private buscarPrestador(){
      let idPrestador = <number> this.route.snapshot.params['id'];
      
      this.prestadorService.readByID(idPrestador).subscribe((data: Prestador) => {
           this.prestador = data; 
           this.antenista = data.antenista == 'SIM' ? 1: 2
           this.escoltaArmada = data.regSinistro == 'SIM' ? 1: 2         
           this.buscarFotos(this.callback)       
         }, error => {
           this.messageService.add(MessageUtils.onErrorMessage(error));                   
         } 
      );      
   }
   buscarFotos(callback: any) {
      console.log("buscarFotos")
         const db = getDatabase();
         const commentsRefCnh = ref(db, "fotoCnhPrestador-" + this.prestador.id);
         onChildAdded(commentsRefCnh, (data) => {
           let teste = callback(this.parse(data));
           this.fotoCnh = teste.text;
         });
       
     
         const commentsRefPerfil = ref(db, "fotoPerfilPrestador-" + this.prestador.id);
         onChildAdded(commentsRefPerfil, (data) => {
           let teste = callback(this.parse(data));
           this.fotoPrestador = teste.text;
         });   
      }
      callback(data: any) {
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
      //prestador.fotoPrestador = ""
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
   //   contaBancaria.banco = this.bancoSelecionado.codigo;
   //   contaBancaria.agencia = form.value.agencia;
   //   contaBancaria.conta = form.value.conta;     

     contaBancaria.banco = this.prestador.contaBancaria?.banco;
     contaBancaria.agencia = this.prestador.contaBancaria?.agencia;
     contaBancaria.conta = this.prestador.contaBancaria?.conta; 

     return contaBancaria;
   }

   
    
  }