data = []

document.addEventListener('DOMContentLoaded', function () {
	var db = firebase.firestore()

	const addGraph = num => {
		var min = 9999999
		var minIndex = 0
		$('#main > .column > .inner-column').each(function (index) {
			console.log(index + ' ' + $(this).height())
			if ($(this).height() < min) {
				min = $(this).height()
				minIndex = index
			}
		})

		var el = '<div class="card"><div class="card-title">thing</div>'
		for (var i = 0; i < num; i++) {
			el += '<div>asdf</div>'
		}
		el += '</div>'

		$(`.column${minIndex + 1} > .inner-column`).append(el)
	}

	const drawGraphs = () => {
		addGraph(6)
		addGraph(10)
		addGraph(2)
		addGraph(5)
		addGraph(3)
		addGraph(7)
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