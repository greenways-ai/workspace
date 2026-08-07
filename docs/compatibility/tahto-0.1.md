# Tahto 0.1 release-train matrix

This is the workspace compatibility matrix for Greenways OS over the Tahto Fabric. The machine-readable source is [`compatibility/tahto-0.1.json`](../../compatibility/tahto-0.1.json).

## Current status

```text
release: tahto-0.1
status:  Gate A passed; Gate B in progress
```

The Hara naming collision is now fully cleared. PR #371 moved live compiler and runtime namespaces from `tahto.*` to `lang.*`; PR #372 moved serialized language metadata from `:tahto…/*` to `:lang…/*`; PR #373 repaired the post-migration runtime paths. Hara is pinned after all three changes.

Hoplite's bounded-streaming and signed-device application contracts are also merged, and Tahto main now contains the Hara object-vault kernel. Gate B remains open for immutable signed history, native byte transport, nonce/replay enforcement and the two-device conformance scenario.

## Pinned baseline

| Lane | Repository | Workspace path | Pinned revision | Role |
|---|---|---|---|---|
| OS | `greenways-ai/greenways-os` | `application/greenways-os` | `3fe79844add2cd2131c4c5ee808b847b3fd694a9` | authority and suite host |
| Language | `hara-lang/hara` | `technology/hara` | `5ef7762c8b97d77f9976f7037bafed81499b42c5` | language/runtime after HARA-1, HARA-2 and stabilization |
| Server | `greenways-ai/hoplite` | `technology/hoplite` | `febe8fabe50042e9617c2febc971a701bffcafb1` | merged HOPLITE-1 data-plane contracts |
| Fabric | `greenways-ai/tahto` | `technology/tahto` | `3fb1c7e963145b82b6e85c3eea3fc9b259cd2f58` | TAHTO-1/2 plus merged Hara TAHTO-3 object kernel |
| Golden vertical | `greenways-ai/historia` | `technology/historia` | `a1394eea653b6d0e1393647e0ec66a72e3ffdbc6` | memory application |
| Canonical execution | `greenways-ai/ignatius` | `technology/ignatius` | `acef9d008e5d3e0d7303d797dbcd55946104f5d6` | canonical chain |
| Authority application | `greenways-ai/hestia` | `technology/hestia` | `064b26de8ea7c3e93f1d9947618c8ee39eec1500` | rooms, mandates and receipts |
| World ABI | `greenways-ai/hodos` | `technology/hodos` | `33d33f88c23d55dd7429242dec2110c5c333e5bb` | storage-neutral world contracts |

The pin records reviewed revisions participating in the train. It does not imply that every future Tahto integration is complete.

## Gate A — passed

| Check | State | Evidence |
|---|---|---|
| No live Hara compiler/runtime namespace begins with `tahto.` | Passed | `hara-lang/hara#371`, merged as `568ef7d096be7e780874db7a9745d48e06e3d4e9`, hard-cuts source, tests and Rust mirrors to `lang.*` without a forwarding namespace. |
| New Hara compiler records write `:lang/*` | Passed | `hara-lang/hara#372` performs the serialized metadata cut; `#373` stabilizes the post-migration runtime. The pin is `5ef7762c8b97d77f9976f7037bafed81499b42c5`. |
| Architecture ADR merged | Passed | `docs/adr/0001-greenways-os-over-tahto.md` |
| Tahto repository initialized | Passed | The Tahto pin includes TAHTO-1, TAHTO-2 and merged TAHTO-3. |

The `tahto.*` namespace and `:tahto…/*` record vocabulary are now collision-free for the fabric. Hara's legacy metadata reader remains a bounded compatibility reader rather than a writer or forwarding namespace.

## Gate B — in progress

The target is the application-neutral two-device node defined by the ADR:

```text
exchange only missing immutable objects
accept signed commits and compare-and-swap heads
preserve divergent valid successors
create and restore a complete backup point
reject tampering, stale sequences and replayed nonces
```

Merged foundations:

| ID | Pull request | Result |
|---|---|---|
| HOPLITE-1 | `greenways-ai/hoplite#24` | bounded request/response streaming, opaque native handles and signed-device application contracts |
| TAHTO-3 | `greenways-ai/tahto#5` | Hara object lifecycle, quotas, manifests, closure, roots and dry-run garbage collection |

The active unpinned candidate is:

| ID | Pull request | State |
|---|---|---|
| TAHTO-4 | `greenways-ai/tahto#6` | draft immutable commits, signed CAS heads, backups, restore planning and receipt evidence |

Gate B still requires native Hoplite/Nginx object transport, durable metadata transactions, installed signature-provider verification with nonce/replay enforcement, device enrolment and a two-device end-to-end fixture. Those revisions will be pinned only after their repository-local PRs merge.

## Workspace commands

The generic commands include `technology/tahto`:

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
make release-gate     # additionally require every listed gate to pass
```

`release-check` should remain green while Gate B work is reviewed. `release-gate` now passes every Gate A check and intentionally remains red on B1 until the complete two-device application-neutral node scenario is demonstrated.

## Pin update policy

A pin update must state:

1. which repository-local PR merged;
2. which protocol or authority boundary changed;
3. which conformance fixtures now pass;
4. whether any gate changed state; and
5. whether downstream repositories need a new compatibility PR.

No matrix update silently advances a submodule to an unreviewed branch head.
