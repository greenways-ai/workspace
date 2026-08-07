# Tahto 0.1 release-train matrix

This is the workspace compatibility matrix for Greenways OS over the Tahto Fabric. The machine-readable source is [`compatibility/tahto-0.1.json`](../../compatibility/tahto-0.1.json).

## Current status

```text
release: tahto-0.1
status:  Gate A passed; Gate B in progress
```

Hara's fabric-name reservation is complete. Live compiler/runtime namespaces use `lang.*`, serialized Hara-owned metadata writes `:lang…/*`, and the bounded legacy reader does not write new Tahto metadata. Tahto may therefore own `tahto.*` namespaces and `:tahto…/*` records without colliding with Hara's language layer.

Gate B remains blocked on the complete application-neutral two-device scenario. The pinned baseline now contains bounded request ABI V3 and Nginx request-body binding in Hoplite, plus verified object closure, immutable commits, signed compare-and-swap heads, divergent-root preservation, backup/restore planning, device identity, replay protection and incremental-sync planning in Tahto.

## Pinned baseline

| Lane | Repository | Workspace path | Pinned revision | Role |
|---|---|---|---|---|
| OS | `greenways-ai/greenways-os` | `application/greenways-os` | `9d39ecb037010b3ca6e4af6f7e7d38c8995fba92` | authority and suite host |
| Language | `hara-lang/hara` | `technology/hara` | `60b59ccaa4af5c6cb77d5db6ed83ab5dfa57ded9` | language/runtime after the complete name cut and Workspace/runtime repairs |
| Server | `greenways-ai/hoplite` | `technology/hoplite` | `3dae9e4ad30a3e1fc73ce42bbeb99eccb7e96fba` | application server through request ABI V3 and bounded Nginx body binding |
| Fabric | `greenways-ai/tahto` | `technology/tahto` | `f2ab5955b4645ebd170838578d5508bb1262ff8b` | object vault, immutable history, CAS heads, backups, device identity, replay evidence and sync planning |
| Golden vertical | `greenways-ai/historia` | `technology/historia` | `3b38cdc36789d3a1c6323ddb78b0b0b399b82cab` | memory application |
| Canonical execution | `greenways-ai/ignatius` | `technology/ignatius` | `acef9d008e5d3e0d7303d797dbcd55946104f5d6` | canonical chain |
| Authority application | `greenways-ai/hestia` | `technology/hestia` | `02613e0de93a7b51e5b9fbbcf719aa840b014515` | rooms, mandates and receipts |
| World and Workspace projection | `greenways-ai/hodos` | `technology/hodos` | `4bf67b097da71947d12b902720296bf2a60be8bb` | storage-neutral world contracts and Hara Workspace projection |

The matrix records exact reviewed revisions and preserves every independently promoted application and technology pin.

## Gate A

| Check | State | Evidence |
|---|---|---|
| No live Hara compiler/runtime namespace begins with `tahto.` | Passed | `hara-lang/hara#371` hard-cut source, tests and generated mirrors to `lang.*` without a forwarding namespace. |
| New Hara compiler records write `:lang/*` | Passed | `hara-lang/hara#372` moved serialized metadata and `#373` stabilized post-migration runtime paths; the current pin retains those changes. |
| Architecture ADR merged | Passed | `docs/adr/0001-greenways-os-over-tahto.md` |
| Tahto repository initialized | Passed | The Tahto pin contains TAHTO-3 object custody, TAHTO-4 immutable history/backups and the main-target TAHTO-5 device/replay/sync promotion. |

Gate A is closed. A bounded compatibility reader in Hara does not reopen namespace ownership and does not grant fabric authority.

## Gate B

Gate B requires one application-neutral executable scenario:

1. enrol two devices;
2. upload and acknowledge an exact object closure;
3. commit a signed application head;
4. pull only missing objects to the second device;
5. preserve two divergent valid successors;
6. pin one complete branch as a backup;
7. delete local working state and reconstruct the exact root; and
8. reject tampered objects, stale sequences and replayed nonces.

The pinned foundations provide:

```text
Hara language/runtime name separation
Hoplite bounded request/response transport
Hoplite request ABI V3 and Nginx body registration
Tahto namespace-scoped object closure and quota accounting
Tahto immutable commits and per-device sequences
Tahto signed compare-and-swap heads and divergent roots
Tahto immutable backup pins and deterministic restore manifests
Tahto device enrolment and revocation identity
Tahto durable nonce and request-idempotency evidence
Tahto bounded push, pull and acknowledgement planning
```

Still required for B1:

```text
installed canonical signing, signature and request-freshness provider
atomic durable metadata transactions
provider-backed nonce/idempotency retention and compaction
native object upload/download execution over the Hoplite handles
native response-source streaming
pairing and revocation UX in Greenways OS
the complete two-device transfer, divergence, backup, restore and tamper fixture
```

### TAHTO-5 promotion

`greenways-ai/tahto#8` repaired the earlier stacked-branch topology and promoted the exact conformance-tested TAHTO-5 head to Tahto `main`. The workspace now pins merge commit `f2ab5955b4645ebd170838578d5508bb1262ff8b`; the former “closed but not on main” warning is resolved.

### Active next slice

`greenways-ai/tahto#9` is the draft TAHTO-6 Hara kernel for inert digest-pinned service registrations and durable job transitions. It remains unpinned until review and conformance are complete. Worker installation and execution remain outside Tahto core.

## Workspace commands

```sh
make release-status   # print pins, candidates and gate state
make release-check    # verify gitlinks, URLs and required architecture documents
make release-gate     # additionally fail while any architectural gate is blocked
```

`release-check` is the structural drift guard and should remain green while Gate B is blocked. `release-gate` is the promotion guard and should fail only on B1.

## Pin update policy

A pin update must state:

1. which repository-local PR merged;
2. which protocol or authority boundary changed;
3. which conformance fixtures now pass;
4. whether any gate changed state; and
5. whether downstream repositories need a new compatibility PR.

No matrix update silently advances a submodule to an unreviewed branch head, and a pull request merged into a non-default branch is not treated as a default-branch release pin.
