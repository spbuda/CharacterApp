angular.module('bioApp', []);
angular.module('itemApp', []);
angular.module('mapApp', []);
angular.module('skillApp', []);
angular.module('traitApp', []);

angular.module('characterApp',['bioApp','itemApp','mapApp','skillApp','traitApp'])
.directive('ngPlumb', function() {
	var instance;
	jsPlumb.ready(function() {
		// list of possible anchor locations for the blue source element
		var sourceAnchors = [[ 0.05, 1, 0, 1 ],[ 0.27, 1, 0, 1 ],[ 0.5, 1, 0, 1 ],[ 0.73, 1, 0, 1 ],[ 0.95, 1, 0, 1 ]];
		var connectionAnchors = [[ 0.00, 0.75, 0, 0 ],[ 0.00, 0, 0, 0 ],[ 0.25, 0, 0, 0 ],[ 0.5, 0, 0, 0 ],[ 0.75, 0, 0, 0 ],[ 1, 0, 0, 0 ],[ 1, 0.75, 0, 0 ]];
		
		instance = window.instance = jsPlumb.getInstance({
			Anchors : [ sourceAnchors, connectionAnchors ],
			/* DragOptions : { cursor: "pointer", zIndex:2000 }, */
			EndpointStyles : [{ fillStyle:"rgba(107, 164, 94, 1)" }, { fillStyle:"rgba(221, 221, 221, 1)" }],
			Endpoints : [ ["Dot", { radius:6 } ], [ "Dot", { radius:6 } ] ],
			PaintStyle : {strokeStyle:"rgba(107, 164, 94, 1)",lineWidth:3},
			Container:"plumb"
		});

		jsPlumb.fire("jsPlumbInitialized", instance);
	});

	function link (scope,element,attrs) {
		var node = $(element)[0];
		
		instance.bind("connection", function(i,c) { 
			node
		});
		
		var outOfBounds = function(){
			if($(this).position().top < $("#mainBanner").height())
				return true;
			else if($(this).position().left < $("#plumb").offset().left)
				return true;
			else
				return false;
		}

		// make them draggable
		instance.draggable($(node), {revert:outOfBounds, drag:instance.repaintEverything, stop: instance.repaintEverything});

		// suspend drawing and initialise.
		instance.doWhileSuspended(function() {

			instance.makeSource($(node).find(".nodeCreate"), {					
				filter:function(evt, el) {
					var t = evt.target || evt.srcElement;
					return t.tagName !== "A";
				},
				isSource:true,
				maxConnections:-1
			});			
			
			instance.makeTarget($(node).find(".nodeText"), {				
				dropOptions:{ hoverClass:"hover" },
				uniqueEndpoint:false
			});
		});

		jsPlumb.fire("nodeCreated", instance);
	}
	
	return {
		link:link
	};
});