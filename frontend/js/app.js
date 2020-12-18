/** DOM Element */
const topSearchButton = $('#top-search-btn'),
  topSearchButtonClose = $('#top-search-button-close'),
  searchButtonClose = $('#search-button-close'),
  suggestionElement = $('#suggestion-list a, #suggestion-dropdown a'),
  topSuggestionDropdown = $('#top-suggestion-dropdown'),
  footer = $('#footer'),
  header = $('#header');
(searchInputElement = $('#search-input')), (topSearchInputElement = $('#top-search-input')), (mainContentHomepage = $('#main-content--homepage'));

/** Global Variable */
// const apiURL = 'https://cors-anywhere.herokuapp.com/http://eed-app.herokuapp.com/api/countries/';
const apiURL = 'api/countries/';
let countries = [];

/** Utilities */
function hideSearchBox() {
  header.removeClass('--fullscreen')
  footer.removeClass("--fullscreen");
  $('#main').removeClass('--fullscreen');
  mainContentHomepage.removeClass('--fullscreen');
}

function hideTopSearchbox() {
  footer.removeClass("--show");
  const topSearchBoxOuter = $('#top__search-box-outer');
  if (topSearchBoxOuter.hasClass('--show')) {
    hideSearchBox();

    // Hide top searchbox
    topSearchBoxOuter.removeClass('--show');

    // Remove top searchbox suggestions
    let topSuggestionDropdown = $('#top-suggestion-dropdown ul');
    topSuggestionDropdown.empty();

    // Remove top searchbox value
    topSearchInputElement.val('');

    // console.log('hideTopSearchbox');
  }
}

/** Event Handlers */
function topSearchButtonClickHandler(e) {
  e.preventDefault();
  e.stopPropagation();

  footer.addClass('--show')
  $('#top__search-box-outer').addClass('--show');
  topSearchInputElement.focus();

  // console.log('topSearchButtonClickHandler was called');
}

function topSearchButtonCloseClickHandler(e) {
  e.preventDefault();
  e.stopPropagation();
  hideTopSearchbox();
  // console.log('topSearchButtonButtonCloseClickHandler was called');
}

function searchButtonCloseClickHandler(e) {
  e.preventDefault();
  e.stopPropagation();
  hideSearchBox();
  // console.log('searchButtonCloseClickHandler was called');
}

function topSuggestionElementClickHandler(e) {
  //e.preventDefault();
  //e.stopPropagation();
  //const sugValue = e.target.dataset.sug;
  //topSearchInputElement.val(sugValue);
  // console.log('topSuggestionElementClickHandler was called', sugValue);
}

function suggestionElementClickHandler(e) {
  //e.preventDefault();
  //e.stopPropagation();
  //const sugValue = e.target.dataset.sug;
  //searchInputElement.val(sugValue);
  // console.log('suggestionElementClickHandler was called', sugValue);
}

function topSuggestionDropdownClickHandler(e) {
  e.preventDefault();
  e.stopPropagation();

  hideTopSearchbox();

  // console.log('topSuggestionDropdownClickHandler was called', sugValue);
}

function searchInputElementInputHandler(e) {
  const searchValue = e.target.value.toLowerCase();

  if (searchValue.length > 0) {
    // Filter countries
    let result = countries.filter(function (country) {
      return country.country_name.toLowerCase().includes(searchValue);
    });

    // Initialize suggestion dropdown
    let suggestionDropdown = $('#suggestion-dropdown ul');
    let suggestionDropdownElement = $('#suggestion-dropdown a');

    // Unbind click event then empty previous suggestion
    suggestionDropdownElement.off('click');
    suggestionDropdown.empty();

    // Populate suggestion dropdown
    if (result.length > 0) {
      for (let i = 0; i < result.length; i++) {
        const country = result[i];
        suggestionDropdown.append(`<li><a href="/?country=${country.country_name}" data-sug="${country.country_name}">${country.country_name}</a></li>`);
      }

      // Bind click event to new options
      suggestionDropdownElement = $('#suggestion-dropdown a');
      suggestionDropdownElement.on('click', suggestionElementClickHandler);
    } else {
      suggestionDropdown.append(`<li><a href="#" data-sug="No match found">No match found</a></li>`);
    }

    $('#main').addClass('--fullscreen');
    header.addClass("--fullscreen");
    footer.addClass("--fullscreen");
    mainContentHomepage.addClass('--fullscreen');
  } else {
    hideSearchBox();
  }
}

function topSearchInputElementInputHandler(e) {
  const searchValue = e.target.value.toLowerCase();

  if (searchValue.length > 0) {
    // Filter countries
    let result = countries.filter(function (country) {
      return country.country_name.toLowerCase().includes(searchValue);
    });

    // Initialize top suggestion dropdown
    let topSuggestionDropdown = $('#top-suggestion-dropdown ul');
    let topSuggestionDropdownElement = $('#top-suggestion-dropdown a');

    // Unbind click event then empty previous suggestion
    topSuggestionDropdownElement.off('click');
    topSuggestionDropdown.empty();

    // Populate top suggestion dropdown
    if (result.length > 0) {
      for (let i = 0; i < result.length; i++) {
        const country = result[i];
        topSuggestionDropdown.append(`<li><a href="/?country=${country.country_name}" data-sug="${country.country_name}">${country.country_name}</a></li>`);
      }

      // Bind click event to new options
      topSuggestionDropdownElement = $('#top-suggestion-dropdown a');
      topSuggestionDropdownElement.on('click', topSuggestionElementClickHandler);
    } else {
      topSuggestionDropdown.append(`<li><a href="#" data-sug="No match found">No match found</a></li>`);
    }
  }
}

function bodyClickHandler(e) {
  hideSearchBox();
  hideTopSearchbox();
  // console.log('bodyClickHandler called');
}

function mainContentHomepageClickHandler(e) {
  // e.stopPropagation();
  // hideSearchBox();
  // console.log('mainContentHomepageClickHandler called');
}

function getCountriesApiHandler(data) {
  const json = JSON.parse(data);
  if (json.hasOwnProperty('countries')) {
    countries = json['countries'];
  }
}

/** Event Registration */
topSearchButton.on('click', topSearchButtonClickHandler);
topSearchButtonClose.on('click', topSearchButtonCloseClickHandler);
searchButtonClose.on('click', searchButtonCloseClickHandler);
//suggestionElement.on("click", suggestionElementClickHandler);
topSuggestionDropdown.on('click', topSuggestionDropdownClickHandler);
searchInputElement.on('input', searchInputElementInputHandler);
topSearchInputElement.on('input', topSearchInputElementInputHandler);

// Close top searchbox when click outside
$('body').on('click', bodyClickHandler);
$('#top__search-box-outer').on('click', (e) => e.stopPropagation());
mainContentHomepage.on('click', mainContentHomepageClickHandler);
$('.main-content__search-box-outer').on('click', (e) => e.stopPropagation());
$('#top-suggestion-dropdown ul').on('click', (e) => e.stopPropagation());

window.onload = function () {
  $.ajax({
    url: apiURL,
    success: getCountriesApiHandler,
    dataType: 'text',
  });
};
