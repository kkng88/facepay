// This is a JavaScript file

function storeImage(userId,file){ 
    
    var metadata = {
     'contentType': "image/jpeg",
     'cacheControl': 'public,max-age=60000'            
    };      

    storageRef.child(userId+"/"+Date.now()).put(file, metadata).then(function(snapshot) {
        var url = snapshot.downloadURL;
        //console.log('Uploaded', snapshot.totalBytes, 'bytes.');
        //console.log(snapshot.metadata);
        //console.log('File available at', url);
        }).catch(function(error) {
        console.error('Upload failed:', error);
    });
}

function storePersonToFb(personid){

  var personData = {
    personid:personid 
  };

  var updates = {};
  updates['person/' + curr_user] = personData;

  return firebase.database().ref().update(updates);    
}

var curr_person;
function getPersonIdFromFb(url,add){
    var userRef = firebase.database().ref('person/' + curr_user + '/personid');
    userRef.once('value', function(d) {
        //console.log(JSON.parse(JSON.stringify(d)))
        curr_person=JSON.parse(JSON.stringify(d));
        //console.log("Adding Person Face")
        console.log("Curr Person:"+curr_person)
         if(add){addPersonFace(url,curr_person)}
    });
    
}

function triggerPayment(){
        var updates = {};
        
        updates['blockchain/val'] = Date.now();
        firebase.database().ref().update(updates,function(error){});
}