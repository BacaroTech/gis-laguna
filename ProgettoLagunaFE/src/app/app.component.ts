
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MapComponent } from './components/map/map.component';
import { NavComponent } from './components/nav/nav.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [CommonModule, NavComponent, MapComponent]
})
export class AppComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {
  }

}