function M(n, t, e, s) {
  function i(o) {
    return o instanceof e ? o : new e(function(r) {
      r(o);
    });
  }
  return new (e || (e = Promise))(function(o, r) {
    function c(h) {
      try {
        d(s.next(h));
      } catch (l) {
        r(l);
      }
    }
    function u(h) {
      try {
        d(s.throw(h));
      } catch (l) {
        r(l);
      }
    }
    function d(h) {
      h.done ? o(h.value) : i(h.value).then(c, u);
    }
    d((s = s.apply(n, [])).next());
  });
}
const X = "ENTRIES", Q = "KEYS", B = "VALUES", p = "";
class L {
  constructor(t, e) {
    const s = t._tree, i = Array.from(s.keys());
    this.set = t, this._type = e, this._path = i.length > 0 ? [{ node: s, keys: i }] : [];
  }
  next() {
    const t = this.dive();
    return this.backtrack(), t;
  }
  dive() {
    if (this._path.length === 0)
      return { done: !0, value: void 0 };
    const { node: t, keys: e } = z(this._path);
    if (z(e) === p)
      return { done: !1, value: this.result() };
    const s = t.get(z(e));
    return this._path.push({ node: s, keys: Array.from(s.keys()) }), this.dive();
  }
  backtrack() {
    if (this._path.length === 0)
      return;
    const t = z(this._path).keys;
    t.pop(), !(t.length > 0) && (this._path.pop(), this.backtrack());
  }
  key() {
    return this.set._prefix + this._path.map(({ keys: t }) => z(t)).filter((t) => t !== p).join("");
  }
  value() {
    return z(this._path).node.get(p);
  }
  result() {
    switch (this._type) {
      case B:
        return this.value();
      case Q:
        return this.key();
      default:
        return [this.key(), this.value()];
    }
  }
  [Symbol.iterator]() {
    return this;
  }
}
const z = (n) => n[n.length - 1], tt = (n, t, e) => {
  const s = /* @__PURE__ */ new Map();
  if (t === void 0)
    return s;
  const i = t.length + 1, o = i + e, r = new Uint8Array(o * i).fill(e + 1);
  for (let c = 0; c < i; ++c)
    r[c] = c;
  for (let c = 1; c < o; ++c)
    r[c * i] = c;
  return K(n, t, e, s, r, 1, i, ""), s;
}, K = (n, t, e, s, i, o, r, c) => {
  const u = o * r;
  t: for (const d of n.keys())
    if (d === p) {
      const h = i[u - 1];
      h <= e && s.set(c, [n.get(d), h]);
    } else {
      let h = o;
      for (let l = 0; l < d.length; ++l, ++h) {
        const a = d[l], m = r * h, _ = m - r;
        let f = i[m];
        const g = Math.max(0, h - e - 1), y = Math.min(r - 1, h + e);
        for (let w = g; w < y; ++w) {
          const V = a !== t[w], C = i[_ + w] + +V, x = i[_ + w + 1] + 1, S = i[m + w] + 1, I = i[m + w + 1] = Math.min(C, x, S);
          I < f && (f = I);
        }
        if (f > e)
          continue t;
      }
      K(n.get(d), t, e, s, i, h, r, c + d);
    }
};
class b {
  /**
   * The constructor is normally called without arguments, creating an empty
   * map. In order to create a {@link SearchableMap} from an iterable or from an
   * object, check {@link SearchableMap.from} and {@link
   * SearchableMap.fromObject}.
   *
   * The constructor arguments are for internal use, when creating derived
   * mutable views of a map at a prefix.
   */
  constructor(t = /* @__PURE__ */ new Map(), e = "") {
    this._size = void 0, this._tree = t, this._prefix = e;
  }
  /**
   * Creates and returns a mutable view of this {@link SearchableMap},
   * containing only entries that share the given prefix.
   *
   * ### Usage:
   *
   * ```javascript
   * let map = new SearchableMap()
   * map.set("unicorn", 1)
   * map.set("universe", 2)
   * map.set("university", 3)
   * map.set("unique", 4)
   * map.set("hello", 5)
   *
   * let uni = map.atPrefix("uni")
   * uni.get("unique") // => 4
   * uni.get("unicorn") // => 1
   * uni.get("hello") // => undefined
   *
   * let univer = map.atPrefix("univer")
   * univer.get("unique") // => undefined
   * univer.get("universe") // => 2
   * univer.get("university") // => 3
   * ```
   *
   * @param prefix  The prefix
   * @return A {@link SearchableMap} representing a mutable view of the original
   * Map at the given prefix
   */
  atPrefix(t) {
    if (!t.startsWith(this._prefix))
      throw new Error("Mismatched prefix");
    const [e, s] = k(this._tree, t.slice(this._prefix.length));
    if (e === void 0) {
      const [i, o] = P(s);
      for (const r of i.keys())
        if (r !== p && r.startsWith(o)) {
          const c = /* @__PURE__ */ new Map();
          return c.set(r.slice(o.length), i.get(r)), new b(c, t);
        }
    }
    return new b(e, t);
  }
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/clear
   */
  clear() {
    this._size = void 0, this._tree.clear();
  }
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/delete
   * @param key  Key to delete
   */
  delete(t) {
    return this._size = void 0, et(this._tree, t);
  }
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/entries
   * @return An iterator iterating through `[key, value]` entries.
   */
  entries() {
    return new L(this, X);
  }
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/forEach
   * @param fn  Iteration function
   */
  forEach(t) {
    for (const [e, s] of this)
      t(e, s, this);
  }
  /**
   * Returns a Map of all the entries that have a key within the given edit
   * distance from the search key. The keys of the returned Map are the matching
   * keys, while the values are two-element arrays where the first element is
   * the value associated to the key, and the second is the edit distance of the
   * key to the search key.
   *
   * ### Usage:
   *
   * ```javascript
   * let map = new SearchableMap()
   * map.set('hello', 'world')
   * map.set('hell', 'yeah')
   * map.set('ciao', 'mondo')
   *
   * // Get all entries that match the key 'hallo' with a maximum edit distance of 2
   * map.fuzzyGet('hallo', 2)
   * // => Map(2) { 'hello' => ['world', 1], 'hell' => ['yeah', 2] }
   *
   * // In the example, the "hello" key has value "world" and edit distance of 1
   * // (change "e" to "a"), the key "hell" has value "yeah" and edit distance of 2
   * // (change "e" to "a", delete "o")
   * ```
   *
   * @param key  The search key
   * @param maxEditDistance  The maximum edit distance (Levenshtein)
   * @return A Map of the matching keys to their value and edit distance
   */
  fuzzyGet(t, e) {
    return tt(this._tree, t, e);
  }
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get
   * @param key  Key to get
   * @return Value associated to the key, or `undefined` if the key is not
   * found.
   */
  get(t) {
    const e = D(this._tree, t);
    return e !== void 0 ? e.get(p) : void 0;
  }
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/has
   * @param key  Key
   * @return True if the key is in the map, false otherwise
   */
  has(t) {
    const e = D(this._tree, t);
    return e !== void 0 && e.has(p);
  }
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/keys
   * @return An `Iterable` iterating through keys
   */
  keys() {
    return new L(this, Q);
  }
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/set
   * @param key  Key to set
   * @param value  Value to associate to the key
   * @return The {@link SearchableMap} itself, to allow chaining
   */
  set(t, e) {
    if (typeof t != "string")
      throw new Error("key must be a string");
    return this._size = void 0, j(this._tree, t).set(p, e), this;
  }
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/size
   */
  get size() {
    if (this._size)
      return this._size;
    this._size = 0;
    const t = this.entries();
    for (; !t.next().done; )
      this._size += 1;
    return this._size;
  }
  /**
   * Updates the value at the given key using the provided function. The function
   * is called with the current value at the key, and its return value is used as
   * the new value to be set.
   *
   * ### Example:
   *
   * ```javascript
   * // Increment the current value by one
   * searchableMap.update('somekey', (currentValue) => currentValue == null ? 0 : currentValue + 1)
   * ```
   *
   * If the value at the given key is or will be an object, it might not require
   * re-assignment. In that case it is better to use `fetch()`, because it is
   * faster.
   *
   * @param key  The key to update
   * @param fn  The function used to compute the new value from the current one
   * @return The {@link SearchableMap} itself, to allow chaining
   */
  update(t, e) {
    if (typeof t != "string")
      throw new Error("key must be a string");
    this._size = void 0;
    const s = j(this._tree, t);
    return s.set(p, e(s.get(p))), this;
  }
  /**
   * Fetches the value of the given key. If the value does not exist, calls the
   * given function to create a new value, which is inserted at the given key
   * and subsequently returned.
   *
   * ### Example:
   *
   * ```javascript
   * const map = searchableMap.fetch('somekey', () => new Map())
   * map.set('foo', 'bar')
   * ```
   *
   * @param key  The key to update
   * @param defaultValue  A function that creates a new value if the key does not exist
   * @return The existing or new value at the given key
   */
  fetch(t, e) {
    if (typeof t != "string")
      throw new Error("key must be a string");
    this._size = void 0;
    const s = j(this._tree, t);
    let i = s.get(p);
    return i === void 0 && s.set(p, i = e()), i;
  }
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/values
   * @return An `Iterable` iterating through values.
   */
  values() {
    return new L(this, B);
  }
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/@@iterator
   */
  [Symbol.iterator]() {
    return this.entries();
  }
  /**
   * Creates a {@link SearchableMap} from an `Iterable` of entries
   *
   * @param entries  Entries to be inserted in the {@link SearchableMap}
   * @return A new {@link SearchableMap} with the given entries
   */
  static from(t) {
    const e = new b();
    for (const [s, i] of t)
      e.set(s, i);
    return e;
  }
  /**
   * Creates a {@link SearchableMap} from the iterable properties of a JavaScript object
   *
   * @param object  Object of entries for the {@link SearchableMap}
   * @return A new {@link SearchableMap} with the given entries
   */
  static fromObject(t) {
    return b.from(Object.entries(t));
  }
}
const k = (n, t, e = []) => {
  if (t.length === 0 || n == null)
    return [n, e];
  for (const s of n.keys())
    if (s !== p && t.startsWith(s))
      return e.push([n, s]), k(n.get(s), t.slice(s.length), e);
  return e.push([n, t]), k(void 0, "", e);
}, D = (n, t) => {
  if (t.length === 0 || n == null)
    return n;
  for (const e of n.keys())
    if (e !== p && t.startsWith(e))
      return D(n.get(e), t.slice(e.length));
}, j = (n, t) => {
  const e = t.length;
  t: for (let s = 0; n && s < e; ) {
    for (const o of n.keys())
      if (o !== p && t[s] === o[0]) {
        const r = Math.min(e - s, o.length);
        let c = 1;
        for (; c < r && t[s + c] === o[c]; )
          ++c;
        const u = n.get(o);
        if (c === o.length)
          n = u;
        else {
          const d = /* @__PURE__ */ new Map();
          d.set(o.slice(c), u), n.set(t.slice(s, s + c), d), n.delete(o), n = d;
        }
        s += c;
        continue t;
      }
    const i = /* @__PURE__ */ new Map();
    return n.set(t.slice(s), i), i;
  }
  return n;
}, et = (n, t) => {
  const [e, s] = k(n, t);
  if (e !== void 0) {
    if (e.delete(p), e.size === 0)
      G(s);
    else if (e.size === 1) {
      const [i, o] = e.entries().next().value;
      Y(s, i, o);
    }
  }
}, G = (n) => {
  if (n.length === 0)
    return;
  const [t, e] = P(n);
  if (t.delete(e), t.size === 0)
    G(n.slice(0, -1));
  else if (t.size === 1) {
    const [s, i] = t.entries().next().value;
    s !== p && Y(n.slice(0, -1), s, i);
  }
}, Y = (n, t, e) => {
  if (n.length === 0)
    return;
  const [s, i] = P(n);
  s.set(i + t, e), s.delete(i);
}, P = (n) => n[n.length - 1], W = "or", Z = "and", st = "and_not";
class v {
  /**
   * @param options  Configuration options
   *
   * ### Examples:
   *
   * ```javascript
   * // Create a search engine that indexes the 'title' and 'text' fields of your
   * // documents:
   * const miniSearch = new MiniSearch({ fields: ['title', 'text'] })
   * ```
   *
   * ### ID Field:
   *
   * ```javascript
   * // Your documents are assumed to include a unique 'id' field, but if you want
   * // to use a different field for document identification, you can set the
   * // 'idField' option:
   * const miniSearch = new MiniSearch({ idField: 'key', fields: ['title', 'text'] })
   * ```
   *
   * ### Options and defaults:
   *
   * ```javascript
   * // The full set of options (here with their default value) is:
   * const miniSearch = new MiniSearch({
   *   // idField: field that uniquely identifies a document
   *   idField: 'id',
   *
   *   // extractField: function used to get the value of a field in a document.
   *   // By default, it assumes the document is a flat object with field names as
   *   // property keys and field values as string property values, but custom logic
   *   // can be implemented by setting this option to a custom extractor function.
   *   extractField: (document, fieldName) => document[fieldName],
   *
   *   // tokenize: function used to split fields into individual terms. By
   *   // default, it is also used to tokenize search queries, unless a specific
   *   // `tokenize` search option is supplied. When tokenizing an indexed field,
   *   // the field name is passed as the second argument.
   *   tokenize: (string, _fieldName) => string.split(SPACE_OR_PUNCTUATION),
   *
   *   // processTerm: function used to process each tokenized term before
   *   // indexing. It can be used for stemming and normalization. Return a falsy
   *   // value in order to discard a term. By default, it is also used to process
   *   // search queries, unless a specific `processTerm` option is supplied as a
   *   // search option. When processing a term from a indexed field, the field
   *   // name is passed as the second argument.
   *   processTerm: (term, _fieldName) => term.toLowerCase(),
   *
   *   // searchOptions: default search options, see the `search` method for
   *   // details
   *   searchOptions: undefined,
   *
   *   // fields: document fields to be indexed. Mandatory, but not set by default
   *   fields: undefined
   *
   *   // storeFields: document fields to be stored and returned as part of the
   *   // search results.
   *   storeFields: []
   * })
   * ```
   */
  constructor(t) {
    if ((t == null ? void 0 : t.fields) == null)
      throw new Error('MiniSearch: option "fields" must be provided');
    const e = t.autoVacuum == null || t.autoVacuum === !0 ? A : t.autoVacuum;
    this._options = Object.assign(Object.assign(Object.assign({}, E), t), { autoVacuum: e, searchOptions: Object.assign(Object.assign({}, J), t.searchOptions || {}), autoSuggestOptions: Object.assign(Object.assign({}, ct), t.autoSuggestOptions || {}) }), this._index = new b(), this._documentCount = 0, this._documentIds = /* @__PURE__ */ new Map(), this._idToShortId = /* @__PURE__ */ new Map(), this._fieldIds = {}, this._fieldLength = /* @__PURE__ */ new Map(), this._avgFieldLength = [], this._nextId = 0, this._storedFields = /* @__PURE__ */ new Map(), this._dirtCount = 0, this._currentVacuum = null, this._enqueuedVacuum = null, this._enqueuedVacuumConditions = N, this.addFields(this._options.fields);
  }
  /**
   * Adds a document to the index
   *
   * @param document  The document to be indexed
   */
  add(t) {
    const { extractField: e, tokenize: s, processTerm: i, fields: o, idField: r } = this._options, c = e(t, r);
    if (c == null)
      throw new Error(`MiniSearch: document does not have ID field "${r}"`);
    if (this._idToShortId.has(c))
      throw new Error(`MiniSearch: duplicate ID ${c}`);
    const u = this.addDocumentId(c);
    this.saveStoredFields(u, t);
    for (const d of o) {
      const h = e(t, d);
      if (h == null)
        continue;
      const l = s(h.toString(), d), a = this._fieldIds[d], m = new Set(l).size;
      this.addFieldLength(u, a, this._documentCount - 1, m);
      for (const _ of l) {
        const f = i(_, d);
        if (Array.isArray(f))
          for (const g of f)
            this.addTerm(a, u, g);
        else f && this.addTerm(a, u, f);
      }
    }
  }
  /**
   * Adds all the given documents to the index
   *
   * @param documents  An array of documents to be indexed
   */
  addAll(t) {
    for (const e of t)
      this.add(e);
  }
  /**
   * Adds all the given documents to the index asynchronously.
   *
   * Returns a promise that resolves (to `undefined`) when the indexing is done.
   * This method is useful when index many documents, to avoid blocking the main
   * thread. The indexing is performed asynchronously and in chunks.
   *
   * @param documents  An array of documents to be indexed
   * @param options  Configuration options
   * @return A promise resolving to `undefined` when the indexing is done
   */
  addAllAsync(t, e = {}) {
    const { chunkSize: s = 10 } = e, i = { chunk: [], promise: Promise.resolve() }, { chunk: o, promise: r } = t.reduce(({ chunk: c, promise: u }, d, h) => (c.push(d), (h + 1) % s === 0 ? {
      chunk: [],
      promise: u.then(() => new Promise((l) => setTimeout(l, 0))).then(() => this.addAll(c))
    } : { chunk: c, promise: u }), i);
    return r.then(() => this.addAll(o));
  }
  /**
   * Removes the given document from the index.
   *
   * The document to remove must NOT have changed between indexing and removal,
   * otherwise the index will be corrupted.
   *
   * This method requires passing the full document to be removed (not just the
   * ID), and immediately removes the document from the inverted index, allowing
   * memory to be released. A convenient alternative is {@link
   * MiniSearch#discard}, which needs only the document ID, and has the same
   * visible effect, but delays cleaning up the index until the next vacuuming.
   *
   * @param document  The document to be removed
   */
  remove(t) {
    const { tokenize: e, processTerm: s, extractField: i, fields: o, idField: r } = this._options, c = i(t, r);
    if (c == null)
      throw new Error(`MiniSearch: document does not have ID field "${r}"`);
    const u = this._idToShortId.get(c);
    if (u == null)
      throw new Error(`MiniSearch: cannot remove document with ID ${c}: it is not in the index`);
    for (const d of o) {
      const h = i(t, d);
      if (h == null)
        continue;
      const l = e(h.toString(), d), a = this._fieldIds[d], m = new Set(l).size;
      this.removeFieldLength(u, a, this._documentCount, m);
      for (const _ of l) {
        const f = s(_, d);
        if (Array.isArray(f))
          for (const g of f)
            this.removeTerm(a, u, g);
        else f && this.removeTerm(a, u, f);
      }
    }
    this._storedFields.delete(u), this._documentIds.delete(u), this._idToShortId.delete(c), this._fieldLength.delete(u), this._documentCount -= 1;
  }
  /**
   * Removes all the given documents from the index. If called with no arguments,
   * it removes _all_ documents from the index.
   *
   * @param documents  The documents to be removed. If this argument is omitted,
   * all documents are removed. Note that, for removing all documents, it is
   * more efficient to call this method with no arguments than to pass all
   * documents.
   */
  removeAll(t) {
    if (t)
      for (const e of t)
        this.remove(e);
    else {
      if (arguments.length > 0)
        throw new Error("Expected documents to be present. Omit the argument to remove all documents.");
      this._index = new b(), this._documentCount = 0, this._documentIds = /* @__PURE__ */ new Map(), this._idToShortId = /* @__PURE__ */ new Map(), this._fieldLength = /* @__PURE__ */ new Map(), this._avgFieldLength = [], this._storedFields = /* @__PURE__ */ new Map(), this._nextId = 0;
    }
  }
  /**
   * Discards the document with the given ID, so it won't appear in search results
   *
   * It has the same visible effect of {@link MiniSearch.remove} (both cause the
   * document to stop appearing in searches), but a different effect on the
   * internal data structures:
   *
   *   - {@link MiniSearch#remove} requires passing the full document to be
   *   removed as argument, and removes it from the inverted index immediately.
   *
   *   - {@link MiniSearch#discard} instead only needs the document ID, and
   *   works by marking the current version of the document as discarded, so it
   *   is immediately ignored by searches. This is faster and more convenient
   *   than {@link MiniSearch#remove}, but the index is not immediately
   *   modified. To take care of that, vacuuming is performed after a certain
   *   number of documents are discarded, cleaning up the index and allowing
   *   memory to be released.
   *
   * After discarding a document, it is possible to re-add a new version, and
   * only the new version will appear in searches. In other words, discarding
   * and re-adding a document works exactly like removing and re-adding it. The
   * {@link MiniSearch.replace} method can also be used to replace a document
   * with a new version.
   *
   * #### Details about vacuuming
   *
   * Repetite calls to this method would leave obsolete document references in
   * the index, invisible to searches. Two mechanisms take care of cleaning up:
   * clean up during search, and vacuuming.
   *
   *   - Upon search, whenever a discarded ID is found (and ignored for the
   *   results), references to the discarded document are removed from the
   *   inverted index entries for the search terms. This ensures that subsequent
   *   searches for the same terms do not need to skip these obsolete references
   *   again.
   *
   *   - In addition, vacuuming is performed automatically by default (see the
   *   `autoVacuum` field in {@link Options}) after a certain number of
   *   documents are discarded. Vacuuming traverses all terms in the index,
   *   cleaning up all references to discarded documents. Vacuuming can also be
   *   triggered manually by calling {@link MiniSearch#vacuum}.
   *
   * @param id  The ID of the document to be discarded
   */
  discard(t) {
    const e = this._idToShortId.get(t);
    if (e == null)
      throw new Error(`MiniSearch: cannot discard document with ID ${t}: it is not in the index`);
    this._idToShortId.delete(t), this._documentIds.delete(e), this._storedFields.delete(e), (this._fieldLength.get(e) || []).forEach((s, i) => {
      this.removeFieldLength(e, i, this._documentCount, s);
    }), this._fieldLength.delete(e), this._documentCount -= 1, this._dirtCount += 1, this.maybeAutoVacuum();
  }
  maybeAutoVacuum() {
    if (this._options.autoVacuum === !1)
      return;
    const { minDirtFactor: t, minDirtCount: e, batchSize: s, batchWait: i } = this._options.autoVacuum;
    this.conditionalVacuum({ batchSize: s, batchWait: i }, { minDirtCount: e, minDirtFactor: t });
  }
  /**
   * Discards the documents with the given IDs, so they won't appear in search
   * results
   *
   * It is equivalent to calling {@link MiniSearch#discard} for all the given
   * IDs, but with the optimization of triggering at most one automatic
   * vacuuming at the end.
   *
   * Note: to remove all documents from the index, it is faster and more
   * convenient to call {@link MiniSearch.removeAll} with no argument, instead
   * of passing all IDs to this method.
   */
  discardAll(t) {
    const e = this._options.autoVacuum;
    try {
      this._options.autoVacuum = !1;
      for (const s of t)
        this.discard(s);
    } finally {
      this._options.autoVacuum = e;
    }
    this.maybeAutoVacuum();
  }
  /**
   * It replaces an existing document with the given updated version
   *
   * It works by discarding the current version and adding the updated one, so
   * it is functionally equivalent to calling {@link MiniSearch#discard}
   * followed by {@link MiniSearch#add}. The ID of the updated document should
   * be the same as the original one.
   *
   * Since it uses {@link MiniSearch#discard} internally, this method relies on
   * vacuuming to clean up obsolete document references from the index, allowing
   * memory to be released (see {@link MiniSearch#discard}).
   *
   * @param updatedDocument  The updated document to replace the old version
   * with
   */
  replace(t) {
    const { idField: e, extractField: s } = this._options, i = s(t, e);
    this.discard(i), this.add(t);
  }
  /**
   * Triggers a manual vacuuming, cleaning up references to discarded documents
   * from the inverted index
   *
   * Vacuuming is only useful for applications that use the {@link
   * MiniSearch#discard} or {@link MiniSearch#replace} methods.
   *
   * By default, vacuuming is performed automatically when needed (controlled by
   * the `autoVacuum` field in {@link Options}), so there is usually no need to
   * call this method, unless one wants to make sure to perform vacuuming at a
   * specific moment.
   *
   * Vacuuming traverses all terms in the inverted index in batches, and cleans
   * up references to discarded documents from the posting list, allowing memory
   * to be released.
   *
   * The method takes an optional object as argument with the following keys:
   *
   *   - `batchSize`: the size of each batch (1000 by default)
   *
   *   - `batchWait`: the number of milliseconds to wait between batches (10 by
   *   default)
   *
   * On large indexes, vacuuming could have a non-negligible cost: batching
   * avoids blocking the thread for long, diluting this cost so that it is not
   * negatively affecting the application. Nonetheless, this method should only
   * be called when necessary, and relying on automatic vacuuming is usually
   * better.
   *
   * It returns a promise that resolves (to undefined) when the clean up is
   * completed. If vacuuming is already ongoing at the time this method is
   * called, a new one is enqueued immediately after the ongoing one, and a
   * corresponding promise is returned. However, no more than one vacuuming is
   * enqueued on top of the ongoing one, even if this method is called more
   * times (enqueuing multiple ones would be useless).
   *
   * @param options  Configuration options for the batch size and delay. See
   * {@link VacuumOptions}.
   */
  vacuum(t = {}) {
    return this.conditionalVacuum(t);
  }
  conditionalVacuum(t, e) {
    return this._currentVacuum ? (this._enqueuedVacuumConditions = this._enqueuedVacuumConditions && e, this._enqueuedVacuum != null ? this._enqueuedVacuum : (this._enqueuedVacuum = this._currentVacuum.then(() => {
      const s = this._enqueuedVacuumConditions;
      return this._enqueuedVacuumConditions = N, this.performVacuuming(t, s);
    }), this._enqueuedVacuum)) : this.vacuumConditionsMet(e) === !1 ? Promise.resolve() : (this._currentVacuum = this.performVacuuming(t), this._currentVacuum);
  }
  performVacuuming(t, e) {
    return M(this, void 0, void 0, function* () {
      const s = this._dirtCount;
      if (this.vacuumConditionsMet(e)) {
        const i = t.batchSize || R.batchSize, o = t.batchWait || R.batchWait;
        let r = 1;
        for (const [c, u] of this._index) {
          for (const [d, h] of u)
            for (const [l] of h)
              this._documentIds.has(l) || (h.size <= 1 ? u.delete(d) : h.delete(l));
          this._index.get(c).size === 0 && this._index.delete(c), r % i === 0 && (yield new Promise((d) => setTimeout(d, o))), r += 1;
        }
        this._dirtCount -= s;
      }
      yield null, this._currentVacuum = this._enqueuedVacuum, this._enqueuedVacuum = null;
    });
  }
  vacuumConditionsMet(t) {
    if (t == null)
      return !0;
    let { minDirtCount: e, minDirtFactor: s } = t;
    return e = e || A.minDirtCount, s = s || A.minDirtFactor, this.dirtCount >= e && this.dirtFactor >= s;
  }
  /**
   * Is `true` if a vacuuming operation is ongoing, `false` otherwise
   */
  get isVacuuming() {
    return this._currentVacuum != null;
  }
  /**
   * The number of documents discarded since the most recent vacuuming
   */
  get dirtCount() {
    return this._dirtCount;
  }
  /**
   * A number between 0 and 1 giving an indication about the proportion of
   * documents that are discarded, and can therefore be cleaned up by vacuuming.
   * A value close to 0 means that the index is relatively clean, while a higher
   * value means that the index is relatively dirty, and vacuuming could release
   * memory.
   */
  get dirtFactor() {
    return this._dirtCount / (1 + this._documentCount + this._dirtCount);
  }
  /**
   * Returns `true` if a document with the given ID is present in the index and
   * available for search, `false` otherwise
   *
   * @param id  The document ID
   */
  has(t) {
    return this._idToShortId.has(t);
  }
  /**
   * Returns the stored fields (as configured in the `storeFields` constructor
   * option) for the given document ID. Returns `undefined` if the document is
   * not present in the index.
   *
   * @param id  The document ID
   */
  getStoredFields(t) {
    const e = this._idToShortId.get(t);
    if (e != null)
      return this._storedFields.get(e);
  }
  /**
   * Search for documents matching the given search query.
   *
   * The result is a list of scored document IDs matching the query, sorted by
   * descending score, and each including data about which terms were matched and
   * in which fields.
   *
   * ### Basic usage:
   *
   * ```javascript
   * // Search for "zen art motorcycle" with default options: terms have to match
   * // exactly, and individual terms are joined with OR
   * miniSearch.search('zen art motorcycle')
   * // => [ { id: 2, score: 2.77258, match: { ... } }, { id: 4, score: 1.38629, match: { ... } } ]
   * ```
   *
   * ### Restrict search to specific fields:
   *
   * ```javascript
   * // Search only in the 'title' field
   * miniSearch.search('zen', { fields: ['title'] })
   * ```
   *
   * ### Field boosting:
   *
   * ```javascript
   * // Boost a field
   * miniSearch.search('zen', { boost: { title: 2 } })
   * ```
   *
   * ### Prefix search:
   *
   * ```javascript
   * // Search for "moto" with prefix search (it will match documents
   * // containing terms that start with "moto" or "neuro")
   * miniSearch.search('moto neuro', { prefix: true })
   * ```
   *
   * ### Fuzzy search:
   *
   * ```javascript
   * // Search for "ismael" with fuzzy search (it will match documents containing
   * // terms similar to "ismael", with a maximum edit distance of 0.2 term.length
   * // (rounded to nearest integer)
   * miniSearch.search('ismael', { fuzzy: 0.2 })
   * ```
   *
   * ### Combining strategies:
   *
   * ```javascript
   * // Mix of exact match, prefix search, and fuzzy search
   * miniSearch.search('ismael mob', {
   *  prefix: true,
   *  fuzzy: 0.2
   * })
   * ```
   *
   * ### Advanced prefix and fuzzy search:
   *
   * ```javascript
   * // Perform fuzzy and prefix search depending on the search term. Here
   * // performing prefix and fuzzy search only on terms longer than 3 characters
   * miniSearch.search('ismael mob', {
   *  prefix: term => term.length > 3
   *  fuzzy: term => term.length > 3 ? 0.2 : null
   * })
   * ```
   *
   * ### Combine with AND:
   *
   * ```javascript
   * // Combine search terms with AND (to match only documents that contain both
   * // "motorcycle" and "art")
   * miniSearch.search('motorcycle art', { combineWith: 'AND' })
   * ```
   *
   * ### Combine with AND_NOT:
   *
   * There is also an AND_NOT combinator, that finds documents that match the
   * first term, but do not match any of the other terms. This combinator is
   * rarely useful with simple queries, and is meant to be used with advanced
   * query combinations (see later for more details).
   *
   * ### Filtering results:
   *
   * ```javascript
   * // Filter only results in the 'fiction' category (assuming that 'category'
   * // is a stored field)
   * miniSearch.search('motorcycle art', {
   *   filter: (result) => result.category === 'fiction'
   * })
   * ```
   *
   * ### Wildcard query
   *
   * Searching for an empty string (assuming the default tokenizer) returns no
   * results. Sometimes though, one needs to match all documents, like in a
   * "wildcard" search. This is possible by passing the special value
   * {@link MiniSearch.wildcard} as the query:
   *
   * ```javascript
   * // Return search results for all documents
   * miniSearch.search(MiniSearch.wildcard)
   * ```
   *
   * Note that search options such as `filter` and `boostDocument` are still
   * applied, influencing which results are returned, and their order:
   *
   * ```javascript
   * // Return search results for all documents in the 'fiction' category
   * miniSearch.search(MiniSearch.wildcard, {
   *   filter: (result) => result.category === 'fiction'
   * })
   * ```
   *
   * ### Advanced combination of queries:
   *
   * It is possible to combine different subqueries with OR, AND, and AND_NOT,
   * and even with different search options, by passing a query expression
   * tree object as the first argument, instead of a string.
   *
   * ```javascript
   * // Search for documents that contain "zen" and ("motorcycle" or "archery")
   * miniSearch.search({
   *   combineWith: 'AND',
   *   queries: [
   *     'zen',
   *     {
   *       combineWith: 'OR',
   *       queries: ['motorcycle', 'archery']
   *     }
   *   ]
   * })
   *
   * // Search for documents that contain ("apple" or "pear") but not "juice" and
   * // not "tree"
   * miniSearch.search({
   *   combineWith: 'AND_NOT',
   *   queries: [
   *     {
   *       combineWith: 'OR',
   *       queries: ['apple', 'pear']
   *     },
   *     'juice',
   *     'tree'
   *   ]
   * })
   * ```
   *
   * Each node in the expression tree can be either a string, or an object that
   * supports all {@link SearchOptions} fields, plus a `queries` array field for
   * subqueries.
   *
   * Note that, while this can become complicated to do by hand for complex or
   * deeply nested queries, it provides a formalized expression tree API for
   * external libraries that implement a parser for custom query languages.
   *
   * @param query  Search query
   * @param options  Search options. Each option, if not given, defaults to the corresponding value of `searchOptions` given to the constructor, or to the library default.
   */
  search(t, e = {}) {
    const s = this.executeQuery(t, e), i = [];
    for (const [o, { score: r, terms: c, match: u }] of s) {
      const d = c.length || 1, h = {
        id: this._documentIds.get(o),
        score: r * d,
        terms: Object.keys(u),
        queryTerms: c,
        match: u
      };
      Object.assign(h, this._storedFields.get(o)), (e.filter == null || e.filter(h)) && i.push(h);
    }
    return t === v.wildcard && e.boostDocument == null && this._options.searchOptions.boostDocument == null || i.sort(q), i;
  }
  /**
   * Provide suggestions for the given search query
   *
   * The result is a list of suggested modified search queries, derived from the
   * given search query, each with a relevance score, sorted by descending score.
   *
   * By default, it uses the same options used for search, except that by
   * default it performs prefix search on the last term of the query, and
   * combine terms with `'AND'` (requiring all query terms to match). Custom
   * options can be passed as a second argument. Defaults can be changed upon
   * calling the {@link MiniSearch} constructor, by passing a
   * `autoSuggestOptions` option.
   *
   * ### Basic usage:
   *
   * ```javascript
   * // Get suggestions for 'neuro':
   * miniSearch.autoSuggest('neuro')
   * // => [ { suggestion: 'neuromancer', terms: [ 'neuromancer' ], score: 0.46240 } ]
   * ```
   *
   * ### Multiple words:
   *
   * ```javascript
   * // Get suggestions for 'zen ar':
   * miniSearch.autoSuggest('zen ar')
   * // => [
   * //  { suggestion: 'zen archery art', terms: [ 'zen', 'archery', 'art' ], score: 1.73332 },
   * //  { suggestion: 'zen art', terms: [ 'zen', 'art' ], score: 1.21313 }
   * // ]
   * ```
   *
   * ### Fuzzy suggestions:
   *
   * ```javascript
   * // Correct spelling mistakes using fuzzy search:
   * miniSearch.autoSuggest('neromancer', { fuzzy: 0.2 })
   * // => [ { suggestion: 'neuromancer', terms: [ 'neuromancer' ], score: 1.03998 } ]
   * ```
   *
   * ### Filtering:
   *
   * ```javascript
   * // Get suggestions for 'zen ar', but only within the 'fiction' category
   * // (assuming that 'category' is a stored field):
   * miniSearch.autoSuggest('zen ar', {
   *   filter: (result) => result.category === 'fiction'
   * })
   * // => [
   * //  { suggestion: 'zen archery art', terms: [ 'zen', 'archery', 'art' ], score: 1.73332 },
   * //  { suggestion: 'zen art', terms: [ 'zen', 'art' ], score: 1.21313 }
   * // ]
   * ```
   *
   * @param queryString  Query string to be expanded into suggestions
   * @param options  Search options. The supported options and default values
   * are the same as for the {@link MiniSearch#search} method, except that by
   * default prefix search is performed on the last term in the query, and terms
   * are combined with `'AND'`.
   * @return  A sorted array of suggestions sorted by relevance score.
   */
  autoSuggest(t, e = {}) {
    e = Object.assign(Object.assign({}, this._options.autoSuggestOptions), e);
    const s = /* @__PURE__ */ new Map();
    for (const { score: o, terms: r } of this.search(t, e)) {
      const c = r.join(" "), u = s.get(c);
      u != null ? (u.score += o, u.count += 1) : s.set(c, { score: o, terms: r, count: 1 });
    }
    const i = [];
    for (const [o, { score: r, terms: c, count: u }] of s)
      i.push({ suggestion: o, terms: c, score: r / u });
    return i.sort(q), i;
  }
  /**
   * Total number of documents available to search
   */
  get documentCount() {
    return this._documentCount;
  }
  /**
   * Number of terms in the index
   */
  get termCount() {
    return this._index.size;
  }
  /**
   * Deserializes a JSON index (serialized with `JSON.stringify(miniSearch)`)
   * and instantiates a MiniSearch instance. It should be given the same options
   * originally used when serializing the index.
   *
   * ### Usage:
   *
   * ```javascript
   * // If the index was serialized with:
   * let miniSearch = new MiniSearch({ fields: ['title', 'text'] })
   * miniSearch.addAll(documents)
   *
   * const json = JSON.stringify(miniSearch)
   * // It can later be deserialized like this:
   * miniSearch = MiniSearch.loadJSON(json, { fields: ['title', 'text'] })
   * ```
   *
   * @param json  JSON-serialized index
   * @param options  configuration options, same as the constructor
   * @return An instance of MiniSearch deserialized from the given JSON.
   */
  static loadJSON(t, e) {
    if (e == null)
      throw new Error("MiniSearch: loadJSON should be given the same options used when serializing the index");
    return this.loadJS(JSON.parse(t), e);
  }
  /**
   * Async equivalent of {@link MiniSearch.loadJSON}
   *
   * This function is an alternative to {@link MiniSearch.loadJSON} that returns
   * a promise, and loads the index in batches, leaving pauses between them to avoid
   * blocking the main thread. It tends to be slower than the synchronous
   * version, but does not block the main thread, so it can be a better choice
   * when deserializing very large indexes.
   *
   * @param json  JSON-serialized index
   * @param options  configuration options, same as the constructor
   * @return A Promise that will resolve to an instance of MiniSearch deserialized from the given JSON.
   */
  static loadJSONAsync(t, e) {
    return M(this, void 0, void 0, function* () {
      if (e == null)
        throw new Error("MiniSearch: loadJSON should be given the same options used when serializing the index");
      return this.loadJSAsync(JSON.parse(t), e);
    });
  }
  /**
   * Returns the default value of an option. It will throw an error if no option
   * with the given name exists.
   *
   * @param optionName  Name of the option
   * @return The default value of the given option
   *
   * ### Usage:
   *
   * ```javascript
   * // Get default tokenizer
   * MiniSearch.getDefault('tokenize')
   *
   * // Get default term processor
   * MiniSearch.getDefault('processTerm')
   *
   * // Unknown options will throw an error
   * MiniSearch.getDefault('notExisting')
   * // => throws 'MiniSearch: unknown option "notExisting"'
   * ```
   */
  static getDefault(t) {
    if (E.hasOwnProperty(t))
      return T(E, t);
    throw new Error(`MiniSearch: unknown option "${t}"`);
  }
  /**
   * @ignore
   */
  static loadJS(t, e) {
    const { index: s, documentIds: i, fieldLength: o, storedFields: r, serializationVersion: c } = t, u = this.instantiateMiniSearch(t, e);
    u._documentIds = F(i), u._fieldLength = F(o), u._storedFields = F(r);
    for (const [d, h] of u._documentIds)
      u._idToShortId.set(h, d);
    for (const [d, h] of s) {
      const l = /* @__PURE__ */ new Map();
      for (const a of Object.keys(h)) {
        let m = h[a];
        c === 1 && (m = m.ds), l.set(parseInt(a, 10), F(m));
      }
      u._index.set(d, l);
    }
    return u;
  }
  /**
   * @ignore
   */
  static loadJSAsync(t, e) {
    return M(this, void 0, void 0, function* () {
      const { index: s, documentIds: i, fieldLength: o, storedFields: r, serializationVersion: c } = t, u = this.instantiateMiniSearch(t, e);
      u._documentIds = yield O(i), u._fieldLength = yield O(o), u._storedFields = yield O(r);
      for (const [h, l] of u._documentIds)
        u._idToShortId.set(l, h);
      let d = 0;
      for (const [h, l] of s) {
        const a = /* @__PURE__ */ new Map();
        for (const m of Object.keys(l)) {
          let _ = l[m];
          c === 1 && (_ = _.ds), a.set(parseInt(m, 10), yield O(_));
        }
        ++d % 1e3 === 0 && (yield H(0)), u._index.set(h, a);
      }
      return u;
    });
  }
  /**
   * @ignore
   */
  static instantiateMiniSearch(t, e) {
    const { documentCount: s, nextId: i, fieldIds: o, averageFieldLength: r, dirtCount: c, serializationVersion: u } = t;
    if (u !== 1 && u !== 2)
      throw new Error("MiniSearch: cannot deserialize an index created with an incompatible version");
    const d = new v(e);
    return d._documentCount = s, d._nextId = i, d._idToShortId = /* @__PURE__ */ new Map(), d._fieldIds = o, d._avgFieldLength = r, d._dirtCount = c || 0, d._index = new b(), d;
  }
  /**
   * @ignore
   */
  executeQuery(t, e = {}) {
    if (t === v.wildcard)
      return this.executeWildcardQuery(e);
    if (typeof t != "string") {
      const a = Object.assign(Object.assign(Object.assign({}, e), t), { queries: void 0 }), m = t.queries.map((_) => this.executeQuery(_, a));
      return this.combineResults(m, a.combineWith);
    }
    const { tokenize: s, processTerm: i, searchOptions: o } = this._options, r = Object.assign(Object.assign({ tokenize: s, processTerm: i }, o), e), { tokenize: c, processTerm: u } = r, l = c(t).flatMap((a) => u(a)).filter((a) => !!a).map(rt(r)).map((a) => this.executeQuerySpec(a, r));
    return this.combineResults(l, r.combineWith);
  }
  /**
   * @ignore
   */
  executeQuerySpec(t, e) {
    const s = Object.assign(Object.assign({}, this._options.searchOptions), e), i = (s.fields || this._options.fields).reduce((f, g) => Object.assign(Object.assign({}, f), { [g]: T(s.boost, g) || 1 }), {}), { boostDocument: o, weights: r, maxFuzzy: c, bm25: u } = s, { fuzzy: d, prefix: h } = Object.assign(Object.assign({}, J.weights), r), l = this._index.get(t.term), a = this.termResults(t.term, t.term, 1, t.termBoost, l, i, o, u);
    let m, _;
    if (t.prefix && (m = this._index.atPrefix(t.term)), t.fuzzy) {
      const f = t.fuzzy === !0 ? 0.2 : t.fuzzy, g = f < 1 ? Math.min(c, Math.round(t.term.length * f)) : f;
      g && (_ = this._index.fuzzyGet(t.term, g));
    }
    if (m)
      for (const [f, g] of m) {
        const y = f.length - t.term.length;
        if (!y)
          continue;
        _ == null || _.delete(f);
        const w = h * f.length / (f.length + 0.3 * y);
        this.termResults(t.term, f, w, t.termBoost, g, i, o, u, a);
      }
    if (_)
      for (const f of _.keys()) {
        const [g, y] = _.get(f);
        if (!y)
          continue;
        const w = d * f.length / (f.length + y);
        this.termResults(t.term, f, w, t.termBoost, g, i, o, u, a);
      }
    return a;
  }
  /**
   * @ignore
   */
  executeWildcardQuery(t) {
    const e = /* @__PURE__ */ new Map(), s = Object.assign(Object.assign({}, this._options.searchOptions), t);
    for (const [i, o] of this._documentIds) {
      const r = s.boostDocument ? s.boostDocument(o, "", this._storedFields.get(i)) : 1;
      e.set(i, {
        score: r,
        terms: [],
        match: {}
      });
    }
    return e;
  }
  /**
   * @ignore
   */
  combineResults(t, e = W) {
    if (t.length === 0)
      return /* @__PURE__ */ new Map();
    const s = e.toLowerCase(), i = nt[s];
    if (!i)
      throw new Error(`Invalid combination operator: ${e}`);
    return t.reduce(i) || /* @__PURE__ */ new Map();
  }
  /**
   * Allows serialization of the index to JSON, to possibly store it and later
   * deserialize it with {@link MiniSearch.loadJSON}.
   *
   * Normally one does not directly call this method, but rather call the
   * standard JavaScript `JSON.stringify()` passing the {@link MiniSearch}
   * instance, and JavaScript will internally call this method. Upon
   * deserialization, one must pass to {@link MiniSearch.loadJSON} the same
   * options used to create the original instance that was serialized.
   *
   * ### Usage:
   *
   * ```javascript
   * // Serialize the index:
   * let miniSearch = new MiniSearch({ fields: ['title', 'text'] })
   * miniSearch.addAll(documents)
   * const json = JSON.stringify(miniSearch)
   *
   * // Later, to deserialize it:
   * miniSearch = MiniSearch.loadJSON(json, { fields: ['title', 'text'] })
   * ```
   *
   * @return A plain-object serializable representation of the search index.
   */
  toJSON() {
    const t = [];
    for (const [e, s] of this._index) {
      const i = {};
      for (const [o, r] of s)
        i[o] = Object.fromEntries(r);
      t.push([e, i]);
    }
    return {
      documentCount: this._documentCount,
      nextId: this._nextId,
      documentIds: Object.fromEntries(this._documentIds),
      fieldIds: this._fieldIds,
      fieldLength: Object.fromEntries(this._fieldLength),
      averageFieldLength: this._avgFieldLength,
      storedFields: Object.fromEntries(this._storedFields),
      dirtCount: this._dirtCount,
      index: t,
      serializationVersion: 2
    };
  }
  /**
   * @ignore
   */
  termResults(t, e, s, i, o, r, c, u, d = /* @__PURE__ */ new Map()) {
    if (o == null)
      return d;
    for (const h of Object.keys(r)) {
      const l = r[h], a = this._fieldIds[h], m = o.get(a);
      if (m == null)
        continue;
      let _ = m.size;
      const f = this._avgFieldLength[a];
      for (const g of m.keys()) {
        if (!this._documentIds.has(g)) {
          this.removeTerm(a, g, e), _ -= 1;
          continue;
        }
        const y = c ? c(this._documentIds.get(g), e, this._storedFields.get(g)) : 1;
        if (!y)
          continue;
        const w = m.get(g), V = this._fieldLength.get(g)[a], C = ot(w, _, this._documentCount, V, f, u), x = s * i * l * y * C, S = d.get(g);
        if (S) {
          S.score += x, ut(S.terms, t);
          const I = T(S.match, e);
          I ? I.push(h) : S.match[e] = [h];
        } else
          d.set(g, {
            score: x,
            terms: [t],
            match: { [e]: [h] }
          });
      }
    }
    return d;
  }
  /**
   * @ignore
   */
  addTerm(t, e, s) {
    const i = this._index.fetch(s, U);
    let o = i.get(t);
    if (o == null)
      o = /* @__PURE__ */ new Map(), o.set(e, 1), i.set(t, o);
    else {
      const r = o.get(e);
      o.set(e, (r || 0) + 1);
    }
  }
  /**
   * @ignore
   */
  removeTerm(t, e, s) {
    if (!this._index.has(s)) {
      this.warnDocumentChanged(e, t, s);
      return;
    }
    const i = this._index.fetch(s, U), o = i.get(t);
    o == null || o.get(e) == null ? this.warnDocumentChanged(e, t, s) : o.get(e) <= 1 ? o.size <= 1 ? i.delete(t) : o.delete(e) : o.set(e, o.get(e) - 1), this._index.get(s).size === 0 && this._index.delete(s);
  }
  /**
   * @ignore
   */
  warnDocumentChanged(t, e, s) {
    for (const i of Object.keys(this._fieldIds))
      if (this._fieldIds[i] === e) {
        this._options.logger("warn", `MiniSearch: document with ID ${this._documentIds.get(t)} has changed before removal: term "${s}" was not present in field "${i}". Removing a document after it has changed can corrupt the index!`, "version_conflict");
        return;
      }
  }
  /**
   * @ignore
   */
  addDocumentId(t) {
    const e = this._nextId;
    return this._idToShortId.set(t, e), this._documentIds.set(e, t), this._documentCount += 1, this._nextId += 1, e;
  }
  /**
   * @ignore
   */
  addFields(t) {
    for (let e = 0; e < t.length; e++)
      this._fieldIds[t[e]] = e;
  }
  /**
   * @ignore
   */
  addFieldLength(t, e, s, i) {
    let o = this._fieldLength.get(t);
    o == null && this._fieldLength.set(t, o = []), o[e] = i;
    const c = (this._avgFieldLength[e] || 0) * s + i;
    this._avgFieldLength[e] = c / (s + 1);
  }
  /**
   * @ignore
   */
  removeFieldLength(t, e, s, i) {
    if (s === 1) {
      this._avgFieldLength[e] = 0;
      return;
    }
    const o = this._avgFieldLength[e] * s - i;
    this._avgFieldLength[e] = o / (s - 1);
  }
  /**
   * @ignore
   */
  saveStoredFields(t, e) {
    const { storeFields: s, extractField: i } = this._options;
    if (s == null || s.length === 0)
      return;
    let o = this._storedFields.get(t);
    o == null && this._storedFields.set(t, o = {});
    for (const r of s) {
      const c = i(e, r);
      c !== void 0 && (o[r] = c);
    }
  }
}
v.wildcard = Symbol("*");
const T = (n, t) => Object.prototype.hasOwnProperty.call(n, t) ? n[t] : void 0, nt = {
  [W]: (n, t) => {
    for (const e of t.keys()) {
      const s = n.get(e);
      if (s == null)
        n.set(e, t.get(e));
      else {
        const { score: i, terms: o, match: r } = t.get(e);
        s.score = s.score + i, s.match = Object.assign(s.match, r), $(s.terms, o);
      }
    }
    return n;
  },
  [Z]: (n, t) => {
    const e = /* @__PURE__ */ new Map();
    for (const s of t.keys()) {
      const i = n.get(s);
      if (i == null)
        continue;
      const { score: o, terms: r, match: c } = t.get(s);
      $(i.terms, r), e.set(s, {
        score: i.score + o,
        terms: i.terms,
        match: Object.assign(i.match, c)
      });
    }
    return e;
  },
  [st]: (n, t) => {
    for (const e of t.keys())
      n.delete(e);
    return n;
  }
}, it = { k: 1.2, b: 0.7, d: 0.5 }, ot = (n, t, e, s, i, o) => {
  const { k: r, b: c, d: u } = o;
  return Math.log(1 + (e - t + 0.5) / (t + 0.5)) * (u + n * (r + 1) / (n + r * (1 - c + c * s / i)));
}, rt = (n) => (t, e, s) => {
  const i = typeof n.fuzzy == "function" ? n.fuzzy(t, e, s) : n.fuzzy || !1, o = typeof n.prefix == "function" ? n.prefix(t, e, s) : n.prefix === !0, r = typeof n.boostTerm == "function" ? n.boostTerm(t, e, s) : 1;
  return { term: t, fuzzy: i, prefix: o, termBoost: r };
}, E = {
  idField: "id",
  extractField: (n, t) => n[t],
  tokenize: (n) => n.split(dt),
  processTerm: (n) => n.toLowerCase(),
  fields: void 0,
  searchOptions: void 0,
  storeFields: [],
  logger: (n, t) => {
    typeof (console == null ? void 0 : console[n]) == "function" && console[n](t);
  },
  autoVacuum: !0
}, J = {
  combineWith: W,
  prefix: !1,
  fuzzy: !1,
  maxFuzzy: 6,
  boost: {},
  weights: { fuzzy: 0.45, prefix: 0.375 },
  bm25: it
}, ct = {
  combineWith: Z,
  prefix: (n, t, e) => t === e.length - 1
}, R = { batchSize: 1e3, batchWait: 10 }, N = { minDirtFactor: 0.1, minDirtCount: 20 }, A = Object.assign(Object.assign({}, R), N), ut = (n, t) => {
  n.includes(t) || n.push(t);
}, $ = (n, t) => {
  for (const e of t)
    n.includes(e) || n.push(e);
}, q = ({ score: n }, { score: t }) => t - n, U = () => /* @__PURE__ */ new Map(), F = (n) => {
  const t = /* @__PURE__ */ new Map();
  for (const e of Object.keys(n))
    t.set(parseInt(e, 10), n[e]);
  return t;
}, O = (n) => M(void 0, void 0, void 0, function* () {
  const t = /* @__PURE__ */ new Map();
  let e = 0;
  for (const s of Object.keys(n))
    t.set(parseInt(s, 10), n[s]), ++e % 1e3 === 0 && (yield H(0));
  return t;
}), H = (n) => new Promise((t) => setTimeout(t, n)), dt = /[\n\r\p{Z}\p{P}]+/u;
async function ht() {
  const n = await fetch("/static/files.json");
  if (!n.ok)
    throw new Error(`Failed to load JSON: ${n.status}`);
  return await n.json();
}
function at(n) {
  const t = new v({
    fields: ["title", "excerpt", "content", "route"],
    // fields to index for full-text search
    storeFields: ["title", "excerpt", "content", "route"]
    // fields to return with search results
  });
  return t.addAll(n), t;
}
function lt(n, t) {
  return t.search(n);
}
function ft() {
  const n = new URL(window.location.href);
  return new URLSearchParams(n.search).get("search");
}
function mt() {
  const n = document.querySelector("#search-form");
  return (n == null ? void 0 : n.querySelector("input[name=search]")) ?? null;
}
function gt(n) {
  return n.map((e) => e.route);
}
function _t() {
  const n = document.querySelectorAll(".article-list li");
  return Array.from(n);
}
function pt(n, t) {
  n.filter((e) => {
    var r;
    const s = ((r = e.querySelector("a")) == null ? void 0 : r.href) || "", o = new URL(s).pathname.slice(1);
    return !t.includes(o);
  }).forEach((e) => {
    e.style.display = "none";
  });
}
async function wt() {
  const n = await ht(), t = at(n), e = ft();
  if (!e)
    return;
  const s = lt(e, t), i = mt();
  if (!i)
    return;
  i.value = e;
  const o = gt(s), r = _t();
  pt(r, o);
}
wt();
