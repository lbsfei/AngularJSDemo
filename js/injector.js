//模块一
var myMod = angular.module('myMod',[]);
//定义变量modMsg的值
myMod.value('modMsg','Hello from My module');
//将modMsg作为参数注入到控制器msg中
myMod.controller('controllerB',['$scope','modMsg',function($scope,msg){
	$scope.message = msg;
}]);


//模块二 将依赖模块myMod引入
var myApp = angular.module('myApp',['myMod']);
myApp.value('appMsg','Hello from My App');
myApp.controller('controllerA',['$scope','appMsg',function($scope,msg){
	$scope.message = msg;
}]);
