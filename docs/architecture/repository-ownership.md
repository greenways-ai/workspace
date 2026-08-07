# Repository ownership matrix

This registry assigns one primary architectural responsibility to each repository. A repository may provide adapters to another layer, but it must not absorb the other layer's authority.

| Repository | Owned responsibility | Must not own |
|---|---|---|
| `greenways-ai/greenways-os` | OS, suite host, keyring, consent, application lifecycle, package verification, capability authority, Tahto client, and trusted surface registration | Remote custody, reusable Hodos UI implementation, application-specific server semantics, or remotely supplied executable catalogues |
| `greenways-ai/tahto` | Application-neutral objects, signed state commits, heads, sync, backup, restore, services, jobs, and replication | User private keys, OS installation authority, application reconciliation, or application payload meaning |
| `greenways-ai/historia` | Memory application, canonical archive format, retrieval semantics, provenance, and optional Tahto worker | Generic fabric storage policy or OS-level grants |
| `greenways-ai/gw-spaces` | Spaces application during migration; membership, invitations, mounted-collection policy, collaboration UX, and publication | Tahto core transport/custody or the umbrella Greenways product definition |
| `greenways-ai/hestia` | Identity, agent authority, rooms, documents, mandates, approvals, receipts, and evidence presentation | General Greenways home-node custody or generic chain execution |
| `greenways-ai/ignatius` | Canonical Hara-compatible chain, reducer contracts, signed execution, snapshots, and validation | Tahto replication policy or application projections |
| `greenways-ai/hodos` | Hara Workspace projection and interaction: Dev, 2D, 3D, audio, Greenways UI connectors, open world ABI, and replaceable source/asset/renderer contracts | Hara language or Workspace semantic authority, OS grants/keys/credentials, Tahto-specific storage in Core, or monolithic renderer/service implementations |
| `greenways-worlds/*` | Individual world content, attribution, asset closure, entry scene, and required Hodos profile | Tahto clients, OS grants, or renderer infrastructure |
| `greenways-ai/hoplite` | Hara application server, bounded streaming HTTP adapters, and Tahto control-plane host | Application custody semantics or request-selected storage/upstream authority |
| `hara-lang/hara` | Language, compiler, runtime, portable libraries, `workspace.*` HAL semantics, and generated runtime mirrors | Hodos or Greenways product UI, Greenways fabric semantics, application records, or reserved fabric vocabulary |
| `hara-lang/hara-ui` | Product-neutral browser services and low-level mechanisms: runtime transport, Workspace persistence, capabilities, add-on lifecycle, preview isolation, and editor primitives | Hodos visible projection ownership, Greenways Studio branding, OS authority, or provider-specific service policy |
| `hara-lang/hara-playground` | Hosted reference Hara Dev distribution, examples, learning activities and application-specific GitHub import | Canonical Workspace semantics or duplicate reusable Dev component implementations after migration |
| `greenways-ai/workspace` | Cross-repository integration pins, compatibility matrix, release-train gates, and coordinated conformance | Product runtime behavior or repository-local implementation authority |
| `greenways-ai/www` | Public Greenways OS suite brand and product narrative | Spaces-specific application architecture or Tahto protocol ownership |
| `greenways-ai/greenways-ai.github.io` | Open-source project map and technical documentation | Product authority or protocol implementation |
| `greenways-ai/visual-language` | Shared OS, Tahto, and application visual identities | Runtime behavior or protocol semantics |
| `greenways-ai/homebrew-tap` | Tahto node and Greenways product distribution | Application authority, keys, or fabric state |

## Downward dependency law

Allowed primary dependency direction:

```text
Applications ───────▶ Tahto SDK
Greenways OS ───────▶ Tahto client
Tahto control plane ▶ Hoplite / Hara
Tahto core ─────────▶ no application repositories

Playground / Live / Catalog / Greenways Studio
        ───────────▶ Hodos projections
Hodos ─────────────▶ Hara web services and Workspace contracts
Hara ──────────────▶ no Hodos or Greenways implementation packages
```

Additional rules:

- Application repositories may publish optional worker packages that implement an application-owned protocol.
- Tahto may register a worker by immutable package or binary digest, allowed collections, operations, and resource policy, but does not absorb its implementation.
- Hodos Tahto support belongs in connector packages such as `@greenways/hodos-connect-tahto`; Hodos Core remains storage-neutral.
- Greenways OS may approve and register packaged Hodos factories but retains installation and grant authority.
- `workspace.edn` describes installed composition; it does not install executable code or grant capabilities.
- Hara UI service packages may expose browser mechanisms but do not own the visible Hodos Workspace implementation.
- Ignatius Tahto support replicates canonical closures and snapshots; Ignatius remains the evaluator and validator.
- World content repositories contain manifests and assets only. They do not embed Tahto, Hodos UI factories, or Greenways OS client code.
- Greenways Space may host Tahto roles but remains optional to local Greenways OS applications.

## Change-control rule

A pull request that moves responsibility across this matrix must update ADR 0001, ADR 0002, or add a superseding ADR in the same release train. Repository-local convenience is not sufficient reason to cross an authority boundary.
