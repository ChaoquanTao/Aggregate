db.alldistinct.find().forEach(function(v){
	var da = v.SCSJ;

	var date = new Date(da.substr(0, 4), new Number(da.substr(5, 2) - 1), da.substr(8, 2), da.substr(11, 2), da.substr(14, 2), da.substr(17, 2));
	var day = date.getDay();
	var time = date.getHours();

	function isWorkDay(){
		return day>=1 && day<=5 ? true : false ;
	
	}
	if(! isWorkDay()){
		print("cph: "+v.CPHM+" lat: "+v.SCWD+" lng: "+v.SCJD+" day "+day)
	}
})