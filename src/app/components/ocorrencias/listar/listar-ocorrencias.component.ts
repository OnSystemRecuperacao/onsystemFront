import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NavigationEnum } from 'src/app/model/enums/navigation.enum';
import { Ocorrencia } from 'src/app/model/vo/ocorrencia';
import { CommomService } from 'src/app/services/commons/common.service';
import { OcorrenciaService } from 'src/app/services/ocorrencias/ocorrencia-service';
import MessageUtils from 'src/app/utils/message-util';
import * as FileSaver from 'file-saver';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Usuario } from 'src/app/model/vo/usuario';
import { Tenancy } from 'src/app/model/vo/tenancy';


@Component({
  selector: 'app-ocorrencias',
  templateUrl: './listar-ocorrencias.component.html',
  //styleUrls: ['./ocorrencias.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class OcorrenciasComponent implements OnInit {

  dialog: boolean = false;

  ocorrencia: Ocorrencia = {};

  ocorrencias: Ocorrencia[] = [];

  loading: boolean = true;

  usuarioLogado = new Usuario();  

  error404: boolean = false;

  position = "top";


  constructor(private messageService: MessageService, 
    private ocorrenciaService: OcorrenciaService,
    private commomService: CommomService,
    private authService: AuthService,
    private confirmationService: ConfirmationService) { }
  

  ngOnInit(): void {
    if(this.authService.jwtIsLoad()){
      this.loadUsuarioLogado();
    }
    this.listarOcorrencias()
  }

  novaOcorrencia(){
    this.commomService.navigate(NavigationEnum.NOVA_OCORRENCIA);
  };

  listarOcorrencias(){
    let idTenancy = <number> this.usuarioLogado.tenancy?.id;
    console.log('TIPO')
    console.log(this.usuarioLogado)
    if(this.usuarioLogado.tipo!.id == 2){
      this.ocorrenciaService.readByCliente(idTenancy).subscribe(response => {
        this.ocorrencias = response; 
        this.loading = false;      
      },error => {
        if(error.includes('404')){
          this.messageService.add(MessageUtils.onErrorMessage("Cliente não possui Ocorrências"));
          this.error404 = true;
          this.loading = false;
        }
      })
    }else{
      this.ocorrenciaService.read().subscribe(response => {
        this.ocorrencias = response; 
        this.loading = false;      
      },error => {
        if(error.includes('404')){
          this.messageService.add(MessageUtils.onErrorMessage("Cliente não possui Ocorrências"));
          this.error404 = true;
          this.loading = false;
        }
      })
    }
   
  }

  visualizar(ocorrencia: Ocorrencia){ 
    this.ocorrencia = ocorrencia;
    console.log(ocorrencia);
    let id = <number> this.ocorrencia.id;
    console.log("VISUALIZAR - " + id);
    this.commomService.navigateWithParams(NavigationEnum.VISUALIZAR_OCORRENCIA, id);
  }

  deletar(ocorrencia: Ocorrencia){        
    this.confirmationService.confirm({
        message: 'Tem certeza que deseja remover a ocorrência ' + ocorrencia.idCentral + ' ?',
        header: 'Confirmação',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.removerOcorrencia(ocorrencia);                
        },          
        key: "positionDialog"
    });
}


removerOcorrencia(ocorrencia: Ocorrencia){ 
    this.ocorrenciaService.delete(ocorrencia.id!).subscribe(response => {
      this.messageService.add(MessageUtils.onSuccessMessage("Ocorrencia excluida com sucesso"));

    }, error => {
      this.messageService.add(MessageUtils.onErrorMessage("Erro ao excluir ocorrencia"));
    })
  
  }


exportExcel() {
    import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(this.ocorrencias);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, "ocorrencias");
    });
}

saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
}

private loadUsuarioLogado(){
  if(this.authService.jwtIsLoad()){
    let idTenancy =  <number> this.authService.getUsuarioLogado().id_tenancy
    this.usuarioLogado.id = this.authService.getUsuarioLogado().id_usuario;
    this.usuarioLogado.tipo = this.authService.getUsuarioLogado().tipo_tenancy
    this.usuarioLogado.tenancy = new Tenancy(idTenancy);

  }
}
reload(){
  this.commomService.reloadComponent();
}

}
