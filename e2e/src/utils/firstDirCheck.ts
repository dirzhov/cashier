import { promises as fsPromises } from "fs";
import * as fs from "fs";
import * as path from "path";

/**
 * Return the first directory segment of a path, or null if none.
 * Examples:
 *  - "a/b/c"      -> "a"
 *  - "/a/b/c"     -> "a"
 *  - "C:\\a\\b"   -> "a"
 *  - "./a/b"      -> "a"
 *  - "file.txt"   -> "file.txt" (first segment; caller may want to interpret)
 */
export function getFirstDirectoryFromPath(p: string): string | null {
  if (!p) return null;
  const normalized = path.normalize(p);
  const root = path.parse(normalized).root; // e.g. "/" or "C:\"
  // Remove the root so we always split the meaningful segments
  const withoutRoot = normalized.startsWith(root) ? normalized.slice(root.length) : normalized;
  const segments = withoutRoot.split(path.sep).filter(Boolean);
  return segments[0] ?? null;
}

/**
 * Async: check whether the first directory exists and is a directory.
 * Returns false if there is no first segment or it doesn't exist / isn't a directory.
 */
export async function firstDirExists(p: string): Promise<boolean> {
  const first = getFirstDirectoryFromPath(p);
  if (!first) return false;

  const root = path.parse(path.normalize(p)).root; // may be "" for relative paths
  const candidate = path.join(root || "", first);

  try {
    const stat = await fsPromises.stat(candidate);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Sync version of firstDirExists.
 */
export function firstDirExistsSync(p: string): boolean {
  const first = getFirstDirectoryFromPath(p);
  if (!first) return false;

  const root = path.parse(path.normalize(p)).root;
  const candidate = path.join(root || "", first);

  try {
    const stat = fs.statSync(candidate);
    return stat.isDirectory();
  } catch {
    return false;
  }
}
