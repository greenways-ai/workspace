# Protocol ownership registry

This registry prevents protocol names, record vocabularies, and executable boundaries from drifting across repositories.

## Reserved namespaces

| Namespace or vocabulary | Owner | Rule |
|---|---|---|
| `lang.*` and `:lang/*` | `hara-lang/hara` | Hara compiler/runtime namespaces and serialized language metadata |
| `workspace.*`, `:workspace/*`, and `workspace.component/1` | `hara-lang/hara` | Portable Workspace state, events, projected component data, extension routing, views and effects |
| `gw.hodos.*`, `hodos.*` component IDs, and Hodos world ABI contracts | `greenways-ai/hodos` | Concrete Dev, 2D, 3D, audio and Greenways UI projections; Tahto support remains a storage-neutral connector |
| `gw.studio.*` and Greenways Studio product profiles | Greenways Studio distribution | Branded creative-product semantics assembled above Hodos; these names do not belong in Hara core |
| `tahto.*` and `:tahto/*` | `greenways-ai/tahto` after Gate A | Fabric implementation namespaces and application-neutral wire/storage records |
| Historia archive and retrieval schemas | `greenways-ai/historia` | Tahto stores and routes them but does not interpret or reconcile them |
| Hestia room, mandate, approval, document, and receipt schemas | `greenways-ai/hestia` | Tahto preserves signed records; Hestia defines their meaning |
| Ignatius transaction, cell, block/state-root, reducer, and snapshot schemas | `greenways-ai/ignatius` | Tahto may replicate closures; Ignatius validates and executes them |
| Spaces membership, invitation, mount, and publication schemas | `greenways-ai/gw-spaces` | Tahto supplies namespaces and transfer; Spaces defines collaboration semantics |
| OS capability and grant vocabulary | `greenways-ai/greenways-os` | Tahto and Hodos may present requests; only the OS authority grants installed applications privileged access |

Hara's legacy `tahto.*` compiler/runtime namespaces must be hard-moved to `lang.*`. No forwarding namespace is permitted. Hara may read legacy serialized `:tahto/*` compiler metadata for one bounded compatibility release, but new records write only `:lang/*`.

## Workspace component boundary

A `workspace.component/1` descriptor is inert Hara data. It may contain:

```text
trusted component ID
contract version
serializable component model
declared semantic event IDs
```

It cannot contain a factory, executable module, JavaScript URL, arbitrary HTML,
private browser handle, credential, private key, or installation instruction.
Hodos resolves component IDs only against packaged factories registered by the
host. Greenways OS separately decides whether the package is installed and what
privileged capabilities it may receive.

## Tahto core records

Tahto core owns only application-neutral versions of:

```text
tahto.node/1
tahto.device/1
tahto.application/1
tahto.namespace/1
tahto.collection/1
tahto.object/1
tahto.commit/1
tahto.head/1
tahto.backup/1
tahto.receipt/1
tahto.service/1
tahto.job/1
```

A `tahto.commit/1` identifies:

```text
application identity
namespace
collection
schema and version
device identity
parent commit roots
object roots
tombstones
sequence
timestamp
signature
```

It contains no Historia-, Hestia-, Worlds-, Spaces-, Hodos-, Workspace-, or Ignatius-specific field.

The closed initial collection-mode vocabulary is:

```text
snapshot/1
event-log/1
object-graph/1
git-dag/1
derived/1
```

New modes require a Tahto protocol PR and conformance fixtures. Applications cannot extend the core enum by embedding private mode names.

## Conflict law

Tahto preserves all valid divergent heads. Core Tahto must not:

- choose a winner through last-write-wins;
- synthesize an application merge commit;
- discard a valid branch because another device advanced first; or
- reinterpret an application tombstone.

Applications reconcile their own state and publish a new signed successor when appropriate.

## Source and derived state

Applications classify collections as authoritative source or rebuildable derived state. Derived collections are excluded from ordinary sync, backup, and replication by default. A request to retain derived state requires an explicit application declaration and OS grant.

Examples:

| Application | Authoritative | Normally derived |
|---|---|---|
| Historia | Git object closure, refs, import receipts, browser metadata, configuration | SQLite FTS, text graphs, topics, neural vectors, model cache, generated context bundles |
| Hestia | Signed profiles, delegations, mandates, room events, document revisions, approvals, receipts, encrypted attachments | Search indexes, rendered previews, transient awareness |
| Worlds | World revision manifests, source scenes, asset closures, attribution | Thumbnails, transcodes, renderer caches, generated previews |
| Ignatius | Transactions, canonical cells, roots, receipts, snapshots | PostgreSQL projections and query indexes |

## Worker and service boundary

A `tahto.service/1` descriptor is inert. It may identify:

```text
application
service protocol
worker version
package or binary digest
allowed collections
allowed operations
resource policy
```

It cannot introduce executable content into Greenways OS. Worker implementation remains in the application repository and is installed through a separately authorized distribution path.

## Remote-code prohibition

Tahto descriptors, Workspace descriptors and hosted catalogues must never cause Greenways OS to install or execute remote JavaScript, HTML, HAL, arbitrary Wasm, or native commands. Browser modules are reviewed Greenways OS code or verified HAL packages installed under OS authority.

## Device and grant boundary

A paired device receives only the grants explicitly issued to it. Device enrolment does not imply node administration. Canonical request signing, nonces, sequence checks, idempotency keys, application identity, namespace, collection, operation, byte limits, and retention constraints are independently enforced.

## Backup boundary

A synchronized head and an immutable backup point are distinct records. A backup must pin a complete verified closure and produce a restore manifest and storage receipt. Retention labels do not alter application history or merge semantics.

## Compatibility aliases

During bounded migrations, compatibility names may route reviewed callers to a canonical namespace or package. Aliases must not preserve former ownership, install code, grant authority, or turn an application-specific implementation into a core protocol.
