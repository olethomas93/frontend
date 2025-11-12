/**
* @vue/shared v3.4.19
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function Ts(e, t) {
  const n = new Set(e.split(","));
  return t ? (o) => n.has(o.toLowerCase()) : (o) => n.has(o);
}
const Pe = {}, Mn = [], st = () => {
}, Ed = () => !1, Yi = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), Is = (e) => e.startsWith("onUpdate:"), Le = Object.assign, Os = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, $d = Object.prototype.hasOwnProperty, $e = (e, t) => $d.call(e, t), ge = Array.isArray, Pn = (e) => Wi(e) === "[object Map]", $u = (e) => Wi(e) === "[object Set]", _e = (e) => typeof e == "function", Oe = (e) => typeof e == "string", Xn = (e) => typeof e == "symbol", Te = (e) => e !== null && typeof e == "object", Cu = (e) => (Te(e) || _e(e)) && _e(e.then) && _e(e.catch), Su = Object.prototype.toString, Wi = (e) => Su.call(e), Cd = (e) => Wi(e).slice(8, -1), Nu = (e) => Wi(e) === "[object Object]", Ds = (e) => Oe(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, ro = /* @__PURE__ */ Ts(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), Xi = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, Sd = /-(\w)/g, tt = Xi((e) => e.replace(Sd, (t, n) => n ? n.toUpperCase() : "")), Nd = /\B([A-Z])/g, ct = Xi(
  (e) => e.replace(Nd, "-$1").toLowerCase()
), Ji = Xi((e) => e.charAt(0).toUpperCase() + e.slice(1)), Cr = Xi((e) => e ? `on${Ji(e)}` : ""), At = (e, t) => !Object.is(e, t), Sr = (e, t) => {
  for (let n = 0; n < e.length; n++)
    e[n](t);
}, yi = (e, t, n) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    value: n
  });
}, Ad = (e) => {
  const t = parseFloat(e);
  return isNaN(t) ? e : t;
}, Nl = (e) => {
  const t = Oe(e) ? Number(e) : NaN;
  return isNaN(t) ? e : t;
};
let Al;
const Au = () => Al || (Al = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function ze(e) {
  if (ge(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const o = e[n], i = Oe(o) ? Id(o) : ze(o);
      if (i)
        for (const r in i)
          t[r] = i[r];
    }
    return t;
  } else if (Oe(e) || Te(e))
    return e;
}
const Md = /;(?![^(]*\))/g, Pd = /:([^]+)/, Td = /\/\*[^]*?\*\//g;
function Id(e) {
  const t = {};
  return e.replace(Td, "").split(Md).forEach((n) => {
    if (n) {
      const o = n.split(Pd);
      o.length > 1 && (t[o[0].trim()] = o[1].trim());
    }
  }), t;
}
function We(e) {
  let t = "";
  if (Oe(e))
    t = e;
  else if (ge(e))
    for (let n = 0; n < e.length; n++) {
      const o = We(e[n]);
      o && (t += o + " ");
    }
  else if (Te(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
function Od(e) {
  if (!e)
    return null;
  let { class: t, style: n } = e;
  return t && !Oe(t) && (e.class = We(t)), n && (e.style = ze(n)), e;
}
const Dd = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", kd = /* @__PURE__ */ Ts(Dd);
function Mu(e) {
  return !!e || e === "";
}
const wi = (e) => Oe(e) ? e : e == null ? "" : ge(e) || Te(e) && (e.toString === Su || !_e(e.toString)) ? JSON.stringify(e, Pu, 2) : String(e), Pu = (e, t) => t && t.__v_isRef ? Pu(e, t.value) : Pn(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce(
    (n, [o, i], r) => (n[Nr(o, r) + " =>"] = i, n),
    {}
  )
} : $u(t) ? {
  [`Set(${t.size})`]: [...t.values()].map((n) => Nr(n))
} : Xn(t) ? Nr(t) : Te(t) && !ge(t) && !Nu(t) ? String(t) : t, Nr = (e, t = "") => {
  var n;
  return Xn(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e;
};
let rt;
class Tu {
  constructor(t = !1) {
    this.detached = t, this._active = !0, this.effects = [], this.cleanups = [], this.parent = rt, !t && rt && (this.index = (rt.scopes || (rt.scopes = [])).push(
      this
    ) - 1);
  }
  get active() {
    return this._active;
  }
  run(t) {
    if (this._active) {
      const n = rt;
      try {
        return rt = this, t();
      } finally {
        rt = n;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    rt = this;
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    rt = this.parent;
  }
  stop(t) {
    if (this._active) {
      let n, o;
      for (n = 0, o = this.effects.length; n < o; n++)
        this.effects[n].stop();
      for (n = 0, o = this.cleanups.length; n < o; n++)
        this.cleanups[n]();
      if (this.scopes)
        for (n = 0, o = this.scopes.length; n < o; n++)
          this.scopes[n].stop(!0);
      if (!this.detached && this.parent && !t) {
        const i = this.parent.scopes.pop();
        i && i !== this && (this.parent.scopes[this.index] = i, i.index = this.index);
      }
      this.parent = void 0, this._active = !1;
    }
  }
}
function Iu(e) {
  return new Tu(e);
}
function Rd(e, t = rt) {
  t && t.active && t.effects.push(e);
}
function ks() {
  return rt;
}
function li(e) {
  rt && rt.cleanups.push(e);
}
let hn;
class Rs {
  constructor(t, n, o, i) {
    this.fn = t, this.trigger = n, this.scheduler = o, this.active = !0, this.deps = [], this._dirtyLevel = 4, this._trackId = 0, this._runnings = 0, this._shouldSchedule = !1, this._depsLength = 0, Rd(this, i);
  }
  get dirty() {
    if (this._dirtyLevel === 2 || this._dirtyLevel === 3) {
      this._dirtyLevel = 1, nn();
      for (let t = 0; t < this._depsLength; t++) {
        const n = this.deps[t];
        if (n.computed && (zd(n.computed), this._dirtyLevel >= 4))
          break;
      }
      this._dirtyLevel === 1 && (this._dirtyLevel = 0), on();
    }
    return this._dirtyLevel >= 4;
  }
  set dirty(t) {
    this._dirtyLevel = t ? 4 : 0;
  }
  run() {
    if (this._dirtyLevel = 0, !this.active)
      return this.fn();
    let t = jt, n = hn;
    try {
      return jt = !0, hn = this, this._runnings++, Ml(this), this.fn();
    } finally {
      Pl(this), this._runnings--, hn = n, jt = t;
    }
  }
  stop() {
    var t;
    this.active && (Ml(this), Pl(this), (t = this.onStop) == null || t.call(this), this.active = !1);
  }
}
function zd(e) {
  return e.value;
}
function Ml(e) {
  e._trackId++, e._depsLength = 0;
}
function Pl(e) {
  if (e.deps.length > e._depsLength) {
    for (let t = e._depsLength; t < e.deps.length; t++)
      Ou(e.deps[t], e);
    e.deps.length = e._depsLength;
  }
}
function Ou(e, t) {
  const n = e.get(t);
  n !== void 0 && t._trackId !== n && (e.delete(t), e.size === 0 && e.cleanup());
}
let jt = !0, Xr = 0;
const Du = [];
function nn() {
  Du.push(jt), jt = !1;
}
function on() {
  const e = Du.pop();
  jt = e === void 0 ? !0 : e;
}
function zs() {
  Xr++;
}
function Hs() {
  for (Xr--; !Xr && Jr.length; )
    Jr.shift()();
}
function ku(e, t, n) {
  if (t.get(e) !== e._trackId) {
    t.set(e, e._trackId);
    const o = e.deps[e._depsLength];
    o !== t ? (o && Ou(o, e), e.deps[e._depsLength++] = t) : e._depsLength++;
  }
}
const Jr = [];
function Ru(e, t, n) {
  zs();
  for (const o of e.keys()) {
    let i;
    o._dirtyLevel < t && (i ?? (i = e.get(o) === o._trackId)) && (o._shouldSchedule || (o._shouldSchedule = o._dirtyLevel === 0), o._dirtyLevel = t), o._shouldSchedule && (i ?? (i = e.get(o) === o._trackId)) && (o.trigger(), (!o._runnings || o.allowRecurse) && o._dirtyLevel !== 2 && (o._shouldSchedule = !1, o.scheduler && Jr.push(o.scheduler)));
  }
  Hs();
}
const zu = (e, t) => {
  const n = /* @__PURE__ */ new Map();
  return n.cleanup = e, n.computed = t, n;
}, bi = /* @__PURE__ */ new WeakMap(), pn = Symbol(""), Kr = Symbol("");
function ot(e, t, n) {
  if (jt && hn) {
    let o = bi.get(e);
    o || bi.set(e, o = /* @__PURE__ */ new Map());
    let i = o.get(n);
    i || o.set(n, i = zu(() => o.delete(n))), ku(
      hn,
      i
    );
  }
}
function zt(e, t, n, o, i, r) {
  const s = bi.get(e);
  if (!s)
    return;
  let l = [];
  if (t === "clear")
    l = [...s.values()];
  else if (n === "length" && ge(e)) {
    const a = Number(o);
    s.forEach((u, c) => {
      (c === "length" || !Xn(c) && c >= a) && l.push(u);
    });
  } else
    switch (n !== void 0 && l.push(s.get(n)), t) {
      case "add":
        ge(e) ? Ds(n) && l.push(s.get("length")) : (l.push(s.get(pn)), Pn(e) && l.push(s.get(Kr)));
        break;
      case "delete":
        ge(e) || (l.push(s.get(pn)), Pn(e) && l.push(s.get(Kr)));
        break;
      case "set":
        Pn(e) && l.push(s.get(pn));
        break;
    }
  zs();
  for (const a of l)
    a && Ru(
      a,
      4
    );
  Hs();
}
function Hd(e, t) {
  var n;
  return (n = bi.get(e)) == null ? void 0 : n.get(t);
}
const Fd = /* @__PURE__ */ Ts("__proto__,__v_isRef,__isVue"), Hu = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(Xn)
), Tl = /* @__PURE__ */ Vd();
function Vd() {
  const e = {};
  return ["includes", "indexOf", "lastIndexOf"].forEach((t) => {
    e[t] = function(...n) {
      const o = xe(this);
      for (let r = 0, s = this.length; r < s; r++)
        ot(o, "get", r + "");
      const i = o[t](...n);
      return i === -1 || i === !1 ? o[t](...n.map(xe)) : i;
    };
  }), ["push", "pop", "shift", "unshift", "splice"].forEach((t) => {
    e[t] = function(...n) {
      nn(), zs();
      const o = xe(this)[t].apply(this, n);
      return Hs(), on(), o;
    };
  }), e;
}
function Bd(e) {
  const t = xe(this);
  return ot(t, "has", e), t.hasOwnProperty(e);
}
class Fu {
  constructor(t = !1, n = !1) {
    this._isReadonly = t, this._shallow = n;
  }
  get(t, n, o) {
    const i = this._isReadonly, r = this._shallow;
    if (n === "__v_isReactive")
      return !i;
    if (n === "__v_isReadonly")
      return i;
    if (n === "__v_isShallow")
      return r;
    if (n === "__v_raw")
      return o === (i ? r ? eh : Uu : r ? Lu : Bu).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the reciever is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(o) ? t : void 0;
    const s = ge(t);
    if (!i) {
      if (s && $e(Tl, n))
        return Reflect.get(Tl, n, o);
      if (n === "hasOwnProperty")
        return Bd;
    }
    const l = Reflect.get(t, n, o);
    return (Xn(n) ? Hu.has(n) : Fd(n)) || (i || ot(t, "get", n), r) ? l : Fe(l) ? s && Ds(n) ? l : l.value : Te(l) ? i ? qi(l) : Oo(l) : l;
  }
}
class Vu extends Fu {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, o, i) {
    let r = t[n];
    if (!this._shallow) {
      const a = Hn(r);
      if (!xi(o) && !Hn(o) && (r = xe(r), o = xe(o)), !ge(t) && Fe(r) && !Fe(o))
        return a ? !1 : (r.value = o, !0);
    }
    const s = ge(t) && Ds(n) ? Number(n) < t.length : $e(t, n), l = Reflect.set(t, n, o, i);
    return t === xe(i) && (s ? At(o, r) && zt(t, "set", n, o) : zt(t, "add", n, o)), l;
  }
  deleteProperty(t, n) {
    const o = $e(t, n);
    t[n];
    const i = Reflect.deleteProperty(t, n);
    return i && o && zt(t, "delete", n, void 0), i;
  }
  has(t, n) {
    const o = Reflect.has(t, n);
    return (!Xn(n) || !Hu.has(n)) && ot(t, "has", n), o;
  }
  ownKeys(t) {
    return ot(
      t,
      "iterate",
      ge(t) ? "length" : pn
    ), Reflect.ownKeys(t);
  }
}
class Ld extends Fu {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, n) {
    return !0;
  }
  deleteProperty(t, n) {
    return !0;
  }
}
const Ud = /* @__PURE__ */ new Vu(), Gd = /* @__PURE__ */ new Ld(), Yd = /* @__PURE__ */ new Vu(
  !0
), Fs = (e) => e, Ki = (e) => Reflect.getPrototypeOf(e);
function Vo(e, t, n = !1, o = !1) {
  e = e.__v_raw;
  const i = xe(e), r = xe(t);
  n || (At(t, r) && ot(i, "get", t), ot(i, "get", r));
  const { has: s } = Ki(i), l = o ? Fs : n ? Ls : _o;
  if (s.call(i, t))
    return l(e.get(t));
  if (s.call(i, r))
    return l(e.get(r));
  e !== i && e.get(t);
}
function Bo(e, t = !1) {
  const n = this.__v_raw, o = xe(n), i = xe(e);
  return t || (At(e, i) && ot(o, "has", e), ot(o, "has", i)), e === i ? n.has(e) : n.has(e) || n.has(i);
}
function Lo(e, t = !1) {
  return e = e.__v_raw, !t && ot(xe(e), "iterate", pn), Reflect.get(e, "size", e);
}
function Il(e) {
  e = xe(e);
  const t = xe(this);
  return Ki(t).has.call(t, e) || (t.add(e), zt(t, "add", e, e)), this;
}
function Ol(e, t) {
  t = xe(t);
  const n = xe(this), { has: o, get: i } = Ki(n);
  let r = o.call(n, e);
  r || (e = xe(e), r = o.call(n, e));
  const s = i.call(n, e);
  return n.set(e, t), r ? At(t, s) && zt(n, "set", e, t) : zt(n, "add", e, t), this;
}
function Dl(e) {
  const t = xe(this), { has: n, get: o } = Ki(t);
  let i = n.call(t, e);
  i || (e = xe(e), i = n.call(t, e)), o && o.call(t, e);
  const r = t.delete(e);
  return i && zt(t, "delete", e, void 0), r;
}
function kl() {
  const e = xe(this), t = e.size !== 0, n = e.clear();
  return t && zt(e, "clear", void 0, void 0), n;
}
function Uo(e, t) {
  return function(o, i) {
    const r = this, s = r.__v_raw, l = xe(s), a = t ? Fs : e ? Ls : _o;
    return !e && ot(l, "iterate", pn), s.forEach((u, c) => o.call(i, a(u), a(c), r));
  };
}
function Go(e, t, n) {
  return function(...o) {
    const i = this.__v_raw, r = xe(i), s = Pn(r), l = e === "entries" || e === Symbol.iterator && s, a = e === "keys" && s, u = i[e](...o), c = n ? Fs : t ? Ls : _o;
    return !t && ot(
      r,
      "iterate",
      a ? Kr : pn
    ), {
      // iterator protocol
      next() {
        const { value: f, done: d } = u.next();
        return d ? { value: f, done: d } : {
          value: l ? [c(f[0]), c(f[1])] : c(f),
          done: d
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function Ut(e) {
  return function(...t) {
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function Wd() {
  const e = {
    get(r) {
      return Vo(this, r);
    },
    get size() {
      return Lo(this);
    },
    has: Bo,
    add: Il,
    set: Ol,
    delete: Dl,
    clear: kl,
    forEach: Uo(!1, !1)
  }, t = {
    get(r) {
      return Vo(this, r, !1, !0);
    },
    get size() {
      return Lo(this);
    },
    has: Bo,
    add: Il,
    set: Ol,
    delete: Dl,
    clear: kl,
    forEach: Uo(!1, !0)
  }, n = {
    get(r) {
      return Vo(this, r, !0);
    },
    get size() {
      return Lo(this, !0);
    },
    has(r) {
      return Bo.call(this, r, !0);
    },
    add: Ut("add"),
    set: Ut("set"),
    delete: Ut("delete"),
    clear: Ut("clear"),
    forEach: Uo(!0, !1)
  }, o = {
    get(r) {
      return Vo(this, r, !0, !0);
    },
    get size() {
      return Lo(this, !0);
    },
    has(r) {
      return Bo.call(this, r, !0);
    },
    add: Ut("add"),
    set: Ut("set"),
    delete: Ut("delete"),
    clear: Ut("clear"),
    forEach: Uo(!0, !0)
  };
  return ["keys", "values", "entries", Symbol.iterator].forEach((r) => {
    e[r] = Go(
      r,
      !1,
      !1
    ), n[r] = Go(
      r,
      !0,
      !1
    ), t[r] = Go(
      r,
      !1,
      !0
    ), o[r] = Go(
      r,
      !0,
      !0
    );
  }), [
    e,
    n,
    t,
    o
  ];
}
const [
  Xd,
  Jd,
  Kd,
  qd
] = /* @__PURE__ */ Wd();
function Vs(e, t) {
  const n = t ? e ? qd : Kd : e ? Jd : Xd;
  return (o, i, r) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_raw" ? o : Reflect.get(
    $e(n, i) && i in o ? n : o,
    i,
    r
  );
}
const Zd = {
  get: /* @__PURE__ */ Vs(!1, !1)
}, Qd = {
  get: /* @__PURE__ */ Vs(!1, !0)
}, jd = {
  get: /* @__PURE__ */ Vs(!0, !1)
}, Bu = /* @__PURE__ */ new WeakMap(), Lu = /* @__PURE__ */ new WeakMap(), Uu = /* @__PURE__ */ new WeakMap(), eh = /* @__PURE__ */ new WeakMap();
function th(e) {
  switch (e) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function nh(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : th(Cd(e));
}
function Oo(e) {
  return Hn(e) ? e : Bs(
    e,
    !1,
    Ud,
    Zd,
    Bu
  );
}
function oh(e) {
  return Bs(
    e,
    !1,
    Yd,
    Qd,
    Lu
  );
}
function qi(e) {
  return Bs(
    e,
    !0,
    Gd,
    jd,
    Uu
  );
}
function Bs(e, t, n, o, i) {
  if (!Te(e) || e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const r = i.get(e);
  if (r)
    return r;
  const s = nh(e);
  if (s === 0)
    return e;
  const l = new Proxy(
    e,
    s === 2 ? o : n
  );
  return i.set(e, l), l;
}
function Tn(e) {
  return Hn(e) ? Tn(e.__v_raw) : !!(e && e.__v_isReactive);
}
function Hn(e) {
  return !!(e && e.__v_isReadonly);
}
function xi(e) {
  return !!(e && e.__v_isShallow);
}
function Gu(e) {
  return Tn(e) || Hn(e);
}
function xe(e) {
  const t = e && e.__v_raw;
  return t ? xe(t) : e;
}
function ft(e) {
  return Object.isExtensible(e) && yi(e, "__v_skip", !0), e;
}
const _o = (e) => Te(e) ? Oo(e) : e, Ls = (e) => Te(e) ? qi(e) : e;
class Yu {
  constructor(t, n, o, i) {
    this._setter = n, this.dep = void 0, this.__v_isRef = !0, this.__v_isReadonly = !1, this.effect = new Rs(
      () => t(this._value),
      () => so(
        this,
        this.effect._dirtyLevel === 2 ? 2 : 3
      )
    ), this.effect.computed = this, this.effect.active = this._cacheable = !i, this.__v_isReadonly = o;
  }
  get value() {
    const t = xe(this);
    return (!t._cacheable || t.effect.dirty) && At(t._value, t._value = t.effect.run()) && so(t, 4), Us(t), t.effect._dirtyLevel >= 2 && so(t, 2), t._value;
  }
  set value(t) {
    this._setter(t);
  }
  // #region polyfill _dirty for backward compatibility third party code for Vue <= 3.3.x
  get _dirty() {
    return this.effect.dirty;
  }
  set _dirty(t) {
    this.effect.dirty = t;
  }
  // #endregion
}
function ih(e, t, n = !1) {
  let o, i;
  const r = _e(e);
  return r ? (o = e, i = st) : (o = e.get, i = e.set), new Yu(o, i, r || !i, n);
}
function Us(e) {
  var t;
  jt && hn && (e = xe(e), ku(
    hn,
    (t = e.dep) != null ? t : e.dep = zu(
      () => e.dep = void 0,
      e instanceof Yu ? e : void 0
    )
  ));
}
function so(e, t = 4, n) {
  e = xe(e);
  const o = e.dep;
  o && Ru(
    o,
    t
  );
}
function Fe(e) {
  return !!(e && e.__v_isRef === !0);
}
function be(e) {
  return rh(e, !1);
}
function rh(e, t) {
  return Fe(e) ? e : new sh(e, t);
}
class sh {
  constructor(t, n) {
    this.__v_isShallow = n, this.dep = void 0, this.__v_isRef = !0, this._rawValue = n ? t : xe(t), this._value = n ? t : _o(t);
  }
  get value() {
    return Us(this), this._value;
  }
  set value(t) {
    const n = this.__v_isShallow || xi(t) || Hn(t);
    t = n ? t : xe(t), At(t, this._rawValue) && (this._rawValue = t, this._value = n ? t : _o(t), so(this, 4));
  }
}
function G(e) {
  return Fe(e) ? e.value : e;
}
const lh = {
  get: (e, t, n) => G(Reflect.get(e, t, n)),
  set: (e, t, n, o) => {
    const i = e[t];
    return Fe(i) && !Fe(n) ? (i.value = n, !0) : Reflect.set(e, t, n, o);
  }
};
function Wu(e) {
  return Tn(e) ? e : new Proxy(e, lh);
}
class ah {
  constructor(t) {
    this.dep = void 0, this.__v_isRef = !0;
    const { get: n, set: o } = t(
      () => Us(this),
      () => so(this)
    );
    this._get = n, this._set = o;
  }
  get value() {
    return this._get();
  }
  set value(t) {
    this._set(t);
  }
}
function Gs(e) {
  return new ah(e);
}
function uh(e) {
  const t = ge(e) ? new Array(e.length) : {};
  for (const n in e)
    t[n] = Xu(e, n);
  return t;
}
class ch {
  constructor(t, n, o) {
    this._object = t, this._key = n, this._defaultValue = o, this.__v_isRef = !0;
  }
  get value() {
    const t = this._object[this._key];
    return t === void 0 ? this._defaultValue : t;
  }
  set value(t) {
    this._object[this._key] = t;
  }
  get dep() {
    return Hd(xe(this._object), this._key);
  }
}
class fh {
  constructor(t) {
    this._getter = t, this.__v_isRef = !0, this.__v_isReadonly = !0;
  }
  get value() {
    return this._getter();
  }
}
function ke(e, t, n) {
  return Fe(e) ? e : _e(e) ? new fh(e) : Te(e) && arguments.length > 1 ? Xu(e, t, n) : be(e);
}
function Xu(e, t, n) {
  const o = e[t];
  return Fe(o) ? o : new ch(e, t, n);
}
var lo = { ALLUSERSPROFILE: "C:\\ProgramData", APPDATA: "C:\\Users\\JMHJAN\\AppData\\Roaming", ChocolateyInstall: "C:\\ProgramData\\chocolatey", ChocolateyLastPathUpdate: "133389135576090422", CHROME_CRASHPAD_PIPE_NAME: "\\\\.\\pipe\\crashpad_25180_KXBCAKYGAELWKVPL", COLOR: "1", COLORTERM: "truecolor", CommonProgramFiles: "C:\\Program Files\\Common Files", "CommonProgramFiles(x86)": "C:\\Program Files (x86)\\Common Files", CommonProgramW6432: "C:\\Program Files\\Common Files", COMPUTERNAME: "LAPTOP_JOERGEN", ComSpec: "C:\\Windows\\system32\\cmd.exe", DriverData: "C:\\Windows\\System32\\Drivers\\DriverData", EDITOR: "C:\\Windows\\notepad.exe", EFC_2352: "1", GIT_ASKPASS: "c:\\Users\\JMHJAN\\AppData\\Local\\Programs\\Microsoft VS Code\\resources\\app\\extensions\\git\\dist\\askpass.sh", GOPATH: "C:\\Users\\JMHJAN\\go", HOME: "C:\\Users\\JMHJAN", HOMEDRIVE: "C:", HOMEPATH: "\\Users\\JMHJAN", IGCCSVC_DB: "AQAAANCMnd8BFdERjHoAwE/Cl+sBAAAAQkSqH1ewk02HRLVBM/L7hwQAAAACAAAAAAAQZgAAAAEAACAAAAB1TGMIwFc2etDaIT1zP4yA02PpXcsk0OCqCuuvrMoHqwAAAAAOgAAAAAIAACAAAACABU6LadoSaxSH74pw7zxAoswMbahh+tyQeNt4q1Cb62AAAACueDWviHtZGwXhnUmISDM6leMoqYV/LMRcU1u8oDZeQZdtbeUDVZMO6IbFnGVe6hdT8ctGoOQvkP86mWQ15QKr+tmh3agdCDW0A7yUNCrIu+GybX6v8uKzX2dHugM0KH9AAAAAakm4BLT0fmKlepg5eA6PCGC05a9BLgqSZompzAO4dqhaljExGudnQPSDJviCZFtoaixncAk3US7NkTRBgRwWTQ==", INIT_CWD: "C:\\repos\\vue-flow-test", LANG: "en_US.UTF-8", lib: "C:\\Program Files (x86)\\SQLXML 3.0\\bin\\", LOCALAPPDATA: "C:\\Users\\JMHJAN\\AppData\\Local", LOGONSERVER: "\\\\LAPTOP_JOERGEN", MOZ_PLUGIN_PATH: "C:\\Program Files (x86)\\Foxit Software\\Foxit PDF Reader\\plugins\\", NODE: "C:\\Program Files\\nodejs\\node.exe", NODE_ENV: "production", NODE_EXE: "C:\\Program Files\\nodejs\\\\node.exe", NPM_CLI_JS: "C:\\Program Files\\nodejs\\node_modules\\npm\\bin\\npm-cli.js", npm_command: "run-script", npm_config_cache: "C:\\Users\\JMHJAN\\AppData\\Local\\npm-cache", npm_config_globalconfig: "C:\\Program Files\\nodejs\\etc\\npmrc", npm_config_global_prefix: "C:\\Program Files\\nodejs", npm_config_init_module: "C:\\Users\\JMHJAN\\.npm-init.js", npm_config_local_prefix: "C:\\repos\\vue-flow-test", npm_config_node_gyp: "C:\\Users\\JMHJAN\\AppData\\Roaming\\nvm\\v18.19.0\\node_modules\\npm\\node_modules\\node-gyp\\bin\\node-gyp.js", npm_config_noproxy: "", npm_config_npm_version: "10.2.3", npm_config_prefix: "C:\\Program Files\\nodejs", npm_config_userconfig: "C:\\Users\\JMHJAN\\.npmrc", npm_config_user_agent: "npm/10.2.3 node/v18.19.0 win32 x64 workspaces/false", npm_execpath: "C:\\Users\\JMHJAN\\AppData\\Roaming\\nvm\\v18.19.0\\node_modules\\npm\\bin\\npm-cli.js", npm_lifecycle_event: "build", npm_lifecycle_script: "vue-tsc --noEmit && vite build", npm_node_execpath: "C:\\Program Files\\nodejs\\node.exe", npm_package_json: "C:\\repos\\vue-flow-test\\package.json", npm_package_name: "vue-flow-test", npm_package_version: "0.0.0", NPM_PREFIX_NPM_CLI_JS: "C:\\Program Files\\nodejs\\node_modules\\npm\\bin\\npm-cli.js", NUMBER_OF_PROCESSORS: "24", NVM_HOME: "C:\\Users\\JMHJAN\\AppData\\Roaming\\nvm", NVM_SYMLINK: "C:\\Program Files\\nodejs", OculusBase: "C:\\Program Files\\Oculus\\", OneDrive: "C:\\Users\\JMHJAN\\OneDrivePrivat\\OneDrive", OneDriveConsumer: "C:\\Users\\JMHJAN\\OneDrivePrivat\\OneDrive", ORIGINAL_XDG_CURRENT_DESKTOP: "undefined", OS: "Windows_NT", Path: "C:\\repos\\vue-flow-test\\node_modules\\.bin;C:\\repos\\node_modules\\.bin;C:\\node_modules\\.bin;C:\\Users\\JMHJAN\\AppData\\Roaming\\nvm\\v18.19.0\\node_modules\\npm\\node_modules\\@npmcli\\run-script\\lib\\node-gyp-bin;C:\\Program Files\\Python311\\Scripts\\;C:\\Program Files\\Python311\\;C:\\Program Files\\Oculus\\Support\\oculus-runtime;C:\\Python311\\Scripts\\;C:\\Python311\\;C:\\Windows\\system32;C:\\Windows;C:\\Windows\\System32\\Wbem;C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\;C:\\Windows\\System32\\OpenSSH\\;C:\\Program Files\\dotnet\\;C:\\ProgramData\\chocolatey\\bin;C:\\Program Files\\Tailscale\\;C:\\Windows\\system32\\Tani;C:\\Program Files\\Git\\cmd;C:\\Program Files\\Go\\bin;C:\\Program Files\\PuTTY\\;%NVM_HOME%;%NVM_SYMLINK%;C:\\Program Files\\Docker\\Docker\\resources\\bin;C:\\Users\\JMHJAN\\AppData\\Local\\Microsoft\\WindowsApps;C:\\Users\\JMHJAN\\AppData\\Local\\Programs\\Microsoft VS Code\\bin;C:\\Program Files (x86)\\Nmap;C:\\Users\\JMHJAN\\go\\bin;C:\\Users\\JMHJAN\\AppData\\Roaming\\nvm;C:\\Program Files\\nodejs", PATHEXT: ".COM;.EXE;.BAT;.CMD;.VBS;.VBE;.JS;.JSE;.WSF;.WSH;.MSC;.PY;.PYW;.CPL", PROCESSOR_ARCHITECTURE: "AMD64", PROCESSOR_IDENTIFIER: "Intel64 Family 6 Model 191 Stepping 2, GenuineIntel", PROCESSOR_LEVEL: "6", PROCESSOR_REVISION: "bf02", ProgramData: "C:\\ProgramData", ProgramFiles: "C:\\Program Files", "ProgramFiles(x86)": "C:\\Program Files (x86)", ProgramW6432: "C:\\Program Files", PROMPT: "$P$G", PSModulePath: "C:\\Users\\JMHJAN\\Documents\\WindowsPowerShell\\Modules;C:\\Program Files\\WindowsPowerShell\\Modules;C:\\Windows\\system32\\WindowsPowerShell\\v1.0\\Modules", PUBLIC: "C:\\Users\\Public", SESSIONNAME: "Console", SystemDrive: "C:", SystemRoot: "C:\\Windows", TEMP: "C:\\Users\\JMHJAN\\AppData\\Local\\Temp", TERM_PROGRAM: "vscode", TERM_PROGRAM_VERSION: "1.86.2", TMP: "C:\\Users\\JMHJAN\\AppData\\Local\\Temp", USERDNSDOMAIN: "doorway.loc", USERDOMAIN: "DOORWAY", USERDOMAIN_ROAMINGPROFILE: "DOORWAY", USERNAME: "JMHJAN", USERPROFILE: "C:\\Users\\JMHJAN", VSCODE_GIT_ASKPASS_EXTRA_ARGS: "", VSCODE_GIT_ASKPASS_MAIN: "c:\\Users\\JMHJAN\\AppData\\Local\\Programs\\Microsoft VS Code\\resources\\app\\extensions\\git\\dist\\askpass-main.js", VSCODE_GIT_ASKPASS_NODE: "C:\\Users\\JMHJAN\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe", VSCODE_GIT_IPC_HANDLE: "\\\\.\\pipe\\vscode-git-ebe95352d0-sock", VSCODE_INJECTION: "1", VSCODE_NONCE: "bd882d3e-f614-49d3-be9c-cd8c6c7e3d1d", windir: "C:\\Windows", ZES_ENABLE_SYSMAN: "1" };
const ao = [];
function dh(e, ...t) {
  nn();
  const n = ao.length ? ao[ao.length - 1].component : null, o = n && n.appContext.config.warnHandler, i = hh();
  if (o)
    Ht(
      o,
      n,
      11,
      [
        e + t.join(""),
        n && n.proxy,
        i.map(
          ({ vnode: r }) => `at <${Mc(n, r.type)}>`
        ).join(`
`),
        i
      ]
    );
  else {
    const r = [`[Vue warn]: ${e}`, ...t];
    i.length && r.push(`
`, ...ph(i)), console.warn(...r);
  }
  on();
}
function hh() {
  let e = ao[ao.length - 1];
  if (!e)
    return [];
  const t = [];
  for (; e; ) {
    const n = t[0];
    n && n.vnode === e ? n.recurseCount++ : t.push({
      vnode: e,
      recurseCount: 0
    });
    const o = e.component && e.component.parent;
    e = o && o.vnode;
  }
  return t;
}
function ph(e) {
  const t = [];
  return e.forEach((n, o) => {
    t.push(...o === 0 ? [] : [`
`], ...gh(n));
  }), t;
}
function gh({ vnode: e, recurseCount: t }) {
  const n = t > 0 ? `... (${t} recursive calls)` : "", o = e.component ? e.component.parent == null : !1, i = ` at <${Mc(
    e.component,
    e.type,
    o
  )}`, r = ">" + n;
  return e.props ? [i, ...mh(e.props), r] : [i + r];
}
function mh(e) {
  const t = [], n = Object.keys(e);
  return n.slice(0, 3).forEach((o) => {
    t.push(...Ju(o, e[o]));
  }), n.length > 3 && t.push(" ..."), t;
}
function Ju(e, t, n) {
  return Oe(t) ? (t = JSON.stringify(t), n ? t : [`${e}=${t}`]) : typeof t == "number" || typeof t == "boolean" || t == null ? n ? t : [`${e}=${t}`] : Fe(t) ? (t = Ju(e, xe(t.value), !0), n ? t : [`${e}=Ref<`, t, ">"]) : _e(t) ? [`${e}=fn${t.name ? `<${t.name}>` : ""}`] : (t = xe(t), n ? t : [`${e}=`, t]);
}
function Ht(e, t, n, o) {
  try {
    return o ? e(...o) : e();
  } catch (i) {
    Zi(i, t, n);
  }
}
function _t(e, t, n, o) {
  if (_e(e)) {
    const r = Ht(e, t, n, o);
    return r && Cu(r) && r.catch((s) => {
      Zi(s, t, n);
    }), r;
  }
  const i = [];
  for (let r = 0; r < e.length; r++)
    i.push(_t(e[r], t, n, o));
  return i;
}
function Zi(e, t, n, o = !0) {
  const i = t ? t.vnode : null;
  if (t) {
    let r = t.parent;
    const s = t.proxy, l = `https://vuejs.org/error-reference/#runtime-${n}`;
    for (; r; ) {
      const u = r.ec;
      if (u) {
        for (let c = 0; c < u.length; c++)
          if (u[c](e, s, l) === !1)
            return;
      }
      r = r.parent;
    }
    const a = t.appContext.config.errorHandler;
    if (a) {
      Ht(
        a,
        null,
        10,
        [e, s, l]
      );
      return;
    }
  }
  vh(e, n, i, o);
}
function vh(e, t, n, o = !0) {
  console.error(e);
}
let yo = !1, qr = !1;
const Je = [];
let Ct = 0;
const In = [];
let Wt = null, ln = 0;
const Ku = /* @__PURE__ */ Promise.resolve();
let Ys = null;
function nt(e) {
  const t = Ys || Ku;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function _h(e) {
  let t = Ct + 1, n = Je.length;
  for (; t < n; ) {
    const o = t + n >>> 1, i = Je[o], r = wo(i);
    r < e || r === e && i.pre ? t = o + 1 : n = o;
  }
  return t;
}
function Ws(e) {
  (!Je.length || !Je.includes(
    e,
    yo && e.allowRecurse ? Ct + 1 : Ct
  )) && (e.id == null ? Je.push(e) : Je.splice(_h(e.id), 0, e), qu());
}
function qu() {
  !yo && !qr && (qr = !0, Ys = Ku.then(Qu));
}
function yh(e) {
  const t = Je.indexOf(e);
  t > Ct && Je.splice(t, 1);
}
function wh(e) {
  ge(e) ? In.push(...e) : (!Wt || !Wt.includes(
    e,
    e.allowRecurse ? ln + 1 : ln
  )) && In.push(e), qu();
}
function Rl(e, t, n = yo ? Ct + 1 : 0) {
  for (; n < Je.length; n++) {
    const o = Je[n];
    if (o && o.pre) {
      if (e && o.id !== e.uid)
        continue;
      Je.splice(n, 1), n--, o();
    }
  }
}
function Zu(e) {
  if (In.length) {
    const t = [...new Set(In)].sort(
      (n, o) => wo(n) - wo(o)
    );
    if (In.length = 0, Wt) {
      Wt.push(...t);
      return;
    }
    for (Wt = t, ln = 0; ln < Wt.length; ln++)
      Wt[ln]();
    Wt = null, ln = 0;
  }
}
const wo = (e) => e.id == null ? 1 / 0 : e.id, bh = (e, t) => {
  const n = wo(e) - wo(t);
  if (n === 0) {
    if (e.pre && !t.pre)
      return -1;
    if (t.pre && !e.pre)
      return 1;
  }
  return n;
};
function Qu(e) {
  qr = !1, yo = !0, Je.sort(bh);
  const t = st;
  try {
    for (Ct = 0; Ct < Je.length; Ct++) {
      const n = Je[Ct];
      n && n.active !== !1 && (lo.NODE_ENV !== "production" && t(n), Ht(n, null, 14));
    }
  } finally {
    Ct = 0, Je.length = 0, Zu(), yo = !1, Ys = null, (Je.length || In.length) && Qu();
  }
}
function xh(e, t, ...n) {
  if (e.isUnmounted)
    return;
  const o = e.vnode.props || Pe;
  let i = n;
  const r = t.startsWith("update:"), s = r && t.slice(7);
  if (s && s in o) {
    const c = `${s === "modelValue" ? "model" : s}Modifiers`, { number: f, trim: d } = o[c] || Pe;
    d && (i = n.map((p) => Oe(p) ? p.trim() : p)), f && (i = n.map(Ad));
  }
  let l, a = o[l = Cr(t)] || // also try camelCase event handler (#2249)
  o[l = Cr(tt(t))];
  !a && r && (a = o[l = Cr(ct(t))]), a && _t(
    a,
    e,
    6,
    i
  );
  const u = o[l + "Once"];
  if (u) {
    if (!e.emitted)
      e.emitted = {};
    else if (e.emitted[l])
      return;
    e.emitted[l] = !0, _t(
      u,
      e,
      6,
      i
    );
  }
}
function ju(e, t, n = !1) {
  const o = t.emitsCache, i = o.get(e);
  if (i !== void 0)
    return i;
  const r = e.emits;
  let s = {}, l = !1;
  if (!_e(e)) {
    const a = (u) => {
      const c = ju(u, t, !0);
      c && (l = !0, Le(s, c));
    };
    !n && t.mixins.length && t.mixins.forEach(a), e.extends && a(e.extends), e.mixins && e.mixins.forEach(a);
  }
  return !r && !l ? (Te(e) && o.set(e, null), null) : (ge(r) ? r.forEach((a) => s[a] = null) : Le(s, r), Te(e) && o.set(e, s), s);
}
function Qi(e, t) {
  return !e || !Yi(t) ? !1 : (t = t.slice(2).replace(/Once$/, ""), $e(e, t[0].toLowerCase() + t.slice(1)) || $e(e, ct(t)) || $e(e, t));
}
let Ke = null, ec = null;
function Ei(e) {
  const t = Ke;
  return Ke = e, ec = e && e.type.__scopeId || null, t;
}
function Qe(e, t = Ke, n) {
  if (!t || e._n)
    return e;
  const o = (...i) => {
    o._d && Kl(-1);
    const r = Ei(t);
    let s;
    try {
      s = e(...i);
    } finally {
      Ei(r), o._d && Kl(1);
    }
    return s;
  };
  return o._n = !0, o._c = !0, o._d = !0, o;
}
function Ar(e) {
  const {
    type: t,
    vnode: n,
    proxy: o,
    withProxy: i,
    props: r,
    propsOptions: [s],
    slots: l,
    attrs: a,
    emit: u,
    render: c,
    renderCache: f,
    data: d,
    setupState: p,
    ctx: E,
    inheritAttrs: m
  } = e;
  let _, b;
  const C = Ei(e);
  try {
    if (n.shapeFlag & 4) {
      const y = i || o, D = lo.NODE_ENV !== "production" && p.__isScriptSetup ? new Proxy(y, {
        get(O, S, V) {
          return dh(
            `Property '${String(
              S
            )}' was accessed via 'this'. Avoid using 'this' in templates.`
          ), Reflect.get(O, S, V);
        }
      }) : y;
      _ = $t(
        c.call(
          D,
          y,
          f,
          r,
          p,
          d,
          E
        )
      ), b = a;
    } else {
      const y = t;
      lo.NODE_ENV, _ = $t(
        y.length > 1 ? y(
          r,
          lo.NODE_ENV !== "production" ? {
            get attrs() {
              return a;
            },
            slots: l,
            emit: u
          } : { attrs: a, slots: l, emit: u }
        ) : y(
          r,
          null
          /* we know it doesn't need it */
        )
      ), b = t.props ? a : Eh(a);
    }
  } catch (y) {
    po.length = 0, Zi(y, e, 1), _ = me(tn);
  }
  let N = _;
  if (b && m !== !1) {
    const y = Object.keys(b), { shapeFlag: D } = N;
    y.length && D & 7 && (s && y.some(Is) && (b = $h(
      b,
      s
    )), N = Vn(N, b));
  }
  return n.dirs && (N = Vn(N), N.dirs = N.dirs ? N.dirs.concat(n.dirs) : n.dirs), n.transition && (N.transition = n.transition), _ = N, Ei(C), _;
}
const Eh = (e) => {
  let t;
  for (const n in e)
    (n === "class" || n === "style" || Yi(n)) && ((t || (t = {}))[n] = e[n]);
  return t;
}, $h = (e, t) => {
  const n = {};
  for (const o in e)
    (!Is(o) || !(o.slice(9) in t)) && (n[o] = e[o]);
  return n;
};
function Ch(e, t, n) {
  const { props: o, children: i, component: r } = e, { props: s, children: l, patchFlag: a } = t, u = r.emitsOptions;
  if (t.dirs || t.transition)
    return !0;
  if (n && a >= 0) {
    if (a & 1024)
      return !0;
    if (a & 16)
      return o ? zl(o, s, u) : !!s;
    if (a & 8) {
      const c = t.dynamicProps;
      for (let f = 0; f < c.length; f++) {
        const d = c[f];
        if (s[d] !== o[d] && !Qi(u, d))
          return !0;
      }
    }
  } else
    return (i || l) && (!l || !l.$stable) ? !0 : o === s ? !1 : o ? s ? zl(o, s, u) : !0 : !!s;
  return !1;
}
function zl(e, t, n) {
  const o = Object.keys(t);
  if (o.length !== Object.keys(e).length)
    return !0;
  for (let i = 0; i < o.length; i++) {
    const r = o[i];
    if (t[r] !== e[r] && !Qi(n, r))
      return !0;
  }
  return !1;
}
function Sh({ vnode: e, parent: t }, n) {
  for (; t; ) {
    const o = t.subTree;
    if (o.suspense && o.suspense.activeBranch === e && (o.el = e.el), o === e)
      (e = t.vnode).el = n, t = t.parent;
    else
      break;
  }
}
const Xs = "components";
function tc(e, t) {
  return oc(Xs, e, !0, t) || e;
}
const nc = Symbol.for("v-ndc");
function an(e) {
  return Oe(e) ? oc(Xs, e, !1) || e : e || nc;
}
function oc(e, t, n = !0, o = !1) {
  const i = Ke || Be;
  if (i) {
    const r = i.type;
    if (e === Xs) {
      const l = Ac(
        r,
        !1
      );
      if (l && (l === t || l === tt(t) || l === Ji(tt(t))))
        return r;
    }
    const s = (
      // local registration
      // check instance[type] first which is resolved for options API
      Hl(i[e] || r[e], t) || // global registration
      Hl(i.appContext[e], t)
    );
    return !s && o ? r : s;
  }
}
function Hl(e, t) {
  return e && (e[t] || e[tt(t)] || e[Ji(tt(t))]);
}
const Nh = (e) => e.__isSuspense;
function Ah(e, t) {
  t && t.pendingBranch ? ge(e) ? t.effects.push(...e) : t.effects.push(e) : wh(e);
}
const Mh = Symbol.for("v-scx"), Ph = () => lt(Mh);
function ic(e, t) {
  return ji(e, null, t);
}
function Th(e, t) {
  return ji(
    e,
    null,
    { flush: "sync" }
  );
}
const Yo = {};
function we(e, t, n) {
  return ji(e, t, n);
}
function ji(e, t, {
  immediate: n,
  deep: o,
  flush: i,
  once: r,
  onTrack: s,
  onTrigger: l
} = Pe) {
  if (t && r) {
    const O = t;
    t = (...S) => {
      O(...S), D();
    };
  }
  const a = Be, u = (O) => o === !0 ? O : (
    // for deep: false, only traverse root-level properties
    Sn(O, o === !1 ? 1 : void 0)
  );
  let c, f = !1, d = !1;
  if (Fe(e) ? (c = () => e.value, f = xi(e)) : Tn(e) ? (c = () => u(e), f = !0) : ge(e) ? (d = !0, f = e.some((O) => Tn(O) || xi(O)), c = () => e.map((O) => {
    if (Fe(O))
      return O.value;
    if (Tn(O))
      return u(O);
    if (_e(O))
      return Ht(O, a, 2);
  })) : _e(e) ? t ? c = () => Ht(e, a, 2) : c = () => (p && p(), _t(
    e,
    a,
    3,
    [E]
  )) : c = st, t && o) {
    const O = c;
    c = () => Sn(O());
  }
  let p, E = (O) => {
    p = N.onStop = () => {
      Ht(O, a, 4), p = N.onStop = void 0;
    };
  }, m;
  if (sr)
    if (E = st, t ? n && _t(t, a, 3, [
      c(),
      d ? [] : void 0,
      E
    ]) : c(), i === "sync") {
      const O = Ph();
      m = O.__watcherHandles || (O.__watcherHandles = []);
    } else
      return st;
  let _ = d ? new Array(e.length).fill(Yo) : Yo;
  const b = () => {
    if (!(!N.active || !N.dirty))
      if (t) {
        const O = N.run();
        (o || f || (d ? O.some((S, V) => At(S, _[V])) : At(O, _))) && (p && p(), _t(t, a, 3, [
          O,
          // pass undefined as the old value when it's changed for the first time
          _ === Yo ? void 0 : d && _[0] === Yo ? [] : _,
          E
        ]), _ = O);
      } else
        N.run();
  };
  b.allowRecurse = !!t;
  let C;
  i === "sync" ? C = b : i === "post" ? C = () => Ze(b, a && a.suspense) : (b.pre = !0, a && (b.id = a.uid), C = () => Ws(b));
  const N = new Rs(c, st, C), y = ks(), D = () => {
    N.stop(), y && Os(y.effects, N);
  };
  return t ? n ? b() : _ = N.run() : i === "post" ? Ze(
    N.run.bind(N),
    a && a.suspense
  ) : N.run(), m && m.push(D), D;
}
function Ih(e, t, n) {
  const o = this.proxy, i = Oe(e) ? e.includes(".") ? rc(o, e) : () => o[e] : e.bind(o, o);
  let r;
  _e(t) ? r = t : (r = t.handler, n = t);
  const s = ko(this), l = ji(i, r.bind(o), n);
  return s(), l;
}
function rc(e, t) {
  const n = t.split(".");
  return () => {
    let o = e;
    for (let i = 0; i < n.length && o; i++)
      o = o[n[i]];
    return o;
  };
}
function Sn(e, t, n = 0, o) {
  if (!Te(e) || e.__v_skip)
    return e;
  if (t && t > 0) {
    if (n >= t)
      return e;
    n++;
  }
  if (o = o || /* @__PURE__ */ new Set(), o.has(e))
    return e;
  if (o.add(e), Fe(e))
    Sn(e.value, t, n, o);
  else if (ge(e))
    for (let i = 0; i < e.length; i++)
      Sn(e[i], t, n, o);
  else if ($u(e) || Pn(e))
    e.forEach((i) => {
      Sn(i, t, n, o);
    });
  else if (Nu(e))
    for (const i in e)
      Sn(e[i], t, n, o);
  return e;
}
function rn(e, t, n, o) {
  const i = e.dirs, r = t && t.dirs;
  for (let s = 0; s < i.length; s++) {
    const l = i[s];
    r && (l.oldValue = r[s].value);
    let a = l.dir[o];
    a && (nn(), _t(a, n, 8, [
      e.el,
      l,
      e,
      t
    ]), on());
  }
}
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function Se(e, t) {
  return _e(e) ? (
    // #8326: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    Le({ name: e.name }, t, { setup: e })
  ) : e;
}
const uo = (e) => !!e.type.__asyncLoader, sc = (e) => e.type.__isKeepAlive;
function Oh(e, t) {
  lc(e, "a", t);
}
function Dh(e, t) {
  lc(e, "da", t);
}
function lc(e, t, n = Be) {
  const o = e.__wdc || (e.__wdc = () => {
    let i = n;
    for (; i; ) {
      if (i.isDeactivated)
        return;
      i = i.parent;
    }
    return e();
  });
  if (er(t, o, n), n) {
    let i = n.parent;
    for (; i && i.parent; )
      sc(i.parent.vnode) && kh(o, t, n, i), i = i.parent;
  }
}
function kh(e, t, n, o) {
  const i = er(
    t,
    e,
    o,
    !0
    /* prepend */
  );
  nr(() => {
    Os(o[t], i);
  }, n);
}
function er(e, t, n = Be, o = !1) {
  if (n) {
    const i = n[e] || (n[e] = []), r = t.__weh || (t.__weh = (...s) => {
      if (n.isUnmounted)
        return;
      nn();
      const l = ko(n), a = _t(t, n, e, s);
      return l(), on(), a;
    });
    return o ? i.unshift(r) : i.push(r), r;
  }
}
const Lt = (e) => (t, n = Be) => (
  // post-create lifecycle registrations are noops during SSR (except for serverPrefetch)
  (!sr || e === "sp") && er(e, (...o) => t(...o), n)
), ac = Lt("bm"), En = Lt("m"), Rh = Lt("bu"), zh = Lt("u"), tr = Lt("bum"), nr = Lt("um"), Hh = Lt("sp"), Fh = Lt(
  "rtg"
), Vh = Lt(
  "rtc"
);
function Bh(e, t = Be) {
  er("ec", e, t);
}
function Fn(e, t, n, o) {
  let i;
  const r = n && n[o];
  if (ge(e) || Oe(e)) {
    i = new Array(e.length);
    for (let s = 0, l = e.length; s < l; s++)
      i[s] = t(e[s], s, void 0, r && r[s]);
  } else if (typeof e == "number") {
    i = new Array(e);
    for (let s = 0; s < e; s++)
      i[s] = t(s + 1, s, void 0, r && r[s]);
  } else if (Te(e))
    if (e[Symbol.iterator])
      i = Array.from(
        e,
        (s, l) => t(s, l, void 0, r && r[l])
      );
    else {
      const s = Object.keys(e);
      i = new Array(s.length);
      for (let l = 0, a = s.length; l < a; l++) {
        const u = s[l];
        i[l] = t(e[u], u, l, r && r[l]);
      }
    }
  else
    i = [];
  return n && (n[o] = i), i;
}
function De(e, t, n = {}, o, i) {
  if (Ke.isCE || Ke.parent && uo(Ke.parent) && Ke.parent.isCE)
    return t !== "default" && (n.name = t), me("slot", n, o && o());
  let r = e[t];
  r && r._c && (r._d = !1), re();
  const s = r && uc(r(n)), l = Ve(
    Me,
    {
      key: n.key || // slot content array of a dynamic conditional slot may have a branch
      // key attached in the `createSlots` helper, respect that
      s && s.key || `_${t}`
    },
    s || (o ? o() : []),
    s && e._ === 1 ? 64 : -2
  );
  return !i && l.scopeId && (l.slotScopeIds = [l.scopeId + "-s"]), r && r._c && (r._d = !0), l;
}
function uc(e) {
  return e.some((t) => Si(t) ? !(t.type === tn || t.type === Me && !uc(t.children)) : !0) ? e : null;
}
const Zr = (e) => e ? Cc(e) ? js(e) || e.proxy : Zr(e.parent) : null, co = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ Le(/* @__PURE__ */ Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => e.props,
    $attrs: (e) => e.attrs,
    $slots: (e) => e.slots,
    $refs: (e) => e.refs,
    $parent: (e) => Zr(e.parent),
    $root: (e) => Zr(e.root),
    $emit: (e) => e.emit,
    $options: (e) => Ks(e),
    $forceUpdate: (e) => e.f || (e.f = () => {
      e.effect.dirty = !0, Ws(e.update);
    }),
    $nextTick: (e) => e.n || (e.n = nt.bind(e.proxy)),
    $watch: (e) => Ih.bind(e)
  })
), Mr = (e, t) => e !== Pe && !e.__isScriptSetup && $e(e, t), Lh = {
  get({ _: e }, t) {
    const { ctx: n, setupState: o, data: i, props: r, accessCache: s, type: l, appContext: a } = e;
    let u;
    if (t[0] !== "$") {
      const p = s[t];
      if (p !== void 0)
        switch (p) {
          case 1:
            return o[t];
          case 2:
            return i[t];
          case 4:
            return n[t];
          case 3:
            return r[t];
        }
      else {
        if (Mr(o, t))
          return s[t] = 1, o[t];
        if (i !== Pe && $e(i, t))
          return s[t] = 2, i[t];
        if (
          // only cache other properties when instance has declared (thus stable)
          // props
          (u = e.propsOptions[0]) && $e(u, t)
        )
          return s[t] = 3, r[t];
        if (n !== Pe && $e(n, t))
          return s[t] = 4, n[t];
        Qr && (s[t] = 0);
      }
    }
    const c = co[t];
    let f, d;
    if (c)
      return t === "$attrs" && ot(e, "get", t), c(e);
    if (
      // css module (injected by vue-loader)
      (f = l.__cssModules) && (f = f[t])
    )
      return f;
    if (n !== Pe && $e(n, t))
      return s[t] = 4, n[t];
    if (
      // global properties
      d = a.config.globalProperties, $e(d, t)
    )
      return d[t];
  },
  set({ _: e }, t, n) {
    const { data: o, setupState: i, ctx: r } = e;
    return Mr(i, t) ? (i[t] = n, !0) : o !== Pe && $e(o, t) ? (o[t] = n, !0) : $e(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (r[t] = n, !0);
  },
  has({
    _: { data: e, setupState: t, accessCache: n, ctx: o, appContext: i, propsOptions: r }
  }, s) {
    let l;
    return !!n[s] || e !== Pe && $e(e, s) || Mr(t, s) || (l = r[0]) && $e(l, s) || $e(o, s) || $e(co, s) || $e(i.config.globalProperties, s);
  },
  defineProperty(e, t, n) {
    return n.get != null ? e._.accessCache[t] = 0 : $e(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n);
  }
};
function cc() {
  return fc().slots;
}
function Js() {
  return fc().attrs;
}
function fc() {
  const e = Do();
  return e.setupContext || (e.setupContext = Nc(e));
}
function $i(e) {
  return ge(e) ? e.reduce(
    (t, n) => (t[n] = null, t),
    {}
  ) : e;
}
function Fl(e, t) {
  return !e || !t ? e || t : ge(e) && ge(t) ? e.concat(t) : Le({}, $i(e), $i(t));
}
function dc(e, t) {
  const n = {};
  for (const o in e)
    t.includes(o) || Object.defineProperty(n, o, {
      enumerable: !0,
      get: () => e[o]
    });
  return n;
}
let Qr = !0;
function Uh(e) {
  const t = Ks(e), n = e.proxy, o = e.ctx;
  Qr = !1, t.beforeCreate && Vl(t.beforeCreate, e, "bc");
  const {
    // state
    data: i,
    computed: r,
    methods: s,
    watch: l,
    provide: a,
    inject: u,
    // lifecycle
    created: c,
    beforeMount: f,
    mounted: d,
    beforeUpdate: p,
    updated: E,
    activated: m,
    deactivated: _,
    beforeDestroy: b,
    beforeUnmount: C,
    destroyed: N,
    unmounted: y,
    render: D,
    renderTracked: O,
    renderTriggered: S,
    errorCaptured: V,
    serverPrefetch: X,
    // public API
    expose: Y,
    inheritAttrs: W,
    // assets
    components: le,
    directives: K,
    filters: g
  } = t;
  if (u && Gh(u, o, null), s)
    for (const P in s) {
      const I = s[P];
      _e(I) && (o[P] = I.bind(n));
    }
  if (i) {
    const P = i.call(n, n);
    Te(P) && (e.data = Oo(P));
  }
  if (Qr = !0, r)
    for (const P in r) {
      const I = r[P], T = _e(I) ? I.bind(n, n) : _e(I.get) ? I.get.bind(n, n) : st, M = !_e(I) && _e(I.set) ? I.set.bind(n) : st, U = he({
        get: T,
        set: M
      });
      Object.defineProperty(o, P, {
        enumerable: !0,
        configurable: !0,
        get: () => U.value,
        set: (q) => U.value = q
      });
    }
  if (l)
    for (const P in l)
      hc(l[P], o, n, P);
  if (a) {
    const P = _e(a) ? a.call(n) : a;
    Reflect.ownKeys(P).forEach((I) => {
      en(I, P[I]);
    });
  }
  c && Vl(c, e, "c");
  function w(P, I) {
    ge(I) ? I.forEach((T) => P(T.bind(n))) : I && P(I.bind(n));
  }
  if (w(ac, f), w(En, d), w(Rh, p), w(zh, E), w(Oh, m), w(Dh, _), w(Bh, V), w(Vh, O), w(Fh, S), w(tr, C), w(nr, y), w(Hh, X), ge(Y))
    if (Y.length) {
      const P = e.exposed || (e.exposed = {});
      Y.forEach((I) => {
        Object.defineProperty(P, I, {
          get: () => n[I],
          set: (T) => n[I] = T
        });
      });
    } else
      e.exposed || (e.exposed = {});
  D && e.render === st && (e.render = D), W != null && (e.inheritAttrs = W), le && (e.components = le), K && (e.directives = K);
}
function Gh(e, t, n = st) {
  ge(e) && (e = jr(e));
  for (const o in e) {
    const i = e[o];
    let r;
    Te(i) ? "default" in i ? r = lt(
      i.from || o,
      i.default,
      !0
    ) : r = lt(i.from || o) : r = lt(i), Fe(r) ? Object.defineProperty(t, o, {
      enumerable: !0,
      configurable: !0,
      get: () => r.value,
      set: (s) => r.value = s
    }) : t[o] = r;
  }
}
function Vl(e, t, n) {
  _t(
    ge(e) ? e.map((o) => o.bind(t.proxy)) : e.bind(t.proxy),
    t,
    n
  );
}
function hc(e, t, n, o) {
  const i = o.includes(".") ? rc(n, o) : () => n[o];
  if (Oe(e)) {
    const r = t[e];
    _e(r) && we(i, r);
  } else if (_e(e))
    we(i, e.bind(n));
  else if (Te(e))
    if (ge(e))
      e.forEach((r) => hc(r, t, n, o));
    else {
      const r = _e(e.handler) ? e.handler.bind(n) : t[e.handler];
      _e(r) && we(i, r, e);
    }
}
function Ks(e) {
  const t = e.type, { mixins: n, extends: o } = t, {
    mixins: i,
    optionsCache: r,
    config: { optionMergeStrategies: s }
  } = e.appContext, l = r.get(t);
  let a;
  return l ? a = l : !i.length && !n && !o ? a = t : (a = {}, i.length && i.forEach(
    (u) => Ci(a, u, s, !0)
  ), Ci(a, t, s)), Te(t) && r.set(t, a), a;
}
function Ci(e, t, n, o = !1) {
  const { mixins: i, extends: r } = t;
  r && Ci(e, r, n, !0), i && i.forEach(
    (s) => Ci(e, s, n, !0)
  );
  for (const s in t)
    if (!(o && s === "expose")) {
      const l = Yh[s] || n && n[s];
      e[s] = l ? l(e[s], t[s]) : t[s];
    }
  return e;
}
const Yh = {
  data: Bl,
  props: Ll,
  emits: Ll,
  // objects
  methods: eo,
  computed: eo,
  // lifecycle
  beforeCreate: qe,
  created: qe,
  beforeMount: qe,
  mounted: qe,
  beforeUpdate: qe,
  updated: qe,
  beforeDestroy: qe,
  beforeUnmount: qe,
  destroyed: qe,
  unmounted: qe,
  activated: qe,
  deactivated: qe,
  errorCaptured: qe,
  serverPrefetch: qe,
  // assets
  components: eo,
  directives: eo,
  // watch
  watch: Xh,
  // provide / inject
  provide: Bl,
  inject: Wh
};
function Bl(e, t) {
  return t ? e ? function() {
    return Le(
      _e(e) ? e.call(this, this) : e,
      _e(t) ? t.call(this, this) : t
    );
  } : t : e;
}
function Wh(e, t) {
  return eo(jr(e), jr(t));
}
function jr(e) {
  if (ge(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++)
      t[e[n]] = e[n];
    return t;
  }
  return e;
}
function qe(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function eo(e, t) {
  return e ? Le(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Ll(e, t) {
  return e ? ge(e) && ge(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : Le(
    /* @__PURE__ */ Object.create(null),
    $i(e),
    $i(t ?? {})
  ) : t;
}
function Xh(e, t) {
  if (!e)
    return t;
  if (!t)
    return e;
  const n = Le(/* @__PURE__ */ Object.create(null), e);
  for (const o in t)
    n[o] = qe(e[o], t[o]);
  return n;
}
function pc() {
  return {
    app: null,
    config: {
      isNativeTag: Ed,
      performance: !1,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let Jh = 0;
function Kh(e, t) {
  return function(o, i = null) {
    _e(o) || (o = Le({}, o)), i != null && !Te(i) && (i = null);
    const r = pc(), s = /* @__PURE__ */ new WeakSet();
    let l = !1;
    const a = r.app = {
      _uid: Jh++,
      _component: o,
      _props: i,
      _container: null,
      _context: r,
      _instance: null,
      version: Ep,
      get config() {
        return r.config;
      },
      set config(u) {
      },
      use(u, ...c) {
        return s.has(u) || (u && _e(u.install) ? (s.add(u), u.install(a, ...c)) : _e(u) && (s.add(u), u(a, ...c))), a;
      },
      mixin(u) {
        return r.mixins.includes(u) || r.mixins.push(u), a;
      },
      component(u, c) {
        return c ? (r.components[u] = c, a) : r.components[u];
      },
      directive(u, c) {
        return c ? (r.directives[u] = c, a) : r.directives[u];
      },
      mount(u, c, f) {
        if (!l) {
          const d = me(o, i);
          return d.appContext = r, f === !0 ? f = "svg" : f === !1 && (f = void 0), c && t ? t(d, u) : e(d, u, f), l = !0, a._container = u, u.__vue_app__ = a, js(d.component) || d.component.proxy;
        }
      },
      unmount() {
        l && (e(null, a._container), delete a._container.__vue_app__);
      },
      provide(u, c) {
        return r.provides[u] = c, a;
      },
      runWithContext(u) {
        const c = fo;
        fo = a;
        try {
          return u();
        } finally {
          fo = c;
        }
      }
    };
    return a;
  };
}
let fo = null;
function en(e, t) {
  if (Be) {
    let n = Be.provides;
    const o = Be.parent && Be.parent.provides;
    o === n && (n = Be.provides = Object.create(o)), n[e] = t;
  }
}
function lt(e, t, n = !1) {
  const o = Be || Ke;
  if (o || fo) {
    const i = o ? o.parent == null ? o.vnode.appContext && o.vnode.appContext.provides : o.parent.provides : fo._context.provides;
    if (i && e in i)
      return i[e];
    if (arguments.length > 1)
      return n && _e(t) ? t.call(o && o.proxy) : t;
  }
}
function qh(e, t, n, o = !1) {
  const i = {}, r = {};
  yi(r, ir, 1), e.propsDefaults = /* @__PURE__ */ Object.create(null), gc(e, t, i, r);
  for (const s in e.propsOptions[0])
    s in i || (i[s] = void 0);
  n ? e.props = o ? i : oh(i) : e.type.props ? e.props = i : e.props = r, e.attrs = r;
}
function Zh(e, t, n, o) {
  const {
    props: i,
    attrs: r,
    vnode: { patchFlag: s }
  } = e, l = xe(i), [a] = e.propsOptions;
  let u = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (o || s > 0) && !(s & 16)
  ) {
    if (s & 8) {
      const c = e.vnode.dynamicProps;
      for (let f = 0; f < c.length; f++) {
        let d = c[f];
        if (Qi(e.emitsOptions, d))
          continue;
        const p = t[d];
        if (a)
          if ($e(r, d))
            p !== r[d] && (r[d] = p, u = !0);
          else {
            const E = tt(d);
            i[E] = es(
              a,
              l,
              E,
              p,
              e,
              !1
            );
          }
        else
          p !== r[d] && (r[d] = p, u = !0);
      }
    }
  } else {
    gc(e, t, i, r) && (u = !0);
    let c;
    for (const f in l)
      (!t || // for camelCase
      !$e(t, f) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((c = ct(f)) === f || !$e(t, c))) && (a ? n && // for camelCase
      (n[f] !== void 0 || // for kebab-case
      n[c] !== void 0) && (i[f] = es(
        a,
        l,
        f,
        void 0,
        e,
        !0
      )) : delete i[f]);
    if (r !== l)
      for (const f in r)
        (!t || !$e(t, f)) && (delete r[f], u = !0);
  }
  u && zt(e, "set", "$attrs");
}
function gc(e, t, n, o) {
  const [i, r] = e.propsOptions;
  let s = !1, l;
  if (t)
    for (let a in t) {
      if (ro(a))
        continue;
      const u = t[a];
      let c;
      i && $e(i, c = tt(a)) ? !r || !r.includes(c) ? n[c] = u : (l || (l = {}))[c] = u : Qi(e.emitsOptions, a) || (!(a in o) || u !== o[a]) && (o[a] = u, s = !0);
    }
  if (r) {
    const a = xe(n), u = l || Pe;
    for (let c = 0; c < r.length; c++) {
      const f = r[c];
      n[f] = es(
        i,
        a,
        f,
        u[f],
        e,
        !$e(u, f)
      );
    }
  }
  return s;
}
function es(e, t, n, o, i, r) {
  const s = e[n];
  if (s != null) {
    const l = $e(s, "default");
    if (l && o === void 0) {
      const a = s.default;
      if (s.type !== Function && !s.skipFactory && _e(a)) {
        const { propsDefaults: u } = i;
        if (n in u)
          o = u[n];
        else {
          const c = ko(i);
          o = u[n] = a.call(
            null,
            t
          ), c();
        }
      } else
        o = a;
    }
    s[
      0
      /* shouldCast */
    ] && (r && !l ? o = !1 : s[
      1
      /* shouldCastTrue */
    ] && (o === "" || o === ct(n)) && (o = !0));
  }
  return o;
}
function mc(e, t, n = !1) {
  const o = t.propsCache, i = o.get(e);
  if (i)
    return i;
  const r = e.props, s = {}, l = [];
  let a = !1;
  if (!_e(e)) {
    const c = (f) => {
      a = !0;
      const [d, p] = mc(f, t, !0);
      Le(s, d), p && l.push(...p);
    };
    !n && t.mixins.length && t.mixins.forEach(c), e.extends && c(e.extends), e.mixins && e.mixins.forEach(c);
  }
  if (!r && !a)
    return Te(e) && o.set(e, Mn), Mn;
  if (ge(r))
    for (let c = 0; c < r.length; c++) {
      const f = tt(r[c]);
      Ul(f) && (s[f] = Pe);
    }
  else if (r)
    for (const c in r) {
      const f = tt(c);
      if (Ul(f)) {
        const d = r[c], p = s[f] = ge(d) || _e(d) ? { type: d } : Le({}, d);
        if (p) {
          const E = Wl(Boolean, p.type), m = Wl(String, p.type);
          p[
            0
            /* shouldCast */
          ] = E > -1, p[
            1
            /* shouldCastTrue */
          ] = m < 0 || E < m, (E > -1 || $e(p, "default")) && l.push(f);
        }
      }
    }
  const u = [s, l];
  return Te(e) && o.set(e, u), u;
}
function Ul(e) {
  return e[0] !== "$" && !ro(e);
}
function Gl(e) {
  return e === null ? "null" : typeof e == "function" ? e.name || "" : typeof e == "object" && e.constructor && e.constructor.name || "";
}
function Yl(e, t) {
  return Gl(e) === Gl(t);
}
function Wl(e, t) {
  return ge(t) ? t.findIndex((n) => Yl(n, e)) : _e(t) && Yl(t, e) ? 0 : -1;
}
const vc = (e) => e[0] === "_" || e === "$stable", qs = (e) => ge(e) ? e.map($t) : [$t(e)], Qh = (e, t, n) => {
  if (t._n)
    return t;
  const o = Qe((...i) => (lo.NODE_ENV !== "production" && Be && (!n || (n.root, Be.root)), qs(t(...i))), n);
  return o._c = !1, o;
}, _c = (e, t, n) => {
  const o = e._ctx;
  for (const i in e) {
    if (vc(i))
      continue;
    const r = e[i];
    if (_e(r))
      t[i] = Qh(i, r, o);
    else if (r != null) {
      const s = qs(r);
      t[i] = () => s;
    }
  }
}, yc = (e, t) => {
  const n = qs(t);
  e.slots.default = () => n;
}, jh = (e, t) => {
  if (e.vnode.shapeFlag & 32) {
    const n = t._;
    n ? (e.slots = xe(t), yi(t, "_", n)) : _c(
      t,
      e.slots = {}
    );
  } else
    e.slots = {}, t && yc(e, t);
  yi(e.slots, ir, 1);
}, ep = (e, t, n) => {
  const { vnode: o, slots: i } = e;
  let r = !0, s = Pe;
  if (o.shapeFlag & 32) {
    const l = t._;
    l ? n && l === 1 ? r = !1 : (Le(i, t), !n && l === 1 && delete i._) : (r = !t.$stable, _c(t, i)), s = t;
  } else
    t && (yc(e, t), s = { default: 1 });
  if (r)
    for (const l in i)
      !vc(l) && s[l] == null && delete i[l];
};
function ts(e, t, n, o, i = !1) {
  if (ge(e)) {
    e.forEach(
      (d, p) => ts(
        d,
        t && (ge(t) ? t[p] : t),
        n,
        o,
        i
      )
    );
    return;
  }
  if (uo(o) && !i)
    return;
  const r = o.shapeFlag & 4 ? js(o.component) || o.component.proxy : o.el, s = i ? null : r, { i: l, r: a } = e, u = t && t.r, c = l.refs === Pe ? l.refs = {} : l.refs, f = l.setupState;
  if (u != null && u !== a && (Oe(u) ? (c[u] = null, $e(f, u) && (f[u] = null)) : Fe(u) && (u.value = null)), _e(a))
    Ht(a, l, 12, [s, c]);
  else {
    const d = Oe(a), p = Fe(a);
    if (d || p) {
      const E = () => {
        if (e.f) {
          const m = d ? $e(f, a) ? f[a] : c[a] : a.value;
          i ? ge(m) && Os(m, r) : ge(m) ? m.includes(r) || m.push(r) : d ? (c[a] = [r], $e(f, a) && (f[a] = c[a])) : (a.value = [r], e.k && (c[e.k] = a.value));
        } else
          d ? (c[a] = s, $e(f, a) && (f[a] = s)) : p && (a.value = s, e.k && (c[e.k] = s));
      };
      s ? (E.id = -1, Ze(E, n)) : E();
    }
  }
}
const Ze = Ah;
function tp(e) {
  return np(e);
}
function np(e, t) {
  const n = Au();
  n.__VUE__ = !0;
  const {
    insert: o,
    remove: i,
    patchProp: r,
    createElement: s,
    createText: l,
    createComment: a,
    setText: u,
    setElementText: c,
    parentNode: f,
    nextSibling: d,
    setScopeId: p = st,
    insertStaticContent: E
  } = e, m = (x, h, v, $ = null, A = null, k = null, H = void 0, z = null, B = !!h.dynamicChildren) => {
    if (x === h)
      return;
    x && !Kn(x, h) && ($ = ae(x), q(x, A, k, !0), x = null), h.patchFlag === -2 && (B = !1, h.dynamicChildren = null);
    const { type: F, ref: Q, shapeFlag: oe } = h;
    switch (F) {
      case or:
        _(x, h, v, $);
        break;
      case tn:
        b(x, h, v, $);
        break;
      case ai:
        x == null && C(h, v, $, H);
        break;
      case Me:
        le(
          x,
          h,
          v,
          $,
          A,
          k,
          H,
          z,
          B
        );
        break;
      default:
        oe & 1 ? D(
          x,
          h,
          v,
          $,
          A,
          k,
          H,
          z,
          B
        ) : oe & 6 ? K(
          x,
          h,
          v,
          $,
          A,
          k,
          H,
          z,
          B
        ) : (oe & 64 || oe & 128) && F.process(
          x,
          h,
          v,
          $,
          A,
          k,
          H,
          z,
          B,
          ue
        );
    }
    Q != null && A && ts(Q, x && x.ref, k, h || x, !h);
  }, _ = (x, h, v, $) => {
    if (x == null)
      o(
        h.el = l(h.children),
        v,
        $
      );
    else {
      const A = h.el = x.el;
      h.children !== x.children && u(A, h.children);
    }
  }, b = (x, h, v, $) => {
    x == null ? o(
      h.el = a(h.children || ""),
      v,
      $
    ) : h.el = x.el;
  }, C = (x, h, v, $) => {
    [x.el, x.anchor] = E(
      x.children,
      h,
      v,
      $,
      x.el,
      x.anchor
    );
  }, N = ({ el: x, anchor: h }, v, $) => {
    let A;
    for (; x && x !== h; )
      A = d(x), o(x, v, $), x = A;
    o(h, v, $);
  }, y = ({ el: x, anchor: h }) => {
    let v;
    for (; x && x !== h; )
      v = d(x), i(x), x = v;
    i(h);
  }, D = (x, h, v, $, A, k, H, z, B) => {
    h.type === "svg" ? H = "svg" : h.type === "math" && (H = "mathml"), x == null ? O(
      h,
      v,
      $,
      A,
      k,
      H,
      z,
      B
    ) : X(
      x,
      h,
      A,
      k,
      H,
      z,
      B
    );
  }, O = (x, h, v, $, A, k, H, z) => {
    let B, F;
    const { props: Q, shapeFlag: oe, transition: ie, dirs: de } = x;
    if (B = x.el = s(
      x.type,
      k,
      Q && Q.is,
      Q
    ), oe & 8 ? c(B, x.children) : oe & 16 && V(
      x.children,
      B,
      null,
      $,
      A,
      Pr(x, k),
      H,
      z
    ), de && rn(x, null, $, "created"), S(B, x, x.scopeId, H, $), Q) {
      for (const Ne in Q)
        Ne !== "value" && !ro(Ne) && r(
          B,
          Ne,
          null,
          Q[Ne],
          k,
          x.children,
          $,
          A,
          L
        );
      "value" in Q && r(B, "value", null, Q.value, k), (F = Q.onVnodeBeforeMount) && xt(F, $, x);
    }
    de && rn(x, null, $, "beforeMount");
    const ye = op(A, ie);
    ye && ie.beforeEnter(B), o(B, h, v), ((F = Q && Q.onVnodeMounted) || ye || de) && Ze(() => {
      F && xt(F, $, x), ye && ie.enter(B), de && rn(x, null, $, "mounted");
    }, A);
  }, S = (x, h, v, $, A) => {
    if (v && p(x, v), $)
      for (let k = 0; k < $.length; k++)
        p(x, $[k]);
    if (A) {
      let k = A.subTree;
      if (h === k) {
        const H = A.vnode;
        S(
          x,
          H,
          H.scopeId,
          H.slotScopeIds,
          A.parent
        );
      }
    }
  }, V = (x, h, v, $, A, k, H, z, B = 0) => {
    for (let F = B; F < x.length; F++) {
      const Q = x[F] = z ? Xt(x[F]) : $t(x[F]);
      m(
        null,
        Q,
        h,
        v,
        $,
        A,
        k,
        H,
        z
      );
    }
  }, X = (x, h, v, $, A, k, H) => {
    const z = h.el = x.el;
    let { patchFlag: B, dynamicChildren: F, dirs: Q } = h;
    B |= x.patchFlag & 16;
    const oe = x.props || Pe, ie = h.props || Pe;
    let de;
    if (v && sn(v, !1), (de = ie.onVnodeBeforeUpdate) && xt(de, v, h, x), Q && rn(h, x, v, "beforeUpdate"), v && sn(v, !0), F ? Y(
      x.dynamicChildren,
      F,
      z,
      v,
      $,
      Pr(h, A),
      k
    ) : H || I(
      x,
      h,
      z,
      null,
      v,
      $,
      Pr(h, A),
      k,
      !1
    ), B > 0) {
      if (B & 16)
        W(
          z,
          h,
          oe,
          ie,
          v,
          $,
          A
        );
      else if (B & 2 && oe.class !== ie.class && r(z, "class", null, ie.class, A), B & 4 && r(z, "style", oe.style, ie.style, A), B & 8) {
        const ye = h.dynamicProps;
        for (let Ne = 0; Ne < ye.length; Ne++) {
          const Ie = ye[Ne], Ue = oe[Ie], ht = ie[Ie];
          (ht !== Ue || Ie === "value") && r(
            z,
            Ie,
            Ue,
            ht,
            A,
            x.children,
            v,
            $,
            L
          );
        }
      }
      B & 1 && x.children !== h.children && c(z, h.children);
    } else
      !H && F == null && W(
        z,
        h,
        oe,
        ie,
        v,
        $,
        A
      );
    ((de = ie.onVnodeUpdated) || Q) && Ze(() => {
      de && xt(de, v, h, x), Q && rn(h, x, v, "updated");
    }, $);
  }, Y = (x, h, v, $, A, k, H) => {
    for (let z = 0; z < h.length; z++) {
      const B = x[z], F = h[z], Q = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        B.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (B.type === Me || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !Kn(B, F) || // - In the case of a component, it could contain anything.
        B.shapeFlag & 70) ? f(B.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          v
        )
      );
      m(
        B,
        F,
        Q,
        null,
        $,
        A,
        k,
        H,
        !0
      );
    }
  }, W = (x, h, v, $, A, k, H) => {
    if (v !== $) {
      if (v !== Pe)
        for (const z in v)
          !ro(z) && !(z in $) && r(
            x,
            z,
            v[z],
            null,
            H,
            h.children,
            A,
            k,
            L
          );
      for (const z in $) {
        if (ro(z))
          continue;
        const B = $[z], F = v[z];
        B !== F && z !== "value" && r(
          x,
          z,
          F,
          B,
          H,
          h.children,
          A,
          k,
          L
        );
      }
      "value" in $ && r(x, "value", v.value, $.value, H);
    }
  }, le = (x, h, v, $, A, k, H, z, B) => {
    const F = h.el = x ? x.el : l(""), Q = h.anchor = x ? x.anchor : l("");
    let { patchFlag: oe, dynamicChildren: ie, slotScopeIds: de } = h;
    de && (z = z ? z.concat(de) : de), x == null ? (o(F, v, $), o(Q, v, $), V(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      h.children || [],
      v,
      Q,
      A,
      k,
      H,
      z,
      B
    )) : oe > 0 && oe & 64 && ie && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    x.dynamicChildren ? (Y(
      x.dynamicChildren,
      ie,
      v,
      A,
      k,
      H,
      z
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (h.key != null || A && h === A.subTree) && Zs(
      x,
      h,
      !0
      /* shallow */
    )) : I(
      x,
      h,
      v,
      Q,
      A,
      k,
      H,
      z,
      B
    );
  }, K = (x, h, v, $, A, k, H, z, B) => {
    h.slotScopeIds = z, x == null ? h.shapeFlag & 512 ? A.ctx.activate(
      h,
      v,
      $,
      H,
      B
    ) : g(
      h,
      v,
      $,
      A,
      k,
      H,
      B
    ) : R(x, h, B);
  }, g = (x, h, v, $, A, k, H) => {
    const z = x.component = gp(
      x,
      $,
      A
    );
    if (sc(x) && (z.ctx.renderer = ue), mp(z), z.asyncDep) {
      if (A && A.registerDep(z, w), !x.el) {
        const B = z.subTree = me(tn);
        b(null, B, h, v);
      }
    } else
      w(
        z,
        x,
        h,
        v,
        A,
        k,
        H
      );
  }, R = (x, h, v) => {
    const $ = h.component = x.component;
    if (Ch(x, h, v))
      if ($.asyncDep && !$.asyncResolved) {
        P($, h, v);
        return;
      } else
        $.next = h, yh($.update), $.effect.dirty = !0, $.update();
    else
      h.el = x.el, $.vnode = h;
  }, w = (x, h, v, $, A, k, H) => {
    const z = () => {
      if (x.isMounted) {
        let { next: Q, bu: oe, u: ie, parent: de, vnode: ye } = x;
        {
          const $n = wc(x);
          if ($n) {
            Q && (Q.el = ye.el, P(x, Q, H)), $n.asyncDep.then(() => {
              x.isUnmounted || z();
            });
            return;
          }
        }
        let Ne = Q, Ie;
        sn(x, !1), Q ? (Q.el = ye.el, P(x, Q, H)) : Q = ye, oe && Sr(oe), (Ie = Q.props && Q.props.onVnodeBeforeUpdate) && xt(Ie, de, Q, ye), sn(x, !0);
        const Ue = Ar(x), ht = x.subTree;
        x.subTree = Ue, m(
          ht,
          Ue,
          // parent may have changed if it's in a teleport
          f(ht.el),
          // anchor may have changed if it's in a fragment
          ae(ht),
          x,
          A,
          k
        ), Q.el = Ue.el, Ne === null && Sh(x, Ue.el), ie && Ze(ie, A), (Ie = Q.props && Q.props.onVnodeUpdated) && Ze(
          () => xt(Ie, de, Q, ye),
          A
        );
      } else {
        let Q;
        const { el: oe, props: ie } = h, { bm: de, m: ye, parent: Ne } = x, Ie = uo(h);
        if (sn(x, !1), de && Sr(de), !Ie && (Q = ie && ie.onVnodeBeforeMount) && xt(Q, Ne, h), sn(x, !0), oe && fe) {
          const Ue = () => {
            x.subTree = Ar(x), fe(
              oe,
              x.subTree,
              x,
              A,
              null
            );
          };
          Ie ? h.type.__asyncLoader().then(
            // note: we are moving the render call into an async callback,
            // which means it won't track dependencies - but it's ok because
            // a server-rendered async wrapper is already in resolved state
            // and it will never need to change.
            () => !x.isUnmounted && Ue()
          ) : Ue();
        } else {
          const Ue = x.subTree = Ar(x);
          m(
            null,
            Ue,
            v,
            $,
            x,
            A,
            k
          ), h.el = Ue.el;
        }
        if (ye && Ze(ye, A), !Ie && (Q = ie && ie.onVnodeMounted)) {
          const Ue = h;
          Ze(
            () => xt(Q, Ne, Ue),
            A
          );
        }
        (h.shapeFlag & 256 || Ne && uo(Ne.vnode) && Ne.vnode.shapeFlag & 256) && x.a && Ze(x.a, A), x.isMounted = !0, h = v = $ = null;
      }
    }, B = x.effect = new Rs(
      z,
      st,
      () => Ws(F),
      x.scope
      // track it in component's effect scope
    ), F = x.update = () => {
      B.dirty && B.run();
    };
    F.id = x.uid, sn(x, !0), F();
  }, P = (x, h, v) => {
    h.component = x;
    const $ = x.vnode.props;
    x.vnode = h, x.next = null, Zh(x, h.props, $, v), ep(x, h.children, v), nn(), Rl(x), on();
  }, I = (x, h, v, $, A, k, H, z, B = !1) => {
    const F = x && x.children, Q = x ? x.shapeFlag : 0, oe = h.children, { patchFlag: ie, shapeFlag: de } = h;
    if (ie > 0) {
      if (ie & 128) {
        M(
          F,
          oe,
          v,
          $,
          A,
          k,
          H,
          z,
          B
        );
        return;
      } else if (ie & 256) {
        T(
          F,
          oe,
          v,
          $,
          A,
          k,
          H,
          z,
          B
        );
        return;
      }
    }
    de & 8 ? (Q & 16 && L(F, A, k), oe !== F && c(v, oe)) : Q & 16 ? de & 16 ? M(
      F,
      oe,
      v,
      $,
      A,
      k,
      H,
      z,
      B
    ) : L(F, A, k, !0) : (Q & 8 && c(v, ""), de & 16 && V(
      oe,
      v,
      $,
      A,
      k,
      H,
      z,
      B
    ));
  }, T = (x, h, v, $, A, k, H, z, B) => {
    x = x || Mn, h = h || Mn;
    const F = x.length, Q = h.length, oe = Math.min(F, Q);
    let ie;
    for (ie = 0; ie < oe; ie++) {
      const de = h[ie] = B ? Xt(h[ie]) : $t(h[ie]);
      m(
        x[ie],
        de,
        v,
        null,
        A,
        k,
        H,
        z,
        B
      );
    }
    F > Q ? L(
      x,
      A,
      k,
      !0,
      !1,
      oe
    ) : V(
      h,
      v,
      $,
      A,
      k,
      H,
      z,
      B,
      oe
    );
  }, M = (x, h, v, $, A, k, H, z, B) => {
    let F = 0;
    const Q = h.length;
    let oe = x.length - 1, ie = Q - 1;
    for (; F <= oe && F <= ie; ) {
      const de = x[F], ye = h[F] = B ? Xt(h[F]) : $t(h[F]);
      if (Kn(de, ye))
        m(
          de,
          ye,
          v,
          null,
          A,
          k,
          H,
          z,
          B
        );
      else
        break;
      F++;
    }
    for (; F <= oe && F <= ie; ) {
      const de = x[oe], ye = h[ie] = B ? Xt(h[ie]) : $t(h[ie]);
      if (Kn(de, ye))
        m(
          de,
          ye,
          v,
          null,
          A,
          k,
          H,
          z,
          B
        );
      else
        break;
      oe--, ie--;
    }
    if (F > oe) {
      if (F <= ie) {
        const de = ie + 1, ye = de < Q ? h[de].el : $;
        for (; F <= ie; )
          m(
            null,
            h[F] = B ? Xt(h[F]) : $t(h[F]),
            v,
            ye,
            A,
            k,
            H,
            z,
            B
          ), F++;
      }
    } else if (F > ie)
      for (; F <= oe; )
        q(x[F], A, k, !0), F++;
    else {
      const de = F, ye = F, Ne = /* @__PURE__ */ new Map();
      for (F = ye; F <= ie; F++) {
        const it = h[F] = B ? Xt(h[F]) : $t(h[F]);
        it.key != null && Ne.set(it.key, F);
      }
      let Ie, Ue = 0;
      const ht = ie - ye + 1;
      let $n = !1, $l = 0;
      const Jn = new Array(ht);
      for (F = 0; F < ht; F++)
        Jn[F] = 0;
      for (F = de; F <= oe; F++) {
        const it = x[F];
        if (Ue >= ht) {
          q(it, A, k, !0);
          continue;
        }
        let bt;
        if (it.key != null)
          bt = Ne.get(it.key);
        else
          for (Ie = ye; Ie <= ie; Ie++)
            if (Jn[Ie - ye] === 0 && Kn(it, h[Ie])) {
              bt = Ie;
              break;
            }
        bt === void 0 ? q(it, A, k, !0) : (Jn[bt - ye] = F + 1, bt >= $l ? $l = bt : $n = !0, m(
          it,
          h[bt],
          v,
          null,
          A,
          k,
          H,
          z,
          B
        ), Ue++);
      }
      const Cl = $n ? ip(Jn) : Mn;
      for (Ie = Cl.length - 1, F = ht - 1; F >= 0; F--) {
        const it = ye + F, bt = h[it], Sl = it + 1 < Q ? h[it + 1].el : $;
        Jn[F] === 0 ? m(
          null,
          bt,
          v,
          Sl,
          A,
          k,
          H,
          z,
          B
        ) : $n && (Ie < 0 || F !== Cl[Ie] ? U(bt, v, Sl, 2) : Ie--);
      }
    }
  }, U = (x, h, v, $, A = null) => {
    const { el: k, type: H, transition: z, children: B, shapeFlag: F } = x;
    if (F & 6) {
      U(x.component.subTree, h, v, $);
      return;
    }
    if (F & 128) {
      x.suspense.move(h, v, $);
      return;
    }
    if (F & 64) {
      H.move(x, h, v, ue);
      return;
    }
    if (H === Me) {
      o(k, h, v);
      for (let oe = 0; oe < B.length; oe++)
        U(B[oe], h, v, $);
      o(x.anchor, h, v);
      return;
    }
    if (H === ai) {
      N(x, h, v);
      return;
    }
    if ($ !== 2 && F & 1 && z)
      if ($ === 0)
        z.beforeEnter(k), o(k, h, v), Ze(() => z.enter(k), A);
      else {
        const { leave: oe, delayLeave: ie, afterLeave: de } = z, ye = () => o(k, h, v), Ne = () => {
          oe(k, () => {
            ye(), de && de();
          });
        };
        ie ? ie(k, ye, Ne) : Ne();
      }
    else
      o(k, h, v);
  }, q = (x, h, v, $ = !1, A = !1) => {
    const {
      type: k,
      props: H,
      ref: z,
      children: B,
      dynamicChildren: F,
      shapeFlag: Q,
      patchFlag: oe,
      dirs: ie
    } = x;
    if (z != null && ts(z, null, v, x, !0), Q & 256) {
      h.ctx.deactivate(x);
      return;
    }
    const de = Q & 1 && ie, ye = !uo(x);
    let Ne;
    if (ye && (Ne = H && H.onVnodeBeforeUnmount) && xt(Ne, h, x), Q & 6)
      se(x.component, v, $);
    else {
      if (Q & 128) {
        x.suspense.unmount(v, $);
        return;
      }
      de && rn(x, null, h, "beforeUnmount"), Q & 64 ? x.type.remove(
        x,
        h,
        v,
        A,
        ue,
        $
      ) : F && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (k !== Me || oe > 0 && oe & 64) ? L(
        F,
        h,
        v,
        !1,
        !0
      ) : (k === Me && oe & 384 || !A && Q & 16) && L(B, h, v), $ && Z(x);
    }
    (ye && (Ne = H && H.onVnodeUnmounted) || de) && Ze(() => {
      Ne && xt(Ne, h, x), de && rn(x, null, h, "unmounted");
    }, v);
  }, Z = (x) => {
    const { type: h, el: v, anchor: $, transition: A } = x;
    if (h === Me) {
      J(v, $);
      return;
    }
    if (h === ai) {
      y(x);
      return;
    }
    const k = () => {
      i(v), A && !A.persisted && A.afterLeave && A.afterLeave();
    };
    if (x.shapeFlag & 1 && A && !A.persisted) {
      const { leave: H, delayLeave: z } = A, B = () => H(v, k);
      z ? z(x.el, k, B) : B();
    } else
      k();
  }, J = (x, h) => {
    let v;
    for (; x !== h; )
      v = d(x), i(x), x = v;
    i(h);
  }, se = (x, h, v) => {
    const { bum: $, scope: A, update: k, subTree: H, um: z } = x;
    $ && Sr($), A.stop(), k && (k.active = !1, q(H, x, h, v)), z && Ze(z, h), Ze(() => {
      x.isUnmounted = !0;
    }, h), h && h.pendingBranch && !h.isUnmounted && x.asyncDep && !x.asyncResolved && x.suspenseId === h.pendingId && (h.deps--, h.deps === 0 && h.resolve());
  }, L = (x, h, v, $ = !1, A = !1, k = 0) => {
    for (let H = k; H < x.length; H++)
      q(x[H], h, v, $, A);
  }, ae = (x) => x.shapeFlag & 6 ? ae(x.component.subTree) : x.shapeFlag & 128 ? x.suspense.next() : d(x.anchor || x.el);
  let j = !1;
  const ne = (x, h, v) => {
    x == null ? h._vnode && q(h._vnode, null, null, !0) : m(
      h._vnode || null,
      x,
      h,
      null,
      null,
      null,
      v
    ), j || (j = !0, Rl(), Zu(), j = !1), h._vnode = x;
  }, ue = {
    p: m,
    um: q,
    m: U,
    r: Z,
    mt: g,
    mc: V,
    pc: I,
    pbc: Y,
    n: ae,
    o: e
  };
  let ce, fe;
  return t && ([ce, fe] = t(
    ue
  )), {
    render: ne,
    hydrate: ce,
    createApp: Kh(ne, ce)
  };
}
function Pr({ type: e, props: t }, n) {
  return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function sn({ effect: e, update: t }, n) {
  e.allowRecurse = t.allowRecurse = n;
}
function op(e, t) {
  return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Zs(e, t, n = !1) {
  const o = e.children, i = t.children;
  if (ge(o) && ge(i))
    for (let r = 0; r < o.length; r++) {
      const s = o[r];
      let l = i[r];
      l.shapeFlag & 1 && !l.dynamicChildren && ((l.patchFlag <= 0 || l.patchFlag === 32) && (l = i[r] = Xt(i[r]), l.el = s.el), n || Zs(s, l)), l.type === or && (l.el = s.el);
    }
}
function ip(e) {
  const t = e.slice(), n = [0];
  let o, i, r, s, l;
  const a = e.length;
  for (o = 0; o < a; o++) {
    const u = e[o];
    if (u !== 0) {
      if (i = n[n.length - 1], e[i] < u) {
        t[o] = i, n.push(o);
        continue;
      }
      for (r = 0, s = n.length - 1; r < s; )
        l = r + s >> 1, e[n[l]] < u ? r = l + 1 : s = l;
      u < e[n[r]] && (r > 0 && (t[o] = n[r - 1]), n[r] = o);
    }
  }
  for (r = n.length, s = n[r - 1]; r-- > 0; )
    n[r] = s, s = t[s];
  return n;
}
function wc(e) {
  const t = e.subTree.component;
  if (t)
    return t.asyncDep && !t.asyncResolved ? t : wc(t);
}
const rp = (e) => e.__isTeleport, ho = (e) => e && (e.disabled || e.disabled === ""), Xl = (e) => typeof SVGElement < "u" && e instanceof SVGElement, Jl = (e) => typeof MathMLElement == "function" && e instanceof MathMLElement, ns = (e, t) => {
  const n = e && e.to;
  return Oe(n) ? t ? t(n) : null : n;
}, sp = {
  name: "Teleport",
  __isTeleport: !0,
  process(e, t, n, o, i, r, s, l, a, u) {
    const {
      mc: c,
      pc: f,
      pbc: d,
      o: { insert: p, querySelector: E, createText: m, createComment: _ }
    } = u, b = ho(t.props);
    let { shapeFlag: C, children: N, dynamicChildren: y } = t;
    if (e == null) {
      const D = t.el = m(""), O = t.anchor = m("");
      p(D, n, o), p(O, n, o);
      const S = t.target = ns(t.props, E), V = t.targetAnchor = m("");
      S && (p(V, S), s === "svg" || Xl(S) ? s = "svg" : (s === "mathml" || Jl(S)) && (s = "mathml"));
      const X = (Y, W) => {
        C & 16 && c(
          N,
          Y,
          W,
          i,
          r,
          s,
          l,
          a
        );
      };
      b ? X(n, O) : S && X(S, V);
    } else {
      t.el = e.el;
      const D = t.anchor = e.anchor, O = t.target = e.target, S = t.targetAnchor = e.targetAnchor, V = ho(e.props), X = V ? n : O, Y = V ? D : S;
      if (s === "svg" || Xl(O) ? s = "svg" : (s === "mathml" || Jl(O)) && (s = "mathml"), y ? (d(
        e.dynamicChildren,
        y,
        X,
        i,
        r,
        s,
        l
      ), Zs(e, t, !0)) : a || f(
        e,
        t,
        X,
        Y,
        i,
        r,
        s,
        l,
        !1
      ), b)
        V ? t.props && e.props && t.props.to !== e.props.to && (t.props.to = e.props.to) : Wo(
          t,
          n,
          D,
          u,
          1
        );
      else if ((t.props && t.props.to) !== (e.props && e.props.to)) {
        const W = t.target = ns(
          t.props,
          E
        );
        W && Wo(
          t,
          W,
          null,
          u,
          0
        );
      } else
        V && Wo(
          t,
          O,
          S,
          u,
          1
        );
    }
    bc(t);
  },
  remove(e, t, n, o, { um: i, o: { remove: r } }, s) {
    const { shapeFlag: l, children: a, anchor: u, targetAnchor: c, target: f, props: d } = e;
    if (f && r(c), s && r(u), l & 16) {
      const p = s || !ho(d);
      for (let E = 0; E < a.length; E++) {
        const m = a[E];
        i(
          m,
          t,
          n,
          p,
          !!m.dynamicChildren
        );
      }
    }
  },
  move: Wo,
  hydrate: lp
};
function Wo(e, t, n, { o: { insert: o }, m: i }, r = 2) {
  r === 0 && o(e.targetAnchor, t, n);
  const { el: s, anchor: l, shapeFlag: a, children: u, props: c } = e, f = r === 2;
  if (f && o(s, t, n), (!f || ho(c)) && a & 16)
    for (let d = 0; d < u.length; d++)
      i(
        u[d],
        t,
        n,
        2
      );
  f && o(l, t, n);
}
function lp(e, t, n, o, i, r, {
  o: { nextSibling: s, parentNode: l, querySelector: a }
}, u) {
  const c = t.target = ns(
    t.props,
    a
  );
  if (c) {
    const f = c._lpa || c.firstChild;
    if (t.shapeFlag & 16)
      if (ho(t.props))
        t.anchor = u(
          s(e),
          t,
          l(e),
          n,
          o,
          i,
          r
        ), t.targetAnchor = f;
      else {
        t.anchor = s(e);
        let d = f;
        for (; d; )
          if (d = s(d), d && d.nodeType === 8 && d.data === "teleport anchor") {
            t.targetAnchor = d, c._lpa = t.targetAnchor && s(t.targetAnchor);
            break;
          }
        u(
          f,
          t,
          c,
          n,
          o,
          i,
          r
        );
      }
    bc(t);
  }
  return t.anchor && s(t.anchor);
}
const ap = sp;
function bc(e) {
  const t = e.ctx;
  if (t && t.ut) {
    let n = e.children[0].el;
    for (; n && n !== e.targetAnchor; )
      n.nodeType === 1 && n.setAttribute("data-v-owner", t.uid), n = n.nextSibling;
    t.ut();
  }
}
const Me = Symbol.for("v-fgt"), or = Symbol.for("v-txt"), tn = Symbol.for("v-cmt"), ai = Symbol.for("v-stc"), po = [];
let vt = null;
function re(e = !1) {
  po.push(vt = e ? null : []);
}
function up() {
  po.pop(), vt = po[po.length - 1] || null;
}
let bo = 1;
function Kl(e) {
  bo += e;
}
function xc(e) {
  return e.dynamicChildren = bo > 0 ? vt || Mn : null, up(), bo > 0 && vt && vt.push(e), e;
}
function pe(e, t, n, o, i, r) {
  return xc(
    Ce(
      e,
      t,
      n,
      o,
      i,
      r,
      !0
    )
  );
}
function Ve(e, t, n, o, i) {
  return xc(
    me(
      e,
      t,
      n,
      o,
      i,
      !0
    )
  );
}
function Si(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function Kn(e, t) {
  return e.type === t.type && e.key === t.key;
}
const ir = "__vInternal", Ec = ({ key: e }) => e ?? null, ui = ({
  ref: e,
  ref_key: t,
  ref_for: n
}) => (typeof e == "number" && (e = "" + e), e != null ? Oe(e) || Fe(e) || _e(e) ? { i: Ke, r: e, k: t, f: !!n } : e : null);
function Ce(e, t = null, n = null, o = 0, i = null, r = e === Me ? 0 : 1, s = !1, l = !1) {
  const a = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && Ec(t),
    ref: t && ui(t),
    scopeId: ec,
    slotScopeIds: null,
    children: n,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: r,
    patchFlag: o,
    dynamicProps: i,
    dynamicChildren: null,
    appContext: null,
    ctx: Ke
  };
  return l ? (Qs(a, n), r & 128 && e.normalize(a)) : n && (a.shapeFlag |= Oe(n) ? 8 : 16), bo > 0 && // avoid a block node from tracking itself
  !s && // has current parent block
  vt && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (a.patchFlag > 0 || r & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  a.patchFlag !== 32 && vt.push(a), a;
}
const me = cp;
function cp(e, t = null, n = null, o = 0, i = null, r = !1) {
  if ((!e || e === nc) && (e = tn), Si(e)) {
    const l = Vn(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return n && Qs(l, n), bo > 0 && !r && vt && (l.shapeFlag & 6 ? vt[vt.indexOf(e)] = l : vt.push(l)), l.patchFlag |= -2, l;
  }
  if (bp(e) && (e = e.__vccOpts), t) {
    t = fp(t);
    let { class: l, style: a } = t;
    l && !Oe(l) && (t.class = We(l)), Te(a) && (Gu(a) && !ge(a) && (a = Le({}, a)), t.style = ze(a));
  }
  const s = Oe(e) ? 1 : Nh(e) ? 128 : rp(e) ? 64 : Te(e) ? 4 : _e(e) ? 2 : 0;
  return Ce(
    e,
    t,
    n,
    o,
    i,
    s,
    r,
    !0
  );
}
function fp(e) {
  return e ? Gu(e) || ir in e ? Le({}, e) : e : null;
}
function Vn(e, t, n = !1) {
  const { props: o, ref: i, patchFlag: r, children: s } = e, l = t ? rr(o || {}, t) : o;
  return {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: l,
    key: l && Ec(l),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && i ? ge(i) ? i.concat(ui(t)) : [i, ui(t)] : ui(t)
    ) : i,
    scopeId: e.scopeId,
    slotScopeIds: e.slotScopeIds,
    children: s,
    target: e.target,
    targetAnchor: e.targetAnchor,
    staticCount: e.staticCount,
    shapeFlag: e.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: t && e.type !== Me ? r === -1 ? 16 : r | 16 : r,
    dynamicProps: e.dynamicProps,
    dynamicChildren: e.dynamicChildren,
    appContext: e.appContext,
    dirs: e.dirs,
    transition: e.transition,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: e.component,
    suspense: e.suspense,
    ssContent: e.ssContent && Vn(e.ssContent),
    ssFallback: e.ssFallback && Vn(e.ssFallback),
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce
  };
}
function $c(e = " ", t = 0) {
  return me(or, null, e, t);
}
function dp(e, t) {
  const n = me(ai, null, e);
  return n.staticCount = t, n;
}
function He(e = "", t = !1) {
  return t ? (re(), Ve(tn, null, e)) : me(tn, null, e);
}
function $t(e) {
  return e == null || typeof e == "boolean" ? me(tn) : ge(e) ? me(
    Me,
    null,
    // #3666, avoid reference pollution when reusing vnode
    e.slice()
  ) : typeof e == "object" ? Xt(e) : me(or, null, String(e));
}
function Xt(e) {
  return e.el === null && e.patchFlag !== -1 || e.memo ? e : Vn(e);
}
function Qs(e, t) {
  let n = 0;
  const { shapeFlag: o } = e;
  if (t == null)
    t = null;
  else if (ge(t))
    n = 16;
  else if (typeof t == "object")
    if (o & 65) {
      const i = t.default;
      i && (i._c && (i._d = !1), Qs(e, i()), i._c && (i._d = !0));
      return;
    } else {
      n = 32;
      const i = t._;
      !i && !(ir in t) ? t._ctx = Ke : i === 3 && Ke && (Ke.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else
    _e(t) ? (t = { default: t, _ctx: Ke }, n = 32) : (t = String(t), o & 64 ? (n = 16, t = [$c(t)]) : n = 8);
  e.children = t, e.shapeFlag |= n;
}
function rr(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const o = e[n];
    for (const i in o)
      if (i === "class")
        t.class !== o.class && (t.class = We([t.class, o.class]));
      else if (i === "style")
        t.style = ze([t.style, o.style]);
      else if (Yi(i)) {
        const r = t[i], s = o[i];
        s && r !== s && !(ge(r) && r.includes(s)) && (t[i] = r ? [].concat(r, s) : s);
      } else
        i !== "" && (t[i] = o[i]);
  }
  return t;
}
function xt(e, t, n, o = null) {
  _t(e, t, 7, [
    n,
    o
  ]);
}
const hp = pc();
let pp = 0;
function gp(e, t, n) {
  const o = e.type, i = (t ? t.appContext : e.appContext) || hp, r = {
    uid: pp++,
    vnode: e,
    type: o,
    parent: t,
    appContext: i,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    scope: new Tu(
      !0
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: t ? t.provides : Object.create(i.provides),
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: mc(o, i),
    emitsOptions: ju(o, i),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: Pe,
    // inheritAttrs
    inheritAttrs: o.inheritAttrs,
    // state
    ctx: Pe,
    data: Pe,
    props: Pe,
    attrs: Pe,
    slots: Pe,
    refs: Pe,
    setupState: Pe,
    setupContext: null,
    attrsProxy: null,
    slotsProxy: null,
    // suspense related
    suspense: n,
    suspenseId: n ? n.pendingId : 0,
    asyncDep: null,
    asyncResolved: !1,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: !1,
    isUnmounted: !1,
    isDeactivated: !1,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  return r.ctx = { _: r }, r.root = t ? t.root : r, r.emit = xh.bind(null, r), e.ce && e.ce(r), r;
}
let Be = null;
const Do = () => Be || Ke;
let Ni, os;
{
  const e = Au(), t = (n, o) => {
    let i;
    return (i = e[n]) || (i = e[n] = []), i.push(o), (r) => {
      i.length > 1 ? i.forEach((s) => s(r)) : i[0](r);
    };
  };
  Ni = t(
    "__VUE_INSTANCE_SETTERS__",
    (n) => Be = n
  ), os = t(
    "__VUE_SSR_SETTERS__",
    (n) => sr = n
  );
}
const ko = (e) => {
  const t = Be;
  return Ni(e), e.scope.on(), () => {
    e.scope.off(), Ni(t);
  };
}, ql = () => {
  Be && Be.scope.off(), Ni(null);
};
function Cc(e) {
  return e.vnode.shapeFlag & 4;
}
let sr = !1;
function mp(e, t = !1) {
  t && os(t);
  const { props: n, children: o } = e.vnode, i = Cc(e);
  qh(e, n, i, t), jh(e, o);
  const r = i ? vp(e, t) : void 0;
  return t && os(!1), r;
}
function vp(e, t) {
  const n = e.type;
  e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = ft(new Proxy(e.ctx, Lh));
  const { setup: o } = n;
  if (o) {
    const i = e.setupContext = o.length > 1 ? Nc(e) : null, r = ko(e);
    nn();
    const s = Ht(
      o,
      e,
      0,
      [
        e.props,
        i
      ]
    );
    if (on(), r(), Cu(s)) {
      if (s.then(ql, ql), t)
        return s.then((l) => {
          Zl(e, l, t);
        }).catch((l) => {
          Zi(l, e, 0);
        });
      e.asyncDep = s;
    } else
      Zl(e, s, t);
  } else
    Sc(e, t);
}
function Zl(e, t, n) {
  _e(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : Te(t) && (e.setupState = Wu(t)), Sc(e, n);
}
let Ql;
function Sc(e, t, n) {
  const o = e.type;
  if (!e.render) {
    if (!t && Ql && !o.render) {
      const i = o.template || Ks(e).template;
      if (i) {
        const { isCustomElement: r, compilerOptions: s } = e.appContext.config, { delimiters: l, compilerOptions: a } = o, u = Le(
          Le(
            {
              isCustomElement: r,
              delimiters: l
            },
            s
          ),
          a
        );
        o.render = Ql(i, u);
      }
    }
    e.render = o.render || st;
  }
  {
    const i = ko(e);
    nn();
    try {
      Uh(e);
    } finally {
      on(), i();
    }
  }
}
function _p(e) {
  return e.attrsProxy || (e.attrsProxy = new Proxy(
    e.attrs,
    {
      get(t, n) {
        return ot(e, "get", "$attrs"), t[n];
      }
    }
  ));
}
function Nc(e) {
  const t = (n) => {
    e.exposed = n || {};
  };
  return {
    get attrs() {
      return _p(e);
    },
    slots: e.slots,
    emit: e.emit,
    expose: t
  };
}
function js(e) {
  if (e.exposed)
    return e.exposeProxy || (e.exposeProxy = new Proxy(Wu(ft(e.exposed)), {
      get(t, n) {
        if (n in t)
          return t[n];
        if (n in co)
          return co[n](e);
      },
      has(t, n) {
        return n in t || n in co;
      }
    }));
}
const yp = /(?:^|[-_])(\w)/g, wp = (e) => e.replace(yp, (t) => t.toUpperCase()).replace(/[-_]/g, "");
function Ac(e, t = !0) {
  return _e(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function Mc(e, t, n = !1) {
  let o = Ac(t);
  if (!o && t.__file) {
    const i = t.__file.match(/([^/\\]+)\.\w+$/);
    i && (o = i[1]);
  }
  if (!o && e && e.parent) {
    const i = (r) => {
      for (const s in r)
        if (r[s] === t)
          return s;
    };
    o = i(
      e.components || e.parent.type.components
    ) || i(e.appContext.components);
  }
  return o ? wp(o) : n ? "App" : "Anonymous";
}
function bp(e) {
  return _e(e) && "__vccOpts" in e;
}
const he = (e, t) => ih(e, t, sr);
function xp(e, t, n = Pe) {
  const o = Do(), i = tt(t), r = ct(t), s = Gs((a, u) => {
    let c;
    return Th(() => {
      const f = e[t];
      At(c, f) && (c = f, u());
    }), {
      get() {
        return a(), n.get ? n.get(c) : c;
      },
      set(f) {
        const d = o.vnode.props;
        !(d && // check if parent has passed v-model
        (t in d || i in d || r in d) && (`onUpdate:${t}` in d || `onUpdate:${i}` in d || `onUpdate:${r}` in d)) && At(f, c) && (c = f, u()), o.emit(`update:${t}`, n.set ? n.set(f) : f);
      }
    };
  }), l = t === "modelValue" ? "modelModifiers" : `${t}Modifiers`;
  return s[Symbol.iterator] = () => {
    let a = 0;
    return {
      next() {
        return a < 2 ? { value: a++ ? e[l] || {} : s, done: !1 } : { done: !0 };
      }
    };
  }, s;
}
function Ae(e, t, n) {
  const o = arguments.length;
  return o === 2 ? Te(t) && !ge(t) ? Si(t) ? me(e, null, [t]) : me(e, t) : me(e, null, t) : (o > 3 ? n = Array.prototype.slice.call(arguments, 2) : o === 3 && Si(n) && (n = [n]), me(e, t, n));
}
const Ep = "3.4.19", $p = "http://www.w3.org/2000/svg", Cp = "http://www.w3.org/1998/Math/MathML", Jt = typeof document < "u" ? document : null, jl = Jt && /* @__PURE__ */ Jt.createElement("template"), Sp = {
  insert: (e, t, n) => {
    t.insertBefore(e, n || null);
  },
  remove: (e) => {
    const t = e.parentNode;
    t && t.removeChild(e);
  },
  createElement: (e, t, n, o) => {
    const i = t === "svg" ? Jt.createElementNS($p, e) : t === "mathml" ? Jt.createElementNS(Cp, e) : Jt.createElement(e, n ? { is: n } : void 0);
    return e === "select" && o && o.multiple != null && i.setAttribute("multiple", o.multiple), i;
  },
  createText: (e) => Jt.createTextNode(e),
  createComment: (e) => Jt.createComment(e),
  setText: (e, t) => {
    e.nodeValue = t;
  },
  setElementText: (e, t) => {
    e.textContent = t;
  },
  parentNode: (e) => e.parentNode,
  nextSibling: (e) => e.nextSibling,
  querySelector: (e) => Jt.querySelector(e),
  setScopeId(e, t) {
    e.setAttribute(t, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(e, t, n, o, i, r) {
    const s = n ? n.previousSibling : t.lastChild;
    if (i && (i === r || i.nextSibling))
      for (; t.insertBefore(i.cloneNode(!0), n), !(i === r || !(i = i.nextSibling)); )
        ;
    else {
      jl.innerHTML = o === "svg" ? `<svg>${e}</svg>` : o === "mathml" ? `<math>${e}</math>` : e;
      const l = jl.content;
      if (o === "svg" || o === "mathml") {
        const a = l.firstChild;
        for (; a.firstChild; )
          l.appendChild(a.firstChild);
        l.removeChild(a);
      }
      t.insertBefore(l, n);
    }
    return [
      // first
      s ? s.nextSibling : t.firstChild,
      // last
      n ? n.previousSibling : t.lastChild
    ];
  }
}, Np = Symbol("_vtc");
function Ap(e, t, n) {
  const o = e[Np];
  o && (t = (t ? [t, ...o] : [...o]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
const ea = Symbol("_vod"), Mp = Symbol(""), Pp = /(^|;)\s*display\s*:/;
function Tp(e, t, n) {
  const o = e.style, i = Oe(n), r = o.display;
  let s = !1;
  if (n && !i) {
    if (t && !Oe(t))
      for (const l in t)
        n[l] == null && is(o, l, "");
    for (const l in n)
      l === "display" && (s = !0), is(o, l, n[l]);
  } else if (i) {
    if (t !== n) {
      const l = o[Mp];
      l && (n += ";" + l), o.cssText = n, s = Pp.test(n);
    }
  } else
    t && e.removeAttribute("style");
  ea in e && (e[ea] = s ? o.display : "", o.display = r);
}
const ta = /\s*!important$/;
function is(e, t, n) {
  if (ge(n))
    n.forEach((o) => is(e, t, o));
  else if (n == null && (n = ""), t.startsWith("--"))
    e.setProperty(t, n);
  else {
    const o = Ip(e, t);
    ta.test(n) ? e.setProperty(
      ct(o),
      n.replace(ta, ""),
      "important"
    ) : e[o] = n;
  }
}
const na = ["Webkit", "Moz", "ms"], Tr = {};
function Ip(e, t) {
  const n = Tr[t];
  if (n)
    return n;
  let o = tt(t);
  if (o !== "filter" && o in e)
    return Tr[t] = o;
  o = Ji(o);
  for (let i = 0; i < na.length; i++) {
    const r = na[i] + o;
    if (r in e)
      return Tr[t] = r;
  }
  return t;
}
const oa = "http://www.w3.org/1999/xlink";
function Op(e, t, n, o, i) {
  if (o && t.startsWith("xlink:"))
    n == null ? e.removeAttributeNS(oa, t.slice(6, t.length)) : e.setAttributeNS(oa, t, n);
  else {
    const r = kd(t);
    n == null || r && !Mu(n) ? e.removeAttribute(t) : e.setAttribute(t, r ? "" : n);
  }
}
function Dp(e, t, n, o, i, r, s) {
  if (t === "innerHTML" || t === "textContent") {
    o && s(o, i, r), e[t] = n ?? "";
    return;
  }
  const l = e.tagName;
  if (t === "value" && l !== "PROGRESS" && // custom elements may use _value internally
  !l.includes("-")) {
    e._value = n;
    const u = l === "OPTION" ? e.getAttribute("value") : e.value, c = n ?? "";
    u !== c && (e.value = c), n == null && e.removeAttribute(t);
    return;
  }
  let a = !1;
  if (n === "" || n == null) {
    const u = typeof e[t];
    u === "boolean" ? n = Mu(n) : n == null && u === "string" ? (n = "", a = !0) : u === "number" && (n = 0, a = !0);
  }
  try {
    e[t] = n;
  } catch {
  }
  a && e.removeAttribute(t);
}
function kp(e, t, n, o) {
  e.addEventListener(t, n, o);
}
function Rp(e, t, n, o) {
  e.removeEventListener(t, n, o);
}
const ia = Symbol("_vei");
function zp(e, t, n, o, i = null) {
  const r = e[ia] || (e[ia] = {}), s = r[t];
  if (o && s)
    s.value = o;
  else {
    const [l, a] = Hp(t);
    if (o) {
      const u = r[t] = Bp(o, i);
      kp(e, l, u, a);
    } else
      s && (Rp(e, l, s, a), r[t] = void 0);
  }
}
const ra = /(?:Once|Passive|Capture)$/;
function Hp(e) {
  let t;
  if (ra.test(e)) {
    t = {};
    let o;
    for (; o = e.match(ra); )
      e = e.slice(0, e.length - o[0].length), t[o[0].toLowerCase()] = !0;
  }
  return [e[2] === ":" ? e.slice(3) : ct(e.slice(2)), t];
}
let Ir = 0;
const Fp = /* @__PURE__ */ Promise.resolve(), Vp = () => Ir || (Fp.then(() => Ir = 0), Ir = Date.now());
function Bp(e, t) {
  const n = (o) => {
    if (!o._vts)
      o._vts = Date.now();
    else if (o._vts <= n.attached)
      return;
    _t(
      Lp(o, n.value),
      t,
      5,
      [o]
    );
  };
  return n.value = e, n.attached = Vp(), n;
}
function Lp(e, t) {
  if (ge(t)) {
    const n = e.stopImmediatePropagation;
    return e.stopImmediatePropagation = () => {
      n.call(e), e._stopped = !0;
    }, t.map((o) => (i) => !i._stopped && o && o(i));
  } else
    return t;
}
const sa = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // lowercase letter
e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Up = (e, t, n, o, i, r, s, l, a) => {
  const u = i === "svg";
  t === "class" ? Ap(e, o, u) : t === "style" ? Tp(e, n, o) : Yi(t) ? Is(t) || zp(e, t, n, o, s) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : Gp(e, t, o, u)) ? Dp(
    e,
    t,
    o,
    r,
    s,
    l,
    a
  ) : (t === "true-value" ? e._trueValue = o : t === "false-value" && (e._falseValue = o), Op(e, t, o, u));
};
function Gp(e, t, n, o) {
  if (o)
    return !!(t === "innerHTML" || t === "textContent" || t in e && sa(t) && _e(n));
  if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA")
    return !1;
  if (t === "width" || t === "height") {
    const i = e.tagName;
    if (i === "IMG" || i === "VIDEO" || i === "CANVAS" || i === "SOURCE")
      return !1;
  }
  return sa(t) && Oe(n) ? !1 : t in e;
}
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function Yp(e, t) {
  const n = /* @__PURE__ */ Se(e);
  class o extends el {
    constructor(r) {
      super(n, r, t);
    }
  }
  return o.def = n, o;
}
const Wp = typeof HTMLElement < "u" ? HTMLElement : class {
};
class el extends Wp {
  constructor(t, n = {}, o) {
    super(), this._def = t, this._props = n, this._instance = null, this._connected = !1, this._resolved = !1, this._numberProps = null, this._ob = null, this.shadowRoot && o ? o(this._createVNode(), this.shadowRoot) : (this.attachShadow({ mode: "open" }), this._def.__asyncLoader || this._resolveProps(this._def));
  }
  connectedCallback() {
    this._connected = !0, this._instance || (this._resolved ? this._update() : this._resolveDef());
  }
  disconnectedCallback() {
    this._connected = !1, this._ob && (this._ob.disconnect(), this._ob = null), nt(() => {
      this._connected || (aa(null, this.shadowRoot), this._instance = null);
    });
  }
  /**
   * resolve inner component definition (handle possible async component)
   */
  _resolveDef() {
    this._resolved = !0;
    for (let o = 0; o < this.attributes.length; o++)
      this._setAttr(this.attributes[o].name);
    this._ob = new MutationObserver((o) => {
      for (const i of o)
        this._setAttr(i.attributeName);
    }), this._ob.observe(this, { attributes: !0 });
    const t = (o, i = !1) => {
      const { props: r, styles: s } = o;
      let l;
      if (r && !ge(r))
        for (const a in r) {
          const u = r[a];
          (u === Number || u && u.type === Number) && (a in this._props && (this._props[a] = Nl(this._props[a])), (l || (l = /* @__PURE__ */ Object.create(null)))[tt(a)] = !0);
        }
      this._numberProps = l, i && this._resolveProps(o), this._applyStyles(s), this._update();
    }, n = this._def.__asyncLoader;
    n ? n().then((o) => t(o, !0)) : t(this._def);
  }
  _resolveProps(t) {
    const { props: n } = t, o = ge(n) ? n : Object.keys(n || {});
    for (const i of Object.keys(this))
      i[0] !== "_" && o.includes(i) && this._setProp(i, this[i], !0, !1);
    for (const i of o.map(tt))
      Object.defineProperty(this, i, {
        get() {
          return this._getProp(i);
        },
        set(r) {
          this._setProp(i, r);
        }
      });
  }
  _setAttr(t) {
    let n = this.getAttribute(t);
    const o = tt(t);
    this._numberProps && this._numberProps[o] && (n = Nl(n)), this._setProp(o, n, !1);
  }
  /**
   * @internal
   */
  _getProp(t) {
    return this._props[t];
  }
  /**
   * @internal
   */
  _setProp(t, n, o = !0, i = !0) {
    n !== this._props[t] && (this._props[t] = n, i && this._instance && this._update(), o && (n === !0 ? this.setAttribute(ct(t), "") : typeof n == "string" || typeof n == "number" ? this.setAttribute(ct(t), n + "") : n || this.removeAttribute(ct(t))));
  }
  _update() {
    aa(this._createVNode(), this.shadowRoot);
  }
  _createVNode() {
    const t = me(this._def, Le({}, this._props));
    return this._instance || (t.ce = (n) => {
      this._instance = n, n.isCE = !0;
      const o = (r, s) => {
        this.dispatchEvent(
          new CustomEvent(r, {
            detail: s
          })
        );
      };
      n.emit = (r, ...s) => {
        o(r, s), ct(r) !== r && o(ct(r), s);
      };
      let i = this;
      for (; i = i && (i.parentNode || i.host); )
        if (i instanceof el) {
          n.parent = i._instance, n.provides = i._instance.provides;
          break;
        }
    }), t;
  }
  _applyStyles(t) {
    t && t.forEach((n) => {
      const o = document.createElement("style");
      o.textContent = n, this.shadowRoot.appendChild(o);
    });
  }
}
const Xp = /* @__PURE__ */ Le({ patchProp: Up }, Sp);
let la;
function Jp() {
  return la || (la = tp(Xp));
}
const aa = (...e) => {
  Jp().render(...e);
};
var Kp = { ALLUSERSPROFILE: "C:\\ProgramData", APPDATA: "C:\\Users\\JMHJAN\\AppData\\Roaming", ChocolateyInstall: "C:\\ProgramData\\chocolatey", ChocolateyLastPathUpdate: "133389135576090422", CHROME_CRASHPAD_PIPE_NAME: "\\\\.\\pipe\\crashpad_25180_KXBCAKYGAELWKVPL", COLOR: "1", COLORTERM: "truecolor", CommonProgramFiles: "C:\\Program Files\\Common Files", "CommonProgramFiles(x86)": "C:\\Program Files (x86)\\Common Files", CommonProgramW6432: "C:\\Program Files\\Common Files", COMPUTERNAME: "LAPTOP_JOERGEN", ComSpec: "C:\\Windows\\system32\\cmd.exe", DriverData: "C:\\Windows\\System32\\Drivers\\DriverData", EDITOR: "C:\\Windows\\notepad.exe", EFC_2352: "1", GIT_ASKPASS: "c:\\Users\\JMHJAN\\AppData\\Local\\Programs\\Microsoft VS Code\\resources\\app\\extensions\\git\\dist\\askpass.sh", GOPATH: "C:\\Users\\JMHJAN\\go", HOME: "C:\\Users\\JMHJAN", HOMEDRIVE: "C:", HOMEPATH: "\\Users\\JMHJAN", IGCCSVC_DB: "AQAAANCMnd8BFdERjHoAwE/Cl+sBAAAAQkSqH1ewk02HRLVBM/L7hwQAAAACAAAAAAAQZgAAAAEAACAAAAB1TGMIwFc2etDaIT1zP4yA02PpXcsk0OCqCuuvrMoHqwAAAAAOgAAAAAIAACAAAACABU6LadoSaxSH74pw7zxAoswMbahh+tyQeNt4q1Cb62AAAACueDWviHtZGwXhnUmISDM6leMoqYV/LMRcU1u8oDZeQZdtbeUDVZMO6IbFnGVe6hdT8ctGoOQvkP86mWQ15QKr+tmh3agdCDW0A7yUNCrIu+GybX6v8uKzX2dHugM0KH9AAAAAakm4BLT0fmKlepg5eA6PCGC05a9BLgqSZompzAO4dqhaljExGudnQPSDJviCZFtoaixncAk3US7NkTRBgRwWTQ==", INIT_CWD: "C:\\repos\\vue-flow-test", LANG: "en_US.UTF-8", lib: "C:\\Program Files (x86)\\SQLXML 3.0\\bin\\", LOCALAPPDATA: "C:\\Users\\JMHJAN\\AppData\\Local", LOGONSERVER: "\\\\LAPTOP_JOERGEN", MOZ_PLUGIN_PATH: "C:\\Program Files (x86)\\Foxit Software\\Foxit PDF Reader\\plugins\\", NODE: "C:\\Program Files\\nodejs\\node.exe", NODE_ENV: "production", NODE_EXE: "C:\\Program Files\\nodejs\\\\node.exe", NPM_CLI_JS: "C:\\Program Files\\nodejs\\node_modules\\npm\\bin\\npm-cli.js", npm_command: "run-script", npm_config_cache: "C:\\Users\\JMHJAN\\AppData\\Local\\npm-cache", npm_config_globalconfig: "C:\\Program Files\\nodejs\\etc\\npmrc", npm_config_global_prefix: "C:\\Program Files\\nodejs", npm_config_init_module: "C:\\Users\\JMHJAN\\.npm-init.js", npm_config_local_prefix: "C:\\repos\\vue-flow-test", npm_config_node_gyp: "C:\\Users\\JMHJAN\\AppData\\Roaming\\nvm\\v18.19.0\\node_modules\\npm\\node_modules\\node-gyp\\bin\\node-gyp.js", npm_config_noproxy: "", npm_config_npm_version: "10.2.3", npm_config_prefix: "C:\\Program Files\\nodejs", npm_config_userconfig: "C:\\Users\\JMHJAN\\.npmrc", npm_config_user_agent: "npm/10.2.3 node/v18.19.0 win32 x64 workspaces/false", npm_execpath: "C:\\Users\\JMHJAN\\AppData\\Roaming\\nvm\\v18.19.0\\node_modules\\npm\\bin\\npm-cli.js", npm_lifecycle_event: "build", npm_lifecycle_script: "vue-tsc --noEmit && vite build", npm_node_execpath: "C:\\Program Files\\nodejs\\node.exe", npm_package_json: "C:\\repos\\vue-flow-test\\package.json", npm_package_name: "vue-flow-test", npm_package_version: "0.0.0", NPM_PREFIX_NPM_CLI_JS: "C:\\Program Files\\nodejs\\node_modules\\npm\\bin\\npm-cli.js", NUMBER_OF_PROCESSORS: "24", NVM_HOME: "C:\\Users\\JMHJAN\\AppData\\Roaming\\nvm", NVM_SYMLINK: "C:\\Program Files\\nodejs", OculusBase: "C:\\Program Files\\Oculus\\", OneDrive: "C:\\Users\\JMHJAN\\OneDrivePrivat\\OneDrive", OneDriveConsumer: "C:\\Users\\JMHJAN\\OneDrivePrivat\\OneDrive", ORIGINAL_XDG_CURRENT_DESKTOP: "undefined", OS: "Windows_NT", Path: "C:\\repos\\vue-flow-test\\node_modules\\.bin;C:\\repos\\node_modules\\.bin;C:\\node_modules\\.bin;C:\\Users\\JMHJAN\\AppData\\Roaming\\nvm\\v18.19.0\\node_modules\\npm\\node_modules\\@npmcli\\run-script\\lib\\node-gyp-bin;C:\\Program Files\\Python311\\Scripts\\;C:\\Program Files\\Python311\\;C:\\Program Files\\Oculus\\Support\\oculus-runtime;C:\\Python311\\Scripts\\;C:\\Python311\\;C:\\Windows\\system32;C:\\Windows;C:\\Windows\\System32\\Wbem;C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\;C:\\Windows\\System32\\OpenSSH\\;C:\\Program Files\\dotnet\\;C:\\ProgramData\\chocolatey\\bin;C:\\Program Files\\Tailscale\\;C:\\Windows\\system32\\Tani;C:\\Program Files\\Git\\cmd;C:\\Program Files\\Go\\bin;C:\\Program Files\\PuTTY\\;%NVM_HOME%;%NVM_SYMLINK%;C:\\Program Files\\Docker\\Docker\\resources\\bin;C:\\Users\\JMHJAN\\AppData\\Local\\Microsoft\\WindowsApps;C:\\Users\\JMHJAN\\AppData\\Local\\Programs\\Microsoft VS Code\\bin;C:\\Program Files (x86)\\Nmap;C:\\Users\\JMHJAN\\go\\bin;C:\\Users\\JMHJAN\\AppData\\Roaming\\nvm;C:\\Program Files\\nodejs", PATHEXT: ".COM;.EXE;.BAT;.CMD;.VBS;.VBE;.JS;.JSE;.WSF;.WSH;.MSC;.PY;.PYW;.CPL", PROCESSOR_ARCHITECTURE: "AMD64", PROCESSOR_IDENTIFIER: "Intel64 Family 6 Model 191 Stepping 2, GenuineIntel", PROCESSOR_LEVEL: "6", PROCESSOR_REVISION: "bf02", ProgramData: "C:\\ProgramData", ProgramFiles: "C:\\Program Files", "ProgramFiles(x86)": "C:\\Program Files (x86)", ProgramW6432: "C:\\Program Files", PROMPT: "$P$G", PSModulePath: "C:\\Users\\JMHJAN\\Documents\\WindowsPowerShell\\Modules;C:\\Program Files\\WindowsPowerShell\\Modules;C:\\Windows\\system32\\WindowsPowerShell\\v1.0\\Modules", PUBLIC: "C:\\Users\\Public", SESSIONNAME: "Console", SystemDrive: "C:", SystemRoot: "C:\\Windows", TEMP: "C:\\Users\\JMHJAN\\AppData\\Local\\Temp", TERM_PROGRAM: "vscode", TERM_PROGRAM_VERSION: "1.86.2", TMP: "C:\\Users\\JMHJAN\\AppData\\Local\\Temp", USERDNSDOMAIN: "doorway.loc", USERDOMAIN: "DOORWAY", USERDOMAIN_ROAMINGPROFILE: "DOORWAY", USERNAME: "JMHJAN", USERPROFILE: "C:\\Users\\JMHJAN", VSCODE_GIT_ASKPASS_EXTRA_ARGS: "", VSCODE_GIT_ASKPASS_MAIN: "c:\\Users\\JMHJAN\\AppData\\Local\\Programs\\Microsoft VS Code\\resources\\app\\extensions\\git\\dist\\askpass-main.js", VSCODE_GIT_ASKPASS_NODE: "C:\\Users\\JMHJAN\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe", VSCODE_GIT_IPC_HANDLE: "\\\\.\\pipe\\vscode-git-ebe95352d0-sock", VSCODE_INJECTION: "1", VSCODE_NONCE: "bd882d3e-f614-49d3-be9c-cd8c6c7e3d1d", windir: "C:\\Windows", ZES_ENABLE_SYSMAN: "1" };
function lr(e) {
  return ks() ? (li(e), !0) : !1;
}
function ve(e) {
  return typeof e == "function" ? e() : G(e);
}
const qp = typeof window < "u" && typeof document < "u", Zp = (e) => typeof e < "u", Qp = Object.prototype.toString, jp = (e) => Qp.call(e) === "[object Object]", Pc = () => {
};
function eg(e, t) {
  function n(...o) {
    return new Promise((i, r) => {
      Promise.resolve(e(() => t.apply(this, o), { fn: t, thisArg: this, args: o })).then(i).catch(r);
    });
  }
  return n;
}
const Tc = (e) => e();
function tg(e = Tc) {
  const t = be(!0);
  function n() {
    t.value = !1;
  }
  function o() {
    t.value = !0;
  }
  const i = (...r) => {
    t.value && e(...r);
  };
  return { isActive: qi(t), pause: n, resume: o, eventFilter: i };
}
function ua(e, t = !1, n = "Timeout") {
  return new Promise((o, i) => {
    setTimeout(t ? () => i(n) : o, e);
  });
}
function Xe(...e) {
  if (e.length !== 1)
    return ke(...e);
  const t = e[0];
  return typeof t == "function" ? qi(Gs(() => ({ get: t, set: Pc }))) : be(t);
}
function ng(e, t, n = {}) {
  const {
    eventFilter: o = Tc,
    ...i
  } = n;
  return we(
    e,
    eg(
      o,
      t
    ),
    i
  );
}
function Cn(e, t, n = {}) {
  const {
    eventFilter: o,
    ...i
  } = n, { eventFilter: r, pause: s, resume: l, isActive: a } = tg(o);
  return { stop: ng(
    e,
    t,
    {
      ...i,
      eventFilter: r
    }
  ), pause: s, resume: l, isActive: a };
}
function og(e, t = {}) {
  if (!Fe(e))
    return uh(e);
  const n = Array.isArray(e.value) ? Array.from({ length: e.value.length }) : {};
  for (const o in e.value)
    n[o] = Gs(() => ({
      get() {
        return e.value[o];
      },
      set(i) {
        var r;
        if ((r = ve(t.replaceRef)) != null ? r : !0)
          if (Array.isArray(e.value)) {
            const l = [...e.value];
            l[o] = i, e.value = l;
          } else {
            const l = { ...e.value, [o]: i };
            Object.setPrototypeOf(l, Object.getPrototypeOf(e.value)), e.value = l;
          }
        else
          e.value[o] = i;
      }
    }));
  return n;
}
function rs(e, t = !1) {
  function n(f, { flush: d = "sync", deep: p = !1, timeout: E, throwOnTimeout: m } = {}) {
    let _ = null;
    const C = [new Promise((N) => {
      _ = we(
        e,
        (y) => {
          f(y) !== t && (_ == null || _(), N(y));
        },
        {
          flush: d,
          deep: p,
          immediate: !0
        }
      );
    })];
    return E != null && C.push(
      ua(E, m).then(() => ve(e)).finally(() => _ == null ? void 0 : _())
    ), Promise.race(C);
  }
  function o(f, d) {
    if (!Fe(f))
      return n((y) => y === f, d);
    const { flush: p = "sync", deep: E = !1, timeout: m, throwOnTimeout: _ } = d ?? {};
    let b = null;
    const N = [new Promise((y) => {
      b = we(
        [e, f],
        ([D, O]) => {
          t !== (D === O) && (b == null || b(), y(D));
        },
        {
          flush: p,
          deep: E,
          immediate: !0
        }
      );
    })];
    return m != null && N.push(
      ua(m, _).then(() => ve(e)).finally(() => (b == null || b(), ve(e)))
    ), Promise.race(N);
  }
  function i(f) {
    return n((d) => !!d, f);
  }
  function r(f) {
    return o(null, f);
  }
  function s(f) {
    return o(void 0, f);
  }
  function l(f) {
    return n(Number.isNaN, f);
  }
  function a(f, d) {
    return n((p) => {
      const E = Array.from(p);
      return E.includes(f) || E.includes(ve(f));
    }, d);
  }
  function u(f) {
    return c(1, f);
  }
  function c(f = 1, d) {
    let p = -1;
    return n(() => (p += 1, p >= f), d);
  }
  return Array.isArray(ve(e)) ? {
    toMatch: n,
    toContains: a,
    changed: u,
    changedTimes: c,
    get not() {
      return rs(e, !t);
    }
  } : {
    toMatch: n,
    toBe: o,
    toBeTruthy: i,
    toBeNull: r,
    toBeNaN: l,
    toBeUndefined: s,
    changed: u,
    changedTimes: c,
    get not() {
      return rs(e, !t);
    }
  };
}
function Ai(e) {
  return rs(e);
}
function ig(e) {
  var t;
  const n = ve(e);
  return (t = n == null ? void 0 : n.$el) != null ? t : n;
}
const Ic = qp ? window : void 0;
function Oc(...e) {
  let t, n, o, i;
  if (typeof e[0] == "string" || Array.isArray(e[0]) ? ([n, o, i] = e, t = Ic) : [t, n, o, i] = e, !t)
    return Pc;
  Array.isArray(n) || (n = [n]), Array.isArray(o) || (o = [o]);
  const r = [], s = () => {
    r.forEach((c) => c()), r.length = 0;
  }, l = (c, f, d, p) => (c.addEventListener(f, d, p), () => c.removeEventListener(f, d, p)), a = we(
    () => [ig(t), ve(i)],
    ([c, f]) => {
      if (s(), !c)
        return;
      const d = jp(f) ? { ...f } : f;
      r.push(
        ...n.flatMap((p) => o.map((E) => l(c, p, E, d)))
      );
    },
    { immediate: !0, flush: "post" }
  ), u = () => {
    a(), s();
  };
  return lr(u), u;
}
function rg(e) {
  return typeof e == "function" ? e : typeof e == "string" ? (t) => t.key === e : Array.isArray(e) ? (t) => e.includes(t.key) : () => !0;
}
function ca(...e) {
  let t, n, o = {};
  e.length === 3 ? (t = e[0], n = e[1], o = e[2]) : e.length === 2 ? typeof e[1] == "object" ? (t = !0, n = e[0], o = e[1]) : (t = e[0], n = e[1]) : (t = !0, n = e[0]);
  const {
    target: i = Ic,
    eventName: r = "keydown",
    passive: s = !1,
    dedupe: l = !1
  } = o, a = rg(t);
  return Oc(i, r, (c) => {
    c.repeat && ve(l) || a(c) && n(c);
  }, s);
}
function sg(e) {
  return JSON.parse(JSON.stringify(e));
}
function go(e, t, n, o = {}) {
  var i, r, s;
  const {
    clone: l = !1,
    passive: a = !1,
    eventName: u,
    deep: c = !1,
    defaultValue: f,
    shouldEmit: d
  } = o, p = Do(), E = n || (p == null ? void 0 : p.emit) || ((i = p == null ? void 0 : p.$emit) == null ? void 0 : i.bind(p)) || ((s = (r = p == null ? void 0 : p.proxy) == null ? void 0 : r.$emit) == null ? void 0 : s.bind(p == null ? void 0 : p.proxy));
  let m = u;
  t || (t = "modelValue"), m = m || `update:${t.toString()}`;
  const _ = (N) => l ? typeof l == "function" ? l(N) : sg(N) : N, b = () => Zp(e[t]) ? _(e[t]) : f, C = (N) => {
    d ? d(N) && E(m, N) : E(m, N);
  };
  if (a) {
    const N = b(), y = be(N);
    let D = !1;
    return we(
      () => e[t],
      (O) => {
        D || (D = !0, y.value = _(O), nt(() => D = !1));
      }
    ), we(
      y,
      (O) => {
        !D && (O !== e[t] || c) && C(O);
      },
      { deep: c }
    ), y;
  } else
    return he({
      get() {
        return b();
      },
      set(N) {
        C(N);
      }
    });
}
var lg = { value: () => {
} };
function ar() {
  for (var e = 0, t = arguments.length, n = {}, o; e < t; ++e) {
    if (!(o = arguments[e] + "") || o in n || /[\s.]/.test(o))
      throw new Error("illegal type: " + o);
    n[o] = [];
  }
  return new ci(n);
}
function ci(e) {
  this._ = e;
}
function ag(e, t) {
  return e.trim().split(/^|\s+/).map(function(n) {
    var o = "", i = n.indexOf(".");
    if (i >= 0 && (o = n.slice(i + 1), n = n.slice(0, i)), n && !t.hasOwnProperty(n))
      throw new Error("unknown type: " + n);
    return { type: n, name: o };
  });
}
ci.prototype = ar.prototype = {
  constructor: ci,
  on: function(e, t) {
    var n = this._, o = ag(e + "", n), i, r = -1, s = o.length;
    if (arguments.length < 2) {
      for (; ++r < s; )
        if ((i = (e = o[r]).type) && (i = ug(n[i], e.name)))
          return i;
      return;
    }
    if (t != null && typeof t != "function")
      throw new Error("invalid callback: " + t);
    for (; ++r < s; )
      if (i = (e = o[r]).type)
        n[i] = fa(n[i], e.name, t);
      else if (t == null)
        for (i in n)
          n[i] = fa(n[i], e.name, null);
    return this;
  },
  copy: function() {
    var e = {}, t = this._;
    for (var n in t)
      e[n] = t[n].slice();
    return new ci(e);
  },
  call: function(e, t) {
    if ((i = arguments.length - 2) > 0)
      for (var n = new Array(i), o = 0, i, r; o < i; ++o)
        n[o] = arguments[o + 2];
    if (!this._.hasOwnProperty(e))
      throw new Error("unknown type: " + e);
    for (r = this._[e], o = 0, i = r.length; o < i; ++o)
      r[o].value.apply(t, n);
  },
  apply: function(e, t, n) {
    if (!this._.hasOwnProperty(e))
      throw new Error("unknown type: " + e);
    for (var o = this._[e], i = 0, r = o.length; i < r; ++i)
      o[i].value.apply(t, n);
  }
};
function ug(e, t) {
  for (var n = 0, o = e.length, i; n < o; ++n)
    if ((i = e[n]).name === t)
      return i.value;
}
function fa(e, t, n) {
  for (var o = 0, i = e.length; o < i; ++o)
    if (e[o].name === t) {
      e[o] = lg, e = e.slice(0, o).concat(e.slice(o + 1));
      break;
    }
  return n != null && e.push({ name: t, value: n }), e;
}
var ss = "http://www.w3.org/1999/xhtml";
const da = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: ss,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function ur(e) {
  var t = e += "", n = t.indexOf(":");
  return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), da.hasOwnProperty(t) ? { space: da[t], local: e } : e;
}
function cg(e) {
  return function() {
    var t = this.ownerDocument, n = this.namespaceURI;
    return n === ss && t.documentElement.namespaceURI === ss ? t.createElement(e) : t.createElementNS(n, e);
  };
}
function fg(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function Dc(e) {
  var t = ur(e);
  return (t.local ? fg : cg)(t);
}
function dg() {
}
function tl(e) {
  return e == null ? dg : function() {
    return this.querySelector(e);
  };
}
function hg(e) {
  typeof e != "function" && (e = tl(e));
  for (var t = this._groups, n = t.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = t[i], s = r.length, l = o[i] = new Array(s), a, u, c = 0; c < s; ++c)
      (a = r[c]) && (u = e.call(a, a.__data__, c, r)) && ("__data__" in a && (u.__data__ = a.__data__), l[c] = u);
  return new at(o, this._parents);
}
function pg(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function gg() {
  return [];
}
function kc(e) {
  return e == null ? gg : function() {
    return this.querySelectorAll(e);
  };
}
function mg(e) {
  return function() {
    return pg(e.apply(this, arguments));
  };
}
function vg(e) {
  typeof e == "function" ? e = mg(e) : e = kc(e);
  for (var t = this._groups, n = t.length, o = [], i = [], r = 0; r < n; ++r)
    for (var s = t[r], l = s.length, a, u = 0; u < l; ++u)
      (a = s[u]) && (o.push(e.call(a, a.__data__, u, s)), i.push(a));
  return new at(o, i);
}
function Rc(e) {
  return function() {
    return this.matches(e);
  };
}
function zc(e) {
  return function(t) {
    return t.matches(e);
  };
}
var _g = Array.prototype.find;
function yg(e) {
  return function() {
    return _g.call(this.children, e);
  };
}
function wg() {
  return this.firstElementChild;
}
function bg(e) {
  return this.select(e == null ? wg : yg(typeof e == "function" ? e : zc(e)));
}
var xg = Array.prototype.filter;
function Eg() {
  return Array.from(this.children);
}
function $g(e) {
  return function() {
    return xg.call(this.children, e);
  };
}
function Cg(e) {
  return this.selectAll(e == null ? Eg : $g(typeof e == "function" ? e : zc(e)));
}
function Sg(e) {
  typeof e != "function" && (e = Rc(e));
  for (var t = this._groups, n = t.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = t[i], s = r.length, l = o[i] = [], a, u = 0; u < s; ++u)
      (a = r[u]) && e.call(a, a.__data__, u, r) && l.push(a);
  return new at(o, this._parents);
}
function Hc(e) {
  return new Array(e.length);
}
function Ng() {
  return new at(this._enter || this._groups.map(Hc), this._parents);
}
function Mi(e, t) {
  this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
Mi.prototype = {
  constructor: Mi,
  appendChild: function(e) {
    return this._parent.insertBefore(e, this._next);
  },
  insertBefore: function(e, t) {
    return this._parent.insertBefore(e, t);
  },
  querySelector: function(e) {
    return this._parent.querySelector(e);
  },
  querySelectorAll: function(e) {
    return this._parent.querySelectorAll(e);
  }
};
function Ag(e) {
  return function() {
    return e;
  };
}
function Mg(e, t, n, o, i, r) {
  for (var s = 0, l, a = t.length, u = r.length; s < u; ++s)
    (l = t[s]) ? (l.__data__ = r[s], o[s] = l) : n[s] = new Mi(e, r[s]);
  for (; s < a; ++s)
    (l = t[s]) && (i[s] = l);
}
function Pg(e, t, n, o, i, r, s) {
  var l, a, u = /* @__PURE__ */ new Map(), c = t.length, f = r.length, d = new Array(c), p;
  for (l = 0; l < c; ++l)
    (a = t[l]) && (d[l] = p = s.call(a, a.__data__, l, t) + "", u.has(p) ? i[l] = a : u.set(p, a));
  for (l = 0; l < f; ++l)
    p = s.call(e, r[l], l, r) + "", (a = u.get(p)) ? (o[l] = a, a.__data__ = r[l], u.delete(p)) : n[l] = new Mi(e, r[l]);
  for (l = 0; l < c; ++l)
    (a = t[l]) && u.get(d[l]) === a && (i[l] = a);
}
function Tg(e) {
  return e.__data__;
}
function Ig(e, t) {
  if (!arguments.length)
    return Array.from(this, Tg);
  var n = t ? Pg : Mg, o = this._parents, i = this._groups;
  typeof e != "function" && (e = Ag(e));
  for (var r = i.length, s = new Array(r), l = new Array(r), a = new Array(r), u = 0; u < r; ++u) {
    var c = o[u], f = i[u], d = f.length, p = Og(e.call(c, c && c.__data__, u, o)), E = p.length, m = l[u] = new Array(E), _ = s[u] = new Array(E), b = a[u] = new Array(d);
    n(c, f, m, _, b, p, t);
    for (var C = 0, N = 0, y, D; C < E; ++C)
      if (y = m[C]) {
        for (C >= N && (N = C + 1); !(D = _[N]) && ++N < E; )
          ;
        y._next = D || null;
      }
  }
  return s = new at(s, o), s._enter = l, s._exit = a, s;
}
function Og(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function Dg() {
  return new at(this._exit || this._groups.map(Hc), this._parents);
}
function kg(e, t, n) {
  var o = this.enter(), i = this, r = this.exit();
  return typeof e == "function" ? (o = e(o), o && (o = o.selection())) : o = o.append(e + ""), t != null && (i = t(i), i && (i = i.selection())), n == null ? r.remove() : n(r), o && i ? o.merge(i).order() : i;
}
function Rg(e) {
  for (var t = e.selection ? e.selection() : e, n = this._groups, o = t._groups, i = n.length, r = o.length, s = Math.min(i, r), l = new Array(i), a = 0; a < s; ++a)
    for (var u = n[a], c = o[a], f = u.length, d = l[a] = new Array(f), p, E = 0; E < f; ++E)
      (p = u[E] || c[E]) && (d[E] = p);
  for (; a < i; ++a)
    l[a] = n[a];
  return new at(l, this._parents);
}
function zg() {
  for (var e = this._groups, t = -1, n = e.length; ++t < n; )
    for (var o = e[t], i = o.length - 1, r = o[i], s; --i >= 0; )
      (s = o[i]) && (r && s.compareDocumentPosition(r) ^ 4 && r.parentNode.insertBefore(s, r), r = s);
  return this;
}
function Hg(e) {
  e || (e = Fg);
  function t(f, d) {
    return f && d ? e(f.__data__, d.__data__) : !f - !d;
  }
  for (var n = this._groups, o = n.length, i = new Array(o), r = 0; r < o; ++r) {
    for (var s = n[r], l = s.length, a = i[r] = new Array(l), u, c = 0; c < l; ++c)
      (u = s[c]) && (a[c] = u);
    a.sort(t);
  }
  return new at(i, this._parents).order();
}
function Fg(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function Vg() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function Bg() {
  return Array.from(this);
}
function Lg() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var o = e[t], i = 0, r = o.length; i < r; ++i) {
      var s = o[i];
      if (s)
        return s;
    }
  return null;
}
function Ug() {
  let e = 0;
  for (const t of this)
    ++e;
  return e;
}
function Gg() {
  return !this.node();
}
function Yg(e) {
  for (var t = this._groups, n = 0, o = t.length; n < o; ++n)
    for (var i = t[n], r = 0, s = i.length, l; r < s; ++r)
      (l = i[r]) && e.call(l, l.__data__, r, i);
  return this;
}
function Wg(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function Xg(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function Jg(e, t) {
  return function() {
    this.setAttribute(e, t);
  };
}
function Kg(e, t) {
  return function() {
    this.setAttributeNS(e.space, e.local, t);
  };
}
function qg(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
  };
}
function Zg(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
  };
}
function Qg(e, t) {
  var n = ur(e);
  if (arguments.length < 2) {
    var o = this.node();
    return n.local ? o.getAttributeNS(n.space, n.local) : o.getAttribute(n);
  }
  return this.each((t == null ? n.local ? Xg : Wg : typeof t == "function" ? n.local ? Zg : qg : n.local ? Kg : Jg)(n, t));
}
function Fc(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function jg(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function em(e, t, n) {
  return function() {
    this.style.setProperty(e, t, n);
  };
}
function tm(e, t, n) {
  return function() {
    var o = t.apply(this, arguments);
    o == null ? this.style.removeProperty(e) : this.style.setProperty(e, o, n);
  };
}
function nm(e, t, n) {
  return arguments.length > 1 ? this.each((t == null ? jg : typeof t == "function" ? tm : em)(e, t, n ?? "")) : Bn(this.node(), e);
}
function Bn(e, t) {
  return e.style.getPropertyValue(t) || Fc(e).getComputedStyle(e, null).getPropertyValue(t);
}
function om(e) {
  return function() {
    delete this[e];
  };
}
function im(e, t) {
  return function() {
    this[e] = t;
  };
}
function rm(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? delete this[e] : this[e] = n;
  };
}
function sm(e, t) {
  return arguments.length > 1 ? this.each((t == null ? om : typeof t == "function" ? rm : im)(e, t)) : this.node()[e];
}
function Vc(e) {
  return e.trim().split(/^|\s+/);
}
function nl(e) {
  return e.classList || new Bc(e);
}
function Bc(e) {
  this._node = e, this._names = Vc(e.getAttribute("class") || "");
}
Bc.prototype = {
  add: function(e) {
    var t = this._names.indexOf(e);
    t < 0 && (this._names.push(e), this._node.setAttribute("class", this._names.join(" ")));
  },
  remove: function(e) {
    var t = this._names.indexOf(e);
    t >= 0 && (this._names.splice(t, 1), this._node.setAttribute("class", this._names.join(" ")));
  },
  contains: function(e) {
    return this._names.indexOf(e) >= 0;
  }
};
function Lc(e, t) {
  for (var n = nl(e), o = -1, i = t.length; ++o < i; )
    n.add(t[o]);
}
function Uc(e, t) {
  for (var n = nl(e), o = -1, i = t.length; ++o < i; )
    n.remove(t[o]);
}
function lm(e) {
  return function() {
    Lc(this, e);
  };
}
function am(e) {
  return function() {
    Uc(this, e);
  };
}
function um(e, t) {
  return function() {
    (t.apply(this, arguments) ? Lc : Uc)(this, e);
  };
}
function cm(e, t) {
  var n = Vc(e + "");
  if (arguments.length < 2) {
    for (var o = nl(this.node()), i = -1, r = n.length; ++i < r; )
      if (!o.contains(n[i]))
        return !1;
    return !0;
  }
  return this.each((typeof t == "function" ? um : t ? lm : am)(n, t));
}
function fm() {
  this.textContent = "";
}
function dm(e) {
  return function() {
    this.textContent = e;
  };
}
function hm(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.textContent = t ?? "";
  };
}
function pm(e) {
  return arguments.length ? this.each(e == null ? fm : (typeof e == "function" ? hm : dm)(e)) : this.node().textContent;
}
function gm() {
  this.innerHTML = "";
}
function mm(e) {
  return function() {
    this.innerHTML = e;
  };
}
function vm(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.innerHTML = t ?? "";
  };
}
function _m(e) {
  return arguments.length ? this.each(e == null ? gm : (typeof e == "function" ? vm : mm)(e)) : this.node().innerHTML;
}
function ym() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function wm() {
  return this.each(ym);
}
function bm() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function xm() {
  return this.each(bm);
}
function Em(e) {
  var t = typeof e == "function" ? e : Dc(e);
  return this.select(function() {
    return this.appendChild(t.apply(this, arguments));
  });
}
function $m() {
  return null;
}
function Cm(e, t) {
  var n = typeof e == "function" ? e : Dc(e), o = t == null ? $m : typeof t == "function" ? t : tl(t);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), o.apply(this, arguments) || null);
  });
}
function Sm() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function Nm() {
  return this.each(Sm);
}
function Am() {
  var e = this.cloneNode(!1), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Mm() {
  var e = this.cloneNode(!0), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Pm(e) {
  return this.select(e ? Mm : Am);
}
function Tm(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function Im(e) {
  return function(t) {
    e.call(this, t, this.__data__);
  };
}
function Om(e) {
  return e.trim().split(/^|\s+/).map(function(t) {
    var n = "", o = t.indexOf(".");
    return o >= 0 && (n = t.slice(o + 1), t = t.slice(0, o)), { type: t, name: n };
  });
}
function Dm(e) {
  return function() {
    var t = this.__on;
    if (t) {
      for (var n = 0, o = -1, i = t.length, r; n < i; ++n)
        r = t[n], (!e.type || r.type === e.type) && r.name === e.name ? this.removeEventListener(r.type, r.listener, r.options) : t[++o] = r;
      ++o ? t.length = o : delete this.__on;
    }
  };
}
function km(e, t, n) {
  return function() {
    var o = this.__on, i, r = Im(t);
    if (o) {
      for (var s = 0, l = o.length; s < l; ++s)
        if ((i = o[s]).type === e.type && i.name === e.name) {
          this.removeEventListener(i.type, i.listener, i.options), this.addEventListener(i.type, i.listener = r, i.options = n), i.value = t;
          return;
        }
    }
    this.addEventListener(e.type, r, n), i = { type: e.type, name: e.name, value: t, listener: r, options: n }, o ? o.push(i) : this.__on = [i];
  };
}
function Rm(e, t, n) {
  var o = Om(e + ""), i, r = o.length, s;
  if (arguments.length < 2) {
    var l = this.node().__on;
    if (l) {
      for (var a = 0, u = l.length, c; a < u; ++a)
        for (i = 0, c = l[a]; i < r; ++i)
          if ((s = o[i]).type === c.type && s.name === c.name)
            return c.value;
    }
    return;
  }
  for (l = t ? km : Dm, i = 0; i < r; ++i)
    this.each(l(o[i], t, n));
  return this;
}
function Gc(e, t, n) {
  var o = Fc(e), i = o.CustomEvent;
  typeof i == "function" ? i = new i(t, n) : (i = o.document.createEvent("Event"), n ? (i.initEvent(t, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(t, !1, !1)), e.dispatchEvent(i);
}
function zm(e, t) {
  return function() {
    return Gc(this, e, t);
  };
}
function Hm(e, t) {
  return function() {
    return Gc(this, e, t.apply(this, arguments));
  };
}
function Fm(e, t) {
  return this.each((typeof t == "function" ? Hm : zm)(e, t));
}
function* Vm() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var o = e[t], i = 0, r = o.length, s; i < r; ++i)
      (s = o[i]) && (yield s);
}
var Yc = [null];
function at(e, t) {
  this._groups = e, this._parents = t;
}
function Ro() {
  return new at([[document.documentElement]], Yc);
}
function Bm() {
  return this;
}
at.prototype = Ro.prototype = {
  constructor: at,
  select: hg,
  selectAll: vg,
  selectChild: bg,
  selectChildren: Cg,
  filter: Sg,
  data: Ig,
  enter: Ng,
  exit: Dg,
  join: kg,
  merge: Rg,
  selection: Bm,
  order: zg,
  sort: Hg,
  call: Vg,
  nodes: Bg,
  node: Lg,
  size: Ug,
  empty: Gg,
  each: Yg,
  attr: Qg,
  style: nm,
  property: sm,
  classed: cm,
  text: pm,
  html: _m,
  raise: wm,
  lower: xm,
  append: Em,
  insert: Cm,
  remove: Nm,
  clone: Pm,
  datum: Tm,
  on: Rm,
  dispatch: Fm,
  [Symbol.iterator]: Vm
};
function pt(e) {
  return typeof e == "string" ? new at([[document.querySelector(e)]], [document.documentElement]) : new at([[e]], Yc);
}
function Lm(e) {
  let t;
  for (; t = e.sourceEvent; )
    e = t;
  return e;
}
function Et(e, t) {
  if (e = Lm(e), t === void 0 && (t = e.currentTarget), t) {
    var n = t.ownerSVGElement || t;
    if (n.createSVGPoint) {
      var o = n.createSVGPoint();
      return o.x = e.clientX, o.y = e.clientY, o = o.matrixTransform(t.getScreenCTM().inverse()), [o.x, o.y];
    }
    if (t.getBoundingClientRect) {
      var i = t.getBoundingClientRect();
      return [e.clientX - i.left - t.clientLeft, e.clientY - i.top - t.clientTop];
    }
  }
  return [e.pageX, e.pageY];
}
const Um = { passive: !1 }, xo = { capture: !0, passive: !1 };
function Or(e) {
  e.stopImmediatePropagation();
}
function On(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function Wc(e) {
  var t = e.document.documentElement, n = pt(e).on("dragstart.drag", On, xo);
  "onselectstart" in t ? n.on("selectstart.drag", On, xo) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function Xc(e, t) {
  var n = e.document.documentElement, o = pt(e).on("dragstart.drag", null);
  t && (o.on("click.drag", On, xo), setTimeout(function() {
    o.on("click.drag", null);
  }, 0)), "onselectstart" in n ? o.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
const Xo = (e) => () => e;
function ls(e, {
  sourceEvent: t,
  subject: n,
  target: o,
  identifier: i,
  active: r,
  x: s,
  y: l,
  dx: a,
  dy: u,
  dispatch: c
}) {
  Object.defineProperties(this, {
    type: { value: e, enumerable: !0, configurable: !0 },
    sourceEvent: { value: t, enumerable: !0, configurable: !0 },
    subject: { value: n, enumerable: !0, configurable: !0 },
    target: { value: o, enumerable: !0, configurable: !0 },
    identifier: { value: i, enumerable: !0, configurable: !0 },
    active: { value: r, enumerable: !0, configurable: !0 },
    x: { value: s, enumerable: !0, configurable: !0 },
    y: { value: l, enumerable: !0, configurable: !0 },
    dx: { value: a, enumerable: !0, configurable: !0 },
    dy: { value: u, enumerable: !0, configurable: !0 },
    _: { value: c }
  });
}
ls.prototype.on = function() {
  var e = this._.on.apply(this._, arguments);
  return e === this._ ? this : e;
};
function Gm(e) {
  return !e.ctrlKey && !e.button;
}
function Ym() {
  return this.parentNode;
}
function Wm(e, t) {
  return t ?? { x: e.x, y: e.y };
}
function Xm() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Jm() {
  var e = Gm, t = Ym, n = Wm, o = Xm, i = {}, r = ar("start", "drag", "end"), s = 0, l, a, u, c, f = 0;
  function d(y) {
    y.on("mousedown.drag", p).filter(o).on("touchstart.drag", _).on("touchmove.drag", b, Um).on("touchend.drag touchcancel.drag", C).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function p(y, D) {
    if (!(c || !e.call(this, y, D))) {
      var O = N(this, t.call(this, y, D), y, D, "mouse");
      O && (pt(y.view).on("mousemove.drag", E, xo).on("mouseup.drag", m, xo), Wc(y.view), Or(y), u = !1, l = y.clientX, a = y.clientY, O("start", y));
    }
  }
  function E(y) {
    if (On(y), !u) {
      var D = y.clientX - l, O = y.clientY - a;
      u = D * D + O * O > f;
    }
    i.mouse("drag", y);
  }
  function m(y) {
    pt(y.view).on("mousemove.drag mouseup.drag", null), Xc(y.view, u), On(y), i.mouse("end", y);
  }
  function _(y, D) {
    if (e.call(this, y, D)) {
      var O = y.changedTouches, S = t.call(this, y, D), V = O.length, X, Y;
      for (X = 0; X < V; ++X)
        (Y = N(this, S, y, D, O[X].identifier, O[X])) && (Or(y), Y("start", y, O[X]));
    }
  }
  function b(y) {
    var D = y.changedTouches, O = D.length, S, V;
    for (S = 0; S < O; ++S)
      (V = i[D[S].identifier]) && (On(y), V("drag", y, D[S]));
  }
  function C(y) {
    var D = y.changedTouches, O = D.length, S, V;
    for (c && clearTimeout(c), c = setTimeout(function() {
      c = null;
    }, 500), S = 0; S < O; ++S)
      (V = i[D[S].identifier]) && (Or(y), V("end", y, D[S]));
  }
  function N(y, D, O, S, V, X) {
    var Y = r.copy(), W = Et(X || O, D), le, K, g;
    if ((g = n.call(y, new ls("beforestart", {
      sourceEvent: O,
      target: d,
      identifier: V,
      active: s,
      x: W[0],
      y: W[1],
      dx: 0,
      dy: 0,
      dispatch: Y
    }), S)) != null)
      return le = g.x - W[0] || 0, K = g.y - W[1] || 0, function R(w, P, I) {
        var T = W, M;
        switch (w) {
          case "start":
            i[V] = R, M = s++;
            break;
          case "end":
            delete i[V], --s;
          case "drag":
            W = Et(I || P, D), M = s;
            break;
        }
        Y.call(
          w,
          y,
          new ls(w, {
            sourceEvent: P,
            subject: g,
            target: d,
            identifier: V,
            active: M,
            x: W[0] + le,
            y: W[1] + K,
            dx: W[0] - T[0],
            dy: W[1] - T[1],
            dispatch: Y
          }),
          S
        );
      };
  }
  return d.filter = function(y) {
    return arguments.length ? (e = typeof y == "function" ? y : Xo(!!y), d) : e;
  }, d.container = function(y) {
    return arguments.length ? (t = typeof y == "function" ? y : Xo(y), d) : t;
  }, d.subject = function(y) {
    return arguments.length ? (n = typeof y == "function" ? y : Xo(y), d) : n;
  }, d.touchable = function(y) {
    return arguments.length ? (o = typeof y == "function" ? y : Xo(!!y), d) : o;
  }, d.on = function() {
    var y = r.on.apply(r, arguments);
    return y === r ? d : y;
  }, d.clickDistance = function(y) {
    return arguments.length ? (f = (y = +y) * y, d) : Math.sqrt(f);
  }, d;
}
function ol(e, t, n) {
  e.prototype = t.prototype = n, n.constructor = e;
}
function Jc(e, t) {
  var n = Object.create(e.prototype);
  for (var o in t)
    n[o] = t[o];
  return n;
}
function zo() {
}
var Eo = 0.7, Pi = 1 / Eo, Dn = "\\s*([+-]?\\d+)\\s*", $o = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", St = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", Km = /^#([0-9a-f]{3,8})$/, qm = new RegExp(`^rgb\\(${Dn},${Dn},${Dn}\\)$`), Zm = new RegExp(`^rgb\\(${St},${St},${St}\\)$`), Qm = new RegExp(`^rgba\\(${Dn},${Dn},${Dn},${$o}\\)$`), jm = new RegExp(`^rgba\\(${St},${St},${St},${$o}\\)$`), ev = new RegExp(`^hsl\\(${$o},${St},${St}\\)$`), tv = new RegExp(`^hsla\\(${$o},${St},${St},${$o}\\)$`), ha = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
};
ol(zo, Co, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: pa,
  // Deprecated! Use color.formatHex.
  formatHex: pa,
  formatHex8: nv,
  formatHsl: ov,
  formatRgb: ga,
  toString: ga
});
function pa() {
  return this.rgb().formatHex();
}
function nv() {
  return this.rgb().formatHex8();
}
function ov() {
  return Kc(this).formatHsl();
}
function ga() {
  return this.rgb().formatRgb();
}
function Co(e) {
  var t, n;
  return e = (e + "").trim().toLowerCase(), (t = Km.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? ma(t) : n === 3 ? new je(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? Jo(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? Jo(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = qm.exec(e)) ? new je(t[1], t[2], t[3], 1) : (t = Zm.exec(e)) ? new je(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = Qm.exec(e)) ? Jo(t[1], t[2], t[3], t[4]) : (t = jm.exec(e)) ? Jo(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = ev.exec(e)) ? ya(t[1], t[2] / 100, t[3] / 100, 1) : (t = tv.exec(e)) ? ya(t[1], t[2] / 100, t[3] / 100, t[4]) : ha.hasOwnProperty(e) ? ma(ha[e]) : e === "transparent" ? new je(NaN, NaN, NaN, 0) : null;
}
function ma(e) {
  return new je(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function Jo(e, t, n, o) {
  return o <= 0 && (e = t = n = NaN), new je(e, t, n, o);
}
function iv(e) {
  return e instanceof zo || (e = Co(e)), e ? (e = e.rgb(), new je(e.r, e.g, e.b, e.opacity)) : new je();
}
function as(e, t, n, o) {
  return arguments.length === 1 ? iv(e) : new je(e, t, n, o ?? 1);
}
function je(e, t, n, o) {
  this.r = +e, this.g = +t, this.b = +n, this.opacity = +o;
}
ol(je, as, Jc(zo, {
  brighter(e) {
    return e = e == null ? Pi : Math.pow(Pi, e), new je(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? Eo : Math.pow(Eo, e), new je(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new je(gn(this.r), gn(this.g), gn(this.b), Ti(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: va,
  // Deprecated! Use color.formatHex.
  formatHex: va,
  formatHex8: rv,
  formatRgb: _a,
  toString: _a
}));
function va() {
  return `#${cn(this.r)}${cn(this.g)}${cn(this.b)}`;
}
function rv() {
  return `#${cn(this.r)}${cn(this.g)}${cn(this.b)}${cn((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function _a() {
  const e = Ti(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${gn(this.r)}, ${gn(this.g)}, ${gn(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function Ti(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function gn(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function cn(e) {
  return e = gn(e), (e < 16 ? "0" : "") + e.toString(16);
}
function ya(e, t, n, o) {
  return o <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new gt(e, t, n, o);
}
function Kc(e) {
  if (e instanceof gt)
    return new gt(e.h, e.s, e.l, e.opacity);
  if (e instanceof zo || (e = Co(e)), !e)
    return new gt();
  if (e instanceof gt)
    return e;
  e = e.rgb();
  var t = e.r / 255, n = e.g / 255, o = e.b / 255, i = Math.min(t, n, o), r = Math.max(t, n, o), s = NaN, l = r - i, a = (r + i) / 2;
  return l ? (t === r ? s = (n - o) / l + (n < o) * 6 : n === r ? s = (o - t) / l + 2 : s = (t - n) / l + 4, l /= a < 0.5 ? r + i : 2 - r - i, s *= 60) : l = a > 0 && a < 1 ? 0 : s, new gt(s, l, a, e.opacity);
}
function sv(e, t, n, o) {
  return arguments.length === 1 ? Kc(e) : new gt(e, t, n, o ?? 1);
}
function gt(e, t, n, o) {
  this.h = +e, this.s = +t, this.l = +n, this.opacity = +o;
}
ol(gt, sv, Jc(zo, {
  brighter(e) {
    return e = e == null ? Pi : Math.pow(Pi, e), new gt(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? Eo : Math.pow(Eo, e), new gt(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, o = n + (n < 0.5 ? n : 1 - n) * t, i = 2 * n - o;
    return new je(
      Dr(e >= 240 ? e - 240 : e + 120, i, o),
      Dr(e, i, o),
      Dr(e < 120 ? e + 240 : e - 120, i, o),
      this.opacity
    );
  },
  clamp() {
    return new gt(wa(this.h), Ko(this.s), Ko(this.l), Ti(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = Ti(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${wa(this.h)}, ${Ko(this.s) * 100}%, ${Ko(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function wa(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function Ko(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function Dr(e, t, n) {
  return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
const qc = (e) => () => e;
function lv(e, t) {
  return function(n) {
    return e + n * t;
  };
}
function av(e, t, n) {
  return e = Math.pow(e, n), t = Math.pow(t, n) - e, n = 1 / n, function(o) {
    return Math.pow(e + o * t, n);
  };
}
function uv(e) {
  return (e = +e) == 1 ? Zc : function(t, n) {
    return n - t ? av(t, n, e) : qc(isNaN(t) ? n : t);
  };
}
function Zc(e, t) {
  var n = t - e;
  return n ? lv(e, n) : qc(isNaN(e) ? t : e);
}
const ba = function e(t) {
  var n = uv(t);
  function o(i, r) {
    var s = n((i = as(i)).r, (r = as(r)).r), l = n(i.g, r.g), a = n(i.b, r.b), u = Zc(i.opacity, r.opacity);
    return function(c) {
      return i.r = s(c), i.g = l(c), i.b = a(c), i.opacity = u(c), i + "";
    };
  }
  return o.gamma = e, o;
}(1);
function Kt(e, t) {
  return e = +e, t = +t, function(n) {
    return e * (1 - n) + t * n;
  };
}
var us = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, kr = new RegExp(us.source, "g");
function cv(e) {
  return function() {
    return e;
  };
}
function fv(e) {
  return function(t) {
    return e(t) + "";
  };
}
function dv(e, t) {
  var n = us.lastIndex = kr.lastIndex = 0, o, i, r, s = -1, l = [], a = [];
  for (e = e + "", t = t + ""; (o = us.exec(e)) && (i = kr.exec(t)); )
    (r = i.index) > n && (r = t.slice(n, r), l[s] ? l[s] += r : l[++s] = r), (o = o[0]) === (i = i[0]) ? l[s] ? l[s] += i : l[++s] = i : (l[++s] = null, a.push({ i: s, x: Kt(o, i) })), n = kr.lastIndex;
  return n < t.length && (r = t.slice(n), l[s] ? l[s] += r : l[++s] = r), l.length < 2 ? a[0] ? fv(a[0].x) : cv(t) : (t = a.length, function(u) {
    for (var c = 0, f; c < t; ++c)
      l[(f = a[c]).i] = f.x(u);
    return l.join("");
  });
}
var xa = 180 / Math.PI, cs = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function Qc(e, t, n, o, i, r) {
  var s, l, a;
  return (s = Math.sqrt(e * e + t * t)) && (e /= s, t /= s), (a = e * n + t * o) && (n -= e * a, o -= t * a), (l = Math.sqrt(n * n + o * o)) && (n /= l, o /= l, a /= l), e * o < t * n && (e = -e, t = -t, a = -a, s = -s), {
    translateX: i,
    translateY: r,
    rotate: Math.atan2(t, e) * xa,
    skewX: Math.atan(a) * xa,
    scaleX: s,
    scaleY: l
  };
}
var qo;
function hv(e) {
  const t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
  return t.isIdentity ? cs : Qc(t.a, t.b, t.c, t.d, t.e, t.f);
}
function pv(e) {
  return e == null || (qo || (qo = document.createElementNS("http://www.w3.org/2000/svg", "g")), qo.setAttribute("transform", e), !(e = qo.transform.baseVal.consolidate())) ? cs : (e = e.matrix, Qc(e.a, e.b, e.c, e.d, e.e, e.f));
}
function jc(e, t, n, o) {
  function i(u) {
    return u.length ? u.pop() + " " : "";
  }
  function r(u, c, f, d, p, E) {
    if (u !== f || c !== d) {
      var m = p.push("translate(", null, t, null, n);
      E.push({ i: m - 4, x: Kt(u, f) }, { i: m - 2, x: Kt(c, d) });
    } else
      (f || d) && p.push("translate(" + f + t + d + n);
  }
  function s(u, c, f, d) {
    u !== c ? (u - c > 180 ? c += 360 : c - u > 180 && (u += 360), d.push({ i: f.push(i(f) + "rotate(", null, o) - 2, x: Kt(u, c) })) : c && f.push(i(f) + "rotate(" + c + o);
  }
  function l(u, c, f, d) {
    u !== c ? d.push({ i: f.push(i(f) + "skewX(", null, o) - 2, x: Kt(u, c) }) : c && f.push(i(f) + "skewX(" + c + o);
  }
  function a(u, c, f, d, p, E) {
    if (u !== f || c !== d) {
      var m = p.push(i(p) + "scale(", null, ",", null, ")");
      E.push({ i: m - 4, x: Kt(u, f) }, { i: m - 2, x: Kt(c, d) });
    } else
      (f !== 1 || d !== 1) && p.push(i(p) + "scale(" + f + "," + d + ")");
  }
  return function(u, c) {
    var f = [], d = [];
    return u = e(u), c = e(c), r(u.translateX, u.translateY, c.translateX, c.translateY, f, d), s(u.rotate, c.rotate, f, d), l(u.skewX, c.skewX, f, d), a(u.scaleX, u.scaleY, c.scaleX, c.scaleY, f, d), u = c = null, function(p) {
      for (var E = -1, m = d.length, _; ++E < m; )
        f[(_ = d[E]).i] = _.x(p);
      return f.join("");
    };
  };
}
var gv = jc(hv, "px, ", "px)", "deg)"), mv = jc(pv, ", ", ")", ")"), vv = 1e-12;
function Ea(e) {
  return ((e = Math.exp(e)) + 1 / e) / 2;
}
function _v(e) {
  return ((e = Math.exp(e)) - 1 / e) / 2;
}
function yv(e) {
  return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
const wv = function e(t, n, o) {
  function i(r, s) {
    var l = r[0], a = r[1], u = r[2], c = s[0], f = s[1], d = s[2], p = c - l, E = f - a, m = p * p + E * E, _, b;
    if (m < vv)
      b = Math.log(d / u) / t, _ = function(S) {
        return [
          l + S * p,
          a + S * E,
          u * Math.exp(t * S * b)
        ];
      };
    else {
      var C = Math.sqrt(m), N = (d * d - u * u + o * m) / (2 * u * n * C), y = (d * d - u * u - o * m) / (2 * d * n * C), D = Math.log(Math.sqrt(N * N + 1) - N), O = Math.log(Math.sqrt(y * y + 1) - y);
      b = (O - D) / t, _ = function(S) {
        var V = S * b, X = Ea(D), Y = u / (n * C) * (X * yv(t * V + D) - _v(D));
        return [
          l + Y * p,
          a + Y * E,
          u * X / Ea(t * V + D)
        ];
      };
    }
    return _.duration = b * 1e3 * t / Math.SQRT2, _;
  }
  return i.rho = function(r) {
    var s = Math.max(1e-3, +r), l = s * s, a = l * l;
    return e(s, l, a);
  }, i;
}(Math.SQRT2, 2, 4);
var Ln = 0, to = 0, qn = 0, ef = 1e3, Ii, no, Oi = 0, yn = 0, cr = 0, So = typeof performance == "object" && performance.now ? performance : Date, tf = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
  setTimeout(e, 17);
};
function il() {
  return yn || (tf(bv), yn = So.now() + cr);
}
function bv() {
  yn = 0;
}
function Di() {
  this._call = this._time = this._next = null;
}
Di.prototype = nf.prototype = {
  constructor: Di,
  restart: function(e, t, n) {
    if (typeof e != "function")
      throw new TypeError("callback is not a function");
    n = (n == null ? il() : +n) + (t == null ? 0 : +t), !this._next && no !== this && (no ? no._next = this : Ii = this, no = this), this._call = e, this._time = n, fs();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, fs());
  }
};
function nf(e, t, n) {
  var o = new Di();
  return o.restart(e, t, n), o;
}
function xv() {
  il(), ++Ln;
  for (var e = Ii, t; e; )
    (t = yn - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
  --Ln;
}
function $a() {
  yn = (Oi = So.now()) + cr, Ln = to = 0;
  try {
    xv();
  } finally {
    Ln = 0, $v(), yn = 0;
  }
}
function Ev() {
  var e = So.now(), t = e - Oi;
  t > ef && (cr -= t, Oi = e);
}
function $v() {
  for (var e, t = Ii, n, o = 1 / 0; t; )
    t._call ? (o > t._time && (o = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : Ii = n);
  no = e, fs(o);
}
function fs(e) {
  if (!Ln) {
    to && (to = clearTimeout(to));
    var t = e - yn;
    t > 24 ? (e < 1 / 0 && (to = setTimeout($a, e - So.now() - cr)), qn && (qn = clearInterval(qn))) : (qn || (Oi = So.now(), qn = setInterval(Ev, ef)), Ln = 1, tf($a));
  }
}
function Ca(e, t, n) {
  var o = new Di();
  return t = t == null ? 0 : +t, o.restart((i) => {
    o.stop(), e(i + t);
  }, t, n), o;
}
var Cv = ar("start", "end", "cancel", "interrupt"), Sv = [], of = 0, Sa = 1, ds = 2, fi = 3, Na = 4, hs = 5, di = 6;
function fr(e, t, n, o, i, r) {
  var s = e.__transition;
  if (!s)
    e.__transition = {};
  else if (n in s)
    return;
  Nv(e, n, {
    name: t,
    index: o,
    // For context during callback.
    group: i,
    // For context during callback.
    on: Cv,
    tween: Sv,
    time: r.time,
    delay: r.delay,
    duration: r.duration,
    ease: r.ease,
    timer: null,
    state: of
  });
}
function rl(e, t) {
  var n = yt(e, t);
  if (n.state > of)
    throw new Error("too late; already scheduled");
  return n;
}
function Pt(e, t) {
  var n = yt(e, t);
  if (n.state > fi)
    throw new Error("too late; already running");
  return n;
}
function yt(e, t) {
  var n = e.__transition;
  if (!n || !(n = n[t]))
    throw new Error("transition not found");
  return n;
}
function Nv(e, t, n) {
  var o = e.__transition, i;
  o[t] = n, n.timer = nf(r, 0, n.time);
  function r(u) {
    n.state = Sa, n.timer.restart(s, n.delay, n.time), n.delay <= u && s(u - n.delay);
  }
  function s(u) {
    var c, f, d, p;
    if (n.state !== Sa)
      return a();
    for (c in o)
      if (p = o[c], p.name === n.name) {
        if (p.state === fi)
          return Ca(s);
        p.state === Na ? (p.state = di, p.timer.stop(), p.on.call("interrupt", e, e.__data__, p.index, p.group), delete o[c]) : +c < t && (p.state = di, p.timer.stop(), p.on.call("cancel", e, e.__data__, p.index, p.group), delete o[c]);
      }
    if (Ca(function() {
      n.state === fi && (n.state = Na, n.timer.restart(l, n.delay, n.time), l(u));
    }), n.state = ds, n.on.call("start", e, e.__data__, n.index, n.group), n.state === ds) {
      for (n.state = fi, i = new Array(d = n.tween.length), c = 0, f = -1; c < d; ++c)
        (p = n.tween[c].value.call(e, e.__data__, n.index, n.group)) && (i[++f] = p);
      i.length = f + 1;
    }
  }
  function l(u) {
    for (var c = u < n.duration ? n.ease.call(null, u / n.duration) : (n.timer.restart(a), n.state = hs, 1), f = -1, d = i.length; ++f < d; )
      i[f].call(e, c);
    n.state === hs && (n.on.call("end", e, e.__data__, n.index, n.group), a());
  }
  function a() {
    n.state = di, n.timer.stop(), delete o[t];
    for (var u in o)
      return;
    delete e.__transition;
  }
}
function hi(e, t) {
  var n = e.__transition, o, i, r = !0, s;
  if (n) {
    t = t == null ? null : t + "";
    for (s in n) {
      if ((o = n[s]).name !== t) {
        r = !1;
        continue;
      }
      i = o.state > ds && o.state < hs, o.state = di, o.timer.stop(), o.on.call(i ? "interrupt" : "cancel", e, e.__data__, o.index, o.group), delete n[s];
    }
    r && delete e.__transition;
  }
}
function Av(e) {
  return this.each(function() {
    hi(this, e);
  });
}
function Mv(e, t) {
  var n, o;
  return function() {
    var i = Pt(this, e), r = i.tween;
    if (r !== n) {
      o = n = r;
      for (var s = 0, l = o.length; s < l; ++s)
        if (o[s].name === t) {
          o = o.slice(), o.splice(s, 1);
          break;
        }
    }
    i.tween = o;
  };
}
function Pv(e, t, n) {
  var o, i;
  if (typeof n != "function")
    throw new Error();
  return function() {
    var r = Pt(this, e), s = r.tween;
    if (s !== o) {
      i = (o = s).slice();
      for (var l = { name: t, value: n }, a = 0, u = i.length; a < u; ++a)
        if (i[a].name === t) {
          i[a] = l;
          break;
        }
      a === u && i.push(l);
    }
    r.tween = i;
  };
}
function Tv(e, t) {
  var n = this._id;
  if (e += "", arguments.length < 2) {
    for (var o = yt(this.node(), n).tween, i = 0, r = o.length, s; i < r; ++i)
      if ((s = o[i]).name === e)
        return s.value;
    return null;
  }
  return this.each((t == null ? Mv : Pv)(n, e, t));
}
function sl(e, t, n) {
  var o = e._id;
  return e.each(function() {
    var i = Pt(this, o);
    (i.value || (i.value = {}))[t] = n.apply(this, arguments);
  }), function(i) {
    return yt(i, o).value[t];
  };
}
function rf(e, t) {
  var n;
  return (typeof t == "number" ? Kt : t instanceof Co ? ba : (n = Co(t)) ? (t = n, ba) : dv)(e, t);
}
function Iv(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function Ov(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function Dv(e, t, n) {
  var o, i = n + "", r;
  return function() {
    var s = this.getAttribute(e);
    return s === i ? null : s === o ? r : r = t(o = s, n);
  };
}
function kv(e, t, n) {
  var o, i = n + "", r;
  return function() {
    var s = this.getAttributeNS(e.space, e.local);
    return s === i ? null : s === o ? r : r = t(o = s, n);
  };
}
function Rv(e, t, n) {
  var o, i, r;
  return function() {
    var s, l = n(this), a;
    return l == null ? void this.removeAttribute(e) : (s = this.getAttribute(e), a = l + "", s === a ? null : s === o && a === i ? r : (i = a, r = t(o = s, l)));
  };
}
function zv(e, t, n) {
  var o, i, r;
  return function() {
    var s, l = n(this), a;
    return l == null ? void this.removeAttributeNS(e.space, e.local) : (s = this.getAttributeNS(e.space, e.local), a = l + "", s === a ? null : s === o && a === i ? r : (i = a, r = t(o = s, l)));
  };
}
function Hv(e, t) {
  var n = ur(e), o = n === "transform" ? mv : rf;
  return this.attrTween(e, typeof t == "function" ? (n.local ? zv : Rv)(n, o, sl(this, "attr." + e, t)) : t == null ? (n.local ? Ov : Iv)(n) : (n.local ? kv : Dv)(n, o, t));
}
function Fv(e, t) {
  return function(n) {
    this.setAttribute(e, t.call(this, n));
  };
}
function Vv(e, t) {
  return function(n) {
    this.setAttributeNS(e.space, e.local, t.call(this, n));
  };
}
function Bv(e, t) {
  var n, o;
  function i() {
    var r = t.apply(this, arguments);
    return r !== o && (n = (o = r) && Vv(e, r)), n;
  }
  return i._value = t, i;
}
function Lv(e, t) {
  var n, o;
  function i() {
    var r = t.apply(this, arguments);
    return r !== o && (n = (o = r) && Fv(e, r)), n;
  }
  return i._value = t, i;
}
function Uv(e, t) {
  var n = "attr." + e;
  if (arguments.length < 2)
    return (n = this.tween(n)) && n._value;
  if (t == null)
    return this.tween(n, null);
  if (typeof t != "function")
    throw new Error();
  var o = ur(e);
  return this.tween(n, (o.local ? Bv : Lv)(o, t));
}
function Gv(e, t) {
  return function() {
    rl(this, e).delay = +t.apply(this, arguments);
  };
}
function Yv(e, t) {
  return t = +t, function() {
    rl(this, e).delay = t;
  };
}
function Wv(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? Gv : Yv)(t, e)) : yt(this.node(), t).delay;
}
function Xv(e, t) {
  return function() {
    Pt(this, e).duration = +t.apply(this, arguments);
  };
}
function Jv(e, t) {
  return t = +t, function() {
    Pt(this, e).duration = t;
  };
}
function Kv(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? Xv : Jv)(t, e)) : yt(this.node(), t).duration;
}
function qv(e, t) {
  if (typeof t != "function")
    throw new Error();
  return function() {
    Pt(this, e).ease = t;
  };
}
function Zv(e) {
  var t = this._id;
  return arguments.length ? this.each(qv(t, e)) : yt(this.node(), t).ease;
}
function Qv(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    if (typeof n != "function")
      throw new Error();
    Pt(this, e).ease = n;
  };
}
function jv(e) {
  if (typeof e != "function")
    throw new Error();
  return this.each(Qv(this._id, e));
}
function e0(e) {
  typeof e != "function" && (e = Rc(e));
  for (var t = this._groups, n = t.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = t[i], s = r.length, l = o[i] = [], a, u = 0; u < s; ++u)
      (a = r[u]) && e.call(a, a.__data__, u, r) && l.push(a);
  return new Ft(o, this._parents, this._name, this._id);
}
function t0(e) {
  if (e._id !== this._id)
    throw new Error();
  for (var t = this._groups, n = e._groups, o = t.length, i = n.length, r = Math.min(o, i), s = new Array(o), l = 0; l < r; ++l)
    for (var a = t[l], u = n[l], c = a.length, f = s[l] = new Array(c), d, p = 0; p < c; ++p)
      (d = a[p] || u[p]) && (f[p] = d);
  for (; l < o; ++l)
    s[l] = t[l];
  return new Ft(s, this._parents, this._name, this._id);
}
function n0(e) {
  return (e + "").trim().split(/^|\s+/).every(function(t) {
    var n = t.indexOf(".");
    return n >= 0 && (t = t.slice(0, n)), !t || t === "start";
  });
}
function o0(e, t, n) {
  var o, i, r = n0(t) ? rl : Pt;
  return function() {
    var s = r(this, e), l = s.on;
    l !== o && (i = (o = l).copy()).on(t, n), s.on = i;
  };
}
function i0(e, t) {
  var n = this._id;
  return arguments.length < 2 ? yt(this.node(), n).on.on(e) : this.each(o0(n, e, t));
}
function r0(e) {
  return function() {
    var t = this.parentNode;
    for (var n in this.__transition)
      if (+n !== e)
        return;
    t && t.removeChild(this);
  };
}
function s0() {
  return this.on("end.remove", r0(this._id));
}
function l0(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = tl(e));
  for (var o = this._groups, i = o.length, r = new Array(i), s = 0; s < i; ++s)
    for (var l = o[s], a = l.length, u = r[s] = new Array(a), c, f, d = 0; d < a; ++d)
      (c = l[d]) && (f = e.call(c, c.__data__, d, l)) && ("__data__" in c && (f.__data__ = c.__data__), u[d] = f, fr(u[d], t, n, d, u, yt(c, n)));
  return new Ft(r, this._parents, t, n);
}
function a0(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = kc(e));
  for (var o = this._groups, i = o.length, r = [], s = [], l = 0; l < i; ++l)
    for (var a = o[l], u = a.length, c, f = 0; f < u; ++f)
      if (c = a[f]) {
        for (var d = e.call(c, c.__data__, f, a), p, E = yt(c, n), m = 0, _ = d.length; m < _; ++m)
          (p = d[m]) && fr(p, t, n, m, d, E);
        r.push(d), s.push(c);
      }
  return new Ft(r, s, t, n);
}
var u0 = Ro.prototype.constructor;
function c0() {
  return new u0(this._groups, this._parents);
}
function f0(e, t) {
  var n, o, i;
  return function() {
    var r = Bn(this, e), s = (this.style.removeProperty(e), Bn(this, e));
    return r === s ? null : r === n && s === o ? i : i = t(n = r, o = s);
  };
}
function sf(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function d0(e, t, n) {
  var o, i = n + "", r;
  return function() {
    var s = Bn(this, e);
    return s === i ? null : s === o ? r : r = t(o = s, n);
  };
}
function h0(e, t, n) {
  var o, i, r;
  return function() {
    var s = Bn(this, e), l = n(this), a = l + "";
    return l == null && (a = l = (this.style.removeProperty(e), Bn(this, e))), s === a ? null : s === o && a === i ? r : (i = a, r = t(o = s, l));
  };
}
function p0(e, t) {
  var n, o, i, r = "style." + t, s = "end." + r, l;
  return function() {
    var a = Pt(this, e), u = a.on, c = a.value[r] == null ? l || (l = sf(t)) : void 0;
    (u !== n || i !== c) && (o = (n = u).copy()).on(s, i = c), a.on = o;
  };
}
function g0(e, t, n) {
  var o = (e += "") == "transform" ? gv : rf;
  return t == null ? this.styleTween(e, f0(e, o)).on("end.style." + e, sf(e)) : typeof t == "function" ? this.styleTween(e, h0(e, o, sl(this, "style." + e, t))).each(p0(this._id, e)) : this.styleTween(e, d0(e, o, t), n).on("end.style." + e, null);
}
function m0(e, t, n) {
  return function(o) {
    this.style.setProperty(e, t.call(this, o), n);
  };
}
function v0(e, t, n) {
  var o, i;
  function r() {
    var s = t.apply(this, arguments);
    return s !== i && (o = (i = s) && m0(e, s, n)), o;
  }
  return r._value = t, r;
}
function _0(e, t, n) {
  var o = "style." + (e += "");
  if (arguments.length < 2)
    return (o = this.tween(o)) && o._value;
  if (t == null)
    return this.tween(o, null);
  if (typeof t != "function")
    throw new Error();
  return this.tween(o, v0(e, t, n ?? ""));
}
function y0(e) {
  return function() {
    this.textContent = e;
  };
}
function w0(e) {
  return function() {
    var t = e(this);
    this.textContent = t ?? "";
  };
}
function b0(e) {
  return this.tween("text", typeof e == "function" ? w0(sl(this, "text", e)) : y0(e == null ? "" : e + ""));
}
function x0(e) {
  return function(t) {
    this.textContent = e.call(this, t);
  };
}
function E0(e) {
  var t, n;
  function o() {
    var i = e.apply(this, arguments);
    return i !== n && (t = (n = i) && x0(i)), t;
  }
  return o._value = e, o;
}
function $0(e) {
  var t = "text";
  if (arguments.length < 1)
    return (t = this.tween(t)) && t._value;
  if (e == null)
    return this.tween(t, null);
  if (typeof e != "function")
    throw new Error();
  return this.tween(t, E0(e));
}
function C0() {
  for (var e = this._name, t = this._id, n = lf(), o = this._groups, i = o.length, r = 0; r < i; ++r)
    for (var s = o[r], l = s.length, a, u = 0; u < l; ++u)
      if (a = s[u]) {
        var c = yt(a, t);
        fr(a, e, n, u, s, {
          time: c.time + c.delay + c.duration,
          delay: 0,
          duration: c.duration,
          ease: c.ease
        });
      }
  return new Ft(o, this._parents, e, n);
}
function S0() {
  var e, t, n = this, o = n._id, i = n.size();
  return new Promise(function(r, s) {
    var l = { value: s }, a = { value: function() {
      --i === 0 && r();
    } };
    n.each(function() {
      var u = Pt(this, o), c = u.on;
      c !== e && (t = (e = c).copy(), t._.cancel.push(l), t._.interrupt.push(l), t._.end.push(a)), u.on = t;
    }), i === 0 && r();
  });
}
var N0 = 0;
function Ft(e, t, n, o) {
  this._groups = e, this._parents = t, this._name = n, this._id = o;
}
function lf() {
  return ++N0;
}
var It = Ro.prototype;
Ft.prototype = {
  constructor: Ft,
  select: l0,
  selectAll: a0,
  selectChild: It.selectChild,
  selectChildren: It.selectChildren,
  filter: e0,
  merge: t0,
  selection: c0,
  transition: C0,
  call: It.call,
  nodes: It.nodes,
  node: It.node,
  size: It.size,
  empty: It.empty,
  each: It.each,
  on: i0,
  attr: Hv,
  attrTween: Uv,
  style: g0,
  styleTween: _0,
  text: b0,
  textTween: $0,
  remove: s0,
  tween: Tv,
  delay: Wv,
  duration: Kv,
  ease: Zv,
  easeVarying: jv,
  end: S0,
  [Symbol.iterator]: It[Symbol.iterator]
};
function A0(e) {
  return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
var M0 = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: A0
};
function P0(e, t) {
  for (var n; !(n = e.__transition) || !(n = n[t]); )
    if (!(e = e.parentNode))
      throw new Error(`transition ${t} not found`);
  return n;
}
function T0(e) {
  var t, n;
  e instanceof Ft ? (t = e._id, e = e._name) : (t = lf(), (n = M0).time = il(), e = e == null ? null : e + "");
  for (var o = this._groups, i = o.length, r = 0; r < i; ++r)
    for (var s = o[r], l = s.length, a, u = 0; u < l; ++u)
      (a = s[u]) && fr(a, e, t, u, s, n || P0(a, t));
  return new Ft(o, this._parents, e, t);
}
Ro.prototype.interrupt = Av;
Ro.prototype.transition = T0;
const Zo = (e) => () => e;
function I0(e, {
  sourceEvent: t,
  target: n,
  transform: o,
  dispatch: i
}) {
  Object.defineProperties(this, {
    type: { value: e, enumerable: !0, configurable: !0 },
    sourceEvent: { value: t, enumerable: !0, configurable: !0 },
    target: { value: n, enumerable: !0, configurable: !0 },
    transform: { value: o, enumerable: !0, configurable: !0 },
    _: { value: i }
  });
}
function kt(e, t, n) {
  this.k = e, this.x = t, this.y = n;
}
kt.prototype = {
  constructor: kt,
  scale: function(e) {
    return e === 1 ? this : new kt(this.k * e, this.x, this.y);
  },
  translate: function(e, t) {
    return e === 0 & t === 0 ? this : new kt(this.k, this.x + this.k * e, this.y + this.k * t);
  },
  apply: function(e) {
    return [e[0] * this.k + this.x, e[1] * this.k + this.y];
  },
  applyX: function(e) {
    return e * this.k + this.x;
  },
  applyY: function(e) {
    return e * this.k + this.y;
  },
  invert: function(e) {
    return [(e[0] - this.x) / this.k, (e[1] - this.y) / this.k];
  },
  invertX: function(e) {
    return (e - this.x) / this.k;
  },
  invertY: function(e) {
    return (e - this.y) / this.k;
  },
  rescaleX: function(e) {
    return e.copy().domain(e.range().map(this.invertX, this).map(e.invert, e));
  },
  rescaleY: function(e) {
    return e.copy().domain(e.range().map(this.invertY, this).map(e.invert, e));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};
var Un = new kt(1, 0, 0);
kt.prototype;
function Rr(e) {
  e.stopImmediatePropagation();
}
function Zn(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function O0(e) {
  return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function D0() {
  var e = this;
  return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function Aa() {
  return this.__zoom || Un;
}
function k0(e) {
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * (e.ctrlKey ? 10 : 1);
}
function R0() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function z0(e, t, n) {
  var o = e.invertX(t[0][0]) - n[0][0], i = e.invertX(t[1][0]) - n[1][0], r = e.invertY(t[0][1]) - n[0][1], s = e.invertY(t[1][1]) - n[1][1];
  return e.translate(
    i > o ? (o + i) / 2 : Math.min(0, o) || Math.max(0, i),
    s > r ? (r + s) / 2 : Math.min(0, r) || Math.max(0, s)
  );
}
function H0() {
  var e = O0, t = D0, n = z0, o = k0, i = R0, r = [0, 1 / 0], s = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], l = 250, a = wv, u = ar("start", "zoom", "end"), c, f, d, p = 500, E = 150, m = 0, _ = 10;
  function b(g) {
    g.property("__zoom", Aa).on("wheel.zoom", V, { passive: !1 }).on("mousedown.zoom", X).on("dblclick.zoom", Y).filter(i).on("touchstart.zoom", W).on("touchmove.zoom", le).on("touchend.zoom touchcancel.zoom", K).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  b.transform = function(g, R, w, P) {
    var I = g.selection ? g.selection() : g;
    I.property("__zoom", Aa), g !== I ? D(g, R, w, P) : I.interrupt().each(function() {
      O(this, arguments).event(P).start().zoom(null, typeof R == "function" ? R.apply(this, arguments) : R).end();
    });
  }, b.scaleBy = function(g, R, w, P) {
    b.scaleTo(g, function() {
      var I = this.__zoom.k, T = typeof R == "function" ? R.apply(this, arguments) : R;
      return I * T;
    }, w, P);
  }, b.scaleTo = function(g, R, w, P) {
    b.transform(g, function() {
      var I = t.apply(this, arguments), T = this.__zoom, M = w == null ? y(I) : typeof w == "function" ? w.apply(this, arguments) : w, U = T.invert(M), q = typeof R == "function" ? R.apply(this, arguments) : R;
      return n(N(C(T, q), M, U), I, s);
    }, w, P);
  }, b.translateBy = function(g, R, w, P) {
    b.transform(g, function() {
      return n(this.__zoom.translate(
        typeof R == "function" ? R.apply(this, arguments) : R,
        typeof w == "function" ? w.apply(this, arguments) : w
      ), t.apply(this, arguments), s);
    }, null, P);
  }, b.translateTo = function(g, R, w, P, I) {
    b.transform(g, function() {
      var T = t.apply(this, arguments), M = this.__zoom, U = P == null ? y(T) : typeof P == "function" ? P.apply(this, arguments) : P;
      return n(Un.translate(U[0], U[1]).scale(M.k).translate(
        typeof R == "function" ? -R.apply(this, arguments) : -R,
        typeof w == "function" ? -w.apply(this, arguments) : -w
      ), T, s);
    }, P, I);
  };
  function C(g, R) {
    return R = Math.max(r[0], Math.min(r[1], R)), R === g.k ? g : new kt(R, g.x, g.y);
  }
  function N(g, R, w) {
    var P = R[0] - w[0] * g.k, I = R[1] - w[1] * g.k;
    return P === g.x && I === g.y ? g : new kt(g.k, P, I);
  }
  function y(g) {
    return [(+g[0][0] + +g[1][0]) / 2, (+g[0][1] + +g[1][1]) / 2];
  }
  function D(g, R, w, P) {
    g.on("start.zoom", function() {
      O(this, arguments).event(P).start();
    }).on("interrupt.zoom end.zoom", function() {
      O(this, arguments).event(P).end();
    }).tween("zoom", function() {
      var I = this, T = arguments, M = O(I, T).event(P), U = t.apply(I, T), q = w == null ? y(U) : typeof w == "function" ? w.apply(I, T) : w, Z = Math.max(U[1][0] - U[0][0], U[1][1] - U[0][1]), J = I.__zoom, se = typeof R == "function" ? R.apply(I, T) : R, L = a(J.invert(q).concat(Z / J.k), se.invert(q).concat(Z / se.k));
      return function(ae) {
        if (ae === 1)
          ae = se;
        else {
          var j = L(ae), ne = Z / j[2];
          ae = new kt(ne, q[0] - j[0] * ne, q[1] - j[1] * ne);
        }
        M.zoom(null, ae);
      };
    });
  }
  function O(g, R, w) {
    return !w && g.__zooming || new S(g, R);
  }
  function S(g, R) {
    this.that = g, this.args = R, this.active = 0, this.sourceEvent = null, this.extent = t.apply(g, R), this.taps = 0;
  }
  S.prototype = {
    event: function(g) {
      return g && (this.sourceEvent = g), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(g, R) {
      return this.mouse && g !== "mouse" && (this.mouse[1] = R.invert(this.mouse[0])), this.touch0 && g !== "touch" && (this.touch0[1] = R.invert(this.touch0[0])), this.touch1 && g !== "touch" && (this.touch1[1] = R.invert(this.touch1[0])), this.that.__zoom = R, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(g) {
      var R = pt(this.that).datum();
      u.call(
        g,
        this.that,
        new I0(g, {
          sourceEvent: this.sourceEvent,
          target: b,
          type: g,
          transform: this.that.__zoom,
          dispatch: u
        }),
        R
      );
    }
  };
  function V(g, ...R) {
    if (!e.apply(this, arguments))
      return;
    var w = O(this, R).event(g), P = this.__zoom, I = Math.max(r[0], Math.min(r[1], P.k * Math.pow(2, o.apply(this, arguments)))), T = Et(g);
    if (w.wheel)
      (w.mouse[0][0] !== T[0] || w.mouse[0][1] !== T[1]) && (w.mouse[1] = P.invert(w.mouse[0] = T)), clearTimeout(w.wheel);
    else {
      if (P.k === I)
        return;
      w.mouse = [T, P.invert(T)], hi(this), w.start();
    }
    Zn(g), w.wheel = setTimeout(M, E), w.zoom("mouse", n(N(C(P, I), w.mouse[0], w.mouse[1]), w.extent, s));
    function M() {
      w.wheel = null, w.end();
    }
  }
  function X(g, ...R) {
    if (d || !e.apply(this, arguments))
      return;
    var w = g.currentTarget, P = O(this, R, !0).event(g), I = pt(g.view).on("mousemove.zoom", q, !0).on("mouseup.zoom", Z, !0), T = Et(g, w), M = g.clientX, U = g.clientY;
    Wc(g.view), Rr(g), P.mouse = [T, this.__zoom.invert(T)], hi(this), P.start();
    function q(J) {
      if (Zn(J), !P.moved) {
        var se = J.clientX - M, L = J.clientY - U;
        P.moved = se * se + L * L > m;
      }
      P.event(J).zoom("mouse", n(N(P.that.__zoom, P.mouse[0] = Et(J, w), P.mouse[1]), P.extent, s));
    }
    function Z(J) {
      I.on("mousemove.zoom mouseup.zoom", null), Xc(J.view, P.moved), Zn(J), P.event(J).end();
    }
  }
  function Y(g, ...R) {
    if (e.apply(this, arguments)) {
      var w = this.__zoom, P = Et(g.changedTouches ? g.changedTouches[0] : g, this), I = w.invert(P), T = w.k * (g.shiftKey ? 0.5 : 2), M = n(N(C(w, T), P, I), t.apply(this, R), s);
      Zn(g), l > 0 ? pt(this).transition().duration(l).call(D, M, P, g) : pt(this).call(b.transform, M, P, g);
    }
  }
  function W(g, ...R) {
    if (e.apply(this, arguments)) {
      var w = g.touches, P = w.length, I = O(this, R, g.changedTouches.length === P).event(g), T, M, U, q;
      for (Rr(g), M = 0; M < P; ++M)
        U = w[M], q = Et(U, this), q = [q, this.__zoom.invert(q), U.identifier], I.touch0 ? !I.touch1 && I.touch0[2] !== q[2] && (I.touch1 = q, I.taps = 0) : (I.touch0 = q, T = !0, I.taps = 1 + !!c);
      c && (c = clearTimeout(c)), T && (I.taps < 2 && (f = q[0], c = setTimeout(function() {
        c = null;
      }, p)), hi(this), I.start());
    }
  }
  function le(g, ...R) {
    if (this.__zooming) {
      var w = O(this, R).event(g), P = g.changedTouches, I = P.length, T, M, U, q;
      for (Zn(g), T = 0; T < I; ++T)
        M = P[T], U = Et(M, this), w.touch0 && w.touch0[2] === M.identifier ? w.touch0[0] = U : w.touch1 && w.touch1[2] === M.identifier && (w.touch1[0] = U);
      if (M = w.that.__zoom, w.touch1) {
        var Z = w.touch0[0], J = w.touch0[1], se = w.touch1[0], L = w.touch1[1], ae = (ae = se[0] - Z[0]) * ae + (ae = se[1] - Z[1]) * ae, j = (j = L[0] - J[0]) * j + (j = L[1] - J[1]) * j;
        M = C(M, Math.sqrt(ae / j)), U = [(Z[0] + se[0]) / 2, (Z[1] + se[1]) / 2], q = [(J[0] + L[0]) / 2, (J[1] + L[1]) / 2];
      } else if (w.touch0)
        U = w.touch0[0], q = w.touch0[1];
      else
        return;
      w.zoom("touch", n(N(M, U, q), w.extent, s));
    }
  }
  function K(g, ...R) {
    if (this.__zooming) {
      var w = O(this, R).event(g), P = g.changedTouches, I = P.length, T, M;
      for (Rr(g), d && clearTimeout(d), d = setTimeout(function() {
        d = null;
      }, p), T = 0; T < I; ++T)
        M = P[T], w.touch0 && w.touch0[2] === M.identifier ? delete w.touch0 : w.touch1 && w.touch1[2] === M.identifier && delete w.touch1;
      if (w.touch1 && !w.touch0 && (w.touch0 = w.touch1, delete w.touch1), w.touch0)
        w.touch0[1] = this.__zoom.invert(w.touch0[0]);
      else if (w.end(), w.taps === 2 && (M = Et(M, this), Math.hypot(f[0] - M[0], f[1] - M[1]) < _)) {
        var U = pt(this).on("dblclick.zoom");
        U && U.apply(this, arguments);
      }
    }
  }
  return b.wheelDelta = function(g) {
    return arguments.length ? (o = typeof g == "function" ? g : Zo(+g), b) : o;
  }, b.filter = function(g) {
    return arguments.length ? (e = typeof g == "function" ? g : Zo(!!g), b) : e;
  }, b.touchable = function(g) {
    return arguments.length ? (i = typeof g == "function" ? g : Zo(!!g), b) : i;
  }, b.extent = function(g) {
    return arguments.length ? (t = typeof g == "function" ? g : Zo([[+g[0][0], +g[0][1]], [+g[1][0], +g[1][1]]]), b) : t;
  }, b.scaleExtent = function(g) {
    return arguments.length ? (r[0] = +g[0], r[1] = +g[1], b) : [r[0], r[1]];
  }, b.translateExtent = function(g) {
    return arguments.length ? (s[0][0] = +g[0][0], s[1][0] = +g[1][0], s[0][1] = +g[0][1], s[1][1] = +g[1][1], b) : [[s[0][0], s[0][1]], [s[1][0], s[1][1]]];
  }, b.constrain = function(g) {
    return arguments.length ? (n = g, b) : n;
  }, b.duration = function(g) {
    return arguments.length ? (l = +g, b) : l;
  }, b.interpolate = function(g) {
    return arguments.length ? (a = g, b) : a;
  }, b.on = function() {
    var g = u.on.apply(u, arguments);
    return g === u ? b : g;
  }, b.clickDistance = function(g) {
    return arguments.length ? (m = (g = +g) * g, b) : Math.sqrt(m);
  }, b.tapDistance = function(g) {
    return arguments.length ? (_ = +g, b) : _;
  }, b;
}
var ee = /* @__PURE__ */ ((e) => (e.Left = "left", e.Top = "top", e.Right = "right", e.Bottom = "bottom", e))(ee || {}), ll = /* @__PURE__ */ ((e) => (e.Partial = "partial", e.Full = "full", e))(ll || {}), un = /* @__PURE__ */ ((e) => (e.Bezier = "default", e.SimpleBezier = "simple-bezier", e.Straight = "straight", e.Step = "step", e.SmoothStep = "smoothstep", e))(un || {}), wn = /* @__PURE__ */ ((e) => (e.Strict = "strict", e.Loose = "loose", e))(wn || {}), ps = /* @__PURE__ */ ((e) => (e.Arrow = "arrow", e.ArrowClosed = "arrowclosed", e))(ps || {}), mo = /* @__PURE__ */ ((e) => (e.Free = "free", e.Vertical = "vertical", e.Horizontal = "horizontal", e))(mo || {}), af = /* @__PURE__ */ ((e) => (e.TopLeft = "top-left", e.TopCenter = "top-center", e.TopRight = "top-right", e.BottomLeft = "bottom-left", e.BottomCenter = "bottom-center", e.BottomRight = "bottom-right", e))(af || {});
function al() {
  return typeof window < "u" ? window : {
    chrome: !1,
    addEventListener(...e) {
    }
  };
}
function gs(e) {
  var t, n;
  const o = ((n = (t = e.composedPath) == null ? void 0 : t.call(e)) == null ? void 0 : n[0]) || e.target, i = typeof (o == null ? void 0 : o.hasAttribute) == "function" ? o.hasAttribute("contenteditable") : !1, r = typeof (o == null ? void 0 : o.closest) == "function" ? o.closest(".nokey") : null;
  return ["INPUT", "SELECT", "TEXTAREA"].includes(o == null ? void 0 : o.nodeName) || i || !!r;
}
function F0(e) {
  return e.ctrlKey || e.metaKey || e.shiftKey;
}
function Ma(e, t, n, o) {
  const i = t.split("+").map((r) => r.trim().toLowerCase());
  return i.length === 1 ? e.toLowerCase() === t.toLowerCase() : (o ? n.delete(e.toLowerCase()) : n.add(e.toLowerCase()), i.every(
    (r, s) => n.has(r) && Array.from(n.values())[s] === i[s]
  ));
}
function V0(e, t) {
  return (n) => {
    if (!n.code && !n.key)
      return !1;
    const o = B0(n.code, e);
    return Array.isArray(e) ? e.some((i) => Ma(n[o], i, t, n.type === "keyup")) : Ma(n[o], e, t, n.type === "keyup");
  };
}
function B0(e, t) {
  return typeof t == "string" ? e === t ? "code" : "key" : t.includes(e) ? "code" : "key";
}
function vo(e, t) {
  const n = al(), o = be(ve(e) === !0);
  let i = !1;
  const r = /* @__PURE__ */ new Set();
  let s = a(ve(e));
  return we(o, (u, c) => {
    u !== c && (t == null || t(u));
  }), we(
    () => ve(e),
    (u, c) => {
      typeof c == "boolean" && typeof u != "boolean" && l(), s = a(u);
    },
    {
      immediate: !0
    }
  ), Oc(n, "blur", () => {
    ve(e) !== !0 && (o.value = !1);
  }), ca(
    (...u) => s(...u),
    (u) => {
      i = F0(u), !(!i && gs(u)) && (u.preventDefault(), o.value = !0);
    },
    { eventName: "keydown" }
  ), ca(
    (...u) => s(...u),
    (u) => {
      if (o.value) {
        if (!i && gs(u))
          return;
        l();
      }
    },
    { eventName: "keyup" }
  ), o;
  function l() {
    i = !1, r.clear(), o.value = !1;
  }
  function a(u) {
    return u === null ? (l(), () => !1) : typeof u == "boolean" ? (l(), o.value = u, () => !1) : Array.isArray(u) || typeof u == "string" ? V0(u, r) : u;
  }
}
const uf = "vue-flow__node-desc", cf = "vue-flow__edge-desc", L0 = "vue-flow__aria-live", ff = ["Enter", " ", "Escape"], kn = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
};
function df(e) {
  const {
    vueFlowRef: t,
    snapToGrid: n,
    snapGrid: o,
    noDragClassName: i,
    nodes: r,
    nodeExtent: s,
    nodeDragThreshold: l,
    viewport: a,
    autoPanOnNodeDrag: u,
    nodesDraggable: c,
    panBy: f,
    findNode: d,
    multiSelectionActive: p,
    nodesSelectionActive: E,
    selectNodesOnDrag: m,
    removeSelectedElements: _,
    addSelectedNodes: b,
    updateNodePositions: C,
    emits: N
  } = Ee(), { onStart: y, onDrag: D, onStop: O, el: S, disabled: V, id: X, selectable: Y, dragHandle: W } = e, le = be(!1);
  let K = [], g, R = null, w = { x: void 0, y: void 0 }, P = { x: 0, y: 0 }, I = null, T = !1, M = 0, U = !1;
  const q = pf(), Z = ({ x: ne, y: ue }) => {
    w = { x: ne, y: ue };
    let ce = !1;
    if (K = K.map((fe) => {
      const x = { x: ne - fe.distance.x, y: ue - fe.distance.y };
      n.value && (x.x = o.value[0] * Math.round(x.x / o.value[0]), x.y = o.value[1] * Math.round(x.y / o.value[1]));
      const { computedPosition: h } = cl(
        fe,
        x,
        N.error,
        s.value,
        fe.parentNode ? d(fe.parentNode) : void 0
      );
      return ce = ce || fe.position.x !== h.x || fe.position.y !== h.y, fe.position = h, fe;
    }), !!ce && (C(K, !0, !0), le.value = !0, I)) {
      const [fe, x] = Br({
        id: X,
        dragItems: K,
        findNode: d
      });
      D({ event: I, node: fe, nodes: x });
    }
  }, J = () => {
    if (!R)
      return;
    const [ne, ue] = Nf(P, R);
    if (ne !== 0 || ue !== 0) {
      const ce = {
        x: (w.x ?? 0) - ne / a.value.zoom,
        y: (w.y ?? 0) - ue / a.value.zoom
      };
      f({ x: ne, y: ue }) && Z(ce);
    }
    M = requestAnimationFrame(J);
  }, se = (ne, ue) => {
    T = !0;
    const ce = d(X);
    !m.value && !p.value && ce && (ce.selected || _()), ce && ve(Y) && m.value && ys(
      ce,
      p.value,
      b,
      _,
      E,
      !1,
      ue
    );
    const fe = q(ne);
    if (w = fe, K = i_(r.value, c.value, fe, d, X), K.length) {
      const [x, h] = Br({
        id: X,
        dragItems: K,
        findNode: d
      });
      y({ event: ne.sourceEvent, node: x, nodes: h });
    }
  }, L = (ne, ue) => {
    var ce;
    l.value === 0 && se(ne, ue), w = q(ne), R = ((ce = t.value) == null ? void 0 : ce.getBoundingClientRect()) || null, P = vn(ne.sourceEvent, R);
  }, ae = (ne, ue) => {
    const ce = q(ne);
    if (!U && T && u.value && (U = !0, J()), !T) {
      const fe = ce.xSnapped - (w.x ?? 0), x = ce.ySnapped - (w.y ?? 0);
      Math.sqrt(fe * fe + x * x) > l.value && se(ne, ue);
    }
    (w.x !== ce.xSnapped || w.y !== ce.ySnapped) && K.length && T && (I = ne.sourceEvent, P = vn(ne.sourceEvent, R), Z(ce));
  }, j = (ne) => {
    if (T && (le.value = !1, U = !1, T = !1, cancelAnimationFrame(M), K.length)) {
      C(K, !1, !1);
      const [ue, ce] = Br({
        id: X,
        dragItems: K,
        findNode: d
      });
      O({ event: ne.sourceEvent, node: ue, nodes: ce });
    }
  };
  return we([() => ve(V), S], ([ne, ue], ce, fe) => {
    if (ue) {
      const x = pt(ue);
      ne || (g = Jm().on("start", (h) => L(h, ue)).on("drag", (h) => ae(h, ue)).on("end", (h) => j(h)).filter((h) => {
        const v = h.target, $ = ve(W);
        return !h.button && (!i.value || !Fa(v, `.${i.value}`, ue) && (!$ || Fa(v, $, ue)));
      }), x.call(g)), fe(() => {
        x.on(".drag", null), g && (g.on("start", null), g.on("drag", null), g.on("end", null));
      });
    }
  }), le;
}
const Pa = Symbol("vueFlow"), dr = Symbol("nodeId"), hf = Symbol("nodeRef"), U0 = Symbol("edgeId"), G0 = Symbol("edgeRef"), hr = Symbol("slots");
function Y0() {
  return {
    doubleClick: te(),
    click: te(),
    mouseEnter: te(),
    mouseMove: te(),
    mouseLeave: te(),
    contextMenu: te(),
    updateStart: te(),
    update: te(),
    updateEnd: te()
  };
}
function W0(e, t) {
  const n = Y0();
  return n.doubleClick.on((o) => {
    var i, r;
    t.edgeDoubleClick(o), (r = (i = e.events) == null ? void 0 : i.doubleClick) == null || r.call(i, o);
  }), n.click.on((o) => {
    var i, r;
    t.edgeClick(o), (r = (i = e.events) == null ? void 0 : i.click) == null || r.call(i, o);
  }), n.mouseEnter.on((o) => {
    var i, r;
    t.edgeMouseEnter(o), (r = (i = e.events) == null ? void 0 : i.mouseEnter) == null || r.call(i, o);
  }), n.mouseMove.on((o) => {
    var i, r;
    t.edgeMouseMove(o), (r = (i = e.events) == null ? void 0 : i.mouseMove) == null || r.call(i, o);
  }), n.mouseLeave.on((o) => {
    var i, r;
    t.edgeMouseLeave(o), (r = (i = e.events) == null ? void 0 : i.mouseLeave) == null || r.call(i, o);
  }), n.contextMenu.on((o) => {
    var i, r;
    t.edgeContextMenu(o), (r = (i = e.events) == null ? void 0 : i.contextMenu) == null || r.call(i, o);
  }), n.updateStart.on((o) => {
    var i, r;
    t.edgeUpdateStart(o), (r = (i = e.events) == null ? void 0 : i.updateStart) == null || r.call(i, o);
  }), n.update.on((o) => {
    var i, r;
    t.edgeUpdate(o), (r = (i = e.events) == null ? void 0 : i.update) == null || r.call(i, o);
  }), n.updateEnd.on((o) => {
    var i, r;
    t.edgeUpdateEnd(o), (r = (i = e.events) == null ? void 0 : i.updateEnd) == null || r.call(i, o);
  }), Object.entries(n).reduce(
    (o, [i, r]) => (o.emit[i] = r.trigger, o.on[i] = r.on, o),
    { emit: {}, on: {} }
  );
}
function pf() {
  const { viewport: e, snapGrid: t, snapToGrid: n } = Ee();
  return ({ sourceEvent: o }) => {
    const i = o.touches ? o.touches[0].clientX : o.clientX, r = o.touches ? o.touches[0].clientY : o.clientY, s = {
      x: (i - e.value.x) / e.value.zoom,
      y: (r - e.value.y) / e.value.zoom
    };
    return {
      xSnapped: n.value ? t.value[0] * Math.round(s.x / t.value[0]) : s.x,
      ySnapped: n.value ? t.value[1] * Math.round(s.y / t.value[1]) : s.y,
      ...s
    };
  };
}
function Qo() {
  return !0;
}
function gf({
  handleId: e,
  nodeId: t,
  type: n,
  isValidConnection: o,
  edgeUpdaterType: i,
  onEdgeUpdate: r,
  onEdgeUpdateEnd: s
}) {
  const {
    vueFlowRef: l,
    connectionMode: a,
    connectionRadius: u,
    connectOnClick: c,
    connectionClickStartHandle: f,
    nodesConnectable: d,
    autoPanOnConnect: p,
    findNode: E,
    panBy: m,
    startConnection: _,
    updateConnection: b,
    endConnection: C,
    emits: N,
    viewport: y,
    edges: D,
    nodes: O,
    isValidConnection: S
  } = Ee();
  let V = null, X = !1, Y = null;
  function W(K) {
    var g;
    const R = ve(n) === "target", w = fl(K), P = Ia(K.target);
    if (w && K.button === 0 || !w) {
      let I = function(h) {
        ue = vn(h, j);
        const { handle: v, validHandleResult: $ } = f_(
          h,
          P,
          vs(ue, y.value, !1, [1, 1]),
          u.value,
          fe,
          (A) => Ua(
            h,
            A,
            a.value,
            ve(t),
            ve(e),
            R ? "target" : "source",
            U,
            P,
            D.value,
            O.value,
            E
          )
        );
        if (q = v, ce || (x(), ce = !0), V = $.connection, X = $.isValid, Y = $.handleDomNode, b(
          q && X ? xf(
            {
              x: q.x,
              y: q.y
            },
            y.value
          ) : ue,
          $.endHandle,
          h_(!!q, X)
        ), !q && !X && !Y)
          return Lr(ne);
        V && V.source !== V.target && Y && (Lr(ne), ne = Y, Y.classList.add("connecting", "vue-flow__handle-connecting"), Y.classList.toggle("valid", X), Y.classList.toggle("vue-flow__handle-valid", X));
      }, T = function(h) {
        (q || Y) && V && X && (r ? r(h, V) : N.connect(V)), N.connectEnd(h), i && (s == null || s(h)), Lr(ne), cancelAnimationFrame(Z), C(h), ce = !1, X = !1, V = null, Y = null, P.removeEventListener("mousemove", I), P.removeEventListener("mouseup", T), P.removeEventListener("touchmove", I), P.removeEventListener("touchend", T);
      };
      const M = E(ve(t));
      let U = ve(o) || S.value || Qo;
      !U && M && (U = (R ? M.isValidSourcePos : M.isValidTargetPos) || Qo);
      let q, Z = 0;
      const { x: J, y: se } = vn(K), L = P == null ? void 0 : P.elementFromPoint(J, se), ae = dl(ve(i), L), j = (g = l.value) == null ? void 0 : g.getBoundingClientRect();
      if (!j || !ae)
        return;
      let ne, ue = vn(K, j), ce = !1;
      const fe = d_({
        nodes: O.value,
        nodeId: ve(t),
        handleId: ve(e),
        handleType: ae
      }), x = () => {
        if (!p)
          return;
        const [h, v] = Nf(ue, j);
        m({ x: h, y: v }), Z = requestAnimationFrame(x);
      };
      _(
        {
          nodeId: ve(t),
          handleId: ve(e),
          type: ae
        },
        {
          x: J - j.left,
          y: se - j.top
        },
        K
      ), N.connectStart({ event: K, nodeId: ve(t), handleId: ve(e), handleType: ae }), P.addEventListener("mousemove", I), P.addEventListener("mouseup", T), P.addEventListener("touchmove", I), P.addEventListener("touchend", T);
    }
  }
  function le(K) {
    if (!c.value)
      return;
    const g = ve(n) === "target";
    if (!f.value)
      N.clickConnectStart({ event: K, nodeId: ve(t), handleId: ve(e) }), _({ nodeId: ve(t), type: ve(n), handleId: ve(e) }, void 0, K, !0);
    else {
      let R = ve(o) || S.value || Qo;
      const w = E(ve(t));
      if (!R && w && (R = (g ? w.isValidSourcePos : w.isValidTargetPos) || Qo), w && (typeof w.connectable > "u" ? d.value : w.connectable) === !1)
        return;
      const P = Ia(K.target), { connection: I, isValid: T } = Ua(
        K,
        {
          nodeId: ve(t),
          id: ve(e),
          type: ve(n)
        },
        a.value,
        f.value.nodeId,
        f.value.handleId || null,
        f.value.type,
        R,
        P,
        D.value,
        O.value,
        E
      ), M = I.source === I.target;
      T && !M && N.connect(I), N.clickConnectEnd(K), C(K, !0);
    }
  }
  return {
    handlePointerDown: W,
    handleClick: le
  };
}
function pr() {
  return lt(dr, "");
}
function ul(e) {
  const t = e ?? pr() ?? "", n = lt(hf, be(null)), { findNode: o, edges: i, emits: r } = Ee(), s = o(t);
  return s || r.error(new Ye(Ge.NODE_NOT_FOUND, t)), {
    id: t,
    nodeEl: n,
    node: s,
    parentNode: he(() => o(s.parentNode)),
    connectedEdges: he(() => Zt([s], i.value))
  };
}
function X0() {
  return {
    doubleClick: te(),
    click: te(),
    mouseEnter: te(),
    mouseMove: te(),
    mouseLeave: te(),
    contextMenu: te(),
    dragStart: te(),
    drag: te(),
    dragStop: te()
  };
}
function J0(e, t) {
  const n = X0();
  return n.doubleClick.on((o) => {
    var i, r;
    t.nodeDoubleClick(o), (r = (i = e.events) == null ? void 0 : i.doubleClick) == null || r.call(i, o);
  }), n.click.on((o) => {
    var i, r;
    t.nodeClick(o), (r = (i = e.events) == null ? void 0 : i.click) == null || r.call(i, o);
  }), n.mouseEnter.on((o) => {
    var i, r;
    t.nodeMouseEnter(o), (r = (i = e.events) == null ? void 0 : i.mouseEnter) == null || r.call(i, o);
  }), n.mouseMove.on((o) => {
    var i, r;
    t.nodeMouseMove(o), (r = (i = e.events) == null ? void 0 : i.mouseMove) == null || r.call(i, o);
  }), n.mouseLeave.on((o) => {
    var i, r;
    t.nodeMouseLeave(o), (r = (i = e.events) == null ? void 0 : i.mouseLeave) == null || r.call(i, o);
  }), n.contextMenu.on((o) => {
    var i, r;
    t.nodeContextMenu(o), (r = (i = e.events) == null ? void 0 : i.contextMenu) == null || r.call(i, o);
  }), n.dragStart.on((o) => {
    var i, r;
    t.nodeDragStart(o), (r = (i = e.events) == null ? void 0 : i.dragStart) == null || r.call(i, o);
  }), n.drag.on((o) => {
    var i, r;
    t.nodeDrag(o), (r = (i = e.events) == null ? void 0 : i.drag) == null || r.call(i, o);
  }), n.dragStop.on((o) => {
    var i, r;
    t.nodeDragStop(o), (r = (i = e.events) == null ? void 0 : i.dragStop) == null || r.call(i, o);
  }), Object.entries(n).reduce(
    (o, [i, r]) => (o.emit[i] = r.trigger, o.on[i] = r.on, o),
    { emit: {}, on: {} }
  );
}
function mf() {
  const { getSelectedNodes: e, nodeExtent: t, updateNodePositions: n, findNode: o, snapGrid: i, snapToGrid: r, nodesDraggable: s, emits: l } = Ee();
  return (a, u = !1) => {
    const c = r.value ? i.value[0] : 5, f = r.value ? i.value[1] : 5, d = u ? 4 : 1, p = a.x * c * d, E = a.y * f * d, m = e.value.filter((_) => _.draggable || s && typeof _.draggable > "u").map((_) => {
      const b = { x: _.computedPosition.x + p, y: _.computedPosition.y + E }, { computedPosition: C } = cl(
        _,
        b,
        l.error,
        t.value,
        _.parentNode ? o(_.parentNode) : void 0
      );
      return {
        id: _.id,
        position: C,
        from: _.position,
        distance: { x: a.x, y: a.y },
        dimensions: _.dimensions
      };
    });
    n(m, !0, !1);
  };
}
const zr = 0.1;
function Gt() {
  return vr("Viewport not initialized yet."), Promise.resolve(!1);
}
const K0 = {
  zoomIn: Gt,
  zoomOut: Gt,
  zoomTo: Gt,
  fitView: Gt,
  setCenter: Gt,
  fitBounds: Gt,
  project: (e) => e,
  screenToFlowCoordinate: (e) => e,
  flowToScreenCoordinate: (e) => e,
  setViewport: Gt,
  setTransform: Gt,
  getViewport: () => ({ x: 0, y: 0, zoom: 1 }),
  getTransform: () => ({ x: 0, y: 0, zoom: 1 }),
  viewportInitialized: !1
};
function q0(e) {
  function t(o, i) {
    return new Promise((r) => {
      e.d3Selection && e.d3Zoom ? e.d3Zoom.scaleBy(
        Hr(e.d3Selection, i, () => {
          r(!0);
        }),
        o
      ) : r(!1);
    });
  }
  function n(o, i, r, s) {
    return new Promise((l) => {
      const { x: a, y: u } = vf({ x: -o, y: -i }, e.translateExtent), c = Un.translate(-a, -u).scale(r);
      e.d3Selection && e.d3Zoom ? e.d3Zoom.transform(
        Hr(e.d3Selection, s, () => {
          l(!0);
        }),
        c
      ) : l(!1);
    });
  }
  return he(() => e.d3Zoom && e.d3Selection && e.dimensions.width && e.dimensions.height ? {
    viewportInitialized: !0,
    // todo: allow passing scale as option
    zoomIn: (i) => t(1.2, i == null ? void 0 : i.duration),
    zoomOut: (i) => t(1 / 1.2, i == null ? void 0 : i.duration),
    zoomTo: (i, r) => new Promise((s) => {
      e.d3Selection && e.d3Zoom ? e.d3Zoom.scaleTo(
        Hr(e.d3Selection, r == null ? void 0 : r.duration, () => {
          s(!0);
        }),
        i
      ) : s(!1);
    }),
    setViewport: (i, r) => n(i.x, i.y, i.zoom, r == null ? void 0 : r.duration),
    setTransform: (i, r) => n(i.x, i.y, i.zoom, r == null ? void 0 : r.duration),
    getViewport: () => ({
      x: e.viewport.x,
      y: e.viewport.y,
      zoom: e.viewport.zoom
    }),
    getTransform: () => ({
      x: e.viewport.x,
      y: e.viewport.y,
      zoom: e.viewport.zoom
    }),
    fitView: (i = {
      padding: zr,
      includeHiddenNodes: !1,
      duration: 0
    }) => {
      const r = e.nodes.filter((c) => {
        var f;
        const d = c.dimensions.width && c.dimensions.height && ((i == null ? void 0 : i.includeHiddenNodes) || !c.hidden);
        return (f = i.nodes) != null && f.length ? d && i.nodes.includes(c.id) : d;
      });
      if (!r.length)
        return Promise.resolve(!1);
      const s = mr(r), { x: l, y: a, zoom: u } = Oa(
        s,
        e.dimensions.width,
        e.dimensions.height,
        i.minZoom ?? e.minZoom,
        i.maxZoom ?? e.maxZoom,
        i.padding ?? zr,
        i.offset
      );
      return n(l, a, u, i == null ? void 0 : i.duration);
    },
    setCenter: (i, r, s) => {
      const l = typeof (s == null ? void 0 : s.zoom) < "u" ? s.zoom : e.maxZoom, a = e.dimensions.width / 2 - i * l, u = e.dimensions.height / 2 - r * l;
      return n(a, u, l, s == null ? void 0 : s.duration);
    },
    fitBounds: (i, r = { padding: zr }) => {
      const { x: s, y: l, zoom: a } = Oa(
        i,
        e.dimensions.width,
        e.dimensions.height,
        e.minZoom,
        e.maxZoom,
        r.padding
      );
      return n(s, l, a, r == null ? void 0 : r.duration);
    },
    project: (i) => vs(i, e.viewport, e.snapToGrid, e.snapGrid),
    screenToFlowCoordinate: (i) => {
      if (e.vueFlowRef) {
        const { x: r, y: s } = e.vueFlowRef.getBoundingClientRect(), l = {
          x: i.x - r,
          y: i.y - s
        };
        return vs(l, e.viewport, e.snapToGrid, e.snapGrid);
      }
      return { x: 0, y: 0 };
    },
    flowToScreenCoordinate: (i) => {
      if (e.vueFlowRef) {
        const { x: r, y: s } = e.vueFlowRef.getBoundingClientRect(), l = {
          x: i.x + r,
          y: i.y + s
        };
        return xf(l, e.viewport);
      }
      return { x: 0, y: 0 };
    }
  } : K0);
}
function Hr(e, t = 0, n) {
  return e.transition().duration(t).on("end", n);
}
function Z0(e, t, n) {
  const o = Iu(!0);
  return o.run(() => {
    const i = () => {
      o.run(() => {
        let m, _, b = !!(n.nodes.value.length || n.edges.value.length);
        m = Cn([e.modelValue, () => {
          var C, N;
          return (N = (C = e.modelValue) == null ? void 0 : C.value) == null ? void 0 : N.length;
        }], ([C]) => {
          C && Array.isArray(C) && (_ == null || _.pause(), n.setElements(C), !_ && !b && C.length ? b = !0 : _ == null || _.resume());
        }), _ = Cn(
          [n.nodes, n.edges, () => n.edges.value.length, () => n.nodes.value.length],
          ([C, N]) => {
            var y;
            (y = e.modelValue) != null && y.value && Array.isArray(e.modelValue.value) && (m == null || m.pause(), e.modelValue.value = [...C, ...N], nt(() => {
              m == null || m.resume();
            }));
          },
          { immediate: b }
        ), li(() => {
          m == null || m.stop(), _ == null || _.stop();
        });
      });
    }, r = () => {
      o.run(() => {
        let m, _, b = !!n.nodes.value.length;
        m = Cn([e.nodes, () => {
          var C, N;
          return (N = (C = e.nodes) == null ? void 0 : C.value) == null ? void 0 : N.length;
        }], ([C]) => {
          C && Array.isArray(C) && (_ == null || _.pause(), n.setNodes(C), !_ && !b && C.length ? b = !0 : _ == null || _.resume());
        }), _ = Cn(
          [n.nodes, () => n.nodes.value.length],
          ([C]) => {
            var N;
            (N = e.nodes) != null && N.value && Array.isArray(e.nodes.value) && (m == null || m.pause(), e.nodes.value = [...C], nt(() => {
              m == null || m.resume();
            }));
          },
          { immediate: b }
        ), li(() => {
          m == null || m.stop(), _ == null || _.stop();
        });
      });
    }, s = () => {
      o.run(() => {
        let m, _, b = !!n.edges.value.length;
        m = Cn([e.edges, () => {
          var C, N;
          return (N = (C = e.edges) == null ? void 0 : C.value) == null ? void 0 : N.length;
        }], ([C]) => {
          C && Array.isArray(C) && (_ == null || _.pause(), n.setEdges(C), !_ && !b && C.length ? b = !0 : _ == null || _.resume());
        }), _ = Cn(
          [n.edges, () => n.edges.value.length],
          ([C]) => {
            var N;
            (N = e.edges) != null && N.value && Array.isArray(e.edges.value) && (m == null || m.pause(), e.edges.value = [...C], nt(() => {
              m == null || m.resume();
            }));
          },
          { immediate: b }
        ), li(() => {
          m == null || m.stop(), _ == null || _.stop();
        });
      });
    }, l = () => {
      o.run(() => {
        we(
          () => t.maxZoom,
          () => {
            t.maxZoom && Re(t.maxZoom) && n.setMaxZoom(t.maxZoom);
          },
          {
            immediate: !0
          }
        );
      });
    }, a = () => {
      o.run(() => {
        we(
          () => t.minZoom,
          () => {
            t.minZoom && Re(t.minZoom) && n.setMinZoom(t.minZoom);
          },
          { immediate: !0 }
        );
      });
    }, u = () => {
      o.run(() => {
        we(
          () => t.translateExtent,
          () => {
            t.translateExtent && Re(t.translateExtent) && n.setTranslateExtent(t.translateExtent);
          },
          {
            immediate: !0
          }
        );
      });
    }, c = () => {
      o.run(() => {
        we(
          () => t.nodeExtent,
          () => {
            t.nodeExtent && Re(t.nodeExtent) && n.setNodeExtent(t.nodeExtent);
          },
          {
            immediate: !0
          }
        );
      });
    }, f = () => {
      o.run(() => {
        we(
          () => t.applyDefault,
          () => {
            Re(t.applyDefault) && (n.applyDefault.value = t.applyDefault);
          },
          {
            immediate: !0
          }
        );
      });
    }, d = () => {
      o.run(() => {
        const m = async (_) => {
          let b = _;
          typeof t.autoConnect == "function" && (b = await t.autoConnect(_)), b !== !1 && n.addEdges([b]);
        };
        we(
          () => t.autoConnect,
          () => {
            Re(t.autoConnect) && (n.autoConnect.value = t.autoConnect);
          },
          { immediate: !0 }
        ), we(
          n.autoConnect,
          (_, b, C) => {
            _ ? n.onConnect(m) : n.hooks.value.connect.off(m), C(() => {
              n.hooks.value.connect.off(m);
            });
          },
          { immediate: !0 }
        );
      });
    }, p = () => {
      const m = [
        "id",
        "modelValue",
        "translateExtent",
        "nodeExtent",
        "edges",
        "nodes",
        "maxZoom",
        "minZoom",
        "applyDefault",
        "autoConnect"
      ];
      for (const _ of Object.keys(t)) {
        const b = _;
        if (!m.includes(b)) {
          const C = Xe(() => t[b]), N = n[b];
          Fe(N) && o.run(() => {
            we(
              C,
              (y) => {
                Re(y) && (N.value = y);
              },
              { immediate: !0, flush: "pre" }
            );
          });
        }
      }
    };
    (() => {
      i(), r(), s(), a(), l(), u(), c(), f(), d(), p();
    })();
  }), () => o.stop();
}
function Ta(e) {
  return {
    ...e.computedPosition || { x: 0, y: 0 },
    width: e.dimensions.width || 0,
    height: e.dimensions.height || 0
  };
}
function ms(e, t) {
  const n = Math.max(0, Math.min(e.x + e.width, t.x + t.width) - Math.max(e.x, t.x)), o = Math.max(0, Math.min(e.y + e.height, t.y + t.height) - Math.max(e.y, t.y));
  return Math.ceil(n * o);
}
function gr(e) {
  return {
    width: e.offsetWidth,
    height: e.offsetHeight
  };
}
function Vt(e, t = 0, n = 1) {
  return Math.min(Math.max(e, t), n);
}
function vf(e, t) {
  return {
    x: Vt(e.x, t[0][0], t[1][0]),
    y: Vt(e.y, t[0][1], t[1][1])
  };
}
function Ia(e) {
  const t = e.getRootNode();
  return "elementFromPoint" in t ? t : al().document;
}
function bn(e) {
  return e && typeof e == "object" && "id" in e && "source" in e && "target" in e;
}
function mn(e) {
  return e && typeof e == "object" && "id" in e && "position" in e && !bn(e);
}
function Nn(e) {
  return mn(e) && "computedPosition" in e;
}
function jo(e) {
  return !Number.isNaN(e) && Number.isFinite(e);
}
function Q0(e) {
  return jo(e.width) && jo(e.height) && jo(e.x) && jo(e.y);
}
function j0(e, t, n) {
  const o = {
    id: e.id.toString(),
    type: e.type ?? "default",
    dimensions: ft({
      width: 0,
      height: 0
    }),
    handleBounds: {
      source: [],
      target: []
    },
    computedPosition: ft({
      z: 0,
      ...e.position
    }),
    draggable: void 0,
    selectable: void 0,
    connectable: void 0,
    focusable: void 0,
    selected: !1,
    dragging: !1,
    resizing: !1,
    initialized: !1,
    isParent: !1,
    position: {
      x: 0,
      y: 0
    },
    data: Re(e.data) ? e.data : {},
    events: ft(Re(e.events) ? e.events : {})
  };
  return Object.assign(t ?? o, e, { id: e.id.toString(), parentNode: n });
}
function _f(e, t, n) {
  var o, i;
  const r = {
    id: e.id.toString(),
    type: e.type ?? (t == null ? void 0 : t.type) ?? "default",
    source: e.source.toString(),
    target: e.target.toString(),
    sourceHandle: (o = e.sourceHandle) == null ? void 0 : o.toString(),
    targetHandle: (i = e.targetHandle) == null ? void 0 : i.toString(),
    updatable: e.updatable ?? (n == null ? void 0 : n.updatable),
    selectable: e.selectable ?? (n == null ? void 0 : n.selectable),
    focusable: e.focusable ?? (n == null ? void 0 : n.focusable),
    data: Re(e.data) ? e.data : {},
    events: ft(Re(e.events) ? e.events : {}),
    label: e.label ?? "",
    interactionWidth: e.interactionWidth ?? (n == null ? void 0 : n.interactionWidth),
    ...n ?? {}
  };
  return Object.assign(t ?? r, e, { id: e.id.toString() });
}
function yf(e, t, n, o) {
  const i = typeof e == "string" ? e : e.id, r = /* @__PURE__ */ new Set(), s = o === "source" ? "target" : "source";
  for (const l of n)
    l[s] === i && r.add(l[o]);
  return t.filter((l) => r.has(l.id));
}
function e_(...e) {
  if (e.length === 3) {
    const [r, s, l] = e;
    return yf(r, s, l, "target");
  }
  const [t, n] = e, o = typeof t == "string" ? t : t.id;
  return n.filter((r) => bn(r) && r.source === o).map((r) => n.find((s) => mn(s) && s.id === r.target));
}
function t_(...e) {
  if (e.length === 3) {
    const [r, s, l] = e;
    return yf(r, s, l, "source");
  }
  const [t, n] = e, o = typeof t == "string" ? t : t.id;
  return n.filter((r) => bn(r) && r.target === o).map((r) => n.find((s) => mn(s) && s.id === r.source));
}
function wf({ source: e, sourceHandle: t, target: n, targetHandle: o }) {
  return `vueflow__edge-${e}${t ?? ""}-${n}${o ?? ""}`;
}
function bf(e, t) {
  return t.some(
    (n) => bn(n) && n.source === e.source && n.target === e.target && (n.sourceHandle === e.sourceHandle || !n.sourceHandle && !e.sourceHandle) && (n.targetHandle === e.targetHandle || !n.targetHandle && !e.targetHandle)
  );
}
function xf({ x: e, y: t }, { x: n, y: o, zoom: i }) {
  return {
    x: e * i + n,
    y: t * i + o
  };
}
function vs({ x: e, y: t }, { x: n, y: o, zoom: i }, r, [s, l]) {
  const a = {
    x: (e - n) / i,
    y: (t - o) / i
  };
  return r ? {
    x: s * Math.round(a.x / s),
    y: l * Math.round(a.y / l)
  } : a;
}
function Ef(e, t) {
  return {
    x: Math.min(e.x, t.x),
    y: Math.min(e.y, t.y),
    x2: Math.max(e.x2, t.x2),
    y2: Math.max(e.y2, t.y2)
  };
}
function ki({ x: e, y: t, width: n, height: o }) {
  return {
    x: e,
    y: t,
    x2: e + n,
    y2: t + o
  };
}
function $f({ x: e, y: t, x2: n, y2: o }) {
  return {
    x: e,
    y: t,
    width: n - e,
    height: o - t
  };
}
function n_(e, t) {
  return $f(Ef(ki(e), ki(t)));
}
function mr(e) {
  const t = e.reduce(
    (n, { computedPosition: o = { x: 0, y: 0 }, dimensions: i = { width: 0, height: 0 } } = {}) => Ef(
      n,
      ki({
        ...o,
        ...i
      })
    ),
    { x: Number.POSITIVE_INFINITY, y: Number.POSITIVE_INFINITY, x2: Number.NEGATIVE_INFINITY, y2: Number.NEGATIVE_INFINITY }
  );
  return $f(t);
}
function Cf(e, t, { x: n, y: o, zoom: i } = { x: 0, y: 0, zoom: 1 }, r = !1, s = !1) {
  const l = {
    x: (t.x - n) / i,
    y: (t.y - o) / i,
    width: t.width / i,
    height: t.height / i
  };
  return e.filter((a) => {
    const { computedPosition: u = { x: 0, y: 0 }, dimensions: c = { width: 0, height: 0 }, selectable: f } = a;
    if (s && !f)
      return !1;
    const d = { ...u, width: c.width || 0, height: c.height || 0 }, p = ms(l, d), E = typeof c.width > "u" || typeof c.height > "u" || c.width === 0 || c.height === 0, m = r && p > 0, _ = c.width * c.height;
    return E || m || p >= _;
  });
}
function Zt(e, t) {
  const n = /* @__PURE__ */ new Set();
  if (typeof e == "string")
    n.add(e);
  else if (e.length >= 1)
    for (const o of e)
      n.add(o.id);
  return t.filter((o) => n.has(o.source) || n.has(o.target));
}
function Oa(e, t, n, o, i, r = 0.1, s = { x: 0, y: 0 }) {
  const l = t / (e.width * (1 + r)), a = n / (e.height * (1 + r)), u = Math.min(l, a), c = Vt(u, o, i), f = e.x + e.width / 2, d = e.y + e.height / 2, p = t / 2 - f * c + (s.x ?? 0), E = n / 2 - d * c + (s.y ?? 0);
  return { x: p, y: E, zoom: c };
}
function o_(e, t) {
  return {
    x: t.x + e.x,
    y: t.y + e.y,
    z: (e.z > t.z ? e.z : t.z) + 1
  };
}
function Sf(e, t) {
  if (!e.parentNode)
    return !1;
  const n = t(e.parentNode);
  return n ? n.selected ? !0 : Sf(n, t) : !1;
}
function fn(e, t) {
  return typeof e > "u" ? "" : typeof e == "string" ? e : `${t ? `${t}__` : ""}${Object.keys(e).sort().map((o) => `${o}=${e[o]}`).join("&")}`;
}
function Da(e, t, n) {
  return e < t ? Vt(Math.abs(e - t), 1, 50) / 50 : e > n ? -Vt(Math.abs(e - n), 1, 50) / 50 : 0;
}
function Nf(e, t) {
  const n = Da(e.x, 35, t.width - 35) * 20, o = Da(e.y, 35, t.height - 35) * 20;
  return [n, o];
}
function Fr(e, t) {
  if (t) {
    const n = e.position.x + e.dimensions.width - t.dimensions.width, o = e.position.y + e.dimensions.height - t.dimensions.height;
    if (n > 0 || o > 0 || e.position.x < 0 || e.position.y < 0) {
      let i = {};
      if (typeof t.style == "function" ? i = { ...t.style(t) } : t.style && (i = { ...t.style }), i.width = i.width ?? `${t.dimensions.width}px`, i.height = i.height ?? `${t.dimensions.height}px`, n > 0)
        if (typeof i.width == "string") {
          const r = Number(i.width.replace("px", ""));
          i.width = `${r + n}px`;
        } else
          i.width += n;
      if (o > 0)
        if (typeof i.height == "string") {
          const r = Number(i.height.replace("px", ""));
          i.height = `${r + o}px`;
        } else
          i.height += o;
      if (e.position.x < 0) {
        const r = Math.abs(e.position.x);
        if (t.position.x = t.position.x - r, typeof i.width == "string") {
          const s = Number(i.width.replace("px", ""));
          i.width = `${s + r}px`;
        } else
          i.width += r;
        e.position.x = 0;
      }
      if (e.position.y < 0) {
        const r = Math.abs(e.position.y);
        if (t.position.y = t.position.y - r, typeof i.height == "string") {
          const s = Number(i.height.replace("px", ""));
          i.height = `${s + r}px`;
        } else
          i.height += r;
        e.position.y = 0;
      }
      t.dimensions.width = Number(i.width.toString().replace("px", "")), t.dimensions.height = Number(i.height.toString().replace("px", "")), typeof t.style == "function" ? t.style = (r) => {
        const s = t.style;
        return {
          ...s(r),
          ...i
        };
      } : t.style = {
        ...t.style,
        ...i
      };
    }
  }
}
function ka(e, t) {
  var n, o;
  const i = e.filter((s) => s.type === "add" || s.type === "remove");
  for (const s of i)
    if (s.type === "add")
      t.findIndex((a) => a.id === s.item.id) === -1 && t.push(s.item);
    else if (s.type === "remove") {
      const l = t.findIndex((a) => a.id === s.id);
      l !== -1 && t.splice(l, 1);
    }
  const r = t.map((s) => s.id);
  for (const s of t) {
    const l = e.filter((a) => a.id === s.id);
    for (const a of l)
      switch (a.type) {
        case "select":
          s.selected = a.selected;
          break;
        case "position":
          if (Nn(s) && (typeof a.position < "u" && (s.position = a.position), typeof a.dragging < "u" && (s.dragging = a.dragging), s.expandParent && s.parentNode)) {
            const u = t[r.indexOf(s.parentNode)];
            u && Nn(u) && Fr(s, u);
          }
          break;
        case "dimensions":
          if (Nn(s)) {
            if (typeof a.dimensions < "u" && (s.dimensions = a.dimensions), typeof a.updateStyle < "u" && (s.style = {
              ...s.style || {},
              width: `${(n = a.dimensions) == null ? void 0 : n.width}px`,
              height: `${(o = a.dimensions) == null ? void 0 : o.height}px`
            }), typeof a.resizing < "u" && (s.resizing = a.resizing), s.expandParent && s.parentNode) {
              const u = t[r.indexOf(s.parentNode)];
              u && Nn(u) && (u.initialized ? Fr(s, u) : nt(() => {
                Fr(s, u);
              }));
            }
            s.initialized || (s.initialized = !0);
          }
          break;
      }
  }
  return t;
}
function Dt(e, t) {
  return {
    id: e,
    type: "select",
    selected: t
  };
}
function Ra(e) {
  return {
    item: e,
    type: "add"
  };
}
function za(e) {
  return {
    id: e,
    type: "remove"
  };
}
function Ha(e, t, n, o, i) {
  return {
    id: e,
    source: t,
    target: n,
    sourceHandle: o || null,
    targetHandle: i || null,
    type: "remove"
  };
}
function Vr(e, t) {
  return e.reduce(
    (n, o) => {
      let i = t.includes(o.id);
      Re(o.selectable) && !o.selectable && (i = !1);
      const r = Nn(o) ? "changedNodes" : "changedEdges";
      return !o.selected && i ? n[r].push(Dt(o.id, !0)) : o.selected && !i && n[r].push(Dt(o.id, !1)), n;
    },
    { changedNodes: [], changedEdges: [] }
  );
}
function te(e) {
  const t = /* @__PURE__ */ new Set();
  let n = !1;
  const o = () => t.size > 0;
  e && (n = !0, t.add(e));
  const i = (l) => {
    t.delete(l);
  };
  return {
    on: (l) => {
      e && n && t.delete(e), t.add(l);
      const a = () => {
        i(l), e && n && t.add(e);
      };
      return lr(a), {
        off: a
      };
    },
    off: i,
    trigger: (l) => Promise.all(Array.from(t).map((a) => a(l))),
    hasListeners: o,
    fns: t
  };
}
function Fa(e, t, n) {
  let o = e;
  do {
    if (o && o.matches(t))
      return !0;
    if (o === n)
      return !1;
    o = o.parentElement;
  } while (o);
  return !1;
}
function i_(e, t, n, o, i) {
  return e.filter(
    (r) => (r.selected || r.id === i) && (!r.parentNode || !Sf(r, o)) && (r.draggable || t && typeof r.draggable > "u")
  ).map(
    (r) => {
      var s, l;
      return ft({
        id: r.id,
        position: r.position || { x: 0, y: 0 },
        distance: {
          x: n.x - ((s = r.computedPosition) == null ? void 0 : s.x) || 0,
          y: n.y - ((l = r.computedPosition) == null ? void 0 : l.y) || 0
        },
        from: r.computedPosition,
        extent: r.extent,
        parentNode: r.parentNode,
        dimensions: r.dimensions,
        expandParent: r.expandParent
      });
    }
  );
}
function Br({
  id: e,
  dragItems: t,
  findNode: n
}) {
  const o = t.reduce((i, r) => {
    const s = n(r.id);
    return s && i.push(s), i;
  }, []);
  return [e ? o.find((i) => i.id === e) : o[0], o];
}
function Af(e) {
  if (Array.isArray(e))
    switch (e.length) {
      case 1:
        return [e[0], e[0], e[0], e[0]];
      case 2:
        return [e[0], e[1], e[0], e[1]];
      case 3:
        return [e[0], e[1], e[2], e[1]];
      case 4:
        return e;
      default:
        return [0, 0, 0, 0];
    }
  return [e, e, e, e];
}
function r_(e, t, n) {
  const [o, i, r, s] = typeof e != "string" ? Af(e.padding) : [0, 0, 0, 0];
  return n && typeof n.computedPosition.x < "u" && typeof n.computedPosition.y < "u" && typeof n.dimensions.width < "u" && typeof n.dimensions.height < "u" ? [
    [n.computedPosition.x + s, n.computedPosition.y + o],
    [
      n.computedPosition.x + n.dimensions.width - i,
      n.computedPosition.y + n.dimensions.height - r
    ]
  ] : !1;
}
function s_(e, t, n, o) {
  let i = e.extent || n;
  if ((i === "parent" || !Array.isArray(i) && (i == null ? void 0 : i.range) === "parent") && !e.expandParent)
    if (e.parentNode && o && e.dimensions.width && e.dimensions.height) {
      const r = r_(i, e, o);
      r && (i = r);
    } else
      t(new Ye(Ge.NODE_EXTENT_INVALID, e.id)), i = n;
  else if (Array.isArray(i)) {
    const r = (o == null ? void 0 : o.computedPosition.x) || 0, s = (o == null ? void 0 : o.computedPosition.y) || 0;
    i = [
      [i[0][0] + r, i[0][1] + s],
      [i[1][0] + r, i[1][1] + s]
    ];
  } else if (i !== "parent" && (i != null && i.range) && Array.isArray(i.range)) {
    const [r, s, l, a] = Af(i.padding), u = (o == null ? void 0 : o.computedPosition.x) || 0, c = (o == null ? void 0 : o.computedPosition.y) || 0;
    i = [
      [i.range[0][0] + u + a, i.range[0][1] + c + r],
      [i.range[1][0] + u - s, i.range[1][1] + c - l]
    ];
  }
  return i === "parent" ? [
    [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
    [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
  ] : i;
}
function l_({ width: e, height: t }, n) {
  return [n[0], [n[1][0] - (e || 0), n[1][1] - (t || 0)]];
}
function cl(e, t, n, o, i) {
  const r = l_(e.dimensions, s_(e, n, o, i)), s = vf(t, r);
  return {
    position: {
      x: s.x - ((i == null ? void 0 : i.computedPosition.x) || 0),
      y: s.y - ((i == null ? void 0 : i.computedPosition.y) || 0)
    },
    computedPosition: s
  };
}
function _s(e, t, n) {
  const o = ((n == null ? void 0 : n.x) ?? 0) + t.x, i = ((n == null ? void 0 : n.y) ?? 0) + t.y, r = (n == null ? void 0 : n.width) ?? t.width, s = (n == null ? void 0 : n.height) ?? t.height;
  switch (e) {
    case ee.Top:
      return {
        x: o + r / 2,
        y: i
      };
    case ee.Right:
      return {
        x: o + r,
        y: i + s / 2
      };
    case ee.Bottom:
      return {
        x: o + r / 2,
        y: i + s
      };
    case ee.Left:
      return {
        x: o,
        y: i + s / 2
      };
  }
}
function Va(e = [], t) {
  return e.length && (t ? e.find((n) => n.id === t) : e[0]) || null;
}
function a_(e, t, n, o, i, r) {
  const s = _s(
    n,
    {
      ...e.dimensions,
      ...e.computedPosition
    },
    t
  ), l = _s(
    r,
    {
      ...o.dimensions,
      ...o.computedPosition
    },
    i
  );
  return {
    sourceX: s.x,
    sourceY: s.y,
    targetX: l.x,
    targetY: l.y
  };
}
function u_({
  sourcePos: e,
  targetPos: t,
  sourceWidth: n,
  sourceHeight: o,
  targetWidth: i,
  targetHeight: r,
  width: s,
  height: l,
  viewport: a
}) {
  const u = {
    x: Math.min(e.x, t.x),
    y: Math.min(e.y, t.y),
    x2: Math.max(e.x + n, t.x + i),
    y2: Math.max(e.y + o, t.y + r)
  };
  u.x === u.x2 && (u.x2 += 1), u.y === u.y2 && (u.y2 += 1);
  const c = ki({
    x: (0 - a.x) / a.zoom,
    y: (0 - a.y) / a.zoom,
    width: s / a.zoom,
    height: l / a.zoom
  }), f = Math.max(0, Math.min(c.x2, u.x2) - Math.max(c.x, u.x)), d = Math.max(0, Math.min(c.y2, u.y2) - Math.max(c.y, u.y));
  return Math.ceil(f * d) > 0;
}
function c_(e, t, n = !1) {
  const o = typeof e.zIndex == "number";
  let i = o ? e.zIndex : 0;
  const r = t(e.source), s = t(e.target);
  return !r || !s ? 0 : (n && (i = o ? e.zIndex : Math.max(r.computedPosition.z || 0, s.computedPosition.z || 0)), i);
}
var Ge = /* @__PURE__ */ ((e) => (e.MISSING_VIEWPORT_DIMENSIONS = "MISSING_VIEWPORT_DIMENSIONS", e.NODE_INVALID = "NODE_INVALID", e.NODE_NOT_FOUND = "NODE_NOT_FOUND", e.NODE_MISSING_PARENT = "NODE_MISSING_PARENT", e.NODE_TYPE_MISSING = "NODE_TYPE_MISSING", e.NODE_EXTENT_INVALID = "NODE_EXTENT_INVALID", e.EDGE_INVALID = "EDGE_INVALID", e.EDGE_NOT_FOUND = "EDGE_NOT_FOUND", e.EDGE_SOURCE_MISSING = "EDGE_SOURCE_MISSING", e.EDGE_TARGET_MISSING = "EDGE_TARGET_MISSING", e.EDGE_TYPE_MISSING = "EDGE_TYPE_MISSING", e.EDGE_SOURCE_TARGET_SAME = "EDGE_SOURCE_TARGET_SAME", e.EDGE_SOURCE_TARGET_MISSING = "EDGE_SOURCE_TARGET_MISSING", e.EDGE_ORPHANED = "EDGE_ORPHANED", e))(Ge || {});
const Ba = {
  MISSING_VIEWPORT_DIMENSIONS: () => "The Vue Flow parent container needs a width and a height to render the graph",
  NODE_INVALID: (e) => `Node is invalid
Node: ${e}`,
  NODE_NOT_FOUND: (e) => `Node not found
Node: ${e}`,
  NODE_MISSING_PARENT: (e, t) => `Node is missing a parent
Node: ${e}
Parent: ${t}`,
  NODE_TYPE_MISSING: (e) => `Node type is missing
Type: ${e}`,
  NODE_EXTENT_INVALID: (e) => `Only child nodes can use a parent extent
Node: ${e}`,
  EDGE_INVALID: (e) => `An edge needs a source and a target
Edge: ${e}`,
  EDGE_SOURCE_MISSING: (e, t) => `Edge source is missing
Edge: ${e} 
Source: ${t}`,
  EDGE_TARGET_MISSING: (e, t) => `Edge target is missing
Edge: ${e} 
Target: ${t}`,
  EDGE_TYPE_MISSING: (e) => `Edge type is missing
Type: ${e}`,
  EDGE_SOURCE_TARGET_SAME: (e, t, n) => `Edge source and target are the same
Edge: ${e} 
Source: ${t} 
Target: ${n}`,
  EDGE_SOURCE_TARGET_MISSING: (e, t, n) => `Edge source or target is missing
Edge: ${e} 
Source: ${t} 
Target: ${n}`,
  EDGE_ORPHANED: (e) => `Edge was orphaned (suddenly missing source or target) and has been removed
Edge: ${e}`,
  EDGE_NOT_FOUND: (e) => `Edge not found
Edge: ${e}`
};
class Ye extends Error {
  constructor(t, ...n) {
    var o;
    super((o = Ba[t]) == null ? void 0 : o.call(Ba, ...n)), this.name = "VueFlowError", this.code = t, this.args = n;
  }
}
function fl(e) {
  return "clientX" in e;
}
function vn(e, t) {
  var n, o;
  const i = fl(e), r = i ? e.clientX : (n = e.touches) == null ? void 0 : n[0].clientX, s = i ? e.clientY : (o = e.touches) == null ? void 0 : o[0].clientY;
  return {
    x: r - ((t == null ? void 0 : t.left) ?? 0),
    y: s - ((t == null ? void 0 : t.top) ?? 0)
  };
}
const Ri = () => {
  var e;
  return typeof navigator < "u" && ((e = navigator == null ? void 0 : navigator.userAgent) == null ? void 0 : e.indexOf("Mac")) >= 0;
};
function Mf() {
  return {
    handleDomNode: null,
    isValid: !1,
    connection: { source: "", target: "", sourceHandle: null, targetHandle: null },
    endHandle: null
  };
}
function Lr(e) {
  e == null || e.classList.remove("valid", "connecting", "vue-flow__handle-valid", "vue-flow__handle-connecting");
}
function La(e, t, n, o) {
  return (t[n] || []).reduce((i, r) => {
    var s, l;
    return `${e.id}-${r.id}-${n}` !== o && i.push({
      id: r.id || null,
      type: n,
      nodeId: e.id,
      x: (((s = e.computedPosition) == null ? void 0 : s.x) ?? 0) + r.x + r.width / 2,
      y: (((l = e.computedPosition) == null ? void 0 : l.y) ?? 0) + r.y + r.height / 2,
      width: r.width,
      height: r.height
    }), i;
  }, []);
}
function f_(e, t, n, o, i, r) {
  const { x: s, y: l } = vn(e), u = t.elementsFromPoint(s, l).find((E) => E.classList.contains("vue-flow__handle"));
  if (u) {
    const E = u.getAttribute("data-nodeid");
    if (E) {
      const m = dl(void 0, u), _ = u.getAttribute("data-handleid"), b = r({ nodeId: E, id: _, type: m });
      if (b) {
        const C = i.find((N) => N.nodeId === E && N.type === m && N.id === _);
        return {
          handle: {
            id: _,
            type: m,
            nodeId: E,
            x: (C == null ? void 0 : C.x) || n.x,
            y: (C == null ? void 0 : C.y) || n.y
          },
          validHandleResult: b
        };
      }
    }
  }
  let c = [], f = Number.POSITIVE_INFINITY;
  for (const E of i) {
    const m = Math.sqrt((E.x - n.x) ** 2 + (E.y - n.y) ** 2);
    if (m <= o) {
      const _ = r(E);
      m <= f && (m < f ? c = [{ handle: E, validHandleResult: _ }] : m === f && c.push({
        handle: E,
        validHandleResult: _
      }), f = m);
    }
  }
  if (!c.length)
    return { handle: null, validHandleResult: Mf() };
  if (c.length === 1)
    return c[0];
  const d = c.some(({ validHandleResult: E }) => E.isValid), p = c.some(({ handle: E }) => E.type === "target");
  return c.find(
    ({ handle: E, validHandleResult: m }) => p ? E.type === "target" : d ? m.isValid : !0
  ) || c[0];
}
function Ua(e, t, n, o, i, r, s, l, a, u, c) {
  const f = r === "target", d = l.querySelector(`.vue-flow__handle[data-id="${t == null ? void 0 : t.nodeId}-${t == null ? void 0 : t.id}-${t == null ? void 0 : t.type}"]`), { x: p, y: E } = vn(e), m = l.elementFromPoint(p, E), _ = m != null && m.classList.contains("vue-flow__handle") ? m : d, b = Mf();
  if (_) {
    b.handleDomNode = _;
    const C = dl(void 0, _), N = _.getAttribute("data-nodeid"), y = _.getAttribute("data-handleid"), D = _.classList.contains("connectable"), O = _.classList.contains("connectableend"), S = {
      source: f ? N : o,
      sourceHandle: f ? y : i,
      target: f ? o : N,
      targetHandle: f ? i : y
    };
    b.connection = S;
    const X = D && O && (n === wn.Strict ? f && C === "source" || !f && C === "target" : N !== o || y !== i);
    b.endHandle = {
      nodeId: N,
      handleId: y,
      type: C
    }, X && (b.isValid = s(S, {
      edges: a,
      nodes: u,
      sourceNode: c(S.source),
      targetNode: c(S.target)
    }));
  }
  return b;
}
function d_({ nodes: e, nodeId: t, handleId: n, handleType: o }) {
  return e.reduce((i, r) => {
    const { handleBounds: s } = r;
    let l = [], a = [];
    return s && (l = La(r, s, "source", `${t}-${n}-${o}`), a = La(r, s, "target", `${t}-${n}-${o}`)), i.push(...l, ...a), i;
  }, []);
}
function dl(e, t) {
  return e || (t != null && t.classList.contains("target") ? "target" : t != null && t.classList.contains("source") ? "source" : null);
}
function h_(e, t) {
  let n = null;
  return t ? n = "valid" : e && !t && (n = "invalid"), n;
}
const p_ = ["production", "prod"];
function vr(e, ...t) {
  p_.includes(Kp.NODE_ENV) || console.warn(`[Vue Flow]: ${e}`, ...t);
}
function Ga(e, t, n) {
  const o = t.querySelectorAll(`.vue-flow__handle${e}`);
  if (!o || !o.length)
    return;
  const i = Array.from(o), r = t.getBoundingClientRect();
  return i.map((s) => {
    const l = s.getBoundingClientRect();
    return {
      id: s.getAttribute("data-handleid"),
      position: s.getAttribute("data-handlepos"),
      x: (l.left - r.left) / n,
      y: (l.top - r.top) / n,
      ...gr(s)
    };
  });
}
function ys(e, t, n, o, i, r = !1, s) {
  i.value = !1, e.selected ? (r || e.selected && t) && (o([e]), nt(() => {
    s.blur();
  })) : n([e]);
}
function Re(e) {
  return typeof G(e) < "u";
}
function g_(e, t, n, o) {
  if (!e || !e.source || !e.target)
    return n(new Ye(Ge.EDGE_INVALID, (e == null ? void 0 : e.id) ?? "[ID UNKNOWN]")), !1;
  let i;
  return bn(e) ? i = e : i = {
    ...e,
    id: wf(e)
  }, i = _f(i, void 0, o), bf(i, t) ? !1 : i;
}
function m_(e, t, n, o, i, r) {
  if (!t.source || !t.target)
    return r(new Ye(Ge.EDGE_INVALID, e.id)), !1;
  const s = o(e.id);
  if (!s)
    return r(new Ye(Ge.EDGE_NOT_FOUND, e.id)), !1;
  const { id: l, ...a } = e, u = {
    ...a,
    id: i ? wf(t) : l,
    source: t.source,
    target: t.target,
    sourceHandle: t.sourceHandle,
    targetHandle: t.targetHandle
  };
  return n.splice(n.indexOf(s), 1, u), u;
}
function Ya(e, t, n, o) {
  const i = {}, r = e.reduce((l, a, u) => {
    if (!mn(a))
      return o(
        new Ye(Ge.NODE_INVALID, a == null ? void 0 : a.id) || `[ID UNKNOWN|INDEX ${u}]`
      ), l;
    const c = j0(a, n(a.id), a.parentNode);
    return a.parentNode && (i[a.parentNode] = !0), l.concat(c);
  }, []), s = [...r, ...t];
  for (const l of r) {
    const a = s.find((u) => u.id === l.parentNode);
    l.parentNode && !a && o(new Ye(Ge.NODE_MISSING_PARENT, l.id, l.parentNode)), (l.parentNode || i[l.id]) && (i[l.id] && (l.isParent = !0), a && (a.isParent = !0));
  }
  return r;
}
function Wa(e, t) {
  e.clear();
  for (const n of t) {
    const { id: o, source: i, target: r, sourceHandle: s = null, targetHandle: l = null } = n, a = `${i}-source-${s}`, u = `${r}-target-${l}`, c = e.get(a) || /* @__PURE__ */ new Map(), f = e.get(u) || /* @__PURE__ */ new Map(), d = ft({ edgeId: o, source: i, target: r, sourceHandle: s, targetHandle: l });
    e.set(a, c.set(`${r}-${l}`, d)), e.set(u, f.set(`${i}-${s}`, d));
  }
}
function Xa(e, t, n) {
  if (!n)
    return;
  const o = [];
  for (const i of e.keys())
    t.has(i) || o.push(e.get(i));
  o.length && n(o);
}
function v_(e, t) {
  if (!e && !t)
    return !0;
  if (!e || !t || e.size !== t.size)
    return !1;
  if (!e.size && !t.size)
    return !0;
  for (const n of e.keys())
    if (!t.has(n))
      return !1;
  return !0;
}
function __() {
  return {
    edgesChange: te(),
    nodesChange: te(),
    nodeDoubleClick: te(),
    nodeClick: te(),
    nodeMouseEnter: te(),
    nodeMouseMove: te(),
    nodeMouseLeave: te(),
    nodeContextMenu: te(),
    nodeDragStart: te(),
    nodeDrag: te(),
    nodeDragStop: te(),
    nodesInitialized: te(),
    miniMapNodeClick: te(),
    miniMapNodeDoubleClick: te(),
    miniMapNodeMouseEnter: te(),
    miniMapNodeMouseMove: te(),
    miniMapNodeMouseLeave: te(),
    connect: te(),
    connectStart: te(),
    connectEnd: te(),
    clickConnectStart: te(),
    clickConnectEnd: te(),
    paneReady: te(),
    init: te(),
    move: te(),
    moveStart: te(),
    moveEnd: te(),
    selectionDragStart: te(),
    selectionDrag: te(),
    selectionDragStop: te(),
    selectionContextMenu: te(),
    selectionStart: te(),
    selectionEnd: te(),
    viewportChangeStart: te(),
    viewportChange: te(),
    viewportChangeEnd: te(),
    paneScroll: te(),
    paneClick: te(),
    paneContextMenu: te(),
    paneMouseEnter: te(),
    paneMouseMove: te(),
    paneMouseLeave: te(),
    edgeContextMenu: te(),
    edgeMouseEnter: te(),
    edgeMouseMove: te(),
    edgeMouseLeave: te(),
    edgeDoubleClick: te(),
    edgeClick: te(),
    edgeUpdateStart: te(),
    edgeUpdate: te(),
    edgeUpdateEnd: te(),
    updateNodeInternals: te(),
    error: te((e) => vr(e.message))
  };
}
function y_(e, t) {
  ac(() => {
    for (const [n, o] of Object.entries(t.value)) {
      const i = (r) => {
        e(n, r);
      };
      o.fns.add(i), lr(() => {
        o.off(i);
      });
    }
  });
}
function Pf() {
  return {
    vueFlowRef: null,
    viewportRef: null,
    // todo: change this to a Set
    nodes: [],
    // todo: change this to a Set
    edges: [],
    connectionLookup: /* @__PURE__ */ new Map(),
    nodeTypes: {},
    edgeTypes: {},
    initialized: !1,
    dimensions: {
      width: 0,
      height: 0
    },
    viewport: { x: 0, y: 0, zoom: 1 },
    d3Zoom: null,
    d3Selection: null,
    d3ZoomHandler: null,
    minZoom: 0.5,
    maxZoom: 2,
    translateExtent: [
      [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
      [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
    ],
    nodeExtent: [
      [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
      [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
    ],
    selectionMode: ll.Full,
    paneDragging: !1,
    preventScrolling: !0,
    zoomOnScroll: !0,
    zoomOnPinch: !0,
    zoomOnDoubleClick: !0,
    panOnScroll: !1,
    panOnScrollSpeed: 0.5,
    panOnScrollMode: mo.Free,
    panOnDrag: !0,
    edgeUpdaterRadius: 10,
    onlyRenderVisibleElements: !1,
    defaultViewport: { x: 0, y: 0, zoom: 1 },
    nodesSelectionActive: !1,
    userSelectionActive: !1,
    userSelectionRect: null,
    defaultMarkerColor: "#b1b1b7",
    connectionLineStyle: {},
    connectionLineType: null,
    connectionLineOptions: {
      type: un.Bezier,
      style: {}
    },
    connectionMode: wn.Loose,
    connectionStartHandle: null,
    connectionEndHandle: null,
    connectionClickStartHandle: null,
    connectionPosition: { x: Number.NaN, y: Number.NaN },
    connectionRadius: 20,
    connectOnClick: !0,
    connectionStatus: null,
    isValidConnection: null,
    snapGrid: [15, 15],
    snapToGrid: !1,
    edgesUpdatable: !1,
    edgesFocusable: !0,
    nodesFocusable: !0,
    nodesConnectable: !0,
    nodesDraggable: !0,
    nodeDragThreshold: 1,
    elementsSelectable: !0,
    selectNodesOnDrag: !0,
    multiSelectionActive: !1,
    selectionKeyCode: "Shift",
    multiSelectionKeyCode: Ri() ? "Meta" : "Control",
    zoomActivationKeyCode: Ri() ? "Meta" : "Control",
    deleteKeyCode: "Backspace",
    panActivationKeyCode: "Space",
    hooks: __(),
    applyDefault: !0,
    autoConnect: !1,
    fitViewOnInit: !1,
    fitViewOnInitDone: !1,
    noDragClassName: "nodrag",
    noWheelClassName: "nowheel",
    noPanClassName: "nopan",
    defaultEdgeOptions: void 0,
    elevateEdgesOnSelect: !1,
    elevateNodesOnSelect: !0,
    autoPanOnNodeDrag: !0,
    autoPanOnConnect: !0,
    disableKeyboardA11y: !1,
    ariaLiveMessage: ""
  };
}
const w_ = [
  "id",
  "vueFlowRef",
  "viewportRef",
  "initialized",
  "modelValue",
  "nodes",
  "edges",
  "maxZoom",
  "minZoom",
  "translateExtent",
  "hooks",
  "defaultEdgeOptions"
];
function b_(e, t, n, o) {
  const i = q0(t), r = (h) => {
    const v = h ?? n.value ?? [];
    t.hooks.updateNodeInternals.trigger(v);
  }, s = (h) => t_(h, t.nodes, t.edges), l = (h) => e_(h, t.nodes, t.edges), a = (h) => Zt(h, t.edges), u = (h) => {
    if (h)
      return t.nodes && !n.value.length ? t.nodes.find((v) => v.id === h) : t.nodes[n.value.indexOf(h)];
  }, c = (h) => {
    if (h)
      return t.edges && !o.value.length ? t.edges.find((v) => v.id === h) : t.edges[o.value.indexOf(h)];
  }, f = (h, v, $) => {
    var A, k;
    const H = [];
    for (const z of h) {
      const B = {
        id: z.id,
        type: "position",
        dragging: $,
        from: z.from
      };
      if (v && (B.position = z.position, z.parentNode)) {
        const F = u(z.parentNode);
        B.position = {
          x: B.position.x - (((A = F == null ? void 0 : F.computedPosition) == null ? void 0 : A.x) ?? 0),
          y: B.position.y - (((k = F == null ? void 0 : F.computedPosition) == null ? void 0 : k.y) ?? 0)
        };
      }
      H.push(B);
    }
    H != null && H.length && t.hooks.nodesChange.trigger(H);
  }, d = (h) => {
    if (!t.vueFlowRef)
      return;
    const v = t.vueFlowRef.querySelector(".vue-flow__transformationpane");
    if (!v)
      return;
    const $ = window.getComputedStyle(v), { m22: A } = new window.DOMMatrixReadOnly($.transform), k = h.reduce((H, z) => {
      const B = u(z.id);
      if (B) {
        const F = gr(z.nodeElement);
        !!(F.width && F.height && (B.dimensions.width !== F.width || B.dimensions.height !== F.height || z.forceUpdate)) && (B.handleBounds.source = Ga(".source", z.nodeElement, A), B.handleBounds.target = Ga(".target", z.nodeElement, A), B.dimensions = F, B.initialized = !0, H.push({
          id: B.id,
          type: "dimensions",
          dimensions: F
        }));
      }
      return H;
    }, []);
    !t.fitViewOnInitDone && t.fitViewOnInit && nt(() => {
      i.value.fitView(), t.fitViewOnInitDone = !0;
    }), k.length && t.hooks.nodesChange.trigger(k);
  }, p = (h, v) => {
    const $ = h.map((H) => H.id);
    let A, k = [];
    if (t.multiSelectionActive)
      A = $.map((H) => Dt(H, v));
    else {
      const H = Vr([...t.nodes, ...t.edges], $);
      A = H.changedNodes, k = H.changedEdges;
    }
    A.length && t.hooks.nodesChange.trigger(A), k.length && t.hooks.edgesChange.trigger(k);
  }, E = (h, v) => {
    const $ = h.map((H) => H.id);
    let A = [], k;
    if (t.multiSelectionActive)
      k = $.map((H) => Dt(H, v));
    else {
      const H = Vr([...t.nodes, ...t.edges], $);
      A = H.changedNodes, k = H.changedEdges;
    }
    A.length && t.hooks.nodesChange.trigger(A), k.length && t.hooks.edgesChange.trigger(k);
  }, m = (h, v) => {
    const $ = h.filter(mn).map((z) => z.id), A = h.filter(bn).map((z) => z.id);
    let { changedNodes: k, changedEdges: H } = Vr([...t.nodes, ...t.edges], [...$, ...A]);
    t.multiSelectionActive && (k = $.map((z) => Dt(z, v)), H = A.map((z) => Dt(z, v))), k.length && t.hooks.nodesChange.trigger(k), H.length && t.hooks.edgesChange.trigger(H);
  }, _ = (h) => {
    p(h, !0);
  }, b = (h) => {
    E(h, !0);
  }, C = (h) => {
    m(h, !0);
  }, N = (h) => {
    if (!h.length)
      return p(h, !1);
    const $ = h.map((A) => A.id).map((A) => Dt(A, !1));
    $.length && t.hooks.nodesChange.trigger($);
  }, y = (h) => {
    if (!h.length)
      return E(h, !1);
    const $ = h.map((A) => A.id).map((A) => Dt(A, !1));
    $.length && t.hooks.edgesChange.trigger($);
  }, D = (h) => {
    if (!h || !h.length)
      return m([], !1);
    const v = h.reduce(
      ($, A) => {
        const k = Dt(A.id, !1);
        return mn(A) ? $.nodes.push(k) : $.edges.push(k), $;
      },
      { nodes: [], edges: [] }
    );
    v.nodes.length && t.hooks.nodesChange.trigger(v.nodes), v.edges.length && t.hooks.edgesChange.trigger(v.edges);
  }, O = (h) => {
    var v;
    (v = t.d3Zoom) == null || v.scaleExtent([h, t.maxZoom]), t.minZoom = h;
  }, S = (h) => {
    var v;
    (v = t.d3Zoom) == null || v.scaleExtent([t.minZoom, h]), t.maxZoom = h;
  }, V = (h) => {
    var v;
    (v = t.d3Zoom) == null || v.translateExtent(h), t.translateExtent = h;
  }, X = (h) => {
    t.nodeExtent = h, r(n.value);
  }, Y = (h) => {
    t.nodesDraggable = h, t.nodesConnectable = h, t.elementsSelectable = h;
  }, W = (h) => {
    const v = h instanceof Function ? h(t.nodes) : h;
    !t.initialized && !v.length || (t.nodes = Ya(v, t.nodes, u, t.hooks.error.trigger));
  }, le = (h) => {
    const v = h instanceof Function ? h(t.edges) : h;
    if (!t.initialized && !v.length)
      return;
    const $ = t.isValidConnection ? v.filter(
      (A) => t.isValidConnection(A, {
        edges: t.edges,
        nodes: t.nodes,
        sourceNode: u(A.source),
        targetNode: u(A.target)
      })
    ) : v;
    Wa(t.connectionLookup, $), t.edges = $.reduce((A, k) => {
      const H = u(k.source), z = u(k.target), B = !H || typeof H > "u", F = !z || typeof z > "u";
      if (B && F ? t.hooks.error.trigger(new Ye(Ge.EDGE_SOURCE_TARGET_MISSING, k.id, k.source, k.target)) : (B && t.hooks.error.trigger(new Ye(Ge.EDGE_SOURCE_MISSING, k.id, k.source)), F && t.hooks.error.trigger(new Ye(Ge.EDGE_TARGET_MISSING, k.id, k.target))), B || F)
        return A;
      const Q = c(k.id);
      return A.push({
        ..._f(k, Q, t.defaultEdgeOptions),
        sourceNode: H,
        targetNode: z
      }), A;
    }, []);
  }, K = (h) => {
    const v = h instanceof Function ? h([...t.nodes, ...t.edges]) : h;
    !t.initialized && !v.length || (W(v.filter(mn)), le(v.filter(bn)));
  }, g = (h) => {
    let v = h instanceof Function ? h(t.nodes) : h;
    v = Array.isArray(v) ? v : [v];
    const A = Ya(v, t.nodes, u, t.hooks.error.trigger).map(Ra);
    A.length && t.hooks.nodesChange.trigger(A);
  }, R = (h) => {
    let v = h instanceof Function ? h(t.edges) : h;
    v = Array.isArray(v) ? v : [v];
    const A = (t.isValidConnection ? v.filter((k) => {
      var H;
      return (H = t.isValidConnection) == null ? void 0 : H.call(t, k, {
        edges: t.edges,
        nodes: t.nodes,
        sourceNode: u(k.source),
        targetNode: u(k.target)
      });
    }) : v).reduce((k, H) => {
      const z = g_(H, t.edges, t.hooks.error.trigger, t.defaultEdgeOptions);
      if (z) {
        const B = u(z.source), F = u(z.target);
        k.push(
          Ra({
            ...z,
            sourceNode: B,
            targetNode: F
          })
        );
      }
      return k;
    }, []);
    A.length && t.hooks.edgesChange.trigger(A);
  }, w = (h, v = !0, $ = !1) => {
    const A = h instanceof Function ? h(t.nodes) : h, k = Array.isArray(A) ? A : [A], H = [], z = [];
    function B(Q) {
      const oe = a(Q).filter((ie) => Re(ie.deletable) ? ie.deletable : !0);
      z.push(
        ...oe.map(
          (ie) => Ha(
            ie.id,
            ie.source,
            ie.target,
            ie.sourceHandle,
            ie.targetHandle
          )
        )
      );
    }
    function F(Q) {
      const oe = t.nodes.filter((ie) => ie.parentNode === Q);
      if (oe.length) {
        const ie = oe.map((de) => de.id);
        H.push(...ie.map((de) => za(de))), v && B(oe);
        for (const de of oe)
          F(de.id);
      }
    }
    for (const Q of k) {
      const oe = typeof Q == "string" ? u(Q) : Q;
      oe && (Re(oe.deletable) && !oe.deletable || (H.push(za(oe.id)), v && B([oe]), $ && F(oe.id)));
    }
    z.length && t.hooks.edgesChange.trigger(z), H.length && t.hooks.nodesChange.trigger(H);
  }, P = (h) => {
    const v = h instanceof Function ? h(t.edges) : h, $ = Array.isArray(v) ? v : [v], A = [];
    for (const k of $) {
      const H = typeof k == "string" ? c(k) : k;
      H && (Re(H.deletable) && !H.deletable || A.push(
        Ha(
          typeof k == "string" ? k : k.id,
          H.source,
          H.target,
          H.sourceHandle,
          H.targetHandle
        )
      ));
    }
    t.hooks.edgesChange.trigger(A);
  }, I = (h, v, $ = !0) => m_(h, v, t.edges, c, $, t.hooks.error.trigger), T = (h) => ka(h, t.nodes), M = (h) => {
    const v = ka(h, t.edges);
    return Wa(t.connectionLookup, v), v;
  }, U = (h, v, $ = { replace: !1 }) => {
    const A = u(h);
    if (!A)
      return;
    const k = typeof v == "function" ? v(A) : v;
    $.replace ? t.nodes.splice(t.nodes.indexOf(A), 1, k) : Object.assign(A, k);
  }, q = (h, v, $ = { replace: !1 }) => {
    U(
      h,
      (A) => {
        const k = typeof v == "function" ? v(A) : v;
        return $.replace ? { ...A, data: k } : { ...A, data: { ...A.data, ...k } };
      },
      $
    );
  }, Z = (h, v, $, A = !1) => {
    A ? t.connectionClickStartHandle = h : t.connectionStartHandle = h, t.connectionEndHandle = null, t.connectionStatus = null, v && (t.connectionPosition = v);
  }, J = (h, v = null, $ = null) => {
    t.connectionStartHandle && (t.connectionPosition = h, t.connectionEndHandle = v, t.connectionStatus = $);
  }, se = (h, v) => {
    t.connectionPosition = { x: Number.NaN, y: Number.NaN }, t.connectionEndHandle = null, t.connectionStatus = null, v ? t.connectionClickStartHandle = null : t.connectionStartHandle = null;
  }, L = (h) => {
    const v = Q0(h), $ = v ? null : Nn(h) ? h : u(h.id);
    return !v && !$ ? [null, null, v] : [v ? h : Ta($), $, v];
  }, ae = (h, v = !0, $ = t.nodes) => {
    const [A, k, H] = L(h);
    return A ? ($ || t.nodes).filter((z) => {
      if (!H && (z.id === k.id || !z.computedPosition))
        return !1;
      const B = Ta(z), F = ms(B, A);
      return v && F > 0 || F >= Number(A.width) * Number(A.height);
    }) : [];
  }, j = (h, v, $ = !0) => {
    const [A] = L(h);
    if (!A)
      return !1;
    const k = ms(A, v);
    return $ && k > 0 || k >= Number(A.width) * Number(A.height);
  }, ne = (h) => {
    const { viewport: v, dimensions: $, d3Zoom: A, d3Selection: k, translateExtent: H } = t;
    if (!A || !k || !h.x && !h.y)
      return !1;
    const z = Un.translate(v.x + h.x, v.y + h.y).scale(v.zoom), B = [
      [0, 0],
      [$.width, $.height]
    ], F = A.constrain()(z, B, H), Q = t.viewport.x !== F.x || t.viewport.y !== F.y || t.viewport.zoom !== F.k;
    return A.transform(k, F), Q;
  }, ue = (h) => {
    const v = h instanceof Function ? h(t) : h, $ = [
      "d3Zoom",
      "d3Selection",
      "d3ZoomHandler",
      "viewportRef",
      "vueFlowRef",
      "dimensions",
      "hooks"
    ];
    Re(v.defaultEdgeOptions) && (t.defaultEdgeOptions = v.defaultEdgeOptions);
    const A = v.modelValue || v.nodes || v.edges ? [] : void 0;
    A && (v.modelValue && A.push(...v.modelValue), v.nodes && A.push(...v.nodes), v.edges && A.push(...v.edges), K(A));
    const k = () => {
      Re(v.maxZoom) && S(v.maxZoom), Re(v.minZoom) && O(v.minZoom), Re(v.translateExtent) && V(v.translateExtent);
    };
    for (const H of Object.keys(v)) {
      const z = H, B = v[z];
      ![...w_, ...$].includes(z) && Re(B) && (t[z] = B);
    }
    Ai(() => t.d3Zoom).not.toBeNull().then(k), t.initialized || (t.initialized = !0);
  };
  return {
    updateNodePositions: f,
    updateNodeDimensions: d,
    setElements: K,
    setNodes: W,
    setEdges: le,
    addNodes: g,
    addEdges: R,
    removeNodes: w,
    removeEdges: P,
    findNode: u,
    findEdge: c,
    updateEdge: I,
    updateNode: U,
    updateNodeData: q,
    applyEdgeChanges: M,
    applyNodeChanges: T,
    addSelectedElements: C,
    addSelectedNodes: _,
    addSelectedEdges: b,
    setMinZoom: O,
    setMaxZoom: S,
    setTranslateExtent: V,
    setNodeExtent: X,
    removeSelectedElements: D,
    removeSelectedNodes: N,
    removeSelectedEdges: y,
    startConnection: Z,
    updateConnection: J,
    endConnection: se,
    setInteractive: Y,
    setState: ue,
    getIntersectingNodes: ae,
    getIncomers: s,
    getOutgoers: l,
    getConnectedEdges: a,
    isNodeIntersecting: j,
    panBy: ne,
    fitView: (h) => i.value.fitView(h),
    zoomIn: (h) => i.value.zoomIn(h),
    zoomOut: (h) => i.value.zoomOut(h),
    zoomTo: (h, v) => i.value.zoomTo(h, v),
    setViewport: (h, v) => i.value.setViewport(h, v),
    setTransform: (h, v) => i.value.setTransform(h, v),
    getViewport: () => i.value.getViewport(),
    getTransform: () => i.value.getTransform(),
    setCenter: (h, v, $) => i.value.setCenter(h, v, $),
    fitBounds: (h, v) => i.value.fitBounds(h, v),
    project: (h) => i.value.project(h),
    screenToFlowCoordinate: (h) => i.value.screenToFlowCoordinate(h),
    flowToScreenCoordinate: (h) => i.value.flowToScreenCoordinate(h),
    toObject: () => JSON.parse(
      JSON.stringify({
        nodes: t.nodes.map((h) => {
          const {
            computedPosition: v,
            handleBounds: $,
            selected: A,
            dimensions: k,
            isParent: H,
            resizing: z,
            dragging: B,
            initialized: F,
            events: Q,
            ...oe
          } = h;
          return oe;
        }),
        edges: t.edges.map((h) => {
          const { selected: v, sourceNode: $, targetNode: A, events: k, ...H } = h;
          return H;
        }),
        position: [t.viewport.x, t.viewport.y],
        zoom: t.viewport.zoom,
        viewport: t.viewport
      })
    ),
    fromObject: (h) => new Promise((v) => {
      const { nodes: $, edges: A, position: k, zoom: H, viewport: z } = h;
      if ($ && W($), A && le(A), z != null && z.x && (z != null && z.y) || k) {
        const B = (z == null ? void 0 : z.x) || k[0], F = (z == null ? void 0 : z.y) || k[1], Q = (z == null ? void 0 : z.zoom) || H || t.viewport.zoom;
        return Ai(() => i.value.viewportInitialized).toBe(!0).then(() => {
          i.value.setViewport({
            x: B,
            y: F,
            zoom: Q
          }).then(() => {
            v(!0);
          });
        });
      } else
        v(!0);
    }),
    updateNodeInternals: r,
    viewportHelper: i,
    $reset: () => {
      const h = Pf();
      if (t.edges = [], t.nodes = [], t.d3Zoom && t.d3Selection) {
        const v = Un.translate(h.defaultViewport.x ?? 0, h.defaultViewport.y ?? 0).scale(Vt(h.defaultViewport.zoom ?? 1, h.minZoom, h.maxZoom)), $ = t.viewportRef.getBoundingClientRect(), A = [
          [0, 0],
          [$.width, $.height]
        ], k = t.d3Zoom.constrain()(v, A, h.translateExtent);
        t.d3Zoom.transform(t.d3Selection, k);
      }
      ue(h);
    },
    $destroy: () => {
    }
  };
}
const x_ = ["data-id", "data-handleid", "data-nodeid", "data-handlepos"], E_ = {
  name: "Handle",
  compatConfig: { MODE: 3 }
}, Mt = /* @__PURE__ */ Se({
  ...E_,
  props: {
    id: {},
    type: {},
    position: { default: () => ee.Top },
    isValidConnection: { type: Function },
    connectable: { type: [Boolean, Number, String, Function], default: void 0 },
    connectableStart: { type: Boolean, default: !0 },
    connectableEnd: { type: Boolean, default: !0 }
  },
  setup(e, { expose: t }) {
    const n = dc(e, ["position", "connectable", "connectableStart", "connectableEnd", "id"]), o = Xe(() => n.type ?? "source"), i = Xe(() => n.isValidConnection ?? null), {
      connectionStartHandle: r,
      connectionClickStartHandle: s,
      connectionEndHandle: l,
      vueFlowRef: a,
      nodesConnectable: u,
      noDragClassName: c,
      noPanClassName: f
    } = Ee(), { id: d, node: p, nodeEl: E, connectedEdges: m } = ul(), _ = be(), b = Xe(() => e.id ?? `${d}__handle-${e.position}`), C = Xe(() => typeof e.connectableStart < "u" ? e.connectableStart : !0), N = Xe(() => typeof e.connectableEnd < "u" ? e.connectableEnd : !0), y = Xe(
      () => {
        var W, le, K, g, R, w;
        return ((W = r.value) == null ? void 0 : W.nodeId) === d && ((le = r.value) == null ? void 0 : le.handleId) === b.value && ((K = r.value) == null ? void 0 : K.type) === o.value || ((g = l.value) == null ? void 0 : g.nodeId) === d && ((R = l.value) == null ? void 0 : R.handleId) === b.value && ((w = l.value) == null ? void 0 : w.type) === o.value;
      }
    ), D = Xe(
      () => {
        var W, le, K;
        return ((W = s.value) == null ? void 0 : W.nodeId) === d && ((le = s.value) == null ? void 0 : le.handleId) === b.value && ((K = s.value) == null ? void 0 : K.type) === o.value;
      }
    ), { handlePointerDown: O, handleClick: S } = gf({
      nodeId: d,
      handleId: b,
      isValidConnection: i,
      type: o
    }), V = he(() => typeof e.connectable == "string" && e.connectable === "single" ? !m.value.some((W) => {
      const le = W[`${o.value}Handle`];
      return W[o.value] !== d ? !1 : le ? le === b.value : !0;
    }) : typeof e.connectable == "number" ? m.value.filter((W) => {
      const le = W[`${o.value}Handle`];
      return W[o.value] !== d ? !1 : le ? le === b.value : !0;
    }).length < e.connectable : typeof e.connectable == "function" ? e.connectable(p, m.value) : Re(e.connectable) ? e.connectable : u.value);
    Ai(() => p.initialized).toBe(!0, { flush: "post" }).then(() => {
      var W;
      const le = (W = p.handleBounds[o.value]) == null ? void 0 : W.find((T) => T.id === b.value);
      if (!a.value || le)
        return;
      const K = a.value.querySelector(".vue-flow__transformationpane");
      if (!E.value || !_.value || !K || !b.value)
        return;
      const g = E.value.getBoundingClientRect(), R = _.value.getBoundingClientRect(), w = window.getComputedStyle(K), { m22: P } = new window.DOMMatrixReadOnly(w.transform), I = {
        id: b.value,
        position: e.position,
        x: (R.left - g.left) / P,
        y: (R.top - g.top) / P,
        ...gr(_.value)
      };
      p.handleBounds[o.value] = [...p.handleBounds[o.value] ?? [], I];
    }), nr(() => {
      const W = p.handleBounds[o.value];
      W && (p.handleBounds[o.value] = W.filter((le) => le.id !== b.value));
    });
    function X(W) {
      const le = fl(W);
      V.value && C.value && (le && W.button === 0 || !le) && O(W);
    }
    function Y(W) {
      !d || !s.value && !C.value || V.value && S(W);
    }
    return t({
      handleClick: S,
      handlePointerDown: O,
      onClick: Y,
      onPointerDown: X
    }), (W, le) => (re(), pe("div", {
      ref_key: "handle",
      ref: _,
      "data-id": `${G(d)}-${G(b)}-${G(o)}`,
      "data-handleid": G(b),
      "data-nodeid": G(d),
      "data-handlepos": W.position,
      class: We(["vue-flow__handle", [
        `vue-flow__handle-${W.position}`,
        `vue-flow__handle-${G(b)}`,
        G(c),
        G(f),
        G(o),
        {
          connectable: V.value,
          connecting: G(D),
          connectablestart: G(C),
          connectableend: G(N),
          connectionindicator: V.value && (G(C) && !G(y) || G(N) && G(y))
        }
      ]]),
      onMousedown: X,
      onTouchstartPassive: X,
      onClick: Y
    }, [
      De(W.$slots, "default", { id: W.id })
    ], 42, x_));
  }
}), _r = function({
  sourcePosition: e = ee.Bottom,
  targetPosition: t = ee.Top,
  label: n,
  connectable: o = !0,
  isValidTargetPos: i,
  isValidSourcePos: r,
  data: s
}) {
  const l = s.label || n;
  return [
    Ae(Mt, { type: "target", position: t, connectable: o, isValidConnection: i }),
    typeof l != "string" && l ? Ae(l) : Ae("div", { innerHTML: l }),
    Ae(Mt, { type: "source", position: e, connectable: o, isValidConnection: r })
  ];
};
_r.props = ["sourcePosition", "targetPosition", "label", "isValidTargetPos", "isValidSourcePos", "connectable", "data"];
_r.inheritAttrs = !1;
_r.compatConfig = { MODE: 3 };
const $_ = _r, yr = function({
  targetPosition: e = ee.Top,
  label: t,
  connectable: n = !0,
  isValidTargetPos: o,
  data: i
}) {
  const r = i.label || t;
  return [
    Ae(Mt, { type: "target", position: e, connectable: n, isValidConnection: o }),
    typeof r != "string" && r ? Ae(r) : Ae("div", { innerHTML: r })
  ];
};
yr.props = ["targetPosition", "label", "isValidTargetPos", "connectable", "data"];
yr.inheritAttrs = !1;
yr.compatConfig = { MODE: 3 };
const C_ = yr, wr = function({
  sourcePosition: e = ee.Bottom,
  label: t,
  connectable: n = !0,
  isValidSourcePos: o,
  data: i
}) {
  const r = i.label || t;
  return [
    typeof r != "string" && r ? Ae(r) : Ae("div", { innerHTML: r }),
    Ae(Mt, { type: "source", position: e, connectable: n, isValidConnection: o })
  ];
};
wr.props = ["sourcePosition", "label", "isValidSourcePos", "connectable", "data"];
wr.inheritAttrs = !1;
wr.compatConfig = { MODE: 3 };
const S_ = wr, N_ = ["transform"], A_ = ["width", "height", "x", "y", "rx", "ry"], M_ = ["y"], P_ = {
  name: "EdgeText",
  compatConfig: { MODE: 3 }
}, T_ = /* @__PURE__ */ Se({
  ...P_,
  props: {
    x: {},
    y: {},
    label: {},
    labelStyle: { default: () => ({}) },
    labelShowBg: { type: Boolean, default: !0 },
    labelBgStyle: { default: () => ({}) },
    labelBgPadding: { default: () => [2, 4] },
    labelBgBorderRadius: { default: 2 }
  },
  setup(e) {
    const t = be({ x: 0, y: 0, width: 0, height: 0 }), n = be(null), o = he(() => `translate(${e.x - t.value.width / 2} ${e.y - t.value.height / 2})`);
    En(i), we([() => e.x, () => e.y, n, () => e.label], i);
    function i() {
      if (!n.value)
        return;
      const r = n.value.getBBox();
      (r.width !== t.value.width || r.height !== t.value.height) && (t.value = r);
    }
    return (r, s) => (re(), pe("g", {
      transform: o.value,
      class: "vue-flow__edge-textwrapper"
    }, [
      r.labelShowBg ? (re(), pe("rect", {
        key: 0,
        class: "vue-flow__edge-textbg",
        width: `${t.value.width + 2 * r.labelBgPadding[0]}px`,
        height: `${t.value.height + 2 * r.labelBgPadding[1]}px`,
        x: -r.labelBgPadding[0],
        y: -r.labelBgPadding[1],
        style: ze(r.labelBgStyle),
        rx: r.labelBgBorderRadius,
        ry: r.labelBgBorderRadius
      }, null, 12, A_)) : He("", !0),
      Ce("text", rr(r.$attrs, {
        ref_key: "el",
        ref: n,
        class: "vue-flow__edge-text",
        y: t.value.height / 2,
        dy: "0.3em",
        style: r.labelStyle
      }), [
        De(r.$slots, "default", {}, () => [
          typeof r.label != "string" ? (re(), Ve(an(r.label), { key: 0 })) : (re(), pe(Me, { key: 1 }, [
            $c(wi(r.label), 1)
          ], 64))
        ])
      ], 16, M_)
    ], 8, N_));
  }
}), I_ = ["id", "d", "marker-end", "marker-start"], O_ = ["d", "stroke-width"], D_ = {
  name: "BaseEdge",
  inheritAttrs: !1,
  compatConfig: { MODE: 3 }
}, br = /* @__PURE__ */ Se({
  ...D_,
  props: {
    id: {},
    labelX: {},
    labelY: {},
    path: {},
    label: {},
    markerStart: {},
    markerEnd: {},
    interactionWidth: { default: 20 },
    style: {},
    ref: { type: [String, Object, Function] },
    labelStyle: {},
    labelShowBg: { type: Boolean, default: !0 },
    labelBgStyle: {},
    labelBgPadding: {},
    labelBgBorderRadius: {}
  },
  setup(e, { expose: t }) {
    const n = dc(e, ["interactionWidth", "labelShowBg"]), o = be(null), i = be(null), r = be(null), s = Js();
    return t({
      pathEl: o,
      interactionEl: i,
      labelEl: r
    }), (l, a) => (re(), pe(Me, null, [
      Ce("path", {
        id: l.id,
        ref_key: "pathEl",
        ref: o,
        d: l.path,
        style: ze(n.style),
        class: We(["vue-flow__edge-path", G(s).class]),
        "marker-end": l.markerEnd,
        "marker-start": l.markerStart
      }, null, 14, I_),
      l.interactionWidth ? (re(), pe("path", {
        key: 0,
        ref_key: "interactionEl",
        ref: i,
        fill: "none",
        d: l.path,
        "stroke-width": l.interactionWidth,
        "stroke-opacity": 0,
        class: "vue-flow__edge-interaction"
      }, null, 8, O_)) : He("", !0),
      l.label && l.labelX && l.labelY ? (re(), Ve(T_, {
        key: 1,
        ref_key: "labelEl",
        ref: r,
        x: l.labelX,
        y: l.labelY,
        label: l.label,
        "label-show-bg": l.labelShowBg,
        "label-bg-style": l.labelBgStyle,
        "label-bg-padding": l.labelBgPadding,
        "label-bg-border-radius": l.labelBgBorderRadius,
        "label-style": l.labelStyle
      }, null, 8, ["x", "y", "label", "label-show-bg", "label-bg-style", "label-bg-padding", "label-bg-border-radius", "label-style"])) : He("", !0)
    ], 64));
  }
});
function Tf({
  sourceX: e,
  sourceY: t,
  targetX: n,
  targetY: o
}) {
  const i = Math.abs(n - e) / 2, r = n < e ? n + i : n - i, s = Math.abs(o - t) / 2, l = o < t ? o + s : o - s;
  return [r, l, i, s];
}
function If({
  sourceX: e,
  sourceY: t,
  targetX: n,
  targetY: o,
  sourceControlX: i,
  sourceControlY: r,
  targetControlX: s,
  targetControlY: l
}) {
  const a = e * 0.125 + i * 0.375 + s * 0.375 + n * 0.125, u = t * 0.125 + r * 0.375 + l * 0.375 + o * 0.125, c = Math.abs(a - e), f = Math.abs(u - t);
  return [a, u, c, f];
}
function ei(e, t) {
  return e >= 0 ? 0.5 * e : t * 25 * Math.sqrt(-e);
}
function Ja({ pos: e, x1: t, y1: n, x2: o, y2: i, c: r }) {
  let s, l;
  switch (e) {
    case ee.Left:
      s = t - ei(t - o, r), l = n;
      break;
    case ee.Right:
      s = t + ei(o - t, r), l = n;
      break;
    case ee.Top:
      s = t, l = n - ei(n - i, r);
      break;
    case ee.Bottom:
      s = t, l = n + ei(i - n, r);
      break;
  }
  return [s, l];
}
function Of({
  sourceX: e,
  sourceY: t,
  sourcePosition: n = ee.Bottom,
  targetX: o,
  targetY: i,
  targetPosition: r = ee.Top,
  curvature: s = 0.25
}) {
  const [l, a] = Ja({
    pos: n,
    x1: e,
    y1: t,
    x2: o,
    y2: i,
    c: s
  }), [u, c] = Ja({
    pos: r,
    x1: o,
    y1: i,
    x2: e,
    y2: t,
    c: s
  }), [f, d, p, E] = If({
    sourceX: e,
    sourceY: t,
    targetX: o,
    targetY: i,
    sourceControlX: l,
    sourceControlY: a,
    targetControlX: u,
    targetControlY: c
  });
  return [
    `M${e},${t} C${l},${a} ${u},${c} ${o},${i}`,
    f,
    d,
    p,
    E
  ];
}
function Ka({ pos: e, x1: t, y1: n, x2: o, y2: i }) {
  let r, s;
  switch (e) {
    case ee.Left:
    case ee.Right:
      r = 0.5 * (t + o), s = n;
      break;
    case ee.Top:
    case ee.Bottom:
      r = t, s = 0.5 * (n + i);
      break;
  }
  return [r, s];
}
function Df({
  sourceX: e,
  sourceY: t,
  sourcePosition: n = ee.Bottom,
  targetX: o,
  targetY: i,
  targetPosition: r = ee.Top
}) {
  const [s, l] = Ka({
    pos: n,
    x1: e,
    y1: t,
    x2: o,
    y2: i
  }), [a, u] = Ka({
    pos: r,
    x1: o,
    y1: i,
    x2: e,
    y2: t
  }), [c, f, d, p] = If({
    sourceX: e,
    sourceY: t,
    targetX: o,
    targetY: i,
    sourceControlX: s,
    sourceControlY: l,
    targetControlX: a,
    targetControlY: u
  });
  return [
    `M${e},${t} C${s},${l} ${a},${u} ${o},${i}`,
    c,
    f,
    d,
    p
  ];
}
const qa = {
  [ee.Left]: { x: -1, y: 0 },
  [ee.Right]: { x: 1, y: 0 },
  [ee.Top]: { x: 0, y: -1 },
  [ee.Bottom]: { x: 0, y: 1 }
};
function k_({
  source: e,
  sourcePosition: t = ee.Bottom,
  target: n
}) {
  return t === ee.Left || t === ee.Right ? e.x < n.x ? { x: 1, y: 0 } : { x: -1, y: 0 } : e.y < n.y ? { x: 0, y: 1 } : { x: 0, y: -1 };
}
function Za(e, t) {
  return Math.sqrt((t.x - e.x) ** 2 + (t.y - e.y) ** 2);
}
function R_({
  source: e,
  sourcePosition: t = ee.Bottom,
  target: n,
  targetPosition: o = ee.Top,
  center: i,
  offset: r
}) {
  const s = qa[t], l = qa[o], a = { x: e.x + s.x * r, y: e.y + s.y * r }, u = { x: n.x + l.x * r, y: n.y + l.y * r }, c = k_({
    source: a,
    sourcePosition: t,
    target: u
  }), f = c.x !== 0 ? "x" : "y", d = c[f];
  let p, E, m;
  const _ = { x: 0, y: 0 }, b = { x: 0, y: 0 }, [C, N, y, D] = Tf({
    sourceX: e.x,
    sourceY: e.y,
    targetX: n.x,
    targetY: n.y
  });
  if (s[f] * l[f] === -1) {
    E = i.x || C, m = i.y || N;
    const S = [
      { x: E, y: a.y },
      { x: E, y: u.y }
    ], V = [
      { x: a.x, y: m },
      { x: u.x, y: m }
    ];
    s[f] === d ? p = f === "x" ? S : V : p = f === "x" ? V : S;
  } else {
    const S = [{ x: a.x, y: u.y }], V = [{ x: u.x, y: a.y }];
    if (f === "x" ? p = s.x === d ? V : S : p = s.y === d ? S : V, t === o) {
      const K = Math.abs(e[f] - n[f]);
      if (K <= r) {
        const g = Math.min(r - 1, r - K);
        s[f] === d ? _[f] = (a[f] > e[f] ? -1 : 1) * g : b[f] = (u[f] > n[f] ? -1 : 1) * g;
      }
    }
    if (t !== o) {
      const K = f === "x" ? "y" : "x", g = s[f] === l[K], R = a[K] > u[K], w = a[K] < u[K];
      (s[f] === 1 && (!g && R || g && w) || s[f] !== 1 && (!g && w || g && R)) && (p = f === "x" ? S : V);
    }
    const X = { x: a.x + _.x, y: a.y + _.y }, Y = { x: u.x + b.x, y: u.y + b.y }, W = Math.max(Math.abs(X.x - p[0].x), Math.abs(Y.x - p[0].x)), le = Math.max(Math.abs(X.y - p[0].y), Math.abs(Y.y - p[0].y));
    W >= le ? (E = (X.x + Y.x) / 2, m = p[0].y) : (E = p[0].x, m = (X.y + Y.y) / 2);
  }
  return [[
    e,
    { x: a.x + _.x, y: a.y + _.y },
    ...p,
    { x: u.x + b.x, y: u.y + b.y },
    n
  ], E, m, y, D];
}
function z_(e, t, n, o) {
  const i = Math.min(Za(e, t) / 2, Za(t, n) / 2, o), { x: r, y: s } = t;
  if (e.x === r && r === n.x || e.y === s && s === n.y)
    return `L${r} ${s}`;
  if (e.y === s) {
    const u = e.x < n.x ? -1 : 1, c = e.y < n.y ? 1 : -1;
    return `L ${r + i * u},${s}Q ${r},${s} ${r},${s + i * c}`;
  }
  const l = e.x < n.x ? 1 : -1, a = e.y < n.y ? -1 : 1;
  return `L ${r},${s + i * a}Q ${r},${s} ${r + i * l},${s}`;
}
function zi({
  sourceX: e,
  sourceY: t,
  sourcePosition: n = ee.Bottom,
  targetX: o,
  targetY: i,
  targetPosition: r = ee.Top,
  borderRadius: s = 5,
  centerX: l,
  centerY: a,
  offset: u = 20
}) {
  const [c, f, d, p, E] = R_({
    source: { x: e, y: t },
    sourcePosition: n,
    target: { x: o, y: i },
    targetPosition: r,
    center: { x: l, y: a },
    offset: u
  });
  return [c.reduce((_, b, C) => {
    let N;
    return C > 0 && C < c.length - 1 ? N = z_(c[C - 1], b, c[C + 1], s) : N = `${C === 0 ? "M" : "L"}${b.x} ${b.y}`, _ += N, _;
  }, ""), f, d, p, E];
}
function H_({
  sourceX: e,
  sourceY: t,
  targetX: n,
  targetY: o
}) {
  const [i, r, s, l] = Tf({
    sourceX: e,
    sourceY: t,
    targetX: n,
    targetY: o
  });
  return [`M ${e},${t}L ${n},${o}`, i, r, s, l];
}
const F_ = /* @__PURE__ */ Se({
  name: "StraightEdge",
  props: [
    "label",
    "labelStyle",
    "labelShowBg",
    "labelBgStyle",
    "labelBgPadding",
    "labelBgBorderRadius",
    "sourceY",
    "sourceX",
    "targetX",
    "targetY",
    "markerEnd",
    "markerStart",
    "interactionWidth"
  ],
  compatConfig: { MODE: 3 },
  setup(e, { attrs: t }) {
    return () => {
      const [n, o, i] = H_(e);
      return Ae(br, {
        path: n,
        labelX: o,
        labelY: i,
        ...t,
        ...e
      });
    };
  }
}), V_ = F_, B_ = /* @__PURE__ */ Se({
  name: "SmoothStepEdge",
  props: [
    "sourcePosition",
    "targetPosition",
    "label",
    "labelStyle",
    "labelShowBg",
    "labelBgStyle",
    "labelBgPadding",
    "labelBgBorderRadius",
    "sourceY",
    "sourceX",
    "targetX",
    "targetY",
    "borderRadius",
    "markerEnd",
    "markerStart",
    "interactionWidth",
    "offset"
  ],
  compatConfig: { MODE: 3 },
  setup(e, { attrs: t }) {
    return () => {
      const [n, o, i] = zi({
        ...e,
        sourcePosition: e.sourcePosition ?? ee.Bottom,
        targetPosition: e.targetPosition ?? ee.Top
      });
      return Ae(br, {
        path: n,
        labelX: o,
        labelY: i,
        ...t,
        ...e
      });
    };
  }
}), kf = B_, L_ = /* @__PURE__ */ Se({
  name: "StepEdge",
  props: [
    "sourcePosition",
    "targetPosition",
    "label",
    "labelStyle",
    "labelShowBg",
    "labelBgStyle",
    "labelBgPadding",
    "labelBgBorderRadius",
    "sourceY",
    "sourceX",
    "targetX",
    "targetY",
    "markerEnd",
    "markerStart",
    "interactionWidth"
  ],
  setup(e, { attrs: t }) {
    return () => Ae(kf, { ...e, ...t, borderRadius: 0 });
  }
}), U_ = L_, G_ = /* @__PURE__ */ Se({
  name: "BezierEdge",
  props: [
    "sourcePosition",
    "targetPosition",
    "label",
    "labelStyle",
    "labelShowBg",
    "labelBgStyle",
    "labelBgPadding",
    "labelBgBorderRadius",
    "sourceY",
    "sourceX",
    "targetX",
    "targetY",
    "curvature",
    "markerEnd",
    "markerStart",
    "interactionWidth"
  ],
  compatConfig: { MODE: 3 },
  setup(e, { attrs: t }) {
    return () => {
      const [n, o, i] = Of({
        ...e,
        sourcePosition: e.sourcePosition ?? ee.Bottom,
        targetPosition: e.targetPosition ?? ee.Top
      });
      return Ae(br, {
        path: n,
        labelX: o,
        labelY: i,
        ...t,
        ...e
      });
    };
  }
}), Y_ = G_, W_ = /* @__PURE__ */ Se({
  name: "SimpleBezierEdge",
  props: [
    "sourcePosition",
    "targetPosition",
    "label",
    "labelStyle",
    "labelShowBg",
    "labelBgStyle",
    "labelBgPadding",
    "labelBgBorderRadius",
    "sourceY",
    "sourceX",
    "targetX",
    "targetY",
    "markerEnd",
    "markerStart",
    "interactionWidth"
  ],
  compatConfig: { MODE: 3 },
  setup(e, { attrs: t }) {
    return () => {
      const [n, o, i] = Df({
        ...e,
        sourcePosition: e.sourcePosition ?? ee.Bottom,
        targetPosition: e.targetPosition ?? ee.Top
      });
      return Ae(br, {
        path: n,
        labelX: o,
        labelY: i,
        ...t,
        ...e
      });
    };
  }
}), X_ = W_, J_ = {
  input: S_,
  default: $_,
  output: C_
}, K_ = {
  default: Y_,
  straight: V_,
  step: U_,
  smoothstep: kf,
  simplebezier: X_
};
function q_(e, t, n) {
  const o = he(() => (_) => e.nodes && !t.value.length ? e.nodes.find((b) => b.id === _) : e.nodes[t.value.indexOf(_)]), i = he(() => (_) => e.edges && !n.value.length ? e.edges.find((b) => b.id === _) : e.edges[n.value.indexOf(_)]), r = he(() => {
    const _ = {
      ...K_,
      ...e.edgeTypes
    }, b = Object.keys(_);
    for (const C of e.edges)
      C.type && !b.includes(C.type) && (_[C.type] = C.type);
    return _;
  }), s = he(() => {
    const _ = {
      ...J_,
      ...e.nodeTypes
    }, b = Object.keys(_);
    for (const C of e.nodes)
      C.type && !b.includes(C.type) && (_[C.type] = C.type);
    return _;
  }), l = he(() => {
    const _ = e.nodes.filter((b) => !b.hidden);
    return e.onlyRenderVisibleElements ? _ && Cf(
      _,
      {
        x: 0,
        y: 0,
        width: e.dimensions.width,
        height: e.dimensions.height
      },
      e.viewport,
      !0
    ) : _ ?? [];
  }), a = (_, b, C) => {
    if (b = b ?? o.value(_.source), C = C ?? o.value(_.target), !b || !C) {
      e.hooks.error.trigger(new Ye(Ge.EDGE_ORPHANED, _.id));
      return;
    }
    return !_.hidden && !C.hidden && !b.hidden;
  }, u = he(() => e.onlyRenderVisibleElements ? e.edges.filter((_) => {
    const b = o.value(_.source), C = o.value(_.target);
    return a(_, b, C) && u_({
      sourcePos: b.computedPosition || { x: 0, y: 0 },
      targetPos: C.computedPosition || { x: 0, y: 0 },
      sourceWidth: b.dimensions.width,
      sourceHeight: b.dimensions.height,
      targetWidth: C.dimensions.width,
      targetHeight: C.dimensions.height,
      width: e.dimensions.width,
      height: e.dimensions.height,
      viewport: e.viewport
    });
  }) : e.edges.filter((_) => a(_))), c = he(() => [...l.value, ...u.value]), f = he(() => e.nodes.filter((_) => _.selected)), d = he(() => e.edges.filter((_) => _.selected)), p = he(() => [
    ...f.value ?? [],
    ...d.value ?? []
  ]), E = he(
    () => l.value.filter((_) => _.initialized && _.handleBounds !== void 0)
  ), m = he(
    () => l.value.length > 0 && E.value.length === l.value.length
  );
  return {
    getNode: o,
    getEdge: i,
    getElements: c,
    getEdgeTypes: r,
    getNodeTypes: s,
    getEdges: u,
    getNodes: l,
    getSelectedElements: p,
    getSelectedNodes: f,
    getSelectedEdges: d,
    getNodesInitialized: E,
    areNodesInitialized: m
  };
}
class An {
  constructor() {
    this.currentId = 0, this.flows = /* @__PURE__ */ new Map();
  }
  static getInstance() {
    return An.instance || (An.instance = new An()), An.instance;
  }
  set(t, n) {
    return this.flows.set(t, n);
  }
  get(t) {
    return this.flows.get(t);
  }
  remove(t) {
    return this.flows.delete(t);
  }
  create(t, n) {
    const o = Pf(), i = Oo(o), r = {};
    for (const [d, p] of Object.entries(i.hooks)) {
      const E = `on${d.charAt(0).toUpperCase() + d.slice(1)}`;
      r[E] = p.on;
    }
    const s = {};
    for (const [d, p] of Object.entries(i.hooks))
      s[d] = p.trigger;
    const l = he(() => i.nodes.map((d) => d.id)), a = he(() => i.edges.map((d) => d.id)), u = q_(i, l, a), c = b_(t, i, l, a);
    c.setState({ ...i, ...n });
    const f = {
      ...r,
      ...u,
      ...c,
      ...og(i),
      emits: s,
      id: t,
      vueFlowVersion: "1.32.1",
      $destroy: () => {
        this.remove(t);
      }
    };
    return this.set(t, f), f;
  }
  getId() {
    return `vue-flow-${this.currentId++}`;
  }
}
function Ee(e) {
  const t = An.getInstance(), n = ks(), o = e == null ? void 0 : e.id, i = (n == null ? void 0 : n.vueFlowId) || o;
  let r;
  if (n) {
    const s = lt(Pa, null);
    typeof s < "u" && s !== null && (r = s);
  }
  if (r || i && (r = t.get(i)), !r || r && o && o !== r.id) {
    const s = o ?? t.getId(), l = t.create(s, e);
    r = l, Iu().run(() => {
      we(
        l.applyDefault,
        (a, u, c) => {
          const f = (p) => {
            l.applyNodeChanges(p);
          }, d = (p) => {
            l.applyEdgeChanges(p);
          };
          a ? (l.onNodesChange(f), l.onEdgesChange(d)) : (l.hooks.value.nodesChange.off(f), l.hooks.value.edgesChange.off(d)), c(() => {
            l.hooks.value.nodesChange.off(f), l.hooks.value.edgesChange.off(d);
          });
        },
        { immediate: !0 }
      ), lr(() => {
        if (r) {
          const a = t.get(r.id);
          a ? a.$destroy() : vr(`No store instance found for id ${r.id} in storage.`);
        }
      });
    });
  } else
    e && r.setState(e);
  return n && (en(Pa, r), n.vueFlowId = r.id), r;
}
function Z_(e) {
  const t = al(), { emits: n, dimensions: o } = Ee();
  let i;
  En(() => {
    const r = e.value, s = () => {
      if (!r)
        return;
      const l = gr(r);
      (l.width === 0 || l.height === 0) && n.error(new Ye(Ge.MISSING_VIEWPORT_DIMENSIONS)), o.value = { width: l.width || 500, height: l.height || 500 };
    };
    s(), t.addEventListener("resize", s), r && (i = new ResizeObserver(() => s()), i.observe(r)), tr(() => {
      t.removeEventListener("resize", s), i && r && i.unobserve(r);
    });
  });
}
const Q_ = {
  name: "UserSelection",
  compatConfig: { MODE: 3 }
}, j_ = /* @__PURE__ */ Se({
  ...Q_,
  props: {
    userSelectionRect: {}
  },
  setup(e) {
    return (t, n) => (re(), pe("div", {
      class: "vue-flow__selection vue-flow__container",
      style: ze({
        width: `${t.userSelectionRect.width}px`,
        height: `${t.userSelectionRect.height}px`,
        transform: `translate(${t.userSelectionRect.x}px, ${t.userSelectionRect.y}px)`
      })
    }, null, 4));
  }
}), ey = ["tabIndex"], ty = {
  name: "NodesSelection",
  compatConfig: { MODE: 3 }
}, ny = /* @__PURE__ */ Se({
  ...ty,
  setup(e) {
    const t = Ee(), n = ke(t, "emits"), o = ke(t, "viewport"), i = ke(t, "getSelectedNodes"), r = ke(t, "noPanClassName"), s = ke(t, "disableKeyboardA11y"), l = ke(t, "userSelectionActive"), a = mf(), u = be(null), c = df({
      el: u,
      onStart(m) {
        n.value.selectionDragStart(m);
      },
      onDrag(m) {
        n.value.selectionDrag(m);
      },
      onStop(m) {
        n.value.selectionDragStop(m);
      }
    });
    En(() => {
      var m;
      s.value || (m = u.value) == null || m.focus({ preventScroll: !0 });
    });
    const f = he(() => mr(i.value)), d = he(() => ({
      width: `${f.value.width}px`,
      height: `${f.value.height}px`,
      top: `${f.value.y}px`,
      left: `${f.value.x}px`
    }));
    function p(m) {
      n.value.selectionContextMenu({ event: m, nodes: i.value });
    }
    function E(m) {
      s.value || kn[m.key] && a(
        {
          x: kn[m.key].x,
          y: kn[m.key].y
        },
        m.shiftKey
      );
    }
    return (m, _) => !l.value && f.value.width && f.value.height ? (re(), pe("div", {
      key: 0,
      class: We(["vue-flow__nodesselection vue-flow__container", r.value]),
      style: ze({ transform: `translate(${o.value.x}px,${o.value.y}px) scale(${o.value.zoom})` })
    }, [
      Ce("div", {
        ref_key: "el",
        ref: u,
        class: We([{ dragging: G(c) }, "vue-flow__nodesselection-rect"]),
        style: ze(d.value),
        tabIndex: s.value ? void 0 : -1,
        onContextmenu: p,
        onKeydown: E
      }, null, 46, ey)
    ], 6)) : He("", !0);
  }
});
function Qa(e, t) {
  return {
    x: e.clientX - t.left,
    y: e.clientY - t.top
  };
}
const oy = {
  name: "Pane",
  compatConfig: { MODE: 3 }
}, iy = /* @__PURE__ */ Se({
  ...oy,
  props: {
    isSelecting: { type: Boolean }
  },
  setup(e) {
    const {
      vueFlowRef: t,
      getNodes: n,
      getEdges: o,
      viewport: i,
      emits: r,
      userSelectionActive: s,
      removeSelectedElements: l,
      panOnDrag: a,
      userSelectionRect: u,
      elementsSelectable: c,
      nodesSelectionActive: f,
      addSelectedElements: d,
      getSelectedEdges: p,
      getSelectedNodes: E,
      removeNodes: m,
      removeEdges: _,
      selectionMode: b,
      deleteKeyCode: C,
      multiSelectionKeyCode: N,
      multiSelectionActive: y
    } = Ee(), D = be(null), O = be(0), S = be(0), V = be(), X = Xe(() => c.value && (e.isSelecting || s.value));
    vo(C, (T) => {
      if (!T)
        return;
      const M = n.value.reduce((U, q) => ((!q.selected && q.parentNode && U.find((Z) => Z.id === q.parentNode) || q.selected) && U.push(q), U), []);
      (M || p.value) && (p.value.length > 0 && _(p.value), M.length > 0 && m(M), f.value = !1, l());
    }), vo(N, (T) => {
      y.value = T;
    });
    function Y() {
      s.value = !1, u.value = null, O.value = 0, S.value = 0;
    }
    function W(T) {
      T.target !== D.value || X.value || (r.paneClick(T), l(), f.value = !1);
    }
    function le(T) {
      var M;
      if (T.target === D.value) {
        if (Array.isArray(a.value) && ((M = a.value) != null && M.includes(2))) {
          T.preventDefault();
          return;
        }
        r.paneContextMenu(T);
      }
    }
    function K(T) {
      T.target === D.value && r.paneScroll(T);
    }
    function g(T) {
      if (V.value = t.value.getBoundingClientRect(), !X.value || !c || !e.isSelecting || T.button !== 0 || T.target !== D.value || !V.value)
        return;
      const { x: M, y: U } = Qa(T, V.value);
      l(), u.value = {
        width: 0,
        height: 0,
        startX: M,
        startY: U,
        x: M,
        y: U
      }, s.value = !0, r.selectionStart(T);
    }
    function R(T) {
      if (!X.value)
        return r.paneMouseMove(T);
      if (!e.isSelecting || !V.value || !u.value)
        return;
      s.value || (s.value = !0), f.value && (f.value = !1);
      const M = Qa(T, V.value), U = u.value.startX ?? 0, q = u.value.startY ?? 0, Z = {
        ...u.value,
        x: M.x < U ? M.x : U,
        y: M.y < q ? M.y : q,
        width: Math.abs(M.x - U),
        height: Math.abs(M.y - q)
      }, J = Cf(
        n.value,
        u.value,
        i.value,
        b.value === ll.Partial
      ), se = Zt(J, o.value);
      O.value = J.length, S.value = se.length, u.value = Z, d([...J, ...se]);
    }
    function w(T) {
      X.value && T.button === 0 && (!s.value && u.value && T.target === D.value && W(T), f.value = O.value > 0, Y(), r.selectionEnd(T));
    }
    function P(T) {
      var M;
      if (!X.value)
        return r.paneMouseLeave(T);
      s.value && (f.value = O.value > 0, (M = r.selectionEnd) == null || M.call(r, T)), Y();
    }
    function I(T) {
      X.value || r.paneMouseEnter(T);
    }
    return (T, M) => (re(), pe("div", {
      ref_key: "container",
      ref: D,
      class: We(["vue-flow__pane vue-flow__container", { selection: T.isSelecting }]),
      onClick: W,
      onContextmenu: le,
      onWheelPassive: K,
      onMouseenter: I,
      onMousedown: g,
      onMousemove: R,
      onMouseup: w,
      onMouseleave: P
    }, [
      De(T.$slots, "default"),
      G(s) && G(u) ? (re(), Ve(j_, {
        key: 0,
        "user-selection-rect": G(u)
      }, null, 8, ["user-selection-rect"])) : He("", !0),
      G(f) && G(E).length ? (re(), Ve(ny, { key: 1 })) : He("", !0)
    ], 34));
  }
}), ry = {
  name: "Transform",
  compatConfig: { MODE: 3 }
}, sy = /* @__PURE__ */ Se({
  ...ry,
  setup(e) {
    const { viewport: t } = Ee();
    return (n, o) => (re(), pe("div", {
      class: "vue-flow__transformationpane vue-flow__container",
      style: ze({ transform: `translate(${G(t).x}px,${G(t).y}px) scale(${G(t).zoom})` })
    }, [
      De(n.$slots, "default")
    ], 4));
  }
}), ly = {
  name: "Viewport",
  compatConfig: { MODE: 3 }
}, ay = /* @__PURE__ */ Se({
  ...ly,
  setup(e) {
    const {
      minZoom: t,
      maxZoom: n,
      defaultViewport: o,
      translateExtent: i,
      zoomActivationKeyCode: r,
      selectionKeyCode: s,
      panActivationKeyCode: l,
      panOnScroll: a,
      panOnScrollMode: u,
      panOnScrollSpeed: c,
      panOnDrag: f,
      zoomOnDoubleClick: d,
      zoomOnPinch: p,
      zoomOnScroll: E,
      preventScrolling: m,
      noWheelClassName: _,
      noPanClassName: b,
      emits: C,
      connectionStartHandle: N,
      userSelectionActive: y,
      paneDragging: D,
      d3Zoom: O,
      d3Selection: S,
      d3ZoomHandler: V,
      viewport: X,
      viewportRef: Y
    } = Ee();
    Z_(Y);
    const W = be(!1), le = be(!1);
    let K = null, g = !1, R = 0, w = {
      x: 0,
      y: 0,
      zoom: 0
    };
    const P = vo(l), I = vo(s), T = vo(r), M = Xe(() => P.value || f.value), U = Xe(() => P.value || a.value), q = Xe(() => I.value || s.value === !0 && M.value !== !0);
    En(() => {
      if (!Y.value) {
        vr("Viewport element is missing");
        return;
      }
      const j = Y.value, ne = j.getBoundingClientRect(), ue = H0().scaleExtent([t.value, n.value]).translateExtent(i.value), ce = pt(j).call(ue), fe = ce.on("wheel.zoom"), x = Un.translate(o.value.x ?? 0, o.value.y ?? 0).scale(Vt(o.value.zoom ?? 1, t.value, n.value)), h = [
        [0, 0],
        [ne.width, ne.height]
      ], v = ue.constrain()(x, h, i.value);
      ue.transform(ce, v), ue.wheelDelta(J), O.value = ue, S.value = ce, V.value = fe, X.value = { x: v.x, y: v.y, zoom: v.k }, ue.on("start", ($) => {
        var A;
        if (!$.sourceEvent)
          return null;
        R = $.sourceEvent.button, W.value = !0;
        const k = L($.transform);
        ((A = $.sourceEvent) == null ? void 0 : A.type) === "mousedown" && (D.value = !0), w = k, C.viewportChangeStart(k), C.moveStart({ event: $, flowTransform: k });
      }), ue.on("end", ($) => {
        if (!$.sourceEvent)
          return null;
        if (W.value = !1, D.value = !1, Z(M.value, R ?? 0) && !g && C.paneContextMenu($.sourceEvent), g = !1, se(w, $.transform)) {
          const A = L($.transform);
          w = A, C.viewportChangeEnd(A), C.moveEnd({ event: $, flowTransform: A });
        }
      }), ue.filter(($) => {
        var A, k;
        const H = T.value || E.value, z = p.value && $.ctrlKey;
        if ((M.value === !0 || Array.isArray(M.value) && M.value.includes(1)) && $.button === 1 && $.type === "mousedown" && ((A = $.target) != null && A.closest(".vue-flow__node") || (k = $.target) != null && k.closest(".vue-flow__edge")))
          return !0;
        if (!M.value && !H && !U.value && !d.value && !p.value || y.value || !d.value && $.type === "dblclick" || ae($, _.value) && $.type === "wheel" || ae($, b.value) && ($.type !== "wheel" || U.value && $.type === "wheel" && !T.value) || !p.value && $.ctrlKey && $.type === "wheel" || !H && !U.value && !z && $.type === "wheel" || !M.value && ($.type === "mousedown" || $.type === "touchstart") || Array.isArray(M.value) && !M.value.includes($.button) && ($.type === "mousedown" || $.type === "touchstart"))
          return !1;
        const B = Array.isArray(M.value) && M.value.includes($.button) || !$.button || $.button <= 1;
        return (!$.ctrlKey || $.type === "wheel") && B;
      }), we(
        [y, M],
        () => {
          y.value && !W.value ? ue.on("zoom", null) : y.value || ue.on("zoom", ($) => {
            X.value = { x: $.transform.x, y: $.transform.y, zoom: $.transform.k };
            const A = L($.transform);
            g = Z(M.value, R ?? 0), C.viewportChange(A), C.move({ event: $, flowTransform: A });
          });
        },
        { immediate: !0 }
      ), we(
        [y, U, u, T, p, m, _],
        () => {
          U.value && !T.value && !y.value ? ce.on(
            "wheel.zoom",
            ($) => {
              if (ae($, _.value))
                return !1;
              $.preventDefault(), $.stopImmediatePropagation();
              const A = ce.property("__zoom").k || 1, k = Ri();
              if ($.ctrlKey && p.value && k) {
                const Q = Et($), oe = J($), ie = A * 2 ** oe;
                ue.scaleTo(ce, ie, Q, $);
                return;
              }
              const H = $.deltaMode === 1 ? 20 : 1;
              let z = u.value === mo.Vertical ? 0 : $.deltaX * H, B = u.value === mo.Horizontal ? 0 : $.deltaY * H;
              !k && $.shiftKey && u.value !== mo.Vertical && !z && B && (z = B, B = 0), ue.translateBy(
                ce,
                -(z / A) * c.value,
                -(B / A) * c.value
              );
              const F = L(ce.property("__zoom"));
              K && clearTimeout(K), le.value ? (C.move({ event: $, flowTransform: F }), C.viewportChange(F), K = setTimeout(() => {
                C.moveEnd({ event: $, flowTransform: F }), C.viewportChangeEnd(F), le.value = !1;
              }, 150)) : (le.value = !0, C.moveStart({ event: $, flowTransform: F }), C.viewportChangeStart(F));
            },
            { passive: !1 }
          ) : typeof fe < "u" && ce.on(
            "wheel.zoom",
            function($, A) {
              if (!m.value || ae($, _.value))
                return null;
              $.preventDefault(), fe.call(this, $, A);
            },
            { passive: !1 }
          );
        },
        { immediate: !0 }
      );
    });
    function Z(j, ne) {
      return ne === 2 && Array.isArray(j) && j.includes(2);
    }
    function J(j) {
      const ne = j.ctrlKey && Ri() ? 10 : 1;
      return -j.deltaY * (j.deltaMode === 1 ? 0.05 : j.deltaMode ? 1 : 2e-3) * ne;
    }
    function se(j, ne) {
      return j.x !== ne.x && !Number.isNaN(ne.x) || j.y !== ne.y && !Number.isNaN(ne.y) || j.zoom !== ne.k && !Number.isNaN(ne.k);
    }
    function L(j) {
      return {
        x: j.x,
        y: j.y,
        zoom: j.k
      };
    }
    function ae(j, ne) {
      return j.target.closest(`.${ne}`);
    }
    return (j, ne) => (re(), pe("div", {
      ref_key: "viewportRef",
      ref: Y,
      class: "vue-flow__viewport vue-flow__container"
    }, [
      me(iy, {
        "is-selecting": G(q),
        class: We({ connecting: !!G(N), dragging: G(D), draggable: G(M) })
      }, {
        default: Qe(() => [
          me(sy, null, {
            default: Qe(() => [
              De(j.$slots, "default")
            ]),
            _: 3
          })
        ]),
        _: 3
      }, 8, ["is-selecting", "class"])
    ], 512));
  }
}), uy = ["id"], cy = ["id"], fy = ["id"], dy = {
  name: "A11yDescriptions",
  compatConfig: { MODE: 3 }
}, hy = /* @__PURE__ */ Se({
  ...dy,
  setup(e) {
    const { id: t, disableKeyboardA11y: n, ariaLiveMessage: o } = Ee();
    return (i, r) => (re(), pe(Me, null, [
      Ce("div", {
        id: `${G(uf)}-${G(t)}`,
        style: { display: "none" }
      }, " Press enter or space to select a node. " + wi(G(n) ? "" : "You can then use the arrow keys to move the node around.") + " You can then use the arrow keys to move the node around, press delete to remove it and press escape to cancel. ", 9, uy),
      Ce("div", {
        id: `${G(cf)}-${G(t)}`,
        style: { display: "none" }
      }, " Press enter or space to select an edge. You can then press delete to remove it or press escape to cancel. ", 8, cy),
      G(n) ? He("", !0) : (re(), pe("div", {
        key: 0,
        id: `${G(L0)}-${G(t)}`,
        "aria-live": "assertive",
        "aria-atomic": "true",
        style: { position: "absolute", width: "1px", height: "1px", margin: "-1px", border: "0", padding: "0", overflow: "hidden", clip: "rect(0px, 0px, 0px, 0px)", "clip-path": "inset(100%)" }
      }, wi(G(o)), 9, fy))
    ], 64));
  }
});
function py() {
  const e = Ee();
  we(
    () => e.viewportHelper.value.viewportInitialized,
    (t) => {
      t && setTimeout(() => {
        e.emits.init(e), e.emits.paneReady(e);
      }, 1);
    }
  );
}
function gy(e, t, n) {
  return n === ee.Left ? e - t : n === ee.Right ? e + t : e;
}
function my(e, t, n) {
  return n === ee.Top ? e - t : n === ee.Bottom ? e + t : e;
}
const hl = function({
  radius: e = 10,
  centerX: t = 0,
  centerY: n = 0,
  position: o = ee.Top,
  type: i
}) {
  return Ae("circle", {
    class: `vue-flow__edgeupdater vue-flow__edgeupdater-${i}`,
    cx: gy(t, e, o),
    cy: my(n, e, o),
    r: e,
    stroke: "transparent",
    fill: "transparent"
  });
};
hl.props = ["radius", "centerX", "centerY", "position", "type"];
hl.compatConfig = { MODE: 3 };
const ja = hl, vy = /* @__PURE__ */ Se({
  name: "Edge",
  compatConfig: { MODE: 3 },
  props: ["name", "type", "id", "updatable", "selectable", "focusable", "edge"],
  setup(e) {
    const {
      id: t,
      addSelectedEdges: n,
      connectionMode: o,
      edgeUpdaterRadius: i,
      emits: r,
      nodesSelectionActive: s,
      noPanClassName: l,
      getEdgeTypes: a,
      removeSelectedEdges: u,
      findEdge: c,
      findNode: f,
      isValidConnection: d,
      multiSelectionActive: p
    } = Ee(), E = W0(e.edge, r), m = go(e, "edge"), _ = be(!1), b = be(!1), C = be(""), N = be(null), y = be("source"), D = be(null);
    en(U0, e.id), en(G0, D);
    const O = he(() => m.value.class instanceof Function ? m.value.class(m.value) : m.value.class), S = he(() => m.value.style instanceof Function ? m.value.style(m.value) : m.value.style), { handlePointerDown: V } = gf({
      nodeId: C,
      handleId: N,
      type: y,
      isValidConnection: d,
      edgeUpdaterType: y,
      onEdgeUpdate: W,
      onEdgeUpdateEnd: le
    });
    return () => {
      const Z = f(m.value.source), J = f(m.value.target);
      if (!Z && !J)
        return r.error(new Ye(Ge.EDGE_SOURCE_TARGET_MISSING, m.value.id, m.value.source, m.value.target)), null;
      if (!Z)
        return r.error(new Ye(Ge.EDGE_SOURCE_MISSING, m.value.id, m.value.source)), null;
      if (!J)
        return r.error(new Ye(Ge.EDGE_TARGET_MISSING, m.value.id, m.value.target)), null;
      if (!m || Z.hidden || J.hidden)
        return null;
      let se;
      o.value === wn.Strict ? se = Z.handleBounds.source : se = [...Z.handleBounds.source || [], ...Z.handleBounds.target || []];
      const L = Va(se, m.value.sourceHandle);
      let ae;
      o.value === wn.Strict ? ae = J.handleBounds.target : ae = [...J.handleBounds.target || [], ...J.handleBounds.source || []];
      const j = Va(ae, m.value.targetHandle), ne = L ? L.position : ee.Bottom, ue = j ? j.position : ee.Top, { sourceX: ce, sourceY: fe, targetY: x, targetX: h } = a_(
        Z,
        L,
        ne,
        J,
        j,
        ue
      );
      return m.value.sourceX = ce, m.value.sourceY = fe, m.value.targetX = h, m.value.targetY = x, Ae(
        "g",
        {
          ref: D,
          key: e.id,
          "data-id": e.id,
          class: [
            "vue-flow__edge",
            `vue-flow__edge-${e.type === !1 ? "default" : e.name}`,
            l.value,
            O.value,
            {
              updating: _.value,
              selected: m.value.selected,
              animated: m.value.animated,
              inactive: !e.selectable
            }
          ],
          onClick: g,
          onContextmenu: R,
          onDblclick: w,
          onMouseenter: P,
          onMousemove: I,
          onMouseleave: T,
          onKeyDown: e.focusable ? q : void 0,
          tabIndex: e.focusable ? 0 : void 0,
          "aria-label": m.value.ariaLabel === null ? void 0 : m.value.ariaLabel || `Edge from ${m.value.source} to ${m.value.target}`,
          "aria-describedby": e.focusable ? `${cf}-${t}` : void 0,
          role: e.focusable ? "button" : "img"
        },
        [
          b.value ? null : Ae(e.type === !1 ? a.value.default : e.type, {
            id: e.id,
            sourceNode: Z,
            targetNode: J,
            source: m.value.source,
            target: m.value.target,
            type: m.value.type,
            updatable: e.updatable,
            selected: m.value.selected,
            animated: m.value.animated,
            label: m.value.label,
            labelStyle: m.value.labelStyle,
            labelShowBg: m.value.labelShowBg,
            labelBgStyle: m.value.labelBgStyle,
            labelBgPadding: m.value.labelBgPadding,
            labelBgBorderRadius: m.value.labelBgBorderRadius,
            data: m.value.data,
            events: { ...m.value.events, ...E.on },
            style: S.value,
            markerStart: `url('#${fn(m.value.markerStart, t)}')`,
            markerEnd: `url('#${fn(m.value.markerEnd, t)}')`,
            sourcePosition: ne,
            targetPosition: ue,
            sourceX: ce,
            sourceY: fe,
            targetX: h,
            targetY: x,
            sourceHandleId: m.value.sourceHandle,
            targetHandleId: m.value.targetHandle,
            interactionWidth: m.value.interactionWidth
          }),
          [
            e.updatable === "source" || e.updatable === !0 ? [
              Ae(
                "g",
                {
                  onMousedown: M,
                  onMouseenter: X,
                  onMouseout: Y
                },
                Ae(ja, {
                  position: ne,
                  centerX: ce,
                  centerY: fe,
                  radius: i.value,
                  type: "source",
                  "data-type": "source"
                })
              )
            ] : null,
            e.updatable === "target" || e.updatable === !0 ? [
              Ae(
                "g",
                {
                  onMousedown: U,
                  onMouseenter: X,
                  onMouseout: Y
                },
                Ae(ja, {
                  position: ue,
                  centerX: h,
                  centerY: x,
                  radius: i.value,
                  type: "target",
                  "data-type": "target"
                })
              )
            ] : null
          ]
        ]
      );
    };
    function X() {
      _.value = !0;
    }
    function Y() {
      _.value = !1;
    }
    function W(Z, J) {
      E.emit.update({ event: Z, edge: m.value, connection: J });
    }
    function le(Z) {
      E.emit.updateEnd({ event: Z, edge: m.value }), b.value = !1;
    }
    function K(Z, J) {
      Z.button === 0 && (b.value = !0, C.value = J ? m.value.target : m.value.source, N.value = (J ? m.value.targetHandle : m.value.sourceHandle) ?? "", y.value = J ? "target" : "source", E.emit.updateStart({ event: Z, edge: m.value }), V(Z));
    }
    function g(Z) {
      var J;
      const se = { event: Z, edge: m.value };
      e.selectable && (s.value = !1, m.value.selected && p.value ? (u([m.value]), (J = D.value) == null || J.blur()) : n([m.value])), E.emit.click(se);
    }
    function R(Z) {
      E.emit.contextMenu({ event: Z, edge: m.value });
    }
    function w(Z) {
      E.emit.doubleClick({ event: Z, edge: m.value });
    }
    function P(Z) {
      E.emit.mouseEnter({ event: Z, edge: m.value });
    }
    function I(Z) {
      E.emit.mouseMove({ event: Z, edge: m.value });
    }
    function T(Z) {
      E.emit.mouseLeave({ event: Z, edge: m.value });
    }
    function M(Z) {
      K(Z, !0);
    }
    function U(Z) {
      K(Z, !1);
    }
    function q(Z) {
      var J;
      ff.includes(Z.key) && e.selectable && (Z.key === "Escape" ? ((J = D.value) == null || J.blur(), u([c(e.id)])) : n([c(e.id)]));
    }
  }
}), _y = vy, yy = {
  [ee.Left]: ee.Right,
  [ee.Right]: ee.Left,
  [ee.Top]: ee.Bottom,
  [ee.Bottom]: ee.Top
}, wy = /* @__PURE__ */ Se({
  name: "ConnectionLine",
  compatConfig: { MODE: 3 },
  setup() {
    var e;
    const {
      id: t,
      connectionMode: n,
      connectionStartHandle: o,
      connectionEndHandle: i,
      connectionPosition: r,
      connectionLineType: s,
      connectionLineStyle: l,
      connectionLineOptions: a,
      connectionStatus: u,
      viewport: c,
      findNode: f
    } = Ee(), d = (e = lt(hr)) == null ? void 0 : e["connection-line"];
    return () => {
      var p, E, m, _, b;
      if (!o.value)
        return null;
      const C = f(o.value.nodeId);
      if (!C)
        return null;
      const N = o.value.handleId, y = o.value.type, D = ((p = i.value) == null ? void 0 : p.handleId) && f(i.value.nodeId) || null, O = (r.value.x - c.value.x) / c.value.zoom, S = (r.value.y - c.value.y) / c.value.zoom, V = C.handleBounds;
      let X = V == null ? void 0 : V[y];
      if (n.value === wn.Loose && (X = X || (V == null ? void 0 : V[y === "source" ? "target" : "source"])), !X)
        return null;
      const Y = (N ? X.find((T) => T.id === N) : X[0]) ?? null, W = (Y == null ? void 0 : Y.position) || ee.Top, { x: le, y: K } = _s(
        W,
        { ...C.dimensions, ...C.computedPosition },
        Y
      ), g = D && ((E = i.value) == null ? void 0 : E.handleId) && ((n.value === wn.Strict ? (m = D.handleBounds[y === "source" ? "target" : "source"]) == null ? void 0 : m.find(
        (T) => {
          var M;
          return T.id === ((M = i.value) == null ? void 0 : M.handleId);
        }
      ) : (_ = [...D.handleBounds.source || [], ...D.handleBounds.target || []]) == null ? void 0 : _.find(
        (T) => {
          var M;
          return T.id === ((M = i.value) == null ? void 0 : M.handleId);
        }
      )) || ((b = D.handleBounds[y ?? "target"]) == null ? void 0 : b[0])) || null, R = W ? yy[W] : null;
      if (!W || !R)
        return null;
      const w = s.value ?? a.value.type ?? un.Bezier;
      let P = "";
      const I = {
        sourceX: le,
        sourceY: K,
        sourcePosition: W,
        targetX: O,
        targetY: S,
        targetPosition: R
      };
      return w === un.Bezier ? [P] = Of(I) : w === un.Step ? [P] = zi({
        ...I,
        borderRadius: 0
      }) : w === un.SmoothStep ? [P] = zi(I) : w === un.SimpleBezier ? [P] = Df(I) : P = `M${le},${K} ${O},${S}`, Ae(
        "svg",
        { class: "vue-flow__edges vue-flow__connectionline vue-flow__container" },
        Ae(
          "g",
          { class: "vue-flow__connection" },
          d ? Ae(d, {
            sourceX: le,
            sourceY: K,
            sourcePosition: W,
            targetX: O,
            targetY: S,
            targetPosition: R,
            sourceNode: C,
            sourceHandle: Y,
            targetNode: D,
            targetHandle: g,
            markerEnd: `url(#${fn(a.value.markerEnd, t)})`,
            markerStart: `url(#${fn(a.value.markerStart, t)})`,
            connectionStatus: u.value
          }) : Ae("path", {
            d: P,
            class: [a.value.class, u, "vue-flow__connection-path"],
            style: {
              ...l.value,
              ...a.value.style
            },
            "marker-end": `url(#${fn(a.value.markerEnd, t)})`,
            "marker-start": `url(#${fn(a.value.markerStart, t)})`
          })
        )
      );
    };
  }
}), by = wy, xy = ["id", "markerWidth", "markerHeight", "markerUnits", "orient"], Ey = {
  name: "MarkerType",
  compatConfig: { MODE: 3 }
}, $y = /* @__PURE__ */ Se({
  ...Ey,
  props: {
    id: {},
    type: {},
    color: { default: "none" },
    width: { default: 12.5 },
    height: { default: 12.5 },
    markerUnits: { default: "strokeWidth" },
    orient: { default: "auto-start-reverse" },
    strokeWidth: { default: 1 }
  },
  setup(e) {
    return (t, n) => (re(), pe("marker", {
      id: t.id,
      class: "vue-flow__arrowhead",
      viewBox: "-10 -10 20 20",
      refX: "0",
      refY: "0",
      markerWidth: `${t.width}`,
      markerHeight: `${t.height}`,
      markerUnits: t.markerUnits,
      orient: t.orient
    }, [
      t.type === G(ps).ArrowClosed ? (re(), pe("polyline", {
        key: 0,
        style: ze({
          stroke: t.color,
          fill: t.color,
          strokeWidth: t.strokeWidth
        }),
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        points: "-5,-4 0,0 -5,4 -5,-4"
      }, null, 4)) : He("", !0),
      t.type === G(ps).Arrow ? (re(), pe("polyline", {
        key: 1,
        style: ze({
          stroke: t.color,
          strokeWidth: t.strokeWidth
        }),
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        fill: "none",
        points: "-5,-4 0,0 -5,4"
      }, null, 4)) : He("", !0)
    ], 8, xy));
  }
}), Cy = {
  name: "MarkerDefinitions",
  compatConfig: { MODE: 3 }
}, Sy = /* @__PURE__ */ Se({
  ...Cy,
  setup(e) {
    const t = Ee(), n = ke(t, "id"), o = ke(t, "edges"), i = ke(t, "connectionLineOptions"), r = ke(t, "defaultMarkerColor"), s = he(() => {
      const l = [], a = [], u = (c) => {
        if (c) {
          const f = fn(c, n.value);
          l.includes(f) || (typeof c == "object" ? a.push({ ...c, id: f, color: c.color || r.value }) : a.push({ id: f, color: r.value, type: c }), l.push(f));
        }
      };
      for (const c of [i.value.markerEnd, i.value.markerStart])
        u(c);
      return o.value.reduce((c, f) => {
        for (const d of [f.markerStart, f.markerEnd])
          u(d);
        return c.sort((d, p) => d.id.localeCompare(p.id));
      }, a), a;
    });
    return (l, a) => (re(), pe("defs", null, [
      (re(!0), pe(Me, null, Fn(s.value, (u) => (re(), Ve($y, {
        id: u.id,
        key: u.id,
        type: u.type,
        color: u.color,
        width: u.width,
        height: u.height,
        markerUnits: u.markerUnits,
        "stroke-width": u.strokeWidth,
        orient: u.orient
      }, null, 8, ["id", "type", "color", "width", "height", "markerUnits", "stroke-width", "orient"]))), 128))
    ]));
  }
}), Ny = { class: "vue-flow__edges vue-flow__container" }, Ay = {
  name: "Edges",
  compatConfig: { MODE: 3 }
}, My = /* @__PURE__ */ Se({
  ...Ay,
  setup(e) {
    const t = lt(hr), {
      edgesUpdatable: n,
      edgesFocusable: o,
      elementsSelectable: i,
      findNode: r,
      getEdges: s,
      getEdgeTypes: l,
      elevateEdgesOnSelect: a,
      dimensions: u,
      emits: c
    } = Ee(), f = Do();
    function d(_) {
      return typeof _ > "u" ? i.value : _;
    }
    function p(_) {
      return typeof _ > "u" ? n.value : _;
    }
    function E(_) {
      return typeof _ > "u" ? o.value : _;
    }
    function m(_, b) {
      const C = _ || "default", N = t == null ? void 0 : t[`edge-${C}`];
      if (N)
        return N;
      let y = b ?? l.value[C];
      if (typeof y == "string" && f) {
        const D = Object.keys(f.appContext.components);
        D && D.includes(C) && (y = tc(C, !1));
      }
      return y && typeof y != "string" ? y : (c.error(new Ye(Ge.EDGE_TYPE_MISSING, y)), !1);
    }
    return (_, b) => G(u).width && G(u).height ? (re(), pe(Me, { key: 0 }, [
      (re(), pe("svg", Ny, [
        me(Sy)
      ])),
      (re(!0), pe(Me, null, Fn(G(s), (C) => (re(), pe("svg", {
        key: C.id,
        class: "vue-flow__edges vue-flow__container",
        style: ze({ zIndex: G(c_)(C, G(r), G(a)) })
      }, [
        me(G(_y), {
          id: C.id,
          edge: C,
          type: m(C.type, C.template),
          name: C.type || "default",
          selectable: d(C.selectable),
          updatable: p(C.updatable),
          focusable: E(C.focusable)
        }, null, 8, ["id", "edge", "type", "name", "selectable", "updatable", "focusable"])
      ], 4))), 128)),
      me(G(by))
    ], 64)) : He("", !0);
  }
}), Py = /* @__PURE__ */ Se({
  name: "Node",
  compatConfig: { MODE: 3 },
  props: ["name", "type", "id", "draggable", "selectable", "focusable", "connectable", "node", "resizeObserver"],
  setup(e) {
    en(dr, e.id);
    const {
      id: t,
      noPanClassName: n,
      selectNodesOnDrag: o,
      nodesSelectionActive: i,
      multiSelectionActive: r,
      emits: s,
      findNode: l,
      removeSelectedNodes: a,
      addSelectedNodes: u,
      updateNodeDimensions: c,
      onUpdateNodeInternals: f,
      getIntersectingNodes: d,
      getNodeTypes: p,
      nodeExtent: E,
      elevateNodesOnSelect: m,
      disableKeyboardA11y: _,
      ariaLiveMessage: b,
      snapToGrid: C,
      snapGrid: N,
      nodeDragThreshold: y,
      getConnectedEdges: D
    } = Ee(), O = mf(), S = go(e, "node"), V = he(() => {
      var L;
      return l((L = S.value) == null ? void 0 : L.parentNode);
    }), X = he(() => D(S.value ? [S.value] : [])), Y = be(null);
    en(hf, Y);
    const { emit: W, on: le } = J0(S.value, s), K = df({
      id: e.id,
      el: Y,
      disabled: () => !e.draggable,
      selectable: () => e.selectable,
      dragHandle: () => S.value.dragHandle,
      onStart(L) {
        W.dragStart({ ...L, intersections: d(S.value) });
      },
      onDrag(L) {
        W.drag({ ...L, intersections: d(S.value) });
      },
      onStop(L) {
        W.dragStop({ ...L, intersections: d(S.value) });
      }
    }), g = he(() => S.value.class instanceof Function ? S.value.class(S.value) : S.value.class), R = he(() => {
      const L = (S.value.style instanceof Function ? S.value.style(S.value) : S.value.style) || {}, ae = S.value.width instanceof Function ? S.value.width(S.value) : S.value.width, j = S.value.height instanceof Function ? S.value.height(S.value) : S.value.height;
      return ae && (L.width = typeof ae == "string" ? ae : `${ae}px`), j && (L.height = typeof j == "string" ? j : `${j}px`), L;
    }), w = Xe(() => Number(S.value.zIndex ?? R.value.zIndex ?? 0));
    return f((L) => {
      L.includes(e.id) && I();
    }), En(() => {
      e.resizeObserver.observe(Y.value);
    }), tr(() => {
      e.resizeObserver.unobserve(Y.value);
    }), we([() => S.value.type, () => S.value.sourcePosition, () => S.value.targetPosition], () => {
      nt(() => {
        c([{ id: e.id, nodeElement: Y.value, forceUpdate: !0 }]);
      });
    }), we(
      [
        () => S.value.position.x,
        () => S.value.position.y,
        () => {
          var L;
          return (L = V.value) == null ? void 0 : L.computedPosition.x;
        },
        () => {
          var L;
          return (L = V.value) == null ? void 0 : L.computedPosition.y;
        },
        () => {
          var L;
          return (L = V.value) == null ? void 0 : L.computedPosition.z;
        },
        w,
        () => S.value.selected,
        () => S.value.dimensions.height,
        () => S.value.dimensions.width,
        () => {
          var L;
          return (L = V.value) == null ? void 0 : L.dimensions.height;
        },
        () => {
          var L;
          return (L = V.value) == null ? void 0 : L.dimensions.width;
        }
      ],
      ([L, ae, j, ne, ue, ce]) => {
        const fe = {
          x: L,
          y: ae,
          z: ce + (m.value && S.value.selected ? 1e3 : 0)
        };
        typeof j < "u" && typeof ne < "u" ? S.value.computedPosition = o_({ x: j, y: ne, z: ue }, fe) : S.value.computedPosition = fe;
      },
      { flush: "post", immediate: !0 }
    ), we([() => S.value.extent, E], ([L, ae], [j, ne]) => {
      (L !== j || ae !== ne) && P();
    }), S.value.extent === "parent" || typeof S.value.extent == "object" && "range" in S.value.extent && S.value.extent.range === "parent" ? Ai(() => S.value.initialized).toBe(!0).then(P) : P(), () => Ae(
      "div",
      {
        ref: Y,
        "data-id": S.value.id,
        class: [
          "vue-flow__node",
          `vue-flow__node-${e.type === !1 ? "default" : e.name}`,
          {
            [n.value]: e.draggable,
            dragging: K == null ? void 0 : K.value,
            selected: S.value.selected,
            selectable: e.selectable,
            parent: S.value.isParent
          },
          g.value
        ],
        style: {
          visibility: S.value.initialized ? "visible" : "hidden",
          zIndex: S.value.computedPosition.z ?? w.value,
          transform: `translate(${S.value.computedPosition.x}px,${S.value.computedPosition.y}px)`,
          pointerEvents: e.selectable || e.draggable ? "all" : "none",
          ...R.value
        },
        tabIndex: e.focusable ? 0 : void 0,
        role: e.focusable ? "button" : void 0,
        "aria-describedby": _.value ? void 0 : `${uf}-${t}`,
        "aria-label": S.value.ariaLabel,
        onMouseenter: T,
        onMousemove: M,
        onMouseleave: U,
        onContextmenu: q,
        onClick: J,
        onDblclick: Z,
        onKeydown: se
      },
      [
        Ae(e.type === !1 ? p.value.default : e.type, {
          id: S.value.id,
          type: S.value.type,
          data: S.value.data,
          events: { ...S.value.events, ...le },
          selected: S.value.selected,
          resizing: S.value.resizing,
          dragging: K.value,
          connectable: e.connectable,
          position: S.value.computedPosition,
          dimensions: S.value.dimensions,
          isValidTargetPos: S.value.isValidTargetPos,
          isValidSourcePos: S.value.isValidSourcePos,
          parent: S.value.parentNode,
          parentNodeId: S.value.parentNode,
          zIndex: S.value.computedPosition.z ?? w.value,
          targetPosition: S.value.targetPosition,
          sourcePosition: S.value.sourcePosition,
          label: S.value.label,
          dragHandle: S.value.dragHandle,
          onUpdateNodeInternals: I
        })
      ]
    );
    function P() {
      const L = S.value.computedPosition;
      C.value && (L.x = N.value[0] * Math.round(L.x / N.value[0]), L.y = N.value[1] * Math.round(L.y / N.value[1]));
      const { computedPosition: ae, position: j } = cl(
        S.value,
        L,
        s.error,
        E.value,
        V.value
      );
      (S.value.computedPosition.x !== ae.x || S.value.computedPosition.y !== ae.y) && (S.value.computedPosition = { ...S.value.computedPosition, ...ae }), (S.value.position.x !== j.x || S.value.position.y !== j.y) && (S.value.position = j);
    }
    function I() {
      Y.value && c([{ id: e.id, nodeElement: Y.value, forceUpdate: !0 }]);
    }
    function T(L) {
      K != null && K.value || W.mouseEnter({ event: L, node: S.value, connectedEdges: X.value });
    }
    function M(L) {
      K != null && K.value || W.mouseMove({ event: L, node: S.value, connectedEdges: X.value });
    }
    function U(L) {
      K != null && K.value || W.mouseLeave({ event: L, node: S.value, connectedEdges: X.value });
    }
    function q(L) {
      return W.contextMenu({ event: L, node: S.value, connectedEdges: X.value });
    }
    function Z(L) {
      return W.doubleClick({ event: L, node: S.value, connectedEdges: X.value });
    }
    function J(L) {
      e.selectable && (!o.value || !e.draggable || y.value > 0) && ys(
        S.value,
        r.value,
        u,
        a,
        i,
        !1,
        Y.value
      ), W.click({ event: L, node: S.value, connectedEdges: X.value });
    }
    function se(L) {
      if (!gs(L))
        if (ff.includes(L.key) && e.selectable) {
          const ae = L.key === "Escape";
          ys(
            S.value,
            r.value,
            u,
            a,
            i,
            ae,
            Y.value
          );
        } else
          !_.value && e.draggable && S.value.selected && kn[L.key] && (b.value = `Moved selected node ${L.key.replace("Arrow", "").toLowerCase()}. New position, x: ${~~S.value.position.x}, y: ${~~S.value.position.y}`, O(
            {
              x: kn[L.key].x,
              y: kn[L.key].y
            },
            L.shiftKey
          ));
    }
  }
}), Ty = Py;
function Iy(e = { includeHiddenNodes: !1 }) {
  const { nodes: t } = Ee();
  return he(() => {
    if (t.value.length === 0)
      return !1;
    for (const n of t.value)
      if ((e.includeHiddenNodes || !n.hidden) && (n == null ? void 0 : n.handleBounds) === void 0)
        return !1;
    return !0;
  });
}
const Oy = { class: "vue-flow__nodes vue-flow__container" }, Dy = {
  name: "Nodes",
  compatConfig: { MODE: 3 }
}, ky = /* @__PURE__ */ Se({
  ...Dy,
  setup(e) {
    const {
      nodes: t,
      nodesDraggable: n,
      nodesFocusable: o,
      elementsSelectable: i,
      nodesConnectable: r,
      getNodes: s,
      getNodeTypes: l,
      updateNodeDimensions: a,
      emits: u
    } = Ee(), c = Iy(), f = lt(hr), d = be(), p = Do();
    we(
      c,
      (N) => {
        N && nt(() => {
          u.nodesInitialized(t.value);
        });
      },
      { immediate: !0 }
    ), En(() => {
      d.value = new ResizeObserver((N) => {
        const y = N.map((D) => ({
          id: D.target.getAttribute("data-id"),
          nodeElement: D.target,
          forceUpdate: !0
        }));
        nt(() => a(y));
      });
    }), tr(() => {
      var N;
      return (N = d.value) == null ? void 0 : N.disconnect();
    });
    function E(N) {
      return typeof N > "u" ? n.value : N;
    }
    function m(N) {
      return typeof N > "u" ? i.value : N;
    }
    function _(N) {
      return typeof N > "u" ? r.value : N;
    }
    function b(N) {
      return typeof N > "u" ? o.value : N;
    }
    function C(N, y) {
      const D = N || "default", O = f == null ? void 0 : f[`node-${D}`];
      if (O)
        return O;
      let S = y ?? l.value[D];
      if (typeof S == "string" && p) {
        const V = Object.keys(p.appContext.components);
        V && V.includes(D) && (S = tc(D, !1));
      }
      return S && typeof S != "string" ? S : (u.error(new Ye(Ge.NODE_TYPE_MISSING, S)), !1);
    }
    return (N, y) => (re(), pe("div", Oy, [
      d.value ? (re(!0), pe(Me, { key: 0 }, Fn(G(s), (D) => (re(), Ve(G(Ty), {
        id: D.id,
        key: D.id,
        "resize-observer": d.value,
        type: C(D.type, D.template),
        name: D.type || "default",
        draggable: E(D.draggable),
        selectable: m(D.selectable),
        connectable: _(D.connectable),
        focusable: b(D.focusable),
        node: D
      }, null, 8, ["id", "resize-observer", "type", "name", "draggable", "selectable", "connectable", "focusable", "node"]))), 128)) : He("", !0)
    ]));
  }
}), Ry = /* @__PURE__ */ Ce("div", { class: "vue-flow__edge-labels" }, null, -1), zy = {
  name: "VueFlow",
  compatConfig: { MODE: 3 }
}, Hy = /* @__PURE__ */ Se({
  ...zy,
  props: {
    id: {},
    modelValue: {},
    nodes: {},
    edges: {},
    edgeTypes: {},
    nodeTypes: {},
    connectionMode: {},
    connectionLineType: {},
    connectionLineStyle: { default: void 0 },
    connectionLineOptions: { default: void 0 },
    connectionRadius: {},
    isValidConnection: { type: [Function, null], default: void 0 },
    deleteKeyCode: { default: void 0 },
    selectionKeyCode: { default: void 0 },
    multiSelectionKeyCode: { default: void 0 },
    zoomActivationKeyCode: { default: void 0 },
    panActivationKeyCode: { default: void 0 },
    snapToGrid: { type: Boolean, default: void 0 },
    snapGrid: {},
    onlyRenderVisibleElements: { type: Boolean, default: void 0 },
    edgesUpdatable: { type: [Boolean, String], default: void 0 },
    nodesDraggable: { type: Boolean, default: void 0 },
    nodesConnectable: { type: Boolean, default: void 0 },
    nodeDragThreshold: {},
    elementsSelectable: { type: Boolean, default: void 0 },
    selectNodesOnDrag: { type: Boolean, default: void 0 },
    panOnDrag: { type: [Boolean, Array], default: void 0 },
    minZoom: {},
    maxZoom: {},
    defaultViewport: {},
    translateExtent: {},
    nodeExtent: {},
    defaultMarkerColor: {},
    zoomOnScroll: { type: Boolean, default: void 0 },
    zoomOnPinch: { type: Boolean, default: void 0 },
    panOnScroll: { type: Boolean, default: void 0 },
    panOnScrollSpeed: {},
    panOnScrollMode: {},
    zoomOnDoubleClick: { type: Boolean, default: void 0 },
    preventScrolling: { type: Boolean, default: void 0 },
    selectionMode: {},
    edgeUpdaterRadius: {},
    fitViewOnInit: { type: Boolean, default: void 0 },
    connectOnClick: { type: Boolean, default: void 0 },
    applyDefault: { type: Boolean, default: void 0 },
    autoConnect: { type: [Boolean, Function], default: void 0 },
    noDragClassName: {},
    noWheelClassName: {},
    noPanClassName: {},
    defaultEdgeOptions: {},
    elevateEdgesOnSelect: { type: Boolean, default: void 0 },
    elevateNodesOnSelect: { type: Boolean, default: void 0 },
    disableKeyboardA11y: { type: Boolean, default: void 0 },
    edgesFocusable: { type: Boolean, default: void 0 },
    nodesFocusable: { type: Boolean, default: void 0 },
    autoPanOnConnect: { type: Boolean, default: void 0 },
    autoPanOnNodeDrag: { type: Boolean, default: void 0 }
  },
  emits: ["nodesChange", "edgesChange", "nodeDoubleClick", "nodeClick", "nodeMouseEnter", "nodeMouseMove", "nodeMouseLeave", "nodeContextMenu", "nodeDragStart", "nodeDrag", "nodeDragStop", "nodesInitialized", "miniMapNodeClick", "miniMapNodeDoubleClick", "miniMapNodeMouseEnter", "miniMapNodeMouseMove", "miniMapNodeMouseLeave", "connect", "connectStart", "connectEnd", "clickConnectStart", "clickConnectEnd", "moveStart", "move", "moveEnd", "selectionDragStart", "selectionDrag", "selectionDragStop", "selectionContextMenu", "selectionStart", "selectionEnd", "viewportChangeStart", "viewportChange", "viewportChangeEnd", "paneReady", "init", "paneScroll", "paneClick", "paneContextMenu", "paneMouseEnter", "paneMouseMove", "paneMouseLeave", "edgeContextMenu", "edgeMouseEnter", "edgeMouseMove", "edgeMouseLeave", "edgeDoubleClick", "edgeClick", "edgeUpdateStart", "edgeUpdate", "edgeUpdateEnd", "updateNodeInternals", "error", "update:modelValue", "update:nodes", "update:edges"],
  setup(e, { expose: t, emit: n }) {
    const o = e, i = cc(), r = go(o, "modelValue", n), s = go(o, "nodes", n), l = go(o, "edges", n), { vueFlowRef: a, hooks: u, getNodeTypes: c, getEdgeTypes: f, ...d } = Ee(o), p = Z0({ modelValue: r, nodes: s, edges: l }, o, {
      vueFlowRef: a,
      hooks: u,
      getNodeTypes: c,
      getEdgeTypes: f,
      ...d
    });
    return y_(n, u), py(), en(hr, i), nr(() => {
      p();
    }), t({
      vueFlowRef: a,
      hooks: u,
      getNodeTypes: c,
      getEdgeTypes: f,
      ...d
    }), (E, m) => (re(), pe("div", {
      ref_key: "vueFlowRef",
      ref: a,
      class: "vue-flow"
    }, [
      me(ay, null, {
        default: Qe(() => [
          me(My),
          Ry,
          me(ky),
          De(E.$slots, "zoom-pane")
        ]),
        _: 3
      }),
      De(E.$slots, "default"),
      me(hy)
    ], 512));
  }
}), Fy = {
  name: "Panel",
  compatConfig: { MODE: 3 }
}, Rf = /* @__PURE__ */ Se({
  ...Fy,
  props: {
    position: {}
  },
  setup(e) {
    const t = e, { userSelectionActive: n } = Ee(), o = he(() => `${t.position}`.split("-"));
    return (i, r) => (re(), pe("div", {
      class: We(["vue-flow__panel", o.value]),
      style: ze({ pointerEvents: G(n) ? "none" : "all" })
    }, [
      De(i.$slots, "default")
    ], 6));
  }
});
function Vy(e) {
  const { type: t, id: n, nodeId: o, onConnect: i, onDisconnect: r } = e, { connectionLookup: s } = Ee(), l = pr(), a = Xe(() => ve(o) ?? l), u = Xe(() => ve(t)), c = Xe(() => ve(n) ?? null), f = be();
  return we(
    () => s.value.get(`${a.value}-${u.value}-${c.value}`),
    (d) => {
      v_(f.value, d) || (f.value = d);
    },
    { immediate: !0 }
  ), we(
    [f, () => typeof i < "u", () => typeof r < "u"],
    ([d], [p]) => {
      if (p && p !== d) {
        const E = d ?? /* @__PURE__ */ new Map();
        Xa(p, E, r), Xa(E, p, i);
      }
    },
    { immediate: !0 }
  ), he(() => {
    var d;
    return Array.from(((d = f.value) == null ? void 0 : d.values()) ?? []);
  });
}
function By(e) {
  const { findNode: t } = Ee();
  return he({
    get() {
      var n, o;
      const i = ve(e);
      if (!Array.isArray(i))
        return ((n = t(i)) == null ? void 0 : n.data) || null;
      const r = [];
      for (const s of i) {
        const l = (o = t(s)) == null ? void 0 : o.data;
        l && r.push(l);
      }
      return r;
    },
    set() {
      console.warn("You are trying to set node data via useNodesData. This is not supported.");
    }
  });
}
const Ly = {
  name: "ControlButton",
  compatConfig: { MODE: 3 }
}, Uy = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [o, i] of t)
    n[o] = i;
  return n;
}, Gy = { class: "vue-flow__controls-button" };
function Yy(e, t, n, o, i, r) {
  return re(), pe("button", Gy, [
    De(e.$slots, "default")
  ]);
}
const ti = /* @__PURE__ */ Uy(Ly, [["render", Yy]]), Wy = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 32 32"
}, Xy = /* @__PURE__ */ Ce("path", { d: "M32 18.133H18.133V32h-4.266V18.133H0v-4.266h13.867V0h4.266v13.867H32z" }, null, -1), Jy = [
  Xy
];
function Ky(e, t) {
  return re(), pe("svg", Wy, Jy);
}
const qy = { render: Ky }, Zy = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 32 5"
}, Qy = /* @__PURE__ */ Ce("path", { d: "M0 0h32v4.2H0z" }, null, -1), jy = [
  Qy
];
function e1(e, t) {
  return re(), pe("svg", Zy, jy);
}
const t1 = { render: e1 }, n1 = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 32 30"
}, o1 = /* @__PURE__ */ Ce("path", { d: "M3.692 4.63c0-.53.4-.938.939-.938h5.215V0H4.708C2.13 0 0 2.054 0 4.63v5.216h3.692V4.631zM27.354 0h-5.2v3.692h5.17c.53 0 .984.4.984.939v5.215H32V4.631A4.624 4.624 0 0 0 27.354 0zm.954 24.83c0 .532-.4.94-.939.94h-5.215v3.768h5.215c2.577 0 4.631-2.13 4.631-4.707v-5.139h-3.692v5.139zm-23.677.94a.919.919 0 0 1-.939-.94v-5.138H0v5.139c0 2.577 2.13 4.707 4.708 4.707h5.138V25.77H4.631z" }, null, -1), i1 = [
  o1
];
function r1(e, t) {
  return re(), pe("svg", n1, i1);
}
const s1 = { render: r1 }, l1 = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 25 32"
}, a1 = /* @__PURE__ */ Ce("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0 8 0 4.571 3.429 4.571 7.619v3.048H3.048A3.056 3.056 0 0 0 0 13.714v15.238A3.056 3.056 0 0 0 3.048 32h18.285a3.056 3.056 0 0 0 3.048-3.048V13.714a3.056 3.056 0 0 0-3.048-3.047zM12.19 24.533a3.056 3.056 0 0 1-3.047-3.047 3.056 3.056 0 0 1 3.047-3.048 3.056 3.056 0 0 1 3.048 3.048 3.056 3.056 0 0 1-3.048 3.047zm4.724-13.866H7.467V7.619c0-2.59 2.133-4.724 4.723-4.724 2.591 0 4.724 2.133 4.724 4.724v3.048z" }, null, -1), u1 = [
  a1
];
function c1(e, t) {
  return re(), pe("svg", l1, u1);
}
const f1 = { render: c1 }, d1 = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 25 32"
}, h1 = /* @__PURE__ */ Ce("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0c-4.114 1.828-1.37 2.133.305 2.438 1.676.305 4.42 2.59 4.42 5.181v3.048H3.047A3.056 3.056 0 0 0 0 13.714v15.238A3.056 3.056 0 0 0 3.048 32h18.285a3.056 3.056 0 0 0 3.048-3.048V13.714a3.056 3.056 0 0 0-3.048-3.047zM12.19 24.533a3.056 3.056 0 0 1-3.047-3.047 3.056 3.056 0 0 1 3.047-3.048 3.056 3.056 0 0 1 3.048 3.048 3.056 3.056 0 0 1-3.048 3.047z" }, null, -1), p1 = [
  h1
];
function g1(e, t) {
  return re(), pe("svg", d1, p1);
}
const m1 = { render: g1 }, v1 = {
  name: "Controls",
  compatConfig: { MODE: 3 }
}, _1 = /* @__PURE__ */ Se({
  ...v1,
  props: {
    showZoom: { type: Boolean, default: !0 },
    showFitView: { type: Boolean, default: !0 },
    showInteractive: { type: Boolean, default: !0 },
    fitViewParams: {},
    position: { default: () => af.BottomLeft }
  },
  emits: ["zoomIn", "zoomOut", "fitView", "interactionChange"],
  setup(e, { emit: t }) {
    const {
      nodesDraggable: n,
      nodesConnectable: o,
      elementsSelectable: i,
      setInteractive: r,
      zoomIn: s,
      zoomOut: l,
      fitView: a,
      viewport: u,
      minZoom: c,
      maxZoom: f
    } = Ee(), d = ke(() => n.value || o.value || i.value), p = ke(() => u.value.zoom <= c.value), E = ke(() => u.value.zoom >= f.value);
    function m() {
      s(), t("zoomIn");
    }
    function _() {
      l(), t("zoomOut");
    }
    function b() {
      a(e.fitViewParams), t("fitView");
    }
    function C() {
      r(!d.value), t("interactionChange", !d.value);
    }
    return (N, y) => (re(), Ve(G(Rf), {
      class: "vue-flow__controls",
      position: N.position
    }, {
      default: Qe(() => [
        De(N.$slots, "top"),
        N.showZoom ? (re(), pe(Me, { key: 0 }, [
          De(N.$slots, "control-zoom-in", {}, () => [
            me(ti, {
              class: "vue-flow__controls-zoomin",
              disabled: E.value,
              onClick: m
            }, {
              default: Qe(() => [
                De(N.$slots, "icon-zoom-in", {}, () => [
                  (re(), Ve(an(G(qy))))
                ])
              ]),
              _: 3
            }, 8, ["disabled"])
          ]),
          De(N.$slots, "control-zoom-out", {}, () => [
            me(ti, {
              class: "vue-flow__controls-zoomout",
              disabled: p.value,
              onClick: _
            }, {
              default: Qe(() => [
                De(N.$slots, "icon-zoom-out", {}, () => [
                  (re(), Ve(an(G(t1))))
                ])
              ]),
              _: 3
            }, 8, ["disabled"])
          ])
        ], 64)) : He("", !0),
        N.showFitView ? De(N.$slots, "control-fit-view", { key: 1 }, () => [
          me(ti, {
            class: "vue-flow__controls-fitview",
            onClick: b
          }, {
            default: Qe(() => [
              De(N.$slots, "icon-fit-view", {}, () => [
                (re(), Ve(an(G(s1))))
              ])
            ]),
            _: 3
          })
        ]) : He("", !0),
        N.showInteractive ? De(N.$slots, "control-interactive", { key: 2 }, () => [
          N.showInteractive ? (re(), Ve(ti, {
            key: 0,
            class: "vue-flow__controls-interactive",
            onClick: C
          }, {
            default: Qe(() => [
              d.value ? De(N.$slots, "icon-unlock", { key: 0 }, () => [
                (re(), Ve(an(G(m1))))
              ]) : He("", !0),
              d.value ? He("", !0) : De(N.$slots, "icon-lock", { key: 1 }, () => [
                (re(), Ve(an(G(f1))))
              ])
            ]),
            _: 3
          })) : He("", !0)
        ]) : He("", !0),
        De(N.$slots, "default")
      ]),
      _: 3
    }, 8, ["position"]));
  }
});
var y1 = { value: () => {
} };
function pl() {
  for (var e = 0, t = arguments.length, n = {}, o; e < t; ++e) {
    if (!(o = arguments[e] + "") || o in n || /[\s.]/.test(o))
      throw new Error("illegal type: " + o);
    n[o] = [];
  }
  return new pi(n);
}
function pi(e) {
  this._ = e;
}
function w1(e, t) {
  return e.trim().split(/^|\s+/).map(function(n) {
    var o = "", i = n.indexOf(".");
    if (i >= 0 && (o = n.slice(i + 1), n = n.slice(0, i)), n && !t.hasOwnProperty(n))
      throw new Error("unknown type: " + n);
    return { type: n, name: o };
  });
}
pi.prototype = pl.prototype = {
  constructor: pi,
  on: function(e, t) {
    var n = this._, o = w1(e + "", n), i, r = -1, s = o.length;
    if (arguments.length < 2) {
      for (; ++r < s; )
        if ((i = (e = o[r]).type) && (i = b1(n[i], e.name)))
          return i;
      return;
    }
    if (t != null && typeof t != "function")
      throw new Error("invalid callback: " + t);
    for (; ++r < s; )
      if (i = (e = o[r]).type)
        n[i] = eu(n[i], e.name, t);
      else if (t == null)
        for (i in n)
          n[i] = eu(n[i], e.name, null);
    return this;
  },
  copy: function() {
    var e = {}, t = this._;
    for (var n in t)
      e[n] = t[n].slice();
    return new pi(e);
  },
  call: function(e, t) {
    if ((i = arguments.length - 2) > 0)
      for (var n = new Array(i), o = 0, i, r; o < i; ++o)
        n[o] = arguments[o + 2];
    if (!this._.hasOwnProperty(e))
      throw new Error("unknown type: " + e);
    for (r = this._[e], o = 0, i = r.length; o < i; ++o)
      r[o].value.apply(t, n);
  },
  apply: function(e, t, n) {
    if (!this._.hasOwnProperty(e))
      throw new Error("unknown type: " + e);
    for (var o = this._[e], i = 0, r = o.length; i < r; ++i)
      o[i].value.apply(t, n);
  }
};
function b1(e, t) {
  for (var n = 0, o = e.length, i; n < o; ++n)
    if ((i = e[n]).name === t)
      return i.value;
}
function eu(e, t, n) {
  for (var o = 0, i = e.length; o < i; ++o)
    if (e[o].name === t) {
      e[o] = y1, e = e.slice(0, o).concat(e.slice(o + 1));
      break;
    }
  return n != null && e.push({ name: t, value: n }), e;
}
var ws = "http://www.w3.org/1999/xhtml";
const tu = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: ws,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function xr(e) {
  var t = e += "", n = t.indexOf(":");
  return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), tu.hasOwnProperty(t) ? { space: tu[t], local: e } : e;
}
function x1(e) {
  return function() {
    var t = this.ownerDocument, n = this.namespaceURI;
    return n === ws && t.documentElement.namespaceURI === ws ? t.createElement(e) : t.createElementNS(n, e);
  };
}
function E1(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function zf(e) {
  var t = xr(e);
  return (t.local ? E1 : x1)(t);
}
function $1() {
}
function gl(e) {
  return e == null ? $1 : function() {
    return this.querySelector(e);
  };
}
function C1(e) {
  typeof e != "function" && (e = gl(e));
  for (var t = this._groups, n = t.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = t[i], s = r.length, l = o[i] = new Array(s), a, u, c = 0; c < s; ++c)
      (a = r[c]) && (u = e.call(a, a.__data__, c, r)) && ("__data__" in a && (u.__data__ = a.__data__), l[c] = u);
  return new ut(o, this._parents);
}
function S1(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function N1() {
  return [];
}
function Hf(e) {
  return e == null ? N1 : function() {
    return this.querySelectorAll(e);
  };
}
function A1(e) {
  return function() {
    return S1(e.apply(this, arguments));
  };
}
function M1(e) {
  typeof e == "function" ? e = A1(e) : e = Hf(e);
  for (var t = this._groups, n = t.length, o = [], i = [], r = 0; r < n; ++r)
    for (var s = t[r], l = s.length, a, u = 0; u < l; ++u)
      (a = s[u]) && (o.push(e.call(a, a.__data__, u, s)), i.push(a));
  return new ut(o, i);
}
function Ff(e) {
  return function() {
    return this.matches(e);
  };
}
function Vf(e) {
  return function(t) {
    return t.matches(e);
  };
}
var P1 = Array.prototype.find;
function T1(e) {
  return function() {
    return P1.call(this.children, e);
  };
}
function I1() {
  return this.firstElementChild;
}
function O1(e) {
  return this.select(e == null ? I1 : T1(typeof e == "function" ? e : Vf(e)));
}
var D1 = Array.prototype.filter;
function k1() {
  return Array.from(this.children);
}
function R1(e) {
  return function() {
    return D1.call(this.children, e);
  };
}
function z1(e) {
  return this.selectAll(e == null ? k1 : R1(typeof e == "function" ? e : Vf(e)));
}
function H1(e) {
  typeof e != "function" && (e = Ff(e));
  for (var t = this._groups, n = t.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = t[i], s = r.length, l = o[i] = [], a, u = 0; u < s; ++u)
      (a = r[u]) && e.call(a, a.__data__, u, r) && l.push(a);
  return new ut(o, this._parents);
}
function Bf(e) {
  return new Array(e.length);
}
function F1() {
  return new ut(this._enter || this._groups.map(Bf), this._parents);
}
function Hi(e, t) {
  this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
Hi.prototype = {
  constructor: Hi,
  appendChild: function(e) {
    return this._parent.insertBefore(e, this._next);
  },
  insertBefore: function(e, t) {
    return this._parent.insertBefore(e, t);
  },
  querySelector: function(e) {
    return this._parent.querySelector(e);
  },
  querySelectorAll: function(e) {
    return this._parent.querySelectorAll(e);
  }
};
function V1(e) {
  return function() {
    return e;
  };
}
function B1(e, t, n, o, i, r) {
  for (var s = 0, l, a = t.length, u = r.length; s < u; ++s)
    (l = t[s]) ? (l.__data__ = r[s], o[s] = l) : n[s] = new Hi(e, r[s]);
  for (; s < a; ++s)
    (l = t[s]) && (i[s] = l);
}
function L1(e, t, n, o, i, r, s) {
  var l, a, u = /* @__PURE__ */ new Map(), c = t.length, f = r.length, d = new Array(c), p;
  for (l = 0; l < c; ++l)
    (a = t[l]) && (d[l] = p = s.call(a, a.__data__, l, t) + "", u.has(p) ? i[l] = a : u.set(p, a));
  for (l = 0; l < f; ++l)
    p = s.call(e, r[l], l, r) + "", (a = u.get(p)) ? (o[l] = a, a.__data__ = r[l], u.delete(p)) : n[l] = new Hi(e, r[l]);
  for (l = 0; l < c; ++l)
    (a = t[l]) && u.get(d[l]) === a && (i[l] = a);
}
function U1(e) {
  return e.__data__;
}
function G1(e, t) {
  if (!arguments.length)
    return Array.from(this, U1);
  var n = t ? L1 : B1, o = this._parents, i = this._groups;
  typeof e != "function" && (e = V1(e));
  for (var r = i.length, s = new Array(r), l = new Array(r), a = new Array(r), u = 0; u < r; ++u) {
    var c = o[u], f = i[u], d = f.length, p = Y1(e.call(c, c && c.__data__, u, o)), E = p.length, m = l[u] = new Array(E), _ = s[u] = new Array(E), b = a[u] = new Array(d);
    n(c, f, m, _, b, p, t);
    for (var C = 0, N = 0, y, D; C < E; ++C)
      if (y = m[C]) {
        for (C >= N && (N = C + 1); !(D = _[N]) && ++N < E; )
          ;
        y._next = D || null;
      }
  }
  return s = new ut(s, o), s._enter = l, s._exit = a, s;
}
function Y1(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function W1() {
  return new ut(this._exit || this._groups.map(Bf), this._parents);
}
function X1(e, t, n) {
  var o = this.enter(), i = this, r = this.exit();
  return typeof e == "function" ? (o = e(o), o && (o = o.selection())) : o = o.append(e + ""), t != null && (i = t(i), i && (i = i.selection())), n == null ? r.remove() : n(r), o && i ? o.merge(i).order() : i;
}
function J1(e) {
  for (var t = e.selection ? e.selection() : e, n = this._groups, o = t._groups, i = n.length, r = o.length, s = Math.min(i, r), l = new Array(i), a = 0; a < s; ++a)
    for (var u = n[a], c = o[a], f = u.length, d = l[a] = new Array(f), p, E = 0; E < f; ++E)
      (p = u[E] || c[E]) && (d[E] = p);
  for (; a < i; ++a)
    l[a] = n[a];
  return new ut(l, this._parents);
}
function K1() {
  for (var e = this._groups, t = -1, n = e.length; ++t < n; )
    for (var o = e[t], i = o.length - 1, r = o[i], s; --i >= 0; )
      (s = o[i]) && (r && s.compareDocumentPosition(r) ^ 4 && r.parentNode.insertBefore(s, r), r = s);
  return this;
}
function q1(e) {
  e || (e = Z1);
  function t(f, d) {
    return f && d ? e(f.__data__, d.__data__) : !f - !d;
  }
  for (var n = this._groups, o = n.length, i = new Array(o), r = 0; r < o; ++r) {
    for (var s = n[r], l = s.length, a = i[r] = new Array(l), u, c = 0; c < l; ++c)
      (u = s[c]) && (a[c] = u);
    a.sort(t);
  }
  return new ut(i, this._parents).order();
}
function Z1(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function Q1() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function j1() {
  return Array.from(this);
}
function ew() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var o = e[t], i = 0, r = o.length; i < r; ++i) {
      var s = o[i];
      if (s)
        return s;
    }
  return null;
}
function tw() {
  let e = 0;
  for (const t of this)
    ++e;
  return e;
}
function nw() {
  return !this.node();
}
function ow(e) {
  for (var t = this._groups, n = 0, o = t.length; n < o; ++n)
    for (var i = t[n], r = 0, s = i.length, l; r < s; ++r)
      (l = i[r]) && e.call(l, l.__data__, r, i);
  return this;
}
function iw(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function rw(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function sw(e, t) {
  return function() {
    this.setAttribute(e, t);
  };
}
function lw(e, t) {
  return function() {
    this.setAttributeNS(e.space, e.local, t);
  };
}
function aw(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
  };
}
function uw(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
  };
}
function cw(e, t) {
  var n = xr(e);
  if (arguments.length < 2) {
    var o = this.node();
    return n.local ? o.getAttributeNS(n.space, n.local) : o.getAttribute(n);
  }
  return this.each((t == null ? n.local ? rw : iw : typeof t == "function" ? n.local ? uw : aw : n.local ? lw : sw)(n, t));
}
function Lf(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function fw(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function dw(e, t, n) {
  return function() {
    this.style.setProperty(e, t, n);
  };
}
function hw(e, t, n) {
  return function() {
    var o = t.apply(this, arguments);
    o == null ? this.style.removeProperty(e) : this.style.setProperty(e, o, n);
  };
}
function pw(e, t, n) {
  return arguments.length > 1 ? this.each((t == null ? fw : typeof t == "function" ? hw : dw)(e, t, n ?? "")) : Gn(this.node(), e);
}
function Gn(e, t) {
  return e.style.getPropertyValue(t) || Lf(e).getComputedStyle(e, null).getPropertyValue(t);
}
function gw(e) {
  return function() {
    delete this[e];
  };
}
function mw(e, t) {
  return function() {
    this[e] = t;
  };
}
function vw(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? delete this[e] : this[e] = n;
  };
}
function _w(e, t) {
  return arguments.length > 1 ? this.each((t == null ? gw : typeof t == "function" ? vw : mw)(e, t)) : this.node()[e];
}
function Uf(e) {
  return e.trim().split(/^|\s+/);
}
function ml(e) {
  return e.classList || new Gf(e);
}
function Gf(e) {
  this._node = e, this._names = Uf(e.getAttribute("class") || "");
}
Gf.prototype = {
  add: function(e) {
    var t = this._names.indexOf(e);
    t < 0 && (this._names.push(e), this._node.setAttribute("class", this._names.join(" ")));
  },
  remove: function(e) {
    var t = this._names.indexOf(e);
    t >= 0 && (this._names.splice(t, 1), this._node.setAttribute("class", this._names.join(" ")));
  },
  contains: function(e) {
    return this._names.indexOf(e) >= 0;
  }
};
function Yf(e, t) {
  for (var n = ml(e), o = -1, i = t.length; ++o < i; )
    n.add(t[o]);
}
function Wf(e, t) {
  for (var n = ml(e), o = -1, i = t.length; ++o < i; )
    n.remove(t[o]);
}
function yw(e) {
  return function() {
    Yf(this, e);
  };
}
function ww(e) {
  return function() {
    Wf(this, e);
  };
}
function bw(e, t) {
  return function() {
    (t.apply(this, arguments) ? Yf : Wf)(this, e);
  };
}
function xw(e, t) {
  var n = Uf(e + "");
  if (arguments.length < 2) {
    for (var o = ml(this.node()), i = -1, r = n.length; ++i < r; )
      if (!o.contains(n[i]))
        return !1;
    return !0;
  }
  return this.each((typeof t == "function" ? bw : t ? yw : ww)(n, t));
}
function Ew() {
  this.textContent = "";
}
function $w(e) {
  return function() {
    this.textContent = e;
  };
}
function Cw(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.textContent = t ?? "";
  };
}
function Sw(e) {
  return arguments.length ? this.each(e == null ? Ew : (typeof e == "function" ? Cw : $w)(e)) : this.node().textContent;
}
function Nw() {
  this.innerHTML = "";
}
function Aw(e) {
  return function() {
    this.innerHTML = e;
  };
}
function Mw(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.innerHTML = t ?? "";
  };
}
function Pw(e) {
  return arguments.length ? this.each(e == null ? Nw : (typeof e == "function" ? Mw : Aw)(e)) : this.node().innerHTML;
}
function Tw() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function Iw() {
  return this.each(Tw);
}
function Ow() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function Dw() {
  return this.each(Ow);
}
function kw(e) {
  var t = typeof e == "function" ? e : zf(e);
  return this.select(function() {
    return this.appendChild(t.apply(this, arguments));
  });
}
function Rw() {
  return null;
}
function zw(e, t) {
  var n = typeof e == "function" ? e : zf(e), o = t == null ? Rw : typeof t == "function" ? t : gl(t);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), o.apply(this, arguments) || null);
  });
}
function Hw() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function Fw() {
  return this.each(Hw);
}
function Vw() {
  var e = this.cloneNode(!1), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Bw() {
  var e = this.cloneNode(!0), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Lw(e) {
  return this.select(e ? Bw : Vw);
}
function Uw(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function Gw(e) {
  return function(t) {
    e.call(this, t, this.__data__);
  };
}
function Yw(e) {
  return e.trim().split(/^|\s+/).map(function(t) {
    var n = "", o = t.indexOf(".");
    return o >= 0 && (n = t.slice(o + 1), t = t.slice(0, o)), { type: t, name: n };
  });
}
function Ww(e) {
  return function() {
    var t = this.__on;
    if (t) {
      for (var n = 0, o = -1, i = t.length, r; n < i; ++n)
        r = t[n], (!e.type || r.type === e.type) && r.name === e.name ? this.removeEventListener(r.type, r.listener, r.options) : t[++o] = r;
      ++o ? t.length = o : delete this.__on;
    }
  };
}
function Xw(e, t, n) {
  return function() {
    var o = this.__on, i, r = Gw(t);
    if (o) {
      for (var s = 0, l = o.length; s < l; ++s)
        if ((i = o[s]).type === e.type && i.name === e.name) {
          this.removeEventListener(i.type, i.listener, i.options), this.addEventListener(i.type, i.listener = r, i.options = n), i.value = t;
          return;
        }
    }
    this.addEventListener(e.type, r, n), i = { type: e.type, name: e.name, value: t, listener: r, options: n }, o ? o.push(i) : this.__on = [i];
  };
}
function Jw(e, t, n) {
  var o = Yw(e + ""), i, r = o.length, s;
  if (arguments.length < 2) {
    var l = this.node().__on;
    if (l) {
      for (var a = 0, u = l.length, c; a < u; ++a)
        for (i = 0, c = l[a]; i < r; ++i)
          if ((s = o[i]).type === c.type && s.name === c.name)
            return c.value;
    }
    return;
  }
  for (l = t ? Xw : Ww, i = 0; i < r; ++i)
    this.each(l(o[i], t, n));
  return this;
}
function Xf(e, t, n) {
  var o = Lf(e), i = o.CustomEvent;
  typeof i == "function" ? i = new i(t, n) : (i = o.document.createEvent("Event"), n ? (i.initEvent(t, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(t, !1, !1)), e.dispatchEvent(i);
}
function Kw(e, t) {
  return function() {
    return Xf(this, e, t);
  };
}
function qw(e, t) {
  return function() {
    return Xf(this, e, t.apply(this, arguments));
  };
}
function Zw(e, t) {
  return this.each((typeof t == "function" ? qw : Kw)(e, t));
}
function* Qw() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var o = e[t], i = 0, r = o.length, s; i < r; ++i)
      (s = o[i]) && (yield s);
}
var Jf = [null];
function ut(e, t) {
  this._groups = e, this._parents = t;
}
function Ho() {
  return new ut([[document.documentElement]], Jf);
}
function jw() {
  return this;
}
ut.prototype = Ho.prototype = {
  constructor: ut,
  select: C1,
  selectAll: M1,
  selectChild: O1,
  selectChildren: z1,
  filter: H1,
  data: G1,
  enter: F1,
  exit: W1,
  join: X1,
  merge: J1,
  selection: jw,
  order: K1,
  sort: q1,
  call: Q1,
  nodes: j1,
  node: ew,
  size: tw,
  empty: nw,
  each: ow,
  attr: cw,
  style: pw,
  property: _w,
  classed: xw,
  text: Sw,
  html: Pw,
  raise: Iw,
  lower: Dw,
  append: kw,
  insert: zw,
  remove: Fw,
  clone: Lw,
  datum: Uw,
  on: Jw,
  dispatch: Zw,
  [Symbol.iterator]: Qw
};
function Qt(e) {
  return typeof e == "string" ? new ut([[document.querySelector(e)]], [document.documentElement]) : new ut([[e]], Jf);
}
function eb(e) {
  let t;
  for (; t = e.sourceEvent; )
    e = t;
  return e;
}
function Yt(e, t) {
  if (e = eb(e), t === void 0 && (t = e.currentTarget), t) {
    var n = t.ownerSVGElement || t;
    if (n.createSVGPoint) {
      var o = n.createSVGPoint();
      return o.x = e.clientX, o.y = e.clientY, o = o.matrixTransform(t.getScreenCTM().inverse()), [o.x, o.y];
    }
    if (t.getBoundingClientRect) {
      var i = t.getBoundingClientRect();
      return [e.clientX - i.left - t.clientLeft, e.clientY - i.top - t.clientTop];
    }
  }
  return [e.pageX, e.pageY];
}
const bs = { capture: !0, passive: !1 };
function xs(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function tb(e) {
  var t = e.document.documentElement, n = Qt(e).on("dragstart.drag", xs, bs);
  "onselectstart" in t ? n.on("selectstart.drag", xs, bs) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function nb(e, t) {
  var n = e.document.documentElement, o = Qt(e).on("dragstart.drag", null);
  t && (o.on("click.drag", xs, bs), setTimeout(function() {
    o.on("click.drag", null);
  }, 0)), "onselectstart" in n ? o.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
function vl(e, t, n) {
  e.prototype = t.prototype = n, n.constructor = e;
}
function Kf(e, t) {
  var n = Object.create(e.prototype);
  for (var o in t)
    n[o] = t[o];
  return n;
}
function Fo() {
}
var No = 0.7, Fi = 1 / No, Rn = "\\s*([+-]?\\d+)\\s*", Ao = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", Nt = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", ob = /^#([0-9a-f]{3,8})$/, ib = new RegExp(`^rgb\\(${Rn},${Rn},${Rn}\\)$`), rb = new RegExp(`^rgb\\(${Nt},${Nt},${Nt}\\)$`), sb = new RegExp(`^rgba\\(${Rn},${Rn},${Rn},${Ao}\\)$`), lb = new RegExp(`^rgba\\(${Nt},${Nt},${Nt},${Ao}\\)$`), ab = new RegExp(`^hsl\\(${Ao},${Nt},${Nt}\\)$`), ub = new RegExp(`^hsla\\(${Ao},${Nt},${Nt},${Ao}\\)$`), nu = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
};
vl(Fo, Mo, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: ou,
  // Deprecated! Use color.formatHex.
  formatHex: ou,
  formatHex8: cb,
  formatHsl: fb,
  formatRgb: iu,
  toString: iu
});
function ou() {
  return this.rgb().formatHex();
}
function cb() {
  return this.rgb().formatHex8();
}
function fb() {
  return qf(this).formatHsl();
}
function iu() {
  return this.rgb().formatRgb();
}
function Mo(e) {
  var t, n;
  return e = (e + "").trim().toLowerCase(), (t = ob.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? ru(t) : n === 3 ? new et(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? ni(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? ni(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = ib.exec(e)) ? new et(t[1], t[2], t[3], 1) : (t = rb.exec(e)) ? new et(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = sb.exec(e)) ? ni(t[1], t[2], t[3], t[4]) : (t = lb.exec(e)) ? ni(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = ab.exec(e)) ? au(t[1], t[2] / 100, t[3] / 100, 1) : (t = ub.exec(e)) ? au(t[1], t[2] / 100, t[3] / 100, t[4]) : nu.hasOwnProperty(e) ? ru(nu[e]) : e === "transparent" ? new et(NaN, NaN, NaN, 0) : null;
}
function ru(e) {
  return new et(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function ni(e, t, n, o) {
  return o <= 0 && (e = t = n = NaN), new et(e, t, n, o);
}
function db(e) {
  return e instanceof Fo || (e = Mo(e)), e ? (e = e.rgb(), new et(e.r, e.g, e.b, e.opacity)) : new et();
}
function Es(e, t, n, o) {
  return arguments.length === 1 ? db(e) : new et(e, t, n, o ?? 1);
}
function et(e, t, n, o) {
  this.r = +e, this.g = +t, this.b = +n, this.opacity = +o;
}
vl(et, Es, Kf(Fo, {
  brighter(e) {
    return e = e == null ? Fi : Math.pow(Fi, e), new et(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? No : Math.pow(No, e), new et(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new et(_n(this.r), _n(this.g), _n(this.b), Vi(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: su,
  // Deprecated! Use color.formatHex.
  formatHex: su,
  formatHex8: hb,
  formatRgb: lu,
  toString: lu
}));
function su() {
  return `#${dn(this.r)}${dn(this.g)}${dn(this.b)}`;
}
function hb() {
  return `#${dn(this.r)}${dn(this.g)}${dn(this.b)}${dn((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function lu() {
  const e = Vi(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${_n(this.r)}, ${_n(this.g)}, ${_n(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function Vi(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function _n(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function dn(e) {
  return e = _n(e), (e < 16 ? "0" : "") + e.toString(16);
}
function au(e, t, n, o) {
  return o <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new mt(e, t, n, o);
}
function qf(e) {
  if (e instanceof mt)
    return new mt(e.h, e.s, e.l, e.opacity);
  if (e instanceof Fo || (e = Mo(e)), !e)
    return new mt();
  if (e instanceof mt)
    return e;
  e = e.rgb();
  var t = e.r / 255, n = e.g / 255, o = e.b / 255, i = Math.min(t, n, o), r = Math.max(t, n, o), s = NaN, l = r - i, a = (r + i) / 2;
  return l ? (t === r ? s = (n - o) / l + (n < o) * 6 : n === r ? s = (o - t) / l + 2 : s = (t - n) / l + 4, l /= a < 0.5 ? r + i : 2 - r - i, s *= 60) : l = a > 0 && a < 1 ? 0 : s, new mt(s, l, a, e.opacity);
}
function pb(e, t, n, o) {
  return arguments.length === 1 ? qf(e) : new mt(e, t, n, o ?? 1);
}
function mt(e, t, n, o) {
  this.h = +e, this.s = +t, this.l = +n, this.opacity = +o;
}
vl(mt, pb, Kf(Fo, {
  brighter(e) {
    return e = e == null ? Fi : Math.pow(Fi, e), new mt(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? No : Math.pow(No, e), new mt(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, o = n + (n < 0.5 ? n : 1 - n) * t, i = 2 * n - o;
    return new et(
      Ur(e >= 240 ? e - 240 : e + 120, i, o),
      Ur(e, i, o),
      Ur(e < 120 ? e + 240 : e - 120, i, o),
      this.opacity
    );
  },
  clamp() {
    return new mt(uu(this.h), oi(this.s), oi(this.l), Vi(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = Vi(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${uu(this.h)}, ${oi(this.s) * 100}%, ${oi(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function uu(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function oi(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function Ur(e, t, n) {
  return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
const Zf = (e) => () => e;
function gb(e, t) {
  return function(n) {
    return e + n * t;
  };
}
function mb(e, t, n) {
  return e = Math.pow(e, n), t = Math.pow(t, n) - e, n = 1 / n, function(o) {
    return Math.pow(e + o * t, n);
  };
}
function vb(e) {
  return (e = +e) == 1 ? Qf : function(t, n) {
    return n - t ? mb(t, n, e) : Zf(isNaN(t) ? n : t);
  };
}
function Qf(e, t) {
  var n = t - e;
  return n ? gb(e, n) : Zf(isNaN(e) ? t : e);
}
const cu = function e(t) {
  var n = vb(t);
  function o(i, r) {
    var s = n((i = Es(i)).r, (r = Es(r)).r), l = n(i.g, r.g), a = n(i.b, r.b), u = Qf(i.opacity, r.opacity);
    return function(c) {
      return i.r = s(c), i.g = l(c), i.b = a(c), i.opacity = u(c), i + "";
    };
  }
  return o.gamma = e, o;
}(1);
function qt(e, t) {
  return e = +e, t = +t, function(n) {
    return e * (1 - n) + t * n;
  };
}
var $s = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Gr = new RegExp($s.source, "g");
function _b(e) {
  return function() {
    return e;
  };
}
function yb(e) {
  return function(t) {
    return e(t) + "";
  };
}
function wb(e, t) {
  var n = $s.lastIndex = Gr.lastIndex = 0, o, i, r, s = -1, l = [], a = [];
  for (e = e + "", t = t + ""; (o = $s.exec(e)) && (i = Gr.exec(t)); )
    (r = i.index) > n && (r = t.slice(n, r), l[s] ? l[s] += r : l[++s] = r), (o = o[0]) === (i = i[0]) ? l[s] ? l[s] += i : l[++s] = i : (l[++s] = null, a.push({ i: s, x: qt(o, i) })), n = Gr.lastIndex;
  return n < t.length && (r = t.slice(n), l[s] ? l[s] += r : l[++s] = r), l.length < 2 ? a[0] ? yb(a[0].x) : _b(t) : (t = a.length, function(u) {
    for (var c = 0, f; c < t; ++c)
      l[(f = a[c]).i] = f.x(u);
    return l.join("");
  });
}
var fu = 180 / Math.PI, Cs = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function jf(e, t, n, o, i, r) {
  var s, l, a;
  return (s = Math.sqrt(e * e + t * t)) && (e /= s, t /= s), (a = e * n + t * o) && (n -= e * a, o -= t * a), (l = Math.sqrt(n * n + o * o)) && (n /= l, o /= l, a /= l), e * o < t * n && (e = -e, t = -t, a = -a, s = -s), {
    translateX: i,
    translateY: r,
    rotate: Math.atan2(t, e) * fu,
    skewX: Math.atan(a) * fu,
    scaleX: s,
    scaleY: l
  };
}
var ii;
function bb(e) {
  const t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
  return t.isIdentity ? Cs : jf(t.a, t.b, t.c, t.d, t.e, t.f);
}
function xb(e) {
  return e == null || (ii || (ii = document.createElementNS("http://www.w3.org/2000/svg", "g")), ii.setAttribute("transform", e), !(e = ii.transform.baseVal.consolidate())) ? Cs : (e = e.matrix, jf(e.a, e.b, e.c, e.d, e.e, e.f));
}
function ed(e, t, n, o) {
  function i(u) {
    return u.length ? u.pop() + " " : "";
  }
  function r(u, c, f, d, p, E) {
    if (u !== f || c !== d) {
      var m = p.push("translate(", null, t, null, n);
      E.push({ i: m - 4, x: qt(u, f) }, { i: m - 2, x: qt(c, d) });
    } else
      (f || d) && p.push("translate(" + f + t + d + n);
  }
  function s(u, c, f, d) {
    u !== c ? (u - c > 180 ? c += 360 : c - u > 180 && (u += 360), d.push({ i: f.push(i(f) + "rotate(", null, o) - 2, x: qt(u, c) })) : c && f.push(i(f) + "rotate(" + c + o);
  }
  function l(u, c, f, d) {
    u !== c ? d.push({ i: f.push(i(f) + "skewX(", null, o) - 2, x: qt(u, c) }) : c && f.push(i(f) + "skewX(" + c + o);
  }
  function a(u, c, f, d, p, E) {
    if (u !== f || c !== d) {
      var m = p.push(i(p) + "scale(", null, ",", null, ")");
      E.push({ i: m - 4, x: qt(u, f) }, { i: m - 2, x: qt(c, d) });
    } else
      (f !== 1 || d !== 1) && p.push(i(p) + "scale(" + f + "," + d + ")");
  }
  return function(u, c) {
    var f = [], d = [];
    return u = e(u), c = e(c), r(u.translateX, u.translateY, c.translateX, c.translateY, f, d), s(u.rotate, c.rotate, f, d), l(u.skewX, c.skewX, f, d), a(u.scaleX, u.scaleY, c.scaleX, c.scaleY, f, d), u = c = null, function(p) {
      for (var E = -1, m = d.length, _; ++E < m; )
        f[(_ = d[E]).i] = _.x(p);
      return f.join("");
    };
  };
}
var Eb = ed(bb, "px, ", "px)", "deg)"), $b = ed(xb, ", ", ")", ")"), Cb = 1e-12;
function du(e) {
  return ((e = Math.exp(e)) + 1 / e) / 2;
}
function Sb(e) {
  return ((e = Math.exp(e)) - 1 / e) / 2;
}
function Nb(e) {
  return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
const Ab = function e(t, n, o) {
  function i(r, s) {
    var l = r[0], a = r[1], u = r[2], c = s[0], f = s[1], d = s[2], p = c - l, E = f - a, m = p * p + E * E, _, b;
    if (m < Cb)
      b = Math.log(d / u) / t, _ = function(S) {
        return [
          l + S * p,
          a + S * E,
          u * Math.exp(t * S * b)
        ];
      };
    else {
      var C = Math.sqrt(m), N = (d * d - u * u + o * m) / (2 * u * n * C), y = (d * d - u * u - o * m) / (2 * d * n * C), D = Math.log(Math.sqrt(N * N + 1) - N), O = Math.log(Math.sqrt(y * y + 1) - y);
      b = (O - D) / t, _ = function(S) {
        var V = S * b, X = du(D), Y = u / (n * C) * (X * Nb(t * V + D) - Sb(D));
        return [
          l + Y * p,
          a + Y * E,
          u * X / du(t * V + D)
        ];
      };
    }
    return _.duration = b * 1e3 * t / Math.SQRT2, _;
  }
  return i.rho = function(r) {
    var s = Math.max(1e-3, +r), l = s * s, a = l * l;
    return e(s, l, a);
  }, i;
}(Math.SQRT2, 2, 4);
var Yn = 0, oo = 0, Qn = 0, td = 1e3, Bi, io, Li = 0, xn = 0, Er = 0, Po = typeof performance == "object" && performance.now ? performance : Date, nd = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
  setTimeout(e, 17);
};
function _l() {
  return xn || (nd(Mb), xn = Po.now() + Er);
}
function Mb() {
  xn = 0;
}
function Ui() {
  this._call = this._time = this._next = null;
}
Ui.prototype = od.prototype = {
  constructor: Ui,
  restart: function(e, t, n) {
    if (typeof e != "function")
      throw new TypeError("callback is not a function");
    n = (n == null ? _l() : +n) + (t == null ? 0 : +t), !this._next && io !== this && (io ? io._next = this : Bi = this, io = this), this._call = e, this._time = n, Ss();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, Ss());
  }
};
function od(e, t, n) {
  var o = new Ui();
  return o.restart(e, t, n), o;
}
function Pb() {
  _l(), ++Yn;
  for (var e = Bi, t; e; )
    (t = xn - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
  --Yn;
}
function hu() {
  xn = (Li = Po.now()) + Er, Yn = oo = 0;
  try {
    Pb();
  } finally {
    Yn = 0, Ib(), xn = 0;
  }
}
function Tb() {
  var e = Po.now(), t = e - Li;
  t > td && (Er -= t, Li = e);
}
function Ib() {
  for (var e, t = Bi, n, o = 1 / 0; t; )
    t._call ? (o > t._time && (o = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : Bi = n);
  io = e, Ss(o);
}
function Ss(e) {
  if (!Yn) {
    oo && (oo = clearTimeout(oo));
    var t = e - xn;
    t > 24 ? (e < 1 / 0 && (oo = setTimeout(hu, e - Po.now() - Er)), Qn && (Qn = clearInterval(Qn))) : (Qn || (Li = Po.now(), Qn = setInterval(Tb, td)), Yn = 1, nd(hu));
  }
}
function pu(e, t, n) {
  var o = new Ui();
  return t = t == null ? 0 : +t, o.restart((i) => {
    o.stop(), e(i + t);
  }, t, n), o;
}
var Ob = pl("start", "end", "cancel", "interrupt"), Db = [], id = 0, gu = 1, Ns = 2, gi = 3, mu = 4, As = 5, mi = 6;
function $r(e, t, n, o, i, r) {
  var s = e.__transition;
  if (!s)
    e.__transition = {};
  else if (n in s)
    return;
  kb(e, n, {
    name: t,
    index: o,
    // For context during callback.
    group: i,
    // For context during callback.
    on: Ob,
    tween: Db,
    time: r.time,
    delay: r.delay,
    duration: r.duration,
    ease: r.ease,
    timer: null,
    state: id
  });
}
function yl(e, t) {
  var n = wt(e, t);
  if (n.state > id)
    throw new Error("too late; already scheduled");
  return n;
}
function Tt(e, t) {
  var n = wt(e, t);
  if (n.state > gi)
    throw new Error("too late; already running");
  return n;
}
function wt(e, t) {
  var n = e.__transition;
  if (!n || !(n = n[t]))
    throw new Error("transition not found");
  return n;
}
function kb(e, t, n) {
  var o = e.__transition, i;
  o[t] = n, n.timer = od(r, 0, n.time);
  function r(u) {
    n.state = gu, n.timer.restart(s, n.delay, n.time), n.delay <= u && s(u - n.delay);
  }
  function s(u) {
    var c, f, d, p;
    if (n.state !== gu)
      return a();
    for (c in o)
      if (p = o[c], p.name === n.name) {
        if (p.state === gi)
          return pu(s);
        p.state === mu ? (p.state = mi, p.timer.stop(), p.on.call("interrupt", e, e.__data__, p.index, p.group), delete o[c]) : +c < t && (p.state = mi, p.timer.stop(), p.on.call("cancel", e, e.__data__, p.index, p.group), delete o[c]);
      }
    if (pu(function() {
      n.state === gi && (n.state = mu, n.timer.restart(l, n.delay, n.time), l(u));
    }), n.state = Ns, n.on.call("start", e, e.__data__, n.index, n.group), n.state === Ns) {
      for (n.state = gi, i = new Array(d = n.tween.length), c = 0, f = -1; c < d; ++c)
        (p = n.tween[c].value.call(e, e.__data__, n.index, n.group)) && (i[++f] = p);
      i.length = f + 1;
    }
  }
  function l(u) {
    for (var c = u < n.duration ? n.ease.call(null, u / n.duration) : (n.timer.restart(a), n.state = As, 1), f = -1, d = i.length; ++f < d; )
      i[f].call(e, c);
    n.state === As && (n.on.call("end", e, e.__data__, n.index, n.group), a());
  }
  function a() {
    n.state = mi, n.timer.stop(), delete o[t];
    for (var u in o)
      return;
    delete e.__transition;
  }
}
function vi(e, t) {
  var n = e.__transition, o, i, r = !0, s;
  if (n) {
    t = t == null ? null : t + "";
    for (s in n) {
      if ((o = n[s]).name !== t) {
        r = !1;
        continue;
      }
      i = o.state > Ns && o.state < As, o.state = mi, o.timer.stop(), o.on.call(i ? "interrupt" : "cancel", e, e.__data__, o.index, o.group), delete n[s];
    }
    r && delete e.__transition;
  }
}
function Rb(e) {
  return this.each(function() {
    vi(this, e);
  });
}
function zb(e, t) {
  var n, o;
  return function() {
    var i = Tt(this, e), r = i.tween;
    if (r !== n) {
      o = n = r;
      for (var s = 0, l = o.length; s < l; ++s)
        if (o[s].name === t) {
          o = o.slice(), o.splice(s, 1);
          break;
        }
    }
    i.tween = o;
  };
}
function Hb(e, t, n) {
  var o, i;
  if (typeof n != "function")
    throw new Error();
  return function() {
    var r = Tt(this, e), s = r.tween;
    if (s !== o) {
      i = (o = s).slice();
      for (var l = { name: t, value: n }, a = 0, u = i.length; a < u; ++a)
        if (i[a].name === t) {
          i[a] = l;
          break;
        }
      a === u && i.push(l);
    }
    r.tween = i;
  };
}
function Fb(e, t) {
  var n = this._id;
  if (e += "", arguments.length < 2) {
    for (var o = wt(this.node(), n).tween, i = 0, r = o.length, s; i < r; ++i)
      if ((s = o[i]).name === e)
        return s.value;
    return null;
  }
  return this.each((t == null ? zb : Hb)(n, e, t));
}
function wl(e, t, n) {
  var o = e._id;
  return e.each(function() {
    var i = Tt(this, o);
    (i.value || (i.value = {}))[t] = n.apply(this, arguments);
  }), function(i) {
    return wt(i, o).value[t];
  };
}
function rd(e, t) {
  var n;
  return (typeof t == "number" ? qt : t instanceof Mo ? cu : (n = Mo(t)) ? (t = n, cu) : wb)(e, t);
}
function Vb(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function Bb(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function Lb(e, t, n) {
  var o, i = n + "", r;
  return function() {
    var s = this.getAttribute(e);
    return s === i ? null : s === o ? r : r = t(o = s, n);
  };
}
function Ub(e, t, n) {
  var o, i = n + "", r;
  return function() {
    var s = this.getAttributeNS(e.space, e.local);
    return s === i ? null : s === o ? r : r = t(o = s, n);
  };
}
function Gb(e, t, n) {
  var o, i, r;
  return function() {
    var s, l = n(this), a;
    return l == null ? void this.removeAttribute(e) : (s = this.getAttribute(e), a = l + "", s === a ? null : s === o && a === i ? r : (i = a, r = t(o = s, l)));
  };
}
function Yb(e, t, n) {
  var o, i, r;
  return function() {
    var s, l = n(this), a;
    return l == null ? void this.removeAttributeNS(e.space, e.local) : (s = this.getAttributeNS(e.space, e.local), a = l + "", s === a ? null : s === o && a === i ? r : (i = a, r = t(o = s, l)));
  };
}
function Wb(e, t) {
  var n = xr(e), o = n === "transform" ? $b : rd;
  return this.attrTween(e, typeof t == "function" ? (n.local ? Yb : Gb)(n, o, wl(this, "attr." + e, t)) : t == null ? (n.local ? Bb : Vb)(n) : (n.local ? Ub : Lb)(n, o, t));
}
function Xb(e, t) {
  return function(n) {
    this.setAttribute(e, t.call(this, n));
  };
}
function Jb(e, t) {
  return function(n) {
    this.setAttributeNS(e.space, e.local, t.call(this, n));
  };
}
function Kb(e, t) {
  var n, o;
  function i() {
    var r = t.apply(this, arguments);
    return r !== o && (n = (o = r) && Jb(e, r)), n;
  }
  return i._value = t, i;
}
function qb(e, t) {
  var n, o;
  function i() {
    var r = t.apply(this, arguments);
    return r !== o && (n = (o = r) && Xb(e, r)), n;
  }
  return i._value = t, i;
}
function Zb(e, t) {
  var n = "attr." + e;
  if (arguments.length < 2)
    return (n = this.tween(n)) && n._value;
  if (t == null)
    return this.tween(n, null);
  if (typeof t != "function")
    throw new Error();
  var o = xr(e);
  return this.tween(n, (o.local ? Kb : qb)(o, t));
}
function Qb(e, t) {
  return function() {
    yl(this, e).delay = +t.apply(this, arguments);
  };
}
function jb(e, t) {
  return t = +t, function() {
    yl(this, e).delay = t;
  };
}
function ex(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? Qb : jb)(t, e)) : wt(this.node(), t).delay;
}
function tx(e, t) {
  return function() {
    Tt(this, e).duration = +t.apply(this, arguments);
  };
}
function nx(e, t) {
  return t = +t, function() {
    Tt(this, e).duration = t;
  };
}
function ox(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? tx : nx)(t, e)) : wt(this.node(), t).duration;
}
function ix(e, t) {
  if (typeof t != "function")
    throw new Error();
  return function() {
    Tt(this, e).ease = t;
  };
}
function rx(e) {
  var t = this._id;
  return arguments.length ? this.each(ix(t, e)) : wt(this.node(), t).ease;
}
function sx(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    if (typeof n != "function")
      throw new Error();
    Tt(this, e).ease = n;
  };
}
function lx(e) {
  if (typeof e != "function")
    throw new Error();
  return this.each(sx(this._id, e));
}
function ax(e) {
  typeof e != "function" && (e = Ff(e));
  for (var t = this._groups, n = t.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = t[i], s = r.length, l = o[i] = [], a, u = 0; u < s; ++u)
      (a = r[u]) && e.call(a, a.__data__, u, r) && l.push(a);
  return new Bt(o, this._parents, this._name, this._id);
}
function ux(e) {
  if (e._id !== this._id)
    throw new Error();
  for (var t = this._groups, n = e._groups, o = t.length, i = n.length, r = Math.min(o, i), s = new Array(o), l = 0; l < r; ++l)
    for (var a = t[l], u = n[l], c = a.length, f = s[l] = new Array(c), d, p = 0; p < c; ++p)
      (d = a[p] || u[p]) && (f[p] = d);
  for (; l < o; ++l)
    s[l] = t[l];
  return new Bt(s, this._parents, this._name, this._id);
}
function cx(e) {
  return (e + "").trim().split(/^|\s+/).every(function(t) {
    var n = t.indexOf(".");
    return n >= 0 && (t = t.slice(0, n)), !t || t === "start";
  });
}
function fx(e, t, n) {
  var o, i, r = cx(t) ? yl : Tt;
  return function() {
    var s = r(this, e), l = s.on;
    l !== o && (i = (o = l).copy()).on(t, n), s.on = i;
  };
}
function dx(e, t) {
  var n = this._id;
  return arguments.length < 2 ? wt(this.node(), n).on.on(e) : this.each(fx(n, e, t));
}
function hx(e) {
  return function() {
    var t = this.parentNode;
    for (var n in this.__transition)
      if (+n !== e)
        return;
    t && t.removeChild(this);
  };
}
function px() {
  return this.on("end.remove", hx(this._id));
}
function gx(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = gl(e));
  for (var o = this._groups, i = o.length, r = new Array(i), s = 0; s < i; ++s)
    for (var l = o[s], a = l.length, u = r[s] = new Array(a), c, f, d = 0; d < a; ++d)
      (c = l[d]) && (f = e.call(c, c.__data__, d, l)) && ("__data__" in c && (f.__data__ = c.__data__), u[d] = f, $r(u[d], t, n, d, u, wt(c, n)));
  return new Bt(r, this._parents, t, n);
}
function mx(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = Hf(e));
  for (var o = this._groups, i = o.length, r = [], s = [], l = 0; l < i; ++l)
    for (var a = o[l], u = a.length, c, f = 0; f < u; ++f)
      if (c = a[f]) {
        for (var d = e.call(c, c.__data__, f, a), p, E = wt(c, n), m = 0, _ = d.length; m < _; ++m)
          (p = d[m]) && $r(p, t, n, m, d, E);
        r.push(d), s.push(c);
      }
  return new Bt(r, s, t, n);
}
var vx = Ho.prototype.constructor;
function _x() {
  return new vx(this._groups, this._parents);
}
function yx(e, t) {
  var n, o, i;
  return function() {
    var r = Gn(this, e), s = (this.style.removeProperty(e), Gn(this, e));
    return r === s ? null : r === n && s === o ? i : i = t(n = r, o = s);
  };
}
function sd(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function wx(e, t, n) {
  var o, i = n + "", r;
  return function() {
    var s = Gn(this, e);
    return s === i ? null : s === o ? r : r = t(o = s, n);
  };
}
function bx(e, t, n) {
  var o, i, r;
  return function() {
    var s = Gn(this, e), l = n(this), a = l + "";
    return l == null && (a = l = (this.style.removeProperty(e), Gn(this, e))), s === a ? null : s === o && a === i ? r : (i = a, r = t(o = s, l));
  };
}
function xx(e, t) {
  var n, o, i, r = "style." + t, s = "end." + r, l;
  return function() {
    var a = Tt(this, e), u = a.on, c = a.value[r] == null ? l || (l = sd(t)) : void 0;
    (u !== n || i !== c) && (o = (n = u).copy()).on(s, i = c), a.on = o;
  };
}
function Ex(e, t, n) {
  var o = (e += "") == "transform" ? Eb : rd;
  return t == null ? this.styleTween(e, yx(e, o)).on("end.style." + e, sd(e)) : typeof t == "function" ? this.styleTween(e, bx(e, o, wl(this, "style." + e, t))).each(xx(this._id, e)) : this.styleTween(e, wx(e, o, t), n).on("end.style." + e, null);
}
function $x(e, t, n) {
  return function(o) {
    this.style.setProperty(e, t.call(this, o), n);
  };
}
function Cx(e, t, n) {
  var o, i;
  function r() {
    var s = t.apply(this, arguments);
    return s !== i && (o = (i = s) && $x(e, s, n)), o;
  }
  return r._value = t, r;
}
function Sx(e, t, n) {
  var o = "style." + (e += "");
  if (arguments.length < 2)
    return (o = this.tween(o)) && o._value;
  if (t == null)
    return this.tween(o, null);
  if (typeof t != "function")
    throw new Error();
  return this.tween(o, Cx(e, t, n ?? ""));
}
function Nx(e) {
  return function() {
    this.textContent = e;
  };
}
function Ax(e) {
  return function() {
    var t = e(this);
    this.textContent = t ?? "";
  };
}
function Mx(e) {
  return this.tween("text", typeof e == "function" ? Ax(wl(this, "text", e)) : Nx(e == null ? "" : e + ""));
}
function Px(e) {
  return function(t) {
    this.textContent = e.call(this, t);
  };
}
function Tx(e) {
  var t, n;
  function o() {
    var i = e.apply(this, arguments);
    return i !== n && (t = (n = i) && Px(i)), t;
  }
  return o._value = e, o;
}
function Ix(e) {
  var t = "text";
  if (arguments.length < 1)
    return (t = this.tween(t)) && t._value;
  if (e == null)
    return this.tween(t, null);
  if (typeof e != "function")
    throw new Error();
  return this.tween(t, Tx(e));
}
function Ox() {
  for (var e = this._name, t = this._id, n = ld(), o = this._groups, i = o.length, r = 0; r < i; ++r)
    for (var s = o[r], l = s.length, a, u = 0; u < l; ++u)
      if (a = s[u]) {
        var c = wt(a, t);
        $r(a, e, n, u, s, {
          time: c.time + c.delay + c.duration,
          delay: 0,
          duration: c.duration,
          ease: c.ease
        });
      }
  return new Bt(o, this._parents, e, n);
}
function Dx() {
  var e, t, n = this, o = n._id, i = n.size();
  return new Promise(function(r, s) {
    var l = { value: s }, a = { value: function() {
      --i === 0 && r();
    } };
    n.each(function() {
      var u = Tt(this, o), c = u.on;
      c !== e && (t = (e = c).copy(), t._.cancel.push(l), t._.interrupt.push(l), t._.end.push(a)), u.on = t;
    }), i === 0 && r();
  });
}
var kx = 0;
function Bt(e, t, n, o) {
  this._groups = e, this._parents = t, this._name = n, this._id = o;
}
function ld() {
  return ++kx;
}
var Ot = Ho.prototype;
Bt.prototype = {
  constructor: Bt,
  select: gx,
  selectAll: mx,
  selectChild: Ot.selectChild,
  selectChildren: Ot.selectChildren,
  filter: ax,
  merge: ux,
  selection: _x,
  transition: Ox,
  call: Ot.call,
  nodes: Ot.nodes,
  node: Ot.node,
  size: Ot.size,
  empty: Ot.empty,
  each: Ot.each,
  on: dx,
  attr: Wb,
  attrTween: Zb,
  style: Ex,
  styleTween: Sx,
  text: Mx,
  textTween: Ix,
  remove: px,
  tween: Fb,
  delay: ex,
  duration: ox,
  ease: rx,
  easeVarying: lx,
  end: Dx,
  [Symbol.iterator]: Ot[Symbol.iterator]
};
function Rx(e) {
  return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
var zx = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: Rx
};
function Hx(e, t) {
  for (var n; !(n = e.__transition) || !(n = n[t]); )
    if (!(e = e.parentNode))
      throw new Error(`transition ${t} not found`);
  return n;
}
function Fx(e) {
  var t, n;
  e instanceof Bt ? (t = e._id, e = e._name) : (t = ld(), (n = zx).time = _l(), e = e == null ? null : e + "");
  for (var o = this._groups, i = o.length, r = 0; r < i; ++r)
    for (var s = o[r], l = s.length, a, u = 0; u < l; ++u)
      (a = s[u]) && $r(a, e, t, u, s, n || Hx(a, t));
  return new Bt(o, this._parents, e, t);
}
Ho.prototype.interrupt = Rb;
Ho.prototype.transition = Fx;
const ri = (e) => () => e;
function Vx(e, {
  sourceEvent: t,
  target: n,
  transform: o,
  dispatch: i
}) {
  Object.defineProperties(this, {
    type: { value: e, enumerable: !0, configurable: !0 },
    sourceEvent: { value: t, enumerable: !0, configurable: !0 },
    target: { value: n, enumerable: !0, configurable: !0 },
    transform: { value: o, enumerable: !0, configurable: !0 },
    _: { value: i }
  });
}
function Rt(e, t, n) {
  this.k = e, this.x = t, this.y = n;
}
Rt.prototype = {
  constructor: Rt,
  scale: function(e) {
    return e === 1 ? this : new Rt(this.k * e, this.x, this.y);
  },
  translate: function(e, t) {
    return e === 0 & t === 0 ? this : new Rt(this.k, this.x + this.k * e, this.y + this.k * t);
  },
  apply: function(e) {
    return [e[0] * this.k + this.x, e[1] * this.k + this.y];
  },
  applyX: function(e) {
    return e * this.k + this.x;
  },
  applyY: function(e) {
    return e * this.k + this.y;
  },
  invert: function(e) {
    return [(e[0] - this.x) / this.k, (e[1] - this.y) / this.k];
  },
  invertX: function(e) {
    return (e - this.x) / this.k;
  },
  invertY: function(e) {
    return (e - this.y) / this.k;
  },
  rescaleX: function(e) {
    return e.copy().domain(e.range().map(this.invertX, this).map(e.invert, e));
  },
  rescaleY: function(e) {
    return e.copy().domain(e.range().map(this.invertY, this).map(e.invert, e));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};
var bl = new Rt(1, 0, 0);
Rt.prototype;
function Yr(e) {
  e.stopImmediatePropagation();
}
function jn(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function Bx(e) {
  return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function Lx() {
  var e = this;
  return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function vu() {
  return this.__zoom || bl;
}
function Ux(e) {
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * (e.ctrlKey ? 10 : 1);
}
function Gx() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Yx(e, t, n) {
  var o = e.invertX(t[0][0]) - n[0][0], i = e.invertX(t[1][0]) - n[1][0], r = e.invertY(t[0][1]) - n[0][1], s = e.invertY(t[1][1]) - n[1][1];
  return e.translate(
    i > o ? (o + i) / 2 : Math.min(0, o) || Math.max(0, i),
    s > r ? (r + s) / 2 : Math.min(0, r) || Math.max(0, s)
  );
}
function Wx() {
  var e = Bx, t = Lx, n = Yx, o = Ux, i = Gx, r = [0, 1 / 0], s = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], l = 250, a = Ab, u = pl("start", "zoom", "end"), c, f, d, p = 500, E = 150, m = 0, _ = 10;
  function b(g) {
    g.property("__zoom", vu).on("wheel.zoom", V, { passive: !1 }).on("mousedown.zoom", X).on("dblclick.zoom", Y).filter(i).on("touchstart.zoom", W).on("touchmove.zoom", le).on("touchend.zoom touchcancel.zoom", K).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  b.transform = function(g, R, w, P) {
    var I = g.selection ? g.selection() : g;
    I.property("__zoom", vu), g !== I ? D(g, R, w, P) : I.interrupt().each(function() {
      O(this, arguments).event(P).start().zoom(null, typeof R == "function" ? R.apply(this, arguments) : R).end();
    });
  }, b.scaleBy = function(g, R, w, P) {
    b.scaleTo(g, function() {
      var I = this.__zoom.k, T = typeof R == "function" ? R.apply(this, arguments) : R;
      return I * T;
    }, w, P);
  }, b.scaleTo = function(g, R, w, P) {
    b.transform(g, function() {
      var I = t.apply(this, arguments), T = this.__zoom, M = w == null ? y(I) : typeof w == "function" ? w.apply(this, arguments) : w, U = T.invert(M), q = typeof R == "function" ? R.apply(this, arguments) : R;
      return n(N(C(T, q), M, U), I, s);
    }, w, P);
  }, b.translateBy = function(g, R, w, P) {
    b.transform(g, function() {
      return n(this.__zoom.translate(
        typeof R == "function" ? R.apply(this, arguments) : R,
        typeof w == "function" ? w.apply(this, arguments) : w
      ), t.apply(this, arguments), s);
    }, null, P);
  }, b.translateTo = function(g, R, w, P, I) {
    b.transform(g, function() {
      var T = t.apply(this, arguments), M = this.__zoom, U = P == null ? y(T) : typeof P == "function" ? P.apply(this, arguments) : P;
      return n(bl.translate(U[0], U[1]).scale(M.k).translate(
        typeof R == "function" ? -R.apply(this, arguments) : -R,
        typeof w == "function" ? -w.apply(this, arguments) : -w
      ), T, s);
    }, P, I);
  };
  function C(g, R) {
    return R = Math.max(r[0], Math.min(r[1], R)), R === g.k ? g : new Rt(R, g.x, g.y);
  }
  function N(g, R, w) {
    var P = R[0] - w[0] * g.k, I = R[1] - w[1] * g.k;
    return P === g.x && I === g.y ? g : new Rt(g.k, P, I);
  }
  function y(g) {
    return [(+g[0][0] + +g[1][0]) / 2, (+g[0][1] + +g[1][1]) / 2];
  }
  function D(g, R, w, P) {
    g.on("start.zoom", function() {
      O(this, arguments).event(P).start();
    }).on("interrupt.zoom end.zoom", function() {
      O(this, arguments).event(P).end();
    }).tween("zoom", function() {
      var I = this, T = arguments, M = O(I, T).event(P), U = t.apply(I, T), q = w == null ? y(U) : typeof w == "function" ? w.apply(I, T) : w, Z = Math.max(U[1][0] - U[0][0], U[1][1] - U[0][1]), J = I.__zoom, se = typeof R == "function" ? R.apply(I, T) : R, L = a(J.invert(q).concat(Z / J.k), se.invert(q).concat(Z / se.k));
      return function(ae) {
        if (ae === 1)
          ae = se;
        else {
          var j = L(ae), ne = Z / j[2];
          ae = new Rt(ne, q[0] - j[0] * ne, q[1] - j[1] * ne);
        }
        M.zoom(null, ae);
      };
    });
  }
  function O(g, R, w) {
    return !w && g.__zooming || new S(g, R);
  }
  function S(g, R) {
    this.that = g, this.args = R, this.active = 0, this.sourceEvent = null, this.extent = t.apply(g, R), this.taps = 0;
  }
  S.prototype = {
    event: function(g) {
      return g && (this.sourceEvent = g), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(g, R) {
      return this.mouse && g !== "mouse" && (this.mouse[1] = R.invert(this.mouse[0])), this.touch0 && g !== "touch" && (this.touch0[1] = R.invert(this.touch0[0])), this.touch1 && g !== "touch" && (this.touch1[1] = R.invert(this.touch1[0])), this.that.__zoom = R, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(g) {
      var R = Qt(this.that).datum();
      u.call(
        g,
        this.that,
        new Vx(g, {
          sourceEvent: this.sourceEvent,
          target: b,
          type: g,
          transform: this.that.__zoom,
          dispatch: u
        }),
        R
      );
    }
  };
  function V(g, ...R) {
    if (!e.apply(this, arguments))
      return;
    var w = O(this, R).event(g), P = this.__zoom, I = Math.max(r[0], Math.min(r[1], P.k * Math.pow(2, o.apply(this, arguments)))), T = Yt(g);
    if (w.wheel)
      (w.mouse[0][0] !== T[0] || w.mouse[0][1] !== T[1]) && (w.mouse[1] = P.invert(w.mouse[0] = T)), clearTimeout(w.wheel);
    else {
      if (P.k === I)
        return;
      w.mouse = [T, P.invert(T)], vi(this), w.start();
    }
    jn(g), w.wheel = setTimeout(M, E), w.zoom("mouse", n(N(C(P, I), w.mouse[0], w.mouse[1]), w.extent, s));
    function M() {
      w.wheel = null, w.end();
    }
  }
  function X(g, ...R) {
    if (d || !e.apply(this, arguments))
      return;
    var w = g.currentTarget, P = O(this, R, !0).event(g), I = Qt(g.view).on("mousemove.zoom", q, !0).on("mouseup.zoom", Z, !0), T = Yt(g, w), M = g.clientX, U = g.clientY;
    tb(g.view), Yr(g), P.mouse = [T, this.__zoom.invert(T)], vi(this), P.start();
    function q(J) {
      if (jn(J), !P.moved) {
        var se = J.clientX - M, L = J.clientY - U;
        P.moved = se * se + L * L > m;
      }
      P.event(J).zoom("mouse", n(N(P.that.__zoom, P.mouse[0] = Yt(J, w), P.mouse[1]), P.extent, s));
    }
    function Z(J) {
      I.on("mousemove.zoom mouseup.zoom", null), nb(J.view, P.moved), jn(J), P.event(J).end();
    }
  }
  function Y(g, ...R) {
    if (e.apply(this, arguments)) {
      var w = this.__zoom, P = Yt(g.changedTouches ? g.changedTouches[0] : g, this), I = w.invert(P), T = w.k * (g.shiftKey ? 0.5 : 2), M = n(N(C(w, T), P, I), t.apply(this, R), s);
      jn(g), l > 0 ? Qt(this).transition().duration(l).call(D, M, P, g) : Qt(this).call(b.transform, M, P, g);
    }
  }
  function W(g, ...R) {
    if (e.apply(this, arguments)) {
      var w = g.touches, P = w.length, I = O(this, R, g.changedTouches.length === P).event(g), T, M, U, q;
      for (Yr(g), M = 0; M < P; ++M)
        U = w[M], q = Yt(U, this), q = [q, this.__zoom.invert(q), U.identifier], I.touch0 ? !I.touch1 && I.touch0[2] !== q[2] && (I.touch1 = q, I.taps = 0) : (I.touch0 = q, T = !0, I.taps = 1 + !!c);
      c && (c = clearTimeout(c)), T && (I.taps < 2 && (f = q[0], c = setTimeout(function() {
        c = null;
      }, p)), vi(this), I.start());
    }
  }
  function le(g, ...R) {
    if (this.__zooming) {
      var w = O(this, R).event(g), P = g.changedTouches, I = P.length, T, M, U, q;
      for (jn(g), T = 0; T < I; ++T)
        M = P[T], U = Yt(M, this), w.touch0 && w.touch0[2] === M.identifier ? w.touch0[0] = U : w.touch1 && w.touch1[2] === M.identifier && (w.touch1[0] = U);
      if (M = w.that.__zoom, w.touch1) {
        var Z = w.touch0[0], J = w.touch0[1], se = w.touch1[0], L = w.touch1[1], ae = (ae = se[0] - Z[0]) * ae + (ae = se[1] - Z[1]) * ae, j = (j = L[0] - J[0]) * j + (j = L[1] - J[1]) * j;
        M = C(M, Math.sqrt(ae / j)), U = [(Z[0] + se[0]) / 2, (Z[1] + se[1]) / 2], q = [(J[0] + L[0]) / 2, (J[1] + L[1]) / 2];
      } else if (w.touch0)
        U = w.touch0[0], q = w.touch0[1];
      else
        return;
      w.zoom("touch", n(N(M, U, q), w.extent, s));
    }
  }
  function K(g, ...R) {
    if (this.__zooming) {
      var w = O(this, R).event(g), P = g.changedTouches, I = P.length, T, M;
      for (Yr(g), d && clearTimeout(d), d = setTimeout(function() {
        d = null;
      }, p), T = 0; T < I; ++T)
        M = P[T], w.touch0 && w.touch0[2] === M.identifier ? delete w.touch0 : w.touch1 && w.touch1[2] === M.identifier && delete w.touch1;
      if (w.touch1 && !w.touch0 && (w.touch0 = w.touch1, delete w.touch1), w.touch0)
        w.touch0[1] = this.__zoom.invert(w.touch0[0]);
      else if (w.end(), w.taps === 2 && (M = Yt(M, this), Math.hypot(f[0] - M[0], f[1] - M[1]) < _)) {
        var U = Qt(this).on("dblclick.zoom");
        U && U.apply(this, arguments);
      }
    }
  }
  return b.wheelDelta = function(g) {
    return arguments.length ? (o = typeof g == "function" ? g : ri(+g), b) : o;
  }, b.filter = function(g) {
    return arguments.length ? (e = typeof g == "function" ? g : ri(!!g), b) : e;
  }, b.touchable = function(g) {
    return arguments.length ? (i = typeof g == "function" ? g : ri(!!g), b) : i;
  }, b.extent = function(g) {
    return arguments.length ? (t = typeof g == "function" ? g : ri([[+g[0][0], +g[0][1]], [+g[1][0], +g[1][1]]]), b) : t;
  }, b.scaleExtent = function(g) {
    return arguments.length ? (r[0] = +g[0], r[1] = +g[1], b) : [r[0], r[1]];
  }, b.translateExtent = function(g) {
    return arguments.length ? (s[0][0] = +g[0][0], s[1][0] = +g[1][0], s[0][1] = +g[0][1], s[1][1] = +g[1][1], b) : [[s[0][0], s[0][1]], [s[1][0], s[1][1]]];
  }, b.constrain = function(g) {
    return arguments.length ? (n = g, b) : n;
  }, b.duration = function(g) {
    return arguments.length ? (l = +g, b) : l;
  }, b.interpolate = function(g) {
    return arguments.length ? (a = g, b) : a;
  }, b.on = function() {
    var g = u.on.apply(u, arguments);
    return g === u ? b : g;
  }, b.clickDistance = function(g) {
    return arguments.length ? (m = (g = +g) * g, b) : Math.sqrt(m);
  }, b.tapDistance = function(g) {
    return arguments.length ? (_ = +g, b) : _;
  }, b;
}
const ad = Symbol("MiniMapSlots"), Xx = ["id", "x", "y", "rx", "ry", "width", "height", "fill", "stroke", "stroke-width", "shape-rendering"], Jx = {
  name: "MiniMapNode",
  compatConfig: { MODE: 3 }
}, Kx = /* @__PURE__ */ Se({
  ...Jx,
  props: {
    id: {},
    type: {},
    selected: { type: Boolean },
    dragging: { type: Boolean },
    position: {},
    dimensions: {},
    borderRadius: {},
    color: {},
    shapeRendering: {},
    strokeColor: {},
    strokeWidth: {}
  },
  emits: ["click", "dblclick", "mouseenter", "mousemove", "mouseleave"],
  setup(e, { emit: t }) {
    const n = e, o = lt(ad), i = Js(), r = ke(() => i.style ?? {});
    function s(f) {
      t("click", f);
    }
    function l(f) {
      t("dblclick", f);
    }
    function a(f) {
      t("mouseenter", f);
    }
    function u(f) {
      t("mousemove", f);
    }
    function c(f) {
      t("mouseleave", f);
    }
    return (f, d) => G(o)[`node-${n.type}`] ? (re(), Ve(an(G(o)[`node-${n.type}`]), Od(rr({ key: 0 }, n)), null, 16)) : (re(), pe("rect", {
      key: 1,
      id: f.id,
      class: We(["vue-flow__minimap-node", { selected: f.selected, dragging: f.dragging }]),
      x: f.position.x,
      y: f.position.y,
      rx: f.borderRadius,
      ry: f.borderRadius,
      width: f.dimensions.width,
      height: f.dimensions.height,
      fill: f.color || r.value.background || r.value.backgroundColor,
      stroke: f.strokeColor,
      "stroke-width": f.strokeWidth,
      "shape-rendering": f.shapeRendering,
      onClick: s,
      onDblclick: l,
      onMouseenter: a,
      onMousemove: u,
      onMouseleave: c
    }, null, 42, Xx));
  }
}), qx = ["width", "height", "viewBox", "aria-labelledby"], Zx = ["id"], Qx = ["d", "fill", "stroke", "stroke-width"], jx = {
  name: "MiniMap",
  compatConfig: { MODE: 3 }
}, eE = /* @__PURE__ */ Se({
  ...jx,
  props: {
    nodeColor: { type: [String, Function], default: "#e2e2e2" },
    nodeStrokeColor: { type: [String, Function], default: "transparent" },
    nodeClassName: { type: [String, Function] },
    nodeBorderRadius: { default: 5 },
    nodeStrokeWidth: { default: 2 },
    maskColor: { default: "rgb(240, 240, 240, 0.6)" },
    maskStrokeColor: { default: "none" },
    maskStrokeWidth: { default: 1 },
    position: { default: "bottom-right" },
    pannable: { type: Boolean, default: !1 },
    zoomable: { type: Boolean, default: !1 },
    width: {},
    height: {},
    ariaLabel: { default: "Vue Flow mini map" },
    inversePan: { type: Boolean, default: !1 },
    zoomStep: { default: 10 },
    offsetScale: { default: 5 }
  },
  emits: ["click", "nodeClick", "nodeDblclick", "nodeMouseenter", "nodeMousemove", "nodeMouseleave"],
  setup(e, { emit: t }) {
    const n = cc(), o = Js(), i = 200, r = 150, { id: s, edges: l, viewport: a, translateExtent: u, dimensions: c, emits: f, d3Selection: d, d3Zoom: p, getNodesInitialized: E } = Ee(), m = be();
    en(ad, n);
    const _ = ke(() => {
      var I;
      return e.width ?? ((I = o.style) == null ? void 0 : I.width) ?? i;
    }), b = ke(() => {
      var I;
      return e.height ?? ((I = o.style) == null ? void 0 : I.height) ?? r;
    }), C = typeof window > "u" || window.chrome ? "crispEdges" : "geometricPrecision", N = he(() => typeof e.nodeColor == "string" ? () => e.nodeColor : e.nodeColor), y = he(
      () => typeof e.nodeStrokeColor == "string" ? () => e.nodeStrokeColor : e.nodeStrokeColor
    ), D = he(
      () => typeof e.nodeClassName == "string" ? () => e.nodeClassName : typeof e.nodeClassName == "function" ? e.nodeClassName : () => ""
    ), O = he(() => mr(E.value)), S = he(() => ({
      x: -a.value.x / a.value.zoom,
      y: -a.value.y / a.value.zoom,
      width: c.value.width / a.value.zoom,
      height: c.value.height / a.value.zoom
    })), V = he(
      () => E.value && E.value.length ? n_(O.value, S.value) : S.value
    ), X = he(() => {
      const I = V.value.width / _.value, T = V.value.height / b.value;
      return Math.max(I, T);
    }), Y = he(() => {
      const I = X.value * _.value, T = X.value * b.value, M = e.offsetScale * X.value;
      return {
        offset: M,
        x: V.value.x - (I - V.value.width) / 2 - M,
        y: V.value.y - (T - V.value.height) / 2 - M,
        width: I + M * 2,
        height: T + M * 2
      };
    }), W = he(() => !Y.value.x || !Y.value.y ? "" : `
    M${Y.value.x - Y.value.offset},${Y.value.y - Y.value.offset}
    h${Y.value.width + Y.value.offset * 2}
    v${Y.value.height + Y.value.offset * 2}
    h${-Y.value.width - Y.value.offset * 2}z
    M${S.value.x},${S.value.y}
    h${S.value.width}
    v${S.value.height}
    h${-S.value.width}z`);
    ic(
      (I) => {
        if (m.value) {
          const T = Qt(m.value), M = (Z) => {
            if (Z.sourceEvent.type !== "wheel" || !d.value || !p.value)
              return;
            const J = -Z.sourceEvent.deltaY * (Z.sourceEvent.deltaMode === 1 ? 0.05 : Z.sourceEvent.deltaMode ? 1 : 2e-3) * e.zoomStep, se = a.value.zoom * 2 ** J;
            p.value.scaleTo(d.value, se);
          }, U = (Z) => {
            if (Z.sourceEvent.type !== "mousemove" || !d.value || !p.value)
              return;
            const J = X.value * Math.max(1, a.value.zoom) * (e.inversePan ? -1 : 1), se = {
              x: a.value.x - Z.sourceEvent.movementX * J,
              y: a.value.y - Z.sourceEvent.movementY * J
            }, L = [
              [0, 0],
              [c.value.width, c.value.height]
            ], ae = bl.translate(se.x, se.y).scale(a.value.zoom), j = p.value.constrain()(ae, L, u.value);
            p.value.transform(d.value, j);
          }, q = Wx().on("zoom", e.pannable ? U : () => {
          }).on("zoom.wheel", e.zoomable ? M : () => {
          });
          T.call(q), I(() => {
            T.on("zoom", null);
          });
        }
      },
      { flush: "post" }
    );
    function le(I) {
      const [T, M] = Yt(I);
      t("click", { event: I, position: { x: T, y: M } });
    }
    function K(I, T) {
      const M = { event: I, node: T, connectedEdges: Zt([T], l.value) };
      f.miniMapNodeClick(M), t("nodeClick", M);
    }
    function g(I, T) {
      const M = { event: I, node: T, connectedEdges: Zt([T], l.value) };
      f.miniMapNodeDoubleClick(M), t("nodeDblclick", M);
    }
    function R(I, T) {
      const M = { event: I, node: T, connectedEdges: Zt([T], l.value) };
      f.miniMapNodeMouseEnter(M), t("nodeMouseenter", M);
    }
    function w(I, T) {
      const M = { event: I, node: T, connectedEdges: Zt([T], l.value) };
      f.miniMapNodeMouseMove(M), t("nodeMousemove", M);
    }
    function P(I, T) {
      const M = { event: I, node: T, connectedEdges: Zt([T], l.value) };
      f.miniMapNodeMouseLeave(M), t("nodeMouseleave", M);
    }
    return (I, T) => (re(), Ve(G(Rf), {
      position: I.position,
      class: We(["vue-flow__minimap", { pannable: I.pannable, zoomable: I.zoomable }])
    }, {
      default: Qe(() => [
        (re(), pe("svg", {
          ref_key: "el",
          ref: m,
          width: _.value,
          height: b.value,
          viewBox: [Y.value.x, Y.value.y, Y.value.width, Y.value.height].join(" "),
          role: "img",
          "aria-labelledby": `vue-flow__minimap-${G(s)}`,
          onClick: le
        }, [
          I.ariaLabel ? (re(), pe("title", {
            key: 0,
            id: `vue-flow__minimap-${G(s)}`
          }, wi(I.ariaLabel), 9, Zx)) : He("", !0),
          (re(!0), pe(Me, null, Fn(G(E), (M) => (re(), Ve(Kx, {
            id: M.id,
            key: M.id,
            position: M.computedPosition,
            dimensions: M.dimensions,
            selected: M.selected,
            dragging: M.dragging,
            style: ze(M.style),
            class: We(D.value(M)),
            color: N.value(M),
            "border-radius": I.nodeBorderRadius,
            "stroke-color": y.value(M),
            "stroke-width": I.nodeStrokeWidth,
            "shape-rendering": G(C),
            type: M.type,
            onClick: (U) => K(U, M),
            onDblclick: (U) => g(U, M),
            onMouseenter: (U) => R(U, M),
            onMousemove: (U) => w(U, M),
            onMouseleave: (U) => P(U, M)
          }, null, 8, ["id", "position", "dimensions", "selected", "dragging", "style", "class", "color", "border-radius", "stroke-color", "stroke-width", "shape-rendering", "type", "onClick", "onDblclick", "onMouseenter", "onMousemove", "onMouseleave"]))), 128)),
          Ce("path", {
            class: "vue-flow__minimap-mask",
            d: W.value,
            fill: I.maskColor,
            stroke: I.maskStrokeColor,
            "stroke-width": I.maskStrokeWidth,
            "fill-rule": "evenodd"
          }, null, 8, Qx)
        ], 8, qx))
      ]),
      _: 1
    }, 8, ["position", "class"]));
  }
});
var Ms = "http://www.w3.org/1999/xhtml";
const _u = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: Ms,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function ud(e) {
  var t = e += "", n = t.indexOf(":");
  return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), _u.hasOwnProperty(t) ? { space: _u[t], local: e } : e;
}
function tE(e) {
  return function() {
    var t = this.ownerDocument, n = this.namespaceURI;
    return n === Ms && t.documentElement.namespaceURI === Ms ? t.createElement(e) : t.createElementNS(n, e);
  };
}
function nE(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function cd(e) {
  var t = ud(e);
  return (t.local ? nE : tE)(t);
}
function oE() {
}
function fd(e) {
  return e == null ? oE : function() {
    return this.querySelector(e);
  };
}
function iE(e) {
  typeof e != "function" && (e = fd(e));
  for (var t = this._groups, n = t.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = t[i], s = r.length, l = o[i] = new Array(s), a, u, c = 0; c < s; ++c)
      (a = r[c]) && (u = e.call(a, a.__data__, c, r)) && ("__data__" in a && (u.__data__ = a.__data__), l[c] = u);
  return new dt(o, this._parents);
}
function rE(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function sE() {
  return [];
}
function lE(e) {
  return e == null ? sE : function() {
    return this.querySelectorAll(e);
  };
}
function aE(e) {
  return function() {
    return rE(e.apply(this, arguments));
  };
}
function uE(e) {
  typeof e == "function" ? e = aE(e) : e = lE(e);
  for (var t = this._groups, n = t.length, o = [], i = [], r = 0; r < n; ++r)
    for (var s = t[r], l = s.length, a, u = 0; u < l; ++u)
      (a = s[u]) && (o.push(e.call(a, a.__data__, u, s)), i.push(a));
  return new dt(o, i);
}
function cE(e) {
  return function() {
    return this.matches(e);
  };
}
function dd(e) {
  return function(t) {
    return t.matches(e);
  };
}
var fE = Array.prototype.find;
function dE(e) {
  return function() {
    return fE.call(this.children, e);
  };
}
function hE() {
  return this.firstElementChild;
}
function pE(e) {
  return this.select(e == null ? hE : dE(typeof e == "function" ? e : dd(e)));
}
var gE = Array.prototype.filter;
function mE() {
  return Array.from(this.children);
}
function vE(e) {
  return function() {
    return gE.call(this.children, e);
  };
}
function _E(e) {
  return this.selectAll(e == null ? mE : vE(typeof e == "function" ? e : dd(e)));
}
function yE(e) {
  typeof e != "function" && (e = cE(e));
  for (var t = this._groups, n = t.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = t[i], s = r.length, l = o[i] = [], a, u = 0; u < s; ++u)
      (a = r[u]) && e.call(a, a.__data__, u, r) && l.push(a);
  return new dt(o, this._parents);
}
function hd(e) {
  return new Array(e.length);
}
function wE() {
  return new dt(this._enter || this._groups.map(hd), this._parents);
}
function Gi(e, t) {
  this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
Gi.prototype = {
  constructor: Gi,
  appendChild: function(e) {
    return this._parent.insertBefore(e, this._next);
  },
  insertBefore: function(e, t) {
    return this._parent.insertBefore(e, t);
  },
  querySelector: function(e) {
    return this._parent.querySelector(e);
  },
  querySelectorAll: function(e) {
    return this._parent.querySelectorAll(e);
  }
};
function bE(e) {
  return function() {
    return e;
  };
}
function xE(e, t, n, o, i, r) {
  for (var s = 0, l, a = t.length, u = r.length; s < u; ++s)
    (l = t[s]) ? (l.__data__ = r[s], o[s] = l) : n[s] = new Gi(e, r[s]);
  for (; s < a; ++s)
    (l = t[s]) && (i[s] = l);
}
function EE(e, t, n, o, i, r, s) {
  var l, a, u = /* @__PURE__ */ new Map(), c = t.length, f = r.length, d = new Array(c), p;
  for (l = 0; l < c; ++l)
    (a = t[l]) && (d[l] = p = s.call(a, a.__data__, l, t) + "", u.has(p) ? i[l] = a : u.set(p, a));
  for (l = 0; l < f; ++l)
    p = s.call(e, r[l], l, r) + "", (a = u.get(p)) ? (o[l] = a, a.__data__ = r[l], u.delete(p)) : n[l] = new Gi(e, r[l]);
  for (l = 0; l < c; ++l)
    (a = t[l]) && u.get(d[l]) === a && (i[l] = a);
}
function $E(e) {
  return e.__data__;
}
function CE(e, t) {
  if (!arguments.length)
    return Array.from(this, $E);
  var n = t ? EE : xE, o = this._parents, i = this._groups;
  typeof e != "function" && (e = bE(e));
  for (var r = i.length, s = new Array(r), l = new Array(r), a = new Array(r), u = 0; u < r; ++u) {
    var c = o[u], f = i[u], d = f.length, p = SE(e.call(c, c && c.__data__, u, o)), E = p.length, m = l[u] = new Array(E), _ = s[u] = new Array(E), b = a[u] = new Array(d);
    n(c, f, m, _, b, p, t);
    for (var C = 0, N = 0, y, D; C < E; ++C)
      if (y = m[C]) {
        for (C >= N && (N = C + 1); !(D = _[N]) && ++N < E; )
          ;
        y._next = D || null;
      }
  }
  return s = new dt(s, o), s._enter = l, s._exit = a, s;
}
function SE(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function NE() {
  return new dt(this._exit || this._groups.map(hd), this._parents);
}
function AE(e, t, n) {
  var o = this.enter(), i = this, r = this.exit();
  return typeof e == "function" ? (o = e(o), o && (o = o.selection())) : o = o.append(e + ""), t != null && (i = t(i), i && (i = i.selection())), n == null ? r.remove() : n(r), o && i ? o.merge(i).order() : i;
}
function ME(e) {
  for (var t = e.selection ? e.selection() : e, n = this._groups, o = t._groups, i = n.length, r = o.length, s = Math.min(i, r), l = new Array(i), a = 0; a < s; ++a)
    for (var u = n[a], c = o[a], f = u.length, d = l[a] = new Array(f), p, E = 0; E < f; ++E)
      (p = u[E] || c[E]) && (d[E] = p);
  for (; a < i; ++a)
    l[a] = n[a];
  return new dt(l, this._parents);
}
function PE() {
  for (var e = this._groups, t = -1, n = e.length; ++t < n; )
    for (var o = e[t], i = o.length - 1, r = o[i], s; --i >= 0; )
      (s = o[i]) && (r && s.compareDocumentPosition(r) ^ 4 && r.parentNode.insertBefore(s, r), r = s);
  return this;
}
function TE(e) {
  e || (e = IE);
  function t(f, d) {
    return f && d ? e(f.__data__, d.__data__) : !f - !d;
  }
  for (var n = this._groups, o = n.length, i = new Array(o), r = 0; r < o; ++r) {
    for (var s = n[r], l = s.length, a = i[r] = new Array(l), u, c = 0; c < l; ++c)
      (u = s[c]) && (a[c] = u);
    a.sort(t);
  }
  return new dt(i, this._parents).order();
}
function IE(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function OE() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function DE() {
  return Array.from(this);
}
function kE() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var o = e[t], i = 0, r = o.length; i < r; ++i) {
      var s = o[i];
      if (s)
        return s;
    }
  return null;
}
function RE() {
  let e = 0;
  for (const t of this)
    ++e;
  return e;
}
function zE() {
  return !this.node();
}
function HE(e) {
  for (var t = this._groups, n = 0, o = t.length; n < o; ++n)
    for (var i = t[n], r = 0, s = i.length, l; r < s; ++r)
      (l = i[r]) && e.call(l, l.__data__, r, i);
  return this;
}
function FE(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function VE(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function BE(e, t) {
  return function() {
    this.setAttribute(e, t);
  };
}
function LE(e, t) {
  return function() {
    this.setAttributeNS(e.space, e.local, t);
  };
}
function UE(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
  };
}
function GE(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
  };
}
function YE(e, t) {
  var n = ud(e);
  if (arguments.length < 2) {
    var o = this.node();
    return n.local ? o.getAttributeNS(n.space, n.local) : o.getAttribute(n);
  }
  return this.each((t == null ? n.local ? VE : FE : typeof t == "function" ? n.local ? GE : UE : n.local ? LE : BE)(n, t));
}
function pd(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function WE(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function XE(e, t, n) {
  return function() {
    this.style.setProperty(e, t, n);
  };
}
function JE(e, t, n) {
  return function() {
    var o = t.apply(this, arguments);
    o == null ? this.style.removeProperty(e) : this.style.setProperty(e, o, n);
  };
}
function KE(e, t, n) {
  return arguments.length > 1 ? this.each((t == null ? WE : typeof t == "function" ? JE : XE)(e, t, n ?? "")) : qE(this.node(), e);
}
function qE(e, t) {
  return e.style.getPropertyValue(t) || pd(e).getComputedStyle(e, null).getPropertyValue(t);
}
function ZE(e) {
  return function() {
    delete this[e];
  };
}
function QE(e, t) {
  return function() {
    this[e] = t;
  };
}
function jE(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? delete this[e] : this[e] = n;
  };
}
function e$(e, t) {
  return arguments.length > 1 ? this.each((t == null ? ZE : typeof t == "function" ? jE : QE)(e, t)) : this.node()[e];
}
function gd(e) {
  return e.trim().split(/^|\s+/);
}
function xl(e) {
  return e.classList || new md(e);
}
function md(e) {
  this._node = e, this._names = gd(e.getAttribute("class") || "");
}
md.prototype = {
  add: function(e) {
    var t = this._names.indexOf(e);
    t < 0 && (this._names.push(e), this._node.setAttribute("class", this._names.join(" ")));
  },
  remove: function(e) {
    var t = this._names.indexOf(e);
    t >= 0 && (this._names.splice(t, 1), this._node.setAttribute("class", this._names.join(" ")));
  },
  contains: function(e) {
    return this._names.indexOf(e) >= 0;
  }
};
function vd(e, t) {
  for (var n = xl(e), o = -1, i = t.length; ++o < i; )
    n.add(t[o]);
}
function _d(e, t) {
  for (var n = xl(e), o = -1, i = t.length; ++o < i; )
    n.remove(t[o]);
}
function t$(e) {
  return function() {
    vd(this, e);
  };
}
function n$(e) {
  return function() {
    _d(this, e);
  };
}
function o$(e, t) {
  return function() {
    (t.apply(this, arguments) ? vd : _d)(this, e);
  };
}
function i$(e, t) {
  var n = gd(e + "");
  if (arguments.length < 2) {
    for (var o = xl(this.node()), i = -1, r = n.length; ++i < r; )
      if (!o.contains(n[i]))
        return !1;
    return !0;
  }
  return this.each((typeof t == "function" ? o$ : t ? t$ : n$)(n, t));
}
function r$() {
  this.textContent = "";
}
function s$(e) {
  return function() {
    this.textContent = e;
  };
}
function l$(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.textContent = t ?? "";
  };
}
function a$(e) {
  return arguments.length ? this.each(e == null ? r$ : (typeof e == "function" ? l$ : s$)(e)) : this.node().textContent;
}
function u$() {
  this.innerHTML = "";
}
function c$(e) {
  return function() {
    this.innerHTML = e;
  };
}
function f$(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.innerHTML = t ?? "";
  };
}
function d$(e) {
  return arguments.length ? this.each(e == null ? u$ : (typeof e == "function" ? f$ : c$)(e)) : this.node().innerHTML;
}
function h$() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function p$() {
  return this.each(h$);
}
function g$() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function m$() {
  return this.each(g$);
}
function v$(e) {
  var t = typeof e == "function" ? e : cd(e);
  return this.select(function() {
    return this.appendChild(t.apply(this, arguments));
  });
}
function _$() {
  return null;
}
function y$(e, t) {
  var n = typeof e == "function" ? e : cd(e), o = t == null ? _$ : typeof t == "function" ? t : fd(t);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), o.apply(this, arguments) || null);
  });
}
function w$() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function b$() {
  return this.each(w$);
}
function x$() {
  var e = this.cloneNode(!1), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function E$() {
  var e = this.cloneNode(!0), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function $$(e) {
  return this.select(e ? E$ : x$);
}
function C$(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function S$(e) {
  return function(t) {
    e.call(this, t, this.__data__);
  };
}
function N$(e) {
  return e.trim().split(/^|\s+/).map(function(t) {
    var n = "", o = t.indexOf(".");
    return o >= 0 && (n = t.slice(o + 1), t = t.slice(0, o)), { type: t, name: n };
  });
}
function A$(e) {
  return function() {
    var t = this.__on;
    if (t) {
      for (var n = 0, o = -1, i = t.length, r; n < i; ++n)
        r = t[n], (!e.type || r.type === e.type) && r.name === e.name ? this.removeEventListener(r.type, r.listener, r.options) : t[++o] = r;
      ++o ? t.length = o : delete this.__on;
    }
  };
}
function M$(e, t, n) {
  return function() {
    var o = this.__on, i, r = S$(t);
    if (o) {
      for (var s = 0, l = o.length; s < l; ++s)
        if ((i = o[s]).type === e.type && i.name === e.name) {
          this.removeEventListener(i.type, i.listener, i.options), this.addEventListener(i.type, i.listener = r, i.options = n), i.value = t;
          return;
        }
    }
    this.addEventListener(e.type, r, n), i = { type: e.type, name: e.name, value: t, listener: r, options: n }, o ? o.push(i) : this.__on = [i];
  };
}
function P$(e, t, n) {
  var o = N$(e + ""), i, r = o.length, s;
  if (arguments.length < 2) {
    var l = this.node().__on;
    if (l) {
      for (var a = 0, u = l.length, c; a < u; ++a)
        for (i = 0, c = l[a]; i < r; ++i)
          if ((s = o[i]).type === c.type && s.name === c.name)
            return c.value;
    }
    return;
  }
  for (l = t ? M$ : A$, i = 0; i < r; ++i)
    this.each(l(o[i], t, n));
  return this;
}
function yd(e, t, n) {
  var o = pd(e), i = o.CustomEvent;
  typeof i == "function" ? i = new i(t, n) : (i = o.document.createEvent("Event"), n ? (i.initEvent(t, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(t, !1, !1)), e.dispatchEvent(i);
}
function T$(e, t) {
  return function() {
    return yd(this, e, t);
  };
}
function I$(e, t) {
  return function() {
    return yd(this, e, t.apply(this, arguments));
  };
}
function O$(e, t) {
  return this.each((typeof t == "function" ? I$ : T$)(e, t));
}
function* D$() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var o = e[t], i = 0, r = o.length, s; i < r; ++i)
      (s = o[i]) && (yield s);
}
var k$ = [null];
function dt(e, t) {
  this._groups = e, this._parents = t;
}
function R$() {
  return this;
}
dt.prototype = {
  constructor: dt,
  select: iE,
  selectAll: uE,
  selectChild: pE,
  selectChildren: _E,
  filter: yE,
  data: CE,
  enter: wE,
  exit: NE,
  join: AE,
  merge: ME,
  selection: R$,
  order: PE,
  sort: TE,
  call: OE,
  nodes: DE,
  node: kE,
  size: RE,
  empty: zE,
  each: HE,
  attr: YE,
  style: KE,
  property: e$,
  classed: i$,
  text: a$,
  html: d$,
  raise: p$,
  lower: m$,
  append: v$,
  insert: y$,
  remove: b$,
  clone: $$,
  datum: C$,
  on: P$,
  dispatch: O$,
  [Symbol.iterator]: D$
};
function To(e) {
  return typeof e == "string" ? new dt([[document.querySelector(e)]], [document.documentElement]) : new dt([[e]], k$);
}
function z$(e) {
  let t;
  for (; t = e.sourceEvent; )
    e = t;
  return e;
}
function yu(e, t) {
  if (e = z$(e), t === void 0 && (t = e.currentTarget), t) {
    var n = t.ownerSVGElement || t;
    if (n.createSVGPoint) {
      var o = n.createSVGPoint();
      return o.x = e.clientX, o.y = e.clientY, o = o.matrixTransform(t.getScreenCTM().inverse()), [o.x, o.y];
    }
    if (t.getBoundingClientRect) {
      var i = t.getBoundingClientRect();
      return [e.clientX - i.left - t.clientLeft, e.clientY - i.top - t.clientTop];
    }
  }
  return [e.pageX, e.pageY];
}
var H$ = { value: () => {
} };
function wd() {
  for (var e = 0, t = arguments.length, n = {}, o; e < t; ++e) {
    if (!(o = arguments[e] + "") || o in n || /[\s.]/.test(o))
      throw new Error("illegal type: " + o);
    n[o] = [];
  }
  return new _i(n);
}
function _i(e) {
  this._ = e;
}
function F$(e, t) {
  return e.trim().split(/^|\s+/).map(function(n) {
    var o = "", i = n.indexOf(".");
    if (i >= 0 && (o = n.slice(i + 1), n = n.slice(0, i)), n && !t.hasOwnProperty(n))
      throw new Error("unknown type: " + n);
    return { type: n, name: o };
  });
}
_i.prototype = wd.prototype = {
  constructor: _i,
  on: function(e, t) {
    var n = this._, o = F$(e + "", n), i, r = -1, s = o.length;
    if (arguments.length < 2) {
      for (; ++r < s; )
        if ((i = (e = o[r]).type) && (i = V$(n[i], e.name)))
          return i;
      return;
    }
    if (t != null && typeof t != "function")
      throw new Error("invalid callback: " + t);
    for (; ++r < s; )
      if (i = (e = o[r]).type)
        n[i] = wu(n[i], e.name, t);
      else if (t == null)
        for (i in n)
          n[i] = wu(n[i], e.name, null);
    return this;
  },
  copy: function() {
    var e = {}, t = this._;
    for (var n in t)
      e[n] = t[n].slice();
    return new _i(e);
  },
  call: function(e, t) {
    if ((i = arguments.length - 2) > 0)
      for (var n = new Array(i), o = 0, i, r; o < i; ++o)
        n[o] = arguments[o + 2];
    if (!this._.hasOwnProperty(e))
      throw new Error("unknown type: " + e);
    for (r = this._[e], o = 0, i = r.length; o < i; ++o)
      r[o].value.apply(t, n);
  },
  apply: function(e, t, n) {
    if (!this._.hasOwnProperty(e))
      throw new Error("unknown type: " + e);
    for (var o = this._[e], i = 0, r = o.length; i < r; ++i)
      o[i].value.apply(t, n);
  }
};
function V$(e, t) {
  for (var n = 0, o = e.length, i; n < o; ++n)
    if ((i = e[n]).name === t)
      return i.value;
}
function wu(e, t, n) {
  for (var o = 0, i = e.length; o < i; ++o)
    if (e[o].name === t) {
      e[o] = H$, e = e.slice(0, o).concat(e.slice(o + 1));
      break;
    }
  return n != null && e.push({ name: t, value: n }), e;
}
const B$ = { passive: !1 }, Io = { capture: !0, passive: !1 };
function Wr(e) {
  e.stopImmediatePropagation();
}
function zn(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function L$(e) {
  var t = e.document.documentElement, n = To(e).on("dragstart.drag", zn, Io);
  "onselectstart" in t ? n.on("selectstart.drag", zn, Io) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function U$(e, t) {
  var n = e.document.documentElement, o = To(e).on("dragstart.drag", null);
  t && (o.on("click.drag", zn, Io), setTimeout(function() {
    o.on("click.drag", null);
  }, 0)), "onselectstart" in n ? o.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
const si = (e) => () => e;
function Ps(e, {
  sourceEvent: t,
  subject: n,
  target: o,
  identifier: i,
  active: r,
  x: s,
  y: l,
  dx: a,
  dy: u,
  dispatch: c
}) {
  Object.defineProperties(this, {
    type: { value: e, enumerable: !0, configurable: !0 },
    sourceEvent: { value: t, enumerable: !0, configurable: !0 },
    subject: { value: n, enumerable: !0, configurable: !0 },
    target: { value: o, enumerable: !0, configurable: !0 },
    identifier: { value: i, enumerable: !0, configurable: !0 },
    active: { value: r, enumerable: !0, configurable: !0 },
    x: { value: s, enumerable: !0, configurable: !0 },
    y: { value: l, enumerable: !0, configurable: !0 },
    dx: { value: a, enumerable: !0, configurable: !0 },
    dy: { value: u, enumerable: !0, configurable: !0 },
    _: { value: c }
  });
}
Ps.prototype.on = function() {
  var e = this._.on.apply(this._, arguments);
  return e === this._ ? this : e;
};
function G$(e) {
  return !e.ctrlKey && !e.button;
}
function Y$() {
  return this.parentNode;
}
function W$(e, t) {
  return t ?? { x: e.x, y: e.y };
}
function X$() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function J$() {
  var e = G$, t = Y$, n = W$, o = X$, i = {}, r = wd("start", "drag", "end"), s = 0, l, a, u, c, f = 0;
  function d(y) {
    y.on("mousedown.drag", p).filter(o).on("touchstart.drag", _).on("touchmove.drag", b, B$).on("touchend.drag touchcancel.drag", C).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function p(y, D) {
    if (!(c || !e.call(this, y, D))) {
      var O = N(this, t.call(this, y, D), y, D, "mouse");
      O && (To(y.view).on("mousemove.drag", E, Io).on("mouseup.drag", m, Io), L$(y.view), Wr(y), u = !1, l = y.clientX, a = y.clientY, O("start", y));
    }
  }
  function E(y) {
    if (zn(y), !u) {
      var D = y.clientX - l, O = y.clientY - a;
      u = D * D + O * O > f;
    }
    i.mouse("drag", y);
  }
  function m(y) {
    To(y.view).on("mousemove.drag mouseup.drag", null), U$(y.view, u), zn(y), i.mouse("end", y);
  }
  function _(y, D) {
    if (e.call(this, y, D)) {
      var O = y.changedTouches, S = t.call(this, y, D), V = O.length, X, Y;
      for (X = 0; X < V; ++X)
        (Y = N(this, S, y, D, O[X].identifier, O[X])) && (Wr(y), Y("start", y, O[X]));
    }
  }
  function b(y) {
    var D = y.changedTouches, O = D.length, S, V;
    for (S = 0; S < O; ++S)
      (V = i[D[S].identifier]) && (zn(y), V("drag", y, D[S]));
  }
  function C(y) {
    var D = y.changedTouches, O = D.length, S, V;
    for (c && clearTimeout(c), c = setTimeout(function() {
      c = null;
    }, 500), S = 0; S < O; ++S)
      (V = i[D[S].identifier]) && (Wr(y), V("end", y, D[S]));
  }
  function N(y, D, O, S, V, X) {
    var Y = r.copy(), W = yu(X || O, D), le, K, g;
    if ((g = n.call(y, new Ps("beforestart", {
      sourceEvent: O,
      target: d,
      identifier: V,
      active: s,
      x: W[0],
      y: W[1],
      dx: 0,
      dy: 0,
      dispatch: Y
    }), S)) != null)
      return le = g.x - W[0] || 0, K = g.y - W[1] || 0, function R(w, P, I) {
        var T = W, M;
        switch (w) {
          case "start":
            i[V] = R, M = s++;
            break;
          case "end":
            delete i[V], --s;
          case "drag":
            W = yu(I || P, D), M = s;
            break;
        }
        Y.call(
          w,
          y,
          new Ps(w, {
            sourceEvent: P,
            subject: g,
            target: d,
            identifier: V,
            active: M,
            x: W[0] + le,
            y: W[1] + K,
            dx: W[0] - T[0],
            dy: W[1] - T[1],
            dispatch: Y
          }),
          S
        );
      };
  }
  return d.filter = function(y) {
    return arguments.length ? (e = typeof y == "function" ? y : si(!!y), d) : e;
  }, d.container = function(y) {
    return arguments.length ? (t = typeof y == "function" ? y : si(y), d) : t;
  }, d.subject = function(y) {
    return arguments.length ? (n = typeof y == "function" ? y : si(y), d) : n;
  }, d.touchable = function(y) {
    return arguments.length ? (o = typeof y == "function" ? y : si(!!y), d) : o;
  }, d.on = function() {
    var y = r.on.apply(r, arguments);
    return y === r ? d : y;
  }, d.clickDistance = function(y) {
    return arguments.length ? (f = (y = +y) * y, d) : Math.sqrt(f);
  }, d;
}
var Wn = /* @__PURE__ */ ((e) => (e.Line = "line", e.Handle = "handle", e))(Wn || {});
function K$({ width: e, prevWidth: t, height: n, prevHeight: o, invertX: i, invertY: r }) {
  const s = e - t, l = n - o, a = [s > 0 ? 1 : s < 0 ? -1 : 0, l > 0 ? 1 : l < 0 ? -1 : 0];
  return s && i && (a[0] = a[0] * -1), l && r && (a[1] = a[1] * -1), a;
}
const q$ = {
  [Wn.Line]: "right",
  [Wn.Handle]: "bottom-right"
}, Z$ = {
  [Wn.Line]: "borderColor",
  [Wn.Handle]: "backgroundColor"
}, Q$ = {
  name: "ResizeControl",
  compatConfig: { MODE: 3 }
}, bu = /* @__PURE__ */ Se({
  ...Q$,
  props: {
    nodeId: {},
    color: {},
    minWidth: { default: 10 },
    minHeight: { default: 10 },
    maxWidth: { default: Number.MAX_VALUE },
    maxHeight: { default: Number.MAX_VALUE },
    position: {},
    variant: { default: "handle" },
    shouldResize: {},
    keepAspectRatio: { type: [Boolean, Number], default: !1 }
  },
  emits: ["resizeStart", "resize", "resizeEnd"],
  setup(e, { emit: t }) {
    const n = e, o = { width: 0, height: 0, x: 0, y: 0 }, i = {
      ...o,
      pointerX: 0,
      pointerY: 0,
      aspectRatio: 1
    }, { findNode: r, emits: s } = Ee(), l = pf(), a = be();
    let u = i, c = o;
    const f = ke(() => n.position ?? q$[n.variant]), d = ke(() => f.value.split("-")), p = ke(() => n.color ? { [Z$[n.variant]]: n.color } : {});
    return ic((E) => {
      if (!a.value || !n.nodeId)
        return;
      const m = To(a.value), _ = f.value.includes("right") || f.value.includes("left"), b = f.value.includes("bottom") || f.value.includes("top"), C = f.value.includes("left"), N = f.value.includes("top"), y = J$().on("start", (D) => {
        const O = r(n.nodeId), { xSnapped: S, ySnapped: V } = l(D);
        c = {
          width: (O == null ? void 0 : O.dimensions.width) ?? 0,
          height: (O == null ? void 0 : O.dimensions.height) ?? 0,
          x: (O == null ? void 0 : O.position.x) ?? 0,
          y: (O == null ? void 0 : O.position.y) ?? 0
        }, u = {
          ...c,
          pointerX: S,
          pointerY: V,
          aspectRatio: c.width / c.height
        }, t("resizeStart", { event: D, params: c });
      }).on("drag", (D) => {
        var O;
        const { xSnapped: S, ySnapped: V } = l(D), X = r(n.nodeId);
        if (X) {
          const Y = [], {
            pointerX: W,
            pointerY: le,
            width: K,
            height: g,
            x: R,
            y: w,
            aspectRatio: P
          } = u, { x: I, y: T, width: M, height: U } = c, q = Math.floor(_ ? S - W : 0), Z = Math.floor(b ? V - le : 0);
          let J = Vt(K + (C ? -q : q), n.minWidth, n.maxWidth), se = Vt(g + (N ? -Z : Z), n.minHeight, n.maxHeight);
          if (n.keepAspectRatio) {
            const ce = J / se;
            let fe = P;
            typeof n.keepAspectRatio == "number" && ce !== n.keepAspectRatio && (fe = n.keepAspectRatio);
            const x = _ && b, h = _ && !b, v = b && !_;
            J = ce <= fe && x || v ? se * fe : J, se = ce > fe && x || h ? J / fe : se, J >= n.maxWidth ? (J = n.maxWidth, se = n.maxWidth / fe) : J <= n.minWidth && (J = n.minWidth, se = n.minWidth / fe), se >= n.maxHeight ? (se = n.maxHeight, J = n.maxHeight * fe) : se <= n.minHeight && (se = n.minHeight, J = n.minHeight * fe);
          }
          const L = J !== M, ae = se !== U;
          if (C || N) {
            const ce = C ? R - (J - K) : R, fe = N ? w - (se - g) : w, x = ce !== I && L, h = fe !== T && ae;
            if (x || h) {
              const v = {
                id: X.id,
                type: "position",
                from: X.position,
                position: {
                  x: x ? ce : I,
                  y: h ? fe : T
                }
              };
              Y.push(v), c.x = v.position.x, c.y = v.position.y;
            }
          }
          if (n.nodeId && (L || ae)) {
            const ce = {
              id: n.nodeId,
              type: "dimensions",
              updateStyle: !0,
              resizing: !0,
              dimensions: {
                width: J,
                height: se
              }
            };
            Y.push(ce), c.width = J, c.height = se;
          }
          if (Y.length === 0)
            return;
          const j = K$({
            width: c.width,
            prevWidth: M,
            height: c.height,
            prevHeight: U,
            invertX: C,
            invertY: N
          }), ne = { ...c, direction: j };
          if (((O = n.shouldResize) == null ? void 0 : O.call(n, D, ne)) === !1)
            return;
          t("resize", { event: D, params: ne }), s.nodesChange(Y);
        }
      }).on("end", (D) => {
        if (n.nodeId) {
          const O = {
            id: n.nodeId,
            type: "dimensions",
            resizing: !1
          };
          t("resizeEnd", { event: D, params: c }), s.nodesChange([O]);
        }
      });
      m.call(y), E(() => {
        m.on(".drag", null);
      });
    }), (E, m) => (re(), pe("div", {
      ref_key: "resizeControlRef",
      ref: a,
      class: We(["vue-flow__resize-control nodrag", [...d.value, E.variant]]),
      style: ze(p.value)
    }, [
      De(E.$slots, "default")
    ], 6));
  }
}), j$ = {
  name: "NodeResizer",
  compatConfig: { MODE: 3 },
  inheritAttrs: !1
}, eC = /* @__PURE__ */ Se({
  ...j$,
  props: {
    nodeId: {},
    color: {},
    handleClassName: {},
    handleStyle: {},
    lineClassName: {},
    lineStyle: {},
    isVisible: { type: Boolean, default: !0 },
    minWidth: {},
    minHeight: {},
    maxWidth: {},
    maxHeight: {},
    shouldResize: {},
    keepAspectRatio: { type: [Boolean, Number] }
  },
  emits: ["resizeStart", "resize", "resizeEnd"],
  setup(e, { emit: t }) {
    const n = e, { findNode: o, emits: i } = Ee(), r = ["top-left", "top-right", "bottom-left", "bottom-right"], s = ["top", "right", "bottom", "left"], l = lt(dr, null), a = ke(() => typeof n.nodeId == "string" ? n.nodeId : l), u = ke(() => o(a.value));
    return we(
      [() => n.minWidth, () => n.minHeight, () => n.maxWidth, () => n.maxHeight, () => {
        var c;
        return (c = u.value) == null ? void 0 : c.initialized;
      }],
      ([c, f, d, p, E]) => {
        const m = u.value;
        if (m && E) {
          const _ = {
            id: m.id,
            type: "dimensions",
            updateStyle: !0,
            dimensions: {
              width: m.dimensions.width,
              height: m.dimensions.height
            }
          };
          c && m.dimensions.width < c && (_.dimensions.width = c), f && m.dimensions.height < f && (_.dimensions.height = f), d && m.dimensions.width > d && (_.dimensions.width = d), p && m.dimensions.height > p && (_.dimensions.height = p), (_.dimensions.width !== m.dimensions.width || _.dimensions.height !== m.dimensions.height) && i.nodesChange([_]);
        }
      },
      { flush: "post", immediate: !0 }
    ), (c, f) => c.isVisible ? (re(), pe(Me, { key: 0 }, [
      (re(), pe(Me, null, Fn(s, (d) => me(bu, {
        key: d,
        class: We(c.lineClassName),
        style: ze(c.lineStyle),
        "node-id": a.value,
        position: d,
        variant: G(Wn).Line,
        "keep-aspect-ratio": c.keepAspectRatio,
        color: c.color,
        "min-width": c.minWidth,
        "min-height": c.minHeight,
        "max-width": c.maxWidth,
        "max-height": c.maxHeight,
        "should-resize": c.shouldResize,
        onResizeStart: f[0] || (f[0] = (p) => t("resizeStart", p)),
        onResize: f[1] || (f[1] = (p) => t("resize", p)),
        onResizeEnd: f[2] || (f[2] = (p) => t("resizeEnd", p))
      }, null, 8, ["class", "style", "node-id", "position", "variant", "keep-aspect-ratio", "color", "min-width", "min-height", "max-width", "max-height", "should-resize"])), 64)),
      (re(), pe(Me, null, Fn(r, (d) => me(bu, {
        key: d,
        class: We(c.handleClassName),
        style: ze(c.handleStyle),
        "node-id": a.value,
        position: d,
        color: c.color,
        "min-width": c.minWidth,
        "min-height": c.minHeight,
        "max-width": c.maxWidth,
        "max-height": c.maxHeight,
        "should-resize": c.shouldResize,
        "keep-aspect-ratio": c.keepAspectRatio,
        onResizeStart: f[3] || (f[3] = (p) => t("resizeStart", p)),
        onResize: f[4] || (f[4] = (p) => t("resize", p)),
        onResizeEnd: f[5] || (f[5] = (p) => t("resizeEnd", p))
      }, null, 8, ["class", "style", "node-id", "position", "color", "min-width", "min-height", "max-width", "max-height", "should-resize", "keep-aspect-ratio"])), 64))
    ], 64)) : He("", !0);
  }
}), tC = {
  name: "NodeToolbar",
  compatConfig: { MODE: 3 },
  inheritAttrs: !1
}, bd = /* @__PURE__ */ Se({
  ...tC,
  props: {
    nodeId: null,
    isVisible: { type: Boolean },
    position: { default: ee.Top },
    offset: { default: 10 },
    align: { default: "center" }
  },
  setup(e) {
    const t = e, n = lt(dr, null), { viewportRef: o, viewport: i, getSelectedNodes: r, findNode: s } = Ee();
    function l(p, E, m, _, b) {
      let C = 0.5;
      b === "start" ? C = 0 : b === "end" && (C = 1);
      let N = [
        (p.x + p.width * C) * E.zoom + E.x,
        p.y * E.zoom + E.y - _
      ], y = [-100 * C, -100];
      switch (m) {
        case ee.Right:
          N = [
            (p.x + p.width) * E.zoom + E.x + _,
            (p.y + p.height * C) * E.zoom + E.y
          ], y = [0, -100 * C];
          break;
        case ee.Bottom:
          N[1] = (p.y + p.height) * E.zoom + E.y + _, y[1] = 0;
          break;
        case ee.Left:
          N = [
            p.x * E.zoom + E.x - _,
            (p.y + p.height * C) * E.zoom + E.y
          ], y = [-100, -100 * C];
          break;
      }
      return `translate(${N[0]}px, ${N[1]}px) translate(${y[0]}%, ${y[1]}%)`;
    }
    const a = he(() => (Array.isArray(t.nodeId) ? t.nodeId : [t.nodeId || n || ""]).reduce((p, E) => {
      const m = s(E);
      return m && p.push(m), p;
    }, [])), u = he(
      () => typeof t.isVisible == "boolean" ? t.isVisible : a.value.length === 1 && a.value[0].selected && r.value.length === 1
    ), c = he(() => mr(a.value)), f = he(() => Math.max(...a.value.map((p) => (p.computedPosition.z || 1) + 1))), d = he(() => ({
      position: "absolute",
      transform: l(c.value, i.value, t.position, t.offset, t.align),
      zIndex: f.value
    }));
    return (p, E) => (re(), Ve(ap, {
      to: G(o),
      disabled: !G(o)
    }, [
      G(u) && G(a).length ? (re(), pe("div", rr({ key: 0 }, p.$attrs, {
        style: G(d),
        class: "vue-flow__node-toolbar"
      }), [
        De(p.$slots, "default")
      ], 16)) : He("", !0)
    ], 8, ["to", "disabled"]));
  }
}), El = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [o, i] of t)
    n[o] = i;
  return n;
}, nC = {}, oC = {
  xmlns: "http://www.w3.org/2000/svg",
  "xmlns:xlink": "http://www.w3.org/1999/xlink",
  "xmlns:v": "http://vecta.io",
  height: "100%",
  width: "100%",
  viewBox: "0 0 40 40",
  preserveAspectRatio: "none",
  stroke: "#000",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  fill: "#fff",
  "fill-rule": "evenodd",
  "font-family": "Roboto",
  "font-size": "14px",
  "text-anchor": "middle"
}, iC = /* @__PURE__ */ dp('<g stroke-width="0.5" id="_Equip"><g><g stroke-width="0.5"><g><g><ellipse cx="20" cy="20" rx="20" ry="20" stroke-linecap="square" stroke-width="0.5"></ellipse></g><g transform="translate(20 0)"><path d="M 20 20 L 0.00001 0.00001" fill="none" stroke-linecap="square" stroke-width="0.5"></path></g><g transform="translate(20 20)"><path d="M 20 0 L 0 20" fill="none" stroke-linecap="square" stroke-width="0.5"></path></g></g></g></g></g>', 1), rC = [
  iC
];
function sC(e, t) {
  return re(), pe("svg", oC, rC);
}
const lC = /* @__PURE__ */ El(nC, [["render", sC]]), aC = {
  __name: "testNode",
  setup(e) {
    const { updateNodeInternals: t } = Ee(), { node: n } = ul();
    we(n.data, async () => {
      await nt(), t();
    });
    const o = pr();
    async function i() {
      n.data.rotation += 90, n.data.rotation >= 360 && (n.data.rotation = 0);
    }
    function r(l) {
      var a = (n.data.rotation + l) % 360;
      return a < 0 && (a += 360), a === 0 ? ee.Right : a === 90 ? ee.Bottom : a === 180 ? ee.Left : a === 270 ? ee.Top : ee.Right;
    }
    function s({ params: l }) {
      console.log("resize: ", l), n.data.size = l;
    }
    return (l, a) => (re(), pe("div", null, [
      me(G(eC), {
        "is-visible": G(n).selected,
        "min-width": 50,
        "min-height": 50,
        "keep-aspect-ratio": !0,
        onResize: s
      }, null, 8, ["is-visible"]),
      me(G(bd), {
        style: { display: "flex", gap: "0.5rem", "align-items": "center" },
        "is-visible": G(n).selected,
        position: G(ee).top
      }, {
        default: Qe(() => [
          Ce("button", {
            onClick: a[0] || (a[0] = (u) => i())
          }, "Action btn")
        ]),
        _: 1
      }, 8, ["is-visible", "position"]),
      me(G(Mt), {
        id: `${G(o)}_out`,
        type: "source",
        position: r(0)
      }, null, 8, ["id", "position"]),
      me(G(Mt), {
        id: `${G(o)}_in`,
        type: "target",
        position: r(180)
      }, null, 8, ["id", "position"]),
      Ce("div", {
        class: "center_content",
        style: ze({ height: `${G(n).data.size.height}px`, width: `${G(n).data.size.width}px`, transform: `rotate(${G(n).data.rotation}deg)` })
      }, [
        me(lC)
      ], 4)
    ]));
  }
}, uC = /* @__PURE__ */ El(aC, [["__scopeId", "data-v-0d48d1ee"]]), cC = /* @__PURE__ */ Ce("div", { style: { width: "10px", height: "30px", left: "20px", position: "absolute", background: "#999999", "border-bottom-left-radius": "10px" } }, null, -1), fC = /* @__PURE__ */ Ce("div", { style: { width: "30px", height: "10px", left: "20px", top: "20px", position: "absolute", background: "#999999", "border-bottom-left-radius": "10px" } }, null, -1), dC = [
  cC,
  fC
], hC = {
  __name: "ConnectorNode",
  setup(e) {
    const { updateNodeInternals: t } = Ee(), { node: n } = ul();
    let o = pr();
    we(n.data, async () => {
      await nt(), t();
    });
    async function i(s) {
      n.data.rotation += s, Math.abs(n.data.rotation) >= 360 && (n.data.rotation = 0);
    }
    function r(s) {
      var l = (n.data.rotation + s) % 360;
      return l < 0 && (l += 360), l === 0 ? ee.Right : l === 90 ? ee.Bottom : l === 180 ? ee.Left : l === 270 ? ee.Top : ee.Right;
    }
    return (s, l) => (re(), pe(Me, null, [
      me(G(bd), {
        style: { display: "flex", gap: "0.5rem", "align-items": "center" },
        "is-visible": void 0,
        position: G(ee).top
      }, {
        default: Qe(() => [
          Ce("button", {
            onClick: l[0] || (l[0] = (a) => i(-90))
          }, "Left"),
          Ce("button", {
            onClick: l[1] || (l[1] = (a) => i(90))
          }, "Right")
        ]),
        _: 1
      }, 8, ["position"]),
      Ce("div", {
        style: ze([{ transform: `rotate(${G(n).data.rotation}deg)` }, { height: "50px", width: "50px", background: "transparent" }])
      }, dC, 4),
      me(G(Mt), {
        id: `${G(o)}_out`,
        type: "source",
        position: r(0)
      }, null, 8, ["id", "position"]),
      me(G(Mt), {
        id: `${G(o)}_in`,
        type: "target",
        position: r(270)
      }, null, 8, ["id", "position"])
    ], 64));
  }
}, pC = /* @__PURE__ */ Ce("div", { style: { height: "28px" } }, " OUTPUT NODE ", -1), gC = {
  __name: "OutputNode",
  setup(e) {
    const t = Vy({
      type: "target"
    }), n = By(() => {
      var o;
      return (o = t.value[0]) == null ? void 0 : o.source;
    });
    return (o, i) => {
      var r;
      return re(), pe(Me, null, [
        me(G(Mt), {
          type: "target",
          position: G(ee).Left,
          style: ze({ backgroundColor: (r = G(n)) == null ? void 0 : r.color, filter: "invert(100%)" })
        }, null, 8, ["position", "style"]),
        pC
      ], 64);
    };
  }
}, mC = /* @__PURE__ */ Ce("div", { style: { height: "28px" } }, " INPUT NODE ", -1), vC = {
  __name: "InputNode",
  setup(e) {
    return (t, n) => (re(), pe(Me, null, [
      me(G(Mt), {
        type: "source",
        position: G(ee).Right
      }, null, 8, ["position"]),
      mC
    ], 64));
  }
}, _C = ["d"], yC = ["cx", "cy", "stroke"], xu = "#f59e0b", Eu = "#10b981", wC = 75, bC = 30, xC = {
  __name: "SnappableConnectionLine",
  props: {
    sourceX: {
      type: Number,
      required: !0
    },
    sourceY: {
      type: Number,
      required: !0
    },
    targetX: {
      type: Number,
      required: !0
    },
    targetY: {
      type: Number,
      required: !0
    },
    targetPosition: {
      type: String,
      reuire: !0
    },
    sourcePosition: {
      type: String,
      required: !0
    }
  },
  setup(e) {
    const t = e, { getNodes: n, connectionStartHandle: o, onConnectEnd: i, addEdges: r, edges: s } = Ee(), l = Oo({
      node: null,
      handle: null,
      startHandle: o.value
    }), a = be(!1);
    we([() => t.targetY, () => t.targetX], (f, d, p) => {
      var b;
      const E = n.value.reduce(
        (C, N) => {
          var y;
          if (N.id !== ((y = o.value) == null ? void 0 : y.nodeId)) {
            const D = t.targetX - (N.computedPosition.x + N.dimensions.width / 2), O = t.targetY - (N.computedPosition.y + N.dimensions.height / 2), S = Math.sqrt(D * D + O * O);
            S < C.distance && S < wC && (C.distance = S, C.node = N);
          }
          return C;
        },
        {
          distance: Number.MAX_VALUE,
          node: null
        }
      );
      if (!E.node)
        return;
      a.value = E.distance < bC;
      const m = o.value.type === "source" ? "target" : "source", _ = (b = E.node.handleBounds[m]) == null ? void 0 : b.reduce((C, N) => {
        const y = Math.sqrt((C.x - t.targetX) ** 2 + (C.y - t.targetY) ** 2), D = Math.sqrt((N.x - t.targetX) ** 2 + (N.y - t.targetY) ** 2);
        return y < D ? C : N;
      });
      if (!bf(
        {
          source: o.value.nodeId,
          sourceHandle: o.value.handleId,
          target: E.node.id,
          targetHandle: _.id
        },
        s.value
      ) && _) {
        const C = document.querySelector(`[data-handleid='${_.id}']`), N = C.style.backgroundColor;
        C.style.backgroundColor = a.value ? Eu : xu, l.node = E.node, l.handle = _, p(() => {
          C.style.backgroundColor = N, l.node = null, l.handle = null;
        });
      }
    });
    const u = he(() => zi(t));
    i(() => {
      l.startHandle && l.handle && l.node && a.value && r([
        {
          sourceHandle: l.startHandle.handleId,
          source: l.startHandle.nodeId,
          target: l.node.id,
          targetHandle: l.handle.id
        }
      ]);
    });
    const c = he(() => a.value ? Eu : l.node ? xu : "#222");
    return (f, d) => (re(), pe("g", null, [
      Ce("path", {
        d: u.value[0],
        class: "vue-flow__connection-path",
        style: { "stroke-width": "10px !important" }
      }, null, 8, _C),
      Ce("circle", {
        cx: e.targetX,
        cy: e.targetY,
        fill: "#fff",
        stroke: c.value,
        r: 3,
        "stroke-width": 1.5
      }, null, 8, yC)
    ]));
  }
};
let EC = 0;
function $C() {
  return `dndnode_${EC++}`;
}
const CC = {
  /**
   * The type of the node being dragged.
   */
  draggedType: be(null),
  isDragOver: be(!1),
  isDragging: be(!1)
};
function xd() {
  const { draggedType: e, isDragOver: t, isDragging: n } = CC, { addNodes: o, screenToFlowCoordinate: i, onNodesInitialized: r, updateNode: s } = Ee();
  we(n, (d) => {
    document.body.style.userSelect = d ? "none" : "";
  });
  function l(d, p) {
    d.dataTransfer && (d.dataTransfer.setData("application/vueflow", p), d.dataTransfer.effectAllowed = "move"), e.value = p, n.value = !0, document.addEventListener("drop", c);
  }
  function a(d) {
    d.preventDefault(), e.value && (t.value = !0, d.dataTransfer && (d.dataTransfer.dropEffect = "move"));
  }
  function u() {
    t.value = !1;
  }
  function c() {
    n.value = !1, t.value = !1, e.value = null, document.removeEventListener("drop", c);
  }
  function f(d) {
    const p = i({
      x: d.clientX,
      y: d.clientY
    }), E = $C(), m = {
      id: E + "_" + (/* @__PURE__ */ new Date()).getTime(),
      type: e.value,
      position: p,
      data: {
        rotation: 0,
        size: {
          height: 50,
          width: 50
        }
      },
      label: `[${E}]`
    }, { off: _ } = r(() => {
      s(E, (b) => ({
        position: { x: b.position.x - b.dimensions.width / 2, y: b.position.y - b.dimensions.height / 2 }
      })), _();
    });
    o(m);
  }
  return {
    draggedType: e,
    isDragOver: t,
    isDragging: n,
    onDragStart: l,
    onDragLeave: u,
    onDragOver: a,
    onDrop: f
  };
}
const SC = /* @__PURE__ */ Ce("div", { class: "description" }, "You can drag these nodes to the pane.", -1), NC = { class: "nodes" }, AC = {
  __name: "Sidebar",
  setup(e) {
    const { onDragStart: t } = xd();
    return (n, o) => (re(), pe("aside", null, [
      SC,
      Ce("div", NC, [
        Ce("div", {
          class: "vue-flow__node-input",
          draggable: !0,
          onDragstart: o[0] || (o[0] = (i) => G(t)(i, "input"))
        }, " Input Node ", 32),
        Ce("div", {
          class: "vue-flow__node-default",
          draggable: !0,
          onDragstart: o[1] || (o[1] = (i) => G(t)(i, "test-node"))
        }, " Test Node ", 32),
        Ce("div", {
          class: "vue-flow__node-output",
          draggable: !0,
          onDragstart: o[2] || (o[2] = (i) => G(t)(i, "output"))
        }, " Output Node ", 32),
        Ce("div", {
          class: "vue-flow__node-output",
          draggable: !0,
          onDragstart: o[3] || (o[3] = (i) => G(t)(i, "connector-node"))
        }, " Connector Node ", 32)
      ])
    ]));
  }
}, MC = '@import"https://cdn.jsdelivr.net/npm/@vue-flow/core@1.32.1/dist/style.css";@import"https://cdn.jsdelivr.net/npm/@vue-flow/core@1.32.1/dist/theme-default.css";@import"https://cdn.jsdelivr.net/npm/@vue-flow/controls@latest/dist/style.css";@import"https://cdn.jsdelivr.net/npm/@vue-flow/minimap@latest/dist/style.css";@import"https://cdn.jsdelivr.net/npm/@vue-flow/node-resizer@latest/dist/style.css";body{background:gray}html,body,#app{height:100%;margin:0 auto;font-weight:400}#app{text-transform:uppercase;font-family:JetBrains Mono,monospace;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-align:center;color:#2c3e50;background:#d3d3d3}.vue-flow__minimap{transform:scale(75%);transform-origin:bottom right}.vue-flow__handle{border:none;width:10px;height:10px;border-radius:20%;font-size:12px}.dndflow{flex-direction:column;display:flex;height:100%}.dndflow aside{color:#fff;font-weight:700;border-right:1px solid #eee;padding:15px 10px;font-size:12px;background:#10b981bf;-webkit-box-shadow:0px 5px 10px 0px rgba(0,0,0,.3);box-shadow:0 5px 10px #0000004d}.dndflow aside .nodes>*{margin-bottom:10px;cursor:grab;font-weight:500;-webkit-box-shadow:5px 5px 10px 2px rgba(0,0,0,.25);box-shadow:5px 5px 10px 2px #00000040}.dndflow aside .description{margin-bottom:10px}.dndflow .vue-flow-wrapper{flex-grow:1;height:100%}@media screen and (min-width: 640px){.dndflow{flex-direction:row}.dndflow aside{min-width:25%}}@media screen and (max-width: 639px){.dndflow aside .nodes{display:flex;flex-direction:row;gap:5px}}', PC = {
  __name: "ScadaFlow.ce",
  props: /* @__PURE__ */ Fl({
    nodes: {
      type: Array,
      default: () => [
        {
          id: "5",
          type: "test-node",
          label: "Node 5",
          position: { x: 300, y: 300 },
          class: "light",
          data: { size: { height: 50, width: 50 }, rotation: 0 }
        }
      ]
    }
  }, {
    modelValue: {},
    modelModifiers: {}
  }),
  emits: /* @__PURE__ */ Fl(["nodesChange"], ["update:modelValue"]),
  setup(e, { emit: t }) {
    const { updateEdge: n, addEdges: o, removeEdges: i } = Ee(), { onDragOver: r, onDrop: s, onDragLeave: l, isDragging: a } = xd();
    xp(e, "modelValue");
    const u = e, c = {
      stroke: "#999999",
      strokeWidth: 10
    }, f = {
      "test-node": ft(uC),
      "connector-node": ft(hC),
      output: ft(gC),
      input: ft(vC)
    }, d = be(u.nodes);
    function p(O) {
      console.log("start update", O);
    }
    function E(O) {
      console.log("end update", O);
    }
    function m({ edge: O, connection: S }) {
      n(O, S);
    }
    function _(O) {
      O.updatable = !1, O.type = "smoothstep", O.style = c, O.updatable = !0, O.animated = !1, o([O]);
    }
    function b(O) {
      console.log(O);
    }
    function C({ edge: O }) {
      console.log(O.id), i(O.id);
    }
    const N = t;
    function y(O) {
      N("nodesChange", d);
    }
    function D() {
      top.webMI.data.read("AGENT.OBJECTS.simulated", (O) => {
        console.log(O);
      });
    }
    return (O, S) => (re(), pe("div", {
      class: "dndflow",
      onDrop: S[0] || (S[0] = (...V) => G(s) && G(s)(...V))
    }, [
      me(G(Hy), {
        "_v-model": "model",
        _nodes: "JSON.parse(nodes)",
        nodes: e.nodes,
        "node-types": f,
        "default-viewport": { zoom: 1 },
        "fit-view-on-init": !0,
        "snap-to-grid": "",
        "snap-grid": [25, 25],
        style: { height: "100%", width: "100%" },
        onNodesChange: y,
        onEdgeUpdate: m,
        onConnect: _,
        onEdgeUpdateStart: p,
        onEdgeUpdateEnd: E,
        onEdgeMouseEnter: b,
        onEdgeDoubleClick: C,
        onDragover: G(r),
        onDragleave: G(l)
      }, {
        "connection-line": Qe(({ sourceX: V, sourceY: X, targetX: Y, targetY: W, sourcePosition: le, targetPosition: K }) => [
          me(xC, {
            "source-x": V,
            "source-y": X,
            "target-x": Y,
            "target-y": W,
            "source-position": le,
            "target-position": K
          }, null, 8, ["source-x", "source-y", "target-x", "target-y", "source-position", "target-position"])
        ]),
        default: Qe(() => [
          Ce("div", { style: { position: "absolute", right: "10px", top: "10px", "z-index": "4", display: "flex", gap: "0.25rem" } }, [
            Ce("button", { onClick: D }, "read atvise tag")
          ]),
          me(G(_1)),
          me(G(eE))
        ]),
        _: 1
      }, 8, ["nodes", "onDragover", "onDragleave"]),
      me(AC)
    ], 32));
  }
}, TC = /* @__PURE__ */ El(PC, [["styles", [MC]]]), IC = /* @__PURE__ */ Yp(TC);
customElements.define("scada-flow", IC);
