# Queue backlog on 3 March

From 14:05 to 14:50 UTC the sync queue held up to 4,200 jobs, against a usual peak of 300. A deploy at 14:02 doubled the batch size, and each job took 2.4 times as long, so workers fell behind.

We rolled the deploy back at 14:31. The backlog drained in 19 minutes. No traces were lost; 11 jobs were retried once.

The batch size now has a ceiling of 500, set in the worker config, and the deploy check compares job time before and after.
