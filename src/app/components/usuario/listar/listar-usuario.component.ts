import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NavigationEnum } from 'src/app/model/enums/navigation.enum';
import { Usuario } from 'src/app/model/vo/usuario';
import { CommomService } from 'src/app/services/commons/common.service';
import { UsuarioService } from 'src/app/services/usuario/usuario-service';
import MessageUtils from 'src/app/utils/message-util';

@Component({
  selector: 'app-usuario',
  templateUrl: './listar-usuario.component.html',
  providers: [ ConfirmationService, MessageService]
})
export class ListarUsuarioComponent implements OnInit {

  loading: boolean = true;

  usuario: Usuario = {};

  usuarios: Usuario[] = [];


  constructor(
    private confirmationService: ConfirmationService,
    private commomService: CommomService,
    private messageService: MessageService,
    private usuarioService: UsuarioService  ) 
  { }

  ngOnInit(): void {
    this.loading = true;
    this.listarUsuarios()   
  }

  novoUsuario(){
    this.commomService.navigate(NavigationEnum.ADICIONAR_USUARIO)
  };

  listarUsuarios(){
    this.usuarioService.read().subscribe(
      (data: Usuario[]) => {
        this.usuarios = data;
        this.loading = false;        
      }, error => {
        this.messageService.add(MessageUtils.onErrorMessage(error));
        this.loading = false;          
      } 
    );
  }

  editar(usuarioSelecionado: Usuario){ 
    this.usuario = usuarioSelecionado;
    this.commomService.navigateWithParams(NavigationEnum.EDITAR_PRESTADORES, this.usuario.id)
  }

  deletar(usuario: Usuario){        
        let idUsuario = <number> usuario.id
        this.confirmationService.confirm({
            message: 'Tem certeza que deseja remover o Usuário ' + usuario.email + ' ?',
            header: 'Confirmação',
            icon: 'pi pi-info-circle',
            accept: () => {
              console.log("id prestador - " + idUsuario);
                this.removerUsuario(idUsuario);                
            },            
            key: "positionDialog"
        });
  }

  removerUsuario(idUsuario: number) {
    this.usuarioService.delete(idUsuario).subscribe((data: any) => {  
      console.log(data);
      this.messageService.add(MessageUtils.onSuccessMessage("O registro foi excluído com sucesso !"));
     }, 
     error => {
       console.log(error);
        this.messageService.add(MessageUtils.onErrorMessage(error));        
      } 
    );
  };

}
