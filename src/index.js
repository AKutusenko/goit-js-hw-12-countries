import './sass/main.scss';

import fetchCountries from './js/fetchCountries.js';
import refs from './js/refs.js';
import countryCard from './templates/country-card.hbs';
import countriesList from './templates/countries-list.hbs';
//pnotify
import { info } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import * as Confirm from '@pnotify/confirm';
import '@pnotify/confirm/dist/PNotifyConfirm.css';

const debounce = require('lodash.debounce');

refs.searchArea.addEventListener('input', debounce(onSearch, 500));

function onSearch(event) {
  event.preventDefault();

  const searchQuery = event.target.value.toLowerCase();
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

  if (countries.length > 1) {
    if (countries.length <= 10) {
      renderList(countries);
    } else {
      outputError();
    }
  } else {
    if (countries.length === undefined) {
      searchError(countries);
    } else {
      renderCard(countries);
    }
  }
}

function renderCard(country) {
  const markup = countryCard(country[0]);
  refs.cardContainer.innerHTML = markup;
}

function renderList(country) {
  const markup = countriesList(country);
  refs.cardContainer.insertAdjacentHTML('afterbegin', markup);
}

function outputError() {
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
              text: 'Ok',
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

function searchError() {
  info({
    title: 'Error',
    text: 'Country was not found.Please, try again.',
    modules: new Map([
      [
        Confirm,
        {
          confirm: true,
          buttons: [
            {
              text: 'Ok',
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
