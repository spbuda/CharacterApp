$(document).ready(function(){
	$(".nodeEdit").bind("click",function(){
		var nodeText = $(this).closest(".node").find(".nodeText");
		$("#editNodeTextModal").modal({overlayClose:true, onClose:function(){
			$(nodeText).html($("#editNodeTextModal textarea").val());
			$.modal.close();
		}, onShow:function(){
			$("#editNodeTextModal textarea").val($(nodeText).html());
			$.modal();
		}});
	});
	
	$(".nodeNumber").bind("click",function(){
		var nodeNumber = $(this).closest(".node").find(".nodeNumber");
		$("#editNodeNumberModal").modal({overlayClose:true, onClose:function(){
			var str = $("#editNodeNumberModal input").val().replace(/\D+/g, "<br/>").replace(/^(<br\/>)|(<br\/>)$/g, "");
			$(nodeNumber).html(str);
			$.modal.close();
		}, onShow:function(){
			var str = $(nodeNumber).html().replace(/\D*/g, ", ").replace(/^(, )|(, )$/g, "");
			$("#editNodeNumberModal input").val(str);
		}});
	});
});

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
    
    var instance = window.instance = jsPlumb.getInstance({
    	// set default anchors.  the 'connect' calls below will pick these up, and in fact setting these means
    	// that you also do not need to supply anchor definitions to the makeSource or makeTarget functions. 
        Anchors : [ sourceAnchors, connectionAnchors ],
    	// drag options
    	DragOptions : { cursor: "pointer", zIndex:2000 },
		// default to blue at source and green at target
		EndpointStyles : [{ fillStyle:"#555" }, { fillStyle:"#555" }],
		// blue endpoints 7 px; green endpoints 11.
		Endpoints : [ ["Dot", { radius:6 } ], [ "Dot", { radius:6 } ] ],
		// default to a gradient stroke from blue to green.  for IE provide all green fallback.
		PaintStyle : {
        	strokeStyle:"#555",
        	lineWidth:3
    	},
    	Container:"plumb"
    });

	// click listener for the enable/disable link.
    /* jsPlumb.on(document.getElementById("enableDisableSource"), "click", function(e) {
		var state = instance.toggleSourceEnabled("sourceWindow1");
		this.innerHTML = (state ? "disable" : "enable");
		jsPlumbUtil.consume(e);
	}); */

    // bind to a connection event, just for the purposes of pointing out that it can be done.
	instance.bind("connection", function(i,c) { 
		if (typeof console !== "undefined")
			console.log("connection", i.connection); 
	});

	// make them draggable
	instance.draggable($(".node"));

    // suspend drawing and initialise.
    instance.doWhileSuspended(function() {

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

        // and finally connect a couple of small windows, just so its obvious what's going on when this demo loads.           
        /* instance.connect({ source:"element1", target:"element2" }); */
	});

	jsPlumb.fire("jsPlumbDemoLoaded", instance);
});