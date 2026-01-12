
import React from 'react';
import { WeatherData } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Cloud, Sun, CloudRain, Snowflake, Zap, CloudSun, 
  Droplets, Wind, Eye, SunDim, MapPin, Sparkles, Calendar
} from 'lucide-react';

interface Props {
  data: WeatherData;
}

const WeatherIcon = ({ condition, className }: { condition: string; className?: string }) => {
  const c = condition.toLowerCase();
  if (c.includes('맑음') || c.includes('sun') || c.includes('clear')) return <Sun className={`${className} text-yellow-300`} />;
  if (c.includes('비') || c.includes('rain')) return <CloudRain className={`${className} text-blue-300`} />;
  if (c.includes('구름') || c.includes('흐림') || c.includes('cloud')) return <Cloud className={`${className} text-slate-300`} />;
  if (c.includes('눈') || c.includes('snow')) return <Snowflake className={`${className} text-white`} />;
  if (c.includes('폭풍') || c.includes('번개') || c.includes('storm')) return <Zap className={`${className} text-indigo-400`} />;
  return <CloudSun className={`${className} text-orange-300`} />;
};

const WeatherWidget: React.FC<Props> = ({ data }) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* Top Section: Main Card & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Hero Card */}
        <div className="lg:col-span-8 glass-panel rounded-[2rem] p-10 flex flex-col justify-between overflow-hidden relative">
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full w-fit mb-4 border border-white/10">
                  <MapPin size={14} className="text-red-400" />
                  <span className="text-xs font-semibold tracking-wider uppercase">{data.location}</span>
                </div>
                <h2 className="text-xl font-medium text-slate-200">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </h2>
              </div>
              <div className="animate-subtle-float">
                <WeatherIcon condition={data.condition} className="w-20 h-20 drop-shadow-2xl" />
              </div>
            </div>

            <div className="mt-10 flex items-baseline gap-4">
              <span className="text-[10rem] font-extralight leading-none tracking-tighter tabular-nums">
                {Math.round(data.temperature)}°
              </span>
              <div className="flex flex-col">
                <span className="text-3xl font-light text-white/90">{data.condition}</span>
                <span className="text-lg font-medium text-white/50">최고: {data.high}° 최저: {data.low}°</span>
              </div>
            </div>
          </div>

          {/* AI Mood Insight */}
          <div className="mt-12 p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-500/20 p-3 rounded-xl border border-indigo-500/30">
                <Sparkles size={20} className="text-indigo-300" />
              </div>
              <p className="text-slate-100 text-base italic leading-relaxed font-light">
                "{data.aiAnalysis}"
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-4">
          <DetailCard icon={<Droplets />} label="습도" value={`${data.humidity}%`} color="text-blue-300" />
          <DetailCard icon={<Wind />} label="풍속" value={data.windSpeed} color="text-slate-300" />
          <DetailCard icon={<Eye />} label="가시거리" value={data.visibility} color="text-teal-300" />
          <DetailCard icon={<SunDim />} label="자외선" value={data.uvIndex} color="text-orange-300" />
        </div>
      </div>

      {/* Bottom Section: Forecast & Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 5-Day Forecast */}
        <div className="glass-panel rounded-[2rem] p-8">
          <div className="flex items-center gap-2 mb-8">
            <Calendar size={18} className="text-indigo-300" />
            <h3 className="text-lg font-semibold uppercase tracking-widest text-slate-300">5일간의 예보</h3>
          </div>
          <div className="space-y-2">
            {data.forecast.map((day, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all group">
                <span className="w-12 text-lg font-medium text-slate-200">{day.day}</span>
                <div className="flex items-center gap-4 flex-1 justify-center">
                  <WeatherIcon condition={day.condition} className="w-6 h-6" />
                  <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">{day.condition}</span>
                </div>
                <span className="text-xl font-bold tabular-nums">{Math.round(day.temp)}°</span>
              </div>
            ))}
          </div>
        </div>

        {/* Temperature Chart */}
        <div className="glass-panel rounded-[2rem] p-8">
          <div className="flex items-center gap-2 mb-8">
            <Cloud size={18} className="text-indigo-300" />
            <h3 className="text-lg font-semibold uppercase tracking-widest text-slate-300">기온 추이</h3>
          </div>
          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.forecast}>
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" hide />
                <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', border: 'none', borderRadius: '16px', backdropFilter: 'blur(10px)' }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ display: 'none' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="temp" 
                  stroke="#818cf8" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#chartGradient)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Sources */}
      {data.sources.length > 0 && (
        <div className="flex items-center justify-center gap-6 py-4 opacity-50 hover:opacity-100 transition-opacity">
          {data.sources.map((s, i) => (
            <a key={i} href={s.uri} target="_blank" rel="noreferrer" className="text-[10px] uppercase font-bold tracking-widest hover:text-indigo-400 transition-colors">
              출처: {s.title}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

const DetailCard = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) => (
  <div className="glass-panel rounded-3xl p-6 flex flex-col items-center justify-center text-center group hover:bg-white/10 transition-all border border-white/5">
    <div className={`${color} mb-3 group-hover:scale-110 transition-transform`}>
      {React.cloneElement(icon as React.ReactElement, { size: 24 })}
    </div>
    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em] mb-1">{label}</span>
    <span className="text-xl font-bold tracking-tight">{value}</span>
  </div>
);

export default WeatherWidget;
