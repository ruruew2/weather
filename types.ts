
export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  high: number;
  low: number;
  humidity: number;
  windSpeed: string;
  visibility: string;
  uvIndex: string;
  forecast: ForecastDay[];
  aiAnalysis: string;
  sources: { title: string; uri: string }[];
}

export interface ForecastDay {
  day: string;
  temp: number;
  condition: string;
}

export interface GeolocationState {
  lat: number | null;
  lng: number | null;
  error: string | null;
  loading: boolean;
}
