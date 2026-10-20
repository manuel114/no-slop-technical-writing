# A dependency cache cut mean CI build time from 9.1 to 5.8 minutes

A dependency cache made the average CI build 3.3 minutes shorter over 30 days: 5.8 minutes
across 412 builds with the cache, against 9.1 minutes across 398 builds in the 30 days before.
That is 22.8 hours of runner time a month, about $11 at $0.008 a runner-minute. The cache pays
for itself whenever more than 11% of builds find it warm; this trial saw 87%.

This page rests on one repository's build logs for 60 days and one runner price. The repository
is made up for this example; every other number on the page is computed from the table below.

## What was measured

Each build either finds the cache (a hit: dependencies are restored from the last build) or
misses it (a miss: dependencies are downloaded, then saved for the next build). We logged the wall
time of every build on the main branch and whether it hit.

| | Builds | Mean build time |
| --- | --- | --- |
| Before the cache | 398 | 9.1 min |
| With the cache, hit | 358 | 5.2 min |
| With the cache, miss | 54 | 9.6 min |
| With the cache, all | 412 | 5.8 min |

A hit saves 3.9 minutes against the old build. A miss costs 0.5 minutes more than the old build,
because it also uploads the new cache.

## When the cache stops paying

The cache helps on average as long as the hit rate (the share of builds that find the cache warm)
is above 11.4%. Below that, the extra 0.5 minutes on each miss outweighs the 3.9 minutes saved on
each hit. The break-even rate is 0.5 / (9.6 − 5.2), the cost of a miss over the gap between a
miss and a hit.

A build misses when the lockfile changes, so the hit rate depends on how often dependencies
change. In this trial 54 of 412 builds changed the lockfile. A month where every build missed is
the ceiling on the cost: 206 extra minutes, or $1.65. A week of daily dependency upgrades would
move the rate towards that ceiling for that week.

## Methods

Build times are wall-clock times from the CI provider's logs, main branch only, with failed builds
removed. The mean is the plain average. The price is the list price for a two-core Linux runner
on the date of the trial and does not include cache storage.
