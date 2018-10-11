import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { Storage } from '@ionic/storage';


/**
 * Generated class for the UserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {

  user:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toast: Toast, public storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserPage');
  }

  saveUser():void{
    console.log(this.user)
    
    this.storage.set('user_name', this.user);

    this.toast.show('user '+ this.user + ' saved', '5000', 'bottom').subscribe(
      toast => {
        console.log(toast);
      }
    );
  }

}
