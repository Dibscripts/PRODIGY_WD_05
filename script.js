const apiKey = 'e6cf2ab9c32b94dabe25cbd4a3434a85'; 
const weatherDiv = document.getElementById('weather');
const errorDiv = document.getElementById('error');
const form = document.getElementById('locationForm');
const input = document.getElementById('locationInput');
const geoBtn = document.getElementById('geoBtn');
const resetBtn = document.getElementById('resetBtn');

function displayWeather(data) {
    weatherDiv.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <img class="weather-icon" src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">
        <p><strong>${data.weather[0].main}</strong> - ${data.weather[0].description}</p>
        <p>Temperature: ${Math.round(data.main.temp)}°C</p>
        <p>Feels like: ${Math.round(data.main.feels_like)}°C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind: ${data.wind.speed} m/s</p>
    `;
}

function showError(message) {
    errorDiv.textContent = message;
    weatherDiv.innerHTML = '';
}

async function fetchWeatherByCity(city) {
    errorDiv.textContent = '';
    weatherDiv.innerHTML = 'Loading...';
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`);
        if (!res.ok) throw new Error('Location not found');
        const data = await res.json();
        displayWeather(data);
    } catch (err) {
        showError(err.message);
    }
}

async function fetchWeatherByCoords(lat, lon) {
    errorDiv.textContent = '';
    weatherDiv.innerHTML = 'Loading...';
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        if (!res.ok) throw new Error('Unable to fetch weather for your location');
        const data = await res.json();
        displayWeather(data);
    } catch (err) {
        showError(err.message);
    }
}

form.addEventListener('submit', e => {
    e.preventDefault();
    const city = input.value.trim();
    if (city) {
        fetchWeatherByCity(city);
    } else {
        showError('Please enter a location.');
    }
});

geoBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            pos => {
                fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
            },
            () => {
                showError('Unable to access your location.');
            }
        );
    } else {
        showError('Geolocation is not supported by your browser.');
    }
});

resetBtn.addEventListener('click', () => {
    input.value = '';
    weatherDiv.innerHTML = '';
    errorDiv.textContent = '';
});