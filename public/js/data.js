data = []

document.addEventListener('DOMContentLoaded', function () {
	var db = firebase.firestore()

	var filterText = ""

	const filter = doc => {
		return true
	}

	const drawTable = () => {
		$('#customers').html('<tr><th>ID</th><th>Name</th><th>Age (yrs)</th><th>Height (in)</th><th>Sex</th><th>Dominant Race</th><th>Resting Heartrate (BPM)</th><th>Systolic Blood Pressure (mmHg)</th><th>Diastolic Blood Pressure (mmHg)</th><th>Weight (lbs.)</th><th>Blood Sugar (mg/dL)</th></tr>')
		for (var i = 0; i < data.length; i++) {
			if (filter(data[i])) {
				$('#customers').append(`
					<tr>
						<td>${data[i].id}</td>
						<td>${data[i].name}</td>
						<td>${data[i].age}</td>
						<td>${data[i].height}</td>
						<td>${data[i].sex}</td>
						<td>${data[i].race}</td>
						<td>${data[i].resting_heartrate}</td>
						<td>${data[i].systolic_blood_pressure}</td>
						<td>${data[i].diastolic_blood_pressure}</td>
						<td>${data[i].weight}</td>
						<td>${data[i].blood_sugar}</td>
					</tr>`)
			}
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