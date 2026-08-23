# Greenways OS product architecture

## Status

This is the architecture gate for the Greenways OS product reset. Greenways OS
feature implementation remains blocked until the execution environments, the
Tahto/Hestia abstractions and the top-level product interactions are formally
specified together.

## Layer model

```text
Greenways OS product surfaces
  Fabric · Search · Timeline · Cowork · Spaces
                              |
          Tahto and Hestia abstractions
                              |
       Hara packages, contracts and programs
                              |
      Hoplite · Ignatius · Hodos · local runtimes
```

Hara is the portable implementation substrate. Tahto and Hestia define the
semantic and knowledge abstractions implemented with Hara. Hoplite and
Ignatius are execution environments. Hodos is the client-side materialisation
environment. Greenways OS composes these pieces, controls local custody and
enforces grants.

## Ownership

| Layer | Responsibility |
| --- | --- |
| Hara | Portable programs, package contracts, validators and reducers |
| Tahto | Identities, objects, links, roots, revisions, authority and synchronisation |
| Hestia | Sources, anchors, evidence, assertions, lineage, retrieval and knowledge graphs |
| Hoplite | Network-serving and streaming execution for installed Hara services |
| Ignatius | Effectful execution, ordered transitions, shared finality and receipts |
| Hodos | Client-side package resolution and visible projection/materialisation |
| Greenways OS | Local keys, consent, provider selection, lifecycle, grants and composition |
| Greenways Platform | Public release delivery, collaboration, distribution and monetisation |

An operation does not pass through every service. Each feature specifies which
abstractions and environments it actually needs.

## Product surfaces

| Surface | Abstraction | Execution environments |
| --- | --- | --- |
| Fabric | Tahto roots, identities, revisions and synchronisation | Hara local runtime, Hoplite service boundary |
| Search | Hestia knowledge graph linked to Tahto roots | Hara, Hoplite, Hodos |
| Timeline | Hestia archives and evidence with Tahto references | Hara, Hoplite, Hodos |
| Cowork | Tahto authority/project state with Hestia context and evidence | Hara, Hoplite, Ignatius when finality is required, Hodos |
| Spaces | Tahto release roots with Hestia evidence and Platform delivery | Hara, Hoplite, Ignatius for release execution, Hodos |

## Architecture packet required for every surface

Before Greenways OS implementation begins, each surface must define:

- user interactions and visible states;
- Tahto/Hestia abstractions and Hara packages;
- execution environments and service operations;
- data ownership, provenance and source/derived boundaries;
- authority, grants, credentials and excluded access;
- restart, recovery, conflict, cancellation and uncertain-result behaviour;
- receipts, activity and human approval requirements; and
- conformance fixtures across the selected environments.

## Surface architecture packets

### Fabric

Interaction: the person creates or opens a Fabric, enrols a device, chooses
important files, and works with ordinary paths while sync, versions, conflicts,
and recovery remain visible.

Abstraction: Tahto owns roots, identity relationships, revisions, authority,
and synchronisation meaning. Hara owns the filesystem contracts. Hestia joins
source and evidence only when another surface needs them.

Environment: a local Hara runtime handles ordinary file operations. Hoplite is
used only where a bounded Fabric service must be served across a connection.
Ignatius and Hodos are not required for ordinary local file access.

Infrastructure must provide local key custody, device delegation, provider
selection, mount lifecycle, offline operation, conflict preservation,
snapshot/restore, and explicit recovery. Physical paths and provider
credentials must not become semantic identity.

### Search

Interaction: the person searches approved scopes, reviews classifications and
relationships, accepts or rejects proposals, and opens the original source.

Abstraction: Hestia owns sources, anchors, evidence, retrieval, and derived
views linked to Tahto roots. Tahto records accepted identity and relationship
meaning. AI output remains a proposal until accepted.

Environment: Hara packages the classification and retrieval programs. Hoplite
serves bounded search operations. Hodos materialises approved results for a
client that needs a package or projection.

Infrastructure must provide explicit scopes, indexing and invalidation,
provenance, source links, confidence and stale states, model/provider choice,
and an enforceable boundary against ambient device or account access.

### Timeline

Interaction: the person imports selected chats or activity, groups records into
projects, reviews decisions, and follows each event back to its source.

Abstraction: Hestia preserves exact transcripts, archives, evidence, lineage,
and retrieval. Tahto supplies stable identities and relationships. A project
is a set of references and context, not a second source database.

Environment: Hara packages event and grouping programs. Hoplite serves timeline
queries when needed. Hodos materialises the selected chronology for a client.

Infrastructure must provide import identity, source preservation, event
ordering, selected-activity policy, project references, rebuildable indexes,
source-unavailable states, and reset/restore behavior. It must not become
ambient surveillance.

### Cowork

Interaction: the person selects an objective and context, assigns people and
agents, reviews proposed work, approves effects, and inspects outputs and
receipts.

Abstraction: Tahto defines authority, participants, scopes, and project state.
Hestia prepares context packs, evidence, transcripts, and decisions. Hara
defines the portable work contracts and programs.

Environment: Hoplite serves bounded sessions and streams. Ignatius executes
effectful transitions, ordered work, shared finality, and receipts. Hodos is
optional client materialisation. No agent receives authority merely because it
is visible in the UI.

Infrastructure must provide scoped context, capability grants, leases,
checkpoints, cancellation, approval gates, idempotency, uncertain-effect
reconciliation, and durable output roots.

### Spaces

Interaction: the person selects private material, reviews the exact release,
signs it, and publishes or distributes that release without exposing the live
Fabric source.

Abstraction: Tahto defines release roots, authorship, derivation, and
provenance. Hestia supplies source evidence and durable publication records.
Platform owns public delivery, access, distribution, and monetisation.

Environment: Hara packages release preparation. Hoplite serves public release
operations. Ignatius performs effectful publication and records finality and
receipts. Hodos materialises client-facing release packages where required.

Infrastructure must provide exact release selection, signing, immutable roots,
privacy boundaries, rights and contributor records, versioning, revocation,
supersession, delivery read-back, and uncertain external-effect handling.

### Cross-surface rule

Each transition between surfaces passes references, selected context, and
authority—not hidden copies or ambient access. A feature records its required
abstractions and environments in its architecture packet; it does not inherit
all available infrastructure by default.

## Implementation gate

Greenways OS work is ready only when the bottom execution contracts, the
Tahto/Hestia abstraction contracts and the Visual Language product model have
all been accepted. Issue generation may proceed earlier, but implementation
issues must retain explicit dependencies on these contracts.
