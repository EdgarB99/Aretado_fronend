import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorService } from '../../../shared/validator.service';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Usuario } from 'src/app/interface/usuario.interface';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  id!:string;
  token!:string;
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
          //this.id=resp.id;
          //console.log(this.id);

          //Recibimos la data al iniciar sesion y extraemos el token 
          this.token = resp.token;
          console.log(this.token);
          
          if(this.token===undefined){
            this.errorMsg=true;
            this.usuarioNotFound = 'Este correo no esta registrado';
          }else{

          localStorage.setItem("token", this.token);
           const usuario : Usuario = this.authService.decodeUserFromToken(this.token);
           console.log(usuario);
           this.id = usuario.id;
           console.log("el pimche id hdspm",this.id)
           
           this.router.navigate([`./vacas-manager/${this.id}`]);

           // this.router.navigate([`./vacas-manager/${this.id}/registrar-vacas`]);
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
