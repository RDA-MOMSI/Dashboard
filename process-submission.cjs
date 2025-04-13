const fs = require('fs')

// IMPORTS

const eventPayload = require(process.env.GITHUB_EVENT_PATH)
let submission = JSON.parse(fs.readFileSync('submission.json', 'utf-8'))
let data = JSON.parse(fs.readFileSync('./src/data/database.json', 'utf-8'))
const standard = String(fs.readFileSync('submitter.txt', 'utf-8')).trim().toLowerCase()
const title = eventPayload.issue.title.trim()
const contributor = eventPayload.issue.user.login
const issueNumber = eventPayload.issue.number

// CONSTANTS

const STANDARDS = ["Genomics", "Proteomics", "Metabolomics", "Universal"]
const INDICATORS = {
    "genomics": "MOMSI_G",
    "proteomics": "MOMSI_P",
    "metabolomics": "MOMSI_M",
    "universal": "MOMSI_U",
}
const REPLACEMAP = { 
	"standard-type": "Standard Type",
	"status": "Status",
	"country": "Country",
	"domain-class-subclass": "Domain Class/Subclass",
	"application-technology": "Application Technology",
	"standard-name": "Standard Name",
	"acronym-short-name": "Acronym/Short Name",
	"planning": "Planning",
	"collection": "Collection",
	"processing": "Processing",
	"analysis": "Analysis",
	"preservation": "Preservation",
	"sharing": "Sharing",
	"reuse": "Reuse",
	"meets-criteria": "Meets Criteria",
	"active-affiliations": "Active Affiliation(s)",
	"homepage": "Homepage",
	"reference-article-citation-doi": "Reference Article Citation (DOI)",
	"reference-source-code-doi": "Reference Source Code (DOI or URL)",
	"fairsharing-record-doi": "FAIRsharing Record (DOI or URL)",
	"contributor-name": "Contributor Name",
	"credit": "CRediT",
	"contributor-orcid-id": "Contributor ORCID ID"
}
const LEADINGZEROS = 5

// UPDATE DATABASE

function initialiseDataIndex(data) {
	// Check that database is properly indexed, and index if it isn't
	// Deprecated as not necessary here
	for (const term of STANDARDS) {
		if (data[term.toLowerCase()].length && !data[term.toLowerCase()][0].hasOwnProperty("Identifier")) {
			data[term.toLowerCase()] = data[term.toLowerCase()].map((item, index) => ({ ...item, identifier: `${getFormalIdentifier(index + 1, term)}`}))
		}
	}
	return data
}

function replaceKeyInObjectArray(data, replaceMap = REPLACEMAP) {
	// Remap the keys from the GitHub template to those of the database
	// https://stackoverflow.com/a/27806458
	return Object.keys(data).map((key) => ({ [replaceMap[key] || key] : data[key] })).reduce((data, b) => Object.assign({}, data, b))
}

function getFormalIdentifier(num, term = standard, length = LEADINGZEROS) {
	// Generate an appropriately-formatted identifier with leading zeros
	// ref: https://javascripts.com/pad-leading-zeros-in-javascript/
	num = num.toString()
	while(num.length < length) {
		num = '0' + num
	}
	return `${INDICATORS[term]}:${num}`
}

function giveCRediT(submission = submission, issueNumber=issueNumber, contributor=null) {
	// |  Issue   |    Date    |       Name       |      ORCID ID       |                  CRediT                   |  Standard ID  |   Github ID   |
	// | :------: | :--------: | :--------------: | :-----------------: | :---------------------------------------: | :-----------: | :-----------: |
	// https://stackoverflow.com/a/4929629
	const today = new Date();
	const dd = String(today.getDate()).padStart(2, '0');
	const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	const yyyy = today.getFullYear();
	const renew = yyyy + '-' + mm + '-' + dd;
	const CRediT = `| #${issueNumber} | ${renew}  | ${submission["Contributor Name"]} | \`${submission["Contributor ORCID ID"]}\` | ${submission["CRediT"]} | ${submission["Identifier"]} | [@${contributor}](https://github.com/${contributor}) |\n`;
	fs.appendFileSync('CONTRIBUTING.md', CRediT);
}

function submitData(title = title, submission = submission, data = data, term = standard, contributor = contributor, issueNumber = issueNumber) {
	// If the title refers to an existing Standard, then update that entirely
	// Else generate a new identifier and push that to the database
	submission["Contributor"] = contributor
	if (submission.hasOwnProperty("comments")) delete submission.comments
	console.log("TITLE:", title)
	if (title.startsWith(`[${INDICATORS[term]}:`)) {
		submission["Identifier"] = title.slice(1,14)
		giveCRediT(submission, issueNumber, contributor)
		// https://stackoverflow.com/a/39529049
		const indexOfTerm = data[term].findIndex(item => item.Identifier === submission.Identifier)
		if (indexOfTerm !== -1) {
			data[term][indexOfTerm] = submission
			return data
		}
	}
	// Default, create an identifier and append
	submission["Identifier"] = getFormalIdentifier(data[term].length)
	giveCRediT(submission, issueNumber, contributor)
	data[term].push(submission)
	// Update database
	fs.writeFileSync('./src/data/database.json', JSON.stringify(data, null, '  '));
}

// Formalise submission
submission = replaceKeyInObjectArray(submission, REPLACEMAP)
submitData(title, submission, data, standard, contributor, issueNumber)