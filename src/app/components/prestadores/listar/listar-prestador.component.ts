import { Component, OnInit } from '@angular/core';
import { Prestador } from '../../../model/vo/prestador';
import { PrestadorService } from 'src/app/services/prestadores/prestador-service';
import { ConfirmationService, ConfirmEventType, MessageService} from 'primeng/api';
import MessageUtils from 'src/app/utils/message-util';
import { CommomService } from 'src/app/services/commons/common.service';
import { NavigationEnum } from 'src/app/model/enums/navigation.enum';


@Component({
  selector: 'listar-prestador',
  templateUrl: './listar-prestador.component.html',
  styleUrls: ['./listar-prestador.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class ListarPrestadorComponent implements OnInit{

  loading: boolean = true;

  prestador = new Prestador();

  prestadores: Prestador[] = [];

  position = "top";

  itens = [{}]
  
  constructor(
      private confirmationService: ConfirmationService,
      private messageService: MessageService,     
      private commomService: CommomService, 
      private prestadorService: PrestadorService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.listarPrestadores()    
  }


  editar(prestadorSelecionado: Prestador){ 
    this.prestador = prestadorSelecionado;
    this.commomService.navigateWithParams(NavigationEnum.EDITAR_PRESTADORES, this.prestador.id)
  }

  deletar(prestador: Prestador){        
        let idPrestador = <number> prestador.id
        this.confirmationService.confirm({
            message: 'Tem certeza que deseja remover o Prestador ' + prestador.nome + ' ?',
            header: 'Confirmação',
            icon: 'pi pi-info-circle',
            accept: () => {
              console.log("id prestador - " + idPrestador);
                this.removerPrestador(idPrestador);                
            },            
            key: "positionDialog"
        });
  }

  novoPrestador(){
    this.commomService.navigate(NavigationEnum.ADICIONAR_PRESTADORES)
  };

  removerPrestador(idPrestador: number) {
    this.prestadorService.delete(idPrestador).subscribe((data: any) => {  
      console.log(data);
      this.messageService.add(MessageUtils.onSuccessMessage("O registro foi excluído com sucesso !"));
     }, 
     error => {
       console.log(error);
        this.messageService.add(MessageUtils.onErrorMessage(error));        
      } 
    );
  };

  listarPrestadores(){
    this.prestadorService.read().subscribe(
      (data: Prestador[]) => {
        this.prestadores = data;
        this.loading = false;        
      }, error => {
        this.messageService.add(MessageUtils.onErrorMessage(error));
        this.loading = false;          
      } 
    );
  }


}
