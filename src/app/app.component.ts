import { CommomService } from './services/commons/common.service';
import { initializeApp } from 'firebase/app';
import { Component } from '@angular/core';

const firebaseConfig  = {
  apiKey: "AIzaSyD8xenqqDNZODMTnYVq-OchiwQTRrvOx-A",
    authDomain: "onsystemapp-38e3c.firebaseapp.com",
    databaseURL: "https://onsystemapp-38e3c-default-rtdb.firebaseio.com",
    projectId: "onsystemapp-38e3c",
    storageBucket: "onsystemapp-38e3c.appspot.com",
    messagingSenderId: "1081485582033",
    appId: "1:1081485582033:web:e36e17ba3b0fc8d353aff0",
    measurementId: "G-875HG446BJ"
};

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
  ){
    initializeApp(firebaseConfig);
  }
  
  exibindoNavbarLogin() {
    let route = this.commomService.getRoute();
    return route !== '/login';
  }

  exibindoNavbar404() {
    let route = this.commomService.getRoute();
    return route !== '/pagina-nao-encontrada';
  }

  exibindoNavbar401() {
    let route = this.commomService.getRoute();
    return route !== '/nao-autorizado';
  }

}
