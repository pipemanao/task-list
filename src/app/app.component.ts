import { Component } from '@angular/core';
import { Device } from '@capacitor/device';
import { MenuController, Platform } from '@ionic/angular';
import { SqliteService } from './services/sqlite.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public isWeb: boolean;
  public load: boolean;

  constructor(
    private platform: Platform, private sqlite: SqliteService, private menuCtrl: MenuController
  ) {
    this.initApp();
    this.isWeb = false;
    this.load = false;
  }

  initApp() {

    this.platform.ready().then(async () => {

      const info = await Device.getInfo();
      this.isWeb = info.platform == 'web';

      this.sqlite.init();
      this.sqlite.dbReady.subscribe(load => {
        this.load = load;
      });

    });

  }

  openMenu() {
    this.menuCtrl.open('firstMenu');
  }

  closeMenu() {
    this.menuCtrl.close();
  }
}
