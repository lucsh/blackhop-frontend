angular
.module('inspinia')


.controller('AuthCtrl', ['$auth', '$state', '$http', '$rootScope','SweetAlert', function($auth, $state, $http, $rootScope,SweetAlert) {


    var vm = this;
    vm.ubicacion={};

    $http.get('http://blackhop-dessin1.rhcloud.com/api/info/ubicacion').success(function(ubicaciones){    
        console.log(ubicaciones);
        vm.ubicaciones = ubicaciones.data;
    }).error(function(error){
        console.log(error);
    });

vm.saLoggout = function(id,nombre){ 

    SweetAlert.swal({
        title: "¿Estas Seguro?",
        text: "¡"+nombre+" no va a poder seguir operando!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Si, cerra la cuenta!",
        cancelButtonText: "No, cancelar!",
        closeOnConfirm: false,
        closeOnCancel: false },
        function (isConfirm) {
            if (isConfirm) {

                $http.get('http://blackhop-dessin1.rhcloud.com/api/v1/authenticate/full?sesion='+id).success(function(response){       
                    SweetAlert.swal("¡Hecho!", "La cuenta de "+ nombre + " fue cerrada", "success");
                    vm.login();
                })
                .error(function(){
                    SweetAlert.swal("¡Hecho!", "La cuenta de "+ nombre + " NO fue cerrada", "error");
                    $state.reload();    
                });
                
                    //HACER POST PARA DESLOGUEAR UNA SESION E INICIAR SESION

                    
                } else {
                    SweetAlert.swal("Cancelado", "Todo sigue como antes", "error");
                    console.log('GO TO AUTH');
                    $state.reload();    
                }
            });
};



vm.loginError = false;
vm.loginErrorText;


vm.full = false;
console.log('vm.full = ' + vm.full);

vm.valorInicial = 0;

vm.login = function(){
     /*
    * VALIDACIONES AGREGAR CAMPOS EN LA VISTA A MOSTRAR DESDE ACA!
    */
    if(vm.modo == undefined || vm.ubicacion.selected == undefined){
        $state.go('auth');
        console.log('########## ERROR ############');
        console.log('      Modo No seteado ');
        console.log('#############################');
    }else{
        if(vm.modo == 'caja'){
            SweetAlert.swal({
                title: "Bienvenido!",
                text: "Monto inicial en Caja:",
                type: "input",
                showCancelButton: true,
                closeOnConfirm: false,
                animation: "slide-from-top",
                inputPlaceholder: "Monto Inicial"
            },
            function(inputValue){
                if (inputValue === false){
                    console.log("CANCEL");
                    $state.reload(); 
                    return false;
                } 

                if (inputValue === "") {
                    swal.showInputError("Debes ingresar el monto incial en Caja!");
                    return false
                }
                swal("Nice!", "You wrote: " + inputValue, "success");
                vm.valorInicial = inputValue;
                vm.login2();
            });
        }else{
            //ESTO ES POR LO ASYNCRONO
            vm.login2();
        }
    }
}


vm.login2 = function() {

    console.log(vm.ubicacion.selected)

                //Crea el objeto credentials desde el form Login
                var credentials = {
                    email: vm.name,
                    password: vm.password
                }

                //Funcion de Satellizer para generar el token
                $auth.login(credentials).then(function() {

                    //Hace un get con el Token ya seteado para retornar el nombre del usuario, el rol y crear la sesion en
                    // caso de requerirlo (NO ADMIN)
                    $http.get('http://blackhop-dessin1.rhcloud.com/api/v1/authenticate/user', {
                        params: {
                            modo:vm.modo,
                            ubicacion: vm.ubicacion.selected.id,
                            valorInicial: vm.valorInicial
                        }
                    }).success(function(response){       


                        if(response.modo != 'limite'){
                            //Seteo de Variables en Local Storage
                            localStorage.setItem('user', response.usuarioName);
                            localStorage.setItem('role', response.usuarioRole);
                            console.log(response.modo);
                            console.log('############');

                            if(response.modo == "errorNoAdmin"){
                                SweetAlert.swal("Error!", "No tienes permiso de Administrador!", "error");
                                $state.reload(); 
                            }

                            console.log(response.mensaje);
                            if(response.mensaje == 'openSesion'){
                                swal("Ups!", "Usted tiene una sesion abierta en "+response.modo+", sera redirigido!", "error");
                            }

                            console.log(localStorage.getItem('role'));
                            console.log(localStorage.getItem('user')); 

                            //Elijo de adonde tengo que enviarlo dependiendo de la respuesta response.modo
                            switch(response.modo){
                                case "admin":
                                if(response.usuarioRole == 'Admin'){
                                    $state.go('dashboards.dashboard_2');
                                }else{
                                    $state.go('auth');
                                }
                                break;
                                case "caja":
                                $state.go('pos.point_of_sale');
                                break;

                                case "barra":
                                $state.go('pos.point_of_sale_barra');
                                break;
                            }
                        }else{
                            vm.full = true;
                            vm.usuarios = response.datos;
                        }
                        //$rootScope.currentUser = response.usuarioName;
                        //$rootScope.currentRole = response.usuarioRole;
                    })
                    .error(function(){
                        vm.loginError = true;
                        vm.loginErrorText = error.data.error;
                        console.log(vm.loginErrorText);
                    })
                },function(err){
                    if(err.status == 401){
                        SweetAlert.swal("Error!", "Error en el nombre de usuario o la contraseña que ingresaste!", "error");
                        $state.reload(); 

                    }
                    console.log(err);
                });

        }//Fin del function login
//codigo de iphone de Fede --> 619794
}])

//--------    NUEVO POS BARRA CTRL    --------

.controller('posBarraCtrl', ['$scope', '$state','$log','$uibModal','$http','SweetAlert', function($scope, $state,$log,$uibModal,$http,SweetAlert){

    //controller de barra

    $scope.ventaProductos =[];  
    $scope.marcasCervezas =[];

    $scope.getProductosBarra = function (){

        $http.get('http://blackhop-dessin1.rhcloud.com/api/pos/barra/producto').success(function(productos){    
            console.log(productos);
            $scope.ventaProductos = productos.data;
            for(var i = 0; i < $scope.ventaProductos.length; i++){

                if($scope.ventaProductos[i].categoria=='Alquilables'){
                    $scope.ventaProductos[i].stock=-1;
                }
                if($scope.ventaProductos[i].ibu){

                    var found = jQuery.inArray($scope.ventaProductos[i].marca, $scope.marcasCervezas);

                    if (found == -1) {                    
                        $scope.marcasCervezas.push($scope.ventaProductos[i].marca);
                    }
                } 
            };
        }).error(function(error){
            console.log(error);
        });        
    }
    
    $scope.getProductosBarra();

        $scope.resumen={
            display:'',
            numeroProductos:-1,
            productos:[],
            total:0.00,
            totalLitros:0,
            selected:-1,
            recalculando : function (index,modTotal){
                console.log("recalculandoBarra");

                $scope.resumen.total=0;
                $scope.resumen.totalLitros=0;
                newOrder=0;
                $scope.resumen.productos.forEach(function(producto) {

                    $scope.resumen.totalLitros +=Number(producto.cantidad); 

                    producto.id= newOrder;
                    newOrder++;        
                });
            }
        }

        $scope.terminarSesionBarra=function(){

            $scope.bajar='';                
            
            var modalInstance = $uibModal.open({
                templateUrl: 'views/modal-terminar_sesion_barra.html',
                controller: terminarSesionBarraCtrl,                        
                windowClass: "animated fadeIn",
                scope:$scope,
                SweetAlert:SweetAlert,
                $state:$state

            });
        }     

        $scope.modal={

            scanearCupon : function (){
                $scope.cupon='';
                var modalInstance = $uibModal.open({
                    templateUrl: 'views/modal_scanear-cupon.html',
                    controller: scanearCuponCtrl,
                    windowClass: "animated fadeIn",
                    scope: $scope //paso el scope completo asi lo puedo llenar sin dar vueltas (no se hace :P )
                });
            },
            terminarVentaBarra : function (){

                $scope.getProductosBarra();

                if($scope.cuponSeleccionado.litros > $scope.resumen.totalLitros){
                    SweetAlert.swal("Error", "El cupon tiene mas litros de los cargados!", "error")
                }else{
                    var itemsVenta=[];

                    for (var i=0;i<$scope.resumen.productos.length;i++){

                        var item={};

                        item.idProducto = $scope.resumen.productos[i].productoReal.id;
                        item.cantidad = $scope.resumen.productos[i].cantidad;

                        itemsVenta.push(item);          
                    }

                    SweetAlert.swal({
                        title: "¿Estas Seguro?",
                        text: "Se va a inutilizar el cupon <span style='color:#F8BB86; font-weight:600'>" + $scope.cuponSeleccionado.numero +"</span>",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "¡Si, agregalo!",
                        cancelButtonText: "¡No, cancelar!",
                        closeOnConfirm: false,
                        closeOnCancel: false,
                        html: true },
                        function (isConfirm) {
                            if (isConfirm) {

                                $http.post('http://blackhop-dessin1.rhcloud.com/api/pos/barra/venta', {

                                    codigo:$scope.cuponSeleccionado.numero,
                                    itemsVenta: JSON.stringify(itemsVenta),
                                }).success(function(response) {
                                    $scope.borrarTodo();

                                }).error(function(error){
                                  console.log(error);
                              });              
                                SweetAlert.swal("¡Realizado!", "Venta realizada", "success");

                                $scope.resumen.display='';
                                $scope.resumen.numeroProductos=-1;
                                $scope.resumen.productos=[];
                                $scope.resumen.total=0.00;
                                $scope.resumen.totalLitros=0;
                                $scope.resumen.selected=-1;
                                $scope.clienteSeleccionado='';
                                $scope.cuponSeleccionado='';


                            } else {
                                SweetAlert.swal("Cancelado", "Todo sigue como antes", "error");
                            }
                        });


                }
            }

        }
    }

    ])     

//--------    END NUEVO POS BARRA CTRL--------

//--------    NUEVO POS CAJA CTRL    --------

.controller('posCtrlCaja', ['$scope', '$state','$log','$uibModal','$http','SweetAlert', function($scope, $state,$log,$uibModal,$http,SweetAlert){

    $http.get('http://blackhop-dessin1.rhcloud.com/api/pos/caja/canilla').success(function(canillas){    
        console.log(canillas);
        $scope.canillas = canillas.data;
    }).error(function(error){
        console.log(error);
    }) 



    $scope.ventaProductos =[];



    $scope.getProductos = function (){
        $http.get('http://blackhop-dessin1.rhcloud.com/api/pos/caja/producto').success(function(productos){    
            console.log(productos);
            $scope.ventaProductos = productos.data;
            for(var i = 0; i < $scope.ventaProductos.length; i++){

                if($scope.ventaProductos[i].categoria=='Alquilables'){
                    $scope.ventaProductos[i].stock=-1;
                }
            };
        }).error(function(error){
            console.log(error);
        })
    }

    $scope.getProductos();

    $http.get('http://blackhop-dessin1.rhcloud.com/api/pos/caja/cliente').success(function(clientes){    
        console.log(clientes);
        $scope.clientes = clientes.data;
    }).error(function(error){
        console.log(error);
    })


    $scope.resumen={
        display:'',
        numeroProductos:-1,
        productos:[],
        total:0.00,
        totalLitros:0,
        selected:-1,
        recalculando : function (index,modTotal){
            console.log("recalculando");

            $scope.resumen.total=0;
            $scope.resumen.totalLitros=0;
            newOrder=0;
            $scope.resumen.productos.forEach(function(producto) {

                $scope.resumen.total+=Number(producto.valorTotal);
                producto.id= newOrder;
                newOrder++;        

                if (index != -1 && index === undefined){

                    console.log($scope.resumen.productos[index] + index + $scope);

                    if(modTotal == true){
                        $scope.resumen.productos[index].valorTotal = $scope.resumen.productos[index].cantidad * $scope.resumen.productos[index].valor;

                        if($scope.resumen.productos[index].descuento != ''){
                            $scope.resumen.productos[index].valorTotal = Number($scope.resumen.productos[index].valorTotal) * Number($scope.resumen.productos[index].descuento/100); 
                        }
                    }
                }
            });

        }
    }

    $scope.cargarGasto=function(){

        $scope.bajar='';                

        var modalInstance = $uibModal.open({
            templateUrl: 'views/crear_gasto_caja.html',
            controller: crearGastoCajaCtrl, 
                    //controler en controllers.js, no termino de entender porque no lo puedo armar como el resto y si o si tengo que poner una funcion                        
                    windowClass: "animated fadeIn",
                    scope:$scope,
                    SweetAlert:SweetAlert,
                    resolve:{
                        gastoNuevo:function () {
                            return '';
                        }
                    }
                });
    }

    $scope.terminarSesionCaja=function(){

        $scope.bajar='';                

        var modalInstance = $uibModal.open({
            templateUrl: 'views/modal-terminar_sesion_caja.html',
            controller: terminarSesionCajaCtrl,                        
            windowClass: "animated fadeIn",
            scope:$scope,
            SweetAlert:SweetAlert,
            $state:$state

        });
    }


    $scope.modal={

        terminarVenta : function (){
            $scope.getProductos();

            if ($scope.clienteSeleccionado){
                var modalInstance = $uibModal.open({
                    templateUrl: 'views/modal-terminar_venta.html',
                    controller: terminarVentaCtrl,
                    windowTopClass:"modal-arriba",
                    windowClass: "animated bounceInDown",
                    size:'md',
                    resolve: {
                        clienteSeleccionado: function () {
                            return $scope.clienteSeleccionado;
                        },
                        resumen: function () {
                            return $scope.resumen;
                        }
                    }
                });                   
                modalInstance.result.then(function (dato) {
                    console.log('dato');
                    console.log(dato);
                },function(dato){
                    if(dato == 'ventaOK'){
                        $scope.clienteSeleccionado = '';
                    }
                });
            
            } else {                    
                $scope.modal.abrir(true);
            }
        },

        abrir : function (flag){
            var modalInstance = $uibModal.open({
                templateUrl: 'views/modal_abrir_cliente.html',
                controller: modalControler,
                windowClass: "animated fadeIn",
                SweetAlert:SweetAlert,
                resolve: {
                    clientes: function () {
                        return $scope.clientes;
                    }
                }
            }).closed.then(function(datosCliente){
                if($scope.clienteSeleccionado){
                    $scope.resumen.nombreClienteSeleccionado = $scope.clienteSeleccionado.nombre + ' '+ $scope.clienteSeleccionado.apellido ;
                }
                console.log($scope.resumen)
                if(flag){
                  $scope.modal.terminarVenta();
              }
          });

        },

        imprimir : function (){

            if ($scope.resumen.numeroProductos<0){ 

                    //No hay articulos y solo quiere imprimir el turno

                    var modalInstance = $uibModal.open({
                        templateUrl: 'views/imprimir_turno.html',
                        controller: imprimirTurnoCtrl, 
                        windowClass: "animated flipInY"
                    }).closed.then(function(){
                        
                    });
                } else {
                    $scope.modal.terminarVenta();
                }
            }

        }
    }

    ])     

//--------    END NUEVO POS CAJA CTRL--------


.controller('clientesCtrl', ['$http','$scope','$log','$uibModal','$filter','DTOptionsBuilder','DTColumnDefBuilder','SweetAlert', function($http,$scope,$log,$uibModal,$filter,DTOptionsBuilder,DTColumnDefBuilder,SweetAlert){


    $scope.clientes =[];
    $scope.actividadDer = [];

    $scope.getClienteDerecha = function(id){

        $http.get('http://blackhop-dessin1.rhcloud.com/api/admin/cliente/'+id).success(function(clienteDer){    
            //console.log(clienteDer);
            $scope.clienteDer = clienteDer.data;
            $scope.clienteDer.fechaNacimiento=moment($scope.clienteDer.fechaNacimiento).locale('es').format('DD/MMM/YYYY');

            $http.get('http://blackhop-dessin1.rhcloud.com/api/admin/clienteactividad/'+id).success(function(actividad){    
                
                $scope.actividadDer = actividad.data;
                $scope.actividadDer.forEach(function(acti){
                    acti.fecha=moment(acti.fecha).locale('es').format('DD/MMM/YYYY');
                });

            }).error(function(error){
                console.log(error);
            });

        }).error(function(error){
            console.log(error);
        });


    }

    $scope.getClientes = function (){

        $http.get('http://blackhop-dessin1.rhcloud.com/api/admin/cliente').success(function(cliente){    
            //console.log(cliente);
            $scope.clientes = cliente.data;
            var idClienteDerecha= $scope.clientes[0].id;

            if (!$scope.clienteDer){
                $scope.getClienteDerecha(idClienteDerecha);
            }

            for(var i = 0; i < $scope.clientes.length; i++){

                switch ($scope.clientes[i].estado){
                    case 'Activo':
                    $scope.clientes[i].class= "badge-primary";
                    break;
                    case 'Deudor':
                    $scope.clientes[i].class= "badge-danger";
                    break; 
                    case 'Con Alquiler':
                    $scope.clientes[i].class= "badge-warning";
                    break;
                }

            }

        }).error(function(error){
            console.log(error);
        });        
    }

    $scope.getClientes();

    $scope.onDelete = function(id){ 

        SweetAlert.swal({
            title: "¿Estas Seguro?",
            text: "¡No vas a poder recuperar los datos!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Si, eliminalo!",
            cancelButtonText: "No, cancelar!",
            closeOnConfirm: false,
            closeOnCancel: false },
            function (isConfirm) {
                if (isConfirm) {

                    $http.delete('http://blackhop-dessin1.rhcloud.com/api/admin/cliente/'+id).success(function(response){    


                        SweetAlert.swal("¡Eliminado!", "El cliente ha sido eliminado", "success");
                        $scope.clientes.forEach(function(cliente,index,arreglo){
                            if(cliente.id == id){
                                arreglo.splice(index,1);
                            }
                        });
                        var idClienteDerecha= $scope.clientes[0].id;
                        $scope.getClienteDerecha(idClienteDerecha);

                    }).error(function(error){
                        console.log(error);
                        SweetAlert.swal("¡Error!", "El cliente no puede ser eliminado", "error");
                    });

                } else {
                    SweetAlert.swal("Cancelado", "Todo sigue como antes", "error");
                }
            });
    };

    $scope.onUpdate= function(id){

        //BARRAS Y PUNTOS SON IGUALES PARA MOMENT!!!!
        var fechaFinal = null;
        if($scope.clienteDer.fechaNacimiento.length == 10){
            //DD.MM.YYYY
            //27.09.1992
            fechaFinal=moment($scope.clienteDer.fechaNacimiento, 'DD.MM.YYYY').format("YYYY-MM-DD");
        }else if($scope.clienteDer.fechaNacimiento.length == 11){
            //DD.MMM.YYYY
            //27.Sep.1992
            fechaFinal=moment($scope.clienteDer.fechaNacimiento, 'DD.MMM.YYYY').format("YYYY-MM-DD");
        }else if($scope.clienteDer.fechaNacimiento.length == 9){
            //DD.MMM.YY
            //27.Sep.92
            fechaFinal=moment($scope.clienteDer.fechaNacimiento, 'DD.MMM.YY').format("YYYY-MM-DD");
        }else if($scope.clienteDer.fechaNacimiento.length == 8){
            //DD.MM.YY
            //27.09.92
            fechaFinal=moment($scope.clienteDer.fechaNacimiento, 'DD.MM.YY').format("YYYY-MM-DD");
        }else{
            //Fecha Invalida, la dejo como estaba
            fechaFinal = '';
        }

        $scope.clienteDer.fechaNacimiento = fechaFinal;
        
        $http.put('http://blackhop-dessin1.rhcloud.com/api/admin/cliente/'+id,{
            telefono:$scope.clienteDer.telefono,
            nombre:$scope.clienteDer.nombre,
            apellido:$scope.clienteDer.apellido,
            celular:$scope.clienteDer.celular,
            email:$scope.clienteDer.email,
            direccion:$scope.clienteDer.direccion,
            fechaNacimiento:$scope.clienteDer.fechaNacimiento,
            dni:$scope.clienteDer.dni
        }).success(function(){
            /////////////////////////////
            // NO ESTA VOLVIENDO A TRAER TODO PARA NO COLGAR
            /////////////////////////////
            //$scope.getClientes();    
            //$scope.getClienteDerecha(id);
            $scope.clienteDer.fechaNacimiento=moment($scope.clienteDer.fechaNacimiento).locale('es').format('DD/MMM/YYYY');
            $scope.clientes.forEach(function(cliente,index,arreglo){
                if(cliente.id == id){
                    cliente.nombre = $scope.clienteDer.nombre;
                    cliente.apellido = $scope.clienteDer.apellido;
                    cliente.direccion = $scope.clienteDer.direccion;
                    cliente.contacto = $scope.clienteDer.contacto;
                }
            })
        }).error(function(error){
            console.log(error);
        });
        

    }

    $scope.dtOptions = DTOptionsBuilder.newOptions()

    .withDOM('<"html5buttons"B>lTfgitp')

    .withButtons([
            /*{extend: 'copy', text: 'Copiar'},
            {extend: 'csv'},*/
            {extend: 'excel', title: 'Clientes'},
            {extend: 'pdf', title: 'Clientes'},

            {extend: 'print',
            customize: function (win){
             $(win.document.body).addClass('white-bg');
             $(win.document.body).css('font-size', '10px');

             $(win.document.body).find('table')
             .addClass('compact')
             .css('font-size', 'inherit');
         }, 
         text: 'Imprimir'
     }
     ]);   

    $scope.dtColumnDefs = [
    DTColumnDefBuilder.newColumnDef(0).notVisible(),
    DTColumnDefBuilder.newColumnDef(1),
    DTColumnDefBuilder.newColumnDef(2).notSortable(),
    DTColumnDefBuilder.newColumnDef(3).notSortable()
    ]

    $scope.modal={
        abrir : function (){
            var modalInstance = $uibModal.open({
                templateUrl: 'views/modal_crear_cliente.html',
                controller: modalControler,
                windowClass: "animated fadeIn",
                scope:$scope,
                resolve: {
                    clientes: function () {
                        return $scope.clientes;
                    }
                }
            });/*
            modalInstance.result.then(function (datosCliente) {
                console.log(datosCliente);
                var nuevoCliente = {};
                nuevoCliente.id = datosCliente.id;
                nuevoCliente.nombre = datosCliente.nombre;
                nuevoCliente.apellido = datosCliente.apellido;
                nuevoCliente.telefono = datosCliente.telefono;
                nuevoCliente.direccion = datosCliente.direccion;
                nuevoCliente.celular = datosCliente.celular;
                nuevoCliente.id = 'Inactivo'
                nuevoCliente.class= "badge-primary";
                $scope.clientes.push(nuevoCliente);
            });
            */

        }
    }
}])

.controller('proveedoresCtrl', ['$http','$scope','$log','$uibModal','$filter','DTOptionsBuilder','DTColumnDefBuilder','SweetAlert', function($http,$scope,$log,$uibModal,$filter,DTOptionsBuilder,DTColumnDefBuilder,SweetAlert){

    $scope.proveedores = [];
    $scope.provActividadDer = [];


    $scope.getProveedorDerecha = function(id){

        $http.get('http://blackhop-dessin1.rhcloud.com/api/admin/proveedor/'+id).success(function(proveedorDer){    
            //console.log(proveedorDer);
            $scope.proveedorDer = proveedorDer.data;

            $http.get('http://blackhop-dessin1.rhcloud.com/api/admin/proveedoractividad/'+id).success(function(actividad){    
                
                $scope.actividadDer = actividad.data;
                $scope.actividadDer.forEach(function(acti){
                    acti.fecha=moment(acti.fecha).locale('es').format('DD/MMM/YYYY');
                });

            }).error(function(error){
                console.log(error);
            });

        }).error(function(error){
            console.log(error);
        });


    }



    $scope.getProveedores = function (){

        $http.get('http://blackhop-dessin1.rhcloud.com/api/admin/proveedor').success(function(proveedor){    
            //console.log(cliente);
            $scope.proveedores = proveedor.data;
            var idProveedorDerecha= $scope.proveedores[0].id;

            if (!$scope.proveedorDer){
                $scope.getProveedorDerecha(idProveedorDerecha);
            }

        }).error(function(error){
            console.log(error);
        });        
    }

    $scope.onDelete = function(id){ 

        SweetAlert.swal({
            title: "¿Estas Seguro?",
            text: "¡No vas a poder recuperar los datos!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Si, eliminalo!",
            cancelButtonText: "No, cancelar!",
            closeOnConfirm: false,
            closeOnCancel: false },
            function (isConfirm) {
                if (isConfirm) {

                    $http.delete('http://blackhop-dessin1.rhcloud.com/api/admin/proveedor/'+id).success(function(response){    


                        SweetAlert.swal("¡Eliminado!", "El proveedor ha sido eliminado", "success");
                        $scope.proveedores.forEach(function(proveedor,index,arreglo){
                            if(proveedor.id == id){
                                arreglo.splice(index,1);
                            }
                        });
                        var idProveedorDerecha= $scope.proveedores[0].id;
                        $scope.getProveedorDerecha(idProveedorDerecha);

                    }).error(function(error){
                        console.log(error);
                        SweetAlert.swal("¡Error!", "El proveedor no puede ser eliminado", "error");
                    });

                } else {
                    SweetAlert.swal("Cancelado", "Todo sigue como antes", "error");
                }
            });
    };

    $scope.getProveedores();
    

    $scope.onUpdate= function(id){
        
        $http.put('http://blackhop-dessin1.rhcloud.com/api/admin/proveedor/'+id,{
            nombre:$scope.proveedorDer.nombre,
            direccion:$scope.proveedorDer.direccion,
            telefono:$scope.proveedorDer.telefono,
            email:$scope.proveedorDer.email,
            metodoPago:$scope.proveedorDer.metodoPago,
            contacto:$scope.proveedorDer.contacto,
            telefonoContacto:$scope.proveedorDer.telefonoContacto,
            cuit:$scope.proveedorDer.cuit
        }).success(function(){
            /////////////////////////////
            // NO ESTA VOLVIENDO A TRAER TODO PARA NO COLGAR
            /////////////////////////////
            //$scope.getProveedores();    
            //$scope.getProveedorDerecha(id);
            
            $scope.proveedores.forEach(function(proveedor,index,arreglo){
                if(proveedor.id == id){
                    proveedor.nombre = $scope.proveedorDer.nombre;
                    proveedor.apellido = $scope.proveedorDer.apellido;
                    proveedor.direccion = $scope.proveedorDer.direccion;
                    proveedor.contacto = $scope.proveedorDer.contacto;
                }
            })
        }).error(function(error){
            console.log(error);
        });
        

    }



    $scope.dtOptions = DTOptionsBuilder.newOptions()
    .withDOM('<"html5buttons"B>lTfgitp')
    .withButtons([
            /*{extend: 'copy', text: 'Copiar'},
            {extend: 'csv'},*/
            {extend: 'excel', title: 'Proveedores'},
            {extend: 'pdf', title: 'Proveedores'},

            {extend: 'print',
            customize: function (win){
             $(win.document.body).addClass('white-bg');
             $(win.document.body).css('font-size', '10px');

             $(win.document.body).find('table')
             .addClass('compact')
             .css('font-size', 'inherit');
         }
         , text: 'Imprimir'
     }
     ])

    $scope.dtColumnDefs = [
    DTColumnDefBuilder.newColumnDef(0).notVisible(),
    DTColumnDefBuilder.newColumnDef(1),
    DTColumnDefBuilder.newColumnDef(2).notSortable(),
    DTColumnDefBuilder.newColumnDef(3),
    DTColumnDefBuilder.newColumnDef(4).notSortable(),
    ]

    $scope.modal={
        abrir : function (){
            var modalInstance = $uibModal.open({
                templateUrl: 'views/modal_crear_proveedor.html',
                controller: modalProveedoresControler,
                windowClass: "animated fadeIn", 
                scope:$scope,
                resolve: {
                    proveedores: function () {
                        return $scope.proveedores;
                    }
                }
            });
        }
    }
}])

.controller('ventasCtrl', ['$http','$scope','$log','$uibModal','DTOptionsBuilder','DTColumnDefBuilder', function($http, $scope,$log,$uibModal,DTOptionsBuilder,DTColumnDefBuilder){

            /**
         * ventas  morecapo
         */

         $http.get('http://blackhop-dessin1.rhcloud.com/api/admin/venta').success(function(response){    
            $scope.ventas = response.data;
        }).error(function(error){
            console.log(error);
        }); 


        $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withDOM('<"html5buttons"B>lTfgitp')
        .withButtons([
            {extend: 'copy', text: 'Copiar'},
            {extend: 'csv'},
            {extend: 'excel', title: 'Ventas'},
            {extend: 'pdf', title: 'Ventas'},

            {extend: 'print',
            customize: function (win){
             $(win.document.body).addClass('white-bg');
             $(win.document.body).css('font-size', '10px');

             $(win.document.body).find('table')
             .addClass('compact')
             .css('font-size', 'inherit');
         }
         , text: 'Imprimir'
     }
     ])
        .withOption('order', [0, 'desc']);
        $scope.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0).withOption('sWidth', '25px'),
        DTColumnDefBuilder.newColumnDef(1),
        DTColumnDefBuilder.newColumnDef(2),
        DTColumnDefBuilder.newColumnDef(3).withOption('sWidth', '60px'),
        DTColumnDefBuilder.newColumnDef(4)
        ]


        

        $scope.ok = function () {
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.modal={
            abrir : function (venta){
                console.log(venta);
                var modalInstance = $uibModal.open({
                    templateUrl: 'views/detalle_venta.html',
                    controller: detalleVentaCtrl, 
                    //controler en controllers.js:1591, no termino de entender porque no lo puedo armar como el resto y si o si tengo que poner una funcion                        
                    windowClass: "animated fadeIn",
                    resolve: {
                        venta: function () {
                            return venta;
                        }
                    }
                });
            }
        }

    }])

.controller('comprasCtrl', ['$http','$scope','$log','$uibModal','DTOptionsBuilder','DTColumnDefBuilder','SweetAlert', function($http,$scope,$log,$uibModal,DTOptionsBuilder,DTColumnDefBuilder,SweetAlert){

    $scope.dtOptions = DTOptionsBuilder.newOptions()
    .withDOM('<"html5buttons"B>lTfgitp')
    .withButtons([
        {extend: 'copy', text: 'Copiar'},
        {extend: 'csv'},
        {extend: 'excel', title: 'Compras'},
        {extend: 'pdf', title: 'Compras'},

        {extend: 'print',
        customize: function (win){
         $(win.document.body).addClass('white-bg');
         $(win.document.body).css('font-size', '10px');

         $(win.document.body).find('table')
         .addClass('compact')
         .css('font-size', 'inherit');
     }
     , text: 'Imprimir'
 }
 ])
    .withOption('order', [0, 'desc']);
    $scope.dtColumnDefs = [
    DTColumnDefBuilder.newColumnDef(0).withOption('sWidth', '25px'),
    DTColumnDefBuilder.newColumnDef(1),
    DTColumnDefBuilder.newColumnDef(2),
    DTColumnDefBuilder.newColumnDef(3),
    DTColumnDefBuilder.newColumnDef(4).withOption('sWidth', '60px')
    ]
        /**
         * compras 
         */

         $scope.getCompras = function(){
           $http.get('http://blackhop-dessin1.rhcloud.com/api/admin/compra').success(function(response){    
            $scope.compras = response.data;
            for(var i = 0; i < $scope.compras.length; i++){
                $scope.compras[i].fecha=moment($scope.compras[i].fecha).locale('es').format('DD/MMM/YY');
                switch ($scope.compras[i].estado.nombre){
                    case 'Finalizado':
                    $scope.compras[i].class= "badge-primary";
                    break;
                    case 'Pagado':
                    $scope.compras[i].class= "badge-success";
                    break; 
                    case 'Pedido':
                    $scope.compras[i].class= "badge-info";
                    break;
                }
            };
        }).error(function(error){
            console.log(error);
        }); 
    }

    $scope.getCompras();

    $scope.getDatosCompras = function(){
       $http.get('http://blackhop-dessin1.rhcloud.com/api/admin/compradatos').success(function(response){
        $scope.productos = response.productos;
        $scope.proveedores = response.proveedores;
        $scope.estados = response.estados;
    }).error(function(error){
        console.log(error);
    }); 
}

$scope.getDatosCompras();




$scope.ok = function () {
    $uibModalInstance.close();
};

$scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
};

$scope.modal={
    abrir : function (compra){
        console.log(compra);
        var modalInstance = $uibModal.open({
            templateUrl: 'views/detalle_compra.html',
            controller: detalleCompraCtrl, 
                    //controler en controllers.js, no termino de entender porque no lo puedo armar como el resto y si o si tengo que poner una funcion                        
                    windowClass: "animated fadeIn",
                    resolve: {
                        compra: function () {
                            return compra;
                        }
                    }
                });
    },        
    crear : function (flagNuevaCompra,compra,soloMostrar){

        $scope.getDatosCompra = function(){
            $http.get('http://blackhop-dessin1.rhcloud.com/api/admin/compra/' + compra.id).success(function(response){    
            $scope.compra = response.compra;
            $scope.itemsCompra = response.itemsCompra;
            
            $scope.itemsCompra.forEach(function(item,index){
                item.id = index + 1;
            });

            $scope.proveedor = response.proveedor;
            $scope.compra.fecha=moment($scope.compra.fecha,'YYYY-MM-DD').locale('es').format('DD/MMM/YY');
            console.log($scope.compra);



            var modalInstance = $uibModal.open({
                templateUrl: 'views/crear-editar_compra.html',
                controller: crearEditarCompraCtrl, 
                scope:$scope,
                SweetAlert:SweetAlert,
                size:'lg',
                //controler en controllers.js, no termino de entender porque no lo puedo armar como el resto y si o si tengo que poner una funcion                        
                windowClass: "animated fadeIn",
                backdrop  : 'static',
                keyboard  : false,
                resolve: {
                    items: function () {
                        //console.log($scope.itemsCompra);
                        return $scope.itemsCompra;
                    },
                    aCompra: function () {
                        return $scope.compra;
                    },
                    aProveedor: function () {
                        return $scope.proveedor;
                    },
                    soloMostrar: function () {
                        return soloMostrar;
                    },
                    productos: function () {
                        return $scope.productos;
                    },
                    proveedores: function () {
                        return $scope.proveedores;
                    },
                    estados: function () {
                        return $scope.estados;
                    },
                    flagNuevaCompra: function () {
                        return flagNuevaCompra;
                    }
                }
            });

        }).error(function(error){
            console.log(error);
        }); 
        
    }
    if(compra){
        $scope.getDatosCompra();
    }else{
        var modalInstance = $uibModal.open({
            templateUrl: 'views/crear-editar_compra.html',
            controller: crearEditarCompraCtrl, 
            scope:$scope,
            size:'lg',
            //controler en controllers.js, no termino de entender porque no lo puedo armar como el resto y si o si tengo que poner una funcion                        
            windowClass: "animated fadeIn",
            backdrop  : 'static',
            keyboard  : false,
            resolve: {
                items: function () {      
                    return undefined;
                },
                aCompra: function () {
                    return {};
                },
                aProveedor: function () {
                    return {};
                },
                soloMostrar: function () {
                    return soloMostrar;
                },
                productos: function () {
                    return $scope.productos;
                },
                proveedores: function () {
                    return $scope.proveedores;
                },
                estados: function () {
                    return $scope.estados;
                },
                flagNuevaCompra: function () {
                    return flagNuevaCompra;
                }
            }
        });
    }
    
    
}
}
}])

.controller('cuponesCtrl',['$http','$scope','$log','$uibModal','DTOptionsBuilder','DTColumnDefBuilder',function($http,$scope,$log,$uibModal,DTOptionsBuilder,DTColumnDefBuilder){

    $scope.dtOptions = DTOptionsBuilder.newOptions()
    .withDOM('<"html5buttons"B>lTfgitp')
    .withButtons([
        {extend: 'copy', text: 'Copiar'},
        {extend: 'csv'},
        {extend: 'excel', title: 'Cupones'},
        {extend: 'pdf', title: 'Cupones'},

        {extend: 'print',
        customize: function (win){
         $(win.document.body).addClass('white-bg');
         $(win.document.body).css('font-size', '10px');

         $(win.document.body).find('table')
         .addClass('compact')
         .css('font-size', 'inherit');
     }
     , text: 'Imprimir'
 }
 ])
    .withOption('order', [0, 'desc']);

    $scope.dtColumnDefs = [
    DTColumnDefBuilder.newColumnDef(0).notVisible(),
    DTColumnDefBuilder.newColumnDef(1),
    DTColumnDefBuilder.newColumnDef(2).withOption('sWidth', '30px'),
    DTColumnDefBuilder.newColumnDef(3).notSortable(),
    DTColumnDefBuilder.newColumnDef(4),
    DTColumnDefBuilder.newColumnDef(5),
    DTColumnDefBuilder.newColumnDef(6).notSortable().withOption('sWidth', '200px'),
    ]




        /**
         * cupones 
         */
         $http.get('http://blackhop-dessin1.rhcloud.com/api/admin/cupon').success(function(response){    
            
            $scope.cupones = response.data;

            $scope.cupones.forEach(function(cupon,indice){
                
                var f = moment($scope.cupones[indice].fecha);
                var now = moment();            
                var vencimiento =now.clone().add(1,'d');

                if (vencimiento.diff(f, 'days')>$scope.cupones[indice].vigencia){
                    $scope.cupones[indice].estado='Vencido';                            
                } else if(((vencimiento.diff(f, 'days'))+1==$scope.cupones[indice].vigencia)||(vencimiento.diff(f, 'days')==$scope.cupones[indice].vigencia)){
                    $scope.cupones[indice].estado='Por Vencer';
                } else {
                    $scope.cupones[indice].estado='Vigente';
                };

                switch ($scope.cupones[indice].estado){
                    case 'Vencido':
                    $scope.cupones[indice].class= "badge-danger";
                    break;
                    case 'Vigente':
                    $scope.cupones[indice].class= "badge-primary";
                    break; 
                    case 'Por Vencer':
                    $scope.cupones[indice].class= "badge-warning";
                    break;
                }
            });
            
        }).error(function(error){
            console.log(error);
        });  
        

        function ean13_checksum(ean) {
            var checksum = 0;
            ean = ean.split('').reverse();
            for(var pos in ean){
                checksum += ean[pos] * (3 - 2 * (pos % 2));
            }
            return ((10 - (checksum % 10 )) % 10);
        }

            /*
            $scope.calcularEstado=function(indice){
                var f = moment($scope.cupones[indice].fecha);
                var now = moment();            
                var vencimiento =now.clone().add(1,'d');

                if (vencimiento.diff(f, 'days')>$scope.cupones[indice].vigencia){
                    $scope.cupones[indice].estado='Vencido';                            
                } else if(((vencimiento.diff(f, 'days'))+1==$scope.cupones[indice].vigencia)||(vencimiento.diff(f, 'days')==$scope.cupones[indice].vigencia)){
                    $scope.cupones[indice].estado='Por Vencer';
                } else {
                    $scope.cupones[indice].estado='Vigente';
                };

                switch ($scope.cupones[indice].estado){
                    case 'Vencido':
                    $scope.cupones[indice].class= "badge-danger";
                    break;
                    case 'Vigente':
                    $scope.cupones[indice].class= "badge-primary";
                    break; 
                    case 'Por Vencer':
                    $scope.cupones[indice].class= "badge-warning";
                    break;
                };
                $scope.cupones[indice].fecha=moment($scope.cupones[indice].fecha).locale('es').format('DD/MMM/YYYY');
                console.log($scope.cupones[indice].fecha);
            };
            
            
            for(var i = 0; i < $scope.cupones.length; i++){
            //calcular EAN checksum (ultimo digito)
            $scope.cupones[i].codigo+=ean13_checksum($scope.cupones[i].codigo);

            //calcular estado
            if ($scope.cupones[i].estado!="Usado"){
                $scope.calcularEstado(i);                
            }else{$scope.cupones[i].fecha=moment($scope.cupones[i].fecha).locale('es').format('DD/MMM/YYYY');}
            
            };   



            case 'Vencido':
                    $scope.cupones[indice].class= "badge-danger";
                    break;
                    case 'Vigente':
                    $scope.cupones[indice].class= "badge-primary";
                    break; 
                    case 'Por Vencer':
                    $scope.cupones[indice].class= "badge-warning";
                    break;
                    */

                    $scope.vigencia = {
                        extender : function (i){
                //$scope.cupones[i-1].fecha= moment().toString();
                //console.log($scope.cupones[i-1]);
                //$scope.calcularEstado(i-1);
                $http.put('http://blackhop-dessin1.rhcloud.com/api/admin/extendercupon/'+i)
                .success(function(response){    
                   $scope.cupones.forEach(function(cupon,index,arreglo){
                    if(cupon.id == response.data.id){
                        arreglo[index]=response.data;
                        arreglo[index].class= "badge-primary";
                        arreglo[index].estado='Vigente'; 
                    }

                });
               }).error(function(error){
                console.log(error);
            });
           },
           eliminar : function (i){
                //$scope.cupones[i-1].vigencia=0;
                //console.log($scope.cupones[i-1]);
                //$scope.calcularEstado(i-1);
                $http.put('http://blackhop-dessin1.rhcloud.com/api/admin/invalidarcupon/'+i)
                .success(function(response){    
                   $scope.cupones.forEach(function(cupon,index,arreglo){
                    if(cupon.id == response.data.id){
                        arreglo[index]=response.data;
                        arreglo[index].class= "badge-warning";
                        arreglo[index].estado='Vencido'; 
                    }
                });
               }).error(function(error){
                console.log(error);
            });
               
            }/*,
            restaurar : function (i){
                $scope.cupones[i-1].vigencia=3;
                console.log($scope.cupones[i-1]);
                $scope.calcularEstado(i-1);
            }
            */
        };  

        $scope.imprimir= function (cupon){
            console.log(cupon);

            var modalInstance = $uibModal.open({
                templateUrl: 'views/imprimir_cupon.html',
                controller: imprimirCuponCtrl,
                windowClass: "animated flipInY",
                resolve: {
                    cupon: function () {
                        return cupon;
                    }
                }
            }).closed.then(function(){
                console.log('modal closed');
            });

        }


    }])

.controller('productosCtrl', ['$http','$scope','$log','$uibModal','$filter','DTOptionsBuilder','DTColumnDefBuilder','SweetAlert', function($http,$scope,$log,$uibModal,$filter,DTOptionsBuilder,DTColumnDefBuilder,SweetAlert){


    $scope.productos = [];
    $scope.getProductos = function (){

        $http.get('http://blackhop-dessin1.rhcloud.com/api/admin/producto').success(function(productos){    
            //console.log(cliente);
            $scope.productos = productos.data;

        }).error(function(error){
            console.log(error);
        });        
    }


    $scope.getProductos();


    $scope.dtOptions = DTOptionsBuilder.newOptions()
    .withDOM('<"html5buttons"B>lTfgitp')
    .withButtons([
            /*{extend: 'copy', text: 'Copiar'},
            {extend: 'csv'},*/
            {extend: 'excel', title: 'Productos'},
            {extend: 'pdf', title: 'Productos'},

            {extend: 'print',
            customize: function (win){
             $(win.document.body).addClass('white-bg');
             $(win.document.body).css('font-size', '10px');

             $(win.document.body).find('table')
             .addClass('compact')
             .css('font-size', 'inherit');
         }, 
         text: 'Imprimir'
     }
     ]);   

    $scope.dtColumnDefs = [
    DTColumnDefBuilder.newColumnDef(0).notVisible(),
    DTColumnDefBuilder.newColumnDef(1),
    DTColumnDefBuilder.newColumnDef(2),
    DTColumnDefBuilder.newColumnDef(3)
    ]

    $scope.modal={
        abrir : function (producto){
            console.log(producto);
            var modalInstance = $uibModal.open({
                templateUrl: 'views/detalle_producto.html',
                controller: detalleProductoCtrl, 
                    //controler en controllers.js, no termino de entender porque no lo puedo armar como el resto y si o si tengo que poner una funcion                        
                    windowClass: "animated fadeIn",
                    scope: $scope,
                    SweetAlert:SweetAlert,
                    resolve: {
                        producto: function () {
                            return producto;
                        }
                    }
                });
        },
        crear : function (){
            console.log();
            var modalInstance = $uibModal.open({
                templateUrl: 'views/crear_producto.html',
                controller: crearProductoCtrl, 
                scope:$scope,
                    //controler en controllers.js, no termino de entender porque no lo puedo armar como el resto y si o si tengo que poner una funcion                        
                    windowClass: "animated fadeIn",
                    resolve: {
                        productos: function () {
                            return $scope.productos;
                        },
                        productoEdit:function () {
                            return {};
                        }
                    }
                });
        },
        editar : function (producto){
            console.log(producto);
            var modalInstance = $uibModal.open({
                templateUrl: 'views/crear_producto.html',
                controller: crearProductoCtrl, 
                    //controler en controllers.js, no termino de entender porque no lo puedo armar como el resto y si o si tengo que poner una funcion                        
                    windowClass: "animated fadeIn",
                    resolve: {
                        productos: function () {
                            return $scope.productos;
                        },
                        productoEdit:function () {
                            return producto;
                        }
                    }

                });
        }
    }
}])

.controller('alquileresCtrl', ['$scope','$log','$uibModal','DTOptionsBuilder','DTColumnDefBuilder', function($scope,$log,$uibModal,DTOptionsBuilder,DTColumnDefBuilder){

    $scope.dtOptions = DTOptionsBuilder.newOptions()

    .withDOM('<"html5buttons"B>lTfgitp')
    .withButtons([
        {extend: 'copy', text: 'Copiar'},
        {extend: 'csv'},
        {extend: 'excel', title: 'Alquileres'},
        {extend: 'pdf', title: 'Alquileres'},

        {extend: 'print',
        customize: function (win){
         $(win.document.body).addClass('white-bg');
         $(win.document.body).css('font-size', '10px');

         $(win.document.body).find('table')
         .addClass('compact')
         .css('font-size', 'inherit');
     }
     , text: 'Imprimir'
 }
 ])
    .withOption('order', [0, 'desc']);

    $scope.dtColumnDefs = [
    DTColumnDefBuilder.newColumnDef(0).withOption('sWidth', '25px'),
    DTColumnDefBuilder.newColumnDef(1),
    DTColumnDefBuilder.newColumnDef(2).withOption('sWidth', '70px'),,
    DTColumnDefBuilder.newColumnDef(3).withOption('sWidth', '70px'),,
    DTColumnDefBuilder.newColumnDef(4).withOption('sWidth', '25px'),
    DTColumnDefBuilder.newColumnDef(5).withOption('sWidth', '50px')
    ]
        /**
         * alquileres 
         */
         $scope.alquileres = [
         {
            id: '1',
            idCliente: '1',
            nombreCliente:'Luciano Marquez',                
            fecha: '2016-06-10 22:23:44.657',
                fechaDevolucion: '2016-06-13 22:23:44.657',//cambiar en drawio
                estado: 'Finalizado',//calcular si !Finalizado
                equipo:'1'
            },
            {
                id: '2',
                idCliente: '2',
                nombreCliente:'Antonio Rodriguez',                
                fecha: '2016-06-13 22:23:44.657',
                fechaDevolucion: '2016-06-16 22:23:44.657',
                estado: 'Finalizado',
                equipo:'1'
            },
            {
                id: '3',
                idCliente: '3',
                nombreCliente:'Fiorella Salas',                
                fecha: '2016-06-17 22:23:44.657',
                fechaDevolucion: '2016-06-20 22:23:44.657',
                estado: 'Finalizado',
                equipo:'1'
            },
            {
                id: '4',
                idCliente: '4',
                nombreCliente:'Mafalda Barela',                
                fecha: '2016-06-21 22:23:44.657',
                fechaDevolucion: '2016-06-25 22:23:44.657',
                estado: 'Finalizado',
                equipo:'1'
            },
            {
                id: '5',
                idCliente: '5',
                nombreCliente:'Liza Ortega',                
                fecha: '2016-06-21 22:23:44.657',
                fechaDevolucion: '2016-06-25 22:23:44.657',
                estado: 'Finalizado',
                equipo:'2'
            },
            {
                id: '6',
                id: '6',
                nombreCliente:'Juan Colón',                
                fecha: '2016-07-16 22:23:44.657',
                fechaDevolucion: '2016-07-25 22:23:44.657',
                estado: 'Finalizado',
                equipo:'3'
            },
            {
                id: '7',
                idCliente: '7',
                nombreCliente:'Ruben Pacheco',                
                fecha: '2016-08-01 22:23:44.657',
                fechaDevolucion: '2016-08-03 22:23:44.657',
                estado: 'Finalizado',
                equipo:'3'
            },
            {
                id: '8',
                idCliente: '8',
                nombreCliente:'Simon Garcia',                
                fecha: '2016-08-03 22:23:44.657',
                fechaDevolucion: '2016-08-06 22:23:44.657',
                estado: 'Finalizado',
                equipo:'3'
            },
            {
                id: '9',
                idCliente: '9',
                nombreCliente:'Roberto Estrada',                
                fecha: '2016-08-07 22:23:44.657',
                fechaDevolucion: '2016-08-10 22:23:44.657',//con retraso
                estado: '',
                equipo:'2'
            },
            {
                id: '10',
                idCliente: '10',
                nombreCliente:'Lionel Villar',                
                fecha: '2016-08-10 22:23:44.657',
                fechaDevolucion: '2016-08-13 22:23:44.657',
                estado: 'Finalizado',
                equipo:'1'
            },
            {
                id: '11',
                idCliente: '11',
                nombreCliente:'Esteban Varella',                
                fecha: '2016-08-13 22:23:44.657',
                fechaDevolucion: '2016-08-16 22:23:44.657',
                estado: 'Finalizado',
                equipo:'1'
            },
            {
                id: '12',
                idCliente: '12',
                nombreCliente:'Nicolas Franccesco',                
                fecha: '2016-08-17 22:23:44.657',
                fechaDevolucion: '2016-08-20 22:23:44.657',
                estado: 'Finalizado',
                equipo:'1'
            },
            {
                id: '13',
                idCliente: '1',
                nombreCliente:'Luciano Marquez',                
                fecha: '2016-08-25 22:23:44.657',
                fechaDevolucion: '2016-09-15 22:23:44.657',
                estado: '',
                equipo:'1'
            },
            {
                id: '14',
                idCliente: '1',
                nombreCliente:'Luciano Marquez',                
                fecha: '2016-08-25 22:23:44.657',
                fechaDevolucion: '2016-09-15 22:23:44.657',
                estado: '',
                equipo:'3'
            }
            ];

        //calculo estado en base a las fechas si !Finalizado

        $scope.calcularEstado=function(indice){

            var now = moment(); 
            var fD = moment($scope.alquileres[indice].fechaDevolucion);

            /*
                now - fD
                < 0 : Con Retraso
                = 0 : Devuelve Hoy
                > 0 : Alquilado
                */

                var diffDias = fD.diff(now, 'days'); 

                if (diffDias < 0){
                    $scope.alquileres[indice].estado='Con Retraso';                            
                } else if(diffDias == 0){
                    $scope.alquileres[indice].estado='Devuelve Hoy';
                } else {
                    $scope.alquileres[indice].estado='Vigente';
                };

                switch ($scope.alquileres[indice].estado){
                    case 'Con Retraso':
                    $scope.alquileres[indice].class= "badge-danger";
                    break;
                    case 'Devuelve Hoy':
                    $scope.alquileres[indice].class= "badge-warning";
                    break; 
                    case 'Vigente':
                    $scope.alquileres[indice].class= "badge-primary";
                    break;
                };
                $scope.alquileres[indice].fecha=moment($scope.alquileres[indice].fecha).locale('es').format('DD/MMM/YYYY');
                $scope.alquileres[indice].fechaDevolucion=moment($scope.alquileres[indice].fechaDevolucion).locale('es').format('DD/MMM/YYYY');

            };


            for(var i = 0; i < $scope.alquileres.length; i++){
            //calcular estado
            if ($scope.alquileres[i].estado!="Finalizado"){                
                $scope.calcularEstado(i);                
            }else{
                $scope.alquileres[i].fecha=moment($scope.alquileres[i].fecha).locale('es').format('DD/MMM/YYYY');
                $scope.alquileres[i].fechaDevolucion=moment($scope.alquileres[i].fechaDevolucion).locale('es').format('DD/MMM/YYYY');
                $scope.alquileres[i].class= "badge-success";
            }

        };

        $scope.ok = function () {
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.modal={
            abrir : function (alquiler){
                console.log(alquiler);
                var modalInstance = $uibModal.open({
                    templateUrl: 'views/detalle_alquiler.html',
                    controller: detalleAlquilerClienteCtrl, 
                    //controler en controllers.js, no termino de entender porque no lo puedo armar como el resto y si o si tengo que poner una funcion                        
                    windowClass: "animated fadeIn",
                    resolve: {
                        alquiler: function () {
                            return alquiler;
                        }
                    }
                });
            }
        }
    }])

.controller('productosInventarioCtrl', ['$http','$scope','$log','$uibModal','$filter','DTOptionsBuilder','DTColumnDefBuilder','SweetAlert',function($http,$scope,$log,$uibModal,$filter,DTOptionsBuilder,DTColumnDefBuilder,SweetAlert){


    $scope.productosInventario =[]

    $scope.getProductosInventario = function (){

        $http.get('http://blackhop-dessin1.rhcloud.com/api/admin/inventarios').success(function(productos){    
            
            console.log(productos);
            $scope.productosInventario = productos.data;
            
        }).error(function(error){
            console.log(error);
        });        
    }
    
    $scope.getProductosInventario();


    $scope.ubicaciones =[]
    
    $scope.getUbicaciones = function (){

        $http.get('http://blackhop-dessin1.rhcloud.com/api/admin/ubicaciones').success(function(ubicaciones){    
            
            console.log(ubicaciones);
            $scope.ubicaciones = ubicaciones.data;
            $scope.agregarAjuste();
            
        }).error(function(error){
            console.log(error);
        });        
    }

        //no es necesario? ToDo
        $scope.agregarAjuste = function (){

            var ajuste ={
                nombre:'Ajuste',
                direccion:''
            }

            $scope.ubicaciones.push(ajuste);
        }
        
        $scope.getUbicaciones();



        $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withDOM('<"html5buttons"B>lTfgitp')
        .withButtons([
            /*{extend: 'copy', text: 'Copiar'},
            {extend: 'csv'},*/
            {extend: 'excel', title: 'Clientes'},
            {extend: 'pdf', title: 'Clientes'},

            {extend: 'print',
            customize: function (win){
             $(win.document.body).addClass('white-bg');
             $(win.document.body).css('font-size', '10px');

             $(win.document.body).find('table')
             .addClass('compact')
             .css('font-size', 'inherit');
         }, 
         text: 'Imprimir'
     }
     ]);   

        $scope.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0).notVisible(),
        DTColumnDefBuilder.newColumnDef(1),
        DTColumnDefBuilder.newColumnDef(2),
        DTColumnDefBuilder.newColumnDef(3),
        DTColumnDefBuilder.newColumnDef(4).notSortable().withOption('sWidth', '20px'),
        ]

        $scope.modal={ //serian todos con el mismo wizz
            agregar : function (producto){
                var modalInstance = $uibModal.open({
                    templateUrl: 'views/wizard-producto-inventario.html',
                    controller: wizardProductoInvantarioCtrl, 
                    //controler en controllers.js, no termino de entender porque no lo puedo armar como el resto y si o si tengo que poner una funcion                        
                    windowClass: "animated fadeIn",
                    scope: $scope,
                    backdrop: 'static',
                    resolve: {
                        trabajo: function () {
                            return 'agregar';
                        },
                        producto: function () {
                            return producto;
                        }
                    }
                });
            },
            mover : function (producto){
                var modalInstance = $uibModal.open({
                    templateUrl: 'views/wizard-producto-inventario.html',
                    controller: wizardProductoInvantarioCtrl, 
                    //controler en controllers.js, no termino de entender porque no lo puedo armar como el resto y si o si tengo que poner una funcion                        
                    windowClass: "animated fadeIn",
                    scope: $scope,
                    backdrop: 'static',
                    resolve: {
                        trabajo: function () {
                            return 'mover';
                        },
                        producto: function () {
                            return producto;
                        }
                    }
                });
            },
            ajustar : function (producto){
                var modalInstance = $uibModal.open({
                    templateUrl: 'views/wizard-producto-inventario.html',
                    controller: wizardProductoInvantarioCtrl, 
                    //controler en controllers.js, no termino de entender porque no lo puedo armar como el resto y si o si tengo que poner una funcion                        
                    windowClass: "animated fadeIn",
                    scope: $scope,
                    backdrop: 'static',
                    resolve: {
                        trabajo: function () {
                            return 'ajustar';
                        },
                        producto: function () {
                            return producto;
                        }
                    }
                });
            }
        }

    }])

.controller('alquilablesCtrl', ['$scope','$log','$uibModal','$filter','DTOptionsBuilder','DTColumnDefBuilder','SweetAlert', function($scope,$log,$uibModal,$filter,DTOptionsBuilder,DTColumnDefBuilder,SweetAlert){

        //recibo 0 para alquilado y 1 para disponible
        
        $scope.alquilables =[
        {
            identificador:1,
            codigo:"1001",
            descripcion:"Barril de 10 lts.",
            ubicacion:'Local Illia',
            estado:0
        },
        {
            identificador:2,
            codigo:"1002",
            descripcion:"Barril de 9 lts.",
            ubicacion:'Local Illia',
            estado:1
        },
        {
            identificador:3,
            codigo:"1003",
            descripcion:"Barril de 18 lts.",
            ubicacion:'Local Illia',
            estado:0,
        }

        ]

        for(var i = 0; i < $scope.alquilables.length; i++){
            switch ($scope.alquilables[i].estado){
                case 1:
                $scope.alquilables[i].estado= "Disponible"
                $scope.alquilables[i].class= "badge-primary";
                break;
                case 0:
                $scope.alquilables[i].estado= "Alquilado";
                $scope.alquilables[i].class= "badge-warning";
                break; 
            }
        };

        $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withDOM('<"html5buttons"B>lTfgitp')
        .withButtons([
            /*{extend: 'copy', text: 'Copiar'},
            {extend: 'csv'},*/
            {extend: 'excel', title: 'Alquilables'},
            {extend: 'pdf', title: 'Alquilables'},

            {extend: 'print',
            customize: function (win){
             $(win.document.body).addClass('white-bg');
             $(win.document.body).css('font-size', '10px');

             $(win.document.body).find('table')
             .addClass('compact')
             .css('font-size', 'inherit');
         }, 
         text: 'Imprimir'
     }
     ]);   

        $scope.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0).notVisible(),
        DTColumnDefBuilder.newColumnDef(1),
        DTColumnDefBuilder.newColumnDef(2),
        DTColumnDefBuilder.newColumnDef(3)
        ]

        $scope.onDelete = function(ident){

            //console.log($scope.$parent.productos);
            SweetAlert.swal({
                title: "¿Estas Seguro?",
                text: "¡No vas a poder recuperar los datos!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Si, eliminalo!",
                cancelButtonText: "No, cancelar!",
                closeOnConfirm: false,
                closeOnCancel: false },
                function (isConfirm) { 
                    if (isConfirm) {
                        for(var i = 0; i < $scope.alquilables.length; i++){

                            if ($scope.alquilables[i].estado != 'Alquilado'){
                                if ($scope.alquilables[i].id == ident){                    
                                    $scope.alquilables.splice(i, 1);                                
                                    SweetAlert.swal("¡Eliminado!", "El producto ha sido eliminado", "success");

                                } 
                            } else {
                                SweetAlert.swal("Cancelado", "El producto se encuentra alquilado al momento. Todo sigue como antes", "error");
                            }
                        }
                    } else {
                        SweetAlert.swal("Cancelado", "Todo sigue como antes", "error");
                    }
                });
        };

        $scope.modal={
            crear : function (){
                var modalInstance = $uibModal.open({
                    templateUrl: 'views/crear_alquilable.html',
                    controller: crearAlquilableCtrl, 
                    //controler en controllers.js, no termino de entender porque no lo puedo armar como el resto y si o si tengo que poner una funcion                        
                    windowClass: "animated fadeIn",
                    scope:$scope,
                    resolve: {
                        alquilables: function () {
                            return $scope.alquilables;
                        },
                        alquilableEdit:function () {
                            return '';
                        }
                    }
                });
            },
            editar : function (alquilable){
                var modalInstance = $uibModal.open({
                    templateUrl: 'views/crear_alquilable.html',
                    controller: crearAlquilableCtrl, 
                    //controler en controllers.js, no termino de entender porque no lo puedo armar como el resto y si o si tengo que poner una funcion                        
                    windowClass: "animated fadeIn",
                    scope:$scope,
                    resolve: {
                        alquilables: function () {
                            return $scope.alquilables;
                        },
                        alquilableEdit:function () {
                            return alquilable;
                        }
                    }

                });
            }
        }
    }])

.controller('gastosCtrl', ['$http','$scope','$log','$uibModal','$filter','DTOptionsBuilder','DTColumnDefBuilder','SweetAlert', function($http,$scope,$log,$uibModal,$filter,DTOptionsBuilder,DTColumnDefBuilder,SweetAlert){

    $scope.getGastos = function(){
        $scope.gastos = [];
        $http.get('http://blackhop-dessin1.rhcloud.com/api/admin/gasto')
        .success(function(response){    
            $scope.gastos = response.data;
            /// Dejalo asi Formatea lo que manda Laravel
            for(var i = 0; i < $scope.gastos.length; i++){
                $scope.gastos[i].fecha=moment($scope.gastos[i].fecha).locale('es').format('DD/MMM/YYYY');
            };
            console.log($scope.gastos);
        }).error(function(error){
            console.log(error);
        });
    }

    $scope.getGastos();
    console.log($scope.gastos);

    $scope.dtOptions = DTOptionsBuilder.newOptions()
    .withDOM('<"html5buttons"B>lTfgitp')
    .withButtons([
            /*{extend: 'copy', text: 'Copiar'},
            {extend: 'csv'},*/
            {extend: 'excel', title: 'Gastos'},
            {extend: 'pdf', title: 'Gstos'},

            {extend: 'print',
            customize: function (win){
             $(win.document.body).addClass('white-bg');
             $(win.document.body).css('font-size', '10px');

             $(win.document.body).find('table')
             .addClass('compact')
             .css('font-size', 'inherit');
         }, 
         text: 'Imprimir'
     }
     ]);   

    $scope.dtColumnDefs = [
    DTColumnDefBuilder.newColumnDef(0).notVisible(),
    DTColumnDefBuilder.newColumnDef(1),
    DTColumnDefBuilder.newColumnDef(2),
    DTColumnDefBuilder.newColumnDef(3)
    ]

    $scope.onDelete = function(ident){

        SweetAlert.swal({
            title: "¿Estas Seguro?",
            text: "¡No vas a poder recuperar los datos!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Si, eliminalo!",
            cancelButtonText: "No, cancelar!",
            closeOnConfirm: false,
            closeOnCancel: false },
            function (isConfirm) { 
                if (isConfirm) {
                    
                    $http.delete('http://blackhop-dessin1.rhcloud.com/api/admin/gasto/'+ident)
                    .success(function(){    
                        SweetAlert.swal("¡Eliminado!", "El gasto fue eliminado", "success");
                        $scope.getGastos();
                    }).error(function(error){
                        console.log(error);
                    });
                }else{
                    SweetAlert.swal("Cancelado", "Todo sigue como antes", "error");
                }
            }
            
            );
    };

    $scope.modal={
        crear : function (){
            var modalInstance = $uibModal.open({
                templateUrl: 'views/crear_gasto.html',
                controller: crearGastoCtrl, 
                    //controler en controllers.js, no termino de entender porque no lo puedo armar como el resto y si o si tengo que poner una funcion                        
                    windowClass: "animated fadeIn",
                    scope:$scope,
                    resolve: {
                        gastos: function () {
                            return $scope.gastos;
                        },
                        gastoEdit:function () {
                            return '';
                        }
                    }
                });

            modalInstance.result.then(function (gasto) {

                $http.post('http://blackhop-dessin1.rhcloud.com/api/admin/gasto',{
                    descripcion:gasto.descripcion,
                    monto:gasto.monto,
                    fecha:gasto.fecha
                }).success(function(){    
                    SweetAlert.swal("¡Agregado!", "El gasto fue agregado", "success");
                    $scope.getGastos();
                }).error(function(error){
                    console.log(error);
                });

/*
            $http.put('http://blackhop-dessin1.rhcloud.com/api/admin/canilla/'+idCanilla,{
                idInventario:idPS
            }).success(function(){    
                        $scope.getCanillas(); 
                    }).error(function(error){
                        console.log(error);
                    });
                    */
                });

        },

        editar : function (gasto){       

            var modalInstance = $uibModal.open({
                templateUrl: 'views/editar_gasto.html',
                controller: editarGastoCtrl, 
                    //controler en controllers.js, no termino de entender porque no lo puedo armar como el resto y si o si tengo que poner una funcion                        
                    windowClass: "animated fadeIn",
                    scope:$scope,
                    resolve: {
                        gastos: function () {
                            return $scope.gastos;
                        },
                        gastoEdit:function () {
                            return gasto;
                        }
                    }

                });

            modalInstance.result.then(function (gasto) {

                $http.put('http://blackhop-dessin1.rhcloud.com/api/admin/gasto/'+gasto.identificador,{
                    descripcion:gasto.descripcion,
                    monto:gasto.monto,
                    fecha:gasto.fecha
                }).success(function(){    
                    SweetAlert.swal("¡Editado!", "El gasto fue editado", "success");
                    $scope.getGastos();
                }).error(function(error){
                    console.log(error);
                });
            });
        }
    }
}])

.controller('historialCtrl', ['$http','$scope','$log','$uibModal','$filter','DTOptionsBuilder','DTColumnDefBuilder', function($http,$scope,$log,$uibModal,$filter,DTOptionsBuilder,DTColumnDefBuilder){

 
 $scope.historial =[];

 $http.get('http://blackhop-dessin1.rhcloud.com/api/admin/historial')
 .success(function(response){    
    $scope.historial = response.data;
    for(var i = 0; i < $scope.historial.length; i++){
        $scope.historial[i].fecha=moment($scope.historial[i].fecha).locale('es').format('DD/MMM/YYYY');

        switch ($scope.historial[i].tipoHistorial){
            case 'ingreso':
            $scope.historial[i].icono= "text-success fa-arrow-circle-down";
            break;
            case 'venta':
            $scope.historial[i].icono= "text-navy fa-cart-arrow-down";
            break; 
            case 'retiro':
            $scope.historial[i].icono= "text-danger fa-arrow-circle-up";
            break; 
                case 'Movimiento'://no se usa
                $scope.historial[i].icono= "text-warning fa-arrow-circle-right";
                break;
            }
        }

    }).error(function(error){
        console.log(error);
    });

    $scope.dtOptions = DTOptionsBuilder.newOptions()
    .withDOM('<"html5buttons"B>lTfgitp')
    .withButtons([
            /*{extend: 'copy', text: 'Copiar'},
            {extend: 'csv'},*/
            {extend: 'excel', title: 'Gastos'},
            {extend: 'pdf', title: 'Gstos'},

            {extend: 'print',
            customize: function (win){
             $(win.document.body).addClass('white-bg');
             $(win.document.body).css('font-size', '10px');

             $(win.document.body).find('table')
             .addClass('compact')
             .css('font-size', 'inherit');
         }, 
         text: 'Imprimir'
     }
     ]);   

        /*
        <th>ID</th>
        <th>Fecha</th>
        <th>Ubicacion</th>
        <th>Producto</th>
        <th>Tipo</th>
        <th>Cantidad</th>
        <th>Anterior</th>
        <th>Posterior</th>   
        */
        
        $scope.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0).notVisible(),
        DTColumnDefBuilder.newColumnDef(6).notSortable(),
        DTColumnDefBuilder.newColumnDef(7).notSortable()
        ]
    }])

.controller('historialBarraCtrl', ['$http','$scope','$log','$uibModal','$filter','DTOptionsBuilder','DTColumnDefBuilder', function($http,$scope,$log,$uibModal,$filter,DTOptionsBuilder,DTColumnDefBuilder){

    $scope.historialBarra = [];

    $http.get('http://blackhop-dessin1.rhcloud.com/api/admin/historialbarra')
    .success(function(response){    
        $scope.historialBarra = response.data;
        for(var i = 0; i < $scope.historialBarra.length; i++){
            $scope.historialBarra[i].fechaIni=moment($scope.historialBarra[i].fechaIni).locale('es').format('DD/MMM/YYYY, HH:mm');
            $scope.historialBarra[i].fechaFin=moment($scope.historialBarra[i].fechaFin).locale('es').format('DD/MMM/YYYY, HH:mm');

        };
    }).error(function(error){
        console.log(error);
    });

    $scope.dtOptions = DTOptionsBuilder.newOptions()
    .withDOM('<"html5buttons"B>lTfgitp')
    .withButtons([
            /*{extend: 'copy', text: 'Copiar'},
            {extend: 'csv'},*/
            {extend: 'excel', title: 'Gastos'},
            {extend: 'pdf', title: 'Gstos'},

            {extend: 'print',
            customize: function (win){
             $(win.document.body).addClass('white-bg');
             $(win.document.body).css('font-size', '10px');

             $(win.document.body).find('table')
             .addClass('compact')
             .css('font-size', 'inherit');
         }, 
         text: 'Imprimir'
     }
     ]);   


    $scope.dtColumnDefs = [
    DTColumnDefBuilder.newColumnDef(0).notVisible()
    ]
}])

.controller('historialCajaCtrl', ['$http','$scope','$log','$uibModal','$filter','DTOptionsBuilder','DTColumnDefBuilder', function($http,$scope,$log,$uibModal,$filter,DTOptionsBuilder,DTColumnDefBuilder){



    $scope.historialCaja = [];

    $http.get('http://blackhop-dessin1.rhcloud.com/api/admin/historialcaja')
    .success(function(response){    
        $scope.historialCaja = response.data;
        for(var i = 0; i < $scope.historialCaja.length; i++){
            $scope.historialCaja[i].fechaIni=moment($scope.historialCaja[i].fechaIni).locale('es').format('DD/MMM/YYYY, HH:mm');
            $scope.historialCaja[i].fechaFin=moment($scope.historialCaja[i].fechaFin).locale('es').format('DD/MMM/YYYY, HH:mm');

        };
    }).error(function(error){
        console.log(error);
    });

    



    $scope.dtOptions = DTOptionsBuilder.newOptions()
    .withOption('order', [0, 'desc'])
    .withDOM('<"html5buttons"B>lTfgitp')
    .withButtons([
            /*{extend: 'copy', text: 'Copiar'},
            {extend: 'csv'},*/
            {extend: 'excel', title: 'Gastos'},
            {extend: 'pdf', title: 'Gstos'},

            {extend: 'print',
            customize: function (win){
             $(win.document.body).addClass('white-bg');
             $(win.document.body).css('font-size', '10px');

             $(win.document.body).find('table')
             .addClass('compact')
             .css('font-size', 'inherit');
         }, 
         text: 'Imprimir'
     }
     ]);   


    $scope.dtColumnDefs = [
    DTColumnDefBuilder.newColumnDef(0)
    ]
}])

.controller('canillasCtrl', ['$http','$scope','$log','$uibModal','$filter','SweetAlert', function($http,$scope,$log,$uibModal,$filter,SweetAlert){

   $scope.ubicaciones =[
   {
    id:0,
    nombre:'Local 1'
},
{
    id:1,
    nombre:'Local 2'
}
]

$scope.canillas =[];


$scope.getCanillas = function (){
    $http.get('http://blackhop-dessin1.rhcloud.com/api/admin/canilla').success(function(canillas){    
        console.log(canillas);
        $scope.canillas = canillas.data;
    }).error(function(error){
        console.log(error);
    })
}

$scope.getCanillas();

$scope.cambiarProducto = function(idCanilla){
    var modalInstance = $uibModal.open({
        templateUrl: 'views/canilla_cambiar_producto.html',
        controller: canillaCambiarProductoCtrl, 
                        //controler en controllers.js, no termino de entender porque no lo puedo armar como el resto y si o si tengo que poner una funcion                        
                        windowClass: "animated fadeIn",
                        scope:$scope,
                        resolve: {
                            idCanilla: function () {
                                return idCanilla;
                            }
                        }
                    });
        modalInstance.result.then(function (idPS) { //callback modal

            $http.put('http://blackhop-dessin1.rhcloud.com/api/admin/canilla/'+idCanilla,{
                idInventario:idPS
            }).success(function(){    
                $scope.getCanillas(); 
            }).error(function(error){
                console.log(error);
            });
        });

    }
}])
    /*
    .controller('authCtrl',['$scope',function($scope){
    
        $scope.ubicacion={};
         $scope.ubicaciones =[
            {
                id:0,
                nombre:'Local 1',
                direccion:'illia 123'
            },
            {
                id:1,
                nombre:'Local 2',
                direccion:'Otra Calle 343'        
            },
            {
                id:2,
                nombre:'Local 3',
                direccion:'Otra Lugar 543'        
            }
        ];
            
    }])
    */
    .controller('loginLista',['$scope','SweetAlert',function($scope,SweetAlert){ 

     $scope.usuarios =[
     {
        id:0,
        nombre:'Miqueas',
        modo:'Caja'
    },
    {
        id:2,
        nombre:'Gaston',
        modo:'Barra 1'
    },
    {
        id:3,
        nombre:'Martin',
        modo:'Barra 2'
    }
    ];


    $scope.saLoggout = function(id,nombre){ 

        SweetAlert.swal({
            title: "¿Estas Seguro?",
            text: "¡"+nombre+" no va a poder seguir operando!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Si, cerra la cuenta!",
            cancelButtonText: "No, cancelar!",
            closeOnConfirm: false,
            closeOnCancel: false },
            function (isConfirm) {
                if (isConfirm) {
                    for(var i = 0; i < $scope.usuarios.length; i++){
                        if ($scope.usuarios[i].id == id){                    
                            $scope.usuarios.splice(i, 1);
                            break;
                        }
                    }
                    SweetAlert.swal("¡Hecho!", "La cuenta de "+ nombre + " fue cerrada", "success");
                } else {
                    SweetAlert.swal("Cancelado", "Todo sigue como antes", "error");
                }
            });
    };

}])
