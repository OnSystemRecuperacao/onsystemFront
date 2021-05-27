import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { CommomService } from 'src/app/services/commons/common.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

   items: MenuItem[] = [];
  
   constructor(  
    private commomService: CommomService
   ){}
    
   ngOnInit() {
    this.items = this.commomService.getMenuOptions()    
   }




}
