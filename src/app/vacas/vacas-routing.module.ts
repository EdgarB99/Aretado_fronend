import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ActualizarPesoComponent } from './pages/actualizar-peso/actualizar-peso.component';
import { AlimentacionLoteComponent } from './pages/alimentacion-lote/alimentacion-lote.component';
import { ListaAretesComponent } from './pages/lista-aretes/lista-aretes.component';
import { ListaLotesComponent } from './pages/lista-lotes/lista-lotes.component';
import { ListaRazasComponent } from './pages/lista-razas/lista-razas.component';
import { RegistrarVacasComponent } from './pages/registrar-vacas/registrar-vacas.component';
import { ReporteLoteComponent } from './pages/reporte-lote/reporte-lote.component';
import { ReporteVacaComponent } from './pages/reporte-vaca/reporte-vaca.component';
import { RegistrarLoteComponent } from './pages/registrar-lote/registrar-lote.component';
import { RegistrarRazaComponent } from './pages/registrar-raza/registrar-raza.component';

const routes: Routes = [{
  path:':id',
  component:HomeComponent,
  children:[
    {
      path:'actualizar-peso',
      component: ActualizarPesoComponent
    },
    {
      path:'alimentacion',
      component: AlimentacionLoteComponent
    },
    {
      path:'lista-aretes',
      component: ListaAretesComponent
    },
    {
      path:'lista-lotes',
      component: ListaLotesComponent
    },
    {
      path:'lista-razas',
      component: ListaRazasComponent
    },
    {
      path:'registrar-vacas',
      component: RegistrarVacasComponent
    },
    {
      path:'registrar-lote',
      component: RegistrarLoteComponent
    },
    {
      path:'registrar-raza',
      component: RegistrarRazaComponent
    },
    {
      path:'editar-vaca/:id',
      component: RegistrarVacasComponent
    },
    {
      path:'editar-lote/:id',
      component: RegistrarLoteComponent
    },
    {
      path:'editar-raza/:id',
      component: RegistrarRazaComponent
    },
    {
      path:'reporte-lote',
      component: ReporteLoteComponent
    },
    {
      path:'reporte-vaca',
      component: ReporteVacaComponent
    },
    
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VacasRoutingModule { }
