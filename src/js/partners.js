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
					breakpoint: 1279,
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

function init() {
	// eslint-disable-next-line no-undef, one-var
	var myMap = new ymaps.Map(
			'map',
			{
				center: [55.7536, 37.621218],
				zoom: 9,
				controls: ['smallMapDefaultSet']
			},
			{
				searchControlProvider: 'yandex#search'
			}
		),
		// eslint-disable-next-line no-undef
		clusterer = new ymaps.Clusterer({
			clusterIcons: [
				{
					href: 'img/ui-icon/pin-cluster.svg',
					size: [54, 61],
					offset: [-27, -30]
				}
			],
			clusterNumbers: [10]
		});

	var popupMap = $('.popup-map');

	popupMap.switchPopup({
		btnClass: 'js-tgl-popup-map',
		duration: '300',
		overflow: false
	});

	myMap.panes.get('ground').getElement().style.filter =
		'grayscale(100%) invert(5%)';

	/* Преобразование строковых координат в массив */
	var getCoords = function (coords) {
		return [+coords.split(',')[0], +coords.split(',')[1]];
	};

	function initDataPoints(arrays) {
		var getFeatureCollection = function (el) {
			return {
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: el.coords !== '' ? getCoords(el.coords) : [0, 0]
				},
				properties: {
					name: el.nameCompany,
					info: {
						phone: el.phone,
						address: el.addr,
						email: el.email,
						site: el.site
					}
				},
				options: {
					id: el.id,
					iconLayout: 'default#image',
					iconImageHref: 'img/ui-icon/pin.svg',
					iconImageSize: [54, 61],
					iconImageOffset: [-27, -30]
				}
			};
		};

		// eslint-disable-next-line no-undef
		var points = ymaps.geoQuery({
			type: 'FeatureCollection',
			features: arrays.map(function (el) {
				return getFeatureCollection(el);
			})
		});

		// Заполнение попапа
		function fillPopup(point) {
			$('.js-popup-name').text(point.name);

			var objInfo = point.info;
			var child = 1;

			Object.keys(objInfo).forEach(function (contacts) {
				$('.js-list-popup')
					.find('.map-list__item:nth-child(' + child + ') p')
					.text(objInfo[contacts]);
				child++;
			});
		}

		var lastId = null;

		function setOpt(thisId) {
			// Старая метка
			if (lastId) {
				points._objects[lastId].options.set({
					iconLayout: 'default#image',
					iconImageHref: 'img/ui-icon/pin.svg',
					iconImageSize: [54, 61],
					iconImageOffset: [-27, -30]
				});
			}

			// Новая метка
			Object.keys(points._objects).forEach(function (i) {
				if (points._objects[i].options._options.id === thisId) {
					lastId = i;
					points._objects[i].options.set({
						iconLayout: 'default#image',
						iconImageHref: 'img/ui-icon/pin-active.svg',
						iconImageSize: [54, 61],
						iconImageOffset: [-27, -30]
					});
				}
			});
		}

		// Клик по метке и вытаскивание инфы
		points.addEvents('click', function (e) {
			var targetPoint = e.get('target').properties._data;
			var targetId = e.get('target').options._options.id;
			fillPopup(targetPoint);
			if (!popupMap.hasClass('display')) {
				popupMap.switchPopup('open');
			}
			setOpt(targetId);
		});

		clusterer.add(points._objects);
		myMap.geoObjects.add(clusterer);
	}

	$.ajax({
		url: 'test.php',
		dataType: 'json',
		success: function (data) {
			initDataPoints(data.data);
		},
		error: function () {
			console.log('ошибка сервера');
		}
	});
}

ymaps.ready(init); // eslint-disable-line no-undef
