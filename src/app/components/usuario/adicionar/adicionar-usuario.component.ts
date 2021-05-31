import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ComboService } from 'src/app/services/combos/combo.service';
import { CommomService } from 'src/app/services/commons/common.service';
import { UsuarioService } from 'src/app/services/usuario/usuario-service';

@Component({
  selector: 'adicionar-usuario',
  templateUrl: './adicionar-usuario.component.html',
  styleUrls: ['./adicionar-usuario.component.css'],
  providers: [MessageService]
})
export class AdicionarUsuarioComponent implements OnInit {

  constructor(
    private messageService: MessageService, 
    private commomService: CommomService, 
    private comboService: ComboService, 
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    
  }

  salvar(form: NgForm){
    
  }

}
