#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const manifestPath = joinFromRoot("assets/3d/logo-sources.json");
const allowedTargetRoot = joinFromRoot("assets/3d/source");

function joinFromRoot(path) {
  return resolve(root, path);
}

function assertRepositoryPath(path, label) {
  if (typeof path !== "string" || path.length === 0 || isAbsolute(path)) {
    throw new Error(`${label} must be a non-empty repository-relative path.`);
  }
  const resolved = joinFromRoot(path);
  if (resolved !== root && !resolved.startsWith(`${root}${sep}`)) {
    throw new Error(`${label} escapes the workspace: ${path}`);
  }
  return resolved;
}

function gitBlobSha(bytes) {
  return createHash("sha1")
    .update(`blob ${bytes.length}\0`)
    .update(bytes)
    .digest("hex");
}

async function currentBlobSha(path) {
  try {
    const bytes = await readFile(path);
    return { bytes, sha: gitBlobSha(bytes) };
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

async function importAsset(manifest, asset) {
  const sourcePath = asset.sourcePath;
  const targetPath = asset.targetPath;
  const target = assertRepositoryPath(targetPath, "targetPath");
  if (target !== allowedTargetRoot && !target.startsWith(`${allowedTargetRoot}${sep}`)) {
    throw new Error(`targetPath must be below assets/3d/source: ${targetPath}`);
  }
  if (!Number.isSafeInteger(asset.bytes) || asset.bytes <= 0) {
    throw new Error(`Invalid byte count for ${sourcePath}.`);
  }
  if (!/^[0-9a-f]{40}$/.test(asset.gitBlobSha ?? "")) {
    throw new Error(`Invalid Git blob SHA for ${sourcePath}.`);
  }

  const existing = await currentBlobSha(target);
  if (existing?.bytes.length === asset.bytes && existing.sha === asset.gitBlobSha) {
    console.log(`Current: ${targetPath}`);
    return;
  }

  const url = `https://raw.githubusercontent.com/${manifest.sourceRepository}/${manifest.sourceCommit}/${sourcePath}`;
  console.log(`Importing ${url}`);
  const response = await fetch(url, {
    headers: { "user-agent": "greenways-workspace-media-import/1" },
    redirect: "follow",
  });
  if (!response.ok) {
    throw new Error(`Could not download ${sourcePath}: HTTP ${response.status}.`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length !== asset.bytes) {
    throw new Error(`${sourcePath} is ${bytes.length} bytes; expected ${asset.bytes}.`);
  }
  const sha = gitBlobSha(bytes);
  if (sha !== asset.gitBlobSha) {
    throw new Error(`${sourcePath} has Git blob SHA ${sha}; expected ${asset.gitBlobSha}.`);
  }

  await mkdir(dirname(target), { recursive: true });
  const temporary = `${target}.importing`;
  await writeFile(temporary, bytes);
  await rename(temporary, target);
  const metadata = await stat(target);
  console.log(`Imported ${targetPath} (${metadata.size} bytes, ${sha}).`);
}

async function main() {
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  if (manifest.protocol !== "greenways.workspace-media-import/1") {
    throw new Error(`Unsupported import manifest protocol: ${manifest.protocol}`);
  }
  if (!/^[0-9a-f]{40}$/.test(manifest.sourceCommit ?? "")) {
    throw new Error("sourceCommit must be an immutable 40-character commit SHA.");
  }
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(manifest.sourceRepository ?? "")) {
    throw new Error("sourceRepository must be in owner/repository form.");
  }
  if (!Array.isArray(manifest.assets) || manifest.assets.length === 0) {
    throw new Error("The import manifest must contain at least one asset.");
  }

  const targets = new Set();
  try {
    for (const asset of manifest.assets) {
      if (targets.has(asset.targetPath)) {
        throw new Error(`Duplicate targetPath: ${asset.targetPath}`);
      }
      targets.add(asset.targetPath);
      await importAsset(manifest, asset);
    }
  } finally {
    for (const targetPath of targets) {
      await rm(`${assertRepositoryPath(targetPath, "targetPath")}.importing`, { force: true });
    }
  }

  console.log(`Imported ${manifest.assets.length} pinned logo model sources.`);
}

main().catch((error) => {
  console.error(`Logo model import failed: ${error.message}`);
  process.exitCode = 1;
});
