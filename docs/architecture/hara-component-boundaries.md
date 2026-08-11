# Hara component boundaries

The Hara runtime repository now owns only the unified language implementation,
shared Rust extension ABI, Java/Truffle runtime, HAL libraries, and runtime
build/release tooling. Workspace integrations resolve from
`HARA_WORKSPACE_ROOT` when set.

| Component | Workspace owner |
| --- | --- |
| Concrete runtime extensions and database providers | `extensions/hara-runtime` |
| Benchmark sources, evidence, and dashboard | `website/hara-benchmarks` |
| Site assembly and deployment | `website/hara-www` |
| CLI installer and release tooling | `technology/hara/scripts/runtime` |
| Homebrew formula generators | `infra/greenways-homebrew*` |
| Books | `website/hara-docs/docs/books` |
| Contribution formats | `technology/hara-specs-registry/00-unsorted/contrib` |
| Retired registry and platform services | `technology/hara-archive/retired` |

The migration used ordinary commits in each destination repository. The source
repository records deletions in its own history; destination repositories begin
with auditable snapshot commits rather than rewritten cross-repository history.
