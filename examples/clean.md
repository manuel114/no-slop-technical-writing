# Prompt caching cut the cost of a support assistant's requests by 58%

A support assistant sends the same 6,000-token instructions with every request. Prompt caching
(the provider keeps that repeated part and charges a tenth of the normal price to reuse it)
brought the average request from 2.5 cents to 1.0 cent over 30 days, or from $1,026 to $427 for
the month. **Caching saves money as long as more than 22% of requests find the cache warm; here
92% did.**

This page rests on one month of logs from one assistant: 41,200 requests. The assistant is made up
for this example, and every other number on the page is computed from the tables below. The
sections cover how caching works, what each part of a request costs, how the saving changes over
the day, and when caching stops paying.

## How prompt caching works

Every request to the assistant has three parts: the instructions (how to answer, the product
facts, the tone), the conversation so far, and the answer the model writes. The instructions are
the same in every request and make up 6,000 of its 7,100 tokens.

With caching on, the provider stores the instructions the first time it sees them. A later request
that starts with exactly the same instructions reads them from the store at a tenth of the normal
price; this is a hit. A request that finds nothing stored sends the instructions at the normal
price plus 25% for storing them; this is a miss. The store empties after 5 minutes without a
request that uses it.

"Exactly the same" is strict: a single changed character before or inside the instructions makes
every request a miss. The assistant puts anything that varies, such as the customer's name or the
date, after the instructions for that reason.

## What a request costs

| Part of the request | Tokens | Price per million tokens |
| --- | --- | --- |
| Instructions, sent normally | 6,000 | $3.00 |
| Instructions, stored in the cache | 6,000 | $3.75 |
| Instructions, read from the cache | 6,000 | $0.30 |
| Conversation so far | 800 | $3.00 |
| Answer | 300 | $15.00 |

The chart puts those prices together for one request, in the three ways the instructions can be
billed.

**Caching shrinks only the instructions, so on a hit the answer becomes the largest cost**
*Cost of one request in cents, by part, for a miss, no caching and a hit*

![Stacked bars: a miss costs 2.94 cents, no caching 2.49 cents and a hit 0.87 cents. The
conversation (0.24 cents) and the answer (0.45 cents) are the same in all three; only the
instructions change, from 2.25 to 1.80 to 0.18 cents.](charts/request-cost.svg)

Read each bar left to right: instructions, then conversation, then answer, with the total at the
end. Each part is its token count times its price from the table above.

*Source: token counts from the request logs; prices from the table above.*

Without caching, a request costs 2.49 cents, and 1.80 cents of that (72%) is the instructions.
Caching only changes that part. On a hit the instructions cost 0.18 cents and the request 0.87
cents; on a miss they cost 2.25 cents and the request 2.94 cents. With 92% hits the average request
cost 1.04 cents.

After caching, the answer is the largest cost: 0.45 cents, or 52% of a request on a hit. The next
saving would have to come from shorter answers or a cheaper model, which this page doesn't test.

## How the saving changes over the day

The store empties after 5 minutes without a request, so the hit rate follows traffic. Splitting
the month's requests at 08:00 and 20:00 shows how much that matters.

**Caching saved 63% on daytime requests and 42% at night**
*Saving on the average request against no caching, by time of day, with requests and hit rate*

![Horizontal bars, highest first: 08:00 to 20:00 saves 63% (32,960 requests, 97% hits), the whole
month 58% (41,200 requests, 92% hits), and 20:00 to 08:00 42% (8,240 requests, 72%
hits).](charts/saving-by-time.svg)

Each bar is one minus the period's average cost over the 2.49 cents a request costs without
caching. The whole month is highlighted because it is the figure in the opening.

*Source: the assistant's request logs, 30 days.*

| Period | Requests | Hit rate | Average cost per request | Saving against no caching |
| --- | --- | --- | --- | --- |
| 08:00 to 20:00 | 32,960 | 97% | 0.93 cents | 63% |
| 20:00 to 08:00 | 8,240 | 72% | 1.45 cents | 42% |
| Whole day | 41,200 | 92% | 1.04 cents | 58% |

Daytime traffic is close enough together that almost every request finds the cache warm. At night
gaps of more than 5 minutes are common, and 28% of requests miss. Night requests still cost 42%
less than without caching, because the hit rate stays well above the break-even point.

## When caching stops paying

A hit saves 1.62 cents against no caching (2.49 − 0.87), and a miss costs 0.45 cents more
(2.94 − 2.49). In 100 requests with h hits, the hits save 1.62 × h cents and the misses cost
0.45 × (100 − h) cents. The two are equal when h is 100 × 0.45 / (0.45 + 1.62), which is 21.7.
So caching costs less than not caching whenever more than 21.7% of requests are hits. The lowest
measured hit rate, 72% at night, is 3.3 times that.

Two things push the hit rate down. Quiet periods are the first, as the night row shows. Changes to
the instructions are the second: each change empties the cache once, and the next request pays for
storing the new version. The instructions changed 14 times this month, which cost 14 misses, or 6.3
cents in total.

The ceiling on the cost is a month in which every request misses: 18% more than not caching. That
would take traffic with more than 5 minutes between almost every pair of requests, which this
assistant doesn't see in any hour of the day.

## What this leaves out

Latency is not measured here: the logs record cost only, so this page makes no claim about whether
cached requests are answered faster. The conversation part could also be
cached once it grows long; at 800 tokens it is 28% of a hit's cost, and caching it is not tested.

## Methods

Costs are computed from the token counts in the logs and the prices in the table, leaving out
failed requests. Hit rates come from the provider's usage field, which reports cached and uncached
tokens for each request. The prices are illustrative, close to list prices for a mid-size model in
October 2026.
