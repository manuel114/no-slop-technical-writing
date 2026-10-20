# Examples

Two versions of the same short write-up about prompt caching for a support assistant built on a
language model. The assistant, its traffic and the prices are made up for the example; every
derived number in the clean version (the cost per request, the monthly totals, the break-even hit
rate) is computed from its table.

| File | What it shows | Check script result |
| --- | --- | --- |
| [sloppy.md](sloppy.md) | The write-up without the skill's rules | 21 hits, Rewrite |
| [clean.md](clean.md) | The same content written to the skill's rules | 0 hits, Clean |

The sloppy version is the only Markdown file in the repository that is meant to fail the check, so
the tests leave it out of the self-check and assert instead that it reads as machine-written.

Run the check script on either file from the repository root:

```bash
node scripts/check.mjs examples/sloppy.md
node scripts/check.mjs examples/clean.md
```
