import { Component, OnInit } from '@angular/core';
import { Prestador } from '../../../model/vo/prestador';
import { ConfirmationService, ConfirmEventType, MessageService} from 'primeng/api';
import MessageUtils from 'src/app/utils/message-util';
import { CommomService } from 'src/app/services/commons/common.service';
import { NavigationEnum } from 'src/app/model/enums/navigation.enum';
import { NgForm } from '@angular/forms';
import { ComboService } from 'src/app/services/combos/combo.service';
import { ClienteService } from 'src/app/services/clientes/cliente-service';
import { Cliente } from 'src/app/model/vo/cliente';


@Component({
  selector: 'listar-cliente',
  templateUrl: './listar-cliente.component.html',
  styleUrls: ['./listar-cliente.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class ListarClienteComponent implements OnInit{

  loading: boolean = true;

  cliente: Cliente = {};

  clientes: Cliente[] = [];

  position = "top";
    
  constructor(
      private confirmationService: ConfirmationService,
      private messageService: MessageService,
      private comboService: ComboService,  
      private commomService: CommomService, 
      private clienteService: ClienteService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.listar()    
  }


  editar(cliente: Cliente){ 
    this.cliente = cliente;
    this.commomService.navigateWithParams(NavigationEnum.EDITAR_CLIENTES, this.cliente.idCliente)
  }

  deletar(cliente: Cliente){        
        let idCliente = <number> cliente.idCliente
        this.confirmationService.confirm({
            message: 'Tem certeza que deseja remover o Cliente ' + cliente.nomeCliente + ' ?',
            header: 'Confirmação',
            icon: 'pi pi-info-circle',
            accept: () => {
              this.removerCliente(idCliente);                
            },            
            key: "positionDialog"
        });
  }

  novoCliente(){
    this.commomService.navigate(NavigationEnum.ADICIONAR_CLIENTES)
  };

  removerCliente(idCliente: number) {
    this.clienteService.delete(idCliente).subscribe((data: any) => {  
      this.messageService.add(MessageUtils.onSuccessMessage("O registro foi excluído com sucesso !"));      
     }, 
     error => {
       console.log(error);
        this.messageService.add(MessageUtils.onErrorMessage(error));        
      } 
    );
  };

  listar(){
    this.clienteService.read().subscribe(
      (data: Cliente[]) => {
        this.clientes = data;
        this.loading = false;        
      }, error => {
        this.messageService.add(MessageUtils.onErrorMessage(error));
        this.loading = false;          
      } 
    );
  }
}
