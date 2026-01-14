import { app as Et, BrowserWindow as Rn, ipcMain as Ke, dialog as Ns } from "electron";
import { stat as sr, rename as Bs, readFile as Ti } from "node:fs/promises";
import jr from "os";
import _e from "path";
import En from "util";
import Nt from "stream";
import Us from "events";
import Vr from "fs";
import { fileURLToPath as Hs } from "node:url";
import Ae from "node:path";
var Bt = typeof self < "u" ? self : global;
const ot = typeof navigator < "u", Gs = ot && typeof HTMLImageElement > "u", wt = !(typeof global > "u" || typeof process > "u" || !process.versions || !process.versions.node), Ut = Bt.Buffer, St = Bt.BigInt, Ht = !!Ut, js = (r) => r;
function Tt(r, e = js) {
  if (wt) try {
    return typeof require == "function" ? Promise.resolve(e(require(r))) : import(
      /* webpackIgnore: true */
      r
    ).then(e);
  } catch {
    console.warn(`Couldn't load ${r}`);
  }
}
let Wr = Bt.fetch;
const Vs = (r) => Wr = r;
if (!Bt.fetch) {
  const r = Tt("http", (i) => i), e = Tt("https", (i) => i), t = (i, { headers: n } = {}) => new Promise(async (s, a) => {
    let { port: o, hostname: l, pathname: c, protocol: u, search: p } = new URL(i);
    const f = { method: "GET", hostname: l, path: encodeURI(c) + p, headers: n };
    o !== "" && (f.port = Number(o));
    const C = (u === "https:" ? await e : await r).request(f, (m) => {
      if (m.statusCode === 301 || m.statusCode === 302) {
        let S = new URL(m.headers.location, i).toString();
        return t(S, { headers: n }).then(s).catch(a);
      }
      s({ status: m.statusCode, arrayBuffer: () => new Promise((S) => {
        let w = [];
        m.on("data", (k) => w.push(k)), m.on("end", () => S(Buffer.concat(w)));
      }) });
    });
    C.on("error", a), C.end();
  });
  Vs(t);
}
function P(r, e, t) {
  return e in r ? Object.defineProperty(r, e, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : r[e] = t, r;
}
const kt = (r) => wn(r) ? void 0 : r, Ws = (r) => r !== void 0;
function wn(r) {
  return r === void 0 || (r instanceof Map ? r.size === 0 : Object.values(r).filter(Ws).length === 0);
}
function V(r) {
  let e = new Error(r);
  throw delete e.stack, e;
}
function Ne(r) {
  return (r = function(e) {
    for (; e.endsWith("\0"); ) e = e.slice(0, -1);
    return e;
  }(r).trim()) === "" ? void 0 : r;
}
function Pr(r) {
  let e = function(t) {
    let i = 0;
    return t.ifd0.enabled && (i += 1024), t.exif.enabled && (i += 2048), t.makerNote && (i += 2048), t.userComment && (i += 1024), t.gps.enabled && (i += 512), t.interop.enabled && (i += 100), t.ifd1.enabled && (i += 1024), i + 2048;
  }(r);
  return r.jfif.enabled && (e += 50), r.xmp.enabled && (e += 2e4), r.iptc.enabled && (e += 14e3), r.icc.enabled && (e += 6e3), e;
}
const Ar = (r) => String.fromCharCode.apply(null, r), ki = typeof TextDecoder < "u" ? new TextDecoder("utf-8") : void 0;
function Tn(r) {
  return ki ? ki.decode(r) : Ht ? Buffer.from(r).toString("utf8") : decodeURIComponent(escape(Ar(r)));
}
class te {
  static from(e, t) {
    return e instanceof this && e.le === t ? e : new te(e, void 0, void 0, t);
  }
  constructor(e, t = 0, i, n) {
    if (typeof n == "boolean" && (this.le = n), Array.isArray(e) && (e = new Uint8Array(e)), e === 0) this.byteOffset = 0, this.byteLength = 0;
    else if (e instanceof ArrayBuffer) {
      i === void 0 && (i = e.byteLength - t);
      let s = new DataView(e, t, i);
      this._swapDataView(s);
    } else if (e instanceof Uint8Array || e instanceof DataView || e instanceof te) {
      i === void 0 && (i = e.byteLength - t), (t += e.byteOffset) + i > e.byteOffset + e.byteLength && V("Creating view outside of available memory in ArrayBuffer");
      let s = new DataView(e.buffer, t, i);
      this._swapDataView(s);
    } else if (typeof e == "number") {
      let s = new DataView(new ArrayBuffer(e));
      this._swapDataView(s);
    } else V("Invalid input argument for BufferView: " + e);
  }
  _swapArrayBuffer(e) {
    this._swapDataView(new DataView(e));
  }
  _swapBuffer(e) {
    this._swapDataView(new DataView(e.buffer, e.byteOffset, e.byteLength));
  }
  _swapDataView(e) {
    this.dataView = e, this.buffer = e.buffer, this.byteOffset = e.byteOffset, this.byteLength = e.byteLength;
  }
  _lengthToEnd(e) {
    return this.byteLength - e;
  }
  set(e, t, i = te) {
    return e instanceof DataView || e instanceof te ? e = new Uint8Array(e.buffer, e.byteOffset, e.byteLength) : e instanceof ArrayBuffer && (e = new Uint8Array(e)), e instanceof Uint8Array || V("BufferView.set(): Invalid data argument."), this.toUint8().set(e, t), new i(this, t, e.byteLength);
  }
  subarray(e, t) {
    return t = t || this._lengthToEnd(e), new te(this, e, t);
  }
  toUint8() {
    return new Uint8Array(this.buffer, this.byteOffset, this.byteLength);
  }
  getUint8Array(e, t) {
    return new Uint8Array(this.buffer, this.byteOffset + e, t);
  }
  getString(e = 0, t = this.byteLength) {
    return Tn(this.getUint8Array(e, t));
  }
  getLatin1String(e = 0, t = this.byteLength) {
    let i = this.getUint8Array(e, t);
    return Ar(i);
  }
  getUnicodeString(e = 0, t = this.byteLength) {
    const i = [];
    for (let n = 0; n < t && e + n < this.byteLength; n += 2) i.push(this.getUint16(e + n));
    return Ar(i);
  }
  getInt8(e) {
    return this.dataView.getInt8(e);
  }
  getUint8(e) {
    return this.dataView.getUint8(e);
  }
  getInt16(e, t = this.le) {
    return this.dataView.getInt16(e, t);
  }
  getInt32(e, t = this.le) {
    return this.dataView.getInt32(e, t);
  }
  getUint16(e, t = this.le) {
    return this.dataView.getUint16(e, t);
  }
  getUint32(e, t = this.le) {
    return this.dataView.getUint32(e, t);
  }
  getFloat32(e, t = this.le) {
    return this.dataView.getFloat32(e, t);
  }
  getFloat64(e, t = this.le) {
    return this.dataView.getFloat64(e, t);
  }
  getFloat(e, t = this.le) {
    return this.dataView.getFloat32(e, t);
  }
  getDouble(e, t = this.le) {
    return this.dataView.getFloat64(e, t);
  }
  getUintBytes(e, t, i) {
    switch (t) {
      case 1:
        return this.getUint8(e, i);
      case 2:
        return this.getUint16(e, i);
      case 4:
        return this.getUint32(e, i);
      case 8:
        return this.getUint64 && this.getUint64(e, i);
    }
  }
  getUint(e, t, i) {
    switch (t) {
      case 8:
        return this.getUint8(e, i);
      case 16:
        return this.getUint16(e, i);
      case 32:
        return this.getUint32(e, i);
      case 64:
        return this.getUint64 && this.getUint64(e, i);
    }
  }
  toString(e) {
    return this.dataView.toString(e, this.constructor.name);
  }
  ensureChunk() {
  }
}
function Rr(r, e) {
  V(`${r} '${e}' was not loaded, try using full build of exifr.`);
}
class zr extends Map {
  constructor(e) {
    super(), this.kind = e;
  }
  get(e, t) {
    return this.has(e) || Rr(this.kind, e), t && (e in t || function(i, n) {
      V(`Unknown ${i} '${n}'.`);
    }(this.kind, e), t[e].enabled || Rr(this.kind, e)), super.get(e);
  }
  keyList() {
    return Array.from(this.keys());
  }
}
var Se = new zr("file parser"), j = new zr("segment parser"), be = new zr("file reader");
function zs(r, e) {
  return typeof r == "string" ? Oi(r, e) : ot && !Gs && r instanceof HTMLImageElement ? Oi(r.src, e) : r instanceof Uint8Array || r instanceof ArrayBuffer || r instanceof DataView ? new te(r) : ot && r instanceof Blob ? Er(r, e, "blob", je) : void V("Invalid input argument");
}
function Oi(r, e) {
  return (t = r).startsWith("data:") || t.length > 1e4 ? wr(r, e, "base64") : wt && r.includes("://") ? Er(r, e, "url", Ge) : wt ? wr(r, e, "fs") : ot ? Er(r, e, "url", Ge) : void V("Invalid input argument");
  var t;
}
async function Er(r, e, t, i) {
  return be.has(t) ? wr(r, e, t) : i ? async function(n, s) {
    let a = await s(n);
    return new te(a);
  }(r, i) : void V(`Parser ${t} is not loaded`);
}
async function wr(r, e, t) {
  let i = new (be.get(t))(r, e);
  return await i.read(), i;
}
const Ge = (r) => Wr(r).then((e) => e.arrayBuffer()), je = (r) => new Promise((e, t) => {
  let i = new FileReader();
  i.onloadend = () => e(i.result || new ArrayBuffer()), i.onerror = t, i.readAsArrayBuffer(r);
});
class Ks extends Map {
  get tagKeys() {
    return this.allKeys || (this.allKeys = Array.from(this.keys())), this.allKeys;
  }
  get tagValues() {
    return this.allValues || (this.allValues = Array.from(this.values())), this.allValues;
  }
}
function H(r, e, t) {
  let i = new Ks();
  for (let [n, s] of t) i.set(n, s);
  if (Array.isArray(e)) for (let n of e) r.set(n, i);
  else r.set(e, i);
  return i;
}
function Ve(r, e, t) {
  let i, n = r.get(e);
  for (i of t) n.set(i[0], i[1]);
}
const X = /* @__PURE__ */ new Map(), de = /* @__PURE__ */ new Map(), Ie = /* @__PURE__ */ new Map(), Te = ["chunked", "firstChunkSize", "firstChunkSizeNode", "firstChunkSizeBrowser", "chunkSize", "chunkLimit"], Ze = ["jfif", "xmp", "icc", "iptc", "ihdr"], We = ["tiff", ...Ze], B = ["ifd0", "ifd1", "exif", "gps", "interop"], ke = [...We, ...B], Oe = ["makerNote", "userComment"], et = ["translateKeys", "translateValues", "reviveValues", "multiSegment"], xe = [...et, "sanitize", "mergeOutput", "silentErrors"];
class kn {
  get translate() {
    return this.translateKeys || this.translateValues || this.reviveValues;
  }
}
class tt extends kn {
  get needed() {
    return this.enabled || this.deps.size > 0;
  }
  constructor(e, t, i, n) {
    if (super(), P(this, "enabled", !1), P(this, "skip", /* @__PURE__ */ new Set()), P(this, "pick", /* @__PURE__ */ new Set()), P(this, "deps", /* @__PURE__ */ new Set()), P(this, "translateKeys", !1), P(this, "translateValues", !1), P(this, "reviveValues", !1), this.key = e, this.enabled = t, this.parse = this.enabled, this.applyInheritables(n), this.canBeFiltered = B.includes(e), this.canBeFiltered && (this.dict = X.get(e)), i !== void 0) if (Array.isArray(i)) this.parse = this.enabled = !0, this.canBeFiltered && i.length > 0 && this.translateTagSet(i, this.pick);
    else if (typeof i == "object") {
      if (this.enabled = !0, this.parse = i.parse !== !1, this.canBeFiltered) {
        let { pick: s, skip: a } = i;
        s && s.length > 0 && this.translateTagSet(s, this.pick), a && a.length > 0 && this.translateTagSet(a, this.skip);
      }
      this.applyInheritables(i);
    } else i === !0 || i === !1 ? this.parse = this.enabled = i : V(`Invalid options argument: ${i}`);
  }
  applyInheritables(e) {
    let t, i;
    for (t of et) i = e[t], i !== void 0 && (this[t] = i);
  }
  translateTagSet(e, t) {
    if (this.dict) {
      let i, n, { tagKeys: s, tagValues: a } = this.dict;
      for (i of e) typeof i == "string" ? (n = a.indexOf(i), n === -1 && (n = s.indexOf(Number(i))), n !== -1 && t.add(Number(s[n]))) : t.add(i);
    } else for (let i of e) t.add(i);
  }
  finalizeFilters() {
    !this.enabled && this.deps.size > 0 ? (this.enabled = !0, Ot(this.pick, this.deps)) : this.enabled && this.pick.size > 0 && Ot(this.pick, this.deps);
  }
}
var Z = { jfif: !1, tiff: !0, xmp: !1, icc: !1, iptc: !1, ifd0: !0, ifd1: !1, exif: !0, gps: !0, interop: !1, ihdr: void 0, makerNote: !1, userComment: !1, multiSegment: !1, skip: [], pick: [], translateKeys: !0, translateValues: !0, reviveValues: !0, sanitize: !0, mergeOutput: !0, silentErrors: !0, chunked: !0, firstChunkSize: void 0, firstChunkSizeNode: 512, firstChunkSizeBrowser: 65536, chunkSize: 65536, chunkLimit: 5 }, xi = /* @__PURE__ */ new Map();
class ze extends kn {
  static useCached(e) {
    let t = xi.get(e);
    return t !== void 0 || (t = new this(e), xi.set(e, t)), t;
  }
  constructor(e) {
    super(), e === !0 ? this.setupFromTrue() : e === void 0 ? this.setupFromUndefined() : Array.isArray(e) ? this.setupFromArray(e) : typeof e == "object" ? this.setupFromObject(e) : V(`Invalid options argument ${e}`), this.firstChunkSize === void 0 && (this.firstChunkSize = ot ? this.firstChunkSizeBrowser : this.firstChunkSizeNode), this.mergeOutput && (this.ifd1.enabled = !1), this.filterNestedSegmentTags(), this.traverseTiffDependencyTree(), this.checkLoadedPlugins();
  }
  setupFromUndefined() {
    let e;
    for (e of Te) this[e] = Z[e];
    for (e of xe) this[e] = Z[e];
    for (e of Oe) this[e] = Z[e];
    for (e of ke) this[e] = new tt(e, Z[e], void 0, this);
  }
  setupFromTrue() {
    let e;
    for (e of Te) this[e] = Z[e];
    for (e of xe) this[e] = Z[e];
    for (e of Oe) this[e] = !0;
    for (e of ke) this[e] = new tt(e, !0, void 0, this);
  }
  setupFromArray(e) {
    let t;
    for (t of Te) this[t] = Z[t];
    for (t of xe) this[t] = Z[t];
    for (t of Oe) this[t] = Z[t];
    for (t of ke) this[t] = new tt(t, !1, void 0, this);
    this.setupGlobalFilters(e, void 0, B);
  }
  setupFromObject(e) {
    let t;
    for (t of (B.ifd0 = B.ifd0 || B.image, B.ifd1 = B.ifd1 || B.thumbnail, Object.assign(this, e), Te)) this[t] = ar(e[t], Z[t]);
    for (t of xe) this[t] = ar(e[t], Z[t]);
    for (t of Oe) this[t] = ar(e[t], Z[t]);
    for (t of We) this[t] = new tt(t, Z[t], e[t], this);
    for (t of B) this[t] = new tt(t, Z[t], e[t], this.tiff);
    this.setupGlobalFilters(e.pick, e.skip, B, ke), e.tiff === !0 ? this.batchEnableWithBool(B, !0) : e.tiff === !1 ? this.batchEnableWithUserValue(B, e) : Array.isArray(e.tiff) ? this.setupGlobalFilters(e.tiff, void 0, B) : typeof e.tiff == "object" && this.setupGlobalFilters(e.tiff.pick, e.tiff.skip, B);
  }
  batchEnableWithBool(e, t) {
    for (let i of e) this[i].enabled = t;
  }
  batchEnableWithUserValue(e, t) {
    for (let i of e) {
      let n = t[i];
      this[i].enabled = n !== !1 && n !== void 0;
    }
  }
  setupGlobalFilters(e, t, i, n = i) {
    if (e && e.length) {
      for (let a of n) this[a].enabled = !1;
      let s = Ii(e, i);
      for (let [a, o] of s) Ot(this[a].pick, o), this[a].enabled = !0;
    } else if (t && t.length) {
      let s = Ii(t, i);
      for (let [a, o] of s) Ot(this[a].skip, o);
    }
  }
  filterNestedSegmentTags() {
    let { ifd0: e, exif: t, xmp: i, iptc: n, icc: s } = this;
    this.makerNote ? t.deps.add(37500) : t.skip.add(37500), this.userComment ? t.deps.add(37510) : t.skip.add(37510), i.enabled || e.skip.add(700), n.enabled || e.skip.add(33723), s.enabled || e.skip.add(34675);
  }
  traverseTiffDependencyTree() {
    let { ifd0: e, exif: t, gps: i, interop: n } = this;
    n.needed && (t.deps.add(40965), e.deps.add(40965)), t.needed && e.deps.add(34665), i.needed && e.deps.add(34853), this.tiff.enabled = B.some((s) => this[s].enabled === !0) || this.makerNote || this.userComment;
    for (let s of B) this[s].finalizeFilters();
  }
  get onlyTiff() {
    return !Ze.map((e) => this[e].enabled).some((e) => e === !0) && this.tiff.enabled;
  }
  checkLoadedPlugins() {
    for (let e of We) this[e].enabled && !j.has(e) && Rr("segment parser", e);
  }
}
function Ii(r, e) {
  let t, i, n, s, a = [];
  for (n of e) {
    for (s of (t = X.get(n), i = [], t)) (r.includes(s[0]) || r.includes(s[1])) && i.push(s[0]);
    i.length && a.push([n, i]);
  }
  return a;
}
function ar(r, e) {
  return r !== void 0 ? r : e !== void 0 ? e : void 0;
}
function Ot(r, e) {
  for (let t of e) r.add(t);
}
P(ze, "default", Z);
class Me {
  constructor(e) {
    P(this, "parsers", {}), P(this, "output", {}), P(this, "errors", []), P(this, "pushToErrors", (t) => this.errors.push(t)), this.options = ze.useCached(e);
  }
  async read(e) {
    this.file = await zs(e, this.options);
  }
  setup() {
    if (this.fileParser) return;
    let { file: e } = this, t = e.getUint16(0);
    for (let [i, n] of Se) if (n.canHandle(e, t)) return this.fileParser = new n(this.options, this.file, this.parsers), e[i] = !0;
    this.file.close && this.file.close(), V("Unknown file format");
  }
  async parse() {
    let { output: e, errors: t } = this;
    return this.setup(), this.options.silentErrors ? (await this.executeParsers().catch(this.pushToErrors), t.push(...this.fileParser.errors)) : await this.executeParsers(), this.file.close && this.file.close(), this.options.silentErrors && t.length > 0 && (e.errors = t), kt(e);
  }
  async executeParsers() {
    let { output: e } = this;
    await this.fileParser.parse();
    let t = Object.values(this.parsers).map(async (i) => {
      let n = await i.parse();
      i.assignToOutput(e, n);
    });
    this.options.silentErrors && (t = t.map((i) => i.catch(this.pushToErrors))), await Promise.all(t);
  }
  async extractThumbnail() {
    this.setup();
    let { options: e, file: t } = this, i = j.get("tiff", e);
    var n;
    if (t.tiff ? n = { start: 0, type: "tiff" } : t.jpeg && (n = await this.fileParser.getOrFindSegment("tiff")), n === void 0) return;
    let s = await this.fileParser.ensureSegmentChunk(n), a = this.parsers.tiff = new i(s, e, t), o = await a.extractThumbnail();
    return t.close && t.close(), o;
  }
}
async function Gt(r, e) {
  let t = new Me(e);
  return await t.read(r), t.parse();
}
var Xs = Object.freeze({ __proto__: null, parse: Gt, Exifr: Me, fileParsers: Se, segmentParsers: j, fileReaders: be, tagKeys: X, tagValues: de, tagRevivers: Ie, createDictionary: H, extendDictionary: Ve, fetchUrlAsArrayBuffer: Ge, readBlobAsArrayBuffer: je, chunkedProps: Te, otherSegments: Ze, segments: We, tiffBlocks: B, segmentsAndBlocks: ke, tiffExtractables: Oe, inheritables: et, allFormatters: xe, Options: ze });
class jt {
  constructor(e, t, i) {
    P(this, "errors", []), P(this, "ensureSegmentChunk", async (n) => {
      let s = n.start, a = n.size || 65536;
      if (this.file.chunked) if (this.file.available(s, a)) n.chunk = this.file.subarray(s, a);
      else try {
        n.chunk = await this.file.readChunk(s, a);
      } catch (o) {
        V(`Couldn't read segment: ${JSON.stringify(n)}. ${o.message}`);
      }
      else this.file.byteLength > s + a ? n.chunk = this.file.subarray(s, a) : n.size === void 0 ? n.chunk = this.file.subarray(s) : V("Segment unreachable: " + JSON.stringify(n));
      return n.chunk;
    }), this.extendOptions && this.extendOptions(e), this.options = e, this.file = t, this.parsers = i;
  }
  injectSegment(e, t) {
    this.options[e].enabled && this.createParser(e, t);
  }
  createParser(e, t) {
    let i = new (j.get(e))(t, this.options, this.file);
    return this.parsers[e] = i;
  }
  createParsers(e) {
    for (let t of e) {
      let { type: i, chunk: n } = t, s = this.options[i];
      if (s && s.enabled) {
        let a = this.parsers[i];
        a && a.append || a || this.createParser(i, n);
      }
    }
  }
  async readSegments(e) {
    let t = e.map(this.ensureSegmentChunk);
    await Promise.all(t);
  }
}
class fe {
  static findPosition(e, t) {
    let i = e.getUint16(t + 2) + 2, n = typeof this.headerLength == "function" ? this.headerLength(e, t, i) : this.headerLength, s = t + n, a = i - n;
    return { offset: t, length: i, headerLength: n, start: s, size: a, end: s + a };
  }
  static parse(e, t = {}) {
    return new this(e, new ze({ [this.type]: t }), e).parse();
  }
  normalizeInput(e) {
    return e instanceof te ? e : new te(e);
  }
  constructor(e, t = {}, i) {
    P(this, "errors", []), P(this, "raw", /* @__PURE__ */ new Map()), P(this, "handleError", (n) => {
      if (!this.options.silentErrors) throw n;
      this.errors.push(n.message);
    }), this.chunk = this.normalizeInput(e), this.file = i, this.type = this.constructor.type, this.globalOptions = this.options = t, this.localOptions = t[this.type], this.canTranslate = this.localOptions && this.localOptions.translate;
  }
  translate() {
    this.canTranslate && (this.translated = this.translateBlock(this.raw, this.type));
  }
  get output() {
    return this.translated ? this.translated : this.raw ? Object.fromEntries(this.raw) : void 0;
  }
  translateBlock(e, t) {
    let i = Ie.get(t), n = de.get(t), s = X.get(t), a = this.options[t], o = a.reviveValues && !!i, l = a.translateValues && !!n, c = a.translateKeys && !!s, u = {};
    for (let [p, f] of e) o && i.has(p) ? f = i.get(p)(f) : l && n.has(p) && (f = this.translateValue(f, n.get(p))), c && s.has(p) && (p = s.get(p) || p), u[p] = f;
    return u;
  }
  translateValue(e, t) {
    return t[e] || t.DEFAULT || e;
  }
  assignToOutput(e, t) {
    this.assignObjectToOutput(e, this.constructor.type, t);
  }
  assignObjectToOutput(e, t, i) {
    if (this.globalOptions.mergeOutput) return Object.assign(e, i);
    e[t] ? Object.assign(e[t], i) : e[t] = i;
  }
}
P(fe, "headerLength", 4), P(fe, "type", void 0), P(fe, "multiSegment", !1), P(fe, "canHandle", () => !1);
function qs(r) {
  return r === 192 || r === 194 || r === 196 || r === 219 || r === 221 || r === 218 || r === 254;
}
function Ys(r) {
  return r >= 224 && r <= 239;
}
function Qs(r, e, t) {
  for (let [i, n] of j) if (n.canHandle(r, e, t)) return i;
}
class Di extends jt {
  constructor(...e) {
    super(...e), P(this, "appSegments", []), P(this, "jpegSegments", []), P(this, "unknownSegments", []);
  }
  static canHandle(e, t) {
    return t === 65496;
  }
  async parse() {
    await this.findAppSegments(), await this.readSegments(this.appSegments), this.mergeMultiSegments(), this.createParsers(this.mergedAppSegments || this.appSegments);
  }
  setupSegmentFinderArgs(e) {
    e === !0 ? (this.findAll = !0, this.wanted = new Set(j.keyList())) : (e = e === void 0 ? j.keyList().filter((t) => this.options[t].enabled) : e.filter((t) => this.options[t].enabled && j.has(t)), this.findAll = !1, this.remaining = new Set(e), this.wanted = new Set(e)), this.unfinishedMultiSegment = !1;
  }
  async findAppSegments(e = 0, t) {
    this.setupSegmentFinderArgs(t);
    let { file: i, findAll: n, wanted: s, remaining: a } = this;
    if (!n && this.file.chunked && (n = Array.from(s).some((o) => {
      let l = j.get(o), c = this.options[o];
      return l.multiSegment && c.multiSegment;
    }), n && await this.file.readWhole()), e = this.findAppSegmentsInRange(e, i.byteLength), !this.options.onlyTiff && i.chunked) {
      let o = !1;
      for (; a.size > 0 && !o && (i.canReadNextChunk || this.unfinishedMultiSegment); ) {
        let { nextChunkOffset: l } = i, c = this.appSegments.some((u) => !this.file.available(u.offset || u.start, u.length || u.size));
        if (o = e > l && !c ? !await i.readNextChunk(e) : !await i.readNextChunk(l), (e = this.findAppSegmentsInRange(e, i.byteLength)) === void 0) return;
      }
    }
  }
  findAppSegmentsInRange(e, t) {
    t -= 2;
    let i, n, s, a, o, l, { file: c, findAll: u, wanted: p, remaining: f, options: C } = this;
    for (; e < t; e++) if (c.getUint8(e) === 255) {
      if (i = c.getUint8(e + 1), Ys(i)) {
        if (n = c.getUint16(e + 2), s = Qs(c, e, n), s && p.has(s) && (a = j.get(s), o = a.findPosition(c, e), l = C[s], o.type = s, this.appSegments.push(o), !u && (a.multiSegment && l.multiSegment ? (this.unfinishedMultiSegment = o.chunkNumber < o.chunkCount, this.unfinishedMultiSegment || f.delete(s)) : f.delete(s), f.size === 0))) break;
        C.recordUnknownSegments && (o = fe.findPosition(c, e), o.marker = i, this.unknownSegments.push(o)), e += n + 1;
      } else if (qs(i)) {
        if (n = c.getUint16(e + 2), i === 218 && C.stopAfterSos !== !1) return;
        C.recordJpegSegments && this.jpegSegments.push({ offset: e, length: n, marker: i }), e += n + 1;
      }
    }
    return e;
  }
  mergeMultiSegments() {
    if (!this.appSegments.some((t) => t.multiSegment)) return;
    let e = function(t, i) {
      let n, s, a, o = /* @__PURE__ */ new Map();
      for (let l = 0; l < t.length; l++) n = t[l], s = n[i], o.has(s) ? a = o.get(s) : o.set(s, a = []), a.push(n);
      return Array.from(o);
    }(this.appSegments, "type");
    this.mergedAppSegments = e.map(([t, i]) => {
      let n = j.get(t, this.options);
      return n.handleMultiSegments ? { type: t, chunk: n.handleMultiSegments(i) } : i[0];
    });
  }
  getSegment(e) {
    return this.appSegments.find((t) => t.type === e);
  }
  async getOrFindSegment(e) {
    let t = this.getSegment(e);
    return t === void 0 && (await this.findAppSegments(0, [e]), t = this.getSegment(e)), t;
  }
}
P(Di, "type", "jpeg"), Se.set("jpeg", Di);
const Js = [void 0, 1, 1, 2, 4, 8, 1, 1, 2, 4, 8, 4, 8, 4];
class Zs extends fe {
  parseHeader() {
    var e = this.chunk.getUint16();
    e === 18761 ? this.le = !0 : e === 19789 && (this.le = !1), this.chunk.le = this.le, this.headerParsed = !0;
  }
  parseTags(e, t, i = /* @__PURE__ */ new Map()) {
    let { pick: n, skip: s } = this.options[t];
    n = new Set(n);
    let a = n.size > 0, o = s.size === 0, l = this.chunk.getUint16(e);
    e += 2;
    for (let c = 0; c < l; c++) {
      let u = this.chunk.getUint16(e);
      if (a) {
        if (n.has(u) && (i.set(u, this.parseTag(e, u, t)), n.delete(u), n.size === 0)) break;
      } else !o && s.has(u) || i.set(u, this.parseTag(e, u, t));
      e += 12;
    }
    return i;
  }
  parseTag(e, t, i) {
    let { chunk: n } = this, s = n.getUint16(e + 2), a = n.getUint32(e + 4), o = Js[s];
    if (o * a <= 4 ? e += 8 : e = n.getUint32(e + 8), (s < 1 || s > 13) && V(`Invalid TIFF value type. block: ${i.toUpperCase()}, tag: ${t.toString(16)}, type: ${s}, offset ${e}`), e > n.byteLength && V(`Invalid TIFF value offset. block: ${i.toUpperCase()}, tag: ${t.toString(16)}, type: ${s}, offset ${e} is outside of chunk size ${n.byteLength}`), s === 1) return n.getUint8Array(e, a);
    if (s === 2) return Ne(n.getString(e, a));
    if (s === 7) return n.getUint8Array(e, a);
    if (a === 1) return this.parseTagValue(s, e);
    {
      let l = new (function(u) {
        switch (u) {
          case 1:
            return Uint8Array;
          case 3:
            return Uint16Array;
          case 4:
            return Uint32Array;
          case 5:
            return Array;
          case 6:
            return Int8Array;
          case 8:
            return Int16Array;
          case 9:
            return Int32Array;
          case 10:
            return Array;
          case 11:
            return Float32Array;
          case 12:
            return Float64Array;
          default:
            return Array;
        }
      }(s))(a), c = o;
      for (let u = 0; u < a; u++) l[u] = this.parseTagValue(s, e), e += c;
      return l;
    }
  }
  parseTagValue(e, t) {
    let { chunk: i } = this;
    switch (e) {
      case 1:
        return i.getUint8(t);
      case 3:
        return i.getUint16(t);
      case 4:
        return i.getUint32(t);
      case 5:
        return i.getUint32(t) / i.getUint32(t + 4);
      case 6:
        return i.getInt8(t);
      case 8:
        return i.getInt16(t);
      case 9:
        return i.getInt32(t);
      case 10:
        return i.getInt32(t) / i.getInt32(t + 4);
      case 11:
        return i.getFloat(t);
      case 12:
        return i.getDouble(t);
      case 13:
        return i.getUint32(t);
      default:
        V(`Invalid tiff type ${e}`);
    }
  }
}
class or extends Zs {
  static canHandle(e, t) {
    return e.getUint8(t + 1) === 225 && e.getUint32(t + 4) === 1165519206 && e.getUint16(t + 8) === 0;
  }
  async parse() {
    this.parseHeader();
    let { options: e } = this;
    return e.ifd0.enabled && await this.parseIfd0Block(), e.exif.enabled && await this.safeParse("parseExifBlock"), e.gps.enabled && await this.safeParse("parseGpsBlock"), e.interop.enabled && await this.safeParse("parseInteropBlock"), e.ifd1.enabled && await this.safeParse("parseThumbnailBlock"), this.createOutput();
  }
  safeParse(e) {
    let t = this[e]();
    return t.catch !== void 0 && (t = t.catch(this.handleError)), t;
  }
  findIfd0Offset() {
    this.ifd0Offset === void 0 && (this.ifd0Offset = this.chunk.getUint32(4));
  }
  findIfd1Offset() {
    if (this.ifd1Offset === void 0) {
      this.findIfd0Offset();
      let e = this.chunk.getUint16(this.ifd0Offset), t = this.ifd0Offset + 2 + 12 * e;
      this.ifd1Offset = this.chunk.getUint32(t);
    }
  }
  parseBlock(e, t) {
    let i = /* @__PURE__ */ new Map();
    return this[t] = i, this.parseTags(e, t, i), i;
  }
  async parseIfd0Block() {
    if (this.ifd0) return;
    let { file: e } = this;
    this.findIfd0Offset(), this.ifd0Offset < 8 && V("Malformed EXIF data"), !e.chunked && this.ifd0Offset > e.byteLength && V(`IFD0 offset points to outside of file.
this.ifd0Offset: ${this.ifd0Offset}, file.byteLength: ${e.byteLength}`), e.tiff && await e.ensureChunk(this.ifd0Offset, Pr(this.options));
    let t = this.parseBlock(this.ifd0Offset, "ifd0");
    return t.size !== 0 ? (this.exifOffset = t.get(34665), this.interopOffset = t.get(40965), this.gpsOffset = t.get(34853), this.xmp = t.get(700), this.iptc = t.get(33723), this.icc = t.get(34675), this.options.sanitize && (t.delete(34665), t.delete(40965), t.delete(34853), t.delete(700), t.delete(33723), t.delete(34675)), t) : void 0;
  }
  async parseExifBlock() {
    if (this.exif || (this.ifd0 || await this.parseIfd0Block(), this.exifOffset === void 0)) return;
    this.file.tiff && await this.file.ensureChunk(this.exifOffset, Pr(this.options));
    let e = this.parseBlock(this.exifOffset, "exif");
    return this.interopOffset || (this.interopOffset = e.get(40965)), this.makerNote = e.get(37500), this.userComment = e.get(37510), this.options.sanitize && (e.delete(40965), e.delete(37500), e.delete(37510)), this.unpack(e, 41728), this.unpack(e, 41729), e;
  }
  unpack(e, t) {
    let i = e.get(t);
    i && i.length === 1 && e.set(t, i[0]);
  }
  async parseGpsBlock() {
    if (this.gps || (this.ifd0 || await this.parseIfd0Block(), this.gpsOffset === void 0)) return;
    let e = this.parseBlock(this.gpsOffset, "gps");
    return e && e.has(2) && e.has(4) && (e.set("latitude", Li(...e.get(2), e.get(1))), e.set("longitude", Li(...e.get(4), e.get(3)))), e;
  }
  async parseInteropBlock() {
    if (!this.interop && (this.ifd0 || await this.parseIfd0Block(), this.interopOffset !== void 0 || this.exif || await this.parseExifBlock(), this.interopOffset !== void 0)) return this.parseBlock(this.interopOffset, "interop");
  }
  async parseThumbnailBlock(e = !1) {
    if (!this.ifd1 && !this.ifd1Parsed && (!this.options.mergeOutput || e)) return this.findIfd1Offset(), this.ifd1Offset > 0 && (this.parseBlock(this.ifd1Offset, "ifd1"), this.ifd1Parsed = !0), this.ifd1;
  }
  async extractThumbnail() {
    if (this.headerParsed || this.parseHeader(), this.ifd1Parsed || await this.parseThumbnailBlock(!0), this.ifd1 === void 0) return;
    let e = this.ifd1.get(513), t = this.ifd1.get(514);
    return this.chunk.getUint8Array(e, t);
  }
  get image() {
    return this.ifd0;
  }
  get thumbnail() {
    return this.ifd1;
  }
  createOutput() {
    let e, t, i, n = {};
    for (t of B) if (e = this[t], !wn(e)) if (i = this.canTranslate ? this.translateBlock(e, t) : Object.fromEntries(e), this.options.mergeOutput) {
      if (t === "ifd1") continue;
      Object.assign(n, i);
    } else n[t] = i;
    return this.makerNote && (n.makerNote = this.makerNote), this.userComment && (n.userComment = this.userComment), n;
  }
  assignToOutput(e, t) {
    if (this.globalOptions.mergeOutput) Object.assign(e, t);
    else for (let [i, n] of Object.entries(t)) this.assignObjectToOutput(e, i, n);
  }
}
function Li(r, e, t, i) {
  var n = r + e / 60 + t / 3600;
  return i !== "S" && i !== "W" || (n *= -1), n;
}
P(or, "type", "tiff"), P(or, "headerLength", 10), j.set("tiff", or);
var ea = Object.freeze({ __proto__: null, default: Xs, Exifr: Me, fileParsers: Se, segmentParsers: j, fileReaders: be, tagKeys: X, tagValues: de, tagRevivers: Ie, createDictionary: H, extendDictionary: Ve, fetchUrlAsArrayBuffer: Ge, readBlobAsArrayBuffer: je, chunkedProps: Te, otherSegments: Ze, segments: We, tiffBlocks: B, segmentsAndBlocks: ke, tiffExtractables: Oe, inheritables: et, allFormatters: xe, Options: ze, parse: Gt });
const Kr = { ifd0: !1, ifd1: !1, exif: !1, gps: !1, interop: !1, sanitize: !1, reviveValues: !0, translateKeys: !1, translateValues: !1, mergeOutput: !1 }, Xr = Object.assign({}, Kr, { firstChunkSize: 4e4, gps: [1, 2, 3, 4] });
async function On(r) {
  let e = new Me(Xr);
  await e.read(r);
  let t = await e.parse();
  if (t && t.gps) {
    let { latitude: i, longitude: n } = t.gps;
    return { latitude: i, longitude: n };
  }
}
const qr = Object.assign({}, Kr, { tiff: !1, ifd1: !0, mergeOutput: !1 });
async function xn(r) {
  let e = new Me(qr);
  await e.read(r);
  let t = await e.extractThumbnail();
  return t && Ht ? Ut.from(t) : t;
}
async function In(r) {
  let e = await this.thumbnail(r);
  if (e !== void 0) {
    let t = new Blob([e]);
    return URL.createObjectURL(t);
  }
}
const Yr = Object.assign({}, Kr, { firstChunkSize: 4e4, ifd0: [274] });
async function Qr(r) {
  let e = new Me(Yr);
  await e.read(r);
  let t = await e.parse();
  if (t && t.ifd0) return t.ifd0[274];
}
const Jr = Object.freeze({ 1: { dimensionSwapped: !1, scaleX: 1, scaleY: 1, deg: 0, rad: 0 }, 2: { dimensionSwapped: !1, scaleX: -1, scaleY: 1, deg: 0, rad: 0 }, 3: { dimensionSwapped: !1, scaleX: 1, scaleY: 1, deg: 180, rad: 180 * Math.PI / 180 }, 4: { dimensionSwapped: !1, scaleX: -1, scaleY: 1, deg: 180, rad: 180 * Math.PI / 180 }, 5: { dimensionSwapped: !0, scaleX: 1, scaleY: -1, deg: 90, rad: 90 * Math.PI / 180 }, 6: { dimensionSwapped: !0, scaleX: 1, scaleY: 1, deg: 90, rad: 90 * Math.PI / 180 }, 7: { dimensionSwapped: !0, scaleX: 1, scaleY: -1, deg: 270, rad: 270 * Math.PI / 180 }, 8: { dimensionSwapped: !0, scaleX: 1, scaleY: 1, deg: 270, rad: 270 * Math.PI / 180 } });
let Be = !0, Ue = !0;
if (typeof navigator == "object") {
  let r = navigator.userAgent;
  if (r.includes("iPad") || r.includes("iPhone")) {
    let e = r.match(/OS (\d+)_(\d+)/);
    if (e) {
      let [, t, i] = e;
      Be = Number(t) + 0.1 * Number(i) < 13.4, Ue = !1;
    }
  } else if (r.includes("OS X 10")) {
    let [, e] = r.match(/OS X 10[_.](\d+)/);
    Be = Ue = Number(e) < 15;
  }
  if (r.includes("Chrome/")) {
    let [, e] = r.match(/Chrome\/(\d+)/);
    Be = Ue = Number(e) < 81;
  } else if (r.includes("Firefox/")) {
    let [, e] = r.match(/Firefox\/(\d+)/);
    Be = Ue = Number(e) < 77;
  }
}
async function Dn(r) {
  let e = await Qr(r);
  return Object.assign({ canvas: Be, css: Ue }, Jr[e]);
}
class ta extends te {
  constructor(...e) {
    super(...e), P(this, "ranges", new ra()), this.byteLength !== 0 && this.ranges.add(0, this.byteLength);
  }
  _tryExtend(e, t, i) {
    if (e === 0 && this.byteLength === 0 && i) {
      let n = new DataView(i.buffer || i, i.byteOffset, i.byteLength);
      this._swapDataView(n);
    } else {
      let n = e + t;
      if (n > this.byteLength) {
        let { dataView: s } = this._extend(n);
        this._swapDataView(s);
      }
    }
  }
  _extend(e) {
    let t;
    t = Ht ? Ut.allocUnsafe(e) : new Uint8Array(e);
    let i = new DataView(t.buffer, t.byteOffset, t.byteLength);
    return t.set(new Uint8Array(this.buffer, this.byteOffset, this.byteLength), 0), { uintView: t, dataView: i };
  }
  subarray(e, t, i = !1) {
    return t = t || this._lengthToEnd(e), i && this._tryExtend(e, t), this.ranges.add(e, t), super.subarray(e, t);
  }
  set(e, t, i = !1) {
    i && this._tryExtend(t, e.byteLength, e);
    let n = super.set(e, t);
    return this.ranges.add(t, n.byteLength), n;
  }
  async ensureChunk(e, t) {
    this.chunked && (this.ranges.available(e, t) || await this.readChunk(e, t));
  }
  available(e, t) {
    return this.ranges.available(e, t);
  }
}
class ra {
  constructor() {
    P(this, "list", []);
  }
  get length() {
    return this.list.length;
  }
  add(e, t, i = 0) {
    let n = e + t, s = this.list.filter((a) => Mi(e, a.offset, n) || Mi(e, a.end, n));
    if (s.length > 0) {
      e = Math.min(e, ...s.map((o) => o.offset)), n = Math.max(n, ...s.map((o) => o.end)), t = n - e;
      let a = s.shift();
      a.offset = e, a.length = t, a.end = n, this.list = this.list.filter((o) => !s.includes(o));
    } else this.list.push({ offset: e, length: t, end: n });
  }
  available(e, t) {
    let i = e + t;
    return this.list.some((n) => n.offset <= e && i <= n.end);
  }
}
function Mi(r, e, t) {
  return r <= e && e <= t;
}
class Vt extends ta {
  constructor(e, t) {
    super(0), P(this, "chunksRead", 0), this.input = e, this.options = t;
  }
  async readWhole() {
    this.chunked = !1, await this.readChunk(this.nextChunkOffset);
  }
  async readChunked() {
    this.chunked = !0, await this.readChunk(0, this.options.firstChunkSize);
  }
  async readNextChunk(e = this.nextChunkOffset) {
    if (this.fullyRead) return this.chunksRead++, !1;
    let t = this.options.chunkSize, i = await this.readChunk(e, t);
    return !!i && i.byteLength === t;
  }
  async readChunk(e, t) {
    if (this.chunksRead++, (t = this.safeWrapAddress(e, t)) !== 0) return this._readChunk(e, t);
  }
  safeWrapAddress(e, t) {
    return this.size !== void 0 && e + t > this.size ? Math.max(0, this.size - e) : t;
  }
  get nextChunkOffset() {
    if (this.ranges.list.length !== 0) return this.ranges.list[0].length;
  }
  get canReadNextChunk() {
    return this.chunksRead < this.options.chunkLimit;
  }
  get fullyRead() {
    return this.size !== void 0 && this.nextChunkOffset === this.size;
  }
  read() {
    return this.options.chunked ? this.readChunked() : this.readWhole();
  }
  close() {
  }
}
be.set("blob", class extends Vt {
  async readWhole() {
    this.chunked = !1;
    let r = await je(this.input);
    this._swapArrayBuffer(r);
  }
  readChunked() {
    return this.chunked = !0, this.size = this.input.size, super.readChunked();
  }
  async _readChunk(r, e) {
    let t = e ? r + e : void 0, i = this.input.slice(r, t), n = await je(i);
    return this.set(n, r, !0);
  }
});
var ia = Object.freeze({ __proto__: null, default: ea, Exifr: Me, fileParsers: Se, segmentParsers: j, fileReaders: be, tagKeys: X, tagValues: de, tagRevivers: Ie, createDictionary: H, extendDictionary: Ve, fetchUrlAsArrayBuffer: Ge, readBlobAsArrayBuffer: je, chunkedProps: Te, otherSegments: Ze, segments: We, tiffBlocks: B, segmentsAndBlocks: ke, tiffExtractables: Oe, inheritables: et, allFormatters: xe, Options: ze, parse: Gt, gpsOnlyOptions: Xr, gps: On, thumbnailOnlyOptions: qr, thumbnail: xn, thumbnailUrl: In, orientationOnlyOptions: Yr, orientation: Qr, rotations: Jr, get rotateCanvas() {
  return Be;
}, get rotateCss() {
  return Ue;
}, rotation: Dn });
be.set("url", class extends Vt {
  async readWhole() {
    this.chunked = !1;
    let r = await Ge(this.input);
    r instanceof ArrayBuffer ? this._swapArrayBuffer(r) : r instanceof Uint8Array && this._swapBuffer(r);
  }
  async _readChunk(r, e) {
    let t = e ? r + e - 1 : void 0, i = this.options.httpHeaders || {};
    (r || t) && (i.range = `bytes=${[r, t].join("-")}`);
    let n = await Wr(this.input, { headers: i }), s = await n.arrayBuffer(), a = s.byteLength;
    if (n.status !== 416) return a !== e && (this.size = r + a), this.set(s, r, !0);
  }
});
te.prototype.getUint64 = function(r) {
  let e = this.getUint32(r), t = this.getUint32(r + 4);
  return e < 1048575 ? e << 32 | t : typeof St !== void 0 ? (console.warn("Using BigInt because of type 64uint but JS can only handle 53b numbers."), St(e) << St(32) | St(t)) : void V("Trying to read 64b value but JS can only handle 53b numbers.");
};
class na extends jt {
  parseBoxes(e = 0) {
    let t = [];
    for (; e < this.file.byteLength - 4; ) {
      let i = this.parseBoxHead(e);
      if (t.push(i), i.length === 0) break;
      e += i.length;
    }
    return t;
  }
  parseSubBoxes(e) {
    e.boxes = this.parseBoxes(e.start);
  }
  findBox(e, t) {
    return e.boxes === void 0 && this.parseSubBoxes(e), e.boxes.find((i) => i.kind === t);
  }
  parseBoxHead(e) {
    let t = this.file.getUint32(e), i = this.file.getString(e + 4, 4), n = e + 8;
    return t === 1 && (t = this.file.getUint64(e + 8), n += 8), { offset: e, length: t, kind: i, start: n };
  }
  parseBoxFullHead(e) {
    if (e.version !== void 0) return;
    let t = this.file.getUint32(e.start);
    e.version = t >> 24, e.start += 4;
  }
}
class Ln extends na {
  static canHandle(e, t) {
    if (t !== 0) return !1;
    let i = e.getUint16(2);
    if (i > 50) return !1;
    let n = 16, s = [];
    for (; n < i; ) s.push(e.getString(n, 4)), n += 4;
    return s.includes(this.type);
  }
  async parse() {
    let e = this.file.getUint32(0), t = this.parseBoxHead(e);
    for (; t.kind !== "meta"; ) e += t.length, await this.file.ensureChunk(e, 16), t = this.parseBoxHead(e);
    await this.file.ensureChunk(t.offset, t.length), this.parseBoxFullHead(t), this.parseSubBoxes(t), this.options.icc.enabled && await this.findIcc(t), this.options.tiff.enabled && await this.findExif(t);
  }
  async registerSegment(e, t, i) {
    await this.file.ensureChunk(t, i);
    let n = this.file.subarray(t, i);
    this.createParser(e, n);
  }
  async findIcc(e) {
    let t = this.findBox(e, "iprp");
    if (t === void 0) return;
    let i = this.findBox(t, "ipco");
    if (i === void 0) return;
    let n = this.findBox(i, "colr");
    n !== void 0 && await this.registerSegment("icc", n.offset + 12, n.length);
  }
  async findExif(e) {
    let t = this.findBox(e, "iinf");
    if (t === void 0) return;
    let i = this.findBox(e, "iloc");
    if (i === void 0) return;
    let n = this.findExifLocIdInIinf(t), s = this.findExtentInIloc(i, n);
    if (s === void 0) return;
    let [a, o] = s;
    await this.file.ensureChunk(a, o);
    let l = 4 + this.file.getUint32(a);
    a += l, o -= l, await this.registerSegment("tiff", a, o);
  }
  findExifLocIdInIinf(e) {
    this.parseBoxFullHead(e);
    let t, i, n, s, a = e.start, o = this.file.getUint16(a);
    for (a += 2; o--; ) {
      if (t = this.parseBoxHead(a), this.parseBoxFullHead(t), i = t.start, t.version >= 2 && (n = t.version === 3 ? 4 : 2, s = this.file.getString(i + n + 2, 4), s === "Exif")) return this.file.getUintBytes(i, n);
      a += t.length;
    }
  }
  get8bits(e) {
    let t = this.file.getUint8(e);
    return [t >> 4, 15 & t];
  }
  findExtentInIloc(e, t) {
    this.parseBoxFullHead(e);
    let i = e.start, [n, s] = this.get8bits(i++), [a, o] = this.get8bits(i++), l = e.version === 2 ? 4 : 2, c = e.version === 1 || e.version === 2 ? 2 : 0, u = o + n + s, p = e.version === 2 ? 4 : 2, f = this.file.getUintBytes(i, p);
    for (i += p; f--; ) {
      let C = this.file.getUintBytes(i, l);
      i += l + c + 2 + a;
      let m = this.file.getUint16(i);
      if (i += 2, C === t) return m > 1 && console.warn(`ILOC box has more than one extent but we're only processing one
Please create an issue at https://github.com/MikeKovarik/exifr with this file`), [this.file.getUintBytes(i + o, n), this.file.getUintBytes(i + o + n, s)];
      i += m * u;
    }
  }
}
class Mn extends Ln {
}
P(Mn, "type", "heic");
class Fi extends Ln {
}
P(Fi, "type", "avif"), Se.set("heic", Mn), Se.set("avif", Fi), H(X, ["ifd0", "ifd1"], [[256, "ImageWidth"], [257, "ImageHeight"], [258, "BitsPerSample"], [259, "Compression"], [262, "PhotometricInterpretation"], [270, "ImageDescription"], [271, "Make"], [272, "Model"], [273, "StripOffsets"], [274, "Orientation"], [277, "SamplesPerPixel"], [278, "RowsPerStrip"], [279, "StripByteCounts"], [282, "XResolution"], [283, "YResolution"], [284, "PlanarConfiguration"], [296, "ResolutionUnit"], [301, "TransferFunction"], [305, "Software"], [306, "ModifyDate"], [315, "Artist"], [316, "HostComputer"], [317, "Predictor"], [318, "WhitePoint"], [319, "PrimaryChromaticities"], [513, "ThumbnailOffset"], [514, "ThumbnailLength"], [529, "YCbCrCoefficients"], [530, "YCbCrSubSampling"], [531, "YCbCrPositioning"], [532, "ReferenceBlackWhite"], [700, "ApplicationNotes"], [33432, "Copyright"], [33723, "IPTC"], [34665, "ExifIFD"], [34675, "ICC"], [34853, "GpsIFD"], [330, "SubIFD"], [40965, "InteropIFD"], [40091, "XPTitle"], [40092, "XPComment"], [40093, "XPAuthor"], [40094, "XPKeywords"], [40095, "XPSubject"]]), H(X, "exif", [[33434, "ExposureTime"], [33437, "FNumber"], [34850, "ExposureProgram"], [34852, "SpectralSensitivity"], [34855, "ISO"], [34858, "TimeZoneOffset"], [34859, "SelfTimerMode"], [34864, "SensitivityType"], [34865, "StandardOutputSensitivity"], [34866, "RecommendedExposureIndex"], [34867, "ISOSpeed"], [34868, "ISOSpeedLatitudeyyy"], [34869, "ISOSpeedLatitudezzz"], [36864, "ExifVersion"], [36867, "DateTimeOriginal"], [36868, "CreateDate"], [36873, "GooglePlusUploadCode"], [36880, "OffsetTime"], [36881, "OffsetTimeOriginal"], [36882, "OffsetTimeDigitized"], [37121, "ComponentsConfiguration"], [37122, "CompressedBitsPerPixel"], [37377, "ShutterSpeedValue"], [37378, "ApertureValue"], [37379, "BrightnessValue"], [37380, "ExposureCompensation"], [37381, "MaxApertureValue"], [37382, "SubjectDistance"], [37383, "MeteringMode"], [37384, "LightSource"], [37385, "Flash"], [37386, "FocalLength"], [37393, "ImageNumber"], [37394, "SecurityClassification"], [37395, "ImageHistory"], [37396, "SubjectArea"], [37500, "MakerNote"], [37510, "UserComment"], [37520, "SubSecTime"], [37521, "SubSecTimeOriginal"], [37522, "SubSecTimeDigitized"], [37888, "AmbientTemperature"], [37889, "Humidity"], [37890, "Pressure"], [37891, "WaterDepth"], [37892, "Acceleration"], [37893, "CameraElevationAngle"], [40960, "FlashpixVersion"], [40961, "ColorSpace"], [40962, "ExifImageWidth"], [40963, "ExifImageHeight"], [40964, "RelatedSoundFile"], [41483, "FlashEnergy"], [41486, "FocalPlaneXResolution"], [41487, "FocalPlaneYResolution"], [41488, "FocalPlaneResolutionUnit"], [41492, "SubjectLocation"], [41493, "ExposureIndex"], [41495, "SensingMethod"], [41728, "FileSource"], [41729, "SceneType"], [41730, "CFAPattern"], [41985, "CustomRendered"], [41986, "ExposureMode"], [41987, "WhiteBalance"], [41988, "DigitalZoomRatio"], [41989, "FocalLengthIn35mmFormat"], [41990, "SceneCaptureType"], [41991, "GainControl"], [41992, "Contrast"], [41993, "Saturation"], [41994, "Sharpness"], [41996, "SubjectDistanceRange"], [42016, "ImageUniqueID"], [42032, "OwnerName"], [42033, "SerialNumber"], [42034, "LensInfo"], [42035, "LensMake"], [42036, "LensModel"], [42037, "LensSerialNumber"], [42080, "CompositeImage"], [42081, "CompositeImageCount"], [42082, "CompositeImageExposureTimes"], [42240, "Gamma"], [59932, "Padding"], [59933, "OffsetSchema"], [65e3, "OwnerName"], [65001, "SerialNumber"], [65002, "Lens"], [65100, "RawFile"], [65101, "Converter"], [65102, "WhiteBalance"], [65105, "Exposure"], [65106, "Shadows"], [65107, "Brightness"], [65108, "Contrast"], [65109, "Saturation"], [65110, "Sharpness"], [65111, "Smoothness"], [65112, "MoireFilter"], [40965, "InteropIFD"]]), H(X, "gps", [[0, "GPSVersionID"], [1, "GPSLatitudeRef"], [2, "GPSLatitude"], [3, "GPSLongitudeRef"], [4, "GPSLongitude"], [5, "GPSAltitudeRef"], [6, "GPSAltitude"], [7, "GPSTimeStamp"], [8, "GPSSatellites"], [9, "GPSStatus"], [10, "GPSMeasureMode"], [11, "GPSDOP"], [12, "GPSSpeedRef"], [13, "GPSSpeed"], [14, "GPSTrackRef"], [15, "GPSTrack"], [16, "GPSImgDirectionRef"], [17, "GPSImgDirection"], [18, "GPSMapDatum"], [19, "GPSDestLatitudeRef"], [20, "GPSDestLatitude"], [21, "GPSDestLongitudeRef"], [22, "GPSDestLongitude"], [23, "GPSDestBearingRef"], [24, "GPSDestBearing"], [25, "GPSDestDistanceRef"], [26, "GPSDestDistance"], [27, "GPSProcessingMethod"], [28, "GPSAreaInformation"], [29, "GPSDateStamp"], [30, "GPSDifferential"], [31, "GPSHPositioningError"]]), H(de, ["ifd0", "ifd1"], [[274, { 1: "Horizontal (normal)", 2: "Mirror horizontal", 3: "Rotate 180", 4: "Mirror vertical", 5: "Mirror horizontal and rotate 270 CW", 6: "Rotate 90 CW", 7: "Mirror horizontal and rotate 90 CW", 8: "Rotate 270 CW" }], [296, { 1: "None", 2: "inches", 3: "cm" }]]);
let st = H(de, "exif", [[34850, { 0: "Not defined", 1: "Manual", 2: "Normal program", 3: "Aperture priority", 4: "Shutter priority", 5: "Creative program", 6: "Action program", 7: "Portrait mode", 8: "Landscape mode" }], [37121, { 0: "-", 1: "Y", 2: "Cb", 3: "Cr", 4: "R", 5: "G", 6: "B" }], [37383, { 0: "Unknown", 1: "Average", 2: "CenterWeightedAverage", 3: "Spot", 4: "MultiSpot", 5: "Pattern", 6: "Partial", 255: "Other" }], [37384, { 0: "Unknown", 1: "Daylight", 2: "Fluorescent", 3: "Tungsten (incandescent light)", 4: "Flash", 9: "Fine weather", 10: "Cloudy weather", 11: "Shade", 12: "Daylight fluorescent (D 5700 - 7100K)", 13: "Day white fluorescent (N 4600 - 5400K)", 14: "Cool white fluorescent (W 3900 - 4500K)", 15: "White fluorescent (WW 3200 - 3700K)", 17: "Standard light A", 18: "Standard light B", 19: "Standard light C", 20: "D55", 21: "D65", 22: "D75", 23: "D50", 24: "ISO studio tungsten", 255: "Other" }], [37385, { 0: "Flash did not fire", 1: "Flash fired", 5: "Strobe return light not detected", 7: "Strobe return light detected", 9: "Flash fired, compulsory flash mode", 13: "Flash fired, compulsory flash mode, return light not detected", 15: "Flash fired, compulsory flash mode, return light detected", 16: "Flash did not fire, compulsory flash mode", 24: "Flash did not fire, auto mode", 25: "Flash fired, auto mode", 29: "Flash fired, auto mode, return light not detected", 31: "Flash fired, auto mode, return light detected", 32: "No flash function", 65: "Flash fired, red-eye reduction mode", 69: "Flash fired, red-eye reduction mode, return light not detected", 71: "Flash fired, red-eye reduction mode, return light detected", 73: "Flash fired, compulsory flash mode, red-eye reduction mode", 77: "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected", 79: "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected", 89: "Flash fired, auto mode, red-eye reduction mode", 93: "Flash fired, auto mode, return light not detected, red-eye reduction mode", 95: "Flash fired, auto mode, return light detected, red-eye reduction mode" }], [41495, { 1: "Not defined", 2: "One-chip color area sensor", 3: "Two-chip color area sensor", 4: "Three-chip color area sensor", 5: "Color sequential area sensor", 7: "Trilinear sensor", 8: "Color sequential linear sensor" }], [41728, { 1: "Film Scanner", 2: "Reflection Print Scanner", 3: "Digital Camera" }], [41729, { 1: "Directly photographed" }], [41985, { 0: "Normal", 1: "Custom", 2: "HDR (no original saved)", 3: "HDR (original saved)", 4: "Original (for HDR)", 6: "Panorama", 7: "Portrait HDR", 8: "Portrait" }], [41986, { 0: "Auto", 1: "Manual", 2: "Auto bracket" }], [41987, { 0: "Auto", 1: "Manual" }], [41990, { 0: "Standard", 1: "Landscape", 2: "Portrait", 3: "Night", 4: "Other" }], [41991, { 0: "None", 1: "Low gain up", 2: "High gain up", 3: "Low gain down", 4: "High gain down" }], [41996, { 0: "Unknown", 1: "Macro", 2: "Close", 3: "Distant" }], [42080, { 0: "Unknown", 1: "Not a Composite Image", 2: "General Composite Image", 3: "Composite Image Captured While Shooting" }]]);
const $i = { 1: "No absolute unit of measurement", 2: "Inch", 3: "Centimeter" };
st.set(37392, $i), st.set(41488, $i);
const lr = { 0: "Normal", 1: "Low", 2: "High" };
function Ni(r) {
  return typeof r == "object" && r.length !== void 0 ? r[0] : r;
}
function Bi(r) {
  let e = Array.from(r).slice(1);
  return e[1] > 15 && (e = e.map((t) => String.fromCharCode(t))), e[2] !== "0" && e[2] !== 0 || e.pop(), e.join(".");
}
function ur(r) {
  if (typeof r == "string") {
    var [e, t, i, n, s, a] = r.trim().split(/[-: ]/g).map(Number), o = new Date(e, t - 1, i);
    return Number.isNaN(n) || Number.isNaN(s) || Number.isNaN(a) || (o.setHours(n), o.setMinutes(s), o.setSeconds(a)), Number.isNaN(+o) ? r : o;
  }
}
function rt(r) {
  if (typeof r == "string") return r;
  let e = [];
  if (r[1] === 0 && r[r.length - 1] === 0) for (let t = 0; t < r.length; t += 2) e.push(Ui(r[t + 1], r[t]));
  else for (let t = 0; t < r.length; t += 2) e.push(Ui(r[t], r[t + 1]));
  return Ne(String.fromCodePoint(...e));
}
function Ui(r, e) {
  return r << 8 | e;
}
st.set(41992, lr), st.set(41993, lr), st.set(41994, lr), H(Ie, ["ifd0", "ifd1"], [[50827, function(r) {
  return typeof r != "string" ? Tn(r) : r;
}], [306, ur], [40091, rt], [40092, rt], [40093, rt], [40094, rt], [40095, rt]]), H(Ie, "exif", [[40960, Bi], [36864, Bi], [36867, ur], [36868, ur], [40962, Ni], [40963, Ni]]), H(Ie, "gps", [[0, (r) => Array.from(r).join(".")], [7, (r) => Array.from(r).join(":")]]);
class cr extends fe {
  static canHandle(e, t) {
    return e.getUint8(t + 1) === 225 && e.getUint32(t + 4) === 1752462448 && e.getString(t + 4, 20) === "http://ns.adobe.com/";
  }
  static headerLength(e, t) {
    return e.getString(t + 4, 34) === "http://ns.adobe.com/xmp/extension/" ? 79 : 33;
  }
  static findPosition(e, t) {
    let i = super.findPosition(e, t);
    return i.multiSegment = i.extended = i.headerLength === 79, i.multiSegment ? (i.chunkCount = e.getUint8(t + 72), i.chunkNumber = e.getUint8(t + 76), e.getUint8(t + 77) !== 0 && i.chunkNumber++) : (i.chunkCount = 1 / 0, i.chunkNumber = -1), i;
  }
  static handleMultiSegments(e) {
    return e.map((t) => t.chunk.getString()).join("");
  }
  normalizeInput(e) {
    return typeof e == "string" ? e : te.from(e).getString();
  }
  parse(e = this.chunk) {
    if (!this.localOptions.parse) return e;
    e = function(s) {
      let a = {}, o = {};
      for (let l of Bn) a[l] = [], o[l] = 0;
      return s.replace(la, (l, c, u) => {
        if (c === "<") {
          let p = ++o[u];
          return a[u].push(p), `${l}#${p}`;
        }
        return `${l}#${a[u].pop()}`;
      });
    }(e);
    let t = Ye.findAll(e, "rdf", "Description");
    t.length === 0 && t.push(new Ye("rdf", "Description", void 0, e));
    let i, n = {};
    for (let s of t) for (let a of s.properties) i = oa(a.ns, n), Fn(a, i);
    return function(s) {
      let a;
      for (let o in s) a = s[o] = kt(s[o]), a === void 0 && delete s[o];
      return kt(s);
    }(n);
  }
  assignToOutput(e, t) {
    if (this.localOptions.parse) for (let [i, n] of Object.entries(t)) switch (i) {
      case "tiff":
        this.assignObjectToOutput(e, "ifd0", n);
        break;
      case "exif":
        this.assignObjectToOutput(e, "exif", n);
        break;
      case "xmlns":
        break;
      default:
        this.assignObjectToOutput(e, i, n);
    }
    else e.xmp = t;
  }
}
P(cr, "type", "xmp"), P(cr, "multiSegment", !0), j.set("xmp", cr);
class xt {
  static findAll(e) {
    return $n(e, /([a-zA-Z0-9-]+):([a-zA-Z0-9-]+)=("[^"]*"|'[^']*')/gm).map(xt.unpackMatch);
  }
  static unpackMatch(e) {
    let t = e[1], i = e[2], n = e[3].slice(1, -1);
    return n = Nn(n), new xt(t, i, n);
  }
  constructor(e, t, i) {
    this.ns = e, this.name = t, this.value = i;
  }
  serialize() {
    return this.value;
  }
}
class Ye {
  static findAll(e, t, i) {
    if (t !== void 0 || i !== void 0) {
      t = t || "[\\w\\d-]+", i = i || "[\\w\\d-]+";
      var n = new RegExp(`<(${t}):(${i})(#\\d+)?((\\s+?[\\w\\d-:]+=("[^"]*"|'[^']*'))*\\s*)(\\/>|>([\\s\\S]*?)<\\/\\1:\\2\\3>)`, "gm");
    } else n = /<([\w\d-]+):([\w\d-]+)(#\d+)?((\s+?[\w\d-:]+=("[^"]*"|'[^']*'))*\s*)(\/>|>([\s\S]*?)<\/\1:\2\3>)/gm;
    return $n(e, n).map(Ye.unpackMatch);
  }
  static unpackMatch(e) {
    let t = e[1], i = e[2], n = e[4], s = e[8];
    return new Ye(t, i, n, s);
  }
  constructor(e, t, i, n) {
    this.ns = e, this.name = t, this.attrString = i, this.innerXml = n, this.attrs = xt.findAll(i), this.children = Ye.findAll(n), this.value = this.children.length === 0 ? Nn(n) : void 0, this.properties = [...this.attrs, ...this.children];
  }
  get isPrimitive() {
    return this.value !== void 0 && this.attrs.length === 0 && this.children.length === 0;
  }
  get isListContainer() {
    return this.children.length === 1 && this.children[0].isList;
  }
  get isList() {
    let { ns: e, name: t } = this;
    return e === "rdf" && (t === "Seq" || t === "Bag" || t === "Alt");
  }
  get isListItem() {
    return this.ns === "rdf" && this.name === "li";
  }
  serialize() {
    if (this.properties.length === 0 && this.value === void 0) return;
    if (this.isPrimitive) return this.value;
    if (this.isListContainer) return this.children[0].serialize();
    if (this.isList) return aa(this.children.map(sa));
    if (this.isListItem && this.children.length === 1 && this.attrs.length === 0) return this.children[0].serialize();
    let e = {};
    for (let t of this.properties) Fn(t, e);
    return this.value !== void 0 && (e.value = this.value), kt(e);
  }
}
function Fn(r, e) {
  let t = r.serialize();
  t !== void 0 && (e[r.name] = t);
}
var sa = (r) => r.serialize(), aa = (r) => r.length === 1 ? r[0] : r, oa = (r, e) => e[r] ? e[r] : e[r] = {};
function $n(r, e) {
  let t, i = [];
  if (!r) return i;
  for (; (t = e.exec(r)) !== null; ) i.push(t);
  return i;
}
function Nn(r) {
  if (function(i) {
    return i == null || i === "null" || i === "undefined" || i === "" || i.trim() === "";
  }(r)) return;
  let e = Number(r);
  if (!Number.isNaN(e)) return e;
  let t = r.toLowerCase();
  return t === "true" || t !== "false" && r.trim();
}
const Bn = ["rdf:li", "rdf:Seq", "rdf:Bag", "rdf:Alt", "rdf:Description"], la = new RegExp(`(<|\\/)(${Bn.join("|")})`, "g");
var ua = Object.freeze({ __proto__: null, default: ia, Exifr: Me, fileParsers: Se, segmentParsers: j, fileReaders: be, tagKeys: X, tagValues: de, tagRevivers: Ie, createDictionary: H, extendDictionary: Ve, fetchUrlAsArrayBuffer: Ge, readBlobAsArrayBuffer: je, chunkedProps: Te, otherSegments: Ze, segments: We, tiffBlocks: B, segmentsAndBlocks: ke, tiffExtractables: Oe, inheritables: et, allFormatters: xe, Options: ze, parse: Gt, gpsOnlyOptions: Xr, gps: On, thumbnailOnlyOptions: qr, thumbnail: xn, thumbnailUrl: In, orientationOnlyOptions: Yr, orientation: Qr, rotations: Jr, get rotateCanvas() {
  return Be;
}, get rotateCss() {
  return Ue;
}, rotation: Dn });
let Hi = Tt("fs", (r) => r.promises);
be.set("fs", class extends Vt {
  async readWhole() {
    this.chunked = !1, this.fs = await Hi;
    let r = await this.fs.readFile(this.input);
    this._swapBuffer(r);
  }
  async readChunked() {
    this.chunked = !0, this.fs = await Hi, await this.open(), await this.readChunk(0, this.options.firstChunkSize);
  }
  async open() {
    this.fh === void 0 && (this.fh = await this.fs.open(this.input, "r"), this.size = (await this.fh.stat(this.input)).size);
  }
  async _readChunk(r, e) {
    this.fh === void 0 && await this.open(), r + e > this.size && (e = this.size - r);
    var t = this.subarray(r, e, !0);
    return await this.fh.read(t.dataView, 0, e, r), t;
  }
  async close() {
    if (this.fh) {
      let r = this.fh;
      this.fh = void 0, await r.close();
    }
  }
});
be.set("base64", class extends Vt {
  constructor(...r) {
    super(...r), this.input = this.input.replace(/^data:([^;]+);base64,/gim, ""), this.size = this.input.length / 4 * 3, this.input.endsWith("==") ? this.size -= 2 : this.input.endsWith("=") && (this.size -= 1);
  }
  async _readChunk(r, e) {
    let t, i, n = this.input;
    r === void 0 ? (r = 0, t = 0, i = 0) : (t = 4 * Math.floor(r / 3), i = r - t / 4 * 3), e === void 0 && (e = this.size);
    let s = r + e, a = t + 4 * Math.ceil(s / 3);
    n = n.slice(t, a);
    let o = Math.min(e, this.size - r);
    if (Ht) {
      let l = Ut.from(n, "base64").slice(i, i + o);
      return this.set(l, r, !0);
    }
    {
      let l = this.subarray(r, o, !0), c = atob(n), u = l.toUint8();
      for (let p = 0; p < o; p++) u[p] = c.charCodeAt(i + p);
      return l;
    }
  }
});
class Gi extends jt {
  static canHandle(e, t) {
    return t === 18761 || t === 19789;
  }
  extendOptions(e) {
    let { ifd0: t, xmp: i, iptc: n, icc: s } = e;
    i.enabled && t.deps.add(700), n.enabled && t.deps.add(33723), s.enabled && t.deps.add(34675), t.finalizeFilters();
  }
  async parse() {
    let { tiff: e, xmp: t, iptc: i, icc: n } = this.options;
    if (e.enabled || t.enabled || i.enabled || n.enabled) {
      let s = Math.max(Pr(this.options), this.options.chunkSize);
      await this.file.ensureChunk(0, s), this.createParser("tiff", this.file), this.parsers.tiff.parseHeader(), await this.parsers.tiff.parseIfd0Block(), this.adaptTiffPropAsSegment("xmp"), this.adaptTiffPropAsSegment("iptc"), this.adaptTiffPropAsSegment("icc");
    }
  }
  adaptTiffPropAsSegment(e) {
    if (this.parsers.tiff[e]) {
      let t = this.parsers.tiff[e];
      this.injectSegment(e, t);
    }
  }
}
P(Gi, "type", "tiff"), Se.set("tiff", Gi);
let ca = Tt("zlib");
const fa = ["ihdr", "iccp", "text", "itxt", "exif"];
class ji extends jt {
  constructor(...e) {
    super(...e), P(this, "catchError", (t) => this.errors.push(t)), P(this, "metaChunks", []), P(this, "unknownChunks", []);
  }
  static canHandle(e, t) {
    return t === 35152 && e.getUint32(0) === 2303741511 && e.getUint32(4) === 218765834;
  }
  async parse() {
    let { file: e } = this;
    await this.findPngChunksInRange(8, e.byteLength), await this.readSegments(this.metaChunks), this.findIhdr(), this.parseTextChunks(), await this.findExif().catch(this.catchError), await this.findXmp().catch(this.catchError), await this.findIcc().catch(this.catchError);
  }
  async findPngChunksInRange(e, t) {
    let { file: i } = this;
    for (; e < t; ) {
      let n = i.getUint32(e), s = i.getUint32(e + 4), a = i.getString(e + 4, 4).toLowerCase(), o = n + 4 + 4 + 4, l = { type: a, offset: e, length: o, start: e + 4 + 4, size: n, marker: s };
      fa.includes(a) ? this.metaChunks.push(l) : this.unknownChunks.push(l), e += o;
    }
  }
  parseTextChunks() {
    let e = this.metaChunks.filter((t) => t.type === "text");
    for (let t of e) {
      let [i, n] = this.file.getString(t.start, t.size).split("\0");
      this.injectKeyValToIhdr(i, n);
    }
  }
  injectKeyValToIhdr(e, t) {
    let i = this.parsers.ihdr;
    i && i.raw.set(e, t);
  }
  findIhdr() {
    let e = this.metaChunks.find((t) => t.type === "ihdr");
    e && this.options.ihdr.enabled !== !1 && this.createParser("ihdr", e.chunk);
  }
  async findExif() {
    let e = this.metaChunks.find((t) => t.type === "exif");
    e && this.injectSegment("tiff", e.chunk);
  }
  async findXmp() {
    let e = this.metaChunks.filter((t) => t.type === "itxt");
    for (let t of e)
      t.chunk.getString(0, 17) === "XML:com.adobe.xmp" && this.injectSegment("xmp", t.chunk);
  }
  async findIcc() {
    let e = this.metaChunks.find((o) => o.type === "iccp");
    if (!e) return;
    let { chunk: t } = e, i = t.getUint8Array(0, 81), n = 0;
    for (; n < 80 && i[n] !== 0; ) n++;
    let s = n + 2, a = t.getString(0, n);
    if (this.injectKeyValToIhdr("ProfileName", a), wt) {
      let o = await ca, l = t.getUint8Array(s);
      l = o.inflateSync(l), this.injectSegment("icc", l);
    }
  }
}
P(ji, "type", "png"), Se.set("png", ji), H(X, "interop", [[1, "InteropIndex"], [2, "InteropVersion"], [4096, "RelatedImageFileFormat"], [4097, "RelatedImageWidth"], [4098, "RelatedImageHeight"]]), Ve(X, "ifd0", [[11, "ProcessingSoftware"], [254, "SubfileType"], [255, "OldSubfileType"], [263, "Thresholding"], [264, "CellWidth"], [265, "CellLength"], [266, "FillOrder"], [269, "DocumentName"], [280, "MinSampleValue"], [281, "MaxSampleValue"], [285, "PageName"], [286, "XPosition"], [287, "YPosition"], [290, "GrayResponseUnit"], [297, "PageNumber"], [321, "HalftoneHints"], [322, "TileWidth"], [323, "TileLength"], [332, "InkSet"], [337, "TargetPrinter"], [18246, "Rating"], [18249, "RatingPercent"], [33550, "PixelScale"], [34264, "ModelTransform"], [34377, "PhotoshopSettings"], [50706, "DNGVersion"], [50707, "DNGBackwardVersion"], [50708, "UniqueCameraModel"], [50709, "LocalizedCameraModel"], [50736, "DNGLensInfo"], [50739, "ShadowScale"], [50740, "DNGPrivateData"], [33920, "IntergraphMatrix"], [33922, "ModelTiePoint"], [34118, "SEMInfo"], [34735, "GeoTiffDirectory"], [34736, "GeoTiffDoubleParams"], [34737, "GeoTiffAsciiParams"], [50341, "PrintIM"], [50721, "ColorMatrix1"], [50722, "ColorMatrix2"], [50723, "CameraCalibration1"], [50724, "CameraCalibration2"], [50725, "ReductionMatrix1"], [50726, "ReductionMatrix2"], [50727, "AnalogBalance"], [50728, "AsShotNeutral"], [50729, "AsShotWhiteXY"], [50730, "BaselineExposure"], [50731, "BaselineNoise"], [50732, "BaselineSharpness"], [50734, "LinearResponseLimit"], [50735, "CameraSerialNumber"], [50741, "MakerNoteSafety"], [50778, "CalibrationIlluminant1"], [50779, "CalibrationIlluminant2"], [50781, "RawDataUniqueID"], [50827, "OriginalRawFileName"], [50828, "OriginalRawFileData"], [50831, "AsShotICCProfile"], [50832, "AsShotPreProfileMatrix"], [50833, "CurrentICCProfile"], [50834, "CurrentPreProfileMatrix"], [50879, "ColorimetricReference"], [50885, "SRawType"], [50898, "PanasonicTitle"], [50899, "PanasonicTitle2"], [50931, "CameraCalibrationSig"], [50932, "ProfileCalibrationSig"], [50933, "ProfileIFD"], [50934, "AsShotProfileName"], [50936, "ProfileName"], [50937, "ProfileHueSatMapDims"], [50938, "ProfileHueSatMapData1"], [50939, "ProfileHueSatMapData2"], [50940, "ProfileToneCurve"], [50941, "ProfileEmbedPolicy"], [50942, "ProfileCopyright"], [50964, "ForwardMatrix1"], [50965, "ForwardMatrix2"], [50966, "PreviewApplicationName"], [50967, "PreviewApplicationVersion"], [50968, "PreviewSettingsName"], [50969, "PreviewSettingsDigest"], [50970, "PreviewColorSpace"], [50971, "PreviewDateTime"], [50972, "RawImageDigest"], [50973, "OriginalRawFileDigest"], [50981, "ProfileLookTableDims"], [50982, "ProfileLookTableData"], [51043, "TimeCodes"], [51044, "FrameRate"], [51058, "TStop"], [51081, "ReelName"], [51089, "OriginalDefaultFinalSize"], [51090, "OriginalBestQualitySize"], [51091, "OriginalDefaultCropSize"], [51105, "CameraLabel"], [51107, "ProfileHueSatMapEncoding"], [51108, "ProfileLookTableEncoding"], [51109, "BaselineExposureOffset"], [51110, "DefaultBlackRender"], [51111, "NewRawImageDigest"], [51112, "RawToPreviewGain"]]);
let Vi = [[273, "StripOffsets"], [279, "StripByteCounts"], [288, "FreeOffsets"], [289, "FreeByteCounts"], [291, "GrayResponseCurve"], [292, "T4Options"], [293, "T6Options"], [300, "ColorResponseUnit"], [320, "ColorMap"], [324, "TileOffsets"], [325, "TileByteCounts"], [326, "BadFaxLines"], [327, "CleanFaxData"], [328, "ConsecutiveBadFaxLines"], [330, "SubIFD"], [333, "InkNames"], [334, "NumberofInks"], [336, "DotRange"], [338, "ExtraSamples"], [339, "SampleFormat"], [340, "SMinSampleValue"], [341, "SMaxSampleValue"], [342, "TransferRange"], [343, "ClipPath"], [344, "XClipPathUnits"], [345, "YClipPathUnits"], [346, "Indexed"], [347, "JPEGTables"], [351, "OPIProxy"], [400, "GlobalParametersIFD"], [401, "ProfileType"], [402, "FaxProfile"], [403, "CodingMethods"], [404, "VersionYear"], [405, "ModeNumber"], [433, "Decode"], [434, "DefaultImageColor"], [435, "T82Options"], [437, "JPEGTables"], [512, "JPEGProc"], [515, "JPEGRestartInterval"], [517, "JPEGLosslessPredictors"], [518, "JPEGPointTransforms"], [519, "JPEGQTables"], [520, "JPEGDCTables"], [521, "JPEGACTables"], [559, "StripRowCounts"], [999, "USPTOMiscellaneous"], [18247, "XP_DIP_XML"], [18248, "StitchInfo"], [28672, "SonyRawFileType"], [28688, "SonyToneCurve"], [28721, "VignettingCorrection"], [28722, "VignettingCorrParams"], [28724, "ChromaticAberrationCorrection"], [28725, "ChromaticAberrationCorrParams"], [28726, "DistortionCorrection"], [28727, "DistortionCorrParams"], [29895, "SonyCropTopLeft"], [29896, "SonyCropSize"], [32781, "ImageID"], [32931, "WangTag1"], [32932, "WangAnnotation"], [32933, "WangTag3"], [32934, "WangTag4"], [32953, "ImageReferencePoints"], [32954, "RegionXformTackPoint"], [32955, "WarpQuadrilateral"], [32956, "AffineTransformMat"], [32995, "Matteing"], [32996, "DataType"], [32997, "ImageDepth"], [32998, "TileDepth"], [33300, "ImageFullWidth"], [33301, "ImageFullHeight"], [33302, "TextureFormat"], [33303, "WrapModes"], [33304, "FovCot"], [33305, "MatrixWorldToScreen"], [33306, "MatrixWorldToCamera"], [33405, "Model2"], [33421, "CFARepeatPatternDim"], [33422, "CFAPattern2"], [33423, "BatteryLevel"], [33424, "KodakIFD"], [33445, "MDFileTag"], [33446, "MDScalePixel"], [33447, "MDColorTable"], [33448, "MDLabName"], [33449, "MDSampleInfo"], [33450, "MDPrepDate"], [33451, "MDPrepTime"], [33452, "MDFileUnits"], [33589, "AdventScale"], [33590, "AdventRevision"], [33628, "UIC1Tag"], [33629, "UIC2Tag"], [33630, "UIC3Tag"], [33631, "UIC4Tag"], [33918, "IntergraphPacketData"], [33919, "IntergraphFlagRegisters"], [33921, "INGRReserved"], [34016, "Site"], [34017, "ColorSequence"], [34018, "IT8Header"], [34019, "RasterPadding"], [34020, "BitsPerRunLength"], [34021, "BitsPerExtendedRunLength"], [34022, "ColorTable"], [34023, "ImageColorIndicator"], [34024, "BackgroundColorIndicator"], [34025, "ImageColorValue"], [34026, "BackgroundColorValue"], [34027, "PixelIntensityRange"], [34028, "TransparencyIndicator"], [34029, "ColorCharacterization"], [34030, "HCUsage"], [34031, "TrapIndicator"], [34032, "CMYKEquivalent"], [34152, "AFCP_IPTC"], [34232, "PixelMagicJBIGOptions"], [34263, "JPLCartoIFD"], [34306, "WB_GRGBLevels"], [34310, "LeafData"], [34687, "TIFF_FXExtensions"], [34688, "MultiProfiles"], [34689, "SharedData"], [34690, "T88Options"], [34732, "ImageLayer"], [34750, "JBIGOptions"], [34856, "Opto-ElectricConvFactor"], [34857, "Interlace"], [34908, "FaxRecvParams"], [34909, "FaxSubAddress"], [34910, "FaxRecvTime"], [34929, "FedexEDR"], [34954, "LeafSubIFD"], [37387, "FlashEnergy"], [37388, "SpatialFrequencyResponse"], [37389, "Noise"], [37390, "FocalPlaneXResolution"], [37391, "FocalPlaneYResolution"], [37392, "FocalPlaneResolutionUnit"], [37397, "ExposureIndex"], [37398, "TIFF-EPStandardID"], [37399, "SensingMethod"], [37434, "CIP3DataFile"], [37435, "CIP3Sheet"], [37436, "CIP3Side"], [37439, "StoNits"], [37679, "MSDocumentText"], [37680, "MSPropertySetStorage"], [37681, "MSDocumentTextPosition"], [37724, "ImageSourceData"], [40965, "InteropIFD"], [40976, "SamsungRawPointersOffset"], [40977, "SamsungRawPointersLength"], [41217, "SamsungRawByteOrder"], [41218, "SamsungRawUnknown"], [41484, "SpatialFrequencyResponse"], [41485, "Noise"], [41489, "ImageNumber"], [41490, "SecurityClassification"], [41491, "ImageHistory"], [41494, "TIFF-EPStandardID"], [41995, "DeviceSettingDescription"], [42112, "GDALMetadata"], [42113, "GDALNoData"], [44992, "ExpandSoftware"], [44993, "ExpandLens"], [44994, "ExpandFilm"], [44995, "ExpandFilterLens"], [44996, "ExpandScanner"], [44997, "ExpandFlashLamp"], [46275, "HasselbladRawImage"], [48129, "PixelFormat"], [48130, "Transformation"], [48131, "Uncompressed"], [48132, "ImageType"], [48256, "ImageWidth"], [48257, "ImageHeight"], [48258, "WidthResolution"], [48259, "HeightResolution"], [48320, "ImageOffset"], [48321, "ImageByteCount"], [48322, "AlphaOffset"], [48323, "AlphaByteCount"], [48324, "ImageDataDiscard"], [48325, "AlphaDataDiscard"], [50215, "OceScanjobDesc"], [50216, "OceApplicationSelector"], [50217, "OceIDNumber"], [50218, "OceImageLogic"], [50255, "Annotations"], [50459, "HasselbladExif"], [50547, "OriginalFileName"], [50560, "USPTOOriginalContentType"], [50656, "CR2CFAPattern"], [50710, "CFAPlaneColor"], [50711, "CFALayout"], [50712, "LinearizationTable"], [50713, "BlackLevelRepeatDim"], [50714, "BlackLevel"], [50715, "BlackLevelDeltaH"], [50716, "BlackLevelDeltaV"], [50717, "WhiteLevel"], [50718, "DefaultScale"], [50719, "DefaultCropOrigin"], [50720, "DefaultCropSize"], [50733, "BayerGreenSplit"], [50737, "ChromaBlurRadius"], [50738, "AntiAliasStrength"], [50752, "RawImageSegmentation"], [50780, "BestQualityScale"], [50784, "AliasLayerMetadata"], [50829, "ActiveArea"], [50830, "MaskedAreas"], [50935, "NoiseReductionApplied"], [50974, "SubTileBlockSize"], [50975, "RowInterleaveFactor"], [51008, "OpcodeList1"], [51009, "OpcodeList2"], [51022, "OpcodeList3"], [51041, "NoiseProfile"], [51114, "CacheVersion"], [51125, "DefaultUserCrop"], [51157, "NikonNEFInfo"], [65024, "KdcIFD"]];
Ve(X, "ifd0", Vi), Ve(X, "exif", Vi), H(de, "gps", [[23, { M: "Magnetic North", T: "True North" }], [25, { K: "Kilometers", M: "Miles", N: "Nautical Miles" }]]);
class fr extends fe {
  static canHandle(e, t) {
    return e.getUint8(t + 1) === 224 && e.getUint32(t + 4) === 1246120262 && e.getUint8(t + 8) === 0;
  }
  parse() {
    return this.parseTags(), this.translate(), this.output;
  }
  parseTags() {
    this.raw = /* @__PURE__ */ new Map([[0, this.chunk.getUint16(0)], [2, this.chunk.getUint8(2)], [3, this.chunk.getUint16(3)], [5, this.chunk.getUint16(5)], [7, this.chunk.getUint8(7)], [8, this.chunk.getUint8(8)]]);
  }
}
P(fr, "type", "jfif"), P(fr, "headerLength", 9), j.set("jfif", fr), H(X, "jfif", [[0, "JFIFVersion"], [2, "ResolutionUnit"], [3, "XResolution"], [5, "YResolution"], [7, "ThumbnailWidth"], [8, "ThumbnailHeight"]]);
class Wi extends fe {
  parse() {
    return this.parseTags(), this.translate(), this.output;
  }
  parseTags() {
    this.raw = new Map([[0, this.chunk.getUint32(0)], [4, this.chunk.getUint32(4)], [8, this.chunk.getUint8(8)], [9, this.chunk.getUint8(9)], [10, this.chunk.getUint8(10)], [11, this.chunk.getUint8(11)], [12, this.chunk.getUint8(12)], ...Array.from(this.raw)]);
  }
}
P(Wi, "type", "ihdr"), j.set("ihdr", Wi), H(X, "ihdr", [[0, "ImageWidth"], [4, "ImageHeight"], [8, "BitDepth"], [9, "ColorType"], [10, "Compression"], [11, "Filter"], [12, "Interlace"]]), H(de, "ihdr", [[9, { 0: "Grayscale", 2: "RGB", 3: "Palette", 4: "Grayscale with Alpha", 6: "RGB with Alpha", DEFAULT: "Unknown" }], [10, { 0: "Deflate/Inflate", DEFAULT: "Unknown" }], [11, { 0: "Adaptive", DEFAULT: "Unknown" }], [12, { 0: "Noninterlaced", 1: "Adam7 Interlace", DEFAULT: "Unknown" }]]);
class At extends fe {
  static canHandle(e, t) {
    return e.getUint8(t + 1) === 226 && e.getUint32(t + 4) === 1229144927;
  }
  static findPosition(e, t) {
    let i = super.findPosition(e, t);
    return i.chunkNumber = e.getUint8(t + 16), i.chunkCount = e.getUint8(t + 17), i.multiSegment = i.chunkCount > 1, i;
  }
  static handleMultiSegments(e) {
    return function(t) {
      let i = function(n) {
        let s = n[0].constructor, a = 0;
        for (let c of n) a += c.length;
        let o = new s(a), l = 0;
        for (let c of n) o.set(c, l), l += c.length;
        return o;
      }(t.map((n) => n.chunk.toUint8()));
      return new te(i);
    }(e);
  }
  parse() {
    return this.raw = /* @__PURE__ */ new Map(), this.parseHeader(), this.parseTags(), this.translate(), this.output;
  }
  parseHeader() {
    let { raw: e } = this;
    this.chunk.byteLength < 84 && V("ICC header is too short");
    for (let [t, i] of Object.entries(ha)) {
      t = parseInt(t, 10);
      let n = i(this.chunk, t);
      n !== "\0\0\0\0" && e.set(t, n);
    }
  }
  parseTags() {
    let e, t, i, n, s, { raw: a } = this, o = this.chunk.getUint32(128), l = 132, c = this.chunk.byteLength;
    for (; o--; ) {
      if (e = this.chunk.getString(l, 4), t = this.chunk.getUint32(l + 4), i = this.chunk.getUint32(l + 8), n = this.chunk.getString(t, 4), t + i > c) return void console.warn("reached the end of the first ICC chunk. Enable options.tiff.multiSegment to read all ICC segments.");
      s = this.parseTag(n, t, i), s !== void 0 && s !== "\0\0\0\0" && a.set(e, s), l += 12;
    }
  }
  parseTag(e, t, i) {
    switch (e) {
      case "desc":
        return this.parseDesc(t);
      case "mluc":
        return this.parseMluc(t);
      case "text":
        return this.parseText(t, i);
      case "sig ":
        return this.parseSig(t);
    }
    if (!(t + i > this.chunk.byteLength)) return this.chunk.getUint8Array(t, i);
  }
  parseDesc(e) {
    let t = this.chunk.getUint32(e + 8) - 1;
    return Ne(this.chunk.getString(e + 12, t));
  }
  parseText(e, t) {
    return Ne(this.chunk.getString(e + 8, t - 8));
  }
  parseSig(e) {
    return Ne(this.chunk.getString(e + 8, 4));
  }
  parseMluc(e) {
    let { chunk: t } = this, i = t.getUint32(e + 8), n = t.getUint32(e + 12), s = e + 16, a = [];
    for (let o = 0; o < i; o++) {
      let l = t.getString(s + 0, 2), c = t.getString(s + 2, 2), u = t.getUint32(s + 4), p = t.getUint32(s + 8) + e, f = Ne(t.getUnicodeString(p, u));
      a.push({ lang: l, country: c, text: f }), s += n;
    }
    return i === 1 ? a[0].text : a;
  }
  translateValue(e, t) {
    return typeof e == "string" ? t[e] || t[e.toLowerCase()] || e : t[e] || e;
  }
}
P(At, "type", "icc"), P(At, "multiSegment", !0), P(At, "headerLength", 18);
const ha = { 4: Ce, 8: function(r, e) {
  return [r.getUint8(e), r.getUint8(e + 1) >> 4, r.getUint8(e + 1) % 16].map((t) => t.toString(10)).join(".");
}, 12: Ce, 16: Ce, 20: Ce, 24: function(r, e) {
  const t = r.getUint16(e), i = r.getUint16(e + 2) - 1, n = r.getUint16(e + 4), s = r.getUint16(e + 6), a = r.getUint16(e + 8), o = r.getUint16(e + 10);
  return new Date(Date.UTC(t, i, n, s, a, o));
}, 36: Ce, 40: Ce, 48: Ce, 52: Ce, 64: (r, e) => r.getUint32(e), 80: Ce };
function Ce(r, e) {
  return Ne(r.getString(e, 4));
}
j.set("icc", At), H(X, "icc", [[4, "ProfileCMMType"], [8, "ProfileVersion"], [12, "ProfileClass"], [16, "ColorSpaceData"], [20, "ProfileConnectionSpace"], [24, "ProfileDateTime"], [36, "ProfileFileSignature"], [40, "PrimaryPlatform"], [44, "CMMFlags"], [48, "DeviceManufacturer"], [52, "DeviceModel"], [56, "DeviceAttributes"], [64, "RenderingIntent"], [68, "ConnectionSpaceIlluminant"], [80, "ProfileCreator"], [84, "ProfileID"], ["Header", "ProfileHeader"], ["MS00", "WCSProfiles"], ["bTRC", "BlueTRC"], ["bXYZ", "BlueMatrixColumn"], ["bfd", "UCRBG"], ["bkpt", "MediaBlackPoint"], ["calt", "CalibrationDateTime"], ["chad", "ChromaticAdaptation"], ["chrm", "Chromaticity"], ["ciis", "ColorimetricIntentImageState"], ["clot", "ColorantTableOut"], ["clro", "ColorantOrder"], ["clrt", "ColorantTable"], ["cprt", "ProfileCopyright"], ["crdi", "CRDInfo"], ["desc", "ProfileDescription"], ["devs", "DeviceSettings"], ["dmdd", "DeviceModelDesc"], ["dmnd", "DeviceMfgDesc"], ["dscm", "ProfileDescriptionML"], ["fpce", "FocalPlaneColorimetryEstimates"], ["gTRC", "GreenTRC"], ["gXYZ", "GreenMatrixColumn"], ["gamt", "Gamut"], ["kTRC", "GrayTRC"], ["lumi", "Luminance"], ["meas", "Measurement"], ["meta", "Metadata"], ["mmod", "MakeAndModel"], ["ncl2", "NamedColor2"], ["ncol", "NamedColor"], ["ndin", "NativeDisplayInfo"], ["pre0", "Preview0"], ["pre1", "Preview1"], ["pre2", "Preview2"], ["ps2i", "PS2RenderingIntent"], ["ps2s", "PostScript2CSA"], ["psd0", "PostScript2CRD0"], ["psd1", "PostScript2CRD1"], ["psd2", "PostScript2CRD2"], ["psd3", "PostScript2CRD3"], ["pseq", "ProfileSequenceDesc"], ["psid", "ProfileSequenceIdentifier"], ["psvm", "PS2CRDVMSize"], ["rTRC", "RedTRC"], ["rXYZ", "RedMatrixColumn"], ["resp", "OutputResponse"], ["rhoc", "ReflectionHardcopyOrigColorimetry"], ["rig0", "PerceptualRenderingIntentGamut"], ["rig2", "SaturationRenderingIntentGamut"], ["rpoc", "ReflectionPrintOutputColorimetry"], ["sape", "SceneAppearanceEstimates"], ["scoe", "SceneColorimetryEstimates"], ["scrd", "ScreeningDesc"], ["scrn", "Screening"], ["targ", "CharTarget"], ["tech", "Technology"], ["vcgt", "VideoCardGamma"], ["view", "ViewingConditions"], ["vued", "ViewingCondDesc"], ["wtpt", "MediaWhitePoint"]]);
const _t = { "4d2p": "Erdt Systems", AAMA: "Aamazing Technologies", ACER: "Acer", ACLT: "Acolyte Color Research", ACTI: "Actix Sytems", ADAR: "Adara Technology", ADBE: "Adobe", ADI: "ADI Systems", AGFA: "Agfa Graphics", ALMD: "Alps Electric", ALPS: "Alps Electric", ALWN: "Alwan Color Expertise", AMTI: "Amiable Technologies", AOC: "AOC International", APAG: "Apago", APPL: "Apple Computer", AST: "AST", "AT&T": "AT&T", BAEL: "BARBIERI electronic", BRCO: "Barco NV", BRKP: "Breakpoint", BROT: "Brother", BULL: "Bull", BUS: "Bus Computer Systems", "C-IT": "C-Itoh", CAMR: "Intel", CANO: "Canon", CARR: "Carroll Touch", CASI: "Casio", CBUS: "Colorbus PL", CEL: "Crossfield", CELx: "Crossfield", CGS: "CGS Publishing Technologies International", CHM: "Rochester Robotics", CIGL: "Colour Imaging Group, London", CITI: "Citizen", CL00: "Candela", CLIQ: "Color IQ", CMCO: "Chromaco", CMiX: "CHROMiX", COLO: "Colorgraphic Communications", COMP: "Compaq", COMp: "Compeq/Focus Technology", CONR: "Conrac Display Products", CORD: "Cordata Technologies", CPQ: "Compaq", CPRO: "ColorPro", CRN: "Cornerstone", CTX: "CTX International", CVIS: "ColorVision", CWC: "Fujitsu Laboratories", DARI: "Darius Technology", DATA: "Dataproducts", DCP: "Dry Creek Photo", DCRC: "Digital Contents Resource Center, Chung-Ang University", DELL: "Dell Computer", DIC: "Dainippon Ink and Chemicals", DICO: "Diconix", DIGI: "Digital", "DL&C": "Digital Light & Color", DPLG: "Doppelganger", DS: "Dainippon Screen", DSOL: "DOOSOL", DUPN: "DuPont", EPSO: "Epson", ESKO: "Esko-Graphics", ETRI: "Electronics and Telecommunications Research Institute", EVER: "Everex Systems", EXAC: "ExactCODE", Eizo: "Eizo", FALC: "Falco Data Products", FF: "Fuji Photo Film", FFEI: "FujiFilm Electronic Imaging", FNRD: "Fnord Software", FORA: "Fora", FORE: "Forefront Technology", FP: "Fujitsu", FPA: "WayTech Development", FUJI: "Fujitsu", FX: "Fuji Xerox", GCC: "GCC Technologies", GGSL: "Global Graphics Software", GMB: "Gretagmacbeth", GMG: "GMG", GOLD: "GoldStar Technology", GOOG: "Google", GPRT: "Giantprint", GTMB: "Gretagmacbeth", GVC: "WayTech Development", GW2K: "Sony", HCI: "HCI", HDM: "Heidelberger Druckmaschinen", HERM: "Hermes", HITA: "Hitachi America", HP: "Hewlett-Packard", HTC: "Hitachi", HiTi: "HiTi Digital", IBM: "IBM", IDNT: "Scitex", IEC: "Hewlett-Packard", IIYA: "Iiyama North America", IKEG: "Ikegami Electronics", IMAG: "Image Systems", IMI: "Ingram Micro", INTC: "Intel", INTL: "N/A (INTL)", INTR: "Intra Electronics", IOCO: "Iocomm International Technology", IPS: "InfoPrint Solutions Company", IRIS: "Scitex", ISL: "Ichikawa Soft Laboratory", ITNL: "N/A (ITNL)", IVM: "IVM", IWAT: "Iwatsu Electric", Idnt: "Scitex", Inca: "Inca Digital Printers", Iris: "Scitex", JPEG: "Joint Photographic Experts Group", JSFT: "Jetsoft Development", JVC: "JVC Information Products", KART: "Scitex", KFC: "KFC Computek Components", KLH: "KLH Computers", KMHD: "Konica Minolta", KNCA: "Konica", KODA: "Kodak", KYOC: "Kyocera", Kart: "Scitex", LCAG: "Leica", LCCD: "Leeds Colour", LDAK: "Left Dakota", LEAD: "Leading Technology", LEXM: "Lexmark International", LINK: "Link Computer", LINO: "Linotronic", LITE: "Lite-On", Leaf: "Leaf", Lino: "Linotronic", MAGC: "Mag Computronic", MAGI: "MAG Innovision", MANN: "Mannesmann", MICN: "Micron Technology", MICR: "Microtek", MICV: "Microvitec", MINO: "Minolta", MITS: "Mitsubishi Electronics America", MITs: "Mitsuba", MNLT: "Minolta", MODG: "Modgraph", MONI: "Monitronix", MONS: "Monaco Systems", MORS: "Morse Technology", MOTI: "Motive Systems", MSFT: "Microsoft", MUTO: "MUTOH INDUSTRIES", Mits: "Mitsubishi Electric", NANA: "NANAO", NEC: "NEC", NEXP: "NexPress Solutions", NISS: "Nissei Sangyo America", NKON: "Nikon", NONE: "none", OCE: "Oce Technologies", OCEC: "OceColor", OKI: "Oki", OKID: "Okidata", OKIP: "Okidata", OLIV: "Olivetti", OLYM: "Olympus", ONYX: "Onyx Graphics", OPTI: "Optiquest", PACK: "Packard Bell", PANA: "Matsushita Electric Industrial", PANT: "Pantone", PBN: "Packard Bell", PFU: "PFU", PHIL: "Philips Consumer Electronics", PNTX: "HOYA", POne: "Phase One A/S", PREM: "Premier Computer Innovations", PRIN: "Princeton Graphic Systems", PRIP: "Princeton Publishing Labs", QLUX: "Hong Kong", QMS: "QMS", QPCD: "QPcard AB", QUAD: "QuadLaser", QUME: "Qume", RADI: "Radius", RDDx: "Integrated Color Solutions", RDG: "Roland DG", REDM: "REDMS Group", RELI: "Relisys", RGMS: "Rolf Gierling Multitools", RICO: "Ricoh", RNLD: "Edmund Ronald", ROYA: "Royal", RPC: "Ricoh Printing Systems", RTL: "Royal Information Electronics", SAMP: "Sampo", SAMS: "Samsung", SANT: "Jaime Santana Pomares", SCIT: "Scitex", SCRN: "Dainippon Screen", SDP: "Scitex", SEC: "Samsung", SEIK: "Seiko Instruments", SEIk: "Seikosha", SGUY: "ScanGuy.com", SHAR: "Sharp Laboratories", SICC: "International Color Consortium", SONY: "Sony", SPCL: "SpectraCal", STAR: "Star", STC: "Sampo Technology", Scit: "Scitex", Sdp: "Scitex", Sony: "Sony", TALO: "Talon Technology", TAND: "Tandy", TATU: "Tatung", TAXA: "TAXAN America", TDS: "Tokyo Denshi Sekei", TECO: "TECO Information Systems", TEGR: "Tegra", TEKT: "Tektronix", TI: "Texas Instruments", TMKR: "TypeMaker", TOSB: "Toshiba", TOSH: "Toshiba", TOTK: "TOTOKU ELECTRIC", TRIU: "Triumph", TSBT: "Toshiba", TTX: "TTX Computer Products", TVM: "TVM Professional Monitor", TW: "TW Casper", ULSX: "Ulead Systems", UNIS: "Unisys", UTZF: "Utz Fehlau & Sohn", VARI: "Varityper", VIEW: "Viewsonic", VISL: "Visual communication", VIVO: "Vivo Mobile Communication", WANG: "Wang", WLBR: "Wilbur Imaging", WTG2: "Ware To Go", WYSE: "WYSE Technology", XERX: "Xerox", XRIT: "X-Rite", ZRAN: "Zoran", Zebr: "Zebra Technologies", appl: "Apple Computer", bICC: "basICColor", berg: "bergdesign", ceyd: "Integrated Color Solutions", clsp: "MacDermid ColorSpan", ds: "Dainippon Screen", dupn: "DuPont", ffei: "FujiFilm Electronic Imaging", flux: "FluxData", iris: "Scitex", kart: "Scitex", lcms: "Little CMS", lino: "Linotronic", none: "none", ob4d: "Erdt Systems", obic: "Medigraph", quby: "Qubyx Sarl", scit: "Scitex", scrn: "Dainippon Screen", sdp: "Scitex", siwi: "SIWI GRAFIKA", yxym: "YxyMaster" }, zi = { scnr: "Scanner", mntr: "Monitor", prtr: "Printer", link: "Device Link", abst: "Abstract", spac: "Color Space Conversion Profile", nmcl: "Named Color", cenc: "ColorEncodingSpace profile", mid: "MultiplexIdentification profile", mlnk: "MultiplexLink profile", mvis: "MultiplexVisualization profile", nkpf: "Nikon Input Device Profile (NON-STANDARD!)" };
H(de, "icc", [[4, _t], [12, zi], [40, Object.assign({}, _t, zi)], [48, _t], [80, _t], [64, { 0: "Perceptual", 1: "Relative Colorimetric", 2: "Saturation", 3: "Absolute Colorimetric" }], ["tech", { amd: "Active Matrix Display", crt: "Cathode Ray Tube Display", kpcd: "Photo CD", pmd: "Passive Matrix Display", dcam: "Digital Camera", dcpj: "Digital Cinema Projector", dmpc: "Digital Motion Picture Camera", dsub: "Dye Sublimation Printer", epho: "Electrophotographic Printer", esta: "Electrostatic Printer", flex: "Flexography", fprn: "Film Writer", fscn: "Film Scanner", grav: "Gravure", ijet: "Ink Jet Printer", imgs: "Photo Image Setter", mpfr: "Motion Picture Film Recorder", mpfs: "Motion Picture Film Scanner", offs: "Offset Lithography", pjtv: "Projection Television", rpho: "Photographic Paper Printer", rscn: "Reflective Scanner", silk: "Silkscreen", twax: "Thermal Wax Printer", vidc: "Video Camera", vidm: "Video Monitor" }]]);
class bt extends fe {
  static canHandle(e, t, i) {
    return e.getUint8(t + 1) === 237 && e.getString(t + 4, 9) === "Photoshop" && this.containsIptc8bim(e, t, i) !== void 0;
  }
  static headerLength(e, t, i) {
    let n, s = this.containsIptc8bim(e, t, i);
    if (s !== void 0) return n = e.getUint8(t + s + 7), n % 2 != 0 && (n += 1), n === 0 && (n = 4), s + 8 + n;
  }
  static containsIptc8bim(e, t, i) {
    for (let n = 0; n < i; n++) if (this.isIptcSegmentHead(e, t + n)) return n;
  }
  static isIptcSegmentHead(e, t) {
    return e.getUint8(t) === 56 && e.getUint32(t) === 943868237 && e.getUint16(t + 4) === 1028;
  }
  parse() {
    let { raw: e } = this, t = this.chunk.byteLength - 1, i = !1;
    for (let n = 0; n < t; n++) if (this.chunk.getUint8(n) === 28 && this.chunk.getUint8(n + 1) === 2) {
      i = !0;
      let s = this.chunk.getUint16(n + 3), a = this.chunk.getUint8(n + 2), o = this.chunk.getLatin1String(n + 5, s);
      e.set(a, this.pluralizeValue(e.get(a), o)), n += 4 + s;
    } else if (i) break;
    return this.translate(), this.output;
  }
  pluralizeValue(e, t) {
    return e !== void 0 ? e instanceof Array ? (e.push(t), e) : [e, t] : t;
  }
}
P(bt, "type", "iptc"), P(bt, "translateValues", !1), P(bt, "reviveValues", !1), j.set("iptc", bt), H(X, "iptc", [[0, "ApplicationRecordVersion"], [3, "ObjectTypeReference"], [4, "ObjectAttributeReference"], [5, "ObjectName"], [7, "EditStatus"], [8, "EditorialUpdate"], [10, "Urgency"], [12, "SubjectReference"], [15, "Category"], [20, "SupplementalCategories"], [22, "FixtureIdentifier"], [25, "Keywords"], [26, "ContentLocationCode"], [27, "ContentLocationName"], [30, "ReleaseDate"], [35, "ReleaseTime"], [37, "ExpirationDate"], [38, "ExpirationTime"], [40, "SpecialInstructions"], [42, "ActionAdvised"], [45, "ReferenceService"], [47, "ReferenceDate"], [50, "ReferenceNumber"], [55, "DateCreated"], [60, "TimeCreated"], [62, "DigitalCreationDate"], [63, "DigitalCreationTime"], [65, "OriginatingProgram"], [70, "ProgramVersion"], [75, "ObjectCycle"], [80, "Byline"], [85, "BylineTitle"], [90, "City"], [92, "Sublocation"], [95, "State"], [100, "CountryCode"], [101, "Country"], [103, "OriginalTransmissionReference"], [105, "Headline"], [110, "Credit"], [115, "Source"], [116, "CopyrightNotice"], [118, "Contact"], [120, "Caption"], [121, "LocalCaption"], [122, "Writer"], [125, "RasterizedCaption"], [130, "ImageType"], [131, "ImageOrientation"], [135, "LanguageIdentifier"], [150, "AudioType"], [151, "AudioSamplingRate"], [152, "AudioSamplingResolution"], [153, "AudioDuration"], [154, "AudioOutcue"], [184, "JobID"], [185, "MasterDocumentID"], [186, "ShortDocumentID"], [187, "UniqueDocumentID"], [188, "OwnerID"], [200, "ObjectPreviewFileFormat"], [201, "ObjectPreviewFileVersion"], [202, "ObjectPreviewData"], [221, "Prefs"], [225, "ClassifyState"], [228, "SimilarityIndex"], [230, "DocumentNotes"], [231, "DocumentHistory"], [232, "ExifCameraInfo"], [255, "CatalogSets"]]), H(de, "iptc", [[10, { 0: "0 (reserved)", 1: "1 (most urgent)", 2: "2", 3: "3", 4: "4", 5: "5 (normal urgency)", 6: "6", 7: "7", 8: "8 (least urgent)", 9: "9 (user-defined priority)" }], [75, { a: "Morning", b: "Both Morning and Evening", p: "Evening" }], [131, { L: "Landscape", P: "Portrait", S: "Square" }]]);
var da = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function pa(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
var Y = {}, N = {}, Qe = {};
Object.defineProperty(Qe, "__esModule", { value: !0 });
Qe.splitWhen = Qe.flatten = void 0;
function ga(r) {
  return r.reduce((e, t) => [].concat(e, t), []);
}
Qe.flatten = ga;
function ma(r, e) {
  const t = [[]];
  let i = 0;
  for (const n of r)
    e(n) ? (i++, t[i] = []) : t[i].push(n);
  return t;
}
Qe.splitWhen = ma;
var Wt = {};
Object.defineProperty(Wt, "__esModule", { value: !0 });
Wt.isEnoentCodeError = void 0;
function ya(r) {
  return r.code === "ENOENT";
}
Wt.isEnoentCodeError = ya;
var zt = {};
Object.defineProperty(zt, "__esModule", { value: !0 });
zt.createDirentFromStats = void 0;
let Sa = class {
  constructor(e, t) {
    this.name = e, this.isBlockDevice = t.isBlockDevice.bind(t), this.isCharacterDevice = t.isCharacterDevice.bind(t), this.isDirectory = t.isDirectory.bind(t), this.isFIFO = t.isFIFO.bind(t), this.isFile = t.isFile.bind(t), this.isSocket = t.isSocket.bind(t), this.isSymbolicLink = t.isSymbolicLink.bind(t);
  }
};
function _a(r, e) {
  return new Sa(r, e);
}
zt.createDirentFromStats = _a;
var G = {};
Object.defineProperty(G, "__esModule", { value: !0 });
G.convertPosixPathToPattern = G.convertWindowsPathToPattern = G.convertPathToPattern = G.escapePosixPath = G.escapeWindowsPath = G.escape = G.removeLeadingDotSegment = G.makeAbsolute = G.unixify = void 0;
const ba = jr, va = _e, Un = ba.platform() === "win32", Ca = 2, Pa = /(\\?)([()*?[\]{|}]|^!|[!+@](?=\()|\\(?![!()*+?@[\]{|}]))/g, Aa = /(\\?)([()[\]{}]|^!|[!+@](?=\())/g, Ra = /^\\\\([.?])/, Ea = /\\(?![!()+@[\]{}])/g;
function wa(r) {
  return r.replace(/\\/g, "/");
}
G.unixify = wa;
function Ta(r, e) {
  return va.resolve(r, e);
}
G.makeAbsolute = Ta;
function ka(r) {
  if (r.charAt(0) === ".") {
    const e = r.charAt(1);
    if (e === "/" || e === "\\")
      return r.slice(Ca);
  }
  return r;
}
G.removeLeadingDotSegment = ka;
G.escape = Un ? Zr : ei;
function Zr(r) {
  return r.replace(Aa, "\\$2");
}
G.escapeWindowsPath = Zr;
function ei(r) {
  return r.replace(Pa, "\\$2");
}
G.escapePosixPath = ei;
G.convertPathToPattern = Un ? Hn : Gn;
function Hn(r) {
  return Zr(r).replace(Ra, "//$1").replace(Ea, "/");
}
G.convertWindowsPathToPattern = Hn;
function Gn(r) {
  return ei(r);
}
G.convertPosixPathToPattern = Gn;
var v = {};
/*!
 * is-extglob <https://github.com/jonschlinkert/is-extglob>
 *
 * Copyright (c) 2014-2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */
var Oa = function(e) {
  if (typeof e != "string" || e === "")
    return !1;
  for (var t; t = /(\\).|([@?!+*]\(.*\))/g.exec(e); ) {
    if (t[2]) return !0;
    e = e.slice(t.index + t[0].length);
  }
  return !1;
};
/*!
 * is-glob <https://github.com/jonschlinkert/is-glob>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */
var xa = Oa, jn = { "{": "}", "(": ")", "[": "]" }, Ia = function(r) {
  if (r[0] === "!")
    return !0;
  for (var e = 0, t = -2, i = -2, n = -2, s = -2, a = -2; e < r.length; ) {
    if (r[e] === "*" || r[e + 1] === "?" && /[\].+)]/.test(r[e]) || i !== -1 && r[e] === "[" && r[e + 1] !== "]" && (i < e && (i = r.indexOf("]", e)), i > e && (a === -1 || a > i || (a = r.indexOf("\\", e), a === -1 || a > i))) || n !== -1 && r[e] === "{" && r[e + 1] !== "}" && (n = r.indexOf("}", e), n > e && (a = r.indexOf("\\", e), a === -1 || a > n)) || s !== -1 && r[e] === "(" && r[e + 1] === "?" && /[:!=]/.test(r[e + 2]) && r[e + 3] !== ")" && (s = r.indexOf(")", e), s > e && (a = r.indexOf("\\", e), a === -1 || a > s)) || t !== -1 && r[e] === "(" && r[e + 1] !== "|" && (t < e && (t = r.indexOf("|", e)), t !== -1 && r[t + 1] !== ")" && (s = r.indexOf(")", t), s > t && (a = r.indexOf("\\", t), a === -1 || a > s))))
      return !0;
    if (r[e] === "\\") {
      var o = r[e + 1];
      e += 2;
      var l = jn[o];
      if (l) {
        var c = r.indexOf(l, e);
        c !== -1 && (e = c + 1);
      }
      if (r[e] === "!")
        return !0;
    } else
      e++;
  }
  return !1;
}, Da = function(r) {
  if (r[0] === "!")
    return !0;
  for (var e = 0; e < r.length; ) {
    if (/[*?{}()[\]]/.test(r[e]))
      return !0;
    if (r[e] === "\\") {
      var t = r[e + 1];
      e += 2;
      var i = jn[t];
      if (i) {
        var n = r.indexOf(i, e);
        n !== -1 && (e = n + 1);
      }
      if (r[e] === "!")
        return !0;
    } else
      e++;
  }
  return !1;
}, La = function(e, t) {
  if (typeof e != "string" || e === "")
    return !1;
  if (xa(e))
    return !0;
  var i = Ia;
  return t && t.strict === !1 && (i = Da), i(e);
}, Ma = La, Fa = _e.posix.dirname, $a = jr.platform() === "win32", hr = "/", Na = /\\/g, Ba = /[\{\[].*[\}\]]$/, Ua = /(^|[^\\])([\{\[]|\([^\)]+$)/, Ha = /\\([\!\*\?\|\[\]\(\)\{\}])/g, Ga = function(e, t) {
  var i = Object.assign({ flipBackslashes: !0 }, t);
  i.flipBackslashes && $a && e.indexOf(hr) < 0 && (e = e.replace(Na, hr)), Ba.test(e) && (e += hr), e += "a";
  do
    e = Fa(e);
  while (Ma(e) || Ua.test(e));
  return e.replace(Ha, "$1");
}, Kt = {};
(function(r) {
  r.isInteger = (e) => typeof e == "number" ? Number.isInteger(e) : typeof e == "string" && e.trim() !== "" ? Number.isInteger(Number(e)) : !1, r.find = (e, t) => e.nodes.find((i) => i.type === t), r.exceedsLimit = (e, t, i = 1, n) => n === !1 || !r.isInteger(e) || !r.isInteger(t) ? !1 : (Number(t) - Number(e)) / Number(i) >= n, r.escapeNode = (e, t = 0, i) => {
    const n = e.nodes[t];
    n && (i && n.type === i || n.type === "open" || n.type === "close") && n.escaped !== !0 && (n.value = "\\" + n.value, n.escaped = !0);
  }, r.encloseBrace = (e) => e.type !== "brace" || e.commas >> 0 + e.ranges >> 0 ? !1 : (e.invalid = !0, !0), r.isInvalidBrace = (e) => e.type !== "brace" ? !1 : e.invalid === !0 || e.dollar ? !0 : !(e.commas >> 0 + e.ranges >> 0) || e.open !== !0 || e.close !== !0 ? (e.invalid = !0, !0) : !1, r.isOpenOrClose = (e) => e.type === "open" || e.type === "close" ? !0 : e.open === !0 || e.close === !0, r.reduce = (e) => e.reduce((t, i) => (i.type === "text" && t.push(i.value), i.type === "range" && (i.type = "text"), t), []), r.flatten = (...e) => {
    const t = [], i = (n) => {
      for (let s = 0; s < n.length; s++) {
        const a = n[s];
        if (Array.isArray(a)) {
          i(a);
          continue;
        }
        a !== void 0 && t.push(a);
      }
      return t;
    };
    return i(e), t;
  };
})(Kt);
const Ki = Kt;
var ti = (r, e = {}) => {
  const t = (i, n = {}) => {
    const s = e.escapeInvalid && Ki.isInvalidBrace(n), a = i.invalid === !0 && e.escapeInvalid === !0;
    let o = "";
    if (i.value)
      return (s || a) && Ki.isOpenOrClose(i) ? "\\" + i.value : i.value;
    if (i.value)
      return i.value;
    if (i.nodes)
      for (const l of i.nodes)
        o += t(l);
    return o;
  };
  return t(r);
};
/*!
 * is-number <https://github.com/jonschlinkert/is-number>
 *
 * Copyright (c) 2014-present, Jon Schlinkert.
 * Released under the MIT License.
 */
var ja = function(r) {
  return typeof r == "number" ? r - r === 0 : typeof r == "string" && r.trim() !== "" ? Number.isFinite ? Number.isFinite(+r) : isFinite(+r) : !1;
};
/*!
 * to-regex-range <https://github.com/micromatch/to-regex-range>
 *
 * Copyright (c) 2015-present, Jon Schlinkert.
 * Released under the MIT License.
 */
const Xi = ja, He = (r, e, t) => {
  if (Xi(r) === !1)
    throw new TypeError("toRegexRange: expected the first argument to be a number");
  if (e === void 0 || r === e)
    return String(r);
  if (Xi(e) === !1)
    throw new TypeError("toRegexRange: expected the second argument to be a number.");
  let i = { relaxZeros: !0, ...t };
  typeof i.strictZeros == "boolean" && (i.relaxZeros = i.strictZeros === !1);
  let n = String(i.relaxZeros), s = String(i.shorthand), a = String(i.capture), o = String(i.wrap), l = r + ":" + e + "=" + n + s + a + o;
  if (He.cache.hasOwnProperty(l))
    return He.cache[l].result;
  let c = Math.min(r, e), u = Math.max(r, e);
  if (Math.abs(c - u) === 1) {
    let S = r + "|" + e;
    return i.capture ? `(${S})` : i.wrap === !1 ? S : `(?:${S})`;
  }
  let p = en(r) || en(e), f = { min: r, max: e, a: c, b: u }, C = [], m = [];
  if (p && (f.isPadded = p, f.maxLen = String(f.max).length), c < 0) {
    let S = u < 0 ? Math.abs(u) : 1;
    m = qi(S, Math.abs(c), f, i), c = f.a = 0;
  }
  return u >= 0 && (C = qi(c, u, f, i)), f.negatives = m, f.positives = C, f.result = Va(m, C), i.capture === !0 ? f.result = `(${f.result})` : i.wrap !== !1 && C.length + m.length > 1 && (f.result = `(?:${f.result})`), He.cache[l] = f, f.result;
};
function Va(r, e, t) {
  let i = dr(r, e, "-", !1) || [], n = dr(e, r, "", !1) || [], s = dr(r, e, "-?", !0) || [];
  return i.concat(s).concat(n).join("|");
}
function Wa(r, e) {
  let t = 1, i = 1, n = Qi(r, t), s = /* @__PURE__ */ new Set([e]);
  for (; r <= n && n <= e; )
    s.add(n), t += 1, n = Qi(r, t);
  for (n = Ji(e + 1, i) - 1; r < n && n <= e; )
    s.add(n), i += 1, n = Ji(e + 1, i) - 1;
  return s = [...s], s.sort(Xa), s;
}
function za(r, e, t) {
  if (r === e)
    return { pattern: r, count: [], digits: 0 };
  let i = Ka(r, e), n = i.length, s = "", a = 0;
  for (let o = 0; o < n; o++) {
    let [l, c] = i[o];
    l === c ? s += l : l !== "0" || c !== "9" ? s += qa(l, c) : a++;
  }
  return a && (s += t.shorthand === !0 ? "\\d" : "[0-9]"), { pattern: s, count: [a], digits: n };
}
function qi(r, e, t, i) {
  let n = Wa(r, e), s = [], a = r, o;
  for (let l = 0; l < n.length; l++) {
    let c = n[l], u = za(String(a), String(c), i), p = "";
    if (!t.isPadded && o && o.pattern === u.pattern) {
      o.count.length > 1 && o.count.pop(), o.count.push(u.count[0]), o.string = o.pattern + Zi(o.count), a = c + 1;
      continue;
    }
    t.isPadded && (p = Ya(c, t, i)), u.string = p + u.pattern + Zi(u.count), s.push(u), a = c + 1, o = u;
  }
  return s;
}
function dr(r, e, t, i, n) {
  let s = [];
  for (let a of r) {
    let { string: o } = a;
    !i && !Yi(e, "string", o) && s.push(t + o), i && Yi(e, "string", o) && s.push(t + o);
  }
  return s;
}
function Ka(r, e) {
  let t = [];
  for (let i = 0; i < r.length; i++) t.push([r[i], e[i]]);
  return t;
}
function Xa(r, e) {
  return r > e ? 1 : e > r ? -1 : 0;
}
function Yi(r, e, t) {
  return r.some((i) => i[e] === t);
}
function Qi(r, e) {
  return Number(String(r).slice(0, -e) + "9".repeat(e));
}
function Ji(r, e) {
  return r - r % Math.pow(10, e);
}
function Zi(r) {
  let [e = 0, t = ""] = r;
  return t || e > 1 ? `{${e + (t ? "," + t : "")}}` : "";
}
function qa(r, e, t) {
  return `[${r}${e - r === 1 ? "" : "-"}${e}]`;
}
function en(r) {
  return /^-?(0+)\d/.test(r);
}
function Ya(r, e, t) {
  if (!e.isPadded)
    return r;
  let i = Math.abs(e.maxLen - String(r).length), n = t.relaxZeros !== !1;
  switch (i) {
    case 0:
      return "";
    case 1:
      return n ? "0?" : "0";
    case 2:
      return n ? "0{0,2}" : "00";
    default:
      return n ? `0{0,${i}}` : `0{${i}}`;
  }
}
He.cache = {};
He.clearCache = () => He.cache = {};
var Qa = He;
/*!
 * fill-range <https://github.com/jonschlinkert/fill-range>
 *
 * Copyright (c) 2014-present, Jon Schlinkert.
 * Licensed under the MIT License.
 */
const Ja = En, Vn = Qa, tn = (r) => r !== null && typeof r == "object" && !Array.isArray(r), Za = (r) => (e) => r === !0 ? Number(e) : String(e), pr = (r) => typeof r == "number" || typeof r == "string" && r !== "", at = (r) => Number.isInteger(+r), gr = (r) => {
  let e = `${r}`, t = -1;
  if (e[0] === "-" && (e = e.slice(1)), e === "0") return !1;
  for (; e[++t] === "0"; ) ;
  return t > 0;
}, eo = (r, e, t) => typeof r == "string" || typeof e == "string" ? !0 : t.stringify === !0, to = (r, e, t) => {
  if (e > 0) {
    let i = r[0] === "-" ? "-" : "";
    i && (r = r.slice(1)), r = i + r.padStart(i ? e - 1 : e, "0");
  }
  return t === !1 ? String(r) : r;
}, It = (r, e) => {
  let t = r[0] === "-" ? "-" : "";
  for (t && (r = r.slice(1), e--); r.length < e; ) r = "0" + r;
  return t ? "-" + r : r;
}, ro = (r, e, t) => {
  r.negatives.sort((o, l) => o < l ? -1 : o > l ? 1 : 0), r.positives.sort((o, l) => o < l ? -1 : o > l ? 1 : 0);
  let i = e.capture ? "" : "?:", n = "", s = "", a;
  return r.positives.length && (n = r.positives.map((o) => It(String(o), t)).join("|")), r.negatives.length && (s = `-(${i}${r.negatives.map((o) => It(String(o), t)).join("|")})`), n && s ? a = `${n}|${s}` : a = n || s, e.wrap ? `(${i}${a})` : a;
}, Wn = (r, e, t, i) => {
  if (t)
    return Vn(r, e, { wrap: !1, ...i });
  let n = String.fromCharCode(r);
  if (r === e) return n;
  let s = String.fromCharCode(e);
  return `[${n}-${s}]`;
}, zn = (r, e, t) => {
  if (Array.isArray(r)) {
    let i = t.wrap === !0, n = t.capture ? "" : "?:";
    return i ? `(${n}${r.join("|")})` : r.join("|");
  }
  return Vn(r, e, t);
}, Kn = (...r) => new RangeError("Invalid range arguments: " + Ja.inspect(...r)), Xn = (r, e, t) => {
  if (t.strictRanges === !0) throw Kn([r, e]);
  return [];
}, io = (r, e) => {
  if (e.strictRanges === !0)
    throw new TypeError(`Expected step "${r}" to be a number`);
  return [];
}, no = (r, e, t = 1, i = {}) => {
  let n = Number(r), s = Number(e);
  if (!Number.isInteger(n) || !Number.isInteger(s)) {
    if (i.strictRanges === !0) throw Kn([r, e]);
    return [];
  }
  n === 0 && (n = 0), s === 0 && (s = 0);
  let a = n > s, o = String(r), l = String(e), c = String(t);
  t = Math.max(Math.abs(t), 1);
  let u = gr(o) || gr(l) || gr(c), p = u ? Math.max(o.length, l.length, c.length) : 0, f = u === !1 && eo(r, e, i) === !1, C = i.transform || Za(f);
  if (i.toRegex && t === 1)
    return Wn(It(r, p), It(e, p), !0, i);
  let m = { negatives: [], positives: [] }, S = (q) => m[q < 0 ? "negatives" : "positives"].push(Math.abs(q)), w = [], k = 0;
  for (; a ? n >= s : n <= s; )
    i.toRegex === !0 && t > 1 ? S(n) : w.push(to(C(n, k), p, f)), n = a ? n - t : n + t, k++;
  return i.toRegex === !0 ? t > 1 ? ro(m, i, p) : zn(w, null, { wrap: !1, ...i }) : w;
}, so = (r, e, t = 1, i = {}) => {
  if (!at(r) && r.length > 1 || !at(e) && e.length > 1)
    return Xn(r, e, i);
  let n = i.transform || ((f) => String.fromCharCode(f)), s = `${r}`.charCodeAt(0), a = `${e}`.charCodeAt(0), o = s > a, l = Math.min(s, a), c = Math.max(s, a);
  if (i.toRegex && t === 1)
    return Wn(l, c, !1, i);
  let u = [], p = 0;
  for (; o ? s >= a : s <= a; )
    u.push(n(s, p)), s = o ? s - t : s + t, p++;
  return i.toRegex === !0 ? zn(u, null, { wrap: !1, options: i }) : u;
}, Rt = (r, e, t, i = {}) => {
  if (e == null && pr(r))
    return [r];
  if (!pr(r) || !pr(e))
    return Xn(r, e, i);
  if (typeof t == "function")
    return Rt(r, e, 1, { transform: t });
  if (tn(t))
    return Rt(r, e, 0, t);
  let n = { ...i };
  return n.capture === !0 && (n.wrap = !0), t = t || n.step || 1, at(t) ? at(r) && at(e) ? no(r, e, t, n) : so(r, e, Math.max(Math.abs(t), 1), n) : t != null && !tn(t) ? io(t, n) : Rt(r, e, 1, t);
};
var qn = Rt;
const ao = qn, rn = Kt, oo = (r, e = {}) => {
  const t = (i, n = {}) => {
    const s = rn.isInvalidBrace(n), a = i.invalid === !0 && e.escapeInvalid === !0, o = s === !0 || a === !0, l = e.escapeInvalid === !0 ? "\\" : "";
    let c = "";
    if (i.isOpen === !0)
      return l + i.value;
    if (i.isClose === !0)
      return console.log("node.isClose", l, i.value), l + i.value;
    if (i.type === "open")
      return o ? l + i.value : "(";
    if (i.type === "close")
      return o ? l + i.value : ")";
    if (i.type === "comma")
      return i.prev.type === "comma" ? "" : o ? i.value : "|";
    if (i.value)
      return i.value;
    if (i.nodes && i.ranges > 0) {
      const u = rn.reduce(i.nodes), p = ao(...u, { ...e, wrap: !1, toRegex: !0, strictZeros: !0 });
      if (p.length !== 0)
        return u.length > 1 && p.length > 1 ? `(${p})` : p;
    }
    if (i.nodes)
      for (const u of i.nodes)
        c += t(u, i);
    return c;
  };
  return t(r);
};
var lo = oo;
const uo = qn, nn = ti, qe = Kt, $e = (r = "", e = "", t = !1) => {
  const i = [];
  if (r = [].concat(r), e = [].concat(e), !e.length) return r;
  if (!r.length)
    return t ? qe.flatten(e).map((n) => `{${n}}`) : e;
  for (const n of r)
    if (Array.isArray(n))
      for (const s of n)
        i.push($e(s, e, t));
    else
      for (let s of e)
        t === !0 && typeof s == "string" && (s = `{${s}}`), i.push(Array.isArray(s) ? $e(n, s, t) : n + s);
  return qe.flatten(i);
}, co = (r, e = {}) => {
  const t = e.rangeLimit === void 0 ? 1e3 : e.rangeLimit, i = (n, s = {}) => {
    n.queue = [];
    let a = s, o = s.queue;
    for (; a.type !== "brace" && a.type !== "root" && a.parent; )
      a = a.parent, o = a.queue;
    if (n.invalid || n.dollar) {
      o.push($e(o.pop(), nn(n, e)));
      return;
    }
    if (n.type === "brace" && n.invalid !== !0 && n.nodes.length === 2) {
      o.push($e(o.pop(), ["{}"]));
      return;
    }
    if (n.nodes && n.ranges > 0) {
      const p = qe.reduce(n.nodes);
      if (qe.exceedsLimit(...p, e.step, t))
        throw new RangeError("expanded array length exceeds range limit. Use options.rangeLimit to increase or disable the limit.");
      let f = uo(...p, e);
      f.length === 0 && (f = nn(n, e)), o.push($e(o.pop(), f)), n.nodes = [];
      return;
    }
    const l = qe.encloseBrace(n);
    let c = n.queue, u = n;
    for (; u.type !== "brace" && u.type !== "root" && u.parent; )
      u = u.parent, c = u.queue;
    for (let p = 0; p < n.nodes.length; p++) {
      const f = n.nodes[p];
      if (f.type === "comma" && n.type === "brace") {
        p === 1 && c.push(""), c.push("");
        continue;
      }
      if (f.type === "close") {
        o.push($e(o.pop(), c, l));
        continue;
      }
      if (f.value && f.type !== "open") {
        c.push($e(c.pop(), f.value));
        continue;
      }
      f.nodes && i(f, n);
    }
    return c;
  };
  return qe.flatten(i(r));
};
var fo = co, ho = {
  MAX_LENGTH: 1e4,
  CHAR_LEFT_PARENTHESES: "(",
  /* ( */
  CHAR_RIGHT_PARENTHESES: ")",
  /* ) */
  CHAR_BACKSLASH: "\\",
  /* \ */
  CHAR_BACKTICK: "`",
  /* ` */
  CHAR_COMMA: ",",
  /* , */
  CHAR_DOT: ".",
  /* . */
  CHAR_DOUBLE_QUOTE: '"',
  /* " */
  CHAR_LEFT_CURLY_BRACE: "{",
  /* { */
  CHAR_LEFT_SQUARE_BRACKET: "[",
  /* [ */
  CHAR_NO_BREAK_SPACE: " ",
  /* \u00A0 */
  CHAR_RIGHT_CURLY_BRACE: "}",
  /* } */
  CHAR_RIGHT_SQUARE_BRACKET: "]",
  /* ] */
  CHAR_SINGLE_QUOTE: "'",
  /* ' */
  CHAR_ZERO_WIDTH_NOBREAK_SPACE: "\uFEFF"
  /* \uFEFF */
};
const po = ti, {
  MAX_LENGTH: sn,
  CHAR_BACKSLASH: mr,
  /* \ */
  CHAR_BACKTICK: go,
  /* ` */
  CHAR_COMMA: mo,
  /* , */
  CHAR_DOT: yo,
  /* . */
  CHAR_LEFT_PARENTHESES: So,
  /* ( */
  CHAR_RIGHT_PARENTHESES: _o,
  /* ) */
  CHAR_LEFT_CURLY_BRACE: bo,
  /* { */
  CHAR_RIGHT_CURLY_BRACE: vo,
  /* } */
  CHAR_LEFT_SQUARE_BRACKET: an,
  /* [ */
  CHAR_RIGHT_SQUARE_BRACKET: on,
  /* ] */
  CHAR_DOUBLE_QUOTE: Co,
  /* " */
  CHAR_SINGLE_QUOTE: Po,
  /* ' */
  CHAR_NO_BREAK_SPACE: Ao,
  CHAR_ZERO_WIDTH_NOBREAK_SPACE: Ro
} = ho, Eo = (r, e = {}) => {
  if (typeof r != "string")
    throw new TypeError("Expected a string");
  const t = e || {}, i = typeof t.maxLength == "number" ? Math.min(sn, t.maxLength) : sn;
  if (r.length > i)
    throw new SyntaxError(`Input length (${r.length}), exceeds max characters (${i})`);
  const n = { type: "root", input: r, nodes: [] }, s = [n];
  let a = n, o = n, l = 0;
  const c = r.length;
  let u = 0, p = 0, f;
  const C = () => r[u++], m = (S) => {
    if (S.type === "text" && o.type === "dot" && (o.type = "text"), o && o.type === "text" && S.type === "text") {
      o.value += S.value;
      return;
    }
    return a.nodes.push(S), S.parent = a, S.prev = o, o = S, S;
  };
  for (m({ type: "bos" }); u < c; )
    if (a = s[s.length - 1], f = C(), !(f === Ro || f === Ao)) {
      if (f === mr) {
        m({ type: "text", value: (e.keepEscaping ? f : "") + C() });
        continue;
      }
      if (f === on) {
        m({ type: "text", value: "\\" + f });
        continue;
      }
      if (f === an) {
        l++;
        let S;
        for (; u < c && (S = C()); ) {
          if (f += S, S === an) {
            l++;
            continue;
          }
          if (S === mr) {
            f += C();
            continue;
          }
          if (S === on && (l--, l === 0))
            break;
        }
        m({ type: "text", value: f });
        continue;
      }
      if (f === So) {
        a = m({ type: "paren", nodes: [] }), s.push(a), m({ type: "text", value: f });
        continue;
      }
      if (f === _o) {
        if (a.type !== "paren") {
          m({ type: "text", value: f });
          continue;
        }
        a = s.pop(), m({ type: "text", value: f }), a = s[s.length - 1];
        continue;
      }
      if (f === Co || f === Po || f === go) {
        const S = f;
        let w;
        for (e.keepQuotes !== !0 && (f = ""); u < c && (w = C()); ) {
          if (w === mr) {
            f += w + C();
            continue;
          }
          if (w === S) {
            e.keepQuotes === !0 && (f += w);
            break;
          }
          f += w;
        }
        m({ type: "text", value: f });
        continue;
      }
      if (f === bo) {
        p++;
        const w = {
          type: "brace",
          open: !0,
          close: !1,
          dollar: o.value && o.value.slice(-1) === "$" || a.dollar === !0,
          depth: p,
          commas: 0,
          ranges: 0,
          nodes: []
        };
        a = m(w), s.push(a), m({ type: "open", value: f });
        continue;
      }
      if (f === vo) {
        if (a.type !== "brace") {
          m({ type: "text", value: f });
          continue;
        }
        const S = "close";
        a = s.pop(), a.close = !0, m({ type: S, value: f }), p--, a = s[s.length - 1];
        continue;
      }
      if (f === mo && p > 0) {
        if (a.ranges > 0) {
          a.ranges = 0;
          const S = a.nodes.shift();
          a.nodes = [S, { type: "text", value: po(a) }];
        }
        m({ type: "comma", value: f }), a.commas++;
        continue;
      }
      if (f === yo && p > 0 && a.commas === 0) {
        const S = a.nodes;
        if (p === 0 || S.length === 0) {
          m({ type: "text", value: f });
          continue;
        }
        if (o.type === "dot") {
          if (a.range = [], o.value += f, o.type = "range", a.nodes.length !== 3 && a.nodes.length !== 5) {
            a.invalid = !0, a.ranges = 0, o.type = "text";
            continue;
          }
          a.ranges++, a.args = [];
          continue;
        }
        if (o.type === "range") {
          S.pop();
          const w = S[S.length - 1];
          w.value += o.value + f, o = w, a.ranges--;
          continue;
        }
        m({ type: "dot", value: f });
        continue;
      }
      m({ type: "text", value: f });
    }
  do
    if (a = s.pop(), a.type !== "root") {
      a.nodes.forEach((k) => {
        k.nodes || (k.type === "open" && (k.isOpen = !0), k.type === "close" && (k.isClose = !0), k.nodes || (k.type = "text"), k.invalid = !0);
      });
      const S = s[s.length - 1], w = S.nodes.indexOf(a);
      S.nodes.splice(w, 1, ...a.nodes);
    }
  while (s.length > 0);
  return m({ type: "eos" }), n;
};
var wo = Eo;
const ln = ti, To = lo, ko = fo, Oo = wo, ne = (r, e = {}) => {
  let t = [];
  if (Array.isArray(r))
    for (const i of r) {
      const n = ne.create(i, e);
      Array.isArray(n) ? t.push(...n) : t.push(n);
    }
  else
    t = [].concat(ne.create(r, e));
  return e && e.expand === !0 && e.nodupes === !0 && (t = [...new Set(t)]), t;
};
ne.parse = (r, e = {}) => Oo(r, e);
ne.stringify = (r, e = {}) => ln(typeof r == "string" ? ne.parse(r, e) : r, e);
ne.compile = (r, e = {}) => (typeof r == "string" && (r = ne.parse(r, e)), To(r, e));
ne.expand = (r, e = {}) => {
  typeof r == "string" && (r = ne.parse(r, e));
  let t = ko(r, e);
  return e.noempty === !0 && (t = t.filter(Boolean)), e.nodupes === !0 && (t = [...new Set(t)]), t;
};
ne.create = (r, e = {}) => r === "" || r.length < 3 ? [r] : e.expand !== !0 ? ne.compile(r, e) : ne.expand(r, e);
var xo = ne, lt = {};
const Io = _e, me = "\\\\/", un = `[^${me}]`, Pe = "\\.", Do = "\\+", Lo = "\\?", Xt = "\\/", Mo = "(?=.)", Yn = "[^/]", ri = `(?:${Xt}|$)`, Qn = `(?:^|${Xt})`, ii = `${Pe}{1,2}${ri}`, Fo = `(?!${Pe})`, $o = `(?!${Qn}${ii})`, No = `(?!${Pe}{0,1}${ri})`, Bo = `(?!${ii})`, Uo = `[^.${Xt}]`, Ho = `${Yn}*?`, Jn = {
  DOT_LITERAL: Pe,
  PLUS_LITERAL: Do,
  QMARK_LITERAL: Lo,
  SLASH_LITERAL: Xt,
  ONE_CHAR: Mo,
  QMARK: Yn,
  END_ANCHOR: ri,
  DOTS_SLASH: ii,
  NO_DOT: Fo,
  NO_DOTS: $o,
  NO_DOT_SLASH: No,
  NO_DOTS_SLASH: Bo,
  QMARK_NO_DOT: Uo,
  STAR: Ho,
  START_ANCHOR: Qn
}, Go = {
  ...Jn,
  SLASH_LITERAL: `[${me}]`,
  QMARK: un,
  STAR: `${un}*?`,
  DOTS_SLASH: `${Pe}{1,2}(?:[${me}]|$)`,
  NO_DOT: `(?!${Pe})`,
  NO_DOTS: `(?!(?:^|[${me}])${Pe}{1,2}(?:[${me}]|$))`,
  NO_DOT_SLASH: `(?!${Pe}{0,1}(?:[${me}]|$))`,
  NO_DOTS_SLASH: `(?!${Pe}{1,2}(?:[${me}]|$))`,
  QMARK_NO_DOT: `[^.${me}]`,
  START_ANCHOR: `(?:^|[${me}])`,
  END_ANCHOR: `(?:[${me}]|$)`
}, jo = {
  alnum: "a-zA-Z0-9",
  alpha: "a-zA-Z",
  ascii: "\\x00-\\x7F",
  blank: " \\t",
  cntrl: "\\x00-\\x1F\\x7F",
  digit: "0-9",
  graph: "\\x21-\\x7E",
  lower: "a-z",
  print: "\\x20-\\x7E ",
  punct: "\\-!\"#$%&'()\\*+,./:;<=>?@[\\]^_`{|}~",
  space: " \\t\\r\\n\\v\\f",
  upper: "A-Z",
  word: "A-Za-z0-9_",
  xdigit: "A-Fa-f0-9"
};
var qt = {
  MAX_LENGTH: 1024 * 64,
  POSIX_REGEX_SOURCE: jo,
  // regular expressions
  REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
  REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
  REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
  REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
  REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
  REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,
  // Replace globs with equivalent patterns to reduce parsing time.
  REPLACEMENTS: {
    "***": "*",
    "**/**": "**",
    "**/**/**": "**"
  },
  // Digits
  CHAR_0: 48,
  /* 0 */
  CHAR_9: 57,
  /* 9 */
  // Alphabet chars.
  CHAR_UPPERCASE_A: 65,
  /* A */
  CHAR_LOWERCASE_A: 97,
  /* a */
  CHAR_UPPERCASE_Z: 90,
  /* Z */
  CHAR_LOWERCASE_Z: 122,
  /* z */
  CHAR_LEFT_PARENTHESES: 40,
  /* ( */
  CHAR_RIGHT_PARENTHESES: 41,
  /* ) */
  CHAR_ASTERISK: 42,
  /* * */
  // Non-alphabetic chars.
  CHAR_AMPERSAND: 38,
  /* & */
  CHAR_AT: 64,
  /* @ */
  CHAR_BACKWARD_SLASH: 92,
  /* \ */
  CHAR_CARRIAGE_RETURN: 13,
  /* \r */
  CHAR_CIRCUMFLEX_ACCENT: 94,
  /* ^ */
  CHAR_COLON: 58,
  /* : */
  CHAR_COMMA: 44,
  /* , */
  CHAR_DOT: 46,
  /* . */
  CHAR_DOUBLE_QUOTE: 34,
  /* " */
  CHAR_EQUAL: 61,
  /* = */
  CHAR_EXCLAMATION_MARK: 33,
  /* ! */
  CHAR_FORM_FEED: 12,
  /* \f */
  CHAR_FORWARD_SLASH: 47,
  /* / */
  CHAR_GRAVE_ACCENT: 96,
  /* ` */
  CHAR_HASH: 35,
  /* # */
  CHAR_HYPHEN_MINUS: 45,
  /* - */
  CHAR_LEFT_ANGLE_BRACKET: 60,
  /* < */
  CHAR_LEFT_CURLY_BRACE: 123,
  /* { */
  CHAR_LEFT_SQUARE_BRACKET: 91,
  /* [ */
  CHAR_LINE_FEED: 10,
  /* \n */
  CHAR_NO_BREAK_SPACE: 160,
  /* \u00A0 */
  CHAR_PERCENT: 37,
  /* % */
  CHAR_PLUS: 43,
  /* + */
  CHAR_QUESTION_MARK: 63,
  /* ? */
  CHAR_RIGHT_ANGLE_BRACKET: 62,
  /* > */
  CHAR_RIGHT_CURLY_BRACE: 125,
  /* } */
  CHAR_RIGHT_SQUARE_BRACKET: 93,
  /* ] */
  CHAR_SEMICOLON: 59,
  /* ; */
  CHAR_SINGLE_QUOTE: 39,
  /* ' */
  CHAR_SPACE: 32,
  /*   */
  CHAR_TAB: 9,
  /* \t */
  CHAR_UNDERSCORE: 95,
  /* _ */
  CHAR_VERTICAL_LINE: 124,
  /* | */
  CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279,
  /* \uFEFF */
  SEP: Io.sep,
  /**
   * Create EXTGLOB_CHARS
   */
  extglobChars(r) {
    return {
      "!": { type: "negate", open: "(?:(?!(?:", close: `))${r.STAR})` },
      "?": { type: "qmark", open: "(?:", close: ")?" },
      "+": { type: "plus", open: "(?:", close: ")+" },
      "*": { type: "star", open: "(?:", close: ")*" },
      "@": { type: "at", open: "(?:", close: ")" }
    };
  },
  /**
   * Create GLOB_CHARS
   */
  globChars(r) {
    return r === !0 ? Go : Jn;
  }
};
(function(r) {
  const e = _e, t = process.platform === "win32", {
    REGEX_BACKSLASH: i,
    REGEX_REMOVE_BACKSLASH: n,
    REGEX_SPECIAL_CHARS: s,
    REGEX_SPECIAL_CHARS_GLOBAL: a
  } = qt;
  r.isObject = (o) => o !== null && typeof o == "object" && !Array.isArray(o), r.hasRegexChars = (o) => s.test(o), r.isRegexChar = (o) => o.length === 1 && r.hasRegexChars(o), r.escapeRegex = (o) => o.replace(a, "\\$1"), r.toPosixSlashes = (o) => o.replace(i, "/"), r.removeBackslashes = (o) => o.replace(n, (l) => l === "\\" ? "" : l), r.supportsLookbehinds = () => {
    const o = process.version.slice(1).split(".").map(Number);
    return o.length === 3 && o[0] >= 9 || o[0] === 8 && o[1] >= 10;
  }, r.isWindows = (o) => o && typeof o.windows == "boolean" ? o.windows : t === !0 || e.sep === "\\", r.escapeLast = (o, l, c) => {
    const u = o.lastIndexOf(l, c);
    return u === -1 ? o : o[u - 1] === "\\" ? r.escapeLast(o, l, u - 1) : `${o.slice(0, u)}\\${o.slice(u)}`;
  }, r.removePrefix = (o, l = {}) => {
    let c = o;
    return c.startsWith("./") && (c = c.slice(2), l.prefix = "./"), c;
  }, r.wrapOutput = (o, l = {}, c = {}) => {
    const u = c.contains ? "" : "^", p = c.contains ? "" : "$";
    let f = `${u}(?:${o})${p}`;
    return l.negated === !0 && (f = `(?:^(?!${f}).*$)`), f;
  };
})(lt);
const cn = lt, {
  CHAR_ASTERISK: yr,
  /* * */
  CHAR_AT: Vo,
  /* @ */
  CHAR_BACKWARD_SLASH: nt,
  /* \ */
  CHAR_COMMA: Wo,
  /* , */
  CHAR_DOT: Sr,
  /* . */
  CHAR_EXCLAMATION_MARK: _r,
  /* ! */
  CHAR_FORWARD_SLASH: Zn,
  /* / */
  CHAR_LEFT_CURLY_BRACE: br,
  /* { */
  CHAR_LEFT_PARENTHESES: vr,
  /* ( */
  CHAR_LEFT_SQUARE_BRACKET: zo,
  /* [ */
  CHAR_PLUS: Ko,
  /* + */
  CHAR_QUESTION_MARK: fn,
  /* ? */
  CHAR_RIGHT_CURLY_BRACE: Xo,
  /* } */
  CHAR_RIGHT_PARENTHESES: hn,
  /* ) */
  CHAR_RIGHT_SQUARE_BRACKET: qo
  /* ] */
} = qt, dn = (r) => r === Zn || r === nt, pn = (r) => {
  r.isPrefix !== !0 && (r.depth = r.isGlobstar ? 1 / 0 : 1);
}, Yo = (r, e) => {
  const t = e || {}, i = r.length - 1, n = t.parts === !0 || t.scanToEnd === !0, s = [], a = [], o = [];
  let l = r, c = -1, u = 0, p = 0, f = !1, C = !1, m = !1, S = !1, w = !1, k = !1, q = !1, M = !1, ae = !1, K = !1, A = 0, T, _, O = { value: "", depth: 0, isGlob: !1 };
  const W = () => c >= i, g = () => l.charCodeAt(c + 1), F = () => (T = _, l.charCodeAt(++c));
  for (; c < i; ) {
    _ = F();
    let Q;
    if (_ === nt) {
      q = O.backslashes = !0, _ = F(), _ === br && (k = !0);
      continue;
    }
    if (k === !0 || _ === br) {
      for (A++; W() !== !0 && (_ = F()); ) {
        if (_ === nt) {
          q = O.backslashes = !0, F();
          continue;
        }
        if (_ === br) {
          A++;
          continue;
        }
        if (k !== !0 && _ === Sr && (_ = F()) === Sr) {
          if (f = O.isBrace = !0, m = O.isGlob = !0, K = !0, n === !0)
            continue;
          break;
        }
        if (k !== !0 && _ === Wo) {
          if (f = O.isBrace = !0, m = O.isGlob = !0, K = !0, n === !0)
            continue;
          break;
        }
        if (_ === Xo && (A--, A === 0)) {
          k = !1, f = O.isBrace = !0, K = !0;
          break;
        }
      }
      if (n === !0)
        continue;
      break;
    }
    if (_ === Zn) {
      if (s.push(c), a.push(O), O = { value: "", depth: 0, isGlob: !1 }, K === !0) continue;
      if (T === Sr && c === u + 1) {
        u += 2;
        continue;
      }
      p = c + 1;
      continue;
    }
    if (t.noext !== !0 && (_ === Ko || _ === Vo || _ === yr || _ === fn || _ === _r) === !0 && g() === vr) {
      if (m = O.isGlob = !0, S = O.isExtglob = !0, K = !0, _ === _r && c === u && (ae = !0), n === !0) {
        for (; W() !== !0 && (_ = F()); ) {
          if (_ === nt) {
            q = O.backslashes = !0, _ = F();
            continue;
          }
          if (_ === hn) {
            m = O.isGlob = !0, K = !0;
            break;
          }
        }
        continue;
      }
      break;
    }
    if (_ === yr) {
      if (T === yr && (w = O.isGlobstar = !0), m = O.isGlob = !0, K = !0, n === !0)
        continue;
      break;
    }
    if (_ === fn) {
      if (m = O.isGlob = !0, K = !0, n === !0)
        continue;
      break;
    }
    if (_ === zo) {
      for (; W() !== !0 && (Q = F()); ) {
        if (Q === nt) {
          q = O.backslashes = !0, F();
          continue;
        }
        if (Q === qo) {
          C = O.isBracket = !0, m = O.isGlob = !0, K = !0;
          break;
        }
      }
      if (n === !0)
        continue;
      break;
    }
    if (t.nonegate !== !0 && _ === _r && c === u) {
      M = O.negated = !0, u++;
      continue;
    }
    if (t.noparen !== !0 && _ === vr) {
      if (m = O.isGlob = !0, n === !0) {
        for (; W() !== !0 && (_ = F()); ) {
          if (_ === vr) {
            q = O.backslashes = !0, _ = F();
            continue;
          }
          if (_ === hn) {
            K = !0;
            break;
          }
        }
        continue;
      }
      break;
    }
    if (m === !0) {
      if (K = !0, n === !0)
        continue;
      break;
    }
  }
  t.noext === !0 && (S = !1, m = !1);
  let I = l, Re = "", h = "";
  u > 0 && (Re = l.slice(0, u), l = l.slice(u), p -= u), I && m === !0 && p > 0 ? (I = l.slice(0, p), h = l.slice(p)) : m === !0 ? (I = "", h = l) : I = l, I && I !== "" && I !== "/" && I !== l && dn(I.charCodeAt(I.length - 1)) && (I = I.slice(0, -1)), t.unescape === !0 && (h && (h = cn.removeBackslashes(h)), I && q === !0 && (I = cn.removeBackslashes(I)));
  const d = {
    prefix: Re,
    input: r,
    start: u,
    base: I,
    glob: h,
    isBrace: f,
    isBracket: C,
    isGlob: m,
    isExtglob: S,
    isGlobstar: w,
    negated: M,
    negatedExtglob: ae
  };
  if (t.tokens === !0 && (d.maxDepth = 0, dn(_) || a.push(O), d.tokens = a), t.parts === !0 || t.tokens === !0) {
    let Q;
    for (let x = 0; x < s.length; x++) {
      const pe = Q ? Q + 1 : u, ge = s[x], re = r.slice(pe, ge);
      t.tokens && (x === 0 && u !== 0 ? (a[x].isPrefix = !0, a[x].value = Re) : a[x].value = re, pn(a[x]), d.maxDepth += a[x].depth), (x !== 0 || re !== "") && o.push(re), Q = ge;
    }
    if (Q && Q + 1 < r.length) {
      const x = r.slice(Q + 1);
      o.push(x), t.tokens && (a[a.length - 1].value = x, pn(a[a.length - 1]), d.maxDepth += a[a.length - 1].depth);
    }
    d.slashes = s, d.parts = o;
  }
  return d;
};
var Qo = Yo;
const Dt = qt, ie = lt, {
  MAX_LENGTH: Lt,
  POSIX_REGEX_SOURCE: Jo,
  REGEX_NON_SPECIAL_CHARS: Zo,
  REGEX_SPECIAL_CHARS_BACKREF: el,
  REPLACEMENTS: es
} = Dt, tl = (r, e) => {
  if (typeof e.expandRange == "function")
    return e.expandRange(...r, e);
  r.sort();
  const t = `[${r.join("-")}]`;
  try {
    new RegExp(t);
  } catch {
    return r.map((n) => ie.escapeRegex(n)).join("..");
  }
  return t;
}, Xe = (r, e) => `Missing ${r}: "${e}" - use "\\\\${e}" to match literal characters`, ni = (r, e) => {
  if (typeof r != "string")
    throw new TypeError("Expected a string");
  r = es[r] || r;
  const t = { ...e }, i = typeof t.maxLength == "number" ? Math.min(Lt, t.maxLength) : Lt;
  let n = r.length;
  if (n > i)
    throw new SyntaxError(`Input length: ${n}, exceeds maximum allowed length: ${i}`);
  const s = { type: "bos", value: "", output: t.prepend || "" }, a = [s], o = t.capture ? "" : "?:", l = ie.isWindows(e), c = Dt.globChars(l), u = Dt.extglobChars(c), {
    DOT_LITERAL: p,
    PLUS_LITERAL: f,
    SLASH_LITERAL: C,
    ONE_CHAR: m,
    DOTS_SLASH: S,
    NO_DOT: w,
    NO_DOT_SLASH: k,
    NO_DOTS_SLASH: q,
    QMARK: M,
    QMARK_NO_DOT: ae,
    STAR: K,
    START_ANCHOR: A
  } = c, T = (b) => `(${o}(?:(?!${A}${b.dot ? S : p}).)*?)`, _ = t.dot ? "" : w, O = t.dot ? M : ae;
  let W = t.bash === !0 ? T(t) : K;
  t.capture && (W = `(${W})`), typeof t.noext == "boolean" && (t.noextglob = t.noext);
  const g = {
    input: r,
    index: -1,
    start: 0,
    dot: t.dot === !0,
    consumed: "",
    output: "",
    prefix: "",
    backtrack: !1,
    negated: !1,
    brackets: 0,
    braces: 0,
    parens: 0,
    quotes: 0,
    globstar: !1,
    tokens: a
  };
  r = ie.removePrefix(r, g), n = r.length;
  const F = [], I = [], Re = [];
  let h = s, d;
  const Q = () => g.index === n - 1, x = g.peek = (b = 1) => r[g.index + b], pe = g.advance = () => r[++g.index] || "", ge = () => r.slice(g.index + 1), re = (b = "", D = 0) => {
    g.consumed += b, g.index += D;
  }, pt = (b) => {
    g.output += b.output != null ? b.output : b.value, re(b.value);
  }, Fs = () => {
    let b = 1;
    for (; x() === "!" && (x(2) !== "(" || x(3) === "?"); )
      pe(), g.start++, b++;
    return b % 2 === 0 ? !1 : (g.negated = !0, g.start++, !0);
  }, gt = (b) => {
    g[b]++, Re.push(b);
  }, Fe = (b) => {
    g[b]--, Re.pop();
  }, E = (b) => {
    if (h.type === "globstar") {
      const D = g.braces > 0 && (b.type === "comma" || b.type === "brace"), y = b.extglob === !0 || F.length && (b.type === "pipe" || b.type === "paren");
      b.type !== "slash" && b.type !== "paren" && !D && !y && (g.output = g.output.slice(0, -h.output.length), h.type = "star", h.value = "*", h.output = W, g.output += h.output);
    }
    if (F.length && b.type !== "paren" && (F[F.length - 1].inner += b.value), (b.value || b.output) && pt(b), h && h.type === "text" && b.type === "text") {
      h.value += b.value, h.output = (h.output || "") + b.value;
      return;
    }
    b.prev = h, a.push(b), h = b;
  }, mt = (b, D) => {
    const y = { ...u[D], conditions: 1, inner: "" };
    y.prev = h, y.parens = g.parens, y.output = g.output;
    const R = (t.capture ? "(" : "") + y.open;
    gt("parens"), E({ type: b, value: D, output: g.output ? "" : m }), E({ type: "paren", extglob: !0, value: pe(), output: R }), F.push(y);
  }, $s = (b) => {
    let D = b.close + (t.capture ? ")" : ""), y;
    if (b.type === "negate") {
      let R = W;
      if (b.inner && b.inner.length > 1 && b.inner.includes("/") && (R = T(t)), (R !== W || Q() || /^\)+$/.test(ge())) && (D = b.close = `)$))${R}`), b.inner.includes("*") && (y = ge()) && /^\.[^\\/.]+$/.test(y)) {
        const $ = ni(y, { ...e, fastpaths: !1 }).output;
        D = b.close = `)${$})${R})`;
      }
      b.prev.type === "bos" && (g.negatedExtglob = !0);
    }
    E({ type: "paren", extglob: !0, value: d, output: D }), Fe("parens");
  };
  if (t.fastpaths !== !1 && !/(^[*!]|[/()[\]{}"])/.test(r)) {
    let b = !1, D = r.replace(el, (y, R, $, J, z, nr) => J === "\\" ? (b = !0, y) : J === "?" ? R ? R + J + (z ? M.repeat(z.length) : "") : nr === 0 ? O + (z ? M.repeat(z.length) : "") : M.repeat($.length) : J === "." ? p.repeat($.length) : J === "*" ? R ? R + J + (z ? W : "") : W : R ? y : `\\${y}`);
    return b === !0 && (t.unescape === !0 ? D = D.replace(/\\/g, "") : D = D.replace(/\\+/g, (y) => y.length % 2 === 0 ? "\\\\" : y ? "\\" : "")), D === r && t.contains === !0 ? (g.output = r, g) : (g.output = ie.wrapOutput(D, g, e), g);
  }
  for (; !Q(); ) {
    if (d = pe(), d === "\0")
      continue;
    if (d === "\\") {
      const y = x();
      if (y === "/" && t.bash !== !0 || y === "." || y === ";")
        continue;
      if (!y) {
        d += "\\", E({ type: "text", value: d });
        continue;
      }
      const R = /^\\+/.exec(ge());
      let $ = 0;
      if (R && R[0].length > 2 && ($ = R[0].length, g.index += $, $ % 2 !== 0 && (d += "\\")), t.unescape === !0 ? d = pe() : d += pe(), g.brackets === 0) {
        E({ type: "text", value: d });
        continue;
      }
    }
    if (g.brackets > 0 && (d !== "]" || h.value === "[" || h.value === "[^")) {
      if (t.posix !== !1 && d === ":") {
        const y = h.value.slice(1);
        if (y.includes("[") && (h.posix = !0, y.includes(":"))) {
          const R = h.value.lastIndexOf("["), $ = h.value.slice(0, R), J = h.value.slice(R + 2), z = Jo[J];
          if (z) {
            h.value = $ + z, g.backtrack = !0, pe(), !s.output && a.indexOf(h) === 1 && (s.output = m);
            continue;
          }
        }
      }
      (d === "[" && x() !== ":" || d === "-" && x() === "]") && (d = `\\${d}`), d === "]" && (h.value === "[" || h.value === "[^") && (d = `\\${d}`), t.posix === !0 && d === "!" && h.value === "[" && (d = "^"), h.value += d, pt({ value: d });
      continue;
    }
    if (g.quotes === 1 && d !== '"') {
      d = ie.escapeRegex(d), h.value += d, pt({ value: d });
      continue;
    }
    if (d === '"') {
      g.quotes = g.quotes === 1 ? 0 : 1, t.keepQuotes === !0 && E({ type: "text", value: d });
      continue;
    }
    if (d === "(") {
      gt("parens"), E({ type: "paren", value: d });
      continue;
    }
    if (d === ")") {
      if (g.parens === 0 && t.strictBrackets === !0)
        throw new SyntaxError(Xe("opening", "("));
      const y = F[F.length - 1];
      if (y && g.parens === y.parens + 1) {
        $s(F.pop());
        continue;
      }
      E({ type: "paren", value: d, output: g.parens ? ")" : "\\)" }), Fe("parens");
      continue;
    }
    if (d === "[") {
      if (t.nobracket === !0 || !ge().includes("]")) {
        if (t.nobracket !== !0 && t.strictBrackets === !0)
          throw new SyntaxError(Xe("closing", "]"));
        d = `\\${d}`;
      } else
        gt("brackets");
      E({ type: "bracket", value: d });
      continue;
    }
    if (d === "]") {
      if (t.nobracket === !0 || h && h.type === "bracket" && h.value.length === 1) {
        E({ type: "text", value: d, output: `\\${d}` });
        continue;
      }
      if (g.brackets === 0) {
        if (t.strictBrackets === !0)
          throw new SyntaxError(Xe("opening", "["));
        E({ type: "text", value: d, output: `\\${d}` });
        continue;
      }
      Fe("brackets");
      const y = h.value.slice(1);
      if (h.posix !== !0 && y[0] === "^" && !y.includes("/") && (d = `/${d}`), h.value += d, pt({ value: d }), t.literalBrackets === !1 || ie.hasRegexChars(y))
        continue;
      const R = ie.escapeRegex(h.value);
      if (g.output = g.output.slice(0, -h.value.length), t.literalBrackets === !0) {
        g.output += R, h.value = R;
        continue;
      }
      h.value = `(${o}${R}|${h.value})`, g.output += h.value;
      continue;
    }
    if (d === "{" && t.nobrace !== !0) {
      gt("braces");
      const y = {
        type: "brace",
        value: d,
        output: "(",
        outputIndex: g.output.length,
        tokensIndex: g.tokens.length
      };
      I.push(y), E(y);
      continue;
    }
    if (d === "}") {
      const y = I[I.length - 1];
      if (t.nobrace === !0 || !y) {
        E({ type: "text", value: d, output: d });
        continue;
      }
      let R = ")";
      if (y.dots === !0) {
        const $ = a.slice(), J = [];
        for (let z = $.length - 1; z >= 0 && (a.pop(), $[z].type !== "brace"); z--)
          $[z].type !== "dots" && J.unshift($[z].value);
        R = tl(J, t), g.backtrack = !0;
      }
      if (y.comma !== !0 && y.dots !== !0) {
        const $ = g.output.slice(0, y.outputIndex), J = g.tokens.slice(y.tokensIndex);
        y.value = y.output = "\\{", d = R = "\\}", g.output = $;
        for (const z of J)
          g.output += z.output || z.value;
      }
      E({ type: "brace", value: d, output: R }), Fe("braces"), I.pop();
      continue;
    }
    if (d === "|") {
      F.length > 0 && F[F.length - 1].conditions++, E({ type: "text", value: d });
      continue;
    }
    if (d === ",") {
      let y = d;
      const R = I[I.length - 1];
      R && Re[Re.length - 1] === "braces" && (R.comma = !0, y = "|"), E({ type: "comma", value: d, output: y });
      continue;
    }
    if (d === "/") {
      if (h.type === "dot" && g.index === g.start + 1) {
        g.start = g.index + 1, g.consumed = "", g.output = "", a.pop(), h = s;
        continue;
      }
      E({ type: "slash", value: d, output: C });
      continue;
    }
    if (d === ".") {
      if (g.braces > 0 && h.type === "dot") {
        h.value === "." && (h.output = p);
        const y = I[I.length - 1];
        h.type = "dots", h.output += d, h.value += d, y.dots = !0;
        continue;
      }
      if (g.braces + g.parens === 0 && h.type !== "bos" && h.type !== "slash") {
        E({ type: "text", value: d, output: p });
        continue;
      }
      E({ type: "dot", value: d, output: p });
      continue;
    }
    if (d === "?") {
      if (!(h && h.value === "(") && t.noextglob !== !0 && x() === "(" && x(2) !== "?") {
        mt("qmark", d);
        continue;
      }
      if (h && h.type === "paren") {
        const R = x();
        let $ = d;
        if (R === "<" && !ie.supportsLookbehinds())
          throw new Error("Node.js v10 or higher is required for regex lookbehinds");
        (h.value === "(" && !/[!=<:]/.test(R) || R === "<" && !/<([!=]|\w+>)/.test(ge())) && ($ = `\\${d}`), E({ type: "text", value: d, output: $ });
        continue;
      }
      if (t.dot !== !0 && (h.type === "slash" || h.type === "bos")) {
        E({ type: "qmark", value: d, output: ae });
        continue;
      }
      E({ type: "qmark", value: d, output: M });
      continue;
    }
    if (d === "!") {
      if (t.noextglob !== !0 && x() === "(" && (x(2) !== "?" || !/[!=<:]/.test(x(3)))) {
        mt("negate", d);
        continue;
      }
      if (t.nonegate !== !0 && g.index === 0) {
        Fs();
        continue;
      }
    }
    if (d === "+") {
      if (t.noextglob !== !0 && x() === "(" && x(2) !== "?") {
        mt("plus", d);
        continue;
      }
      if (h && h.value === "(" || t.regex === !1) {
        E({ type: "plus", value: d, output: f });
        continue;
      }
      if (h && (h.type === "bracket" || h.type === "paren" || h.type === "brace") || g.parens > 0) {
        E({ type: "plus", value: d });
        continue;
      }
      E({ type: "plus", value: f });
      continue;
    }
    if (d === "@") {
      if (t.noextglob !== !0 && x() === "(" && x(2) !== "?") {
        E({ type: "at", extglob: !0, value: d, output: "" });
        continue;
      }
      E({ type: "text", value: d });
      continue;
    }
    if (d !== "*") {
      (d === "$" || d === "^") && (d = `\\${d}`);
      const y = Zo.exec(ge());
      y && (d += y[0], g.index += y[0].length), E({ type: "text", value: d });
      continue;
    }
    if (h && (h.type === "globstar" || h.star === !0)) {
      h.type = "star", h.star = !0, h.value += d, h.output = W, g.backtrack = !0, g.globstar = !0, re(d);
      continue;
    }
    let b = ge();
    if (t.noextglob !== !0 && /^\([^?]/.test(b)) {
      mt("star", d);
      continue;
    }
    if (h.type === "star") {
      if (t.noglobstar === !0) {
        re(d);
        continue;
      }
      const y = h.prev, R = y.prev, $ = y.type === "slash" || y.type === "bos", J = R && (R.type === "star" || R.type === "globstar");
      if (t.bash === !0 && (!$ || b[0] && b[0] !== "/")) {
        E({ type: "star", value: d, output: "" });
        continue;
      }
      const z = g.braces > 0 && (y.type === "comma" || y.type === "brace"), nr = F.length && (y.type === "pipe" || y.type === "paren");
      if (!$ && y.type !== "paren" && !z && !nr) {
        E({ type: "star", value: d, output: "" });
        continue;
      }
      for (; b.slice(0, 3) === "/**"; ) {
        const yt = r[g.index + 4];
        if (yt && yt !== "/")
          break;
        b = b.slice(3), re("/**", 3);
      }
      if (y.type === "bos" && Q()) {
        h.type = "globstar", h.value += d, h.output = T(t), g.output = h.output, g.globstar = !0, re(d);
        continue;
      }
      if (y.type === "slash" && y.prev.type !== "bos" && !J && Q()) {
        g.output = g.output.slice(0, -(y.output + h.output).length), y.output = `(?:${y.output}`, h.type = "globstar", h.output = T(t) + (t.strictSlashes ? ")" : "|$)"), h.value += d, g.globstar = !0, g.output += y.output + h.output, re(d);
        continue;
      }
      if (y.type === "slash" && y.prev.type !== "bos" && b[0] === "/") {
        const yt = b[1] !== void 0 ? "|$" : "";
        g.output = g.output.slice(0, -(y.output + h.output).length), y.output = `(?:${y.output}`, h.type = "globstar", h.output = `${T(t)}${C}|${C}${yt})`, h.value += d, g.output += y.output + h.output, g.globstar = !0, re(d + pe()), E({ type: "slash", value: "/", output: "" });
        continue;
      }
      if (y.type === "bos" && b[0] === "/") {
        h.type = "globstar", h.value += d, h.output = `(?:^|${C}|${T(t)}${C})`, g.output = h.output, g.globstar = !0, re(d + pe()), E({ type: "slash", value: "/", output: "" });
        continue;
      }
      g.output = g.output.slice(0, -h.output.length), h.type = "globstar", h.output = T(t), h.value += d, g.output += h.output, g.globstar = !0, re(d);
      continue;
    }
    const D = { type: "star", value: d, output: W };
    if (t.bash === !0) {
      D.output = ".*?", (h.type === "bos" || h.type === "slash") && (D.output = _ + D.output), E(D);
      continue;
    }
    if (h && (h.type === "bracket" || h.type === "paren") && t.regex === !0) {
      D.output = d, E(D);
      continue;
    }
    (g.index === g.start || h.type === "slash" || h.type === "dot") && (h.type === "dot" ? (g.output += k, h.output += k) : t.dot === !0 ? (g.output += q, h.output += q) : (g.output += _, h.output += _), x() !== "*" && (g.output += m, h.output += m)), E(D);
  }
  for (; g.brackets > 0; ) {
    if (t.strictBrackets === !0) throw new SyntaxError(Xe("closing", "]"));
    g.output = ie.escapeLast(g.output, "["), Fe("brackets");
  }
  for (; g.parens > 0; ) {
    if (t.strictBrackets === !0) throw new SyntaxError(Xe("closing", ")"));
    g.output = ie.escapeLast(g.output, "("), Fe("parens");
  }
  for (; g.braces > 0; ) {
    if (t.strictBrackets === !0) throw new SyntaxError(Xe("closing", "}"));
    g.output = ie.escapeLast(g.output, "{"), Fe("braces");
  }
  if (t.strictSlashes !== !0 && (h.type === "star" || h.type === "bracket") && E({ type: "maybe_slash", value: "", output: `${C}?` }), g.backtrack === !0) {
    g.output = "";
    for (const b of g.tokens)
      g.output += b.output != null ? b.output : b.value, b.suffix && (g.output += b.suffix);
  }
  return g;
};
ni.fastpaths = (r, e) => {
  const t = { ...e }, i = typeof t.maxLength == "number" ? Math.min(Lt, t.maxLength) : Lt, n = r.length;
  if (n > i)
    throw new SyntaxError(`Input length: ${n}, exceeds maximum allowed length: ${i}`);
  r = es[r] || r;
  const s = ie.isWindows(e), {
    DOT_LITERAL: a,
    SLASH_LITERAL: o,
    ONE_CHAR: l,
    DOTS_SLASH: c,
    NO_DOT: u,
    NO_DOTS: p,
    NO_DOTS_SLASH: f,
    STAR: C,
    START_ANCHOR: m
  } = Dt.globChars(s), S = t.dot ? p : u, w = t.dot ? f : u, k = t.capture ? "" : "?:", q = { negated: !1, prefix: "" };
  let M = t.bash === !0 ? ".*?" : C;
  t.capture && (M = `(${M})`);
  const ae = (_) => _.noglobstar === !0 ? M : `(${k}(?:(?!${m}${_.dot ? c : a}).)*?)`, K = (_) => {
    switch (_) {
      case "*":
        return `${S}${l}${M}`;
      case ".*":
        return `${a}${l}${M}`;
      case "*.*":
        return `${S}${M}${a}${l}${M}`;
      case "*/*":
        return `${S}${M}${o}${l}${w}${M}`;
      case "**":
        return S + ae(t);
      case "**/*":
        return `(?:${S}${ae(t)}${o})?${w}${l}${M}`;
      case "**/*.*":
        return `(?:${S}${ae(t)}${o})?${w}${M}${a}${l}${M}`;
      case "**/.*":
        return `(?:${S}${ae(t)}${o})?${a}${l}${M}`;
      default: {
        const O = /^(.*?)\.(\w+)$/.exec(_);
        if (!O) return;
        const W = K(O[1]);
        return W ? W + a + O[2] : void 0;
      }
    }
  }, A = ie.removePrefix(r, q);
  let T = K(A);
  return T && t.strictSlashes !== !0 && (T += `${o}?`), T;
};
var rl = ni;
const il = _e, nl = Qo, Tr = rl, si = lt, sl = qt, al = (r) => r && typeof r == "object" && !Array.isArray(r), U = (r, e, t = !1) => {
  if (Array.isArray(r)) {
    const u = r.map((f) => U(f, e, t));
    return (f) => {
      for (const C of u) {
        const m = C(f);
        if (m) return m;
      }
      return !1;
    };
  }
  const i = al(r) && r.tokens && r.input;
  if (r === "" || typeof r != "string" && !i)
    throw new TypeError("Expected pattern to be a non-empty string");
  const n = e || {}, s = si.isWindows(e), a = i ? U.compileRe(r, e) : U.makeRe(r, e, !1, !0), o = a.state;
  delete a.state;
  let l = () => !1;
  if (n.ignore) {
    const u = { ...e, ignore: null, onMatch: null, onResult: null };
    l = U(n.ignore, u, t);
  }
  const c = (u, p = !1) => {
    const { isMatch: f, match: C, output: m } = U.test(u, a, e, { glob: r, posix: s }), S = { glob: r, state: o, regex: a, posix: s, input: u, output: m, match: C, isMatch: f };
    return typeof n.onResult == "function" && n.onResult(S), f === !1 ? (S.isMatch = !1, p ? S : !1) : l(u) ? (typeof n.onIgnore == "function" && n.onIgnore(S), S.isMatch = !1, p ? S : !1) : (typeof n.onMatch == "function" && n.onMatch(S), p ? S : !0);
  };
  return t && (c.state = o), c;
};
U.test = (r, e, t, { glob: i, posix: n } = {}) => {
  if (typeof r != "string")
    throw new TypeError("Expected input to be a string");
  if (r === "")
    return { isMatch: !1, output: "" };
  const s = t || {}, a = s.format || (n ? si.toPosixSlashes : null);
  let o = r === i, l = o && a ? a(r) : r;
  return o === !1 && (l = a ? a(r) : r, o = l === i), (o === !1 || s.capture === !0) && (s.matchBase === !0 || s.basename === !0 ? o = U.matchBase(r, e, t, n) : o = e.exec(l)), { isMatch: !!o, match: o, output: l };
};
U.matchBase = (r, e, t, i = si.isWindows(t)) => (e instanceof RegExp ? e : U.makeRe(e, t)).test(il.basename(r));
U.isMatch = (r, e, t) => U(e, t)(r);
U.parse = (r, e) => Array.isArray(r) ? r.map((t) => U.parse(t, e)) : Tr(r, { ...e, fastpaths: !1 });
U.scan = (r, e) => nl(r, e);
U.compileRe = (r, e, t = !1, i = !1) => {
  if (t === !0)
    return r.output;
  const n = e || {}, s = n.contains ? "" : "^", a = n.contains ? "" : "$";
  let o = `${s}(?:${r.output})${a}`;
  r && r.negated === !0 && (o = `^(?!${o}).*$`);
  const l = U.toRegex(o, e);
  return i === !0 && (l.state = r), l;
};
U.makeRe = (r, e = {}, t = !1, i = !1) => {
  if (!r || typeof r != "string")
    throw new TypeError("Expected a non-empty string");
  let n = { negated: !1, fastpaths: !0 };
  return e.fastpaths !== !1 && (r[0] === "." || r[0] === "*") && (n.output = Tr.fastpaths(r, e)), n.output || (n = Tr(r, e)), U.compileRe(n, e, t, i);
};
U.toRegex = (r, e) => {
  try {
    const t = e || {};
    return new RegExp(r, t.flags || (t.nocase ? "i" : ""));
  } catch (t) {
    if (e && e.debug === !0) throw t;
    return /$^/;
  }
};
U.constants = sl;
var ol = U, ll = ol;
const ts = En, rs = xo, ve = ll, kr = lt, gn = (r) => r === "" || r === "./", is = (r) => {
  const e = r.indexOf("{");
  return e > -1 && r.indexOf("}", e) > -1;
}, L = (r, e, t) => {
  e = [].concat(e), r = [].concat(r);
  let i = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set(), a = 0, o = (u) => {
    s.add(u.output), t && t.onResult && t.onResult(u);
  };
  for (let u = 0; u < e.length; u++) {
    let p = ve(String(e[u]), { ...t, onResult: o }, !0), f = p.state.negated || p.state.negatedExtglob;
    f && a++;
    for (let C of r) {
      let m = p(C, !0);
      (f ? !m.isMatch : m.isMatch) && (f ? i.add(m.output) : (i.delete(m.output), n.add(m.output)));
    }
  }
  let c = (a === e.length ? [...s] : [...n]).filter((u) => !i.has(u));
  if (t && c.length === 0) {
    if (t.failglob === !0)
      throw new Error(`No matches found for "${e.join(", ")}"`);
    if (t.nonull === !0 || t.nullglob === !0)
      return t.unescape ? e.map((u) => u.replace(/\\/g, "")) : e;
  }
  return c;
};
L.match = L;
L.matcher = (r, e) => ve(r, e);
L.isMatch = (r, e, t) => ve(e, t)(r);
L.any = L.isMatch;
L.not = (r, e, t = {}) => {
  e = [].concat(e).map(String);
  let i = /* @__PURE__ */ new Set(), n = [], s = (o) => {
    t.onResult && t.onResult(o), n.push(o.output);
  }, a = new Set(L(r, e, { ...t, onResult: s }));
  for (let o of n)
    a.has(o) || i.add(o);
  return [...i];
};
L.contains = (r, e, t) => {
  if (typeof r != "string")
    throw new TypeError(`Expected a string: "${ts.inspect(r)}"`);
  if (Array.isArray(e))
    return e.some((i) => L.contains(r, i, t));
  if (typeof e == "string") {
    if (gn(r) || gn(e))
      return !1;
    if (r.includes(e) || r.startsWith("./") && r.slice(2).includes(e))
      return !0;
  }
  return L.isMatch(r, e, { ...t, contains: !0 });
};
L.matchKeys = (r, e, t) => {
  if (!kr.isObject(r))
    throw new TypeError("Expected the first argument to be an object");
  let i = L(Object.keys(r), e, t), n = {};
  for (let s of i) n[s] = r[s];
  return n;
};
L.some = (r, e, t) => {
  let i = [].concat(r);
  for (let n of [].concat(e)) {
    let s = ve(String(n), t);
    if (i.some((a) => s(a)))
      return !0;
  }
  return !1;
};
L.every = (r, e, t) => {
  let i = [].concat(r);
  for (let n of [].concat(e)) {
    let s = ve(String(n), t);
    if (!i.every((a) => s(a)))
      return !1;
  }
  return !0;
};
L.all = (r, e, t) => {
  if (typeof r != "string")
    throw new TypeError(`Expected a string: "${ts.inspect(r)}"`);
  return [].concat(e).every((i) => ve(i, t)(r));
};
L.capture = (r, e, t) => {
  let i = kr.isWindows(t), s = ve.makeRe(String(r), { ...t, capture: !0 }).exec(i ? kr.toPosixSlashes(e) : e);
  if (s)
    return s.slice(1).map((a) => a === void 0 ? "" : a);
};
L.makeRe = (...r) => ve.makeRe(...r);
L.scan = (...r) => ve.scan(...r);
L.parse = (r, e) => {
  let t = [];
  for (let i of [].concat(r || []))
    for (let n of rs(String(i), e))
      t.push(ve.parse(n, e));
  return t;
};
L.braces = (r, e) => {
  if (typeof r != "string") throw new TypeError("Expected a string");
  return e && e.nobrace === !0 || !is(r) ? [r] : rs(r, e);
};
L.braceExpand = (r, e) => {
  if (typeof r != "string") throw new TypeError("Expected a string");
  return L.braces(r, { ...e, expand: !0 });
};
L.hasBraces = is;
var ul = L;
Object.defineProperty(v, "__esModule", { value: !0 });
v.isAbsolute = v.partitionAbsoluteAndRelative = v.removeDuplicateSlashes = v.matchAny = v.convertPatternsToRe = v.makeRe = v.getPatternParts = v.expandBraceExpansion = v.expandPatternsWithBraceExpansion = v.isAffectDepthOfReadingPattern = v.endsWithSlashGlobStar = v.hasGlobStar = v.getBaseDirectory = v.isPatternRelatedToParentDirectory = v.getPatternsOutsideCurrentDirectory = v.getPatternsInsideCurrentDirectory = v.getPositivePatterns = v.getNegativePatterns = v.isPositivePattern = v.isNegativePattern = v.convertToNegativePattern = v.convertToPositivePattern = v.isDynamicPattern = v.isStaticPattern = void 0;
const ns = _e, cl = Ga, ai = ul, ss = "**", fl = "\\", hl = /[*?]|^!/, dl = /\[[^[]*]/, pl = /(?:^|[^!*+?@])\([^(]*\|[^|]*\)/, gl = /[!*+?@]\([^(]*\)/, ml = /,|\.\./, yl = /(?!^)\/{2,}/g;
function as(r, e = {}) {
  return !os(r, e);
}
v.isStaticPattern = as;
function os(r, e = {}) {
  return r === "" ? !1 : !!(e.caseSensitiveMatch === !1 || r.includes(fl) || hl.test(r) || dl.test(r) || pl.test(r) || e.extglob !== !1 && gl.test(r) || e.braceExpansion !== !1 && Sl(r));
}
v.isDynamicPattern = os;
function Sl(r) {
  const e = r.indexOf("{");
  if (e === -1)
    return !1;
  const t = r.indexOf("}", e + 1);
  if (t === -1)
    return !1;
  const i = r.slice(e, t);
  return ml.test(i);
}
function _l(r) {
  return Yt(r) ? r.slice(1) : r;
}
v.convertToPositivePattern = _l;
function bl(r) {
  return "!" + r;
}
v.convertToNegativePattern = bl;
function Yt(r) {
  return r.startsWith("!") && r[1] !== "(";
}
v.isNegativePattern = Yt;
function ls(r) {
  return !Yt(r);
}
v.isPositivePattern = ls;
function vl(r) {
  return r.filter(Yt);
}
v.getNegativePatterns = vl;
function Cl(r) {
  return r.filter(ls);
}
v.getPositivePatterns = Cl;
function Pl(r) {
  return r.filter((e) => !oi(e));
}
v.getPatternsInsideCurrentDirectory = Pl;
function Al(r) {
  return r.filter(oi);
}
v.getPatternsOutsideCurrentDirectory = Al;
function oi(r) {
  return r.startsWith("..") || r.startsWith("./..");
}
v.isPatternRelatedToParentDirectory = oi;
function Rl(r) {
  return cl(r, { flipBackslashes: !1 });
}
v.getBaseDirectory = Rl;
function El(r) {
  return r.includes(ss);
}
v.hasGlobStar = El;
function us(r) {
  return r.endsWith("/" + ss);
}
v.endsWithSlashGlobStar = us;
function wl(r) {
  const e = ns.basename(r);
  return us(r) || as(e);
}
v.isAffectDepthOfReadingPattern = wl;
function Tl(r) {
  return r.reduce((e, t) => e.concat(cs(t)), []);
}
v.expandPatternsWithBraceExpansion = Tl;
function cs(r) {
  const e = ai.braces(r, { expand: !0, nodupes: !0, keepEscaping: !0 });
  return e.sort((t, i) => t.length - i.length), e.filter((t) => t !== "");
}
v.expandBraceExpansion = cs;
function kl(r, e) {
  let { parts: t } = ai.scan(r, Object.assign(Object.assign({}, e), { parts: !0 }));
  return t.length === 0 && (t = [r]), t[0].startsWith("/") && (t[0] = t[0].slice(1), t.unshift("")), t;
}
v.getPatternParts = kl;
function fs(r, e) {
  return ai.makeRe(r, e);
}
v.makeRe = fs;
function Ol(r, e) {
  return r.map((t) => fs(t, e));
}
v.convertPatternsToRe = Ol;
function xl(r, e) {
  return e.some((t) => t.test(r));
}
v.matchAny = xl;
function Il(r) {
  return r.replace(yl, "/");
}
v.removeDuplicateSlashes = Il;
function Dl(r) {
  const e = [], t = [];
  for (const i of r)
    hs(i) ? e.push(i) : t.push(i);
  return [e, t];
}
v.partitionAbsoluteAndRelative = Dl;
function hs(r) {
  return ns.isAbsolute(r);
}
v.isAbsolute = hs;
var Qt = {};
const Ll = Nt, ds = Ll.PassThrough, Ml = Array.prototype.slice;
var Fl = $l;
function $l() {
  const r = [], e = Ml.call(arguments);
  let t = !1, i = e[e.length - 1];
  i && !Array.isArray(i) && i.pipe == null ? e.pop() : i = {};
  const n = i.end !== !1, s = i.pipeError === !0;
  i.objectMode == null && (i.objectMode = !0), i.highWaterMark == null && (i.highWaterMark = 64 * 1024);
  const a = ds(i);
  function o() {
    for (let u = 0, p = arguments.length; u < p; u++)
      r.push(ps(arguments[u], i));
    return l(), this;
  }
  function l() {
    if (t)
      return;
    t = !0;
    let u = r.shift();
    if (!u) {
      process.nextTick(c);
      return;
    }
    Array.isArray(u) || (u = [u]);
    let p = u.length + 1;
    function f() {
      --p > 0 || (t = !1, l());
    }
    function C(m) {
      function S() {
        m.removeListener("merge2UnpipeEnd", S), m.removeListener("end", S), s && m.removeListener("error", w), f();
      }
      function w(k) {
        a.emit("error", k);
      }
      if (m._readableState.endEmitted)
        return f();
      m.on("merge2UnpipeEnd", S), m.on("end", S), s && m.on("error", w), m.pipe(a, { end: !1 }), m.resume();
    }
    for (let m = 0; m < u.length; m++)
      C(u[m]);
    f();
  }
  function c() {
    t = !1, a.emit("queueDrain"), n && a.end();
  }
  return a.setMaxListeners(0), a.add = o, a.on("unpipe", function(u) {
    u.emit("merge2UnpipeEnd");
  }), e.length && o.apply(null, e), a;
}
function ps(r, e) {
  if (Array.isArray(r))
    for (let t = 0, i = r.length; t < i; t++)
      r[t] = ps(r[t], e);
  else {
    if (!r._readableState && r.pipe && (r = r.pipe(ds(e))), !r._readableState || !r.pause || !r.pipe)
      throw new Error("Only readable stream can be merged.");
    r.pause();
  }
  return r;
}
Object.defineProperty(Qt, "__esModule", { value: !0 });
Qt.merge = void 0;
const Nl = Fl;
function Bl(r) {
  const e = Nl(r);
  return r.forEach((t) => {
    t.once("error", (i) => e.emit("error", i));
  }), e.once("close", () => mn(r)), e.once("end", () => mn(r)), e;
}
Qt.merge = Bl;
function mn(r) {
  r.forEach((e) => e.emit("close"));
}
var Je = {};
Object.defineProperty(Je, "__esModule", { value: !0 });
Je.isEmpty = Je.isString = void 0;
function Ul(r) {
  return typeof r == "string";
}
Je.isString = Ul;
function Hl(r) {
  return r === "";
}
Je.isEmpty = Hl;
Object.defineProperty(N, "__esModule", { value: !0 });
N.string = N.stream = N.pattern = N.path = N.fs = N.errno = N.array = void 0;
const Gl = Qe;
N.array = Gl;
const jl = Wt;
N.errno = jl;
const Vl = zt;
N.fs = Vl;
const Wl = G;
N.path = Wl;
const zl = v;
N.pattern = zl;
const Kl = Qt;
N.stream = Kl;
const Xl = Je;
N.string = Xl;
Object.defineProperty(Y, "__esModule", { value: !0 });
Y.convertPatternGroupToTask = Y.convertPatternGroupsToTasks = Y.groupPatternsByBaseDirectory = Y.getNegativePatternsAsPositive = Y.getPositivePatterns = Y.convertPatternsToTasks = Y.generate = void 0;
const he = N;
function ql(r, e) {
  const t = yn(r, e), i = yn(e.ignore, e), n = gs(t), s = ms(t, i), a = n.filter((u) => he.pattern.isStaticPattern(u, e)), o = n.filter((u) => he.pattern.isDynamicPattern(u, e)), l = Or(
    a,
    s,
    /* dynamic */
    !1
  ), c = Or(
    o,
    s,
    /* dynamic */
    !0
  );
  return l.concat(c);
}
Y.generate = ql;
function yn(r, e) {
  let t = r;
  return e.braceExpansion && (t = he.pattern.expandPatternsWithBraceExpansion(t)), e.baseNameMatch && (t = t.map((i) => i.includes("/") ? i : `**/${i}`)), t.map((i) => he.pattern.removeDuplicateSlashes(i));
}
function Or(r, e, t) {
  const i = [], n = he.pattern.getPatternsOutsideCurrentDirectory(r), s = he.pattern.getPatternsInsideCurrentDirectory(r), a = xr(n), o = xr(s);
  return i.push(...Ir(a, e, t)), "." in o ? i.push(li(".", s, e, t)) : i.push(...Ir(o, e, t)), i;
}
Y.convertPatternsToTasks = Or;
function gs(r) {
  return he.pattern.getPositivePatterns(r);
}
Y.getPositivePatterns = gs;
function ms(r, e) {
  return he.pattern.getNegativePatterns(r).concat(e).map(he.pattern.convertToPositivePattern);
}
Y.getNegativePatternsAsPositive = ms;
function xr(r) {
  const e = {};
  return r.reduce((t, i) => {
    const n = he.pattern.getBaseDirectory(i);
    return n in t ? t[n].push(i) : t[n] = [i], t;
  }, e);
}
Y.groupPatternsByBaseDirectory = xr;
function Ir(r, e, t) {
  return Object.keys(r).map((i) => li(i, r[i], e, t));
}
Y.convertPatternGroupsToTasks = Ir;
function li(r, e, t, i) {
  return {
    dynamic: i,
    positive: e,
    negative: t,
    base: r,
    patterns: [].concat(e, t.map(he.pattern.convertToNegativePattern))
  };
}
Y.convertPatternGroupToTask = li;
var ui = {}, ci = {}, le = {}, fi = {}, Jt = {}, ye = {}, De = {}, se = {}, Zt = {};
Object.defineProperty(Zt, "__esModule", { value: !0 });
Zt.read = void 0;
function Yl(r, e, t) {
  e.fs.lstat(r, (i, n) => {
    if (i !== null) {
      Sn(t, i);
      return;
    }
    if (!n.isSymbolicLink() || !e.followSymbolicLink) {
      Cr(t, n);
      return;
    }
    e.fs.stat(r, (s, a) => {
      if (s !== null) {
        if (e.throwErrorOnBrokenSymbolicLink) {
          Sn(t, s);
          return;
        }
        Cr(t, n);
        return;
      }
      e.markSymbolicLink && (a.isSymbolicLink = () => !0), Cr(t, a);
    });
  });
}
Zt.read = Yl;
function Sn(r, e) {
  r(e);
}
function Cr(r, e) {
  r(null, e);
}
var er = {};
Object.defineProperty(er, "__esModule", { value: !0 });
er.read = void 0;
function Ql(r, e) {
  const t = e.fs.lstatSync(r);
  if (!t.isSymbolicLink() || !e.followSymbolicLink)
    return t;
  try {
    const i = e.fs.statSync(r);
    return e.markSymbolicLink && (i.isSymbolicLink = () => !0), i;
  } catch (i) {
    if (!e.throwErrorOnBrokenSymbolicLink)
      return t;
    throw i;
  }
}
er.read = Ql;
var hi = {}, ys = {};
(function(r) {
  Object.defineProperty(r, "__esModule", { value: !0 }), r.createFileSystemAdapter = r.FILE_SYSTEM_ADAPTER = void 0;
  const e = Vr;
  r.FILE_SYSTEM_ADAPTER = {
    lstat: e.lstat,
    stat: e.stat,
    lstatSync: e.lstatSync,
    statSync: e.statSync
  };
  function t(i) {
    return i === void 0 ? r.FILE_SYSTEM_ADAPTER : Object.assign(Object.assign({}, r.FILE_SYSTEM_ADAPTER), i);
  }
  r.createFileSystemAdapter = t;
})(ys);
Object.defineProperty(hi, "__esModule", { value: !0 });
const Jl = ys;
let Zl = class {
  constructor(e = {}) {
    this._options = e, this.followSymbolicLink = this._getValue(this._options.followSymbolicLink, !0), this.fs = Jl.createFileSystemAdapter(this._options.fs), this.markSymbolicLink = this._getValue(this._options.markSymbolicLink, !1), this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, !0);
  }
  _getValue(e, t) {
    return e ?? t;
  }
};
hi.default = Zl;
Object.defineProperty(se, "__esModule", { value: !0 });
se.statSync = se.stat = se.Settings = void 0;
const _n = Zt, eu = er, Dr = hi;
se.Settings = Dr.default;
function tu(r, e, t) {
  if (typeof e == "function") {
    _n.read(r, Lr(), e);
    return;
  }
  _n.read(r, Lr(e), t);
}
se.stat = tu;
function ru(r, e) {
  const t = Lr(e);
  return eu.read(r, t);
}
se.statSync = ru;
function Lr(r = {}) {
  return r instanceof Dr.default ? r : new Dr.default(r);
}
/*! queue-microtask. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
let bn;
var iu = typeof queueMicrotask == "function" ? queueMicrotask.bind(typeof window < "u" ? window : da) : (r) => (bn || (bn = Promise.resolve())).then(r).catch((e) => setTimeout(() => {
  throw e;
}, 0));
/*! run-parallel. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
var nu = au;
const su = iu;
function au(r, e) {
  let t, i, n, s = !0;
  Array.isArray(r) ? (t = [], i = r.length) : (n = Object.keys(r), t = {}, i = n.length);
  function a(l) {
    function c() {
      e && e(l, t), e = null;
    }
    s ? su(c) : c();
  }
  function o(l, c, u) {
    t[l] = u, (--i === 0 || c) && a(c);
  }
  i ? n ? n.forEach(function(l) {
    r[l](function(c, u) {
      o(l, c, u);
    });
  }) : r.forEach(function(l, c) {
    l(function(u, p) {
      o(c, u, p);
    });
  }) : a(null), s = !1;
}
var ut = {};
Object.defineProperty(ut, "__esModule", { value: !0 });
ut.IS_SUPPORT_READDIR_WITH_FILE_TYPES = void 0;
const Mt = process.versions.node.split(".");
if (Mt[0] === void 0 || Mt[1] === void 0)
  throw new Error(`Unexpected behavior. The 'process.versions.node' variable has invalid value: ${process.versions.node}`);
const Ss = Number.parseInt(Mt[0], 10), ou = Number.parseInt(Mt[1], 10), _s = 10, lu = 10, uu = Ss > _s, cu = Ss === _s && ou >= lu;
ut.IS_SUPPORT_READDIR_WITH_FILE_TYPES = uu || cu;
var ct = {}, tr = {};
Object.defineProperty(tr, "__esModule", { value: !0 });
tr.createDirentFromStats = void 0;
class fu {
  constructor(e, t) {
    this.name = e, this.isBlockDevice = t.isBlockDevice.bind(t), this.isCharacterDevice = t.isCharacterDevice.bind(t), this.isDirectory = t.isDirectory.bind(t), this.isFIFO = t.isFIFO.bind(t), this.isFile = t.isFile.bind(t), this.isSocket = t.isSocket.bind(t), this.isSymbolicLink = t.isSymbolicLink.bind(t);
  }
}
function hu(r, e) {
  return new fu(r, e);
}
tr.createDirentFromStats = hu;
Object.defineProperty(ct, "__esModule", { value: !0 });
ct.fs = void 0;
const du = tr;
ct.fs = du;
var ft = {};
Object.defineProperty(ft, "__esModule", { value: !0 });
ft.joinPathSegments = void 0;
function pu(r, e, t) {
  return r.endsWith(t) ? r + e : r + t + e;
}
ft.joinPathSegments = pu;
Object.defineProperty(De, "__esModule", { value: !0 });
De.readdir = De.readdirWithFileTypes = De.read = void 0;
const gu = se, bs = nu, mu = ut, vs = ct, Cs = ft;
function yu(r, e, t) {
  if (!e.stats && mu.IS_SUPPORT_READDIR_WITH_FILE_TYPES) {
    Ps(r, e, t);
    return;
  }
  As(r, e, t);
}
De.read = yu;
function Ps(r, e, t) {
  e.fs.readdir(r, { withFileTypes: !0 }, (i, n) => {
    if (i !== null) {
      Ft(t, i);
      return;
    }
    const s = n.map((o) => ({
      dirent: o,
      name: o.name,
      path: Cs.joinPathSegments(r, o.name, e.pathSegmentSeparator)
    }));
    if (!e.followSymbolicLinks) {
      Mr(t, s);
      return;
    }
    const a = s.map((o) => Su(o, e));
    bs(a, (o, l) => {
      if (o !== null) {
        Ft(t, o);
        return;
      }
      Mr(t, l);
    });
  });
}
De.readdirWithFileTypes = Ps;
function Su(r, e) {
  return (t) => {
    if (!r.dirent.isSymbolicLink()) {
      t(null, r);
      return;
    }
    e.fs.stat(r.path, (i, n) => {
      if (i !== null) {
        if (e.throwErrorOnBrokenSymbolicLink) {
          t(i);
          return;
        }
        t(null, r);
        return;
      }
      r.dirent = vs.fs.createDirentFromStats(r.name, n), t(null, r);
    });
  };
}
function As(r, e, t) {
  e.fs.readdir(r, (i, n) => {
    if (i !== null) {
      Ft(t, i);
      return;
    }
    const s = n.map((a) => {
      const o = Cs.joinPathSegments(r, a, e.pathSegmentSeparator);
      return (l) => {
        gu.stat(o, e.fsStatSettings, (c, u) => {
          if (c !== null) {
            l(c);
            return;
          }
          const p = {
            name: a,
            path: o,
            dirent: vs.fs.createDirentFromStats(a, u)
          };
          e.stats && (p.stats = u), l(null, p);
        });
      };
    });
    bs(s, (a, o) => {
      if (a !== null) {
        Ft(t, a);
        return;
      }
      Mr(t, o);
    });
  });
}
De.readdir = As;
function Ft(r, e) {
  r(e);
}
function Mr(r, e) {
  r(null, e);
}
var Le = {};
Object.defineProperty(Le, "__esModule", { value: !0 });
Le.readdir = Le.readdirWithFileTypes = Le.read = void 0;
const _u = se, bu = ut, Rs = ct, Es = ft;
function vu(r, e) {
  return !e.stats && bu.IS_SUPPORT_READDIR_WITH_FILE_TYPES ? ws(r, e) : Ts(r, e);
}
Le.read = vu;
function ws(r, e) {
  return e.fs.readdirSync(r, { withFileTypes: !0 }).map((i) => {
    const n = {
      dirent: i,
      name: i.name,
      path: Es.joinPathSegments(r, i.name, e.pathSegmentSeparator)
    };
    if (n.dirent.isSymbolicLink() && e.followSymbolicLinks)
      try {
        const s = e.fs.statSync(n.path);
        n.dirent = Rs.fs.createDirentFromStats(n.name, s);
      } catch (s) {
        if (e.throwErrorOnBrokenSymbolicLink)
          throw s;
      }
    return n;
  });
}
Le.readdirWithFileTypes = ws;
function Ts(r, e) {
  return e.fs.readdirSync(r).map((i) => {
    const n = Es.joinPathSegments(r, i, e.pathSegmentSeparator), s = _u.statSync(n, e.fsStatSettings), a = {
      name: i,
      path: n,
      dirent: Rs.fs.createDirentFromStats(i, s)
    };
    return e.stats && (a.stats = s), a;
  });
}
Le.readdir = Ts;
var di = {}, ks = {};
(function(r) {
  Object.defineProperty(r, "__esModule", { value: !0 }), r.createFileSystemAdapter = r.FILE_SYSTEM_ADAPTER = void 0;
  const e = Vr;
  r.FILE_SYSTEM_ADAPTER = {
    lstat: e.lstat,
    stat: e.stat,
    lstatSync: e.lstatSync,
    statSync: e.statSync,
    readdir: e.readdir,
    readdirSync: e.readdirSync
  };
  function t(i) {
    return i === void 0 ? r.FILE_SYSTEM_ADAPTER : Object.assign(Object.assign({}, r.FILE_SYSTEM_ADAPTER), i);
  }
  r.createFileSystemAdapter = t;
})(ks);
Object.defineProperty(di, "__esModule", { value: !0 });
const Cu = _e, Pu = se, Au = ks;
let Ru = class {
  constructor(e = {}) {
    this._options = e, this.followSymbolicLinks = this._getValue(this._options.followSymbolicLinks, !1), this.fs = Au.createFileSystemAdapter(this._options.fs), this.pathSegmentSeparator = this._getValue(this._options.pathSegmentSeparator, Cu.sep), this.stats = this._getValue(this._options.stats, !1), this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, !0), this.fsStatSettings = new Pu.Settings({
      followSymbolicLink: this.followSymbolicLinks,
      fs: this.fs,
      throwErrorOnBrokenSymbolicLink: this.throwErrorOnBrokenSymbolicLink
    });
  }
  _getValue(e, t) {
    return e ?? t;
  }
};
di.default = Ru;
Object.defineProperty(ye, "__esModule", { value: !0 });
ye.Settings = ye.scandirSync = ye.scandir = void 0;
const vn = De, Eu = Le, Fr = di;
ye.Settings = Fr.default;
function wu(r, e, t) {
  if (typeof e == "function") {
    vn.read(r, $r(), e);
    return;
  }
  vn.read(r, $r(e), t);
}
ye.scandir = wu;
function Tu(r, e) {
  const t = $r(e);
  return Eu.read(r, t);
}
ye.scandirSync = Tu;
function $r(r = {}) {
  return r instanceof Fr.default ? r : new Fr.default(r);
}
var pi = { exports: {} };
function ku(r) {
  var e = new r(), t = e;
  function i() {
    var s = e;
    return s.next ? e = s.next : (e = new r(), t = e), s.next = null, s;
  }
  function n(s) {
    t.next = s, t = s;
  }
  return {
    get: i,
    release: n
  };
}
var Ou = ku, xu = Ou;
function Os(r, e, t) {
  if (typeof r == "function" && (t = e, e = r, r = null), !(t >= 1))
    throw new Error("fastqueue concurrency must be equal to or greater than 1");
  var i = xu(Iu), n = null, s = null, a = 0, o = null, l = {
    push: S,
    drain: ee,
    saturated: ee,
    pause: u,
    paused: !1,
    get concurrency() {
      return t;
    },
    set concurrency(A) {
      if (!(A >= 1))
        throw new Error("fastqueue concurrency must be equal to or greater than 1");
      if (t = A, !l.paused)
        for (; n && a < t; )
          a++, k();
    },
    running: c,
    resume: C,
    idle: m,
    length: p,
    getQueue: f,
    unshift: w,
    empty: ee,
    kill: q,
    killAndDrain: M,
    error: K,
    abort: ae
  };
  return l;
  function c() {
    return a;
  }
  function u() {
    l.paused = !0;
  }
  function p() {
    for (var A = n, T = 0; A; )
      A = A.next, T++;
    return T;
  }
  function f() {
    for (var A = n, T = []; A; )
      T.push(A.value), A = A.next;
    return T;
  }
  function C() {
    if (l.paused) {
      if (l.paused = !1, n === null) {
        a++, k();
        return;
      }
      for (; n && a < t; )
        a++, k();
    }
  }
  function m() {
    return a === 0 && l.length() === 0;
  }
  function S(A, T) {
    var _ = i.get();
    _.context = r, _.release = k, _.value = A, _.callback = T || ee, _.errorHandler = o, a >= t || l.paused ? s ? (s.next = _, s = _) : (n = _, s = _, l.saturated()) : (a++, e.call(r, _.value, _.worked));
  }
  function w(A, T) {
    var _ = i.get();
    _.context = r, _.release = k, _.value = A, _.callback = T || ee, _.errorHandler = o, a >= t || l.paused ? n ? (_.next = n, n = _) : (n = _, s = _, l.saturated()) : (a++, e.call(r, _.value, _.worked));
  }
  function k(A) {
    A && i.release(A);
    var T = n;
    T && a <= t ? l.paused ? a-- : (s === n && (s = null), n = T.next, T.next = null, e.call(r, T.value, T.worked), s === null && l.empty()) : --a === 0 && l.drain();
  }
  function q() {
    n = null, s = null, l.drain = ee;
  }
  function M() {
    n = null, s = null, l.drain(), l.drain = ee;
  }
  function ae() {
    var A = n;
    for (n = null, s = null; A; ) {
      var T = A.next, _ = A.callback, O = A.errorHandler, W = A.value, g = A.context;
      A.value = null, A.callback = ee, A.errorHandler = null, O && O(new Error("abort"), W), _.call(g, new Error("abort")), A.release(A), A = T;
    }
    l.drain = ee;
  }
  function K(A) {
    o = A;
  }
}
function ee() {
}
function Iu() {
  this.value = null, this.callback = ee, this.next = null, this.release = ee, this.context = null, this.errorHandler = null;
  var r = this;
  this.worked = function(t, i) {
    var n = r.callback, s = r.errorHandler, a = r.value;
    r.value = null, r.callback = ee, r.errorHandler && s(t, a), n.call(r.context, t, i), r.release(r);
  };
}
function Du(r, e, t) {
  typeof r == "function" && (t = e, e = r, r = null);
  function i(u, p) {
    e.call(this, u).then(function(f) {
      p(null, f);
    }, p);
  }
  var n = Os(r, i, t), s = n.push, a = n.unshift;
  return n.push = o, n.unshift = l, n.drained = c, n;
  function o(u) {
    var p = new Promise(function(f, C) {
      s(u, function(m, S) {
        if (m) {
          C(m);
          return;
        }
        f(S);
      });
    });
    return p.catch(ee), p;
  }
  function l(u) {
    var p = new Promise(function(f, C) {
      a(u, function(m, S) {
        if (m) {
          C(m);
          return;
        }
        f(S);
      });
    });
    return p.catch(ee), p;
  }
  function c() {
    var u = new Promise(function(p) {
      process.nextTick(function() {
        if (n.idle())
          p();
        else {
          var f = n.drain;
          n.drain = function() {
            typeof f == "function" && f(), p(), n.drain = f;
          };
        }
      });
    });
    return u;
  }
}
pi.exports = Os;
pi.exports.promise = Du;
var Lu = pi.exports, ue = {};
Object.defineProperty(ue, "__esModule", { value: !0 });
ue.joinPathSegments = ue.replacePathSegmentSeparator = ue.isAppliedFilter = ue.isFatalError = void 0;
function Mu(r, e) {
  return r.errorFilter === null ? !0 : !r.errorFilter(e);
}
ue.isFatalError = Mu;
function Fu(r, e) {
  return r === null || r(e);
}
ue.isAppliedFilter = Fu;
function $u(r, e) {
  return r.split(/[/\\]/).join(e);
}
ue.replacePathSegmentSeparator = $u;
function Nu(r, e, t) {
  return r === "" ? e : r.endsWith(t) ? r + e : r + t + e;
}
ue.joinPathSegments = Nu;
var rr = {};
Object.defineProperty(rr, "__esModule", { value: !0 });
const Bu = ue;
let Uu = class {
  constructor(e, t) {
    this._root = e, this._settings = t, this._root = Bu.replacePathSegmentSeparator(e, t.pathSegmentSeparator);
  }
};
rr.default = Uu;
Object.defineProperty(Jt, "__esModule", { value: !0 });
const Hu = Us, Gu = ye, ju = Lu, vt = ue, Vu = rr;
class Wu extends Vu.default {
  constructor(e, t) {
    super(e, t), this._settings = t, this._scandir = Gu.scandir, this._emitter = new Hu.EventEmitter(), this._queue = ju(this._worker.bind(this), this._settings.concurrency), this._isFatalError = !1, this._isDestroyed = !1, this._queue.drain = () => {
      this._isFatalError || this._emitter.emit("end");
    };
  }
  read() {
    return this._isFatalError = !1, this._isDestroyed = !1, setImmediate(() => {
      this._pushToQueue(this._root, this._settings.basePath);
    }), this._emitter;
  }
  get isDestroyed() {
    return this._isDestroyed;
  }
  destroy() {
    if (this._isDestroyed)
      throw new Error("The reader is already destroyed");
    this._isDestroyed = !0, this._queue.killAndDrain();
  }
  onEntry(e) {
    this._emitter.on("entry", e);
  }
  onError(e) {
    this._emitter.once("error", e);
  }
  onEnd(e) {
    this._emitter.once("end", e);
  }
  _pushToQueue(e, t) {
    const i = { directory: e, base: t };
    this._queue.push(i, (n) => {
      n !== null && this._handleError(n);
    });
  }
  _worker(e, t) {
    this._scandir(e.directory, this._settings.fsScandirSettings, (i, n) => {
      if (i !== null) {
        t(i, void 0);
        return;
      }
      for (const s of n)
        this._handleEntry(s, e.base);
      t(null, void 0);
    });
  }
  _handleError(e) {
    this._isDestroyed || !vt.isFatalError(this._settings, e) || (this._isFatalError = !0, this._isDestroyed = !0, this._emitter.emit("error", e));
  }
  _handleEntry(e, t) {
    if (this._isDestroyed || this._isFatalError)
      return;
    const i = e.path;
    t !== void 0 && (e.path = vt.joinPathSegments(t, e.name, this._settings.pathSegmentSeparator)), vt.isAppliedFilter(this._settings.entryFilter, e) && this._emitEntry(e), e.dirent.isDirectory() && vt.isAppliedFilter(this._settings.deepFilter, e) && this._pushToQueue(i, t === void 0 ? void 0 : e.path);
  }
  _emitEntry(e) {
    this._emitter.emit("entry", e);
  }
}
Jt.default = Wu;
Object.defineProperty(fi, "__esModule", { value: !0 });
const zu = Jt;
class Ku {
  constructor(e, t) {
    this._root = e, this._settings = t, this._reader = new zu.default(this._root, this._settings), this._storage = [];
  }
  read(e) {
    this._reader.onError((t) => {
      Xu(e, t);
    }), this._reader.onEntry((t) => {
      this._storage.push(t);
    }), this._reader.onEnd(() => {
      qu(e, this._storage);
    }), this._reader.read();
  }
}
fi.default = Ku;
function Xu(r, e) {
  r(e);
}
function qu(r, e) {
  r(null, e);
}
var gi = {};
Object.defineProperty(gi, "__esModule", { value: !0 });
const Yu = Nt, Qu = Jt;
class Ju {
  constructor(e, t) {
    this._root = e, this._settings = t, this._reader = new Qu.default(this._root, this._settings), this._stream = new Yu.Readable({
      objectMode: !0,
      read: () => {
      },
      destroy: () => {
        this._reader.isDestroyed || this._reader.destroy();
      }
    });
  }
  read() {
    return this._reader.onError((e) => {
      this._stream.emit("error", e);
    }), this._reader.onEntry((e) => {
      this._stream.push(e);
    }), this._reader.onEnd(() => {
      this._stream.push(null);
    }), this._reader.read(), this._stream;
  }
}
gi.default = Ju;
var mi = {}, yi = {};
Object.defineProperty(yi, "__esModule", { value: !0 });
const Zu = ye, Ct = ue, ec = rr;
class tc extends ec.default {
  constructor() {
    super(...arguments), this._scandir = Zu.scandirSync, this._storage = [], this._queue = /* @__PURE__ */ new Set();
  }
  read() {
    return this._pushToQueue(this._root, this._settings.basePath), this._handleQueue(), this._storage;
  }
  _pushToQueue(e, t) {
    this._queue.add({ directory: e, base: t });
  }
  _handleQueue() {
    for (const e of this._queue.values())
      this._handleDirectory(e.directory, e.base);
  }
  _handleDirectory(e, t) {
    try {
      const i = this._scandir(e, this._settings.fsScandirSettings);
      for (const n of i)
        this._handleEntry(n, t);
    } catch (i) {
      this._handleError(i);
    }
  }
  _handleError(e) {
    if (Ct.isFatalError(this._settings, e))
      throw e;
  }
  _handleEntry(e, t) {
    const i = e.path;
    t !== void 0 && (e.path = Ct.joinPathSegments(t, e.name, this._settings.pathSegmentSeparator)), Ct.isAppliedFilter(this._settings.entryFilter, e) && this._pushToStorage(e), e.dirent.isDirectory() && Ct.isAppliedFilter(this._settings.deepFilter, e) && this._pushToQueue(i, t === void 0 ? void 0 : e.path);
  }
  _pushToStorage(e) {
    this._storage.push(e);
  }
}
yi.default = tc;
Object.defineProperty(mi, "__esModule", { value: !0 });
const rc = yi;
class ic {
  constructor(e, t) {
    this._root = e, this._settings = t, this._reader = new rc.default(this._root, this._settings);
  }
  read() {
    return this._reader.read();
  }
}
mi.default = ic;
var Si = {};
Object.defineProperty(Si, "__esModule", { value: !0 });
const nc = _e, sc = ye;
class ac {
  constructor(e = {}) {
    this._options = e, this.basePath = this._getValue(this._options.basePath, void 0), this.concurrency = this._getValue(this._options.concurrency, Number.POSITIVE_INFINITY), this.deepFilter = this._getValue(this._options.deepFilter, null), this.entryFilter = this._getValue(this._options.entryFilter, null), this.errorFilter = this._getValue(this._options.errorFilter, null), this.pathSegmentSeparator = this._getValue(this._options.pathSegmentSeparator, nc.sep), this.fsScandirSettings = new sc.Settings({
      followSymbolicLinks: this._options.followSymbolicLinks,
      fs: this._options.fs,
      pathSegmentSeparator: this._options.pathSegmentSeparator,
      stats: this._options.stats,
      throwErrorOnBrokenSymbolicLink: this._options.throwErrorOnBrokenSymbolicLink
    });
  }
  _getValue(e, t) {
    return e ?? t;
  }
}
Si.default = ac;
Object.defineProperty(le, "__esModule", { value: !0 });
le.Settings = le.walkStream = le.walkSync = le.walk = void 0;
const Cn = fi, oc = gi, lc = mi, Nr = Si;
le.Settings = Nr.default;
function uc(r, e, t) {
  if (typeof e == "function") {
    new Cn.default(r, $t()).read(e);
    return;
  }
  new Cn.default(r, $t(e)).read(t);
}
le.walk = uc;
function cc(r, e) {
  const t = $t(e);
  return new lc.default(r, t).read();
}
le.walkSync = cc;
function fc(r, e) {
  const t = $t(e);
  return new oc.default(r, t).read();
}
le.walkStream = fc;
function $t(r = {}) {
  return r instanceof Nr.default ? r : new Nr.default(r);
}
var ht = {};
Object.defineProperty(ht, "__esModule", { value: !0 });
const hc = _e, dc = se, Pn = N;
class pc {
  constructor(e) {
    this._settings = e, this._fsStatSettings = new dc.Settings({
      followSymbolicLink: this._settings.followSymbolicLinks,
      fs: this._settings.fs,
      throwErrorOnBrokenSymbolicLink: this._settings.followSymbolicLinks
    });
  }
  _getFullEntryPath(e) {
    return hc.resolve(this._settings.cwd, e);
  }
  _makeEntry(e, t) {
    const i = {
      name: t,
      path: t,
      dirent: Pn.fs.createDirentFromStats(t, e)
    };
    return this._settings.stats && (i.stats = e), i;
  }
  _isFatalError(e) {
    return !Pn.errno.isEnoentCodeError(e) && !this._settings.suppressErrors;
  }
}
ht.default = pc;
var ir = {};
Object.defineProperty(ir, "__esModule", { value: !0 });
const gc = Nt, mc = se, yc = le, Sc = ht;
class _c extends Sc.default {
  constructor() {
    super(...arguments), this._walkStream = yc.walkStream, this._stat = mc.stat;
  }
  dynamic(e, t) {
    return this._walkStream(e, t);
  }
  static(e, t) {
    const i = e.map(this._getFullEntryPath, this), n = new gc.PassThrough({ objectMode: !0 });
    n._write = (s, a, o) => this._getEntry(i[s], e[s], t).then((l) => {
      l !== null && t.entryFilter(l) && n.push(l), s === i.length - 1 && n.end(), o();
    }).catch(o);
    for (let s = 0; s < i.length; s++)
      n.write(s);
    return n;
  }
  _getEntry(e, t, i) {
    return this._getStat(e).then((n) => this._makeEntry(n, t)).catch((n) => {
      if (i.errorFilter(n))
        return null;
      throw n;
    });
  }
  _getStat(e) {
    return new Promise((t, i) => {
      this._stat(e, this._fsStatSettings, (n, s) => n === null ? t(s) : i(n));
    });
  }
}
ir.default = _c;
Object.defineProperty(ci, "__esModule", { value: !0 });
const bc = le, vc = ht, Cc = ir;
class Pc extends vc.default {
  constructor() {
    super(...arguments), this._walkAsync = bc.walk, this._readerStream = new Cc.default(this._settings);
  }
  dynamic(e, t) {
    return new Promise((i, n) => {
      this._walkAsync(e, t, (s, a) => {
        s === null ? i(a) : n(s);
      });
    });
  }
  async static(e, t) {
    const i = [], n = this._readerStream.static(e, t);
    return new Promise((s, a) => {
      n.once("error", a), n.on("data", (o) => i.push(o)), n.once("end", () => s(i));
    });
  }
}
ci.default = Pc;
var dt = {}, _i = {}, bi = {}, vi = {};
Object.defineProperty(vi, "__esModule", { value: !0 });
const it = N;
class Ac {
  constructor(e, t, i) {
    this._patterns = e, this._settings = t, this._micromatchOptions = i, this._storage = [], this._fillStorage();
  }
  _fillStorage() {
    for (const e of this._patterns) {
      const t = this._getPatternSegments(e), i = this._splitSegmentsIntoSections(t);
      this._storage.push({
        complete: i.length <= 1,
        pattern: e,
        segments: t,
        sections: i
      });
    }
  }
  _getPatternSegments(e) {
    return it.pattern.getPatternParts(e, this._micromatchOptions).map((i) => it.pattern.isDynamicPattern(i, this._settings) ? {
      dynamic: !0,
      pattern: i,
      patternRe: it.pattern.makeRe(i, this._micromatchOptions)
    } : {
      dynamic: !1,
      pattern: i
    });
  }
  _splitSegmentsIntoSections(e) {
    return it.array.splitWhen(e, (t) => t.dynamic && it.pattern.hasGlobStar(t.pattern));
  }
}
vi.default = Ac;
Object.defineProperty(bi, "__esModule", { value: !0 });
const Rc = vi;
class Ec extends Rc.default {
  match(e) {
    const t = e.split("/"), i = t.length, n = this._storage.filter((s) => !s.complete || s.segments.length > i);
    for (const s of n) {
      const a = s.sections[0];
      if (!s.complete && i > a.length || t.every((l, c) => {
        const u = s.segments[c];
        return !!(u.dynamic && u.patternRe.test(l) || !u.dynamic && u.pattern === l);
      }))
        return !0;
    }
    return !1;
  }
}
bi.default = Ec;
Object.defineProperty(_i, "__esModule", { value: !0 });
const Pt = N, wc = bi;
class Tc {
  constructor(e, t) {
    this._settings = e, this._micromatchOptions = t;
  }
  getFilter(e, t, i) {
    const n = this._getMatcher(t), s = this._getNegativePatternsRe(i);
    return (a) => this._filter(e, a, n, s);
  }
  _getMatcher(e) {
    return new wc.default(e, this._settings, this._micromatchOptions);
  }
  _getNegativePatternsRe(e) {
    const t = e.filter(Pt.pattern.isAffectDepthOfReadingPattern);
    return Pt.pattern.convertPatternsToRe(t, this._micromatchOptions);
  }
  _filter(e, t, i, n) {
    if (this._isSkippedByDeep(e, t.path) || this._isSkippedSymbolicLink(t))
      return !1;
    const s = Pt.path.removeLeadingDotSegment(t.path);
    return this._isSkippedByPositivePatterns(s, i) ? !1 : this._isSkippedByNegativePatterns(s, n);
  }
  _isSkippedByDeep(e, t) {
    return this._settings.deep === 1 / 0 ? !1 : this._getEntryLevel(e, t) >= this._settings.deep;
  }
  _getEntryLevel(e, t) {
    const i = t.split("/").length;
    if (e === "")
      return i;
    const n = e.split("/").length;
    return i - n;
  }
  _isSkippedSymbolicLink(e) {
    return !this._settings.followSymbolicLinks && e.dirent.isSymbolicLink();
  }
  _isSkippedByPositivePatterns(e, t) {
    return !this._settings.baseNameMatch && !t.match(e);
  }
  _isSkippedByNegativePatterns(e, t) {
    return !Pt.pattern.matchAny(e, t);
  }
}
_i.default = Tc;
var Ci = {};
Object.defineProperty(Ci, "__esModule", { value: !0 });
const Ee = N;
class kc {
  constructor(e, t) {
    this._settings = e, this._micromatchOptions = t, this.index = /* @__PURE__ */ new Map();
  }
  getFilter(e, t) {
    const [i, n] = Ee.pattern.partitionAbsoluteAndRelative(t), s = {
      positive: {
        all: Ee.pattern.convertPatternsToRe(e, this._micromatchOptions)
      },
      negative: {
        absolute: Ee.pattern.convertPatternsToRe(i, Object.assign(Object.assign({}, this._micromatchOptions), { dot: !0 })),
        relative: Ee.pattern.convertPatternsToRe(n, Object.assign(Object.assign({}, this._micromatchOptions), { dot: !0 }))
      }
    };
    return (a) => this._filter(a, s);
  }
  _filter(e, t) {
    const i = Ee.path.removeLeadingDotSegment(e.path);
    if (this._settings.unique && this._isDuplicateEntry(i) || this._onlyFileFilter(e) || this._onlyDirectoryFilter(e))
      return !1;
    const n = this._isMatchToPatternsSet(i, t, e.dirent.isDirectory());
    return this._settings.unique && n && this._createIndexRecord(i), n;
  }
  _isDuplicateEntry(e) {
    return this.index.has(e);
  }
  _createIndexRecord(e) {
    this.index.set(e, void 0);
  }
  _onlyFileFilter(e) {
    return this._settings.onlyFiles && !e.dirent.isFile();
  }
  _onlyDirectoryFilter(e) {
    return this._settings.onlyDirectories && !e.dirent.isDirectory();
  }
  _isMatchToPatternsSet(e, t, i) {
    return !(!this._isMatchToPatterns(e, t.positive.all, i) || this._isMatchToPatterns(e, t.negative.relative, i) || this._isMatchToAbsoluteNegative(e, t.negative.absolute, i));
  }
  _isMatchToAbsoluteNegative(e, t, i) {
    if (t.length === 0)
      return !1;
    const n = Ee.path.makeAbsolute(this._settings.cwd, e);
    return this._isMatchToPatterns(n, t, i);
  }
  _isMatchToPatterns(e, t, i) {
    if (t.length === 0)
      return !1;
    const n = Ee.pattern.matchAny(e, t);
    return !n && i ? Ee.pattern.matchAny(e + "/", t) : n;
  }
}
Ci.default = kc;
var Pi = {};
Object.defineProperty(Pi, "__esModule", { value: !0 });
const Oc = N;
class xc {
  constructor(e) {
    this._settings = e;
  }
  getFilter() {
    return (e) => this._isNonFatalError(e);
  }
  _isNonFatalError(e) {
    return Oc.errno.isEnoentCodeError(e) || this._settings.suppressErrors;
  }
}
Pi.default = xc;
var Ai = {};
Object.defineProperty(Ai, "__esModule", { value: !0 });
const An = N;
class Ic {
  constructor(e) {
    this._settings = e;
  }
  getTransformer() {
    return (e) => this._transform(e);
  }
  _transform(e) {
    let t = e.path;
    return this._settings.absolute && (t = An.path.makeAbsolute(this._settings.cwd, t), t = An.path.unixify(t)), this._settings.markDirectories && e.dirent.isDirectory() && (t += "/"), this._settings.objectMode ? Object.assign(Object.assign({}, e), { path: t }) : t;
  }
}
Ai.default = Ic;
Object.defineProperty(dt, "__esModule", { value: !0 });
const Dc = _e, Lc = _i, Mc = Ci, Fc = Pi, $c = Ai;
class Nc {
  constructor(e) {
    this._settings = e, this.errorFilter = new Fc.default(this._settings), this.entryFilter = new Mc.default(this._settings, this._getMicromatchOptions()), this.deepFilter = new Lc.default(this._settings, this._getMicromatchOptions()), this.entryTransformer = new $c.default(this._settings);
  }
  _getRootDirectory(e) {
    return Dc.resolve(this._settings.cwd, e.base);
  }
  _getReaderOptions(e) {
    const t = e.base === "." ? "" : e.base;
    return {
      basePath: t,
      pathSegmentSeparator: "/",
      concurrency: this._settings.concurrency,
      deepFilter: this.deepFilter.getFilter(t, e.positive, e.negative),
      entryFilter: this.entryFilter.getFilter(e.positive, e.negative),
      errorFilter: this.errorFilter.getFilter(),
      followSymbolicLinks: this._settings.followSymbolicLinks,
      fs: this._settings.fs,
      stats: this._settings.stats,
      throwErrorOnBrokenSymbolicLink: this._settings.throwErrorOnBrokenSymbolicLink,
      transform: this.entryTransformer.getTransformer()
    };
  }
  _getMicromatchOptions() {
    return {
      dot: this._settings.dot,
      matchBase: this._settings.baseNameMatch,
      nobrace: !this._settings.braceExpansion,
      nocase: !this._settings.caseSensitiveMatch,
      noext: !this._settings.extglob,
      noglobstar: !this._settings.globstar,
      posix: !0,
      strictSlashes: !1
    };
  }
}
dt.default = Nc;
Object.defineProperty(ui, "__esModule", { value: !0 });
const Bc = ci, Uc = dt;
class Hc extends Uc.default {
  constructor() {
    super(...arguments), this._reader = new Bc.default(this._settings);
  }
  async read(e) {
    const t = this._getRootDirectory(e), i = this._getReaderOptions(e);
    return (await this.api(t, e, i)).map((s) => i.transform(s));
  }
  api(e, t, i) {
    return t.dynamic ? this._reader.dynamic(e, i) : this._reader.static(t.patterns, i);
  }
}
ui.default = Hc;
var Ri = {};
Object.defineProperty(Ri, "__esModule", { value: !0 });
const Gc = Nt, jc = ir, Vc = dt;
class Wc extends Vc.default {
  constructor() {
    super(...arguments), this._reader = new jc.default(this._settings);
  }
  read(e) {
    const t = this._getRootDirectory(e), i = this._getReaderOptions(e), n = this.api(t, e, i), s = new Gc.Readable({ objectMode: !0, read: () => {
    } });
    return n.once("error", (a) => s.emit("error", a)).on("data", (a) => s.emit("data", i.transform(a))).once("end", () => s.emit("end")), s.once("close", () => n.destroy()), s;
  }
  api(e, t, i) {
    return t.dynamic ? this._reader.dynamic(e, i) : this._reader.static(t.patterns, i);
  }
}
Ri.default = Wc;
var Ei = {}, wi = {};
Object.defineProperty(wi, "__esModule", { value: !0 });
const zc = se, Kc = le, Xc = ht;
class qc extends Xc.default {
  constructor() {
    super(...arguments), this._walkSync = Kc.walkSync, this._statSync = zc.statSync;
  }
  dynamic(e, t) {
    return this._walkSync(e, t);
  }
  static(e, t) {
    const i = [];
    for (const n of e) {
      const s = this._getFullEntryPath(n), a = this._getEntry(s, n, t);
      a === null || !t.entryFilter(a) || i.push(a);
    }
    return i;
  }
  _getEntry(e, t, i) {
    try {
      const n = this._getStat(e);
      return this._makeEntry(n, t);
    } catch (n) {
      if (i.errorFilter(n))
        return null;
      throw n;
    }
  }
  _getStat(e) {
    return this._statSync(e, this._fsStatSettings);
  }
}
wi.default = qc;
Object.defineProperty(Ei, "__esModule", { value: !0 });
const Yc = wi, Qc = dt;
class Jc extends Qc.default {
  constructor() {
    super(...arguments), this._reader = new Yc.default(this._settings);
  }
  read(e) {
    const t = this._getRootDirectory(e), i = this._getReaderOptions(e);
    return this.api(t, e, i).map(i.transform);
  }
  api(e, t, i) {
    return t.dynamic ? this._reader.dynamic(e, i) : this._reader.static(t.patterns, i);
  }
}
Ei.default = Jc;
var xs = {};
(function(r) {
  Object.defineProperty(r, "__esModule", { value: !0 }), r.DEFAULT_FILE_SYSTEM_ADAPTER = void 0;
  const e = Vr, i = Math.max(jr.cpus().length, 1);
  r.DEFAULT_FILE_SYSTEM_ADAPTER = {
    lstat: e.lstat,
    lstatSync: e.lstatSync,
    stat: e.stat,
    statSync: e.statSync,
    readdir: e.readdir,
    readdirSync: e.readdirSync
  };
  class n {
    constructor(a = {}) {
      this._options = a, this.absolute = this._getValue(this._options.absolute, !1), this.baseNameMatch = this._getValue(this._options.baseNameMatch, !1), this.braceExpansion = this._getValue(this._options.braceExpansion, !0), this.caseSensitiveMatch = this._getValue(this._options.caseSensitiveMatch, !0), this.concurrency = this._getValue(this._options.concurrency, i), this.cwd = this._getValue(this._options.cwd, process.cwd()), this.deep = this._getValue(this._options.deep, 1 / 0), this.dot = this._getValue(this._options.dot, !1), this.extglob = this._getValue(this._options.extglob, !0), this.followSymbolicLinks = this._getValue(this._options.followSymbolicLinks, !0), this.fs = this._getFileSystemMethods(this._options.fs), this.globstar = this._getValue(this._options.globstar, !0), this.ignore = this._getValue(this._options.ignore, []), this.markDirectories = this._getValue(this._options.markDirectories, !1), this.objectMode = this._getValue(this._options.objectMode, !1), this.onlyDirectories = this._getValue(this._options.onlyDirectories, !1), this.onlyFiles = this._getValue(this._options.onlyFiles, !0), this.stats = this._getValue(this._options.stats, !1), this.suppressErrors = this._getValue(this._options.suppressErrors, !1), this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, !1), this.unique = this._getValue(this._options.unique, !0), this.onlyDirectories && (this.onlyFiles = !1), this.stats && (this.objectMode = !0), this.ignore = [].concat(this.ignore);
    }
    _getValue(a, o) {
      return a === void 0 ? o : a;
    }
    _getFileSystemMethods(a = {}) {
      return Object.assign(Object.assign({}, r.DEFAULT_FILE_SYSTEM_ADAPTER), a);
    }
  }
  r.default = n;
})(xs);
const Is = Y, Zc = ui, ef = Ri, tf = Ei, Br = xs, oe = N;
async function Ur(r, e) {
  ce(r);
  const t = Hr(r, Zc.default, e), i = await Promise.all(t);
  return oe.array.flatten(i);
}
(function(r) {
  r.glob = r, r.globSync = e, r.globStream = t, r.async = r;
  function e(o, l) {
    ce(o);
    const c = Hr(o, tf.default, l);
    return oe.array.flatten(c);
  }
  r.sync = e;
  function t(o, l) {
    ce(o);
    const c = Hr(o, ef.default, l);
    return oe.stream.merge(c);
  }
  r.stream = t;
  function i(o, l) {
    ce(o);
    const c = [].concat(o), u = new Br.default(l);
    return Is.generate(c, u);
  }
  r.generateTasks = i;
  function n(o, l) {
    ce(o);
    const c = new Br.default(l);
    return oe.pattern.isDynamicPattern(o, c);
  }
  r.isDynamicPattern = n;
  function s(o) {
    return ce(o), oe.path.escape(o);
  }
  r.escapePath = s;
  function a(o) {
    return ce(o), oe.path.convertPathToPattern(o);
  }
  r.convertPathToPattern = a, function(o) {
    function l(u) {
      return ce(u), oe.path.escapePosixPath(u);
    }
    o.escapePath = l;
    function c(u) {
      return ce(u), oe.path.convertPosixPathToPattern(u);
    }
    o.convertPathToPattern = c;
  }(r.posix || (r.posix = {})), function(o) {
    function l(u) {
      return ce(u), oe.path.escapeWindowsPath(u);
    }
    o.escapePath = l;
    function c(u) {
      return ce(u), oe.path.convertWindowsPathToPattern(u);
    }
    o.convertPathToPattern = c;
  }(r.win32 || (r.win32 = {}));
})(Ur || (Ur = {}));
function Hr(r, e, t) {
  const i = [].concat(r), n = new Br.default(t), s = Is.generate(i, n), a = new e(n);
  return s.map(a.read, a);
}
function ce(r) {
  if (![].concat(r).every((i) => oe.string.isString(i) && !oe.string.isEmpty(i)))
    throw new TypeError("Patterns must be a string (non empty) or an array of strings");
}
var rf = Ur;
const nf = /* @__PURE__ */ pa(rf), Ds = Ae.dirname(Hs(import.meta.url));
process.env.APP_ROOT = Ae.join(Ds, "..");
const Gr = process.env.VITE_DEV_SERVER_URL, _f = Ae.join(process.env.APP_ROOT, "dist-electron"), Ls = Ae.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = Gr ? Ae.join(process.env.APP_ROOT, "public") : Ls;
let we;
function Ms() {
  we = new Rn({
    icon: Ae.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: Ae.join(Ds, "preload.mjs")
    }
  }), we.webContents.on("did-finish-load", () => {
    we == null || we.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), Gr ? we.loadURL(Gr) : we.loadFile(Ae.join(Ls, "index.html"));
}
Et.on("window-all-closed", () => {
  process.platform !== "darwin" && (Et.quit(), we = null);
});
Et.on("activate", () => {
  Rn.getAllWindows().length === 0 && Ms();
});
Et.whenReady().then(() => {
  Ke.handle("scan-directory", async (r, e) => {
    try {
      const t = Array.isArray(e) ? e : [e], i = [];
      for (const s of t)
        try {
          const a = await sr(s);
          if (!a.isDirectory()) {
            i.push({
              path: s,
              name: Ae.basename(s),
              isDirectory: !1,
              size: a.size
            });
            continue;
          }
          const l = (await nf(["*"], {
            cwd: s,
            stats: !0,
            onlyFiles: !1,
            absolute: !0,
            deep: 1
          })).map((c) => {
            var u;
            return {
              path: c.path,
              name: c.name,
              isDirectory: c.dirent.isDirectory(),
              size: (u = c.stats) == null ? void 0 : u.size
            };
          });
          i.push(...l);
        } catch (a) {
          console.error(`Failed to process path ${s}:`, a);
        }
      return Array.from(new Map(i.map((s) => [s.path, s])).values());
    } catch (t) {
      return console.error("Failed to scan paths:", t), [];
    }
  }), Ke.handle("open-dialog", async () => {
    const { canceled: r, filePaths: e } = await Ns.showOpenDialog({
      properties: ["openDirectory", "openFile", "multiSelections"]
    });
    return r ? null : e;
  }), Ke.handle("rename-files", async (r, e) => {
    if (!e || !Array.isArray(e.operations))
      return { success: !1, error: "Invalid plan format" };
    let t = 0, i = "";
    for (const n of e.operations)
      try {
        n.original && n.new && (await Bs(n.original, n.new), t++);
      } catch (s) {
        console.error(`Rename failed for ${n.original} -> ${n.new}`, s), i || (i = s.message);
      }
    return t === e.operations.length ? { success: !0, count: t } : { success: !1, count: t, error: i || "Partial failure" };
  }), Ke.handle("read-file-content", async (r, e) => {
    try {
      if ((await sr(e)).size > 50 * 1024)
        return { success: !1, error: "File too large (>50KB)" };
      const i = await Ti(e);
      return i.indexOf(0) !== -1 ? { success: !1, error: "Binary file detected" } : { success: !0, content: i.toString("utf-8") };
    } catch (t) {
      return console.error("Failed to read file:", t), { success: !1, error: t.message };
    }
  }), Ke.handle("read-image-exif", async (r, e) => {
    try {
      return { success: !0, exif: await ua.parse(e) };
    } catch (t) {
      return console.error("Failed to read EXIF:", t), { success: !1, error: t.message };
    }
  }), Ke.handle("read-file-buffer", async (r, e) => {
    try {
      return (await sr(e)).size > 5 * 1024 * 1024 ? { success: !1, error: "File too large (>5MB)" } : { success: !0, buffer: (await Ti(e)).toString("base64") };
    } catch (t) {
      return console.error("Failed to read file buffer:", t), { success: !1, error: t.message };
    }
  }), Ms();
});
export {
  _f as MAIN_DIST,
  Ls as RENDERER_DIST,
  Gr as VITE_DEV_SERVER_URL
};
