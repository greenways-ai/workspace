# Tahto Semantic Fabric: Next Work

Status: 2026-08-09, after Tahto `de0b0db`

This document tracks the work required to turn Tahto's implemented storage,
history, synchronization, and initial semantic laws into an application-facing
Semantic Fabric and a Greenways OS Fabric Management Portal.

## Product boundary

Tahto is the user-controlled application-state and semantic fabric. It owns
application-neutral identity, immutable custody, graph closure, history,
synchronization, backup, restore, and recovery.

Greenways OS remains the product and authority boundary. It owns application
installation, consent, grants, provider credentials, private keys, and approved
specification packages.

Applications and their exact installed specification packages own domain
fields, invariants, migrations, transforms, interpretation, and merge policy.
Tahto must preserve divergent valid heads rather than inventing a universal
merge policy.

## Current baseline

Implemented in Tahto:

- generic `hoplite.store` metadata persistence and exact revision CAS;
- generic `hoplite.blob` object custody and upload orchestration;
- immutable objects, graph closure, commits, heads, backups, and receipts;
- devices, idempotency evidence, cursors, and synchronization negotiation;
- authorized response-source streaming;
- a portable signed two-device object-transfer law;
- semantic value profiles for schema references, stable identities, typed
  links, indexes, and collection roots;
- pure-HAL admission of verified semantic objects into the existing object
  graph.

Not yet an installed application-facing product:

- the node exposes discovery, health, and status only;
- stable semantic index/root transitions are not implemented;
- semantic roots are not yet composed into commit/head transitions;
- the production canonical-value verifier is not installed;
- authenticated semantic read/prepare/submit operations are absent;
- the production restart/two-device fixture remains incomplete;
- pairing, application schema packages, and management UX remain to be built.

The Tahto README status table should be reconciled: semantic value profiles and
semantic admission were merged in `367c119` and `472553b`, despite the table
still reporting profiles as pending.

## Ordered Tahto work

### T1. Stable indexes and semantic roots — issue #32

Implement pure-HAL transitions that construct and validate complete collection
snapshots.

Required behavior:

- map every stable logical ID to one exact semantic-object root;
- validate deterministic ordering and reject duplicate IDs;
- verify that selected objects are installed, admitted, and authorized;
- validate all exact schema references used by the collection;
- construct named collection entry roots;
- construct and install a complete `tahto.semantic-root/1`;
- make exact replay idempotent and reject root/index substitution;
- retain ordinary non-semantic collections unchanged.

Acceptance criteria:

- conformance tests cover empty, boundary-size, conflicting, incomplete,
  unauthorized, cyclic, and exact replay cases;
- a complete collection root closes over its index, semantic envelopes,
  application values, typed-link targets, and schema evidence;
- every failure returns the original state with no effects.

### T2. Bind semantic roots to history — issue #33

Compose semantic roots with existing `tahto.commit/1` and `tahto.head/1` laws.

Required behavior:

- create a commit whose root is a verified semantic collection root;
- advance signed heads using existing per-device sequence and CAS rules;
- preserve divergent valid heads;
- support merge-parent commits without performing a generic merge;
- include semantic closures in synchronization, backup, restore, and GC roots;
- retain exact receipt evidence.

Acceptance criteria:

- two devices can independently advance from a shared semantic root and both
  resulting heads remain available;
- an application-owned merge result can create a normal merge commit;
- restore never silently overwrites a newer or divergent valid head.

### T3. Canonical-value verification — issue #34

Install the bounded trusted operation that produces
`tahto.canonical-value-verification/1`.

Required behavior:

1. Open the exact immutable value bytes through authorized `hoplite.blob` access.
2. Verify SHA-256 identity and declared size.
3. Decode the bounded canonical `hara.hta/1` value.
4. Resolve an already-installed, Greenways OS-approved specification package.
5. call the exact package-root and exported validator entry;
6. emit a closed verification proof or fail without mutation.

Security requirements:

- stored values cannot choose a URL, registry, branch, provider, path,
  credential, native command, callback, or package installation;
- the first semantic value limit remains 1 MiB;
- large media and dense engine state stay in specialist object formats;
- numeric request/source handles never enter semantic or durable state.

### T4. Authenticated semantic node operations — issue #35

Expose a small, closed service for approved applications. Candidate operations:

- `semantic/read` — resolve a collection/head/stable ID to exact immutable
  evidence;
- `semantic/prepare` — validate a proposed value, envelope, index, root, and
  commit plan without mutation;
- `semantic/submit` — execute the exact prepared transition idempotently;
- `semantic/history` — return bounded commit/head history;
- `semantic/restore-plan` — construct a non-destructive recovery plan;
- `semantic/status` — return bounded application/collection health.

The final names should follow Tahto/Hara capability conventions. Requests must
never select providers, storage paths, native commands, or executable code.

Acceptance criteria:

- Greenways OS grants bind the caller to exact application, namespace,
  collection, and operation authority;
- replay, nonce, revision, receipt, and response limits are enforced;
- discovery advertises semantic operations only when the installed host can
  execute them;
- the node API has end-to-end conformance tests, not only pure transition tests.

### T5. Production two-device and recovery proof — issues #36 and #17

Build a real integration fixture using installed SQLite and filesystem
providers.

The fixture must prove:

- two independently enrolled devices;
- signed publish, pull, and exact object transfer;
- restart-safe metadata and filesystem custody;
- interrupted and resumed upload;
- range streaming and response-source cleanup;
- device revocation and post-revocation denial;
- divergent semantic heads and complete closure transfer;
- restore onto an empty node;
- corrupt/missing object and metadata fault detection;
- CAS conflict and lost-receipt recovery;
- provider parity sufficient to remove transitional native metadata code.

## Greenways OS integration

### Authority and pairing

- Add a resident Fabric service rather than an installable application.
- Pair a Tahto node through explicit origin permission and node identity
  confirmation.
- Store node credentials and recovery material under the OS/keyring boundary.
- Grant applications only their approved namespaces, collections, and methods.
- Treat device enrolment as synchronization authority, never node
  administration.

### Application state contract

Every application must classify its data as:

| Class | Treatment |
| --- | --- |
| Authoritative semantic state | Semantic objects, indexes, roots, commits, and heads |
| Large immutable source | `hoplite.blob` object referenced by digest |
| Rebuildable derived state | Rebuild locally; cache only when useful |
| Secret or live authority | Greenways OS/keyring only; never semantic state |

Each authoritative collection must define:

- stable ID format;
- canonical value schema and size bound;
- exact specification package and validator entry;
- typed link roles;
- named collection roots;
- migration rules;
- application-owned divergence and merge behavior;
- backup and retention expectations.

### Chats

- Define conversation, message, participant, attachment, source-import, and
  annotation schemas.
- Preserve original ChatGPT export material as immutable source evidence.
- Model conversation branches without flattening them.
- Decide whether messages are independent semantic objects or bounded members
  of a conversation value; use object links for large attachments.
- Keep search indexes, embeddings, summaries, and generated titles rebuildable.
- Define reconciliation for local metadata edits and repeated imports.

### Worlds

- Define world, scene, entity, asset, layer, and touchpoint stable IDs.
- Define containment, inheritance, portal, dependency, and asset link roles.
- Use a named `document` root for a world's entry object.
- Keep geometry, audio, textures, voxels, and dense engine state in specialist
  immutable blobs rather than per-element semantic nodes.
- Define application-specific merging for independent scene edits.

### Userscripts

- Define stable script identity, immutable source, match policy, provenance,
  and version schemas.
- Keep browser installation, enablement, and site permission grants under
  Greenways OS authority.
- Never allow synchronized script data to grant execution on another device.
- Define text/source merge behavior or preserve divergent script versions.

### Kernel DevTools

- Define portable diagnostic, module-approval evidence, configuration, audit,
  and reproducibility records.
- Exclude live bearer credentials, private keys, native handles, and temporary
  runtime authority.
- Separate authoritative approval/audit evidence from transient inspection UI
  state.

### Backup transition

The existing sealed Greenways OS backup should remain a coarse disaster-
recovery layer while applications move to semantic collections.

Target model:

```text
authoritative app state  -> semantic collections and history
large source material    -> immutable blob custody
sealed recovery snapshot -> immutable backup closure pin
derived state            -> rebuilt locally
secrets and grants       -> Greenways OS authority
```

Do not serialize every IndexedDB store indiscriminately. Each application must
explicitly publish authoritative collections and restore/reconciliation rules.

## Fabric Management Portal

The portal is a Greenways OS system surface. It manages fabric health,
authority, custody, history, synchronization, and recovery. Editing domain data
continues to belong to Chats, Worlds, Userscripts, and other owning apps.

### Navigation

```text
Fabric
├── Overview
├── Applications
├── Collections
├── History
├── Devices
├── Backups
├── Specifications
├── Storage
└── Diagnostics
```

### Portal milestone P1 — read-only node overview

- discover and pin a Tahto node identity;
- show health, installed capabilities, provider status, and local/remote mode;
- show clear “not installed” states for unavailable capabilities;
- never imply that discovery/status routes provide semantic management.

### P2 — storage and synchronization diagnostics

- object counts and byte usage;
- metadata revision and provider health;
- staged/incomplete uploads;
- enrolled, current, stale, and revoked devices;
- per-collection cursors and missing-object counts;
- bounded diagnostic export without credentials or payloads.

### P3 — backup and restore

- list immutable recovery points and retention dates;
- verify closure completeness before offering restore;
- unlock sealed recovery data locally;
- preview affected applications, collections, and heads;
- produce a preserve/reconcile restore plan;
- apply atomically and retain a restore receipt;
- never silently overwrite divergent or newer heads.

### P4 — semantic collection explorer

- search stable IDs and inspect selected immutable roots;
- show schema/package evidence and value sizes;
- visualize a bounded typed-link graph;
- expose named roots, graph closure, commit, head, and receipt evidence;
- use application-provided safe inspectors for application values;
- collapse dense structures and never attempt a universal renderer.

### P5 — history and divergence

- present approachable commit/head timelines;
- identify device provenance and common ancestry;
- offer preserve both, select, export, defer, or open in owning application;
- invoke only an approved application merge operation;
- record merge results as ordinary commits.

### P6 — specification management

- list exact installed package coordinates, versions, roots, and validator
  entries;
- show dependent applications, collections, and object counts;
- identify older schema versions and available migrations;
- route installation and upgrades through Greenways OS approval.

### UX principles

- Lead with product language and reveal protocol evidence on demand.
- Keep the first releases read-heavy; expose mutations only when the matching
  authenticated, idempotent operation exists.
- Make local-only, synchronized, sealed, divergent, incomplete, and revoked
  states visually distinct.
- Explain why an object is retained before garbage collection.
- Never display or export private keys, bearer tokens, decrypted credentials,
  or unrestricted application payloads by default.
- Direct domain editing and merge decisions back to the owning application.

## Cross-repository deliverables

| Repository | Deliverable |
| --- | --- |
| `technology/tahto` | T1–T5 transitions, providers, service contract, and conformance fixtures |
| `application/greenways-os` | Fabric resident service, pairing, grants, portal, sealed recovery integration |
| application specification packages | Schemas, typed roles, migrations, transforms, and merge policies |
| `technology/hara` / Hoplite | Generic bounded value verification and installed host capability support |

## Definition of a complete first release

The first Semantic Fabric release is complete when:

- one Greenways OS installation can pair with a production Tahto node;
- Chats and Worlds each publish at least one complete semantic collection;
- exact installed specification packages validate canonical values;
- semantic roots advance through signed commits and heads;
- two devices synchronize the same immutable closure across a restart;
- divergence is preserved and resolved only by an owning application;
- an immutable sealed backup can be verified and restored non-destructively;
- the portal exposes health, devices, collections, history, backup, restore,
  specifications, storage, and bounded diagnostics;
- authority, recovery, corruption, interruption, and revocation tests pass;
- documentation and node discovery report only capabilities actually installed.

## Immediate next actions

1. Reconcile Tahto's README status table with merged #30 and #31 work.
2. Implement #32 stable indexes and semantic roots in pure HAL.
3. Draft the closed semantic service operations needed by Greenways OS without
   prematurely exposing routes.
4. Create first versioned specification packages for Chats and Worlds.
5. Build the portal's read-only node overview against current discovery/status.
6. Design the production two-device/restart fixture before accepting the node
   API as release-ready.
