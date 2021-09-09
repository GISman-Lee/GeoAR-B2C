var resizeCanvas = function(origCanvas, width, height) {
    let resizedCanvas = document.createElement("canvas");
    let resizedContext = resizedCanvas.getContext("2d");

    resizedCanvas.height = height;
    resizedCanvas.width = width;

    resizedContext.drawImage(origCanvas, 0, 0, width, height);
    return resizedCanvas.toDataURL();
}


/** to indicate no. of image */
var count = 0

document.getElementById("snap-img").addEventListener("click", function () {
    count += 1;

   var iframe = document.getElementById('myFrame1');
   var iDocument = iframe.contentWindow.document;
   var element = iframe.contentWindow.document.querySelector('a-scene');
   let aScene = element.components.screenshot.getCanvas("perspective");

    //as the AR is inside the iframe, so would need to input the iframe.contentWindow.document
    let frame = captureVideoFrame("video", "png", iDocument); 
    aScene = resizeCanvas(aScene, frame.width, frame.height);
    frame = frame.dataUri;
    mergeImages([frame, aScene]).then(b64 => {
        let link = document.getElementById("download-link", "png");
        link.setAttribute("download", "myPhoto"+count.toString()+".png");
        link.setAttribute("href", b64);
        link.click();
    });
});

/* remember that width, height use video default */
var captureVideoFrame = function(video, format, iDoc, width, height) { 
    if (typeof video === 'string') {
        video = iDoc.querySelector(video);                   
    }

    format = format || 'jpeg';

    if (!video || (format !== 'png' && format !== 'jpeg')) {
        return false;
    }

    var canvas = iDoc.createElement("CANVAS");                   

    canvas.width = width || video.videoWidth;
    canvas.height = height || video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    var dataUri = canvas.toDataURL('image/' + format);
    var data = dataUri.split(',')[1];
    var mimeType = dataUri.split(';')[0].slice(5)

    var bytes = window.atob(data);
    var buf = new ArrayBuffer(bytes.length);
    var arr = new Uint8Array(buf);

    for (var i = 0; i < bytes.length; i++) {
        arr[i] = bytes.charCodeAt(i);
    }

    var blob = new Blob([arr], { type: mimeType });
    return { blob: blob, dataUri: dataUri, format: format, width: canvas.width, height: canvas.height };
};
