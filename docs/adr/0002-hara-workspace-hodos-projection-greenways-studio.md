# ADR 0002: Hara Workspace, Hodos projection, and Greenways Studio

- **Status:** Accepted for the `hodos-workspace-0.1` release train
- **Date:** 2026-08-07
- **Owners:** `hara-lang/hara`, `hara-lang/hara-ui`, `greenways-ai/hodos`, `greenways-ai/greenways-os`

## Context

The current browser development stack uses **Studio** for several unrelated
layers: Hara runtime modules, browser shell code, Playground state, Supersonic
audio integration, and Greenways product surfaces. At the same time, Hodos has
a proven add-on and trusted-surface model but is described primarily as a world
viewer. This makes ownership of Dev, 2D, 3D, audio and Greenways connectors
unclear and risks adding competing runtime, add-on and Workspace systems.

The desired implementation is HAL-first. Serializable state, semantic events,
view models and host-effect descriptions should be expressed in Hara. Browser
and native code should own non-serializable mechanics such as DOM focus,
editor widgets, workers, OPFS, Web Audio, WebGL and device handles.

## Decision

### Terminology

- **Hara Workspace** is the portable Hara model for layout, areas, documents,
  commands, extensions, sessions, links, semantic events, projected views and
  host effects.
- **Hara Dev** is a developer-oriented Workspace profile, not a separate
  Workspace model.
- **Hodos** is the concrete projection and interaction layer for Hara
  Workspaces. It owns reusable Dev, 2D, 3D, audio and Greenways service UI
  connectors.
- **Greenways Studio** is a branded creative product assembled from Hodos
  packages and Greenways services.
- **Greenways OS** remains the installation, package-verification, consent,
  keyring, credential and privileged capability authority.

### Dependency direction

```text
Hara workspace.* HAL
        ↓
@hara-lang/web-* services
        ↓
Hodos Web / Dev / 2D / 3D / Audio / Connectors
        ↓
Playground / Live / Catalog / Greenways Studio

Greenways OS
        └── supplies approved capabilities to installed Hodos connectors
```

Hara repositories must not depend on Hodos or Greenways implementations.
Hodos and Greenways packages may depend on published Hara contracts.

### Service and UI packages

Hara `web-*` packages own browser services and low-level mechanisms such as
runtime transport, Workspace persistence, capability dispatch, add-on
lifecycles, audio-resource management and preview isolation.

Packages that render or manage a visible component use a `-ui` suffix in new
Hodos package families, for example:

```text
@greenways/hodos-workspace-ui
@greenways/hodos-dev-ui
@greenways/hodos-2d-ui
@greenways/hodos-3d-ui
@greenways/hodos-audio-ui
```

### HAL-first component boundary

Hara owns the `workspace.component/1` data contract. A Workspace view may name a
trusted packaged component ID, provide a serializable model, and declare the
semantic events that component may emit. Hodos resolves the ID against a host
registry and manages mount, update and disposal.

A Workspace descriptor cannot provide a JavaScript URL, factory, executable
HTML, arbitrary Wasm, private key, credential or installation instruction.
Greenways OS may install verified HAL packages and reviewed browser modules
through its own separately authorised process.

### `workspace.edn`

`workspace.edn` describes composition and instances. It may reference installed
extension IDs, area types, component IDs, documents, nodes, connections and
links. It does not grant authority or install code. Unknown namespaced extension
data is preserved; missing installed components render inert placeholders.

### Migration

The migration is a release train of small PRs rather than a rename sweep:

1. add headless `workspace.*` semantics in Hara;
2. add neutral `@hara-lang/web-addons` and retain product-neutral web services;
3. add Hodos Web, Workspace UI and a HAL-driven Preview vertical slice;
4. adopt the Preview component in Playground;
5. migrate Dev and 2D surfaces;
6. organise existing Worlds packages under Hodos 3D;
7. add Hodos Audio and optional Supersonic connectors;
8. move Greenways visible connectors under Hodos without moving OS authority;
9. compose Greenways Studio explicitly.

Current `studio.*` runtime names and existing package exports may receive bounded
compatibility support while consumers move. Compatibility aliases do not change
ownership and are removed only after pinned consumers pass conformance.

## Consequences

- Hara remains usable without Hodos or Greenways.
- Hodos becomes broader than Worlds while retaining its replaceable source and
  renderer architecture.
- Playground and Live become Hodos Dev distributions rather than implementation
  authorities for reusable visible components.
- Greenways Studio can deeply integrate AI, keyring, Hestia, Historia,
  Supersonic and Hodos without embedding those products in Hara.
- Greenways OS continues to fail closed for uninstalled or unapproved code.
- The Workspace repository records exact compatible revisions only after each
  repository-local PR and conformance suite is reviewable.
