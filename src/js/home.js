'use strict';

$(function () {
	var events = [];
	var firstXcoords = -1;
	var firstYcoords = -1;
	var prevYcoords = -1;
	var sliderWidth = $('.hs1-center__slider').width();
	var sliderItems = $('.hs1-center__item').length;
	var sliderStep = sliderWidth / sliderItems;
	var currentSlide = 0;
	var onlineSlide = 0;

	function getNewSlideIndex(dir, index) {
		var res = 0;
		if (dir === 'left') {
			if (currentSlide - index < 0) {
				res = sliderItems + (currentSlide - index);
			} else {
				res = currentSlide - index;
			}
		} else if (dir === 'right') {
			if (currentSlide + index >= sliderItems) {
				res = currentSlide + index - sliderItems;
			} else {
				res = currentSlide + index;
			}
		}
		return res;
	}

	function pointerdownHandler(e) {
		if (events.length === 0) {
			firstXcoords = e.clientX;
			firstYcoords = e.clientY;
		}
		events.push(e);
	}

	function pointermoveHandler(e) {
		for (var i = 0; i < events.length; i++) {
			if (e.pointerId === events[i].pointerId) {
				events[i] = e;
				break;
			}
		}

		if (events.length === 1) {
			if (
				'ontouchstart' in window &&
				((firstYcoords > events[0].clientY &&
					firstYcoords - events[0].clientY > 20) ||
					(firstYcoords < events[0].clientY &&
						events[0].clientY - firstYcoords > 20))
			) {
				if (prevYcoords > 0) {
					$('.root').scrollTop(
						$('.root').scrollTop() + (prevYcoords - events[0].clientY)
					);
				}
			} else if (firstXcoords > 0) {
				/* Движение в право */
				if (firstXcoords < events[0].clientX) {
					onlineSlide = getNewSlideIndex(
						'right',
						Math.floor((events[0].clientX - firstXcoords) / sliderStep)
					);
					$('.hs1-center__item').removeClass('hs1-center__item_active');
					$('.hs1-center__item:nth-child(' + (onlineSlide + 1) + ')').addClass(
						'hs1-center__item_active'
					);
					// тут менять активный слайд
				}
				/* Движение в лево */
				if (firstXcoords > events[0].clientX) {
					onlineSlide = getNewSlideIndex(
						'left',
						Math.floor((firstXcoords - events[0].clientX) / sliderStep)
					);
					$('.hs1-center__item').removeClass('hs1-center__item_active');
					$('.hs1-center__item:nth-child(' + (onlineSlide + 1) + ')').addClass(
						'hs1-center__item_active'
					);
					// тут менять активный слайд
				}
			}

			prevYcoords = e.clientY;
		}
	}

	function pointerupHandler(e) {
		for (var i = 0; i < events.length; i++) {
			if (events[i].pointerId === e.pointerId) {
				events.splice(i, 1);
				break;
			}
		}
		firstXcoords = -1;
		firstYcoords = -1;
		prevYcoords = -1;
		currentSlide = onlineSlide;
	}

	// 3D визуализация на главной
	function initSlider3D() {
		var slider = document.querySelector('.hs1-center__slider');

		slider.addEventListener('pointerdown', function (e) {
			pointerdownHandler(e);
		});

		slider.addEventListener('pointermove', function (e) {
			pointermoveHandler(e);
		});

		slider.addEventListener('pointerup', function (e) {
			pointerupHandler(e);
		});

		slider.addEventListener('pointercancel', function (e) {
			pointerupHandler(e);
		});

		slider.addEventListener('pointerout', function (e) {
			pointerupHandler(e);
		});

		slider.addEventListener('pointerleave', function (e) {
			pointerupHandler(e);
		});
	}

	$(document).ready(function () {
		initSlider3D();
	});

	var $sliderCards = $('.hs7-slider__cards').slick({
		infinite: true,
		dots: false,
		arrows: false,
		slidesToShow: 1,
		slidesToScroll: 1,
		variableWidth: true,
		centerPadding: '0px',
		draggable: false,
		swipe: false,
		accessibility: false
	});

	var $sliderTexts = $('.hs7-slider__texts').slick({
		infinite: true,
		dots: false,
		arrows: false,
		slidesToShow: 1,
		slidesToScroll: 1,
		centerPadding: '0px',
		draggable: false,
		swipe: false,
		accessibility: false,
		fade: true
	});

	$('.hs7-slider__arrow.hs7-slider__arrow_left').on('click', function () {
		$sliderCards.slick('slickPrev');
		$sliderTexts.slick('slickPrev');
	});

	$('.hs7-slider__arrow.hs7-slider__arrow_right').on('click', function () {
		$sliderCards.slick('slickNext');
		$sliderTexts.slick('slickNext');
	});
});
