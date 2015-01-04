angular.module('characterApp',['xc.indexedDB', 'ngRoute', 'ngAnimate'])
.constant('dbName', 'character')
.constant('storeName', 'character')
.constant('version', 1)
.constant('emptyCharacter', {
	guid:"",
	bio:{
		name:"",
		concept:"",
		history:{good:"",bad:""}, 
		profession:""
	},
	item:{
		items:[]
	},
	map:{
		position:{left:0,top:0}
	},
	skill:{
		skill_id:0,skills:[]
	},
	trait:{
		alignment:{x:0,y:0,r:0},
		attitude:{x:0,y:0,r:0},
		outlook:{x:0,y:0,r:0}
	}
})
.constant('sourceAnchors', [[ 0.05, 1, 0, 1 ],[ 0.27, 1, 0, 1 ],[ 0.5, 1, 0, 1 ],[ 0.73, 1, 0, 1 ],[ 0.95, 1, 0, 1 ]])
.constant('connectionAnchors', [[ 0.00, 0.75, 0, 0 ],[ 0.00, 0, 0, 0 ],[ 0.25, 0, 0, 0 ],[ 0.5, 0, 0, 0 ],[ 0.75, 0, 0, 0 ],[ 1, 0, 0, 0 ],[ 1, 0.75, 0, 0 ]])
.constant('plumbConfig', {
			endpointStyles : [{ fillStyle:"rgba(107, 164, 94, 1)" }, { fillStyle:"rgba(221, 221, 221, 1)" }],
			endpoints : [ ["Dot", { radius:1, enabled:false }], [ "Dot", { radius:6 } ] ],
			paintStyle : {strokeStyle:"rgba(107, 164, 94, 1)",lineWidth:3},
			container:"plumb"
		})
.value('jsPlumbInstance', {})
.config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {
		$routeProvider
		.when('/index.html', {
			template: '',
		})
		.when('/traits', {
			templateUrl: '/page/traits.html',
			controller: 'TraitController',
			controllerAs: 'traitController'
		})
		.when('/skills', {
			templateUrl: '/page/skills.html',
			controller: 'SkillController',
			controllerAs: 'skillController'
		})
		.when('/skills.debug', {
			templateUrl: '/page/skillsDebug.html',
			controller: 'SkillController',
			controllerAs: 'skillController'
		})
		.when('/bio', {
			templateUrl: '/page/bio.html',
			controller: 'BioController',
			controllerAs: 'bioController'
		})
		.when('/items', {
			templateUrl: '/page/items.html',
			controller: 'ItemController',
			controllerAs: 'itemController'
		})
		.when('/map', {
			templateUrl: '/page/map.html',
			controller: 'MapController',
			controllerAs: 'mapController'
		});

    $locationProvider.html5Mode(true);
}])
.config(function($indexedDBProvider, dbName, storeName, version) {
	$indexedDBProvider.connection(dbName)
	.upgradeDatabase(version, function(event, db, tx){
		db.createObjectStore(storeName, {keyPath: 'guid'});
	});
});