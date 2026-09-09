# Fix Current CI Failures

Read:

- `AGENTS.md`
- `docs/CURRENT-WORK.md`
- active phase specification
- current workflow files

Inspect current CI failures and reproduce them locally where practical.

Fix only the actual failures and closely related defects.

Do not:

- disable meaningful tests,
- weaken security/RLS,
- remove required checks,
- broadly rewrite architecture,
- hide errors with unsafe type casts.

Run the failed commands locally plus the relevant test/build suite.

Summarize root causes and create one descriptive commit.
