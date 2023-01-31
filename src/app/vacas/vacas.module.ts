import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VacasRoutingModule } from './vacas-routing.module';
import { RegistrarVacasComponent } from './pages/registrar-vacas/registrar-vacas.component';
import { ActualizarPesoComponent } from './pages/actualizar-peso/actualizar-peso.component';
import { ListaAretesComponent } from './pages/lista-aretes/lista-aretes.component';
import { ListaLotesComponent } from './pages/lista-lotes/lista-lotes.component';
import { ListaRazasComponent } from './pages/lista-razas/lista-razas.component';
import { HomeComponent } from './pages/home/home.component';
import { ReporteLoteComponent } from './pages/reporte-lote/reporte-lote.component';
import { ReporteVacaComponent } from './pages/reporte-vaca/reporte-vaca.component';
import { AlimentacionLoteComponent } from './pages/alimentacion-lote/alimentacion-lote.component';
import { RegistrarRazaComponent } from './pages/registrar-raza/registrar-raza.component';
import { RegistrarLoteComponent } from './pages/registrar-lote/registrar-lote.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { ConfirmarComponent } from './components/confirmar/confirmar.component';
import { ConfirmarRazaComponent } from './components/confirmar-raza/confirmar-raza.component';
import { ConfirmarVacaComponent } from './components/confirmar-vaca/confirmar-vaca.component';
import { ConfirmarPesoComponent } from './components/confirmar-peso/confirmar-peso.component';




@NgModule({
  declarations: [
    RegistrarVacasComponent,
    ActualizarPesoComponent,
    ListaAretesComponent,
    ListaLotesComponent,
    ListaRazasComponent,
    HomeComponent,
    ReporteLoteComponent,
    ReporteVacaComponent,
    AlimentacionLoteComponent,
    RegistrarRazaComponent,
    RegistrarLoteComponent,
    ConfirmarComponent,
    ConfirmarRazaComponent,
    ConfirmarVacaComponent,
    ConfirmarPesoComponent,
  ],
  imports: [
    CommonModule,
    VacasRoutingModule, 
    MaterialModule, 
    ReactiveFormsModule,
    FormsModule,
    NgChartsModule
  ]
})
export class VacasModule { }
