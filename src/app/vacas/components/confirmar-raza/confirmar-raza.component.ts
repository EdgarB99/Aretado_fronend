import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmar-raza',
  templateUrl: './confirmar-raza.component.html',
  styleUrls: ['./confirmar-raza.component.css']
})
export class ConfirmarRazaComponent implements OnInit {

  constructor( private dialogRef:MatDialogRef<ConfirmarRazaComponent>,) { }

  ngOnInit(): void {

  }

  cerrar(){
    this.dialogRef.close();
  }

  borrar(){
    this.dialogRef.close(true);
  }

}
