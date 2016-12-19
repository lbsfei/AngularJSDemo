angular.module('myApp', []).
  controller('Characters', function($scope) {//父作用域开始
    $scope.names = ['Frodo', 'Aragorn', 'Legolas', 'Gimli'];
    $scope.currentName = $scope.names[0];
    //changeName是ng-click点击的事件处理方法---第一步 通过此函数改变currentName的值，然后广播一个CharacterChanged事件。
    $scope.changeName = function() {
      $scope.currentName = this.name;
      /**
      **  利用$broadcast方法把一个事件广播给下方的子作用域层次。
      ** 任何已注册该事件的后代作用域都会收到通知。
      ** $broadcast方法使用下面的语法，其中name是事件名称，而args是传递给事件处理的函数的零个或多个参数：
      ** scope.$broadcast(name,[args,...])
      **/
      $scope.$broadcast('CharacterChanged', this.name);//将当前的name作为参数进行传递出去

    };
    /**要处理发出或广播的事件，你可以使用$on方法。$on方法使用下面的语法，其中name是要监听的事件名称：
    ** scope.$on(name,listener)
    ** listener参数是一个函数，它可以接受事件作为第一个参数，并把由$emit或$broadcast方法传递的任何参数
    **作为后续的参数。event对象具有以下属性。
    ** 1.targetScope:$emit()或$broadcast()被调用时所在的作用域
    ** 2.currentScope:当前正在处理该事件的作用域
    ** 3.name:事件名称
    ** 4.stopPropagation():停止在作用域层次结构中向上或向下传播事件的函数
    ** 5.preventDefault():防止在浏览器的事件中默认行为，而只执行自已的自定义代码的函数
    ** 6.defaultPrevented:一个布尔值，如果event.preventDefault()被调用，则为true.
    ***/
    $scope.$on('CharacterDeleted', function(event, removeName){//第四步，实现处理CharacterDeleted广播的事件
      //alert(removeName);//调试，removeName是$emit发出一个事件的参数。
      var i = $scope.names.indexOf(removeName);//查其在数组中的索引位置
      // alert(i);
      $scope.names.splice(i, 1);//从数组中删除
      $scope.currentName = $scope.names[0];//重新将数组中的第一个元素赋值给当前的currentName

      $scope.$broadcast('CharacterChanged', $scope.currentName);//第五步，然后再广播出去---依照这样循环下去，直止删除完所有的数组项。
    });
  }).//父作用域结束

  controller('Character', function($scope) {//子作用域开始
    $scope.info = {'Frodo':{weapon:'Sting', race:'Hobbit'},
                   'Aragorn':{weapon:'Sword', race:'Man'},
                   'Legolas':{weapon:'Bow', race:'Elf'},
                   'Gimli':{weapon:'Axe', race:'Dwarf'}};
    $scope.currentInfo = $scope.info['Frodo']; 

    //第二步：处理CharacterChanged广播的事件，newCharacter这个参数就是第一步广播传过来的参数name
    $scope.$on('CharacterChanged', function(event, newCharacter){
      $scope.currentInfo = $scope.info[newCharacter];//根据name而改变相应的info数组的索引对应的值
    }); 

    //第三步：
    $scope.deleteChar = function() {
      delete $scope.info[$scope.currentName];
      /**从作用域中发出一个事件，使用$emit()方法,该方法沿着父作用域层次向上发送一个事件。
      ** 任何已注册该事件的祖先作用域都会收到通知。$emit方法使用下面的语法，其中Name是事件名称，
      ** 而args是传递给事件函数的零个或多个参数：
      ** scope.$emit(name,[args,...])
      **/

      // alert($scope.currentName);//调试代码
      $scope.$emit('CharacterDeleted', $scope.currentName);
    };//子作用域结束


  });