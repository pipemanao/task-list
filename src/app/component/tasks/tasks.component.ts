import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { TaskDetailModalComponent } from '../task-detail-modal/task-detail-modal.component';
import { TaskFormModalComponent } from '../task-form-modal/task-form-modal.component';
import { SqliteService } from 'src/app/services/sqlite.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  providers: [DatePipe]
})
export class TasksComponent implements OnInit {

  public tasks: string[];

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private sqlite: SqliteService
  ) {
    this.tasks = [];
  }

  ionViewWillEnter() {
    this.read();
  }

  ngOnInit() { }

  async showTaskDetail(task) {
    const modal = await this.modalController.create({
      component: TaskDetailModalComponent,
      componentProps: { task }
    });
    await modal.present();
  }

  async openTaskModal(task = null) {
    const modal = await this.modalController.create({
      component: TaskFormModalComponent,
      componentProps: {
        task
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        let data = result.data.taskData;

        if (data["id"]) {
          this.update(data)
        } else {
          this.create(data);
        }
      }
    });

    return modal.present();
  }

  read() {
    this.sqlite.readTasks()
      .then((tasks: string[]) => {
        this.tasks = tasks
        console.log('leido');
      })
      .catch(error => {
        console.error(error);
        console.error('Error al leer');
      })
  }

  create(task) {
    this.sqlite.createTask(task["title"], task["description"], task["category_id"], task["priority"], task["dateToPerform"])
      .then((changes) => {
        console.log(changes);
        console.log('creado');
        this.read();
      })
      .catch(error => {
        console.error(error);
        console.error('Error al crear');
      })
  }

  update(task) {
    this.sqlite.updateTask(task["id"], task["title"], task["description"], task["category_id"], task["priority"], task["dateToPerform"])
      .then((changes) => {
        console.log(changes);
        console.log("Actualizado")
        this.read();
      })
      .catch(error => {
        console.error(error);
        console.error('Error al actualizar');
      });
  }

  async delete(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que quieres eliminar esta tarea?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Tarea no eliminada');
          }
        },
        {
          text: 'Eliminar',
          handler: () => {

            this.sqlite.UpdateDeletedTask(id)
              .then((changes) => {
                console.log(changes);
                console.log("Actualizado")
                this.read();
              })
              .catch(error => {
                console.error(error);
                console.error('Error al actualizar');
              });

          }
        }
      ]
    });

    await alert.present();
  }

  async completed(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de marcar como completada esta tarea?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Tarea no completada');
          }
        },
        {
          text: 'Completar',
          handler: () => {

            this.sqlite.updateTaskCompleted(id)
              .then((changes) => {
                console.log(changes);
                console.log("Actualizado")
                this.read();
              })
              .catch(error => {
                console.error(error);
                console.error('Error al actualizar');
              });

          }
        }
      ]
    });

    await alert.present();
  }

}
