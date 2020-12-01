countryStatsPromise.then(function (stats) {
    update_simple_indicator(stats, '0', '#easy_busines', format_number_func = toCommas);


    update_simple_indicator(stats, '1620', '#credit_rating', format_number_func = format_percentage);
    update_simple_indicator(stats, '1620', '#poverty_level', format_number_func = format_percentage);
});
