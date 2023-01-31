import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmar-vaca',
  templateUrl: './confirmar-vaca.component.html',
  styleUrls: ['./confirmar-vaca.component.css']
})
export class ConfirmarVacaComponent implements OnInit {

  constructor( private dialogRef:MatDialogRef<ConfirmarVacaComponent>,) { }

  ngOnInit(): void {

  }

  cerrar(){
    this.dialogRef.close();
  }

  borrar(){
    this.dialogRef.close(true);
  }

}
