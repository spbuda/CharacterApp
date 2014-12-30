angular.module('characterApp').directive('ngPlumbArea', ['$rootScope', 'sourceAnchors', 'connectionAnchors', 'plumbConfig', function(app, sourceAnchors, connectionAnchors, opts) {
	function link (scope,element,attrs) {
		app.jsPlumbInstance = window.instance = jsPlumb.getInstance({
			Anchors : [ sourceAnchors, connectionAnchors ],
			EndpointStyles : opts.endpointStyles,
			Endpoints : opts.endpoints,
			PaintStyle : opts.paintStyle,
			Container: opts.container
		});

		jsPlumb.fire("jsPlumbInitialized", app.jsPlumbInstance);
	}
	return {
		link:link
	};
}]);