import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { forkJoin } from 'rxjs';
import { levelPopup } from 'src/app/modals/levelPopup';
import { pressurePopup } from 'src/app/modals/pressurePopup';
import { windPopUp } from 'src/app/modals/windPopup';
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

  moon: new L.LayerGroup(),
  humidity: new L.LayerGroup(),
  airTemperature: new L.LayerGroup(),
  lagoonWaves: new L.LayerGroup(),
  forecast: new L.LayerGroup(),
  highTideMin: new L.LayerGroup(),
  cnrHighTideMin: new L.LayerGroup(),
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
  '🌡 Temperatura acqua': this.layers['wathertemp'],

  '🌙 Luna': this.layers['moon'],
  '💧 Umidità': this.layers['humidity'],
  '🌡 Temperatura aria': this.layers['airTemperature'],
  '🌊 Onde laguna': this.layers['lagoonWaves'],
  '🔮 Previsioni': this.layers['forecast'],
  '🌊 Marea min': this.layers['highTideMin'],
  '🌊 Marea CNR min': this.layers['cnrHighTideMin'],
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
      wathertemp: this.mp.getAllWaterTemp(),
      radiation: this.mp.getAllRadiation(),
      moon: this.mp.getMoonPhase(),
  humidity: this.mp.getHumidity(),
  airTemperature: this.mp.getAirTemperature(),
  lagoonWaves: this.mp.getLagoonWaves(),
  forecast: this.mp.getForecast(),
  highTideMin: this.mp.getHighTideMin(),
  cnrHighTideMin: this.mp.getCnrHighTideMin(),
    }).subscribe({
      next: ({
        levels,
  wind,
  pressure,
  wathertemp,
  radiation,
  moon,
  humidity,
  airTemperature,
  lagoonWaves,
  forecast,
  highTideMin,
  cnrHighTideMin }: any) => {
        this.populateLayer('levels', levels.data, d => levelPopup(d));
        this.populateLayer('wind', wind.data, d => windPopUp(d));
        this.populateLayer('pressure', pressure.data, d => pressurePopup(d));
        this.populateLayer('wathertemp', wathertemp.data, d => d);
        this.populateLayer('radiation', radiation.data, d => d);
        this.populateLayer('moon', moon.data, d => JSON.stringify(d));
  this.populateLayer('humidity', humidity.data, d => JSON.stringify(d));
  this.populateLayer('airTemperature', airTemperature.data, d => JSON.stringify(d));
  this.populateLayer('lagoonWaves', lagoonWaves.data, d => JSON.stringify(d));
  this.populateLayer('forecast', forecast.data, d => JSON.stringify(d));

  this.populateLayer('highTideMin', highTideMin.data, d => JSON.stringify(d));
  this.populateLayer('cnrHighTideMin', cnrHighTideMin.data, d => JSON.stringify(d));
      },
      error: err => console.error('Layer load error:', err),
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
}