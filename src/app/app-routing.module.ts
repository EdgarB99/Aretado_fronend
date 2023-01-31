import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidarUsuarioGuard } from './guards/validar-usuario.guard';
import { LandingComponent } from './landing/landing.component';

const routes: Routes =[
  {
    path:'',
    component: LandingComponent
  },
  {
    path:'auth',
    loadChildren:()=> import('./auth/auth.module').then(m=>m.AuthModule),
  },
  {
    path:'vacas-manager',
    loadChildren:()=> import('./vacas/vacas.module').then(m=>m.VacasModule),
    canLoad:[ ValidarUsuarioGuard ],
    canActivate:[ValidarUsuarioGuard]
  },
  {
    path:'**',
    redirectTo:''
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
