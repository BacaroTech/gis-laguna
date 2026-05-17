import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  readonly http: HttpClient = inject(HttpClient);

  constructor() { }

  getAllLevels(){
    return this.http.get(environment.URL_BE+"/levels");
  }

  getAllWind(){
    return this.http.get(environment.URL_BE+"/wind");
  }

  getAllPressure(){
    return this.http.get(environment.URL_BE+"/pressure");
  }
}
