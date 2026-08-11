# Workspace

Meta-repo (git super-repo) grouping all Greenways/Hara projects as child git
repos. Most children are registered as submodules in `.gitmodules` but are
worked in as ordinary clones on the `main` branch, tracking `origin/main`.

## Layout

- `application/` — deployable products (greenways-os)
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
  greenways-www, hara-www, hara-docs, hara-specs, hara-benchmarks,
  hara-visual-language, hara-world)
- `extensions/` — editor and browser apps for hara (hara-emacs, hara-lsp,
  hara-vscode). `hara-chrome` has been folded into
  `application/greenways-os/extension/hara-chrome`.

A group subdir with no `.git` is a placeholder for a project not yet cloned —
report it, never treat it as an error. Some children may lack an `origin`
remote; skip them in network operations rather than failing.

`website/hara-docs/vendor/hara-ui` is a nested submodule registered inside
`hara-docs`, not the super-repo — initialize it from within `hara-docs`.

The following local integration symlinks are gitignored convenience links:

- `website/docs` → `website/hara-docs` (expected by
  `website/hara-www/scripts/prepare-docs.mjs`).

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
  dispatched by manifest (make / npm / cargo / bb / python)
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

## Language-specific notes

Clojure/Hara work in these repos follows the user-level `~/.kimi-code/AGENTS.md`
(REPL-first workflow with `clj-nrepl-eval`, plus the `hara-postgres` and
`hara-xtalk` skills where they apply). Check for per-repo `AGENTS.md` files
before editing inside a child.
