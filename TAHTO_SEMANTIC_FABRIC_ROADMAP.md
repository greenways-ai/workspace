# Tahto Semantic Fabric: Current Coordination Pointer

**Kind:** live status pointer  
**Updated:** 9 August 2026  
**Implementation repository:** [`greenways-ai/tahto`](https://github.com/greenways-ai/tahto)  
**Implementation baseline:** `32a560e8a3841dcacd6aa7d70dd7e2a992ac8b69`  
**Current machine-readable status:** [`compatibility/semantic-fabric-current.json`](compatibility/semantic-fabric-current.json)  
**Tracking epic:** [`greenways-ai/tahto#29`](https://github.com/greenways-ai/tahto/issues/29)

The file previously stored at this path was a dated implementation roadmap
anchored to Tahto `de0b0db`. It is preserved byte-for-byte as
[`docs/snapshots/tahto-semantic-fabric-roadmap-2026-08-09.md`](docs/snapshots/tahto-semantic-fabric-roadmap-2026-08-09.md).
It remains useful historical context, but it is not authoritative for current
implementation status.

See [`docs/status-authority.md`](docs/status-authority.md) for the workspace rule
that separates adopted architecture, current implementation evidence, live
compatibility/status records, dated roadmaps and advisory reviews.

## Current phase

Tahto is in **late kernel / early production integration**.

```text
Tahto semantic kernel       substantially complete
Signed mutation path        substantially complete
Pairing and host ingress    substantially complete
Production service surface  incomplete
Spec-package enforcement    incomplete
Two-device recovery gate    incomplete
```

## Ready on Tahto `main`

- semantic schema references, stable identities and typed links;
- semantic-object admission into the existing object graph;
- stable semantic indexes and complete roots;
- semantic roots through unchanged commits, heads and divergent history;
- bounded branch-preserving `semantic.read`;
- deterministic `semantic.prepare`;
- atomic `semantic.submit` through TAHTO-7 and one generic `hara.store` CAS;
- durable one-time pairing, P-256 evidence, CLI routes and Greenways OS client;
- the generic `hara.value` contract and Tahto adapter.

## Remaining release train

### 1. Exact value and specification enforcement

```text
greenways-ai/hoplite#80
  -> greenways-ai/hoplite#82
  -> greenways-ai/tahto#34 follow-up
```

This must prove both canonical byte identity and acceptance by the exact locally
installed specification package and exported validator entry.

### 2. Installed semantic service

```text
greenways-ai/tahto#65  route ↔ signed-operation mapping
greenways-ai/tahto#66  required semantic authentication realm
greenways-ai/tahto#67  selected value ↔ existing response-source path
```

The pure operation kernels are already implemented and must not be recreated in
these service slices.

### 3. Production boot and two-device proof

```text
greenways-ai/hoplite#22
greenways-ai/tahto#58
greenways-ai/tahto#36 and #47
```

The composed proof is signed device A publication, worker/container recreation,
independent signed device B closure retrieval, full and ranged byte access, and
negative replay/revocation/corruption/lost-result cases.

### 4. Release closure

```text
greenways-ai/tahto#19  pure-HAL manifest interpretation
greenways-ai/tahto#17  divergence, application merge, backup, fresh restore,
                       exact revalidation and deletion of native/
```

## Authority notes

- [`docs/adr/0001-greenways-os-over-tahto.md`](docs/adr/0001-greenways-os-over-tahto.md)
  is adopted architecture.
- Tahto protocol documents, Hara source, tests and current GitHub issues are the
  implementation authority.
- [`compatibility/semantic-fabric-current.json`](compatibility/semantic-fabric-current.json)
  is the current workspace status matrix.
- [`docs/ecosystem-simplification.md`](docs/ecosystem-simplification.md) is an
  advisory architectural review, not an adopted merger of domain protocols.
- [`docs/open-issues-portfolio-review-2026-08-09.md`](docs/open-issues-portfolio-review-2026-08-09.md)
  is a dated portfolio snapshot. Its sequencing warning remains useful; its
  counts are not live status.
