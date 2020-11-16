/** DOM Element */
const topSearchButton = $('#top-search-btn'),
    suggestionElement = $('#suggestion-list a, #suggestion-dropdown a'),
    searchInputElement = $('#search-input'),
    mainContentHomepage = $('#main-content--homepage');


/** Event Handlers */
function topSearchButtonClickHandler(e) {
    e.preventDefault();

    searchInputElement.focus();
    console.log('topSearchButtonClickHandler was called');
}

function suggestionElementClickHandler(e) {
    e.preventDefault();

    const sugValue = e.target.dataset.sug;
    searchInputElement.val(sugValue);
    window.location.replace("https://eed-app.herokuapp.com/?country="+sugValue);
}

function searchInputElementInputHandler(e) {
    const searchValue = e.target.value;

    if (searchValue.length > 0) {
        $('#main').addClass('--fullscreen')
        mainContentHomepage.addClass('--fullscreen')
    } else {
        $('#main').removeClass('--fullscreen')
        mainContentHomepage.removeClass('--fullscreen')
    }
}

/** Event Registration */
topSearchButton.on("click", topSearchButtonClickHandler);
suggestionElement.on("click", suggestionElementClickHandler);
searchInputElement.on('input', searchInputElementInputHandler)