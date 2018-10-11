import { HTTP } from '@ionic-native/http';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import leaflet from 'leaflet';
import { Geolocation } from '@ionic-native/geolocation';
import L from 'leaflet-routing-machine'
import { Toast } from '@ionic-native/toast';
/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  @ViewChild('map') mapContainer: ElementRef;
  map: any;
  myLatitude: any;
  myLongitude: any;

  public isSearchBarOpened = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: HTTP, public geolocation: Geolocation, private toast: Toast) {
    console.log(leaflet)
    console.log(L)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

  ionViewDidEnter(){
    this.geolocation.getCurrentPosition().then((resp) => {
      this.myLatitude = resp.coords.latitude;
      this.myLongitude = resp.coords.longitude;
     }).catch((error) => {
       alert('Geolocation error')
     });
    this.loadmap();
  }

  loadmap() {
    this.map = leaflet.map("map").fitWorld();
    leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attributions: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18
    }).addTo(this.map);
  }

  onSearch(event){
    console.log(event.target.value);
    let keyWord = event.target.value;
    let data = {
      'user_name' : keyWord
    }
    
    this.http.get('http://192.168.1.144/locate-me/web/api/get/position',data,{})
    .then(data => {
      console.log(data.status);
      console.log(data.data); // data received by server
      console.log(data.headers);
      let d = JSON.parse(data.data);
      if(d.status == 200){
        let lat = d.data[0]
        let lng = d.data[1]
        /*-18.9182611,47.5333103
        let routeControl = leaflet.routing.control({
          waypoints: [
            leaflet.latLng(-18.922807, 47.516637),
            leaflet.latLng(lat, lng)
          ],
        useZoomParameter: true,
        autoRoute: true
        }).addTo(this.map); */

        this.toast.show(keyWord+' is at '+ lat +' and '+lng, '5000', 'bottom').subscribe(
          toast => {
            console.log(toast);
          }
        );
        
        leaflet.routing.control({
          waypoints: [
            leaflet.latLng(this.myLatitude, this.myLongitude),
            leaflet.latLng(lat,lng)
          ],
          useZoomParameter: true,
          showAlternatives: true,
          addWaypoints: false, 
          draggableWaypoints: false, 
          routeWhileDragging: false,
          show: false,
          collapsible: true
        }).addTo(this.map);
      }else if(d.status == 400){
        alert(d.message);
      }
    })
    .catch(error => {
      console.log(error.status);
      console.log(error.error); // error message as string
      console.log(error.headers);
  
      alert(error.error)
    });
    console.log('save position')
  }

}
