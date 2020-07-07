countryStatsPromise.then(function (stats) {
    update_simple_indicator(stats, '1570', '#easy_busines', format_number_func = toCommas);
    $('#easy_busines_grow').text('');

    $('#credit_rating').text('--');

    update_simple_indicator(stats, '1620', '#poverty_level', format_number_func = format_percentage);
});