import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { TareasComponent } from './components/tareas/tareas.component';
import { RegistroComponent } from './components/registro/registro.component';
import { CategoriasComponent } from './components/tareas/categorias/categorias.component';
import { RouteGuardService } from './services/route-guard.service';
import { MenuComponent } from './components/menu/menu.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'login', component: LoginComponent },
  { path: 'menu', component: MenuComponent, canActivate: [RouteGuardService] },    
  { path: '**', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
