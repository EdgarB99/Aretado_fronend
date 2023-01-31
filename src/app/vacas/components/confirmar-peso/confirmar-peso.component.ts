import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmar-peso',
  templateUrl: './confirmar-peso.component.html',
  styleUrls: ['./confirmar-peso.component.css']
})
export class ConfirmarPesoComponent implements OnInit {

  constructor( private dialogRef:MatDialogRef<ConfirmarPesoComponent>,) { }

  ngOnInit(): void {

  }

  cerrar(){
    this.dialogRef.close();
  }

  borrar(){
    this.dialogRef.close(true);
  }

}
