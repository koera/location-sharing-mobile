import { Storage } from '@ionic/storage';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import leaflet from 'leaflet';
import L from 'leaflet-routing-machine'
import { HTTP } from '@ionic-native/http';

/**
 * Generated class for the PositionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-position',
  templateUrl: 'position.html',
})
export class PositionPage {
  @ViewChild('map') mapContainer: ElementRef;
  map: any;
  latitude:any;
  longitude:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,private geolocation: Geolocation, private http: HTTP, private storage: Storage) {
    console.log(leaflet)
    console.log(L)
  }

  ionViewDidLoad() {
    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

  ionViewDidEnter(){
   this.loadmap();
  }

  loadmap() {
    this.map = leaflet.map("map").fitWorld();
    leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attributions: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18
    }).addTo(this.map);
    this.map.locate({
      setView: true,
      maxZoom: 16
    }).on('locationfound', (e) => {
      let markerGroup = leaflet.featureGroup();
      let marker: any = leaflet.marker([e.latitude, e.longitude]).on('click', () => {
        alert('Marker clicked');
      })
      markerGroup.addLayer(marker);
      this.map.addLayer(markerGroup);
      }).on('locationerror', (err) => {
        alert(err.message);
    })

  }

  savePosition(){
    
    this.storage.get('user_name').then((val) => {
      if(val != null){
        let data = {
          'user_name': val,
          'latitude': this.latitude,
          'longitude': this.longitude
        };
        this.http.post('http://192.168.1.144/locate-me/web/api/save/position',data,{})
        .then(data => {
          console.log(data.status);
          console.log(data.data); // data received by server
          console.log(data.headers);
          let d = JSON.parse(data.data);
          alert(d.message);
        })
        .catch(error => {
          console.log(error.status);
          console.log(error.error); // error message as string
          console.log(error.headers);
      
          alert(error.error)
        });
      }
      else{
        alert(' Ajouter un utilisateur avant d\'utiliser ')
      }
    });
  }

}