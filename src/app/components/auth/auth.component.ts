import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { NavigationEnum } from 'src/app/model/enums/navigation.enum';
import { Login } from 'src/app/model/vo/login';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommomService } from 'src/app/services/commons/common.service';
import MessageUtils from 'src/app/utils/message-util';
import { AceiteOcorrenciasComponent } from '../ocorrencias/aceite/aceite-ocorrencias.component';
import { EsqueciSenhaComponent } from '../usuario/esqueciSenha/esqueci-senha.component';

@Component({
  selector: 'auth-component',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  providers: [MessageService, DialogService]
})
export class AuthComponent implements OnInit {
  
  
  ngOnInit() {
      
  }

  constructor(    
    private messageService: MessageService,
    private commomService: CommomService,  
    private authService: AuthService,
    public dialogService: DialogService
  ) {}

  login(form: NgForm){ 
    let login = this.parseData(form);  
    this.authService.login(login).then(response => {
      this.commomService.navigate(NavigationEnum.DASHBOARD);
    }).catch(error => {
      form.value.password = null;
      this.messageService.add(MessageUtils.onErrorMessage(error));   
    })
  } 
  
  private parseData(form: NgForm) : Login{
    let login = new Login()
    login.email = form.value.email;
    login.senha = form.value.password;
    return login;
  }

  show() {
    const ref = this.dialogService.open(EsqueciSenhaComponent, {
        header: 'Esqueci minha senha',
        width: '20%'
    });
    
  }
  
    
}