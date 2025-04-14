---
toc: false
theme: [cotton]
style: style.css
---

# MOMSI Terminology

MOMSI WG terms and concepts are organized and grouped by scoped curation activity themes. Themes cover MOMSI Subject Area relationships (centered around application technologies in sequencing and mass spectrometry), FAIRsharing Standard Types[^1], and Research Data Lifecycle stages. Each term provided in the glossary table below contains a defined name, definition (and definition source), related persistent identifier (where applicable), topic area (subject area categories), and relation (relevant subcategories). All terms listed in our Glossary are used in Omics issue request templates.

_Note: MOMSI WG defined terms in the glossary have not been assigned an identifier. After WG output community review and feedback we will further refine these selection terms as needed and seek opportunities to add these terms to an existing maintained ontology collection within scope._


## Glossary (pending)


| Title    | Definition                                                                                                                                                                                           | Identifier                                                 | Topic              | Related       |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ------------------ | ------------- |
| Omics    | The collective characterization and quantification of pools of biological molecules that translate into the structure, function, and dynamics of an organism or organisms (definition source: EDAM). | [edam.topic:3391](https://identifiers.org/edam:topic_3391) | MOMSI Subject Area | Omics Data Analysis |
| Genomics | Whole genomes of one or more organisms, or genomes in general, such as meta-information on genomes, genome projects, gene names etc. (definition source: EDAM).                                      | [edam.topic:0622](https://identifiers.org/edam:topic_0622) | MOMSI Subject Area | Omics         |
|          |                                                                                                                                                                                                      |                                                            |                    |               |


---
## Terminology Themes

### RDMkit Research Data Lifecycle Classes
Core research data lifecycle terminology, as defined by the RDMkit[^2], implemented in our issue request template workflow represent standard selections supporting data management [roles](https://rdmkit.elixir-europe.org/your_role) and [tasks](https://rdmkit.elixir-europe.org/your_tasks) performed at each stage (Planning, Collecting, Processing, Analyzing, Preserving, Sharing, Reusing). 

### MOMSI Research Data Lifecycle Subclasses
Concept subclass terms, as defined by the MOMSI WG, for expanding on core RDMkit data lifecycle terms with use-case specific data management or stewardship tasks as they apply under each stage. The [terms4FAIRskills (T4FS)](https://github.com/terms4fairskills/FAIRterminology/)[^3] identifiers were used for RDMkit and MOMSI research data lifecycle terms to support FAIR data stewardship.

### FAIRsharing Standard Types
The MOMSI WG landscape review captures a set of curated community standard record types, as defined by [FAIRsharing.org](https://fairsharing.org/standards), in supporting FAIR machine-actionable resources and enriching existing RDA WG partnerships under a shared aim to improve data standard quality reporting, discovery, and reuse. 

The MOMSI glossary leverages shared subject term identifiers from [FAIRsharing Subject Ontology (SRAO)](https://www.ebi.ac.uk/ols4/ontologies/srao)[^4] in compatibility with tagged terms implemented by FAIRsharing for aligning semantics from the records listed at our dashboard and collection queries. Subject terms. SRAO imports terms from existing ontologies (DCTERMS, DC, NCIT, IAO, PO, OIO, EDAM, OMIT, OBI). SRAO hierarchy covers a broad range subject matter terms and where external vocabularies could not be found SRAO classes exist.  

---

**References**

[^1]: Sansone, SA., McQuilton, P., Rocca-Serra, P. _et al._ FAIRsharing as a community approach to standards, repositories and policies. _Nat Biotechnol_ 37, 358–367 (2019). https://doi.org/10.1038/s41587-019-0080-8
[^2]: RDMkit: The ELIXIR Research Data Management toolkit for Life Sciences URL: [https://rdmkit.elixir-europe.org](https://rdmkit.elixir-europe.org/)
[^3]: FAIRsharing.org: T4FS; terms4FAIRskills, DOI: [10.25504/FAIRsharing.fb99fa](https://doi.org/10.25504/FAIRsharing.fb99fa). Last Accessed: Sunday, April 13th 2025.
[^4]: FAIRsharing.org: SRAO; Subject Resource Application Ontology, DOI: [10.25504/FAIRsharing.b1xD9f](https://doi.org/10.25504/FAIRsharing.b1xD9f). Last Accessed: Sunday, April 13th 2025.
