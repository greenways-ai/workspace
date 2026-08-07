#!/usr/bin/env python3
"""Inspect and verify a Greenways cross-repository release-train matrix."""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[2]
DEFAULT_MATRIX = ROOT / "compatibility" / "tahto-0.1.json"
REQUIRED_DOCUMENTS = (
    "ARCHITECTURE.md",
    "docs/adr/0001-greenways-os-over-tahto.md",
    "docs/adr/0002-hara-workspace-hodos-projection-greenways-studio.md",
    "docs/architecture/repository-ownership.md",
    "docs/architecture/protocol-ownership.md",
)


def run_git(*arguments: str, check: bool = True) -> str:
    result = subprocess.run(
        ["git", "-C", str(ROOT), *arguments],
        check=False,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    if check and result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or "git command failed")
    return result.stdout.strip()


def load_matrix(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as handle:
        matrix = json.load(handle)
    if matrix.get("protocol") != "greenways.release-train/1":
        raise ValueError("unsupported release-train protocol")
    if not matrix.get("release"):
        raise ValueError("matrix has no release identifier")
    if not isinstance(matrix.get("pins"), list) or not matrix["pins"]:
        raise ValueError("matrix must contain at least one pin")
    architecture = matrix.get("architecture")
    if not isinstance(architecture, str) or not architecture:
        raise ValueError("matrix has no architecture document")
    return matrix


def gitlink(path: str) -> str | None:
    output = run_git("ls-tree", "HEAD", "--", path, check=False)
    if not output:
        return None
    metadata, actual_path = output.split("\t", 1)
    mode, kind, sha = metadata.split()
    if actual_path != path or mode != "160000" or kind != "commit":
        return None
    return sha


def submodule_url(path: str) -> str | None:
    output = run_git(
        "config",
        "-f",
        ".gitmodules",
        "--get",
        f"submodule.{path}.url",
        check=False,
    )
    return output or None


def normalized_repository(value: str) -> str:
    value = value.strip()
    if value.startswith("git@github.com:"):
        value = "https://github.com/" + value[len("git@github.com:") :]
    parsed = urlparse(value)
    if parsed.scheme and parsed.netloc:
        value = f"{parsed.netloc}{parsed.path}"
    value = value.removeprefix("github.com/").removesuffix(".git").strip("/")
    return value.lower()


def inspect_pin(pin: dict) -> tuple[bool, list[str]]:
    messages: list[str] = []
    path = pin.get("path")
    expected_sha = pin.get("sha")
    repository = pin.get("repository")
    if not all(isinstance(value, str) and value for value in (path, expected_sha, repository)):
        return False, ["pin requires non-empty path, sha, and repository"]

    actual_sha = gitlink(path)
    if actual_sha is None:
        messages.append("missing or non-gitlink workspace path")
    elif actual_sha != expected_sha:
        messages.append(f"pin drift: expected {expected_sha}, found {actual_sha}")

    url = submodule_url(path)
    if url is None:
        messages.append("missing .gitmodules URL")
    elif normalized_repository(url) != normalized_repository(repository):
        messages.append(f"repository mismatch: expected {repository}, found {url}")

    return not messages, messages


def status(matrix: dict, *, check: bool, require_gates: bool) -> int:
    errors: list[str] = []
    print(f"Release: {matrix['release']}")
    print(f"Status:  {matrix.get('status', 'unknown')}")
    print()
    print("Pinned repositories:")
    for pin in matrix["pins"]:
        ok, messages = inspect_pin(pin)
        marker = "OK" if ok else "DRIFT"
        print(f"  [{marker:5}] {pin['id']:<18} {pin['path']:<30} {pin['sha'][:12]}")
        for message in messages:
            print(f"          {message}")
            errors.append(f"{pin.get('id', pin.get('path'))}: {message}")

    documents = list(REQUIRED_DOCUMENTS)
    architecture = matrix.get("architecture")
    if architecture not in documents:
        documents.append(architecture)

    print()
    print("Architecture documents:")
    for relative in documents:
        exists = (ROOT / relative).is_file()
        print(f"  [{'OK' if exists else 'MISS':5}] {relative}")
        if not exists:
            errors.append(f"missing required document: {relative}")

    gates = matrix.get("gates", [])
    print()
    print("Gates:")
    blocked: list[str] = []
    for gate in gates:
        gate_status = gate.get("status", "unknown")
        print(f"  [{gate_status.upper():11}] {gate.get('id', '?')}: {gate.get('description', '')}")
        evidence = gate.get("evidence")
        if evidence:
            print(f"                {evidence}")
        if gate_status != "passed":
            blocked.append(str(gate.get("id", "?")))

    candidates = matrix.get("candidates", [])
    if candidates:
        print()
        print("Unpinned candidates:")
        for candidate in candidates:
            print(
                "  "
                f"{candidate.get('id', '?'):<20} "
                f"{candidate.get('repository', '?')}#"
                f"{candidate.get('pullRequest', '?')} "
                f"({candidate.get('status', 'unknown')})"
            )

    if require_gates and blocked:
        errors.append("architectural gates are not passed: " + ", ".join(blocked))

    if errors:
        print()
        heading = "Release-train check failed" if check else "Release-train warnings"
        print(f"{heading}:")
        for error in errors:
            print(f"  - {error}")
        return 1 if check else 0

    print()
    print("Release-train structure is consistent.")
    if blocked:
        print("Promotion remains blocked by: " + ", ".join(blocked))
    return 0


def parser() -> argparse.ArgumentParser:
    command = argparse.ArgumentParser()
    command.add_argument("--matrix", type=Path, default=DEFAULT_MATRIX)
    command.add_argument("--check", action="store_true")
    command.add_argument("--require-gates", action="store_true")
    return command


def main(argv: list[str] | None = None) -> int:
    arguments = parser().parse_args(argv)
    try:
        matrix = load_matrix(arguments.matrix)
        return status(
            matrix,
            check=arguments.check or arguments.require_gates,
            require_gates=arguments.require_gates,
        )
    except (OSError, ValueError, RuntimeError, json.JSONDecodeError) as error:
        print(f"release-train matrix error: {error}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
