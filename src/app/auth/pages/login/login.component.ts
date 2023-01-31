import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorService } from '../../../shared/validator.service';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  id!:string;
  errorMsg!:boolean;
  usuarioNotFound!:string;

  formularioLogin: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.pattern( this.validatorService.emailPattern )]], 
    password:['', [Validators.required]]
  })

  get emailErrorMsg(): string {
    const errors = this.formularioLogin.get('email')?.errors;
    if ( errors?.['required'] ) {
      return 'Email es obligatorio';
    } else if ( errors?.['pattern'] ) {
      return 'El valor ingresado no tiene formato de correo';
    } 

    return '';
  }

  constructor(private fb:FormBuilder,
              private validatorService:ValidatorService,
              //private emailValidator: EmailValidatorService,
              private router:Router,
              private authService:AuthService,
              private snackBar:MatSnackBar) { }

  ngOnInit(): void {
  }

  campoNoValido( campo: string ) {
    return this.formularioLogin.get(campo)?.invalid
            && this.formularioLogin.get(campo)?.touched;
  }

  login(){
        this.authService.getAuth(this.formularioLogin.value)
        .subscribe(resp=>{
          if(resp)
          this.id=resp.id;
          console.log(this.id);
          if(this.id===undefined){
            this.errorMsg=true;
            this.usuarioNotFound = 'Este correo no esta registrado';
          }else{
          localStorage.setItem("id", this.id);
          this.router.navigate([`./vacas-manager/${this.id}/registrar-vacas`]);
          }
        }, error=>{
          this.errorMsg=true;
          this.usuarioNotFound='Contraseña incorrecta';
        });
  }

  mostrarSnackbar(mensaje:string){
    this.snackBar.open(mensaje,'ok!',{
      duration:2500
    });
  }


}
