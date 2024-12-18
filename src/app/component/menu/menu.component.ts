import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent  implements OnInit {

  constructor(private router: Router, private menuCtrl: MenuController) { }

  ngOnInit() {}

  navigateTo(route: string) {
    this.router.navigate([route]).then(() => {
      this.menuCtrl.close(); // Cierra el menú
    });
  }

}
