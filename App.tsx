
import React, { useState, useEffect, useCallback } from 'react';
import { fetchWeatherWithGemini, generateWeatherImage, MOCK_WEATHER_DATA } from './services/geminiService';
import { WeatherData, GeolocationState } from './types';
import WeatherWidget from './components/WeatherWidget';
import { Loader2, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [geo, setGeo] = useState<GeolocationState>({ lat: null, lng: null, error: null, loading: true });
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const getThemeClass = (condition: string = "") => {
    const c = condition.toLowerCase();
    if (c.includes('비') || c.includes('rain')) return 'weather-gradient-rainy';
    if (c.includes('구름') || c.includes('흐림') || c.includes('cloud')) return 'weather-gradient-cloudy';
    if (c.includes('밤') || c.includes('night')) return 'weather-gradient-night';
    return 'weather-gradient-sunny';
  };

  const loadWeather = useCallback(async (lat: number, lng: number) => {
    setRefreshing(true);
    try {
      const data = await fetchWeatherWithGemini(lat, lng);
      setWeatherData(data);
      const img = await generateWeatherImage(data.condition);
      if (img) setBgImage(img);
    } catch {
      setWeatherData(MOCK_WEATHER_DATA);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeo({ lat: null, lng: null, error: "지원되지 않음", loading: false });
      setWeatherData(MOCK_WEATHER_DATA);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeo({ lat: pos.coords.latitude, lng: pos.coords.longitude, error: null, loading: false });
        loadWeather(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        setGeo({ lat: null, lng: null, error: err.message, loading: false });
        loadWeather(37.5665, 126.9780); // 서울로 기본 설정
      }
    );
  }, [loadWeather]);

  return (
    <div className={`min-h-screen transition-all duration-1000 overflow-y-auto ${getThemeClass(weatherData?.condition)}`}>
      {bgImage && (
        <div 
          className="fixed inset-0 z-0 opacity-30 mix-blend-soft-light"
          style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
      )}

      <header className="relative z-20 px-8 py-8 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
            <span className="text-2xl font-black">S</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tighter">SkyAI</h1>
        </div>
        
        <button 
          onClick={() => geo.lat && geo.lng && loadWeather(geo.lat, geo.lng)}
          disabled={refreshing}
          className="p-3 glass-panel rounded-full hover:bg-white/20 transition-all group disabled:opacity-50"
          title="새로고침"
        >
          <RefreshCw size={20} className={refreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} />
        </button>
      </header>

      <main className="relative z-10 container mx-auto px-4 pb-24">
        {geo.loading && !weatherData && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 animate-pulse"></div>
              <Loader2 size={64} className="animate-spin text-white/50" />
            </div>
            <p className="text-2xl font-light tracking-widest animate-pulse uppercase">하늘 정보를 찾는 중...</p>
          </div>
        )}

        {weatherData && <WeatherWidget data={weatherData} />}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-4 text-center z-30 pointer-events-none">
        <span className="text-[9px] font-bold tracking-[0.3em] uppercase opacity-40 bg-black/20 px-4 py-1 rounded-full backdrop-blur-sm">
          Gemini Intelligence • Sensory Design System 4.0
        </span>
      </footer>
    </div>
  );
};

export default App;
