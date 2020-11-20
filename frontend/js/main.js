'use strict'

/** DOM Element */
let menuBlock = document.querySelector('.menu__block');
let burger = document.querySelector('.burger');
let searchBlock = $('#search__block');
let searchInput = $('#search-input');
let searchInputButtonClose = $('#search-input-button-close');
let searchBoxCover = $('#searchbox__cover');
let mobileSearchBoxContainer = $('#mobile__search-container');
let mobileSearchIcon = $('#mobile-search-icon');
let mobileSearchInput = $('#mobile-search-input');
let mobileSearchButtonClose = $('#mobile-search-button-close');
let mobileSuggestionDropdown = $('#mobile-suggestion-dropdown');


/** Global Variable */
//const apiURL = 'https://cors-anywhere.herokuapp.com/http://eed-app.herokuapp.com/api/countries/';
const apiURL = 'http://eed-app.herokuapp.com/api/countries/';
let countries = [];


/** Utilities */
function showSearchBox() {
    $(menuBlock).addClass('--hide');
    searchBlock.addClass('--search__active');
    searchBoxCover.addClass('--block');
    // console.log('showSearchBox');
}

function hideSearchBox() {
    $(menuBlock).removeClass('--hide');
    searchBlock.removeClass('--search__active');
    searchBoxCover.removeClass('--block');
    $('#suggestion-dropdown').removeClass('--show');
    // console.log('hideSearchBox');
}

function hideMobileSearchBox() {
    if(mobileSearchBoxContainer.hasClass('--show')) {
        mobileSearchBoxContainer.removeClass('--show');

        // Remove mobile searchbox suggestions
        let mobileSuggestionDropdown = $('#mobile-suggestion-dropdown ul');
        mobileSuggestionDropdown.empty();

        // Remove mobile searchbox value
        mobileSearchInput.val("");
        // console.log('hideMobileSearchBox');
    }
}


/** Event Handlers */
function getCountriesApiHandler(data) {
    const json = JSON.parse(data);
    if(json.hasOwnProperty('countries')) {
        countries = json['countries'];
    }
}

function suggestionElementClickHandler(e) {
    const sugValue = e.target.dataset.sug;
    searchInput.val(sugValue);
    // console.log('suggestionElementClickHandler was called', sugValue);
}

function searchInputButtonCloseClickHandler(e) {
    e.preventDefault();
    hideSearchBox();
    // console.log('searchInputButtonCloseClickHandler called');
}

function searchInputElementFocusHandler(e) {
    showSearchBox();
    // console.log('searchInputElementFocusHandler called');
}

function searchInputElementInputHandler(e) {
    const searchValue = e.target.value.toLowerCase();

    if (searchValue.length > 0) {

        // Filter countries
        let result = countries.filter(function(country) {
            return country.country_name.toLowerCase().includes(searchValue);
        })

        // Initialize suggestion dropdown
        let suggestionDropdown = $('#suggestion-dropdown ul');
        let suggestionDropdownElement = $('#suggestion-dropdown a');

        // Unbind click event then empty previous suggestion
        suggestionDropdownElement.off('click');
        suggestionDropdown.empty();

        // Populate suggestion dropdown
        if(result.length > 0) {
            for(let i = 0; i < result.length; i++) {
                const country = result[i];
                suggestionDropdown.append(`<li><a href="#" data-sug="${country.country_name}">${country.country_name}</a></li>`);
            }

            // Bind click event to new options
            suggestionDropdownElement = $('#suggestion-dropdown a');
            suggestionDropdownElement.on("click", suggestionElementClickHandler);
        }
        else {
            suggestionDropdown.append(`<li><a href="#" data-sug="No match found">No match found</a></li>`);
        }

        $('#suggestion-dropdown').addClass('--show');
    } else {
        $('#suggestion-dropdown').removeClass('--show');
    }
}

function mobileSearchIconClickHandler(e) {
    mobileSearchBoxContainer.addClass('--show');
    mobileSearchInput.focus();
    // console.log('mobileSearchIconClickHandler called');
}

function mobileSuggestionElementClickHandler(e) {
    e.preventDefault();
    e.stopPropagation();
    const sugValue = e.target.dataset.sug;
    mobileSearchInput.val(sugValue);
    // console.log('mobileSuggestionElementClickHandler was called', sugValue);
}

function mobileSearchInputElementInputHandler(e) {
    const searchValue = e.target.value.toLowerCase();

    if (searchValue.length > 0) {

        // Filter countries
        let result = countries.filter(function(country) {
            return country.country_name.toLowerCase().includes(searchValue);
        })

        // Initialize suggestion dropdown
        let mobileSuggestionDropdown = $('#mobile-suggestion-dropdown ul');
        let mobileSuggestionDropdownElement = $('#mobile-suggestion-dropdown a');

        // Unbind click event then empty previous suggestion
        mobileSuggestionDropdownElement.off('click');
        mobileSuggestionDropdown.empty();

        // Populate suggestion dropdown
        if(result.length > 0) {
            for(let i = 0; i < result.length; i++) {
                const country = result[i];
                mobileSuggestionDropdown.append(`<li><a href="#" data-sug="${country.country_name}">${country.country_name}</a></li>`);
            }

            // Bind click event to new options
            mobileSuggestionDropdownElement = $('#mobile-suggestion-dropdown a');
            mobileSuggestionDropdownElement.on("click", mobileSuggestionElementClickHandler);
        }
        else {
            mobileSuggestionDropdown.append(`<li><a href="#" data-sug="No match found">No match found</a></li>`);
        }
    }
    else {
        // Initialize suggestion dropdown
        let mobileSuggestionDropdown = $('#mobile-suggestion-dropdown ul');
        let mobileSuggestionDropdownElement = $('#mobile-suggestion-dropdown a');

        // Unbind click event then empty previous suggestion
        mobileSuggestionDropdownElement.off('click');
        mobileSuggestionDropdown.empty();
    }
}

function mobileSearchButtonCloseClickHandler(e) {
    hideMobileSearchBox();
    // console.log('mobileSearchButtonCloseClickHandler called');
}

function mobileSuggestionDropdownClickHandler(e) {
    hideMobileSearchBox();
    // console.log('mobileSuggestionDropdownClickHandler called');
}

function headerClickHandler(e) {
    hideSearchBox();
    // console.log('headerClickHandler called');
}

function searchBoxCoverClickHandler(e) {
    hideSearchBox();
    // console.log('searchBoxCoverClickHandler called');
}

/** Event Registration */
burger.addEventListener('mouseover', () => {
	menuBlock.classList.toggle('menu__block__active');
});
searchInput.on('focus', searchInputElementFocusHandler);
searchInput.on('input', searchInputElementInputHandler);
searchInputButtonClose.on('click', searchInputButtonCloseClickHandler);
mobileSearchIcon.on('click', mobileSearchIconClickHandler);
mobileSearchInput.on('input', mobileSearchInputElementInputHandler);
mobileSearchButtonClose.on('click', mobileSearchButtonCloseClickHandler);

// Close top searchbox when click outside
$('header').on('click', headerClickHandler);
searchBoxCover.on('click', searchBoxCoverClickHandler);
searchBlock.on('click', (e) => e.stopPropagation());
mobileSuggestionDropdown.on('click', mobileSuggestionDropdownClickHandler);

window.onload = function() {
    $.ajax({
        url: apiURL,
        success: getCountriesApiHandler,
        dataType: 'text'
    });
}
