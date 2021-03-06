angular
.module('inspinia')

.controller('dashboardCtrl', ['$scope', '$state', '$http', function($scope, $state, $http){

    $scope.cargando = true;
    $scope.datosDashboard = {};

   

    $scope.getDatosDashboard = function (){

        $http.get('http://blackhop.api.dessin.com.ar/api/admin/dashboard').success(function(datosDashboard){    
            
            $scope.datosDashboard = datosDashboard;
       
            //Tendencia de ventas

            $scope.lunesPieChart = {
                data: [$scope.datosDashboard.procVentaPorDia[0], 100],
                options: {
                    fill: ["#1ab394", "#d7d7d7"]
                }
            };

            $scope.martesPieChart = {
                data: [$scope.datosDashboard.procVentaPorDia[1], 100],
                options: {
                    fill: ["#1ab394", "#d7d7d7"]
                }
            };
            $scope.miercolesPieChart = {
                data: [$scope.datosDashboard.procVentaPorDia[2], 100],
                options: {
                    fill: ["#1ab394", "#d7d7d7"]
                }
            };
            $scope.juevesPieChart = {
                data: [$scope.datosDashboard.procVentaPorDia[3], 100],
                options: {
                    fill: ["#1ab394", "#d7d7d7"]
                }
            };
            $scope.viernesPieChart = {
                data: [$scope.datosDashboard.procVentaPorDia[4], 100],
                options: {
                    fill: ["#1ab394", "#d7d7d7"]
                }
            };
            $scope.sabadoPieChart = {
                data: [$scope.datosDashboard.procVentaPorDia[5], 100],
                options: {
                    fill: ["#1ab394", "#d7d7d7"]
                }
            };
            $scope.domingoPieChart = {
                data: [$scope.datosDashboard.procVentaPorDia[6], 100],
                options: {
                    fill: ["#1ab394", "#d7d7d7"]
                }
            };

            for (var i = 0; i < $scope.datosDashboard.ventasAnualesPorMes[0].length; i++) {
                if($scope.datosDashboard.ventasAnualesPorMes[0][i] == null){
                    $scope.datosDashboard.ventasAnualesPorMes[0][i] = 0;           
                }
            }

            //datos por local de ventas por mes
                $scope.graficoVentasAnualesPorMes = [
                    [0,0],
                    [1,$scope.datosDashboard.ventasAnualesPorMes[0][0]],
                    [2,$scope.datosDashboard.ventasAnualesPorMes[0][1]],
                    [3,$scope.datosDashboard.ventasAnualesPorMes[0][2]],
                    [4,$scope.datosDashboard.ventasAnualesPorMes[0][3]],
                    [5,$scope.datosDashboard.ventasAnualesPorMes[0][4]],
                    [6,$scope.datosDashboard.ventasAnualesPorMes[0][5]],
                    [7,$scope.datosDashboard.ventasAnualesPorMes[0][6]],
                    [8,$scope.datosDashboard.ventasAnualesPorMes[0][7]],
                    [9,$scope.datosDashboard.ventasAnualesPorMes[0][8]],
                    [10,$scope.datosDashboard.ventasAnualesPorMes[0][9]],
                    [11,$scope.datosDashboard.ventasAnualesPorMes[0][10]],
                    [12,$scope.datosDashboard.ventasAnualesPorMes[0][11]]
                ];
                /*
                data2 = [
                    [0,0],
                    [1,2],
                    [2,7],
                    [3,4],
                    [4,11],
                    [5,4],
                    [6,2],
                    [7,5],
                    [8,11],
                    [9,5],
                    [10,4],
                    [11,1],
                    [12,5]
                ];

                data3 = [
                    [0,0],
                    [1,2],
                    [2,7],
                    [3,4],
                    [4,11],
                    [5,4],
                    [6,2],
                    [7,5],
                    [8,11],
                    [9,5],
                    [10,4],
                    [11,1],
                    [12,5]
                ];
                
                */

            var flotOptions = {
                series: {
                    lines: {
                        show: false,
                        fill: true
                    },
                    splines: {
                        show: true,
                        tension: 0.4,
                        lineWidth: 1,
                        fill: 0.4
                    },
                    points: {
                        radius: 0,
                        show: true
                    },
                    shadowSize: 2
                },
                grid: {
                    hoverable: true,
                    clickable: true,

                    borderWidth: 2,
                    color: 'transparent'
                },
                colors: ["#1ab394", "#1C84C6"],//un color por local
                xaxis:{
                },
                yaxis: {
                },
                tooltip: false
            };

            /**
             * Flot chart
             */
            //this.flotData = [data1, data2, data3];
            $scope.chart.flotData = [$scope.graficoVentasAnualesPorMes];
            $scope.chart.flotOptions = flotOptions;

            for (var i = 0; i < $scope.datosDashboard.ultimosSiete.length; i++) {
                 if($scope.datosDashboard.ultimosSiete[i] == null){
                    $scope.datosDashboard.ultimosSiete[i] = 0;           
                }
            }
            for (var i = 0; i < $scope.datosDashboard.ultimasCuatroWeeks.length; i++) {
                 if($scope.datosDashboard.ultimasCuatroWeeks[i] == null){
                    $scope.datosDashboard.ultimasCuatroWeeks[i] = 0;           
                }
            }
           


            $scope.cargando = false;
            console.log("$scope")
            console.log($scope)

        }).error(function(error){
            console.log(error);
        });        
    }

    $scope.getDatosDashboard();
     
            //var sparkline1Data = $scope.datosDashboard.ultimosSiete;
            var sparklineOptions = {
                type: 'line',
                width: '100%',
                height: '50',
                lineColor: '#1ab394',
                fillColor: "transparent"
            };
            //$scope.datosDashboard.ultimosSiete = [0,100,200,700,400,500,600];
            //$scope.datosDashboard.ultimasCuatroWeeks = [200,300,200,700];
            
            $scope.chart.sparklineOptions = sparklineOptions;

   


    
}])


.controller('AuthCtrl', ['$auth', '$state', '$http', '$rootScope','SweetAlert', function($auth, $state, $http, $rootScope,SweetAlert) {


    var vm = this;
    vm.ubicacion={};

    $http.get('http://blackhop.api.dessin.com.ar/api/info/ubicacion').success(function(ubicaciones){    
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
                    $http.get('http://blackhop.api.dessin.com.ar/api/v1/authenticate/full?sesion='+id).success(function(response){       
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
                    //validación
                    if (inputValue === "") {
                        swal.showInputError("Debes ingresar el monto incial en Caja!");
                        return false
                    }    
                    if (isNaN(inputValue)){
                        swal.showInputError("Debes ingresar un numero!");
                        return false
                    }
                    swal("Monto incial", "Abris la caja con: " + inputValue, "success");
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
                    $http.get('http://blackhop.api.dessin.com.ar/api/v1/authenticate/user', {
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
                            console.log(response.modo);
                            //Elijo de adonde tengo que enviarlo dependiendo de la respuesta response.modo
                            switch(response.modo){
                                case "admin":
                                if(response.usuarioRole == 'Admin'){
                                    $state.go('dashboards.dashboard_5');
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
.controller('cerrarSesionCtrl', ['$scope', '$state','$http', function($scope, $state,$http){
    
    
   
        console.log('asdasdasdasd1234');
        localStorage.removeItem('user');
        localStorage.removeItem('role');    
        localStorage.removeItem('satellizer_token');    

    $state.go("auth"); 

}])
//--------    NUEVO POS BARRA CTRL    --------

.controller('posBarraCtrl', ['$scope', '$state','$log','$uibModal','$http','SweetAlert', function($scope, $state,$log,$uibModal,$http,SweetAlert){

    //controller de barra

    $scope.ventaProductos =[];  
    $scope.marcasCervezas =[];

    $scope.getProductosBarra = function (){

        $http.get('http://blackhop.api.dessin.com.ar/api/pos/barra/producto').success(function(productos){    
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

                var codigoCupon = $scope.cuponSeleccionado.numero;

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

                                $http.post('http://blackhop.api.dessin.com.ar/api/pos/barra/venta', {
                                    codigo:$scope.cuponSeleccionado.numero,
                                    itemsVenta: JSON.stringify(itemsVenta),
                                }).success(function(response) {
                                    if(response.error == 'error'){
                                        SweetAlert.swal({
                                        title: "Hay un problema",
                                        text: response.mensaje,
                                        type: "warning",
                                        showCancelButton: true,
                                        confirmButtonColor: "#DD6B55",
                                        confirmButtonText: "¡Si, realizarlo!",
                                        cancelButtonText: "¡No, cancelar!",
                                        closeOnConfirm: false,
                                        closeOnCancel: false,
                                        html: true },
                                        function (isConfirm) {
                                            if (isConfirm) {
                                                $http.post('http://blackhop.api.dessin.com.ar/api/pos/barra/venta', {
                                                    flag: 'true',
                                                    codigo:codigoCupon,
                                                    itemsVenta: JSON.stringify(itemsVenta),
                                                }).success(function(response) {
                                                    //$scope.borrarTodo();
                                                    SweetAlert.swal("¡Realizado!", "Venta realizada", "success");
                                                    $scope.resumen.display='';
                                                    $scope.resumen.numeroProductos=-1;
                                                    $scope.resumen.productos=[];
                                                    $scope.resumen.total=0.00;
                                                    $scope.resumen.totalLitros=0;
                                                    $scope.resumen.selected=-1;
                                                    $scope.clienteSeleccionado=null;
                                                    $scope.cuponSeleccionado=null;
                                                }).error(function(error){
                                                    console.log(error);
                                                });              
                                                
                                            } else {
                                                SweetAlert.swal("Cancelado", "Todo sigue como antes", "error");
                                            }
                                        });
                                    }
                                    //$scope.borrarTodo();
                                }).error(function(error){
                                    console.log(error);
                                });              
                                //SweetAlert.swal("¡Realizado!", "Venta realizada", "success");
                                swal({
                                    title: "¡Realizado!",
                                    type: "success",
                                    text: "Venta realizada",
                                },
                                function(){
                                    //Llamo al modal para dejar listo para escanear, pedido de Gaston
                                    $scope.modal.scanearCupon();
                                });
                                $scope.resumen.display='';
                                $scope.resumen.numeroProductos=-1;
                                $scope.resumen.productos=[];
                                $scope.resumen.total=0.00;
                                $scope.resumen.totalLitros=0;
                                $scope.resumen.selected=-1;
                                $scope.clienteSeleccionado='';
                                $scope.cuponSeleccionado='';
                                


                            } else {
                                //SweetAlert.swal("Cancelado", "Todo sigue como antes", "error");
                                swal({
                                    title: "Cancelado!",
                                    type: "error",
                                    text: "Todo sigue como antes",
                                },
                                function(){
                                    //Llamo al modal para dejar listo para escanear, pedido de Gaston
                                    $scope.modal.scanearCupon();
                                });

                                //
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

    $http.get('http://blackhop.api.dessin.com.ar/api/pos/caja/canilla').success(function(canillas){    
        console.log(canillas);
        $scope.canillas = canillas.data;
    }).error(function(error){
        console.log(error);
    }) 

    $scope.alturaVentana = document.getElementById('page-top').clientHeight;

    $scope.ventaProductos =[];

    $scope.getAlertaAlquileres = function (){
        $http.get('http://blackhop.api.dessin.com.ar/api/pos/caja/alertaalquileres').success(function(response){
            $scope.alertaAlquileresRetiros = response.retiros;
            $scope.alertaAlquileresDevoluciones = response.devoluciones;
/*
    $scope.alertaAlquileresRetiros=[
        {
        id:"777",
        bandera:"retira",
        nombreCliente:"Lucas Del Pozzi",
        nombreEquipo:"Equipo 2",
        fecha:"Hoy",
        estilos:"IPA - Negra sucia",
        valor:"200"//dif valor - seña
        },
        {
        id:"778",
        bandera:"retira",
        nombreCliente:"Moresino",
        nombreEquipo:"Equipo 45",
        fecha:"Hoy",
        estilos:"No tiene idea",
        valor:"300"//dif valor - seña
        },
        {
        id:"779",
        bandera:"retiraM",
        nombreCliente:"Alejoys",
        nombreEquipo:"Equipo 123",
        fecha:"Mañana",
        estilos:"Gilada y Gilada"
        }
    ]
    $scope.alertaAlquileresDevoluciones=[
        {
        id:"780",
        bandera:"devolucion",
        nombreCliente:"Cochis Mochis",
        nombreEquipo:"Equipo 22",
        fecha:"Hoy"
        },
        {
        id:"781",
        bandera:"devolucion",
        nombreCliente:"Matias ",
        nombreEquipo:"Equipo 12",
        fecha:"Hoy"
        }
    ]
*/
        }).error(function(error){
            console.log(error);
        }) 
    }

    $scope.getAlertaAlquileres();

    $scope.clickNotificacion = function(dato){

        //if id ya esta
        

        if(dato.bandera === "retiraM"){
            //Nada nene
        } else if (dato.bandera === "retira"){
            //Agrego a lista de con monto de saldo (dato.valor)
            var flagEsta = true;
            $scope.resumen.productos.forEach(function(elem,array){
                if(elem.identificador == dato.id){
                    flagEsta = false;
                }
            });
            if(flagEsta){
                console.log("$scopasddsasdasade")
                console.log($scope)
                $scope.producto = dato;

                $scope.producto.categoria = "Retiro";
                $scope.producto.stock = -1;                            
                $scope.valorProducto = dato.valor;


                $scope.resumen.numeroProductos ++;

                $scope.resumen.total+=Number($scope.valorProducto);

                var ordinalItem=$scope.resumen.numeroProductos;
                $scope.resumen.selected=ordinalItem;
                var productoAGuardar={
                    id : ordinalItem,
                    identificador: dato.id,
                    valor : dato.valor,
                    nombre: 'Retiro alquiler - ' +  dato.nombreEquipo,
                    unidad:{
                        abr: "Un",
                        id: 2,
                        plural: "Unidades",
                        singular: "Unidad"
                    },
                    cantidad : 1,
                    valorTotal: dato.valor,
                    descuento:'',
                    stockActual:0,
                    productoReal:$scope.producto,
                    productoVirtual: dato
                }

                $scope.resumen.productos.push(productoAGuardar);

                $scope.clienteSeleccionado = dato.cliente;
                if($scope.clienteSeleccionado){
                    $scope.resumen.nombreClienteSeleccionado = $scope.clienteSeleccionado.nombre + ' '+ $scope.clienteSeleccionado.apellido ;
                }
                          
            }              


        } else if (dato.bandera == "devuelve"){
            //Modal preguntando si confirma devolucion MarioBros
                    SweetAlert.swal({
                        title: "Devolver Alquiler",
                        text: "Vas a ingresar la devolucion del " +  dato.nombreEquipo,
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Devolver",
                        cancelButtonText: "Cancelar",
                        closeOnCancel: true,
                        closeOnConfirm: true
                    },
                    function(isConfirm) {
                        if (isConfirm) {
                            //mariobros Cambiar Ruta 
                            $http.post('http://blackhop.api.dessin.com.ar/api/pos/caja/devolucionalquiler/' + dato.id)
                                .success(function() {
                                    swal("¡Devuelto!", "El Alquiler fue devuelto.", "success");
                                     $scope.getAlertaAlquileres();
                                }).error(function(error) {
                                    console.log(error.error);
                                    SweetAlert.swal("ERROR", error.error, "error"); 
                                });
                        } else {
                        swal("Cancelado", "Todo sigue como antes", "error");
                        }
                    });
        }
    }

    $scope.getProductos = function (){
        $http.get('http://blackhop.api.dessin.com.ar/api/pos/caja/producto').success(function(productos){    
            console.log(productos);
            $scope.ventaProductos = productos.data;

            //Agrego producto alquilable

            var alquilable = {
                categoria : 'Alquiler',
                valor : '',//el valor vuelve de el modal, cuando selecciono el producto
                marca : 'Blackhop',
                nombre : 'Alquiler',
                stock : -1,
                unidad : {
                    abr : 'Un.',
                    id : 2,
                    plural : 'Unidades',
                    singular : 'Unidad'
                }
            };

            $scope.ventaProductos.push(alquilable);
            
            
            
            for(var i = 0; i < $scope.ventaProductos.length; i++){
                /*
                if($scope.ventaProductos[i].categoria=='Alquiler'){
                    $scope.ventaProductos[i].stock=-1;
                }
                */
            };
        }).error(function(error){
            console.log(error);
        })
    }

    $scope.getProductos();

    $http.get('http://blackhop.api.dessin.com.ar/api/pos/caja/cliente').success(function(clientes){    
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

    $scope.anularCupon = function() {
        SweetAlert.swal({
                title: "Eliminar Cupon",
                text: "Ingresa el numero de cupon a eliminar:",
                type: "input",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "¡Eliminar!",
                cancelButtonText: "Cancelar",
                closeOnCancel: true,
                closeOnConfirm: false
            },
            function(inputValue) {
                if (inputValue === false) return false;

                if (inputValue === "") {
                    swal.showInputError("Tenes que escribir algo");
                    return false
                }

                swal({
                        title: "Estas seguro?",
                        text: "Vas a eliminar el cupon N˚ <span style='color:#F8BB86; font-weight:600'>" + inputValue,
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "¡Si, Eliminalo!",
                        cancelButtonText: "Cancelar",
                        closeOnConfirm: false,
                        closeOnCancel: false,
                        html: true
                    },
                    function(isConfirm) {
                        if (isConfirm) {
                            $http.post('http://blackhop.api.dessin.com.ar/api/pos/caja/anularcupon/' + inputValue)
                                .success(function() {
                                    swal("¡Eliminado!", "El cupon fue borrado.", "success");
                                }).error(function(error) {
                                    console.log(error.error);
                                    SweetAlert.swal("ERROR", error.error, "error"); 
                                });
                        } else {
                        swal("Cancelado", "Todo sigue como antes", "error");
                        }
                    });
        });
    }
        
    $scope.devolverAlqulier=function(){

        $scope.bajar='';  
                     

        var modalInstance = $uibModal.open({
            templateUrl: 'views/modal-devolucion_alquiler.html',
            controller: devolucionAlquilerCtrl, 
                    //controler en controllers.js, no termino de entender porque no lo puedo armar como el resto y si o si tengo que poner una funcion                        
                    windowClass: "animated fadeIn",
                    scope:$scope,
                    SweetAlert:SweetAlert,
                    resolve: {
                        clientes: function () {
                            return $scope.clientes;
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
                        $scope.clienteSeleccionado = null;
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
            });
            modalInstance.result.then(function (dato) {
                $scope.clienteSeleccionado = dato;
                if($scope.clienteSeleccionado){
                    $scope.resumen.nombreClienteSeleccionado = $scope.clienteSeleccionado.nombre + ' '+ $scope.clienteSeleccionado.apellido ;
                }
                console.log($scope.resumen)
                if(flag){
                  $scope.modal.terminarVenta();
              }
            });
            /*.closed.then(function(datosCliente){
                console.log('#########');
                console.log($scope.clienteSeleccionado);
                console.log('#########');
                if($scope.clienteSeleccionado){
                    $scope.resumen.nombreClienteSeleccionado = $scope.clienteSeleccionado.nombre + ' '+ $scope.clienteSeleccionado.apellido ;
                }
                console.log($scope.resumen)
                if(flag){
                  $scope.modal.terminarVenta();
              }
          });*/

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

        $http.get('http://blackhop.api.dessin.com.ar/api/admin/cliente/'+id).success(function(clienteDer){    
            //console.log(clienteDer);
            $scope.clienteDer = clienteDer.data;
            $scope.clienteDer.fechaNacimiento=moment($scope.clienteDer.fechaNacimiento).locale('es').format('DD/MMM/YYYY');

            $http.get('http://blackhop.api.dessin.com.ar/api/admin/clienteactividad/'+id).success(function(actividad){    
                
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

        $http.get('http://blackhop.api.dessin.com.ar/api/admin/cliente').success(function(cliente){    
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

                    $http.delete('http://blackhop.api.dessin.com.ar/api/admin/cliente/'+id).success(function(response){    


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
        
        $http.put('http://blackhop.api.dessin.com.ar/api/admin/cliente/'+id,{
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

        $http.get('http://blackhop.api.dessin.com.ar/api/admin/proveedor/'+id).success(function(proveedorDer){    
            //console.log(proveedorDer);
            $scope.proveedorDer = proveedorDer.data;

            $http.get('http://blackhop.api.dessin.com.ar/api/admin/proveedoractividad/'+id).success(function(actividad){    
                
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

        $http.get('http://blackhop.api.dessin.com.ar/api/admin/proveedor').success(function(proveedor){    
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

                    $http.delete('http://blackhop.api.dessin.com.ar/api/admin/proveedor/'+id).success(function(response){    


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
        
        $http.put('http://blackhop.api.dessin.com.ar/api/admin/proveedor/'+id,{
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

         $http.get('http://blackhop.api.dessin.com.ar/api/admin/venta').success(function(response){    
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
           $http.get('http://blackhop.api.dessin.com.ar/api/admin/compra').success(function(response){    
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
       $http.get('http://blackhop.api.dessin.com.ar/api/admin/compradatos').success(function(response){
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
            $http.get('http://blackhop.api.dessin.com.ar/api/admin/compra/' + compra.id).success(function(response){    
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
    DTColumnDefBuilder.newColumnDef(3),
    DTColumnDefBuilder.newColumnDef(4),
    DTColumnDefBuilder.newColumnDef(5),
    DTColumnDefBuilder.newColumnDef(6),
    DTColumnDefBuilder.newColumnDef(7).notSortable().withOption('sWidth', '200px'),
    ]




        /**
         * cupones 
         */
         $http.get('http://blackhop.api.dessin.com.ar/api/admin/cupon').success(function(response){    
            
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
                $http.put('http://blackhop.api.dessin.com.ar/api/admin/extendercupon/'+i)
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
                $http.put('http://blackhop.api.dessin.com.ar/api/admin/invalidarcupon/'+i)
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
        //EL MORE WN
        $scope.imprimir= function (cupon){
            console.log(cupon);
            if(cupon.tipo == 'Alquiler'){
                var modalInstance = $uibModal.open({
                    templateUrl: 'views/imprimir_alquiler.html',
                    controller: imprimirAlquilerCtrl,
                    windowClass: "animated flipInY",
                    resolve: {
                        alquiler: function () {
                            return cupon.cuponAlq;
                        }
                    }
                }).closed.then(function(){
                    console.log('modal imprimir alquiler closed');
                });
            }else{
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
        }


    }])

.controller('productosCtrl', ['$http','$scope','$log','$uibModal','$filter','DTOptionsBuilder','DTColumnDefBuilder','SweetAlert', function($http,$scope,$log,$uibModal,$filter,DTOptionsBuilder,DTColumnDefBuilder,SweetAlert){


    $scope.productos = [];
    $scope.getProductos = function (){

        $http.get('http://blackhop.api.dessin.com.ar/api/admin/producto').success(function(productos){    
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
        abrir : function (producto){//ta al pedo esto
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
                    SweetAlert:SweetAlert,
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

.controller('alquileresCtrl', ['$http','$scope','$log','$uibModal','DTOptionsBuilder','DTColumnDefBuilder','SweetAlert', function($http,$scope,$log,$uibModal,DTOptionsBuilder,DTColumnDefBuilder,SweetAlert){

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
            }, text: 'Imprimir'
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

        $scope.getAlquileres=function(){
            $http.get('http://blackhop.api.dessin.com.ar/api/admin/alquiler')
            .success(function(response){    
                $scope.alquileres = response.data;
                for(var i = 0; i < $scope.alquileres.length; i++){            
                        $scope.calcularEstado(i);                
                }
                
            }).error(function(error){
                console.log(error);
            }); 
       }; 
        $scope.getAlquileres();
        //calculo estado en base a las fechas si !Finalizado

        $scope.calcularEstado=function(indice){
            switch ($scope.alquileres[indice].estado){
                case 'Con Retraso':
                    $scope.alquileres[indice].class= "badge-danger";
                break;
                case 'Creado':
                    $scope.alquileres[indice].class= "badge-primary";
                break; 
                case 'Retirado':
                    $scope.alquileres[indice].class= "badge-warning";
                break;
            };
            
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
                    SweetAlert:SweetAlert,
                    resolve: {
                        alquiler: function () {
                            return alquiler;
                        }
                        
                    }
                });
                modalInstance.result.then(function(data){
                    //console.log('PRI ' + data);
                },function(data){
                    if(data == 'eliminado'){
                        $scope.getAlquileres();
                    }
                });

            }
        }
    }])

.controller('productosInventarioCtrl', ['$http','$scope','$log','$uibModal','$filter','DTOptionsBuilder','DTColumnDefBuilder','SweetAlert',function($http,$scope,$log,$uibModal,$filter,DTOptionsBuilder,DTColumnDefBuilder,SweetAlert){


    $scope.productosInventario =[]

    $scope.getProductosInventario = function (){

        $http.get('http://blackhop.api.dessin.com.ar/api/admin/inventarios').success(function(productos){    
            
            console.log(productos);
            $scope.productosInventario = productos.data;
            
        }).error(function(error){
            console.log(error);
        });        
    }
    
    $scope.getProductosInventario();


    $scope.ubicaciones =[]
    
    $scope.getUbicaciones = function (){

        $http.get('http://blackhop.api.dessin.com.ar/api/admin/ubicaciones').success(function(ubicaciones){    
            
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

.controller('alquilablesCtrl', ['$scope','$http','$log','$uibModal','$filter','DTOptionsBuilder','DTColumnDefBuilder','SweetAlert', function($scope,$http,$log,$uibModal,$filter,DTOptionsBuilder,DTColumnDefBuilder,SweetAlert){

        //recibo 0 para alquilado y 1 para disponible
        //ToDo traer listado alquilables

        $scope.getAlquilables = function(){
            $scope.alquilables = [];
            $http.get('http://blackhop.api.dessin.com.ar/api/admin/alquilable')
            .success(function(response){    
                $scope.alquilables = response.data;

                for(var i = 0; i < $scope.alquilables.length; i++){
                    switch ($scope.alquilables[i].estado){
                        case 'Disponible':
                        $scope.alquilables[i].class= "badge-primary";
                        break;
                        case 'Alquilado':
                        $scope.alquilables[i].class= "badge-warning";
                        break; 
                    }
                };
            }).error(function(error){
                console.log(error);
            });
        }

        $scope.getAlquilables();

        

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
                        console.log(ident);
                        $http.delete('http://blackhop.api.dessin.com.ar/api/admin/alquilable/'+ident)
                        .success(function(data){    
                            SweetAlert.swal("¡Eliminado!", data.data.message, "success");
                            $scope.getAlquilables();
                        }).error(function(data){
                            console.log(data.error.message);
                            SweetAlert.swal("Error", data.error.message, "error");
                        });
                    } else {
                        SweetAlert.swal("Cancelado", "Todo sigue como antes", "error");
                    }
                });
        };

        $scope.modal={
            crear : function (){
                var modalInstance = $uibModal.open({
                    templateUrl: 'views/modal-crear_alquilable.html',
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

                modalInstance.result.then(
                    function(data){
                        console.log('Primer Result - '+data);
                    },
                    function(data){
                        console.log('Segundo Result - '+data);
                        data.class= "badge-primary";
                        $scope.alquilables.push(data);
                    }   
                );
            },
            editar : function (alquilable){
                var modalInstance = $uibModal.open({
                    templateUrl: 'views/modal-crear_alquilable.html',
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

                modalInstance.result.then(
                    function(data){
                        console.log('Primer Result - '+data);
                    },
                    function(data){
                        console.log('Segundo Result - '+data);
                        data.class= "badge-primary";
                        $scope.alquilables.forEach(function(elem,index,array){
                            if(elem.id == data.id){
                                array[index]=data;
                            }
                        });
                    }   
                );
            }
        }
    }])

.controller('gastosCtrl', ['$http','$scope','$log','$uibModal','$filter','DTOptionsBuilder','DTColumnDefBuilder','SweetAlert', function($http,$scope,$log,$uibModal,$filter,DTOptionsBuilder,DTColumnDefBuilder,SweetAlert){

    $scope.getGastos = function(){
        $scope.gastos = [];
        $http.get('http://blackhop.api.dessin.com.ar/api/admin/gasto')
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
                    
                    $http.delete('http://blackhop.api.dessin.com.ar/api/admin/gasto/'+ident)
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

                $http.post('http://blackhop.api.dessin.com.ar/api/admin/gasto',{
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
            $http.put('http://blackhop.api.dessin.com.ar/api/admin/canilla/'+idCanilla,{
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

                $http.put('http://blackhop.api.dessin.com.ar/api/admin/gasto/'+gasto.identificador,{
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

 $http.get('http://blackhop.api.dessin.com.ar/api/admin/historial')
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

    $http.get('http://blackhop.api.dessin.com.ar/api/admin/historialbarra')
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

    $http.get('http://blackhop.api.dessin.com.ar/api/admin/historialcaja')
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
    $http.get('http://blackhop.api.dessin.com.ar/api/admin/canilla').success(function(canillas){    
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

            $http.put('http://blackhop.api.dessin.com.ar/api/admin/canilla/'+idCanilla,{
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
