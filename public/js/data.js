data = []

document.addEventListener('DOMContentLoaded', function () {
	var db = firebase.firestore()

	var filter = {
		general: /./,
		id: /./,
		name: /./,
		age: /./,
		height: /./,
		weight: /./,
		sex: /./,
		race: /./,
		resting_heartrate: /./,
		systolic_blood_pressure: /./,
		diastolic_blood_pressure: /./,
		blood_sugar: /./
	}

	const filtered = doc => { // false if it is filtered, true if it is not
		return (filter.id.test(doc.id)
			&& filter.name.test(doc.name)
			&& filter.age.test(doc.age)
			&& filter.height.test(doc.height)
			&& filter.weight.test(doc.weight)
			&& filter.sex.test(doc.sex)
			&& filter.race.test(doc.race)
			&& filter.resting_heartrate.test(doc.resting_heartrate)
			&& filter.systolic_blood_pressure.test(doc.systolic_blood_pressure)
			&& filter.diastolic_blood_pressure.test(doc.diastolic_blood_pressure)
			&& filter.blood_sugar.test(doc.blood_sugar))
			&& (filter.general.test(doc.id)
				|| filter.general.test(doc.name)
				|| filter.general.test(doc.age)
				|| filter.general.test(doc.height)
				|| filter.general.test(doc.weight)
				|| filter.general.test(doc.sex)
				|| filter.general.test(doc.race)
				|| filter.general.test(doc.resting_heartrate)
				|| filter.general.test(doc.systolic_blood_pressure)
				|| filter.general.test(doc.diastolic_blood_pressure)
				|| filter.general.test(doc.blood_sugar))
	}

	const resetFilter = () => {
		filter = { general: /./, id: /./, name: /./, age: /./, height: /./, weight: /./, sex: /./, race: /./, resting_heartrate: /./, systolic_blood_pressure: /./, diastolic_blood_pressure: /./, blood_sugar: /./ }
	}

	$('#filter').on('keyup keypress blur', function (event) {
		resetFilter()
		var f = $(this).val().split(' ')
		var g = '[^\\s]*'
		for (var i = 0; i < f.length; i++) {
			if (f[i].indexOf(':') != -1) {
				var spec = f[i].split(':')
				if (spec.length == 2)
					filter[spec[0]] = RegExp(`(${spec[1]})`)
			} else {
				for (var j = 0; j < f[i].length; j++) {
					g += `[${f[i][j].toUpperCase()}${f[i][j].toLowerCase()}][^\\s]*`
				}
			}
		}
		console.log(g)
		filter.general = RegExp(g)
		drawTable()
	})

	const drawTable = () => {
		$('#customers').html('<tr><th>ID</th><th>Name</th><th>Age (yrs)</th><th>Height (in)</th><th>Weight (lbs.)</th><th>Sex</th><th>Dominant Race</th><th>Resting Heartrate (BPM)</th><th>Systolic Blood Pressure (mmHg)</th><th>Diastolic Blood Pressure (mmHg)</th><th>Blood Sugar (mg/dL)</th></tr>')
		for (var i = 0; i < data.length; i++) {
			if (filtered(data[i]))
				$('#customers').append(`
					<tr>
						<td class="id">${data[i].id}</td>
						<td>${data[i].name}</td>
						<td>${data[i].age}</td>
						<td>${data[i].height}</td>
						<td>${data[i].weight}</td>
						<td>${data[i].sex}</td>
						<td>${data[i].race}</td>
						<td>${data[i].resting_heartrate}</td>
						<td>${data[i].systolic_blood_pressure}</td>
						<td>${data[i].diastolic_blood_pressure}</td>
						<td>${data[i].blood_sugar}</td>
					</tr>`)
		}
	}

	const getData = () => {
		db.collection('data').onSnapshot(function (snapshot) {
			data = []
			snapshot.forEach(function (doc) {
				data.push(doc.data())
			})
			drawTable();
		}, function (error) {
			console.log(error.message)
		})
	}

	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			getData();
		} else {
			window.location = '../'
		}
	})
})