document.addEventListener("DOMContentLoaded", () => {
	$('.navbar-links__link-text').hover(function () {
		$(this).parent().children('.navbar-links__link-underline').stop().animate({
			width: $(this).parent().width()
		}, 250, () => { })
	}, function () {
		$(this).parent().children('.navbar-links__link-underline').stop().animate({
			width: 0
		}, 250, () => { })
	})
})