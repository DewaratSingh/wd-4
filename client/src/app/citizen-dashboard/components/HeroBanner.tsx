import { useState, useEffect } from "react";
import { CloudSun, MapPin, AlertCircle, Wind, Loader2 } from "lucide-react";

interface HeroBannerProps {
    user?: {
        name: string;
        municipal_name: string;
        latitude?: number;
        longitude?: number;
    };
}

export default function HeroBanner({ user }: HeroBannerProps) {
    const [weather, setWeather] = useState<{ temp: number; condition: string; location: string } | null>(null);
    const [aqi, setAqi] = useState<{ value: number; label: string; color: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const getAqiLabel = (index: number) => {
        const labels: Record<number, { text: string; color: string }> = {
            1: { text: "Good", color: "text-green-300" },
            2: { text: "Fair", color: "text-yellow-300" },
            3: { text: "Moderate", color: "text-orange-300" },
            4: { text: "Poor", color: "text-red-300" },
            5: { text: "Very Poor", color: "text-purple-300" }
        };
        return labels[index] || { text: "Unknown", color: "text-gray-300" };
    };

    useEffect(() => {
        if (user?.latitude && user?.longitude) {
            const fetchData = async () => {
                setLoading(true);
                const apiKey = 'ae888bf8ac24f29ebb6343a5011e233a';
                try {
                    // Fetch Weather
                    const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${user.latitude}&lon=${user.longitude}&units=metric&appid=${apiKey}`);
                    const weatherData = await weatherRes.json();
                    console.log(weatherData);

                    if (weatherData.cod === 200) {
                        setWeather({
                            temp: Math.round(weatherData.main.temp),
                            condition: weatherData.weather[0].main,
                            location: weatherData.name
                        });
                    }

                    // Fetch AQI
                    const aqiRes = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${user.latitude}&lon=${user.longitude}&appid=${apiKey}`);
                    const aqiData = await aqiRes.json();

                    if (aqiData.list?.[0]) {
                        const val = aqiData.list[0].main.aqi;
                        const info = getAqiLabel(val);
                        setAqi({
                            value: val,
                            label: info.text,
                            color: info.color
                        });
                    }
                } catch (error) {
                    console.error("Fetch error:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }
    }, [user?.latitude, user?.longitude]);

    return (
        <div className="relative w-full bg-gradient-to-r from-blue-700 to-blue-600 rounded-3xl p-8 text-white overflow-hidden shadow-lg">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                        Good Morning, {user?.name || 'Citizen'} <span className="text-2xl">👋</span>
                    </h1>
                    <div className="flex items-center gap-2 text-blue-100 text-sm mb-6">
                        <MapPin className="w-4 h-4" />
                        <span>{weather?.location || user?.municipal_name || 'Locating...'}</span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium">
                            <CloudSun className="w-5 h-5 text-yellow-300" />
                            <span>
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> :
                                    weather ? `${weather.temp}°C ${weather.condition}` : 'Loading Weather...'}
                            </span>
                        </div>
                        <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium">
                            <Wind className={`w-5 h-5 ${aqi?.color || 'text-green-300'}`} />
                            <span>
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> :
                                    aqi ? `AQI ${aqi.value} (${aqi.label})` : 'Loading AQI...'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium border border-white/20">
                    <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                    3 active issues
                </div> */}
            </div>

            {/* Decorative background circle */}
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>
    );
}
