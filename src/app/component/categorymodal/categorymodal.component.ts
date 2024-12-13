import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-categorymodal',
  templateUrl: './categorymodal.component.html',
  styleUrls: ['./categorymodal.component.scss'],
})
export class CategorymodalComponent implements OnInit {

  @Input() categoryId: number | null; // Si es null, significa que es una nueva categoría
  @Input() categoryName: string = ''; // Nombre de la categoría

  updatedCategoryName: string;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    //this.updatedCategoryName = this.categoryName;
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  save() {
    if (this.categoryName.trim()) {
      this.modalCtrl.dismiss({
        id: this.categoryId,
        name: this.categoryName,
      });
    } else {
      alert('Por favor, ingrese un nombre válido');
    }
  }

}
