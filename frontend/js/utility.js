function last_no_zero(arr) {
    let rev_arr = arr.slice().reverse();
    for (i in rev_arr) {
        if (rev_arr[i] != 0) return [arr.length - i - 1, rev_arr[i]];
    }
    return null;
}

function update_grow(grow, grow_id) {
    if (grow) {
        grow_sign = (grow >= 0) ? '+' : '';
        text = grow_sign + format_percentage(grow);
    } else {
        text = '';
    }

    $(grow_id)
        .text(text)
        .removeClass('green__text').removeClass('red__text')
        .addClass((grow >= 0) ? 'green__text' : 'red__text')
}

function format_percentage(number) {
    return format_number(number) + '%';
}

function format_number(number, million_suffix = ' million') {
    suffix = ''
    if (number > 1e6) { // > 1,000,000
        number /= 1e6;
        suffix = million_suffix
    }

    if (number < 100) {
        return number.toFixed(1) + suffix;
    }

    return toCommas(number) + suffix;
}


// from stackoverflow: 
// https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function toCommas(number) {
    return number.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function update_simple_indicator(stats, indicator_id, dom_node_id, format_number_func = format_number) {
    ind_val = last_no_zero(stats.indicator_values[indicator_id])
    console.log(dom_node_id, ind_val, !ind_val);
    if (!ind_val) {
        $(dom_node_id).text('--');
        $(dom_node_id + '_year').text('--');
        $(dom_node_id + '_grow').text('');
        return;
    }

    $(dom_node_id)
        .text(format_number_func(ind_val[1]));

    $(dom_node_id + '_year')
        .text(stats.years[ind_val[0]]);

    if (ind_val[0] > 0) {
        prev_ind_val = stats.indicator_values[indicator_id][ind_val[0] - 1];
        grow = ((ind_val[1] / prev_ind_val) - 1) * 100;
    } else {
        grow = false;
    }
    update_grow(grow, dom_node_id + '_grow');
}


function update_tree_chart(stats, sources, dom_node_id, format_number_func = format_number) {
    let ids = sources.map(s => s['indicator']);
    let index = Math.max(...ids.map(id => (last_no_zero(stats.indicator_values[id]) || [null])[0]))
    data_tree = sources.map(s => Object.assign({}, s, { 'value': stats.indicator_values[s['indicator']][index] }));

    chart_options = {
        type: "treemap",
        data: {
            datasets: [
                {
                    tree: data_tree.filter(d => d['value'] > 0),
                    key: "value",
                    groups: ['source'],
                    spacing: 5,
                    borderWidth: 0,
                    fontColor: "white",
                    borderColor: "rgba(200,200,200,1)",
                    hoverBackgroundColor: "rgba(220,230,220,0.5)",
                    backgroundColor: function (ctx) {
                        let d = ctx.dataset.data[ctx.dataIndex]
                        if (!d) {
                            return;
                        }
                        return Color(d._data.children[0].color).rgbString();
                    }
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            title: {
                display: false,
            },
            legend: {
                display: false
            },
            tooltips: {
                callbacks: {
                    title: function (item, data) {
                        return data.datasets[item[0].datasetIndex].data[item[0].index].g;
                    },
                    label: function (item, data) {
                        var dataset = data.datasets[item.datasetIndex];
                        var dataItem = dataset.data[item.index];
                        return ' ' + format_number_func(dataItem.v);
                    }
                }
            }
        }
    }

    var ctx = document.getElementById(dom_node_id).getContext("2d");
    var tm = new Chart(ctx, chart_options);

    var ctx = document.getElementById(dom_node_id + "_mini").getContext("2d");
    var tm = new Chart(ctx, chart_options);

}


function update_area_chart(stats, sources, dom_node_id, font_size = 16, format_number_func = format_number) {
    //var ctx = document.getElementById(dom_node_id).getContext("2d");

    datasets = sources.map(function (s) {
        if (s['get_data_fn']) {
            sdata = s['get_data_fn'](stats)
        } else {
            sdata = stats.indicator_values[s['indicator']]
        }

        return {
            label: s['source'],
            data: sdata,
            borderColor: [
                '#4d56f3',
            ],
            borderWidth: 2
        }
    });
console.log(datasets[0].data);
        let lineColor = "#4d56f3",
        labelColor = "#fff",
        fontSize = 13,
        margin = 0;
    Highcharts.setOptions({
        chart: {
            type: "spline",
            backgroundColor: '#212840',
            borderWidth: 0,
            plotBackgroundColor: '#212840',
            plotShadow: false,
            plotBorderWidth: 0,
            style: {
                fontFamily: '\'Lato\', sans-serif'
            },
            height: $("#" + dom_node_id).height()
        }
    });
    console.log(typeof(datasets[0].data))
    var chart = Highcharts.chart(dom_node_id, {
        title: null,
        yAxis: {
            lineColor: '#42485c',
            lineWidth: 1,
            labels: {
                style: {
                    color: labelColor,
                    fontSize: fontSize,
                }
            },
            gridLineWidth: 0,
        },

        xAxis: {
            lineColor: '#42485c',
            lineWidth: 1,
            labels: {
                y: 30,
                style: {
                    color: labelColor,
                    fontSize: fontSize,
                    fontFamily: '\'Lato\', sans-serif'
                }
            },
            accessibility: {
                rangeDescription: 'Range: 1810 to 2020'
            },
            tickWidth: 0,

        },

        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },

        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
                marker: {
                    enabled: false
                },
                pointStart: 1910,
                lineWidth: 5,
                lineColor: lineColor,
                area: {
                    threshold: -9999
                }
            }
        },

        series: [{
            type: "areaspline",
            showInLegend: false,
            name: '',
            data: datasets[0].data,
            color: {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: [
                    [0, 'rgba(66, 118, 195, 0.3)'],
                    [1, 'rgba(136, 136, 234, 0)']
                ]
            },
        }],

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }

    });
    chart_options = {
        type: 'line',
        data: {
            labels: stats.years,
            datasets: datasets,
        },
        options: {
            scales: {
                xAxes: [{
                    gridLines: {
                        drawOnChartArea: false,
                        color: 'rgba(255, 255, 255, 0.2)',
                        zeroLineColor: 'rgba(255, 255, 255, 0.2)',
                        drawTicks: false
                    },
                    ticks: {
                        padding: 10,
                        fontSize: font_size,
                        fontFamily: 'Lato',
                        fontColor: "#fff",
                    }
                }],
                yAxes: [{
                    gridLines: {
                        drawOnChartArea: false,
                        color: 'rgba(255, 255, 255, 0.2)',
                        zeroLineColor: 'rgba(255, 255, 255, 0.2)',
                        drawTicks: false
                    },
                    ticks: {
                        padding: 10,
                        fontSize: font_size,
                        fontFamily: 'Lato',
                        fontColor: "#fff",
                        callback: function (value, index, values) {
                            return format_number_func(value);
                        }
                    }
                }]
            },
            maintainAspectRatio: false,
            elements: {
                point: {
                    radius: 0
                }
            },
            responsive: true,
            legend: {
                display: false,
            },
        }
    };
    var elSourceChart = new Chart(ctx, chart_options)
}
function update_area_charts(stats, sources, dom_node_id, format_number_func = format_number) {
    update_area_chart(stats, sources, dom_node_id, font_size = 16, format_number_func = format_number_func);
    update_area_chart(stats, sources, dom_node_id + '-mini', font_size = 8, format_number_func = format_number_func);
}

function update_bar_chart(stats, sources, dom_node_id, font_size = 16, format_number_func = format_number) {
    var element = document.getElementById(dom_node_id);
    if(!element) return;
    var ctx = element.getContext("2d");

    datasets = sources.map(function (s) {
        color = Color(s.color);

        gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, color.alpha(1).rgbString());
        gradient.addColorStop(0.2, color.alpha(0.7).rgbString());
        gradient.addColorStop(0.3, color.alpha(0.4).rgbString());
        gradient.addColorStop(0.5, color.alpha(0.2).rgbString());
        gradient.addColorStop(0.7, color.alpha(0.0).rgbString());

        if (s['get_data_fn']) {
            sdata = s['get_data_fn'](stats)
        } else {
            sdata = stats.indicator_values[s['indicator']]
        }

        return {
            barPercentage: 0.9,
            categoryPercentage: 0.4,
            label: s['source'],
            data: sdata,
            backgroundColor: gradient,
            borderColor: [
                'rgba(244, 213, 255, 1)',
            ],
            borderWidth: 1
        }
    });

    chart_options = {
        type: 'bar',
        data: {
            labels: stats.years,
            datasets: datasets,
        },
        options: {
            cornerRadius: 20,
            scales: {
                xAxes: [{

                    gridLines: {
                        drawOnChartArea: false,
                        color: 'rgba(255, 255, 255, 0.2)',
                        zeroLineColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    ticks: {
                        fontSize: font_size,
                        fontFamily: 'Lato',
                        fontColor: "#fff",
                    }
                }],
                yAxes: [{
                    gridLines: {
                        drawOnChartArea: false,
                        color: 'rgba(255, 255, 255, 0.2)',
                        zeroLineColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    ticks: {
                        fontSize: font_size,
                        fontFamily: 'Lato',
                        fontColor: "#fff",
                        beginAtZero: true,
                        callback: function (value, index, values) {
                            return format_number(value);
                        }
                    }
                }],
            },
            maintainAspectRatio: false,
            elements: {
                point: {
                    radius: 0
                }
            },
            responsive: true,
            legend: {
                display: false,
            },
        }
    };
    var elSourceChart = new Chart(ctx, chart_options)
}
function update_bar_charts(stats, sources, dom_node_id, format_number_func = format_number) {
    update_bar_chart(stats, sources, dom_node_id, font_size = 16, format_number_func = format_number_func);
    update_bar_chart(stats, sources, dom_node_id + '-mini', font_size = 8, format_number_func = format_number_func);
}


function update_pair_douhnut(stats, sources, dom_node_id, format_number_func = format_number) {
    first = last_no_zero(stats.indicator_values[sources[0].indicator])

    if (!first) {
        $('#' + dom_node_id).replaceWith('<h1 class="big-size__text">--</h1>')
        return;
    }

    year = stats.years[first[0]]
    second = stats.indicator_values[sources[1].indicator][first[0]]

    $('#ruraltourban_year').text(year)

    var ctx = document.getElementById(dom_node_id).getContext("2d");
    var ruralToUrbanChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['', ''],
            datasets: [{
                data: [first[1], second],
                borderWidth: 0,
                backgroundColor: [sources[0].color, sources[1].color]
            }],

        },
        options: {
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        return ' ' + format_number_func(data.datasets[0].data[tooltipItem.index]);
                    }
                }
            },
            maintainAspectRatio: false,
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
}