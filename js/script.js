/**
* this script is for face detetion and screenshoot
* if system detect face front of camera
* then he take a screen shot of an active windows
*/
const video = document.getElementById('video');
const screenEl = document.createElement('video');
screenEl.id = "screen";
screenEl.autoplay = "autoplay";
const screen = screenEl;
const canvas_screen = document.getElementById('canvas');
const image_face = document.getElementById('face1');

var face_pose = document.getElementsByClassName("face");
var defaut_src = window.location.href + "default_user.png";
var no_face_src = window.location.href + "no_face.png";
// var defaut_src = "http://localhost/registration/default_user.png";
// var no_face_src = "http://localhost/registration/no_face.png";
var nbr_face_ok = 0;

var display_surface = "";
var nbr_face = 0;

var webcam_is = false;
var screen_is = false;

var face_data = null;
/**
 * form data
 * */
var lastName = document.getElementById("lastName");
var firstName = document.getElementById("firstName");
var gender = document.getElementById("gender");
var birthdayDate = document.getElementById("birthdayDate");

var schoolName = document.getElementById("schoolName");
var codeField = document.getElementById("codeField");
var codeClass = document.getElementById("codeClass");

var studentId = document.getElementById("studentId");
var phoneNumber = document.getElementById("phoneNumber");
var email = document.getElementById("email");

/**
 * option buttun
 * @capture @save @cancel
 * */
var captureBtn = document.getElementById("capture");
var saveBtn = document.getElementById("register");
var cancelBtn = document.getElementById("cancel");

const constraints = {
    video: true
};

/**
 * loading a model for face detection
 * We are using Tiny Face Detector
 */
async function loadModel() {
    Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/' + window.location.pathname.split( '/' )[1] + '/models')
        // faceapi.nets.tinyFaceDetector.loadFromUri('/registration/models')
    ]).then(startVideo)
}
/**
 * start video stream from web webcame
*/
function startVideo() {
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(constraints).
            then(handleSuccess).catch(handleError);
    }
}
/*
 * this function is to stop playing 
 * stream from webcom
 * */
function stopVideo() {
    var stream = video.srcObject;
    var tracks = stream.getTracks();

    for (var i = 0; i < tracks.length; i++) {
        var track = tracks[i];
        track.stop();
    }
    video.srcObject = null;
    webcam_is = false;
    this.innerHTML = "Share webcam";
}
/**
 * when use click on start capture buttuon 
 * or on video frame this function check
 * if the streaming is playing or not
 * and open it or stop it
 * */
function streaming() {
    if (!webcam_is) {

        loadModel();
        webcam_is = true;
    }
    else {
        var stream = video.srcObject;
        var tracks = stream.getTracks();

        for (var i = 0; i < tracks.length; i++) {
            var track = tracks[i];
            track.stop();
        }
        video.srcObject = null;
        webcam_is = false;
        this.innerHTML = "Start capture";
    }
}
function handleSuccess(stream) {
    video.srcObject = stream;
    btn_webcame.innerHTML = "Stop capture";
    webcam_is = true;
}
function handleError(error) {
    console.log("Please give access to your Webcam to enjoy this course !");
}

captureBtn.addEventListener("click", function (event) {
    event.preventDefault();
    /**
     * check if the webcam is open or not
     * and change the status of webcam_is
     */
    streaming();

    console.log("Webcam btn click");
});
video.addEventListener("mouseenter", () => {
    video.style.cursor = "pointer";
    video.title = "Click here to play webcam for face capture";
});

video.addEventListener("click", () => {
    streaming();
});
video.addEventListener('play', () => {
    const canvas_video = faceapi.createCanvasFromMedia(video);
    const displaySize = {
        width: video.width,
        height: video.height
    };
    faceapi.matchDimensions(canvas_video, displaySize);
    console.log(displaySize);

    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
        /**
         * count number of face detected in the stream
         */
        nbr_face = detections.length;
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas_video.width = video.videoWidth;
        canvas_video.height = video.videoHeight;


        if (nbr_face > 0) {

            for (var i = 0; i < nbr_face; i++) {

                var _x = resizedDetections[i]["_box"]["_x"];
                var _y = resizedDetections[i]["_box"]["_y"];
                var _width = resizedDetections[i]["_box"]["_width"];
                var _height = resizedDetections[i]["_box"]["_height"];

                var face_ = document.createElement("canvas");
                face_.width = _width;
                face_.height = _height;

            //    var keys = Object.keys(resizedDetections);
            //    console.log(keys);
            //    console.log(resizedDetections[i]["_box"]);
            //    console.log(_x + " " + _y + " " + _width + " " + _height);

                var ctx = canvas_video.getContext('2d');
                ctx.drawImage(video, 0, 0);

                var imageData = ctx.getImageData(_x, _y, _width, _height);
                //ctx.putImageData(imageData, 10, 10);
                ctx.putImageData(imageData, 0, 0);
                var ctxx = face_.getContext("2d");
                ctxx.putImageData(imageData, 0, 0);
                for (var i = 0; i < face_pose.length; i++) {
                    if (face_pose[i].src === defaut_src || face_pose[i].src === no_face_src) {

                        face_pose[i].src = face_.toDataURL("image/jpeg");
                        nbr_face_ok += 1;
                        break;
                    }
                }
                if (nbr_face_ok === 15) {
                    if (confirm("All face pose captured successful \n Do you want stop play video ?")) {
                        stopVideo();
                    }
                    else {
                        break;
                    }
                }
            }
        }
    }, 1000);
});
/**
 * this function is to reset a pose face when the first
 * is not done well
 * @param {any} id
 */
function resetFace(id) {
    var face = document.getElementById(id);

    if (face.src != defaut_src) {
        if (confirm("Do you want to delete and recapture again")) {
            face.src = defaut_src;
            nbr_face_ok--;
            streaming();
        }
        else {
            alert("Please click on fach wich you want to delete");
        }
    }
    else {
        console.log(face.id);
    }
}
function requestXHR(student_id, room_id, first_name, middle_name, last_name, birth_day, sex, address, mobile, email, image_path, image_face, description) {
    const toSend = {
        student_id: student_id,
        room_id: room_id,
        first_name: first_name,
        middle_name: middle_name,
        last_name: last_name,
        birth_day: birth_day,
        sex: sex,
        address: address,
        mobile: mobile,
        email: email,
        image_path: image_path,
        description: description
    };
    
    const jsonString = JSON.stringify(toSend);
    // console.log(jsonString);
    
    var xhr = new XMLHttpRequest();

    if(location.protocol=='http:'){
        var addr1 = "http://27.71.228.53:9002/SmartClass/student/add";
        var addr2 = "http://27.71.228.53:9002/SmartClass/student/update";
    }
    else if(location.protocol=='https:'){
        var addr1 = "https://27.71.228.53:9004/SmartClass/student/add";
        var addr2 = "https://27.71.228.53:9004/SmartClass/student/update";
    }
    
    xhr.open("POST", addr1);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(jsonString);
    xhr.addEventListener('readystatechange', function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            console.log(xhr.status)
            response = JSON.parse(xhr.responseText);
            console.log(response);
            const toSend2 = {
                seq: response.data.seq,
                student_id: student_id,
                room_id: room_id,
                first_name: first_name,
                middle_name: middle_name,
                last_name: last_name,
                birth_day: birth_day,
                sex: sex,
                address: address,
                mobile: mobile,
                email: email,
                image_path: image_path,
                image_face: image_face,
                description: description
            };
            const jsonString2 = JSON.stringify(toSend2);
            // console.log(jsonString2);

            var xhr2 = new XMLHttpRequest();
            xhr2.open("POST", addr2);
            xhr2.setRequestHeader("Content-Type", "application/json");
            xhr2.send(jsonString2);
            xhr2.addEventListener('readystatechange', function () {
                if (xhr2.readyState === XMLHttpRequest.DONE) {
                    console.log(xhr2.status)
                    response = JSON.parse(xhr2.responseText);
                    console.log(response);
                }
            });
        }
    });
}
/**
 * 
 */
function uploadData(face) {
    var form = new FormData();
    form.append("face", face);
   
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "ImageController.php");
    // xhr.setRequestHeader("Content-Type", "multipart/form-data");

    xhr.send(form);
    xhr.addEventListener("readystatechange", function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            console.log(xhr.responseText);
            console.log("status request : " + xhr.status);
            alert("Student registration successefull !");

            for (i = 0; i < face_pose.length; i++) {
                face_pose[i].src = defaut_src;
            }
            nbr_face_ok = 0;
            face_data = null;
            lastName.value = "";
            firstName.value = "";
            gender.selectedIndex = 0;
            birthdayDate.value = "";

            schoolName.value = "";
            codeField = "";
            codeClass = "";

            studentId.value = "";
            phoneNumber.value = "";
            email.value = "";
        }
    });
}
cancelBtn.addEventListener("click", function () {

    for (i = 0; i < face_pose.length; i++) {
        face_pose[i].src = defaut_src;
    }
    nbr_face_ok = 0;
    face_data = null;
    lastName.value = "";
    firstName.value = "";
    gender.selectedIndex = 0;
    birthdayDate.value = "";

    schoolName.value = "";
    codeField = "";
    codeClass = "";

    studentId.value = "";
    phoneNumber.value = "";
    email.value = "";
});

saveBtn.addEventListener("click", function () {
    var error = 0;
    if (lastName.value === "" 
        || firstName.value === ""
        || gender.value === ""
        || birthdayDate === ""
        || schoolName.value === ""
        || codeField.value === ""
        || codeClass.value === ""
        || studentId.value === ""
        || phoneNumber.value === ""
        || email.value === ""
        || nbr_face_ok < 15) {
        
        if (lastName.value === "") {
            alert("Please check student last name");
        }
        if (firstName.value === "") {
            alert("Please check student first name");
        }
        if (gender.value === "") {
            alert("Please check student gender");
        }
        if (birthdayDate.value === "") {
            alert("Please check student date of birthday");
        }
        if (schoolName.value === "") {
            alert("Please check student school name");
        }
        if (codeField.value === "") {
            alert("Please check student code field");
        }
        if (codeClass.value === "") {
            alert("Please check student code class");
        }
        if (studentId.value === "") {
            alert("Please check student ID");
        }
        if (phoneNumber.value === "") {
            alert("Please check student phone number");
        }
        if (email.value === "") {
            alert("Please check student email");
        }
        if (nbr_face_ok < 15) {
            alert("Please run webcom to complete all face pose as required");
        }
    } 
    else {
        var image_face = '';
        for (i = 0; i < face_pose.length; i++) {
            face_data = face_pose[i].src;
            image_face = image_face + '----'+ i +'.jpg----' + face_pose[i].src;
            // uploadData(face_data);
        }
        // console.log('image_face', image_face)
        face_data = face_pose[0].src;
        requestXHR(studentId.value, codeClass.value, firstName.value, "", lastName.value, birthdayDate.value, gender.value, "", 
            phoneNumber.value, email.value, face_data, image_face, "student registration");

    }
});