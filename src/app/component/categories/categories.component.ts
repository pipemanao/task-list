
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CategorymodalComponent } from '../categorymodal/categorymodal.component';
import { SqliteService } from 'src/app/services/sqlite.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {

  public categories: string[];

  constructor(private modalController: ModalController, private sqlite: SqliteService) {
    this.categories = [];
  }

  ionViewWillEnter() {
    this.read();
  }

  ngOnInit() { }

  async openCategoryModal(categoryId: number | null = null, categoryName: string = '') {
    const modal = await this.modalController.create({
      component: CategorymodalComponent,
      componentProps: {
        categoryId: categoryId,
        categoryName: categoryName,
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        if (categoryId === null) {
          this.create(result.data.name);
        } else {
          this.update(result.data["id"], result.data["name"])
        }
      }
    });

    return modal.present();
  }

  create(name: string) {
    this.sqlite.createCategory(name)
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

  read() {
    this.sqlite.readCategories()
      .then((categories: string[]) => {
        this.categories = categories
        console.log('leido');
      })
      .catch(error => {
        console.error(error);
        console.error('Error al leer');
      })
  }

  update(id: number, name: string) {
    this.sqlite.updateCategory(id, name)
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
