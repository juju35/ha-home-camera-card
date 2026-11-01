// Screenshot comparison for scripts/screenshots.mjs, kept apart so that test/pixels.test.mjs can check it.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

// The decoded pixels of a PNG or GIF (every frame, with its size and timing), as ffmpeg's per-frame checksums over
// all four channels (R, G, B and A, not the alpha alone): two files with the same pixels give the same text, whatever
// their bytes (compression, palette order, metadata), and two opaque images of different colours never do.
export const pixels = (input) =>
  execFileSync("ffmpeg", ["-loglevel", "error", "-i", Buffer.isBuffer(input) ? "pipe:0" : input, "-pix_fmt", "rgba", "-f", "framemd5", "pipe:1"],
    Buffer.isBuffer(input) ? { input, encoding: "utf8" } : { encoding: "utf8" });

// Writes data (a Buffer, or the path of a rendered file) to path only when its pixels differ from the file already
// there: a re-run on an unchanged card leaves the files (and git) untouched. Returns true when it wrote the file.
export function saveIfChanged(path, data) {
  const fresh = Buffer.isBuffer(data) ? data : readFileSync(data);
  if (existsSync(path) && pixels(path) === pixels(fresh)) return false;
  writeFileSync(path, fresh);
  return true;
}
