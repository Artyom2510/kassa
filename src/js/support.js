'use strict';

$(function () {
	var root = $('.root');

	// Аккордион
	$('.js-btn-question').on('click', function () {
		var parent = $(this).closest('.js-parent');
		parent.toggleClass('open');
		parent.children('.js-body').slideToggle(300);
	});

	// Скролл по якорю
	function animateSect(sect) {
		root.stop().animate(
			{
				scrollTop: sect.offset().top + root.scrollTop()
			},
			500
		);
		return false;
	}

	var btnFixedMenu = $('.js-fixed-btn');
	var fixedMenu = $('.js-fixed-nav');
	var currentSect;
	var anchor;
	// var mainWraper = $('.js-wraper');
	// var mainWraperHeight;
	// var wHeight;

	// $(document).ready(function () {
	// 	mainWraperHeight = mainWraper.outerHeight(true);
	// 	wHeight = $(window).height() / 1.5;
	// });

	// $(window).on('resize', function () {
	// 	mainWraperHeight = mainWraper.outerHeight(true);
	// 	wHeight = $(window).height() / 1.5;
	// });

	btnFixedMenu.on('click', function () {
		if (!$(this).hasClass('fixed-nav-menu__btn_active')) {
			anchor = $(this).data('anchor');
			currentSect = $('.js-sect-top[data-anchor="' + anchor + '"]');
			animateSect(currentSect);
		}
	});

	// При скролле страницы меняется активный булет
	root.on('scroll', function () {
		if ($(window).width() > 767) {
			var windscroll = root.scrollTop();
			// if (windscroll >= mainWraperHeight - wHeight) {
			// 	fixedMenu.css('position', 'absolute');
			// } else
			if (windscroll >= 100) {
				// fixedMenu.css('position', 'fixed');
				$('.js-sect-top').each(function (i) {
					if ($(this).position().top <= windscroll) {
						$('.js-fixed-btn.fixed-nav-menu__btn_active').removeClass(
							'fixed-nav-menu__btn_active'
						);
						$('.js-fixed-btn').eq(i).addClass('fixed-nav-menu__btn_active');
					}
				});
			} else {
				// fixedMenu.css('position', 'absolute');
				$('.js-fixed-btn.fixed-nav-menu__btn_active').removeClass(
					'fixed-nav-menu__btn_active'
				);
				$('.js-fixed-btn:first').addClass('fixed-nav-menu__btn_active');
			}
		}
		if ($(window).width() < 1920 && $(window).width() > 767) {
			if ($('.header').hasClass('header_hide')) {
				fixedMenu.addClass('fixed-nav-menu_without-header');
			} else {
				fixedMenu.removeClass('fixed-nav-menu_without-header');
			}
		}
	});

	// Видео при клике на карточку в "Видеоинструкции"
	var popupVideo = $('.popup-video');
	popupVideo.switchPopup({
		pageScrollClass: '.root',
		btnClass: 'js-tgl-video',
		displayClass: 'popup-video_display',
		visibleClass: 'popup-video_visible',
		duration: 300,
		overflow: true
	});

	// Ссылка на видео с атрибутами
	var link;
	var fullLink;
	$('.js-open-video').on('click', function () {
		link = $(this).data('link');
		fullLink =
			link +
			'?autoplay=true&amp;modestbranding=1&amp;iv_load_policy=3&amp;rel=0;enablejsapi=1&mute=1';
		$('.js-parent-iframe-link iframe').attr('src', fullLink);
		popupVideo.switchPopup('open');
	});

	// Пауза
	popupVideo.on('beforeClose', function () {
		$(this)
			.find('iframe')[0]
			.contentWindow.postMessage(
				'{"event":"command","func":"stopVideo","args":""}',
				'*'
			);
	});

	// Клик по заголовку на мобиле для показа карточек
	$('.js-xs-slidedown').on('click', function () {
		var parent = $(this).parent();
		$(this).toggleClass('recommendations-sect__subtitle_open');
		parent.children('.recommendations-sect__cards').slideToggle(400);
	});
});
