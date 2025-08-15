import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const CountryInfo = ({ countryCode, lang }) => {
  const [info, setInfo] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [localTime, setLocalTime] = useState(null);
  const [landmarks, setLandmarks] = useState([]);
  const [error, setError] = useState("");
  const [zoom, setZoom] = useState(5);

  const OPENCAGE_KEY = "860200235e154a488ca8f893d5461167";
  const TIMEZONE_API_KEY = "HGV82GIQXVQ5";
  const EXCHANGE_API_KEY = "7ddb8cf67ec50df633854396";

  useEffect(() => {
    const fetchData = async () => {
      setError("");
      setInfo(null);
      setLandmarks([]);
      try {
        if (countryCode.length <= 3) {
          const res = await fetch(
            `https://restcountries.com/v3.1/alpha/${countryCode}`
          );
          const data = await res.json();
          const c = data[0];
          setInfo({
            name: c.name.common,
            latlng: c.latlng,
            region: c.region,
            capital: c.capital?.[0],
            population: c.population,
            currencyCode: Object.keys(c.currencies || {})[0],
            currencyName: Object.values(c.currencies || {})[0]?.name,
            flag: c.flags?.png,
          });
          setZoom(5);
        } else {
          const res = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
              countryCode
            )}&limit=10&key=${OPENCAGE_KEY}`
          );
          const data = await res.json();
          if (!data.results.length) throw new Error("Location not found");

          const place = data.results[0];
          const loc = place.geometry;
          setInfo({
            name: place.formatted,
            latlng: [loc.lat, loc.lng],
            region: place.components.country,
          });
          setZoom(12);
        }
      } catch (err) {
        setError("Failed to fetch location info: " + err.message);
      }
    };
    fetchData();
  }, [countryCode, lang]);

  useEffect(() => {
    if (!info?.latlng) return;
    fetch(
      `https://api.timezonedb.com/v2.1/get-time-zone?format=json&by=position&key=${TIMEZONE_API_KEY}&lat=${info.latlng[0]}&lng=${info.latlng[1]}`
    )
      .then((res) => res.json())
      .then((d) => setLocalTime(d.formatted));
  }, [info]);

  useEffect(() => {
    if (!info?.currencyCode) return;
    fetch(
      `https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/latest/${info.currencyCode}`
    )
      .then((res) => res.json())
      .then((d) => setExchangeRate(d.conversion_rates?.INR || null));
  }, [info]);

  // === Landmarks with HD Image (Wikipedia) ===
  useEffect(() => {
    if (!info?.name) return;

    const fetchData = async () => {
      // 1) Get canonical wiki title
      const titleResp = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
          info.name
        )}&format=json&origin=*`
      );
      const titleJson = await titleResp.json();
      if (!titleJson.query?.search?.length) {
        setLandmarks([]);
        return;
      }
      const pageTitle = titleJson.query.search[0].title;

      // 2) Try HD image
      let hdImage = null;
      await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/media/${encodeURIComponent(
          pageTitle
        )}?origin=*`
      )
        .then((r) => r.json())
        .then((m) => {
          const img = m.items?.find((item) => item.type === "image");
          if (img) {
            hdImage =
              img.original?.source ||
              img.thumbnail?.source ||
              null;
          }
        })
        .catch(() => {});

      // 3) Fetch landmarks in high resolution
      fetch(
        `https://${lang}.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
          `${pageTitle} landmarks`
        )}&gsrlimit=5&prop=pageimages|extracts&exintro&explaintext&piprop=original&format=json&origin=*`
      )
        .then((res) => res.json())
        .then((d) => {
          let pages = [];
          if (d.query?.pages) {
            pages = Object.values(d.query.pages).map((p) => ({
              title: p.title,
              extract: p.extract,
              thumbnail:
                hdImage || p.original?.source || p.thumbnail?.source || null,
            }));
          }
          setLandmarks(pages);
        });
    };

    fetchData();
  }, [info, lang]);

  if (error) return <p className="text-red-600 text-center">{error}</p>;
  if (!info) return <p className="text-center">Loading…</p>;

  return (
    <div className="text-center px-4">
      {info.flag && (
        <img src={info.flag} alt="flag" className="w-24 mx-auto mb-4" />
      )}
      <h2 className="text-2xl font-bold mb-2">{info.name}</h2>
      <p>Region: {info.region}</p>
      {localTime && <p>🕒 Local Time: {localTime}</p>}
      {exchangeRate && (
        <p>💱 1 {info.currencyCode} ≈ {exchangeRate} INR</p>
      )}

      <div className="my-6 h-[400px]">
        <MapContainer
          center={info.latlng}
          zoom={zoom}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={info.latlng}>
            <Popup>{info.name}</Popup>
          </Marker>
        </MapContainer>
      </div>

      {landmarks.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Famous Landmarks</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {landmarks.map((l, i) => (
              <div key={i} className="border rounded-lg p-4 bg-white dark:bg-gray-800">
                {l.thumbnail && (
                  <img
                    src={l.thumbnail}
                    alt={l.title}
                    className="rounded w-full h-40 object-cover mb-2"
                  />
                )}
                <h4 className="font-semibold">{l.title}</h4>
                <p className="text-sm">{l.extract}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

CountryInfo.propTypes = {
  countryCode: PropTypes.string.isRequired,
  lang: PropTypes.string.isRequired,
};

export default CountryInfo;
