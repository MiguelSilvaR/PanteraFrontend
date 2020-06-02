import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ApartadoComponent } from "./apartado/apartado.component";
import { ApartarNuevoComponent } from "./apartar-nuevo/apartar-nuevo.component";
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { PsvComponent } from './psv/psv.component';
import { VerReservacionComponent } from './ver-reservacion/ver-reservacion.component';



const routes: Routes = [
  { path: "dashboard", component: DashboardComponent, canActivate: [AuthGuard] },
  { path: "apartado", component: ApartadoComponent, canActivate: [AuthGuard] },
  { path: "apartar-nuevo", component: ApartarNuevoComponent, canActivate: [AuthGuard] },    
  { path: "login", component: LoginComponent },
  { path: "psv", component: PsvComponent, canActivate: [AuthGuard] },
  { path: "reservacion/:id/:roomId", component: VerReservacionComponent, canActivate: [AuthGuard] },
  { path: "**", pathMatch: "full", redirectTo: "login" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
