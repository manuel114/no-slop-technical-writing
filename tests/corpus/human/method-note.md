# How we size an investigation

An investigation reads traces until the trigger rate's 95% range is within a fifth of the rate. At a rate of 20% that takes 385 traces; at 5% it takes 1,825.

The range comes from the normal approximation: the rate plus or minus 1.96 times its standard error, √(p × (1 − p) ÷ n). It gets unreliable near 0%, so we only use it from 5% up and use the Clopper–Pearson bound below that.

If the first run's range is wider than a fifth of the rate, we run more traces, sized from the rate the run found.
