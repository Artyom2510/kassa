'use strict';

$(function () {
	var root = $('.root');
	var rub = $('.js-rub');
	var parentRub = $('.js-parent-rub');
	var heightParentRub;
	var wHeight;
	var difference;
	var rotate;
	var state = {
		rotate: 75,
		scale: 0.75
	};
	var scale;
	var abs = true;

	$(document).ready(function () {
		heightParentRub = parentRub.outerHeight(true) / 2;
		wHeight = $(this).outerHeight(true) / 2;
	});

	$(window).on('resize', function () {
		heightParentRub = parentRub.outerHeight(true) / 2;
		wHeight = $(this).outerHeight(true) / 2;

		if ($(this).outerWidth(true) < 768) {
			rub.css('transform', 'rotate(0deg) scale(1)');
		}
	});

	root.on('scroll', function () {
		if ($(window).outerWidth(true) > 767) {
			difference = parentRub.offset().top - wHeight;
			if (difference < 0) {
				if (difference + heightParentRub <= 0) {
					abs = false;
				} else {
					abs = true;
				}
				difference /= 12;
				rotate = Math.round(state.rotate + difference);
				scale = abs
					? Math.min(state.scale + Math.abs(difference / 230), 1)
					: 1.2 + difference / 300;
				rub.css(
					'transform',
					'rotate(' + rotate + 'deg) scale(' + scale.toFixed(2) + ')'
				);
			}
		}
	});
});
