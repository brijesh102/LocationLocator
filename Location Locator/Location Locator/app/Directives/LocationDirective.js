(function() {
    'use strict';

    angular.module('app.directives').directive('locationLocator', [
        function() {
            var directive = {
                restrict: 'E',
                templateUrl: 'Views/locator/locationLocator.html',
                scope: {
                    results: '='
                },
                link: link
            };
            return directive;


            function link(scope, iElement, iAttrs) {
                // Setup Google Auto-complete Service
                var googleMapsService = new google.maps.places.AutocompleteService();
                var el = angular.element(iElement.find('input'));

                // Fetch predictions based on query
                var fetch = function (query) {
                    googleMapsService.getPlacePredictions({
                        input: query
                    }, fetchCallback);
                };

                // Display predictions to the user
                var fetchCallback = function (predictions, status) {

                    if (status !== google.maps.places.PlacesServiceStatus.OK) {

                        scope.$apply(function () {
                            scope.results = [];
                        })

                        return;

                    } else {

                        scope.$apply(function () {
                            scope.results = predictions;
                        })
                    }
                };


                // Refresh on every edit
                el.on('input', function () {
                    var query = el.val();

                    if (query && query.length >= 3) {

                        fetch(query);

                    } else {

                        scope.$apply(function () {
                            scope.results = [];
                        });
                    }
                });

            }

        }
    ]);
})();