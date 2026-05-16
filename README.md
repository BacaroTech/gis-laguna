# 🌊 Progetto Laguna

> Valorizzare e rendere accessibili i dati aperti della laguna di Venezia attraverso una mappa interattiva.

Il **Progetto Laguna** nasce con l'obiettivo di rendere più fruibili i dati aperti messi a disposizione dal [Comune di Venezia](https://dati.venezia.it/?q=formato/json). Attraverso un'applicazione sviluppata in **Angular** e tecnologie GIS, gli utenti possono visualizzare su mappa interattiva tutti i rilevatori sparsi per la laguna e consultare i dati associati a ciascun sensore in tempo reale.

---

## 🎯 Obiettivi

- Rendere più fruibili i dati pubblici in formato **open data**
- Offrire una rappresentazione **grafica e intuitiva** delle informazioni
- Creare un progetto open-source che unisca **tecnologia e territorio**

---

## 🛠️ Stack Tecnologico

| Layer | Tecnologia | Documentazione |
|---|---|---|
| Frontend | Angular + Leaflet (GIS) | [Angular Docs](https://v15.angular.io/docs) |
| Backend | Node.js + Express | [Node.js Docs](https://nodejs.org/docs/latest/api/) |
| Database | PostgreSQL | [node-postgres Docs](https://node-postgres.com/) |
| Infrastruttura | Docker + Nginx | — |

---

## 🚀 Come avviarlo

> **Prerequisiti:** Docker Desktop installato e in esecuzione.

### 1. Database

Dalla cartella root del progetto:

```bash
docker compose up -d
```

### 2. Frontend

```bash
cd ProgettoLagunaFE
npm install
ng serve
```

L'app sarà disponibile su `http://localhost:4200`

### 3. Backend

```bash
cd ProgettoLagunaBE
npm install
npm run dev
```

Il server sarà in ascolto sulla porta configurata nel `.env`.

---

## 🐳 Docker — Risoluzione problemi comuni

### Conflitto di dipendenze npm (`ERESOLVE`)

Se durante la build Docker ricevi un errore come:

```
npm ERR! ERESOLVE could not resolve
npm ERR! peer @angular/common@"^19.0.0" from @ng-bootstrap/ng-bootstrap
```

Il problema è un `package-lock.json` non allineato con le versioni definite nel `package.json`. Per risolverlo, rigenera il lockfile pulito:

```bash
cd ProgettoLagunaFE
rmdir /s /q node_modules   # Windows
del package-lock.json
npm install
cd ..
docker compose up -d --build
```

> **Nota:** la versione di Angular CLI installata globalmente non deve necessariamente coincidere con quella del progetto. Docker usa le versioni definite nel `package.json` locale.

---

## 📁 Struttura del progetto

```
gis-laguna/
├── ProgettoLagunaFE/      # Applicazione Angular
├── ProgettoLagunaBE/      # API Node.js + Express
├── docker-compose.yml
└── README.md
```

---

## 🤝 Contribuire

Hai suggerimenti o vuoi contribuire? Apri una issue o contattaci direttamente!

---

## 📬 Social e Contatti

| Canale | Link |
|---|---|
| 🌳 LinkedIn | [BacaroTech](https://www.linkedin.com/company/bacarotech) |
| 📷 Instagram | [@bacarotechofficial](https://www.instagram.com/bacarotechofficial/) |
| 🎵 TikTok | [@bacarotech](https://www.tiktok.com/@bacarotech) |
| 🎥 YouTube | [Bacarotech](https://www.youtube.com/@Bacarotech) |
| 📫 Email | bacarotech@gmail.com |

---

*Questa repository è frutto della **BacaroTech CLI** — scopri di più su [blueprint-bacaro-architecture](https://github.com/BacaroTech/blueprint-bacaro-architecture)*
