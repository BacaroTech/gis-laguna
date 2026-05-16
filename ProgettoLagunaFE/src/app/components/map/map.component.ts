import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    standalone: false
})
export class MapComponent implements AfterViewInit, OnInit {
  private map!: L.Map;
  private centroid: L.LatLngExpression = [45.4404, 12.3160];
  private data: any[] = [];

  constructor(private http: HttpClient) { 
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;
  }

  private initMap(): void {
    if (this.map) {
      this.map.remove();
    }
  
    this.map = L.map('map', {
      center: this.centroid,
      zoom: 12
    });
  
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 10,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
  
    tiles.addTo(this.map);
  }  

  
  ngOnInit(): void {
    this.http.get("http://localhost:3000/").subscribe((reponse: any) => {
      this.data = reponse.data;
      console.log(this.data);
      const jittery = this.data.map( 
        x => [x.latDDN, x.lonDDE]
      ).map(
        x => L.marker(x as L.LatLngExpression)
      ).forEach(
        x => x.addTo(this.map)
      );
    })
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
}
