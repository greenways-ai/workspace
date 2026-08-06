# ADR 0001: Greenways OS over the Tahto Fabric

- **Status:** Accepted when merged
- **Date:** 2026-08-07
- **Decision owners:** Greenways OS, Tahto, and application maintainers
- **Integration authority:** `greenways-ai/workspace`

## Context

Greenways OS already contains the resident Hara kernel, isolated HAL packages, capability authority, keyring, package lifecycle, declarative surfaces, and Workbench needed to host local applications. Its remaining storage integrations are product-specific: Historia is exposed as a localhost native hybrid, Worlds is bound to GitHub, and Hestia is presented as a connector for backup and home-node behavior.

A separate fabric is required to store, synchronize, back up, restore, replicate, and route application state without taking ownership of application meaning or user authority.

The name `Tahto` is currently occupied inside Hara by compiler/runtime namespaces and serialized compiler metadata. Hara is performing a hard namespace cut from `tahto.*` to `lang.*`; serialized `:tahto/*` vocabulary is a separate compatibility migration. The fabric must not publish its own namespaces or records until that collision is cleared.

## Decision

Greenways adopts the following product and technology boundary:

```text
Greenways OS
  product brand, browser kernel, app suite, consent and keys

Tahto
  distributed state, sync, backup, services and remote fabric

Applications
  Historia · Spaces · Hestia · Worlds · Agents

Application technologies
  Ignatius · Hodos · Hara · Hoplite
```

The workspace is the release-train authority. Repository-local pull requests remain independently reviewable; the workspace records compatible revisions and executes cross-repository conformance gates.

## Architectural laws

1. **Greenways OS owns authority.** Installation, user consent, private keys, provider credentials, grants, and application lifecycle remain in the OS.
2. **Tahto owns custody and movement.** Tahto stores, synchronizes, backs up, restores, replicates, and routes application state.
3. **Applications own meaning.** Historia defines archives, Hestia defines rooms and mandates, Worlds defines scenes, and Spaces defines mounted collaboration. Tahto does not infer those semantics.
4. **Tahto preserves conflicts.** Divergent signed heads remain available. Core Tahto never applies generic last-write-wins reconciliation.
5. **Source and derived state are distinct.** Authoritative records are eligible for synchronization and backup. Search indexes, vectors, thumbnails, caches, and other rebuildable projections are not authoritative by default.
6. **Application workers are optional.** Workers may run on a Tahto node, but their implementations and semantic contracts remain in application repositories.
7. **No remote executable catalogue.** Tahto descriptors may name protocols and verified worker digests. They may not introduce JavaScript, HTML, HAL, arbitrary Wasm, or native commands into Greenways OS.
8. **Readable and sealed replicas are both supported.** A trusted home or compute node may read authorized collections; an off-site replica may hold only encrypted opaque objects.
9. **Greenways Space is optional.** A hosted Space may provide Tahto relay, public delivery, workers, or sealed backup. Local Greenways OS applications must not depend on it.
10. **Dependencies point downward.** Applications depend on the Tahto SDK; Greenways OS depends on the Tahto client; the Tahto control plane may depend on Hoplite and Hara; Tahto core depends on no application repository.

## Authority boundary

Greenways OS issues narrowly scoped grants constrained by node identity, application identity and version, publisher, HAL lock digest, namespace, collection, operation, byte limit, and retention policy. Tahto validates and enforces those grants but does not mint OS authority.

Private signing keys remain non-extractable where supported. Pairing a device with a node does not grant administrator authority. Migration must never silently copy administrator credentials, private keys, or grants.

## Protocol and storage boundary

Tahto core defines application-neutral node, device, application, namespace, collection, object, commit, head, backup, receipt, service, and job records. Applications store opaque or schema-versioned payloads behind those records and own reconciliation.

A synchronized head and an immutable backup point are different records. A backup pins a complete verified object closure; it is not merely another mutable synchronization cursor.

The closed initial collection-mode vocabulary is:

```text
snapshot/1
 event-log/1
 object-graph/1
 git-dag/1
 derived/1
```

`derived/1` collections are rebuildable and are excluded from normal replication unless an application explicitly requests otherwise and receives a grant.

## Migration

The first release train is ordered:

1. Hara hard-cuts live `tahto.*` compiler/runtime namespaces to `lang.*`.
2. Hara writes `:lang/*` compiler metadata and reads legacy `:tahto/*` only for one bounded compatibility release.
3. This ADR and the ownership registries merge.
4. `greenways-ai/tahto` is initialized.
5. Tahto 0.1 introduces local application-neutral objects, commits, heads, backups, device sync, services, and jobs.
6. Greenways OS adds a resident Fabric service and exact application grants.
7. Historia becomes the golden end-to-end vertical before Hestia, Worlds, or Spaces are migrated.

## Compatibility

One bounded migration release may retain:

- legacy Hara `:tahto/*` metadata readers while writing only `:lang/*`;
- Beacon executable and discovery aliases pointing to Tahto;
- explicit re-enrolment from stored Beacon settings into a pinned Tahto node identity;
- Historia port `4319` as a standalone compatibility application;
- Hestia Connector as a migration surface;
- `gw-spaces` as the repository name until the Spaces application boundary is merged.

No forwarding `tahto.*` compiler namespaces are permitted.

## Conformance gates

### Gate A — name and architecture

No fabric protocol code merges until Hara no longer exposes live `tahto.*` compiler namespaces, new compiler records no longer write `:tahto/*`, this ADR is merged, and the Tahto repository exists.

### Gate B — application-neutral Tahto node

Two devices must exchange only missing objects, commit signed heads, preserve divergent successors, create a complete backup point, restore the exact pinned root, and reject tampering, stale sequences, and replayed nonces.

### Gate C — generic Greenways OS application

A HAL application must declare source and derived collections, receive access only to the exact source collection, write offline through a signed outbox, synchronize later, create and restore a backup, and remain unable to read another application's namespace.

### Gate D — Historia golden vertical

A Historia Git archive created in one OS profile must synchronize to a user-controlled Tahto node, restore into another profile, pass `git fsck`, rebuild derived indexes, and answer the same query with the same original source revisions. Tahto receives no user private key and Greenways Space is not required.

## Consequences

- Hestia ceases to be the general Greenways storage or home-node boundary.
- Ignatius remains the canonical chain evaluator; Tahto replicates closures and snapshots without executing them.
- Hodos remains a storage-neutral world ABI; Tahto support is delivered through adapter packages.
- Spaces becomes an application-level composition of permitted Tahto namespaces rather than the authority behind Beacon.
- The public Greenways suite brand belongs in `greenways-ai/www`; Tahto is presented as infrastructure beneath the suite.

## Not included

This decision does not define application payload schemas, generic merge semantics, public publication policy, worker implementation code, remote executable installation, or mandatory hosted infrastructure.
