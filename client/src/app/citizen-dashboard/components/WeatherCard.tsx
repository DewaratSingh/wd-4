"use client";

import { useState, useEffect } from "react";
import { Cloud, CloudDrizzle, CloudLightning, CloudRain, CloudSnow, Sun, Thermometer, Wind, Droplets, MapPin, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface WeatherData {
    temp: number;
    condition: string;
    description: string;
    humidity: number;
    windSpeed: number;
    location: string;
    icon: string;
}

export default function WeatherCard() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const API_KEY = "ae888bf8ac24f29ebb6343a5011e233a";

    useEffect(() => {
        const fetchWeather = async (lat: number, lon: number) => {
            try {
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
                );
                const data = await response.json();

                if (data.cod === 200) {
                    setWeather({
                        temp: Math.round(data.main.temp),
                        condition: data.weather[0].main,
                        description: data.weather[0].description,
                        humidity: data.main.humidity,
                        windSpeed: data.wind.speed,
                        location: data.name,
                        icon: data.weather[0].icon,
                    });
                } else {
                    setError("Failed to fetch weather data");
                }
            } catch (err) {
                setError("Error connecting to weather service");
            } finally {
                setLoading(false);
            }
        };

        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        fetchWeather(position.coords.latitude, position.coords.longitude);
                    },
                    () => {
                        // Default to New Delhi if permission denied
                        fetchWeather(28.6139, 77.2090);
                    }
                );
            } else {
                // Default to New Delhi if geolocation not supported
                fetchWeather(28.6139, 77.2090);
            }
        };

        getLocation();
    }, []);

    const getWeatherIcon = (condition: string) => {
        switch (condition.toLowerCase()) {
            case "clear": return <Sun className="w-10 h-10 text-yellow-400" />;
            case "clouds": return <Cloud className="w-10 h-10 text-gray-400" />;
            case "rain": return <CloudRain className="w-10 h-10 text-blue-400" />;
            case "drizzle": return <CloudDrizzle className="w-10 h-10 text-blue-300" />;
            case "thunderstorm": return <CloudLightning className="w-10 h-10 text-purple-400" />;
            case "snow": return <CloudSnow className="w-10 h-10 text-blue-100" />;
            default: return <Cloud className="w-10 h-10 text-gray-400" />;
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-center min-h-[160px]">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (error || !weather) {
        return (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-center min-h-[160px]">
                <p className="text-gray-400 text-sm">{error || "Weather unavailable"}</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
        >
            {/* Background Decoration */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50 rounded-full blur-3xl group-hover:bg-blue-100 transition-colors"></div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="flex items-center gap-1 text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
                            <MapPin className="w-3 h-3 text-blue-500" />
                            {weather.location}
                        </div>
                        <div className="text-4xl font-bold text-gray-800">
                            {weather.temp}°
                            <span className="text-2xl font-medium text-gray-400">c</span>
                        </div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-xl">
                        {getWeatherIcon(weather.condition)}
                    </div>
                </div>

                <div className="text-sm font-medium text-gray-600 mb-6 capitalize">
                    {weather.description}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-gray-50 rounded-lg">
                            <Droplets className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Humidity</p>
                            <p className="text-sm font-bold text-gray-700">{weather.humidity}%</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-gray-50 rounded-lg">
                            <Wind className="w-4 h-4 text-teal-400" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Wind</p>
                            <p className="text-sm font-bold text-gray-700">{weather.windSpeed} km/h</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
