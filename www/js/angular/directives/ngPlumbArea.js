angular.module('characterApp').directive('ngPlumbArea', ['$rootScope', function(app) {
	function link (scope,element,attrs) {
		// list of possible anchor locations for the blue source element
		var sourceAnchors = [[ 0.05, 1, 0, 1 ],[ 0.27, 1, 0, 1 ],[ 0.5, 1, 0, 1 ],[ 0.73, 1, 0, 1 ],[ 0.95, 1, 0, 1 ]];
		var connectionAnchors = [[ 0.00, 0.75, 0, 0 ],[ 0.00, 0, 0, 0 ],[ 0.25, 0, 0, 0 ],[ 0.5, 0, 0, 0 ],[ 0.75, 0, 0, 0 ],[ 1, 0, 0, 0 ],[ 1, 0.75, 0, 0 ]];
		
		app.jsPlumbInstance = window.instance = jsPlumb.getInstance({
			Anchors : [ sourceAnchors, connectionAnchors ],
			EndpointStyles : [{ fillStyle:"rgba(107, 164, 94, 1)" }, { fillStyle:"rgba(221, 221, 221, 1)" }],
			Endpoints : [ ["Dot", { radius:6 } ], [ "Dot", { radius:6 } ] ],
			PaintStyle : {strokeStyle:"rgba(107, 164, 94, 1)",lineWidth:3},
			Container:"plumb"
		});

		jsPlumb.fire("jsPlumbInitialized", app.jsPlumbInstance);
	}
	return {
		link:link
	};
}]);