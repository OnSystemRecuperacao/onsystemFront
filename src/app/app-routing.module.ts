import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListarPrestadorComponent } from './components/prestadores/listar/listar-prestador.component';
import { AdicionarPrestadorComponent } from './components/prestadores/adicionar/adicionar-prestador.component';
import { OcorrenciasComponent } from './components/ocorrencias/ocorrencias.component';
import { NovaOcorrenciaComponent } from './components/ocorrencias/nova-ocorrencia/nova-ocorrencia.component';
import { EditarPrestadorComponent } from './components/prestadores/editar/editar-prestador.component';
import { AdicionarClienteComponent } from './components/clientes/adicionar/adicionar-cliente.component';
import { ListarClienteComponent } from './components/clientes/listar/listar-cliente.component';
import { EditarClienteComponent } from './components/clientes/editar/editar-cliente.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'clientes', component: ListarClienteComponent},
  {path: 'clientes/novo', component: AdicionarClienteComponent},
  {path: 'clientes/editar/:id', component: EditarClienteComponent},
  {path: 'prestadores', component: ListarPrestadorComponent},
  {path: 'prestadores/novo', component: AdicionarPrestadorComponent},
  {path: 'prestadores/editar/:id', component: EditarPrestadorComponent},
  {path: 'ocorrencias', component: OcorrenciasComponent},
  {path: 'ocorrencias/nova', component: NovaOcorrenciaComponent}  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
