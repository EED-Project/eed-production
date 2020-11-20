let co2sources = [
    {
        "source": "Gaseous fuel",
        "indicator": '1290',
        "color": "#2772FF"
    },
    {
        "source": "Liquid fuel",
        "indicator": '1320',
        "color": "#C28EFF"
    },
    {
        "source": "Solid fuel",
        "indicator": '1350',
        "color": "#37CC93"
    },
]

gas_emission_sources = [
    {
        "source": "Gaz emissions",
        "indicator": '1390',
        "color": "#8888EA"
    },
]

methane_sources = [
    {
        "source": "Industrial",
        "indicator": '1450',
        "color": "#F5D66B"
    },
    {
        "source": "Agricultural",
        "indicator": '1480',
        "color": "rgba(252, 119, 48, 1)"
    },
]

countryStatsPromise.then(function (stats) {
    update_simple_indicator(stats, '1460', '#methan_emission');
    update_simple_indicator(stats, '1390', '#greenhouse_emission');
    update_simple_indicator(stats, '1310', '#co2_emission');
    update_tree_chart(stats, co2sources, "co2_treemap");

    update_area_charts(stats, gas_emission_sources, "gaz-emmisions__chart");

    update_area_charts(stats, co2sources, "co2__chart");

    update_pair_douhnut(stats, methane_sources, "methan__chart", format_number_func = format_percentage);
});
