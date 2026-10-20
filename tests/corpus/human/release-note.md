---
context: marketing
---

# Faster exports

Trace exports now run about three times faster: a day of 2 million traces takes 6 minutes, down from 19. The export reads rows in pages of 1,000 instead of one query per trace.

Exports you already scheduled pick this up on their next run. Nothing needs to change in your settings.
