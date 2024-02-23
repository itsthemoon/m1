const {performance} = require('perf_hooks');
const util = require('../distribution').util;

test('serialization and deserialization performance', () => {
  const smallObject = {a: 100};
  const mediumObject = {
    ...Array.from({length: 1000})
        .reduce((acc, _, i) => ({...acc, [`key${i}`]: i}), {}),
  };
  const largeObject = {
    ...Array.from({length: 10000})
        .reduce((acc, _, i) => ({...acc, [`key${i}`]: i}), {}),
  };

  const startSerializationSmall = performance.now();
  util.serialize(smallObject);
  const endSerializationSmall = performance.now();

  const startSerializationMedium = performance.now();
  util.serialize(mediumObject);
  const endSerializationMedium = performance.now();

  const startSerializationLarge = performance.now();
  util.serialize(largeObject);
  const endSerializationLarge = performance.now();

  const serializedSmallObject = util.serialize(smallObject);
  const startDeserializationSmall = performance.now();
  util.deserialize(serializedSmallObject);
  const endDeserializationSmall = performance.now();

  const serializedMediumObject = util.serialize(mediumObject);
  const startDeserializationMedium = performance.now();
  util.deserialize(serializedMediumObject);
  const endDeserializationMedium = performance.now();

  const serializedLargeObject = util.serialize(largeObject);
  const startDeserializationLarge = performance.now();
  util.deserialize(serializedLargeObject);
  const endDeserializationLarge = performance.now();

  console.log(`Serialization (Small Object): 
  ${endSerializationSmall - startSerializationSmall} ms`);
  console.log(`Serialization (Medium Object): 
  ${endSerializationMedium - startSerializationMedium} ms`);
  console.log(`Serialization (Large Object): 
  ${endSerializationLarge - startSerializationLarge} ms`);

  console.log(`Deserialization (Small Object): 
  ${endDeserializationSmall - startDeserializationSmall} ms`);
  console.log(`Deserialization (Medium Object): 
  ${endDeserializationMedium - startDeserializationMedium} ms`);
  console.log(`Deserialization (Large Object): 
  ${endDeserializationLarge - startDeserializationLarge} ms`);
});

const functionCounts = [100, 1000, 10000];
functionCounts.forEach((count) => {
  test(`performance for serializing and deserializing ${count} 
  functions`, () => {
    const funcs = Array.from({length: count}, (_, i) => new
    Function(`return ${i}`));

    const startSerialization = performance.now();
    const serializedFuncs = funcs.map((func) => util.serialize(func));
    const endSerialization = performance.now();

    const startDeserialization = performance.now();
    serializedFuncs.map((serialized) =>
      util.deserialize(serialized));
    const endDeserialization = performance.now();

    console.log(`Serialization (${count} funcs): 
    ${endSerialization - startSerialization} ms`);
    console.log(`Deserialization (${count} funcs): 
    ${endDeserialization - startDeserialization} ms`);
  });
});

test('performance for serializing and deserializing objects with 1000 cycles',
    () => {
      let obj = {};
      let current = obj;
      // Creating a chain of 1000 nested objects
      for (let i = 0; i < 1000; i++) {
        current[i] = {next: {}};
        current = current[i].next;
      }
      // Creating a cycle at the end of the chain
      current.self = obj;

      const startSerialization = performance.now();
      const serializedObj = util.serialize(obj);
      const endSerialization = performance.now();

      const startDeserialization = performance.now();
      util.deserialize(serializedObj);
      const endDeserialization = performance.now();

      console.log(`Serialization (Object with 1000 cycles): 
  ${endSerialization - startSerialization} ms`);
      console.log(`Deserialization (Object with 1000 cycles): 
  ${endDeserialization - startDeserialization} ms`);
    });

test('performance for serializing and deserializing native objects', () => {
  const nativeObjects = [new Date(), /abc/, new Set([1, 2, 3])];

  const startSerialization = performance.now();
  const serializedObjects = nativeObjects.map((obj) => util.serialize(obj));
  const endSerialization = performance.now();

  const startDeserialization = performance.now();
  serializedObjects.map((serialized) => util.
      deserialize(serialized));
  const endDeserialization = performance.now();

  console.log(`Serialization (Native objects): 
  ${endSerialization - startSerialization} ms`);
  console.log(`Deserialization (Native objects): 
  ${endDeserialization - startDeserialization} ms`);
});
