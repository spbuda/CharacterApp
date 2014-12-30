angular.module('characterApp').directive('ngPlumbArea', ['$rootScope', 'sourceAnchors', 'connectionAnchors', function(app, sourceAnchors, connectionAnchors) {
	function link (scope,element,attrs) {
		app.jsPlumbInstance = window.instance = jsPlumb.getInstance({
			Anchors : [ sourceAnchors, connectionAnchors ],
			EndpointStyles : [{ fillStyle:"rgba(107, 164, 94, 1)" }, { fillStyle:"rgba(221, 221, 221, 1)" }],
			Endpoints : [ ["Dot", { radius:1, enabled:false }], [ "Dot", { radius:6 } ] ],
			PaintStyle : {strokeStyle:"rgba(107, 164, 94, 1)",lineWidth:3},
			Container:"plumb"
		});

		jsPlumb.fire("jsPlumbInitialized", app.jsPlumbInstance);
	}
	return {
		link:link
	};
}]);