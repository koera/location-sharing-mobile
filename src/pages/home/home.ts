import { UserPage } from './../user/user';
import { PositionPage } from './../position/position';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SearchPage } from '../search/search';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  navigateToOtherPage(): void {
    this.navCtrl.push(PositionPage);
  }

  navigateToSearchPage(): void {
    this.navCtrl.push(SearchPage);
  }

  navigateToUserPage(): void{
    this.navCtrl.push(UserPage);
  }
}
