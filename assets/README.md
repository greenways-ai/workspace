# Workspace media sources

This directory is the canonical large-source store for media shared across the Greenways/Hara workspace. Binary 3D and video formats are tracked with Git LFS so the super-repository records exact versions without placing hundreds of megabytes in ordinary Git history.

- `3d/source/` — master models and interchange files.
- `video/source/` — master footage, captures, and animation exports.

Keep small metadata, manifests, notes, and generated still images in ordinary Git. Publishing repositories should receive reproducible delivery derivatives rather than depending on LFS at runtime. In particular, GitHub Pages sites must keep directly served GLB, PNG, WebP, or video derivatives outside LFS.

## Setup

Install Git LFS once, then hydrate only the media you need:

```sh
make repo-lfs-install
make repo-lfs-pull
```

To clone the workspace without immediately downloading media:

```sh
GIT_LFS_SKIP_SMUDGE=1 git clone git@github.com:greenways-ai/workspace.git
cd workspace
make repo-lfs-pull
```

Before committing media, run:

```sh
make repo-lfs-check
```

The check verifies that every supported file under `assets/3d` and `assets/video` is matched by the repository attributes and represented by a Git LFS pointer in the index.
