geo-trouvetou
=============

A simple Javascript/Node library to find the closest point of my current location given a set of point.

How to use it
=============
See example app attached for a real example

	var geo = require("geotrouvetou")

	var tree = new geo.GeoTrouvetou();

	tree.addPoint(new geo.GeoPoint(45.508670,-73.553993));

	tree.findClosest(new geo.GeoPoint(40.714353,-74.005973));

Installation
============

	npm install geotrouvetou

feel free to send me a pull request and to share this project