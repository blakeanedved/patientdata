data = [
	{ 'num': 1, 'num2': 2, 'num3': 9, 'num4': 10, 'gender': 'male' },
	{ 'num': 3, 'num2': 4, 'num3': 11, 'num4': 12, 'gender': 'male' },
	{ 'num': 5, 'num2': 6, 'num3': 13, 'num4': 14, 'gender': 'male' },
	{ 'num': 7, 'num2': 8, 'num3': 15, 'num4': 16, 'gender': 'female' },
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
		} else if (charttype == 'scatter') {
			newScatterChart(ctx, args)
		}
	}

	const drawGraphs = () => {
		addGraph('CHECK', 'doughnut', 'num')
		addGraph('num vs num2', 'scatter', [{ args: ['num', 'num2'], filter: ['gender', 'male'] }, { args: ['num', 'num3'], filter: ['gender', 'female'] }])
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
	var datasets = []
	var colors = getColors(args.length)
	for (var a = 0; a < args.length; a++) {
		var chartdata = []

		for (var i = 0; i < data.length; i++) {
			if (args[a].filter != undefined) {
				if (args[a].filter[0] == 'gender') {
					if (data[i]['gender'] == args[a].filter[1])
						chartdata.push({ x: data[i][args[a].args[0]], y: data[i][args[a].args[1]] })
				} else if (args[a].filter[0] == 'race') {
					if (data[i]['race'] == args[a].filter[1])
						chartdata.push({ x: data[i][args[a].args[0]], y: data[i][args[a].args[1]] })
				} else {
					chartdata.push({ x: data[i][args[a].args[0]], y: data[i][args[a].args[1]] })
				}
			} else {
				chartdata.push({ x: data[i][args[a].args[0]], y: data[i][args[a].args[1]] })
			}
		}

		datasets.push({
			backgroundColor: colors[a],
			borderColor: colors[a],
			label: `${args[a].args[0]} vs ${args[a].args[1]}`,
			data: chartdata
		})
	}


	new Chart(ctx, {
		type: 'scatter',
		data: {
			datasets: datasets
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