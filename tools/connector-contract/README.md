# Connector contract checker

This workspace-owned Hara project checks connector-first contract inputs
without GitHub credentials, network access, Project metadata, or fresh
connector retrieval. The public API is
`connector.contract/check-contract`.
Implementation lives in `workspace/tools/connector-contract`; it does not edit
`hara-lang/hara`, so root integration can be verified separately.

## Invocation

From the workspace root, run the deterministic fixture report:

```shell
make connector-contract-check
```

The target is read-only: it checks the project, emits the deterministic
fixture report, and runs the path-matched native test file. To run only the
paired behavioral tests:

```shell
technology/hara/core/rust/target/debug/hara-test \
  --root "$PWD/tools/connector-contract" \
  "$PWD/tools/connector-contract/test/connector/contract/checker_test.hal"
```

## Input contract

`check-contract` accepts a map containing:

```hara
{:kind :catalog
 :source "document text"
 :links ["https://github.com/greenways-ai/workspace"]
 :access :public
 :readiness :ready
 :validation-map {:status :documented :commands ["make projects-test"]}}
```

Supported kinds are `:catalog`, `:issue-form`, `:pull-request`, and
`:repository-instruction`. Catalogs also provide `:repositories`, whose rows
contain `:alias`, `:url`, `:responsibility`, `:connector-entry`,
`:validation-authority`, `:access`, `:readiness`, and `:validation-map`.

Links must use `https://github.com/` and a canonical `greenways-ai` or
`hara-lang` owner. Current repository names must match their URL. Retired
aliases are reported with their replacements. The current Hara repository
aliases include `hara-build`, `hara-play`,
`hara-learn`, and `hara-specs-registry`; the checker also verifies the
Greenways `workspace` and `greenways-platform` coordinates.

- `hara-specs` → `hara-specs-registry`
- `hara-playground` → `hara-play`
- `hara-world` → `hara-learn`

Incomplete issue and pull-request contracts must declare `Advances`.
`Closes`-only relationships are rejected unless the input has
`:complete? true`.

Reports contain `:status` (`:pass` or `:fail`), `:valid?`, normalized
classifications, a stable sorted `:findings` vector, and an error summary.
Access-gated entries pass when their `:access`, `:readiness`, and
`:validation-map` explicitly classify the gate; authorization itself remains
outside this checker.

Finding codes classify failures as `:section/missing`, `:section/duplicate`,
`:section/empty`, `:link/noncanonical`, `:repository/stale-alias`,
`:validation-map/missing`, `:classification/*`, or
`:relationship/*`. Every finding also contains a stable `:path`, `:severity`,
and human-readable `:message`.

## Deterministic fixtures

`src/connector/contract/fixtures.hal` covers passing catalog, issue-form,
pull-request, and repository-instruction documents plus missing fields,
duplicate, empty, and malformed sections, stale aliases, invalid links, Closes-only
relationships, missing validation maps, and an explicit access-gated entry.
