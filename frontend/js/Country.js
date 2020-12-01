// search and go to the country

$('body > div > header > div > div.right-side > div.search__block > input')
    .on('keypress', function (e) {



        if (e.which === 13) {

            $("#suggestion-dropdown").hide();
            $("#WaitingScr").fadeIn(100);

// hide until country data is loaded

            var searchParams = new URLSearchParams(window.location.search);
            var country_query = e.target;
            var countryStatsPromise = Promise.resolve($.get('https://cors-anywhere.herokuapp.com/http://eed-app.herokuapp.com/api/countries/' +  e.target.value + '/stats')) .then(function (stats) {
                area = last_no_zero(stats.indicator_values['1100'])
                $('#country_area')
                    .text(area[1].toLocaleString());
            });

            var countryPromise = Promise.resolve($.get('https://cors-anywhere.herokuapp.com/http://eed-app.herokuapp.com/api/countries/' +  e.target.value)).then(function (data) {
                console.log('Country loaded:', data)

                $('#country_name')
                    .text(data.country_name.toUpperCase());

                $('#country_capital')
                    .text(data.capitalcity.toUpperCase());

                $('#country_description')
                    .html(data.description);

                $('#country_language')
                    .text(data.language);

                $('#country_previous_election')
                    .text(data.prev_election);

                $('.time__info')
                    .text(data.time_zone);

                $('#country_map')
                    .attr("src",data.country_map);

                $('#country_flag')
                    .attr("src",data.country_flag);

                $('#country_image')
                    .attr("src",data.country_image);



            }, function (err) {
                console.log('ERR:', err.statusText);
            })


            setTimeout(function (){

                $('#WaitingScr').fadeOut(100);
            }, 1000);





        };

    });
$("#WaitingScr").fadeIn(100);

// hide until country data is loaded
var searchParams = new URLSearchParams(window.location.search);
var country_query = searchParams.get('country');

if (country_query !== "null"){
    country_query = "Angola";
    searchParams.set('country','Angola');
}

 var countryStatsPromise = Promise.resolve($.get('https://cors-anywhere.herokuapp.com/http://eed-app.herokuapp.com/api/countries/' + country_query + '/stats'));

var countryPromise = Promise.resolve($.get('https://cors-anywhere.herokuapp.com/http://eed-app.herokuapp.com/api/countries/' + country_query)).then(function (data) {
    console.log('Country loaded:', data)

    $('#country_name')
        .text(data.country_name.toUpperCase());

    $('#country_capital')
        .text(data.capitalcity.toUpperCase());

    $('#country_description')
        .html(data.description);

    $('#country_language')
        .text(data.language);

    $('#country_previous_election')
        .text(data.prev_election);

    $('.time__info')
        .text(data.time_zone);

    $('#country_map')
        .attr("src",data.country_map);

    $('#country_flag')
        .attr("src",data.country_flag);

    $('#country_image')
        .attr("src",data.country_image);

    setTimeout(function (){


    }, 1000);

    $('main.main').show();
}, function (err) {
    console.log('ERR:', err.statusText)
})

countryStatsPromise.then(function (stats) {
    area = last_no_zero(stats.indicator_values['1100'])
    $('#country_area')
        .text(area[1].toLocaleString());
})

setTimeout(function (){

    $('#WaitingScr').fadeOut(100);
}, 1000);


