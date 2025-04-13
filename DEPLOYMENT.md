# Building and deploying this dashboard

**Objective**: Create an interactive catalogue dashboard system with an end-user input form and API back end. The dashboard will require a user-friendly interface for front-end standards query using tagged features for navigation and the ability to submit new standards via issue request system with versioning. This system will provide authenticated API access for query and retrieval of suitable standards information from software. It will transform a google sheet into a GitHub repository as the main resource for long-term sustainability, of which the HTML dashboard will render from the core repository.

For cost and maintenance reasons, the entire system should run on GitHub Pages.

## Manage standards submissions

**Objective**: Automate - as far as possible - the submission and validation of new and updated catalogue standards.

**Workflow**: Logged-in users can submit new information using a modified GitHub Issue.

- Configure [issue templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository) for each of the four types of standard (`genomics`, `proteomics`, `metabolomics` and `universal`). These are derived from the columns and controlled vocabularies in the original source spreadsheet.
- Add new tags for triggering GitHub Actions (`genomics`, `proteomics`, `metabolomics`, `universal`, `review` and `merge`).
- Add a new Action Secret called `AUTHORISED_MERGE` with value `[<admin>]` where `<admin>` is the list of admins with `merge` authorisation.
- Ensure that any `admins` are correctly assigned as reviewers for submissions.

**End-state**: Template forms work on submission and edit.

**References:** 
- [Issue template](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository)
- The individual YAML files defining these templates are in the repo [`.github/ISSUE_TEMPLATE`](https://github.com/RDA-MOMSI/Dashboard/tree/main/.github/ISSUE_TEMPLATE)

## Process issues

**Objective**: Support post-submission processing. This may be manual or automated, depending on requirements. If the requirements from submissions are stable (i.e. fields or controlled vocabularies don't change), then automation can be more refined.

**Workflow**: There are three potential workflows:

- **Manual**: `admins` can review any submission, request modifications / clarifications, and then modify the main data files directly. No additional code or integrations are required to this point.
- **Automation**: there are two potential end-points here; an interim `submissions` file for manual review, or - after a process of review in the issue itself - the issue is used to trigger a merge direct into the submissions database.

Automation is supported with a [GitHub Issue Parser](https://github.com/stefanbuck/github-issue-parser) which generates `JSON` from submissions.

The `admin` workflow is then:

- Receive `review` trigger on submission.
- GitHub Action runs on the submission and automatically validates, generating a query / approval response.
- Evaluate and request additional modifications / clarifications.
- On approval, tag `merge`.
- GitHub Action runs, which processes the submission into the database and closes the issue.

[GitHub Actions](https://docs.github.com/en/actions/about-github-actions/about-continuous-integration-with-github-actions) has multiple [triggers](https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows#issues) for various events. Ones of interest include:

- `issue:opened` and `issue:edited` should check for a `label` and then run the parser and validator.
- `issue:labelled` should check for a `merge` `label` and process accordingly.

**End-state**: the database - whether `CSV` or `JSON` - is updated and ready to trigger a dashboard rebuild.

**References:** 
- [Dynamic variables in GitHub Actions](https://thomasthornton.cloud/2024/09/12/create-dynamic-environment-variables-in-github-actions/)
- [Job workflows and dependencies (`needs`)](https://github.com/actions/runner/issues/491#issuecomment-926924523)
- [Conditional Action statements](https://thomasthornton.cloud/2023/08/11/if-elseif-or-else-in-github-actions/)
- [Filesync methods](https://www.geeksforgeeks.org/node-js-fs-writefilesync-method/)
- [Sharing data between jobs in files](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/storing-and-sharing-data-from-a-workflow?source=post_page-----b65e90f2c998--------------------------------#passing-data-between-jobs-in-a-workflow)
- [Issue parser](https://github.com/stefanbuck/github-issue-parser)

**Scripts:**
- [Process submissions](https://github.com/RDA-MOMSI/Dashboard/blob/main/process-submission.cjs) manages issue parsing and database update.

## Generate dashboard

**Objective**: a data explorer / table, plus a visual display answering questions about the data. The data explorer should also - where possible - support updates via submission. This requires reference IDs for all data.

**Workflow**: A visual display of quantitative data is always a simplified subset. As such it must answer specific questions as an aid to comprehension of complex topics.

The build process is automated via GitHub Actions and triggered on a `merge` label assigned to a completed issue. The dashboard is based on [Observable Framework](https://observablehq.com/framework/getting-started) with some [ideas on design](https://ben-tanen.com/observable-framework/experiments/gh-pages).

**End-state**: a dashboard which updates automatically when new submission data are merged.

**References**:
- [Links from table urls](https://talk.observablehq.com/t/display-hyperlinks-in-inputs-table/5947/2)

**Scripts:**
- [Rebuild dashboard](https://github.com/RDA-MOMSI/Dashboard/blob/main/rebuild-dashboard.cjs) is triggered on any repo update and rebuilds the dashboard.

## Initial data extract

**Objective**: Extract the original source data from Google Sheets into a repository database, as either `CSV` or `JSON`.

**Workflow**: The original source needs to be extracted, validated, and converted into a repository data store. This is potentially a one-time operation, or the data can be stored and updated in Google Sheets using [GSheet-Actions](https://github.com/marketplace/actions/gsheet-action).

These considerations are important as the Google Sheet will be more readable, but `JSON` will be more maintainable in the repository.

On extraction, the first dashboard can be triggered to build.

**End-state**: Source data are transferred.

**Scripts:**
- [Python parser](https://github.com/RDA-MOMSI/Dashboard/blob/main/rda-momsi-import-structure.ipynb) can be run manually on source data to build the `database.json` file.