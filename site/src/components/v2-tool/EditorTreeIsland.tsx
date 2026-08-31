import React from "react";
import { Button, Tree, TreeItem, TreeItemContent } from "react-aria-components";

type TreeVariant = "node" | "animation";

const nodeTree = [
  { id: "input", label: "Input", kind: "group", children: [
    { id: "geometry", label: "Geometry", kind: "node" },
    { id: "object-info", label: "Object info", kind: "node" },
    { id: "signal-time", label: "Signal time", kind: "node" }
  ] },
  { id: "surface", label: "Surface", kind: "group", children: [
    { id: "machined-metal", label: "Machined metal", kind: "node" },
    { id: "emission", label: "Emission", kind: "node" },
    { id: "thin-glass", label: "Thin glass", kind: "node" }
  ] },
  { id: "transform", label: "Transform", kind: "group", children: [] },
  { id: "utility", label: "Utility", kind: "group", children: [] }
];

const rigTree = [
  { id: "root", label: "Root", kind: "bone", children: [
    { id: "pelvis", label: "Pelvis", kind: "bone", children: [
      { id: "spine-01", label: "Spine / 01", kind: "bone", children: [] },
      { id: "spine-02", label: "Spine / 02", kind: "bone", children: [] },
      { id: "neck", label: "Neck", kind: "bone", children: [] },
      { id: "head", label: "Head", kind: "bone", children: [] },
      { id: "arm-left", label: "Arm.L", kind: "bone", children: [] },
      { id: "arm-right", label: "Arm.R", kind: "bone", children: [] }
    ] }
  ] }
];

function TreeRow({ item }) {
  const hasChildren = item.children.length > 0;

  return (
    <TreeItem id={item.id} textValue={item.label}>
      <TreeItemContent>
        {hasChildren && <Button slot="chevron" aria-label={`Toggle ${item.label}`}><span aria-hidden="true">›</span></Button>}
        {!hasChildren && <span className="tool-lab-aria-tree-spacer" aria-hidden="true" />}
        <span className="tool-lab-aria-tree-kind" aria-hidden="true">{item.kind === "bone" ? "B" : item.kind === "group" ? "›" : "N"}</span>
        <span className="tool-lab-aria-tree-label">{item.label}</span>
        {item.kind === "node" && <span className="tool-lab-aria-tree-meta">node</span>}
      </TreeItemContent>
      {hasChildren && item.children.map((child) => <TreeRow item={child} key={child.id} />)}
    </TreeItem>
  );
}

export default function EditorTreeIsland({ variant }: { variant: TreeVariant }) {
  const items = variant === "node" ? nodeTree : rigTree;
  const selectedKey = variant === "node" ? "machined-metal" : "spine-02";

  return (
    <Tree
      className="tool-lab-aria-tree"
      aria-label={variant === "node" ? "Material node catalogue" : "Animation rig outliner"}
      defaultExpandedKeys={variant === "node" ? ["input", "surface"] : ["root", "pelvis"]}
      defaultSelectedKeys={[selectedKey]}
      selectionMode="single"
      items={items}
    >
      {(item) => <TreeRow item={item} />}
    </Tree>
  );
}
