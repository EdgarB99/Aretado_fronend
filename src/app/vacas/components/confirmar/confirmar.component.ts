import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Lote } from 'src/app/interface/lote.interface';
import { Raza } from 'src/app/interface/raza.interface';
import { Vaca } from 'src/app/interface/vaca.interface';


@Component({
  selector: 'app-confirmar',
  templateUrl: './confirmar.component.html',
  styleUrls: ['./confirmar.component.css']
})
export class ConfirmarComponent implements OnInit {

  constructor( private dialogRef:MatDialogRef<ConfirmarComponent>,) { }

  ngOnInit(): void {

  }

  cerrar(){
    this.dialogRef.close();
  }

  borrar(){
    this.dialogRef.close(true);
  }
}
