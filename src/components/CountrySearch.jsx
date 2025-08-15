import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

function CountrySearch({ onSelectCountry }) {
  const [countries, setCountries] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data);
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
      });
  }, []);

  const filtered = countries.filter((country) =>
    country.name.common.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search for a country..."
        className="p-2 border w-full rounded mb-4"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <ul className="space-y-2 max-h-60 overflow-y-auto">
        {filtered.slice(0, 10).map((country) => (
          <li
            key={country.cca3}
            role="button"
            tabIndex={0}
            onClick={() => onSelectCountry(country)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSelectCountry(country);
            }}
            className="p-2 bg-white rounded shadow hover:bg-blue-100 cursor-pointer"
          >
            {country.flag || '🌍'} {country.name.common}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Optional: Fix warning by defining expected prop type
CountrySearch.propTypes = {
  onSelectCountry: PropTypes.func.isRequired,
};

export default CountrySearch;
