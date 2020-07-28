'use strict';

$(function () {
	// Клик по стрелочке для скролла тегов
	var scrollPos;
	var scrollW;
	var width;
	var slGoods = $('.js-sl-goods');
	var parent;
	var childSl;

	// Поправка на отступ
	var padding = 24;

	// Переменные для подсчёта суммы
	var check = $('.js-accessory-check');
	var currentCheck;
	var currentCheckPrice;
	var currentDataGroup;
	var currentBlockPrice;
	var initialPrice;
	var value;
	var input = $('.js-hidden-order');

	$(document).ready(function () {
		slGoods.each(function () {
			scrollW = $(this)[0].scrollWidth;
			width = Math.floor(scrollW - $(this).outerWidth(true) - padding);
			$(this).data('width', width);
		});
	});

	$(window).on('resize', function () {
		slGoods.each(function () {
			scrollW = $(this)[0].scrollWidth;
			width = Math.floor(scrollW - $(this).outerWidth(true) - padding);
			$(this).attr('data-width', width);
		});
	});

	// Вправо
	$('.js-scroll-btn-right').on('click', function () {
		parent = $(this).parent();
		childSl = parent.children('.js-sl-goods');
		scrollPos = childSl.scrollLeft() + 100;
		childSl.animate({ scrollLeft: scrollPos }, 200);
	});
	// Влево
	$('.js-scroll-btn-left').on('click', function () {
		parent = $(this).parent();
		childSl = parent.children('.js-sl-goods');
		scrollPos = childSl.scrollLeft() - 100;
		childSl.animate({ scrollLeft: scrollPos }, 200);
	});

	slGoods.on('scroll', function () {
		if ($(this).scrollLeft() === 0) {
			$(this).siblings('.js-scroll-btn-left').hide();
		} else {
			$(this).siblings('.js-scroll-btn-left').show();
		}
		if ($(this).scrollLeft() >= $(this).data('width')) {
			$(this).siblings('.js-scroll-btn-right').hide();
		} else {
			$(this).siblings('.js-scroll-btn-right').show();
		}
	});

	// При изменении чекбокса
	check.on('change', function () {
		currentCheck = $(this);
		currentDataGroup = currentCheck.data('group');
		currentBlockPrice = currentCheck
			.parents('.accessory-sl')
			.find('.accessory-sl__right');
		currentCheckPrice = currentCheck
			.parent()
			.find('.js-price')
			.text()
			.replace(/\s/g, '');
		initialPrice =
			+$('.js-price[data-group="' + currentDataGroup + '"]')
				.text()
				.replace(/\s/g, '') || 0;
		if (currentCheck.is(':checked')) {
			initialPrice += +currentCheckPrice;
			// При увелечении суммы добавляется класс, если раньше не было
			if (!currentBlockPrice.hasClass('accessory-sl__right_show')) {
				currentBlockPrice.addClass('accessory-sl__right_show');
			}
		} else {
			initialPrice -= +currentCheckPrice;
			// Если сумма равна 0, то блок с кнопкой и ценой прячется
			if (initialPrice === 0) {
				currentBlockPrice.removeClass('accessory-sl__right_show');
			}
		}
		currentBlockPrice.find('.js-price').text(initialPrice);
	});

	$('.js-order').on('click', function () {
		currentDataGroup = $(this).data('group');
	});

	$('.js-clear-group').on('click', function () {
		currentDataGroup = null;
	});

	$('.popup-buy').on('beforeOpen', function () {
		input.val('');
		$('.js-accessory-check[data-group="' + currentDataGroup + '"]').each(
			function () {
				if ($(this).is(':checked')) {
					value = input.val();
					if (!value.length) {
						input.val($(this).data('id'));
					} else {
						input.val(value + ', ' + $(this).data('id'));
					}
				}
			}
		);
	});
});
