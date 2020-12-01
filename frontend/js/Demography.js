demography_sources = [
    {
        "source": "Demography",
        "indicator": '2170',
        "color": "#8888EA"
    },
];

rural_to_urban_source = [
    {
        "source": "Rural",
        "indicator": '2240',
        "color": "#F5D66B"
    },
    {
        "source": "Urban",
        "indicator": '2270',
        "color": "rgba(252, 119, 48, 1)"
    },
]

male_to_female_source = [
    {
        "source": "Male",
        "indicator": '2190',
        "color": "#F4D5FF"
    },
    {
        "source": "Female",
        "indicator": '2210',
        "color": "#A819E8"
    },
]

countryStatsPromise.then(function (stats) {
    update_simple_indicator(stats, '2170', '#country_population');

    demography_format = function (n) { 
        return format_number(n, million_suffix = 'm'); 
    }
    update_area_charts(stats, demography_sources, "demography__chart", format_number_func = demography_format);

    update_pair_douhnut(stats, rural_to_urban_source, "rural-to-urban__chart", format_number_func = format_percentage);
    update_pair_douhnut(stats, male_to_female_source, "male-to-female__chart", format_number_func = format_percentage);
});