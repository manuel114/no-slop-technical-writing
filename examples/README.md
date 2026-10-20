# Examples

Two versions of the same short write-up about adding a dependency cache to a CI pipeline. The
repository, the build counts and the timings are made up for the example; every derived number in
the clean version (the means, the savings, the break-even hit rate) is computed from its table.

| File | What it shows | Check script result |
| --- | --- | --- |
| [sloppy.md](sloppy.md) | The write-up as an agent tends to produce it without the skill | 39 hits, Rewrite |
| [clean.md](clean.md) | The same content written to the skill's rules | 0 hits, Clean |

The sloppy version is the only Markdown file in the repository that is meant to fail the check, so
the tests leave it out of the self-check and assert instead that it reads as machine-written.

Run the check script on either file from the skill's own folder (the repository root if you cloned
it on its own, or `.claude/skills/no-slop-technical-writing/` inside a project):

```bash
node scripts/check.mjs examples/sloppy.md
node scripts/check.mjs examples/clean.md
```
