# Tahto 0.1 release-train matrix

This is the first workspace compatibility matrix for Greenways OS over the Tahto Fabric. The machine-readable source is [`compatibility/tahto-0.1.json`](../../compatibility/tahto-0.1.json).

## Current status

```text
release: tahto-0.1
status:  Gate A blocked on HARA-2 only
```

HARA-1 is complete: `hara-lang/hara#371` moved the live compiler/runtime namespace tree from `tahto.*` to `lang.*` without forwarding namespaces. Gate A remains blocked because Hara still needs the separate serialized metadata cut from `:tahto…/*` to `:lang…/*` in draft PR #372.

## Pinned baseline

| Lane | Repository | Workspace path | Pinned revision | Role |
|---|---|---|---|---|
| OS | `greenways-ai/greenways-os` | `application/greenways-os` | `3fe79844add2cd2131c4c5ee808b847b3fd694a9` | authority and suite host |
| Language | `hara-lang/hara` | `technology/hara` | `568ef7d096be7e780874db7a9745d48e06e3d4e9` | language/runtime after HARA-1 |
| Server | `greenways-ai/hoplite` | `technology/hoplite` | `404d1c96bb759b96b774f7e5583bdbedc97d3d9f` | application server |
| Fabric | `greenways-ai/tahto` | `technology/tahto` | `0f709f51db834736d1ae916ffdc899a20955254c` | state fabric protocols |
| Golden vertical | `greenways-ai/historia` | `technology/historia` | `a1394eea653b6d0e1393647e0ec66a72e3ffdbc6` | memory application |
| Canonical execution | `greenways-ai/ignatius` | `technology/ignatius` | `acef9d008e5d3e0d7303d797dbcd55946104f5d6` | canonical chain |
| Authority application | `greenways-ai/hestia` | `technology/hestia` | `064b26de8ea7c3e93f1d9947618c8ee39eec1500` | rooms, mandates and receipts |
| World ABI | `greenways-ai/hodos` | `technology/hodos` | `33d33f88c23d55dd7429242dec2110c5c333e5bb` | storage-neutral world contracts |

The pin records a reproducible pre-release baseline. It does not imply that every repository has implemented its future Tahto integration.

## Gate A

| Check | State | Evidence |
|---|---|---|
| No live Hara compiler/runtime namespace begins with `tahto.` | Passed | `hara-lang/hara#371`, merged as `568ef7d096be7e780874db7a9745d48e06e3d4e9`, hard-cuts the source/test/Rust mirrors to `lang.*` with no forwarding namespace. |
| New Hara compiler records write `:lang/*` | **Blocked** | `hara-lang/hara#372` is the draft HARA-2 metadata migration and remains deliberately unpinned. |
| Architecture ADR merged | Passed | `docs/adr/0001-greenways-os-over-tahto.md` |
| Tahto repository initialized | Passed | Tahto main pin includes TAHTO-1 and TAHTO-2. |

Fabric protocol work may be reviewed while this gate is blocked, but the release train must not claim the `:tahto…/*` fabric vocabulary as collision-free until HARA-2 merges and the Hara pin advances again.

## Candidate PRs

These heads are intentionally not pinned until they merge:

| ID | Pull request | State |
|---|---|---|
| HARA-2 | `hara-lang/hara#372` | draft serialized metadata migration |
| HOPLITE-1 | `greenways-ai/hoplite#24` | draft data-plane contracts |
| TAHTO-3 | `greenways-ai/tahto#4` | draft object vault |

After a candidate merges, the workspace receives a separate pin-only update. This keeps implementation review separate from compatibility declaration.

## Workspace commands

The existing generic commands automatically include `technology/tahto` once submodules are initialized:

```sh
git submodule update --init --recursive technology/tahto
make repo-list
make repo-status
make projects-detect
make projects-build
```

Release-train-specific commands are:

```sh
make release-status   # print pins, candidates and gate state
make release-check    # verify gitlinks, URLs and required architecture documents
make release-gate     # additionally fail while any architectural gate is blocked
```

`release-check` is the structural drift guard and should stay green on a blocked pre-release train. `release-gate` is the promotion guard and is now expected to fail only on A2 until HARA-2 completes.

## Pin update policy

A pin update must state:

1. which repository-local PR merged;
2. which protocol or authority boundary changed;
3. which conformance fixtures now pass;
4. whether any gate changed state; and
5. whether downstream repositories need a new compatibility PR.

No matrix update silently advances a submodule to an unreviewed branch head.
