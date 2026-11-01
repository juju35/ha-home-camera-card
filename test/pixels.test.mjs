// The screenshot comparator (scripts/pixels.mjs) must look at every channel: a check on the alpha alone (as
// ImageChops.difference(...).getbbox() on RGBA does) calls two opaque images of different colours identical, and a
// changed screenshot would then never be written. Needs ffmpeg (as npm run screenshots does).
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, test } from "node:test";
import { pixels, saveIfChanged } from "../scripts/pixels.mjs";

let ffmpeg = true;
try {
  execFileSync("ffmpeg", ["-version"], { stdio: "ignore" });
} catch {
  ffmpeg = false;
}
const skip = ffmpeg ? false : "ffmpeg is not installed (the Render screenshots job runs this test)";
const dir = mkdtempSync(join(tmpdir(), "hc-pixels-"));
after(() => rmSync(dir, { recursive: true, force: true }));

// An opaque 16 x 16 image of one colour; extra ffmpeg options change its bytes, not its pixels.
const image = (name, color, ...opts) => {
  const out = join(dir, name);
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-f", "lavfi", "-i", `color=c=${color}:s=16x16`, "-frames:v", "1", "-pix_fmt", "rgba", ...opts, out]);
  return out;
};

test("two opaque images of different colours differ, in every channel compared", { skip }, () => {
  const red = image("red.png", "red");
  const blue = image("blue.png", "blue");
  // Same (opaque) alpha everywhere: only R, G and B tell them apart.
  assert.notEqual(pixels(red), pixels(blue));
  assert.notEqual(pixels(red), pixels(readFileSync(blue)));
});

test("an opaque screenshot of another colour is rewritten, the same pixels in other bytes are not", { skip }, () => {
  const shot = join(dir, "shot.png");
  writeFileSync(shot, readFileSync(image("red-a.png", "red")));
  const before = readFileSync(shot);

  // Same red, other bytes (no compression): unchanged, the file keeps its bytes.
  const sameRed = image("red-b.png", "red", "-compression_level", "0");
  assert.ok(!before.equals(readFileSync(sameRed)));
  assert.equal(saveIfChanged(shot, sameRed), false);
  assert.ok(readFileSync(shot).equals(before));

  // Opaque blue: rewritten, from a path or from a buffer.
  const blue = image("blue-a.png", "blue");
  assert.equal(saveIfChanged(shot, blue), true);
  assert.ok(readFileSync(shot).equals(readFileSync(blue)));
  assert.equal(saveIfChanged(shot, readFileSync(image("green.png", "green"))), true);
  assert.equal(pixels(shot), pixels(join(dir, "green.png")));

  // A missing file is always written.
  const fresh = join(dir, "new.png");
  assert.equal(saveIfChanged(fresh, blue), true);
});

test("a GIF frame that changes colour only is seen", { skip }, () => {
  const gif = (name, second) => {
    const out = join(dir, name);
    execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-f", "lavfi", "-i", `color=c=red:s=16x16:d=0.2:r=10`, "-f", "lavfi", "-i", `color=c=${second}:s=16x16:d=0.2:r=10`,
      "-filter_complex", "[0][1]concat=n=2:v=1", out]);
    return out;
  };
  assert.notEqual(pixels(gif("a.gif", "blue")), pixels(gif("b.gif", "yellow")));
  assert.equal(pixels(gif("c.gif", "blue")), pixels(gif("d.gif", "blue")));
});
