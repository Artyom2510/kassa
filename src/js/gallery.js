'use strict';

$(function () {
	var root = $('.root');

	/* Инициализация лайтбокса */
	if ($('[data-lightbox]').length) {
		lightbox.option({
			alwaysShowNavOnTouchDevices: true,
			resizeDuration: 0,
			positionFromTop: 0,
			showImageNumberLabel: false,
			disableScrolling: true
		});
	}

	// root.on('scroll', function() {

	// });
});
