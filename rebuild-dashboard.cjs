const fs = require('fs')

// IMPORTS

let data = JSON.parse(fs.readFileSync('./src/data/database.json', 'utf-8'))

// CONSTANTS

const STANDARDS = ["Genomics", "Proteomics", "Metabolomics", "Universal"]
const LIFECYCLE = ["Planning", "Collection", "Processing", "Analysis", "Preservation", "Sharing", "Reuse"]
const STANDARDTYPES = ["Reporting Guideline", "Terminology Artefact", "Model/Format", "Identifier Schema", "Multi-Standard Applicable"]
const MULTIPLE_PERMITTED = ["Domain Class/Subclass", "Application Technology"]

const STANDARDS_AGGREGATION = {
    "name": "Standards",
    "children": [],
    "count": 0
}

const UNIPEPT_STANDARDS_AGGREGATION = {
	"id": 1,
    "name": "Standards",
    "children": [],
    "count": 1,
	"selfCount": 0,
	"extra": {
		"rank": "no rank"
	}
}

// FUNCTIONS

function getRandomInt(max = 10000) {
  return Math.floor(Math.random() * max);
}

function getUniqueVerboseData(data, multipleField) {
	// Split values of `multipleField` and regenerate the data
	// If `multipleField` isn't in the object, can skip since it
	// won't be in the hierarchy anyway
	const verboseSet = new Set()
	for (const s of STANDARDS) {
		for (const d of data[s.toLowerCase()]) {
			if (d.hasOwnProperty(multipleField)) {
				const values = d[multipleField].split(",")
				for (const v of values) {
					verboseSet.add(v)
				}
			}
		}
	}
	return [...verboseSet]
}

function buildVerboseData(data, multipleField) {
	// Split values of `multipleField` and regenerate the data
	// If `multipleField` isn't in the object, can skip since it
	// won't be in the hierarchy anyway
	const verboseData = []
	for (const d of data) {
		if (d.hasOwnProperty(multipleField)) {
			const values = d[multipleField].split(",")
			for (const v of values) {
				const clone = structuredClone(d)
				clone[multipleField] = v.trim()
				verboseData.push(clone)
			}
		}
	}
	return verboseData
}

function getStandardCounts(subclassTerm, data, countField = "Standard Name") {
	// Get the counts for the "Standard Name" field
	let counts = {}
	const filteredTerms = data.filter((item) => item["Standard Type"] === subclassTerm)
	for (const term of filteredTerms.map(item => item[countField])) {
		if (counts.hasOwnProperty(term)) counts[term] += 1
		else counts[term] = 1
	}
	return counts
}

function getUniqueCycleTerms(data, cycleField, standards = STANDARDS) {
	let uniqueCycleTerms = new Set()
	for (const standard of STANDARDS) {
		data[standard.toLowerCase()].forEach(item => uniqueCycleTerms.add(item[cycleField]))
	}
	return uniqueCycleTerms
}

// REBUILD DATA AGGREGATIONS

function rebuildCollapsibleClusterTreeAggregations(data, aggregation = STANDARDS_AGGREGATION) {
	// Cluster Tree: Standards ["Genomics", "Proteomics / Metabolomics"] -> "Domain Class/Subclass" (split)
	//				 -> Status -> Standard Types -> Acronyms
	// https://observablehq.com/@d3/collapsible-tree
	// https://observablehq.com/@d3/cluster/2
	aggregation.name = "Application Technology"
	const applicationTechnologyTerms = getUniqueVerboseData(data, "Application Technology")
	for (const appTechTerm of applicationTechnologyTerms) {
		const appTechChild = {
			name: appTechTerm,
			children: [],
			count: 0
		}
		for (const standard of ["Genomics", "Proteomics", "Metabolomics"]) {
			const standardChild = {
				name: standard,
				children: [],
				count: 0
			}
			// Build the hierarchy: "Domain Class/Subclass", "Standard Type", "Standard Name"
			// Filter by "Application Technology"
			let verboseData = buildVerboseData(data[standard.toLowerCase()], "Application Technology")
			verboseData = verboseData.filter((item) => item["Application Technology"] === appTechTerm)
			verboseData = buildVerboseData(verboseData, "Domain Class/Subclass")
			let classTerms = verboseData.map(item => item["Domain Class/Subclass"])
			for (const classTerm of [...new Set(classTerms)]) {
				const classChild = {
					name: classTerm,
					children: [],
					count: 0
				}
				const filteredSubClass = verboseData.filter((item) => item["Domain Class/Subclass"] === classTerm)
				const subClassTerms = filteredSubClass.map(item => item["Standard Type"])
				for (const subClassTerm of [...new Set(subClassTerms)]) {
					const subClassChild = {
						name: subClassTerm,
						children: [],
						count: 0
					}
					for (const [k, v] of Object.entries(getStandardCounts(subClassTerm, filteredSubClass, "Acronym/Short Name"))) {
						subClassChild.count += v
						subClassChild.children.push({
							name: k,
							count: v
						})
					}
					if (subClassChild.count) {
						classChild.count += subClassChild.count
						classChild.children.push(subClassChild)
					}
				}
				if (classChild.count) {
					standardChild.count += classChild.count
					standardChild.children.push(classChild)
				}
			}
			if (standardChild.count) {
				appTechChild.count += standardChild.count
				appTechChild.children.push(standardChild)
			}
		}
		if (appTechChild.count) {
			aggregation.count += appTechChild.count
			aggregation.children.push(appTechChild)
		}
	}
	return aggregation
}

function rebuildClusterTreeAggregations(data, aggregation = STANDARDS_AGGREGATION) {
	// Cluster Tree: Standards ["Genomics", "Proteomics / Metabolomics"] -> "Domain Class/Subclass" (split)
	//				 -> Status -> Standard Types -> Acronyms
	// https://observablehq.com/@d3/cluster/2
	for (const standard of STANDARDS) {
		const standardChild = {
			name: standard,
			children: [],
			count: 0
		}
		// Build the hierarchy: "Domain Class/Subclass", "Standard Type", "Standard Name"
		const verboseData = buildVerboseData(data[standard.toLowerCase()], "Domain Class/Subclass")
		let classTerms = verboseData.map(item => item["Domain Class/Subclass"])
		for (const classTerm of [...new Set(classTerms)]) {
			const classChild = {
				name: classTerm,
				children: [],
				count: 0
			}
			const filteredSubClass = verboseData.filter((item) => item["Domain Class/Subclass"] === classTerm)
			const subClassTerms = filteredSubClass.map(item => item["Standard Type"])
			for (const subClassTerm of [...new Set(subClassTerms)]) {
				const subClassChild = {
					name: subClassTerm,
					children: [],
					count: 0
				}
				for (const [k, v] of Object.entries(getStandardCounts(subClassTerm, filteredSubClass, "Acronym/Short Name"))) {
					subClassChild.count += v
					subClassChild.children.push({
						name: k,
						count: v
					})
				}
				classChild.count += subClassChild.count
				classChild.children.push(subClassChild)
			}
			standardChild.count += classChild.count
			standardChild.children.push(classChild)
		}
		aggregation.count += standardChild.count
		aggregation.children.push(standardChild)
	}
	return aggregation
}

function rebuildSunburstAggregations(data, aggregation = STANDARDS_AGGREGATION) {
	// Zoomable sunburst: Data Lifecycle -> Lifecycle Term -> Standards -> Standard Types -> Acronym/Short Name
	// https://observablehq.com/@d3/zoomable-sunburst
	// https://observablehq.com/@d3/zoomable-icicle
	for (const cycle of LIFECYCLE) {
		const cycleChild = {
			name: cycle,
			children: [],
			count: 0
		}
		const cycleTerms = getUniqueCycleTerms(data, cycle)
		for (const cycleTerm of cycleTerms) {
			const cycleTermChild = {
				name: cycleTerm,
				children: [],
				count: 0
			}
			for (const standard of STANDARDS) {
				const standardChild = {
					name: standard,
					children: [],
					count: 0
				}
				const filteredCycle = data[standard.toLowerCase()].filter((item) => item[cycle] === cycleTerm)
				// Build the hierarchy: "Standard Type", "Acronym/Short Name"
				let classTerms = filteredCycle.map(item => item["Standard Type"])
				for (const classTerm of [...new Set(classTerms)]) {
					const classChild = {
						name: classTerm,
						children: [],
						count: 0
					}
					for (const [k, v] of Object.entries(getStandardCounts(classTerm, data[standard.toLowerCase()], "Acronym/Short Name"))) {
						classChild.count += v
						classChild.children.push({
							name: k,
							count: v
						})
					}
					standardChild.count += classChild.count
					standardChild.children.push(classChild)
				}
				cycleTermChild.count += standardChild.count
				cycleTermChild.children.push(standardChild)
			}
			cycleChild.count += cycleTermChild.count
			cycleChild.children.push(cycleTermChild)
		}
		aggregation.count += cycleChild.count
		aggregation.children.push(cycleChild)
	}
	return aggregation
}

function rebuildCirclePackingAggregations(data, aggregation = STANDARDS_AGGREGATION) {
	// Circle packing: Standards -> Standard Types -> Acronyms
	// https://observablehq.com/@d3/zoomable-circle-packing
	for (const standard of STANDARDS) {
		const standardChild = {
			name: standard,
			children: [],
			count: 0
		}
		// Build the hierarchy: "Standard Type", "Acronym/Short Name"
		let classTerms = data[standard.toLowerCase()].map(item => item["Standard Type"])
		for (const classTerm of [...new Set(classTerms)]) {
			const classChild = {
				name: classTerm,
				children: [],
				count: 0
			}
			for (const [k, v] of Object.entries(getStandardCounts(classTerm, data[standard.toLowerCase()], "Acronym/Short Name"))) {
				classChild.count += v
				classChild.children.push({
					name: k,
					count: v
				})
			}
			standardChild.count += classChild.count
			standardChild.children.push(classChild)
		}
		aggregation.count += standardChild.count
		aggregation.children.push(standardChild)
	}
	return aggregation
}

function rebuildBarChartAggregations(data, standards = STANDARDS, standardTypes = STANDARDTYPES) {
	// Standards grouped bar chart
	// https://observablehq.com/@observablehq/plot-grouped-bar-chart
	let aggregation = []
	for (const stype of standardTypes) {
		for (const std of standards) {
			const count = data[std.toLowerCase()].filter((item) => item["Standard Type"] === stype).length
			aggregation.push({
				"type": stype,
				"standard": std,
				"count": count
			})
		}
	}
	return aggregation
}

// UNIPEPT VISUALISATION DATA NODES
// https://github.com/unipept/unipept-visualizations/wiki/DataNode

function rebuildUnipeptSunburstAggregations(data, aggregation = UNIPEPT_STANDARDS_AGGREGATION) {
	// Zoomable sunburst: Data Lifecycle -> Lifecycle Term -> Standards -> Standard Types -> Acronym/Short Name
	// https://observablehq.com/@d3/zoomable-sunburst
	// https://observablehq.com/@d3/zoomable-icicle
	for (const cycle of LIFECYCLE) {
		const cycleChild = {
			id: getRandomInt(),
			name: cycle,
			children: [],
			count: 1,
			selfCount: LIFECYCLE.length,
			extra: {
				rank: aggregation.name
			}
		}
		const cycleTerms = getUniqueCycleTerms(data, cycle)
		for (const cycleTerm of cycleTerms) {
			const cycleTermChild = {
				id: getRandomInt(),
				name: cycleTerm,
				children: [],
				count: 1,
				selfCount: cycleTerms.length,
				extra: {
					rank: cycleChild.name
				}
			}
			for (const standard of STANDARDS) {
				const standardChild = {
					id: getRandomInt(),
					name: standard,
					children: [],
					count: 1,
					selfCount: STANDARDS.length,
					extra: {
						rank: cycleTermChild.name
					}
				}
				const filteredCycle = data[standard.toLowerCase()].filter((item) => item[cycle] === cycleTerm)
				// Build the hierarchy: "Standard Type", "Acronym/Short Name"
				let classTerms = filteredCycle.map(item => item["Standard Type"])
				let classTermsSeries = [...new Set(classTerms)]
				for (const classTerm of classTermsSeries) {
					const classChild = {
						id: getRandomInt(),
						name: classTerm,
						children: [],
						count: 1,
						selfCount: classTermsSeries.length,
						extra: {
							rank: standardChild.name
						}
					}
					let lowestEntries = Object.entries(getStandardCounts(classTerm, data[standard.toLowerCase()], "Acronym/Short Name"))
					for (const [k, v] of lowestEntries) {
						classChild.count += v
						classChild.children.push({
							id: getRandomInt(),
							name: k,
							count: v,
							selfCount: lowestEntries.length,
							extra: {
								rank: classChild.name
							}
						})
					}
					standardChild.count += classChild.count
					standardChild.children.push(classChild)
				}
				cycleTermChild.count += standardChild.count
				cycleTermChild.children.push(standardChild)
			}
			cycleChild.count += cycleTermChild.count
			cycleChild.children.push(cycleTermChild)
		}
		aggregation.count += cycleChild.count
		aggregation.children.push(cycleChild)
	}
	return aggregation
}

function rebuildUnipeptTreeviewAggregations(data, aggregation = STANDARDS_AGGREGATION) {
	// Cluster Tree: Standards ["Genomics", "Proteomics / Metabolomics"] -> "Domain Class/Subclass" (split)
	//				 -> Status -> Standard Types -> Acronyms
	// https://observablehq.com/@d3/collapsible-tree
	// https://observablehq.com/@d3/cluster/2
	aggregation.name = "Application Technology"
	const applicationTechnologyTerms = getUniqueVerboseData(data, "Application Technology")
	let allTerms = new Set([...["no rank"], ...applicationTechnologyTerms ])
	for (const appTechTerm of applicationTechnologyTerms) {
		const appTechChild = {
			id: getRandomInt(),
			name: appTechTerm,
			children: [],
			count: 1,
			selfCount: applicationTechnologyTerms.length,
			extra: {
				rank: aggregation.name
			}
		}
		const standardTerms = ["Genomics", "Proteomics", "Metabolomics"]
		allTerms = new Set([...allTerms, ...standardTerms ])
		for (const standard of standardTerms) {
			const standardChild = {
				id: getRandomInt(),
				name: standard,
				children: [],
				count: 1,
				selfCount: standardTerms.length,
				extra: {
					rank: appTechChild.name
				}
			}
			// Build the hierarchy: "Domain Class/Subclass", "Standard Type", "Standard Name"
			// Filter by "Application Technology"
			let verboseData = buildVerboseData(data[standard.toLowerCase()], "Application Technology")
			verboseData = verboseData.filter((item) => item["Application Technology"] === appTechTerm)
			verboseData = buildVerboseData(verboseData, "Domain Class/Subclass")
			let classTerms = verboseData.map(item => item["Domain Class/Subclass"])
			classTerms = [...new Set(classTerms)]
			allTerms = new Set([...allTerms, ...classTerms ])
			for (const classTerm of classTerms) {
				const classChild = {
					id: getRandomInt(),
					name: classTerm,
					children: [],
					count: 1,
					selfCount: classTerms.length,
					extra: {
						rank: standardChild.name
					}
				}
				const filteredSubClass = verboseData.filter((item) => item["Domain Class/Subclass"] === classTerm)
				let subClassTerms = filteredSubClass.map(item => item["Standard Type"])
				subClassTerms = [...new Set(subClassTerms)]
				allTerms = new Set([...allTerms, ...subClassTerms ])
				for (const subClassTerm of subClassTerms) {
					const subClassChild = {
						id: getRandomInt(),
						name: subClassTerm,
						children: [],
						count: 1,
						selfCount: subClassTerms.length,
						extra: {
							rank: classChild.name
						}
					}
					let subClassChildTerms = Object.entries(getStandardCounts(subClassTerm, filteredSubClass, "Acronym/Short Name"))
					for (const [k, v] of subClassChildTerms) {
						subClassChild.count += v
						subClassChild.children.push({
							id: getRandomInt(),
							name: k,
							count: v,
							selfCount: subClassChildTerms.length,
							extra: {
								rank: subClassChild.name
							}
						})
					}
					if (subClassChild.count) {
						classChild.count += subClassChild.count
						classChild.children.push(subClassChild)
					}
				}
				if (classChild.count) {
					standardChild.count += classChild.count
					standardChild.children.push(classChild)
				}
			}
			if (standardChild.count) {
				appTechChild.count += standardChild.count
				appTechChild.children.push(standardChild)
			}
		}
		if (appTechChild.count) {
			aggregation.count += appTechChild.count
			aggregation.children.push(appTechChild)
		}
	}
	return aggregation
}

// BUILD VISUALISATION AGGREGATIONS

let aggregation

aggregation = rebuildCirclePackingAggregations(data, structuredClone(STANDARDS_AGGREGATION))
fs.writeFileSync('./src/data/circle-packing-chart.json', JSON.stringify(aggregation, null, '  '));

aggregation = rebuildSunburstAggregations(data, structuredClone(STANDARDS_AGGREGATION))
fs.writeFileSync('./src/data/sunburst-chart.json', JSON.stringify(aggregation, null, '  '));

aggregation = rebuildCollapsibleClusterTreeAggregations(data, structuredClone(STANDARDS_AGGREGATION))
fs.writeFileSync('./src/data/cluster-chart.json', JSON.stringify(aggregation, null, '  '));

aggregation = rebuildBarChartAggregations(data, STANDARDS, STANDARDTYPES)
fs.writeFileSync('./src/data/standards-bar-chart.json', JSON.stringify(aggregation, null, '  '));

// BUILD UNIPEPT VISUALISATION AGGREGATIONS

aggregation = rebuildUnipeptSunburstAggregations(data, structuredClone(UNIPEPT_STANDARDS_AGGREGATION))
fs.writeFileSync('./src/data/unipept-sunburst-chart.json', JSON.stringify(aggregation, null, '  '));

aggregation = rebuildUnipeptTreeviewAggregations(data, structuredClone(UNIPEPT_STANDARDS_AGGREGATION))
fs.writeFileSync('./src/data/unipept-treeview-chart.json', JSON.stringify(aggregation, null, '  '));