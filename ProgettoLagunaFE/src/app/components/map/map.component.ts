import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { forkJoin } from 'rxjs';
import { LevelData } from 'src/app/interface/LevelData';
import { PressureData } from 'src/app/interface/PressureData';
import { WindData } from 'src/app/interface/WindData';
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

  private readonly layers: Record<string, L.LayerGroup> = {
    levels: new L.LayerGroup(),
    wind: new L.LayerGroup(),
    pressure: new L.LayerGroup(),
    radiation: new L.LayerGroup(),
    wathertemp: new L.LayerGroup(),
  };

  constructor() {
    L.Marker.prototype.options.icon = L.icon({
      iconRetinaUrl: 'assets/marker-icon-2x.png',
      iconUrl: 'assets/marker-icon.png',
      shadowUrl: 'assets/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41],
    });
  }

  // ── Popup builders ─────────────────────────────────────────────

  private levelPopup(d: LevelData): string {
    return `
      <div class="map-popup">
        <h6>🌊 ${d.stazione}</h6>
        <table>
          <tr><td>ID stazione</td><td><b>${d.ID_stazione}</b></td></tr>
          <tr><td>Abbr.</td>      <td>${d.nome_abbr}</td></tr>
          <tr><td>Valore</td>     <td><b>${d.valore}</b></td></tr>
          <tr><td>Data</td>       <td>${d.data}</td></tr>
          <tr><td>Lat / Lon</td>  <td>${Number(d.latDDN).toFixed(4)}, ${Number(d.lonDDE).toFixed(4)}</td></tr>
        </table>
      </div>`;
  }

   private windPopUp(d: WindData): string {
    return `
      <div class="map-popup">
        <h6>🌊 ${d.stazione}</h6>
        <table>
          
        </table>
      </div>`;
  }

  private pressurePopup(d: PressureData): string {
    return `
      <div class="map-popup">
        <h6>🔵 ${d.stazione}</h6>
        <table>
          <tr><td>ID stazione</td><td><b>${d.ID_stazione}</b></td></tr>
          <tr><td>Abbr.</td>      <td>${d.nome_abbr}</td></tr>
          <tr><td>Lat / Lon</td>  <td>${Number(d.latDDN).toFixed(4)}, ${Number(d.lonDDE).toFixed(4)}</td></tr>
        </table>
      </div>`;
  }

  // ── Helpers ────────────────────────────────────────────────────

  /** Returns null if lat/lon are missing or not valid numbers */
  private toMarker(x: any, popupHtml: string): L.Marker | null {
    const lat = Number(x.latDDN);
    const lon = Number(x.lonDDE);
    if (isNaN(lat) || isNaN(lon)) return null;

    return L.marker([lat, lon]).bindPopup(popupHtml, { maxWidth: 260 });
  }

  private populateLayer(
    key: keyof typeof this.layers,
    items: any[],
    popupFn: (item: any) => string
  ): void {
    const group = this.layers[key];
    group.clearLayers();
    items.forEach(x => {
      const marker = this.toMarker(x, popupFn(x));
      if (marker) marker.addTo(group);
    });
  }

  // ── Map init ───────────────────────────────────────────────────

  private initMap(): void {
    if (this.map) this.map.remove();

    this.map = L.map('map', { center: this.centroid, zoom: 12 });

    const baseLayers: L.Control.LayersObject = {
      '🗺️ OpenStreetMap': L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18, minZoom: 10,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }),
      '🛰️ Satellite (Esri)': L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18, minZoom: 10,
        attribution: '&copy; Esri',
      }),
      '🏔️ Topografica': L.tileLayer(
        'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 17, minZoom: 10,
        attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
      }),
      '☀️ Carto Chiara': L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 18, minZoom: 10,
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      }),
      '🌙 Carto Scura': L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 18, minZoom: 10,
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      }),
    };

    (baseLayers['🗺️ OpenStreetMap'] as L.TileLayer).addTo(this.map);

    const overlays: L.Control.LayersObject = {
      '🌊 Livelli acqua': this.layers['levels'].addTo(this.map),
      '💨 Vento': this.layers['wind'],
      '🔵 Pressione': this.layers['pressure'],
      '🔵 Radiazione solare': this.layers['radiation'],
      '🔵 Temperatura dell\'acqua': this.layers['wathertemp'],
    };

    L.control.layers(baseLayers, overlays, {
      position: 'topright',
      collapsed: false,
    }).addTo(this.map);
  }

  // ── Data loading ───────────────────────────────────────────────

  ngOnInit(): void {
    forkJoin({
      levels: this.mp.getAllLevels(),
      wind: this.mp.getAllWind(),
      pressure: this.mp.getAllPressure(),
      wathertemp: this.mp.getAllWathertemp(),
      radiation: this.mp.getAllRadiation(),
    }).subscribe({
      next: ({ levels, wind, pressure, wathertemp, radiation }: any) => {
        this.populateLayer('levels', levels.data, d => this.levelPopup(d));
        this.populateLayer('wind', wind.data, d => this.windPopUp(d));
        this.populateLayer('pressure', pressure.data, d => this.pressurePopup(d));
        this.populateLayer('wathertemp', wathertemp.data, d => d);
        this.populateLayer('radiation', radiation.data, d => d);
      },
      error: err => console.error('Layer load error:', err),
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
}