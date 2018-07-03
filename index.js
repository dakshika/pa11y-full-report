'use strict';

const html = require('./pa11y-reporter-wso2');
const pa11y = require('pa11y');
const fs = require('fs');
const toml = require('toml-js');

//Read the config file
let parsedConfig = {};
//build the URL list
let htmlURLs = '';

fs.readFile('./config/conf.toml', function (err, data) {
    if(err) {
        return console.log(err);
    }
    parsedConfig = toml.parse(data);
    //call the report generator
    generateReport();
});


// Async function required for us to use await
async function generateReport() {

    //get the page Script
    let pageScriptContents = fs.readFileSync("page_script/index.json");
    let jsonContent = JSON.parse(pageScriptContents);
    //get config values
    let includeNotices = parsedConfig.includeNotices;
    let includeWarnings = parsedConfig.includeWarnings;
    let standard = parsedConfig.standard;

    for(const jsonURL  in jsonContent ){

        try {
           const result = await pa11y(jsonContent[jsonURL].pageURL, {
                "includeNotices": includeNotices,
                "includeWarnings": includeWarnings,
                "standard": standard,
                "screenCapture" : `${__dirname}` + "/output/captures/"+jsonURL+".png",
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

            result.imageURL = jsonURL + ".png";
            result.description = jsonContent[jsonURL].description;

            //get the page HTML content
            const htmlResults = await html.results(result);
            const fileName = jsonURL +"_" + result.documentTitle.replace(/ /g,"_") + ".html";
            htmlURLs += `<li>\n<a href='${fileName}'>${jsonContent[jsonURL].taskName}</a>\n</li>\n`;

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

    generateIndex();

}

async function generateIndex(){
    let indexTitle = {};
    indexTitle.htmlURLs = htmlURLs;
    indexTitle.standard = parsedConfig.standard;
    indexTitle.product = parsedConfig.product;
    indexTitle.version = parsedConfig.version;

    //get the index page HTML content
    const htmlResults = await html.index(indexTitle);

    //write the file
    fs.writeFile("./output/index.html" , htmlResults, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file index.html was saved!");
    });
}