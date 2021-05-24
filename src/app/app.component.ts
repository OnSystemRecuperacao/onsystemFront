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
  
  exibindoNavbar() {
    let route = this.commomService.getRoute();
    return route !== '/login';
  }

}
