// search and go to the country
$('body > div > header > div > div.right-side > div.search__block > input')
    .on('keypress', function (e) {
        if (e.which == 13) {
            window.location.href = '/?country=' + e.target.value;
        }
    })


// hide until country data is loaded
$('main.main').hide();

var searchParams = new URLSearchParams(window.location.search);
var country_query = searchParams.get('country');
var countryPromise = Promise.resolve($.get('/api/countries/' + country_query))
var countryStatsPromise = Promise.resolve($.get('/api/countries/' + country_query + '/stats'))

countryPromise.then(function (data) {
    console.log('Country loaded:', data)

    $('#country_name')
        .text(data.country_name.toUpperCase());

    $('#country_description')
        .html(data.description);

    $('#country_language')
        .text(data.language);

    $('#country_previous_election')
        .text(data.prev_election);

    $('.time__info')
        .text(data.time_zone);


    $('main.main').show();
}, function (err) {
    console.log('ERR:', err.statusText)
})

countryStatsPromise.then(function (stats) {
    area = last_no_zero(stats.indicator_values['1100'])
    $('#country_area')
        .text(area[1].toLocaleString());
})
