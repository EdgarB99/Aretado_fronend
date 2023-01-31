import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/interface/usuario.interface';
import { ValidatorService } from 'src/app/shared/validator.service';
import { AuthService } from '../../auth.service';
import { VacasService } from '../../../vacas/vacas.service';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  usuario!:Usuario;
  emailFound:boolean=false;

  formularioUsuarios: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellidoPaterno: ['', [Validators.required, Validators.minLength(2)]],
    apellidoMaterno: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.pattern( this.validatorService.emailPattern)] ],
    password: ['', [Validators.required, Validators.minLength(6)]],
    password2: ['', [Validators.required, Validators.minLength(6)]],
  },
  {
    validators: [ this.validatorService.camposIguales('password','password2')]
  });

  get emailErrorMsg(): string {
    
    const errors = this.formularioUsuarios.get('email')?.errors;
    if ( errors?.['required'] ) {
      return 'Email es obligatorio';
    } else if ( errors?.['pattern'] ) {
      return 'El valor ingresado no tiene formato de correo';
    } else if ( errors?.['emailTomado'] ) {
      return 'El email ya fue tomado';
    }

    return '';
  }
  

  constructor(private fb: FormBuilder,
              private validatorService:ValidatorService,
              private authService:AuthService,
              private router:Router,
              private vacasService:VacasService,
              private snackBar:MatSnackBar,) { }

  ngOnInit(): void {
  }

  campoNoValido( campo: string ) {
    return this.formularioUsuarios.get(campo)?.invalid
            && this.formularioUsuarios.get(campo)?.touched;
  }

  registrar(){
    this.usuario=this.formularioUsuarios.value;
    this.authService.registrarUsuario(this.usuario)
    .subscribe(usuario => {
      this.registrarRazas(usuario.id);
      this.mostrarSnackbar('Exito! Ha logrado registrarse');
      localStorage.setItem("id", usuario.id);
          this.router.navigate([`./vacas-manager/${usuario.id}/registrar-vacas`]);
    },
    error=>{
      console.log(error);
      this.emailFound = true;
    });    

  }

  registrarRazas(usuarioId:string){
   const razasInit1 = 
    {
      nombreRaza:'Charolais',
      descripcion:
      'Esta raza europea es muy popular por la calidad de su carne que es requerida para cortes finos',
      usuarioId: usuarioId
    }

   const razasInit2 = 
    {
      nombreRaza:'BeefMaster',
      descripcion:
      'Esta raza proviene de Texas, Estados Unidos, y gracias a su complexión por ser cruza de Hereford, Shorthorn y Cebú, tiene una excelente adaptabilidad a los climas y hace que rinda al ser engordado.',
      usuarioId: usuarioId
    }

   const razasInit3 = 
    {
      nombreRaza:'Simmental',
      descripcion:'La raza está dentro del doble propósito (carne y leche).',
      usuarioId: usuarioId
    }
    this.vacasService.createRaza(razasInit1)
    .subscribe(raza=>{
      console.log(raza);
    });
    this.vacasService.createRaza(razasInit2)
    .subscribe(raza=>{
      console.log(raza);
    });
    this.vacasService.createRaza(razasInit3)
    .subscribe(raza=>{
      console.log(raza);
    });    
  }

  mostrarSnackbar(mensaje:string){
    this.snackBar.open(mensaje,'ok!',{
      duration:2500
    });
  }

}
