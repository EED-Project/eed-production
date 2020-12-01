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
 //const apiURL = 'https://cors-anywhere.herokuapp.com/';
const apiURL = 'api/countries/';



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
        $('.media-body').removeClass('hidden');

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
                suggestionDropdown.append(`<li><a href="/?country=${country.country_name}" data-sug="${country.country_name}">${country.country_name}</a></li>`);
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
    $('.media-body').addClass('hidden');

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
                mobileSuggestionDropdown.append(`<li><a href="/?country=${country.country_name}" data-sug="${country.country_name}">${country.country_name}</a></li>`);
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



window.onscroll = function() {myFunction()};

// Get the header
var header = document.getElementsByTagName("body")[0];
header.classList.add('OverviewModeHeader');
var sticky = document.getElementById('overview');

// Get the offset position of the navbar
var offsetOverview = sticky.offsetTop + sticky.offsetHeight;

// Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction() {
    if (window.pageYOffset > offsetOverview) {
        header.classList.remove("OverviewModeHeader");
    } else {
        header.classList.add("OverviewModeHeader");
    }

}







var topMenu = $(".mobile-menu"),
    topMenuHeight = topMenu.outerHeight()+15,
    // All list items
    menuItems = topMenu.find("a"),
    // Anchors corresponding to menu items
    scrollItems = menuItems.map(function(){
        var item = $($(this).attr("href"));
        if (item.length) { return item; }
    });

// Bind to scroll
$(window).scroll(function(){
    // Get container scroll position
    var fromTop = $(this).scrollTop()+topMenuHeight;

    // Get id of current scroll item
    var cur = scrollItems.map(function(){
        fromTop = fromTop + 45;
        if ($(this).offset().top < fromTop)
            return this;
    });
    // Get the id of the current element
    cur = cur[cur.length-1];
    var id = cur && cur.length ? cur[0].id : "";
    // Set/remove active class
    menuItems
        .parent().removeClass("active")
        .end().filter("[href='#"+id+"']").parent().addClass("active");
    $(".active")[1].scrollIntoView();
});
