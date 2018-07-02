'use strict';

const html = require('./pa11y-reporter-wso2');
const pa11y = require('pa11y');
const fs = require('fs');

runExample();

// Async function required for us to use await
async function runExample() {
    let pageScriptContents = fs.readFileSync("page_script/index.json");
    let jsonContent = JSON.parse(pageScriptContents);
    let htmlURLs = '';

    for(var jsonURL in jsonContent ){

        try {
           const result = await pa11y(jsonContent[jsonURL].pageURL, {
                "includeNotices": true,
                "includeWarnings": true,
                "standard": "Section508",
                "screenCapture" : `${__dirname}` + "/output/captures/"+jsonContent[jsonURL].taskNo+".png",
                "chromeLaunchConfig": {
                    "ignoreHTTPSErrors": true,
                    "headless": false,
                    "args": [
                        "--ignore-certificate-errors",
                        "--ignore-certificate-errors-spki-list",
                        "--disable-setuid-sandbox",
                        "--no-sandbox"
                    ]
                },
                "actions": jsonContent[jsonURL].actions
            });

            result.imageURL = jsonContent[jsonURL].taskNo + ".png";
            result.description = jsonContent[jsonURL].description;

            //get the page HTML content
            const htmlResults = await html.results(result);
            const fileName = jsonContent[jsonURL].taskNo +"_" + result.documentTitle.replace(/ /g,"_") + ".html";
            htmlURLs += `<li>\n<a href='${fileName}'>${result.documentTitle}</a>\n</li>\n`;
           // htmlURLs += `<a href='${fileName}'>${fileName}</a><br />\n`;

            //write the file
            fs.writeFile("./output/" + fileName , htmlResults, function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log("The file "+fileName+" was saved!");
            });

        } catch (error) {

            // Output an error if it occurred
            console.error(error.message);

        }
    }

    //get the index page HTML content
    const htmlResults = await html.index(htmlURLs);

    //write the file
    fs.writeFile("./output/index.html" , htmlResults, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file index.html was saved!");
    });

}