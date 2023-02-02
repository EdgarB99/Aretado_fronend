import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Lote } from 'src/app/interface/lote.interface';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { VacasService } from '../../vacas.service';

@Component({
  selector: 'app-lista-lotes',
  templateUrl: './lista-lotes.component.html',
  styleUrls: ['./lista-lotes.component.css']
})
export class ListaLotesComponent implements AfterViewInit, OnInit {

  lotes!:Lote[];
  usuarioId!:string;

  constructor( private vacasService:VacasService,
               private router: Router){}

  ngOnInit() {

    this.usuarioId = this.vacasService.decodeUsuarioFromToken();
    this.vacasService.getLotesByUsuarioId(this.usuarioId)
    .subscribe(lotes=>{
      this.lotes=lotes;
      this.dataSource.data = this.lotes;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  displayedColumns: string[] = ['nombreLote','descripcion','id'];
  dataSource = new MatTableDataSource<Lote>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  navegarToAgregarLote(){
    this.router.navigate([`./vacas-manager/${this.usuarioId}/registrar-lote`]);
  }

  editar(id:string){
    this.router.navigate([`./vacas-manager/${this.usuarioId}/editar-lote/${id}`]);
  }

}
