(function() {
    'use strict';

    angular.module('app').controller('MainController', MainController);

    MainController.$inject = ['$scope', 'esriLoader'];
    
    function MainController($scope, esriLoader) {
        var vm = $scope;
        vm.results = [];
        vm.pickLocation = pickLocation;
        vm.limitTo = 4;
        vm.clear = clear;
        vm.map;
        vm.view;
        vm.locationData = {
            name: '',
            description: '',
            latitude: '',
            longitude: ''
        };
        vm.templateData = {};
        initialize();

        function initialize() {
            vm.template = {
                Name: "",
                Description: ""
            };
            esriLoader.require(['esri/Map', "esri/views/SceneView", "esri/layers/GraphicsLayer", "esri/geometry/Point",
            "esri/symbols/SimpleMarkerSymbol", "esri/Graphic", "dojo/domReady!"], function (Map, SceneView, GraphicsLayer, Point, SimpleMarkerSymbol, Graphic) {
                vm.map = new Map({
                    basemap: 'streets'
                });
                vm.view = new SceneView({
                    container: "mapLoad",  // Reference to the DOM node that will contain the view
                    map: vm.map,
                    zoom: 5,  // Sets zoom level based on level of detail (LOD)
                    center: [-73.950, 40.702]  // Sets center point of view using longitude,latitude// References the map object created in step 3
                    
                });
            });

        }


        function pickLocation(location) {
            // Generate a DOM elment for Google Places Service
            var elem = document.createElement('div');
            elem.setAttribute('id', vm.ID);
            // Setup Google Places Service
            var googlePlacesService = new google.maps.places.PlacesService(elem);
            // Get details for the selected location
            googlePlacesService.getDetails({
                reference: location.reference
            }, function (place, status) {

                vm.locationData = {
                    name: location.terms[0].value,
                    description: location.description,
                    latitude: place.geometry.location.lat(),
                    longitude: place.geometry.location.lng()
                };
                vm.template = {
                    Name: vm.locationData.name,
                    Description: vm.locationData.description
                };

                esriLoader.require(["esri/Map",
          "esri/views/SceneView",
          "esri/symbols/SimpleMarkerSymbol",
          "esri/geometry/Point",
          "esri/Graphic", "esri/layers/GraphicsLayer",
          "dojo/domReady!"
                ], function (Map, SceneView, SimpleMarkerSymbol, Point, Graphic, GraphicsLayer) {
                    var graphicsLayer = new GraphicsLayer();
                    vm.map.add(graphicsLayer);

                    var point = new Point({
                        longitude: vm.locationData.longitude,
                        latitude: vm.locationData.latitude
                    });

                    var markerSymbol = new SimpleMarkerSymbol({
                        color: [226, 119, 40],

                        outline: { // autocasts as new SimpleLineSymbol()
                            color: [255, 255, 255],
                            width: 2
                        }
                    });

                    var pointGraphic = new Graphic({
                        geometry: point,
                        symbol: markerSymbol
                    });
                    graphicsLayer.add(pointGraphic);
                   
                });
            });
            
        }

        function clear() {
            // Clear query and results
                vm.results = [];
        }
    };
})();