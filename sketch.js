let capture;
let posenet;
let noseX,noseY;
let reyeX,reyeY;
let leyeX,leyeY;
let singlePose,skeleton;
let actor_img;
let specs,smoke;
let showSkeleton = true;
let showPoints = true;
let showFilter = true;



function toggleSkeleton(){
    showSkeleton = !showSkeleton;
}

function togglePoints(){
    showPoints = !showPoints;
}

function toggleFilter(){
    showFilter = !showFilter;
}

function setup() {
    let container = document.getElementById('canvas-container');

    let canvas = createCanvas(container.offsetWidth, container.offsetHeight);
    canvas.parent('canvas-container');

    capture = createCapture(VIDEO);
    capture.size(container.offsetWidth, container.offsetHeight); 
    capture.hide();

    posenet = ml5.poseNet(capture, modelLoaded);
    posenet.on('pose',receivedPoses);

    actor_img = loadImage('images/shahrukh.png');
    specs = loadImage('images/spects.png');
    smoke = loadImage('images/cigar.png');

}

function receivedPoses(poses){
    console.log(poses);

    if(poses.length > 0){
        singlePose = poses[0].pose;
        skeleton = poses[0].skeleton;
    }
}


function modelLoaded() {
    console.log('Model has loaded');
}

function draw() {
    background(0);
    image(capture, 0, 0, width, height);

    if(singlePose){

        if(showPoints){
            fill(255, 0, 0);
            noStroke();
            for(let i=0; i<singlePose.keypoints.length; i++){
                let x = singlePose.keypoints[i].position.x;
                let y = singlePose.keypoints[i].position.y;
                ellipse(x, y, 10);
            }
        }

        if(showSkeleton){
            stroke(0, 255, 255);
            strokeWeight(3);
            for(let j=0; j<skeleton.length; j++){
                let a = skeleton[j][0];
                let b = skeleton[j][1];
                line(a.position.x, a.position.y, b.position.x, b.position.y);
            }
        }

        let leftShoulder = singlePose.leftShoulder;
        let rightShoulder = singlePose.rightShoulder;
        let nose = singlePose.nose;

        let shoulderMidX = (leftShoulder.x + rightShoulder.x) / 2;
        let shoulderMidY = (leftShoulder.y + rightShoulder.y) / 2;

        let dx = abs(nose.x - shoulderMidX);
        let dy = abs(nose.y - shoulderMidY);

        let score = 100 - (dx * 0.5 + dy * 0.3);
        score = constrain(score, 0, 100);

        document.getElementById("score").innerText = Math.round(score);

        let statusText = "Good";
        if(score < 70) statusText = "Bad";
        if(score < 50) statusText = "Very Bad";

        let statusElement = document.getElementById("statusText");
        statusElement.innerText = statusText;

        if(score > 70){
            statusElement.style.color = "#22c55e";
        }
        else if(score > 50){
            statusElement.style.color = "#facc15";
        }
        else{
            statusElement.style.color = "#ef4444";
        }

        if(score < 60 && frameCount % 30 < 15){
            fill(255,0,0);
            textSize(30);
            textAlign(CENTER);
            text("FIX YOUR POSTURE!", width/2, 50);
        }

        if(showFilter){
            image(actor_img, nose.x-40, nose.y-50, 80, 80);
        }
    }
}