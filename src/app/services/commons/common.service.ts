import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NavigationEnum } from 'src/app/model/enums/navigation.enum';
import { Endereco } from 'src/app/model/vo/endereco';
import { ListaBancos } from 'src/app/model/vo/lista-bancos';
import Utils from 'src/app/utils/utils';


@Injectable({
   providedIn: 'root',
})
export class CommomService {

   private ocorrencia = new BehaviorSubject<string>("");

   BASE_URL: string = Utils.makeURLRequest("/commons");

   // Headers
   httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
   }

   setNovaOcorrencia(oco: string) {
      this.ocorrencia.next(oco);
   }

   getNovaOcorrencia(): Observable<string> {
      return this.ocorrencia.asObservable();
   }


   buscaCep(cep: String): Observable<Endereco> {
      const url = `${this.BASE_URL}/buscarCep/${cep}`;
      return this.httpClient.get<Endereco>(url, this.httpOptions).pipe(catchError(this.handleError));

   }

   getListaBancos() {
      const url = `../../../assets/listaBancos.json`;
      return this.httpClient.get<ListaBancos[]>(url, this.httpOptions).pipe(catchError(this.handleError));
   }

   constructor(private router: Router,
      private httpClient: HttpClient) { }

   reloadComponent() {
      let currentUrl = this.router.url;
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate([currentUrl]);
   }

   getRoute(): string {
      return this.router.url
   }

   navigate(path: String) {
      this.router.navigate([path])
   }

   navigateByUrl(url: string) {
      this.router.navigateByUrl(url)
   }

   navigateWithParams(path: String, param: any) {
      this.router.navigate([path, param])
   }

   getMenuOptions(codigoTipoTencancy: number): MenuItem[] {
      return this.loadMenuItensByTenancy(codigoTipoTencancy);
   }

   getUserMenuOptions(): MenuItem[] {
      return this.loadUserMenuItens();
   }

   private loadMenuItensByTenancy(codigoTipoTencancy: number): MenuItem[] {
      let menu: MenuItem[] = [];
      if (codigoTipoTencancy == 0 || codigoTipoTencancy == 1) {
         menu = this.loadMenuItensFull();
      } else {
         menu = this.loadMenuItensClienteOrPrestadores();
      }
      return menu;
   }

   private loadMenuItensFull(): MenuItem[] {
      return [
         {
            label: 'Dashboard',
            icon: 'pi pi-fw pi-chart-line',
            routerLink: [NavigationEnum.DASHBOARD]
         },
         {
            label: 'Ocorrências',
            icon: 'pi pi-fw pi-map-marker',
            items: [
               {
                  label: 'Novo',
                  icon: 'pi pi-fw pi-plus',
                  routerLink: [NavigationEnum.NOVA_OCORRENCIA]

               },
               {
                  label: 'Listar Ocorrências',
                  icon: 'pi pi-fw pi-list',
                  routerLink: [NavigationEnum.LISTAR_OCORRENCIAS]
               }
            ]
         },
         {
            label: 'Clientes',
            icon: 'pi pi-fw pi-users',
            items: [
               {
                  label: 'Novo',
                  icon: 'pi pi-fw pi-plus',
                  routerLink: [NavigationEnum.ADICIONAR_CLIENTES]
               },
               {
                  label: 'Listar Clientes',
                  icon: 'pi pi-fw pi-list',
                  routerLink: [NavigationEnum.LISTAR_CLIENTES]
               }
            ]
         },
         {
            label: 'Prestadores',
            icon: 'pi pi-fw pi-id-card',
            items: [
               {
                  label: 'Novo',
                  icon: 'pi pi-fw pi-plus',
                  routerLink: [NavigationEnum.ADICIONAR_PRESTADORES]
               },
               {
                  label: 'Listar Prestadores',
                  icon: 'pi pi-fw pi-list',
                  routerLink: [NavigationEnum.LISTAR_PRESTADORES]
               },
               {
                  label: 'Aprovações',
                  icon: 'pi pi-fw pi-check-circle',
                  routerLink: [NavigationEnum.LISTAR_PRESTADORES_INATIVOS]
               }
            ]
         },
         {
            label: 'Usuários',
            icon: 'pi pi-fw pi-user',
            items: [
               {
                  label: 'Novo',
                  icon: 'pi pi-fw pi-plus',
                  routerLink: [NavigationEnum.ADICIONAR_USUARIOS]
               },
               {
                  label: 'Listar Usuários',
                  icon: 'pi pi-fw pi-list',
                  routerLink: [NavigationEnum.LISTAR_USUARIOS]
               }
            ]
         }

      ];
   }

   private loadMenuItensClienteOrPrestadores(): MenuItem[] {
      return [
         {
            label: 'Dashboard',
            icon: 'pi pi-fw pi-chart-line',
            routerLink: [NavigationEnum.DASHBOARD]
         },
         {
            label: 'Ocorrências',
            icon: 'pi pi-fw pi-map-marker',
            items: [
               {
                  label: 'Novo',
                  icon: 'pi pi-fw pi-plus',
                  routerLink: [NavigationEnum.NOVA_OCORRENCIA]

               },
               {
                  label: 'Listar Ocorrências',
                  icon: 'pi pi-fw pi-list',
                  routerLink: [NavigationEnum.LISTAR_OCORRENCIAS]
               }
            ]
         },

         {
            label: 'Usuários',
            icon: 'pi pi-fw pi-user',
            items: [
               // {
               //    label:'Novo',
               //    icon:'pi pi-fw pi-plus',
               //    routerLink: [NavigationEnum.ADICIONAR_USUARIOS]
               // },
               {
                  label: 'Listar Usuários',
                  icon: 'pi pi-fw pi-list',
                  routerLink: [NavigationEnum.LISTAR_USUARIOS]
               }
            ]
         }
      ];
   }

   private loadUserMenuItens(): MenuItem[] {
      return [
         {
            label: 'Meus Dados',
            icon: 'pi pi-fw pi-user-edit',
            command: () => {
               this.navigateWithParams(NavigationEnum.EDITAR_USUARIOS, localStorage.getItem("id_usuario"))
            }

         },
         {
            label: 'Logoff',
            icon: 'pi pi-fw pi-power-off',
            command: () => {
               this.logout();
            }
         }
      ];
   }
   logout() {
      localStorage.removeItem("access_token");
      this.navigate(NavigationEnum.LOGIN)
   }

   // Manipulação de erros
   handleError(error: HttpErrorResponse) {
      let errorMessage = '';
      if (error.error instanceof ErrorEvent) {
         errorMessage = error.error.message
      } else {
         errorMessage = error.error.message
      }
      return throwError(errorMessage);
   }



}