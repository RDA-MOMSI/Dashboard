---
theme: [cotton, wide]
title: Example cluster
toc: false
style: style.css
---

```js
const data = FileAttachment("data/cluster-chart.json").json();
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

<!-- Plot of launch vehicles -->

```js
// Specify the charts’ dimensions. The height is variable, depending on the layout.
const width = 1000;
const marginTop = 10;
const marginRight = 0;
const marginBottom = 10;
const marginLeft = 130;

// Rows are separated by dx pixels, columns by dy pixels. These names can be counter-intuitive
// (dx is a height, and dy a width). This because the tree must be viewed with the root at the
// “bottom”, in the data domain. The width of a column is based on the tree’s height.
const root = d3.hierarchy(data);
const dx = 20;
const dy = (width - marginRight - marginLeft) / (1 + root.height);
console.log(root.height)

// Define the tree layout and the shape for links.
const tree = d3.tree().nodeSize([dx, dy]);
const diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);

// Create the SVG container, a layer for the links and a layer for the nodes.
const svg = d3.create("svg")
  .attr("width", width)
  .attr("height", dx)
  .attr("viewBox", [-marginLeft, -marginTop, width, dx])
  .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif; user-select: none;");

const gLink = svg.append("g")
  .attr("fill", "none")
  .attr("stroke", "#555")
  .attr("stroke-opacity", 0.4)
  .attr("stroke-width", 1.5);

const gNode = svg.append("g")
  .attr("cursor", "pointer")
  .attr("pointer-events", "all");

function update(event, source) {
const duration = event?.altKey ? 2500 : 250; // hold the alt key to slow down the transition
const nodes = root.descendants().reverse();
const links = root.links();

// Compute the new tree layout.
tree(root);

let left = root;
let right = root;
root.eachBefore(node => {
  if (node.x < left.x) left = node;
  if (node.x > right.x) right = node;
});

const height = right.x - left.x + marginTop + marginBottom;

const transition = svg.transition()
	.duration(duration)
	.attr("height", height)
	.attr("viewBox", [-marginLeft, left.x - marginTop, width, height])
	.tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

// Update the nodes…
const node = gNode.selectAll("g")
  .data(nodes, d => d.id);

// Enter any new nodes at the parent's previous position.
const nodeEnter = node.enter().append("g")
	.attr("transform", d => `translate(${source.y0},${source.x0})`)
	.attr("fill-opacity", 0)
	.attr("stroke-opacity", 0)
	.on("click", (event, d) => {
	  d.children = d.children ? null : d._children;
	  update(event, d);
	});

nodeEnter.append("circle")
	.attr("r", 2.5)
	.attr("fill", d => d._children ? "#555" : "#999")
	.attr("stroke-width", 10);

nodeEnter.append("text")
	.attr("dy", "0.31em")
	.attr("x", d => d._children ? -6 : 6)
	.attr("text-anchor", d => d._children ? "end" : "start")
	.style("font", "11px sans-serif")
	.text(d => d.data.name)
	.attr("stroke-linejoin", "round")
	.attr("stroke-width", 3)
	.attr("stroke", "white")
	.attr("paint-order", "stroke");

// Transition nodes to their new position.
const nodeUpdate = node.merge(nodeEnter).transition(transition)
	.attr("transform", d => `translate(${d.y},${d.x})`)
	.attr("fill-opacity", 1)
	.attr("stroke-opacity", 1);

// Transition exiting nodes to the parent's new position.
const nodeExit = node.exit().transition(transition).remove()
	.attr("transform", d => `translate(${source.y},${source.x})`)
	.attr("fill-opacity", 0)
	.attr("stroke-opacity", 0);

// Update the links…
const link = gLink.selectAll("path")
  .data(links, d => d.target.id);

// Enter any new links at the parent's previous position.
const linkEnter = link.enter().append("path")
	.attr("d", d => {
	  const o = {x: source.x0, y: source.y0};
	  return diagonal({source: o, target: o});
	});

// Transition links to their new position.
link.merge(linkEnter).transition(transition)
	.attr("d", diagonal);

// Transition exiting nodes to the parent's new position.
link.exit().transition(transition).remove()
	.attr("d", d => {
	  const o = {x: source.x, y: source.y};
	  return diagonal({source: o, target: o});
	});

// Stash the old positions for transition.
root.eachBefore(d => {
  d.x0 = d.x;
  d.y0 = d.y;
});
}

// Do the first update to the initial configuration of the tree — where a number of nodes
// are open (arbitrarily selected as the root, plus nodes with 7 letters).
root.x0 = dy / 2;
root.y0 = 0;
root.descendants().forEach((d, i) => {
d.id = i;
d._children = d.children;
if (d.depth && d.data.name.length !== 7) d.children = null;
});

update(null, root);
```

<div class="card card-sharp">
	${svg.node()}
</div>