const fs = require('fs');
require('log-timestamp');

const fetch = require("node-fetch");
const FormData = require("form-data");
const {
    exec
} = require('child_process');

const {
    Datastore
} = require('@google-cloud/datastore');


let options = {
    stdio: 'pipe'
};


var index = 1;


const buttonPressesLogFile = './flag.txt';

console.log(`Watching for file changes on ${buttonPressesLogFile}`);

fs.watchFile(buttonPressesLogFile, (curr, prev) => {

    // console.log(curr, prev);

    index = 1;


    console.log(`${buttonPressesLogFile} file Changed`);


    console.log("Converting .h264 to .mp4...");
    var result = require('child_process').execSync('ffmpeg -y -framerate 24 -i test.h264 -c copy ./html/output.mp4', options);

    console.log("Converting video to frames...");
    var result1 = require('child_process').execSync('ffmpeg -y -i ./html/output.mp4 -r 0.1 ./html/frames/output_%04d.png', options);

    analyzeImages(index);

});








var analyzeImages = function (index) {

    console.log("Analyze Images Function");
    console.log(index);

    if (index < 4) {


        let image_path = "./html/frames/output_000" + index + ".png";
        console.log(image_path);
        let body = new FormData();
        body.append("upload", fs.createReadStream(image_path));
        // Or body.append('upload', base64Image);

        body.append("regions", "us-ca"); // Change to your country

        fetch("https://api.platerecognizer.com/v1/plate-reader/", {
                method: "POST",
                headers: {
                    Authorization: "Token 01b00264cab2f3f6b07a0f31681579cb76",
                },
                body: body,
            })
            .then((res) => res.json())
            .then(function (json) {


                if (!!json.results && !!json.results[0] && !!json.results[0].plate) {
                    console.log(json);
                    console.log("\n\r\n\r\n");
                    console.log(json.results[0].plate)


                    saveData(json.results[0].plate, index);

                } else {


                    console.log(json, index);
                    (async function () {

                        await new Promise(resolve => setTimeout(resolve, 1750));
                        // analyzeImages(index);
                        index = index + 1;
                        analyzeImages(index);

                    }())


                }


            })
            .catch((err) => {
                console.log(err);
            });


    } else {
        index = 1;

    }


}





var saveData = function (data, index) {

    console.log("Save data");
    console.log(index);

    // Imports the Google Cloud client library


    // Creates a client
    const datastore = new Datastore();

    async function quickstart() {
        // The kind for the new entity
        const kind = 'License_Plates';

        // The name/ID for the new entity
        const name = data;

        // The Cloud Datastore key for the new entity
        const taskKey = datastore.key([kind, name]);

        var currentdate = new Date();
        var datetime = currentdate.getDate() + "/" +
            (currentdate.getMonth() + 1) + "/" +
            currentdate.getFullYear() + " @ " +
            currentdate.getHours() + ":" +
            currentdate.getMinutes() + ":" +
            currentdate.getSeconds();

        // Prepares the new entity
        const task = {
            key: taskKey,
            data: {
                location: 'Miami',
                plate: data,
                Date: datetime
            },
        };

        // Saves the entity
        await datastore.save(task);
        console.log(`Saved ${task.key.name}`);



        index = index + 1;
        analyzeImages(index);





    }
    quickstart();



}
