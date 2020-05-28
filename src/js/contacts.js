'use strict';

// eslint-disable-next-line no-undef
ymaps.ready(function () {
	// eslint-disable-next-line no-undef
	var myMap = new ymaps.Map(
		'map-contacts',
		{
			center: [55.7536, 37.621218],
			zoom: 12
		},
		{
			searchControlProvider: 'yandex#search'
		}
	);

	// eslint-disable-next-line no-undef
	var myPlacemark = new ymaps.Placemark(
		myMap.getCenter(),
		{
			hintContent: ''
		},
		{
			iconLayout: 'default#image',
			iconImageHref: 'img/ui-icon/pin.svg',
			size: [54, 61],
			offset: [-27, -30]
		}
	);

	myMap.panes.get('ground').getElement().style.filter =
		'grayscale(100%) invert(5%)';
	myMap.geoObjects.add(myPlacemark);
});
