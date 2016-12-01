var myApp = angular.module('myApp', []);
myApp.controller('myController',['$scope',function($scope){

	
	var disponible = 'background-color: #fff;';
	var nope = 'background-color: #ed5565';
	var warning ='background-color: #f0ad4e;';
	var ok ='background-color: #1ab394;';
	var hoy = 'background-color: #5bc0de';
	var noLaboral = 'background-color: #f9f9f9';

	$scope.alquiler={}

	$scope.calculateClassAnterior = function(alquilable,dia){

	alquilable=this.$parent.alquilables[alquilable-1];

		if (((alquilable.dias[dia-1].id+1)%7) == 0){
					//sabado
					dia=dia+2;
					//console.log("sabado");
					
				}
		for (var i = dia; i >= 0; i--) {
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
		desde = dia -4
	 	desdeFecha =moment(alquilable.dias[dia-1].fecha);
	 	hasta = dia;
	 	hastaFecha=moment(alquilable.dias[dia].fecha);
		if (((alquilable.dias[dia-1].id+1)%7) == 0){
			//sabado
			hasta=dia+2;
			hastaFecha.add(2, 'days');
			//alquilable.dias[dia-1].fecha.setDate(alquilable.dias[dia-1].fecha.getDate() + hasta);
			//someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
			//console.log("sabado");
			
		}
		for (var i = hasta; i >= desde; i--) {
			if (i>20) i=20;
			if (i > -1){						
				//console.log("for " + i);
				alquilable.dias[i].hover = ok;
			}

		}

		if (alquilable.dias[desde] && alquilable.dias[desde].estado != "disponible"){					
			alquilable.dias[desde].hover = warning;
		}

		alquilable.dias[dia-1].hover = hoy;
		$scope.alquiler.hasta=moment(hastaFecha).locale('es').format('dddd DD MMMM').toUpperCase();
		$scope.alquiler.desde=moment(desdeFecha).locale('es').format('dddd DD MMMM').toUpperCase();
	}

	alquilable.dias[dia-1].claseAnterior=alquilable.dias[dia-1].hover;
			if (alquilable.dias[dia-1].fecha.isBefore(moment().startOf('date'))){
				//antes de hoy
				alquilable.dias[dia-1].hover=nope;				
				$scope.alquiler.desde="";
				$scope.alquiler.hasta="";
			}else if (((alquilable.dias[dia-1].id+7)%7) == 0 ||((alquilable.dias[dia-1].id+6)%7) == 0){
						//domingo||lunes
				alquilable.dias[dia-1].hover=nope;				
				$scope.alquiler.desde="";
				$scope.alquiler.hasta="";
			} else if (alquilable.dias[dia-1].estado == "alquilado"){	
					   //hoy alquilado	
				alquilable.dias[dia-1].hover=nope;				
				$scope.alquiler.desde="";
				$scope.alquiler.hasta="";
			} else if(alquilable.dias[dia].estado == "alquilado"){
					   //mañana alquilado
				alquilable.dias[dia-1].hover=nope;				
				$scope.alquiler.desde="";
				$scope.alquiler.hasta="";
			} else if (dia!=20 && ((alquilable.dias[dia-1].id+1)%7) == 0 && (alquilable.dias[dia+2].estado == "alquilado")){
						//!ultimo sabado & sabado && martes alquilado	
				alquilable.dias[dia-1].hover=nope;
				$scope.alquiler.desde="";
				$scope.alquiler.hasta="";
			}else if (alquilable.dias[dia-3] && alquilable.dias[dia-3].estado != "alquilado"){
				marcar();
			} else if (!alquilable.dias[dia-3] && alquilable.dias[dia-2].estado != "alquilado"){
				marcar();	
			} else {
				alquilable.dias[dia-1].hover = nope;
				$scope.alquiler.desde="";
				$scope.alquiler.hasta="";
			}
		}

    $scope.alquilables=[
	{
		id:1,
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
		}
		]
	},
	{
		id:2,
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
		}
		]
	},
	{
		id:3,
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
		}
		]
	},
	{
		id:4,
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
		}
	]
	}
];


		/*
		SOLO PARA TESTING
		*/
		var primerDiaDeEstaSamana=moment().startOf('isoWeek').subtract(7, 'days');//menos 7 para test

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
		//domingos && lunes
		if ((($scope.alquilables[i].dias[j].id+7)%7) == 0||(($scope.alquilables[i].dias[j].id+6)%7) == 0){
			
			$scope.alquilables[i].dias[j].hover = noLaboral;
			$scope.alquilables[i].dias[j].claseAnterior = noLaboral
		}

		if ($scope.alquilables[i].dias[j].estado == "alquilado"){
			$scope.alquilables[i].dias[j].hover = nope;
			$scope.alquilables[i].dias[j].claseAnterior = nope
		}
		
		
	}
}



}]);
