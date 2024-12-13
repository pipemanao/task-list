import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SplashComponent } from './component/splash/splash.component';
import { TasksComponent } from './component/tasks/tasks.component';
import { CategoriesComponent } from './component/categories/categories.component';
import { CompletedTasksComponent } from './component/completed-tasks/completed-tasks.component';
import { DeletedTasksComponent } from './component/deleted-tasks/deleted-tasks.component';

const routes: Routes = [
  /*{
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },*/

  { path: '', redirectTo: 'splash', pathMatch: 'full' },
  { path: 'splash', component: SplashComponent },
  { path: 'tasks', component: TasksComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'completed-tasks', component: CompletedTasksComponent },
  { path: 'deleted-tasks', component: DeletedTasksComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
