gdp_gni_sources = [
  {
    source: 'GDP',
    // "indicator": '1610',
    get_data_fn: function (stats) {
      return stats.indicator_values['1610'].map((v) => v / 1000000);
    },
    color: '#2772FF',
  },
  {
    source: 'GNI',
    indicator: '1590',
    color: '#37CC93',
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
  update_mil_dem();
});
function update_mil_dem() {
  let country_population = $('#gdp');
  if (!country_population) return;
  let values = country_population.text().split(' ');
  if (values.length < 2) return;
  country_population.html('<b class="number">' + values[0] + '</b>');
  values.shift();
  let dataAfter = '';
  if (country_population.get(0).hasAttribute('data-after')) {
    dataAfter = $(country_population).attr('data-after');
  }
  country_population.append('<span class="text">' + values.join(' ') + ' ' + dataAfter + '</span>');
}
