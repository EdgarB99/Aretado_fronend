import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { VacasService } from '../../vacas.service';
import { Router } from '@angular/router';
import { Raza } from '../../../interface/raza.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-lista-razas',
  templateUrl: './lista-razas.component.html',
  styleUrls: ['./lista-razas.component.css']
})
export class ListaRazasComponent implements AfterViewInit, OnInit {

  razas!:Raza[];
  usuarioId!:string;

  constructor( private vacasService:VacasService,
               private router: Router){}

  ngOnInit() {

    this.usuarioId = localStorage.getItem('id')!;
    this.vacasService.getRazasByUsuarioId(this.usuarioId)
    .subscribe(razas=>{
      this.razas=razas;
      this.dataSource.data = this.razas;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  displayedColumns: string[] = ['nombreRaza','descripcion','id'];
  dataSource = new MatTableDataSource<Raza>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  navegarToAgregarRaza(){
    this.router.navigate([`./vacas-manager/${this.usuarioId}/registrar-raza`]);
  }

  editar(id:string){
    this.router.navigate([`./vacas-manager/${this.usuarioId}/editar-raza/${id}`]);
  }


}