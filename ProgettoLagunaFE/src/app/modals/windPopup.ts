import { WindData } from "../interface/WindData";

export function windPopUp(d: WindData): string {
    return `
      <div class="map-popup">
        <h6>🌊 ${d.stazione}</h6>
        <table>
          
        </table>
      </div>`;
  }