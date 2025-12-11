---
theme: [cotton, wide]
title: Standards by Lifecycle Stage (C3)
toc: false
style: style.css
---

```js
import {Sunburst, StringUtils} from "./dependencies/unipept-visualizations.min.js"
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
To view detailed data management and stewardship activities listed under each data lifecycle stage (Planning, Collection, Processing, Analysis, Preservation, Sharing, and Reuse), click a node to zoom in, or the center of the sunburst to zoom out. This chart only displays two layers of the hierarchy at a time, enabling drill down views of specific activities of interest first followed by Omics class (where applicable), standard type, and standard acronym. Redundant standard records may appear under more than one class where relevant.

_See a lifecycle relationship that is missing or needs to be updated? Data lifecycle curations viewed in this chart can be updated directly from our [dashboard table](https://rda-momsi.github.io/Dashboard) by clicking on the unique identifier links provided at the end of each row. Updates will visually render once a request has been merged._

```js
  // Specify the chart’s dimensions.
  const width = 928;
  const height = width;
  const radius = width / 2;

  // Define the Sunburst
  let x = new Sunburst(
      document.getElementById("chartView"),
      data,
      {
          getTooltip: (d) => {
              let numberFormat = d3.format(",d");
              let style = `
              <style>
                .tip, .tip::before, .tip[label]::before {
                  all: unset;
                }
                .unipept-tooltip {
                    padding: 10px;
                    border-radius: 5px; 
                    background: rgba(0, 0, 0, 0.8); 
                    color: #fff;
                    font-family: Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif;
                }
                .unipept-tooltip div {
                    font-weight: bold;
                }
              </style>
              `
              return `${style}<div class="unipept-tooltip"><div>${d.name}</div>` + '<a>' + numberFormat(!d.count ? "0" : d.count) + (d.count && d.count === 1 ? " standard" : " standards") + " specific to this level or lower" + "</a></div>";
          },
          width,
          height,
          radius,
          levels: 3,
          fixedColors: true,
          fixedColorHash: (d) => StringUtils.stringHash(d.extra.rank)
      }
  )

```

<div id="chartView"></div>