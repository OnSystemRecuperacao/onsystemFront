import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Prestador } from '../../../model/vo/prestador';
import { PrestadorService } from 'src/app/services/prestadores/prestador-service';
import { ConfirmationService, ConfirmEventType, MessageService} from 'primeng/api';
import MessageUtils from 'src/app/utils/message-util';
import { CommomService } from 'src/app/services/commons/common.service';
import { NavigationEnum } from 'src/app/model/enums/navigation.enum';
import { NotAuthenticatedError } from 'src/app/interceptors/auth.http.interceptor';


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
  
  error404: boolean = false

  constructor(
      private confirmationService: ConfirmationService,
      private messageService: MessageService,     
      private commomService: CommomService, 
      private prestadorService: PrestadorService
  ) {}
  
  
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
            this.removerPrestador(idPrestador);                
          },          
          key: "positionDialog"
      });
  }

  novoPrestador(){
    this.commomService.navigate(NavigationEnum.ADICIONAR_PRESTADORES)
  };

  reload(){
    this.commomService.reloadComponent();
  }

  removerPrestador(idPrestador: number) {
    this.prestadorService.delete(idPrestador).subscribe((data: any) => {  
      this.messageService.add(MessageUtils.onSuccessMessage(data.mensagem));
    }, 
    error => {
      console.log(error);
      this.messageService.add(MessageUtils.onErrorMessage("Ocorreu um erro ao processar a requisição."));        
     } 
    );
  };

 
  listarPrestadores(){
    this.prestadorService.read().then(data => {
      this.prestadores = data;
      this.loading = false;    
    }).catch(error => {
      console.error(error)
      if(error.includes('404')){
        this.messageService.add(MessageUtils.onErrorMessage("Cliente não possui Ocorrências"));
        this.error404 = true;
        this.loading = false;
      }
      if (error instanceof NotAuthenticatedError) {
        this.messageService.add(MessageUtils.onErrorMessage("Sua Sessão Expirou, faça Login Novamente")); 
        this.commomService.navigate(NavigationEnum.LOGIN);   
      }
      this.messageService.add(MessageUtils.onErrorMessage(error));
      this.loading = false; 
    })    
  }

}
