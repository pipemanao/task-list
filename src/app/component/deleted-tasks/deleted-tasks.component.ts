import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SqliteService } from 'src/app/services/sqlite.service';
import { DatePipe } from '@angular/common';
import { TaskDetailModalComponent } from '../task-detail-modal/task-detail-modal.component';

@Component({
  selector: 'app-deleted-tasks',
  templateUrl: './deleted-tasks.component.html',
  styleUrls: ['./deleted-tasks.component.scss'],
  providers: [DatePipe]
})
export class DeletedTasksComponent implements OnInit {
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
    this.sqlite.readDeletedTasks()
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
