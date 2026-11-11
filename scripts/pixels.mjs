// Screenshot comparison for scripts/screenshots.mjs, kept apart so that test/pixels.test.mjs can check it.
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";

// Debian 12's ffmpeg (5.1) cannot read a GIF from a pipe (its demuxer seeks back): decode a temporary copy instead.
const viaFile = (buf, fn) => {
  const dir = mkdtempSync(join(tmpdir(), "pixels-"));
  const file = join(dir, "input");
  try {
    writeFileSync(file, buf);
    return fn(file);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
};

// The decoded pixels of a PNG or GIF (every frame, with its size and timing), as ffmpeg's per-frame checksums over
// all four channels (R, G, B and A, not the alpha alone): two files with the same pixels give the same text, whatever
// their bytes (compression, palette order, metadata), and two opaque images of different colours never do.
export const pixels = (input) =>
  Buffer.isBuffer(input)
    ? viaFile(input, pixels)
    : execFileSync("ffmpeg", ["-loglevel", "error", "-i", input, "-pix_fmt", "rgba", "-f", "framemd5", "pipe:1"], { encoding: "utf8" });

// Writes data (a Buffer, or the path of a rendered file) to path only when its pixels differ from the file already
// there: a re-run on an unchanged card leaves the files (and git) untouched. Returns true when it wrote the file.
export function saveIfChanged(path, data) {
  const fresh = Buffer.isBuffer(data) ? data : readFileSync(data);
  if (existsSync(path) && pixels(path) === pixels(fresh)) return false;
  writeFileSync(path, fresh);
  return true;
}
