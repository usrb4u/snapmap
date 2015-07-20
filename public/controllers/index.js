var app = angular.module('webApp',['angularFileUpload']);

app.controller('webCtrl', function($scope, $http,$upload){

$scope.onFileSelect = function(files) {
	var ufile;
    // console.log(image[0].name);
    // $scope.uploadObj.fileName=image[0].name;
  $scope.uploadInProgress = true;
  $scope.uploadProgress = 0;

/*  if (angular.isArray(files)) {
    ufile = files[0];
  }
  */
  $scope.upload = $upload.upload({
    url: '/mobile/files',
    method: 'POST',
    data: {
      type: files[0].type
    },
    file: files
  }).progress(function(event) {
    $scope.uploadProgress = "In Progress";
    // $scope.$apply();
  }).success(function(response,data, status, headers, config) {
    $scope.saveFile=false;
    console.log(response);
    $scope.uploadProgress = 'Done'
    alert('Uploaded Successfully');
    window.location.href='http://localhost:3000/mobile/image'
  }).error(function(err) {
    $scope.uploadInProgress = false;
    alert('Error uploading file: ' + err.message || err);
  });
};

$scope.delete = function(id) {
  alert(id);
/*
  $http.delete('/mobile/'+id).success(function(response){
    alert('Deleted...');
    window.location.href='http://localhost:3000/mobile/image'
  })*/
}

});	
