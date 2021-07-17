import './sass/main.scss';

import refs from './js/refs.js';
import fetchCountries from './js/fetchCountries.js';
import countryCard from './templates/countryCard.hbs';
import countriesList from './templates/countriesList.hbs';

import { info } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import * as Confirm from '@pnotify/confirm';
import '@pnotify/confirm/dist/PNotifyConfirm.css';

const debounce = require('lodash.debounce');

refs.searchArea.addEventListener('input', debounce(onSearch, 500));
refs.cardContainer.addEventListener('click', clickOnCountry);

function clickOnCountry(e) {
  if (e.target.classList.contains('country-list-item')) {
    refs.searchArea.value = e.target.textContent;
    refs.cardContainer.innerHTML = '';

    const searchQuery = refs.searchArea.value.toLowerCase();
    if (searchQuery === '') {
      refs.cardContainer.innerHTML = '';
      return;
    }

    fetchCountries
      .fetchCountry(searchQuery)
      .then(showCountries)
      .catch(error => console.log(error));
  }
}

function onSearch(e) {
  e.preventDefault();

  const searchQuery = e.target.value.toLowerCase();
  if (searchQuery === '') {
    refs.cardContainer.innerHTML = '';
    return;
  }

  fetchCountries
    .fetchCountry(searchQuery)
    .then(showCountries)
    .catch(error => console.log(error));
}

function showCountries(countries) {
  refs.cardContainer.innerHTML = '';
  refs.searchArea.value = '';

  if (countries.length === undefined) {
    searchErr();
    return;
  }
  if (countries.length > 1 && countries.length <= 10) {
    renderList(countries);
    return;
  }
  if (countries.length === 1) {
    renderCard(countries);
    return;
  }
  outputErr();
}

function renderCard(country) {
  const markup = countryCard(country[0]);
  refs.cardContainer.innerHTML = markup;
}

function renderList(country) {
  const markup = countriesList(country);
  refs.cardContainer.insertAdjacentHTML('afterbegin', markup);
}

function outputErr() {
  info({
    title: 'Error',
    text: 'Too many matches found. Please entry a more specific query!',
    modules: new Map([
      [
        Confirm,
        {
          confirm: true,
          buttons: [
            {
              text: 'OK',
              primary: true,
              click: notice => {
                notice.close();
              },
            },
          ],
        },
      ],
    ]),
  });
}

function searchErr() {
  info({
    title: 'Error',
    text: 'Country was not found!',
    modules: new Map([
      [
        Confirm,
        {
          confirm: true,
          buttons: [
            {
              text: 'OK',
              primary: true,
              click: notice => {
                notice.close();
              },
            },
          ],
        },
      ],
    ]),
  });
}
