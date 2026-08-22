# Workspace

Meta-repo (git super-repo) grouping all Greenways/Hara projects as child git
repos. Most children are registered as submodules in `.gitmodules` but are
worked in as ordinary clones on the `main` branch, tracking `origin/main`.

## Layout

- `application/` — deployable products (greenways-os and greenways-platform)
- `assets/` — canonical large 3D and video source media tracked through Git LFS;
  small manifests and notes remain in ordinary Git, while publishing repos own
  web-ready derivatives
- `infra/` — packaging and registries (`greenways-homebrew` for Greenways product
  formulas, `greenways-homebrew-tap` for Hara formulas, hara-id, hara-packages)
- `technology/` — core tech (hara, hara-archive, hara-specs-registry, hestia,
  historia, hodos, hoplite, ignatius). `hara` itself is organised into `core/`
  (language runtime and libraries), `packaging/` (release and distribution
  scripts), and remaining support directories; its former `archive`,
  `extensions`, `specs` and `website` submodules are now external siblings.
- `website/` — public sites (greenways-oss, greenways-visual-language,
  greenways-www, hara-www, hara-docs, hara-build, hara-benchmarks,
  hara-visual-language, hara-learn)
- `reference/` — read-only migration authorities. Only `foundation-base` is
  registered as a workspace gitlink; the rest of the group is gitignored.
  Reference repos are included in status, fetch, pull, detection, and test
  operations, but excluded from bulk push, force-update, and commit-push;
  `repo-commit-push` fails closed when a reference gitlink is dirty, drifted
  from the recorded pin, or potentially unpublished.
- `extensions/` — editor and browser apps for hara (hara-chrome, hara-emacs,
  hara-lsp, hara-vscode). `hara-chrome` owns its shared UI submodules here;
  Greenways OS consumes it as an extension rather than owning its source.

A group subdir with no `.git` is a placeholder for a project not yet cloned —
report it, never treat it as an error. Some children may lack an `origin`
remote; skip them in network operations rather than failing.

`website/hara-docs/vendor/hara-ui` is a nested submodule registered inside
`hara-docs`, not the super-repo — initialize it from within `hara-docs`.

The following local integration symlinks are gitignored convenience links:

- `website/docs` → `website/hara-docs` (expected by
  `website/hara-www/scripts/prepare-docs.mjs`).

`technology/hoplite-p256-wt` is a gitignored local git worktree of
`technology/hoplite`, not a workspace child; never stage it as a gitlink.

Hara integrations use `HARA_WORKSPACE_ROOT` and direct workspace paths; legacy
links beneath `technology/hara` are no longer created.

## Repo management tooling

Root `Makefile` delegates to section Makefiles under `scripts/`:

- `make help` — list all targets
- `make repo-status | repo-list | repo-fetch | repo-pull | repo-push | repo-sync`
- `make repo-sync-children` — clone children newly registered in `.gitmodules`
  (plain clones on `main`, never `git submodule update`), switch every clean
  child onto `main` (dirty ones are reported and left alone), then pull all
- `make repo-force-update` — reset everything to `origin/main` on `main`,
  stashing uncommitted changes (`repo-force-update-hard` discards them instead)
- `make repo-commit-push M="msg"` — commit dirty children (`git add -A`),
  push, then commit the super-repo last so submodule pointers are captured
- `make repo-lfs-install | repo-lfs-pull | repo-lfs-check` — install Git LFS,
  hydrate canonical 3D/video sources, and verify all media is represented by LFS
  pointers
- `make projects-detect | projects-build | projects-test` — per-project ops
  dispatched by manifest (make / npm / cargo / bb / python); a repo with a
  checked-in executable `./lein` launcher and `project.clj` is tested through
  `./lein test` (a `test/` directory would otherwise make `make -n test`
  succeed vacuously)
- `make crossover-grep Q="pat"`, `crossover-branch B="name"`,
  `crossover-exec CMD="..."` — operations spanning all repos

Scripts live in numbered sections, named `<section>-<index>-<name>.sh`:

```text
scripts/lib/common.sh     # repo discovery + serial each_repo loop (source it)
scripts/00-repo/          # git lifecycle
scripts/01-projects/      # per-project build/test
scripts/02-crossover/     # cross-repo ops
```

Conventions for new scripts: `#!/usr/bin/env bash`, `set -euo pipefail`,
`chmod +x`, source `scripts/lib/common.sh`, exit 2 from a per-repo function to
mean "skipped" (not failed), add a matching target to the section Makefile.
Execution is serial by design; leave gaps in numbering for future scripts.

## Working agreements

- Keep children on `main`; don't leave detached HEADs behind.
- Run `make repo-status` before batch operations; its ahead/behind numbers are
  only as fresh as the last `make repo-fetch`.
- Prefer `repo-pull` / `repo-sync` (non-destructive) over `repo-force-update`.
- Never `git submodule update` across initialized children from the super-repo —
  it detaches every child onto the recorded SHA.
- Don't create commits or push in child repos unless the user asks; use
  `make repo-commit-push` for coordinated multi-repo commits.
- Put canonical heavy 3D/video sources only under `assets/3d` or `assets/video`,
  run `make repo-lfs-check`, and keep directly served derivatives in the owning
  product or publishing repository.

## Code authoring

- Any new or modified code that changes, transforms, analyzes, summarizes, or
  generates repository code must be written in native `.hal`. Do not introduce
  Python, shell, Java, Rust, JavaScript, or another implementation language for
  these workflows. This rule applies to Codex, all other agents, and external
  automation.
- Tagged `#<name>` reader macros are not allowed in repository code. Use an
  ordinary constructor call instead; for example, write `(pointer value)` rather
  than `#ptr value`.
- Do not introduce top-level `defn-`, `defmacro-`, or private Vars in `.hal`
  source. Put implementation functions in a namespace declared with `(:config
  {:role :internal})`, where they remain directly testable. Use a publication-
  only `(:config {:role :facade})` namespace with `intern-all` when the complete
  coherent internal surface is the supported API; use `intern-in` when only a
  selected surface is supported.
- Mark supported, recommended API Vars with `^{:public true}` so autocomplete
  and documentation tools prioritize them. The marker is a tooling priority,
  not a visibility or publication mechanism: unmarked Vars remain directly
  testable, internal namespaces remain internal, and facades still publish only
  through `intern-all` or `intern-in`.

## Reversible systems

- Every component that owns mutable, cached, process, registry, or lifecycle
  state must provide a deterministic reset, teardown, or snapshot/restore
  boundary. Reset and teardown operations must be idempotent and restore the
  documented baseline even after partial initialization or failure.
- Data-format transformations must have an inverse and round-trip tests. When a
  transformation is intentionally lossy or canonicalizing, document that
  boundary, retain enough source/provenance to restore or reconstruct the
  prior representation, and test canonicalization for idempotence.
- Focused tests for stateful systems must start from a known baseline and
  restore it on every exit path so test order and reused processes cannot affect
  results.

## Corresponding Hara tests

- Treat each Hara source file and its path-matched test file as one unit of
  work. Every function or macro, including ordinary definitions in `:internal`
  namespaces, must have a corresponding test block that identifies it with
  `^{:refer namespace/symbol}` and contains a real behavioral assertion.
- Immediately after the source implementation is stable, scaffold its tests
  before writing test bodies by running `hara --project <root> --offline manage
  scaffold <namespace>` and then the same command with `--write`. Use the
  bootstrap test generator for bootstrap, native, or protocol seams that use
  `Test/run` blocks.
- Generated facts or empty `Test/run` blocks are pending work, not test
  coverage. Replace them with assertions, run the path-matched focused test,
  and verify `code.manage` reports no missing, TODO, or unchecked tests for the
  changed namespace.
- Treat scaffolding as an inventory of test obligations, never as test
  authorship. Read each implementation and hand-write the permanent test from
  its semantic contract. Prefer exact values, state transitions, branch and
  boundary cases, expected failures, cleanup/reset behavior, and inverse or
  round-trip properties. A type-only, truthy, non-nil, or "does not throw"
  assertion is sufficient only when that is the documented contract.
- Prove that a new or materially changed test can detect failure: run it
  against the pre-change behavior or a deliberately incorrect candidate or
  expectation, observe the focused test fail, then restore the correct code
  and expectation and observe it pass. Correspondence is the minimum index;
  add as many assertions as the function's behavior requires.

## Language-specific notes

Clojure/Hara work in these repos follows the user-level `~/.kimi-code/AGENTS.md`
(REPL-first workflow with `clj-nrepl-eval`, plus the `hara-postgres` and
`hara-xtalk` skills where they apply). Check for per-repo `AGENTS.md` files
before editing inside a child.

## Connector-first delivery

GitHub issues, pull requests, native relationships, checks, and repository
documents are authoritative. GitHub Projects are visual projections of that
state, not a separate source of truth.

Use the organisation workflow in
[greenways-ai/.github](https://github.com/greenways-ai/.github/blob/main/docs/connector-first-delivery.md).
Before implementing an issue, read its relationships and linked pull requests,
then follow the repository's local documentation and validation instructions.

Every executable issue must define Outcome, Scope, Acceptance criteria,
Validation, Relationships, Readiness, and Delivery. Keep durable decisions and
progress in the issue or pull request so that they are visible through the
GitHub connector; do not rely on chat history as the only record.

## GitHub publication contract

These rules are mandatory whenever a user asks to open, create, raise, or publish a pull request; push a branch; or implement changes and publish them to GitHub.

A requested pull request is a fail-closed workflow. Editing files, running tests, creating a local commit, producing a patch, or generating a report does not complete the task.

### Verified definition of done

Do not say `published`, `pushed`, `opened`, `created`, or `complete` unless the corresponding operation has been verified. A pull request is complete only after all of the following are true:

1. The intended changes are committed.
2. The commit exists on a remote GitHub branch.
3. The remote head SHA equals the intended commit SHA.
4. GitHub returned a real pull request number and canonical URL.
5. The pull request was fetched back from GitHub.
6. The read-back matches the expected repository, open state, base branch, head branch, and head SHA.

A local diff, local commit, branch name, patch, report, HTML redirect, or `sandbox:/mnt/data/...` artifact is never proof that a GitHub pull request exists.

### Required publication workflow

1. Resolve the exact repository and current default branch. Read this file and any more-specific `AGENTS.md` files before editing.
2. Inspect `git status`, the complete diff, and the intended file set. Never stage unrelated user work.
3. Start from the current default branch unless the user specified another base. Use a task branch such as `agent/<description>`.
4. Run the relevant repository validation and record the commands and outcomes.
5. Commit only the intended changes and record the commit SHA.
6. Push the branch to the correct GitHub remote.
7. Verify that the remote branch exists and resolves to the exact intended SHA. `git ls-remote` or an equivalent GitHub branch/commit read is acceptable.
8. Create the pull request using the connected GitHub pull-request action. Authenticated `gh pr create` is an acceptable fallback.
9. Fetch the created pull request back using a connected GitHub read action or `gh pr view --json number,url,state,isDraft,title,headRefName,headRefOid,baseRefName`.
10. Verify the repository, PR number, open state, base branch, head branch, and head SHA against the values recorded above.
11. Return the exact canonical URL supplied by GitHub.

Before creating a new pull request, check whether the head branch already has an open pull request. Reuse and update the matching pull request rather than creating a duplicate.

### URL rules

A successful result must use the exact canonical URL returned by GitHub:

```text
https://github.com/OWNER/REPOSITORY/pull/NUMBER
```

Do not:

- escape the scheme as `https\://`;
- invent or guess a pull request number;
- manually append `/changes`, `/files`, or another suffix;
- replace the GitHub URL with a sandbox link;
- create an HTML redirect as a substitute for a pull request.

Sandbox reports may be supplemental, but the verified GitHub URL must be the primary result.

### Failure behavior

If checkout, validation, commit, push, remote-SHA verification, pull-request creation, or pull-request read-back fails:

1. Stop claiming publication success.
2. State the last successful stage.
3. State the exact failing stage and relevant error.
4. Clearly distinguish local uncommitted work, a local commit, a remotely pushed branch, and a verified GitHub pull request.
5. Do not use success words for operations that were not verified.

Use these exact summaries when applicable:

> Changes were committed locally but were not published to GitHub.

> The branch was pushed, but no verified GitHub pull request was created.

### Multi-repository and submodule work

For work spanning multiple repositories:

- use a separate branch, commit, and pull request in each repository;
- verify every pull request independently;
- return every canonical pull-request URL;
- do not describe the overall train as complete while any repository remains unverified;
- do not update workspace submodule pins to commits that have not been merged into the child repositories, unless the user explicitly requests a stacked unmerged-pin workflow.

### Required final report

For every successfully published pull request, report:

```text
Pull request: <exact canonical GitHub URL>
Repository: <owner/repository>
PR: #<number>
State: <draft or ready>
Head: <branch> @ <verified SHA>
Base: <base branch>
Validation: <commands actually run>
```
