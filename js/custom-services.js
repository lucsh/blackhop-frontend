    angular
    .module('inspinia')

    // principal is a service that tracks the user's identity.
    // calling identity() returns a promise while it does what you need it to do
    // to look up the signed-in user's identity info. for example, it could make an
    // HTTP request to a rest endpoint which returns the user's name, roles, etc.
    // after validating an auth token in a cookie. it will only do this identity lookup
    // once, when the application first runs. you can force re-request it by calling identity(true)
    // .factory('principal', ['$q', '$http', '$timeout', '$state',
    //   function($q, $http, $timeout, $state) {
    //     var _identity = undefined,
    //       _authenticated = false;
    //
    //     return {
    //
    //       /*
    //       1)
    //       Esta es la primera funcion que se llama desde run
    //       y basicamente chequea que la variable _identity se haya inicializado
    //       ya que cuando se crea, esta comienza como undefined
    //       Al hacer esto llamo al metodo _identity
    //       */
    //       isIdentityResolved: function() {
    //         return angular.isDefined(_identity);
    //       },
    //       isAuthenticated: function() {
    //         return _authenticated;
    //       },
    //       isInRole: function(role) {
    //         if (!_authenticated || !_identity.roles) return false;
    //
    //         return _identity.roles.indexOf(role) != -1;
    //       },
    //       isInAnyRole: function(roles) {
    //         if (!_authenticated || !_identity.roles) return false;
    //
    //         for (var i = 0; i < roles.length; i++) {
    //           if (this.isInRole(roles[i])) return true;
    //         }
    //
    //         return false;
    //       },
    //       authenticate: function(identity) {
    //         _identity = identity;
    //         _authenticated = identity != null;
    //
    //         // for this demo, we'll store the identity in localStorage. For you, it could be a cookie, sessionStorage, whatever
    //         if (identity) localStorage.setItem("demo.identity", angular.toJson(identity));
    //         else localStorage.removeItem("demo.identity");
    //       },
    //
    //       irAHome: function(role) {
    //         switch(role){
    //              case 'Admin':
    //                  $state.go('dashboards.dashboard_3');
    //                  break;
    //
    //              case 'Root':
    //                  $state.go('dashboards.dashboard_2');
    //                  break;
    //          }
    //       },
    //
    //       /*
    //       2)
    //       Aca lo que se hace es ver la identidad, si esta loggueado
    //       El error que habia encontrado es que no volvia a validar con el Servidor
    //       ya que en el ejemplo validaba contra el localStorage
    //       */
    //       identity: function(force) {
    //
    //           console.log('identity');
    //
    //         var deferred = $q.defer();
    //
    //         if (force === true) _identity = undefined;
    //
    //         // check and see if we have retrieved the identity data from the server. if we have, reuse it by immediately resolving
    //         if (angular.isDefined(_identity)) {
    //           deferred.resolve(_identity);
    //
    //           return deferred.promise;
    //         }
    //
    //
    //         /*
    //         DESCOMENTAR ESTO PARA HACERLO ANDAR
    //         YA QUE ESTO CHEQUEA SOBRE EL LOCALSTORAGE
    //         */
    //         // otherwise, retrieve the identity data from the server, update the identity object, and then resolve.
    //        $http.get('/svc/account/identity', { ignoreErrors: true })
    //             .success(function(data) {
    //                 _identity = data;
    //                 _authenticated = true;
    //                 deferred.resolve(_identity);
    //             })
    //             .error(function () {
    //                 _identity = null;
    //                 _authenticated = false;
    //                 deferred.resolve(_identity);
    //             });
    //
    //         // for the sake of the demo, we'll attempt to read the identity from localStorage. the example above might be a way if you use cookies or need to retrieve the latest identity from an api
    //         // i put it in a timeout to illustrate deferred resolution
    //         //var self = this;
    //         //$timeout(function() {
    //         //  _identity = angular.fromJson(localStorage.getItem("demo.identity"));
    //         //  console.log(_identity);
    //         //  self.authenticate(_identity);
    //         //  deferred.resolve(_identity);
    //         //}, 1000);
    //
    //         return deferred.promise;
    //       }
    //     };
    //   }
    // ])
    // // authorization service's purpose is to wrap up authorize functionality
    // // it basically just checks to see if the principal is authenticated and checks the root state
    // // to see if there is a state that needs to be authorized. if so, it does a role check.
    // // this is used by the state resolver to make sure when you refresh, hard navigate, or drop onto a
    // // route, the app resolves your identity before it does an authorize check. after that,
    // // authorize is called from $stateChangeStart to make sure the principal is allowed to change to
    // // the desired state
    // /*
    // Este servicio se llama desde el root de los dashboards para ver el role
    // que esta almacenado
    // */
    .factory('authorization', ['$rootScope', '$state',
        function($rootScope, $state) {
              return {
            //  authorize: function() {
            //   console.log("authorizaction.autorize");
            //   return principal.identity()
            //     .then(function() {
            //       var isAuthenticated = principal.isAuthenticated();
            //       console.log('Authorize');
            //       //console.log($rootScope.toState.data.roles);
            //       //if ($rootScope.toState.data.roles && $rootScope.toState.data.roles.length > 0 && !principal.isInAnyRole($rootScope.toState.data.roles)) {
            //         if (isAuthenticated){
            //             console.log($rootScope.currentRole);
            //             //$state.go('login');
            //              switch($rootScope.currentRole){
            //                   case 'Admin':
            //                       $state.go('dashboards.dashboard_3');
            //                       break;
            //
            //                   case 'Root':
            //                       $state.go('dashboards.dashboard_2');
            //                       break;
            //               }// user is signed in but not authorized for desired state
            //         }
            //         else {
            //           // user is not authenticated. stow the state they wanted before you
            //           // send them to the signin state, so you can return them when you're done
            //           //$rootScope.returnToState = $rootScope.toState;
            //           //$rootScope.returnToStateParams = $rootScope.toStateParams;
            //
            //           // now, send them to the signin state so they can log in
            //           $state.go('login');
            //         }
            //       //}
            //     });
            // },
                validar: function($roles) {
                    $autenticado = false;
                    $roles.forEach(function (role) {
                        console.log(role + " " + $rootScope.currentRole);
                        if(role == $rootScope.currentRole){
                            $autenticado = true;
                        }
                    })
                    console.log($autenticado);
                    if(!$autenticado){
                        console.log("asd");
                        $state.go('login');

                    }

                }
            };
        }
    ])
    .run(['$rootScope', '$state', '$stateParams', 'authorization','$auth','$http',
        function($rootScope, $state, $stateParams, authorization, $auth, $http) {
          console.log($rootScope);
      /*
      El StateChangeStart es para cuando se producen cambios de estado
      De esta forma puedo guardar el estado que la persona queria acceder
      llevarlo al login, para luego dejarlo en donde queria acceder, si es que tiene privilegio
      */
      $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
          $rootScope.toState = toState;
          $rootScope.toStateParams = toStateParams;
          /*
          if (principal.isIdentityResolved()){
             authorization.authorize();
            }
            */
     });

      console.log($state);
      var a = $rootScope;
      //console.log(authorization.getRole());
      console.log($rootScope.currentRole);

      

      $rootScope.$on('$stateChangeStart',
          function (event, next){
            console.log("routeChangeStart");
            console.log(next);


        /*
        * En Login no necesito hacer estas validaciones
        */
        if(next.url != "/login"){

            /*
            * Chequeo si el Token es valido, en caso de que no limpio el Local Storage
            */
            $http.get('http://blackhop-dessin1.rhcloud.com/api/v1/authenticate/userservice').success(function(response){       
                console.log('########################');
                console.log(response.usuarioName);
                console.log(response.usuarioRole);
                console.log(response.modo);
                console.log(response.mensaje);
                console.log('########################');

                var resUser = response.usuarioName;
                var resRole = response.usuarioRole;
                var resModo = response.modo;
                var resMensaje = response.mensaje;

                console.log(next);

                
                console.log(localStorage);

                console.log('next.data.autorized');
                console.log(next.data.autorized);
                console.log('localStorage.role');
                console.log(localStorage.role);

                if(next.data.autorized.indexOf(localStorage.role) !== -1){
                    console.log("Encontre el rol en el autorized");
                    
                }else{
                    if(localStorage.role != 'Admin'){
                        if(resMensaje == 'openSesion'){
                            if(resModo == 'barra'){
                                console.log("ASD");
                                $state.go('pos.point_of_sale_barra');
                            }else if(resModo == 'caja'){
                                $state.go('pos.point_of_sale');
                            }
                        }else{
                            event.preventDefault();
                            $state.go('auth');
                        }
                    }else{
                        $state.go('dashboards.dashboard_5');
                        //if(next.url == '/point_of_sale' && resMensaje == 'openSesion' && resModo == 'caja'){
                            //go :D
                        //}else{
                        //    if(next.url == '/point_of_sale_barra' && resMensaje == 'openSesion' && resModo == 'barra'){
                        //        //go :D
                        //    }else{
                        //        $state.go('dashboards.dashboard_5');
                        //    }
                        //}
                    }
                    //if(localStorage.role != 'Admin'){
                    //    event.preventDefault();
                    //    $state.go('auth');
                    //}
                }
            })
            .error(function(err){
                console.log('ERROR DEL VERIFICAR TOKEN');
                localStorage.removeItem('user');
                localStorage.removeItem('role');
                event.preventDefault();
                $state.go('auth');
            });

        
          

            
        }else{

            $http.get('http://blackhop-dessin1.rhcloud.com/api/v1/authenticate/userservice').success(function(response){       

                var resUser = response.usuarioName;
                var resRole = response.usuarioRole;
                var resModo = response.modo;
                var resMensaje = response.mensaje;

                if(localStorage.role != 'Admin'){
                    if(resMensaje == 'openSesion'){
                        if(resModo == 'barra'){
                            $state.go('pos.point_of_sale_barra');
                        }else if(resModo == 'caja'){
                            $state.go('pos.point_of_sale');
                        }
                    }else{
                        event.preventDefault();
                        $state.go('auth');
                    }
                }
            })
            .error(function(err){
                console.log('ERROR DEL VERIFICAR TOKEN');
                localStorage.removeItem('user');
                localStorage.removeItem('role');
                event.preventDefault();
                $state.go('auth');
            });




            
        }
});

    $rootScope.logout = function() {
        $auth.logout().then(function() {
            localStorage.removeItem('user');
            localStorage.removeItem('role');
            $rootScope.currentUser = null;
            $state.go('login');
        });
    };
}


]);
