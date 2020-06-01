'use strict';

$(function () {
	var isTouch = 'ontouchstart' in window;

	if (!isTouch) {
		$('.ps11-preview__item').on('mouseenter', function () {
			var index = $(this).index();

			$('.ps11-preview__item').removeClass('ps11-preview__item_active');
			$(this).addClass('ps11-preview__item_active');
			$('.ps15-preview__item').removeClass('ps15-preview__item_active');
			$('.ps15-preview__item:nth-child(' + (index + 1) + ')').addClass(
				'ps15-preview__item_active'
			);
		});
	} else {
		$('.ps11-preview__item').on('click', function () {
			var index = $(this).index();

			$('.ps11-preview__item').removeClass('ps11-preview__item_active');
			$(this).addClass('ps11-preview__item_active');
			$('.ps15-preview__item').removeClass('ps15-preview__item_active');
			$('.ps15-preview__item:nth-child(' + (index + 1) + ')').addClass(
				'ps15-preview__item_active'
			);
		});
	}

	var st = $('.root').scrollTop();
	var prevScroll = st;

	$('.root').on('scroll', function () {
		st = $('.root').scrollTop();

		if (
			!$('.ps11-preview__item:nth-child(1)').hasClass(
				'ps11-preview__item_active'
			)
		) {
			$('.ps11-preview__item').removeClass('ps11-preview__item_active');
			$('.ps11-preview__item:nth-child(1)').addClass(
				'ps11-preview__item_active'
			);
			$('.ps15-preview__item').removeClass('ps15-preview__item_active');
			$('.ps15-preview__item:nth-child(1)').addClass(
				'ps15-preview__item_active'
			);
		}

		if (prevScroll > st) {
			if (
				$('.product-sect-1__header').hasClass('product-sect-1__header_hide')
			) {
				$('.product-sect-1__header').removeClass('product-sect-1__header_hide');
			}
		} else if (
			!$('.product-sect-1__header').hasClass('product-sect-1__header_hide')
		) {
			if (st > 100) {
				$('.product-sect-1__header').addClass('product-sect-1__header_hide');
			}
		}
		prevScroll = st;
	});

	$('.js-product-props').on('change', function () {
		var curVal = $(this).val();
		$('.js-product-price').each(function (idx, el) {
			$(el).text(Number($(el).data('start')) + Number(curVal));
		});
	});

	$('.js-goto-form').on('click', function () {
		$('.root').animate(
			{
				scrollTop: $('.product-sect-1__4').offset().top - 80
			},
			1300
		);
	});
});
