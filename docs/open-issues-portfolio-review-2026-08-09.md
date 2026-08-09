# Greenways open-issues portfolio review

**Review date:** 9 August 2026

**Scope:** All 100 open issues across the `greenways-ai` GitHub organization,
with `greenways-ai/workspace` treated as the coordination layer for the wider
ecosystem.

## Executive view

Greenways is in a major architectural consolidation phase:

- Hara/HAL is becoming the canonical semantic and orchestration layer.
- Native implementations are being reduced to generic, application-neutral
  capabilities.
- Hodos is becoming the shared projection, UI, and interoperability layer.
- Hoplite is becoming the production data plane.
- Tahto is becoming the content-addressed semantic state fabric.
- Ignatius is becoming the consequential-work and agent-workflow layer.
- Alumbra, Hestia, Historia, and Statstrade are product-level proving grounds.

The direction is coherent and increasingly well documented. The principal
risk is not technical incoherence; it is portfolio overload and sequencing.
There are 100 open issues, none assigned, none attached to milestones, 74
without discussion, and only four open pull requests.

## Portfolio inventory

| Repository | Open | Current concern | Main risk |
|---|---:|---|---|
| `v2` | 40 | Statstrade database, product, deployment, and operations | Large inherited backlog obscures immediate release blockers |
| `ignatius` | 22 | Core/adapters/apps split and agent-workflow vertical | Overlapping architectural plans without an explicit critical path |
| `alumbra` | 9 | Voxel engine, persistence, Hara rules, and playable product | Product ambition is ahead of storage/runtime foundations |
| `tahto` | 8 | Semantic Fabric completion and production proof | Transitional native implementation cannot yet be removed |
| `hodos` | 7 | Dev/2D/3D/audio/connectors projection layer | Broad UI migration can become an integration bottleneck |
| `hoplite` | 5 | Generic blob, response, CAS storage, and compiler-free workers | Infrastructure bottleneck for several repositories |
| `workspace` | 2 | Release-train boundaries and social-card rollout | Coordination records lack machine-readable dependency/status tracking |
| `greenways-os` | 2 | Hodos authority services and trusted AI bridge | Capability and consent boundaries need concrete security profiles |
| `historia` | 2 | Replace Bun with Hara; publish historian package | Runtime migration and packaging are not tied to a release milestone |
| `agent-flow` | 2 | Codex/Kimi skill synchronization | Tooling drift between editing environments |
| `hestia` | 1 | Signed agent profiles and private rooms | Product depends on unfinished identity/state infrastructure |

The live inventory is available through the
[organization open-issue search](https://github.com/search?q=org%3Agreenways-ai+is%3Aissue+is%3Aopen&type=issues).

## What is happening

### 1. Architecture is converging on HAL-first ownership

The most consistent theme is moving domain meaning, deterministic transitions,
validation, recovery policy, and orchestration into portable Hara programs.

Examples include:

- [Hoplite #39](https://github.com/greenways-ai/hoplite/issues/39): application
  semantics in HAL with generic native mechanics beneath them.
- [Tahto #17](https://github.com/greenways-ai/tahto/issues/17): prove provider
  parity and delete transitional Tahto-native code.
- [Ignatius #64](https://github.com/greenways-ai/ignatius/issues/64): move
  canonical agent planning from Python adapters into Hara.
- [Historia #65](https://github.com/greenways-ai/historia/issues/65): replace
  the Bun application runtime with Hara.

This reduces semantic duplication and should make runtime behavior portable
across Rust, browser, Java, and production workers. The danger is attempting
too many migrations simultaneously before the generic runtime boundaries are
stable.

### 2. Generic capabilities are replacing application-specific native services

The dependency spine is becoming:

```text
Hara/HAL semantics
        ↓
std.work orchestration
        ↓
generic capability contracts
        ↓
Hoplite/native providers
```

The most important capability work is:

- [Hoplite #41](https://github.com/greenways-ai/hoplite/issues/41): staged
  blobs.
- [Hoplite #42](https://github.com/greenways-ai/hoplite/issues/42): work-scoped
  response sources.
- [Hoplite #45](https://github.com/greenways-ai/hoplite/issues/45): durable
  opaque compare-and-swap.
- [Hoplite #22](https://github.com/greenways-ai/hoplite/issues/22):
  compiler-free HBC workers.
- [Ignatius #65](https://github.com/greenways-ai/ignatius/issues/65): replace
  the SQLite workflow spool with the `std.work` storage boundary.
- [Ignatius #66](https://github.com/greenways-ai/ignatius/issues/66): generate
  host adapters from Hara protocols.

This is the most strategically valuable work in the portfolio. It creates one
reusable execution and data plane instead of separate Tahto, Ignatius,
Historia, and product implementations.

### 3. Tahto is moving from object custody to semantic state

The [Semantic Fabric epic](https://github.com/greenways-ai/tahto/issues/29) is
past its initial model and admission slices. The remaining sequence is:

1. [#32](https://github.com/greenways-ai/tahto/issues/32): stable indexes and
   complete roots.
2. [#33](https://github.com/greenways-ai/tahto/issues/33): commits, heads, and
   metadata CAS.
3. [#34](https://github.com/greenways-ai/tahto/issues/34): bounded
   canonical-value verification.
4. [#35](https://github.com/greenways-ai/tahto/issues/35): authenticated
   read/prepare/submit operations.
5. [#36](https://github.com/greenways-ai/tahto/issues/36): signed two-device
   production transfer.
6. [#17](https://github.com/greenways-ai/tahto/issues/17): final parity proof
   and native-code deletion.

This is one of the better-structured trains. Its main risk is its
cross-repository dependency on Hoplite production providers. Pure HAL behavior
can progress independently, but completion depends on restart-safe filesystem,
SQLite, and HTTP proof.

### 4. Hodos is becoming the common user-facing projection layer

[Workspace #5](https://github.com/greenways-ai/workspace/issues/5) and
[Hodos #17](https://github.com/greenways-ai/hodos/issues/17) define a sensible
ownership boundary:

- Hara owns portable Workspace semantics and runtime services.
- Hodos owns Dev, 2D, 3D, audio, and connector projections.
- Greenways Studio and products compose Hodos.
- Greenways OS retains installation, consent, credentials, and privileged
  authority.

The active migration is [Hodos #19](https://github.com/greenways-ai/hodos/issues/19):
editor, REPL, preview, diagnostics, and catalog surfaces.

The direction is sound, but Hodos has a very wide mandate. Dev tooling, 2D,
3D, audio, and service connectors could each become substantial projects.
Without a narrow first distribution and compatibility matrix, Hodos may become
the integration point that blocks everything else.

### 5. Ignatius is shifting from broad architecture to a reference vertical

Ignatius has several overlapping backlog layers:

- foundational topics such as provenance, merge policies, VM behavior,
  projections, and attestations;
- an agent-workflow vertical beginning at
  [#41](https://github.com/greenways-ai/ignatius/issues/41), continuing through
  phases [#43–#47](https://github.com/greenways-ai/ignatius/issues/43), and
  releasing through [#48](https://github.com/greenways-ai/ignatius/issues/48);
- the Core/adapters/applications decomposition in
  [#51](https://github.com/greenways-ai/ignatius/issues/51) through
  [#54](https://github.com/greenways-ai/ignatius/issues/54);
- consolidation work in
  [#64](https://github.com/greenways-ai/ignatius/issues/64),
  [#65](https://github.com/greenways-ai/ignatius/issues/65),
  [#66](https://github.com/greenways-ai/ignatius/issues/66), and
  [#69](https://github.com/greenways-ai/ignatius/issues/69).

Using one reference application to force the Core/adapters/application
boundary to become concrete is a positive trend. The risk is duplicate
planning: the roadmap, architecture split, phase train, and adapter-generation
issues need one explicit dependency graph and one “next merge” pointer.

### 6. Alumbra is the specialist-engine proof

Alumbra's issues progress from bootstrap through playable movement and
collision, package-driven Hara rules, durability and Tahto-backed realms, Hara
rule execution, history, content-addressed persistence, and dynamic chunk
residency and meshing.

The architectural rule that Alumbra depends on Hodos, never the reverse, is
clear. The risk is foundation timing. Product and worker work such as
[Alumbra #28](https://github.com/greenways-ai/alumbra/issues/28) depends on
generic storage, runtime, and projection capabilities still being built
elsewhere. Advancing gameplay code too far now may cause adapter churn.

### 7. Statstrade has a distinct older operational backlog

`v2` contains 40% of all open issues. It combines product epics, database and
market behavior, deployment and environment management, PostgreSQL DSL
tooling, operational risk, observability, and infrastructure diagnostics.

The most immediate concerns are:

- [#74](https://github.com/greenways-ai/v2/issues/74): production deployment
  pipeline.
- [#95](https://github.com/greenways-ai/v2/issues/95): restore backend test
  signal.
- [#101](https://github.com/greenways-ai/v2/issues/101): PostgreSQL DSL
  linting rollout.
- [#109](https://github.com/greenways-ai/v2/issues/109): PostgREST
  compatibility testing.
- [#70](https://github.com/greenways-ai/v2/issues/70): risk register, already
  marked as a source for concrete tasks rather than a directly implementable
  epic.

The principal risk is mixed abstraction levels. Reference plans, epics,
release blockers, and implementation tasks remain open together, making the
actual production path harder to see.

## Observable trends

### Positive trends

- Architectural boundaries are documented more explicitly.
- Application-specific native code is being challenged and removed.
- Content addressing, immutable evidence, exact package identity, and CAS
  appear consistently.
- Restart, replay, idempotency, and recovery are treated as core laws.
- Recent delivery velocity is high: 76 issues were closed in the last 30 days,
  including 27 since 6 August.
- Product projects increasingly serve as conformance proofs for generic
  infrastructure.

### Concerning trends

- Issue creation is outrunning execution: 57 currently open issues were
  created since 6 August.
- There are only four open pull requests; two are older `v2` PRs and one is an
  old unrelated PR.
- No open issue has an assignee.
- No open issue has a milestone.
- 74 issues have no comments.
- 56 issues have no labels.
- Several repositories define overlapping epics without a shared,
  machine-readable dependency graph.
- Completion is often described as extensive conformance proof, but no
  organization-level dashboard shows which proof gates are currently green.

## Risk assessment

### Critical: portfolio sequencing and ownership

The system has a plausible architecture but no visible portfolio scheduler.
With 100 unassigned and unmilestoned issues, priority is encoded mainly in
prose.

The likely consequence is parallel work landing in the wrong order, producing
rebases, duplicate implementations, and superseded PRs. Tahto PR #42 was a
recent concrete example.

Mitigations:

- Assign an accountable owner to every active issue.
- Put only the next 10–15 issues into active milestones.
- Add explicit `blocked-by` and `unblocks` relationships.
- Give every epic a single “next merge” field.

### Critical: Hoplite is a cross-project bottleneck

Tahto production proof, Ignatius durable workflow, signed devices, Historia
runtime behavior, and product serving depend on the same generic capabilities.
If Hoplite #39 slips, several repositories can look locally complete while
remaining unusable in production.

Mitigations:

- Treat Hoplite #39 as the primary infrastructure release train.
- Publish a capability matrix for blob, store, response source, signature, and
  HBC boot.
- Require downstream projects to target deterministic memory profiles until a
  provider is certified.

### High: dual implementations and migration-state ambiguity

Tahto still carries frozen native migration evidence. Other repositories are
moving from Python, Bun, or custom SQLite paths to Hara and `std.work`.

Risks include behavior divergence, twice the conformance burden, accidental
feature additions to transitional implementations, and unclear production
authority.

Mitigations:

- Give every transitional implementation a deletion issue and final
  milestone.
- Prevent feature additions to frozen implementations in CI.
- Publish exact parity fixtures shared by old and new paths.

### High: security and capability-boundary expansion

Upcoming work includes signed devices, private rooms, AI capability bridges,
GitHub mutation adapters, keyring connectors, and object-store/response
handles. The architecture consistently says handles are not authority and
Greenways OS owns consent, but several issues remain specifications rather than
tested profiles.

Mitigations:

- Prioritize negative conformance: cross-work handle substitution, replay,
  stale lease, revoked device, digest mismatch, and privilege escalation.
- Keep the Playground AI bridge in
  [Greenways OS #26](https://github.com/greenways-ai/greenways-os/issues/26)
  read-only until explicit grants and audit evidence are proven.
- Require exact provider evidence in Ignatius reviews before automated
  consequential actions.

### High: production proof trails semantic implementation

The portfolio is rich in models, protocols, and deterministic fixtures. The
thinner area is end-to-end production evidence: restart-safe storage, real
worker/provider registration, signed two-device transfer, bounded streaming,
compiler-free boot, and deployed environment smoke testing.

Mitigations:

- Make Hoplite #39, Tahto #36, and `v2` #74 explicit P0 release gates.
- Delay additional product breadth until one complete
  upload/store/restart/retrieve flow is green.

### Medium-high: Hodos scope expansion

Hodos is expected to absorb Dev, 2D, 3D, audio, and connectors while
maintaining compatibility.

Mitigations:

- Release Hodos in narrow profiles: Dev first, then 2D, then an
  external-engine 3D proof, then audio/connectors.
- Avoid extracting generic contracts until at least two consumers demonstrate
  the same need.
- Keep compatibility adapters time-bounded.

### Medium-high: Statstrade backlog obscures current truth

Many `v2` issues are migrated plans or reference documents rather than directly
actionable work.

Mitigations:

- Close reference-only issues after extracting concrete tasks.
- Split active release, next, and archive/reference milestones.
- Prioritize backend test signal and deployment correctness before new market
  and product features.

### Medium: release and documentation hygiene

[Workspace #4](https://github.com/greenways-ai/workspace/issues/4) shows that a
shared asset delivery contract created a cross-repository failure domain
without rendered-output checks. Shared contracts require consumer-side
verification, not only producer CI.

## Recommended execution order

1. **Stabilize the infrastructure spine.** Complete the Hoplite
   blob/store/response/HBC gates and Hara `std.work` storage and host-adapter
   boundaries.
2. **Finish one production proof.** Complete Tahto's signed two-device upload,
   restart, and retrieval flow, then remove native metadata after parity.
3. **Complete one consequential-work vertical.** Take the Ignatius agent
   workflow from planning through reviewed promotion using the same `std.work`
   and provider-evidence contracts.
4. **Land the Hodos Dev distribution.** Complete editor, REPL, preview, and
   diagnostics before broadening 3D/audio scope.
5. **Restore Statstrade release confidence.** Restore backend tests, generated
   SQL reproducibility, and protected testing deployment before expanding
   market features or infrastructure diagnostics.
6. **Advance product proofs.** Then progress Alumbra external-engine
   integration, Hestia signed private rooms, and Historia runtime migration.

## Bottom line

The project is not directionless. The architecture is converging around a
strong set of principles: HAL-first semantics, generic capabilities, immutable
evidence, bounded authority, and restart-safe workflows.

The danger is that the organization is behaving like it has several
independent teams while the issue metadata shows no owners, milestones, or
active-work limits. The immediate improvement is less about inventing more
architecture and more about turning the existing architecture into a visible,
dependency-ordered release train.

The most important single decision would be to designate the
Hoplite-to-Tahto production proof as the primary cross-repository milestone,
with Ignatius and Hodos as the next two vertical validations.
