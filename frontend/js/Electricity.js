
let elsources = [
    {
        "source": "Coal",
        "indicator": '1130',
        "color": "#0000FF"
    },
    {
        "source": "Oil, Gas and Coal",
        "indicator": '1140',
        "color": "#FF0000"
    },
    {
        "source": "Hydroelectric",
        "indicator": '1150',
        "color": "#F5D66B"
    },
    {
        "source": "Natural Gas",
        "indicator": '1170',
        "color": "#2772FF"
    },
    {
        "source": "Nuclear",
        "indicator": '1180',
        "color": "#00FF00"
    },
    {
        "source": "Oil",
        "indicator": '1190',
        "color": "#37CC93"
    },
    {
        "source": "Renewable sources, excluding Hydroelectric",
        "indicator": '1200',
        "color": "#C28EFF"
    },
]

rural_to_urban = [
    {
        "source": "Rural",
        "indicator": '1020',
        "color": "#76EFFF"
    },
    {
        "source": "Urban",
        "indicator": '1030',
        "color": "#2772FF"
    },
]

elcons_sources = [
    {
        "source": "Total",
        "indicator": '1260',
        "color": "rgba(252, 119, 48, 1)"
    },
    {
        "source": "Renewable",
        // "indicator": '1210',
        "get_data_fn": function (stats) {
            el_cons_total = stats.indicator_values['1260'];
            el_cons_green_percent = stats.indicator_values['1210'];
            el_cons_green = [];
            for (i in el_cons_green_percent)
                el_cons_green.push(el_cons_total[i] * el_cons_green_percent[i] / 100);
            return el_cons_green;
        },
        "color": "rgba(55, 204, 147, 1)"
    },
]

countryStatsPromise.then(function (stats) {
    // Access to electricity
    update_simple_indicator(stats, '1000', '#country_acces_to_electricity', format_number_func = format_percentage);
    // - rural/urban
    update_area_charts(stats, rural_to_urban, "electricity__chart");

    // Production
    update_simple_indicator(stats, '1070', '#electricity_prod');

    // Consumption
    update_simple_indicator(stats, '1260', '#electricity_cons');
    // - chart
    update_area_charts(stats, elcons_sources, "el-consumption__chart");
    // Electricity Sources 
    // - Treemap
    update_tree_chart(stats, elsources, "elsources_treemap", format_number_func = format_percentage)
    // - Chart
    update_area_charts(stats, elsources, "el-source__chart");
});
