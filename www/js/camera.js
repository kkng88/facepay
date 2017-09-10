var curr_cam_end;
function getPictureFromCamera(end){
    curr_cam_end=end;
navigator.camera.getPicture(onSuccess, onFail, {
    quality: 75,
    sourceType: Camera.PictureSourceType.CAMERA,
    destinationType: Camera.DestinationType.FILE_URI,
    saveToPhotoAlbum: false,
    correctOrientation: true,
    targetWidth: 972,
    targeHeight: 1296
});

}

function onSuccess(imageData) {
    var date=Date.now();
    var storageRef = firebase.storage().ref();

    var getFileBlob = function(url, cb) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.addEventListener('load', function() {
            cb(xhr.response);
        });
        xhr.send();
    };

    var blobToFile = function(blob, name) {
        blob.lastModifiedDate = new Date();
        blob.name = name;
        return blob;
    };

    var getFileObject = function(filePathOrUrl, cb) {
        getFileBlob(filePathOrUrl, function(blob) {
            cb(blobToFile(blob,date));
        });
    };

    getFileObject(imageData, function(fileObject) {
        
        //Upload to Firebase
        var uploadTask = storageRef.child('face/'+curr_user+"/"+date+".jpg").put(fileObject);

        uploadTask.on('state_changed', function(snapshot) {
            console.log(snapshot); 
        }, function(error) {
            console.log(error);
        }, function() {
            var downloadURL = uploadTask.snapshot.downloadURL;
            console.log(downloadURL);
            
            processImage(downloadURL) 
            
            //Add the person face
            if(curr_cam_end=="regPerson"){getPersonIdFromFb(downloadURL,1)}
            if(curr_cam_end=="identify"){verifyStep1_detectFace(downloadURL)}
           
        });
    });

}

function onFail(){
    alert("Image failed")
}

function getPictureFromGallery(){
    navigator.camera.getPicture(onSuccess, onFail, { quality: 50, destinationType: Camera.DestinationType.FILE_URI, sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY }); 

    function onSuccess(imageURI) {            
        //$('#camera-image').css({'background-image': 'url('+imageURI+')', 'background-size':  '50%'});
    }

    function onFail(message) {
        console.log('Failed to get an image');
    }    
}

/*
var getFileBlob = function (url, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.addEventListener('load', function() {
        cb(xhr.response);
    });
    xhr.send();
};

var blobToFile = function (blob, name) {
    blob.lastModifiedDate = new Date();
    blob.name = name;
    return blob;
};

var getFileObject = function(filePathOrUrl, cb) {
   getFileBlob(filePathOrUrl, function (blob) {
      cb(blobToFile(blob, 'test.jpg')); // Second argument is name of the image
   });
};*/