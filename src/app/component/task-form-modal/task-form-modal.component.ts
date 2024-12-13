import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { SqliteService } from 'src/app/services/sqlite.service';

@Component({
  selector: 'app-task-form-modal',
  templateUrl: './task-form-modal.component.html',
  styleUrls: ['./task-form-modal.component.scss'],
})
export class TaskFormModalComponent implements OnInit {


  @Input() task: any;  // Recibe la tarea a modificar si existe
  taskForm: FormGroup;
  minDate: string;

  public categories: string[];

  public priorityList = [
    { id: 1, name: "Baja" },
    { id: 2, name: "Media" },
    { id: 3, name: "Alta" }
  ];

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private fb: FormBuilder,
    private router: Router,
    private sqlite: SqliteService
  ) {
    this.categories = [];

    this.taskForm = this.fb.group({
      id: ['', ''],
      title: ['', Validators.required],
      description: ['', Validators.required],
      category_id: ['', Validators.required],
      priority: ['', [Validators.required, Validators.min(1)]],
      dateToPerform: ['', Validators.required],
    });
  }

  ionViewWillEnter() {
    this.readCategories();
  }

  ngOnInit() {
    this.minDate = this.getCurrentDate();

    if (this.task) {
      this.taskForm.patchValue({
        id: this.task.id,
        title: this.task.title,
        description: this.task.description,
        category_id: this.task.category_id,
        priority: this.task.priority,
        dateToPerform: this.task.dateToPerform,
      });
    }

  }

  getCurrentDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }


  dismiss() {
    this.modalController.dismiss();
  }

  save() {
    if (this.taskForm.valid) {
      const taskData = this.taskForm.value;

      this.modalController.dismiss({
        taskData
      });

      this.dismiss();
    }
  }

  readCategories() {
    this.sqlite.readCategories()
      .then((categories: string[]) => {
        this.categories = categories
        console.log('leido');
        if (this.categories.length === 0) {
          this.dismiss();
          this.categoryAlert();
        }
      })
      .catch(error => {
        console.error(error);
        console.error('Error al leer');
      })
  }

  async categoryAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: '¡No hay categorías creadas para crear una tarea! ¿Deseas crear una categoría?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('No se realiza ninguna acción');
          }
        },
        {
          text: 'Crear categoría',
          handler: () => {
            this.router.navigate(['/categories']);
          }
        }
      ]
    });

    await alert.present();
  }

}
