var express = require('express');
var router = express.Router();
var multer = require('multer');
//var videoData = require(__dirname+'\\model\\videoModel')
var uploadVideo = require(__dirname+'\\model\\uploadModel');
var fs = require('fs');
var gridfs = require('./model/gridfs');

var actFName = '';

router.get('/', function(req, res) {
  res.render('mobile', { title: 'Mobile upload', jsfile: 'mobile',recordIds:''});
});

router.use(multer({dest: './public/data/uploads',
	rename: function (fieldname, filename) {
		fName = filename;
		console.log('Filename: '+fName);
    return fName;
	},
	
	onFileUploadComplete: function (file) {
     fName = file;
	  console.log(file.fieldname + ' uploaded to  ' + file.path)
    // console.log("File name: "+fName);
    // if(actFName=='')

      actFName = file.path
    // else if(fs.existsSync(actFName))
      // fs.unlinkSync(actFName);
		console.log(actFName);
	  done=true;
	},
	onError: function(error,next){
		console.log('Error during upload: '+error);
	}
}));

router.delete('/:id',function(req,res){
	uploadVideo.findOne({_id:req.params.id}).remove({},true).exec(function(err,doc){
		if(err)
			console.log(err);
		else
			res.send('Deleted Successfully');
	})
});

router.get('/image/:id/:pos', function(req,res){
	uploadVideo.find({_id:req.params.id}).exec(function(err,result){
		if(err)
			console.log('error while loading the image: '+err);
		else if(result!=null|| result[0].files.length!=0) {
			var imgId = result[0].files[req.params.pos]._id;
				gridfs.getGridFile(imgId.toString(),function(err,doc){
					if(err){
						console.log('Error in reading from Grid file:: ');
						console.log(err);
					}
						
					else
						res.writeHead(200, {'Content-Type': result[0].files[req.params.pos].contentType});
			   			// res.write('<html><body><img src="doc.attachment:image/jpeg')
						res.write(doc,'buffer');
						res.end();
						// res.end('"/></body></html>');
				});
		}
		else
			res.end(); 
	})
})

router.get('/image/:id',function(req,res){
	
	uploadVideo.find({_id:req.params.id}).exec(function(err,result){
		if(err)
			console.log('Unable to find record: '+err)
		else if(result!=null || result[0].files.length!=0) {
			// console.log('files count: '+result);
			var imgId = result[0].files[0]._id;
				gridfs.getGridFile(imgId.toString(),function(err,doc){
					if(err){
						console.log('Error in reading from Grid file:: ');
						console.log(err);
					}
						
					else
						res.writeHead(200, {'Content-Type': result[0].files[0].contentType});
			   			// res.write('<html><body><img src="doc.attachment:image/jpeg')
						res.write(doc,'buffer');
						res.end();
						// res.end('"/></body></html>');
				});
		}
		else
			res.end(); 
	});
});
router.get('/image',function(req,res){
	// var gridfs = 
	//uploadData.find({_id:req.params.id}).exec(function(err,result){
	uploadVideo.find({},{_id:1}).exec(function(err,result){
		if(err)
			console.log('Unable to find record: '+err);

		// console.log(result);

		res.render('mobile', { title: 'Mobile upload', jsfile: 'mobile', recordIds:result});
	});
});

router.post('/files', function(req,res){
  if(done==true){
          var upload, opts,fpath;
       upload = new uploadVideo();
       // console.log("upload initiated");
        upload._id = mongoose.Types.ObjectId(req.body._id);
        upload.docName = actFName;
        opts = {
            content_type: req.body.type
        };
        console.log('Files:: '+req.files.file.length)
        // console.log('File1 : '+req.files.file[0].name);
        //for(var i=0;i<req.files.file.length; i++) {
        	// fpath = req.files.file[0].path;
	        upload.addFile(req.files, opts, function (err, result) {
	            if (err) console.log("api TrackDocs Error: " + err);

	            // console.log("Result: " + result);
	            upload.save();
	            if(req.files.file.length==undefined)
	            	fs.unlinkSync(req.files.file.path);
	            // console.log('Deleting file from drive: '+req.files.file.path);
	            for(var i=0; i<req.files.file.length; i++)
	            	if(fs.existsSync(req.files.file[i].path))
	            		fs.unlinkSync(req.files.file[i].path);
	            // console.log("Inserted Doc Id: " + upload._id);
	            res.json(upload._id);
	           // res.end('Uploaded successfully');
	            // res.send(upload._id);
	        });
	    // }
  }
});


module.exports = router;