import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VacasService } from '../../vacas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmarComponent } from '../../components/confirmar/confirmar.component';

@Component({
  selector: 'app-registrar-lote',
  templateUrl: './registrar-lote.component.html',
  styleUrls: ['./registrar-lote.component.css']
})



export class RegistrarLoteComponent implements OnInit {

  loteFound:boolean=false;
  usuarioId!:string;
  loteId!:string;

  formularioLotes: FormGroup = this.fb.group({
    nombreLote:['', Validators.required],
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

    if(!this.router.url.includes('editar-lote')){
      return;
    }

    this.activatedRoute.params
    .pipe(
      switchMap(({id})=> this.vacasService.getLoteById(id))
    )
    .subscribe(lote => {
      this.loteId=lote.id;
      this.formularioLotes.reset({
        nombreLote: lote.nombreLote,
        descripcion: lote.descripcion,
        usuarioId: lote.usuarioId
      })
    });


  }

  campoNoValido( campo: string ) {
    return this.formularioLotes.get(campo)?.invalid
            && this.formularioLotes.get(campo)?.touched;
  }

  registrar(){
  
    if(this.loteId){

      const dialog = this.dialog.open(ConfirmarComponent,{
        width:'350px',
      });

      dialog.afterClosed()
      .subscribe(result =>{
        if(result){
          this.vacasService.actualizarLote(this.loteId,this.formularioLotes.value)
          .subscribe(lote=>{
            this.mostrarSnackbar('Lote actualizado');
            this.usuarioId = lote.usuarioId;
            this.router.navigate([`./vacas-manager/${this.usuarioId}/lista-lotes`]);
          },error=>{
            this.loteFound=true;
          });
        }
      })
    }else{
      this.formularioLotes.get('usuarioId')?.setValue(this.usuarioId);
      this.vacasService.createLote(this.formularioLotes.value)
      .subscribe(lote=>{
        this.mostrarSnackbar('Lote registrado');
        this.usuarioId = lote.usuarioId;
        this.router.navigate([`./vacas-manager/${this.usuarioId}/lista-lotes`]);
      },error=>{
        this.loteFound=true;
      });
    }
  
  }

  mostrarSnackbar(mensaje:string){
    this.snackBar.open(mensaje,'ok!',{
      duration:2500
    });
    
  }

}
