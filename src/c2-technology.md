---
theme: [cotton, wide]
title: Standards by Technology (C2)
toc: false
style: style.css
---

```js
import { Treeview } from "./dependencies/unipept-visualizations.min.js"
const data = FileAttachment("data/unipept-treeview-chart.json").json();
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
To view individual standards by application technology type (sequencing or mass spectrometry data acquisition methods), click a node to expand or collapse the tree. This chart enables drill down views of standard records starting with the application technology of interest first followed by Omics class, and/or subclass (where applicable), and standard type. Redundant standard records may appear under more than one class or subclass where relevant.

_See an instrument relationship that is missing or needs to be updated? Instrument focused standard relationships viewed in this chart can be updated directly from our [dashboard table](https://rda-momsi.github.io/Dashboard) by clicking on the unique identifier links provided at the end of each row. Updates will visually render once a request has been merged._

```js
  // Specify the chart’s dimensions.
  const width = 928;
  const height = width / 1.5;

  // Define the Sunburst
  let x = new Treeview(
      document.getElementById("chartView"),
      data,
      {
          width,
          height,
          colorProviderLevels: 4
      }
  )

```

<div id="chartView"></div>