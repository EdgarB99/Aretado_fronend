import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Lote } from 'src/app/interface/lote.interface';
import { NameUsuarioLote } from 'src/app/interface/name-usuario-lote';
import { Vaca } from 'src/app/interface/vaca.interface';
import { VacasService } from '../../vacas.service';

@Component({
  selector: 'app-alimentacion-lote',
  templateUrl: './alimentacion-lote.component.html',
  styleUrls: ['./alimentacion-lote.component.css']
})
export class AlimentacionLoteComponent implements OnInit {

  usuarioId!:string;
  lotes!:string[];
  loteId!:string;
  vacas!:Vaca[];
  lote!:Lote;
  pesoXlote!:number[];
  pesoTotal:number=0;
  pesoTotallb:number=0;
  pesoAlimentacion:number=0;
  pesoAlimentacionlb:number=0;
  numVacas!:number;
  datosLote!:NameUsuarioLote;

  formularioLote: FormGroup = this.fb.group({
    lote:['', Validators.required]
  });

  formularioCalcular: FormGroup = this.fb.group({
    factor:[20, [Validators.required, Validators.min(0), Validators.max(100)]]
  });

  constructor(private fb:FormBuilder,
              private vacasService:VacasService) { }

  ngOnInit(): void {
    this.usuarioId = localStorage.getItem('id')!;

    this.vacasService.getLotesByUsuarioId(this.usuarioId)
    .subscribe(lotes=>{
      this.lotes= lotes.map(lote=>{
        return lote.nombreLote;
      })
    })

    this.formularioLote.get('lote')?.valueChanges
    .subscribe(lote=>{
      this.pesoTotal=0;
      this.pesoAlimentacion=0;
      this.pesoTotallb=0;
      this.pesoAlimentacionlb=0;
      this.seleccionarLote(this.usuarioId,lote)
    })

  }


  seleccionarLote(id:string,nombreLote:string){
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
      this.vacas = vacas;
      this.numVacas = vacas.length;
      this.pesoXlote = vacas.map(peso=>{
        return peso.kg;
      });
      for (let i = 0; i < this.pesoXlote.length; i++) {
        this.pesoTotal = this.pesoTotal + this.pesoXlote[i] ;    
      }
      this.pesoTotallb = this.pesoTotal * 2.205;      
      
      this.pesoAlimentacion =(this.formularioCalcular.get('factor')?.value * this.pesoTotal)/100;
      this.pesoAlimentacionlb = this.pesoAlimentacion * 2.205;
    });
  }

  campoNoValido( campo: string ) {
    return this.formularioCalcular.get(campo)?.invalid
            && this.formularioCalcular.get(campo)?.touched;
  }

  calcular(){
    this.pesoAlimentacion = (this.formularioCalcular.get('factor')?.value * this.pesoTotal)/100;
    this.pesoAlimentacionlb = this.pesoAlimentacion * 2.205;
  }

}
