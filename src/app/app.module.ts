import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { MenubarModule} from 'primeng/menubar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule} from 'primeng/confirmdialog';
import { DialogModule} from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule} from 'primeng/inputtextarea';
import { InputMaskModule} from 'primeng/inputmask';
import { DropdownModule} from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { BadgeModule} from 'primeng/badge';
import { DividerModule} from 'primeng/divider';
import { CardModule} from 'primeng/card';
import {PasswordModule} from 'primeng/password';
import {PanelModule} from 'primeng/panel';
import {ChartModule} from 'primeng/chart';
import {TieredMenuModule} from 'primeng/tieredmenu';
import {ProgressBarModule} from 'primeng/progressbar';


import { NavbarComponent } from './components/core/navbar/navbar.component';
import { ListarPrestadorComponent } from './components/prestadores/listar/listar-prestador.component';
import { AdicionarPrestadorComponent } from './components/prestadores/adicionar/adicionar-prestador.component';
import { OcorrenciasComponent } from './components/ocorrencias/listar/listar-ocorrencias.component'
import { AceiteOcorrenciasComponent } from './components/ocorrencias/aceite/aceite-ocorrencias.component'
import {EsqueciSenhaComponent} from './components/usuario/esqueciSenha/esqueci-senha.component'

import { NovaOcorrenciaComponent } from './components/ocorrencias/nova-ocorrencia/nova-ocorrencia.component';
import { EditarPrestadorComponent } from './components/prestadores/editar/editar-prestador.component';
import { AdicionarClienteComponent } from './components/clientes/adicionar/adicionar-cliente.component';
import { ListarClienteComponent } from './components/clientes/listar/listar-cliente.component';
import { EditarClienteComponent } from './components/clientes/editar/editar-cliente.component';
import { AuthComponent } from './components/auth/auth.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PaginaNaoEncontradaComponent } from './components/core/pagina-nao-encontrada/pagina-nao-encontrada.component';
import { ListarUsuarioComponent } from './components/usuario/listar/listar-usuario.component';
import { EditarUsuarioComponent } from './components/usuario/editar/editar-usuario.component';
import { AdicionarUsuarioComponent } from './components/usuario/adicionar/adicionar-usuario.component';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { AuthHttpInterceptor } from './interceptors/auth.http.interceptor';
import { NaoAutorizadoComponent } from './components/core/nao-autorizado/nao-autorizado.component';
import {VisualizarOcorrenciaComponent} from './components/ocorrencias/visualizar/visualizar-ocorrencia.component'
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';



export function tokenGetter(): any {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,    
    AuthComponent,
    NaoAutorizadoComponent,
    DashboardComponent,
    ListarPrestadorComponent,
    AdicionarPrestadorComponent,
    EditarPrestadorComponent,
    ListarClienteComponent,
    AdicionarClienteComponent,
    EditarClienteComponent,
    OcorrenciasComponent,
    NovaOcorrenciaComponent,
    PaginaNaoEncontradaComponent,
    ListarUsuarioComponent,
    EditarUsuarioComponent,
    AdicionarUsuarioComponent,
    VisualizarOcorrenciaComponent,
    AceiteOcorrenciasComponent,
    EsqueciSenhaComponent
  ],
  imports: [
    FileUploadModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    MenubarModule,
    ToastModule,
    ConfirmDialogModule,    
    DialogModule,
    FormsModule,
    ButtonModule,
    ToolbarModule,
    InputTextModule,
    InputNumberModule,
    InputTextareaModule,
    DropdownModule,
    InputMaskModule,
    TableModule,
    BadgeModule,
    DividerModule,
    CardModule,
    PasswordModule,
    PanelModule,
    ChartModule,
    DynamicDialogModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        // allowedDomains: ['18.223.1.99:8080'],
        // disallowedRoutes: ['http://18.223.1.99:8080/onsystem/api/v1/oauth/token']

        //allowedDomains: ['3.143.3.15:8080'],
        //disallowedRoutes: ['http://3.143.3.15:8080/onsystem/api/v1/oauth/token']

        allowedDomains: ['localhost:8080'],
        disallowedRoutes: ['http://localhost:8080/oauth/token']
      }
    }),
    TieredMenuModule,
    ProgressBarModule    
  ],  
  providers: [
    JwtHelperService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true
    }
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
