import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VacasService } from '../../vacas.service';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmarRazaComponent } from '../../components/confirmar-raza/confirmar-raza.component';

@Component({
  selector: 'app-registrar-raza',
  templateUrl: './registrar-raza.component.html',
  styleUrls: ['./registrar-raza.component.css']
})
export class RegistrarRazaComponent implements OnInit {

  
  razaFound:boolean=false;
  usuarioId!:string;
  razaId!:string;
  formularioRazas: FormGroup = this.fb.group({
    nombreRaza:['', Validators.required],
    descripcion:['',Validators.required],
    usuarioId:[]
  });


  constructor(private fb:FormBuilder,
              private vacasService:VacasService,
              private router:Router,
              private activatedRoute:ActivatedRoute,
              private snackBar:MatSnackBar,
              private dialog:MatDialog) { }

  ngOnInit(): void {
    this.usuarioId = localStorage.getItem('id')!;
    if(!this.router.url.includes('editar-raza')){
      return;
    }

    this.activatedRoute.params
    .pipe(
      switchMap(({id})=> this.vacasService.getRazaById(id))
    )
    .subscribe(raza => { 
      this.razaId=raza.id;
      this.formularioRazas.reset({
        nombreRaza: raza.nombreRaza,
        descripcion: raza.descripcion,
        usuarioId: raza.usuarioId
      })
    });

  }

  campoNoValido( campo: string ) {
    return this.formularioRazas.get(campo)?.invalid
            && this.formularioRazas.get(campo)?.touched;
  }

  registrar(){
    
    if(this.razaId){
      const dialog = this.dialog.open(ConfirmarRazaComponent,{
        width:'350px',
      });

      dialog.afterClosed()
      .subscribe(result =>{
        if(result){
          this.vacasService.actualizarRaza(this.razaId,this.formularioRazas.value)
          .subscribe(raza=>{
            this.mostrarSnackbar('Raza actualizada');
            this.router.navigate([`./vacas-manager/${this.usuarioId}/lista-razas`]);
          },error=>{
            this.razaFound=true;
          });
        }
      });
    }else{
      this.formularioRazas.get('usuarioId')?.setValue(this.usuarioId);
      this.vacasService.createRaza(this.formularioRazas.value)
      .subscribe(raza=>{
        this.mostrarSnackbar('Raza creada');
        this.router.navigate([`./vacas-manager/${this.usuarioId}/lista-razas`]);
      },error=>{
        this.razaFound=true;
      });
    }
  
  }


  mostrarSnackbar(mensaje:string){
    this.snackBar.open(mensaje,'ok!',{
      duration:2500
    });
  }

}
