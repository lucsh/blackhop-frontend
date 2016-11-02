    .directive('iboxProduct', function($compile){
        return {
            restrict: 'A',
            scope: {
               valorProducto:'@',
               resumen:'='
            },
            templateUrl: 'views/ventas-product.html',
            controller: function ($scope, $element) {
            
                $scope.addProduct = function () {
                    $scope.resumen.numeroProductos ++;
                    $scope.resumen.total+=Number($scope.valorProducto);
                    
                    var ordinalItem=$scope.resumen.numeroProductos;
                    
                    var producto={
                        id : ordinalItem,
                        valor : $scope.valorProducto,
                        cantidad : 1,
                        descuento : 0
                    }
                    
                    $scope.resumen.productos.push(producto);
                    //console.log($scope);
                    
                    //foeach valor de producto en resumen 
                    $scope.resumen.total=0;
                    $scope.resumen.productos.forEach(function(orden) {
                        $scope.resumen.total+=Number(orden.valor);
                    });
                    
                    var nEl = $compile("<div ventas-resumen-compra-producto ordinal-item="
                                       + ordinalItem 
                                       + " valor-producto='{{ valorProducto }}' resumen='resumen' ></div>")($scope);
                    var el = angular.element( document.querySelector( '#listado' ) );
                    el.append(nEl);

                };
            }
            
        };
    })