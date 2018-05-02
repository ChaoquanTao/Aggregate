var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/";
 
const options = { keepAlive: true, connectTimeoutMS: 8000000 ,socketTimeoutMS: 8000000}


MongoClient.connect(url,options, function(err, db) {
  if (err) throw err;
 
  var dbo = db.db("busi_run");
  const col = dbo.collection("output");
  console.log("数据库已创建!");

  // col.find({}).toArray(function(error,result){
  // 	if(error) throw error ;
  // //	console.log(new Date(result[0]["SCSJ"]).getHours());
  // 	db.close();
  // });

   col.mapReduce(map,reduce, {out:{replace:"out"},finalize:finalize} ,function(error,result){
   		if(error) throw error ;
   		console.log("ttt "+result);
   		console.log("cccccc"+result[0])
   		// for(var v in result){
   		// 	console.log(v)
   		// 	console.log(result.v)
   		// }
   });
  db.close();	
});

function finalize(key,reduceValue){
	print("line 29: "+reduceValue);
	//print(typeof(reduceValue))
	var corePnts = [];
	var clusters = new Array(2000);
	for(var i=0; i<clusters.length;i++){
		clusters[i] = new Array();
	}
	if(reduceValue.values==undefined){
		// print("this is a bson oject!")
		return corePnts;
	}
	
	var values =  reduceValue.values;
	// print("isWorkDay: "+key.isWorkDay+" timeID: "+values[0].timeID)
		// for(var p in values[0]){
		// 	if(values[0].hasOwnProperty(p)){
		// 		print("=================="+p)
		// 	}
		// }
	// print("values: "+values)
	// print("values.length "+values.length)
	var eps = 500	;
	var minPts = 5 ;
	var c =-1;
	
	var isVisited = new Array(values.length);
	//print("length:"+isVisited.length)
	for(var i=0; i<isVisited.length; i++){
		isVisited[i]=false;
		//print(isVisited[i])
	}


	
/*我们将获取点邻居这个动作认为是点是否被访问过的标准*/
	for(var idx =0; idx<values.length; idx++){
		
		//print("test1"+isVisited[idx])
		if(isVisited[idx]==false){	//如果当前点还没有被访问
			// print("idx: "+idx+" value: "+values[idx].lng+" "+values[idx].lat+" "+values[idx].cph);
			//print(values[idx].lng,values[idx].lat)
			
			var neighbors = getNeighbors(values[idx]); //获取某点的邻居

			// print("neighors: "+neighbors)
			// print("neibour.length: "+neighbors.length)
			if(neighbors.length>=minPts){	//如果是核心点
				c++;
				isVisited[idx] = true ;  //这个核心点标记已经被访问过

				// print("this is a corepoint idx: "+idx+" value: "+values[idx].lng+" "+values[idx].lat+" "+values[idx].cph);
				corePnts.push(values[idx]);
				clusters[c].push(values[idx]);	//将该点加入簇
			
				
				for(var nb in neighbors){	//将该点的邻居加入簇 nb是下标
					// clusters[c].push(nb);
					// print("nb "+nb+"idx"+values.indexOf(neighbors[nb]))
					if(isVisited[values.indexOf(neighbors[nb])]==false){ //如果这个邻居还没有被访问
						clusters[c].push(neighbors[nb]);
						//isVisited[values.indexOf(nb)]=true ;	//同时将该点置为已访问过
						corePnts.push(neighbors[nb]);
					}
				}
				
				for(var pnt=0; pnt< clusters[c].length; pnt++){ //pnt是下标
					// print("pnt "+pnt+" isVisited "+isVisited[values.indexOf(clusters[c][pnt])]+" "+values.indexOf(clusters[c][pnt]))
					if(isVisited[values.indexOf(clusters[c][pnt])]==false){ //在未读里面寻找
						var tneighbors = getNeighbors(clusters[c][pnt]);
						isVisited[values.indexOf(clusters[c][pnt])]=true ; //将点标为已读
						if(tneighbors.length>=minPts){	//如果是核心点
							// print("this is a corepnt "+"idx"+ values.indexOf(clusters[c][pnt])+" value: "+clusters[c][pnt].lng+" "+clusters[c][pnt].lat+" "+clusters[c][pnt].cph);
							corePnts.push(clusters[c][pnt]);
							// clusters[c].push(tneighbors);
							for(var tnb in tneighbors){	//将邻居加入当前簇
								if(isVisited[values.indexOf(tneighbors[tnb])]==false){
									clusters[c].push(tneighbors[tnb]);	//邻居加入当前簇应该采用集合并的方法
									corePnts.push(tneighbors[tnb]);
								}
							}
							
						}
					}
				}
				// print("ddd"+clusters[c]);
				// print("corepnts: "+corePnts)
			}
		}
	}
	print(c);
	//return corePnts;
	return clusters;

	function getNeighbors(value){
		var neighbors = [];
		for(var p in values){ //p是下标
			if(values[p] != value){
				// print("p "+p);
				// print("lat1: "+values[p].lat+" lng1: "+values[p].lng+" lat2: "+value.lat+" lng2: "+value.lng);
				var d = dist(values[p],value);
				//print("distance: "+d);
				if(d <= eps){
					// print("distance: "+d);
					// print(value.lng,value.lat,value.cph,value.day,value.timeID,values[p].lng,values[p].lat,values[p].cph,values[p].day,values[p].timeID)
					neighbors.push(values[p]);
				}
			}
		}
		return neighbors ;
	}

	function dist(p1,p2){
		var earth_radius = 6376000;
		var d = earth_radius * Math.acos(Math.cos(p1.lat)*Math.cos(p2.lat)*Math.cos(p2.lng-p1.lng)+Math.sin(p1.lat)*Math.sin(p2.lat));
		return d ; 
	}
}

function map(){
	//对上车时间进行拆分，得到date和time
	var da = this["SCSJ"];
	//var da = this.SCSJ ;
	//var da = "2017-12-12 12:12:12";
	// 2017-12-12 12:12:12
	// 0123456789012345678

	var date = new Date(da.substr(0, 4), new Number(da.substr(5, 2) - 1), da.substr(8, 2), da.substr(11, 2), da.substr(14, 2), da.substr(17, 2));
	var day = date.getDay();
	var time = date.getHours();
	//var timeID = Math.floor(time/3);
	function isWorkDay(){
		return day>=1 && day<=5 ? true : false ;
		// return false;
	}

	//根据工作日和非工作日划分不同的timeID
	if(isWorkDay()){//如果是工作日
		switch(time){
			case 0:
			case 1:
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
			case 7: 
				timeID = 0;
				break ; 
			case 8:
			case 9:
			case 10: 
				timeID =1;
				break ;
			case 11:
			case 12:
			case 13: 
				timeID=2;
				break ;
			case 14:
			case 15:
			case 16: 
				timeID =3 ;
				break ;
			case 17:
			case 18:
			case 19: 
			case 20: 
				timeID=4;
				break ;
			case 21:
			case 22:
			case 23: 
				timeID = 5;
				break;

		}
	}
	else{ 	//如果不是工作日
		switch(time){
			case 0:
			case 1:
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
			case 7:
			case 8: 
				timeID=0;
				break;
			case 9:
			case 10:
			case 11:
			case 12:
			case 13:
			case 14:
			case 15:
			case 16:
			case 17:
			case 18:
			case 19:
			case 20:
			case 21:
			case 22:
			case 23: 
				timeID=1;
				break ;
		}
	}


	 var x = {"isWorkDay":isWorkDay(),"timeID": timeID };
	//var x = {"isWorkDay":isWorkDay()};
	var y = {"lng":this["SCJD"],"lat":this["SCWD"],"day":day,"timeID":timeID,"cph":this["CPHM"]};
 


	emit(x, y);
	// emit({"isWorkDay":isWorkDay(),"timeID": timeID}, 1);


} 	

function reduce(key,values){
	
	// return {values: values}
	temp = { "values": [] }
	for (var i = 0; i < values.length; ++i) {
		if (values[i].hasOwnProperty("values")) {
			temp["values"] = temp["values"].concat(values[i]['values']) 
		} else {
			temp["values"] = temp["values"].concat(values[i])
		}
	}
	return temp;
	
}



	