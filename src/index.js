import axiosn from 'axios';
import { Notify } from 'notiflix';
import simpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";

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
    Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    throw new Error("No images found for the given query.");
  }
  return data.hits;
}

// Розмітка картинок 
function renderImages(images) {
  images.forEach(image => {
    const imageMarkup = `
      <a href="${image.largeImageURL}" class="lightbox">
        <div class="photo-card">
          <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
          <div class="info">
            <p class="info-item"><b>Likes:</b> ${image.likes}</p>
            <p class="info-item"><b>Views:</b> ${image.views}</p>
            <p class="info-item"><b>Comments:</b> ${image.comments}</p>
            <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
          </div>
        </div>
      </a>`;
    gallery.insertAdjacentHTML('beforeend', imageMarkup);
  });
  const lightbox = new simpleLightbox('.lightbox');
  lightbox.refresh();
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


// Кнопка load more

loadMoreBtn.addEventListener('click', async () => {
  try {
    currentPage += 1;
    const images = await fetchImages(currentQuery, currentPage);
    renderImages(images);
  } catch (error) {
    Notify.info("We're sorry, but you've reached the end of search results.");
    loadMoreBtn.style.display = 'none';
    console.error(error.message);
  }
  smoothScroll();
});


// Плавна прокрутка 
function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}