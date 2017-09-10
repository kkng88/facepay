// This is a JavaScript file
var subscriptionKey = "f53a0ceaa13a4500a48e77565d9c683c";
var personGroup="hackgroup"
function CreateUserGroup(){

   var params = {
            // Request parameters
        };
      var body ='{"name":"Hack Group"}';
      
        $.ajax({
            url: "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/"+personGroup + $.param(params),
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key",subscriptionKey);
            },
            type: "PUT",
            // Request body
            data: body,
        })
        .done(function(data) {
            alert("success");
        })
        .fail(function(data) {
            alert(data);
			console.log(data)
        });
}

function createPerson(){
        var params = {
            // Request parameters
        };

var body='{"name":"'+curr_user+'"}';

        $.ajax({
            url: "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/"+personGroup+"/persons?" + $.param(params),
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key",subscriptionKey);
            },
            type: "POST",
            // Request body
            data: body,
        })
        .done(function(data) {
            //console.log(data.personId);
            storePersonToFb(data.personId)
            //Store in Firebase
            
        })
        .fail(function(data) {
            alert("error:"+data);
        });
}

function addPersonFace(url,personId){
       //console.log(url)
       //console.log(personId)
       //console.log(personGroup)
       
       var params = {
            // Request parameters
            "personGroupId": personGroup,
            "personId": personId
        };
        
        var body='{"url":"'+url+'"}';
        $.ajax({
            url: "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/"+personGroup+"/persons/"+personId+"/persistedFaces?" + $.param(params),
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key",subscriptionKey);
            },
            type: "POST",
            // Request body
            data: body
        })
        .done(function(data) {
            alert("success");
        })
        .fail(function(data) {
            alert("error:"+data);
        }); 
}

function verifyStep1_detectFace(url){

        var params = {
            "returnFaceId": "true",
            "returnFaceLandmarks": "false"
        };

        $.ajax({
            url: "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect?" + $.param(params),

            // Request headers.
            beforeSend: function(xhrObj){
                xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
            },
            type: "POST",
            // Request body.
            data: '{"url": ' + '"' + url + '"}',
        })

        .done(function(data) {
            // Show formatted JSON on webpage.
            // Start Verification
            console.log("Identifying:"+data[0].faceId)
            setTimeout(function(){identifyFace(data[0].faceId)},2000)//verifyStep2(data[0].faceId)
        })

        .fail(function(jqXHR, textStatus, errorThrown) {
            // Display error message.
            var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
            errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ? 
                jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
            alert(errorString);
        });
}


var identityMatch;
var faceSuccess=false;
function identifyFace(faceId){
     var params = {
  
        };
      console.log(faceId)
      var body='{"personGroupId":"'+personGroup+'","faceIds":["'+faceId+'"],"maxNumOfCandidatesReturned":1,"confidenceThreshold": 0.6}';          
      
      
      
        $.ajax({
            url: "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/identify?" + $.param(params),
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key",subscriptionKey);
            },
            type: "POST",
            // Request body
            data: body,
        })
        .done(function(data) {
             console.log(JSON.stringify(data))
            var res=data[0].candidates[0];
            if(res){
            identityMatch="Identified with "+Math.round(res.confidence*100)+"% confidence level. Your Person ID:"+res.personId
            faceSuccess=true;
            //alert("Identified with "+Math.round(res.confidence*100)+"% confidence level. Your Person ID:"+res.personId);
            }else{
            faceSuccess=false;
            identityMatch="Face does not match. Payment Rejected";            
            //alert("Face does not match. Rejected")    
            
            }
        })
        .fail(function(data) {
            alert("error: "+JSON.stringify(data));
        });
}

function trainModel(){
            var params = {
            // Request parameters
        };
      
        $.ajax({
            url: "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/"+personGroup+"/train?" + $.param(params),
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key",subscriptionKey);
            },
            type: "POST",
            // Request body
            data: "{body}",
        })
        .done(function(data) {
            alert("success");
        })
        .fail(function() {
            alert("error");
        });
}


///////////////////Facial Detection

var subscriptionKey = "f53a0ceaa13a4500a48e77565d9c683c";
    function processImage(url) {
        console.log(url)
        // You must use the same region in your REST API call as you used to obtain your subscription keys.
        // For example, if you obtained your subscription keys from the westus region, replace
        // "westcentralus" in the URI below with "westus".
        //
        // NOTE: Free trial subscription keys are generated in the westcentralus region, so if you are using
        // a free trial subscription key, you should not need to change this region.
        var uriBase = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect";

        // Request parameters.
        var params = {
            "returnFaceId": "true",
            "returnFaceLandmarks": "true",
            "returnFaceAttributes": "age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise",
        };

        // Display the image.
        var sourceImageUrl = url//document.getElementById("inputImage").value;
        document.querySelector("#sourceImage").src = sourceImageUrl;

        // Perform the REST API call.
        $.ajax({
            url: uriBase + "?" + $.param(params),

            // Request headers.
            beforeSend: function(xhrObj){
                xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
            },

            type: "POST",

            // Request body.
            data: '{"url": ' + '"' + sourceImageUrl + '"}',
        })

        .done(function(data) {
            // Show formatted JSON on webpage.
            $("#responseTextArea").val(JSON.stringify(data, null, 2));
    		drawCanvas(data)
        }) 

        .fail(function(jqXHR, textStatus, errorThrown) {
            // Display error message.
            var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
            errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ? 
                jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
            alert(errorString);
        });
    };
	
	function drawCanvas(data){
			var c = document.getElementById("canvas");
			var ctx = c.getContext("2d");
			var img = document.getElementById("sourceImage");
			var s = data[0].faceLandmarks;
			var r = data[0].faceRectangle;
            setTimeout(function(){
			ctx.drawImage(img,r.left,r.top,r.width,r.height,0,0,r.width,r.height);	
            },250)
			var fp_arr=[
			s.eyebrowLeftInner,
			s.eyebrowLeftOuter,
			s.eyebrowRightInner,
			s.eyebrowRightOuter,
			s.eyeLeftBottom,
			s.eyeLeftInner,
			s.eyeLeftOuter,
			s.eyeLeftTop,
			s.eyeRightBottom,
			s.eyeRightInner,
			s.eyeRightOuter,
			s.mouthLeft,
			s.mouthRight,
			s.noseLeftAlarOutTip,
			s.noseLeftAlarTop,
			s.noseRightAlarOutTip,
			s.noseRightAlarTop,
			s.noseRootLeft,
			s.noseRootRight,
			s.noseTip,
			s.pupilLeft,
			s.pupilRight,
			s.underLipBottom,
			s.underLipTop,
			s.upperLipBottom,
			s.upperLipTop
			]
			
			for (i = 0; i < fp_arr.length; i++) { 
				var x_p=fp_arr[i].x-r.left;
				var y_p=fp_arr[i].y-r.top;
				ctx.beginPath();
				ctx.arc(x_p,y_p,1, 0, 2 * Math.PI);
				ctx.strokeStyle="white";
				//ctx.stroke();
			}
			var time=250;
	function drawLine(from,to){
			setTimeout(function(){
			var x_f=from.x-r.left;
			var y_f=from.y-r.top;	
			var x_t=to.x-r.left;
			var y_t=to.y-r.top;			
			ctx.beginPath();
			ctx.moveTo(x_f,y_f);
			ctx.lineTo(x_t,y_t);
			ctx.strokeStyle="white";
			ctx.stroke();
			},time)
			time+=50;
	}		
			//Nose
			drawLine(s.noseTip,s.noseLeftAlarOutTip)
			drawLine(s.noseTip,s.noseLeftAlarTop)
			drawLine(s.noseTip,s.noseRightAlarOutTip)
			drawLine(s.noseTip,s.noseRightAlarTop)
			drawLine(s.noseTip,s.noseRootLeft)
			drawLine(s.noseTip,s.noseRootRight)
			drawLine(s.noseTip,s.mouthLeft)
			drawLine(s.noseTip,s.mouthRight)			
			drawLine(s.noseTip,s.upperLipTop)
			drawLine(s.noseRootLeft,s.noseRootRight)			
			drawLine(s.noseRightAlarOutTip,s.noseRightAlarTop)
			drawLine(s.noseLeftAlarOutTip,s.noseLeftAlarTop)
			drawLine(s.noseLeftAlarOutTip,s.mouthLeft)
			drawLine(s.noseRightAlarOutTip,s.mouthRight)
			drawLine(s.noseRootLeft,s.noseLeftAlarTop)
			drawLine(s.noseRootRight,s.noseRightAlarTop)

			//Lips
			drawLine(s.upperLipTop,s.noseLeftAlarOutTip)
			drawLine(s.upperLipTop,s.noseRightAlarOutTip)
			drawLine(s.upperLipTop,s.mouthRight)
			drawLine(s.upperLipTop,s.mouthLeft)
			drawLine(s.upperLipTop,s.upperLipBottom)
			drawLine(s.upperLipBottom,s.upperLipTop)				
			drawLine(s.upperLipBottom,s.mouthRight)			
			drawLine(s.upperLipBottom,s.mouthLeft)
			drawLine(s.underLipBottom,s.mouthRight)
			drawLine(s.underLipBottom,s.mouthLeft)
			drawLine(s.underLipTop,s.mouthRight)			
			drawLine(s.underLipTop,s.mouthLeft)
			drawLine(s.underLipTop,s.upperLipBottom)
			drawLine(s.underLipTop,s.underLipBottom)	

			//Left Eye
			drawLine(s.eyebrowLeftInner,s.eyebrowLeftOuter)
			drawLine(s.eyebrowRightOuter,s.eyebrowRightInner)
			drawLine(s.eyebrowLeftInner,s.eyeLeftTop)
			drawLine(s.eyebrowLeftInner,s.eyeLeftInner)
			drawLine(s.eyebrowLeftOuter,s.eyeLeftTop)
			drawLine(s.eyebrowLeftOuter,s.eyeLeftOuter)
			drawLine(s.pupilLeft,s.eyeLeftInner)
			drawLine(s.pupilLeft,s.eyeLeftTop)
			drawLine(s.pupilLeft,s.eyeLeftOuter)
			drawLine(s.pupilLeft,s.eyeLeftBottom)
			drawLine(s.eyeLeftTop,s.eyeLeftOuter)			
			drawLine(s.eyeLeftTop,s.eyeLeftInner)			
			drawLine(s.eyeLeftBottom,s.eyeLeftInner)			
			drawLine(s.eyeLeftBottom,s.eyeLeftOuter)

			//Right Eye
			drawLine(s.eyebrowRightInner,s.eyebrowRightOuter)
			drawLine(s.eyebrowRightOuter,s.eyebrowRightInner)
			drawLine(s.eyebrowRightInner,s.eyeRightTop)
			drawLine(s.eyebrowRightInner,s.eyeRightInner)
			drawLine(s.eyebrowRightOuter,s.eyeRightTop)
			drawLine(s.eyebrowRightOuter,s.eyeRightOuter)
			drawLine(s.pupilRight,s.eyeRightInner)
			drawLine(s.pupilRight,s.eyeRightTop)
			drawLine(s.pupilRight,s.eyeRightOuter)
			drawLine(s.pupilRight,s.eyeRightBottom)
			drawLine(s.eyeRightTop,s.eyeRightOuter)			
			drawLine(s.eyeRightTop,s.eyeRightInner)			
			drawLine(s.eyeRightBottom,s.eyeRightInner)			
			drawLine(s.eyeRightBottom,s.eyeRightOuter)		
			
			//Eye to Nose
			drawLine(s.eyebrowRightInner,s.eyebrowLeftInner)
			drawLine(s.eyebrowRightInner,s.noseRootRight)
			drawLine(s.eyebrowLeftInner,s.noseRootLeft)
			drawLine(s.eyeRightInner,s.noseRootRight)
			drawLine(s.eyeLeftInner,s.noseRootLeft)			
			drawLine(s.eyeRightInner,s.noseRightAlarTop)
			drawLine(s.eyeLeftInner,s.noseLeftAlarTop)		
			drawLine(s.eyeRightInner,s.noseRightAlarOutTip)
			drawLine(s.eyeLeftInner,s.noseLeftAlarOutTip)	
			drawLine(s.eyeRightBottom,s.mouthRight)
			drawLine(s.eyeRightBottom,s.noseRightAlarOutTip)
			drawLine(s.eyeRightBottom,s.noseRightAlarTop)
			drawLine(s.eyeLeftBottom,s.mouthLeft)
			drawLine(s.eyeLeftBottom,s.noseLeftAlarOutTip)
			drawLine(s.eyeLeftBottom,s.noseLeftAlarTop)
			drawLine(s.eyeRightOuter,s.mouthRight)
			drawLine(s.eyeLeftOuter,s.mouthLeft)

			drawLine(s.eyebrowLeftOuter,s.mouthLeft)
			drawLine(s.eyebrowRightOuter,s.mouthRight)	
            
            //handle End
            setTimeout(function(){
            if(faceSuccess==true){
                //Change BG color
                $("#face-res-cont").css("background-color","green")
                $("#face-pay-noti").html(" Success")
                alert(identityMatch)
                //alert("Hello KK!")
                $("#gray-out").fadeIn(500)
                $("#voice-res-cont").css("background-color","#3498db")
                $("#voice-pay-noti").html(" Scanning Voice...")  
                setTimeout(function(){audioWave()},500)
                    
                $("#voice-res-cont").click(function() {
                    $("#voice-res-cont").css("background-color","green")
                    $("#voice-pay-noti").html(" Success")  
                    setTimeout(function(){
                        triggerPayment()
                         angular.element(document.getElementById('AppControl')).scope().acceptPayment(); 

                    },1000)
                });   
                                        
            }else{
                $("#face-res-cont").css("background-color","red")
                $("#face-pay-noti").html(" Failed")
                alert(identityMatch)
            }            
            
            
            //Start Voice recognition here

            },time+1000)
            
			}


/*			
function CreateUserGroup(){

   var params = {
            // Request parameters
        };
      var body ='{"name":"Hack Group"}';
	  
        $.ajax({
            url: "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/hackgroup" + $.param(params),
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key",subscriptionKey);
            },
            type: "PUT",
            // Request body
            data: body,
        })
        .done(function(data) {
            alert("success");
        })
        .fail(function(data) {
            alert(data);
			console.log(data)
        });
}*/