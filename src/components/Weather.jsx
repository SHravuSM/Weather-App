import React, { useEffect, useState } from 'react';
import { TbLocationSearch } from "react-icons/tb";
import { TbLocationFilled } from "react-icons/tb";

export default function Weather() {
    const [city, setCity] = useState();
    const [current, setCurrent] = useState('')
    const [res, setRes] = useState(null);

    async function fetchWeatherData(coords) {
        const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=aa9eeebfd6144c03b10140601242209&q=${coords}&aqi=yes`);
        if (!response.ok) {
            throw new Error("Weather data not available");
        }
        const data = await response.json();
        setRes(data);
    };

    function currentPos(cur_Pos) {
        fetch(`http://api.weatherapi.com/v1/current.json?key=aa9eeebfd6144c03b10140601242209&q=${cur_Pos}&aqi=yes`)
            .then(data => data.json())
            .then(data => setCurrent(data))
    }

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchWeatherData(`${latitude},${longitude}`);
                    currentPos(`${latitude},${longitude}`)
                },
                (error) => {
                    setErr("Unable to retrieve your location");
                    fetchWeatherData(city);
                }
            );
        } else {
            setErr("Geolocation is not supported by this browser.");
            fetchWeatherData(city);
        }
    }, []);

    const handleCity = (e) => {
        setCity(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchWeatherData(city);
        setCity('')
    };

    return (
        <>
            <div className='h-[90%] w-[95%] rounded-xl absolute flex'>
                <div className='w-full h-full rounded-lg flex justify-between sm:flex-wrap'>
                    <div className="w-[64.5%] object-center bg-[url('public/images/I1.jpg')] shadow-[rgba(50,50,93,0.25)_0px_50px_100px_-20px,rgba(0,0,0,0.3)_0px_30px_60px_-30px,_rgba(10,37,64,0.35)_0px_-2px_6px_0px_inset] relative bg-blue-400 rounded-lg bg-cover bg-center bg-no-repeat">
                        <div className='h-[15%] pr-2 pl-1 m-1 rounded-md flex justify-between items-center' >
                            <div className=' pl-1 flex flex-col items-center relative font-bold text-3xl tracking-wide text-white'>
                                <h1 className='text-opacity-50 text-white'>Weat<span className='text-red-400'>her</span></h1>
                                <div className=' w-[42px] relative left-10  bg-white h-1 mt-1 rounded-[5px_5px_5px_5px]'></div>
                                <h1 className=' left-20 relative text-emerald-400'>Forecast</h1>
                            </div>
                            <div className='rounded-lg flex justify-evenly items-center w-56 h-12 bg-slate-500'>
                                <TbLocationFilled className='w-5 text-white' />
                                <div>
                                    <h1 className='font-semibold text-white tracking-wider h-[10px] text-[10px]' >Current Location</h1>
                                    <h1 className='font-semibold text-lg' >{current ? current.location.name : ' '},{current ? current.location.region : ' '}</h1>
                                </div>
                            </div>
                        </div>

                        <div className='h-4/5 flex flex-col justify-center items-center '>
                            <h1 className='m-2 text-black font-bold font-mono drop-shadow-2xl'>The Only Weather Forecast <span className='text-blue-400'>You Need</span></h1>

                            <div className='m-2 w-32 h-[5px] rounded-[5px_5px_5px_5px] bg-white'></div>

                            <div className='m-2'>
                                <form onSubmit={handleSubmit}>
                                    <div className='opacity-70 bg-blue-300 pl-2 pr-3 w-96 p-1 rounded-md flex items-center'>
                                        <input
                                            placeholder='Enter location'
                                            className=' placeholder:text-gray-200 w-96 text-black bg-blue-300 border-0 p-1 rounded-md'
                                            type="text"
                                            value={city}
                                            onChange={handleCity}
                                        />
                                        <TbLocationSearch className='w-10 shadow-xl text-white active:h-2 duration-100 bg-blue-300 h-8 cursor-pointer' onClick={handleSubmit} />
                                    </div>
                                </form>
                            </div>
                        </div>

                    </div>
                    <div className='w-[35%] flex flex-col items-center gap-1 p-2 h-fullrounded-lg'>
                        <div className='rounded-md w-full h-3/5 flex flex-col items-start p-2 pt-0 relative'>
                            <h1 className='font-sans text-left text-3xl drop-shadow-[1px_2px_2px_black] text-red font-bold absolute top-4 left-3'>{res ? res.location.name : ' '}</h1>
                            <div className='flex justify-evenly items-center rounded-md shadow-[rgba(50,50,93,0.25)_0px_50px_100px_-20px,rgba(0,0,0,0.3)_0px_30px_60px_-30px,_rgba(10,37,64,0.35)_0px_-2px_6px_0px_inset] h-4/5 absolute bottom-1 l-[1%] r-[1%] w-[96.5%]  mb-1'>
                                {res ? <>
                                    <div className='flex flex-col items-center rounded-md mb-1 p-2 pt-0'>
                                        <h1 className='text-center font-sans text-2xl text-black font-bold'>{res ? `${res.current.feelslike_c}°C` : " "}</h1>
                                        <img className='w-24' src={res ? res.current.condition.icon : 'sorry'} alt="Weather condition icon" />
                                        <h1 className=' text-[18xl] overflow-x-hidden text-center font-normal text-black'>{res ? res.current.condition.text : " "}</h1>
                                        <h6 className='text-center font-sans text-xs text-black font-medium'>{res ? `${res.location.region}, ${res.location.country.toUpperCase()}` : ' '}</h6>
                                    </div>

                                    <div className='w-[2px] rounded-[20%] h-4/5 bg-gray-500'><hr /></div>

                                    <div>
                                        <ul className='text-lg font-sans font-semibold'>
                                            <li>Wind Speed : {res ? res.current.wind_kph : null}kmph</li>
                                            <li>Wind Direction : {res ? res.current.wind_dir : null}</li>
                                            <li>Humidity : {res ? res.current.humidity : null} %</li>
                                            <li>UV Index :  {res ? res.current.uv : null}</li>
                                            <li>Cloud Cover : {res ? res.current.cloud : null} %</li>
                                            <li>visibility : {res ? res.current.vis_km : null}kmph</li>
                                        </ul>
                                    </div></> : <img className='h-full w-full object-cover rounded-lg' src="https://i.pinimg.com/originals/49/e5/8d/49e58d5922019b8ec4642a2e2b9291c2.png" alt="" />}

                            </div>

                        </div>
                        {res ? <> <div className='rounded-md w-fullflex shadow-[0px_0px_10px_3px_rgba(0,0,0,0.3)] flex-col p-2 pl-4 pr-4 h-2/5 w-[94%] relative bg-white'>
                            <h1 className='text-center font-mono text-2xl text-slate-700 h-1/5  font-bold relative top-2 '>Air Quality</h1>
                            <div className='text-lg flex flex-col rounded-lg  justify-evenly h-4/5 text-center font-sans font-semibold'>
                                <h1>Co: {res ? res.current.air_quality.co : " "}µg/m³</h1>
                                <h1>O<sub>3</sub>: {res ? res.current.air_quality.o3 : " "}µg/m³</h1>
                                <h1>NO<sub>2</sub>: {res ? res.current.air_quality.no2 : " "}µg/m³</h1>
                                <h1>SO<sub>3</sub>: {res ? res.current.air_quality.so2 : " "}µg/m³</h1>
                            </div>

                        </div></> : <div className='rounded-md flex items-center justify-center w-full h-2/5 bg-white'>
                            <img className='h-24 w-24 object-cover' src="https://cdn-icons-png.flaticon.com/512/11119/11119962.png" alt="" />
                        </div>}

                    </div>
                </div>
            </div>
        </>
    );
}