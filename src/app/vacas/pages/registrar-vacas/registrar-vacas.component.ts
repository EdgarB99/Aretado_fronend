import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs';
import { NameUsuarioLote } from 'src/app/interface/name-usuario-lote';
import { NameUsuarioRaza } from 'src/app/interface/name-usuario-raza';
import { VacasService } from '../../vacas.service';
import { Router } from '@angular/router';
import { MesPeso } from 'src/app/interface/mesPeso.interface';
import { CreateMesPeso } from 'src/app/interface/create-mes-peso.interface';
import * as moment from 'moment';
import { Raza } from 'src/app/interface/raza.interface';
import { CreateRaza } from 'src/app/interface/create-raza.interface';
import { ValidatorService } from '../../../shared/validator.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-registrar-vacas',
  templateUrl: './registrar-vacas.component.html',
  styleUrls: ['./registrar-vacas.component.css']
})
export class RegistrarVacasComponent implements OnInit {
  

  fechaActual = moment().format('L');
  usuarioId:string='';
  loteId:string='';
  razaId:string='';
  pesoId:string='';
  lotes!:string[];
  razas!:string[];
  datosLote!:NameUsuarioLote;
  datosRaza!:NameUsuarioRaza;
  vacaFound:boolean=false;
  mesPeso!:CreateMesPeso;

  


  formularioVacas: FormGroup = this.fb.group({
    arete:['',[Validators.required, Validators.pattern( this.validatorService.arete)]],
    fechaNacimiento:['',[Validators.required]],
    fechaIngreso:['',Validators.required],
    kg:['', [Validators.required, Validators.min(250)]],
    lb:[{disabled: true}, [Validators.required, Validators.min(550),]],
    usuarioId:[],
    loteId:['',Validators.required],
    razaId:['',Validators.required],
  });

  get areteErrorMsg(): string {
    
    const errors = this.formularioVacas.get('arete')?.errors;
    if ( errors?.['required'] ) {
      return 'El arete es obligatorio';
    } else if ( errors?.['pattern'] ) {
      return 'El valor ingresado no tiene formato de arete';
    } 
    return '';
  }

  constructor(private fb:FormBuilder,
              private vacasService:VacasService,
              private router:Router,
              private validatorService:ValidatorService,
              private snackBar:MatSnackBar,) { }

  ngOnInit(): void {
    //Extraccion de Id
    this.usuarioId = this.vacasService.decodeUsuarioFromToken();
    //Pedir todos los lotes del usuario
    this.vacasService.getLotesByUsuarioId(this.usuarioId)
    .subscribe(lotes=>{
      this.lotes = lotes.map(function(nombreLote){
        return nombreLote.nombreLote;
      });
    });

    //Pedir todas las razas del usuario
    this.vacasService.getRazasByUsuarioId(this.usuarioId)
    .subscribe(razas=>{
      this.razas = razas.map(function(nombreraza){
        return nombreraza.nombreRaza;
      });
    });

    //Cuando cambia el valor de los lotes
    this.formularioVacas.get('loteId')?.valueChanges
    .subscribe(nombreLote=>{
      this.seleccionarLote(this.usuarioId,nombreLote);
    })

    //Cuando cambia el valor de las razas
    this.formularioVacas.get('razaId')?.valueChanges
    .subscribe(nombreRaza=>{
      this.seleccionarRaza(this.usuarioId,nombreRaza);
    })

    this.formularioVacas.get('kg')?.valueChanges
    .subscribe(kg=>{
      let libras = kg * 2.205;
      this.formularioVacas.get('lb')?.setValue(libras);
    })

  }

  seleccionarLote(id:string,nombreLote:string){
     this.datosLote = {id, nombreLote}
     this.vacasService.getLoteByNameAndUsuarioId(this.datosLote)
     .subscribe(lote=>{
      this.loteId=lote.id;
     });
  }

  
  seleccionarRaza(id:string,nombreRaza:string){
    this.datosRaza = {id, nombreRaza}
    this.vacasService.getRazaByNameAndUsuarioId(this.datosRaza)
    .subscribe(raza=>{
     this.razaId=raza.id;
    });
 }

 campoNoValido( campo: string ) {
  return this.formularioVacas.get(campo)?.invalid
          && this.formularioVacas.get(campo)?.touched;
}

  registrar(){

    this.formularioVacas.get('loteId')?.setValue(this.loteId);
    this.formularioVacas.get('razaId')?.setValue(this.razaId);
    this.formularioVacas.get('usuarioId')?.setValue(this.usuarioId);   
    this.vacasService.createVaca(this.formularioVacas.value)
    .subscribe(vaca=>{
      let dia,kg,lb,vacaId; kg=vaca.kg; lb=vaca.lb; vacaId=vaca.id;
      dia=this.fechaActual;
      this.mesPeso = {dia,kg, lb, vacaId} 
      this.vacasService.createMesPeso(this.mesPeso)
      .subscribe(mesPeso=>{});
      this.router.navigate([`./vacas-manager/${this.usuarioId}/lista-aretes`]);
    }, error=>{
      console.log(error);
      this.vacaFound=true;
    });
  }

  mostrarSnackbar(mensaje:string){
    this.snackBar.open(mensaje,'ok!',{
      duration:2500
    });
  }

}
