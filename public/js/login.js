document.addEventListener("DOMContentLoaded", function () {
	firebase.auth().onAuthStateChanged(user => {
		if (user) window.location = '/data/'
	})

	function submit() {
		var email = $('#email').val()
		var password = $('#password').val()
		if (/([A-z0-9])+@([A-z0-9])+\.([a-z]){2,}/.test(email)) {
			if (password.length >= 8) {
				firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
					console.log(error);
				});
			}
		}
	}

	$('#submit').click(submit)

	document.addEventListener('keydown', e => {
		if (e.keyCode == 13) submit();
	})
})