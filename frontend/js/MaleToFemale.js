countryStatsPromise.then(function (stats) {
    male = last_no_zero(stats.indicator_values['2190'])
    year = stats.years[male[0]]
    female = stats.indicator_values['2210'][male[0]]

    $('#maletofemale_year').text(year)

    var ctx = document.getElementById('male-to-female__chart').getContext("2d");
    var maleToFemaleChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['', ''],
            datasets: [{
                data: [Math.round(female*10)/10, Math.round(male[1]*10)/10],
                borderWidth: 0,
                backgroundColor: ['#A819E8', '#F4D5FF']
            }],

        },
        options: {
            maintainAspectRatio: false,
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        return ' ' + data.datasets[0].data[tooltipItem.index] + '%';
                    }
                }
            },
            elements: {
                point: {
                    radius: 0
                }
            },
            responsive: true,
            legend: {
                display: false,
            },
            rotation: -1 * Math.PI,
            cutoutPercentage: 37.5,
        }
    });

    let stat1 = maleToFemaleChart.config.data.datasets[0].data[0];
    let stat2 = maleToFemaleChart.config.data.datasets[0].data[1]

    let legendValue1 = document.getElementById('stat-item-1');
    legendValue1.innerHTML = `${stat1}%`;
    let legendValue2 = document.getElementById('stat-item-2');
    legendValue2.innerHTML = `${stat2}%`;
});