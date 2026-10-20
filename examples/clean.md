# Prompt caching cut the cost of a support assistant's requests by 58%

A support assistant sends the same 6,000-token instructions with every request. Prompt caching
(the provider keeps that repeated part and charges a tenth of the normal price to reuse it)
brought the average request from 2.5 cents to 1.0 cent over 30 days, or from $1,026 to $427 for
the month. **Caching saves money as long as more than 22% of requests find the cache warm; here
92% did.**

This page rests on one month of logs from one assistant: 41,200 requests. The assistant is made up
for this example, and every other number on the page is computed from the table below.

## What a request costs

| Part of the request | Tokens | Price per million tokens |
| --- | --- | --- |
| Instructions, sent normally | 6,000 | $3.00 |
| Instructions, stored in the cache | 6,000 | $3.75 |
| Instructions, read from the cache | 6,000 | $0.30 |
| Conversation so far | 800 | $3.00 |
| Answer | 300 | $15.00 |

Without caching, a request costs 2.49 cents. When the cache is warm (a hit), the instructions are
read from it and the request costs 0.87 cents. When it is cold (a miss), the instructions are sent
and stored, which costs 25% more than sending them, so the request costs 2.94 cents. With 92% hits
the average request cost 1.04 cents.

## When caching stops paying

A hit saves 1.62 cents and a miss costs 0.45 cents extra, both against no caching. Caching comes
out ahead when the hit rate is above 0.45 / (0.45 + 1.62), which is 21.7%.

The hit rate depends on traffic. The cache empties after 5 minutes without a request, so quiet
hours have more misses than busy ones. The ceiling on the cost is a month in which every request
misses: 18% more than not caching.

## Methods

Costs are computed from the token counts in the logs and the prices in the table, leaving out
failed requests. The prices are illustrative, close to list prices for a mid-size model in October
2026.
