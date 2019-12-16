import {Component, OnInit, ViewChild} from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  pinned = true;
  collapsed = false;
  constructor(private router: Router) {
  }
  ngOnInit() {
    console.log(this.router);
  }
  onTabOutClick() {
    if (!this.pinned) {
      this.collapsed = true;
    }
  }
  showContent(path) {
    this.router.navigate([`/home/${path}`]);
    this.onTabOutClick();
  }
}
