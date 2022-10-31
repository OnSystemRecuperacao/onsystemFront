import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs/operators';
import { NavigationEnum } from 'src/app/model/enums/navigation.enum';
import { Tenancy } from 'src/app/model/vo/tenancy';
import { Usuario } from 'src/app/model/vo/usuario';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ComboService } from 'src/app/services/combos/combo.service';
import { CommomService } from 'src/app/services/commons/common.service';
import { UsuarioService } from 'src/app/services/usuario/usuario-service';
import MessageUtils from 'src/app/utils/message-util';

@Component({
  selector: 'adicionar-usuario',
  templateUrl: './adicionar-usuario.component.html',
  styleUrls: ['./adicionar-usuario.component.css'],
  providers: [MessageService]
})
export class AdicionarUsuarioComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private messageService: MessageService, 
    private commomService: CommomService,
    private usuarioService: UsuarioService,
    private comboService: ComboService
  ) { }

  usuarioLogado = new Usuario();  
  itens = [{}]

  ngOnInit(): void {
    this.itens = this.comboService.getSimNaoOptions()
    if(this.authService.jwtIsLoad()){
      this.loadUsuarioLogado();
    }
  }

  salvar(form: NgForm){   
    this.adicionarUsuario(form);    
  }

  cancelar(){
    this.commomService.navigate(NavigationEnum.LISTAR_USUARIOS)
  }

  private adicionarUsuario(form: NgForm) {
    let usuario = this.parseData(form);
    this.usuarioService.create(usuario)
      .subscribe(response => {
        this.messageService.add(MessageUtils.onSuccessMessage("Usuário adicionado com sucesso"));
        form.reset();    
      
      }, error => {
        this.messageService.add(MessageUtils.onErrorMessage(error.mensagem));
        console.log(error.mensagem)

      })
  }
  
  private parseData(form: NgForm): Usuario {
     let usuario = new Usuario();
     usuario.tenancy = this.usuarioLogado.tenancy;
     usuario.nome = form.value.nome;
     usuario.email = form.value.email;
     usuario.senha = form.value.senha;     
     usuario.admSistema = form.value.admOcorrencia == 1 ? true : false;

     return usuario;
  }

  private loadUsuarioLogado(){
    if(this.authService.jwtIsLoad()){
      let idTenancy =  <number> this.authService.getUsuarioLogado().id_tenancy
      this.usuarioLogado.id = this.authService.getUsuarioLogado().id_usuario;
      this.usuarioLogado.tenancy = new Tenancy(idTenancy);
    }
  }
  

}


