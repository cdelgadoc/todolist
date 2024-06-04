import { HttpIntercepterAuthenticationService } from './services/http/http-intercepter-authentication.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuComponent } from './components/menu/menu.component';
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { TareasComponent } from './components/tareas/tareas.component';
import { CategoriasComponent } from './components/tareas/categorias/categorias.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { ImageCropperComponent } from './components/avatar/image-cropper/image-cropper.component';

import { MatIconModule } from '@angular/material/icon';
import { UpdateTareaComponent } from './components/tareas/update-tarea/update-tarea.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    RegistroComponent,
    LoginComponent,
    TareasComponent,
    CategoriasComponent,
    AvatarComponent,
    ImageCropperComponent,
    UpdateTareaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatIconModule,
    MatDatepickerModule    
  ],
  providers: [ 
    {provide: HTTP_INTERCEPTORS, useClass: HttpIntercepterAuthenticationService, multi: true }
 ],
  bootstrap: [AppComponent]
})
export class AppModule { }
