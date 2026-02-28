// Shorthand Primitives
export type n = number;
export type s = string;
export type b = boolean;
export type u = undefined;
export type nu = null;
export type v = void;

export type E = Error;
export type F = (...args: unknown[]) => unknown;
export type voidFunction = () => v;

// Base Aliases
export type ID = s;
export type PlayerID = s;
export type Timestamp = n;

// Shorthand Collections
export type nR = Record<s, n>;
export type sR = Record<s, s>;
export type bR = Record<s, b>;
export type oR<T> = Record<s, T>;
export type aR<T> = Record<s, T[]>;

// Semantic Collections
export type Dictionary<T> = oR<T>;
export type PlayerDictionary<T> = oR<T>;
export type GridMatrix<T> = T[][];

// Utility
export type Nullish<T> = T | nu | u;
export type JSONValue = s | n | b | nu | { [key: s]: JSONValue } | JSONValue[];

// Legacy Dictionary Aliases
export type NumericDictionary = nR;
export type StringDictionary = sR;
export type BooleanDictionary = bR;
