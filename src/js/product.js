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

	function updateProductPopup() {
		var $productChecked = $('.js-product-props:checked');
		var $productCheckedParent = $productChecked.parent('.checked-dop');
		var productCheckedId = $productChecked.val();
		var productCheckedName = $productCheckedParent
			.find('.checked-dop__desc')
			.text();
		var productCheckedPrice = $productCheckedParent
			.find('.checked-dop__price')
			.text();
		var $product2Checked = $('.js-product-props-2:checked');
		var $product2CheckedParent = $product2Checked.parent('.checked-dop');
		var product2CheckedId = $product2Checked.val();
		var product2src = $product2CheckedParent.find('img').attr('src');
		var product2srcset = $product2CheckedParent.find('img').attr('srcset');
		var product2alt = $product2CheckedParent.find('img').attr('alt');

		$(
			'.popup-product-device__input.popup-product-device__input_additional'
		).val(productCheckedId);

		$('.popup-product-device__right > span:first-child').text(
			productCheckedName
		);

		if (productCheckedPrice) {
			$('.popup-product-device__right > span:last-child').text(
				productCheckedPrice
			);
		} else {
			$('.popup-product-device__right > span:last-child').text('0 руб.');
		}

		$('.popup-product-device__input.popup-product-device__input_bank').val(
			product2CheckedId
		);
		$('.popup-product-device__left > img').attr('src', product2src);
		if (product2srcset) {
			$('.popup-product-device__left > img').attr('srcset', product2srcset);
		}
		if (product2alt) {
			$('.popup-product-device__left > img').attr('alt', product2alt);
		}
	}

	updateProductPopup();

	$('.js-product-props').on('change', function () {
		var curVal = $(this).parent().find('.js-price').text().replace(' ', '');
		$('.js-product-price').each(function (idx, el) {
			$(el).text(Number($(el).data('start')) + Number(curVal));
		});

		updateProductPopup();
	});
	$('.js-product-props-2').on('change', function () {
		updateProductPopup();
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
