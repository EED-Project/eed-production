gdp_gni_sources = [
    {
        "source": "GDP",
        // "indicator": '1610', 
        "get_data_fn": function (stats) {
            return stats.indicator_values['1610'].map(v => v / 1000000)
        },
        "color": "#2772FF"
    },
    {
        "source": "GNI",
        "indicator": '1590',
        "color": "#37CC93"
    },
];

countryStatsPromise.then(function (stats) {
    // GDP
    update_simple_indicator(stats, '1610', '#gdp');
    // GNI
    update_simple_indicator(stats, '1590', '#gni');

    // chart
    update_bar_charts(stats, gdp_gni_sources, 'GDP-and-GNI__chart');
    update_bar_charts(stats, gdp_gni_sources, 'GDP-and-GNI__chart2');
});