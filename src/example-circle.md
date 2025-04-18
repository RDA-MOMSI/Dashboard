---
theme: [cotton, wide]
title: Example circle packing
toc: false
style: style.css
---

```js
const data = FileAttachment("data/circle-packing-chart.json").json();
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

To view grouped Omics subject area standards by Omics domain, click to zoom in or out. This chart enables drill down views of standard record types starting with the Omics domain subject area class first followed by standard type. Omics subclass standard records are represented under each main Omics class where relevant.

_See an Omics subject area standard relationship that is missing or needs to be updated? Domain focused standard relationships viewed in this chart can be updated directly from our [dashboard table](https://rda-momsi.github.io/Dashboard) by clicking on the unique identifier links provided at the end of each row. Updates will visually render once a request has been merged._

<!-- Cards with big numbers -->

<div class="grid grid-cols-4">
  <div class="card">
    <h2>Genomics</h2>
    <span class="big">${data.children.find((s) => s.name === "Genomics").count}</span>
  </div>
  <div class="card">
    <h2>Proteomics</h2>
    <span class="big">${data.children.find((s) => s.name === "Proteomics").count}</span>
  </div>
  <div class="card">
    <h2>Metabolomics</h2>
    <span class="big">${data.children.find((s) => s.name === "Metabolomics").count}</span>
  </div>
  <div class="card">
    <h2>Universal</h2>
    <span class="big">${data.children.find((s) => s.name === "Universal").count}</span>
  </div>
</div>

<!-- Plot of launch vehicles -->

```js
// Specify the chart’s dimensions.
const width = 928;
const height = width;

// Create the color scale.
const color = d3.scaleLinear()
  .domain([0, 5])
  .range(["#c0d9ed", "#08306b"])
  .interpolate(d3.interpolateHcl);

// Compute the layout.
const pack = data => d3.pack()
  .size([width, height])
  .padding(3)
(d3.hierarchy(data)
  .sum(d => d.count)
  .sort((a, b) => b.count - a.count));
const root = pack(data);

// Create the SVG container.
const svg = d3.create("svg")
  .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
  .attr("width", width)
  .attr("height", height)
  .attr("style", `max-width: 100%; height: auto; display: block; margin: 0 -14px; background: ${color(0)}; cursor: pointer;`);

// Append the nodes.
const node = svg.append("g")
.selectAll("circle")
.data(root.descendants().slice(1))
.join("circle")
  .attr("fill", d => d.children ? color(d.depth) : "white")
  .attr("pointer-events", d => !d.children ? "none" : null)
  .on("mouseover", function() { d3.select(this).attr("stroke", "#000"); })
  .on("mouseout", function() { d3.select(this).attr("stroke", null); })
  .on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()));

// Append the text labels.
const label = svg.append("g")
  .style("font", "14px sans-serif")
  .style("font-weight", "bold")
  .attr("pointer-events", "none")
  .attr("text-anchor", "middle")
.selectAll("text")
.data(root.descendants())
.join("text")
  .style("fill-opacity", d => d.parent === root ? 1 : 0)
  .style("display", d => d.parent === root ? "inline" : "none")
  .text(d => d.data.name);

// Create the zoom behavior and zoom immediately in to the initial focus node.
svg.on("click", (event) => zoom(event, root));
let focus = root;
let view;
zoomTo([focus.x, focus.y, focus.r * 2]);

function zoomTo(v) {
const k = width / v[2];

view = v;

label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
node.attr("r", d => d.r * k);
}

function zoom(event, d) {
const focus0 = focus;

focus = d;

const transition = svg.transition()
	.duration(event.altKey ? 7500 : 750)
	.tween("zoom", d => {
	  const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
	  return t => zoomTo(i(t));
	});

label
  .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
  .transition(transition)
	.style("fill-opacity", d => d.parent === focus ? 1 : 0)
	.on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
	.on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
}

```

<div class="card card-sharp">
	${svg.node()}
</div>