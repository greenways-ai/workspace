# Workspace status and authority convention

The workspace contains architecture decisions, protocol documents, live
compatibility records, implementation roadmaps and portfolio reviews. They have
different authority and must not be treated as interchangeable current status.

## Document classes

| Class | Purpose | Status authority |
| --- | --- | --- |
| ADR | Records an adopted architectural decision and its ownership boundaries | Authoritative for architecture until superseded by another ADR |
| Protocol/source/tests | Defines and proves the current implementation contract in the owning repository | Authoritative for implemented behavior at the cited revision |
| Live compatibility/status record | Gives a machine-readable cross-repository snapshot and ordered release gates | Authoritative for workspace coordination at its `updatedAt` value |
| Roadmap snapshot | Preserves the plan and assumptions at one dated repository revision | Historical only; never authoritative for current completion state |
| Architectural review | Recommends consolidation or sequencing without adopting it | Advisory only |
| Portfolio review | Records issue counts, risks and sequencing observations at one date | Dated snapshot; counts are not live |

## Required metadata

A live compatibility/status record should identify:

```text
protocol
updatedAt
repository and exact commit
phase
architecture authority
current tracking issue
detailed component statuses
next merge
ordered release train
```

A historical roadmap should identify:

```text
kind: roadmap-snapshot
as-of repository and commit
authoritative for architecture: false
authoritative for current status: false
superseding live status record
```

An advisory review should state explicitly that it is not adopted architecture.
A portfolio review should be dated in both its filename and header.

## Update rule

When implementation passes a roadmap:

1. preserve the old roadmap byte-for-byte under `docs/snapshots/`;
2. replace its live entry point with a coordination pointer;
3. update the machine-readable compatibility/status record;
4. update owning-repository issues and discovery/status surfaces;
5. close duplicate or superseded issues and pull requests;
6. do not rewrite historical snapshots to make them appear current.

## Current Tahto example

- Adopted architecture:
  [`docs/adr/0001-greenways-os-over-tahto.md`](adr/0001-greenways-os-over-tahto.md)
- Current status:
  [`compatibility/semantic-fabric-current.json`](../compatibility/semantic-fabric-current.json)
- Current coordination pointer:
  [`TAHTO_SEMANTIC_FABRIC_ROADMAP.md`](../TAHTO_SEMANTIC_FABRIC_ROADMAP.md)
- Preserved snapshot:
  [`docs/snapshots/tahto-semantic-fabric-roadmap-2026-08-09.md`](snapshots/tahto-semantic-fabric-roadmap-2026-08-09.md)
- Advisory review:
  [`docs/ecosystem-simplification.md`](ecosystem-simplification.md)
- Dated portfolio review:
  [`docs/open-issues-portfolio-review-2026-08-09.md`](open-issues-portfolio-review-2026-08-09.md)
