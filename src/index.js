import axiosn from 'axios';
import Notiflix from 'notiflix';

const API_KEY = '40334609-b80ca2dc1b64dcae4aab10255';
const BASE_URL = 'https://pixabay.com/api/';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let currentPage = 1;
let currentQuery = '';

// Запит до Pixibay
async function fetchImages(query, page) {
  const options = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: 40,
  };

  const stringParams = new URLSearchParams(options).toString();
  const url = `${BASE_URL}?${stringParams}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.hits.length === 0 ) {
    throw new Error("No images found for the given query.");
  }

  return data.hits;
}

console.log(fetchImages)


// Розмітка картинок 
function renderImages(images) {
  images.forEach(image => {
    const markup = `
      <div class="photo-card">
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes:</b> ${image.likes}
          </p>
          <p class="info-item">
            <b>Views:</b> ${image.views}
          </p>
          <p class="info-item">
            <b>Comments:</b> ${image.comments}
          </p>
          <p class="info-item">
            <b>Downloads:</b> ${image.downloads}
          </p>
        </div>
      </div>
    `;
    gallery.insertAdjacentHTML('beforeend', markup);
  });
}


// Кнопка submit

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  currentQuery = event.target.elements.searchQuery.value;
  currentPage = 1;
  gallery.innerHTML = '';

  try {
    const images = await fetchImages(currentQuery, currentPage);
    renderImages(images);
    loadMoreBtn.style.display = 'block';
  } catch (error) {
    console.error(error.message);
  }
});