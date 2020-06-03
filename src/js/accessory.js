'use strict';

$(function () {
	// Клик по стрелочке для скролла тегов
	var scrollPos;
	var scrollW;
	var width;
	var slGoods = $('.js-sl-goods');
	var parent;
	var childSl;

	$(document).ready(function () {
		slGoods.each(function () {
			scrollW = $(this)[0].scrollWidth;
			width = Math.floor(scrollW - $(this).outerWidth(true));
			$(this).data('width', width);
		});
	});

	$(window).on('resize', function () {
		slGoods.each(function () {
			scrollW = $(this)[0].scrollWidth;
			width = Math.floor(scrollW - $(this).outerWidth(true));
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
});
