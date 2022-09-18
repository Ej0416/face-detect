const video = document.getElementById("video");

let emotionResult = '';

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    faceapi.nets.faceExpressionNet.loadFromUri("/models"),
]).then(startVideo);

function startVideo() {
    navigator.getUserMedia(
        {
            video: {},
        },
        (stream) => (video.srcObject = stream),
        (err) => console.error(err)
    )
}

video.addEventListener("play", () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas)
    const displaySize = {
        width: video.width,
        height: video.height,
    }

    faceapi.matchDimensions(canvas,displaySize)

    setInterval(async () => {
        const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions();
        // console.log(detections);     
        const resizeDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d').clearRect(0,0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizeDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizeDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizeDetections)
        resizeDetections.forEach(result => {
            const {expressions} = result
            var emotions = expressions;

            // console.log(emotions);
            // console.log(`Happy: ${emotions.happy}`);
            // console.log(`Angry: ${emotions.angry}`);   
            // console.log(`------------------break-------------------`)     

            if(emotions.neutral >= 0.75){
                emotionResult = 'neutral';
            }

            if(emotions.happy >= 0.75){
                emotionResult = 'happy';
            }

            if(emotions.sad >= 0.75){
                emotionResult = 'sad';
            }

            if(emotions.surprised >= 0.75){
                emotionResult = 'surprised';
            }

            if(emotions.angry >= 0.75){
            }

            if(emotions.fearful >= 0.75){
                emotionResult = 'fearful';
            }

            if(emotions.disgusted >= 0.75){
                emotionResult = 'disgusted';
            }

            if(emotions.angry >= 0.75){
                emotionResult = 'angry';
            }

            console.log(emotionResult);
        })
    }, 1000)
})


