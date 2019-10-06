data = [
	{ 'num': 1, 'num2': 2 },
	{ 'num': 3, 'num2': 4 },
	{ 'num': 5, 'num2': 6 },
	{ 'num': 7, 'num2': 8 }
]

document.addEventListener('DOMContentLoaded', function () {
	var db = firebase.firestore()

	const addGraph = function (title, charttype, args) {
		var min = 9999999
		var minIndex = 0
		$('#main > .column > .inner-column').each(function (index) {
			if ($(this).height() < min) {
				min = $(this).height()
				minIndex = index
			}
		})

		var random = Math.floor(Math.random() * 10000000)
		$(`.column${minIndex + 1} > .inner-column`).append(`<div class="card"><div class="card-title">${title}</div><div class="chartcontainer"><canvas id="chart-${random}"></canvas></div></div>`)
		var ctx = document.getElementById(`chart-${random}`).getContext('2d');

		if (charttype == 'doughnut') {
			newDoughnutChart(ctx, args)
		} else if (charttype == 'line') {
			newLineChart(ctx, args)
		} else if (charttype == 'scatter') {
			newScatterChart(ctx, args)
		}
	}

	const drawGraphs = () => {
		addGraph('CHECK', 'doughnut', 'num')
		addGraph('num vs num2', 'scatter', ['num', 'num2'])
	}

	const getData = () => {
		db.collection('data').limit(100).onSnapshot(function (snapshot) {
			data = []
			snapshot.forEach(function (doc) {
				data.push(doc.data())
			})
			drawGraphs();
		}, function (error) {
			console.log(error.message)
		})()
	}

	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			drawGraphs();
			// getData();
		} else {
			window.location = '../'
		}
	})
})

const getColors = amount => {
	var colors = [
		'rgba(255, 99, 132, 1.0)',
		'rgba(54, 162, 235, 1.0)',
		'rgba(255, 206, 86, 1.0)',
		'rgba(75, 192, 192, 1.0)',
		'rgba(153, 102, 255, 1.0)',
		'rgba(255, 159, 64, 1.0)'
	]

	for (var i = colors.length; i > amount; i--)
		colors.splice(Math.floor(Math.random() * i), 1)

	return colors
}

function newDoughnutChart(ctx, arg) {
	var chartdata = {}

	for (var i = 0; i < data.length; i++) {
		if (chartdata[String(data[i][arg])] == null) {
			chartdata[String(data[i][arg])] = 1
		} else {
			chartdata[String(data[i][arg])]++
		}
	}

	var colors = getColors(Object.keys(chartdata).length)
	var labels = []
	for (var i = 0; i < colors.length; i++) {
		labels.push('')
	}

	new Chart(ctx, {
		type: 'doughnut',
		data: {
			labels: Object.keys(chartdata),
			datasets: [{
				label: arg,
				data: Object.values(chartdata),
				backgroundColor: colors,
				borderColor: colors,
			}]
		}
	});
}

function newScatterChart(ctx, args) {
	var chartdata = []

	for (var i = 0; i < data.length; i++) {
		chartdata.push({ x: data[i][args[0]], y: data[i][args[1]] })
	}

	var colors = getColors(1)

	new Chart(ctx, {
		type: 'scatter',
		data: {
			datasets: [{
				backgroundColor: colors[0],
				borderColor: colors[0],
				label: `${args[0]} vs ${args[1]}`,
				data: chartdata
			}]
		},
		options: {
			scales: {
				xAxes: [{
					type: 'linear',
					position: 'bottom'
				}]
			}
		}
	});
}