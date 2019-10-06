data = []

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
		addGraph('Race Distribution', 'doughnut', 'race')
		addGraph('Height vs Weight', 'scatter', [
			{ args: ['height', 'weight'], filter: ['sex', 'male'] },
			{ args: ['height', 'weight'], filter: ['sex', 'female'] }
		])
		addGraph('Weight vs Age', 'scatter', [
			{ args: ['age', 'weight'], filter: ['race', 'Teal'] },
			{ args: ['age', 'weight'], filter: ['race', 'Blue'] },
			{ args: ['age', 'weight'], filter: ['race', 'Purple'] },
			{ args: ['age', 'weight'], filter: ['race', 'Green'] }
		])
		addGraph('Height vs Age', 'scatter', [
			{ args: ['age', 'height'], filter: ['race', 'Teal'] },
			{ args: ['age', 'height'], filter: ['race', 'Blue'] },
			{ args: ['age', 'height'], filter: ['race', 'Purple'] },
			{ args: ['age', 'height'], filter: ['race', 'Green'] }
		])
		addGraph('Weight vs Blood Pressure', 'scatter', [
			{ args: ['weight', 'systolic_blood_pressure'], filter: ['race', 'Teal'] },
			{ args: ['weight', 'systolic_blood_pressure'], filter: ['race', 'Blue'] },
			{ args: ['weight', 'systolic_blood_pressure'], filter: ['race', 'Purple'] },
			{ args: ['weight', 'systolic_blood_pressure'], filter: ['race', 'Green'] }
		])
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
		})
	}

	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			// drawGraphs();
			getData();
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

		var label = `${args[a].args[0]} vs ${args[a].args[1]}`

		if (args[a].filter != undefined) {
			if (['race', 'sex', 'name'].indexOf(args[a].filter[0]) != -1) {
				label = args[a].filter[1]
			} else {
				label = `${args[a].filter[0]} ${args[a].filter[1]} ${args[a].filter[2]}`
			}
		}

		for (var i = 0; i < data.length; i++) {
			if (args[a].filter != undefined) {
				if (['race', 'sex', 'name'].indexOf(args[a].filter[0]) != -1) {
					if (data[i][args[a].filter[0]] == args[a].filter[1])
						chartdata.push({ x: data[i][args[a].args[0]], y: data[i][args[a].args[1]] })
				} else {
					switch (args[a].filter[1]) {
						case '==':
							if (data[i][args[a].filter[0]] == args[a].filter[2])
								chartdata.push({ x: data[i][args[a].args[0]], y: data[i][args[a].args[1]] })
							break;
						case '<':
							if (data[i][args[a].filter[0]] < args[a].filter[2])
								chartdata.push({ x: data[i][args[a].args[0]], y: data[i][args[a].args[1]] })
							break;
						case '>':
							if (data[i][args[a].filter[0]] > args[a].filter[2])
								chartdata.push({ x: data[i][args[a].args[0]], y: data[i][args[a].args[1]] })
							break;
						case '<=':
							if (data[i][args[a].filter[0]] <= args[a].filter[2])
								chartdata.push({ x: data[i][args[a].args[0]], y: data[i][args[a].args[1]] })
							break;
						case '>=':
							if (data[i][args[a].filter[0]] >= args[a].filter[2])
								chartdata.push({ x: data[i][args[a].args[0]], y: data[i][args[a].args[1]] })
							break;
						case '!=':
							if (data[i][args[a].filter[0]] != args[a].filter[2])
								chartdata.push({ x: data[i][args[a].args[0]], y: data[i][args[a].args[1]] })
							break;
					}
				}

			} else {
				chartdata.push({ x: data[i][args[a].args[0]], y: data[i][args[a].args[1]] })
			}
		}

		datasets.push({
			backgroundColor: colors[a],
			borderColor: colors[a],
			label: label,
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