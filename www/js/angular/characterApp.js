angular.module('bioApp', []);
angular.module('itemApp', []);
angular.module('mapApp', []);
angular.module('skillApp', []);
angular.module('traitApp', []);

angular.module('characterApp',['bioApp','itemApp','mapApp','skillApp','traitApp'])
.directive('ngPlumb', function() {
	function link (scope,element,attrs) {
		var node = element;

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
		instance.draggable($(node), {revert:outOfBounds});

		// suspend drawing and initialise.
		instance.doWhileSuspended(function() {

			// make 'window1' a connection source. notice the filter parameter: it tells jsPlumb to ignore drags
			// that started on the 'enable/disable' link on the blue window.
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
})
.factory('plumbService', [function() {
	var factory = {};
	factory.removeElement = function(){
		var el = this;
		$(el).remove();
		disableDelete();
	}
	
	function disableDelete(){
		$(".node, #deleteNode").removeClass("delete");
		$(".nodeEdit i").removeClass("fa-trash");
		$("#addNode").show();
	};

	function enableDelete(){
		$(".node, #deleteNode").addClass("delete");
		$(".nodeEdit i").addClass("fa-trash");
		$("#addNode").hide();
	};

	factory.toggleDelete = function(){
		if($("#deleteNode").hasClass("delete"))
			disableDelete();
		else
			enableDelete();
	}
	
	function numbersToHtmlStr(arr){
		var str = "";
		for(var i=0;i<arr.length;i++){
			str+=arr[i] + "<br>";
		}
		str.replace(/^(<br>)$/g, "");
	}
	
	factory.getElements = function(){
	
	}
	
	factory.getConnections = function(){
	
	}
	
	factory.isElementConnected = function(){
	
	}
	
	return factory;
	
}]);