// stores/counter.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => {
    return { 
        count: 0 ,
        filteredAddresses :([]),
        selectedCoordinates: { lat: null, lon: null }
    }
  },

  actions: {
     searchAddresses (event) {
  const query = event.query;
  const token = 'a2c3836e1483440a86077f7d23c169405924ddc6';

  fetch('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Token ${token}`,
      'X-Secret': '2e0536c54e06461d2f12350d038bc234c69a3fcb'
    },
    body: JSON.stringify({ query, count: 10, language: 'ru' })
  })
    .then(response => response.json())
    .then(data => {
      this.filteredAddresses = data.suggestions.map(suggestion => ({
        name: suggestion.value,
        data: suggestion.data
      }));
    })
.catch(console.error)
    },
    setCoordinates(suggestion) {
      const { geo_lat, geo_lon } = suggestion.data
      this.selectedCoordinates = {
        lat: parseFloat(geo_lat),
        lon: parseFloat(geo_lon)
      }
    }
},
async adressByCoordinates(coordinate) {
  const token = 'a2c3836e1483440a86077f7d23c169405924ddc6';
  const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address";
  const query = coordinate;

  fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Token ${token}`,
      'X-Secret': '2e0536c54e06461d2f12350d038bc234c69a3fcb'
    },
    body: JSON.stringify({ query, count: 1, language: 'ru' })
  })
    .then(response => response.json())
    .then(data => {
      if (data.suggestions.length > 0) {
      selectedAddress.value = data.suggestions[0].value;
      status.value = selectedAddress.value; 
    }
      filteredAddresses.value = data.suggestions.map(suggestion => ({
        name: suggestion.value,
        data: suggestion.data
      }));
       showTemporaryAlert(data.suggestions[0].value);
    })
    .catch(error => console.error('Error fetching addresses:', error));
}
  },
)


