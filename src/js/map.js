'use strict';

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

		// Клик по метке и вытаскивание инфы
		points.addEvents('click', function (e) {
			var targetPoint = e.get('target').properties._data;
			fillPopup(targetPoint);
			if (!popupMap.hasClass('display')) {
				popupMap.switchPopup('open');
			}
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
