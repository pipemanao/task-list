import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
})
export class SplashComponent  implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    setTimeout(() => {
      this.router.navigate(['/tasks']);
    }, 2000);
  }

  ionViewWillEnter() {
    setTimeout(() => {
      this.router.navigate(['/tasks']);
    }, 2000);
  }


  redirect() {
    this.router.navigate(['/tasks']);
  }

}
