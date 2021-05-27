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
import { PaginaNaoEncontradaComponent } from './components/core/pagina-nao-encontrada/pagina-nao-encontrada.component';
import { ListarUsuarioComponent } from './components/usuario/listar/listar-usuario.component';
import { AdicionarUsuarioComponent } from './components/usuario/adicionar/adicionar-usuario.component';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'clientes', component: ListarClienteComponent},
  {path: 'clientes/novo', component: AdicionarClienteComponent},
  {path: 'clientes/editar/:id', component: EditarClienteComponent},
  {path: 'prestadores', component: ListarPrestadorComponent},
  {path: 'prestadores/novo', component: AdicionarPrestadorComponent},
  {path: 'prestadores/editar/:id', component: EditarPrestadorComponent},
  {path: 'ocorrencias', component: OcorrenciasComponent},
  {path: 'ocorrencias/nova', component: NovaOcorrenciaComponent},
  {path: 'usuario', component: ListarUsuarioComponent },
  {path: 'usuario/novo', component: AdicionarUsuarioComponent },
  
  {path: 'pagina-nao-encontrada', component: PaginaNaoEncontradaComponent}, 
  {path: '**', redirectTo: 'pagina-nao-encontrada', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
