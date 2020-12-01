function last_no_zero(arr) {
    let rev_arr = arr.slice().reverse();
    for (i in rev_arr) {
        if (rev_arr[i] != 0) return [arr.length - i - 1, rev_arr[i]];
    }
    return null;
}
const exportHtml = '<p class="small__text grey__text__06 label-bottom-right"><img src="./img/more.svg" alt="more icon" class="chart-export-btn"></p>';
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
    let chartContainer = $("#" + dom_node_id);
    let data = [];
    Array.from(data_tree).forEach(function(item) {
        data.push({
            name: item.source,
            color: item.color,
            value: item.value,
            pointPadding: 20
        });
    });
    Highcharts.chart(dom_node_id, {
        chart: {
            backgroundColor: '#212840',
            borderWidth: 0,
            plotBackgroundColor: '#212840',
            plotShadow: false,
            plotBorderWidth: 0,
            style: {
                fontFamily: '\'Lato\', sans-serif'
            },
            height: chartContainer.parents(".chart__div").height(),
            events: {
                load: function(){
                    let card = $("#" + dom_node_id).parents(".card").first();
                    card.find(".card-body").append(exportHtml);
                    if(card.find(".card-body").length < 1){
                        card.append(exportHtml);
                    }
                    let exportButton = card.find(".chart-export-btn");
                    if(!exportButton) return;
                    exportButton.on("click", function(e){
                        e.preventDefault();
                        let chartExportSymbol = card.find(".highcharts-button-symbol");
                        chartExportSymbol.click();
                    });
                }
            }
        },
        plotOptions: {
            series: {
                pointPadding: 0
            }
        },
        series: [{
            type: "treemap",
            borderWidth: 10,
            borderColor: '#212840',
            layoutAlgorithm: 'squarified',
            data: data,
            dataLabels: {
                x: 15,
                y: 15,
                align: 'left',
                verticalAlign: 'top',
                shadow: true,
                style: {
                    color: "#fff",
                    textOutline: "0px black",
                    textShadow: "#000000"
                }
            }
        }],
        title: {
            text: null
        },
        credits: {
            "href": null,
            "text": ''
        },
        navigation: {
            buttonOptions: {
                layout: 'horizontal',
                align: 'right',
                verticalAlign: 'bottom',
                y: 30,
                height: 20,
                width: 20,
            }
        },
        exporting: {
            buttons: {
                contextButton: {
                    symbol: 'url(./img/more.svg)',
                    style: {
                        fill: "none"
                    }
                }
            }
        }
    });

}


function update_area_chart(stats, sources, dom_node_id, font_size = 16, format_number_func = format_number) {
    //var ctx = document.getElementById(dom_node_id).getContext("2d");
    let chartContainer = $("#" + dom_node_id);
    datasets = sources.map(function(s) {
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
            height: chartContainer.parents(".chart__div").height(),
            marginRight: 0,
            spacingLeft: 0,
            spacingRight: 0
        }
    });
    // Export Button Top Margin
    let buttonTopMargin = 30;
    if (chartContainer.get(0).hasAttribute("data-colors")) {
        buttonTopMargin = 5;
    }
    let series = [],
        chartColors = [
            [0, 'rgba(66, 118, 195, 0.3)'],
            [1, 'rgba(136, 136, 234, 0)']
        ],
        showLegend = false,
        count = 0;
    Array.from(datasets).forEach(function(item, i) {
        if (chartContainer.get(0).hasAttribute("data-colors")) {
            chartColorArr = JSON.parse(chartContainer.attr("data-colors"));
            chartColors = [
                [0, chartColorArr[count].split(",")[0]],
                [1, chartColorArr[count].split(",")[1]]
            ];
            lineColor = chartColorArr[count].split(",")[0];
            if (chartColorArr.length > 2) {
                lineColor = chartColorArr[count].split(",")[2];
            }
            showLegend = true;
        }
        series.push({
            type: "areaspline",
            showInLegend: showLegend,
            name: item.label,
            data: item.data,
            lineColor: lineColor,
            color: {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: chartColors
            }
        });
        count++;
    });
    if (!(chartContainer.attr("data-reverse") == "false"))
        series.reverse();
    let displayLegend = true;
    if(window.innerWidth < 769){
        displayLegend = false;
    }
    var chart = Highcharts.chart(dom_node_id, {
        chart: {
            events: {
                load: function(){
                    let card = $("#" + dom_node_id).parents(".card").first();
                    card.find(".card-body").append(exportHtml);
                    if(card.find(".card-body").length < 1){
                        card.append(exportHtml);
                    }
                    let exportButton = card.find(".chart-export-btn");
                    if(!exportButton) return;
                    exportButton.on("click", function(e){
                        e.preventDefault();
                        let chartExportSymbol = card.find(".highcharts-button-symbol");
                        chartExportSymbol.click();
                    });
                }
            }
        },
        title: null,
        yAxis: {
            lineColor: '#42485c',
            lineWidth: 1,
            minPadding: 0,
            maxPadding: 0,
            labels: {
                style: {
                    color: labelColor,
                    fontSize: fontSize,
                }
            },
            gridLineWidth: 0,
            title: {
                text: null
            }
        },

        xAxis: {
            categories: stats.years,
            //categories: [1910, 1932, 1934, 1954, 1962, 1981, 2000],
            lineColor: '#42485c',
            lineWidth: 1,
            labels: {
                step: 5,
                y: 20,
                style: {
                    color: labelColor,
                    fontSize: fontSize,
                    fontFamily: '\'Lato\', sans-serif',
                }
            },
            tickWidth: 0,
        minPadding: 0,
      maxPadding: 0,

        },

        legend: {
            enabled: displayLegend,
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            style: {
                color: "#fff"
            }
        },

        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
                marker: {
                    enabled: false
                },
                lineWidth: 3,
                lineColor: lineColor,
                area: {
                    threshold: -9999
                }
            }
        },
        credits: {
            "href": null,
            "text": ''
        },
        series: series,

        navigation: {
            buttonOptions: {
                layout: 'horizontal',
                align: 'right',
                verticalAlign: 'bottom',
                y: buttonTopMargin,
                height: 20,
                width: 20,
            }
        },
        exporting: {
            buttons: {
                contextButton: {
                    symbol: 'url(./img/more.svg)',
                    style: {
                        fill: "none"
                    }
                }
            }
        },

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
    /*    chart_options = {
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
        var elSourceChart = new Chart(ctx, chart_options)*/
}

function update_area_charts(stats, sources, dom_node_id, format_number_func = format_number) {
    update_area_chart(stats, sources, dom_node_id, font_size = 16, format_number_func = format_number_func);
    update_area_chart(stats, sources, dom_node_id + '-mini', font_size = 8, format_number_func = format_number_func);
}

function update_bar_chart(stats, sources, dom_node_id, font_size = 16, format_number_func = format_number) {
    var element = document.getElementById(dom_node_id);
    if (!element) return;
    let chartContainer = $("#" + dom_node_id);
    datasets = sources.map(function(s) {
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
            height: chartContainer.parents(".chart__div").height()
        }
    });
    // Export Button Top Margin
    let buttonTopMargin = 30;
    if (chartContainer.get(0).hasAttribute("data-colors")) {
        buttonTopMargin = 5;
    }
    let series = [],
        chartColors = [
            [0, 'rgba(66, 118, 195, 0.3)'],
            [1, 'rgba(136, 136, 234, 0)']
        ],
        showLegend = false,
        count = 0;
    Array.from(datasets).forEach(function(item, i) {
        if (chartContainer.get(0).hasAttribute("data-colors")) {
            chartColorArr = JSON.parse(chartContainer.attr("data-colors"));
            chartColors = [
                [0, chartColorArr[count].split(",")[0]],
                [1, chartColorArr[count].split(",")[1]]
            ];
            lineColor = chartColorArr[count].split(",")[0];
            if (chartColorArr.length > 2) {
                lineColor = chartColorArr[count].split(",")[2];
            }
            showLegend = true;
        }
        series.push({
            type: "areaspline",
            showInLegend: showLegend,
            name: item.label,
            data: item.data,
            lineColor: lineColor,
            color: {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: chartColors
            }
        });
        count++;
    });
    if (!(chartContainer.attr("data-reverse") == "false"))
        series.reverse();
    var chart = Highcharts.chart(dom_node_id, {
        chart: {

            events: {
                load: function(){
                    let card = $("#" + dom_node_id).parents(".card").first();
                    card.find(".card-body").append(exportHtml);
                    if(card.find(".card-body").length < 1){
                        card.append(exportHtml);
                    }
                    let exportButton = card.find(".chart-export-btn");
                    if(!exportButton) return;
                    exportButton.on("click", function(e){
                        e.preventDefault();
                        let chartExportSymbol = card.find(".highcharts-button-symbol");
                        chartExportSymbol.click();
                    });
                }
            }
        },
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
            title: {
                text: null
            }
        },

        xAxis: {
            minPadding: 0,
            maxPadding: 0,
            categories: stats.years,
            lineColor: '#42485c',
            lineWidth: 1,
            labels: {
                step: 5,
                y: 20,
                style: {
                    color: labelColor,
                    fontSize: fontSize,
                    fontFamily: '\'Lato\', sans-serif'
                }
            },
            tickWidth: 0,

        },

        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            style: {
                color: "#fff"
            }
        },

        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
                marker: {
                    enabled: false
                },
                lineWidth: 3,
                lineColor: lineColor,
                area: {
                    threshold: -9999
                }
            }
        },
        credits: {
            "href": null,
            "text": ''
        },
        series: series,

        navigation: {
            buttonOptions: {
                layout: 'horizontal',
                align: 'right',
                verticalAlign: 'bottom',
                y: buttonTopMargin,
                height: 20,
                width: 20,
            }
        },
        exporting: {
            buttons: {
                contextButton: {
                    symbol: 'url(./img/more.svg)',
                    style: {
                        fill: "none"
                    }
                }
            }
        },

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

    $('#ruraltourban_year').text(year);
    let chartSize = "85%";
    if(dom_node_id == "methan__chart"){
        chartSize = "90%";
    }
    if(window.innerWidth < 769){
        chartSize = "100%";
    }
    Highcharts.chart(dom_node_id, {
        chart: {
            plotBackgroundColor: null,
            backgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            height: $("#" + dom_node_id).parent().height(),
            events: {
                load: function(){
                    let card = $("#" + dom_node_id).parents(".card").first();
                    card.find(".card-body").append(exportHtml);
                    let exportButton = card.find(".chart-export-btn");
                    if(card.find(".card-body").length < 1){
                        card.append(exportHtml);
                    }
                    if(!exportButton) return;
                    exportButton.on("click", function(e){
                        e.preventDefault();
                        let chartExportSymbol = card.find(".highcharts-button-symbol");
                        chartExportSymbol.click();
                    });
                }
            }
        },
        title: {
            text: null
        },
        tooltip: {
            pointFormat: '<b>{point.percentage}%</b>'
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        plotOptions: {
            pie: {
                lineWidth: 1,
                allowPointSelect: true,
                cursor: 'pointer',
                borderWidth: 0,
                size: chartSize,
                dataLabels: {
                    enabled: true,
                    format: '{point.percentage:.0f}%',
                    style: {
                        color: "rgba(255, 255, 255, 0.6)",
                        textOutline: "0px black",
                        textShadow: "#000000",
                    }
                }
            }
        },
        series: [{
            innerSize: '40%',
            name: '',
            colorByPoint: true,
            data: [{
                name: sources[0].source,
                y: first[1],
                color: sources[0].color,
                dataLabels: {
                    x: -25,
                    y: -13,
                    distance: 15,
                    borderColor: "#fff",
                    style: {
                        color: '#fff'
                    }
                }
            }, {
                name: sources[1].source,
                y: second,
                color: sources[1].color,
                dataLabels: {
                    x: 25,
                    y: -13,
                    distance: 15,
                    lineColor: '#fff',
                    style: {
                        color: 'rgba(255, 255, 255, 0.6)',
                        borderColor: '#fff',
                        backgroundColor: '#fff',
                    }
                }
            }]
        }],
        credits: {
            "href": null,
            "text": ''
        },

        navigation: {
            buttonOptions: {
                layout: 'horizontal',
                align: 'right',
                verticalAlign: 'bottom',
                y: 30,
                height: 20,
                width: 20,
            }
        },
        exporting: {
            buttons: {
                contextButton: {
                    symbol: 'url(./img/more.svg)',
                    style: {
                        fill: "none"
                    }
                }
            }
        }
    });
}