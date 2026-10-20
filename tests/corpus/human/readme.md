# trace-export

Exports traces from a Postgres table to newline-delimited JSON, one file per day.

Run it with the database URL and an output folder:

```bash
trace-export --db "$DATABASE_URL" --out ./exports --since 2026-10-01
```

Each line holds one trace: its ID, start time, duration in milliseconds and the raw payload. Files over 100 MB are split into numbered parts. The tool reads in pages of 1,000 rows, so memory use stays under 200 MB for any table size.
