import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VacasService } from '../../vacas.service';
import { Router } from '@angular/router';
import { Vaca } from 'src/app/interface/vaca.interface';
import { AreteUsuario } from 'src/app/interface/arete-usuario.interface';
import { Raza } from 'src/app/interface/raza.interface';
import { UpdateVaca } from 'src/app/interface/update-vaca.interface';
import { Peso } from '../../../interface/peso.interface';
import { PesoAnterior } from 'src/app/interface/peso-anterior.interface';
import { MesPeso } from 'src/app/interface/mesPeso.interface';
import * as moment from 'moment';
import { Lote } from 'src/app/interface/lote.interface';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmarPesoComponent } from '../../components/confirmar-peso/confirmar-peso.component';

@Component({
  selector: 'app-actualizar-peso',
  templateUrl: './actualizar-peso.component.html',
  styleUrls: ['./actualizar-peso.component.css']
})
export class ActualizarPesoComponent implements OnInit {
  
  usuarioId!:string;
  vacas!:string[];
  vaca!:Vaca;
  raza!:Raza;
  lote!:Lote;
  vacaId!:string;
  pesoId!:PesoAnterior;
  datosVaca!:AreteUsuario;
  updateVaca!:UpdateVaca;
  crearPesoAnt!:Peso;
  pesoAnterior!:PesoAnterior;
  kgAnterior!:number;
  lbAnterior!:number;
  vacaFound:boolean = false;
  mesPeso!:MesPeso[];
  diasMesPeso!:string[];
  fechaAct = moment().format('L');
  fechaActual = moment().format('L');  
  registroHecho:boolean=false;

  formularioArete:FormGroup = this.fb.group({
    arete:['', Validators.required]
  })

  formularioPeso: FormGroup = this.fb.group({
    dia:[],
    kg:['', Validators.required],
    lb:['', Validators.required],
    vacaId:[] 
  });
  
  constructor(private fb:FormBuilder,
              private vacasService:VacasService,
              private router:Router,
              private snackBar:MatSnackBar,
              private dialog:MatDialog) { }

  ngOnInit(): void {
    //Conseguir id del usuario;
    this.usuarioId = localStorage.getItem('id')!;

    //Conseguir todas los aretes de las vacas que contiene el usuario
    this.vacasService.getVacasByUsuarioId(this.usuarioId)
    .subscribe(vacas=>{
      this.vacas = vacas.map(function(arete){
        return arete.arete
      });
    });

    //Cuando se realizan cambios en el form del arete
    this.formularioArete.get('arete')?.valueChanges
    .subscribe(arete=>{
      this.seleccionarArete(this.usuarioId,arete);
    })

    this.formularioPeso.get('kg')?.valueChanges
    .subscribe(kg=>{
      let libras = kg * 2.205;
      this.formularioPeso.get('lb')?.setValue(libras);
    })

  }



  seleccionarArete(id:string,arete:string){
    this.registroHecho = false;
    this.datosVaca = {arete,id}
    this.vacasService.getVacaByAreteAndUsuarioId(this.datosVaca)
    .subscribe(vaca=>{
     this.vaca=vaca;
      
     this.pesoAnterior = vaca.peso 
     this.vacaId=vaca.id;

     //Conseguir los datos para el peso anterior
     this.kgAnterior=vaca.kg;
     this.lbAnterior=vaca.lb;
     this.crearPesoAnterior(this.kgAnterior,this.lbAnterior);

     //conseguir la fecha del mes 
     this.mesPeso = vaca.mesPeso;
     if(this.mesPeso !== null){
      this.diasMesPeso = this.mesPeso.map(dia=>{
        return dia.dia;
       })
      
  
       for (let i = 0; i < this.diasMesPeso.length; i++) {
            if(this.diasMesPeso[i].toString() === this.fechaActual){
                this.registroHecho=true;
            }
       }

     }
     

     //Conseguir la raza de la vaca 
     this.vacasService.getRazaById(vaca.razaId)
     .subscribe(raza=>{
        this.raza=raza;
        this.vacaFound=true;
     });

     this.vacasService.getLoteById(vaca.loteId)
     .subscribe(lote=>{
        this.lote = lote;
     })

    }, error=>{
      this.vacaFound = false;
    });
 }

 crearPesoAnterior(kgAnterior:number,lbAnterior:number){
    this.crearPesoAnt = {kgAnterior,lbAnterior}
    
 }

  campoNoValido( campo: string ) {
    return this.formularioPeso.get(campo)?.invalid
            && this.formularioPeso.get(campo)?.touched;
  }


  registrar(){

    const dialog = this.dialog.open(ConfirmarPesoComponent,{
      width:'350px',
    });

    dialog.afterClosed()
    .subscribe(result=>{
      if(result){
        if(this.pesoAnterior !== null){
          //Actualizar el peso anterior
          this.vacasService.actualizarPeso(this.pesoAnterior.id,this.crearPesoAnt)
          .subscribe(peso=>{
            this.mostrarSnackbar('Nuevo peso actualizado');
            this.pesoAnterior.kgAnterior = peso.kgAnterior;
            this.pesoAnterior.lbAnterior = peso.lbAnterior;
          });
        }else{
          //Crea el peso anterior
        this.vacasService.createPeso(this.vacaId,this.crearPesoAnt)
        .subscribe(vaca => {
          this.mostrarSnackbar('Nuevo peso actualizado');
          this.pesoAnterior = vaca.peso;
        });
        }
       
        //Crea el peso del dia por mes
        this.formularioPeso.get('dia')?.setValue(this.fechaAct);
        this.formularioPeso.get('vacaId')?.setValue(this.vacaId);
        this.vacasService.createMesPeso(this.formularioPeso.value)
        .subscribe(mespeso=>{
          this.registroHecho=true;
        });
    
        //Actualizar el peso de la vaca
        let kg,lb;
        kg = this.formularioPeso.get('kg')?.value;
        lb = this.formularioPeso.get('lb')?.value;
        this.updateVaca = {kg,lb}
    
        this.vacasService.actualiarVaca(this.vacaId,this.updateVaca)
        .subscribe(vacaUpdated=>{
          this.vaca.kg = vacaUpdated.kg!;
          this.vaca.lb = vacaUpdated.lb!;
        });
    
        this.formularioPeso.reset();
      }
    })
    
    
  }


  mostrarSnackbar(mensaje:string){
    this.snackBar.open(mensaje,'ok!',{
      duration:2500
    }); 
  }

}
