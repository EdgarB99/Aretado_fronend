import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AreteUsuario } from 'src/app/interface/arete-usuario.interface';
import { VacasService } from '../../vacas.service';
import { PesoAnterior } from '../../../interface/peso-anterior.interface';
import { MesPeso } from 'src/app/interface/mesPeso.interface';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType, ChartData } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { ChartEvent } from 'chart.js/dist/core/core.plugins';
import * as moment from 'moment';

@Component({
  selector: 'app-reporte-vaca',
  templateUrl: './reporte-vaca.component.html',
  styleUrls: ['./reporte-vaca.component.css']
})
export class ReporteVacaComponent implements OnInit {

  fechaActual = moment().format('L');
  usuarioId!:string;
  aretes!:string[];
  datosVaca!:AreteUsuario;
  pesoAnterior!:PesoAnterior;
  pesoTotalActual:number=0;
  pesoTotalAnterior:number=0;
  mesPeso!:MesPeso[];
  pesoXdia!:number[];
  dias!:string[];
  formularioArete: FormGroup = this.fb.group({
    arete:['', Validators.required]
  });

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  @ViewChild(BaseChartDirective) chart2: BaseChartDirective | undefined;
 
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio:false,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 10,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [DataLabelsPlugin];
 
  public barChartData: ChartData<'bar'> = {
    labels: [this.fechaActual],
    datasets: [
      { data: [this.pesoTotalAnterior], label: 'Peso Anterior',backgroundColor: '#004173', hoverBackgroundColor: 'gray' },
      { data: [this.pesoTotalActual], label: 'Peso Actual', backgroundColor: 'green', hoverBackgroundColor: 'gray' },
    ],
  };


  public barChartOptions2: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio:false,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 10,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };

  public barChartLabels: string[] =  []
  public barChartType2: ChartType = 'bar';
  public barChartPlugins2 = [DataLabelsPlugin];
 
  public barChartData2: ChartData<'bar'> = {
    labels: this.barChartLabels,
    datasets: [ { data: [], label:this.barChartLabels[0] , backgroundColor: 'green', hoverBackgroundColor: 'gray'}
  ]
  };




  constructor(private fb:FormBuilder,
              private vacasService:VacasService) { }

  ngOnInit(): void {
    this.usuarioId = localStorage.getItem('id')!;

    this.vacasService.getVacasByUsuarioId(this.usuarioId)
    .subscribe(vacas=>{
      this.aretes= vacas.map(arete=>{
        return arete.arete;
      })
    })


    this.formularioArete.get('arete')?.valueChanges
  .subscribe(arete=>{
    this.seleccionarArete(this.usuarioId,arete)
  });
  }

  

  seleccionarArete(id:string,arete:string){
    this.datosVaca = {arete,id}
    this.vacasService.getVacaByAreteAndUsuarioId(this.datosVaca)
    .subscribe(vaca=>{
      this.pesoTotalAnterior = 0;
      this.pesoAnterior = vaca.peso;
      this.pesoTotalActual = vaca.kg
      if(this.pesoAnterior != null)
        this.pesoTotalAnterior = this.pesoAnterior.kgAnterior;
      this.mesPeso=vaca.mesPeso;
      
      this.dias = this.mesPeso.map(dias=>{
        return dias.dia;
      });
      
      this.pesoXdia = this.mesPeso.map(peso=>{
        return peso.kg;
      });


      this.barChartData.datasets[0].data = [
        this.pesoTotalAnterior,
      ];

      
      this.barChartData.datasets[1].data = [
        this.pesoTotalActual
      ];

      this.chart?.update();

      this.barChartData2 ={
        labels: Object.values(this.dias),
        datasets:[{data:Object.values(this.pesoXdia), label:'Variacion mensual', backgroundColor: 'green', hoverBackgroundColor: 'gray' }]
      }
    }, error =>{
      
      this.barChartData.datasets[0].data = [
        0,
        0
      ];

      this.barChartData.datasets[1].data = [
        0,
        0
      ];

      this.chart?.update();

      this.barChartData2 ={
        labels: Object.values(''),
        datasets:[{data:Object.values(0), label:'' }]
      }

    });

 }



     // events
     public chartClicked({
      event,
      active,
    }: {
      event?: ChartEvent;
      active?: {}[];
    }): void {
      //console.log(event, active);
    }
   
    public chartHovered({
      event,
      active,
    }: {
      event?: ChartEvent;
      active?: {}[];
    }): void {
      //console.log(event, active);
    }


}
