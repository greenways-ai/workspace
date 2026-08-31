# Tahto 0.1 release-train matrix

This is the workspace compatibility matrix for Greenways OS over the Tahto Fabric. The machine-readable source is [`compatibility/tahto-0.1.json`](../../compatibility/tahto-0.1.json).

## Current status

```text
release: tahto-0.1
status:  Gate A passed; Gate B in progress
```

Hara's fabric-name reservation is complete. Live compiler/runtime namespaces use `lang.*`, serialized Hara-owned metadata writes `:lang…/*`, and the bounded legacy reader does not write new Tahto metadata. Tahto may therefore own `tahto.*` namespaces and `:tahto…/*` records without colliding with Hara's language layer.

Gate B remains blocked on the complete application-neutral two-device scenario. The pinned baseline contains bounded request ABI V3 and ordinary-source Nginx request-body binding in Hoplite, corrected native response ownership through Nginx request cleanup, and the complete TAHTO-3 through TAHTO-7 Hara state-kernel line.

## Pinned baseline

| Lane | Repository | Workspace path | Pinned revision | Role |
|---|---|---|---|---|
| OS | `greenways-ai/greenways-os` | `application/greenways-os` | `b76d751ca718890442f3b9b5323cf61540683b31` | authority and suite host |
| Language | `hara-lang/hara` | `technology/hara` | `449c30b9e9c31e6406319d052ade2fd904c7da1f` | language/runtime after the complete name cut and Workspace/runtime repairs |
| Server | `greenways-ai/hoplite` | `technology/hoplite` | `d61949684e4e610ba03a05d3a79849c485a07a62` | request ABI V3, Nginx request-body binding and request-scoped native response ownership |
| Fabric | `greenways-ai/tahto` | `technology/tahto` | `85eff7d5f69d6b80099a159a9f5a68086c7efe2a` | objects, history, backups, devices, replay, sync plans, services, jobs and atomic metadata transaction plans |
| Golden vertical | `greenways-ai/historia` | `technology/historia` | `45b77e079c4ccf1f0f6e0199103c381dcb538116` | memory application |
| Canonical execution | `greenways-ai/ignatius` | `technology/ignatius` | `7aacc213234998c55fe32d13342799b4de128469` | canonical chain |
| Authority application | `greenways-ai/hestia` | `technology/hestia` | `a66b6c9707ca977a4542e2887e349601b80becf7` | rooms, mandates and receipts |
| World and Workspace projection | `greenways-ai/hodos` | `technology/hodos` | `1653334148356ada254032c89977124984b122a8` | storage-neutral world contracts and Hara Workspace projection |

The matrix records exact reviewed revisions and preserves every independently promoted application and technology pin.

## Gate A

| Check | State | Evidence |
|---|---|---|
| No live Hara compiler/runtime namespace begins with `tahto.` | Passed | `hara-lang/hara#371` hard-cut source, tests and generated mirrors to `lang.*` without a forwarding namespace. |
| New Hara compiler records write `:lang/*` | Passed | `hara-lang/hara#372` moved serialized metadata and `#373` stabilized post-migration runtime paths; the current pin retains those changes. |
| Architecture ADR merged | Passed | `docs/adr/0001-greenways-os-over-tahto.md` |
| Tahto repository initialized | Passed | The Tahto pin contains TAHTO-3 object custody, TAHTO-4 immutable history/backups, TAHTO-5 device/replay/sync planning, TAHTO-6 service/job state and TAHTO-7 atomic metadata transaction plans. |

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
Hoplite bounded request/response callback bridges
Hoplite request ABI V3 and Nginx request-body registration
Hoplite request-scoped ownership for borrowed native response slices
Tahto namespace-scoped object closure and quota accounting
Tahto immutable commits and per-device sequences
Tahto signed compare-and-swap heads and divergent roots
Tahto immutable backup pins and deterministic restore manifests
Tahto device enrolment and revocation identity
Tahto durable nonce and request-idempotency evidence
Tahto bounded push, pull and acknowledgement planning
Tahto inert digest-pinned service registrations
Tahto durable, bounded and terminal job transitions
Tahto deterministic atomic metadata transaction composition
```

TAHTO-7 composes expected metadata revision, request authorization, nonce and idempotency admission, one reviewed effect-free domain transition, canonical result identity, request completion and the next metadata revision. Completed retries return the prior result digest without re-executing domain code, and rejected transitions discard partial domain mutation while still completing the canonical error idempotently.

The complete pinned Tahto Hara line reports **97 passing tests**. This is a transaction plan, not installed persistence: the provider must still compare-and-swap the expected revision and returned state in one durable storage transaction.

Still required for B1:

```text
concrete durable metadata compare-and-swap provider
installed canonical signing, signature, result and request-freshness providers
provider-backed nonce/idempotency retention and compaction
native object upload/download execution over the Hoplite handles
native response-source streaming
pairing and revocation UX in Greenways OS
the complete two-device transfer, divergence, backup, restore and tamper fixture
```

### Promoted repository work

- `greenways-ai/hoplite#37` materialized the bounded Nginx request-body adapter and application policy as ordinary source and moved its production POST checks into normal CI.
- `greenways-ai/hoplite#43` corrected the native response lifetime so Rust-owned borrowed slices remain alive until Nginx request cleanup.
- `greenways-ai/tahto#9` added the TAHTO-6 Hara kernel for inert service registrations and durable job transitions.
- `greenways-ai/tahto#10` added the TAHTO-7 atomic metadata transaction coordinator.
- `greenways-ai/tahto#11` promoted the accurate status, documentation and conformance guards while continuing to report concrete providers as not wired.

These changes improve the reviewed transport and state foundations but do not claim that an object-transfer executor, durable provider, signer or worker executor is installed.

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
