const nativeFunctionsMap = new Map();

function serialize(object) {
  populateNativeFunctionsMap();
  const seenObjects = new Map();

  let objectIdCounter = 0;

  if (object instanceof Date) {
    return JSON.stringify({type: 'Date', value: object.toISOString()});
  }

  const replacer = (key, value) => {
    if (value === undefined) {
      return {type: 'Undefined'};
    } else if (value instanceof Date) {
      return {type: 'Date', value: value.toISOString()};
    } else if (value instanceof Error) {
      return {
        type: 'Error',
        name: value.name,
        message: value.message,
        stack: value.stack,
      };
    } else if (typeof value === 'object' && value !== null) {
      if (seenObjects.has(value)) {
        return {type: 'Reference', id: seenObjects.get(value)};
      } else {
        const id = ++objectIdCounter;
        seenObjects.set(value, id);
        let valueType = Array.isArray(value) ? 'Array' : 'Object';
        let serializedValue = {type: valueType, objectId: id};
        for (let prop in value) {
          if (value.hasOwnProperty(prop)) {
            serializedValue[prop] = replacer(prop, value[prop]);
          }
        }
        return serializedValue;
      }
    } else if (typeof value === 'function') {
      if (isNativeFunction(value)) {
        // Find the function in the nativeFunctionsMap to get its identifier
        const identifier = [...nativeFunctionsMap.entries()]
            .find(([name, fn]) => fn === value)[0];
        return {type: 'NativeFunction', id: identifier};
      } else {
        return {type: 'Function', value: value.toString()};
      }
    } else if (value instanceof RegExp) {
      return {type: 'RegExp', value: value.toString()};
    } else if (value instanceof Error) {
      return {
        type: 'Error',
        name: value.name,
        message: value.message,
        stack: value.stack,
      };
    }

    return value;
  };

  return JSON.stringify(object, replacer);
}

function deserialize(string) {
  const objectsById = new Map();
  let prelimObjGraph = null;

  const replacer = (key, value) => {
    if (value && typeof value === 'object') {
      if (value.type === 'Reference') {
        return objectsById.get(value.id) || {placeholderFor: value.id};
      } else if (value.type === 'Array' || value.type === 'Object') {
        let obj = (value.type === 'Array') ? [] : {};
        objectsById.set(value.objectId, obj);
        for (let prop in value) {
          if (prop !== 'type' && prop !== 'objectId') {
            obj[prop] = replacer(prop, value[prop]);
          }
        }
        return obj;
      } else if (value.type === 'Undefined') {
        return undefined;
      } else if (value.type === 'Function') {
        return new Function('return ' + value.value)();
      } else if (value.type === 'NativeFunction') {
        return nativeFunctionsMap.get(value.id);
      } else if (value.type === 'RegExp') {
        const match = /^\/(.*)\/([gimuy]*)$/.exec(value.value);
        return new RegExp(match[1], match[2]);
      } else if (value.type === 'Date') {
        return new Date(value.value);
      } else if (value.type === 'Error') {
        const error = new Error(value.message);
        error.name = value.name;
        error.stack = value.stack;
        return error;
      }
    }
    return value;
  };

  prelimObjGraph = JSON.parse(string, replacer);

  const resolveReferences = (obj) => {
    if (obj === null || typeof obj === 'undefined') {
      // If obj is null or undefined, there are no references to resolve.
      return;
    }

    for (let key of Object.keys(obj)) {
      let value = obj[key];
      if (typeof value === 'object' && value !== null) {
        if (value.placeholderFor) {
          // Replace placeholder with actual object from the map
          obj[key] = objectsById.get(value.placeholderFor);
        } else {
          // Recursively resolve references for nested objects
          resolveReferences(value);
        }
      }
    }
  };

  resolveReferences(prelimObjGraph);
  return prelimObjGraph;
}

function isNativeFunction(fn) {
  return (typeof fn === 'function') &&
    (fn.toString().indexOf('[native code]') !== -1);
}

function populateNativeFunctionsMap() {
  const rootObjects = [console, Object, Array, Date];
  rootObjects.forEach((obj) => {
    Object.getOwnPropertyNames(obj).forEach((prop) => {
      const value = obj[prop];
      if (isNativeFunction(value)) {
        nativeFunctionsMap.set(prop, value);
      }
    });
  });
}

module.exports = {
  serialize: serialize,
  deserialize: deserialize,
};
