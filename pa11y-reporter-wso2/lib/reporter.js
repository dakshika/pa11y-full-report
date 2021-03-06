'use strict';

const fs = require('fs');
const hogan = require('hogan.js');
const path = require('path');
const {promisify} = require('util');
const readFile = promisify(fs.readFile);

const report = module.exports = {};

// Pa11y version support
report.supports = '^5.0.0 || ^5.0.0-alpha || ^5.0.0-beta';

// Compile template and output formatted results
report.results = async results => {
	const templateString = await readFile(path.resolve(`${__dirname}/report.html`), 'utf-8');
	const template = hogan.compile(templateString);

	return template.render({

		// The current date
		date: new Date(),
		// Result information
		documentTitle: results.documentTitle,
		issues: results.issues.map(issue => {
			issue.typeLabel = upperCaseFirst(issue.type);
    		issue.panelColor = getPanelColor(issue.type);
			return issue;
		}),

		pageUrl: results.pageUrl,
		imageURL: results.imageURL,
		description: results.description,
		//Issue counts
		errorCount: results.issues.filter(issue => issue.type === 'error').length,
		warningCount: results.issues.filter(issue => issue.type === 'warning').length,
		noticeCount: results.issues.filter(issue => issue.type === 'notice').length

	});
};

//generate index file
report.index = async results =>{
    const templateString = await readFile(path.resolve(`${__dirname}/index.html`), 'utf-8');
    const template = hogan.compile(templateString);

    return template.render({
        htmlURLs: results.htmlURLs,
        standard: results.standard,
        product: results.product,
		version: results.version
    });
};

// Output error messages
report.error = message => {
	return message;
};

// Utility function to uppercase the first character of a string
function upperCaseFirst(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function getPanelColor(type){
	let panelColor = 'primary';
    if (type == 'warning') {
        panelColor = 'warning';
    } else if (type == 'error') {
        panelColor = 'danger';
    } else if (type == 'notice') {
        panelColor = 'primary';
    }
    return panelColor;
}

