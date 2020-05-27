'use strict';

$(function () {
	// Слайдер лого-партнёров
	var slider = $('.js-partner-sl');
	var sliderPrev = $('.js-partner-prev');
	var sliderNext = $('.js-partner-next');

	if (slider.length) {
		slider.slick({
			infinite: true,
			dots: false,
			arrows: false,
			slidesToShow: 6,
			slidesToScroll: 1,
			adaptiveHeight: true,
			swipeToSlide: true,
			speed: 300,
			cssEase: 'ease',
			responsive: [
				{
					breakpoint: 1100,
					settings: {
						slidesToShow: 4,
						slidesToScroll: 2,
						rows: 2
					}
				},
				{
					breakpoint: 767,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 2,
						rows: 2
					}
				}
			]
		});
	}

	// Предыдущий слайд
	if (slider.length && sliderPrev.length) {
		sliderPrev.on('click', function () {
			slider.slick('slickPrev');
		});
	}

	// Слудущий слайд
	if (slider.length && sliderNext.length) {
		sliderNext.on('click', function () {
			slider.slick('slickNext');
		});
	}
});
