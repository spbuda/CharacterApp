jsPlumb.ready(function() {
	jsPlumb.setContainer($("#plumb"));
	var plumb = jsPlumb.getInstance();

	plumb.importDefaults({
	  Connector : [ "Bezier", { curviness: 150 } ],
	  Anchors : [ "TopCenter", "BottomCenter" ]
	});

	plumb.connect({
	  source:"#element1", 
	  target:"#element2", 
	  scope:"#plumb" 
	});
});