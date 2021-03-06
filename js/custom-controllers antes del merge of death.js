angular
.module('inspinia')


.controller('AuthCtrl', ['$auth', '$state', '$http', '$rootScope','SweetAlert', function($auth, $state, $http, $rootScope,SweetAlert) {


    var vm = this;
    vm.ubicacion={};

    $http.get('http://blackhop.api.dessin.com.ar/api/info/ubicacion').success(function(ubicaciones){    
        console.log(ubicaciones);
        vm.ubicaciones = ubicaciones.data;
    }).error(function(error){
        console.log(error);
    });
/*
  vm.ubicaciones =[
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

vm.usuarios =[
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
*/

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
                /*
                for(var i = 0; i < vm.usuarios.length; i++){

                    if (vm.usuarios[i].id == id){                    
                        vm.usuarios.splice(i, 1);
                        break;
                    }
                }
                */
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
                    email: vm.email,
                    password: vm.password
                }

                //Funcion de Satellizer para generar el token
                $auth.login(credentials).then(function() {

                    //Hace un get con el Token ya seteado para retornar el nombre del usuario, el rol y crear la sesion en
                    // caso de requerirlo (NO ADMIN)
                    $http.get('http://blackhop.api.dessin.com.ar/api/v1/authenticate/user?modo='+vm.modo+'&ubicacion='+vm.ubicacion.selected.id+'').success(function(response){       


                        if(response.modo != 'limite'){
                            //Seteo de Variables en Local Storage
                            localStorage.setItem('user', response.usuarioName);
                            localStorage.setItem('role', response.usuarioRole);

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
                        alert("PONER UN MODAL DE INVALID CREDENTIALS O ALGO");
                    }
                    console.log(err);
                });
            
        }//Fin del function login

    }])
.controller('posCtrl', ['$scope', '$state','$log','$uibModal','$http','SweetAlert', function($scope, $state,$log,$uibModal,$http,SweetAlert){



            $http.get('http://blackhop.api.dessin.com.ar/api/pos/caja/canilla').success(function(canillas){    
                console.log(canillas);
                $scope.canillas = canillas.data;
            }).error(function(error){
                console.log(error);
            }) 



        $scope.ventaProductos =[];  
        $scope.marcasCervezas =[];


        
        $http.get('http://blackhop.api.dessin.com.ar/api/pos/caja/producto').success(function(productos){    
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
        }) 
        
    
        
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
            recalculando(index,modTotal){
                console.log("recalculando");

                console.log('$scope.resumen.productos')
                console.log($scope.resumen.productos)


                $scope.resumen.total=0;
                $scope.resumen.totalLitros=0;
                newOrder=0;
                $scope.resumen.productos.forEach(function(producto) {

                    console.log('producto')
                    console.log(producto) 
                    console.log('producto.productoReal.unidad.abr ')
                    console.log(producto.productoReal.unidad.abr )

                    $scope.resumen.total+=Number(producto.valorTotal);
                    if(producto.productoReal.unidad.abr == 'Lts.'){ //sumar solo si la unidad es litros
                        $scope.resumen.totalLitros +=Number(producto.cantidad);

                    }    
                    producto.id= newOrder;
                    newOrder++;        
                    console.log(index.undefined);
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
                console.log($scope.resumen);
            }
        }
        $scope.asignarCanillas=function(){
            $scope.bajar='';
            


            var modalInstance = $uibModal.open({
                templateUrl: 'views/asignar_canillas.html',
                controller: asignarCanillasCtrl, 
                    //controler en controllers.js, no termino de entender porque no lo puedo armar como el resto y si o si tengo que poner una funcion                        
                    windowClass: "animated fadeIn",
                    scope:$scope,
                    resolve: {
                        canillas: function () {
                            return $scope.canillas;
                        },
                        gastoEdit:function () {
                            return '';
                        }
                    }
                });

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
                    $state
                    
                });
        }
        $scope.terminarSesionBarra=function(){

            $scope.bajar='';                
            
            var modalInstance = $uibModal.open({
                templateUrl: 'views/modal-terminar_sesion_barra.html',
                controller: terminarSesionBarraCtrl,                        
                    windowClass: "animated fadeIn",
                    scope:$scope,
                    SweetAlert:SweetAlert,
                    $state
                    
                });
        }
        
        
        $scope.modal={

            scanearCupon(){
                $scope.cupon='';
                var modalInstance = $uibModal.open({
                    templateUrl: 'views/modal_scanear-cupon.html',
                    controller: scanearCuponCtrl,
                    windowClass: "animated fadeIn",
                    scope: $scope //paso el scope completo asi lo puedo llenar sin dar vueltas (no se hace :P )
                });
            },
            
            terminarVentaBarra(){

                if ($scope.clienteSeleccionado){
                    var modalInstance = $uibModal.open({
                        templateUrl: 'views/modal-terminar_venta_barra.html',
                        controller: terminarVentaBarraCtrl,
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
                } else {               
                    //?
                }
            },
            
            terminarVenta(){

                console.log('$scope.clienteSeleccionado');
                console.log($scope.clienteSeleccionado);
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
                    }).closed.then(function(){

                        //cancela el finalizar, que hago? borro todo? y si solo qeria agregar mas? o si se arrepintio?

                    });                   

                    
                } else {                    
                    $scope.modal.abrir(true);
                }
            },

            abrir(flag){
                var modalInstance = $uibModal.open({
                    templateUrl: 'views/modal_abrir_cliente.html',
                    controller: modalControler,
                    windowClass: "animated fadeIn",
                    resolve: {
                        clientes: function () {
                            return $scope.clientes;
                        }
                    }
                }).closed.then(function(){
                    if(flag){
                      $scope.modal.terminarVenta();
                  }
              });

            },

            imprimir(){

                if ($scope.resumen.numeroProductos<0){ 

                    //No hay articulos y solo quiere imprimir el turno

                    var modalInstance = $uibModal.open({
                        templateUrl: 'views/imprimir_turno.html',
                        controller: imprimirTurnoCtrl, 
                        windowClass: "animated flipInY"
                    });
                } else {
                    $scope.modal.terminarVenta();
                }
            }

        }
    }

    ])     

.controller('clientesCtrl', ['$scope','$log','$uibModal','$filter','DTOptionsBuilder','DTColumnDefBuilder','SweetAlert', function($scope,$log,$uibModal,$filter,DTOptionsBuilder,DTColumnDefBuilder,SweetAlert){

   $scope.clientes =[
            /*
              estado =
              Activo : si compro algo en el utlimo mes
              Con Alquiler: Si tiene algo alquilado
              Deudor : Si tiene un alquiler sin devolver
              '' : Si ninguno de los anteriores
              */

              {
                identificador:1,
                nombre:"Luciano",
                apellido:"Marquez",
                dni:"32523681",
                telefono:4412007,
                celular:2996041216,
                email:"correo@direccion.com.ar",
                fNac:new Date("11/07/1982"),
                direccion:"San Martin 546",
                GIS:null,
                estado:'Con Alquiler'

            },
            {
                identificador:2,
                nombre:"Antonio",
                apellido:"Rodriguez",
                dni:"23598745",
                telefono:4460286,
                celular:2995433634,
                email:"correo@direccion.com.ar",
                fNac:new Date("10/05/1982"),
                direccion:"Rosa de los Vientos 12",
                GIS:null,
                estado:'Activo'

            },
            {
                identificador:3,
                nombre:"Fiorella",
                apellido:"Salas",
                dni:"12369854",
                telefono:4432504,
                celular:2995691627,
                email:"correo@direccion.com.ar",
                fNac:new Date("10/06/1983"),
                direccion:"Garganta de los Montes 455",
                GIS:null,
                estado:''

            },
            {
                identificador:4,
                nombre:"Mafalda",
                apellido:"Barela",
                dni:"35698756",
                telefono:4416250,
                celular:2996888259,
                email:"correo@direccion.com.ar",
                fNac:new Date("02/09/1983"),
                direccion:"Constitución 26",
                GIS:null,
                estado:'Activo'

            },
            {
                identificador:5,
                nombre:"Liza",
                apellido:"Ortega",
                dni:"35478123",
                telefono:4412007,
                celular:2996440850,
                email:"correo@direccion.com.ar",
                fNac:new Date("04/05/1985"),
                direccion:"Rivadavia 568",
                GIS:null,
                estado:''

            },
            {
                identificador:6,
                nombre:"Juan",
                apellido:"Colón",
                dni:"18721770",
                telefono:4401698,
                celular:2995664192,
                email:"correo@direccion.com.ar",
                fNac:new Date("10/05/1995"),
                direccion:"Ant Argentina 382",
                GIS:null,
                estado:''

            },
            {
                identificador:7,
                nombre:"Ruben",
                apellido:"Pacheco",
                dni:"28278982",
                telefono:4420691,
                celular:2996646540,
                email:"correo@direccion.com.ar",
                fNac:new Date("06/04/1995"),
                direccion:"Juan B. Justo 452",
                GIS:null,
                estado:'Activo'

            },
            {
                identificador:8,
                nombre:"Simon",
                apellido:"Garcia",
                dni:"31926283",
                telefono:4401919,
                celular:2995025237,
                email:"correo@direccion.com.ar",
                fNac:new Date("08/06/1994"),
                direccion:"Rio Desaguadero 672",
                GIS:null,
                estado:''

            },
            {
                identificador:9,
                nombre:"Roberto",
                apellido:"Estrada",
                dni:"28081048",
                telefono:4467043,
                celular:2996950755,
                email:"correo@direccion.com.ar",
                fNac:new Date("09/05/1990"),
                direccion:"Independencia 823",
                GIS:null,
                estado:'Deudor'

            },
            {
                identificador:10,
                nombre:"Lionel",
                apellido:"Villar",
                dni:"35933306",
                telefono:4467043,
                celular:2995184011,
                email:"correo@direccion.com.ar",
                fNac:new Date("11/04/1986"),
                direccion:"Brown 933",
                GIS:null,
                estado:'Activo'

            },
            {
                identificador:11,
                nombre:"Esteban",
                apellido:"Varella",
                dni:"30993900",
                telefono:4406768,
                celular:2996950755,
                email:"correo@direccion.com.ar",
                fNac:new Date("04/01/1990"),
                direccion:"Jujuy 856",
                GIS:null,
                estado:'Activo'

            },
            {
                identificador:12,
                nombre:"Nicolas",
                apellido:"Franccesco",
                dni:"31058801",
                telefono:4434850,
                celular:2995830889,
                email:"correo@direccion.com.ar",
                fNac:new Date("06/07/1989"),
                direccion:"Alderete 596",
                GIS:null,
                estado:'Activo'
            }]

            for(var i = 0; i < $scope.clientes.length; i++){
                $scope.clientes[i].fNac=moment($scope.clientes[i].fNac).locale('es').format('DD/MMM/YYYY')
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
            };

            var clienteDer= $filter("filter")($scope.clientes, {identificador:1});
            $scope.clienteDer = angular.copy(clienteDer[0]);


            $scope.onCopy = function(ident){
                $scope.clienteDer='';
                var clienteDer= $filter("filter")($scope.clientes, {identificador:ident});
                /*Dat FIX*/
                $scope.clienteDer = angular.copy(clienteDer[0]);
            };

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
                            for(var i = 0; i < $scope.clientes.length; i++){
                                if ($scope.clientes[i].id == ident){                    
                                    $scope.clientes.splice(i, 1);
                                    break;
                                }
                            }
                            SweetAlert.swal("¡Eliminado!", "El cliente ha sido eliminado", "success");
                            $scope.clienteDer='';
                            $scope.clienteDer = angular.copy($scope.clientes[0]);
                        } else {
                            SweetAlert.swal("Cancelado", "Todo sigue como antes", "error");
                        }
                    });
            };

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
                abrir(){
                    var modalInstance = $uibModal.open({
                        templateUrl: 'views/modal_crear_cliente.html',
                        controller: modalControler,
                        windowClass: "animated fadeIn",
                        resolve: {
                            clientes: function () {
                                return $scope.clientes;
                            }
                        }
                    });
                }
            }
        }])

.controller('proveedoresCtrl', ['$scope','$log','$uibModal','$filter','DTOptionsBuilder','DTColumnDefBuilder','SweetAlert','Upload', function($scope,$log,$uibModal,$filter,DTOptionsBuilder,DTColumnDefBuilder,SweetAlert,Upload){

        // upload on file select or drop
        $scope.upload = function (file) {
            Upload.upload({
                url: '/',
                data: {file: file, 'username': $scope.username}
            }).then(function (resp) {
                console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            }, function (resp) {
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            });
        };

        $scope.proveedores =[
        {
            identificador:1,
            nombre:"Crafter",
            direccion:"Ruta 151 km. 123",
            telefono:"4412345",
            email:"correo@direccion.com.ar",
            mPago:"30 dias F. Factura",
            cuit:"30-12345678/3",
            contacto:"Luciano Marquez",
            telefonoContacto:"2996041216",
            imagen:"img/c1.jpg",
            GIS:null   
        },
        {
            identificador:2,
            nombre:"Kalevala",
            direccion:"San Martin 546",
            telefono:"4412345",
            email:"correo@direccion.com.ar",
            mPago:"20 dias F. Factura",
            cuit:"30-12345678/3",
            contacto:"Antonio Rodriguez",
            telefonoContacto:"2995433634",
            imagen:"img/c2.jpg",
            GIS:null   
        },
        {
            identificador:3,
            nombre:"Botellas SRL",
            direccion:"Rosa de los Vientos 12",
            telefono:"4412345",
            email:"correo@direccion.com.ar",
            mPago:"30 dias F. Factura",
            cuit:"30-964542035/3",
            contacto:"Fiorella Salas",
            telefonoContacto:"2995691627",
            imagen:"img/c3.png",
            GIS:null   
        },
        {
            identificador:4,
            nombre:"Tapas SRL",
            direccion:"Garganta de los Montes 455",
            telefono:"4412345",
            email:"correo@direccion.com.ar",
            mPago:"Contado",
            cuit:"30-456844328/3",
            contacto:"Martin Moreira",
            telefonoContacto:"2996888259",
            imagen:"img/c1.jpg",
            GIS:null   
        },
        {
            identificador:5,
            nombre:"Dessin",
            direccion:"Constitución 26",
            telefono:"4412345",
            email:"correo@direccion.com.ar",
            mPago:"90 dias F. Factura",
            cuit:"30-362512386/3",
            contacto:"Mafalda Barela",
            telefonoContacto:"2996440850",
            imagen:"img/c2.jpg",
            GIS:null   
        },
        {
            identificador:6,
            nombre:"Quantum",
            direccion:"Rivadavia 568",
            telefono:"4412345",
            email:"correo@direccion.com.ar",
            mPago:"15 dias F. Factura",
            cuit:"30-89653248/3",
            contacto:"Liza Ortega",
            telefonoContacto:"2995664192",
            imagen:"img/c3.png",
            GIS:null   
        },
        {
            identificador:7,
            nombre:"Antares",
            direccion:"Ant Argentina 382",
            telefono:"4412345",
            email:"correo@direccion.com.ar",
            mPago:"60 dias F. Factura",
            cuit:"30-635441789/3",
            contacto:"Juan Colón",
            telefonoContacto:"2996646540",
            imagen:"img/c1.jpg",
            GIS:null   
        },
        {
            identificador:8,
            nombre:"Proveedor SA",
            direccion:"Juan B. Justo 452",
            telefono:"4412345",
            email:"correo@direccion.com.ar",
            mPago:"30 dias F. Factura",
            cuit:"30-12345678/3",
            contacto:"Ruben Pacheco",
            telefonoContacto:"2995025237",
            imagen:"img/c2.jpg",
            GIS:null   
        },
        {
            identificador:9,
            nombre:"Etiquetas SRL",
            direccion:"Independencia 823",
            telefono:"4412345",
            email:"correo@direccion.com.ar",
            mPago:"30 dias F. Factura",
            cuit:"30-789260684/3",
            contacto:"Simon Garcia",
            telefonoContacto:"2995123456",
            imagen:"img/c1.jpg",
            GIS:null   
        },
        {
            identificador:10,
            nombre:"Nuevo Origen",
            direccion:"Rio Desaguadero 672",
            telefono:"4412345",
            email:"correo@direccion.com.ar",
            mPago:"30 dias F. Factura",
            cuit:"30-95612345/3",
            contacto:"Roberto Estrada",
            telefonoContacto:"2996950755",
            imagen:"img/c3.png",
            GIS:null   
        },
        {
            identificador:11,
            nombre:"La Papeleria",
            direccion:"Constitución 456",
            telefono:"4412345",
            email:"correo@direccion.com.ar",
            mPago:"30 dias F. Factura",
            cuit:"30-76834532/3",
            contacto:"Martin Moreira",
            telefonoContacto:"2995184011",
            imagen:"img/c1.jpg",
            GIS:null   
        },
        {
            identificador:12,
            nombre:"Productos SA",
            direccion:"Garganta de los Montes 455",
            telefono:"4412345",
            email:"correo@direccion.com.ar",
            mPago:"30 dias F. Factura",
            cuit:"30-76429823/3",
            contacto:"Lionel Villar",
            telefonoContacto:"2996188911",
            imagen:"img/c2.jpg",
            GIS:null               
        }]


        var proveedorDer= $filter("filter")($scope.proveedores, {identificador:'1'});

        $scope.proveedorDer = angular.copy(proveedorDer[0]);


        $scope.onCopy = function(ident){
            $scope.proveedorDer='';
            var proveedorDer= $filter("filter")($scope.proveedores, {identificador:ident});
            /*Dat FIX*/
            $scope.proveedorDer = angular.copy(proveedorDer[0]);
        };

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
                        for(var i = 0; i < $scope.proveedores.length; i++){
                            if ($scope.proveedores[i].id == ident){                    
                                $scope.proveedores.splice(i, 1);
                                break;
                            }
                        }
                        SweetAlert.swal("¡Eliminado!", "El proveedor ha sido eliminado", "success");
                        $scope.proveedorDer='';
                        $scope.proveedorDer = angular.copy($scope.proveedores[0]);
                    } else {
                        SweetAlert.swal("Cancelado", "Todo sigue como antes", "error");
                    }
                });
        };

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
            abrir(){
                var modalInstance = $uibModal.open({
                    templateUrl: 'views/modal_crear_proveedor.html',
                    controller: modalProveedoresControler,
                    windowClass: "animated fadeIn", 
                    scope:$scope,
                });
            }
        }
    }])

.controller('ventasCtrl', ['$scope','$log','$uibModal','DTOptionsBuilder','DTColumnDefBuilder', function($scope,$log,$uibModal,DTOptionsBuilder,DTColumnDefBuilder){

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
    DTColumnDefBuilder.newColumnDef(4).notSortable()
    ]
        /**
         * ventas 
         */
         $scope.ventas = [
         {
            id: '1',
            cliente: 'Monica Geller',
            fecha: '10/6/15',
            monto:'150.00'
        },
        {
            id: '2',
            cliente: 'Rachel Green',
            fecha: '10/6/15',
            monto:'300.00'
        },
        {
            id: '3',
            cliente: 'Chandler Bing',
            fecha: '10/6/15',
            monto:'150.00'
        },
        {
            id: '4',
            cliente: 'Joseph Tribbiani',
            fecha: '10/6/15',
            monto:'150.00'
        },
        {
            id: '5',
            cliente: 'Phoeebe Buffey',
            fecha: '10/6/15',
            monto:'150.00'
        },
        {
            id: '6',
            cliente: 'Monica Geller',
            fecha: '10/6/15',
            monto:'150.00'
        },
        {
            id: '7',
            cliente: 'Rachel Green',
            fecha: '10/6/15',
            monto:'300.00'
        },
        {
            id: '8',
            cliente: 'Phoeebe Buffey',
            fecha: '10/6/15',
            monto:'150.00'
        },
        {
            id: '9',
            cliente: 'Monica Geller',
            fecha: '10/6/15',
            monto:'150.00'
        },
        {
            id: '10',
            cliente: 'Rachel Green',
            fecha: '11/6/15',
            monto:'300.00'
        },
        {
            id: '11',
            cliente: 'Chandler Bing',
            fecha: '11/6/15',
            monto:'150.00'
        },
        {
            id: '12',
            cliente: 'Joseph Tribbiani',
            fecha: '11/6/15',
            monto:'150.00'
        },
        {
            id: '13',
            cliente: 'Phoeebe Buffey',
            fecha: '12/6/15',
            monto:'150.00'
        },
        {
            id: '14',
            cliente: 'Monica Geller',
            fecha: '12/6/15',
            monto:'150.00'
        },
        {
            id: '15',
            cliente: 'Rachel Green',
            fecha: '12/6/15',
            monto:'300.00'
        },
        {
            id: '16',
            cliente: 'Chandler Bing',
            fecha: '10/6/15',
            monto:'150.00'
        },
        {
            id: '17',
            cliente: 'Joseph Tribbiani',
            fecha: '12/6/15',
            monto:'150.00'
        },
        {
            id: '18',
            cliente: 'Phoeebe Buffey',
            fecha: '12/6/15',
            monto:'150.00'
        },
        {
            id: '19',
            cliente: 'Phoeebe Buffey',
            fecha: '10/6/15',
            monto:'150.00'
        },
        {
            id: '20',
            cliente: 'Phoeebe Buffey',
            fecha: '13/6/15',
            monto:'150.00'
        },
        {
            id: '21',
            cliente: 'Monica Geller',
            fecha: '13/6/15',
            monto:'150.00'
        },
        {
            id: '22',
            cliente: 'Rachel Green',
            fecha: '13/6/15',
            monto:'300.00'
        },
        {
            id: '23',
            cliente: 'Chandler Bing',
            fecha: '13/6/15',
            monto:'150.00'
        },
        {
            id: '24',
            cliente: 'Joseph Tribbiani',
            fecha: '13/6/15',
            monto:'150.00'
        },
        {
            id: '25',
            cliente: 'Phoeebe Buffey',
            fecha: '13/6/15',
            monto:'150.00'
        },
        {
            id: '26',
            cliente: 'Monica Geller',
            fecha: '14/6/15',
            monto:'150'
        },
        {
            id: '27',
            cliente: 'Rachel Green',
            fecha: '14/6/15',
            monto:'300.00'
        },
        {
            id: '28',
            cliente: 'Phoeebe Buffey',
            fecha: '14/6/15',
            monto:'150.00'
        },
        {
            id: '29',
            cliente: 'Monica Geller',
            fecha: '14/6/15',
            monto:'150.00'
        },
        {
            id: '30',
            cliente: 'Monica Geller',
            fecha: '14/6/15',
            monto:'150.00'
        },
        {
            id: '31',
            cliente: 'Monica Geller',
            fecha: '15/6/15',
            monto:'150.00'
        },
        {
            id: '32',
            cliente: 'Rachel Green',
            fecha: '15/6/15',
            monto:'300.00'
        },
        {
            id: '33',
            cliente: 'Chandler Bing',
            fecha: '10/6/15',
            monto:'150'
        },
        {
            id: '34',
            cliente: 'Joseph Tribbiani',
            fecha: '10/6/15',
            monto:'150.00'
        },
        {
            id: '35',
            cliente: 'Phoeebe Buffey',
            fecha: '16/6/15',
            monto:'150.00'
        },
        {
            id: '36',
            cliente: 'Monica Geller',
            fecha: '16/6/15',
            monto:'150.00'
        },
        {
            id: '37',
            cliente: 'Rachel Green',
            fecha: '16/6/15',
            monto:'300.00'
        },
        {
            id: '38',
            cliente: 'Phoeebe Buffey',
            fecha: '16/6/15',
            monto:'150.00'
        },
        {
            id: '39',
            cliente: 'Monica Geller',
            fecha: '16/6/15',
            monto:'150.00'
        },
        {
            id: '40',
            cliente: 'Rachel Green',
            fecha: '17/6/15',
            monto:'300.00'
        }
        ];

        $scope.ok = function () {
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.modal={
            abrir(venta){
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

.controller('comprasCtrl', ['$scope','$log','$uibModal','DTOptionsBuilder','DTColumnDefBuilder', function($scope,$log,$uibModal,DTOptionsBuilder,DTColumnDefBuilder){

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
         $scope.compras = [
         {
            id: '1',
            nombreProveedor:'Crafter',
            proveedorId:1,
            estado: 'Pedido',
            fecha: new Date('06/10/15'),
            monto:'1500.00'
        },
        {
            id: '2',
            nombreProveedor:'Nuevo Origen',
            proveedorId:10,
            estado: 'Pagado',
            fecha: new Date('06/10/15'),
            monto:'1000.00'
        },
        {
            id: '3',
            nombreProveedor:'Botellas SRL',
            proveedorId:3,
            estado: 'Finalizado',
            fecha: new Date('06/10/15'),
            monto:'2500.25'
        },
        {
            id: '4',
            nombreProveedor:'Nuevo Origen',
            proveedorId:10,
            estado: 'Pagado',
            fecha: new Date('06/10/15'),
            monto:'1000.00'
        },
        {
            id: '5',
            nombreProveedor:'Tapas SRL',
            proveedorId:4,
            estado: 'Pedido',
            fecha: new Date('06/10/15'),
            monto:'2604.25'
        },
        {
            id: '6',
            nombreProveedor:'Kalevala',
            proveedorId:2,
            estado: 'Pagado',
            fecha: new Date('06/10/15'),
            monto:'3000.00'
        },
        {
            id: '7',
            nombreProveedor:'Crafter',
            proveedorId:1,
            estado: 'Pagado',
            fecha: new Date('06/11/15'),
            monto:'3000.00'
        },
        {
            id: '8',
            nombreProveedor:'Nuevo Origen',
            proveedorId:10,
            estado: 'Finalizado',
            fecha: new Date('06/11/15'),
            monto:'3000.00'
        },
        {
            id: '9',
            nombreProveedor:'Crafter',
            proveedorId:1,
            estado: 'Pagado',
            fecha: new Date('06/11/15'),
            monto:'3000.00'
        },
        {
            id: '10',
            nombreProveedor:'Kalevala',
            proveedorId:2,
            estado: 'Pagado',
            fecha: new Date('06/11/15'),
            monto:'3000.00'
        },
        {
            id: '11',
            nombreProveedor:'Crafter',
            proveedorId:1,
            estado: 'Pedido',
            fecha: new Date('06/11/15'),
            monto:'1500.00'
        },
        {
            id: '12',
            nombreProveedor:'Nuevo Origen',
            proveedorId:10,
            estado: 'Pagado',
            fecha: new Date('06/11/15'),
            monto:'1000.00'
        },
        {
            id: '13',
            nombreProveedor:'Botellas SRL',
            proveedorId:3,
            estado: 'Finalizado',
            fecha: new Date('06/11/15'),
            monto:'2500.25'
        },
        {
            id: '14',
            nombreProveedor:'Nuevo Origen',
            proveedorId:10,
            estado: 'Pagado',
            fecha: new Date('06/11/15'),
            monto:'1000.00'
        },
        {
            id: '15',
            nombreProveedor:'Tapas SRL',
            proveedorId:4,
            estado: 'Pedido',
            fecha: new Date('06/11/15'),
            monto:'2604.25'
        },
        {
            id: '16',
            nombreProveedor:'Kalevala',
            proveedorId:2,
            estado: 'Pagado',
            fecha: new Date('06/11/15'),
            monto:'3000.00'
        },
        {
            id: '17',
            nombreProveedor:'Crafter',
            proveedorId:1,
            estado: 'Pagado',
            fecha: new Date('06/11/15'),
            monto:'3000.00'
        },
        {
            id: '18',
            nombreProveedor:'Nuevo Origen',
            proveedorId:10,
            estado: 'Finalizado',
            fecha: new Date('06/11/15'),
            monto:'3000.00'
        },
        {
            id: '19',
            nombreProveedor:'Crafter',
            proveedorId:1,
            estado: 'Pagado',
            fecha: new Date('06/11/15'),
            monto:'3000.00'
        },
        {
            id: '20',
            nombreProveedor:'Kalevala',
            proveedorId:2,
            estado: 'Finalizado',
            fecha: new Date('06/13//15'),
            monto:'3000.00'
        },
        {
            id: '21',
            nombreProveedor:'Kalevala',
            proveedorId:2,
            estado: 'Finalizado',
            fecha: new Date('06/13//15'),
            monto:'1500.00'
        }
        ];

        for(var i = 0; i < $scope.compras.length; i++){
            $scope.compras[i].fecha=moment($scope.compras[i].fecha).locale('es').format('DD/MMM/YY');
            switch ($scope.compras[i].estado){
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

        $scope.ok = function () {
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.modal={
            abrir(compra){
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
            crear(compra,soloMostrar){
                var items;
                if(compra){
                    items = [
                    {
                        id:1,
                        cantidad:200,
                        costo:35,
                        productoId:1,
                        marca:"Crafter",
                        nombre:"American IPA",
                        descripcion:"Una pale ale lupulada, moderadamente fuerte, con características consistentes con el uso de maltas, lúpulos y levadura inglesas.",
                        tipo:"Cervezas por Litro"
                    },
                    {
                        id:2,
                        cantidad:200,
                        costo:35,
                        productoId:2,                                
                        marca:"Blest",
                        nombre:"Pilsen",
                        descripcion:"Una cerveza de cuerpo entero con un color que va del cobre profundo al marrón, de 10 a 45 SRM. Tienen mucho menos agregado de lúpulos que las versiones inglesas y por lo tanto con más sabor a malta.",
                        tipo:"Cervezas por Litro"
                    }
                    ];
                }
                
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
                            return items;
                        },
                        aCompra: function () {
                            return compra;
                        },
                        soloMostrar: function () {
                            return soloMostrar;
                        }
                    }
                });
            }
        }
    }])

.controller('cuponesCtrl',['$scope','$log','$uibModal','DTOptionsBuilder','DTColumnDefBuilder',function($scope,$log,$uibModal,DTOptionsBuilder,DTColumnDefBuilder){

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
         $scope.cupones = [
         {
            id: '1',
            nombreCliente:'Lucas Del Pozzi',
            vigencia:3,
            codigo:'985647532159',
            fecha:'2016-08-17 22:23:44.657',
            litros:2.00,
                estado: '',//se calcula abajo
                class: ''// se calcula abajo
            },
            {
                id: '2',
                nombreCliente:'Matias Del Pozzi',
                vigencia:3,
                codigo:'986521456982',
                fecha:'2016-08-17 22:23:44.657',
                litros:2.00,
                estado: '',//se calcula abajo
                class: ''// se calcula abajo
            },
            {
                id: '3',
                nombreCliente:'Lucas Del Pozzi',
                vigencia:3,
                codigo:'965832145625',
                fecha:'2016-08-18 22:23:44.657',
                litros:4.00,
                estado: 'Usado',//se calcula abajo
                class: 'badge-success'// se calcula abajo
            },
            {
                id: '4',
                nombreCliente:'Martin Moreira',
                vigencia:3,
                codigo:'986534785123',
                fecha:'2016-08-19 22:23:44.657',
                litros:4.00,
                estado: '',//se calcula abajo
                class: ''// se calcula abajo
            }

            ]; 

            function ean13_checksum(ean) {
                var checksum = 0;
                ean = ean.split('').reverse();
                for(var pos in ean){
                    checksum += ean[pos] * (3 - 2 * (pos % 2));
                }
                return ((10 - (checksum % 10 )) % 10);
            }


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

        $scope.vigencia = {
            extender(i){
                $scope.cupones[i-1].fecha= moment().toString();
                console.log($scope.cupones[i-1]);
                $scope.calcularEstado(i-1);
            },
            eliminar(i){
                $scope.cupones[i-1].vigencia=0;
                console.log($scope.cupones[i-1]);
                $scope.calcularEstado(i-1);
            },
            restaurar(i){
                $scope.cupones[i-1].vigencia=3;
                console.log($scope.cupones[i-1]);
                $scope.calcularEstado(i-1);
            }
        };  

        $scope.imprimir= function (cupon){
            console.log(cupon);
            var modalInstance = $uibModal.open({
                templateUrl: 'views/imprimir_cupon.html',
                controller: imprimirCuponCtrl, 
                //controler en controllers.js:1675, no termino de entender porque no lo puedo armar como el resto y si o si tengo que poner una funcion 

                windowClass: "animated flipInY",
                resolve: {
                    cupon: function () {
                        return cupon;
                    }
                }
            });
        }


    }])

.controller('productosCtrl', ['$scope','$log','$uibModal','$filter','DTOptionsBuilder','DTColumnDefBuilder','SweetAlert', function($scope,$log,$uibModal,$filter,DTOptionsBuilder,DTColumnDefBuilder,SweetAlert){

   $scope.productos =[
   {
    identificador:1,
    proveedor:"Crafter",
    marca:"Crafter",
    nombre:"American IPA",
    valor:75.00,
    costo:45.00,
    descripcion:"Una pale ale lupulada, moderadamente fuerte, con características consistentes con el uso de maltas, lúpulos y levadura inglesas.",                    
                stock:100,//se calcula con la suma de los stocks en todas las ubicaciones, en el caso del POS es la suma en la ubicacion de ese POS
                categoria:"Cervezas por Litro",//tipo
                unidad:'lts.',
                color:"#E8692E",
                ibu:40,
                alcohol:6,
                origen:'Cipolletti'
            },
            {
                identificador:2,
                proveedor:"Blest",
                marca:"Blest",
                nombre:"Pilsen",
                valor:75.00,
                costo:45.00,
                descripcion:"Una pale ale lupulada, moderadamente fuerte, con características consistentes con el uso de maltas, lúpulos y levadura inglesas.",                    
                stock:100,//se calcula con la suma de los stocks en todas las ubicaciones, en el caso del POS es la suma en la ubicacion de ese POS
                categoria:"Cervezas por Litro",//tipo
                unidad:'lts.',
                color:"#F6AC3F",
                ibu:40,
                alcohol:6,
                origen:'Neuquen'
            },
            {
                identificador:3,
                proveedor:"Lowther",
                marca:"Lowther",
                nombre:"Ambar",
                valor:75.00,
                costo:45.00,
                descripcion:"Una pale ale lupulada, moderadamente fuerte, con características consistentes con el uso de maltas, lúpulos y levadura inglesas.",                    
                stock:100,//se calcula con la suma de los stocks en todas las ubicaciones, en el caso del POS es la suma en la ubicacion de ese POS
                categoria:"Cervezas por Litro",//tipo
                unidad:'lts.',
                color:"#E08D3B",
                ibu:40,
                alcohol:6,
                origen:'Bariloche'
            },
            {
                identificador:4,
                proveedor:"Nuevo Origen",
                marca:"Nuevo Origen",
                nombre:"Firenze",
                valor:75.00,
                costo:45.00,
                descripcion:"Una pale ale lupulada, moderadamente fuerte, con características consistentes con el uso de maltas, lúpulos y levadura inglesas.",                    
                stock:100,//se calcula con la suma de los stocks en todas las ubicaciones, en el caso del POS es la suma en la ubicacion de ese POS
                categoria:"Cervezas por Litro",//tipo
                unidad:'lts.',
                color:"#E08D3B",
                ibu:40,
                alcohol:6,
                origen:'La Pampa'
            },
            {
                identificador:5,
                proveedor:"Crafter",
                marca:"Crafter",
                nombre:"Honey",
                valor:75.00,
                costo:45.00,
                descripcion:"Una pale ale lupulada, moderadamente fuerte, con características consistentes con el uso de maltas, lúpulos y levadura inglesas.",                    
                stock:100,//se calcula con la suma de los stocks en todas las ubicaciones, en el caso del POS es la suma en la ubicacion de ese POS
                categoria:"Cervezas por Litro",//tipo
                unidad:'lts.',
                color:"#E8692E",
                ibu:40,
                alcohol:6,
                origen:'Cipolletti'
            },
            {
                identificador:6,
                proveedor:"Crafter",
                marca:"Crafter",
                nombre:"Blueberry",
                valor:75.00,
                costo:45.00,
                descripcion:"Una pale ale lupulada, moderadamente fuerte, con características consistentes con el uso de maltas, lúpulos y levadura inglesas.",                    
                stock:100,//se calcula con la suma de los stocks en todas las ubicaciones, en el caso del POS es la suma en la ubicacion de ese POS
                categoria:"Cervezas por Litro",//tipo 
                unidad:'lts.',
                color:"#82171A",
                ibu:40,
                alcohol:6,
                origen:'Cipolletti'
            },
            {
                identificador:7,
                proveedor:"Kalevala",
                marca:"Kalevala",
                nombre:"Bitter",
                valor:75.00,
                costo:45.00,
                descripcion:"Una pale ale lupulada, moderadamente fuerte, con características consistentes con el uso de maltas, lúpulos y levadura inglesas.",                    
                stock:100,//se calcula con la suma de los stocks en todas las ubicaciones, en el caso del POS es la suma en la ubicacion de ese POS
                categoria:"Cervezas por Litro",//tipo
                unidad:'lts.',
                color:"#6B190F",
                ibu:40,
                alcohol:6,
                origen:'Cipolletti'
            },
            {
                identificador:8,
                proveedor:"Nuevo Origen",
                marca:"Nuevo Origen",
                nombre:"Little Wing",
                valor:75.00,
                costo:45.00,
                descripcion:"Una pale ale lupulada, moderadamente fuerte, con características consistentes con el uso de maltas, lúpulos y levadura inglesas.",                    
                stock:100,//se calcula con la suma de los stocks en todas las ubicaciones, en el caso del POS es la suma en la ubicacion de ese POS
                categoria:"Cervezas por Litro",//tipo
                unidad:'lts.',
                color:"#E08D3B",
                ibu:40,
                alcohol:6,
                origen:'La Pampa'
            },
            {
                identificador:9,
                proveedor:"Nuevo Origen",
                marca:"Nuevo Origen",
                nombre:"Dorada Pampeana",
                valor:75.00,
                costo:45.00,
                descripcion:"Una pale ale lupulada, moderadamente fuerte, con características consistentes con el uso de maltas, lúpulos y levadura inglesas.",                    
                stock:100,//se calcula con la suma de los stocks en todas las ubicaciones, en el caso del POS es la suma en la ubicacion de ese POS
                categoria:"Cervezas por Litro",//tipo
                unidad:'lts.',
                color:"#E8692E",
                ibu:40,
                alcohol:6,
                origen:'La Pampa'
            },
            {
                identificador:10,
                proveedor:"Lowther",
                marca:"Lowther",
                nombre:"Brown Ale",
                valor:75.00,
                costo:45.00,
                descripcion:"Una pale ale lupulada, moderadamente fuerte, con características consistentes con el uso de maltas, lúpulos y levadura inglesas.",                    
                stock:100,//se calcula con la suma de los stocks en todas las ubicaciones, en el caso del POS es la suma en la ubicacion de ese POS
                categoria:"Cervezas por Litro",//tipo
                unidad:'lts.',
                color:"#E8692E",
                ibu:40,
                alcohol:6,
                origen:'Bariloche'
            },
            {
                identificador:11,
                proveedor:"Crafter",
                marca:"Crafter",
                nombre:"Scottish",
                valor:75.00,
                costo:45.00,
                descripcion:"Una pale ale lupulada, moderadamente fuerte, con características consistentes con el uso de maltas, lúpulos y levadura inglesas.",                    
                stock:100,//se calcula con la suma de los stocks en todas las ubicaciones, en el caso del POS es la suma en la ubicacion de ese POS
                categoria:"Cervezas por Litro",//tipo 
                unidad:'lts.',
                color:"#82171A",
                ibu:40,
                alcohol:6,
                origen:'Cipolletti'
            },
            {
                identificador:12,
                proveedor:"Crafter",
                marca:"Crafter",
                nombre:"Hazenut",
                valor:75.00,
                costo:45.00,
                descripcion:"Una pale ale lupulada, moderadamente fuerte, con características consistentes con el uso de maltas, lúpulos y levadura inglesas.",                    
                stock:100,//se calcula con la suma de los stocks en todas las ubicaciones, en el caso del POS es la suma en la ubicacion de ese POS
                categoria:"Cervezas por Litro",//tipo 
                unidad:'lts.',
                color:"#E8692E",
                ibu:40,
                alcohol:6,
                origen:'Cipolletti'
            },
            {
                identificador:13,
                proveedor:"Kalevala",
                marca:"Kalevala",
                nombre:"Irish Red Ale",
                valor:75.00,
                costo:45.00,
                descripcion:"Una pale ale lupulada, moderadamente fuerte, con características consistentes con el uso de maltas, lúpulos y levadura inglesas.",                    
                stock:100,//se calcula con la suma de los stocks en todas las ubicaciones, en el caso del POS es la suma en la ubicacion de ese POS
                categoria:"Cervezas por Litro",//tipo 
                unidad:'lts.',
                color:"#E8692E",
                ibu:40,
                alcohol:6,
                origen:'Cipolletti'
            },
            {
                identificador:14,
                proveedor:"Lowther",
                marca:"Lowther",
                nombre:"IPA",
                valor:75.00,
                costo:45.00,
                descripcion:"Una pale ale lupulada, moderadamente fuerte, con características consistentes con el uso de maltas, lúpulos y levadura inglesas.",                    
                stock:100,//se calcula con la suma de los stocks en todas las ubicaciones, en el caso del POS es la suma en la ubicacion de ese POS
                categoria:"Cervezas por Litro",//tipo 
                unidad:'lts.',
                color:"#E08D3B",
                ibu:40,
                alcohol:6,
                origen:'Bariloche'
            },
            {
                identificador:15,
                proveedor:"Blest",
                marca:"Blest",
                nombre:"Scotch",
                valor:75.00,
                costo:45.00,
                descripcion:"Una pale ale lupulada, moderadamente fuerte, con características consistentes con el uso de maltas, lúpulos y levadura inglesas.",                    
                stock:100,//se calcula con la suma de los stocks en todas las ubicaciones, en el caso del POS es la suma en la ubicacion de ese POS
                categoria:"Cervezas por Litro",//tipo 
                unidad:'lts.',
                color:"#E8692E",
                ibu:40,
                alcohol:6,
                origen:'Cipolletti'
            },
            {
                identificador:16,
                proveedor:"Distribuidor de bottellas",
                marca:"Bottles",
                nombre:"Growler",
                valor:100.00,
                costo:50.00,
                descripcion:"Modelo Clasico",                    
                stock:100,//se calcula con la suma de los stocks en todas las ubicaciones, en el caso del POS es la suma en la ubicacion de ese POS
                categoria:"Envases",//tipo 
                unidad:'lts.',
            },
            {
                identificador:17,
                proveedor:"Distribuidor de bottellas",
                marca:"Bottles",
                nombre:"Growler Led Zeppelin",
                valor:100.00,
                costo:50.00,
                descripcion:"Modelo Led Zeppelin",                    
                stock:200,//se calcula con la suma de los stocks en todas las ubicaciones, en el caso del POS es la suma en la ubicacion de ese POS
                categoria:"Envases",//tipo  
                unidad:'lts.',
            },
            {
                identificador:18,
                proveedor:"Distribuidor de bottellas",
                marca:"Bottles",
                nombre:"Growler Jimmy Hendrix",
                valor:100.00,
                costo:50.00,
                descripcion:"Modelo Jimmy Hendrix",                    
                stock:10,//se calcula con la suma de los stocks en todas las ubicaciones, en el caso del POS es la suma en la ubicacion de ese POS
                categoria:"Envases",//tipo  
                unidad:'lts.',
            },
            {
                identificador:19,
                proveedor:"Tapitas SRL",
                marca:"Tapitas",
                nombre:"Tapa Growler",
                valor:8.00,
                costo:5.00,
                descripcion:"Tapa para growler de 2 lt",                    
                stock:300,//se calcula con la suma de los stocks en todas las ubicaciones, en el caso del POS es la suma en la ubicacion de ese POS
                categoria:"No vendible",//tipo 
                unidad:'un.',
            },
            {
                identificador:20,
                proveedor:"Distribuidor de bottellas",
                marca:"Bottles",
                nombre:"Botella 1 lt",
                valor:40.00,
                costo:30.00,
                descripcion:"Modelo Clasico",                    
                stock:200,//se calcula con la suma de los stocks en todas las ubicaciones, en el caso del POS es la suma en la ubicacion de ese POS
                categoria:"Envases",//tipo 
                unidad:'lts.',
            },
            {
                identificador:21,
                proveedor:"Tapitas SRL",
                marca:"Tapaitas",
                nombre:"Tapa Botella",
                valor:8.00,
                costo:5.00,
                descripcion:"Tapa para botella de 1 lt",                    
                stock:200,//se calcula con la suma de los stocks en todas las ubicaciones, en el caso del POS es la suma en la ubicacion de ese POS
                categoria:"No vendible",//tipo 
                unidad:'un.',
            },
            {
                identificador:22,
                proveedor:"Nuevo Origen",
                marca:"Nuevo Origen",
                nombre:"Rocky",
                valor:75.00,
                costo:45.00,
                descripcion:"Una pale ale lupulada, moderadamente fuerte, con características consistentes con el uso de maltas, lúpulos y levadura inglesas.",                    
                stock:100,//se calcula con la suma de los stocks en todas las ubicaciones, en el caso del POS es la suma en la ubicacion de ese POS
                categoria:"Cervezas por Litro",//tipo 
                unidad:'lts.',
                color:"#E8692E",
                ibu:40,
                alcohol:6,
                origen:'La Pampa'
            },
            {
                identificador:23,
                proveedor:"Nuevo Origen",
                marca:"Nuevo Origen",
                nombre:"Boreal",
                valor:75.00,
                costo:45.00,
                descripcion:"Una pale ale lupulada, moderadamente fuerte, con características consistentes con el uso de maltas, lúpulos y levadura inglesas.",                    
                stock:100,//se calcula con la suma de los stocks en todas las ubicaciones, en el caso del POS es la suma en la ubicacion de ese POS
                categoria:"Cervezas por Litro",//tipo  
                unidad:'lts.',
                color:"#E8692E",
                ibu:40,
                alcohol:6,
                origen:'Cipolletti'
            },
            {
                identificador:24,
                proveedor:"Crafter",
                marca:"Crafter",
                nombre:"Porter",
                valor:75.00,
                costo:45.00,
                descripcion:"Una pale ale lupulada, moderadamente fuerte, con características consistentes con el uso de maltas, lúpulos y levadura inglesas.",                    
                stock:100,//se calcula con la suma de los stocks en todas las ubicaciones, en el caso del POS es la suma en la ubicacion de ese POS
                categoria:"Cervezas por Litro",//tipo    
                unidad:'lts.',
                color:"#6B190F",
                ibu:40,
                alcohol:6,
                origen:'Cipolletti'
            },
            {
                identificador:25,
                proveedor:"Blest",
                marca:"Blest",
                nombre:"Bock",
                valor:75.00,
                costo:45.00,
                descripcion:"Una pale ale lupulada, moderadamente fuerte, con características consistentes con el uso de maltas, lúpulos y levadura inglesas.",                    
                stock:100,//se calcula con la suma de los stocks en todas las ubicaciones, en el caso del POS es la suma en la ubicacion de ese POS
                categoria:"Cervezas por Litro",//tipo 
                unidad:'lts.',
                color:"#6B190F",
                ibu:40,
                alcohol:6,
                origen:'Cipolletti'
            },
            {
                identificador:26,
                proveedor:"Nuevo Origen",
                marca:"Nuevo Origen",
                nombre:"Dry Stout",
                valor:75.00,
                costo:45.00,
                descripcion:"Una pale ale lupulada, moderadamente fuerte, con características consistentes con el uso de maltas, lúpulos y levadura inglesas.",                    
                stock:100,//se calcula con la suma de los stocks en todas las ubicaciones, en el caso del POS es la suma en la ubicacion de ese POS
                categoria:"Cervezas por Litro",//tipo  
                unidad:'lts.',
                color:"#5C1F0C",
                ibu:40,
                alcohol:6,
                origen:'La Pampa'
            },
            {
                identificador:27,
                proveedor:"Nuevo Origen",
                marca:"Nuevo Origen",
                nombre:"Seasonal",
                valor:75.00,
                costo:45.00,
                descripcion:"Una pale ale lupulada, moderadamente fuerte, con características consistentes con el uso de maltas, lúpulos y levadura inglesas.",                    
                stock:100,//se calcula con la suma de los stocks en todas las ubicaciones, en el caso del POS es la suma en la ubicacion de ese POS
                categoria:"Cervezas por Litro",//tipo 
                unidad:'lts.',
                color:"#E8692E",
                ibu:40,
                alcohol:6,
                origen:'La Pampa'
            },
            {
                identificador:28,
                proveedor:"Black Hop",
                marca:"Black Hop",
                nombre:"Cerveza con Growler",
                valor:250.00,//valor por 2lts que es el contenido del growler (¿ver multiplos de 2 en POS?)
                costo:'',
                descripcion:"Cupon para venta en barra con growler",                    
                stock:'-1',//infinito para los cupones
                categoria:"Cupones",//tipo  
                unidad:'lts.',
            },
            {
                identificador:29,
                proveedor:"Black Hop",
                marca:"Black Hop",
                nombre:"Cerveza sin Growler",
                valor:75.00,//valor por litro
                costo:'',
                descripcion:"Cupon para venta en barra sin growler",                    
                stock:'-1',//infinito para los cupones
                categoria:"Cupones",//tipo
                unidad:'lts.',
            },
            {
                identificador:30,
                proveedor:"Black Hop",
                marca:"Black Hop",
                nombre:"Cerveza con Botella",
                valor:125.00,
                costo:'',
                descripcion:"Cupon para venta en barra con botella",                    
                stock:'-1',//infinito para los cupones
                categoria:"Cupones",//tipo 
                unidad:'lts.',
            },

            ]

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
                abrir(producto){
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
                crear(){
                    console.log();
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
                            return '';
                        }
                    }
                });
                },
                editar(producto){
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
            abrir(alquiler){
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

.controller('productosInventarioCtrl', ['$scope','$log','$uibModal','$filter','DTOptionsBuilder','DTColumnDefBuilder', function($scope,$log,$uibModal,$filter,DTOptionsBuilder,DTColumnDefBuilder){

   $scope.productosInventario =[
   {
    identificador:1,
    proveedor:"Crafter",
    marca:"Crafter",
    nombre:"American IPA",
    ubicacion: 'Local Illia',
    stock:98,
                categoria:"Cervezas por Litro",//tipo
                unidad:'lts.',
                color:"#E8692E"
            },
            {
                identificador:2,
                proveedor:"Blest",
                marca:"Blest",
                nombre:"Pilsen",
                ubicacion: 'Local Illia',
                stock:52,
                categoria:"Cervezas por Litro",//tipo
                unidad:'lts.',
                color:"#F6AC3F"
            },
            {
                identificador:3,
                proveedor:"Lowther",
                marca:"Lowther",
                nombre:"Ambar",
                ubicacion: 'Local Illia',
                stock:98,
                categoria:"Cervezas por Litro",//tipo
                unidad:'lts.',
                color:"#E08D3B"
            },
            {
                identificador:4,
                proveedor:"Nuevo Origen",
                marca:"Nuevo Origen",
                nombre:"Firenze",
                ubicacion: 'Local Illia',
                stock:35,
                categoria:"Cervezas por Litro",//tipo
                unidad:'lts.',
                color:"#E08D3B"
            },
            {
                identificador:5,
                proveedor:"Crafter",
                marca:"Crafter",
                nombre:"Honey",
                ubicacion: 'Local Illia',
                stock:98,
                categoria:"Cervezas por Litro",//tipo
                unidad:'lts.',
                color:"#E8692E"
            },
            {
                identificador:6,
                proveedor:"Crafter",
                marca:"Crafter",
                nombre:"American IPA",
                ubicacion: 'Local 3',
                stock:97,
                categoria:"Cervezas por Litro",//tipo
                unidad:'lts.',
                color:"#E8692E"
            },
            {
                identificador:7,
                proveedor:"Crafter",
                marca:"Crafter",
                nombre:"American IPA",
                ubicacion: 'Local 2',
                stock:150,
                categoria:"Cervezas por Litro",//tipo
                unidad:'lts.',
                color:"#E8692E"
            },
            {
                identificador:8,
                proveedor:"Nuevo Origen",
                marca:"Nuevo Origen",
                nombre:"Little Wing",
                ubicacion: 'Local Illia',
                stock:125,
                categoria:"Cervezas por Litro",//tipo
                unidad:'lts.',
                color:"#E08D3B"
            },
            {
                identificador:9,
                proveedor:"Nuevo Origen",
                marca:"Nuevo Origen",
                nombre:"Dorada Pampeana",
                ubicacion: 'Local Illia',
                stock:156,
                categoria:"Cervezas por Litro",//tipo
                unidad:'lts.',
                color:"#E8692E"
            },
            {
                identificador:10,
                proveedor:"Lowther",
                marca:"Lowther",
                nombre:"Brown Ale",
                ubicacion: 'Local Illia',
                stock:198,
                categoria:"Cervezas por Litro",//tipo
                unidad:'lts.',
                color:"#E8692E"
            },
            {
                identificador:11,
                proveedor:"Crafter",
                marca:"Crafter",
                nombre:"Scottish",
                ubicacion: 'Local Illia',
                stock:178,
                categoria:"Cervezas por Litro",//tipo 
                unidad:'lts.',
                color:"#82171A"
            },
            {
                identificador:12,
                proveedor:"Crafter",
                marca:"Crafter",
                nombre:"Hazenut",
                ubicacion: 'Local Illia',
                stock:95,
                categoria:"Cervezas por Litro",//tipo 
                unidad:'lts.',
                color:"#E8692E"
            },
            {
                identificador:13,
                proveedor:"Kalevala",
                marca:"Kalevala",
                nombre:"Irish Red Ale",
                ubicacion: 'Local Illia',
                stock:147,
                categoria:"Cervezas por Litro",//tipo 
                unidad:'lts.',
                color:"#E8692E"
            },
            {
                identificador:14,
                proveedor:"Lowther",
                marca:"Lowther",
                nombre:"IPA",
                ubicacion: 'Local Illia',
                stock:169,
                categoria:"Cervezas por Litro",//tipo 
                unidad:'lts.',
                color:"#E08D3B"
            },
            {
                identificador:15,
                proveedor:"Blest",
                marca:"Blest",
                nombre:"Scotch",
                ubicacion: 'Local Illia',
                stock:86,
                categoria:"Cervezas por Litro",//tipo 
                unidad:'lts.',
                color:"#E8692E"
            },
            {
                identificador:16,
                proveedor:"Distribuidor de bottellas",
                marca:"Bottles",
                nombre:"Growler",
                descripcion:"Modelo Clasico",                    
                stock:356,
                ubicacion: 'Local Illia',
                categoria:"Envases",//tipo 
                unidad:'un.'
            },
            {
                identificador:17,
                proveedor:"Distribuidor de bottellas",
                marca:"Bottles",
                nombre:"Growler Led Zeppelin",
                descripcion:"Modelo Led Zeppelin",                    
                stock:268,
                ubicacion: 'Local Illia',
                categoria:"Envases",//tipo  
                unidad:'un.'
            },
            {
                identificador:18,
                proveedor:"Distribuidor de bottellas",
                marca:"Bottles",
                nombre:"Growler Jimmy Hendrix",
                descripcion:"Modelo Jimmy Hendrix",                    
                stock:15,
                ubicacion: 'Local Illia',
                categoria:"Envases",//tipo  
                unidad:'un.'
            },
            {
                identificador:19,
                proveedor:"Tapitas SRL",
                marca:"Tapitas",
                nombre:"Tapa Growler",
                descripcion:"Tapa para growler de 2 lt",                    
                stock:257,
                ubicacion: 'Local Illia',
                categoria:"No vendible",//tipo 
                unidad:'un.'
            },
            {
                identificador:20,
                proveedor:"Distribuidor de bottellas",
                marca:"Bottles",
                nombre:"Botella 1 lt",
                descripcion:"Modelo Clasico",                    
                stock:189,
                ubicacion: 'Local Illia',
                categoria:"Envases",//tipo 
                unidad:'un.'
            },
            {
                identificador:21,
                proveedor:"Tapitas SRL",
                marca:"Tapaitas",
                nombre:"Tapa Botella",
                descripcion:"Tapa para botella de 1 lt",                    
                stock:145,
                ubicacion: 'Local Illia',
                categoria:"No vendible",//tipo 
                unidad:'un.'
            },
            {
                identificador:22,
                proveedor:"Nuevo Origen",
                marca:"Nuevo Origen",
                nombre:"Rocky",
                ubicacion: 'Local Illia',
                stock:86,
                categoria:"Cervezas por Litro",//tipo 
                unidad:'lts.',
                color:"#E8692E"
            },
            {
                identificador:23,
                proveedor:"Nuevo Origen",
                marca:"Nuevo Origen",
                nombre:"Boreal",
                ubicacion: 'Local Illia',
                stock:100,
                categoria:"Cervezas por Litro",//tipo  
                unidad:'lts.',
                color:"#E8692E"
            },
            {
                identificador:24,
                proveedor:"Crafter",
                marca:"Crafter",
                nombre:"Porter",
                ubicacion: 'Local Illia',
                stock:126,
                categoria:"Cervezas por Litro",//tipo    
                unidad:'lts.',
                color:"#6B190F"
            },
            {
                identificador:25,
                proveedor:"Blest",
                marca:"Blest",
                nombre:"Bock",
                ubicacion: 'Local Illia',
                stock:100,
                categoria:"Cervezas por Litro",//tipo 
                unidad:'lts.',
                color:"#6B190F"
            },
            {
                identificador:26,
                proveedor:"Nuevo Origen",
                marca:"Nuevo Origen",
                nombre:"Dry Stout",
                ubicacion: 'Local Illia',
                stock:167,
                categoria:"Cervezas por Litro",//tipo  
                unidad:'lts.',
                color:"#5C1F0C"
            },
            {
                identificador:27,
                proveedor:"Nuevo Origen",
                marca:"Nuevo Origen",
                nombre:"Seasonal",
                ubicacion: 'Local Illia',
                stock:178,
                categoria:"Cervezas por Litro",//tipo 
                unidad:'lts.',
                color:"#E8692E"
            }

            ]

            $scope.ubicaciones =[
            {
                nombre:'Local Illia',
                direccion:'Illia 123'
            },
            {
                nombre:'Local 3',
                direccion:'Avenida 988'
            },
            {
                nombre:'Local 2',
                direccion:'Calle 53'
            },
            {
                nombre:'Ajuste',
                direccion:''
            }
            ]

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
            agregar(producto){
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
            nuevo(producto){
                var modalInstance = $uibModal.open({
                    templateUrl: 'views/wizard-producto-inventario.html',
                    controller: wizardProductoInvantarioCtrl, 
                    //controler en controllers.js, no termino de entender porque no lo puedo armar como el resto y si o si tengo que poner una funcion                        
                    windowClass: "animated fadeIn",
                    scope: $scope,
                    backdrop: 'static',
                    resolve: {
                        trabajo: function () {
                            return 'nuevo';
                        },
                        producto: function () {
                            return producto;
                        }
                    }
                });
            },
            mover(producto){
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
            ajustar(producto){
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
            crear(){
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
            editar(alquilable){
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

.controller('gastosCtrl', ['$scope','$log','$uibModal','$filter','DTOptionsBuilder','DTColumnDefBuilder','SweetAlert', function($scope,$log,$uibModal,$filter,DTOptionsBuilder,DTColumnDefBuilder,SweetAlert){

   $scope.gastos =[
   {
    identificador:1,
    fecha:new Date("09/01/2016"),
    descripcion:"Pago a Proveedor",
    monto:"5500",
    usuario:"Agustin"
},
{
    identificador:2,
    fecha:new Date("09/02/2016"),
    descripcion:"Pago a Gonzalo",
    monto:"500",
    usuario:"Aldana"
},
{
    identificador:3,
    fecha:new Date("09/02/2016"),
    descripcion:"Retiro Miqueas",
    monto:"6000",
    usuario:"Aldana"
},
{
    identificador:4,
    fecha:new Date("09/03/2016"),
    descripcion:"Pago a Proveedor",
    monto:"7000",
    usuario:"Gaston"
},
{
    identificador:5,
    fecha:new Date("09/03/2016"),
    descripcion:"Retiro Miqueas",
    monto:"2000",
    usuario:"Gaston"
},
{
    identificador:6,
    fecha:new Date("09/04/2016"),
    descripcion:"Retiro Miqueas",
    monto:"10000",
    usuario:"Agustin"
}

]

for(var i = 0; i < $scope.gastos.length; i++){
    $scope.gastos[i].fecha=moment($scope.gastos[i].fecha).locale('es').format('DD/MMM/YYYY');
};

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
                for(var i = 0; i < $scope.gastos.length; i++){

                    if ($scope.gastos[i].id == ident){                    
                        $scope.gastos.splice(i, 1);                                
                        SweetAlert.swal("¡Eliminado!", "El gasto ha sido eliminado", "success");
                    } 
                } 

            }
            else{
                SweetAlert.swal("Cancelado", "Todo sigue como antes", "error");
            }
        }
        
        );
};

$scope.modal={
    crear(){
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
    },

    editar(gasto){       

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
                            return gasto;
                        }
                    }

                });
    }
}
}])

.controller('historialCtrl', ['$scope','$log','$uibModal','$filter','DTOptionsBuilder','DTColumnDefBuilder', function($scope,$log,$uibModal,$filter,DTOptionsBuilder,DTColumnDefBuilder){

   $scope.historial =[
   {
      identificador: 1,
      fecha: "2016-03-30 08:05:56",
      ubicacion: "Local Illia",
      producto: "Lowther - Ambar",
      tipoHistorial: "Entrada",
      anterior: 32,
      cantidad: 67,
      posterior: 99,
      unidad: "lts."
  },
  {
      identificador: 2,
      fecha: "2016-07-25 13:32:43",
      ubicacion: "Local 3",
      producto: "Blest - Pilsen",
      tipoHistorial: "Ajuste",
      anterior: 15,
      cantidad: 66,
      posterior: 81,
      unidad: "lts."
  },
  {
      identificador: 3,
      fecha: "2016-05-31 05:18:26",
      ubicacion: "Local 2",
      producto: "Lowther - Ambar",
      tipoHistorial: "Ajuste",
      anterior: 22,
      cantidad: 32,
      posterior: 54,
      unidad: "lts."
  },
  {
      identificador: 4,
      fecha: "2015-10-06 13:33:28",
      ubicacion: "Local Illia",
      producto: "Crafter - American IPA",
      tipoHistorial: "Venta",
      anterior: 31,
      cantidad: 42,
      posterior: 73,
      unidad: "lts."
  },

  {
      identificador: 5,
      fecha: "2016-05-15 09:00:59",
      ubicacion: "Local 2",
      producto: "Blest - Pilsen",
      tipoHistorial: "Venta",
      anterior: 99,
      cantidad: 29,
      posterior: 128,
      unidad: "lts."
  },
  {
      identificador: 6,
      fecha: "2016-05-29 18:28:27",
      ubicacion: "Local 2",
      producto: "Lowther - Ambar",
      tipoHistorial: "Venta",
      anterior: 18,
      cantidad: 80,
      posterior: 98,
      unidad: "lts."
  },
  {
      identificador: 7,
      fecha: "2016-04-09 16:04:51",
      ubicacion: "Local 3",
      producto: "Crafter - American IPA",
      tipoHistorial: "Ajuste",
      anterior: 75,
      cantidad: 58,
      posterior: 133,
      unidad: "lts."
  },
  {
      identificador: 8,
      fecha: "2016-05-12 13:18:18",
      ubicacion: "Local 3",
      producto: "Lowther - Ambar",
      tipoHistorial: "Movimiento",
      anterior: 20,
      cantidad: 87,
      posterior: 107,
      unidad: "lts."
  },
  {
      identificador: 9,
      fecha: "2016-02-16 03:54:39",
      ubicacion: "Local 3",
      producto: "Lowther - Ambar",
      tipoHistorial: "Entrada",
      anterior: 72,
      cantidad: 17,
      posterior: 89,
      unidad: "lts."
  },
  {
      identificador: 10,
      fecha: "2015-12-04 12:14:42",
      ubicacion: "Local Illia",
      producto: "Lowther - Ambar",
      tipoHistorial: "Entrada",
      anterior: 52,
      cantidad: 17,
      posterior: 69,
      unidad: "lts."
  },
  {
      identificador: 11,
      fecha: "2016-05-24 12:42:59",
      ubicacion: "Local 3",
      producto: "Blest - Pilsen",
      tipoHistorial: "Movimiento",
      anterior: 14,
      cantidad: 90,
      posterior: 104,
      unidad: "lts."
  },
  {
      identificador: 12,
      fecha: "2015-11-20 18:46:46",
      ubicacion: "Local 3",
      producto: "Blest - Pilsen",
      tipoHistorial: "Ajuste",
      anterior: 23,
      cantidad: 17,
      posterior: 40,
      unidad: "lts."
  },
  {
      identificador: 13,
      fecha: "2015-11-16 19:56:02",
      ubicacion: "Local 2",
      producto: "Lowther - Ambar",
      tipoHistorial: "Entrada",
      anterior: 35,
      cantidad: 35,
      posterior: 70,
      unidad: "lts."
  },
  {
      identificador: 14,
      fecha: "2016-03-05 03:59:49",
      ubicacion: "Local Illia",
      producto: "Crafter - American IPA",
      tipoHistorial: "Entrada",
      anterior: 17,
      cantidad: 18,
      posterior: 35,
      unidad: "lts."
  },
  {
      identificador: 15,
      fecha: "2016-06-06 13:38:41",
      ubicacion: "Local 2",
      producto: "Blest - Pilsen",
      tipoHistorial: "Ajuste",
      anterior: 21,
      cantidad: 28,
      posterior: 49,
      unidad: "lts."
  },
  {
      identificador: 16,
      fecha: "2016-01-19 11:12:22",
      ubicacion: "Local 3",
      producto: "Lowther - Ambar",
      tipoHistorial: "Venta",
      anterior: 17,
      cantidad: 56,
      posterior: 73,
      unidad: "lts."
  },
  {
      identificador: 17,
      fecha: "2015-12-19 14:28:31",
      ubicacion: "Local 2",
      producto: "Lowther - Ambar",
      tipoHistorial: "Entrada",
      anterior: 57,
      cantidad: 93,
      posterior: 150,
      unidad: "lts."
  },
  {
      identificador: 18,
      fecha: "2016-07-28 09:03:54",
      ubicacion: "Local Illia",
      producto: "Blest - Pilsen",
      tipoHistorial: "Venta",
      anterior: 7,
      cantidad: 22,
      posterior: 29,
      unidad: "lts."
  },
  {
      identificador: 19,
      fecha: "2016-07-06 23:32:15",
      ubicacion: "Local Illia",
      producto: "Crafter - American IPA",
      tipoHistorial: "Entrada",
      anterior: 57,
      cantidad: 27,
      posterior: 84,
      unidad: "lts."
  },
  {
      identificador: 20,
      fecha: "2016-06-22 08:52:57",
      ubicacion: "Local 2",
      producto: "Crafter - Porter",
      tipoHistorial: "Ajuste",
      anterior: 56,
      cantidad: 1,
      posterior: 57,
      unidad: "lts."
  },
  {
      identificador: 21,
      fecha: "2016-06-10 03:43:50",
      ubicacion: "Local 3",
      producto: "Crafter - Porter",
      tipoHistorial: "Venta",
      anterior: 72,
      cantidad: 68,
      posterior: 140,
      unidad: "lts."
  },
  {
      identificador: 22,
      fecha: "2015-10-04 04:56:57",
      ubicacion: "Local Illia",
      producto: "Crafter - American IPA",
      tipoHistorial: "Venta",
      anterior: 39,
      cantidad: 5,
      posterior: 44,
      unidad: "lts."
  },
  {
      identificador: 23,
      fecha: "2016-05-01 06:04:17",
      ubicacion: "Local 2",
      producto: "Blest - Pilsen",
      tipoHistorial: "Entrada",
      anterior: 83,
      cantidad: 49,
      posterior: 132,
      unidad: "lts."
  },
  {
      identificador: 24,
      fecha: "2016-07-21 23:37:41",
      ubicacion: "Local 3",
      producto: "Lowther - Ambar",
      tipoHistorial: "Entrada",
      anterior: 73,
      cantidad: 70,
      posterior: 143,
      unidad: "lts."
  },
  {
      identificador: 25,
      fecha: "2015-11-30 22:31:45",
      ubicacion: "Local 3",
      producto: "Lowther - Ambar",
      tipoHistorial: "Venta",
      anterior: 57,
      cantidad: 96,
      posterior: 153,
      unidad: "lts."
  },
  {
      identificador: 26,
      fecha: "2015-11-11 11:06:41",
      ubicacion: "Local 3",
      producto: "Crafter - American IPA",
      tipoHistorial: "Entrada",
      anterior: 82,
      cantidad: 6,
      posterior: 88,
      unidad: "lts."
  },
  {
      identificador: 27,
      fecha: "2015-09-23 13:21:41",
      ubicacion: "Local 2",
      producto: "Blest - Pilsen",
      tipoHistorial: "Entrada",
      anterior: 41,
      cantidad: 50,
      posterior: 91,
      unidad: "lts."
  },
  {
      identificador: 28,
      fecha: "2015-12-29 01:47:52",
      ubicacion: "Local 3",
      producto: "Crafter - American IPA",
      tipoHistorial: "Entrada",
      anterior: 64,
      cantidad: 69,
      posterior: 133,
      unidad: "lts."
  },
  {
      identificador: 29,
      fecha: "2016-01-19 13:22:20",
      ubicacion: "Local 3",
      producto: "Crafter - Porter",
      tipoHistorial: "Movimiento",
      anterior: 39,
      cantidad: 63,
      posterior: 102,
      unidad: "lts."
  },
  {
      identificador: 30,
      fecha: "2015-09-14 18:06:50",
      ubicacion: "Local Illia",
      producto: "Crafter - American IPA",
      tipoHistorial: "Entrada",
      anterior: 29,
      cantidad: 6,
      posterior: 35,
      unidad: "lts."
  },
  {
      identificador: 31,
      fecha: "2016-03-13 02:05:45",
      ubicacion: "Local 3",
      producto: "Lowther - Ambar",
      tipoHistorial: "Movimiento",
      anterior: 93,
      cantidad: 42,
      posterior: 135,
      unidad: "lts."
  },
  {
      identificador: 32,
      fecha: "2016-06-01 03:33:47",
      ubicacion: "Local 2",
      producto: "Crafter - American IPA",
      tipoHistorial: "Movimiento",
      anterior: 56,
      cantidad: 31,
      posterior: 87,
      unidad: "lts."
  },
  {
      identificador: 33,
      fecha: "2016-02-24 03:28:50",
      ubicacion: "Local 2",
      producto: "Lowther - Ambar",
      tipoHistorial: "Venta",
      anterior: 77,
      cantidad: 52,
      posterior: 129,
      unidad: "lts."
  },
  {
      identificador: 34,
      fecha: "2016-03-22 23:42:37",
      ubicacion: "Local 3",
      producto: "Crafter - Porter",
      tipoHistorial: "Venta",
      anterior: 20,
      cantidad: 96,
      posterior: 116,
      unidad: "lts."
  },
  {
      identificador: 35,
      fecha: "2016-06-19 11:13:07",
      ubicacion: "Local 2",
      producto: "Blest - Pilsen",
      tipoHistorial: "Ajuste",
      anterior: 95,
      cantidad: 66,
      posterior: 161,
      unidad: "lts."
  },
  {
      identificador: 36,
      fecha: "2016-02-15 01:38:31",
      ubicacion: "Local 2",
      producto: "Crafter - American IPA",
      tipoHistorial: "Movimiento",
      anterior: 34,
      cantidad: 88,
      posterior: 122,
      unidad: "lts."
  },
  {
      identificador: 37,
      fecha: "2016-08-10 14:59:08",
      ubicacion: "Local 2",
      producto: "Lowther - Ambar",
      tipoHistorial: "Entrada",
      anterior: 50,
      cantidad: 77,
      posterior: 127,
      unidad: "lts."
  },
  {
      identificador: 38,
      fecha: "2015-10-01 09:20:41",
      ubicacion: "Local 3",
      producto: "Crafter - American IPA",
      tipoHistorial: "Movimiento",
      anterior: 82,
      cantidad: 97,
      posterior: 179,
      unidad: "lts."
  },
  {
      identificador: 39,
      fecha: "2016-05-11 20:39:07",
      ubicacion: "Local Illia",
      producto: "Blest - Pilsen",
      tipoHistorial: "Movimiento",
      anterior: 44,
      cantidad: 23,
      posterior: 67,
      unidad: "lts."
  },
  {
      identificador: 40,
      fecha: "2016-02-27 00:54:22",
      ubicacion: "Local 3",
      producto: "Lowther - Ambar",
      tipoHistorial: "Venta",
      anterior: 19,
      cantidad: 41,
      posterior: 60,
      unidad: "lts."
  },
  {
      identificador: 41,
      fecha: "2015-09-05 00:15:34",
      ubicacion: "Local 2",
      producto: "Blest - Pilsen",
      tipoHistorial: "Venta",
      anterior: 43,
      cantidad: 62,
      posterior: 105,
      unidad: "lts."
  },
  {
      identificador: 42,
      fecha: "2016-04-17 08:11:41",
      ubicacion: "Local 2",
      producto: "Crafter - American IPA",
      tipoHistorial: "Venta",
      anterior: 1,
      cantidad: 34,
      posterior: 35,
      unidad: "lts."
  },
  {
      identificador: 43,
      fecha: "2016-06-25 05:38:03",
      ubicacion: "Local Illia",
      producto: "Crafter - Porter",
      tipoHistorial: "Ajuste",
      anterior: 97,
      cantidad: 57,
      posterior: 154,
      unidad: "lts."
  },
  {
      identificador: 44,
      fecha: "2015-11-13 01:20:34",
      ubicacion: "Local 3",
      producto: "Blest - Pilsen",
      tipoHistorial: "Movimiento",
      anterior: 5,
      cantidad: 32,
      posterior: 37,
      unidad: "lts."
  },
  {
      identificador: 45,
      fecha: "2015-12-20 16:37:43",
      ubicacion: "Local Illia",
      producto: "Crafter - American IPA",
      tipoHistorial: "Ajuste",
      anterior: 30,
      cantidad: 37,
      posterior: 67,
      unidad: "lts."
  },
  {
      identificador: 46,
      fecha: "2015-12-19 09:19:38",
      ubicacion: "Local 2",
      producto: "Crafter - Porter",
      tipoHistorial: "Ajuste",
      anterior: 63,
      cantidad: 14,
      posterior: 77,
      unidad: "lts."
  },
  {
      identificador: 47,
      fecha: "2015-12-25 18:45:48",
      ubicacion: "Local 3",
      producto: "Blest - Pilsen",
      tipoHistorial: "Venta",
      anterior: 89,
      cantidad: 68,
      posterior: 157,
      unidad: "lts."
  },
  {
      identificador: 48,
      fecha: "2015-10-19 12:10:31",
      ubicacion: "Local 2",
      producto: "Crafter - American IPA",
      tipoHistorial: "Venta",
      anterior: 77,
      cantidad: 88,
      posterior: 165,
      unidad: "lts."
  },
  {
      identificador: 49,
      fecha: "2015-12-24 21:32:10",
      ubicacion: "Local 3",
      producto: "Lowther - Ambar",
      tipoHistorial: "Venta",
      anterior: 16,
      cantidad: 90,
      posterior: 106,
      unidad: "lts."
  },
  {
      identificador: 50,
      fecha: "2015-12-13 11:32:34",
      ubicacion: "Local 2",
      producto: "Crafter - American IPA",
      tipoHistorial: "Venta",
      anterior: 27,
      cantidad: 79,
      posterior: 106,
      unidad: "lts."
  }
  ]

  for(var i = 0; i < $scope.historial.length; i++){
    $scope.historial[i].fecha=moment($scope.historial[i].fecha).locale('es').format('DD/MMM/YYYY');

    switch ($scope.historial[i].tipoHistorial){
        case 'Entrada':
        $scope.historial[i].icono= "text-success fa-arrow-circle-down";
        break;
        case 'Venta':
        $scope.historial[i].icono= "text-navy fa-cart-arrow-down";
        break; 
        case 'Ajuste':
        $scope.historial[i].icono= "text-danger fa-arrow-circle-up";
        break; 
        case 'Movimiento':
        $scope.historial[i].icono= "text-warning fa-arrow-circle-right";
        break;
    }
};

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

.controller('historialBarraCtrl', ['$scope','$log','$uibModal','$filter','DTOptionsBuilder','DTColumnDefBuilder', function($scope,$log,$uibModal,$filter,DTOptionsBuilder,DTColumnDefBuilder){

   $scope.historialBarra =[
   {
    identificador: 1,
    caja: "Barra 1",
    usuario: "Agustin",
    ubicacion: "Local Illia",
    fechaIni: "2016-08-02 18:01",
    fechaFin: "8/2/2016 22:52:16",
    litrosVendidos: 225
},  
{
    identificador: 2,
    caja: "Barra 1",
    usuario: "Aldana",
    ubicacion: "Local 2",
    fechaIni: "2016-08-03 18:03",
    fechaFin: "8/3/2016 23:09:07",
    litrosVendidos: 179
}, 
{
    identificador: 3,
    caja: "Barra 1",
    usuario: "Miqueas",
    ubicacion: "Local 2",
    fechaIni: "2016-08-04 18:09",
    fechaFin: "8/4/2016 20:42:45",
    litrosVendidos: 313
},  
{
    identificador: 4,
    caja: "Barra 2",
    usuario: "Miqueas",
    ubicacion: "Local 2",
    fechaIni: "2016-08-05 18:03",
    fechaFin: "8/5/2016 21:35:14",
    litrosVendidos: 354
},  
{
    identificador: 5,
    caja: "Barra 3",
    usuario: "Agustin",
    ubicacion: "Local Illia",
    fechaIni: "2016-08-06 18:06",
    fechaFin: "8/6/2016 23:22:26",
    litrosVendidos: 111
},  
{
    identificador: 6,
    caja: "Barra 2",
    usuario: "Agustin",
    ubicacion: "Local 2",
    fechaIni: "2016-08-07 18:02",
    fechaFin: "8/7/2016 21:59:07",
    litrosVendidos: 187
},  
{
    identificador: 7,
    caja: "Barra 2",
    usuario: "Miqueas",
    ubicacion: "Local 3",
    fechaIni: "2016-08-08 18:02",
    fechaFin: "8/8/2016 23:03:27",
    litrosVendidos: 224
},  
{
    identificador: 8,
    caja: "Barra 2",
    usuario: "Miqueas",
    ubicacion: "Local 3",
    fechaIni: "2016-08-09 18:07",
    fechaFin: "8/9/2016 20:11:16",
    litrosVendidos: 129
},  
{
    identificador: 9,
    caja: "Barra 2",
    usuario: "Gaston",
    ubicacion: "Local 2",
    fechaIni: "2016-08-10 18:09",
    fechaFin: "8/10/2016 22:52:28",
    litrosVendidos: 356
},  
{
    identificador: 10,
    caja: "Barra 3",
    usuario: "Aldana",
    ubicacion: "Local 2",
    fechaIni: "2016-08-11 18:09",
    fechaFin: "8/11/2016 21:40:58",
    litrosVendidos: 396
},  
{
    identificador: 11,
    caja: "Barra 1",
    usuario: "Aldana",
    ubicacion: "Local 2",
    fechaIni: "2016-08-12 18:04",
    fechaFin: "8/12/2016 20:25:35",
    litrosVendidos: 300
},  
{
    identificador: 12,
    caja: "Barra 2",
    usuario: "Miqueas",
    ubicacion: "Local Illia",
    fechaIni: "2016-08-13 18:08",
    fechaFin: "8/13/2016 23:15:31",
    litrosVendidos: 145
},  
{
    identificador: 13,
    caja: "Barra 3",
    usuario: "Miqueas",
    ubicacion: "Local Illia",
    fechaIni: "2016-08-14 18:02",
    fechaFin: "8/14/2016 21:31:52",
    litrosVendidos: 351
},  
{
    identificador: 14,
    caja: "Barra 1",
    usuario: "Miqueas",
    ubicacion: "Local 3",
    fechaIni: "2016-08-15 18:14",
    fechaFin: "8/15/2016 21:34:33",
    litrosVendidos: 196
},  
{
    identificador: 15,
    caja: "Barra 2",
    usuario: "Agustin",
    ubicacion: "Local Illia",
    fechaIni: "2016-08-16 18:12",
    fechaFin: "8/16/2016 21:13:30",
    litrosVendidos: 187
},  
{
    identificador: 16,
    caja: "Barra 2",
    usuario: "Aldana",
    ubicacion: "Local Illia",
    fechaIni: "2016-08-17 18:02",
    fechaFin: "8/17/2016 21:35:18",
    litrosVendidos: 379
},  
{
    identificador: 17,
    caja: "Barra 1",
    usuario: "Agustin",
    ubicacion: "Local 3",
    fechaIni: "2016-08-18 18:03",
    fechaFin: "8/18/2016 21:59:16",
    litrosVendidos: 345
},  
{
    identificador: 18,
    caja: "Barra 3",
    usuario: "Aldana",
    ubicacion: "Local Illia",
    fechaIni: "2016-08-19 18:04",
    fechaFin: "8/19/2016 21:32:58",
    litrosVendidos: 308
},  
{
    identificador: 19,
    caja: "Barra 3",
    usuario: "Miqueas",
    ubicacion: "Local Illia",
    fechaIni: "2016-08-20 18:00",
    fechaFin: "8/20/2016 21:01:47",
    litrosVendidos: 119
},  
{
    identificador: 20,
    caja: "Barra 1",
    usuario: "Gaston",
    ubicacion: "Local 2",
    fechaIni: "2016-08-21 18:06",
    fechaFin: "8/21/2016 22:38:08",
    litrosVendidos: 337
},  
{
    identificador: 21,
    caja: "Barra 1",
    usuario: "Agustin",
    ubicacion: "Local 2",
    fechaIni: "2016-08-22 18:10",
    fechaFin: "8/22/2016 21:34:39",
    litrosVendidos: 317
},  
{
    identificador: 22,
    caja: "Barra 3",
    usuario: "Aldana",
    ubicacion: "Local Illia",
    fechaIni: "2016-08-23 18:06",
    fechaFin: "8/23/2016 20:59:59",
    litrosVendidos: 337
},  
{
    identificador: 23,
    caja: "Barra 2",
    usuario: "Gaston",
    ubicacion: "Local 2",
    fechaIni: "2016-08-24 18:02",
    fechaFin: "8/24/2016 20:41:56",
    litrosVendidos: 181
},  
{
    identificador: 24,
    caja: "Barra 2",
    usuario: "Aldana",
    ubicacion: "Local 2",
    fechaIni: "2016-08-25 18:04",
    fechaFin: "8/25/2016 22:05:14",
    litrosVendidos: 317
},  
{
    identificador: 25,
    caja: "Barra 3",
    usuario: "Miqueas",
    ubicacion: "Local Illia",
    fechaIni: "2016-08-26 18:09",
    fechaFin: "8/26/2016 22:46:54",
    litrosVendidos: 106
},  
{
    identificador: 26,
    caja: "Barra 2",
    usuario: "Aldana",
    ubicacion: "Local 3",
    fechaIni: "2016-08-27 18:01",
    fechaFin: "8/27/2016 23:00:06",
    litrosVendidos: 330
},  
{
    identificador: 27,
    caja: "Barra 2",
    usuario: "Gaston",
    ubicacion: "Local Illia",
    fechaIni: "2016-08-28 18:03",
    fechaFin: "8/28/2016 20:52:40",
    litrosVendidos: 250
},  
{
    identificador: 28,
    caja: "Barra 2",
    usuario: "Gaston",
    ubicacion: "Local 3",
    fechaIni: "2016-08-29 18:11",
    fechaFin: "8/29/2016 22:35:25",
    litrosVendidos: 318
},  
{
    identificador: 29,
    caja: "Barra 2",
    usuario: "Agustin",
    ubicacion: "Local Illia",
    fechaIni: "2016-08-30 18:01",
    fechaFin: "8/30/2016 21:17:15",
    litrosVendidos: 177
},  
{
    identificador: 30,
    caja: "Barra 3",
    usuario: "Agustin",
    ubicacion: "Local 2",
    fechaIni: "2016-08-31 18:01",
    fechaFin: "8/31/2016 21:11:35",
    litrosVendidos: 148
},  
{
    identificador: 31,
    caja: "Barra 3",
    usuario: "Gaston",
    ubicacion: "Local 2",
    fechaIni: "2016-09-01 18:08",
    fechaFin: "9/1/2016 21:36:16",
    litrosVendidos: 325
},  
{
    identificador: 32,
    caja: "Barra 1",
    usuario: "Gaston",
    ubicacion: "Local 2",
    fechaIni: "2016-09-02 18:08",
    fechaFin: "9/2/2016 20:41:56",
    litrosVendidos: 236
},  
{
    identificador: 33,
    caja: "Barra 2",
    usuario: "Aldana",
    ubicacion: "Local 3",
    fechaIni: "2016-09-03 18:12",
    fechaFin: "9/3/2016 21:19:31",
    litrosVendidos: 233
},  
{
    identificador: 34,
    caja: "Barra 1",
    usuario: "Miqueas",
    ubicacion: "Local Illia",
    fechaIni: "2016-09-04 18:14",
    fechaFin: "9/4/2016 21:59:32",
    litrosVendidos: 340
},  
{
    identificador: 35,
    caja: "Barra 1",
    usuario: "Gaston",
    ubicacion: "Local 3",
    fechaIni: "2016-09-05 18:04",
    fechaFin: "9/5/2016 22:52:06",
    litrosVendidos: 141
},  
{
    identificador: 36,
    caja: "Barra 2",
    usuario: "Miqueas",
    ubicacion: "Local 3",
    fechaIni: "2016-09-06 18:04",
    fechaFin: "9/6/2016 22:59:42",
    litrosVendidos: 105
},  
{
    identificador: 37,
    caja: "Barra 2",
    usuario: "Gaston",
    ubicacion: "Local Illia",
    fechaIni: "2016-09-07 18:11",
    fechaFin: "9/7/2016 22:08:05",
    litrosVendidos: 107
},  
{
    identificador: 38,
    caja: "Barra 2",
    usuario: "Agustin",
    ubicacion: "Local Illia",
    fechaIni: "2016-09-08 18:14",
    fechaFin: "9/8/2016 22:38:13",
    litrosVendidos: 220
},  
{
    identificador: 39,
    caja: "Barra 3",
    usuario: "Miqueas",
    ubicacion: "Local 3",
    fechaIni: "2016-09-09 18:04",
    fechaFin: "9/9/2016 22:22:40",
    litrosVendidos: 136
}    

]

for(var i = 0; i < $scope.historialBarra.length; i++){
    $scope.historialBarra[i].fechaIni=moment($scope.historialBarra[i].fechaIni).locale('es').format('DD/MMM/YYYY, HH:mm');
    $scope.historialBarra[i].fechaFin=moment($scope.historialBarra[i].fechaFin).locale('es').format('DD/MMM/YYYY, HH:mm');

};

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

.controller('historialCajaCtrl', ['$scope','$log','$uibModal','$filter','DTOptionsBuilder','DTColumnDefBuilder', function($scope,$log,$uibModal,$filter,DTOptionsBuilder,DTColumnDefBuilder){

  $scope.historialCaja =[
  {
    identificador: 1,
    caja: "Caja 1",
    usuario: "Agustin",
    ubicacion: "Local Illia",
    fechaIni: "2016-08-02 18:01",
    fechaFin: "8/2/2016 22:52:16",
    ganancia: 2225
},  
{
    identificador: 2,
    caja: "Caja 1",
    usuario: "Aldana",
    ubicacion: "Local 2",
    fechaIni: "2016-08-03 18:03",
    fechaFin: "8/3/2016 23:09:07",
    ganancia: 3179
}, 
{
    identificador: 3,
    caja: "Caja 1",
    usuario: "Miqueas",
    ubicacion: "Local 2",
    fechaIni: "2016-08-04 18:09",
    fechaFin: "8/4/2016 20:42:45",
    ganancia: 1313
},  
{
    identificador: 4,
    caja: "Caja 2",
    usuario: "Miqueas",
    ubicacion: "Local 2",
    fechaIni: "2016-08-05 18:03",
    fechaFin: "8/5/2016 21:35:14",
    ganancia: 1654
},  
{
    identificador: 5,
    caja: "Caja 3",
    usuario: "Agustin",
    ubicacion: "Local Illia",
    fechaIni: "2016-08-06 18:06",
    fechaFin: "8/6/2016 23:22:26",
    ganancia: 1111
},  
{
    identificador: 6,
    caja: "Caja 2",
    usuario: "Agustin",
    ubicacion: "Local 2",
    fechaIni: "2016-08-07 18:02",
    fechaFin: "8/7/2016 21:59:07",
    ganancia: 1587
},  
{
    identificador: 7,
    caja: "Caja 2",
    usuario: "Miqueas",
    ubicacion: "Local 3",
    fechaIni: "2016-08-08 18:02",
    fechaFin: "8/8/2016 23:03:27",
    ganancia: 1224
},  
{
    identificador: 8,
    caja: "Caja 2",
    usuario: "Miqueas",
    ubicacion: "Local 3",
    fechaIni: "2016-08-09 18:07",
    fechaFin: "8/9/2016 20:11:16",
    ganancia: 1129
},  
{
    identificador: 9,
    caja: "Caja 2",
    usuario: "Gaston",
    ubicacion: "Local 2",
    fechaIni: "2016-08-10 18:09",
    fechaFin: "8/10/2016 22:52:28",
    ganancia: 1356
},  
{
    identificador: 10,
    caja: "Caja 3",
    usuario: "Aldana",
    ubicacion: "Local 2",
    fechaIni: "2016-08-11 18:09",
    fechaFin: "8/11/2016 21:40:58",
    ganancia: 1396
},  
{
    identificador: 11,
    caja: "Caja 1",
    usuario: "Aldana",
    ubicacion: "Local 2",
    fechaIni: "2016-08-12 18:04",
    fechaFin: "8/12/2016 20:25:35",
    ganancia: 1500
},  
{
    identificador: 12,
    caja: "Caja 2",
    usuario: "Miqueas",
    ubicacion: "Local Illia",
    fechaIni: "2016-08-13 18:08",
    fechaFin: "8/13/2016 23:15:31",
    ganancia: 1545
},  
{
    identificador: 13,
    caja: "Caja 3",
    usuario: "Miqueas",
    ubicacion: "Local Illia",
    fechaIni: "2016-08-14 18:02",
    fechaFin: "8/14/2016 21:31:52",
    ganancia: 1351
},  
{
    identificador: 14,
    caja: "Caja 1",
    usuario: "Miqueas",
    ubicacion: "Local 3",
    fechaIni: "2016-08-15 18:14",
    fechaFin: "8/15/2016 21:34:33",
    ganancia: 1196
},  
{
    identificador: 15,
    caja: "Caja 2",
    usuario: "Agustin",
    ubicacion: "Local Illia",
    fechaIni: "2016-08-16 18:12",
    fechaFin: "8/16/2016 21:13:30",
    ganancia: 1187
},  
{
    identificador: 16,
    caja: "Caja 2",
    usuario: "Aldana",
    ubicacion: "Local Illia",
    fechaIni: "2016-08-17 18:02",
    fechaFin: "8/17/2016 21:35:18",
    ganancia: 1379
},  
{
    identificador: 17,
    caja: "Caja 1",
    usuario: "Agustin",
    ubicacion: "Local 3",
    fechaIni: "2016-08-18 18:03",
    fechaFin: "8/18/2016 21:59:16",
    ganancia: 1345
},  
{
    identificador: 18,
    caja: "Caja 3",
    usuario: "Aldana",
    ubicacion: "Local Illia",
    fechaIni: "2016-08-19 18:04",
    fechaFin: "8/19/2016 21:32:58",
    ganancia: 1308
},  
{
    identificador: 19,
    caja: "Caja 3",
    usuario: "Miqueas",
    ubicacion: "Local Illia",
    fechaIni: "2016-08-20 18:00",
    fechaFin: "8/20/2016 21:01:47",
    ganancia: 1119
},  
{
    identificador: 20,
    caja: "Caja 1",
    usuario: "Gaston",
    ubicacion: "Local 2",
    fechaIni: "2016-08-21 18:06",
    fechaFin: "8/21/2016 22:38:08",
    ganancia: 1337
},  
{
    identificador: 21,
    caja: "Caja 1",
    usuario: "Agustin",
    ubicacion: "Local 2",
    fechaIni: "2016-08-22 18:10",
    fechaFin: "8/22/2016 21:34:39",
    ganancia: 1317
},  
{
    identificador: 22,
    caja: "Caja 3",
    usuario: "Aldana",
    ubicacion: "Local Illia",
    fechaIni: "2016-08-23 18:06",
    fechaFin: "8/23/2016 20:59:59",
    ganancia: 1337
},  
{
    identificador: 23,
    caja: "Caja 2",
    usuario: "Gaston",
    ubicacion: "Local 2",
    fechaIni: "2016-08-24 18:02",
    fechaFin: "8/24/2016 20:41:56",
    ganancia: 1181
},  
{
    identificador: 24,
    caja: "Caja 2",
    usuario: "Aldana",
    ubicacion: "Local 2",
    fechaIni: "2016-08-25 18:04",
    fechaFin: "8/25/2016 22:05:14",
    ganancia: 1317
},  
{
    identificador: 25,
    caja: "Caja 3",
    usuario: "Miqueas",
    ubicacion: "Local Illia",
    fechaIni: "2016-08-26 18:09",
    fechaFin: "8/26/2016 22:46:54",
    ganancia: 1106
},  
{
    identificador: 26,
    caja: "Caja 2",
    usuario: "Aldana",
    ubicacion: "Local 3",
    fechaIni: "2016-08-27 18:01",
    fechaFin: "8/27/2016 23:00:06",
    ganancia: 1330
},  
{
    identificador: 27,
    caja: "Caja 2",
    usuario: "Gaston",
    ubicacion: "Local Illia",
    fechaIni: "2016-08-28 18:03",
    fechaFin: "8/28/2016 20:52:40",
    ganancia: 1250
},  
{
    identificador: 28,
    caja: "Caja 2",
    usuario: "Gaston",
    ubicacion: "Local 3",
    fechaIni: "2016-08-29 18:11",
    fechaFin: "8/29/2016 22:35:25",
    ganancia: 1318
},  
{
    identificador: 29,
    caja: "Caja 2",
    usuario: "Agustin",
    ubicacion: "Local Illia",
    fechaIni: "2016-08-30 18:01",
    fechaFin: "8/30/2016 21:17:15",
    ganancia: 1177
},  
{
    identificador: 30,
    caja: "Caja 3",
    usuario: "Agustin",
    ubicacion: "Local 2",
    fechaIni: "2016-08-31 18:01",
    fechaFin: "8/31/2016 21:11:35",
    ganancia: 1148
},  
{
    identificador: 31,
    caja: "Caja 3",
    usuario: "Gaston",
    ubicacion: "Local 2",
    fechaIni: "2016-09-01 18:08",
    fechaFin: "9/1/2016 21:36:16",
    ganancia: 1625
},  
{
    identificador: 32,
    caja: "Caja 1",
    usuario: "Gaston",
    ubicacion: "Local 2",
    fechaIni: "2016-09-02 18:08",
    fechaFin: "9/2/2016 20:41:56",
    ganancia: 1236
},  
{
    identificador: 33,
    caja: "Caja 2",
    usuario: "Aldana",
    ubicacion: "Local 3",
    fechaIni: "2016-09-03 18:12",
    fechaFin: "9/3/2016 21:19:31",
    ganancia: 4233
},  
{
    identificador: 34,
    caja: "Caja 1",
    usuario: "Miqueas",
    ubicacion: "Local Illia",
    fechaIni: "2016-09-04 18:14",
    fechaFin: "9/4/2016 21:59:32",
    ganancia: 4340
},  
{
    identificador: 35,
    caja: "Caja 1",
    usuario: "Gaston",
    ubicacion: "Local 3",
    fechaIni: "2016-09-05 18:04",
    fechaFin: "9/5/2016 22:52:06",
    ganancia: 3141
},  
{
    identificador: 36,
    caja: "Caja 2",
    usuario: "Miqueas",
    ubicacion: "Local 3",
    fechaIni: "2016-09-06 18:04",
    fechaFin: "9/6/2016 22:59:42",
    ganancia: 1805
},  
{
    identificador: 37,
    caja: "Caja 2",
    usuario: "Gaston",
    ubicacion: "Local Illia",
    fechaIni: "2016-09-07 18:11",
    fechaFin: "9/7/2016 22:08:05",
    ganancia: 5107
},  
{
    identificador: 38,
    caja: "Caja 2",
    usuario: "Agustin",
    ubicacion: "Local Illia",
    fechaIni: "2016-09-08 18:14",
    fechaFin: "9/8/2016 22:38:13",
    ganancia: 4220
},  
{
    identificador: 39,
    caja: "Caja 3",
    usuario: "Miqueas",
    ubicacion: "Local 3",
    fechaIni: "2016-09-09 18:04",
    fechaFin: "9/9/2016 22:22:40",
    ganancia: 3536
}    

]

for(var i = 0; i < $scope.historialCaja.length; i++){
    $scope.historialCaja[i].fechaIni=moment($scope.historialCaja[i].fechaIni).locale('es').format('DD/MMM/YYYY, HH:mm');
    $scope.historialCaja[i].fechaFin=moment($scope.historialCaja[i].fechaFin).locale('es').format('DD/MMM/YYYY, HH:mm');

};

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

.controller('canillasCtrl', ['$scope','$log','$uibModal','$filter','SweetAlert', function($scope,$log,$uibModal,$filter,SweetAlert){

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

$scope.canillas =[            
{
 id:0,
 numero:1,
 ubicacion:'Local 1',
 idInventario:'0',
 productoMarca:'Crafter',
 productoNombre:'American IPA',
 productoColor:'#E8692E ',
 productoStock:130,
 productoIbu:40,
 productoAlcohol:6
},            
{
 id:1,
 numero:2,
 ubicacion:'Local 1',
 idInventario:'1',
 productoMarca:'Blest',
 productoNombre:'Pilsen',
 productoColor:'#F6AC3F ',
 productoStock:141,
 productoIbu:40,
 productoAlcohol:6
},            
{
 id:2,
 numero:3,
 ubicacion:'Local 1',
 idInventario:'2',
 productoMarca:'Lowther',
 productoNombre:'Ambar',
 productoColor:'#E08D3B ',
 productoStock:93,
 productoIbu:40,
 productoAlcohol:6
},            
{
 id:3,
 numero:4,
 ubicacion:'Local 1',
 idInventario:'3',
 productoMarca:'Crafter',
 productoNombre:'Blueberry',
 productoColor:'#82171A',
 productoStock:245,
 productoIbu:40,
 productoAlcohol:6
},            
{
 id:4,
 numero:5,
 ubicacion:'Local 1',
 idInventario:'4',
 productoMarca:'Nuevo Origen',
 productoNombre:'Firenze',
 productoColor:'#E08D3B',
 productoStock:57,
 productoIbu:40,
 productoAlcohol:6
},            
{
 id:5,
 numero:6,
 ubicacion:'Local 1',
 idInventario:'5',
 productoMarca:'Crafter',
 productoNombre:'Honey',
 productoColor:'#E8692E',
 productoStock:293,
 productoIbu:40,
 productoAlcohol:6
},            
{
 id:6,
 numero:7,
 ubicacion:'Local 1',
 idInventario:'6',
 productoMarca:'Nuevo Origen',
 productoNombre:'Little Wing',
 productoColor:'#E08D3B',
 productoStock:118,
 productoIbu:40,
 productoAlcohol:6
},            
{
 id:7,
 numero:8,
 ubicacion:'Local 1',
 idInventario:'7',
 productoMarca:'Nuevo Origen',
 productoNombre:'Dorada Pampeana',
 productoColor:'#E8692E',
 productoStock:159,
 productoIbu:40,
 productoAlcohol:6
},            
{
 id:8,
 numero:9,
 ubicacion:'Local 1',
 idInventario:'8',
 productoMarca:'Crafter',
 productoNombre:'Scottish"',
 productoColor:'#82171A',
 productoStock:273,
 productoIbu:40,
 productoAlcohol:6
},            
{
 id:9,
 numero:10,
 ubicacion:'Local 1',
 idInventario:'9',
 productoMarca:'Lowther',
 productoNombre:'Brown Ale',
 productoColor:'#E8692E',
 productoStock:172,
 productoIbu:40,
 productoAlcohol:6
},            
{
 id:10,
 numero:11,
 ubicacion:'Local 1',
 idInventario:'10',
 productoMarca:'Crafter',
 productoNombre:'Hazenut',
 productoColor:'#E8692E',
 productoStock:128,
 productoIbu:40,
 productoAlcohol:6
},            
{
 id:11,
 numero:12,
 ubicacion:'Local 1',
 idInventario:'11',
 productoMarca:'Kalevala',
 productoNombre:'Irish Red Ale',
 productoColor:'#E8692E',
 productoStock:98,
 productoIbu:40,
 productoAlcohol:6
},            
{
 id:12,
 numero:13,
 ubicacion:'Local 1',
 idInventario:'12',
 productoMarca:'Lowther',
 productoNombre:'IPA',
 productoColor:'#E8692E ',
 productoStock:167,
 productoIbu:40,
 productoAlcohol:6
},            
{
 id:13,
 numero:14,
 ubicacion:'Local 1',
 idInventario:'13',
 productoMarca:'Blest',
 productoNombre:'Scotch',
 productoColor:'#E8692E ',
 productoStock:243,
 productoIbu:40,
 productoAlcohol:6
},            
{
 id:14,
 numero:15,
 ubicacion:'Local 1',
 idInventario:'14',
 productoMarca:'Nuevo Origen',
 productoNombre:'Rocky',
 productoColor:'#E8692E ',
 productoStock:237,
 productoIbu:40,
 productoAlcohol:6
},            
{
 id:15,
 numero:16,
 ubicacion:'Local 1',
 idInventario:'15',
 productoMarca:'Nuevo Origen',
 productoNombre:'Boreal',
 productoColor:'#E8692E ',
 productoStock:60,
 productoIbu:40,
 productoAlcohol:6
},            
{
 id:16,
 numero:17,
 ubicacion:'Local 1',
 idInventario:'16',
 productoMarca:'Crafter',
 productoNombre:'Porter',
 productoColor:'#6B190F ',
 productoStock:229,
 productoIbu:40,
 productoAlcohol:6
},            
{
 id:17,
 numero:18,
 ubicacion:'Local 1',
 idInventario:'17',
 productoMarca:'Blest',
 productoNombre:'Bock',
 productoColor:'#6B190F ',
 productoStock:276,
 productoIbu:40,
 productoAlcohol:6
},            
{
 id:18,
 numero:19,
 ubicacion:'Local 1',
 idInventario:'',
 productoMarca:'',
 productoNombre:'',
 productoColor:'',
 productoStock:'',
 productoIbu:'',
 productoAlcohol:''
},            
{
 id:19,
 numero:20,
 ubicacion:'Local 1',
 idInventario:'',
 productoMarca:'',
 productoNombre:'',
 productoColor:'',
 productoStock:'',
 productoIbu:'',
 productoAlcohol:''
},            
{
 id:20,
 numero:1,
 ubicacion:'Local 2',
 idInventario:'20',
 productoMarca:'Kalevala',
 productoNombre:'Bitter',
 productoColor:'#6B190F ',
 productoStock:252,
 productoIbu:40,
 productoAlcohol:6
},            
{
 id:21,
 numero:2,
 ubicacion:'Local 2',
 idInventario:'21',
 productoMarca:'Crafter',
 productoNombre:'Honey',
 productoColor:'#E8692E',
 productoStock:110,
 productoIbu:40,
 productoAlcohol:6
},            
{
 id:22,
 numero:3,
 ubicacion:'Local 2',
 idInventario:'22',
 productoMarca:'Nuevo Origen',
 productoNombre:'Firenze',
 productoColor:'#E08D3B',
 productoStock:239,
 productoIbu:40,
 productoAlcohol:6
},            
{
 id:23,
 numero:4,
 ubicacion:'Local 2',
 idInventario:'23',
 productoMarca:'Lowther',
 productoNombre:'Brown Ale',
 productoColor:'#E8692E ',
 productoStock:194,
 productoIbu:40,
 productoAlcohol:6
},            
{
 id:24,
 numero:5,
 ubicacion:'Local 2',
 idInventario:'24',
 productoMarca:'Blest',
 productoNombre:'Pilsen',
 productoColor:'#F6AC3F ',
 productoStock:145,
 productoIbu:40,
 productoAlcohol:6
},

]


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
