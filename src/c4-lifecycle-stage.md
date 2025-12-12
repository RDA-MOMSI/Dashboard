---
theme: [cotton, wide]
title: Standards by Lifecycle Stage (C4)
toc: false
style: style.css
---

```js
import { Treemap } from "./dependencies/unipept-visualizations.min.js"
const data = FileAttachment("data/unipept-sunburst-chart.json").json();
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

---
To view detailed data management and stewardship activities listed under each data lifecycle stage (Planning, Collection, Processing, Analysis, Preservation, Sharing, and Reuse), click a node to zoom in, or the center of the sunburst to zoom out. This chart is a variation of C3, displaying three layers of the hierarchy at a time, enabling drill down views of specific activities of interest first followed by Omics class (where applicable), standard type, and standard acronym. Redundant standard records may appear under more than one class where relevant.

_See a lifecycle relationship that is missing or needs to be updated? Data lifecycle curations viewed in this chart can be updated directly from our [dashboard table](https://rda-momsi.github.io/Dashboard) by clicking on the unique identifier links provided at the end of each row. Updates will visually render once a request has been merged._

This variant of an icicle diagram shows only three layers of the hierarchy at a time. Click a node to zoom in, or the left column to zoom out.

```js
  // Specify the chart’s dimensions.
  const width = 928;
  const height = width / 1.5;
  const ranks = [  
  'no rank',
  'Sequencing (general)',
  'Array Sequencing',
  'High-Throughput Sequencing',
  'RNA Sequencing',
  'DNA Sequencing',
  'Other',
  'Mass Spectrometry (general)',
  'Ion Mobility Mass Spectrometry (IM-MS)',
  'Capillary Electrophoresis–Mass Spectrometry (CE-MS)',
  'Nuclear Magnetic Resonance (NMR)',
  'Mass Spectrometry Imaging (MSI)',
  'Time-of-Flight Mass Spectrometer (TOF)',
  ' Secondary Ion Mass Spectrometry (SIMS)',
  'Genomics',
  'Proteomics',
  'Metabolomics',
  'Transcriptomics',
  'Multi-omics Applicable',
  'Epigenomics',
  'Terminology Artefact',
  'Model/Format',
  'Reporting Guideline',
  'Identifier Schema',
  'Multi-Standard Applicable',
  'Metaproteomics',
  'Lipidomics',
  'Metabolomics/Lipidomics']

  // Define the Sunburst
  let x = new Treemap(
      document.getElementById("chartView"),
      data,
      {
        getTooltip: (d) => {
          return `<div class="unipept-tooltip"><h6>${d.name}</h6></div>`;
        },
        width,
        height,
        levels: ranks.length,
        getLevel: (d) => ranks.indexOf(d.data.extra.rank)
      }
  )

```

<div id="chartView"></div>