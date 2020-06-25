'use strict';

var Price = window.Price || {};

/* eslint-disable-next-line */
Price = (function () {
	/* eslint-disable-next-line */
	function Price(element) {
		var _ = this;
		_.$price = $(element);
		_.init();
	}
	return Price;
})();

Price.prototype.init = function () {
	var _ = this;
	_.$price.on('DOMNodeInserted', function () {
		_.update();
	});

	_.update();
};

Price.prototype.update = function () {
	var _ = this;
	if (_.$price.text().indexOf(' ') === -1) {
		var resultArr = [];
		var reverseTextArr = _.$price.text().split('').reverse();
		for (var i = 0; i < reverseTextArr.length; i++) {
			resultArr.push(reverseTextArr[i]);
			if ((i + 1) % 3 === 0) {
				resultArr.push(' ');
			}
		}
		_.$price.text(resultArr.reverse().join(''));
	}
};

$.fn.price = function () {
	var _ = this;
	var opt = arguments[0];
	var args = Array.prototype.slice.call(arguments, 1);
	var l = _.length;
	var i;
	var ret;

	for (i = 0; i < l; i++) {
		if (typeof opt === 'object' || typeof opt === 'undefined') {
			_[i].price = new Price(_[i], opt);
		} else {
			ret = _[i].price[opt].apply(_[i].price, args);
		}
		if (typeof ret !== 'undefined') return ret;
	}
	return _;
};

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

	// // Скрыть/показать шапку
	// $('.root').on('wheel', function (event) {
	// 	if (event.originalEvent.deltaY < 0) {
	// 		if ($('.header').hasClass('header_hide')) {
	// 			$('.header').removeClass('header_hide');
	// 		}
	// 	}
	// 	if (event.originalEvent.deltaY > 0) {
	// 		if (!$('.header').hasClass('header_hide')) {
	// 			$('.header').addClass('header_hide');
	// 			$('.menu__products-preview').switchPopup('close');
	// 		}
	// 	}
	// });

	var st = $('.root').scrollTop();
	var prevScroll = st;
	var isHeaderTransparent = $('.header').hasClass('header_transparent');
	$('.root').on('scroll', function () {
		st = $('.root').scrollTop();
		if (prevScroll > st) {
			if ($('.header').hasClass('header_hide')) {
				$('.header').removeClass('header_hide');
			}
		} else if (!$('.header').hasClass('header_hide')) {
			if (st > 100) {
				$('.header').addClass('header_hide');
				$('.menu__products-preview').switchPopup('close');
			}
		}
		if (isHeaderTransparent) {
			if (!$('.header').hasClass('header_transparent') && st < 100) {
				$('.header').addClass('header_transparent');
			} else {
				$('.header').removeClass('header_transparent');
			}
		}
		prevScroll = st;
	});

	// Добавляю пробелы в цене
	$('.js-price').each(function (index, el) {
		$(el).price();
	});

	// Аккордион
	$('.accordion__btn').on('click', function () {
		var $item = $(this).parents('.accordion__item');

		if ($item.hasClass('accordion__item_open')) {
			$item.removeClass('accordion__item_open');
		} else {
			$item.addClass('accordion__item_open');
		}
	});

	// На мобильном по умолчанию все аккордины закрыты
	$(document).ready(function () {
		if ($(window).width() < 768) {
			$('.accordion__item').removeClass('accordion__item_open');
		}
	});

	/* Обработка форм (отключение возможности отправки при неактивном инпуте) */
	$('form').each(function (id, form) {
		var $checkboxes = $(form).find('input[type="checkbox"]');
		var $submit = $(form).find('button[type="submit"]');
		var $politconf;
		$checkboxes.each(function (checkId, checkbox) {
			if (checkbox.id.toLowerCase().indexOf('politconf') !== -1) {
				$politconf = $(checkbox);
			}
		});

		if ($politconf && $politconf.length && $submit && $submit.length) {
			$submit.attr('disabled', !$politconf[0].checked);
			$politconf.on('change', function () {
				$submit.attr('disabled', !$politconf[0].checked);
			});
		}
	});

	$('.textarea-spoiler__toggle').on('click', function () {
		var $parent = $(this).parents('.textarea-spoiler');

		if ($parent.hasClass('textarea-spoiler_open')) {
			$parent.removeClass('textarea-spoiler_open');
			$parent.children('.textarea-spoiler__body').slideUp();
		} else {
			$parent.addClass('textarea-spoiler_open');
			$parent.children('.textarea-spoiler__body').slideDown();
		}
	});

	$('.popup-buy').switchPopup({
		pageScrollClass: 'root',
		btnClass: 'js-tgl-popup-buy',
		displayClass: 'popup-buy_display',
		visibleClass: 'popup-buy_visible',
		duration: 300
	});

	$('.popup-buy-wrap__content').switchPopup({
		displayClass: 'popup-buy-wrap__content_display',
		visibleClass: 'popup-buy-wrap__content_visible',
		duration: 200
	});

	$('.popup-buy-wrap__end').switchPopup({
		displayClass: 'popup-buy-wrap__end_display',
		visibleClass: 'popup-buy-wrap__end_visible',
		duration: 200
	});

	$('.popup-buy').on('afterClose', function () {
		if ($('.popup-buy-wrap').hasClass('popup-buy-wrap_success')) {
			$('.popup-buy-wrap__content').switchPopup('open');
			$('.popup-buy-wrap__end').switchPopup('close');
			$('.popup-buy-wrap').removeClass('popup-buy-wrap_success');
			$('.popup-buy-wrap').css('height', '');
		}
	});

	// Форма из попапа
	$('.popup-buy-wrap').on('submit', function (e) {
		e.preventDefault();
		var $form = $(this);
		var formData = new FormData(this);

		var csrfParam = $('meta[name="csrf-param"]').attr('content');
		var csrfToken = $('meta[name="csrf-token"]').attr('content');

		formData[csrfParam] = csrfToken;

		$.ajax({
			url: $form.attr('action'),
			method: $form.attr('method'),
			async: false,
			data: formData,
			processData: false,
			contentType: false,
			success: function (res) {
				var data = JSON.parse(res);

				if (data.success) {
					$('.popup-buy-wrap__content').switchPopup('close');
					var height = $('.popup-buy-wrap').css('height');
					$('.popup-buy-wrap').css('height', height);
					setTimeout(function () {
						$('.popup-buy-wrap').animate(
							{
								height: '80px'
							},
							500
						);
					}, 200);

					setTimeout(function () {
						$('.popup-buy-wrap').addClass('popup-buy-wrap_success');
					}, 700);

					setTimeout(function () {
						$('.popup-buy-wrap__end').switchPopup('open');
					}, 1000);

					setTimeout(function () {
						$('.popup-buy').switchPopup('close');
					}, 3000);
				} else {
					$('.formfield').each(function (i, el) {
						$(el).removeClass('.formfield_error');
						$(el).children('.formfield__msg').remove();
					});

					if (typeof data.message === 'object') {
						Object.keys(data.message).forEach(function (inputName) {
							var $ff = $form
								.find('[name="' + inputName + '"]')
								.parent('.formfield');
							$ff.addClass('formfield_error');
							$ff.append(
								'<span class="formfield__msg">' +
									data.message[inputName] +
									'</span>'
							);
						});
					}
				}
			}
		});
	});

	$('.popup-product').switchPopup({
		pageScrollClass: 'root',
		btnClass: 'js-tgl-popup-product',
		displayClass: 'popup-product_display',
		visibleClass: 'popup-product_visible',
		duration: 300
	});

	$('.popup-product-wrap__content').switchPopup({
		displayClass: 'popup-product-wrap__content_display',
		visibleClass: 'popup-product-wrap__content_visible',
		duration: 200
	});

	$('.popup-product-wrap__end').switchPopup({
		displayClass: 'popup-product-wrap__end_display',
		visibleClass: 'popup-product-wrap__end_visible',
		duration: 200
	});

	$('.popup-product').on('afterClose', function () {
		if ($('.popup-product-wrap').hasClass('popup-product-wrap_success')) {
			$('.popup-product-wrap__content').switchPopup('open');
			$('.popup-product-wrap__end').switchPopup('close');
			$('.popup-product-wrap').removeClass('popup-product-wrap_success');
			$('.popup-product-wrap').css('height', '');
		}
	});

	// Форма из попапа
	$('.popup-product-wrap').on('submit', function (e) {
		e.preventDefault();
		var $form = $(this);
		var formData = new FormData(this);

		var csrfParam = $('meta[name="csrf-param"]').attr('content');
		var csrfToken = $('meta[name="csrf-token"]').attr('content');

		formData[csrfParam] = csrfToken;

		$.ajax({
			url: $form.attr('action'),
			method: $form.attr('method'),
			async: false,
			data: formData,
			processData: false,
			contentType: false,
			success: function (res) {
				var data = JSON.parse(res);

				if (data.success) {
					$('.popup-product-wrap__content').switchPopup('close');
					var height = $('.popup-product-wrap').css('height');
					$('.popup-product-wrap').css('height', height);
					setTimeout(function () {
						$('.popup-product-wrap').animate(
							{
								height: '80px'
							},
							500
						);
					}, 200);

					setTimeout(function () {
						$('.popup-product-wrap').addClass('popup-product-wrap_success');
					}, 700);

					setTimeout(function () {
						$('.popup-product-wrap__end').switchPopup('open');
					}, 1000);

					setTimeout(function () {
						$('.popup-product').switchPopup('close');
					}, 3000);
				} else {
					$('.formfield').each(function (i, el) {
						$(el).removeClass('.formfield_error');
						$(el).children('.formfield__msg').remove();
					});

					if (typeof data.message === 'object') {
						Object.keys(data.message).forEach(function (inputName) {
							var $ff = $form
								.find('[name="' + inputName + '"]')
								.parent('.formfield');
							$ff.addClass('formfield_error');
							$ff.append(
								'<span class="formfield__msg">' +
									data.message[inputName] +
									'</span>'
							);
						});
					}
				}
			}
		});
	});
});
