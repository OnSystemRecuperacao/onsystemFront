import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ComboService } from 'src/app/services/combos/combo.service';

@Component({
  selector: 'app-adicionar-usuario',
  templateUrl: './adicionar-usuario.component.html',
})
export class AdicionarUsuarioComponent implements OnInit {

  perfis = [{}]

  tipoPerfilSelecionado = 1;

  constructor(private comboService: ComboService,) { }

  ngOnInit(): void {
    this.perfis = this.comboService.getTPerfil();
  }

  salvar(form: NgForm){
    
  }

  tipoPerfilChange(event: any){
    this.tipoPerfilSelecionado = event.value;
}

}
