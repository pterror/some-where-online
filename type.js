const t = /** @type {T} */ ((() => {
  /** @type {Record<keyof T, unknown>} */
  const t = {
    void: { type: "void" },
    undefined: { type: "undefined" },
    string: { type: "string" },
    number: { type: "number" },
    integer: { type: "integer" },
    boolean: { type: "boolean" },
    bigint: { type: "bigint" },
    symbol: { type: "symbol" },
    anyArray: { type: "anyArray" },
    anyObject: { type: "anyObject" },
    /** @param {unknown} value */
    literal: (value) => ({ type: "literal", value }),
    /** @param {Type<unknown>[]} shape */
    optional: (shape) => ({ type: "optional", shape }),
    /** @param {Record<PropertyKey, Type<unknown>>} shape */
    tuple: (shape) => ({ type: "tuple", shape }),
    /** @param {Type<unknown>} shape */
    struct: (shape) => ({ type: "struct", shape }),
    // TODO: exact struct
    /** @param {Type<unknown>} item */
    array: (item) => ({ type: "array", item }),
    /** @param {Type<unknown>} key @param {Type<unknown>} value */
    dictionary: (key, value) => ({ type: "dictionary", key, value }),
    /** @param {Type<unknown>[]} members */
    anyOf: (...members) => ({ type: "anyOf", members }),
    /** @param {Type<unknown>[]} members */
    allOf: (...members) => ({ type: "allOf", members }),
  }
  return t
})())

/** @param {unknown} a @param {unknown} b */
function deepMatches(a, b) {
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) {
    return a === b
  }
  for (const k in a) {
    // @ts-expect-error
    if (!(k in b) || !deepMatches(a[k], b[k])) { return false }
  }
  return true
}

const TYPE = {
  /** @type {{ [Type in keyof T]: (type: Extract<TRepr, { type: Type }>, value: unknown) => boolean }} */
  TYPECHECKERS: {
    void: () => true,
    undefined: ({}, x) => typeof x === "undefined",
    string: ({}, x) => typeof x === "string",
    number: ({}, x) => typeof x === "number",
    integer: ({}, x) => typeof x === "number" && x % 1 === 0,
    boolean: ({}, x) => typeof x === "boolean",
    bigint: ({}, x) => typeof x === "bigint",
    symbol: ({}, x) => typeof x === "symbol",
    anyArray: ({}, x) => Array.isArray(x),
    anyObject: ({}, x) => typeof x === "object" && x != null && !Array.isArray(x),
    literal: ({ value }, x) => deepMatches(value, x),
    optional: ({ shape }, x) => x == null || isType(shape, x),
    tuple: ({ shape }, x) => Array.isArray(x) && x.length === shape.length && shape.every((t, i) => isType(t, x[i])),
    struct: ({ shape }, x) => {
      if (typeof x !== "object" || x === null || Array.isArray(x)) { return false }
      for (const k in shape) {
        // @ts-expect-error
        if (!(k in x) || !isType(shape[k], x[k])) {
          return false
        }
      }
      return true
    },
    array: ({ item }, x) => Array.isArray(x) && x.every(i => isType(item, i)),
    dictionary: ({ key, value }, x) => {
      if (typeof x !== "object" || x === null || Array.isArray(x)) { return false }
      for (const k in x) {
        // @ts-expect-error
        if (!isType(key, k) || !isType(value, x[k])) {
          return false
        }
      }
      return true
    },
    anyOf: ({ members }, x) => members.some(m => isType(m, x)),
    allOf: ({ members }, x) => members.every(m => isType(m, x)),
  }
}

/** @template T @return {x is T} @param {Type<T>} shape @param {unknown} x */
function isType(shape, x) {
  // @ts-expect-error
  return TYPE.TYPECHECKERS[shape.type](shape, x)
}

/** @template T @return {(x: unknown) => x is T} @param {Type<T>} shape */
function typeValidator(shape) {
  // @ts-expect-error
  const typechecker = TYPE.TYPECHECKERS[shape.type]
  // @ts-expect-error
  return x => typechecker(shape, x)
}