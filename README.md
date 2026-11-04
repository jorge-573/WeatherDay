# WeatherDay

A weather web app: current conditions, hourly and 10-day forecasts, detail tiles (wind, UV, humidity, precipitation, pressure, visibility, air quality, sun), NWS alerts, an animated radar map, and Storm Prediction Center convective outlooks.

Built with React 19, TypeScript, Vite, MUI, TanStack Query, and Leaflet. No API keys are needed; every data source is free and public.

## Getting started

Requires Node.js 24.22.1 or newer (see `.nvmrc`).

```bash
nvm use          # picks up the version from .nvmrc
npm ci
npm run dev      # http://localhost:5173
```

## Scripts

| Command           | What it does                                     |
| ----------------- | ------------------------------------------------ |
| `npm run dev`     | Start the Vite dev server                        |
| `npm run build`   | Type-check and build for production into `dist/` |
| `npm run preview` | Serve the production build locally               |
| `npm test`        | Run the Vitest unit tests                        |
| `npm run lint`    | ESLint and Prettier checks                       |
| `npm run format`  | Rewrite files with Prettier                      |

CI runs build, lint, and tests on every push and pull request to `main`.

## Project layout

```
src/
  services/   API clients, one per data source
  domain/     Pure mapping from API payloads to UI-ready data
  hooks/      Data and preference hooks (TanStack Query)
  platform/   Storage and geolocation behind an interface (web implementation in web.ts)
  types/, utils/, config/
  components/, pages/, theme/   Web UI (MUI, Leaflet)
```

`services`, `domain`, `types`, `utils`, `config`, `platform` (except `web.ts`), and most `hooks` contain no browser- or MUI-specific code, so they can be shared with a future React Native app. ESLint enforces this: those folders can't import Leaflet, MUI, or Emotion, or use `window`, `document`, `localStorage`, or `navigator`.

## Data sources

| Data                               | Provider                                                                                       | Terms                                                                       |
| ---------------------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Forecast, city search, air quality | [Open-Meteo](https://open-meteo.com/)                                                          | [CC BY 4.0](https://open-meteo.com/en/license); free for non-commercial use |
| Weather alerts                     | [National Weather Service API](https://www.weather.gov/documentation/services-web-api)         | US government public domain                                                 |
| Radar (US)                         | [NOAA MRMS](https://mapservices.weather.noaa.gov/) base reflectivity                           | US government public domain                                                 |
| Radar (worldwide)                  | [RainViewer](https://www.rainviewer.com/api.html)                                              | Free API; attribution required                                              |
| Convective outlooks                | [NOAA Storm Prediction Center](https://www.spc.noaa.gov/)                                      | US government public domain                                                 |
| Location names (reverse geocoding) | [Nominatim](https://nominatim.org/) / [OpenStreetMap](https://www.openstreetmap.org/copyright) | [ODbL](https://www.openstreetmap.org/copyright); max 1 request/second       |
| Basemap tiles                      | [Esri](https://www.esri.com/) World Dark Gray Canvas                                           | Esri terms of use; attribution required                                     |
| Weather icons                      | [Material Symbols](https://fonts.google.com/icons) (Google)                                    | Apache License 2.0                                                          |

Attribution for each source is shown in the app: map credits on the radar and outlook maps, and data credits in the footer.
