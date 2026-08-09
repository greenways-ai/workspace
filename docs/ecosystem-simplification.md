# Greenways/Hara Ecosystem Simplification

**Status:** Architectural review and recommendations  
**Scope:** Current Greenways and Hara workspace  
**Date:** 9 August 2026

## Executive summary

The Greenways/Hara ecosystem has strong domain boundaries, but several pieces
of foundational infrastructure are implemented more than once. The largest
opportunity is not to merge products or repositories. It is to establish a
smaller set of shared "thin waist" contracts beneath them.

The target execution spine is:

```text
project/HARP
    |
    v
domain HAL reducer
    |
    v
std.work
    |
    v
Hara capability invocation
    |
    v
generic installed provider
    |
    v
canonical reference + receipt
```

Greenways OS, Tahto, Ignatius, Hestia, Hodos and Alumbra should differ mainly
in the domain meaning they own. Kernel hosting, capability dispatch, work
lifecycle, immutable references, packaging and conformance should be shared.

The highest-value consolidation areas are:

| Priority | Area | Intended simplification |
| --- | --- | --- |
| P0 | Kernel hosting | One browser/native host SDK for sessions, reverse calls, cancellation, errors and resource disposal |
| P0 | Capabilities | One capability lifecycle, with Greenways OS supplying final consent and authority |
| P0 | Work | `std.work` as the common execution, checkpoint, retry and cancellation substrate |
| P0 | Evidence | One HCV1 codec, immutable-reference model and base receipt envelope |
| P1 | Packaging | One `project.edn -> project.lock.edn -> .harp` pipeline, including runtime artifacts |
| P1 | UI and projection | Complete the Hara Workspace -> Hara web services -> Hodos -> product separation |
| P1 | Specifications | One metaspec, protocol-ID registry and conformance publication workflow |
| P2 | Portfolio | One machine-readable dependency/status map with explicit migration deletion gates |

These are recommendations, not declarations of adopted architecture. Several
of the underlying contracts remain drafts or active migrations.

## 1. Unify kernel hosting

Browser kernel wrappers, queues and brokers currently exist across Hara,
Playground, Hestia, Hodos and Greenways OS. Their product-specific policies are
different, but their lower-level runtime behavior should be identical.

A common host SDK should own:

- kernel and session identity;
- evaluation and module loading;
- reverse host calls;
- cancellation and timeout behavior;
- promise settlement and stable error categories;
- capability resolution;
- session-owned resource disposal;
- bounded inspection and serialization; and
- snapshot and restoration rules.

The existing
[`@hara-lang/web-runtime`](../technology/hara-ui/docs/web-packages.md)
package is the natural browser-facing home. Products should inject authority
and capability adapters rather than reimplement runtime mechanics.

```text
Hara host core
|-- Web Worker transport
|-- RESP transport
|-- WebRTC transport
|-- Native Messaging transport
`-- Nginx embedding transport

Product authority adapters
|-- Greenways OS consent and grants
|-- Playground project policy
|-- Hestia room policy
`-- Hodos world lifecycle
```

The transports should remain distinct. Session semantics, error behavior,
host-call framing and lifecycle cleanup should be shared.

## 2. Define one capability lifecycle

The word "capability" currently applies at several levels:

- `project.edn` declares required capabilities;
- the Hara host discovers installed providers;
- `@hara-lang/web-capabilities` dispatches browser operations;
- Hodos negotiates world and session capabilities;
- Greenways OS creates durable grants; and
- providers bind request-scoped handles and resources.

These levels should use one lifecycle:

```text
requested
  -> declared by package
  -> available from installed provider
  -> allowed by host policy
  -> granted by user or authority
  -> bound to caller and session
  -> invoked
  -> receipted
  -> revoked or disposed
```

The
[Hara host and kernel contract](../technology/hara-specs-registry/01-lang/006-host-and-kernel/draft/README.md)
already defines provider availability, grant resolution and deny-by-default
dispatch. The
[Greenways OS capability authority](../application/greenways-os/protocol/core-services.md)
provides the strongest implemented consent and durable-grant model.

Hodos capability negotiation should be a profile of this base contract, adding
world scope, quotas and lifecycle rules rather than defining a parallel grant
system.

This should not make every kind of authorization equivalent. A Hestia mandate
is domain authorization; a Greenways OS capability grant is host authority.
They may use compatible evidence envelopes while preserving different rules.

## 3. Make `std.work` the execution substrate

There is conceptual overlap among:

- Hara `std.work`;
- the Greenways OS Work Supervisor boundary;
- Tahto service jobs;
- Ignatius work claims, checkpoints and completion; and
- Hestia mandates and workflows.

The responsibilities can be made explicit:

```text
std.work
  execution state, effects, cancellation, retries, checkpoints

Greenways OS
  who may execute, credentials, consent, provider access

Ignatius
  signed claims, dependencies, review, acceptance, release

Tahto
  immutable inputs and outputs, durable state, heads, backup, recovery

Hestia
  human mandate, delegation, exact approval

Historia
  historical observation, projection and retrieval
```

The ecosystem should not maintain independent foundational meanings for
"running", "checkpoint", "retry", "cancelled" and "receipt". Domain systems
may add states and evidence, but should refer to the same base work identity
and execution result.

[Ignatius](../technology/ignatius/README.md) already intends to pin work
definitions to `std.work`. Completing that relationship would let its signed
coordination layer remain focused on claims, review and acceptance rather than
also becoming another execution runtime.

## 4. Share HCV1 and immutable references

HCV1 encoding and verification currently appear in several Hestia and Ignatius
implementations across JavaScript, HAL and Clojure. These copies are
security-sensitive: a one-byte disagreement changes an identity root.

Hara or the Hara specifications registry should own:

- the HCV1 codec;
- canonical root calculation;
- ordered labelled references;
- pack verification;
- shared conformance vectors; and
- a generic immutable-reference descriptor.

The shared model must preserve the distinction:

```text
stable logical identity != exact immutable content root
```

Domain systems can then add their own meaning:

- Ignatius adds workflow, attestation and review semantics;
- Hestia adds mandates, private-room state and human approval;
- Tahto stores and synchronizes referenced semantic objects;
- Greenways OS records authority and installation evidence; and
- Historia references Git objects and histories without rewriting them into
  HCV1.

The objective is not one universal ledger. It is one reliable way to identify,
verify and refer to exact evidence.

## 5. Complete one package and lock pipeline

The intended package model is already concise:

```text
project.edn       contributor-authored intent
project.lock.edn  generated exact resolution
package.edn       generated archive inventory
.harp             immutable package
```

The specification is described in the
[Hara package draft](../technology/hara-specs-registry/02-platform/000006-package/draft/README.md).
The workspace nevertheless also contains runtime lock files, product-specific
manifest handling, Git-pinned web dependencies and committed vendor snapshots.

The package pipeline can be simplified by:

- representing runtime archives as locked remote artifacts in
  `project.lock.edn`;
- expressing Greenways application metadata as a project/HARP profile rather
  than a separate package universe;
- generating website, extension and Playground vendor trees at build time from
  exact locks;
- applying one conformance corpus to every Rust, JavaScript and HAL project
  parser; and
- retaining `workspace.edn` as a separate descriptor because it defines live
  presentation, not package identity.

Multiple parser implementations may remain necessary, particularly before a
kernel can boot. They should implement one normative schema and share the same
positive and negative fixtures.

## 6. Finish UI and projection ownership

The intended presentation stack is:

```text
Hara Workspace HAL
  headless state, events, descriptors and effects

Hara web packages
  runtime, structural editor, persistence, preview and browser mechanics

Hodos
  visible Dev, 2D, 3D, audio and connector projections

Hara visual language
  shared design tokens, motifs and low-level presentation

Greenways products
  installation, policy and product composition
```

This division is already documented by the
[Hara web package ownership rules](../technology/hara-ui/docs/web-packages.md)
and the
[Hodos specification](../technology/hodos/spec/README.md). The simplification
is to finish the migration and remove transitional overlap.

In particular:

- Hara UI's legacy document model, editor and workbench should become
  time-bounded compatibility surfaces for Hodos 2D;
- Hara UI should retain structural editing and browser-runtime mechanisms;
- Hodos should own visible document, world and Workspace components;
- `@hara-lang/visual-language` should own base design tokens, while Hara UI
  adds only editor-specific semantic tokens; and
- Playground and websites should consume generated, locked packages instead
  of maintaining source copies as independent authorities.

## 7. Use one specification publication system

Hara specifications are centralized, while Tahto, Hestia, Hodos and Greenways
OS maintain substantial domain protocol trees. Keeping specifications near
their domain owners is useful, but publication and verification should be
uniform.

The desired workflow is:

1. The domain repository authors the specification.
2. One metaspec validates its structure.
3. One protocol-ID registry detects collisions and ambiguous ownership.
4. One conformance manifest identifies fixtures and implementations.
5. Accepted versions are published as immutable specification packages.
6. The public Specs service renders exact repository revisions.
7. Products lock the specification packages they execute.

This avoids both duplicating specifications and moving all domain meaning into
a central mega-repository.

## 8. Make migration and release state machine-readable

The
[workspace portfolio review](open-issues-portfolio-review-2026-08-09.md)
identifies a coordination problem: migrations and epics overlap without a
single machine-readable dependency graph or active release train.

The workspace should generate an ecosystem matrix with fields equivalent to:

| Contract | Owner | Current implementation | Successor | Consumers | Conformance | Removal gate |
| --- | --- | --- | --- | --- | --- | --- |

Every transitional implementation should have:

- exactly one authoritative successor;
- shared parity fixtures;
- a CI guard preventing new features on frozen paths;
- a named removal condition; and
- a release milestone that proves the replacement in production.

This is particularly relevant to transitional Tahto native code, older Hara UI
surfaces, custom browser runtime adapters and the planned Historia runtime
migration.

Terminology should also be made explicit where names collide. In particular,
documentation should consistently distinguish the **Tahto compiler pipeline**
from the **Tahto semantic fabric**.

## Boundaries that should remain separate

Simplification should not erase the ecosystem's strongest ownership rules:

- **Tahto and Ignatius should remain separate.** Tahto owns semantic custody,
  history and recovery; Ignatius owns signed workflow coordination and
  acceptance.
- **Hestia approval is not a Greenways OS capability grant.** Human and domain
  approval differs from host authority.
- **Alumbra's dense state should remain outside generic Hodos and Tahto
  models.** Voxel chunks, physics, GPU buffers and hot engine state need
  specialist representations.
- **Hodos should not own structural editing, kernel mechanics or storage.** It
  owns visible projections and interaction contracts.
- **A package signature should not grant runtime authority.** Exact bytes and
  trusted provenance are necessary but not sufficient for consent.
- **Git, HCV1, blobs and engine snapshots should not be forced into one
  physical format.** They need compatible references, not identical storage.

The goal is fewer foundational contracts beneath the projects, not fewer
projects or one universal data structure.

## Recommended consolidation order

The most useful implementation sequence is:

1. Extract and certify the shared HCV1/reference core.
2. Stabilize the `std.work` lifecycle and provider-facing effect model.
3. Complete the shared host/kernel capability SDK.
4. Publish the Hoplite provider and conformance matrix.
5. Integrate Greenways OS authority with that common substrate.
6. Move Playground, Hestia and Hodos browser hosts onto the common runtime
   lifecycle.
7. Consolidate package locks and generated vendor artifacts.
8. Remove compatibility implementations only after consumer-side production
   proofs pass.

This sequence removes cross-project duplication while preserving domain
ownership. It also gives Tahto, Ignatius, Hestia, Hodos and Alumbra stable
infrastructure on which to prove their different responsibilities.
