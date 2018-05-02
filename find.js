db.out.find().forEach(function(car){
	//print("lng "+" lat "+" timeID "+" day ")
	print("isWorkDay: "+car._id.isWorkDay+" timeID: "+car._id.timeID+" value length: "+car.value.length)
	for(var i in car.value){
		print("cph: "+car.value[i].cph+" lat: "+car.value[i].lat+" lng: "+car.value[i].lng+" timeID: "+car.value[i].timeID+" day "+car.value[i].day)
	}
//	 for(var p in car._id){
//	 	if(car._id.hasOwnProperty(p))
//	 		print(p)
//	 }

})