import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { VacasService } from '../../vacas.service';
import { Vaca } from '../../../interface/vaca.interface';

@Component({
  selector: 'app-lista-aretes',
  templateUrl: './lista-aretes.component.html',
  styleUrls: ['./lista-aretes.component.css']
})
export class ListaAretesComponent implements AfterViewInit, OnInit {

  usuarioId!:string;
  vacas!:Vaca[];

  constructor( private vacasService:VacasService,
               private router: Router){}

  ngOnInit() {
   this.usuarioId = this.vacasService.decodeUsuarioFromToken();
   this.vacasService.getVacasByUsuarioId(this.usuarioId)
   .subscribe(vacas=>{
    this.vacas = vacas;
    this.dataSource.data=this.vacas;
    this.dataSource.data.map(resp=>{
      this.vacasService.getLoteById(resp.loteId)
      .subscribe(nombre=>{
        resp.loteId = nombre.nombreLote;
      })
    }); 

    this.dataSource.data.map(resp=>{
      this.vacasService.getRazaById(resp.razaId)
      .subscribe(nombre=>{
        resp.razaId = nombre.nombreRaza;
      })
    });


    

   });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  displayedColumns: string[] = ['arete','fechaNacimiento','fechaIngreso', 'kg', 'lb', 'loteId', 'razaId'];
  dataSource = new MatTableDataSource<Vaca>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;



}