/**
 * QUANTUM - Responsive Admin Theme
 *
 * Main controller.js file
 * Define controllers with data used in Inspinia theme
 *
 *
 * Functions (controllers)
 *  - MainCtrl
 *  - dashboardFlotOne
 *  - dashboardFlotTwo
 *  - dashboardFlotFive
 *  - dashboardMap
 *  - flotChartCtrl
 *  - rickshawChartCtrl
 *  - sparklineChartCtrl
 *  - widgetFlotChart
 *  - modalDemoCtrl
 *  - ionSlider
 *  - wizardCtrl
 *  - CalendarCtrl
 *  - chartJsCtrl
 *  - GoogleMaps
 *  - ngGridCtrl
 *  - codeEditorCtrl
 *  - nestableCtrl
 *  - notifyCtrl
 *  - translateCtrl
 *  - imageCrop
 *  - diff
 *  - idleTimer
 *  - liveFavicon
 *  - formValidation
 *  - agileBoard
 *  - draggablePanels
 *  - chartistCtrl
 *  - metricsCtrl
 *  - sweetAlertCtrl
 *  - selectCtrl
 *  - toastrCtrl
 *  - loadingCtrl
 *  - datatablesCtrl
 *  - truncateCtrl
 *  - touchspinCtrl
 *  - tourCtrl
 *  - jstreeCtrl
 *
 *
 */



function calendarioAlquiler ($scope,$log,$uibModalInstance,$http){
    var disponible = 'background-color: #fff;';
    var nope = 'background-color: #ed5565';
    var warning ='background-color: #f0ad4e;';
    var ok ='background-color: #1ab394;';
    var hoy = 'background-color: #5bc0de';
    var noLaboral = 'background-color: #f9f9f9';
    var vencido ='background-color: #f9f9f9';

    //TODO
    //agregar si vencido >> no hace falta, Miqueas dice que queden disponibles
    //DONE verificar dia actual mas 2 (lo mismo que para atras, para adelante)
    //DONE 3 dias (22,23,24) auxiliares apra verificar el estado del ultimo domingo(dia 21)
    //DONE domingos y lunes, que no los salte el sabado

$scope.alquiler={}

    $scope.seleccionarBarril = function(barril){
        console.log ("barril seleccionado")
        console.log (barril)

            if($scope.alquiler.desde){
                $scope.barrilSeleccionado = barril;
                $scope.barrilSeleccionado.desde = $scope.alquiler.desde
                $scope.barrilSeleccionado.hasta = $scope.alquiler.hasta
            } else{
                $scope.barrilSeleccionado = undefined
            }
    }
    $scope.guardarAlquiler = function(){

    }

    $scope.calculateClassAnterior = function(alquilable,dia){

    alquilable=this.$parent.alquilables[alquilable-1];

        for (var i = dia+4; i >= 0; i--) {//limpia para adelante (de onda, no le digas a nadie)
            if (i>20) i=20;
            alquilable.dias[i].hover = alquilable.dias[i].claseAnterior
        }
        dia.hover=dia.claseAnterior
    }
    $scope.calculateClass = function(alquilable,dia){

    
    alquilable=this.$parent.alquilables[alquilable-1];

    // sirve de algo? que pasa si estan despelotados los dias en el array y no coinciden?
    for (var i = 0; i < alquilable.dias.length; i++) {
        if(alquilable.dias.id==dia-1) dia=alquilable.dias.id;
    }

    var marcar = function(){



            desde = dia - 2;
            desdeFecha =moment(alquilable.dias[dia-1].fecha);
            hasta = dia + 1;
            hastaFecha=moment(alquilable.dias[dia].fecha);
            
            //
            // Solo para cuando no abre los domingos y lunes
            //
            // if (((alquilable.dias[dia-1].id+1)%7) == 0){
            //  //sabado
            //  hasta=dia+2;
            //  hastaFecha.add(2, 'days');
            //  //alquilable.dias[dia-1].fecha.setDate(alquilable.dias[dia-1].fecha.getDate() + hasta);
            //  //someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
            //  //console.log("sabado");
            //  
            // }
            //
            //

            for (var i = hasta; i >= desde; i--) {
                if (i>21) i=21;
                if (i > -1){                        
                    //console.log("for " + i);
                    alquilable.dias[i].hover = ok;
                }

            }

            if (alquilable.dias[desde] && alquilable.dias[desde].estado != "disponible"){                   
                alquilable.dias[desde].hover = warning;
                alquilable.dias[dia-1].hover = warning;
            }
            
            alquilable.dias[dia-1].hover = hoy;

            if(dia!=21 && alquilable.dias[hasta].estado == "alquilado"){//si no es el ultimo domingo
                    alquilable.dias[dia-1].hover = warning;
                    for (var i = -2; i < 1; i++) {
                        alquilable.dias[hasta+i].hover = warning;
                    }
                    

            } 

            
            $scope.alquiler.hasta=moment(hastaFecha).locale('es').format('dddd DD MMMM').toUpperCase();
            $scope.alquiler.desde=moment(desdeFecha).locale('es').format('dddd DD MMMM').toUpperCase();
        
    }

    alquilable.dias[dia-1].claseAnterior=alquilable.dias[dia-1].hover;
            
            if (alquilable.dias[dia-1].fecha.isBefore(moment().startOf('date').add(0,'days'))){
                //1 antes de hoy
                alquilable.dias[dia-1].hover=nope;              
                $scope.alquiler.desde="";
                $scope.alquiler.hasta="";
            } else if (alquilable.dias[dia].estado=="vencido"){
                //nada, no hay hover porque el barril no fue devuelto
            }
            //
            // Si domingo o lunes
            //
            //else if (((alquilable.dias[dia-1].id+7)%7) == 0 ||((alquilable.dias[dia-1].id+6)%7) == 0){
            //          //domingo||lunes
            //  alquilable.dias[dia-1].hover=nope;              
            //  $scope.alquiler.desde="";
            //  $scope.alquiler.hasta="";
            //} 
            //
            //

            else if (alquilable.dias[dia-1].estado == "alquilado"){ 
                       //hoy alquilado  
                alquilable.dias[dia-1].hover=nope;              
                $scope.alquiler.desde="";
                $scope.alquiler.hasta="";
            //} else if(alquilable.dias[dia].estado == "alquilado" || (alquilable.dias[dia+1].estado == "alquilado") || (alquilable.dias[dia+2].estado == "alquilado")){
                       //mañana o pasado alquilado 
            
            } else if(alquilable.dias[dia].estado == "alquilado" ){
                       //mañana alquilado 
                alquilable.dias[dia-1].hover=nope;              
                $scope.alquiler.desde="";
                $scope.alquiler.hasta="";
            }
            //
            //  Solo en caso de domingo y lunes no laboral
            //
            //else if (dia!=20 && ((alquilable.dias[dia-1].id+1)%7) == 0 && (alquilable.dias[dia+2].estado == "alquilado")){
            //          //!ultimo sabado & sabado && martes alquilado   
            //  alquilable.dias[dia-1].hover=nope;
            //  $scope.alquiler.desde="";
            //  $scope.alquiler.hasta="";
            //}
            //
            else if (alquilable.dias[dia-2] && alquilable.dias[dia-2].estado != "alquilado"){
                marcar();
            } else if (!alquilable.dias[dia-2] && alquilable.dias[dia-1].estado != "alquilado"){
                marcar();   
            } else {
                alquilable.dias[dia-1].hover = nope;
                $scope.alquiler.desde="";
                $scope.alquiler.hasta="";
            }
        }


        //Traer alquilables, recordar que se muestran, aunque esten vencidos (El ultimo caso de estos, no aplica)

    $scope.alquilables=[
    {
        id:1,
        nombre: "9 lts. No˚01",
        dias:[
        {
            id:1,
            estado:"alquilado",//lunes
        },
        {
            id:2,
            estado:"alquilado",//martes
        },
        {
            id:3,
            estado:"disponible",//miercoles
        },
        {
            id:4,
            estado:"disponible",//jueves
        },
        {
            id:5,
            estado:"disponible",//viernes
        },
        {
            id:6,
            estado:"alquilado",//sabado
        },
        {
            id:7,
            estado:"alquilado",//domingo
        },
        {
            id:8,
            estado:"alquilado",//lunes
        },
        {
            id:9,
            estado:"alquilado",//martes
        },
        {
            id:10,
            estado:"disponible",//miercoles
        },
        {
            id:11,
            estado:"disponible",//jueves
        },
        {
            id:12,
            estado:"disponible",//viernes
        },
        {
            id:13,
            estado:"disponible",//sabado
        },
        {
            id:14,
            estado:"disponible",//domingo
        },
        {
            id:15,
            estado:"disponible",//lunes
        },
        {
            id:16,
            estado:"alquilado",//martes
        },
        {
            id:17,
            estado:"alquilado",//miercoles
        },
        {
            id:18,
            estado:"disponible",//jueves
        },
        {
            id:19,
            estado:"disponible",//viernes
        },
        {
            id:20,
            estado:"disponible",//sabado
        },
        {
            id:21,
            estado:"disponible",//domingo
        },
        {
            id:22,
            estado:"disponible",//lunes (no se muestra)
        },
        {
            id:23,
            estado:"disponible",//martes (no se muestra)
        },
        {
            id:24,
            estado:"disponible",//miercoles (no se muestra)
        }
        ]
    },
    {
        id:2,
        nombre: "9 lts. No˚02",
        dias:[
        {
            id:1,
            estado:"disponible",//lunes
        },
        {
            id:2,
            estado:"disponible",//martes
        },
        {
            id:3,
            estado:"disponible",//miercoles
        },
        {
            id:4,
            estado:"disponible",//jueves
        },
        {
            id:5,
            estado:"alquilado",//viernes
        },
        {
            id:6,
            estado:"alquilado",//sabado
        },
        {
            id:7,
            estado:"disponible",//domingo
        },
        {
            id:8,
            estado:"disponible",//lunes
        },
        {
            id:9,
            estado:"alquilado",//martes
        },
        {
            id:10,
            estado:"alquilado",//miercoles
        },
        {
            id:11,
            estado:"disponible",//jueves
        },
        {
            id:12,
            estado:"disponible",//viernes
        },
        {
            id:13,
            estado:"disponible",//sabado
        },
        {
            id:14,
            estado:"disponible",//domingo
        },
        {
            id:15,
            estado:"disponible",//lunes
        },
        {
            id:16,
            estado:"disponible",//martes
        },
        {
            id:17,
            estado:"disponible",//miercoles
        },
        {
            id:18,
            estado:"alquilado",//jueves
        },
        {
            id:19,
            estado:"alquilado",//viernes
        },
        {
            id:20,
            estado:"disponible",//sabado
        },
        {
            id:21,
            estado:"disponible",//domingo
        },
        {
            id:22,
            estado:"disponible",//lunes (no se muestra)
        },
        {
            id:23,
            estado:"disponible",//martes (no se muestra)
        },
        {
            id:24,
            estado:"disponible",//miercoles (no se muestra)
        }
        ]
    },
    {
        id:3,
        nombre: "9 lts. No˚03",
        dias:[
        {
            id:1,
            estado:"disponible",//lunes
        },
        {
            id:2,
            estado:"alquilado",//martes
        },
        {
            id:3,
            estado:"alquilado",//miercoles
        },
        {
            id:4,
            estado:"disponible",//jueves
        },
        {
            id:5,
            estado:"disponible",//viernes
        },
        {
            id:6,
            estado:"alquilado",//sabado
        },
        {
            id:7,
            estado:"alquilado",//domingo
        },
        {
            id:8,
            estado:"alquilado",//lunes
        },
        {
            id:9,
            estado:"alquilado",//martes
        },
        {
            id:10,
            estado:"disponible",//miercoles
        },
        {
            id:11,
            estado:"disponible",//jueves
        },
        {
            id:12,
            estado:"disponible",//viernes
        },
        {
            id:13,
            estado:"disponible",//sabado
        },
        {
            id:14,
            estado:"disponible",//domingo
        },
        {
            id:15,
            estado:"disponible",//lunes
        },
        {
            id:16,
            estado:"disponible",//martes
        },
        {
            id:17,
            estado:"disponible",//miercoles
        },
        {
            id:18,
            estado:"disponible",//jueves
        },
        {
            id:19,
            estado:"disponible",//viernes
        },
        {
            id:20,
            estado:"disponible",//sabado
        },
        {
            id:21,
            estado:"disponible",//domingo
        },
        {
            id:22,
            estado:"disponible",//lunes (no se muestra)
        },
        {
            id:23,
            estado:"alquilado",//martes (no se muestra)
        },
        {
            id:24,
            estado:"alquilado",//miercoles (no se muestra)
        }
        ]
    },
    {
        id:4,
        nombre: "9 lts. No˚04",
        dias:[
        {
            id:1,
            estado:"disponible",//lunes
        },
        {
            id:2,
            estado:"disponible",//martes
        },
        {
            id:3,
            estado:"disponible",//miercoles
        },
        {
            id:4,
            estado:"alquilado",//jueves
        },
        {
            id:5,
            estado:"alquilado",//viernes
        },
        {
            id:6,
            estado:"disponible",//sabado
        },
        {
            id:7,
            estado:"disponible",//domingo
        },
        {
            id:8,
            estado:"disponible",//lunes
        },
        {
            id:9,
            estado:"disponible",//martes
        },
        {
            id:10,
            estado:"disponible",//miercoles
        },
        {
            id:11,
            estado:"disponible",//jueves
        },
        {
            id:12,
            estado:"disponible",//viernes
        },
        {
            id:13,
            estado:"disponible",//sabado
        },
        {
            id:14,
            estado:"disponible",//domingo
        },
        {
            id:15,
            estado:"disponible",//lunes
        },
        {
            id:16,
            estado:"disponible",//martes
        },
        {
            id:17,
            estado:"disponible",//miercoles
        },
        {
            id:18,
            estado:"disponible",//jueves
        },
        {
            id:19,
            estado:"disponible",//viernes
        },
        {
            id:20,
            estado:"disponible",//sabado
        },
        {
            id:21,
            estado:"disponible",//domingo
        },
        {
            id:22,
            estado:"disponible",//lunes (no se muestra)
        },
        {
            id:23,
            estado:"disponible",//martes (no se muestra)
        },
        {
            id:24,
            estado:"alquilado",//miercoles (no se muestra)
        }
        ]
    },
    
    {
        id:5,
        nombre: "9 lts. No˚05",
        dias:[
        {
            id:1,
            estado:"disponible",//lunes
        },
        {
            id:2,
            estado:"disponible",//martes
        },
        {
            id:3,
            estado:"disponible",//miercoles
        },
        {
            id:4,
            estado:"disponible",//jueves
        },
        {
            id:5,
            estado:"disponible",//viernes
        },
        {
            id:6,
            estado:"disponible",//sabado
        },
        {
            id:7,
            estado:"disponible",//domingo
        },
        {
            id:8,
            estado:"disponible",//lunes
        },
        {
            id:9,
            estado:"disponible",//martes
        },
        {
            id:10,
            estado:"disponible",//miercoles
        },
        {
            id:11,
            estado:"disponible",//jueves
        },
        {
            id:12,
            estado:"disponible",//viernes
        },
        {
            id:13,
            estado:"disponible",//sabado
        },
        {
            id:14,
            estado:"disponible",//domingo
        },
        {
            id:15,
            estado:"disponible",//lunes
        },
        {
            id:16,
            estado:"disponible",//martes
        },
        {
            id:17,
            estado:"disponible",//miercoles
        },
        {
            id:18,
            estado:"disponible",//jueves
        },
        {
            id:19,
            estado:"disponible",//viernes
        },
        {
            id:20,
            estado:"disponible",//sabado
        },
        {
            id:21,
            estado:"disponible",//domingo
        },
        {
            id:22,
            estado:"disponible",//lunes (no se muestra)
        },
        {
            id:23,
            estado:"disponible",//martes (no se muestra)
        },
        {
            id:24,
            estado:"disponible",//miercoles (no se muestra)
        }
        ]
    }
    ];



        /*
        start SOLO PARA TESTING
        */
        var primerDiaDeEstaSamana=moment().startOf('isoWeek');//.subtract(7, 'days');//menos 7 para test
        //usar esta variable para enviar la consulta a more

        for (var i = 0; i <  $scope.alquilables.length; i++) {  
            $scope.alquilables[i].dias[0].fecha =primerDiaDeEstaSamana.clone();
            $scope.alquilables[i].dias[0].diaFecha=primerDiaDeEstaSamana.clone().locale('es').format('DD');

            for ( j = 1; j <  $scope.alquilables[i].dias.length; j++) {
                $scope.alquilables[i].dias[j].fecha=$scope.alquilables[i].dias[j-1].fecha.clone().add(1, 'days');
                $scope.alquilables[i].dias[j].diaFecha=$scope.alquilables[i].dias[j-1].fecha.clone().add(1, 'days').locale('es').format('DD');
            }
        }
        /*
        end SOLO PARA TESTING
        */


for (var i = 0; i <  $scope.alquilables.length; i++) {
    
    for ( j = 0; j <  $scope.alquilables[i].dias.length; j++) {
        $scope.alquilables[i].dias[j].hover=disponible;
        $scope.alquilables[i].dias[j].claseAnterior=disponible;
        
        if ($scope.alquilables[i].dias[j].estado=="vencido"){
            $scope.alquilables[i].dias[j].hover = vencido;
            $scope.alquilables[i].dias[j].claseAnterior = vencido;
        }
        //
        //Pinto domingos && lunes
        //if ((($scope.alquilables[i].dias[j].id+7)%7) == 0||(($scope.alquilables[i].dias[j].id+6)%7) == 0){
        //  
        //  $scope.alquilables[i].dias[j].hover = noLaboral;
        //  $scope.alquilables[i].dias[j].claseAnterior = noLaboral
        //}
        //

        if ($scope.alquilables[i].dias[j].estado == "alquilado"){
            $scope.alquilables[i].dias[j].hover = nope;
            $scope.alquilables[i].dias[j].claseAnterior = nope
        }
        
        
    }
}

console.log($scope.alquilables);
}

function scanearCuponCtrl ($scope,$log,$uibModalInstance,$http){

    $scope.cupon.error = false;

    $scope.verificarCupon = function () {

        $http.get('http://45.55.160.227/api/pos/barra/cupon',{
            params : {
                codigo:$scope.cupon.numero
            }
        }).success(function(response){    
            if(response.validacion=="Vigente"){
                $scope.cupon.error = false;
                $scope.cupon.estado = "OK";
                $scope.cupon.vencimiento=moment(response.fecha).add(response.vigencia,'days').locale('es').format('DD-MMM-YYYY');

                $scope.cupon.nombre=response.nombre;
                $scope.cupon.apellido=response.apellido;

                if(response.cumple == "Hoy"){
                    response.cumple='¡¡¡Hoy!!!'

                }

                $scope.$parent.clienteSeleccionado ={
                    nombre:response.nombre + ' ' + response.apellido,
                    telefono:response.telefono,
                    fNac:response.cumple,
                    direccion:response.direccion,
                    ultimaCompra:response.UltCompraProducto + " - " + response.UltCompraCantidad,
                    fechaUltimaCompra:response.UltCompraFecha
                }

                $scope.$parent.cuponSeleccionado={
                    numero:$scope.cupon.numero,
                    litros:response.litros
                }

            }else {
                $scope.cupon.error=true;
                $scope.cupon.estado=response.validacion;
            }
        }).error(function(error){
            console.log(error);
        });

    }

    $scope.onTextChange = function (){

        if ($scope.cupon.numero.length == 13){
                $scope.verificarCupon();// A LOS 13 DIGITOS 
            } else if ($scope.cupon.numero.length > 13){
                $scope.cupon.numero = $scope.cupon.numero.substring(0, 13);
            }

        }

        $scope.ok = function () {
            $uibModalInstance.close();            
            
        };

        $scope.cancel = function () {            
            $scope.cupon=null;
            $scope.$parent.cuponSeleccionado=null;
            $scope.$parent.clienteSeleccionado=null;
            $uibModalInstance.dismiss('cancel');
        };
        

    };

    function modalControler ($scope,$http,$log,$uibModalInstance,SweetAlert,clientes){

        $scope.clientes = clientes;       
        $scope.asd = moment('01/01/1985');
        
        $scope.seleccion={};

        $scope.flag = false;
        $scope.idCliente = null;

        $scope.ok = function () {
            console.log('$scope.flag');
            console.log($scope.flag);
            if($scope.flag){
                $http.get('http://45.55.160.227/api/pos/caja/cliente/' + $scope.idCliente).success(function(datosCliente){
                    $scope.datosCliente = datosCliente.data;
                    
                    $scope.$parent.clienteSeleccionado={};
                    $scope.$parent.clienteSeleccionado = $scope.datosCliente;
                    //$scope.$parent.resumen.nombreClienteSeleccionado = $scope.$parent.clienteSeleccionado.nombre + ' '+ $scope.$parent.clienteSeleccionado.apellido ;
                    console.log($scope.$parent.clienteSeleccionado);
                    $uibModalInstance.close($scope.datosCliente);
                }).error(function(error){
                    console.log(error);
                });
            }

        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        
        $scope.clientesFiltrados = function (filteredData) {          

            if (filteredData.length == 1) {

                if ($scope.seleccion.clienteSeleccionado!=filteredData[0].id){
                    $scope.seleccionarNuevo(filteredData[0].id);
                }

                return filteredData;

            } else{
                return filteredData;
            }
            
        }

        $scope.seleccionarNuevo= function(id){
            $scope.idCliente = id;
            $scope.flag = true;
            console.log(id);
            $scope.seleccion.clienteSeleccionado=id;
            /*
            $http.get('http://45.55.160.227/api/pos/caja/cliente/' + id).success(function(datosCliente){
                $scope.datosCliente = datosCliente.data;
            }).error(function(error){
                console.log(error);
            });
    
            $scope.datosCliente = cliente; 
            */
            //console.log(cliente);     

      }

      $scope.cargarNuevo= function(newCliNombre,newCliApellido,newCliDni,newCliTelefono,newCliCelular,newCliEmail,newCliDireccion,newCliLocalidad){

        var newCliFechaNacimiento=angular.element(document.querySelector('#fechaNacimiento')).val();

        newCliFechaNacimiento=moment().format("YYYY-MM-DD");
//--


                    SweetAlert.swal({
                        title: "¿Estas Seguro?",
                        text: "Vas a agregar a <span style='color:#F8BB86; font-weight:600'>" + newCliNombre + " " +newCliApellido +"</span> <br> como nuevo cliente",
                        type: "warning", 
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "¡Si, agregalo!",
                        cancelButtonText: "¡No, cancelar!",
                        closeOnConfirm: true,
                        closeOnCancel: false,
                        html: true },
                        function (isConfirm) {
                            if (isConfirm) {
                                $http.post('http://45.55.160.227/api/pos/caja/cliente',{
                                    nombre:newCliNombre,
                                    apellido:newCliApellido,
                                    dni:newCliDni,
                                    telefono:newCliTelefono,
                                    celular:newCliCelular,
                                    email:newCliEmail,
                                    fechaNacimiento:newCliFechaNacimiento,
                                    direccion:newCliDireccion,
                                    localidad:newCliLocalidad
                                }).success(function(datosCliente){    
                                    var newCli = {};
                                    newCli.nombre = datosCliente.data.nombre;
                                    newCli.apellido = datosCliente.data.apellido;
                                    newCli.dni = datosCliente.data.dni;
                                    newCli.id = datosCliente.data.id;
                                    newCli.direccion = datosCliente.data.direccion;
                                    newCli.telefono = datosCliente.data.telefono;
                                    newCli.estado = 'Inactivo';
                                    $scope.clientes.push(newCli);
                                    $scope.datosCliente = datosCliente.data;
                                    $scope.$parent.clienteSeleccionado = $scope.datosCliente;                                    
                                    var nuevoCliente = datosCliente.data;
                                    $uibModalInstance.close($scope.datosCliente);

                                }).error(function(error){
                                    console.log(error.error);
                                    SweetAlert.swal("ERROR", error.error, "error");
                                    $uibModalInstance.close();

                                });                                

                            } else {
                                SweetAlert.swal("Cancelado", "Todo sigue como antes", "error");
                            }
                        });




//--



    }
};

function modalProveedoresControler ($http,$scope,$log,$uibModalInstance,proveedores){

    $scope.proveedores = proveedores;
    $scope.cargarNuevo= function(newProvNombre,newProvDireccion,newProvTelefono,newProvEmail,newProvMetodoPago,newProvContacto,newProvTelefonoContacto,newProvCuit){




        $http.post('http://45.55.160.227/api/admin/proveedor',{
            nombre:newProvNombre,
            direccion:newProvDireccion,
            telefono:newProvTelefono,
            email:newProvEmail,
            metodoPago:newProvMetodoPago,
            contacto:newProvContacto,
            telefonoContacto:newProvTelefonoContacto,
            cuit:newProvCuit
        }).success(function(datosProveedor){    
            var newProv = {};
            newProv.nombre = datosProveedor.data.nombre;
            newProv.direccion = datosProveedor.data.direccion;
            newProv.telefono = datosProveedor.data.telefono;
            newProv.email = datosProveedor.data.email;
            newProv.metodoPago = datosProveedor.data.metodoPago;
            newProv.contacto = datosProveedor.data.contacto;
            newProv.telefonoContacto = datosProveedor.data.telefonoContacto
            newProv.cuit = datosProveedor.data.cuit;

            $scope.proveedores.push(newProv);
            $scope.datosProveedor = datosProveedor.data;
            var nuevoCliente = datosProveedor.data;
            $uibModalInstance.close($scope.datosProveedor);

        }).error(function(error){
            console.log(error);
            $uibModalInstance.close();
        });


    }

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

};

function detalleVentaCtrl ($http,$scope,$log,$uibModalInstance,venta){

    $scope.venta=venta;
    $scope.total = 0;
    $http.get('http://45.55.160.227/api/admin/venta/'+$scope.venta.id).success(function(response){    
        $scope.venta.items = response.data;

        $scope.venta.items.forEach(function(item){
            $scope.total += (item.costo * item.cantidad);
        });
        
    }).error(function(error){
        console.log(error);
    }); 


    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    
   
};

function crearAlquilableCtrl ($scope,$log,$uibModalInstance,alquilables,alquilableEdit){
    $scope.alquilables=alquilables;
    $scope.alquilableEdit=alquilableEdit;
    
    $scope.ubicaciones=[
    {
        id:1,
        nombre:'Local Illia',
        direccion:'Illia 123'
    },
    {
        id:2,
        nombre:'Local 3',
        direccion:'Avenida 988'
    },
    {
        id:3,
        nombre:'Local 2',
        direccion:'Calle 53'
    },
    {
        id:4,
        nombre:'Ajuste',
        direccion:''
    }
    ]

    $scope.guardar = function (alquilableEdit){

        var found = jQuery.inArray(alquilableEdit, $scope.$parent.alquilables);

        if (found == -1) { 
            alquilableEdit.id=$scope.alquilables.length+1;
            alquilableEdit.estado='Disponible';
            alquilableEdit.class='badge-primary';                            
            $scope.$parent.alquilables.push(alquilableEdit);

        } else {
            $scope.$parent.alquilables.splice(found, 1);                                   
            $scope.$parent.alquilables.push(alquilableEdit);
        }

        $uibModalInstance.dismiss('cancel');
    }

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    
}

function crearGastoCtrl ($scope,$log,$uibModalInstance,gastos,gastoEdit){
    $scope.gastos=gastos;
    $scope.gastoEdit=gastoEdit;


    $scope.guardar = function (gastoEdit){          

        var found = jQuery.inArray(gastoEdit, $scope.$parent.gastos);

            //Busco la Fecha con jQuery porque no puedo leer el ng-model
            var gastoFecha=angular.element(document.querySelector('#gastoFecha')).val();

            //La formateo para pasarla a Laravel
            gastoFecha=moment(gastoFecha).format("YYYY-MM-DD");

            gastoEdit.fecha = gastoFecha;

            $uibModalInstance.close(gastoEdit);
        }
        
        $scope.ok = function () {
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }

    function editarGastoCtrl ($scope,$log,$uibModalInstance,gastos,gastoEdit){
        $scope.gastos=gastos;
        $scope.gastoEdit=gastoEdit;


        $scope.guardar = function (gastoEdit){          

            var found = jQuery.inArray(gastoEdit, $scope.$parent.gastos);

            //Busco la Fecha con jQuery porque no puedo leer el ng-model
            var gastoFecha=angular.element(document.querySelector('#gastoFecha')).val();

            //La formateo para pasarla a Laravel
            gastoFecha=moment(gastoFecha).format("YYYY-MM-DD");

            gastoEdit.fecha = gastoFecha;

            $uibModalInstance.close(gastoEdit);
        }
        
        $scope.ok = function () {
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }
    function crearGastoCajaCtrl ($http,$scope,$log,$uibModalInstance,gastoNuevo,SweetAlert){
        $scope.gastoNuevo=gastoNuevo;

        $scope.guardar = function (gastoNuevo){


            SweetAlert.swal({
                title: "¿Estas Seguro?",
                text: "Se va a agregar un gasto de <span style='color:#F8BB86; font-weight:600'>$ " + gastoNuevo.monto +"</span> con la descripcion:<br><span style='color:#F8BB86; font-weight:600'> \"" + gastoNuevo.descripcion + " \"</span>",
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

                        console.log("Guardo Gasto");
                        console.log(gastoNuevo);

                        $http.post('http://45.55.160.227/api/pos/caja/gasto',{
                            descripcion:$scope.gastoNuevo.descripcion,
                            monto:$scope.gastoNuevo.monto
                        }).success(function(){    
                            SweetAlert.swal("¡Agregado!", "El gasto fue agregado", "success");
                        }).error(function(error){
                            console.log(error);
                        });

                        $uibModalInstance.close();

                    } else {
                        SweetAlert.swal("Cancelado", "Todo sigue como antes", "error");
                    }
                });
        };


        
        $scope.ok = function () {
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }

    function terminarSesionCajaCtrl ($http,$scope,$log,$uibModalInstance,SweetAlert,$state){
/*
        $scope.sesion={
            usuario:"Gaston",
            montoIni:"2500",
            ventasTotales:"6000",
            enCaja:"6500"
        }
*/
        $scope.sesion={}

        $http.get('http://45.55.160.227/api/pos/caja/datossesion').success(function(response){    

            $scope.sesion.usuario=response.usuario;
            $scope.sesion.montoIni=response.inicial;
            $scope.sesion.ventasTotales=response.total;
            $scope.sesion.enCaja=response.caja;

        }).error(function(error){
            console.log(error);
        })

        $scope.cerrarSesion = function (){ 

            SweetAlert.swal({
                title: "¿Estas Seguro?",
                text: "Vas a cerrar la sesion",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "¡Si, cerrala!",
                cancelButtonText: "¡No, cancelar!",
                closeOnConfirm: false
            },
            function (isConfirm) {
                if (isConfirm) {
                    console.log("***Cierro Sesion***"); 
                    $uibModalInstance.close();
                    SweetAlert.swal({
                        title: "¡Hasta Luego!", 
                        text: "Cerre tu sesión", 
                        type: "success",
                        timer: 3500,
                        showConfirmButton: false
                    });
                    
                    $http.get('http://45.55.160.227/api/v1/authenticate/logout').success(function(response){   

                        $state.go("auth");

                    }).error(function(error){
                        console.log(error);
                    })
                    
                } else {}
            });
        };

    }

    function terminarSesionBarraCtrl ($http,$scope,$log,$uibModalInstance,SweetAlert,$state){
/*
        $scope.sesion={
            usuario:"Gaston",
            litrosVendidos:"200",
        }
*/
        $scope.sesion={}

        $http.get('http://45.55.160.227/api/pos/barra/datossesion').success(function(response){    

            $scope.sesion.usuario=response.usuario;
            $scope.sesion.litrosVendidos=response.litros;

        }).error(function(error){
            console.log(error);
        })

        $scope.cerrarSesion = function (){ 

            SweetAlert.swal({
                title: "¿Estas Seguro?",
                text: "Vas a cerrar la sesion",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "¡Si, cerrala!",
                cancelButtonText: "¡No, cancelar!",
                closeOnConfirm: false
            },
            function (isConfirm) {
                if (isConfirm) {
                    console.log("***Cierro Sesion***"); 
                    $uibModalInstance.close();
                    SweetAlert.swal({
                        title: "¡Hasta Luego!", 
                        text: "Cerre tu sesión", 
                        type: "success",
                        timer: 3500,
                        showConfirmButton: false
                    });
                    $http.get('http://45.55.160.227/api/v1/authenticate/logout').success(function(response){   

                        $state.go("auth");

                    }).error(function(error){
                        console.log(error);
                    })
                    
                } else {}
            });
        };

    }

    function detalleProductoCtrl ($http,$scope,$log,$uibModalInstance,producto,$uibModal,SweetAlert){

        $scope.producto=producto;

        $scope.editar = function(producto){
            $uibModalInstance.dismiss('cancel');
            console.log(producto);
            var modalInstance = $uibModal.open({
                templateUrl: 'views/crear_producto.html',
                controller: crearProductoCtrl, 
                        //controler en controllers.js:1633, no termino de entender porque no lo puedo armar como el resto y si o si tengo que poner una funcion                        
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

                    $http.delete('http://45.55.160.227/api/admin/producto/'+ident)
                    .success(function(){    
                        SweetAlert.swal("¡Eliminado!", "El producto fue eliminado", "success");
                        for(var i = 0; i < $scope.productos.length; i++){
                            if ($scope.productos[i].id == ident){                    
                                $scope.productos.splice(i, 1);
                                break;
                            }
                        }

                    }).error(function(error){
                        SweetAlert.swal("¡Error!", "El producto no pudo ser eliminado", "error");
                        console.log(error);
                    });
                    $uibModalInstance.close();

                } else {
                    SweetAlert.swal("Cancelado", "Todo sigue como antes", "error");
                }
            }
            

            );

    }
    
}

function wizardProductoInvantarioCtrl ($http,$scope,$log,$uibModalInstance,SweetAlert,WizardHandler,trabajo,producto){

    $scope.productos = $scope.$parent.productosInventario;
    $scope.ubicaciones = $scope.$parent.ubicaciones;
    $scope.datos={};
    $scope.datos.cantSel=0;
    $scope.datos.query="";
    

    $scope.onCantidadTextoChange = function(){
        if ($scope.datos.cantSel>$scope.datos.sliderEnd){
            $scope.datos.cantSel=parseInt($scope.datos.cantSel/10);
            console.log($scope.datos.cantSel);

        }
    }
    
    $scope.seleccionarProducto= function (ident){
        for(var i = 0; i < $scope.$parent.productosInventario.length; i++){
            if ($scope.$parent.productosInventario[i].id == ident){                  
                $scope.productoEdit=$scope.$parent.productosInventario[i];
                $scope.productoNombre=$scope.productoEdit.marca + ' - ' + $scope.productoEdit.nombre;
                break;
            }
        }
    }
    
    $scope.seleccionarOrigen= function (ident){
        for(var i = 0; i < $scope.ubicaciones.length; i++){
            if ($scope.$parent.ubicaciones[i].nombre == ident){                  
                $scope.ubicacionOrigen=$scope.ubicaciones[i];
                $scope.origenNombre=$scope.ubicacionOrigen.nombre + ' - ' + $scope.ubicacionOrigen.direccion;                        
                
                break;
            }
        }
    }
    
    $scope.seleccionarDestino= function (ident){
        for(var i = 0; i < $scope.ubicaciones.length; i++){
            if ($scope.ubicaciones[i].id == ident){
                $scope.ubicacionDestino=$scope.ubicaciones[i];
                $scope.datos.query=$scope.ubicacionDestino.nombre;
                $scope.destinoNombre=$scope.ubicacionDestino.nombre + ' - ' + $scope.ubicacionDestino.direccion;
                break;
            }
        }
    }    
    $scope.seleccionarCantidad= function (cantidad){
        console.log(cantidad);
        $scope.cantidadNombre=cantidad + ' ' + $scope.productoEdit.unidad;
        console.log($scope.cantidadNombre);
        console.log(trabajo);

            if(trabajo=="ajustar"){
                SweetAlert.swal({
                    title: "¿Estas Seguro?",
                    text: "Se va a aplicar un Ajuste de <span style='color:#F8BB86; font-weight:600'>" + $scope.cantidadNombre +"</span>",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Si, Ajustar!",
                    cancelButtonText: "No, cancelar!",
                    html: true,
                    closeOnConfirm: false,
                    closeOnCancel: false },
                    function (isConfirm) { 
                        if (isConfirm) {

                            /*
                            ACA VA EL PUT DE AJUSTAR
                            */
                            $http.put('http://45.55.160.227/api/admin/inventarioajustar/'+$scope.productoEdit.id,{
                                cantidad:cantidad
                            }).success(function(response){    
                                //$scope.productoEdit.stock-=cantidad;
                                //$scope.productoEdit = response.data;
                                $scope.productos.forEach(function(producto,index,arreglo){
                                    if(producto.id == response.data.id){
                                        arreglo[index] = response.data;
                                    }
                                });
                                SweetAlert.swal("¡Hecho!", "El ajuste fue aplicado", "success");    
                            }).error(function(error){
                                SweetAlert.swal("Error", error, "error");
                            });


                            //$scope.productoEdit.stock-=cantidad;
                            //SweetAlert.swal("¡Hecho!", "El ajuste fue aplicado", "success"); 
                            $uibModalInstance.close();
                        } else {
                            SweetAlert.swal("Cancelado", "Todo sigue como antes", "error");
                        }
                });
            } else if(trabajo=="agregar"){
                SweetAlert.swal({
                    title: "¿Estas Seguro?",
                    text: "Se van a agregar <span style='color:#F8BB86; font-weight:600'>" + $scope.cantidadNombre +"</span>",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Si, agregar!",
                    cancelButtonText: "No, cancelar!",
                    html: true,
                    closeOnConfirm: false,
                    closeOnCancel: false },
                    function (isConfirm) { 
                        if (isConfirm) {

                            /*
                            ACA VA EL PUT de AGREGAR
                            */
                            $http.put('http://45.55.160.227/api/admin/inventarioagregar/'+$scope.productoEdit.id,{
                                cantidad:cantidad
                            }).success(function(response){    
                                //$scope.productoEdit.stock+=cantidad;
                                //$scope.productoEdit = response.data;
                                $scope.productos.forEach(function(producto,index,arreglo){
                                    if(producto.id == response.data.id){
                                        arreglo[index] = response.data;
                                    }
                                });
                                SweetAlert.swal("¡Hecho!", "El cambio fue aplicado", "success"); 
                                $uibModalInstance.close();
                                
                            }).error(function(error){
                                console.log(error);
                                SweetAlert.swal("Error", error, "error");
                            });

                            //$scope.productoEdit.stock+=cantidad;
                            //SweetAlert.swal("¡Hecho!", "El ajuste fue aplicado", "success"); 
                            $uibModalInstance.close();
                        } else {
                            SweetAlert.swal("Cancelado", "Todo sigue como antes", "error");
                        }
                });
            }
        
    }//end seleccionarCantidad
    
    switch (trabajo){
        case 'agregar': 
        console.log("agregar");

        $scope.seleccionarProducto(producto.id);
        $scope.productoDisabled=true;
        $scope.datos.sliderStart=0;
        $scope.datos.sliderEnd=1000;
        // no me importa el desde
        $scope.origenDisabled=true;
        $scope.destinoDisabled=true;
        $scope.indicatorsDisabled=true;

        break;
        case 'mover':
        console.log("mover");

        $scope.seleccionarProducto(producto.id);
        $scope.productoDisabled=true;
        $scope.datos.sliderStart=0;
        $scope.datos.sliderEnd=$scope.productoEdit.stock;
        $scope.seleccionarOrigen(producto.ubicacion);
        $scope.origenDisabled=true;

        break; 
        case 'ajustar': 
        console.log("ajustar");

        $scope.seleccionarProducto(producto.id);
        $scope.productoDisabled=true;
        $scope.origenDisabled=true;
        $scope.destinoDisabled=true;
        $scope.indicatorsDisabled=true;
        break;
    }; 

    
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    
    $scope.ok = function () {
        if(trabajo=="mover"){
                SweetAlert.swal({
                    title: "¿Estas Seguro?",
                    text: "Se van a mover <span style='color:#F8BB86; font-weight:600'>" + $scope.cantidadNombre +"</br>de "+$scope.productoEdit.ubicacion+"</br> a " + $scope.destinoNombre+"</span>",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Si, mover!",
                    cancelButtonText: "No, cancelar!",
                    html: true,
                    closeOnConfirm: false,
                    closeOnCancel: false },
                    function (isConfirm) { 
                        if (isConfirm) {

                            /*
                            ACA VA EL PUT DE MOVER
                            */
                            console.log($scope);
                            
                            
                            $http.put('http://45.55.160.227/api/admin/inventariomover/'+$scope.productoEdit.id,{
                                cantidad:$scope.datos.cantSel,
                                ubicacionDestino:$scope.ubicacionDestino.id
                            }).success(function(response){    
                                //$scope.productoEdit.stock-=$scope.datos.cantSel;
                                //$scope.productoEdit = response.inventarioOrigen;

                                $scope.productos.forEach(function(producto,index,arreglo){
                                    if(producto.id == response.inventarioDestino.id){
                                        arreglo[index] = response.inventarioDestino;
                                    }
                                    if(producto.id == response.inventarioOrigen.id){
                                        arreglo[index] = response.inventarioOrigen;
                                    }
                                });
                                SweetAlert.swal("¡Hecho!", "Se realizo el movimiento", "success"); 
                                $uibModalInstance.close();
                                
                            }).error(function(error){
                                console.log(error);
                                SweetAlert.swal("Error", error, "error");
                            });


                            

                            //console.log('###############');
                            //console.log($scope.productos);
                            //$scope.productoEdit.stock-=$scope.datos.cantSel;
                            //necesito el id de ese producto en la otra ubicacion para sumarlo


                            //SweetAlert.swal("¡Hecho!", "Se realizo el movimiento", "success"); 
                            $uibModalInstance.close();
                        } else {
                            SweetAlert.swal("Cancelado", "Todo sigue como antes", "error");
                        }
                });
            }
    };

}


function terminarVentaCtrl ($http,$scope,$log,$uibModalInstance,$uibModal,WizardHandler,clienteSeleccionado,resumen){

    $scope.resumen=resumen;
    $scope.clienteSeleccionado=clienteSeleccionado;
    
    console.log($scope);

    $scope.borrarPaga= function(){

        $scope.resumen.paga=String($scope.resumen.paga);
        
        if ($scope.resumen.paga != null && $scope.resumen.paga.length > 0) {
            $scope.resumen.paga = $scope.resumen.paga.substring(0, $scope.resumen.paga.length-1);
            $scope.resumen.paga = Number($scope.resumen.paga);
        }
        
    }
    
    $scope.borrarTodo= function(){
        $scope.resumen.display='';
        $scope.resumen.numeroProductos=-1;
        $scope.resumen.productos=[];
        $scope.resumen.total=0.00;
        $scope.resumen.totalLitros=0;
        $scope.resumen.selected=-1;
        $scope.clienteSeleccionado='';
        $scope.cuponSeleccionado='';
        $scope.resumen.nombreClienteSeleccionado='';
        console.log($scope.resumen)
    }
    
    $scope.selectBtn = function(num){
        $scope.resumen.paga=String($scope.resumen.paga);
        $scope.resumen.paga += num;
        $scope.resumen.paga = Number($scope.resumen.paga);
    }
    
    $scope.cancel = function () {          
        $scope.borrarTodo()
        $uibModalInstance.dismiss('cancel');
    };
    
    $scope.ok = function () {        

        $uibModalInstance.dismiss('ventaOK');
        
        var totalLitrosCupones=0;
        
        var itemsVenta=[];

        //console.log(JSON.stringify($scope.resumen));
        for (var i=0;i<$scope.resumen.productos.length;i++){

            var item={};

            item.idProducto = $scope.resumen.productos[i].productoReal.id;
            item.cantidad = $scope.resumen.productos[i].cantidad;
            item.costo = $scope.resumen.productos[i].productoReal.valor;

            itemsVenta.push(item);

            
            if ($scope.resumen.productos[i].productoReal.categoria=="Cupones"){            
                totalLitrosCupones+=$scope.resumen.productos[i].cantidad;
            }
        }
        
        var cupon={};

        
        $http.post('http://45.55.160.227/api/pos/caja/venta', {

            idCliente:$scope.clienteSeleccionado.id,
            monto: $scope.resumen.total,
            itemsVenta: JSON.stringify(itemsVenta),
        }).success(function(response) {
            cupon.codigo=response.codigo;
            if(cupon.codigo!="OK"){ //no genero cupon porque no es necesario (ie. vendí antares)
                cupon.vigencia=response.vigencia;
                cupon.fecha=response.fecha;
                cupon.turnoNumero=response.turnoNumero;               
            }
                if (totalLitrosCupones>0){
                    cupon.litros=totalLitrosCupones;

                    var modalInstance = $uibModal.open({
                        templateUrl: 'views/imprimir_cupon.html',
                        controller: imprimirCuponCtrl, 
                        windowClass: "animated flipInY",
                        resolve: {
                            cupon: function () {
                                return cupon;
                            }
                        }
                        
                    });
                } 
            $scope.borrarTodo();
            console.log($scope);

        }).error(function(){
          console.log("error asd");
      });
        

            };   
        }

function crearProductoCtrl ($http,$scope,$log,$uibModalInstance,SweetAlert,productos,productoEdit){

    $scope.tSpin = {
        min: 1,
        max: 40,
        step: 1,
        decimals: 0,
        boostat: 5,
        maxboostedstep: 10,
        verticalbuttons: true
    };

    //$scope.newProd = {};
    $scope.productos=productos;
    $scope.productoEdit=productoEdit;
    $scope.newProd = angular.copy(productoEdit);
    $scope.flagEditar=false;


    /* Nueva Marca init */
    $scope.tresdeStartVisibleClass = 'tresde-up-first-visible ';
    $scope.tresdeStartHiddenClass = 'tresde-up-second-hidden ';
    $scope.flagNuevaMarca=false;
    
    $http.get('http://45.55.160.227/api/admin/productodatos').success(function(datos){    
        //console.log(cliente);
        $scope.categorias = datos.categorias;
        $scope.unidades = datos.unidades;
        $scope.marcas = datos.marcas;
        $scope.proveedores = datos.proveedores;

        //console.log($scope.newProd);
        if ($scope.newProd.nombre != undefined){

            $scope.flagEditar=true;

            $scope.categorias.forEach(function(categoria){
                if(categoria.nombre == $scope.newProd.categoria){
                    $scope.newProd.categoria = categoria;
                }
            });
            $scope.unidades.forEach(function(unidad){
                if(unidad.plural == $scope.newProd.unidad.plural){
                    $scope.newProd.unidad = unidad;
                }
            });
            $scope.marcas.forEach(function(marca){
                if(marca.nombre == $scope.newProd.marca){
                    $scope.newProd.marca = marca;
                }
            });
            $scope.proveedores.forEach(function(proveedor){
                if(proveedor.nombre == $scope.newProd.proveedor){
                    $scope.newProd.proveedor = proveedor;
                }
            });
        }

    }).error(function(error){
        console.log(error);
    });  



    
    $scope.cargarNuevo = function(){
       

        $uibModalInstance.dismiss('cancel');
        if($scope.flagNuevaMarca){
            $scope.newProd.marca = $scope.newProd.marcaNueva;
        } else {
            $scope.newProd.marca = $scope.newProd.marca.id;
        }
        console.log($scope.flagEditar);
        if ($scope.flagEditar){

            $http.put('http://45.55.160.227/api/admin/producto/'+$scope.newProd.id,{
                nombre:$scope.newProd.nombre,
                categoria:$scope.newProd.categoria.id,
                valor:$scope.newProd.valor,
                costo:$scope.newProd.costo,
                descripcion:$scope.newProd.descripcion,
                proveedor:$scope.newProd.proveedor.id,
                marca:$scope.newProd.marca,
                unidad:$scope.newProd.unidad.id,
                color:$scope.newProd.srm,
                ibu:$scope.newProd.ibu,
                origen:$scope.newProd.origen,
                alcohol:$scope.newProd.alcohol,
                flagMarca:$scope.flagNuevaMarca
            }).success(function(response){    
                $scope.productos.forEach(function(producto,index,arreglo){
                    if(producto.id == response.data.id){
                        arreglo[index] = response.data;
                    }
                });
                SweetAlert.swal("Producto Editado", "El producto fue editado", "success");
            }).error(function(error){
             SweetAlert.swal("Error", error.message, "error");
             console.log(error);
         });

        } else{

            $http.post('http://45.55.160.227/api/admin/producto', {

                nombre:$scope.newProd.nombre,
                categoria:$scope.newProd.categoria.id,
                valor:$scope.newProd.valor,
                costo:$scope.newProd.costo,
                descripcion:$scope.newProd.descripcion,
                proveedor:$scope.newProd.proveedor.id,
                marca:$scope.newProd.marca,
                unidad:$scope.newProd.unidad.id,
                color:$scope.newProd.srm,
                ibu:$scope.newProd.ibu,
                origen:$scope.newProd.origen,
                alcohol:$scope.newProd.alcohol,
                flagMarca:$scope.flagNuevaMarca
            }).success(function(response) {
                $scope.productos.push(response.data);

                SweetAlert.swal("Producto Agregado", "El producto fue agregado", "success");
            }).error(function(error){
             SweetAlert.swal("Error", error.message, "error");
             console.log(error);
         });
        }


    };

    /* 3D select marca */
    
    $scope.doOcultar=function(){
        $scope.tresdeStartVisibleClass = 'tresde-up-first-visible ';
        $scope.tresdeStartHiddenClass = 'tresde-up-second-hidden ';
        $scope.flagNuevaMarca=false;
    };
    
    $scope.doMostrar=function(){
        $scope.tresdeStartVisibleClass = 'tresde-up-first-hidden ';
        $scope.tresdeStartHiddenClass = 'tresde-up-second-visible ';
        $scope.flagNuevaMarca=true;
    };
    
    
}

function detalleAlquilerClienteCtrl ($scope,$log,$uibModalInstance,alquiler){

    $scope.alquiler=alquiler;
    $scope.clientes=[
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

            switch ($scope.alquiler.estado){
                case 'Con Retraso':
                $scope.borde= "border: 2px solid #ed5565";
                break;
                case 'Devuelve Hoy':
                $scope.borde= "border: 2px solid #f8ac59";
                break; 
                case 'Vigente':
                $scope.borde= "border: 2px solid #1ab394";
                break; 
                case 'Finalizado':
                $scope.borde= "border: 2px solid #1c84c6";
                break;
            };    


            var fA = moment($scope.alquiler.fecha);
            var fD = moment($scope.alquiler.fechaDevolucion);
            alquiler.diffDias = fD.diff(fA, 'days'); 

            for(var i = 0; i < $scope.clientes.length; i++){
                if ($scope.clientes[i].id == alquiler.idCliente){                    
                    $scope.cliente=$scope.clientes[i];
                    break;
                }
            }

            $scope.ok = function () {
                $uibModalInstance.close();
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };    

        };

        function detalleCompraCtrl ($scope,$log,$uibModalInstance,compra){

            $scope.compra=compra;
            $scope.compra.items = [
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

            $scope.ok = function () {
                $uibModalInstance.close();
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.getTotal = function(){
                var total = 0;
                for(var i = 0; i < $scope.compra.items.length; i++){
                    var item = $scope.compra.items[i];
                    total += (item.costo * item.cantidad);
                }
                return total;
            }
        };

function crearEditarCompraCtrl ($http,$scope,$log,$uibModalInstance,SweetAlert,items,aCompra,aProveedor,soloMostrar,productos,proveedores,estados,flagNuevaCompra){

            $scope.flagNuevaCompra = flagNuevaCompra;
            $scope.soloMostrar=soloMostrar;
            $scope.productos=productos;
            $scope.proveedores=proveedores;
            $scope.estadosCompras=estados;

            $scope.agregarItem = function(){
                var newItem ={
                    id:Number($scope.items.length)+1,
                    cantidad:1,
                    productoId:'',
                    costo:'',
                    marca:'',
                    nombre:'',
                    descripcion:'',
                    tipo:''
                }
                $scope.items.push(newItem);
                $scope.productoReady=false;

            }

            $scope.quitarItem = function(id){

                for(var i = 0; i < $scope.items.length; i++){                        
                    if ($scope.items[i].id == id){                    
                        $scope.items.splice(i, 1); 
                    } 
                }

                for(var i = 0; i < $scope.items.length; i++){                        
                    $scope.items[i].id = i +1;
                }

                if($scope.items.length==1 &&$scope.items[0].productoId==""){
                    $scope.productoReady = false; 
                }


            }

            $scope.proveedorSelected= function(prId){
                if($scope.proveedor){
                    if(prId != $scope.proveedor.id){                    
                        $scope.items=[
                            {
                                id:1,
                                cantidad:1,
                                productoId:'',
                                costo:'',
                                marca:'',
                                nombre:'',
                                descripcion:'',
                                tipo:''
                            }
                        ];
                        $scope.productoReady=false;

                    }
                }else{
                    $scope.proveedor = {};
                }
                for(var index = 0; index < $scope.proveedores.length; index++){
                    if ($scope.proveedores[index].id == prId){                    
                        $scope.proveedor.nombre= $scope.proveedores[index].nombre;
                        $scope.proveedor.id = prId;
                        $scope.proveedor.direccion=$scope.proveedores[index].direccion;
                        $scope.proveedor.telefono=$scope.proveedores[index].telefono;
                        $scope.proveedor.cuit=$scope.proveedores[index].cuit;
                        $scope.proveedor.contacto=$scope.proveedores[index].contacto;
                        $scope.proveedor.telefonoContacto=$scope.proveedores[index].telefonoContacto;
                        $scope.proveedorReady=true;
                        console.log('$scope.proveedorReady');
                    }
                        console.log('for'+prId + " =  "+$scope.proveedores[index].id);

                }
                $scope.productosFiltrados = [];
                $scope.productos.forEach(function(producto,index,arreglo){
                    if(producto.idProveedor == $scope.proveedor.id){
                        $scope.productosFiltrados.push(producto);
                    }
                });
                console.log('$scope.productosFiltrados');
                console.log($scope.productosFiltrados);    
            }

            $scope.productoSelected= function (pId,iId){
                for(var index = 0; index < $scope.productos.length; index++){
                    if ($scope.productos[index].id == pId){
                        for(var i = 0; i < $scope.items.length; i++){
                            if ($scope.items[i].id == iId){
                                $scope.items[i].costo= $scope.productos[index].costo;
                                $scope.items[i].marca= $scope.productos[index].marca;
                                $scope.items[i].producto.nombre= $scope.productos[index].nombre;
                                $scope.items[i].producto.descripcion= $scope.productos[index].descripcion;
                                $scope.items[i].producto.tipo= $scope.productos[index].categoria;
                                $scope.items[i].producto.unidad= $scope.productos[index].unidad;
                                
                                $scope.productoReady=true;
                            }
                            console.log('$scope.productoReady');
                            console.log($scope.productoReady);
                            console.log('$scope.items[i].producto');
                            console.log($scope.items[i].producto);
                            $scope.productoReady = $scope.productoReady && $scope.items[i].producto;
                        }
                    }
                }
            }

            $scope.spinSetupCosto = {
                min: 1,
                max:999999999,
                step: 0.5,
                decimals: 2,
                boostat: 5,
                maxboostedstep: 10,
                prefix: '$',
                verticalbuttons: true,
                verticalupclass: 'fa fa-plus',
                verticaldownclass: 'fa fa-minus'
            };

            $scope.spinSetupCantidad = {
                min: 1,
                max:999999999,
                step: 1,
                decimals: 0,
                boostat: 5,
                maxboostedstep: 10,
                verticalbuttons: true,
                verticalupclass: 'fa fa-plus',
                verticaldownclass: 'fa fa-minus'
            };       
$scope.eliminar = function(id){

          SweetAlert.swal({
            title: "¿Estas Seguro?",
            text: "¡No vas a poder recuperar los datos!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Si, eliminala!",
            cancelButtonText: "No, cancelar!",
            closeOnConfirm: false,
            closeOnCancel: false },
            function (isConfirm) {
                if (isConfirm) {

                    $http.delete('http://45.55.160.227/api/admin/compra/'+ id)
                    .success(function(){    
                        SweetAlert.swal("¡Eliminado!", "La compra fue eliminada", "success");
                        $scope.compras.forEach(function(compra,index,arreglo){
                            if(compra.id == id){
                                arreglo.splice(index,1);
                            }
                        });

                    }).error(function(error){
                        SweetAlert.swal("¡Error!", "La compra no pudo ser eliminada", "error");
                        console.log(error);
                    });
                    $uibModalInstance.close();

                } else {
                    SweetAlert.swal("Cancelado", "Todo sigue como antes", "error");
                }
            }
            

            );
}

$scope.guardar = function(flagNuevaCompra){
console.log(flagNuevaCompra)
console.log($scope)
//morecapo
//$scope.compra
//$scope.items
    
    var itemsPost = [];
    var total = $scope.getTotal();
    $scope.items.forEach(function(item,index,arreglo){
        var itemPost={};

        itemPost.idProducto = item.producto.id;
        itemPost.cantidad = item.cantidad;
        itemPost.costo = item.costo;

        itemsPost.push(itemPost);

    });

    //Es una nueva compra
    if(flagNuevaCompra){




        $http.post('http://45.55.160.227/api/admin/compra', {

            idProveedor:$scope.proveedor.id,
            fecha:moment($scope.compra.fecha).format('YYYY-MM-DD'),
            monto:total,
            estado:$scope.compra.estado.id,
            itemsCompra: JSON.stringify(itemsPost)
        }).success(function(response) {
            
            switch (response.data.estado.nombre){
                case 'Finalizado':
                response.data.class= "badge-primary";
                break;
                case 'Pagado':
                response.data.class= "badge-success";
                break; 
                case 'Pedido':
                response.data.class= "badge-info";
                break;
            }
            $scope.compras.push(response.data);
        }).error(function(error){
          console.log(error);
      });

    }else{

        $http.put('http://45.55.160.227/api/admin/compra/'+$scope.compra.id, {

            idProveedor:$scope.proveedor.id,
            fecha:moment($scope.compra.fecha).format('YYYY-MM-DD'),
            monto:total,
            estado:$scope.compra.estado.id,
            itemsCompra: JSON.stringify(itemsPost)
        }).success(function(response) {
            $scope.compras.forEach(function(compra,index,arreglo){
                if(compra.id == $scope.compra.id){
                    arreglo.splice(index,1);
                }
            });
            switch (response.data.estado.nombre){
                case 'Finalizado':
                response.data.class= "badge-primary";
                break;
                case 'Pagado':
                response.data.class= "badge-success";
                break; 
                case 'Pedido':
                response.data.class= "badge-info";
                break;
            }
            $scope.compras.push(response.data);
        }).error(function(error){
          console.log(error);
      });
    }
    /*
        //verifico si ya existe (edicion vs creacion)
        var nuevaCompra=true;
        console.log($scope);
        for(var index = 0; index < $scope.compras.length; index++){
         if ($scope.compras[index].id == $scope.compra.id){
             $scope.compra.fecha=moment($scope.compra.fecha).locale('es').format('DD/MMM/YY');
             $scope.compra.monto=$scope.getTotal();
             $scope.compras.splice(index,1,$scope.compra);
             nuevaCompra=false;
             break;
         }

     }

     if(nuevaCompra){
        $scope.compra.fecha=moment($scope.compra.fecha).locale('es').format('DD/MMM/YY');
        $scope.compra.estado='Pedido';
        $scope.compra.monto=$scope.getTotal();
        $scope.compra.class= "badge-info";

        $scope.compras.push($scope.compra);
    }
    */
    
    $uibModalInstance.close();
    
}    

$scope.ok = function () {
    $uibModalInstance.close();
};

$scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
};

$scope.getTotal = function(){
    var total = 0;
    for(var i = 0; i < $scope.items.length; i++){
        var item = $scope.items[i];
        total += (item.costo * item.cantidad);
    }
    return total;
}

$scope.cambiarEstado = function(estado){
    $scope.compra.estado=estado;
    $scope.compra.fecha=new Date();        
    $scope.asignarClasesEstado();    

}
$scope.asignarClasesEstado = function(){
 switch ($scope.compra.estado.nombre){
    case 'Finalizado':
    $scope.compra.class= "badge-primary";
    $scope.claseBotonEstado="btn-primary";
    break;
    case 'Pagado':
    $scope.compra.class= "badge-success";
    $scope.claseBotonEstado="btn-success";
    break; 
    case 'Pedido':
    $scope.compra.class= "badge-info";
    $scope.claseBotonEstado="btn-info";
    break;
}
}

$scope.toggleEditar = function() {
    $scope.soloMostrar = $scope.soloMostrar === false ? true: false; //le da cancer al More
    console.log($scope.soloMostrar);
    $scope.asignarClasesEstado(); 
    $scope.compra.fecha=moment($scope.compra.fecha).locale('es').format('DD/MMM/YY');
};


        console.log(items)
        if(!items){
            $scope.compra={}
            //$scope.compra.id=Number($scope.compras.length)+1;
            $scope.compra.fecha=moment();
            $scope.compra.estado = {id:1,nombre:'Pedido'};
            $scope.items=[
            {
                id:1,
                cantidad:1,
                productoId:'',
                costo:'',
                marca:'',
                nombre:'',
                descripcion:'',
                tipo:''
            }];
            $scope.proveedorSelected($scope.proveedores[0].id);
            $scope.prId = $scope.proveedores[0].id;
            $scope.asignarClasesEstado();
        }else{
            $scope.compra=aCompra; //con '=' son el mismo
            //Seteo el proveedor
            $scope.proveedor=aProveedor; //con '=' son el mismo
            //Como setie el proveedor filtro los productos a seleccionar
            $scope.productosFiltrados = [];
            //$scope.productos.forEach(function(producto,index,arreglo){
            //$scope.compra = angular.copy(aCompra);
            
            $scope.estadoAnterior=$scope.compra.estado.nombre;
            $scope.fechaAnterior=$scope.compra.fecha;
            
            $scope.proveedorSelected($scope.proveedor.id);
            console.log('compra ');
            console.log($scope.compra);
            $scope.prId=($scope.proveedor.id);

            $scope.items=items;   
            console.log($scope.items);     
            //$scope.pId=($scope.compra.productoId);
            $scope.productoReady=true;
                //$scope.soloMostrar=true;
            if($scope.compra.estado!='Finalizado'){
                $scope.permitirCambiarEstado=true;
                //$scope.compra.fecha=moment($scope.compra.fecha);
                //$scope.soloMostrar=false;

            }
            $scope.asignarClasesEstado(); 
        }
        console.log($scope)

};

       function imprimirCuponCtrl ($scope,$log,$uibModalInstance,cupon){

        $scope.cupon=cupon; 

        //var f = moment($scope.cupon.fecha);          
        //var vencimiento =f.clone().add($scope.cupon.vigencia,'d');
        $scope.vencimiento=moment($scope.cupon.fecha,'YYYY-MM-DD').add($scope.cupon.vigencia,'days').locale('es').format('DD/MM/YYYY');


        ///$scope.vencimiento=moment($scope.cupon.fecha).locale('es').format('DD/MMM/YYYY');
        //$scope.vencimiento=$scope.vencimiento.clone().add($scope.cupon.vigencia,'d');


        $scope.barcodeType = 'EAN';

        $scope.barcodeOptions = {
            width: 1,
            height: 50,
            //^ Valores POSTA! recordar en el plugin de JAVA -> SIN Rasterize y SIN Escala!!!!
            displayValue: false,
            font: 'monospace',
            textAlign: 'center',
            fontSize: 15,
            backgroundColor: '#fff',
            lineColor: '#000'
        };
        $scope.imagenSRC='';


        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.imprimirCupon = function () {
            $scope.imagenSRC = angular.element(document.querySelector('.codigodebarras')).attr('src');

            qz.websocket.connect().then(function() { 
                return qz.printers.find("58mm Series Printer")               // Pass the printer name into the next Promise
            }).then(function(printer) {
                var config = qz.configs.create(printer);       // Create a default config for the found printer

                config.reconfigure({ 
                scaleContent:false,
                rasterize:false
        });

          if($scope.cupon.litros>1){
            var litroPlural="LITROS";
        } else{
            var litroPlural="LITRO";
        }

        var printData = [
        {
            type: 'html',
            format: 'plain',
            data: 
            '<html>'
            +'    <div id="printBody">'
            +'        <row>'
            +'        <div>'
            +'            <img alt="image" src=" data:image/png;base64,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aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoTWFjaW50b3NoKTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8eG1wOkNyZWF0ZURhdGU+MjAxNi0xMS0xNVQyMToxMjoxOC0wMzowMDwveG1wOkNyZWF0ZURhdGU+CiAgICAgICAgIDx4bXA6TWV0YWRhdGFEYXRlPjIwMTYtMTEtMTVUMjE6MTI6MTgtMDM6MDA8L3htcDpNZXRhZGF0YURhdGU+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDE2LTExLTE1VDIxOjEyOjE4LTAzOjAwPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcE1NOkluc3RhbmNlSUQ+eG1wLmlpZDpmMjYwNzA2OS1iZDYyLTRiNTctYjc1Ny1hODVkOTFhNTA2YmQ8L3htcE1NOkluc3RhbmNlSUQ+CiAgICAgICAgIDx4bXBNTTpEb2N1bWVudElEPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDpiNDZiZjYxNy1lYzFmLTExNzktYmQzYy05ZmI3NTllYjk5YzA8L3htcE1NOkRvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+eG1wLmRpZDplZDk4ZDRmZi05YmQ5LTQ4ZmYtOTYzYi0xN2FjMjI2YWIxYzc8L3htcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOkhpc3Rvcnk+CiAgICAgICAgICAgIDxyZGY6U2VxPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5jcmVhdGVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6ZWQ5OGQ0ZmYtOWJkOS00OGZmLTk2M2ItMTdhYzIyNmFiMWM3PC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE2LTExLTE1VDIxOjEyOjE4LTAzOjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoTWFjaW50b3NoKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPnNhdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6ZjI2MDcwNjktYmQ2Mi00YjU3LWI3NTctYTg1ZDkxYTUwNmJkPC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE2LTExLTE1VDIxOjEyOjE4LTAzOjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoTWFjaW50b3NoKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmNoYW5nZWQ+Lzwvc3RFdnQ6Y2hhbmdlZD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgIDwvcmRmOlNlcT4KICAgICAgICAgPC94bXBNTTpIaXN0b3J5PgogICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3BuZzwvZGM6Zm9ybWF0PgogICAgICAgICA8cGhvdG9zaG9wOkNvbG9yTW9kZT4zPC9waG90b3Nob3A6Q29sb3JNb2RlPgogICAgICAgICA8cGhvdG9zaG9wOklDQ1Byb2ZpbGU+R2VuZXJpYyBSR0IgUHJvZmlsZTwvcGhvdG9zaG9wOklDQ1Byb2ZpbGU+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+NzIwMDAwLzEwMDAwPC90aWZmOllSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8ZXhpZjpDb2xvclNwYWNlPjY1NTM1PC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj4xMTU8L2V4aWY6UGl4ZWxYRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+Njk8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/Prc44VkAAAAgY0hSTQAAbZgAAHOOAADyewAAhNoAAG6UAADlGgAAMycAABkXmUkcfwAAD8FJREFUeNrsXHlcE9cWvlkIgQCBQFgEEcIiKAiiorKoUPeios/tV311aRXtQ22fC/UJ2lb7sFWxdYEnrVVrq7UIaCuiUkAQkN2wr4FA2PdACCHr+2NgGGaSiO811oDnr8yZM3dmPu6c+53lgpPJZOCt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">'
            +'        </div>'
            +'        </row>'
            +'        <br>'
            +'        <p style="font-family: Impact, Charcoal, sans-serif; margin:0 14px; padding:0; font-size: 55px;font-weight: 600;">'
            +           $scope.cupon.turnoNumero 
            +'        </p>'
            +'        <p style="font-family: Impact, Charcoal, sans-serif;margin:0 11px; padding:0; font-size: 27px;font-weight: 600;">'
            +           $scope.cupon.litros + ' '+litroPlural
            +'        </p>'
            +'        <br>'
            +'        <div>'
            +''   
            +         '<img src="'+$scope.imagenSRC+'">'
            +'        <p style="font-family: Arial, sans-serif;margin:0 13px; padding:0;font-size: 12px;font-weight: 600;">'
            +           $scope.cupon.codigo
            +'        </p>'
            +'        </div>'
            +'        <br>'
            +'        <p style="font-family: Tahoma, sans-serif;margin:0 11px; padding:0;font-size: 12px;font-weight: 600;">Valido Hasta:</p><br>'
            +'        <p style="font-family: Impact, Charcoal, sans-serif;margin:0 8px; padding:0;font-size: 20px;font-weight: 600;line-height: 0px;">'+$scope.vencimiento+'</p>'
            +'   </div>'
            +'    <hr>'
            +'</html>'
        }
        ];
        return qz.print(config, printData).then(function() {
          qz.websocket.disconnect().then(function() {
                updateState('Inactive', 'default');
                console.log('SUCCESS EN LA DESCONECCION DE LA IMPRESORA');
            }).catch(function(){
                console.log('ERROR EN LA DESCONECCION DE LA IMPRESORA');
            });
        });
    }).catch(function(e) { console.error(e); });

$uibModalInstance.close('ok');
console.log('SE CERRO imprimir cupon');
}

};

function imprimirTurnoCtrl ($scope,$http,$log,$uibModalInstance){


    $scope.fecha = moment().locale('es').format('DD/MMM/YYYY');
    $http.get('http://45.55.160.227/api/pos/caja/turno').success(function(turnoNumero){    

        $scope.turno=turnoNumero;


    }).error(function(error){
        console.log(error);
    })

    $scope.cancel = function () {

        $uibModalInstance.dismiss('cancel');
            //no registro avance en el nro de turno --ToDo?
            $http.get('http://45.55.160.227/api/pos/caja/descontarturno').success(function(){    
            }).error(function(error){
                console.log(error);
            })
        };

        $scope.imprimirTurno = function () {


            qz.websocket.connect().then(function() { 
          return qz.printers.find("58mm Series Printer")               // Pass the printer name into the next Promise
      }).then(function(printer) {
          var config = qz.configs.create(printer);       // Create a default config for the found printer
          
          config.reconfigure({ 
            scaleContent:false,
            rasterize:false
        });

          var printData = [
          {
            type: 'html',
            format: 'plain',
            data: 
            '<html>'
            +'    <div id="printBody">'
            +'        <row>'
            +'        <div>'
            +'            <img alt="image" src=" data:image/png;base64,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aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoTWFjaW50b3NoKTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8eG1wOkNyZWF0ZURhdGU+MjAxNi0xMS0xNVQyMToxMjoxOC0wMzowMDwveG1wOkNyZWF0ZURhdGU+CiAgICAgICAgIDx4bXA6TWV0YWRhdGFEYXRlPjIwMTYtMTEtMTVUMjE6MTI6MTgtMDM6MDA8L3htcDpNZXRhZGF0YURhdGU+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDE2LTExLTE1VDIxOjEyOjE4LTAzOjAwPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcE1NOkluc3RhbmNlSUQ+eG1wLmlpZDpmMjYwNzA2OS1iZDYyLTRiNTctYjc1Ny1hODVkOTFhNTA2YmQ8L3htcE1NOkluc3RhbmNlSUQ+CiAgICAgICAgIDx4bXBNTTpEb2N1bWVudElEPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDpiNDZiZjYxNy1lYzFmLTExNzktYmQzYy05ZmI3NTllYjk5YzA8L3htcE1NOkRvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+eG1wLmRpZDplZDk4ZDRmZi05YmQ5LTQ4ZmYtOTYzYi0xN2FjMjI2YWIxYzc8L3htcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOkhpc3Rvcnk+CiAgICAgICAgICAgIDxyZGY6U2VxPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5jcmVhdGVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6ZWQ5OGQ0ZmYtOWJkOS00OGZmLTk2M2ItMTdhYzIyNmFiMWM3PC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE2LTExLTE1VDIxOjEyOjE4LTAzOjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoTWFjaW50b3NoKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPnNhdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6ZjI2MDcwNjktYmQ2Mi00YjU3LWI3NTctYTg1ZDkxYTUwNmJkPC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE2LTExLTE1VDIxOjEyOjE4LTAzOjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoTWFjaW50b3NoKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmNoYW5nZWQ+Lzwvc3RFdnQ6Y2hhbmdlZD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgIDwvcmRmOlNlcT4KICAgICAgICAgPC94bXBNTTpIaXN0b3J5PgogICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3BuZzwvZGM6Zm9ybWF0PgogICAgICAgICA8cGhvdG9zaG9wOkNvbG9yTW9kZT4zPC9waG90b3Nob3A6Q29sb3JNb2RlPgogICAgICAgICA8cGhvdG9zaG9wOklDQ1Byb2ZpbGU+R2VuZXJpYyBSR0IgUHJvZmlsZTwvcGhvdG9zaG9wOklDQ1Byb2ZpbGU+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+NzIwMDAwLzEwMDAwPC90aWZmOllSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8ZXhpZjpDb2xvclNwYWNlPjY1NTM1PC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj4xMTU8L2V4aWY6UGl4ZWxYRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+Njk8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/Prc44VkAAAAgY0hSTQAAbZgAAHOOAADyewAAhNoAAG6UAADlGgAAMycAABkXmUkcfwAAD8FJREFUeNrsXHlcE9cWvlkIgQCBQFgEEcIiKAiiorKoUPeios/tV311aRXtQ22fC/UJ2lb7sFWxdYEnrVVrq7UIaCuiUkAQkN2wr4FA2PdACCHr+2NgGGaSiO811oDnr8yZM3dmPu6c+53lgpPJZOCt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">'
            +'        </div>'
            +'        </row>'
            +'        <br>'
            +'        <p style="font-family: Impact, Charcoal, sans-serif; margin:0 14px; padding:0; font-size: 55px;font-weight: 600;">'
            +           $scope.turno
            +'        </p>'
            +'   </div>'
            +'    <hr>'
            +'</html>'
        }
        ];
        return qz.print(config, printData).then(function() {
          qz.websocket.disconnect().then(function() {
                updateState('Inactive', 'default');
                console.log('SUCCESS EN LA DESCONECCION DE LA IMPRESORA');
            }).catch(function(){
                console.log('ERROR EN LA DESCONECCION DE LA IMPRESORA');
            });
        });
    }).catch(function(e) { console.error(e); });

$uibModalInstance.close();
}




};

function canillaCambiarProductoCtrl ($http,$scope,$log,$uibModalInstance,idCanilla){

    $scope.getCanillas = function (){
        $http.get('http://45.55.160.227/api/admin/canillainventario').success(function(canillaInventario){    
            console.log(canillaInventario);
            $scope.productosDisponibles = canillaInventario.data;
        }).error(function(error){
            console.log(error);
        });
    }
    
    $scope.getCanillas(); 

        //start Gilada
        //si esta la opcion de no permitir el mismo producto en distintas canillas, filtro los productos que no tengo ya asignados
        if (true === false){
            for(var idC = 0; idC < $scope.$parent.canillas.length; idC++){
                for(var idP = 0; idP < $scope.productosDisponibles.length; idP++){ 
                    //si el producto esta asignado a alguna canilla y no es esta canilla                
                    if ($scope.$parent.canillas[idC].idInventario == $scope.productosDisponibles[idP].id && $scope.$parent.canillas[idC].idInventario != $scope.canillaEdit.idInventario){                     
                        var index = $scope.productosDisponibles.indexOf($scope.productosDisponibles[idP]);                    
                        if (index > -1) {
                            $scope.productosDisponibles.splice(index, 1);
                        }                    
                    }
                };  
            };
        }
        //end Gilada


        $scope.guardar = function (idPS){
         $uibModalInstance.close(idPS);  

     }


     $scope.vaciar = function (){
        $scope.$parent.canillas[idCanilla].idInventario='';
        $scope.$parent.canillas[idCanilla].productoMarca='';
        $scope.$parent.canillas[idCanilla].productoNombre='';
        $scope.$parent.canillas[idCanilla].productoColor='';
        $scope.$parent.canillas[idCanilla].productoStock='';
        $scope.$parent.canillas[idCanilla].productoIbu='';
        $scope.$parent.canillas[idCanilla].productoAlcohol='';
        $uibModalInstance.close();
                //cambiar a put
            }



            $scope.ok = function () {
                $uibModalInstance.close();
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

        }

/**
 * ionSlider - Controller for data for Ion Slider plugin
 * used in Advanced plugin view
 */


/**
 * wizardCtrl - Controller for wizard functions
 * used in Wizard view
 */
 function wizardCtrl($scope, $rootScope) {
    // All data will be store in this object
    $scope.formData = {};

    // After process wizard
    $scope.processForm = function() {
        alert('Wizard completed');
    };

}




/**
 * liveFavicon - Controller for live favicon
 */
 function liveFavicon($scope){

    $scope.example1 = function(){
        Tinycon.setBubble(1);
        Tinycon.setOptions({
            background: '#f03d25'
        });
    }

    $scope.example2 = function(){
        Tinycon.setBubble(1000);
        Tinycon.setOptions({
            background: '#f03d25'
        });
    }

    $scope.example3 = function(){
        Tinycon.setBubble('In');
        Tinycon.setOptions({
            background: '#f03d25'
        });
    }

    $scope.example4 = function(){
        Tinycon.setOptions({
            background: '#e0913b'
        });
        Tinycon.setBubble(8);
    }

}

/**
 * formValidation - Controller for validation example
 */
 function formValidation($scope) {

    $scope.signupForm = function() {
        if ($scope.signup_form.$valid) {
            // Submit as normal
        } else {
            $scope.signup_form.submitted = true;
        }
    }

    $scope.signupForm2 = function() {
        if ($scope.signup_form.$valid) {
            // Submit as normal
        }
    }

};




/**
 * sweetAlertCtrl - Function for Sweet alerts
 */
 function sweetAlertCtrl($scope, SweetAlert) {


    $scope.demo1 = function () {
        SweetAlert.swal({
            title: "Welcome in Alerts",
            text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        });
    }

    $scope.demo2 = function () {
        SweetAlert.swal({
            title: "Good job!",
            text: "You clicked the button!",
            type: "success"
        });
    }

    $scope.demo3 = function () {
        SweetAlert.swal({
            title: "Are you sure?",
            text: "Your will not be able to recover this imaginary file!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function () {
            SweetAlert.swal("Ok!");
        });
    }

    $scope.demo4 = function () {
        SweetAlert.swal({
            title: "Are you sure?",
            text: "Your will not be able to recover this imaginary file!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel plx!",
            closeOnConfirm: false,
            closeOnCancel: false },
            function (isConfirm) {
                if (isConfirm) {
                    SweetAlert.swal("Deleted!", "Your imaginary file has been deleted.", "success");
                } else {
                    SweetAlert.swal("Cancelled", "Your imaginary file is safe :)", "error");
                }
            });
    }

}



function toastrCtrl($scope, toaster){

    $scope.demo1 = function(){
        toaster.success({ body:"Hi, welcome to Inspinia. This is example of Toastr notification box."});
    };

    $scope.demo2 = function(){
        toaster.warning({ title: "Title example", body:"This is example of Toastr notification box."});
    };

    $scope.demo3 = function(){
        toaster.pop({
            type: 'info',
            title: 'Title example',
            body: 'This is example of Toastr notification box.',
            showCloseButton: true

        });
    };

    $scope.demo4 = function(){
        toaster.pop({
            type: 'error',
            title: 'Title example',
            body: 'This is example of Toastr notification box.',
            showCloseButton: true,
            timeout: 600
        });
    };

}

function loadingCtrl($scope, $timeout){


    $scope.runLoading = function() {
        // start loading
        $scope.loading = true;

        $timeout(function(){
            // Simulate some service
            $scope.loading = false;
        },2000)
    };


    // Demo purpose actions
    $scope.runLoading1 = function () {
        // start loading
        $scope.loading1 = true;

        $timeout(function () {
            // Simulate some service
            $scope.loading1 = false;
        }, 2000)
    };
    $scope.runLoading2 = function () {
        // start loading
        $scope.loading2 = true;

        $timeout(function () {
            // Simulate some service
            $scope.loading2 = false;
        }, 2000)
    };
    $scope.runLoading3 = function () {
        // start loading
        $scope.loading3 = true;

        $timeout(function () {
            // Simulate some service
            $scope.loading3 = false;
        }, 2000)
    };
    $scope.runLoading4 = function () {
        // start loading
        $scope.loading4 = true;

        $timeout(function () {
            // Simulate some service
            $scope.loading4 = false;
        }, 2000)
    };
    $scope.runLoading5 = function () {
        // start loading
        $scope.loading5 = true;

        $timeout(function () {
            // Simulate some service
            $scope.loading5 = false;
        }, 2000)
    };
    $scope.runLoading6 = function () {
        // start loading
        $scope.loading6 = true;

        $timeout(function () {
            // Simulate some service
            $scope.loading6 = false;
        }, 2000)
    };
    $scope.runLoading7 = function () {
        // start loading
        $scope.loading7 = true;

        $timeout(function () {
            // Simulate some service
            $scope.loading7 = false;
        }, 2000)
    };
    $scope.runLoading8 = function () {
        // start loading
        $scope.loading8 = true;

        $timeout(function () {
            // Simulate some service
            $scope.loading8 = false;
        }, 2000)
    };
    $scope.runLoading9 = function () {
        // start loading
        $scope.loading9 = true;

        $timeout(function () {
            // Simulate some service
            $scope.loading9 = false;
        }, 2000)
    };
    $scope.runLoading10 = function () {
        // start loading
        $scope.loading10 = true;

        $timeout(function () {
            // Simulate some service
            $scope.loading10 = false;
        }, 2000)
    };
    $scope.runLoading11 = function () {
        // start loading
        $timeout(function() {
            $scope.loading11 = 0.1;
        }, 500);
        $timeout(function() {
            $scope.loading11 += 0.2;
        }, 1000);
        $timeout(function() {
            $scope.loading11 += 0.3;
        }, 1500);
        $timeout(function() {
            $scope.loading11 = false;
        }, 2000);

    };
    $scope.runLoading12 = function () {
        // start loading
        $timeout(function() {
            $scope.loading12 = 0.1;
        }, 500);
        $timeout(function() {
            $scope.loading12 += 0.2;
        }, 1000);
        $timeout(function() {
            $scope.loading12 += 0.3;
        }, 1500);
        $timeout(function() {
            $scope.loading12 = false;
        }, 2000);

    };

    $scope.runLoadingDemo = function() {
        // start loading
        $scope.loadingDemo = true;

        $timeout(function(){
            // Simulate some service
            $scope.loadingDemo = false;
        },2000)
    };


}


function datatablesCtrl($scope,DTOptionsBuilder){

    $scope.dtOptions = DTOptionsBuilder.newOptions()
    .withDOM('<"html5buttons"B>lTfgitp')
    .withButtons([
        {extend: 'copy'},
        {extend: 'csv'},
        {extend: 'excel', title: 'ExampleFile'},
        {extend: 'pdf', title: 'ExampleFile'},

        {extend: 'print',
        customize: function (win){
            $(win.document.body).addClass('white-bg');
            $(win.document.body).css('font-size', '10px');

            $(win.document.body).find('table')
            .addClass('compact')
            .css('font-size', 'inherit');
        }
    }
    ]);

    /**
     * persons - Data used in Tables view for Data Tables plugin
     */
     $scope.persons = [
     {
        id: '1',
        firstName: 'Monica',
        lastName: 'Smith'
    },
    {
        id: '2',
        firstName: 'Sandra',
        lastName: 'Jackson'
    },
    {
        id: '3',
        firstName: 'John',
        lastName: 'Underwood'
    },
    {
        id: '4',
        firstName: 'Chris',
        lastName: 'Johnatan'
    },
    {
        id: '5',
        firstName: 'Kim',
        lastName: 'Rosowski'
    }
    ];

}

function MainCtrl() {

    /**
     * daterange - Used as initial model for data range picker in Advanced form view
     */
    this.daterange = {startDate: null, endDate: null};

    /**
     * slideInterval - Interval for bootstrap Carousel, in milliseconds:
     */
    this.slideInterval = 5000;


    /**
     * states - Data used in Advanced Form view for Chosen plugin
     */
    this.states = [
        'Alabama',
        'Alaska',
        'Arizona',
        'Arkansas',
        'California',
        'Colorado',
        'Connecticut',
        'Delaware',
        'Florida',
        'Georgia',
        'Hawaii',
        'Idaho',
        'Illinois',
        'Indiana',
        'Iowa',
        'Kansas',
        'Kentucky',
        'Louisiana',
        'Maine',
        'Maryland',
        'Massachusetts',
        'Michigan',
        'Minnesota',
        'Mississippi',
        'Missouri',
        'Montana',
        'Nebraska',
        'Nevada',
        'New Hampshire',
        'New Jersey',
        'New Mexico',
        'New York',
        'North Carolina',
        'North Dakota',
        'Ohio',
        'Oklahoma',
        'Oregon',
        'Pennsylvania',
        'Rhode Island',
        'South Carolina',
        'South Dakota',
        'Tennessee',
        'Texas',
        'Utah',
        'Vermont',
        'Virginia',
        'Washington',
        'West Virginia',
        'Wisconsin',
        'Wyoming'
    ];

    /**
     * check's - Few variables for checkbox input used in iCheck plugin. Only for demo purpose
     */
    this.checkOne = true;
    this.checkTwo = true;
    this.checkThree = true;
    this.checkFour = true;

    /**
     * knobs - Few variables for knob plugin used in Advanced Plugins view
     */
    this.knobOne = 75;
    this.knobTwo = 25;
    this.knobThree = 50;

    /**
     * Variables used for Ui Elements view
     */
    this.bigTotalItems = 175;
    this.bigCurrentPage = 1;
    this.maxSize = 5;
    this.singleModel = false;
    this.radioModel = 'Middle';
    this.checkModel = {
        left: false,
        middle: true,
        right: false
    };

    /**
     * groups - used for Collapse panels in Tabs and Panels view
     */
    this.groups = [
        {
            title: 'Dynamic Group Header - 1',
            content: 'Dynamic Group Body - 1'
        },
        {
            title: 'Dynamic Group Header - 2',
            content: 'Dynamic Group Body - 2'
        }
    ];

    /**
     * alerts - used for dynamic alerts in Notifications and Tooltips view
     */
    this.alerts = [
        { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
        { type: 'success', msg: 'Well done! You successfully read this important alert message.' },
        { type: 'info', msg: 'OK, You are done a great job man.' }
    ];

    /**
     * addAlert, closeAlert  - used to manage alerts in Notifications and Tooltips view
     */
    this.addAlert = function() {
        this.alerts.push({msg: 'Another alert!'});
    };

    this.closeAlert = function(index) {
        this.alerts.splice(index, 1);
    };

    /**
     * randomStacked - used for progress bar (stacked type) in Badges adn Labels view
     */
    this.randomStacked = function() {
        this.stacked = [];
        var types = ['success', 'info', 'warning', 'danger'];

        for (var i = 0, n = Math.floor((Math.random() * 4) + 1); i < n; i++) {
            var index = Math.floor((Math.random() * 4));
            this.stacked.push({
                value: Math.floor((Math.random() * 30) + 1),
                type: types[index]
            });
        }
    };
    /**
     * initial run for random stacked value
     */
    this.randomStacked();

    /**
     * summernoteText - used for Summernote plugin
     */
    this.summernoteText = ['<h3>Hello Jonathan! </h3>',
        '<p>dummy text of the printing and typesetting industry. <strong>Lorem Ipsum has been the dustrys</strong> standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more',
        'recently with</p>'].join('');

    /**
     * General variables for Peity Charts
     * used in many view so this is in Main controller
     */
    this.BarChart = {
        data: [5, 3, 9, 6, 5, 9, 7, 3, 5, 2, 4, 7, 3, 2, 7, 9, 6, 4, 5, 7, 3, 2, 1, 0, 9, 5, 6, 8, 3, 2, 1],
        options: {
            fill: ["#1ab394", "#d7d7d7"],
            width: 100
        }
    };

    this.BarChart2 = {
        data: [5, 3, 9, 6, 5, 9, 7, 3, 5, 2],
        options: {
            fill: ["#1ab394", "#d7d7d7"]
        }
    };

    this.BarChart3 = {
        data: [5, 3, 2, -1, -3, -2, 2, 3, 5, 2],
        options: {
            fill: ["#1ab394", "#d7d7d7"]
        }
    };

    this.LineChart = {
        data: [5, 9, 7, 3, 5, 2, 5, 3, 9, 6, 5, 9, 4, 7, 3, 2, 9, 8, 7, 4, 5, 1, 2, 9, 5, 4, 7],
        options: {
            fill: '#1ab394',
            stroke: '#169c81',
            width: 64
        }
    };

    this.LineChart2 = {
        data: [3, 2, 9, 8, 47, 4, 5, 1, 2, 9, 5, 4, 7],
        options: {
            fill: '#1ab394',
            stroke: '#169c81',
            width: 64
        }
    };

    this.LineChart3 = {
        data: [5, 3, 2, -1, -3, -2, 2, 3, 5, 2],
        options: {
            fill: '#1ab394',
            stroke: '#169c81',
            width: 64
        }
    };

    this.LineChart4 = {
        data: [5, 3, 9, 6, 5, 9, 7, 3, 5, 2],
        options: {
            fill: '#1ab394',
            stroke: '#169c81',
            width: 64
        }
    };

    this.PieChart = {
        data: [1, 5],
        options: {
            fill: ["#1ab394", "#d7d7d7"]
        }
    };

    this.PieChart2 = {
        data: [226, 360],
        options: {
            fill: ["#1ab394", "#d7d7d7"]
        }
    };
    this.PieChart3 = {
        data: [0.52, 1.561],
        options: {
            fill: ["#1ab394", "#d7d7d7"]
        }
    };
    this.PieChart4 = {
        data: [1, 4],
        options: {
            fill: ["#1ab394", "#d7d7d7"]
        }
    };
    this.PieChart5 = {
        data: [226, 134],
        options: {
            fill: ["#1ab394", "#d7d7d7"]
        }
    };
    this.PieChart6 = {
        data: [0.52, 1.041],
        options: {
            fill: ["#1ab394", "#d7d7d7"]
        }
    };
};

/**
 * dashboardFlotFive - simple controller for data
 * for Flot chart in Dashboard view
 */
function dashboardFive() {

    var data1 = [
        [0,4],[1,8],[2,5],[3,10],[4,4],[5,16],[6,5],[7,11],[8,6],[9,11],[10,20],[11,10],[12,13]
    ];
    var data2 = [
        [0,0],[1,2],[2,7],[3,4],[4,11],[5,4],[6,2],[7,5],[8,11],[9,5],[10,4],[11,1],[12,5]
    ];

    var options = {
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
        colors: ["#1ab394", "#1C84C6"],
        xaxis:{
        },
        yaxis: {
        },
        tooltip: false
    };

    /**
     * Definition of variables
     * Flot chart
     */
    this.flotData = [data1, data2];
    this.flotOptions = options;


    var sparkline1Data = [34, 43, 43, 35, 44, 32, 44, 52];
    var sparkline1Options = {
        type: 'line',
        width: '100%',
        height: '50',
        lineColor: '#1ab394',
        fillColor: "transparent"
    };

    var sparkline2Data = [32, 11, 25, 37, 41, 32, 34, 42];
    var sparkline2Options = {
        type: 'line',
        width: '100%',
        height: '50',
        lineColor: '#1ab394',
        fillColor: "transparent"
    };

    this.sparkline1 = sparkline1Data;
    this.sparkline1Options = sparkline1Options;
    this.sparkline2 = sparkline2Data;
    this.sparkline2Options = sparkline2Options;

}


/**
 * chartJsCtrl - Controller for data for ChartJs plugin
 * used in Chart.js view
 */
function chartJsCtrl() {

    /**
     * Data for Polar chart
     */
    this.polarData = [
        {
            value: 300,
            color:"#a3e1d4",
            highlight: "#1ab394",
            label: "App"
        },
        {
            value: 140,
            color: "#dedede",
            highlight: "#1ab394",
            label: "Software"
        },
        {
            value: 200,
            color: "#A4CEE8",
            highlight: "#1ab394",
            label: "Laptop"
        }
    ];

    /**
     * Options for Polar chart
     */
    this.polarOptions = {
        scaleShowLabelBackdrop : true,
        scaleBackdropColor : "rgba(255,255,255,0.75)",
        scaleBeginAtZero : true,
        scaleBackdropPaddingY : 1,
        scaleBackdropPaddingX : 1,
        scaleShowLine : true,
        segmentShowStroke : true,
        segmentStrokeColor : "#fff",
        segmentStrokeWidth : 2,
        animationSteps : 100,
        animationEasing : "easeOutBounce",
        animateRotate : true,
        animateScale : false
    };

    /**
     * Data for Doughnut chart - Modificado para dashboard 5
     */
    this.doughnutData = [
        {
            value: 304,
            color:"#a3e1d4",
            highlight: "#1ab394",
            label: "Crafter - IPA"
        },
        {
            value: 50,
            color: "#ECDAAF",
            highlight: "#1ab394",
            label: "Crafter - Scotish"
        },
        {
            value: 100,
            color: "#3498DB",
            highlight: "#1ab394",
            label: "Nuevo Origen - Knock Out"
        },
        {
            value: 250,
            color: "#E74C3C",
            highlight: "#1ab394",
            label: "Kalevala - Irish Red"
        },
        {
            value: 90,
            color: "#F1C40F",
            highlight: "#1ab394",
            label: "Crafter - Porter"
        }
    ];

    /**
     * Options for Doughnut chart
     */
    this.doughnutOptions = {
        segmentShowStroke : true,
        segmentStrokeColor : "#fff",
        segmentStrokeWidth : 2,
        percentageInnerCutout : 45, // This is 0 for Pie charts
        animationSteps : 100,
        animationEasing : "easeOutBounce",
        animateRotate : true,
        animateScale : false
    };

    /**
     * Data for Line chart
     */
    this.lineData = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                label: "Example dataset",
                fillColor: "rgba(220,220,220,0.5)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: [65, 59, 80, 81, 56, 55, 40]
            },
            {
                label: "Example dataset",
                fillColor: "rgba(26,179,148,0.5)",
                strokeColor: "rgba(26,179,148,0.7)",
                pointColor: "rgba(26,179,148,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(26,179,148,1)",
                data: [28, 48, 40, 19, 86, 27, 90]
            }
        ]
    };

    this.lineDataDashboard4 = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                label: "Example dataset",
                fillColor: "rgba(220,220,220,0.5)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: [65, 59, 40, 51, 36, 25, 40]
            },
            {
                label: "Example dataset",
                fillColor: "rgba(26,179,148,0.5)",
                strokeColor: "rgba(26,179,148,0.7)",
                pointColor: "rgba(26,179,148,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(26,179,148,1)",
                data: [48, 48, 60, 39, 56, 37, 30]
            }
        ]
    };

    /**
     * Options for Line chart
     */
    this.lineOptions = {
        scaleShowGridLines : true,
        scaleGridLineColor : "rgba(0,0,0,.05)",
        scaleGridLineWidth : 1,
        bezierCurve : true,
        bezierCurveTension : 0.4,
        pointDot : true,
        pointDotRadius : 4,
        pointDotStrokeWidth : 1,
        pointHitDetectionRadius : 20,
        datasetStroke : true,
        datasetStrokeWidth : 2,
        datasetFill : true
    };

    /**
     * Options for Bar chart
     */
    this.barOptions = {
        scaleBeginAtZero : true,
        scaleShowGridLines : true,
        scaleGridLineColor : "rgba(0,0,0,.05)",
        scaleGridLineWidth : 1,
        barShowStroke : true,
        barStrokeWidth : 2,
        barValueSpacing : 5,
        barDatasetSpacing : 1
    };

    /**
     * Data for Bar chart
     */
    this.barData = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                label: "My First dataset",
                fillColor: "rgba(220,220,220,0.5)",
                strokeColor: "rgba(220,220,220,0.8)",
                highlightFill: "rgba(220,220,220,0.75)",
                highlightStroke: "rgba(220,220,220,1)",
                data: [65, 59, 80, 81, 56, 55, 40]
            },
            {
                label: "My Second dataset",
                fillColor: "rgba(26,179,148,0.5)",
                strokeColor: "rgba(26,179,148,0.8)",
                highlightFill: "rgba(26,179,148,0.75)",
                highlightStroke: "rgba(26,179,148,1)",
                data: [28, 48, 40, 19, 86, 27, 90]
            }
        ]
    };

    /**
     * Data for Radar chart
     */
    this.radarData = {
        labels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
        datasets: [
            {
                label: "My First dataset",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: [65, 59, 90, 81, 56, 55, 40]
            },
            {
                label: "My Second dataset",
                fillColor: "rgba(26,179,148,0.2)",
                strokeColor: "rgba(26,179,148,1)",
                pointColor: "rgba(26,179,148,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: [28, 48, 40, 19, 96, 27, 100]
            }
        ]
    };

    /**
     * Options for Radar chart
     */
    this.radarOptions = {
        scaleShowLine : true,
        angleShowLineOut : true,
        scaleShowLabels : false,
        scaleBeginAtZero : true,
        angleLineColor : "rgba(0,0,0,.1)",
        angleLineWidth : 1,
        pointLabelFontFamily : "'Arial'",
        pointLabelFontStyle : "normal",
        pointLabelFontSize : 10,
        pointLabelFontColor : "#666",
        pointDot : true,
        pointDotRadius : 3,
        pointDotStrokeWidth : 1,
        pointHitDetectionRadius : 20,
        datasetStroke : true,
        datasetStrokeWidth : 2,
        datasetFill : true
    };


};
/**
 *
 * Pass all functions into module
 */
 angular
 .module('inspinia')
     .controller('MainCtrl', MainCtrl)
 .controller('wizardCtrl', wizardCtrl)
     .controller('dashboardFive', dashboardFive)
     .controller('chartJsCtrl', chartJsCtrl)


 .controller('liveFavicon', liveFavicon)
 .controller('formValidation', formValidation)

 .controller('sweetAlertCtrl', sweetAlertCtrl)

 .controller('toastrCtrl', toastrCtrl)
 .controller('loadingCtrl', loadingCtrl)
 .controller('datatablesCtrl', datatablesCtrl)

