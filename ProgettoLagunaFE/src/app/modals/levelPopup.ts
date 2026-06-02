import { LevelData } from "../interface/LevelData";

export function levelPopup(d: LevelData): string {
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