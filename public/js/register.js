document.addEventListener("DOMContentLoaded", function () {
	firebase.auth().onAuthStateChanged(user => {
		if (user) window.location = '/data/'
	})

	function submit() {
		var email = $('#email').val()
		var password = $('#password').val()
		var confirm = $('#confirm').val()
		if (/([A-z0-9])+@([A-z0-9])+\.([a-z]){2,}/.test(email)) {
			if (password.length >= 8 && confirm == password) {
				firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
					console.log(error);
				}).then(function () {
					firebase.auth().signInWithEmailAndPassword(email, password).catch(error => {
						console.log(error);
					})
				});
			}
		}
	}

	$('#submit').click(submit)

	document.addEventListener('keydown', e => {
		if (e.keyCode == 13) submit();
	})
})