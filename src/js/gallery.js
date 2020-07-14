'use strict';

$(function () {
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
});
