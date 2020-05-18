'use strict';

$(function () {
	var imgSvgArray = {};

	function imgSvg() {
		$('img.img-svg').each(function () {
			var $svg;
			var $img = $(this);
			var imgID = $img.attr('id');
			var imgClass = $img.attr('class');
			var imgURL = $img.attr('src');

			if (typeof imgSvgArray[imgURL] !== 'undefined') {
				$svg = $(imgSvgArray[imgURL]);
				if (typeof imgClass !== 'undefined') {
					$svg = $svg.attr('class', imgClass + ' replaced-svg');
				}
				$img.replaceWith($svg);
			} else {
				$.ajax({
					url: imgURL,
					async: false,
					dataType: 'xml',
					success: function (data) {
						$svg = $(data).find('svg');

						if (typeof imgID !== 'undefined') {
							$svg = $svg.attr('id', imgID);
						}

						$svg = $svg.removeAttr('xmlns:a');

						if (
							!$svg.attr('viewBox') &&
							$svg.attr('height') &&
							$svg.attr('width')
						) {
							$svg.attr(
								'viewBox',
								'0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width')
							);
						}

						imgSvgArray[imgURL] = $svg[0].outerHTML;

						if (typeof imgClass !== 'undefined') {
							$svg = $svg.attr('class', imgClass + ' replaced-svg');
						}

						$img.replaceWith($svg);
					}
				});
			}
		});
	}

	imgSvg();

	$('body').on('DOMNodeInserted', function () {
		imgSvg();
	});

	// Настройка вспомогательных переменных
	function updateDeviceProps() {
		var vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty('--vh', vh + 'px');

		var root = document.querySelector('.root');
		var scrollWidth = window.innerWidth - root.clientWidth;
		document.documentElement.style.setProperty(
			'--scroll-width',
			scrollWidth + 'px'
		);
	}
	window.addEventListener('resize', updateDeviceProps);
	updateDeviceProps();

	// Поле ввода
	$('.formfield__input, .formfield__textarea').on({
		focusin: function () {
			$(this).parent('.formfield').addClass('formfield_focus');
		},
		focusout: function () {
			if ($(this).val()) return;
			$(this).parent('.formfield').removeClass('formfield_focus');
		}
	});

	$(document).ready(function () {
		$('.formfield__input, .formfield__textarea').each(function () {
			if ($(this).val().length) {
				$(this).parent('.formfield').addClass('formfield_focus');
			}
			if ($(this).attr('disabled')) {
				$(this).parent('.formfield').addClass('formfield_disabled');
			}
		});
	});

	// Список продуктов в шапке
	$('.menu__products-preview').switchPopup({
		displayClass: 'menu__products-preview_display',
		visibleClass: 'menu__products-preview_visible',
		duration: 300,
		btnClass: 'js-tgl-products-preview',
		overflow: false
	});

	$('.menu__products-preview').on('beforeOpen', function () {
		$('.btn-products').addClass('btn-products_open');
	});
	$('.menu__products-preview').on('beforeClose', function () {
		$('.btn-products').removeClass('btn-products_open');
	});

	// Мобильно-планшетное меню
	$('.menu__wrap').switchPopup({
		displayClass: 'menu__wrap_display',
		visibleClass: 'menu__wrap_visible',
		duration: 300,
		btnClass: 'js-tgl-menu',
		overflow: false
	});

	$('.menu__wrap').on('beforeOpen', function () {
		$('.btn-burger').addClass('btn-burger_open');
	});
	$('.menu__wrap').on('beforeClose', function () {
		$('.btn-burger').removeClass('btn-burger_open');
	});

	$(window).on('wheel', function (event) {
		if (event.originalEvent.deltaY < 0) {
			if ($('.header').hasClass('header_hide')) {
				$('.header').removeClass('header_hide');
			}
		}
		if (event.originalEvent.deltaY > 0) {
			if (!$('.header').hasClass('header_hide')) {
				$('.header').addClass('header_hide');
				$('.menu__products-preview').switchPopup('close');
			}
		}
	});
});
