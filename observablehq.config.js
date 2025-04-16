// See https://observablehq.com/framework/config for documentation.
export default {
  // The app’s title; used in the sidebar and webpage titles.
  title: "MOMSI Dashboard",

  // The pages and sections in the sidebar. If you don’t specify this option,
  // all pages will be listed in alphabetical order. Listing pages explicitly
  // lets you organize them into sections and have unlisted pages.
  pages: [
    {
      name: "Explore",
      pages: [
        {name: "Contributing Guidance", path: "/contributing"},
        {name: "User Journey Examples", path: "/user-journeys"},
        {name: "MOMSI Terminology", path: "/glossary"},
        {name: "Standards by Subject Area (C1)", path: "/example-circle"},
        {name: "Standards by Method Technology (C2)", path: "/example-cluster"},
        {name: "Standards by Lifecycle Stage (C3)", path: "/example-sunburst"},
        {name: "Standards by Lifecycle Stage (C4)", path: "/example-icicle"}
      ]
    }
  ],

  // Content to add to the head of the page, e.g. for a favicon:
  head: '<link rel="icon" href="observable.png" type="image/png" sizes="32x32">',

  // The path to the source root.
  root: "src",
  // Register a custom stylesheet.
  style: "/style.css",
  footer: "<footer class='footer'><div class='footer-logos'><div class='footer-image'><img height='60px' alt='RDA Logo' src='/images/RDA-Logotype.svg'></div><div class='footer-image'><img height='60px' alt='RDATiger-EOSC Logo' src='/images/RDATiger-EOSC.svg'></div><div class='footer-text'><p>This project has received funding from the European Union’s Horizon Europe framework programme under grant agreement No. 101094406. Views and opinions expressed are however those of the author(s) only and do not necessarily reflect those of the European Union or the European Research Executive Agency. Neither the European Union nor the European Research Executive Agency can be held responsible for them.</p></div></div></footer>",

  // Some additional configuration options and their defaults:
  // theme: "default", // try "light", "dark", "slate", etc.
  // header: "", // what to show in the header (HTML)
  // footer: "Built with Observable.", // what to show in the footer (HTML)
  // sidebar: true, // whether to show the sidebar
  // toc: true, // whether to show the table of contents
  // pager: true, // whether to show previous & next links in the footer
  // output: "dist", // path to the output root for build
  // search: true, // activate search
  // linkify: true, // convert URLs in Markdown to links
  // typographer: false, // smart quotes and other typographic improvements
  // preserveExtension: false, // drop .html from URLs
  // preserveIndex: false, // drop /index from URLs
};
