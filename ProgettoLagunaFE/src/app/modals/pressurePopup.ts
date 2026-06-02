import { PressureData } from "../interface/PressureData";

export function pressurePopup(d: PressureData): string {
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