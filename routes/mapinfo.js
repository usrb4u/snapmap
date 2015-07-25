var express = require('express');
var router = express.Router();
var fs = require('fs');
var mapinfo = require(__dirname+'\\model\\mapinfo');

/* GET home page. */

router.get('/map', function(req, res) {
	var mapData ='';
	mapinfo.find({}).exec(function(err,doc){
		if(err)
			console.log(err);
		else
			mapData = doc
			// console.log(mapData);
		res.render('map', { title:'Map information', jsfile:'mapinfo', mapData:mapData});
	});
	// console.log(mapData);
  
});

router.get('/', function(req, res) {
	res.render('mapinfo', { title:'Map information', jsfile:'mapinfo'});
	
});


router.post('/',function(req,res){	
		var mapdata = new mapinfo({
			latitude:req.body.latitude,
			longitude:req.body.longitude,
			title:req.body.title,
			info:req.body.info,
			date:new Date(),
			imageId:req.body.imageId,
			imagecount:req.body.imagecount
		});
	mapdata.save(function(err,query){
		if(err)
			console.log('Unable to insert new values into database @ mapinfo/')
		else
			res.send(query)
	});
});


module.exports = router;