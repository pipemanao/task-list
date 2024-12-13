import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SqliteService } from 'src/app/services/sqlite.service';
import { DatePipe } from '@angular/common';
import { TaskDetailModalComponent } from '../task-detail-modal/task-detail-modal.component';

@Component({
  selector: 'app-completed-tasks',
  templateUrl: './completed-tasks.component.html',
  styleUrls: ['./completed-tasks.component.scss'],
  providers: [DatePipe]
})
export class CompletedTasksComponent implements OnInit {

  public tasks: string[];

  constructor(
    private modalController: ModalController,
    private sqlite: SqliteService
  ) {
    this.tasks = [];
  }

  ngOnInit() { }

  ionViewWillEnter() {
    this.read();
  }

  async showTaskDetail(task) {
    const modal = await this.modalController.create({
      component: TaskDetailModalComponent,
      componentProps: { task }
    });
    await modal.present();
  }

  read() {
    this.sqlite.readCompletedTasks()
      .then((tasks: string[]) => {
        this.tasks = tasks
        console.log('leido');
      })
      .catch(error => {
        console.error(error);
        console.error('Error al leer');
      })
  }
}
