import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NavigationEnum } from 'src/app/model/enums/navigation.enum';
import { Tenancy } from 'src/app/model/vo/tenancy';
import { Usuario } from 'src/app/model/vo/usuario';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommomService } from 'src/app/services/commons/common.service';
import { UsuarioService } from 'src/app/services/usuario/usuario-service';
import MessageUtils from 'src/app/utils/message-util';

@Component({
  selector: 'app-usuario',
  templateUrl: './listar-usuario.component.html',
  styleUrls: ['./listar-usuario.component.css'],
  providers: [ ConfirmationService, MessageService]
})
export class ListarUsuarioComponent implements OnInit {

  loading: boolean = true;

  usuario: Usuario = {};

  usuarios: Usuario[] = [];

  usuarioLogado = new Usuario();  

  position = "top";

  constructor(
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private commomService: CommomService,
    private messageService: MessageService,
    private usuarioService: UsuarioService  ) 
  { }

  ngOnInit(): void {
    this.loadUsuarioLogado();
    this.loading = true;
    this.listarUsuarios()   
  }

  novoUsuario(){
    this.commomService.navigate(NavigationEnum.ADICIONAR_USUARIOS)
  };

  listarUsuarios(){
    let idTenancy = <number> this.usuarioLogado.tenancy?.id;
    this.usuarioService.read(idTenancy).then(response => {
      this.usuarios = response; 
      this.loading = false;      
    }).catch(error => 
      this.messageService.add(MessageUtils.onErrorMessage(error))
    );    
  }

  ativar(usuarioSelecionado: Usuario){
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja ATIVAR o Usuário ' + usuarioSelecionado.email + ' ?',
      header: 'Confirmação',
      icon: 'pi pi-info-circle',
      accept: () => {          
          this.alterarStatusUsuario(usuarioSelecionado, true);                         
      },            
      key: "positionDialog"
    });    
  }

  desativar(usuarioSelecionado: Usuario){        
      this.confirmationService.confirm({
        message: 'Tem certeza que deseja DESATIVAR o Usuário ' + usuarioSelecionado.email + ' ?',
        header: 'Confirmação',
        icon: 'pi pi-info-circle',
        accept: () => {            
            this.alterarStatusUsuario(usuarioSelecionado, false);                
        },            
        key: "positionDialog"
      }); 
  }

  private alterarStatusUsuario(usuario: Usuario, ativar: boolean) {
    usuario.situacao = ativar ? "ATIVO" : "INATIVO";
    this.usuarioService.updateUserStatus(usuario)
      .then(response => {
        this.messageService.add(MessageUtils.onSuccessMessage("Usuário alterado com sucesso"));            
      }).catch(error => 
        this.messageService.add(MessageUtils.onErrorMessage(error))
    );
  }

  reload(){
    this.commomService.reloadComponent();
  }

  private loadUsuarioLogado(){
    if(this.authService.jwtIsLoad()){
      let idTenancy = <number> this.authService.getUsuarioLogado().id_tenancy
      this.usuarioLogado.id = this.authService.getUsuarioLogado().id_usuario;
      this.usuarioLogado.tenancy = new Tenancy(idTenancy);
    }
  }
}
