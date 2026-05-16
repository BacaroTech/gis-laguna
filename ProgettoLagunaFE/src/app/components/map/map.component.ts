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

  constructor(private http: HttpClient) { }

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
