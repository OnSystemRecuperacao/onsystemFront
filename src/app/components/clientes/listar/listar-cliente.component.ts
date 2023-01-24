import { Component, OnInit } from '@angular/core';
import { Prestador } from '../../../model/vo/prestador';
import { ConfirmationService, ConfirmEventType, MessageService} from 'primeng/api';
import MessageUtils from 'src/app/utils/message-util';
import { CommomService } from 'src/app/services/commons/common.service';
import { NavigationEnum } from 'src/app/model/enums/navigation.enum';
import { ComboService } from 'src/app/services/combos/combo.service';
import { ClienteService } from 'src/app/services/clientes/cliente-service';
import { Cliente } from 'src/app/model/vo/cliente';
import * as FileSaver from 'file-saver';


@Component({
  selector: 'listar-cliente',
  templateUrl: './listar-cliente.component.html',
  styleUrls: ['./listar-cliente.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class ListarClienteComponent implements OnInit{

  loading: boolean = true;

  cliente: Cliente = {};

  clientes: Cliente[] = [{}];

  exibePaginacao = false;

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
    this.commomService.navigateWithParams(NavigationEnum.EDITAR_CLIENTES, this.cliente.id)
  }

  deletar(cliente: Cliente){        
        let idCliente = <number> cliente.id
        this.confirmationService.confirm({
            message: 'Tem certeza que deseja remover o Cliente ' + cliente.nome + ' ?',
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
       this.messageService.add(MessageUtils.onErrorMessage(error));        
     }
    );
  };

  reload(){
    this.commomService.reloadComponent();
  }

  listar(){
    this.clienteService.read().subscribe(
      (data: Cliente[]) => {
        this.loading = false; 
        this.clientes = data;                 
      }, error => {
        this.messageService.add(MessageUtils.onErrorMessage(error));                 
      },() =>{
        this.exibePaginacao = this.clientes?.length > 0;  
        this.loading = false;
      } 
    );       
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(this.clientes);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, "clientes");
    });
}

saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
}
}
