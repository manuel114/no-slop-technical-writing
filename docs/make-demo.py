#!/usr/bin/env python3
"""Render docs/demo.gif: a terminal recording of the check script on the two examples.

The output shown is the script's real output, captured when this runs, so the GIF can't drift
from what the script prints. Needs Python 3 with Pillow (`pip install pillow`) and Node.js 22+.
Run from the repository root: python3 docs/make-demo.py
"""
import re
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "docs" / "demo.gif"

# Terminal look: size, colours and font.
COLS, ROWS = 92, 30
PAD, LINE_H = 20, 20
BG, FG, DIM = (16, 18, 24), (220, 222, 228), (120, 126, 140)
RED, YELLOW, GREEN, BLUE = (240, 113, 103), (229, 192, 123), (126, 211, 128), (120, 170, 240)
FONTS = ["/System/Library/Fonts/Menlo.ttc", "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"]
FONT = next(ImageFont.truetype(f, 14) for f in FONTS if Path(f).exists())
CHAR_W = FONT.getlength("M")
SIZE = (int(PAD * 2 + CHAR_W * COLS), PAD * 2 + LINE_H * ROWS)

# How much of the sloppy report to show before cutting it off.
REPORT_LINES = 17


def run(*args):
    """Run a command from the repository root and return its stdout lines."""
    return subprocess.run(args, cwd=ROOT, capture_output=True, text=True, check=False).stdout.rstrip("\n").split("\n")


def colour(line):
    """Pick a colour for one line of check-script output."""
    if line.startswith("$ "):
        return BLUE
    if re.search(r": \d+ hits?\. Rewrite", line):
        return RED
    if line.endswith("Clean."):
        return GREEN
    if line.startswith("  line ") or line.startswith("  …"):
        return DIM
    if re.match(r"^\S.*\(\d+\)$", line):
        return YELLOW
    return FG


def frame(lines, cursor=False):
    """Draw the last ROWS lines of the screen as one image."""
    img = Image.new("RGB", SIZE, BG)
    d = ImageDraw.Draw(img)
    shown = lines[-ROWS:]
    for i, line in enumerate(shown):
        d.text((PAD, PAD + i * LINE_H), line[:COLS], font=FONT, fill=colour(line))
    if cursor:
        x = PAD + CHAR_W * len(shown[-1] if shown else "")
        y = PAD + (len(shown) - 1) * LINE_H
        d.rectangle([x, y + 2, x + CHAR_W - 1, y + LINE_H - 3], fill=FG)
    return img


def wrap(text):
    """Wrap a paragraph to the terminal width."""
    out, line = [], ""
    for word in text.split():
        if len(line) + len(word) + 1 > COLS - 2:
            out.append(line)
            line = word
        else:
            line = f"{line} {word}".strip()
    return out + [line]


frames, durations = [], []


def add(lines, ms, cursor=False):
    """Append one frame shown for ms milliseconds."""
    frames.append(frame(lines, cursor))
    durations.append(ms)


def type_command(screen, cmd):
    """Type a command a few characters at a time, then pause before its output."""
    for i in range(0, len(cmd) + 1, 3):
        add(screen + ["$ " + cmd[:i]], 45, cursor=True)
    screen.append("$ " + cmd)
    add(screen, 500)


screen = []
sloppy = (ROOT / "examples" / "sloppy.md").read_text().split("\n\n")
type_command(screen, "sed -n 3,7p examples/sloppy.md")
for para in sloppy[1:3]:
    screen += wrap(para) + [""]
add(screen, 1500)

type_command(screen, "node scripts/check.mjs examples/sloppy.md")
for i, line in enumerate(run("node", "scripts/check.mjs", "examples/sloppy.md")[:REPORT_LINES]):
    screen.append(line)
    add(screen, 1000 if i == 0 else 80)
screen.append("  …")
add(screen, 5000)

# Second screen: the clean version, on a cleared terminal.
screen = []
clean = (ROOT / "examples" / "clean.md").read_text().split("\n\n")
type_command(screen, "sed -n 3,6p examples/clean.md")
screen += wrap(clean[1]) + [""]
add(screen, 3500)

type_command(screen, "node scripts/check.mjs examples/clean.md")
screen += run("node", "scripts/check.mjs", "examples/clean.md")[:1]
add(screen, 600)
add(screen + ["$ "], 5000, cursor=True)

frames[0].save(OUT, save_all=True, append_images=frames[1:], duration=durations, loop=0, optimize=True)
print(f"{OUT.relative_to(ROOT)}: {len(frames)} frames, {OUT.stat().st_size // 1024} KB")
