angular.module('characterApp').directive('ngHold', function ($interval) {
	function setup(scope, element, attrs) {
		element.addClass('time');

		var promise;
		var increment = 0;

		scope.mouseDown = function() {
			var delay;
			if(increment < 2){
				delay = 200;
			}
			else{
				delay = 100;
			}
			promise = $interval(function () {
				increment ++;
			}, delay);
		};

		scope.mouseUp = function () {
			increment = 0;
			$interval.cancel(promise);
		};
	};
		
	return {
		link: setup
	};
});