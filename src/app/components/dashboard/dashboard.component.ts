import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { Prestador } from "src/app/model/vo/prestador";
import { PrestadorService } from "src/app/services/prestadores/prestador-service";

@Component({
    selector: 'dashboard-component',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    providers: [MessageService]
  })
  export class DashboardComponent implements OnInit{
    
    prestadoresData: any;

    clientesData: any;

    usuariosData: any;

    ocorrenciasData: any;

    options: any;

    prestadores: Prestador[] = [];

    constructor(
      private prestadorService: PrestadorService
    ){ }

    ngOnInit() {
      this.prestadoresData = {
        labels: [''],
        datasets: [
            {
                label: 'Ativos',
                backgroundColor: '#0056b3',
                data: [2841]
            },
            {
                label: 'Inativos',
                backgroundColor: '#E7E9ED',
                data: [2813]
            }
        ]
     };

     this.clientesData = {
      labels: [''],
      datasets: [
          {
              label: 'Ativos',
              backgroundColor: '#42A5F5',
              data: [2500]
          },
          {
              label: 'Inativos',
              backgroundColor: '#FFA726',
              data: [2130]
          }
      ]
   };

   this.usuariosData = {
    labels: [''],
    datasets: [
        {
            label: 'Ativos',
            backgroundColor: '#149b58',
            data: [3230]
        },
        {
            label: 'Inativos',
            backgroundColor: '#FFCE56',
            data: [1500]
        }
    ]
  };

  this.ocorrenciasData = {
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    datasets: [
        {
            label: 'Ocorrências Abertas',
            data: [65, 59, 80, 81, 56, 55, 40,80, 100, 0, 123, 144],
            fill: false,
            borderColor: '#ff5131'
        },
        {
            label: 'Ocorrências Fechadas',
            data: [28, 48, 40, 19, 86, 27, 90,56, 55, 40,80, 5],
            fill: true,
            borderColor: '#FFCE56',
            backgroundColor: 'rgba(255,167,38,0.2)'
        }
    ]
}

  this.options = {
    title: {
        display: false                   
    },
    legend: {
        position: 'bottom'
    }

  }





  }
  
  


  }