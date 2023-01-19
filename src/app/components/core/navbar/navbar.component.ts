import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommomService } from 'src/app/services/commons/common.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent  {

  constructor(
    private authService: AuthService,
    private commomService: CommomService
  ) { }


  items: MenuItem[] = [];

  userMenuItens: MenuItem[] = [];

  usuarioLogado: any;

  exibirProgressBar: boolean = false;

  ngOnInit() {
    this.loadUser();
    this.loadMenu();
  }

  private loadUser() {
    if (this.authService.getUsuarioLogado() != null) {
      this.usuarioLogado = this.authService.getUsuarioLogado()

    }
  }

  private loadMenu() {
    if (this.authService.jwtIsLoad()) {
      let codigoTipoTenancy = <number>this.authService.getUsuarioLogado()["tipo_tenancy"].id;
      if (codigoTipoTenancy != null) {
        this.items = this.commomService.getMenuOptions(codigoTipoTenancy);
        this.loadUserMenuItens();
      }
    }
  }

  private loadUserMenuItens() {
    this.userMenuItens = this.commomService.getUserMenuOptions();
  }
}
