---
toc: false
theme: [cotton]
style: style.css
---

```js
const bardata = FileAttachment("data/standards-bar-chart.json").json();
```

<header class="header">
  <div class="logos">
	<div class="logo-image">
		<img height="60px" width="60px" alt="MOMSI WG Logo" src="/images/MOMSI-WG-LOGO.svg">
	</div>
	<div class="logo-text">
		<h1>MOMSI WG Landscape Review Dashboard</h1>
	</div>
  </div>
</header>

**New Updates Coming Soon!!**

🎉 Welcome to the [Multi-Omics Metadata Standards Integration (MOMSI) Working Group](https://www.rd-alliance.org/groups/multi-omics-metadata-standards-integration-momsi-wg) community-driven Multi-Omics standard landscape review curation workflow and interactive web-based dashboard tool! Explore >250 standards from our Omics Landscape Review repository containing various Multi-omics domain (genomics, proteomics, metabolomics, lipidomics, etc.) and universal (generalist and subject agnostic) standards curated by the MOMSI WG.

**Reference Citations:**

1. Anderson, L. N., Van Den Bossche, T., & Multi-Omics Metadata Standards Integration (MOMSI) Working Group. (2025). MOMSI WG Multi-Omics Standard Landscape Review Curation Workflow & Interactive Web-based Dashboard Tool. Zenodo. DOI: [10.15497/RDA00133](https://doi.org/10.15497/RDA00133)

2. FAIRsharing.org: MOMSI; Multi-Omics Metadata Standards Integration Working Group Landscape Review Collection. (2025). FAIRsharing.org. DOI: [10.25504/FAIRsharing.2fa4fb](https://doi.org/10.25504/FAIRsharing.2fa4fb) [see record page for an up-to-date timestamp for all edits and reviews]

*Note: This dashboard supports exploration and discovery of Multi-omics standards listed within our repository using front-end visualizations to support live curation status updates. This dashboard is not intended for advanced search and filter navigation nor it is our final recommendation resource. Learn more about out how standards listed at our repository are being implemented under [Sustainability](https://github.com/RDA-MOMSI/Dashboard#%EF%B8%8F-sustainability).*

> <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg> Not sure where to begin?
> - Toggle the Omics summary tables below to scroll, sort, and search across standards. Create an issue request directly from dashboard table by clicking on the unique identifier links listed at the end of each row. See [CONTRIBUTING](./contributing) for additional guidance.
> - Browse [User Journeys](./user-journeys) for themed use-case exploration examples of Omics standard types, research data lifecycle curations, and core Omics subject area classes/subclasses.
> - Visit the [Glossary](./glossary) page to browse curated concepts and terms used to organize and filter the tags listed at the dashboard and at the [MOMSI FAIRsharing Collection](https://doi.org/10.25504/FAIRsharing.2fa4fb).


---

<div class="card">${
    resize((width) => Plot.plot({
      title: "MOMSI WG Landscape Review Live Summary",
      width,
      x: {label: null, axis: null},
	  fx: {label: null},
      y: {tickFormat: "s", grid: true, label: "Count"},
	  color: {legend: true},
      marks: [
		Plot.barY(bardata, {
		  x: "standard",
		  y: "count",
		  fill: "standard",
		  fx: "type",
		  sort: {x: null, color: null, fx: {value: "-y", reduce: "sum"}}
		}),
		Plot.ruleY([0])
	  ]
    }))
  }</div>

---

```js
import {Mutable} from "observablehq:stdlib";
const data = await FileAttachment("data/database.json").json()
const dataColumns = {
	"genomics": ["Standard Type", "Domain Class/Subclass", "Acronym/Short Name", "Standard Name", "Status", "Country", "Application Technology", "Planning", "Collection", "Processing", "Analysis", "Preservation", "Sharing", "Reuse", "Active Affiliation(s)", "FAIRsharing Record (DOI or URL)", "Identifier"],
	"proteomics": ["Standard Type", "Domain Class/Subclass", "Acronym/Short Name", "Standard Name", "Status", "Country", "Application Technology", "Planning", "Collection", "Processing", "Analysis", "Preservation", "Sharing", "Reuse", "Active Affiliation(s)", "FAIRsharing Record (DOI or URL)", "Identifier"],
	"metabolomics": ["Standard Type", "Domain Class/Subclass", "Acronym/Short Name", "Standard Name", "Status", "Country", "Application Technology", "Planning", "Collection", "Processing", "Analysis", "Preservation", "Sharing", "Reuse", "Active Affiliation(s)", "FAIRsharing Record (DOI or URL)", "Identifier"],
	"universal": ["Standard Type", "Domain Class/Subclass", "Acronym/Short Name", "Standard Name", "Status", "Country", "Application Technology", "Planning", "Collection", "Processing", "Analysis", "Preservation", "Sharing", "Reuse", "Active Affiliation(s)", "FAIRsharing Record (DOI or URL)", "Identifier"]
}
let standardChoice = Mutable("genomics")
let columnChoice = Mutable(dataColumns["genomics"])
let dataChoice = Mutable(data["genomics"])
const dataFormatTemplate = {
	"genomics": "01-genomics-standards.yml",
	"proteomics": "02-proteomics-standards.yml",
	"metabolomics": "03-metabolomics-standards.yml",
	"universal": "04-universal-standards.yml"
}
const dataFormat = {
	"Homepage": url => htl.html`<a href=${url} target=_blank>🔗</a>`,
	"Reference Article Citation (DOI)": url => htl.html`<a href=${url} target=_blank>🔗</a>`,
	"Reference Source Code (DOI or URL)": url => htl.html`<a href=${url} target=_blank>🔗</a>`,
	"FAIRsharing Record (DOI or URL)": url => htl.html`<a href=${url} target=_blank>🔗</a>`,
	"Reference Source Code (URL)": url => htl.html`<a href=${url} target=_blank>🔗</a>`,
	"Identifier": id => htl.html`<a href=https://github.com/RDA-MOMSI/Dashboard/issues/new?template=${dataFormatTemplate[standardChoice.value]}&title=[${id}]+Update+submission target=_blank>🖋️ Update</a>`
}

function changeStandardChoice(value) {
	standardChoice.value = value
	columnChoice.value = dataColumns[value]
	return value
}

const choice = view(Inputs.button([
  ["Genomics", value => value = changeStandardChoice("genomics")],
  ["Proteomics", value => value = changeStandardChoice( "proteomics")],
  ["Metabolomics", value => value = changeStandardChoice("metabolomics")],
  ["Universal", value => value = changeStandardChoice("universal")],
], {value: "genomics"}));
const searchGInput = Inputs.search(data["genomics"], {placeholder: "Search genomics standards ..."});
const searchPInput = Inputs.search(data["proteomics"], {placeholder: "Search proteomics standards ..."});
const searchMInput = Inputs.search(data["metabolomics"], {placeholder: "Search metabolomics standards ..."});
const searchUInput = Inputs.search(data["universal"], {placeholder: "Search universal standards ..."});
const searchG = Generators.input(searchGInput);
const searchP = Generators.input(searchPInput);
const searchM = Generators.input(searchMInput);
const searchU = Generators.input(searchUInput);
```

<div class="card" style="display: flex; flex-direction: column; gap: 0.5rem;">
  ${ standardChoice === "genomics" ? searchGInput 
     : standardChoice === "proteomics" ? searchPInput 
	 : standardChoice === "metabolomics" ? searchMInput 
	 : standardChoice === "universal" ? searchUInput : "" }
  ${ standardChoice === "genomics" ? Inputs.table(searchG, {columns: columnChoice, format: dataFormat})
     : standardChoice === "proteomics" ? Inputs.table(searchP, {columns: columnChoice, format: dataFormat})
	 : standardChoice === "metabolomics" ? Inputs.table(searchM, {columns: columnChoice, format: dataFormat})
	 : standardChoice === "universal" ? Inputs.table(searchU, {columns: columnChoice, format: dataFormat})
	 : "" }
</div>

