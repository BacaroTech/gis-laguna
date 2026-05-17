import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from 'src/app/services/map.service';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    standalone: true
})
export class MapComponent implements AfterViewInit, OnInit {
  readonly mp: MapService = inject(MapService);

  private map!: L.Map;
  private centroid: L.LatLngExpression = [45.4404, 12.3160];
  private data: any[] = [];
  private markersLayer = new L.LayerGroup();

  constructor() {
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

    // ── Base layers ──────────────────────────────────────────────
    const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18, minZoom: 10,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    const satellite = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 18, minZoom: 10,
      attribution: '&copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics'
    });

    const topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      maxZoom: 17, minZoom: 10,
      attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
    });

    const cartoLight = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 18, minZoom: 10,
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>'
    });

    const cartoDark = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 18, minZoom: 10,
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>'
    });

    // ── Overlay layers ───────────────────────────────────────────
    const waterways = L.tileLayer(
      'https://tile.waymarkedtrails.org/cycling/{z}/{x}/{y}.png', {
      maxZoom: 18, minZoom: 10, opacity: 0.7,
      attribution: '&copy; <a href="https://waymarkedtrails.org">Waymarked Trails</a>'
    });

    // Add default base layer
    osm.addTo(this.map);

    // Add markers layer group (populated in ngOnInit)
    this.markersLayer.addTo(this.map);

    // ── Layers control ───────────────────────────────────────────
    const baseLayers: L.Control.LayersObject = {
      '🗺️ OpenStreetMap':  osm,
      '🛰️ Satellite (Esri)': satellite,
      '🏔️ Topografica':    topo,
      '☀️ Carto Chiara':   cartoLight,
      '🌙 Carto Scura':    cartoDark,
    };

    const overlays: L.Control.LayersObject = {
      '🌊 Livelli acqua':  this.markersLayer,
      '🚴 Percorsi':       waterways,
    };

    L.control.layers(baseLayers, overlays, {
      position: 'topright',
      collapsed: false       // always visible; set true to collapse into a button
    }).addTo(this.map);
  }

  ngOnInit(): void {
    this.mp.getAllLevels().subscribe((response: any) => {
      this.data = response.data;
      console.log(this.data);

      // Add markers into the dedicated LayerGroup
      this.data
        .map(x => L.marker([x.latDDN, x.lonDDE] as L.LatLngExpression))
        .forEach(marker => marker.addTo(this.markersLayer));
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
}