import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { ChartEvent } from 'chart.js/dist/core/core.plugins';
import { Lote } from 'src/app/interface/lote.interface';
import { MesPeso } from 'src/app/interface/mesPeso.interface';
import { NameUsuarioLote } from 'src/app/interface/name-usuario-lote';
import { PesoAnterior } from 'src/app/interface/peso-anterior.interface';
import { Vaca } from 'src/app/interface/vaca.interface';
import { VacasService } from '../../vacas.service';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { BaseChartDirective } from 'ng2-charts';
import * as moment from 'moment';


@Component({
  selector: 'app-reporte-lote',
  templateUrl: './reporte-lote.component.html',
  styleUrls: ['./reporte-lote.component.css']
})
export class ReporteLoteComponent implements OnInit {
  fechaActual = moment().format('L');
  usuarioId!:string;
  lotes!:string[];
  loteId!:string;
  vacas!:Vaca[];
  lote!:Lote;
  mesPeso1!:MesPeso[][];
  mesPeso2!:MesPeso[];
  pesoAnterior!:PesoAnterior[];
  pesoXmes!:number[][];
  diasMes!:string[][];
  diasIguales!:MesPeso[][];
  pesoTotalxMes:number=0;
  pesoTotalxDia:number[]=[];
  pesoXloteAnterior!:number[];
  pesoTotalAnterior:number=0;
  pesoXloteActual!:number[];
  pesoTotalActual:number=0;
  pesoAlimentacion:number=0;
  numVacas!:number;
  datosLote!:NameUsuarioLote;


  formularioLote: FormGroup = this.fb.group({
    lote:['', Validators.required]
  });

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  @ViewChild(BaseChartDirective) chart2: BaseChartDirective | undefined;
  @ViewChild(BaseChartDirective) chart3: BaseChartDirective | undefined;
 
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


  public barChartOptions3: ChartConfiguration['options'] = {
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
  public barChartType3: ChartType = 'bar';
  public barChartPlugins3 = [DataLabelsPlugin];
 
  public barChartData3: ChartData<'bar'> = {
    labels: ['Enero'],
    datasets: [
      { data: [this.pesoTotalxMes], label: 'Enero',backgroundColor: 'green', hoverBackgroundColor: 'gray' },
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
    datasets: [ { data: [], label:this.barChartLabels[0]}
  ]
  };
 
  

  constructor(private fb:FormBuilder,
              private vacasService:VacasService) { }

  ngOnInit(): void {
    this.usuarioId = this.vacasService.decodeUsuarioFromToken();
    this.vacasService.getLotesByUsuarioId(this.usuarioId)
    .subscribe(lotes=>{
      this.lotes= lotes.map(lote=>{
        return lote.nombreLote;
      })
    })

    this.formularioLote.get('lote')?.valueChanges
    .subscribe(lote=>{
      this.pesoTotalActual=0;
      this.pesoTotalAnterior=0;
      
     
      this.seleccionarLote(this.usuarioId,lote)
    })
  }

  seleccionarLote(id:string,nombreLote:string){
    console.log(id,nombreLote);
    this.datosLote = {id, nombreLote}
    this.vacasService.getLoteByNameAndUsuarioId(this.datosLote)
    .subscribe(lote=>{
     this.lote = lote;
     this.loteId=lote.id;
     this.conseguirVacasByLote();
    });
 }

  conseguirVacasByLote(){
    this.vacasService.getVacasByLoteId(this.loteId)
    .subscribe(vacas =>{
      console.log(vacas);
      this.vacas = vacas;
      this.numVacas = vacas.length;
      
      this.diasMes= vacas.map(dias=>{
        return dias.mesPeso.map(dias=>{
          return dias.dia;
        })
      });

      console.log(this.diasMes);

      this.mesPeso1 = vacas.map(mespeso=>{
        return mespeso.mesPeso;
      })

      console.log('mespeso1:',this.mesPeso1);

      this.pesoXmes = this.mesPeso1.map(mespeso=>{
        return mespeso.map(peso=>{
          return  peso.kg;
        })
      })


      console.log(this.pesoXmes);

      this.pesoAnterior = vacas.map(pesoAnterior=>{
            return pesoAnterior.peso;
      })

      this.pesoAnterior = this.pesoAnterior.filter(Boolean)

      
      console.log(this.pesoAnterior);

  
      this.pesoXloteAnterior = this.pesoAnterior.map(peso=>{
          return peso.kgAnterior;
      })

      this.pesoXloteActual = vacas.map(peso=>{
        return peso.kg;
      });
      
      for (let i = 0; i < this.pesoXloteActual.length; i++) {
        this.pesoTotalActual = this.pesoTotalActual + this.pesoXloteActual[i] ;          
      }

      for (let i = 0; i < this.pesoXloteAnterior.length; i++) {
        this.pesoTotalAnterior = this.pesoTotalAnterior + this.pesoXloteAnterior[i] ;          
      }

      for (let i = 0; i < this.pesoXmes.length; i++) {
        this.pesoTotalxDia[i] = 0;
        for (let j = 0; j < this.pesoXmes[i].length; j++) {
              this.pesoTotalxDia[i] += this.pesoXmes[i][j];
              this.pesoTotalxMes += this.pesoXmes[i][j];
              console.log('pesototalxdia:',this.pesoTotalxDia[i]);
        }
      }
      console.log('pesototalmes',this.pesoTotalxMes);

      for (let i = 0; i < this.diasMes.length; i++) {
         for (let j = 0; j < this.diasMes[i].length; j++) {
              this.barChartLabels[i] = this.diasMes[i][j];
        }
      }

      console.log('peso anterior', this.pesoTotalAnterior);
      console.log('peso actual', this.pesoTotalActual);

      this.barChartData.datasets[0].data = [
        this.pesoTotalAnterior,
      ];

      this.barChartData.datasets[1].data = [
        this.pesoTotalActual
      ];

   
      this.chart?.update();

      
      this.barChartData3.datasets[0].data = [
        6
      ];

      this.chart3?.update();
  
        this.barChartData2 ={
          labels: Object.values(this.diasMes),
          datasets:[{data:Object.values(this.pesoTotalxDia), label:'Variacion mensual', backgroundColor: 'green', hoverBackgroundColor: 'gray' }]
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
