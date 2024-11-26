import { Component } from '@angular/core';
import { SqliteService } from '../services/sqlite.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public category: string;
  public categories: string[];

  constructor(
    private sqlite: SqliteService
  ) {
    this.category = '';
    this.categories = [];
  }

  ionViewWillEnter() {
    this.read();
  }

  create() {
    this.sqlite.create(this.category.toUpperCase())
      .then((changes) => {
        console.log(changes);
        console.log('creado');
        this.read();
        this.category = '';
      })
      .catch(error => {
        console.error(error);
        console.error('Error al crear');
      })
  }

  read() {
    this.sqlite.read()
      .then((categories: string[]) => {
        this.categories = categories
        console.log('leido');
        console.log(this.categories);
      })
      .catch(error => {
        console.error(error);
        console.error('Error al leer');
      })
  }

  update(category: string) {
    this.sqlite.update(this.category.toUpperCase(), category)
      .then((changes) => {
        console.log(changes);
        console.log("Actualizado")
        this.read();
        this.category = '';
      })
      .catch(error => {
        console.error(error);
        console.error('Error al actualizar');
      });
  }

  delete(category: string) {
    this.sqlite.delete(category)
      .then((changes) => {
        console.log(changes);
        console.log("Eliminado")
        this.read();
      })
      .catch(error => {
        console.error(error);
        console.error('Error al actualizar');
      });
  }

}
