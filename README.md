# 🌏 WanderLog

**WanderLog** is a smart travel application that lets users explore **any place in the world** — including remote towns and districts.  
It shows 📍 **exact location on a live map**, 🌤 **weather**, 🕒 **local time**, 💱 **currency information**, 📷 **high-resolution images** (Wikipedia), and 🏛 **famous landmarks**, all in one place.

---

## 🚀 Features

- 🔎 Search by **country / state / city / district / remote place**
- 🗺 Interactive map (OpenStreetMap + Leaflet)
- 🌤 Real-time **weather information** using OpenWeatherMap API
- 🕒 Local **time** using TimezoneDB
- 💱 **Exchange rate** (base currency → INR) using ExchangeRate API
- 📷 **High-resolution image** of the place (Wikipedia media)
- 🏛 Shows **well-known landmarks** from Wikipedia
- Supports 🔤 **multi-language** via language selector

---

## ⚙️ Tech Stack

| Stack / Tool       | Uses                                               |
|--------------------|----------------------------------------------------|
| **React**          | Front-end UI                                       |
| **Leaflet**        | Interactive OpenStreetMap                          |
| **TailwindCSS**    | Styling                                            |
| **OpenCage API**   | Geocoding (lat/lng of any location)                |
| **OpenWeatherMap** | Weather data                                       |
| **TimeZoneDB**     | Get time zone + local time                         |
| **Wikipedia REST** | HD image & landmark content                        |

---

## ✅ Prerequisites

Before running the app, create **free API keys** for the following services:

| Service            | URL |
|--------------------|--------------------------------------------------------|
| OpenCage Geocoder  | https://opencagedata.com/                               |
| OpenWeatherMap     | https://openweathermap.org/                             |
| TimeZoneDB         | https://timezonedb.com/                                 |

> Add these keys in the place of `YOUR_API_KEY` within the code.
![WanderLog Screenshot1](./screenshots/homepage.png)

---

## 💻 Local Setup

```bash
# clone the repository
git clone https://github.com/<your-username>/<your-repo>.git

cd <your-repo>

# install dependencies
npm install

# run the app
npm run dev
# or
npm start
