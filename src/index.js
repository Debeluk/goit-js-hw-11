import axios from 'axios';
import { Notify } from 'notiflix';
import { fetchBreeds,fetchCatByBreed } from './cat-api.js';

axios.defaults.headers.common['x-api-key'] = 'live_7OmHCNWsSrqi3vdA1HFMl0CkV035BNyesghrSC8tUcfriqDjnLMsFYPhRtKIyotP';

document.addEventListener('DOMContentLoaded', (event) => {
  const selector = document.querySelector('.breed-select');
  const catInfo = document.querySelector('.cat-info');
  const loader = document.querySelector('.loader');

  loader.style.display = 'flex';
  selector.style.display = 'none';

  let breedInfo = [];

  fetchBreeds()
    .then(data => {
      data.forEach(breed => {
        const option = document.createElement('option');
        option.value = breed.id;
        option.textContent = breed.name;
        selector.appendChild(option);
      });
      breedInfo = data;

      selector.style.display = 'flex';
      loader.style.display = 'none';
    })
    .catch(err => {
      Notify.failure('Oops! Something went wrong loading the breeds! Try reloading the page!');
      console.error(err);

      selector.style.display = 'flex';
      loader.style.display = 'none';
    });

    selector.addEventListener('change', event => {
      loader.style.display = 'flex';
      catInfo.innerHTML = '';
  
      const info = breedInfo.find(item => item.id === event.target.value);
      fetchCatByBreed(event.target.value)
        .then(data => {
          if (data.length === 0) {
            loader.style.display = 'none';
            Notify.failure('No images found for this breed.');
            return;
          }
  
          catInfo.innerHTML = `
            <div class="img-div">
              <img src="${data[0].url}" alt="${info.name}" width="300" />
            </div>
            <h2>${info.name}</h2>
            <h3> Description: ${info.description}</h3>
            <p> Temperament: ${info.temperament}</p>
          `;
          loader.style.display = 'none';
        })
        .catch(err => {
          Notify.failure('Oops! Something went wrong loading the cat info! Try reloading the page!');
          console.error(err);
          loader.style.display = 'none';
        });
  });
});
