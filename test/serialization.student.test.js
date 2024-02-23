const util = require('../distribution').util;

test('(0 pts) sample test', () => {
  const number = 42;
  const serialized = util.serialize(number);
  const deserialized = util.deserialize(serialized);
  expect(deserialized).toBe(number);
});

test('(3 pts) serializeNegativeNumber', () => {
  const number = -42;
  const serialized = util.serialize(number);
  const deserialized = util.deserialize(serialized);
  expect(deserialized).toBe(number);
});

test('(3 pts) serializeEmptyString', () => {
  const string = '';
  const serialized = util.serialize(string);
  const deserialized = util.deserialize(serialized);
  expect(deserialized).toBe(string);
});

test('(4 pts) serializeObjectWithArray', () => {
  const object = {numbers: [1, 2, 3], bools: [true, false, true]};
  const serialized = util.serialize(object);
  const deserialized = util.deserialize(serialized);
  expect(deserialized).toEqual(object);
});

test('(5 pts) serializeArrayWithObjects', () => {
  const array = [{a: 1}, {b: 2}, {c: 3}];
  const serialized = util.serialize(array);
  const deserialized = util.deserialize(serialized);
  expect(deserialized).toEqual(array);
});

test('(4 pts) serializeBoolean', () => {
  const bool = true;
  const serialized = util.serialize(bool);
  const deserialized = util.deserialize(serialized);
  expect(deserialized).toBe(bool);
});

test('(4 pts) serializeObjectWithNullValues', () => {
  const object = {a: null, b: null, c: 3};
  const serialized = util.serialize(object);
  const deserialized = util.deserialize(serialized);
  expect(deserialized).toEqual(object);
});

test('(5 pts) serializeSparseArray', () => {
  const array = [1, , , 4, 5]; // Intentionally sparse array
  const serialized = util.serialize(array);
  const deserialized = util.deserialize(serialized);
  expect(deserialized).toEqual(array);
});

test('(6 pts) serializeObjectWithDate', () => {
  const object = {today: new Date()};
  const serialized = util.serialize(object);
  const deserialized = util.deserialize(serialized);
  expect(deserialized.today.getTime()).toBe(object.today.getTime());
});

test('(4 pts) serializeObjectWithUndefinedValues', () => {
  const object = {a: undefined, b: 2, c: undefined};
  const serialized = util.serialize(object);
  const deserialized = util.deserialize(serialized);
  expect(deserialized).toEqual(object);
});

