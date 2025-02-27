'use strict';

$(function () {
	// 3D pluses
	function closeAll3Dpopup() {
		for (var j = 1; j < 9; j++) {
			if ($('.hs1-popup_' + j).hasClass('hs1-popup_visible')) {
				$('.hs1-popup_' + j).switchPopup('close');
				$('.js-tgl-plus-' + j).removeClass('hs1-center__plus_active');
			}
		}
	}

	for (var i = 1; i < 9; i++) {
		$('.hs1-popup_' + i).switchPopup({
			pageScrollClass: 'root',
			btnClass: 'js-tgl-plus-' + i,
			displayClass: 'hs1-popup_display',
			visibleClass: 'hs1-popup_visible',
			duration: 200,
			overflow: false
		});

		$('.js-tgl-plus-' + i).on('click', function () {
			if (!$(this).hasClass('hs1-center__plus_active')) {
				closeAll3Dpopup();
				$(this).addClass('hs1-center__plus_active');
			} else {
				$(this).removeClass('hs1-center__plus_active');
			}

			var idx = $(this).index() + 1;
			var pos = $(this)[0].getBoundingClientRect();
			var posCenter = $('.home-sect-1__center')[0].getBoundingClientRect();
			var top = pos.top - posCenter.top - 131;
			var left = pos.left - posCenter.left + 36;

			$('.hs1-popup_' + idx).css({
				top: top + 'px',
				left: left + 'px'
			});
		});
	}

	// 3D model
	var events = [];
	var firstXcoords = -1;
	var firstYcoords = -1;
	var prevYcoords = -1;
	var sliderWidth = $('.hs1-center__slider').width();
	var sliderItems = $('.hs1-center__item').length;
	var sliderStep = sliderWidth / sliderItems;
	var currentSlide = 0;
	var onlineSlide = 0;
	var loadingSlides = [
		true, // 0
		true, // 1
		true, // 2
		true, // 3
		false, // 4
		false, // 5
		false, // 6
		false, // 7
		false, // 8
		false, // 9
		false, // 10
		false, // 11
		false, // 12
		false, // 13
		false, // 14
		false, // 15
		false, // 16
		false, // 17
		false, // 18
		false, // 19
		false, // 20
		false, // 21
		false, // 22
		false, // 23
		false, // 24
		false, // 25
		false, // 26
		false, // 27
		false, // 28
		false, // 29
		false, // 30
		false, // 31
		false, // 32
		false, // 33
		true, // 34
		true, // 35
		true // 36
	];

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

	function loadSlideImage(dir, index) {
		var idx = 0;
		if (dir === 'left') {
			if (currentSlide - (index + 3) < 0) {
				idx = sliderItems + (currentSlide - (index + 3));
			} else {
				idx = currentSlide - (index + 3);
			}
		} else if (dir === 'right') {
			if (currentSlide + (index + 3) >= sliderItems) {
				idx = currentSlide + (index + 3) - sliderItems;
			} else {
				idx = currentSlide + (index + 3);
			}
		}

		if (!loadingSlides[idx]) {
			var $pic = $(
				'.hs1-center__slider picture:nth-of-type(' + (idx + 1) + ')'
			);
			var $src = $pic.children('source');
			var $img = $pic.children('img');
			$src.attr('srcset', $src.attr('data-srcset'));
			$img.attr('src', $img.attr('data-src'));
			$img.attr('srcset', $img.attr('data-srcset'));
			$pic.addClass('load');

			loadingSlides[idx] = true;
		}
	}

	function pointerdownHandler(e) {
		if (events.length === 0) {
			firstXcoords = e.clientX;
			firstYcoords = e.clientY;
		}
		events.push(e);
	}

	function pointermoveHandler(e) {
		// eslint-disable-next-line
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
					var idx = Math.floor((events[0].clientX - firstXcoords) / sliderStep);
					onlineSlide = getNewSlideIndex('right', idx);
					loadSlideImage('right', idx); // Проверяю загруженность картинки
					$('.hs1-center__item').removeClass('hs1-center__item_active');
					$('.hs1-center__item:nth-child(' + (onlineSlide + 2) + ')').addClass(
						'hs1-center__item_active'
					);
					$('.hs1-center__slider').attr('data-slider', onlineSlide);
					closeAll3Dpopup();
					// тут менять активный слайд
				}
				/* Движение в лево */
				if (firstXcoords > events[0].clientX) {
					var idx = Math.floor((firstXcoords - events[0].clientX) / sliderStep);
					onlineSlide = getNewSlideIndex('left', idx);
					loadSlideImage('left', idx); // Проверяю загруженность картинки
					$('.hs1-center__item').removeClass('hs1-center__item_active');
					$('.hs1-center__item:nth-child(' + (onlineSlide + 2) + ')').addClass(
						'hs1-center__item_active'
					);
					$('.hs1-center__slider').attr('data-slider', onlineSlide);

					closeAll3Dpopup();
					// тут менять активный слайд
				}
			}

			prevYcoords = e.clientY;
		}
	}

	function pointerupHandler(e) {
		// eslint-disable-next-line
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

	var $sliderCard = $('.hs7-slider__cards').slick({
		infinite: true,
		dots: false,
		arrows: false,
		slidesToShow: 1,
		slidesToScroll: 1,
		variableWidth: true,
		centerPadding: '0px',
		draggable: false,
		swipe: false,
		accessibility: false,
		initialSlide: 0
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
		fade: true,
		initialSlide: 3
	});

	$('.hs7-slider__arrow.hs7-slider__arrow_left').on('click', function () {
		$sliderTexts.slick('slickNext');
		$sliderCard.slick('slickNext');
	});

	$('.hs7-slider__arrow.hs7-slider__arrow_right').on('click', function () {
		$sliderTexts.slick('slickPrev');
		$sliderCard.slick('slickPrev');
	});
});
