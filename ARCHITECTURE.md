# Greenways architecture

This workspace is the integration authority for the Greenways release train.
The current target is **Greenways OS over the Tahto Fabric**:

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

The architectural decision and its enforceable ownership boundaries are recorded in:

- [`docs/adr/0001-greenways-os-over-tahto.md`](docs/adr/0001-greenways-os-over-tahto.md)
- [`docs/architecture/repository-ownership.md`](docs/architecture/repository-ownership.md)
- [`docs/architecture/protocol-ownership.md`](docs/architecture/protocol-ownership.md)

## Dependency direction

```text
Applications ───────▶ Tahto SDK
Greenways OS ───────▶ Tahto client
Tahto control plane ▶ Hoplite / Hara
Tahto core ─────────▶ no application repositories
```

Application repositories may define optional Tahto workers and adapters. Tahto core must remain application-neutral. Greenways OS remains the authority for installation, consent, private keys, provider credentials, and application grants.

## Release-train rule

Cross-repository changes are delivered as small architectural pull requests with explicit gates. The workspace pins compatible revisions only after each repository-local contract is reviewable and its conformance fixtures exist.

The first gate prohibits fabric protocol merges until:

1. live Hara compiler/runtime namespaces no longer begin with `tahto.`;
2. new Hara compiler records no longer write `:tahto/*` metadata;
3. ADR 0001 is merged; and
4. `greenways-ai/tahto` has an initialized reviewable repository history.
