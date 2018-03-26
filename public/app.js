
 var map = new AMap.Map('container',{
 		zoom: 20,
        center: [118.778611, 32.043889]//new AMap.LngLat(116.39,39.9)
     });

$.ajax({
		url: "/cars",
		type:'GET',
		success: function(result) {
			console.log(result)
			console.log(result.length)
			console.log("do something here , too")
			showCars(result)
			

		}
	})

$.ajax({
		url: "/datas",
		type:'GET',
		success: function(result) {
			console.log(result)
			console.log(result.length)
			console.log("do something here")

			showHotPot(result);

		}
	})



function showHotPot(result){
	
	console.log("corepnts:")
	console.log(result)
     for(var i=0; i<result.length; i++){
     	for(var j=0; j<result[i].value.length; j++){
     		var circle = new AMap.Circle({map:map,
     									  center : new AMap.LngLat(result[i].value[j].lng,result[i].value[j].lat),
     									  radius:100,
     									  //fillColor:null,
     									  fillOpacity:0
     									});
     		circle.setMap(map);
     	}
     }
}

function showCars(result){

    //  for(var i=0; i<result.length; i++){
     
    //  		var marker = new AMap.Marker({
    //     		position: new AMap.LngLat(result[i].SCJD,result[i].SCWD),//marker所在的位置
    //     		map:map//创建时直接赋予map属性
    // 		});
    // //也可以在创建完成后通过setMap方法执行地图对象
   	// 		 marker.setMap(map);	
     	
    //  }

    AMapUI.loadUI(['misc/PointSimplifier'], function(PointSimplifier) {

    	if (!PointSimplifier.supportCanvas) {
        	alert('当前环境不支持 Canvas！');
        	return;
    	}

    //启动页面
    	initPage(PointSimplifier);
	});

	function initPage(PointSimplifier) {
    //创建组件实例
    	var pointSimplifierIns = new PointSimplifier({
        	map: map, //关联的map
        	
        	getPosition: function(dataItem) {
            //返回数据项的经纬度，AMap.LngLat实例或者经纬度数组
            	return [dataItem.SCJD,dataItem.SCWD];
        	},
        	getHoverTitle: function(dataItem, idx) {
            //返回数据项的Title信息，鼠标hover时显示
           	 	return '序号: ' + idx+'坐标：'+dataItem.SCJD+' '+dataItem.SCWD;
        	},
        	renderOptions: {
            //点的样式
            	pointStyle: {
               		 fillStyle: 'blue' //蓝色填充
            	}
        	}
    	});

    //随机创建一批点，仅作示意
    var data = createPoints(result);

    //设置数据源，data需要是一个数组
    	pointSimplifierIns.setData(data);

    //监听事件
   		pointSimplifierIns.on('pointClick pointMouseover pointMouseout', function(e, record) {
        	console.log(e.type, record);
    	});
	}

//仅作示意
	function createPoints(result){
		var res = [];
		for(var n=0; n<result.length; n++){
			var da = result[n].SCSJ;

		// 2017-12-12 12:12:12
		// 0123456789012345678

			var date = new Date(da.substr(0, 4), new Number(da.substr(5, 2) - 1), da.substr(8, 2), da.substr(11, 2), da.substr(14, 2), da.substr(17, 2));
			var day = date.getDay();
			var time = date.getHours();
			var timeID = Math.floor(time/2);
			function isWorkDay(day){
				return day>=1 && day<=5 ? true : false ;
				// return false;
			}

			if(isWorkDay(day)==true && timeID==3)
				res.push(result[n]);
			
		}
		return res ;

	}
}
