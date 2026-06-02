import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { LevelData } from '../interface/LevelData';
import { PressureData } from '../interface/PressureData';
import { WaterTemperatureStationData } from '../interface/WaterTemperatureStationData';
import { WindData } from '../interface/WindData';
import { RadiationData } from '../interface/RadiationData';
import { MoonPhaseData } from '../interface/MoonPhaseData';
import { HumidityData } from '../interface/HumidityData';
import { AirTemperatureData } from '../interface/AirTemperatureData';
import { TideForecastData } from '../interface/TideForecastData';
import { ASCNR2026Min } from '../interface/ascnr2026min';
import { AS2026Min } from '../interface/as2026min';


@Injectable({
  providedIn: 'root'
})
export class MapService {

  readonly http: HttpClient = inject(HttpClient);

  constructor() {}

  // 🌊 livelli acqua
  getAllLevels() {
    return this.http.get<LevelData>(environment.URL_BE + "/levels");
  }

  // 💨 vento
  getAllWind() {
    return this.http.get<WindData>(environment.URL_BE + "/wind");
  }

  // 🌡 pressione
  getAllPressure() {
    return this.http.get<PressureData>(environment.URL_BE + "/pressure");
  }

  // ☀️ radiazione
  getAllRadiation() {
    return this.http.get<RadiationData>(environment.URL_BE + "/radiation");
  }

  // 🌊 temperatura acqua
  getAllWaterTemp() {
    return this.http.get<WaterTemperatureStationData>(environment.URL_BE + "/water-temperature");
  }

  // 🌙 fase lunare
  getMoonPhase() {
    return this.http.get<MoonPhaseData>(environment.URL_BE + "/moon");
  }

  // 💧 umidità
  getHumidity() {
    return this.http.get<HumidityData>(environment.URL_BE + "/humidity");
  }

  // 🌡 temperatura aria
  getAirTemperature() {
    return this.http.get<AirTemperatureData>(environment.URL_BE + "/air-temperature");
  }

  // 🌊 onde laguna
  getLagoonWaves() {
    return this.http.get<TideForecastData>(environment.URL_BE + "/lagoon-waves");
  }

  // 🔮 previsioni
  getForecast() {
    return this.http.get<TideForecastData>(environment.URL_BE + "/forecast");
  }

  // 🌊 alta marea min
  getHighTideMin() {
    return this.http.get<AS2026Min>(environment.URL_BE + "/high-tide-min");
  }

  // 🌊 alta marea CNR min
  getCnrHighTideMin() {
    return this.http.get<ASCNR2026Min>(environment.URL_BE + "/cnr-high-tide-min");
  }


  // 🌊 fallback acqua (già presente ma duplicato logico)
  getWaterTempLegacy() {
    return this.http.get<WaterTemperatureStationData>(environment.URL_BE + "/wathertemp");
  }
}