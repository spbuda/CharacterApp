angular.module('bioApp', []);
angular.module('itemApp', []);
angular.module('mapApp', []);
angular.module('skillApp', []);
angular.module('traitApp', []);

var instance;
jsPlumb.ready(function() {
// list of possible anchor locations for the blue source element
	var sourceAnchors = [
		[ 0.05, 1, 0, 1 ],
		[ 0.27, 1, 0, 1 ],
		[ 0.5, 1, 0, 1 ],
		[ 0.73, 1, 0, 1 ],
		[ 0.95, 1, 0, 1 ]				
	];
	
	var connectionAnchors = [
		[ 0.00, 0.75, 0, 0 ],
		[ 0.00, 0, 0, 0 ],
		[ 0.25, 0, 0, 0 ],
		[ 0.5, 0, 0, 0 ],
		[ 0.75, 0, 0, 0 ],
		[ 1, 0, 0, 0 ],
		[ 1, 0.75, 0, 0 ]			
	];
    
    instance = window.instance = jsPlumb.getInstance({
    	// set default anchors.  the 'connect' calls below will pick these up, and in fact setting these means
    	// that you also do not need to supply anchor definitions to the makeSource or makeTarget functions. 
        Anchors : [ sourceAnchors, connectionAnchors ],
    	// drag options
    	DragOptions : { cursor: "pointer", zIndex:2000 },
		EndpointStyles : [{ fillStyle:"rgba(107, 164, 94, 1)" }, { fillStyle:"rgba(221, 221, 221, 1)" }],
		Endpoints : [ ["Dot", { radius:6 } ], [ "Dot", { radius:6 } ] ],
		PaintStyle : {
        	strokeStyle:"rgba(107, 164, 94, 1)",
        	lineWidth:3
    	},
    	Container:"plumb"
    });

    // bind to a connection event, just for the purposes of pointing out that it can be done.
	instance.bind("connection", function(i,c) { 
		if (typeof console !== "undefined")
			console.log("connection", i.connection); 
	});

/* 	// make them draggable
	instance.draggable($(".node")); */

    // suspend drawing and initialise.
/*     instance.doWhileSuspended(function() {

        // make 'window1' a connection source. notice the filter parameter: it tells jsPlumb to ignore drags
		// that started on the 'enable/disable' link on the blue window.
		instance.makeSource($(".nodeCreate"), {
			//anchor:sourceAnchors,		// you could supply this if you want, but it was set in the defaults above.							
			filter:function(evt, el) {
				var t = evt.target || evt.srcElement;
				return t.tagName !== "A";
			},
			isSource:true,
            maxConnections:-1
		});			
        
		// configure the .nodeText as targets.
		instance.makeTarget($(".nodeText"), {
			//anchor:"TopCenter",				// you could supply this if you want, but it was set in the defaults above.					
			dropOptions:{ hoverClass:"hover" },
            uniqueEndpoint:false
		});	
	}); */

	jsPlumb.fire("jsPlumbInitialized", instance);
});

angular.module('characterApp',['bioApp','itemApp','mapApp','skillApp','traitApp'])
.directive('ngPlumb', function() {
	function link (scope,element,attrs) {
		var node = $(element)[0];

		// bind to a connection event, just for the purposes of pointing out that it can be done.
		instance.bind("connection", function(i,c) { 
			if (typeof console !== "undefined")
				console.log("connection", i.connection); 
		});
		
		var outOfBounds = function(){
			var that = this;
			setTimeout(function(){
				instance.repaintEverything();
			},800);
			if($(this).position().top < $("#mainBanner").height())
				return true;
			else if($(this).position().left < $("#plumb").offset().left)
				return true;
			else
				return false;
				
			
		}

		// make them draggable
		instance.draggable($(node), {revert:outOfBounds, drag:instance.repaintEverything});

		// suspend drawing and initialise.
		instance.doWhileSuspended(function() {

			instance.makeSource($(node).find(".nodeCreate"), {
				//anchor:sourceAnchors,		// you could supply this if you want, but it was set in the defaults above.							
				filter:function(evt, el) {
					var t = evt.target || evt.srcElement;
					return t.tagName !== "A";
				},
				isSource:true,
				maxConnections:-1
			});			
			
			// configure the .nodeText as targets.
			instance.makeTarget($(node).find(".nodeText"), {
				//anchor:"TopCenter",				// you could supply this if you want, but it was set in the defaults above.					
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