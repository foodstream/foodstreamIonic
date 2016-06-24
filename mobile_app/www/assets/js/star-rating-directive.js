//based on directive found at http://jsfiddle.net/2fahpk7s/

foodStream.directive('starRating', function () {
    return {
        scope: {
            rating: '=',
            maxRating: '@',
            readOnly: '@',
            click: "&"
        },
        restrict: 'EA',
        template:
            "<div style='display: inline-block; margin: 0px; padding: 8px; cursor:pointer;' ng-repeat='idx in maxRatings track by $index'> \
                    <i class=\" {{((rating) <= $index) && 'fa fa-star-o' || 'fa fa-star'}}\" \
                    ng-Click='isolatedClick($index + 1)' \
            </div>",
        compile: function (element, attrs) {
            if (!attrs.maxRating || (Number(attrs.maxRating) <= 0)) {
                attrs.maxRating = '5';
            };
        },
        controller: function ($scope, $element, $attrs) {
            $scope.maxRatings = [];

            for (var i = 1; i <= $scope.maxRating; i++) {
                $scope.maxRatings.push({});
            };



			$scope.isolatedClick = function (param) {
				if ($scope.readOnly == 'true') return;

				$scope.rating  = param;
				$scope.click({
					param: param
				});
			};

        }
    };
});
