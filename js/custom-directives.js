angular
.module('inspinia')

.directive('currencyInput', function($filter, $browser) {
    return {
        require: 'ngModel',
        link: function($scope, $element, $attrs, ngModelCtrl) {
            $element.addClass('numberInput');
            var separators = {
                'thousands' : $filter('number')(1000).substr(1,1),
                'decimal' : $filter('number')(1.1).substr(1,1)
            }
            var decimalEntered = false;
            var listener = function() {
                var value = $element.val().split(separators.thousands).join('').split(separators.decimal).join('.');
                if(decimalEntered) {
                    decimalEntered=false;
                    return;
                }
                if(value.indexOf('.')>1 && value.slice(-1)=='0') {$element.val(value); return;}
                $element.val($filter('number')(value));
            }

            // This runs when we update the text field
            ngModelCtrl.$parsers.push(function(viewValue) {
                return viewValue.split(separators.thousands).join('').split(separators.decimal).join('.');
            })

            // This runs when the model gets updated on the scope directly and keeps our view in sync
            ngModelCtrl.$render = function() {
                $element.val($filter('number')(ngModelCtrl.$viewValue, false))
            }

            $element.bind('change', listener)
            $element.bind('keypress', function(event) {
                var key = event.which;
                // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
                // This lets us support copy and paste too
                if (key == 0 || key == 8 || (15 < key && key < 19) || (37 <= key && key <= 40)) { 
                    return 
                }
                // ignore all other keys which we do not need
                if (
                    String.fromCharCode(key) != separators.thousands
                    && String.fromCharCode(key) != separators.decimal
                    && !(48 <= key&&key <= 57)
                    && String.fromCharCode(key) != '-'
                    ) {
                    event.preventDefault();
                return;
            }
            if (String.fromCharCode(key)==separators.decimal) decimalEntered=true;
                $browser.defer(listener) // Have to do this or changes don't get picked up properly
            })

            $element.bind('paste cut', function() {
                $browser.defer(listener)  
            })
        }
    }
})

.directive('iboxProduct', function($compile, $uibModal){
    return {
        restrict: 'A',
        scope: {
            valorProducto:'@',
            resumen:'=',
            producto:'='
        },
        templateUrl: 'views/ventas-product.html',
        controller: function ($scope, $element) {
            $scope.selectorProducto = function(){

                if($scope.producto.categoria == "Alquilables"){
                    console.log("Puto");
                    
                }else {
                    $scope.addProduct();
                }
            }

            $scope.addProduct = function () {
                $scope.resumen.display = '';
                if($scope.producto.stock==-1){
                    if($scope.resumen.productos.length==0){
                        console.info("vacio");
                        //Pongo el numero productos en 0 por si elimine
                        //$scope.resumen.numeroProductos ++;
                        $scope.resumen.total+=Number($scope.valorProducto);
                        $scope.resumen.numeroProductos=0;
                        var ordinalItem=$scope.resumen.numeroProductos;
                        $scope.resumen.selected=ordinalItem;
                        console.log("ordinal " + ordinalItem);
                        var productoAGuardar={
                            id : ordinalItem,
                            identificador: $scope.producto.id,
                            valor : $scope.producto.valor,
                            nombre: $scope.producto.marca + '-' +  $scope.producto.nombre,
                            unidad: $scope.producto.unidad,
                            cantidad : 1, 
                            valorTotal: $scope.producto.valor,
                            descuento:'',
                            stockActual:$scope.producto.stock,
                            productoReal:$scope.producto
                        }
                        $scope.resumen.productos.push(productoAGuardar);
                    } else{

                        var esta = 0;
                        
                        console.log(esta);
                        //console.log("ordinal" + ordinalItem);
                        $scope.resumen.productos.forEach(function(producto) {
                            console.log('asd');
                            console.log(producto.identificador);
                            console.log(producto.id);
                            console.log($scope.producto.id);
                            if(producto.identificador==$scope.producto.id){
                                //console.info("existe producto");
                                esta = 1;
                                producto.cantidad++;
                                producto.valorTotal=producto.valor * producto.cantidad;
                            }                        
                        });

                        if(esta!=1){
                            //esta=0;
                            //console.info("otro producto");
                            $scope.resumen.numeroProductos ++;
                            $scope.resumen.total+=Number($scope.valorProducto);

                            var ordinalItem=$scope.resumen.numeroProductos;
                            $scope.resumen.selected=ordinalItem;
                            var productoAGuardar={
                                id : ordinalItem,
                                identificador: $scope.producto.id,
                                valor : $scope.producto.valor,
                                nombre: $scope.producto.marca + ' - ' +  $scope.producto.nombre,
                                unidad: $scope.producto.unidad,
                                cantidad : 1,
                                valorTotal: $scope.producto.valor,
                                descuento:'',
                                stockActual:$scope.producto.stock,
                                productoReal:$scope.producto
                            }
                            $scope.resumen.productos.push(productoAGuardar);
                        }
                    }

                    //console.log($scope);

                    //foeach valor de producto en resumen 

                    //funcion aca
                    $scope.resumen.recalculando(-1,false);
                    
                }
                
                if($scope.producto.stock>0){

                    //console.log($scope.resumen.productos.indexOf($scope.producto.id));
                    // console.log($scope.producto.id);                    
                    // console.log($scope.resumen.productos);
                    console.log('$scope.resumen.productos');
                    console.log($scope.resumen.productos);
                    if($scope.resumen.productos.length==0){
                        console.info("vacio");
                        //Pongo el numero productos en 0 por si elimine
                        //$scope.resumen.numeroProductos ++;
                        $scope.resumen.total+=Number($scope.valorProducto);
                        $scope.resumen.numeroProductos=0;
                        var ordinalItem=$scope.resumen.numeroProductos;
                        $scope.resumen.selected=ordinalItem;
                        //console.log("ordinal " + ordinalItem);
                        var productoAGuardar={
                            id : ordinalItem,
                            identificador: $scope.producto.id,
                            valor : $scope.producto.valor,
                            nombre: $scope.producto.marca + ' - ' +  $scope.producto.nombre,
                            unidad: $scope.producto.unidad,
                            cantidad : 1,
                            valorTotal: $scope.producto.valor,
                            descuento:'',
                            stockActual:$scope.producto.stock,
                            productoReal:$scope.producto
                        }
                        $scope.producto.stock--;
                        $scope.resumen.productos.push(productoAGuardar);
                    } else{

                        var esta = 0;
                        //console.log("ordinal" + ordinalItem);
                        $scope.resumen.productos.forEach(function(producto) {
                            //console.log(orden);
                            if(producto.identificador==$scope.producto.id){
                                //console.info("existe producto");
                                esta = 1;
                                producto.cantidad++;
                                $scope.producto.stock--;
                                producto.valorTotal=producto.valor * producto.cantidad;
                            }                        
                        });

                        if(esta!=1){
                            //esta=0;
                            //console.info("otro producto");
                            $scope.resumen.numeroProductos ++;
                            $scope.resumen.total+=Number($scope.valorProducto);

                            var ordinalItem=$scope.resumen.numeroProductos;
                            $scope.resumen.selected=ordinalItem;
                            var productoAGuardar={
                                id : ordinalItem,
                                identificador: $scope.producto.id,
                                valor : $scope.producto.valor,
                                nombre: $scope.producto.marca + ' - ' + $scope.producto.nombre,
                                unidad: $scope.producto.unidad,
                                cantidad : 1,
                                valorTotal: $scope.producto.valor,
                                descuento:'',
                                stockActual:$scope.producto.stock,
                                productoReal:$scope.producto
                            }
                            $scope.producto.stock--;
                            $scope.resumen.productos.push(productoAGuardar);
                        }
                    }

                    //console.log($scope);

                    //foeach valor de producto en resumen 

                    //funcion aca
                    $scope.resumen.recalculando(-1,false);
                }
            };
        }

    };
})

.directive('ventasCalculadora', [function(){
    return {
        restrict: 'A',
        scope: {
            resumen:'=',
            modal:'=',
            ventaProductos:'='
        },
        templateUrl: 'views/ventas-calculadora.html',
        controller: function ($scope) {

            $scope.selectedMod='Cnt'; 
                //console.log($scope);
                var borrar = false;
                $scope.selectMod = function($selected) {
                    $scope.selectedMod=$selected;
                    //console.log($scope.selectedMod);
                    $scope.resumen.display = '';
                }

                $scope.funcDelete = function() {

                    $scope.resumen.display = $scope.resumen.display.substring(0, $scope.resumen.display.length - 1);
                    if($scope.resumen.display == ''){
                        $scope.resumen.display = '0';
                    }

                    var index = $scope.resumen.selected;
                    //console.log($scope.resumen.selected);
                    //$scope.resumen.display += $selected;
                    console.log($scope.resumen.productos[index]);
                    switch ($scope.selectedMod){
                        case 'Cnt':

                        if($scope.resumen.productos[index].cantidad == 0){
                            $scope.resumen.productos.splice(index, 1);
                            $scope.resumen.numeroProductos--;
                            $scope.resumen.display='0';
                            $scope.resumen.selected= index - 1;
                            $scope.resumen.productos[index].productoReal.stock = $scope.resumen.productos[index].stockActual;
                        }else{
                                //console.log($scope.resumen.productos[index]);
                                $scope.resumen.productos[index].cantidad = $scope.resumen.display;
                                $scope.resumen.productos[index].valorTotal = $scope.resumen.display * $scope.resumen.productos[index].valor;

                                if($scope.resumen.productos[index].cantidad != -1){
                                    $scope.resumen.productos[index].productoReal.stock = $scope.resumen.productos[index].stockActual-$scope.resumen.productos[index].cantidad;
                                }
                            }
                            break;
                            case 'Desc':
                            /* Lo deshabilito para la muestra
                            var aux = $scope.resumen.productos[index].valorTotal;
                            $scope.resumen.productos[index].valorTotal = aux*($scope.resumen.display/100);
                            $scope.resumen.productos[index].descuento = $scope.resumen.display;
                            if ($scope.resumen.productos[index].descuento == 0) {
                                $scope.resumen.productos[index].descuento ='';
                                $scope.resumen.display = '';

                            }
                            */
                            
                            console.log('Descuento');
                            console.log($scope.resumen.display);

                            $scope.resumen.productos[index].valorTotal  = $scope.resumen.productos[index].productoReal.valor;

                            $scope.resumen.productos[index].valorTotal = $scope.resumen.productos[index].valorTotal *(1-$scope.resumen.display/100);

                            $scope.resumen.productos[index].descuento = $scope.resumen.display;
                            if ($scope.resumen.productos[index].descuento == 0) {
                                $scope.resumen.productos[index].descuento ='';
                                $scope.resumen.display = '';
                            }
                            $scope.resumen.recalculando(index,true);
                            break;
                            
                            case 'Val':
                            if($scope.resumen.productos[index].valorTotal == 0){
                                $scope.resumen.productos.splice(index, 1);
                                $scope.resumen.numeroProductos--;
                                $scope.resumen.display='0';
                                $scope.resumen.selected= index - 1;
                            }else{
                                //console.log($scope.resumen.productos[index]);
                                $scope.resumen.productos[index].valorTotal = $scope.resumen.display;
                            }
                            
                            break;
                        }
                        $scope.resumen.recalculando(index,true);
                    /*$scope.resumen.total=0;
                    newOrder=0;
                    $scope.resumen.productos.forEach(function(producto) {
                        $scope.resumen.total+=Number(producto.valorTotal);
                        producto.id= newOrder;
                        newOrder++;
                        $scope.resumen.productos[index].valorTotal = $scope.resumen.productos[index].cantidad * $scope.resumen.productos[index].valor;
                    });*/
                }

                $scope.selectBtn = function ($selected) {
                    if($selected=="C"){

                        for(i=0;i<$scope.resumen.productos.length;i++){
                            $scope.resumen.productos[i].productoReal.stock = $scope.resumen.productos[i].stockActual;
                        }

                        $scope.resumen.display='';
                        $scope.resumen.numeroProductos=-1;
                        $scope.resumen.productos=[];
                        $scope.resumen.total=0.00;
                        $scope.resumen.totalLitros=0;
                        $scope.resumen.selected=-1;
                    }
                    else{
                        if ($scope.resumen.display=='0'){
                            $scope.resumen.display='';
                        }
                        if($scope.resumen.productos.length!=0){
                            var index = $scope.resumen.selected;
                        //console.log($scope.resumen.selected);
                        $scope.resumen.display += $selected;
                        //console.log($scope.resumen.display);
                        switch ($scope.selectedMod){
                            case 'Cnt':

                                //console.log($scope.resumen.productos[index]);
                                console.log($scope.resumen.productos[index].productoReal);
                                console.log($scope.resumen.productos[index].stockActual);
                                
                                if($scope.resumen.productos[index].stockActual == -1){
                                    //-1 stock infinito
                                    
                                    $scope.resumen.productos[index].cantidad = $scope.resumen.display;
                                    $scope.resumen.productos[index].valorTotal = $scope.resumen.display * $scope.resumen.productos[index].valor;
                                    
                                    $scope.resumen.recalculando(index,true);
                                    
                                    //$scope.ventaProductos[index].stock =$scope.ventaProductos[index].stock -$scope.resumen.display;
                                   // $scope.resumen.productos[index].productoReal.stock = $scope.resumen.productos[index].stockActual-$scope.resumen.productos[index].cantidad;


                               }else 

                               if($scope.resumen.productos[index].stockActual >= Number($scope.resumen.display)){
                                console.log('more');
                                $scope.resumen.productos[index].cantidad = $scope.resumen.display;
                                $scope.resumen.productos[index].valorTotal = $scope.resumen.display * $scope.resumen.productos[index].valor;
                                $scope.resumen.recalculando(index,true);
                                    //$scope.ventaProductos[index].stock =$scope.ventaProductos[index].stock -$scope.resumen.display;
                                    $scope.resumen.productos[index].productoReal.stock = $scope.resumen.productos[index].stockActual-$scope.resumen.productos[index].cantidad;
                                }else{
                                 $scope.resumen.display= $scope.resumen.display.substring(0,$scope.resumen.display.length-1);
                             }
                             break;
                             case 'Desc':
                             console.log('Descuento');
                             console.log($scope.resumen.display);

                             $scope.resumen.productos[index].valorTotal  = $scope.resumen.productos[index].productoReal.valor;

                             $scope.resumen.productos[index].valorTotal = $scope.resumen.productos[index].valorTotal *(1-$scope.resumen.display/100);

                             $scope.resumen.productos[index].descuento = $scope.resumen.display;
                             if ($scope.resumen.productos[index].descuento == 0) {
                                $scope.resumen.productos[index].descuento ='';
                                $scope.resumen.display = '';
                            }
                            $scope.resumen.recalculando(index,true);
                            break;
                            case 'Val':
                            $scope.resumen.productos[index].descuento = 0;
                            $scope.resumen.productos[index].valorTotal = $scope.resumen.display;
                            $scope.resumen.recalculando(index,false);
                            break;
                        }
                    }    
                }
                    //console.log("*********imprimo $scope***************");
                    //console.log($scope);

                    //console.log("*********************************");
                    /*$scope.resumen.total=0;
                    newOrder=0;
                    $scope.resumen.productos.forEach(function(producto) {
                        $scope.resumen.total+=Number(producto.valorTotal);
                        producto.id= newOrder;
                        newOrder++;
                        $scope.resumen.productos[index].valorTotal = $scope.resumen.productos[index].cantidad * $scope.resumen.productos[index].valor;
                    }); */
                }

            }
        };
    }])

.directive('ventasResumenCompra', [function(){
    return {
        restrict: 'A',
        scope: {
            resumen:'='
        },
        templateUrl: 'views/ventas-resumen-compra.html',
        controller: function ($scope) {            
            $scope.selectItem = function ($selected) {
                $scope.resumen.selected=$selected;
                $scope.resumen.display = '';
                    //console.info($scope.resumen.selected);
                    //orden=$scope.ordinalItem -1;
                    //$scope.productos[orden].valor=10;
                };

            }
        };
    }])

// Ventas Barra

.directive('iboxProductBarra', function($compile){
    return {
        restrict: 'A',
        scope: {
            valorProducto:'@',
            resumen:'=',
            modal:'=',
            producto:'='
        },
        templateUrl: 'views/ventas-product-barra.html',
        controller: function ($scope, $element) {

            $scope.addProduct = function () {

                console.log($scope.$parent.cuponSeleccionado);
                
                if($scope.$parent.cuponSeleccionado){
                    console.log($scope.resumen);
                    $scope.resumen.display = '';
                    if($scope.producto.stock>0){

                        if($scope.resumen.productos.length==0){
                            $scope.resumen.total+=Number($scope.valorProducto);                        
                            $scope.resumen.numeroProductos=0;
                            var ordinalItem=$scope.resumen.numeroProductos;
                            $scope.resumen.selected=ordinalItem;
                            var productoAGuardar={
                                id : ordinalItem,
                                identificador: $scope.producto.id,
                                valor : $scope.producto.valor,
                                nombre: $scope.producto.nombre,                   
                                cantidad : 1,
                                valorTotal: $scope.producto.valor,
                                descuento:'',
                                stockActual:$scope.producto.stock,
                                productoReal:$scope.producto
                            }
                            $scope.producto.stock--;
                            $scope.resumen.productos.push(productoAGuardar);
                        } else{

                            var esta = 0;

                            $scope.resumen.productos.forEach(function(producto) {
                                //console.log(orden);
                                if(producto.identificador==$scope.producto.id){
                                    //console.info("existe producto");
                                    esta = 1;
                                    producto.cantidad++;
                                    $scope.producto.stock--;
                                    producto.valorTotal=producto.valor * producto.cantidad;
                                }                        
                            });

                            if(esta!=1){
                                $scope.resumen.numeroProductos ++;
                                $scope.resumen.total+=Number($scope.valorProducto);

                                var ordinalItem=$scope.resumen.numeroProductos;
                                $scope.resumen.selected=ordinalItem;
                                var productoAGuardar={
                                    id : ordinalItem,
                                    identificador: $scope.producto.id,
                                    valor : $scope.producto.valor,
                                    nombre: $scope.producto.nombre,                   
                                    cantidad : 1,
                                    valorTotal: $scope.producto.valor,
                                    descuento:'',
                                    stockActual:$scope.producto.stock,
                                    productoReal:$scope.producto
                                }
                                $scope.producto.stock--;
                                $scope.resumen.productos.push(productoAGuardar);
                            }
                        }
                        $scope.resumen.recalculando(-1,false);
                    }
                } else {
                    $scope.$parent.$parent.modal.scanearCupon();
                }
            };
        }

    };
})


.directive('ventasCalculadoraBarra', [function(){
    return {
        restrict: 'A',
        scope: {
            resumen:'=',
            modal:'=',
            ventaProductos:'='
        },
        templateUrl: 'views/ventas-calculadora-barra.html', 
        controller: function ($scope) {
            $scope.selectedMod='Cnt'; 
                //console.log($scope);
                var borrar = false;
                $scope.selectMod = function($selected) {
                    $scope.selectedMod=$selected;
                    //console.log($scope.selectedMod);
                    $scope.resumen.display = '';
                }

                $scope.funcDelete = function() {

                    $scope.resumen.display = $scope.resumen.display.substring(0, $scope.resumen.display.length - 1);
                    if($scope.resumen.display == ''){
                        $scope.resumen.display = '0';
                    }

                    var index = $scope.resumen.selected;
                    //console.log($scope.resumen.selected);
                    //$scope.resumen.display += $selected;
                    console.log($scope.resumen.productos[index]);
                    
                    if($scope.resumen.productos[index].cantidad == 0){
                        $scope.resumen.productos.splice(index, 1);
                        $scope.resumen.numeroProductos--;
                        $scope.resumen.display='0';
                        $scope.resumen.selected= index - 1;
                        $scope.resumen.productos[index].productoReal.stock = $scope.resumen.productos[index].stockActual;
                    }else{
                                //console.log($scope.resumen.productos[index]);
                                $scope.resumen.productos[index].cantidad = $scope.resumen.display;
                                $scope.resumen.productos[index].valorTotal = $scope.resumen.display * $scope.resumen.productos[index].valor;

                                if($scope.resumen.productos[index].cantidad != -1){
                                    $scope.resumen.productos[index].productoReal.stock = $scope.resumen.productos[index].stockActual-$scope.resumen.productos[index].cantidad;
                                }
                            }
                            console.info($scope.resumen);       
                            $scope.resumen.recalculando(index,true);
                        }

                        $scope.selectBtn = function ($selected) {
                            if($selected=="C"){

                                for(i=0;i<$scope.resumen.productos.length;i++){
                                    $scope.resumen.productos[i].productoReal.stock = $scope.resumen.productos[i].stockActual;
                                }

                                $scope.resumen.display='';
                                $scope.resumen.numeroProductos=-1;
                                $scope.resumen.productos=[];
                                $scope.resumen.total=0.00;
                                $scope.resumen.totalLitros=0;
                                $scope.resumen.selected=-1;
                            }
                            else{
                                if ($scope.resumen.display=='0'){
                                    $scope.resumen.display='';
                                }
                                if($scope.resumen.productos.length!=0){
                                    var index = $scope.resumen.selected;
                                    $scope.resumen.display += $selected;
                                    switch ($scope.selectedMod){
                                        case 'Cnt':

                                //console.log($scope.resumen.productos[index]);
                                console.log($scope.resumen.productos[index].productoReal);
                                console.log($scope.resumen.productos[index].stockActual);
                                
                                if($scope.resumen.productos[index].stockActual == -1){
                                    //-1 stock infinito
                                    
                                    $scope.resumen.productos[index].cantidad = $scope.resumen.display;
                                    $scope.resumen.productos[index].valorTotal = $scope.resumen.display * $scope.resumen.productos[index].valor;
                                    
                                    $scope.resumen.recalculando(index,true);
                                    
                                    //$scope.ventaProductos[index].stock =$scope.ventaProductos[index].stock -$scope.resumen.display;
                                   // $scope.resumen.productos[index].productoReal.stock = $scope.resumen.productos[index].stockActual-$scope.resumen.productos[index].cantidad;


                               }else 

                               if($scope.resumen.productos[index].stockActual >= Number($scope.resumen.display)){
                                console.log('more');
                                console.log($scope.resumen);
                                $scope.resumen.productos[index].cantidad = $scope.resumen.display;
                                $scope.resumen.productos[index].valorTotal = $scope.resumen.display * $scope.resumen.productos[index].valor;
                                $scope.resumen.recalculando(index,true);

                                    //$scope.ventaProductos[index].stock =$scope.ventaProductos[index].stock -$scope.resumen.display;

                                    $scope.resumen.productos[index].productoReal.stock = $scope.resumen.productos[index].stockActual-$scope.resumen.productos[index].cantidad;
                                }else{
                                 $scope.resumen.display= $scope.resumen.display.substring(0,$scope.resumen.display.length-1);
                             }
                             break;
                         }
                     }    
                 }
             }
         }
     };
 }])


.directive('ventasResumenCompraBarra', [function(){
    return {
        restrict: 'A',
        scope: {
            resumen:'='
        },
        templateUrl: 'views/ventas-barra-resumen-compra.html',
        controller: function ($scope) {
            console.log($scope.resumen);
            $scope.selectItem = function ($selected) {
                $scope.resumen.selected=$selected;
                $scope.resumen.display = '';                    
                    //console.info($scope.resumen.selected);
                    //orden=$scope.ordinalItem -1;
                    //$scope.productos[orden].valor=10;
                };

            }
        };
    }])


.directive('ventasDetalleClienteBarra', [function(){
    return {
        restrict: 'A',
        scope: {
            resumen:'='
        },
        templateUrl: 'views/ventas-detalle-cliente.html',
        controller: function ($scope) {            
            $scope.selectItem = function ($selected) {
                $scope.resumen.selected=$selected;
                $scope.resumen.display = '';
                    //console.info($scope.resumen.selected);
                    //orden=$scope.ordinalItem -1;
                    //$scope.productos[orden].valor=10;
                };

            }
        };
    }])