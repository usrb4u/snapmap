var app = angular.module('searchApp',['angularFileUpload']);

app.controller('mapCtrl', function($scope, $http,$upload){
  $scope.mapinfo={};
  $scope.files =[];
  if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
      $scope.$apply(function(){
        // alert(position.coords.latitude+ " "+position.coords.longitude);
        console.log(position.coords.latitude+ " "+position.coords.longitude);
        $scope.mapinfo.latitude = position.coords.latitude;
        $scope.mapinfo.longitude = position.coords.longitude;
        // alert($scope.mapinfo.latitude);
        
      });

      });
    }

$scope.onFileSelect = function(files) {
  var ufile;
    // console.log(image[0].name);
    // $scope.uploadObj.fileName=image[0].name;
  $scope.uploadInProgress = true;
  $scope.uploadProgress = 0;
  $scope.files = files;
/*  if (angular.isArray(files)) {
    ufile = files[0];
  }
  */
};


// Info window should have prev and next buttons if more images and get those if available from database from a particular location.
// Sort out date wise and display all images with default present date and display the date in info window along with image / video
// distinguish image / video handle accordingly in the logic as well info window and should as expected
// Comment option to user to give feedback about event and those should be displayed right panel of info window

	$scope.add = function(){
		console.log($scope.mapinfo);
    console.log('Files count: '+$scope.files.length)
    $scope.mapinfo.imagecount = $scope.files.length;
  $scope.upload = $upload.upload({
    url: '/mobile/files',
    method: 'POST',
    data: {
      type: $scope.files[0].type
    },
    file: $scope.files
  }).progress(function(event) {
    $scope.uploadProgress = "In Progress";
    // $scope.$apply();
  }).success(function(response,data, status, headers, config) {
    console.log(response);
    $scope.mapinfo.imageId = 'http://inblr-uppalasr:3000/mobile/image/'+response;
    $scope.uploadProgress = 'Done'
    $http.post('/mapinfo',$scope.mapinfo).success(function(response){
      console.log(response)
      $scope.mapinfo = '';
      alert('Added Successfully');
      window.location.href="http://localhost:3000/mapinfo/map";
    });
  }).error(function(err) {
    $scope.uploadInProgress = false;
    alert('Error uploading file: ' + err.message || err);
  });
		
	}
});