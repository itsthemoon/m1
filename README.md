# M1: Serialization / Deserialization

> Full name: `Jackson Davis`
> Email: `jackson_m_davis@brown.edu`
> Username: `jdavis70`

## Summary

> Summarize your implementation, including key challenges you encountered

My implementation comprises `2` software components, totaling `151` lines of code. Key challenges included `handling serialization/deserilization for arrays and resolving object references. To handle arrays I ensured that I specifically
mark in my serializer when I encountered an array and recursively ensured that there was no more nested objects/arrays inside of the array. Then in the deserializer, I processed arrays similar to objects, except of course an array is reconstructed instead of an object. In order to resolve object references in the deserializer, I had to make a nested function which took in my preliminary object graph and used a map of objects I created to finally resolve object references.`.

## Correctness & Performance Characterization

> Describe how you characterized the correctness and performance of your implementation

_Correcness_: I wrote `10` tests; these tests take `.389 s` to execute. This includes objects with `arrays, negative numbers, booleans, sparse array, and more`.

_Performance_: Evaluating serialization and deserialization on objects of varying sizes using [high-resolution timers](https://nodejs.org/api/perf_hooks.html) results in the following table:

|                | Serialization | Deserialization |
| -------------- | ------------- | --------------- |
| 100 elems      | `1.576 ms`    | `0.282 ms`      |
| 1000 elems     | `0.528 ms`    | `0.414 ms`      |
| 10000 elems    | `17.960 s`    | `8.699 ms`      |
| 100 funcs      | `2.78 ms`     | `1.34 ms`       |
| 1000 funcs     | `18.59 ms`    | `10.36 ms`      |
| 10000 funcs    | `159.09 ms`   | `101.84 ms`     |
| 1000 cyles     | `5406.98 ms`  | `10.648 ms`     |
| native objects | `0.97 ms`     | `0.13 ms`       |
| ...            | `<time>`      | `<time>`        |

## Time to Complete

> Roughly, how many hours did this milestone take you to complete?

Hours: `8`

## Wild Guess

> This assignment made a few simplifying assumptions — for example, it does not attempt to support the entire language. How many lines of code do you think it would take to support other features? (If at all possible, try to justify your answer — even a rough justification about the order of magnitude and its correlation to missing features is enough.)

FLoC: `500`
