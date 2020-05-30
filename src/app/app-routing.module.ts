import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ApartadoComponent } from "./apartado/apartado.component";
import { ApartarNuevoComponent } from "./apartar-nuevo/apartar-nuevo.component";



const routes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  { path: "apartado", component: ApartadoComponent },
  { path: "apartar-nuevo", component: ApartarNuevoComponent },
  { path: "**", pathMatch: "full", redirectTo: "dashboard" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
