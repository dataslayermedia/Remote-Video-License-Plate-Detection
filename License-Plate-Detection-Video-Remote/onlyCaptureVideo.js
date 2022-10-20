const fetch = require("node-fetch");
const FormData = require("form-data");
const fs = require("fs");
const {
    exec
} = require('child_process');


var takeVideo = function () {

    console.log("take video function");

    var start = Date.now();
    var child = exec('libcamera-vid -t 10000 -o test.h264 --width 1920 --height 1080');
    // var child = exec('ls');

    child.stdout.on('data', function (data) {
        console.log('child process exited with ' +
            `code ${data}`);
    });

    child.on('exit', function (code, signal) {

        console.log("Image Capture");
        console.log(Date.now() - start);


        console.log("Write Flag");
        var result = require('child_process').execSync('touch ./flag.txt');

        (async function () {

            await new Promise(resolve => setTimeout(resolve, 8750));
            takeVideo();
        }())



        


    });
}


takeVideo();