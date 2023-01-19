import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { NavigationEnum } from 'src/app/model/enums/navigation.enum';
import { Tenancy } from 'src/app/model/vo/tenancy';
import { Usuario } from 'src/app/model/vo/usuario';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ComboService } from 'src/app/services/combos/combo.service';
import { CommomService } from 'src/app/services/commons/common.service';
import { UsuarioService } from 'src/app/services/usuario/usuario-service';
import MessageUtils from 'src/app/utils/message-util';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css'],
  providers: [MessageService]
})
export class EditarUsuarioComponent implements OnInit {

  usuarioLogado = new Usuario();

  usuario = new Usuario();

  situacao = [{}];

  situacaoSelecionada = 1

  constructor(
    private authService: AuthService,
    private messageService: MessageService, 
    private commomService: CommomService, 
    private comboService: ComboService, 
    private usuarioService: UsuarioService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
      this.loadUsuarioLogado();
      this.buscarUsuario();
      this.situacao =  this.comboService.getSituacao();
  }

  salvar(form: NgForm){   
    this.alterarUsuario(form);
  }

  cancelar(){
    this.commomService.navigate(NavigationEnum.LISTAR_USUARIOS)
  }

  tipoSituacaoChange(event: any){
    this.situacaoSelecionada = event.value;
  }

  private alterarUsuario(form: NgForm) {
    let user = this.parseData(form);
    this.usuarioService.updateUserStatus(user)
      .then(response => {
        this.messageService.add(MessageUtils.onSuccessMessage("Usuário alterado com sucesso"));
        this.commomService.navigate(NavigationEnum.LISTAR_USUARIOS)      
      }).catch(error => 
        this.messageService.add(MessageUtils.onErrorMessage(error))
    );
  }

  private buscarUsuario(){
    let idUsuarioParam = <number> this.route.snapshot.params['id'];
    let idUsuario = <number> idUsuarioParam;
    let idTenancy = <number> this.usuarioLogado.tenancy?.id; 
    this.usuarioService.readByID(idTenancy, idUsuario).then(response => {
          this.situacaoSelecionada = response.situacao == 'ATIVO' ? 1 : 2          
          this.usuario = response; 
    }).catch(error => 
        this.messageService.add(MessageUtils.onErrorMessage(error))
    );
  }

  private loadUsuarioLogado(){
    if(this.authService.jwtIsLoad()){
      let idTenancy =  <number> this.authService.getUsuarioLogado().id_tenancy
      this.usuarioLogado.id = this.authService.getUsuarioLogado().id_usuario;
      this.usuarioLogado.tenancy = new Tenancy(idTenancy);
    }
  }

  private parseData(form: NgForm): Usuario {
    let usuario = new Usuario();
    usuario.id = this.usuarioLogado.id;
    usuario.tenancy = this.usuarioLogado.tenancy;
    usuario.nome = form.value.nome;
    usuario.email = form.value.email;
    usuario.senha = form.value.senha;   
    usuario.situacao = this.situacaoSelecionada == 1 ? "ATIVO" : "INATIVO";
    return usuario;
 }

}
