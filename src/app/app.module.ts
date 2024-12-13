import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { defineCustomElements as jeepsqlite } from 'jeep-sqlite/loader'
import { HttpClientModule } from '@angular/common/http';

import { SplashComponent } from './component/splash/splash.component';
import { TasksComponent } from './component/tasks/tasks.component';
import { CategoriesComponent } from './component/categories/categories.component';
import { CompletedTasksComponent } from './component/completed-tasks/completed-tasks.component';
import { DeletedTasksComponent } from './component/deleted-tasks/deleted-tasks.component';
import { MenuComponent } from './component/menu/menu.component';
import { CategorymodalComponent } from './component/categorymodal/categorymodal.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaskFormModalComponent } from './component/task-form-modal/task-form-modal.component';
import { TaskDetailModalComponent } from './component/task-detail-modal/task-detail-modal.component';


jeepsqlite(window)

@NgModule({
  declarations: [AppComponent, SplashComponent, TasksComponent, CategoriesComponent, CompletedTasksComponent, DeletedTasksComponent, MenuComponent, CategorymodalComponent, TaskFormModalComponent, TaskDetailModalComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, FormsModule, ReactiveFormsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
