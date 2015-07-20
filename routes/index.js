var express = require('express');
var router = express.Router();
var multer = require('multer');
var uploadVideo = require(__dirname+'\\model\\uploadModel');
var fs = require('fs');
var gridfs = require('./model/gridfs');

var actFName = '';

router.get('/', function(req, res) {
  res.render('index', { title: 'Snapmap Upload', jsfile: 'index',recordIds:''});
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
    
      actFName = file.path
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
	uploadVideo.find({},{_id:1}).exec(function(err,result){
		if(err)
			console.log('Unable to find record: '+err)

		// console.log(result);

		res.render('mobile', { title: 'Mobile upload', jsfile: 'mobile', recordIds:result});
	});
})

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
       
	        upload.addFile(req.files, opts, function (err, result) {
	            if (err) console.log("api TrackDocs Error: " + err);

	            // console.log("Result: " + result);
	            upload.save();
	            console.log('Deleting file from drive: '+fpath);
				if(req.files.file.length==undefined && fs.existsSync(req.files.file.path))
	            	fs.unlinkSync(req.files.file.path);					
				for(var i=0; i<req.files.file.length; i++)
	            	if(fs.existsSync(req.files.file[i].path))
	            		fs.unlinkSync(req.files.file[i].path);
	            return res.json(upload._id);
	        });
	    // }
  }
});


module.exports = router;