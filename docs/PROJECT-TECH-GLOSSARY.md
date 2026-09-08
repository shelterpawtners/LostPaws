# ShelterPawtners Project Technical Glossary

Purpose: plain-English reference for the technical terms and acronyms used during ShelterPawtners product delivery, QA, GitHub, Supabase, and agent workflows.

## Core Git / GitHub terms

| Term              | Meaning                          | Plain-English explanation                                                                                                        | Example in this project                                                    |
| ----------------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| PR                | Pull Request                     | A proposed set of code changes asking to be reviewed before merging into another branch.                                         | PR #2 proposes the Guardian QA and bug-fix work into `build/festival-mvp`. |
| PR #              | Pull Request number              | GitHub gives each PR a simple number so it is easy to reference.                                                                 | `PR #2` means the second pull request in this repository.                  |
| SHA               | Secure Hash Algorithm identifier | A long unique-looking code Git uses to identify one exact commit/version of the repository. Think of it as a precise version ID. | `5a3a13...` identifies one exact commit.                                   |
| Commit            | Saved code checkpoint            | A recorded snapshot of one set of changes in Git.                                                                                | "Fix Guardian Save blocker" would be one commit.                           |
| Branch            | Parallel line of work            | A safe working copy of the code history used for changes before they are merged.                                                 | `qa/guardian-registration-personas` is the current QA branch.              |
| Base branch       | Destination branch               | The branch a PR is proposing to merge into.                                                                                      | `build/festival-mvp` is the base for PR #2.                                |
| Head branch       | Source branch                    | The branch containing the proposed changes in a PR.                                                                              | `qa/guardian-registration-personas` is the head branch for PR #2.          |
| Merge             | Combine approved work            | Applies changes from one branch into another.                                                                                    | Merge PR #2 into `build/festival-mvp` after approval.                      |
| Draft PR          | Not ready to merge yet           | A PR intentionally marked as work-in-progress.                                                                                   | PR #2 stays draft while the Guardian blocker is being fixed.               |
| Diff              | Code difference                  | Shows exactly what lines/files changed between two versions.                                                                     | Used by ChatGPT/Copilot to review a PR.                                    |
| Repo / Repository | Project code home                | The GitHub project containing code, tests, docs, branches, and history.                                                          | `shelterpawtners/LostPaws`.                                                |

## Testing / quality terms

| Term                | Meaning                                 | Plain-English explanation                                                                                     | Example in this project                                               |
| ------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| QA                  | Quality Assurance                       | The process of checking that the product works correctly and safely.                                          | Persona QA validates registration and redemption flows.               |
| CI                  | Continuous Integration                  | Automated checks GitHub runs when code changes are pushed or a PR changes.                                    | Lint, typecheck, unit tests, and build run automatically.             |
| CD                  | Continuous Delivery / Deployment        | Automation that prepares or deploys approved code. We are not relying on automatic production deployment yet. | Production deploy remains a separate approval gate.                   |
| E2E                 | End-to-End test                         | A browser-style test that simulates a real user journey across multiple parts of the system.                  | Guardian registers, saves pet, claims offer, partner redeems.         |
| Playwright          | Browser automation testing tool         | Software that opens a real browser automatically and clicks/types like a user.                                | Used for Guardian, Shelter, Partner, and redemption tests.            |
| Unit test           | Small isolated test                     | Checks one function/component behavior independently.                                                         | Runs under the normal CI suite.                                       |
| Regression test     | Test that prevents a bug from returning | After fixing a bug, a test is added so future changes fail if the same problem comes back.                    | Guardian `Save and continue` gets a permanent regression test.        |
| pgTAP               | PostgreSQL testing framework            | Database test framework used to verify SQL/database behavior.                                                 | Current database suite checks RLS and offer/redemption rules.         |
| RLS                 | Row Level Security                      | Database rules that decide which individual records a logged-in user may read/change.                         | Guardian B must not see Guardian A's private pet.                     |
| Assertion           | One specific test expectation           | A check such as "this user must not see that pet."                                                            | `72/72 assertions passed` means every database expectation succeeded. |
| Test fixture / seed | Known test data                         | Repeatable sample accounts and records loaded so tests always start from a predictable state.                 | Guardian A, Guardian B, Partner Admin, Shelter Admin, RAVE Vendor.    |
| Blocker             | Defect that stops required progress     | A bug serious enough that the current checkpoint cannot be accepted until fixed.                              | Guardian Save not persisting pet data.                                |
| Non-blocker         | Defect that can be logged and deferred  | A smaller issue that does not stop the required journey or checkpoint.                                        | Minor copy/polish issue.                                              |

## Database / Supabase terms

| Term      | Meaning                           | Plain-English explanation                                                             | Example in this project                                                     |
| --------- | --------------------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| DB        | Database                          | Where application records are stored.                                                 | Supabase PostgreSQL stores users, pets, organizations, offers, claims, etc. |
| SQL       | Structured Query Language         | Language used to define/query relational databases.                                   | Supabase migrations and pgTAP tests use SQL.                                |
| Migration | Versioned database change         | A saved script that changes database structure or logic in a repeatable order.        | Adds Partner profiles, offers, redemption functions, etc.                   |
| Seed      | Repeatable sample data            | Inserts controlled test/demo records after database setup.                            | Creates deterministic persona accounts for QA.                              |
| RPC       | Remote Procedure Call             | A server-side database function the app calls to perform controlled logic.            | Used for secure organization/offer workflows.                               |
| FK        | Foreign Key                       | Database relationship connecting one table's record to another.                       | A guardianship links a guardian to a pet.                                   |
| PK        | Primary Key                       | Unique identifier for one database record.                                            | Each pet or organization has its own unique ID.                             |
| UUID      | Universally Unique Identifier     | Long unique value used as a record ID without depending on simple sequential numbers. | Pet/user/org IDs in Supabase are commonly UUIDs.                            |
| API       | Application Programming Interface | A structured way the website communicates with backend services/data.                 | Browser talks to Supabase through its APIs.                                 |
| Auth      | Authentication                    | Confirms who a user is when they sign in.                                             | Supabase Auth handles login/session identity.                               |

## Product / delivery terms used in this project

| Term    | Meaning                             | Plain-English explanation                                                                           | Example                                                    |
| ------- | ----------------------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| MVP     | Minimum Viable Product              | The smallest useful version that proves the key business/product journeys before adding everything. | Phase 2 Partner Marketplace MVP.                           |
| CP      | Checkpoint                          | A defined milestone inside a phase with required functionality and acceptance criteria.             | CP4 = Claim + QR/Code Redemption.                          |
| Phase   | Major delivery stage                | A larger planned section of the ShelterPawtners roadmap.                                            | Phase 2 = Partner Marketplace MVP.                         |
| Persona | User type                           | A distinct kind of user whose experience/permissions need testing.                                  | Guardian, Shelter, Pet Business, RAVE Vendor, Admin.       |
| UX      | User Experience                     | How understandable, efficient, and pleasant the product feels to a human.                           | Jim reviews whether redemption is easy enough at checkout. |
| UI      | User Interface                      | The screens, buttons, forms, labels, and visual controls users interact with.                       | Guardian onboarding form.                                  |
| PII     | Personally Identifiable Information | Information that can identify a person and should be handled carefully.                             | Redemption codes should not expose guardian PII.           |
| QR      | Quick Response code                 | Scannable square barcode commonly opened by a phone camera.                                         | Partner scans Guardian redemption QR code.                 |

## Agent/tool terms

| Term           | Meaning                           | Plain-English explanation                                                          | How we use it                                            |
| -------------- | --------------------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Codex          | OpenAI coding agent               | Primary implementation agent for larger code changes and local validation.         | Fixes blockers/features, runs tests, pushes code.        |
| GitHub Copilot | GitHub AI coding/review assistant | Independent code review and smaller engineering support.                           | Automatically reviews PRs for defects/risks.             |
| ChatGPT        | Product/control/QA coordinator    | Defines requirements, reviews evidence, manages product decisions and handoffs.    | Reviews PR/test results and gives PASS/FAIL/next action. |
| Agent          | AI worker performing a task       | Generic term for Codex, Copilot, or another automated worker acting on code/tests. | "Agent QA" means an AI reviews/runs/fixes test findings. |

## How to read a typical project status line

Example:

`PR #2 | head SHA 5a3a13... | CI PASS | pgTAP 72/72 | Playwright 8/9 | BLOCKER: Guardian Save`

Plain English:

- We are reviewing Pull Request number 2.
- `5a3a13...` identifies the exact version being tested.
- Normal automated code checks passed.
- All 72 database checks passed.
- 8 of 9 browser journeys passed.
- Guardian Save is the one blocking defect preventing acceptance.

## Rule for project communication

When a technical acronym or shorthand is important to a decision or next action, prefer plain English first and include the acronym in parentheses, for example: `Pull Request (PR)` or `Row Level Security (RLS)`. Do not assume Jim needs to memorize the terminology to operate the project.
