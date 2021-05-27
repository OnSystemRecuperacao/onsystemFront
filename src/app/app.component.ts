import { Component, OnInit } from '@angular/core';
import { CommomService } from './services/commons/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  title = 'onsystem-app';

  isLogin = false;

  constructor(  
    private commomService: CommomService
  ){}
  
  exibindoNavbarLogin() {
    let route = this.commomService.getRoute();
    return route !== '/login';
  }

  exibindoNavbar404() {
    let route = this.commomService.getRoute();
    return route !== '/pagina-nao-encontrada';
  }

}
