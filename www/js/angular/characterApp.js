angular.module('bioApp', []);
angular.module('itemApp', []);
angular.module('mapApp', []);
angular.module('skillApp', []);
angular.module('traitApp', []);

angular.module('characterApp',['bioApp','itemApp','mapApp','skillApp','traitApp']);