import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListarPrestadorComponent } from './components/prestadores/listar/listar-prestador.component';
import { AdicionarPrestadorComponent } from './components/prestadores/adicionar/adicionar-prestador.component';
import { OcorrenciasComponent } from './components/ocorrencias/listar/listar-ocorrencias.component';
import { NovaOcorrenciaComponent } from './components/ocorrencias/nova-ocorrencia/nova-ocorrencia.component';
import { EditarPrestadorComponent } from './components/prestadores/editar/editar-prestador.component';
import { AdicionarClienteComponent } from './components/clientes/adicionar/adicionar-cliente.component';
import { ListarClienteComponent } from './components/clientes/listar/listar-cliente.component';
import { EditarClienteComponent } from './components/clientes/editar/editar-cliente.component';
import { AuthComponent } from './components/auth/auth.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PaginaNaoEncontradaComponent } from './components/core/pagina-nao-encontrada/pagina-nao-encontrada.component';
import { ListarUsuarioComponent } from './components/usuario/listar/listar-usuario.component';
import { AdicionarUsuarioComponent } from './components/usuario/adicionar/adicionar-usuario.component';
import { AuthGuard } from './services/auth/auth.guard';
import { EditarUsuarioComponent } from './components/usuario/editar/editar-usuario.component';
import { NaoAutorizadoComponent } from './components/core/nao-autorizado/nao-autorizado.component';
import {VisualizarOcorrenciaComponent} from './components/ocorrencias/visualizar/visualizar-ocorrencia.component'

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: AuthComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { roles:['OPENCODE', 'ONSYSTEM', 'CLIENTE', 'PRESTADOR']}},
  {path: 'clientes', component: ListarClienteComponent, canActivate: [AuthGuard], data: { roles:['OPENCODE', 'ONSYSTEM']}},
  {path: 'clientes/novo', component: AdicionarClienteComponent, canActivate: [AuthGuard], data: { roles:['OPENCODE', 'ONSYSTEM']}},
  {path: 'clientes/editar/:id', component: EditarClienteComponent, canActivate: [AuthGuard], data: { roles:['OPENCODE', 'ONSYSTEM']}},
  {path: 'prestadores', component: ListarPrestadorComponent, canActivate: [AuthGuard], data: { roles:['OPENCODE', 'ONSYSTEM']}},
  {path: 'prestadores/novo', component: AdicionarPrestadorComponent, canActivate: [AuthGuard], data: { roles:['OPENCODE', 'ONSYSTEM']}},
  {path: 'prestadores/editar/:id', component: EditarPrestadorComponent, canActivate: [AuthGuard], data: { roles:['OPENCODE', 'ONSYSTEM']}},
  {path: 'ocorrencias', component: OcorrenciasComponent, canActivate: [AuthGuard], data: { roles:['OPENCODE', 'ONSYSTEM', 'CLIENTE', 'PRESTADOR']}},
  {path: 'ocorrencias/nova', component: NovaOcorrenciaComponent, canActivate: [AuthGuard], data: { roles:['OPENCODE', 'ONSYSTEM', 'CLIENTE', 'PRESTADOR']}},
  {path: 'ocorrencias/visualizar/:id', component: VisualizarOcorrenciaComponent, canActivate: [AuthGuard], data: { roles:['OPENCODE', 'ONSYSTEM', 'CLIENTE']}},

  {path: 'usuarios', component: ListarUsuarioComponent, canActivate: [AuthGuard], data: { roles:['OPENCODE', 'ONSYSTEM', 'CLIENTE', 'PRESTADOR']}},
  {path: 'usuarios/novo', component: AdicionarUsuarioComponent, canActivate: [AuthGuard], data: { roles:['OPENCODE', 'ONSYSTEM', 'CLIENTE', 'PRESTADOR']}},
  {path: 'usuarios/editar/:id', component: EditarUsuarioComponent, canActivate: [AuthGuard], data: { roles:['OPENCODE', 'ONSYSTEM', 'CLIENTE', 'PRESTADOR']}},
  {path: 'nao-autorizado', component: NaoAutorizadoComponent},  
  {path: 'pagina-nao-encontrada', component: PaginaNaoEncontradaComponent}, 
  {path: '**', redirectTo: 'pagina-nao-encontrada', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
