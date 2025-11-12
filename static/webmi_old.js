/*
atvise webMI http://www.atvise.com/

Copyright (C) Bachmann Visutec GmbH. All Rights Reserved.
Copyright (C) 2003-2005 Tom Wu. All Rights Reserved.
Copyright (C) 1998-2009, Paul Johnston & Contributors. All Rights Reserved.
$Id: ce8b2df5f2b5134d709d0ccd2e7d93f6a3519ee7 $

WARNING: This software program is protected by copyright law
and international treaties. Unauthorized reproduction or
distribution of this program, or any portion of it, may result
in severe civil and criminal penalties, and will be prosecuted
to the maximum extent possible under the law.

May only be used with explicit written authorization by Bachmann Visutec
 */
/* eslint-disable */
var test = 123
var Oa;
try {
    Oa = (parent && parent.webMI ? parent.webMI : opener && opener.webMI ? opener.webMI : top && top.webMI ? top.webMI : null).proxy(null, window)
} catch (Tc) {
    Oa = !0
}
Oa && (window.webMI = function () {
    function pb(a, b) {
        b.location.href = a
    }
    function y(a) {
        return "undefined" === typeof a
    }
    function ic(a) {
        return null === a
    }
    function u(a) {
        return "string" === typeof a
    }
    function C(a) {
        return "object" === typeof a
    }
    function x(a) {
        return "function" === typeof a || null !== a && C(a) && "call" in a
    }
    function B(a) {
        try {
            return C(a) && a.constructor && -1 != a.constructor.toString().indexOf("Array")
        } catch (b) {
            return !1
        }
    }
    function na(a) {
        if (!C(a))
            return !1;
        for (var b in a)
            return !1;
        return !0
    }
    function F(a, b) {
        var c = "Exception @ " +
            a + "\nMessage: ";
        b.message ? (c += b.message, console.error(c, b)) : console.error(c + b)
    }
    function Pa(a, b) {
        try {
            return a.contentDocument == b || a.contentWindow && a.contentWindow.document == b
        } catch (c) {
            return !1
        }
    }
    function Qa(a, b) {
        try {
            return "getContentDocument" in a && a.getContentDocument() == b
        } catch (c) {
            return !1
        }
    }
    function U(a, b) {
        return C(a) ? String(a.nodeName).toLowerCase() == b : !1
    }
    function O() {
        throw "Invalid Argument";
    }
    function oa(a) {
        return function (b) {
            try {
                b()
            } catch (c) {
                F(a, c)
            }
        }
    }
    function N(a, b, c) {
        if (!C(a))
            throw "Can't add event '" +
            b + "' to non-object (" + String(c) + ")";
        a.addEventListener(b, c, !1)
    }
    function qb(a) {
        return function c(d, e, f) {
            if (null !== d) {
                if (B(d))
                    return r(d, function (a) {
                        return c(a, e, f)
                    });
                if (u(d)) {
                    var h = d;
                    d = a(h);
                    if (!d)
                        throw "Can't find element '" + h + "'.";
                }
                if (!B(e))
                    return N(d, e, f);
                r(e, function (a) {
                    N(d, a, f)
                })
            }
        }
    }
    function rb(a, b, c) {
        return function (d, e) {
            d in Ra || O();
            0 == a.c.p && -1 == Sa.indexOf(d) && Sa.push(d);
            var f = Ra[d];
            return f[1].call(f[0], da(f[2], e), a, b, c, b)
        }
    }
    function jc(a) {
        u(W) ? a(W) : W.push(a)
    }
    function r(a, b) {
        for (var c = 0; c < a.length; ++c)
            b(a[c],
                c)
    }
    function p(a, b) {
        for (var c in a)
            b(a[c], c)
    }
    function P(a, b) {
        for (var c = 0; c < a.length; ++c)
            b(a[c], c) && a.splice(c--, 1)
    }
    function X(a, b) {
        var c = !1;
        null != b && r(b, function (b) {
            b == a && (c = !0)
        });
        return c
    }
    function da(a, b) {
        function c() {}
        c.prototype = a;
        var d = new c;
        p(b, function (a, b) {
            d[b] = a
        });
        return d
    }
    function Ta(a, b) {
        if (y(a) || typeof t[a] != typeof b)
            return !1;
        G && "data.keepaliveinterval" == a && 0 >= b && (console.warn("Keepalive interval of 0 or below is invalid! Reset to 4s."), b = 4E3);
        "object" == typeof t[a] ? Ua(t[a], b) : t[a] = b;
        Va =
            sb();
        return !0
    }
    function Ua(a, b) {
        for (var c in a)
            "object" == typeof b[c] ? Ua(a[c], b[c]) : c in b && typeof a[c] == typeof b[c] && (a[c] = b[c])
    }
    function Wa(a, b, c) {
        a.prototype[b] = c
    }
    function E(a, b) {
        p(b, function (b, d) {
            a.prototype[d] = b
        })
    }
    function tb(a, b, c, d, e) {
        function f(f) {
            f = tb(a, b, c, parseInt(d.substr(f, 2), 16), parseInt(e.substr(f, 2), 16));
            f -= f % 1;
            return (16 > f ? "0" : "") + f.toString(16)
        }
        function h(a) {
            return u(a) && 4 == a.length && "#" == a.charAt(0) ? "#" + a.charAt(1) + a.charAt(1) + a.charAt(2) + a.charAt(2) + a.charAt(3) + a.charAt(3) : a
        }
        d = h(d);
        e = h(e);
        return u(d) && 7 == d.length && u(e) && 7 == e.length ? "#" + f(1) + f(3) + f(5) : d + (e - d) * (a - b) / (c - b)
    }
    function Xa(a) {
        var b = document.createElement("div");
        b.appendChild(document.createTextNode(a));
        return b.innerHTML.replace(/"/g, "&quot;").replace(/'/g, "&apos;")
    }
    function ub(a) {
        var b = document.createElement("div");
        b.innerHTML = a;
        return (b = (b = b.childNodes[0]) ? b.nodeValue : "") ? b.replace(/&quot;/g, '"').replace(/&apos;/g, "'") : a
    }
    function vb(a, b) {
        var c = b.hostname,
        d = document.createElement("a");
        d.href = a;
        d.href = d.href;
        d = d.hostname;
        G && /a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z/i.test(c) && (c = c.split(".").slice(-2).join("."));
        G && /a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z/i.test(d) && (d = d.split(".").slice(-2).join("."));
        return d === c ? !1 : !0
    }
    function wb() {
        var a = location.hostname;
        "http:" == location.protocol ? a = a + ":" + ("" == location.port ? "80" : location.port) : "https:" == location.protocol && (a = a + ":" + ("" == location.port ? "443" : location.port));
        return a
    }
    function xb(a) {
        for (var b = "", c = -1, d, e; ++c < a.length; )
            d = a.charCodeAt(c), e = c + 1 <
                a.length ? a.charCodeAt(c + 1) : 0, 55296 <= d && 56319 >= d && 56320 <= e && 57343 >= e && (d = 65536 + ((d & 1023) << 10) + (e & 1023), c++), 127 >= d ? b += String.fromCharCode(d) : 2047 >= d ? b += String.fromCharCode(192 | d >>> 6 & 31, 128 | d & 63) : 65535 >= d ? b += String.fromCharCode(224 | d >>> 12 & 15, 128 | d >>> 6 & 63, 128 | d & 63) : 2097151 >= d && (b += String.fromCharCode(240 | d >>> 18 & 7, 128 | d >>> 12 & 63, 128 | d >>> 6 & 63, 128 | d & 63));
        return b
    }
    function Q(a) {
        function b(a, b) {
            var c = (a & 65535) + (b & 65535);
            return (a >> 16) + (b >> 16) + (c >> 16) << 16 | c & 65535
        }
        function c(a, c, d, e, f, g) {
            a = b(b(c, a), b(e, g));
            return b(a <<
                f | a >>> 32 - f, d)
        }
        function d(a, b, d, e, f, g, h) {
            return c(b & d | ~b & e, a, b, f, g, h)
        }
        function e(a, b, d, e, f, g, h) {
            return c(b & e | d & ~e, a, b, f, g, h)
        }
        function f(a, b, d, e, f, g, h) {
            return c(d ^ (b | ~e), a, b, f, g, h)
        }
        var h = xb(a),
        g = 1732584193,
        l = -271733879,
        k = -1732584194,
        m = 271733878,
        q = [],
        s = 8 * h.length;
        for (a = 0; a < s; a += 8)
            q[a >> 5] |= (h.charCodeAt(a / 8) & 255) << a % 32;
        q[s >> 5] |= 128 << s % 32;
        q[(s + 64 >>> 9 << 4) + 14] = s;
        for (a = 0; a < q.length; a += 16)
            var h = g, s = l, z = k, w = m, g = d(g, l, k, m, q[a + 0], 7, -680876936), m = d(m, g, l, k, q[a + 1], 12, -389564586), k = d(k, m, g, l, q[a + 2], 17, 606105819),
            l = d(l, k, m, g, q[a + 3], 22, -1044525330), g = d(g, l, k, m, q[a + 4], 7, -176418897), m = d(m, g, l, k, q[a + 5], 12, 1200080426), k = d(k, m, g, l, q[a + 6], 17, -1473231341), l = d(l, k, m, g, q[a + 7], 22, -45705983), g = d(g, l, k, m, q[a + 8], 7, 1770035416), m = d(m, g, l, k, q[a + 9], 12, -1958414417), k = d(k, m, g, l, q[a + 10], 17, -42063), l = d(l, k, m, g, q[a + 11], 22, -1990404162), g = d(g, l, k, m, q[a + 12], 7, 1804603682), m = d(m, g, l, k, q[a + 13], 12, -40341101), k = d(k, m, g, l, q[a + 14], 17, -1502002290), l = d(l, k, m, g, q[a + 15], 22, 1236535329), g = e(g, l, k, m, q[a + 1], 5, -165796510), m = e(m, g, l, k, q[a + 6], 9, -1069501632),
            k = e(k, m, g, l, q[a + 11], 14, 643717713), l = e(l, k, m, g, q[a + 0], 20, -373897302), g = e(g, l, k, m, q[a + 5], 5, -701558691), m = e(m, g, l, k, q[a + 10], 9, 38016083), k = e(k, m, g, l, q[a + 15], 14, -660478335), l = e(l, k, m, g, q[a + 4], 20, -405537848), g = e(g, l, k, m, q[a + 9], 5, 568446438), m = e(m, g, l, k, q[a + 14], 9, -1019803690), k = e(k, m, g, l, q[a + 3], 14, -187363961), l = e(l, k, m, g, q[a + 8], 20, 1163531501), g = e(g, l, k, m, q[a + 13], 5, -1444681467), m = e(m, g, l, k, q[a + 2], 9, -51403784), k = e(k, m, g, l, q[a + 7], 14, 1735328473), l = e(l, k, m, g, q[a + 12], 20, -1926607734), g = c(l ^ k ^ m, g, l, q[a + 5], 4, -378558),
            m = c(g ^ l ^ k, m, g, q[a + 8], 11, -2022574463), k = c(m ^ g ^ l, k, m, q[a + 11], 16, 1839030562), l = c(k ^ m ^ g, l, k, q[a + 14], 23, -35309556), g = c(l ^ k ^ m, g, l, q[a + 1], 4, -1530992060), m = c(g ^ l ^ k, m, g, q[a + 4], 11, 1272893353), k = c(m ^ g ^ l, k, m, q[a + 7], 16, -155497632), l = c(k ^ m ^ g, l, k, q[a + 10], 23, -1094730640), g = c(l ^ k ^ m, g, l, q[a + 13], 4, 681279174), m = c(g ^ l ^ k, m, g, q[a + 0], 11, -358537222), k = c(m ^ g ^ l, k, m, q[a + 3], 16, -722521979), l = c(k ^ m ^ g, l, k, q[a + 6], 23, 76029189), g = c(l ^ k ^ m, g, l, q[a + 9], 4, -640364487), m = c(g ^ l ^ k, m, g, q[a + 12], 11, -421815835), k = c(m ^ g ^ l, k, m, q[a + 15], 16, 530742520),
            l = c(k ^ m ^ g, l, k, q[a + 2], 23, -995338651), g = f(g, l, k, m, q[a + 0], 6, -198630844), m = f(m, g, l, k, q[a + 7], 10, 1126891415), k = f(k, m, g, l, q[a + 14], 15, -1416354905), l = f(l, k, m, g, q[a + 5], 21, -57434055), g = f(g, l, k, m, q[a + 12], 6, 1700485571), m = f(m, g, l, k, q[a + 3], 10, -1894986606), k = f(k, m, g, l, q[a + 10], 15, -1051523), l = f(l, k, m, g, q[a + 1], 21, -2054922799), g = f(g, l, k, m, q[a + 8], 6, 1873313359), m = f(m, g, l, k, q[a + 15], 10, -30611744), k = f(k, m, g, l, q[a + 6], 15, -1560198380), l = f(l, k, m, g, q[a + 13], 21, 1309151649), g = f(g, l, k, m, q[a + 4], 6, -145523070), m = f(m, g, l, k, q[a + 11], 10,
                    -1120210379), k = f(k, m, g, l, q[a + 2], 15, 718787259), l = f(l, k, m, g, q[a + 9], 21, -343485551), g = b(g, h), l = b(l, s), k = b(k, z), m = b(m, w);
        g = [g, l, k, m];
        l = "";
        for (a = 0; a < 4 * g.length; ++a)
            l += D.charAt(g[a >> 2] >> a % 4 * 8 + 4 & 15) + D.charAt(g[a >> 2] >> a % 4 * 8 & 15);
        return l
    }
    function kc(a, b, c) {
        function d(a, b, c) {
            null != a && ("number" == typeof a ? this.He(a, b, c) : null == b && "string" != typeof a ? this.Lc(a, 256) : this.Lc(a, b))
        }
        function e() {
            return new d(null)
        }
        function f(a, b, c, d, e, f) {
            for (; 0 <= --f; ) {
                var g = b * this[a++] + c[d] + e;
                e = Math.floor(g / 67108864);
                c[d++] = g & 67108863
            }
            return e
        }
        function h(a, b, c, d, e, f) {
            var g = b & 32767;
            for (b >>= 15; 0 <= --f; ) {
                var h = this[a] & 32767,
                k = this[a++] >> 15,
                l = b * h + k * g,
                h = g * h + ((l & 32767) << 15) + c[d] + (e & 1073741823);
                e = (h >>> 30) + (l >>> 15) + b * k + (e >>> 30);
                c[d++] = h & 1073741823
            }
            return e
        }
        function g(a, b, c, d, e, f) {
            var g = b & 16383;
            for (b >>= 14; 0 <= --f; ) {
                var h = this[a] & 16383,
                k = this[a++] >> 14,
                l = b * h + k * g,
                h = g * h + ((l & 16383) << 14) + c[d] + e;
                e = (h >> 28) + (l >> 14) + b * k;
                c[d++] = h & 268435455
            }
            return e
        }
        function l(a) {
            var b = e();
            b.Zd(a);
            return b
        }
        function k(a) {
            var b = 1,
            c;
            0 != (c = a >>> 16) && (a = c, b += 16);
            0 != (c = a >> 8) && (a = c,
                b += 8);
            0 != (c = a >> 4) && (a = c, b += 4);
            0 != (c = a >> 2) && (a = c, b += 2);
            0 != a >> 1 && (b += 1);
            return b
        }
        function m(a) {
            this.N = a
        }
        function q(a) {
            this.N = a;
            this.Vc = a.ae();
            this.Wc = this.Vc & 32767;
            this.le = this.Vc >> 15;
            this.Ae = (1 << a.t - 15) - 1;
            this.me = 2 * a.g
        }
        var s;
        "Microsoft Internet Explorer" == navigator.appName ? (d.prototype.ma = h, s = 30) : "Netscape" != navigator.appName ? (d.prototype.ma = f, s = 26) : (d.prototype.ma = g, s = 28);
        d.prototype.t = s;
        d.prototype.ja = (1 << s) - 1;
        d.prototype.ka = 1 << s;
        d.prototype.zd = Math.pow(2, 52);
        d.prototype.zc = 52 - s;
        d.prototype.Ac = 2 *
            s - 52;
        var z = [],
        w;
        s = 48;
        for (w = 0; 9 >= w; ++w)
            z[s++] = w;
        s = 97;
        for (w = 10; 36 > w; ++w)
            z[s++] = w;
        s = 65;
        for (w = 10; 36 > w; ++w)
            z[s++] = w;
        m.prototype.Jc = function (a) {
            return 0 > a.o || 0 <= a.Ra(this.N) ? a.he(this.N) : a
        };
        m.prototype.jd = function (a) {
            return a
        };
        m.prototype.reduce = function (a) {
            a.Mb(this.N, a)
        };
        m.prototype.Xc = function (a, b, c) {
            a.Yc(b, c);
            this.reduce(c)
        };
        m.prototype.rd = function (a, b) {
            a.sd(b);
            this.reduce(b)
        };
        q.prototype.Jc = function (a) {
            var b = e();
            a.abs().pb(this.N.g, b);
            b.Mb(this.N, b);
            0 > a.o && 0 < b.Ra(d.ZERO) && this.N.W(b, b);
            return b
        };
        q.prototype.jd =
        function (a) {
            var b = e();
            a.copyTo(b);
            this.reduce(b);
            return b
        };
        q.prototype.reduce = function (a) {
            for (; a.g <= this.me; )
                a[a.g++] = 0;
            for (var b = 0; b < this.N.g; ++b) {
                var c = a[b] & 32767,
                d = c * this.Wc + ((c * this.le + (a[b] >> 15) * this.Wc & this.Ae) << 15) & a.ja,
                c = b + this.N.g;
                for (a[c] += this.N.ma(0, d, a, b, 0, this.N.g); a[c] >= a.ka; )
                    a[c] -= a.ka, a[++c]++
            }
            a.na();
            a.Sd(this.N.g, a);
            0 <= a.Ra(this.N) && a.W(this.N, a)
        };
        q.prototype.Xc = function (a, b, c) {
            a.Yc(b, c);
            this.reduce(c)
        };
        q.prototype.rd = function (a, b) {
            a.sd(b);
            this.reduce(b)
        };
        d.prototype.copyTo = function (a) {
            for (var b =
                    this.g - 1; 0 <= b; --b)
                a[b] = this[b];
            a.g = this.g;
            a.o = this.o
        };
        d.prototype.Zd = function (a) {
            this.g = 1;
            this.o = 0 > a ? -1 : 0;
            0 < a ? this[0] = a : -1 > a ? this[0] = a + DV : this.g = 0
        };
        d.prototype.Lc = function (a, b) {
            var c;
            if (16 == b)
                c = 4;
            else if (8 == b)
                c = 3;
            else if (256 == b)
                c = 8;
            else if (2 == b)
                c = 1;
            else if (32 == b)
                c = 5;
            else if (4 == b)
                c = 2;
            else {
                this.Ie(a, b);
                return
            }
            this.o = this.g = 0;
            for (var e = a.length, f = !1, g = 0; 0 <= --e; ) {
                var h;
                8 == c ? h = a[e] & 255 : (h = z[a.charCodeAt(e)], h = null == h ? -1 : h);
                0 > h ? "-" == a.charAt(e) && (f = !0) : (f = !1, 0 == g ? this[this.g++] = h : g + c > this.t ? (this[this.g -
                                1] |= (h & (1 << this.t - g) - 1) << g, this[this.g++] = h >> this.t - g) : this[this.g - 1] |= h << g, g += c, g >= this.t && (g -= this.t))
            }
            8 == c && 0 != (a[0] & 128) && (this.o = -1, 0 < g && (this[this.g - 1] |= (1 << this.t - g) - 1 << g));
            this.na();
            f && d.ZERO.W(this, this)
        };
        d.prototype.na = function () {
            for (var a = this.o & this.ja; 0 < this.g && this[this.g - 1] == a; )
                --this.g
        };
        d.prototype.pb = function (a, b) {
            var c;
            for (c = this.g - 1; 0 <= c; --c)
                b[c + a] = this[c];
            for (c = a - 1; 0 <= c; --c)
                b[c] = 0;
            b.g = this.g + a;
            b.o = this.o
        };
        d.prototype.Sd = function (a, b) {
            for (var c = a; c < this.g; ++c)
                b[c - a] = this[c];
            b.g =
                Math.max(this.g - a, 0);
            b.o = this.o
        };
        d.prototype.Sc = function (a, b) {
            var c = a % this.t,
            d = this.t - c,
            e = (1 << d) - 1,
            f = Math.floor(a / this.t),
            g = this.o << c & this.ja,
            h;
            for (h = this.g - 1; 0 <= h; --h)
                b[h + f + 1] = this[h] >> d | g, g = (this[h] & e) << c;
            for (h = f - 1; 0 <= h; --h)
                b[h] = 0;
            b[f] = g;
            b.g = this.g + f + 1;
            b.o = this.o;
            b.na()
        };
        d.prototype.pe = function (a, b) {
            b.o = this.o;
            var c = Math.floor(a / this.t);
            if (c >= this.g)
                b.g = 0;
            else {
                var d = a % this.t,
                e = this.t - d,
                f = (1 << d) - 1;
                b[0] = this[c] >> d;
                for (var g = c + 1; g < this.g; ++g)
                    b[g - c - 1] |= (this[g] & f) << e, b[g - c] = this[g] >> d;
                0 < d && (b[this.g -
                        c - 1] |= (this.o & f) << e);
                b.g = this.g - c;
                b.na()
            }
        };
        d.prototype.W = function (a, b) {
            for (var c = 0, d = 0, e = Math.min(a.g, this.g); c < e; )
                d += this[c] - a[c], b[c++] = d & this.ja, d >>= this.t;
            if (a.g < this.g) {
                for (d -= a.o; c < this.g; )
                    d += this[c], b[c++] = d & this.ja, d >>= this.t;
                d += this.o
            } else {
                for (d += this.o; c < a.g; )
                    d -= a[c], b[c++] = d & this.ja, d >>= this.t;
                d -= a.o
            }
            b.o = 0 > d ? -1 : 0;
            -1 > d ? b[c++] = this.ka + d : 0 < d && (b[c++] = d);
            b.g = c;
            b.na()
        };
        d.prototype.Yc = function (a, b) {
            var c = this.abs(),
            e = a.abs(),
            f = c.g;
            for (b.g = f + e.g; 0 <= --f; )
                b[f] = 0;
            for (f = 0; f < e.g; ++f)
                b[f + c.g] = c.ma(0,
                        e[f], b, f, 0, c.g);
            b.o = 0;
            b.na();
            this.o != a.o && d.ZERO.W(b, b)
        };
        d.prototype.sd = function (a) {
            for (var b = this.abs(), c = a.g = 2 * b.g; 0 <= --c; )
                a[c] = 0;
            for (c = 0; c < b.g - 1; ++c) {
                var d = b.ma(c, b[c], a, 2 * c, 0, 1);
                (a[c + b.g] += b.ma(c + 1, 2 * b[c], a, 2 * c + 1, d, b.g - c - 1)) >= b.ka && (a[c + b.g] -= b.ka, a[c + b.g + 1] = 1)
            }
            0 < a.g && (a[a.g - 1] += b.ma(c, b[c], a, 2 * c, 0, 1));
            a.o = 0;
            a.na()
        };
        d.prototype.Mb = function (a, b) {
            var c = a.abs();
            if (!(0 >= c.g)) {
                var f = this.abs();
                if (f.g < c.g)
                    null != b && this.copyTo(b);
                else {
                    null == b && (b = e());
                    var g = e(),
                    h = this.o,
                    l = this.t - k(c[c.g - 1]);
                    0 < l ? (c.Sc(l,
                            g), f.Sc(l, b)) : (c.copyTo(g), f.copyTo(b));
                    c = g.g;
                    f = g[c - 1];
                    if (0 != f) {
                        var q = f * (1 << this.zc) + (1 < c ? g[c - 2] >> this.Ac : 0),
                        m = this.zd / q,
                        q = (1 << this.zc) / q,
                        w = 1 << this.Ac,
                        s = b.g,
                        z = s - c,
                        A = e();
                        g.pb(z, A);
                        0 <= b.Ra(A) && (b[b.g++] = 1, b.W(A, b));
                        d.ONE.pb(c, A);
                        for (A.W(g, g); g.g < c; )
                            g[g.g++] = 0;
                        for (; 0 <= --z; ) {
                            var p = b[--s] == f ? this.ja : Math.floor(b[s] * m + (b[s - 1] + w) * q);
                            if ((b[s] += g.ma(0, p, b, z, 0, c)) < p)
                                for (g.pb(z, A), b.W(A, b); b[s] < --p; )
                                    b.W(A, b)
                        }
                        b.g = c;
                        b.na();
                        0 < l && b.pe(l, b);
                        0 > h && d.ZERO.W(b, b)
                    }
                }
            }
        };
        d.prototype.ae = function () {
            if (1 > this.g)
                return 0;
            var a =
                this[0];
            if (0 == (a & 1))
                return 0;
            var b = a & 3,
            b = b * (2 - (a & 15) * b) & 15,
            b = b * (2 - (a & 255) * b) & 255,
            b = b * (2 - ((a & 65535) * b & 65535)) & 65535,
            b = b * (2 - a * b % this.ka) % this.ka;
            return 0 < b ? this.ka - b : -b
        };
        d.prototype.ce = function () {
            return 0 == (0 < this.g ? this[0] & 1 : this.o)
        };
        d.prototype.exp = function (a, b) {
            if (4294967295 < a || 1 > a)
                return d.ONE;
            var c = e(),
            f = e(),
            g = b.Jc(this),
            h = k(a) - 1;
            for (g.copyTo(c); 0 <= --h; )
                if (b.rd(c, f), 0 < (a & 1 << h))
                    b.Xc(f, g, c);
                else
                    var l = c, c = f, f = l;
            return b.jd(c)
        };
        d.prototype.toString = function (a) {
            if (0 > this.o)
                return "-" + this.Zc().toString(a);
            if (16 == a)
                a = 4;
            else if (8 == a)
                a = 3;
            else if (2 == a)
                a = 1;
            else if (32 == a)
                a = 5;
            else if (4 == a)
                a = 2;
            else
                return this.Ue(a);
            var b = (1 << a) - 1,
            c,
            d = !1,
            e = "",
            f = this.g,
            g = this.t - f * this.t % a;
            if (0 < f--)
                for (g < this.t && 0 < (c = this[f] >> g) && (d = !0, e = D.charAt(c)); 0 <= f; )
                    g < a ? (c = (this[f] & (1 << g) - 1) << a - g, c |= this[--f] >> (g += this.t - a)) : (c = this[f] >> (g -= a) & b, 0 >= g && (g += this.t, --f)), 0 < c && (d = !0), d && (e += D.charAt(c));
            return d ? e : "0"
        };
        d.prototype.Zc = function () {
            var a = e();
            d.ZERO.W(this, a);
            return a
        };
        d.prototype.abs = function () {
            return 0 > this.o ? this.Zc() : this
        };
        d.prototype.Ra = function (a) {
            var b = this.o - a.o;
            if (0 != b)
                return b;
            var c = this.g,
            b = c - a.g;
            if (0 != b)
                return b;
            for (; 0 <= --c; )
                if (0 != (b = this[c] - a[c]))
                    return b;
            return 0
        };
        d.prototype.Gd = function () {
            return 0 >= this.g ? 0 : this.t * (this.g - 1) + k(this[this.g - 1] ^ this.o & this.ja)
        };
        d.prototype.he = function (a) {
            var b = e();
            this.abs().Mb(a, b);
            0 > this.o && 0 < b.Ra(d.ZERO) && a.W(b, b);
            return b
        };
        d.prototype.ie = function (a, b) {
            var c;
            c = 256 > a || b.ce() ? new m(b) : new q(b);
            return this.exp(a, c)
        };
        d.ZERO = l(0);
        d.ONE = l(1);
        c = new d(c, 16);
        b = parseInt(b, 16);
        w = c.Gd() +
            7 >> 3;
        if (w < a.length + 11)
            throw "Message is too long for encryption";
        s = [];
        for (var A = a.length; 0 < A; )
            s[--w] = a.charCodeAt(--A);
        for (s[--w] = 0; 2 < w; )
            s[--w] = 1 + Math.round(254 * Math.random());
        s[--w] = 2;
        s[--w] = 0;
        a = (new d(s)).ie(b, c);
        if (null == a)
            return null;
        a = a.toString(16);
        return a.length % 2 ? "0" + a : a
    }
    function yb(a, b, c) {
        if (!u(a))
            return "";
        var d = c;
        d || (d = !1);
        for (var e = [], f = [], h = 0, g = 1, f = a.split(/(%(%|((\d+)\$|\((\w+)\))?(\-)?(\+|\x20)?(0)?(\d+)?(\.(\d+))?([bcdeEfFgGosxX]))?)/g); ; ) {
            e.push(f[h++]);
            if (h >= f.length)
                break;
            var l =
                0,
            k = parseInt(f[h + 3], 10) || g++,
            m = !f[h + 5],
            q = f[h + 7] || " ",
            s = "",
            z = parseInt(f[h + 8], 10),
            w = parseInt(f[h + 10], 10);
            isNaN(w) && (w = 6);
            for (var A = f[h + 11], k = arguments[k], L = f[h + 4], M = 0; M < arguments.length; ++M)
                if (C(arguments[M]) && L in arguments[M]) {
                    k = C([arguments[M][L]]) && d && arguments[M][L][d] ? arguments[M][L][d] : arguments[M][L];
                    break
                }
            var M = String(k),
            p = Math.abs(parseInt(k, 10)),
            r = J(k),
            L = 0 > r ? "-" : f[h + 6] ? "+" : "",
            r = Math.abs(r);
            "" != A && y(k) && ("%" == f[h + 1] ? A = f[h + 1] : O());
            if ("%" == A)
                k = A;
            else if ("b" == A)
                k = p.toString(2);
            else if ("c" == A)
                k =
                    String.fromCharCode(p);
            else if ("d" == A)
                k = p;
            else if ("e" == A || "E" == A) {
                for (; 10 < r; )
                    r /= 10, ++l;
                for (; r && 1 > r; )
                    r *= 10, --l;
                k = yb("%." + w + "f%s%02d", r.toFixed(w), A + (0 > l ? "-" : "+"), Math.abs(l))
            } else
                "f" == A ? k = r.toFixed(w) : "o" == A ? k = p.toString(8) : "s" == A ? (L = "", k = z ? M.substring(0, z) : M) : "x" == A || "X" == A ? (k = p.toString(16), "X" == A && (k = k.toUpperCase())) : (k = f[h + 1], --g);
            k = String(k);
            for (M = 0; M < z - k.length - L.length; ++M)
                s += q;
            k = m ? "0" == q ? L + s + k : s + L + k : L + k + s;
            e.push(k);
            h += 12
        }
        return e.join("")
    }
    function zb(a) {
        y(a.JSON) && (a.JSON = {
                parse: function (a) {
                    var b =
                        /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
                    b.lastIndex = 0;
                    b.test(a) && (a = a.replace(b, function (a) {
                            return "\\u" + ("0000" + (+a.charCodeAt(0)).toString(16)).slice(-4)
                        }));
                    if (/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, "")))
                        return eval("(" + a + ")");
                    throw new SyntaxError("JSON.parse");
                },
                stringify: function (b) {
                    if (B(b)) {
                        var d =
                            [];
                        r(b, function (b) {
                            d.push(a.JSON.stringify(b))
                        });
                        return "[" + d.join(",") + "]"
                    }
                    if (null !== b && C(b))
                        return d = [], p(b, function (b, c) {
                            d.push(a.JSON.stringify(c) + ":" + a.JSON.stringify(b))
                        }), "{" + d.join(",") + "}";
                    u(b) && (b = '"' + b + '"');
                    return String(b)
                }
            });
        y(a.console) && (a.console = {});
        var b = "log" in a.console ? a.console.log : a.console.log = function () {};
        x(a.console.info) || (a.console.info = function (a) {
            b("I: " + a)
        });
        x(a.console.warn) || (a.console.warn = function (a) {
            b("W: " + a)
        });
        x(a.console.error) || (a.console.error = function (a) {
            b("E: " +
                a)
        })
    }
    function Ya() {
        if (Za && !Ea) {
            Ea = !0;
            for (var a in I)
                for (var b = 0; b < I[a].length; ++b)
                    if (I[a][b].xb(Ya)) {
                        Ea = !1;
                        return
                    }
            Ea = !1
        }
    }
    function V(a) {
        a in I || (I[a] = []);
        return I[a]
    }
    function lc(a) {
        if ("" == a)
            throw "Invalid servername";
        pa !== a && ("" == pa && (Y.Uc(a), Z.Uc(a)), pa = a)
    }
    function qa(a) {
        var b = a.indexOf("/");
        0 > b ? a = "" : (a = a.substr(0, b), a = null === pa || a == pa ? "" : a);
        return a
    }
    function ra(a) {
        var b = a.indexOf("/");
        return 0 > b || 0 === a.indexOf("SYSTEM.LIBRARY.ATVISE.RESOURCES") ? a : a.substr(b + 1)
    }
    function ea(a, b, c) {
        var d = {},
        e = 1;
        p(b,
            function (f, h) {
            r(V(h), function (g) {
                ++e;
                var l = g.T() || "read" == a && "" == b[""];
                l || console.warn("Connection to server lost, requests are not responding.");
                g.j(a, 3, f, l ? function (a) {
                    d[h] = a;
                    --e || c(d)
                }
                     : function () {})
            })
        });
        --e || c(d)
    }
    function Ab(a, b, c) {
        var d = [],
        e = [];
        p(b, function (a, b) {
            d.push("address[]=" + encodeURIComponent(b));
            e.push(a)
        });
        r(V(a), function (a) {
            a.T() && a.j("read", 3, d, function (a) {
                if (a.error)
                    for (var b in e)
                        r(e[b], function (b) {
                            b.K(a, b.key)
                        });
                else
                    r(a.result, function (a, b) {
                        r(e[b], function (b) {
                            try {
                                b.K(a, b.key)
                            } catch (c) {
                                F("read request callback function",
                                    c)
                            }
                        })
                    });
                c()
            })
        })
    }
    function mc(a, b, c, d) {
        function e() {
            var b = ja[a];
            na(b) ? delete ja[a] : (ja[a] = {}, Ab(a, b, e))
        }
        var f = a in ja,
        h = {};
        f ? h = ja[a] : ja[a] = {};
        r(b, function (a, b) {
            var e = {
                K: d,
                key: c[b]
            };
            a in h ? h[a].push(e) : h[a] = [e]
        });
        f || Ab(a, h, e)
    }
    function Bb(a) {
        p(a, function (a, c) {
            K[c] = a
        });
        t["data.userreload"] || (K.reload = t["data.userreload"]);
        p(v, function (a) {
            a.data && r(a.data.cc, function (a) {
                try {
                    a(K)
                } catch (b) {}
            })
        })
    }
    function sa(a) {
        function b(a) {
            a = a.n;
            var b = a.G,
            c = a.V,
            d = c[b[0]],
            e = null;
            1 < b.length && (e = c[b[1]]);
            return {
                role: a.kd,
                online: a.Pa,
                hostNames: a.G,
                "connection-status": {
                    primary: d,
                    secondary: e
                },
                currentHostName: a.q
            }
        }
        var c = a.h,
        d = a.C,
        e = "" == location.port ? "80" : location.port;
        "https:" == location.protocol && (e = "" == location.port ? "443" : location.port);
        $.status = -1 < d.n.G.indexOf(-1 == location.host.indexOf(":") ? location.host + ":" + e : location.host) && "Active" == a.status || 0 == a.status ? "Passive" : a.status;
        $.active = b(c);
        $.passive = b(d);
        $["active-exists"] = 2 == c.P && 2 == d.P ? !1 : !0;
        a = 0;
        3 === c.state && (a = -1);
        ka(a);
        p(v, function (a) {
            a.data && r(a.data.gc, function (a) {
                try {
                    a($)
                } catch (b) {}
            })
        })
    }
    function nc(a) {
        p(a, function (a, c) {
            Cb[c] = a
        });
        p(v, function (a) {
            a.data && r(a.data.ec, function (a) {
                try {
                    a(Cb)
                } catch (b) {}
            })
        })
    }
    function Db(a) {
        isNaN(a) || ($a = a, p(v, function (a) {
                a.data && r(a.data.hc, function (a) {
                    try {
                        a($a)
                    } catch (b) {}
                })
            }))
    }
    function ka(a, b) {
        b && H() ? b.L = 1 : (Eb = a, p(v, function (b) {
                    r(b.data.ic, function (b) {
                        try {
                            b(a)
                        } catch (c) {}
                    })
                }))
    }
    function ta(a, b, c) {
        var d = "unknown";
        if (u(b)) {
            b = b.split("&");
            for (var e in b)
                "function" === typeof b[e].indexOf && -1 < b[e].indexOf("address[]=") && (d = b[e].replace("address[]=", ""))
        }
        var f = {
            timestamp: Date.now(),
            address: d,
            permission: a ? a : "unknown",
            errortext: c.errorstring ? c.errorstring : "Permission error",
            user: K.username ? K.username : ""
        };
        console.warn("Permission error: ", f);
        for (ua.push(f); ua.length > t["data.permissionlogsize"]; )
            ua.shift();
        p(v, function (a) {
            a.data && r(a.data.$c, function (a) {
                try {
                    a(f)
                } catch (b) {}
            })
        })
    }
    function Fa(a, b, c, d) {
        var e = this;
        e.A = b;
        e.n = a;
        e.hb = c ? "" : b;
        e.Yb = c ? "" : ', servername="' + b + '"';
        e.L = 1;
        e.ca = !1;
        e.De = !1;
        e.M = {};
        e.H = {};
        e.F = {};
        e.B = {};
        e.Aa = [];
        e.cb = {};
        e.Fd = c;
        e.bc = !0;
        e.Ga = d;
        e.P = 2;
        if (c)
            e.Ga && e.wa();
        else
            for (e.A = "", a = 0; 64 > a; ++a)
                e.A += D.charAt(64 * Math.random());
        setTimeout(function () {
            e.Qa()
        }, 1E3)
    }
    function ab(a) {
        a.Rc ? oc(a) : y(a.s) || a.j("deletesession", 1, null, function () {})
    }
    function Fb(a, b, c, d) {
        this.Rc = !0;
        this.status = 0;
        this.h = new Fa(a, b, c, d[0]);
        this.C = new Fa(new bb(a.yc, a), b, c);
        Ta("data.keepaliveinterval", t["data.keepaliveinterval"])
    }
    function oc(a) {
        ab(a.C);
        ab(a.h)
    }
    function H() {
        if (I[""]) {
            var a = I[""][0];
            if (a && a.Rc)
                return a
        }
    }
    function cb(a, b) {
        a.P = 1;
        var c = H();
        Gb(c, a);
        c && c.we(b.Redustatus)
    }
    function Hb(a) {
        var b = H();
        b || F("handling passive error", Error("Server is passive but client is not in redundant mode"));
        va(b, a)
    }
    function va(a, b) {
        b.P = 2;
        Gb(a, b)
    }
    function Gb(a, b) {
        var c = !1,
        d = a.h,
        e = a.C;
        b == d && 1 == b.P && d.ga ? d.Ia() : d.P != e.P && (2 == b.P && b == d || 1 == b.P && b == e) && (c = !0);
        if (t["data.websocket"])
            c && (a.vd(), sa(a));
        else if (c)
            a.vd(), sa(a);
        else if (2 == b.P && b == d || 1 == b.P && b == e) {
            var f = a.h;
            b == a.h && (f = a.C);
            f.j("publish", 1, null, function (a) {
                "Active" === a.Redustatus && cb(f, a)
            })
        }
    }
    function bb(a, b) {
        function c(a, b) {
            var c =
                a.G;
            a.cd = 0;
            a.q = a.bb = c[0];
            if (1 < c.length) {
                var d = c[1].split(":"),
                d = d[0];
                if (location.hostname == d || 0 < b)
                    a.cd = 1, a.q = a.bb = c[1]
            }
            a.V = {};
            for (var e = 0; e < c.length; e++) {
                var f = c[e],
                d = f.split(":"),
                d = d[0];
                a.V[f] = location.hostname == d ? !0 : null
            }
        }
        var d = this;
        d.A = "";
        d.yc = a;
        d.u = pc();
        d.O = null;
        d.l = {};
        d.Pa = !0;
        d.Z = {};
        var e,
        f = !y(b);
        if (f)
            e = b.r, b.G = e[0], d.r = e, d.G = e[1], d.A = b.A, c(d, b.cd);
        else
            for (e = 0; e <= d.u; ++e)
                d.A += D.charAt(d.u * Math.random()), D += D.charAt(16 * (1 - Math.random()));
        d.u = 1;
        d.j("info", 1, "", null, function (a) {
            d.r = a.serverlist;
            if (B(d.r))
                for (var b = 0; b < d.r.length; b++)
                    if (B(d.r[b]))
                        for (var e = 0; e < d.r[b].length; e++)
                            d.r[b][e] = d.r[b][e].toLowerCase(), -1 == d.r[b][e].indexOf(":") && ("http:" == location.protocol ? d.r[b][e] += ":80" : "https:" == location.protocol && (d.r[b][e] += ":443"));
                    else
                        u(d.r[b]) && (d.r[b] = d.r[b].toLowerCase(), -1 == d.r[b].indexOf(":") && ("http:" == location.protocol ? d.r[b] += ":80" : "https:" == location.protocol && (d.r[b] += ":443")));
            d.kd = a.role;
            d.va = a;
            t["data.websocket"] = (a.websocketsupport ? !0 : !1) && t["data.websocket"];
            if (!f)
                return B(d.r) &&
                2 == d.r.length && (G = !0, d.G = d.r[0], c(d, 0)), aa = a.loginmethod, d.Od("", d.A, D.split("/"), d.r);
            d.V[d.q] = !0;
            d.od()
        })
    }
    function pc() {
        var a = [0, 3, 4, 19, 23, 26];
        D = D.slice(a[0], D.length - a.length);
        for (var b = 1; b < a.length; ++b)
            D += D.charAt(32 + a[2] + a[b % 2 ? b : 0]);
        return D.indexOf("/")
    }
    function db(a, b, c, d) {
        var e = this;
        e.J = null;
        e.Xe = 0;
        e.Be = 0;
        e.jb = {};
        e.kc = [];
        e.l = b;
        e.yd = {};
        e.Zb = d;
        e.yd.data = function (a, b) {
            var c = e.l;
            try {
                var d = a.status;
                if (!d || 200 == d) {
                    var f = a.responseText;
                    if ("" != f) {
                        try {
                            var q = JSON.parse(f)
                        } catch (s) {
                            F("parsing JSON",
                                s);
                            ka(-1);
                            return
                        }
                        if (-2 === q.error) {
                            Hb(c);
                            return
                        }
                        if (-1 === q.error && G) {
                            c.ga && (delete c.ga, c.state = 3, y(c.ac) ? (d = function (a) {
                                    p(a, function (b, c) {
                                        a[c] = {
                                            state: 1
                                        }
                                    })
                                }, d(c.H), d(c.M), c.wa(function () {
                                        p(R, function (a, b) {
                                            c.j("createsubscription", 3, null, function (d) {
                                                var e = a.filter;
                                                d = d.subscriptionid;
                                                c.la(d, b);
                                                e[0] = "subscriptionid=" + encodeURIComponent(d);
                                                c.j("subscribefilter", 3, e, function () {})
                                            })
                                        });
                                        c.ca = !0
                                    }, e.G)) : c.wa(null, e.G));
                            return
                        }
                        return c.dd(q, b)
                    }
                    d = 0
                }
                if (!y(c) && 3 !== c.state) {
                    if (12029 <= d && 12031 >= d || 12152 == d)
                        d = 0;
                    return c.dd({
                        error: -1E3 -
                        d,
                        errorstring: "HTTP " + a.statusText,
                        httpstatus: d
                    })
                }
            } catch (z) {
                F("handling response", z)
            }
        };
        try {
            b = "ws://",
            0 == location.protocol.indexOf("https") && (b = "wss://"),
            -1 < t["data.url"].search("//") ? e.J = new WebSocket(t["data.url"].replace("//", b)) : e.J = new WebSocket(b + a + t["data.url"])
        } catch (f) {
            return
        }
        e.J.onopen = function () {
            e.wsState = 1;
            c()
        };
        e.J.onmessage = function (a) {
            var b = a.data,
            c;
            try {
                c = JSON.parse(b)
            } catch (d) {
                console.error("Exception @ socket data parsing: " + a.data),
                e.l.ea(-1)
            }
            e.kc.shift();
            c && "data" == c.cmd ? (b = e.yd.data,
                b(c, "" == a.origin ? e.J.url : a.origin)) : c && ("read" == c.cmd && (c.readyState = 4, c.status = 200, c.type = "ws", c.webMIReadUrl = e.J.url), "undefined" != typeof c.id && ("function" == typeof e.jb[c.id] && (b = e.jb[c.id], b(c)), e.jb[c.id] && delete e.jb[c.id]))
        };
        e.J.onerror = function () {
            e.wsState = 2;
            console.log(e.Zb + " => websocket " + e.J.url + " error (wsState: " + e.wsState + ", readyState: " + e.J.readyState + ").");
            1 == e.l.state && (e.l.state = 3)
        };
        e.J.onclose = function () {
            delete e.l.Aa;
            e.wsState = 2;
            console.log(e.Zb + " => websocket " + e.J.url + " closed (wsState: " +
                e.wsState + ", readyState: " + e.J.readyState + ").");
            1 == e.l.state && (e.l.state = 3);
            if (G) {
                var a = H();
                "requester" == e.Zb && a && e.l == a.h && 1 == e.l.L && e.l.ea(-1)
            } else
                e.l.ea(-1)
        }
    }
    function Ib(a, b) {
        this.Za = a;
        this.da = {};
        this.ya = {};
        this.gd = V(b)
    }
    function eb(a) {
        this.Za = a;
        this.qa = {}
    }
    function Jb(a) {
        this.p = a
    }
    function Kb(a) {
        this.p = a;
        this.F = [];
        this.B = [];
        this.cc = [];
        this.$c = [];
        this.hc = [];
        this.ic = [];
        this.gc = [];
        this.ec = [];
        this.paused = !1
    }
    function qc(a) {
        var b = a.F.slice();
        r(b, function (b) {
            a.unsubscribeFilter(b)
        });
        b = a.B.slice();
        r(b,
            function (b) {
            a.queryRelease(b)
        });
        Z.Jb(a.p);
        a.p = null;
        a.F = null;
        a.B = null;
        a.cc = null;
        a.hc = null;
        a.ic = null;
        a.gc = null;
        a.ec = null;
        a.paused = null
    }
    function wa(a) {
        if (B(a)) {
            var b = [];
            r(a, function (a) {
                b.push(wa(a))
            });
            return "[" + b.join(",") + "]"
        }
        C(a) && (a = JSON.stringify(a).replace(/"/g, "'"));
        return encodeURIComponent(a)
    }
    function S(a) {
        C(a) || O();
        var b = [];
        p(a, function (a, d) {
            B(a) ? r(a, function (a) {
                b.push(encodeURIComponent(d) + "[]=" + wa(a))
            }) : b.push(encodeURIComponent(d) + "=" + wa(a))
        });
        return b
    }
    function Lb(a, b, c) {
        r(a, function (a) {
            if (y(a.ha) ||
                a.ha == b || B(a.ha) && X(b, a.ha))
                try {
                    a.ua(c)
                } catch (e) {}
        })
    }
    function rc(a) {
        var b = a.keyCode,
        c = 0;
        a.je && (c += a.je);
        a.altKey && (c += 1);
        a.ctrlKey && (c += 2);
        a.shiftKey && (c += 4);
        a.metaKey && (c += 8);
        Lb(Ga, b, a);
        xa[b] = 1;
        r(Ha, function (d) {
            if (d.ke == c && d.ha == b)
                try {
                    d.ua(a)
                } catch (e) {}
        })
    }
    function sc(a) {
        var b = a.keyCode;
        xa[b] = 0;
        delete xa[b];
        Lb(ya, b, a)
    }
    function tc(a) {
        var b = a.which;
        r(Ia, function (c) {
            if (!c.xd || c.xd == b)
                try {
                    c.ua(a)
                } catch (d) {}
        })
    }
    function uc(a) {
        p(xa, function (b, c) {
            b && r(ya, function (b) {
                if (!b.ha || b.ha == c)
                    try {
                        b.ua(a)
                    } catch (e) {}
            })
        })
    }
    function Mb(a) {
        this.c = a;
        this.i = a.i;
        Nb(a) || a.Dc(function () {
            Nb(a)
        })
    }
    function vc(a) {
        a.c = null;
        a.i = null
    }
    function za(a, b, c) {
        var d = [];
        C(b) ? p(b, function (a, b) {
            d.push(encodeURIComponent(b) + "=" + encodeURIComponent(a))
        }) : u(b) && (d = [b]);
        if (-1 != a.indexOf("X-WebMI-")) {
            b = a.match(/(%26|&X-WebMI)(.*?)(?=%26|&)/g);
            for (var e in b)
                a = a.replace(b[e], "")
        }
        d.length && (a += (-1 != a.indexOf("?") ? "&" : "?") + d.join("&"));
        var f;
        (e = H()) ? f = e.h.n : I[""] && I[""][0] && (f = I[""][0].n);
        c && fa && !ba && f && "username" in K && "" != K.username && (++f.u, a += (-1 !=
                a.indexOf("?") ? "&" : "?") + ("X-WebMI-sid=" + f.s + "&X-WebMI-cnonce=" + f.u + "&X-WebMI-digest=" + Q(f.s + ":" + f.A + ":" + f.u)));
        return a
    }
    function fb(a) {
        if (!a.Va) {
            var b = a.$();
            b ? a.Va = 2 : (b = a.i.documentElement, U(b, "html") && (a.Va = 1))
        }
        return a.Va
    }
    function Nb(a) {
        var b = fb(a);
        if (!b)
            return 0;
        if (2 == b) {
            wc && (b = a.m.frameElement, b.style.height = "1px", b.style.width = "1px", b.style["min-height"] = "100%", b.style["min-width"] = "100%");
            var b = a.$(),
            c = b.getAttribute("viewBox");
            if (c)
                if (c = c.split(" "), 4 == c.length)
                    for (var d = 0; 4 > d; ++d)
                        c[d] = J(c[d]);
                else
                    c = 0;
            c || (c = [0, 0, J(b.getAttribute("width")), J(b.getAttribute("height"))]);
            a.ve(c);
            b.setAttribute("viewBox", c.join(" "));
            N(a.i, "selectstart", function (a) {
                a.preventDefault && a.preventDefault()
            })
        }
        return 1
    }
    function Ob(a) {
        this.p = a
    }
    function xc(a) {
        r([Ha, Ga, ya, Ia], function (b) {
            P(b, function (b) {
                return b.p == a
            })
        })
    }
    function Pb() {
        this.Cb = []
    }
    function yc(a) {
        r(a.Cb, function (a) {
            gb(a)
        });
        a.Cb = null
    }
    function Qb(a, b) {
        var c = this,
        d = c.p = b ? ++zc : 0;
        c.dc = [];
        c.yb = [];
        c.fc = [];
        c.zb = [];
        c.aa = {};
        c.ra = {};
        v[d] = c;
        c.m = a;
        c.i = a.document;
        c.sb =
            [];
        c.rc = [];
        c.jc = [];
        c.k = [];
        c.Se = [];
        c.xa = [];
        if (a.frameElement) {
            "popupcontent" == a.frameElement.parentNode.id && (c.Ne = !0);
            var e;
            try {
                e = c.m.parent.webMI.display.isRoot()
            } catch (f) {
                e = !1
            }
            c.$b = "mainframe" === c.m.frameElement.id && !e
        }
        c.Ec = new Jb(d);
        c.data = new Kb(d);
        c.R = new Rb(c);
        c.frame = new Mb(c);
        c.keys = new Ob(d);
        c.sc = new Pb;
        b && (c.bd(), c.ne = window.setInterval(function () {
                c.bd()
            }, 1E3));
        a.addEventListener("error", function (a) {
            x(window.handleError) && window.handleError(a)
        }, !0);
        N(a, "load", function (a) {
            c.Id(a)
        });
        c.frame.isRoot() &&
        N(a, "orientationchange", function (a) {
            c.Jd(a)
        });
        N(c.m, "resize", function (a) {
            c.Fc(a)
        });
        N(a, "unload", function () {
            c.Gc()
        });
        N(a, "blur", uc);
        N(a, "focus", function () {
            c.Hd()
        });
        N(c.i, "keydown", rc);
        N(c.i, "keyup", sc);
        N(c.i, "keypress", tc)
    }
    function Ac(a) {
        var b = a.p;
        for (r(a.k, function (a) {
                try {
                    a.fa.remove(a.element),
                    a.fa.Rd(a.element)
                } catch (b) {
                    b && b.number && -2146823281 != b.number && F("foreignObject remove function", b)
                }
            }); a.xa.length; )
            try {
                a.xa[0].close()
            } catch (c) {
                F("window close function", c)
            }
        p(v, function (b) {
            p(b.xa, function (b) {
                if (Qa(b,
                        a.i))
                    try {
                        b.close()
                    } catch (c) {
                        F("window close function", c)
                    }
            })
        });
        clearInterval(a.ne);
        xc(b);
        a.keys = null;
        vc(a.frame);
        a.frame = null;
        Bc(a.R);
        a.R = null;
        qc(a.data);
        a.data = null;
        Y.Jb(b);
        a.Ec = null;
        yc(a.sc);
        a.sc = null;
        a.xa = null;
        a.zb = null;
        a.fc = null;
        a.sb = null;
        a.k = null;
        a.dc = null;
        a.ra = null;
        p(a.aa, function (b, c) {
            a.aa[c] = null;
            delete a.aa[c]
        });
        a.aa = null;
        try {
            a.m.webMI = null
        } catch (d) {}
        a.i = null;
        a.m = null;
        v[b] = null;
        delete v[b];
        for (var e in I)
            for (b = 0; b < I[e].length; ++b)
                if (I[e][b].xb(Ya))
                    return
    }
    function Sb() {
        Aa = ++Aa % 12;
        p(v, function (a) {
            p(a.aa,
                function (a) {
                if (Aa in a.value)
                    a.$d[a.functionName](a.Td, a.value[Aa])
            })
        });
        window.setTimeout(Sb, 250)
    }
    function hb(a, b) {
        var c = this.c = new Qb(a, b),
        d = c.mb("");
        (function () {
            a.String.prototype.replaceAll || (a.String.prototype.replaceAll = function (a, b) {
                if ("[object regexp]" === Object.prototype.toString.call(a).toLowerCase())
                    return this.replace(a, b);
                if ("." == a || "?" == a || "/" == a || "\\" == a)
                    a = "\\" + a;
                return this.replace(new RegExp(a, "g"), b)
            })
        })();
        this.rootWindow = y(v[0]) ? c.m : v[0].m;
        this.alarm = c.Ec;
        this.data = c.data;
        this.display =
            c.frame;
        this.dom = c.R;
        this.frame = c.frame;
        this.sound = c.sc;
        this.keys = c.keys;
        this.trendFactory = new Tb(c);
        this.libraryLoader = new Ub(c);
        this.table = new Cc(c);
        this.callExtension = rb(this, c.m, c.i);
        this.gfx = new ga(c, c.i.documentElement, d, "");
        this.trigger = new ib(c, "");
        this.widget = new jb(0, d);
        Dc(this.query = {}, a.location.search);
        this.addEvent = qb(d);
        this.removeEvent = function () {}
    }
    function Dc(a, b) {
        r(b.substr("?" == b.charAt(0) ? 1 : 0).split("&"), function (b) {
            try {
                var d = b.split("=");
                if (2 == d.length) {
                    var e = decodeURIComponent(d[0]),
                    f = decodeURIComponent(d[1]);
                    2 < e.length && "[]" == e.substr(e.length - 2, 2) ? (e = e.substr(0, e.length - 2), e in a || (a[e] = []), a[e].push(f)) : a[e] = f
                }
            } catch (h) {}
        })
    }
    function Tb(a) {
        this.D = a;
        this.D.Ha("other/promise.polyfill.min.js");
        this.D.sa(Ec.bind(this));
        this.ib = []
    }
    function Fc(a) {
        if (y(a))
            throw Error("createdTrend requires options to be set!");
        for (var b = [{
                    name: "trendName",
                    defaultValue: "trend_" + (new Date).getTime()
                }, {
                    name: "trendGroup",
                    defaultValue: ""
                }, {
                    name: "trendConfigNode",
                    defaultValue: "AGENT.OBJECTS.Trend.Configurations"
                }
            ],
            c = [{
                    name: "additionalModules",
                    defaultValue: []
                }
            ], d = 0; d < b.length; d++)
            u(a[b[d].name]) || (a[b[d].name] = b[d].defaultValue);
        for (d = 0; d < c.length; d++)
            B(a[c[d].name]) || (a[c[d].name] = c[d].defaultValue)
    }
    function Gc(a, b, c) {
        function d() {
            return function () {
                a = a.slice(1);
                0 < a.length ? e.D.Ha(a[0], d()) : c()
            }
        }
        var e = this,
        f = "highcharts/modules/exporting.js highcharts/modules/offline-exporting.js highcharts/modules/export-data.js highcharts/datasource/opcua.js highcharts/atviseModules/trendcontrol.js highcharts/atviseModules/renderer.js highcharts/atviseModules/datahandler.js highcharts/atviseModules/measuringcursor.js highcharts/atviseModules/utils.js highcharts/atviseModules/downsample.js highcharts/modules/boost-canvas.js highcharts/modules/boost.js".split(" ");
        kb || (f = f.concat(["highcharts/tableexport/exceljs.min.js", "highcharts/tableexport/FileSaver.min.js", "highcharts/tableexport/ssf.js", "highcharts/tableexport/atvise-export-xlsx.js"]));
        b || Array.prototype.unshift.apply(a, f);
        Array.prototype.unshift.apply(a, ["highcharts/highcharts-more.js", "highcharts/atviseModules/atviseevents.js", "highcharts/atviseModules/atvisedefaults.js", "highcharts/atviseModules/atviseoptimizations.js", "highcharts/datasource/datasource.js"]);
        e.D.Ha("highcharts/highcharts.js", function () {
            e.Oc =
                v[0].m.Highcharts;
            0 < a.length && u(a[0]) ? e.D.Ha(a[0], d()) : c()
        })
    }
    function Hc(a, b) {
        if (C(a.trendConfig))
            b();
        else {
            var c;
            a: {
                try {
                    JSON.parse(a.trendConfig)
                } catch (d) {
                    c = !1;
                    break a
                }
                c = !0
            }
            c ? a.trendConfig = JSON.parse(a.trendConfig) : (a.trendConfig = {}, b())
        }
    }
    function Ic(a, b, c) {
        var d = this;
        d.name = b;
        d.group = c;
        d.containerID = a.container.id;
        d.chart = a;
        d.control = {};
        v[0].m.TrendControl.decorate(d.control, d.chart);
        d.destroy = function () {
            d.control.destroy();
            d.chart = null;
            d.name = null;
            d[c] = null;
            d.containerID = null;
            P(ca, function (a) {
                return a ==
                d ? !0 : !1
            })
        }
    }
    function Ec() {
        this.ib = this.Oc = this.D = null
    }
    function Ub(a) {
        var b = this;
        b.D = a;
        b.ready = !1;
        b.D.sa(Jc.bind(b));
        this.getReady = function () {
            console.log(b.ready);
            return b.ready
        };
        this.load = function (a, d, e) {
            var f = this;
            "loading" == b.ready ? setTimeout(function () {
                f.load(a, d, e)
            }, 25) : (b.ready = "loading", b.pc(a, d, e))
        };
        this.jQuery = function (a) {
            b.pc(["jquery/jquery-3.3.1.min.js"], [], a)
        };
        b.pc = function (a, b, e) {
            var f = this;
            if (f.D) {
                if (0 < b.length)
                    for (var h in b)
                        f.ge(f.ye(b[h]), b[h]);
                0 < a.length ? (b = a.shift(), f.D.Ha(b, function () {
                        f.pc(a,
                            [], e)
                    })) : (f.ready = !0, "function" == typeof e && e())
            } else
                console.warn("Can't proceed with script loader because page is unloaded.")
        };
        b.ye = function (a) {
            var b = 1,
            e = 0,
            f;
            if (a)
                for (b = 0, f = a.length - 1; 0 <= f; f--)
                    e = a.charCodeAt(f), b = (b << 6 & 268435455) + e + (e << 14), e = b & 266338304, b = 0 !== e ? b ^ e >> 21 : b;
            return String(b)
        };
        b.ge = function (a, b) {
            var e = a + "_css",
            f = H();
            if (!document.getElementById(e)) {
                var h = document.createElement("link");
                h.id = e;
                h.rel = "stylesheet";
                h.type = "text/css";
                h.setAttribute("atv:required", !0);
                e = la[""];
                fa && !ba && e && "username" in
                K && "" != K.username && (++e.u, b += (-1 != b.indexOf("?") ? "&" : "?") + ("X-WebMI-sid=" + e.s + "&X-WebMI-cnonce=" + e.u + "&X-WebMI-digest=" + Q(e.s + ":" + e.A + ":" + e.u)));
                h.href = f ? ha + f.h.n.q + "/" + b : b;
                h.media = "all";
                document.getElementsByTagName("head")[0].appendChild(h)
            }
        }
    }
    function Jc() {
        this.D = null
    }
    function Cc(a) {
        function b(a) {
            for (var b in T) {
                var c = T[b],
                h;
                for (h in c)
                    if (h === a)
                        return c[h]
            }
            return !1
        }
        var c = this;
        this.D = a;
        this.ready = !1;
        this.D.sa(Kc.bind(this));
        this.fb = {};
        T[a.p] = this.fb;
        this.eb = [];
        this.Kd = function () {
            return "function" ==
            typeof window.jQuery ? !0 : !1
        };
        this.loadResources = function (a, b) {
            var f,
            h;
            "object" == typeof a && "function" == typeof b ? (f = a, f.unshift("slickgrid/core/DataController.js"), h = b) : "function" == typeof a ? (f = "slickgrid/core/DataController.js slickgrid/controller/SlickController.js slickgrid/controller/helper/SlickConfigurator.js slickgrid/controller/helper/SlickStyler.js slickgrid/controller/helper/SlickFormatter.js slickgrid/controller/helper/SlickDialogs.js".split(" "), c.Kd() || f.unshift("jquery/jquery-3.3.1.min.js"),
                h = a) : console.error("WebMITableStorage: No callback found");
            (new Ub(c.D)).load(f, [], function () {
                h()
            })
        };
        this.register = function (a, b, f, h) {
            var g;
            a: {
                for (g in T) {
                    var l = T[g];
                    if ("undefined" !== typeof l[a] && l[a] === a && l[a][b] === b) {
                        g = !0;
                        break a
                    }
                }
                g = !1
            }
            g && !h ? console.warn("Dataname " + b + " already exists for " + a + "and cannot be used!") : ("undefined" === typeof c.fb[a] && (c.fb[a] = []), c.fb[a][b] = f)
        };
        this.request = function (a, b) {
            for (var c in T) {
                var h = T[c];
                if ("undefined" !== typeof h[a] && "undefined" !== typeof h[a][b])
                    return h[a][b]
            }
            return !1
        };
        this.setReady = function (a, e) {
            var f = b(a);
            if (c && f)
                for (f[e].isReady = !0, f = 0; f < c.eb.length; f++) {
                    var h = c.eb[f];
                    h.table === a && h.Pd === e && (h.K(), c.eb.splice(f, 1), f--)
                }
            else
                console.warn("Table " + a + " is not in storage yet!")
        };
        this.waitReady = function (a, e, f) {
            var h = b(a);
            h && void 0 !== h[e] ? !0 === h[e].isReady && "function" === typeof f && f() : c.eb.push({
                table: a,
                Pd: e,
                K: f
            })
        };
        this.remove = function (a) {
            a: for (var b in T) {
                var c = T[b],
                h;
                for (h in c)
                    if (h === a) {
                        c[h] = null;
                        break a
                    }
            }
        }
    }
    function Kc() {
        delete T[this.D.p];
        this.fb = this.D = this.eb =
            null
    }
    function Rb(a) {
        this.i = a.i;
        this.w = a.mb("")
    }
    function Bc(a) {
        a.i = a.w = null
    }
    function Ja(a, b) {
        u(b) && (b = a.w(b));
        return b
    }
    function Vb(a, b, c, d) {
        var e = b + "Direct";
        a.prototype["get" + e] = c;
        Wa(a, "get" + b, function (a) {
            if (a = Ja(this, a))
                return this["get" + e](a)
        });
        a.prototype["set" + e] = d;
        Wa(a, "set" + b, function (a, b) {
            if (a = Ja(this, a)) {
                var c = "set" + e;
                y(a.Pc) || this.c.se(a.Pc, c);
                if (!C(b) || null === b || B(b))
                    "VisibleDirect" == e && p(v, function (c) {
                        r(c.ad, function (c) {
                            try {
                                c({
                                    element: a,
                                    value: b
                                })
                            } catch (d) {}
                        })
                    });
                else {
                    a.Pc = this.c.Ad(a, b, this,
                            c);
                    for (var d = null, k = 0; 12 > k; ++k)
                        k in b && (d = b[k]);
                    for (k = Aa; 0 <= k; --k)
                        if (k in b) {
                            d = b[k];
                            break
                        }
                    b = d
                }
                return this[c](a, b)
            }
        })
    }
    function ga(a, b, c, d) {
        var e = Lc;
        this.c = a;
        this.w = c;
        this.Kc = d;
        this.ob = b;
        this.c.ad = [];
        this.Dd = e;
        this.Ud = 0;
        this.Vd = {};
        this.Pb = {};
        this.Nb = {};
        this.Ob = {};
        this.Qb = {};
        this.Rb = {};
        this.Sb = {};
        this.Tb = {}
    }
    function Lc(a, b, c, d, e, f, h, g, l, k, m, q, s, z, w, A, r) {
        u(q[b]) || (q[b] = a.getAttribute("transform"), q[b] || (q[b] = ""));
        isNaN(c) && (c = 0);
        isNaN(d) && (d = 0);
        a.setAttribute("transform", "translate(" + c + "," + d + ") rotate(" +
            e + ") scale(" + g + "," + l + ") skewX(" + k + ") skewY(" + m + ") translate(" + (f - c) + "," + (h - d) + ") " + q[b]);
        for (var p in this.c.k)
            0 == this.c.k[p].id.indexOf(s) && (this.c.k[p].element.style.transform = "rotate(" + e + "deg)", "undefined" === typeof this.c.k[p].U && (this.c.k[p].U = {}, this.c.k[p].U.x = this.c.k[p].x, this.c.k[p].U.y = this.c.k[p].y, this.c.k[p].U.height = this.c.k[p].height, this.c.k[p].U.width = this.c.k[p].width), this.c.k[p].height = this.c.k[p].U.height * l, this.c.k[p].width = this.c.k[p].U.width * g, a = this.c.k[p].U.height / A, b = this.c.k[p].U.width /
                    r, k = (d - w) * a, m = (c - z) * b, this.c.k[p].x = this.c.k[p].U.x + f * g * b + (m - m * g), this.c.k[p].y = this.c.k[p].U.y + h * l * a + (k - k * l), this.c.k[p].element.style.top = this.c.k[p].y + "px", this.c.k[p].element.style.left = this.c.k[p].x + "px", this.c.k[p].element.style.height = this.c.k[p].height + "px", this.c.k[p].element.style.width = this.c.k[p].width + "px")
    }
    function Ka(a, b) {
        a.style.display = null === b ? "" : b ? "block" : "none"
    }
    function Wb(a, b) {
        var c = null;
        p(a.k, function (a) {
            a.element == b && (c = a)
        });
        return c
    }
    function La(a) {
        return [function (b) {
                var c =
                    Wb(this.c, b);
                return c ? c[a] : b.getAttribute(a)
            }, function (b, c) {
                var d = this.c,
                e = Wb(d, b);
                if (!e)
                    return null === c ? b.removeAttribute(a) : b.setAttribute(a, c);
                e[a] = c;
                d.Ja()
            }
        ]
    }
    function Xb(a, b) {
        if (null === b || !("hasAttribute" in b))
            return a.createSVGMatrix();
        var c = Xb(a, b.parentNode),
        d = a.createSVGMatrix();
        b.hasAttribute("transform") && (d = Yb(d, b));
        b.hasAttribute("x") && (d.e += J(b.getAttribute("x")));
        b.hasAttribute("y") && (d.f += J(b.getAttribute("y")));
        return c.multiply(d)
    }
    function Mc(a, b, c) {
        a = a.createElementNS("http://www.w3.org/2000/svg",
                "rect");
        a.setAttribute("transform", c);
        return Yb(b, a)
    }
    function Yb(a, b) {
        for (var c = b.transform.baseVal, d = 0; d < c.numberOfItems; ++d)
            a = a.multiply(c.getItem(d).matrix);
        return a
    }
    function ib(a, b) {
        this.c = a;
        this.Da = b
    }
    function Zb(a) {
        this.w = a
    }
    function $b(a, b) {
        this.w = b
    }
    function jb(a, b) {
        this.w = b;
        this.checkbox = new Zb(b);
        this.combobox = new $b(0, b)
    }
    function sb() {
        function a() {
            return e() ? Math.max(screen.width, screen.height) : Math.min(screen.width, screen.height)
        }
        function b() {
            if ("mobile" == h.forceDevice)
                return !0;
            if ("desktop" ==
                h.forceDevice || "tablet" == h.forceDevice)
                return !1;
            var b = e() ? h.landscape.thresholdMobile : h.portrait.thresholdMobile;
            return a() < b
        }
        function c() {
            if ("desktop" == h.forceDevice)
                return !0;
            if ("mobile" == h.forceDevice || "tablet" == h.forceDevice)
                return !1;
            var b = e() ? h.landscape.thresholdDesktop : h.portrait.thresholdDesktop;
            return a() > b
        }
        function d() {
            return "undefined" != typeof h.forceDevice && ("desktop" == h.forceDevice || "tablet" == h.forceDevice) || "mobile" == h.forceDevice ? h.forceDevice : b() ? "mobile" : c() ? "desktop" : "tablet"
        }
        function e() {
            return screen.orientation &&
            screen.orientation.type ? screen.orientation.type.startsWith("landscape") : window.matchMedia("(orientation: landscape)").matches
        }
        function f() {
            l.isDesktop = c();
            l.isMobile = b();
            l.isTablet = "tablet" == h.forceDevice ? !0 : "desktop" == h.forceDevice || "mobile" == h.forceDevice ? !1 : "tablet" == d();
            l.isTouchDevice = h.forceTouch ? !0 : h.ignoreTouch ? !1 : "ontouchstart" in document.documentElement || window.Ce && document instanceof DocumentTouch || -1 < navigator.userAgent.indexOf("Bachmann");
            l.isMultiTouchDevice = h.ignoreTouch ? !1 : 1 < navigator.Pe ||
                /iP(hone|od|ad)/.test(navigator.userAgent);
            l.isLandscape = e();
            l.deviceType = d();
            l.browserType = {
                isChrome: lb,
                isSafari: ac,
                isIE11: kb,
                isFirefox: Nc
            };
            var a = d();
            l.deviceScaling = g[a]
        }
        var h = t.responsiveLite.config,
        g = t.responsiveLite.deviceScaling,
        l = {};
        f();
        window.addEventListener("orientationchange", function () {
            f()
        });
        return l
    }
    function Oc(a, b, c, d, e, f, h) {
        var g = b.c,
        l = g.mb(e);
        this.td = da(a.document, {
            getElementById: l
        });
        b = this.ud = da(b, {
            addEvent: qb(l),
            gfx: new ga(g, d, l, c),
            parentWindow: h,
            query: f,
            trigger: new ib(g, e),
            widget: new jb(0,
                l)
        });
        b.gfx.elementPrefix = e;
        this.uc = da(a, {
            document: this.td,
            webMI: this.ud
        });
        a = g.i;
        0 === e.indexOf("id_" + c + "_") && "{}" == JSON.stringify(f) && (a = da(g.i), a.getElementById = g.mb(e));
        b.callExtension = rb(b, g.m, a)
    }
    var J = parseFloat,
    ha = window.location.protocol + "//",
    Ba = navigator.userAgent,
    wc = J((/CPU.*OS ([0-9]+)[0-9_]+.*AppleWebKit.*Mobile/i.exec(Ba) || [0, 0])[1]),
    lb = /Chrome/.test(Ba) && /Google Inc/.test(navigator.vendor),
    ac = /Safari/.test(Ba) && /Apple Computer/.test(navigator.vendor),
    kb = /Trident\/7\./.test(Ba),
    Nc = /Firefox/.test(Ba),
    bc = /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/.test(navigator.userAgent),
    Ma = {
        browse: 1,
        read: 2,
        write: 4,
        engineer: 8,
        execute: 16,
        alarmAdmin: 256,
        alarmAcknowledge: 512,
        alarmConfirm: 1024
    },
    D = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/",
    W = [],
    Aa = 0,
    zc = 0,
    Pc = 0,
    v = {},
    G = !1,
    Qc = 0,
    Rc = 0,
    la = {},
    Y = new eb(!0),
    Z = new eb(!1),
    ja = {},
    R = {},
    mb = {},
    pa = "",
    I = {},
    Za = !1,
    K = {},
    $ = {},
    Eb = 0,
    Cb = {},
    $a = null,
    ua = [],
    nb = "",
    ob = "",
    Ra = {},
    Sa = [],
    ma = [],
    Ha = [],
    Ga = [],
    ya = [],
    Ia = [],
    xa = [],
    Va = {},
    cc = "",
    Ca = null,
    aa = null,
    ba = !1,
    Da = !1,
    fa = !1,
    dc = 0,
    ec = {},
    ia = {},
    fc = [],
    gc = null,
    gb = null,
    ca = [],
    T = {};
    window.Je = T;
    var t = {
        "alarm.management.global": !1,
        "data.enabledeletesession": !0,
        "data.enablelongpoll": !0,
        "data.keepaliveinterval": 4E3,
        "data.publishmaxresults": 0,
        "data.publishinterval": 0,
        "data.requesttimeout": 3E3,
        "data.failoverrequesttimeout": 5E3,
        "data.sessiontimeout": 0,
        "data.url": "/webMI/?",
        "data.websocket": !0,
        "data.permissionlogsize": 100,
        "data.userreload": !0,
        "frame.enableautofit": !0,
        "frame.rememberwindows": !1,
        "frame.scaletype": lb || ac ? "zoom" : "transform",
        "frame.displaytype": "xhtml",
        "frame.documentdomain": !0,
        "frame.alignment": "center",
        responsiveLite: {
            active: !1,
            config: {
                mobile: !0,
                tablet: !0,
                desktop: !0,
                forceDevice: "",
                forceTouch: !1,
                ignoreTouch: !1,
                portrait: {
                    active: !0,
                    thresholdMobile: 500,
                    thresholdDesktop: 1200
                },
                landscape: {
                    active: !0,
                    thresholdMobile: 850,
                    thresholdDesktop: 1400
                }
            },
            deviceScaling: {
                desktop: {
                    window: {
                        content: 1,
                        titlebar: 1
                    },
                    table: {
                        fontsize: 1,
                        rowheight: 1
                    },
                    contextmenu: {
                        fontsize: 1,
                        rowheight: 1
                    }
                },
                tablet: {
                    window: {
                        content: 1.5,
                        titlebar: 1.5
                    },
                    table: {
                        fontsize: 1.1,
                        rowheight: 1.5
                    },
                    contextmenu: {
                        fontsize: 1.1,
                        rowheight: 1.5
                    }
                },
                mobile: {
                    window: {
                        content: 2,
                        titlebar: 2
                    },
                    table: {
                        fontsize: 1.2,
                        rowheight: 2
                    },
                    contextmenu: {
                        fontsize: 1.2,
                        rowheight: 2
                    }
                }
            }
        }
    };
    if ("webMIConfig" in window) {
        var Na = window.webMIConfig;
        p(t, function (a, b) {
            "object" == typeof Na[b] ? Ua(a, Na[b]) : b in Na && Ta(b, Na[b])
        })
    }
    "transform" !== t["frame.scaletype"] && "zoom" !== t["frame.scaletype"] && (t["frame.scaletype"] =
            "native");
    "xhtml" !== t["frame.displaytype"] && "svg" !== t["frame.displaytype"] && (t["frame.displaytype"] = "xhtml");
    (function () {
        function a(a, c) {
            c = c || {
                bubbles: !1,
                cancelable: !1,
                detail: void 0
            };
            var d = document.createEvent("CustomEvent");
            d.initCustomEvent(a, c.bubbles, c.cancelable, c.detail);
            return d
        }
        if ("function" === typeof window.CustomEvent)
            return !1;
        a.prototype = window.Event.prototype;
        window.CustomEvent = a
    })();
    (function () {
        if ("function" === typeof Object.assign)
            return !1;
        Object.assign = function (a) {
            if (null == a)
                throw new TypeError("Cannot convert undefined or null to object");
            a = Object(a);
            for (var b = 1; b < arguments.length; b++) {
                var c = arguments[b];
                if (null != c)
                    for (var d in c)
                        Object.prototype.hasOwnProperty.call(c, d) && (a[d] = c[d])
            }
            return a
        }
    })();
    zb(window);
    N(window, "unload", function () {
        t["data.enabledeletesession"] && p(I, function (a) {
            r(a, function (a) {
                ab(a)
            })
        })
    });
    setInterval(Ya, 50);
    var Ea = !1;
    E(Fa, {
        wa: function (a, b) {
            var c = this,
            d = c.n,
            e = c.Fd;
            b && (c.Ga = b);
            if (y(a) || null === a)
                a = function () {};
            if (2 == c.state)
                return a();
            1 != c.state && (c.state = 1, c.Qd(function () {
                    function b() {
                        d.setActive(!0);
                        c.state = 2;
                        a();
                        c.Qc(c.n.q) || c.Sa(1)
                    }
                    function h(a) {
                        var h = a.features;
                        if (!("features" in a)) {
                            var k = a.certificationlevel,
                            h = a.features = ["read", "write"];
                            a.securitysupport && h.push("login", "changepassword");
                            1 <= a.accesscontrolversion && h.push("getRights");
                            "basic" != k && (h.push("session", "subscribedata"), "advanced" != k && (h.push("aggregates", "queryfilter", "querynext", "queryrelease", "subscribefilter"), "scada" != k && h.push("multipoint")))
                        }
                        r(h, function (a) {
                            ec[a] = !0
                        });
                        "vendorinfo" in a && (cc = a.vendorinfo);
                        "accesscontrolversion" in a &&
                        1 <= a.accesscontrolversion && (fa = !0);
                        "accesscontrolversion" in a && (dc = a.accesscontrolversion);
                        "cookiesupport" in a && (ba = a.cookiesupport);
                        "loginrequired" in a && (Da = a.loginrequired);
                        !1 == Da && "loginmethod" in a && ("http" == a.loginmethod || "ntlm" == a.loginmethod) && (Da = !0);
                        "methodsupport" in a && (fc = a.methodsupport);
                        ia = {
                            queryfilter: !0,
                            subscribefilter: !0,
                            readfilter: !0
                        };
                        "filtersupport" in a && C(a.filtersupport) && (ia = a.filtersupport);
                        for (var m in ia)
                            "boolean" === typeof ia[m] || B(ia[m]) || (ia[m] = !0);
                        "" === c.hb && lc(X("multipoint",
                                h) ? a.servername : null);
                        c.L = X("session", h) ? 5 : X("processimage", h) ? 3 : 2;
                        y(c.Ca) && (c.Ca = Y.Hb(c.hb, c));
                        y(c.ta) && (c.ta = Z.Hb(c.hb, c));
                        if (5 == c.L) {
                            a = d.Ub(c.A);
                            var q = {};
                            "" != q && (q.cipher = a);
                            t["data.sessiontimeout"] && (q.timeout = t["data.sessiontimeout"]);
                            c.j("createsession", 1, S(q), function (a) {
                                function g() {
                                    c.L = 6;
                                    c.j("createsubscription", 1, S({
                                            Persistent: !0
                                        }), function (a) {
                                        c.ab = a.subscriptionid;
                                        a = c.n.q;
                                        a = c.hb ? c.hb : a ? a : null;
                                        console.info("Created session '" + c.s + "' with main subscription '" + c.ab + "'" + (a ? " @ '" + a + "'" : ""));
                                        c.L = t["data.websocket"] ? 10 : 7;
                                        (a = H()) && c == a.C && (c.L = 6);
                                        Za || a && c != a.h || (Za = !0);
                                        b()
                                    })
                                }
                                c.s = a.sessionid;
                                e && (d.s = c.s);
                                a = c.Ga[0];
                                var h;
                                2 == c.Ga.length && (d.q && d.q == c.Ga[1] ? (h = a, a = d.q) : h = c.Ga[1]);
                                t["data.websocket"] ? d.Z && d.Z[a] && 2 != d.Z[a].wsState ? g() : d.Z[a] = new db(a, c, g, "requester") : (d.Z[a] = {
                                            wsState: 2
                                        }, h && (d.Z[h] = {
                                                wsState: 2
                                            }), g())
                            })
                        } else
                            t["data.publishinterval"] || (t["data.publishinterval"] = 250), 3 == c.L && c.j("listprocessimage", 1, q, function (a) {
                                c.oe = a.result;
                                c.ed = [];
                                r(c.oe, function (a) {
                                    c.ed.push(a.address)
                                });
                                c.L =
                                    4;
                                b()
                            }), 2 == c.L && b()
                    }
                    delete c.s;
                    delete d.s;
                    c.j(e[1].toLowerCase(), 1, null, function (a) {
                        c.va = d.va;
                        var l = e[0].indexOf("G"),
                        k = e[0].indexOf("W"),
                        m = a.result,
                        q = m.substr(l, k),
                        s = [function (a, b, c, d) {
                                a[b] = c | d
                            }, function (a, b, c, d) {
                                a[b] = c > d ? c : d
                            }, function (a, b, c, d) {
                                a[b] = d ? c / d : 0
                            }, function (a, b, c, d) {
                                a[b] = c < d ? c : d
                            }, function (a, b, c, d) {
                                a[b] = c - d
                            }, function (a, b, c, d) {
                                a[b] = c << (d & 7) | c >> 8 - (d & 7)
                            }, function (a, b, c, d) {
                                a[b] = c * d
                            }, function (a, b, c, d, e, f) {
                                a[b] = c;
                                a[e] = d;
                                a[f] = a[b]
                            }, function (a, b, c, d) {
                                a[b] = d ? c % d : 0
                            }, function (a, b, c, d) {
                                a[b] = c >> (d & 7) |
                                    c << 8 - (d & 7)
                            }, function (a, b, c, d) {
                                a[b] = c & d
                            }, function (a, b, c, d) {
                                a[b] = (c + d) / 2
                            }, function (a, b, c, d) {
                                a[b] = c + d
                            }, function (a, b, c, d) {
                                a[b] = c ^ ~d
                            }, function (a, b, c, d) {
                                a[b] = c ^ d
                            }, function (a, b, c, d) {
                                var e = 0;
                                for (b = 0; 8 > b; ++b)
                                    e += (c >> b & 1) + (d >> b & 1);
                                a[b] = e
                            }
                        ];
                        B(W) && r(W, function (a) {
                            a(m)
                        });
                        W = m;
                        m = Q(q);
                        d.O = W.lastIndexOf(m.substr(l, l));
                        d.O -= W.indexOf(m.substr(W == m, l));
                        d.O = d.O == k + l;
                        c.j("info", 1, null, function (a) {
                            c.kd = a.role;
                            c.va = a;
                            c.n.va = a;
                            d.O ? c.j(e[1].toLowerCase(), 1, e[2].substr(0, 37).replace(/\+/, "="), function (a) {
                                for (var b = [[], []],
                                    e = [], f = [], g = 0; g < q.length; ++g)
                                    b[g % 2].push(D.indexOf(q.charAt(g))), e.push(D.indexOf(D.charAt(79 + g))), f.push(D.indexOf(a.result.toUpperCase().charAt(g))), d.O = !d.O;
                                for (g = 0; g < l; ++g)
                                    e[g] = e[2 * g] << 4 | e[2 * g + 1], f[g] = f[2 * g] << 4 | f[2 * g + 1];
                                for (g = 0; g < l / 2; ++g)
                                    s[b[0][g]](e, b[1][g], e[b[1][g + 8]] & 255, e[b[0][g + 8]] & 255, b[1][g + 8], b[0][g + 8], e.pop(), e.pop());
                                r(e, function (a, b) {
                                    d.O &= (a & 255) == f[b]
                                });
                                h(c.va)
                            }) : b()
                        })
                    })
                }))
        },
        Qd: function (a) {
            a()
        },
        la: function (a, b) {
            this.F[a] = b
        },
        Bc: function (a) {
            this.B[a] = a
        },
        Ma: function () {
            return this.F
        },
        Fe: function () {
            return this.B
        },
        ea: function (a) {
            ka(a, this);
            this.n.setActive(!1)
        },
        qc: function (a) {
            (this.bc = a) && this.Qa()
        },
        Qa: function () {
            function a(a) {
                function c() {
                    if (G) {
                        e[a] = !1;
                        b.cb[a] = !1;
                        d.V[a] = !1;
                        for (var f in e)
                            if (e[f])
                                return;
                        JSON.stringify(h) !== JSON.stringify(d.V) && d.Nc();
                        t["data.websocket"] && (f = H(), f.h.n.Xa() || va(f, f.h), f.C.n.Xa() || 2 != f.h.P || 2 != f.C.P || $["active-exists"] && sa(f))
                    } else
                        ka(-1)
                }
                function f(c, g) {
                    function k() {
                        if (G) {
                            e[a] = !1;
                            d.V[a] = !0;
                            for (var b in e)
                                if (e[b])
                                    return;
                            JSON.stringify(h) !== JSON.stringify(d.V) &&
                            d.Nc()
                        }
                    }
                    if (!t["data.websocket"] || t["data.websocket"] && "ws" == c.type || !0 == g)
                        k();
                    else {
                        if (y(c.Kb) || "" == c.Kb)
                            return F("online function", Error("webMIReadUrl must not be empty or undefined!"));
                        var m = document.createElement("a");
                        m.href = c.Kb;
                        m.href = m.href;
                        var p = m.hostname;
                        "http:" == m.protocol ? p = p + ":" + ("" == m.port ? "80" : m.port) : "https:" == m.protocol && (p = p + ":" + ("" == m.port ? "443" : m.port));
                        m = null;
                        (m = d.Ya(p)) && 2 != m.wsState ? k() : d.Z[p] = new db(p, b, k, "read")
                    }
                }
                G && (!G || "undefined" != typeof b.state && 1 == b.state) || d.Md(a, f, c)
            }
            if (this.bc) {
                var b = this,
                c = t["data.keepaliveinterval"];
                if (c) {
                    var d = b.n,
                    e = {};
                    if (G)
                        for (var f = d.G, h = JSON.parse(JSON.stringify(d.V)), g = 0; g < f.length; ++g)
                            e[f[g]] = !0;
                    y(d.s) || ++d.u;
                    if (G)
                        for (g = 0; g < f.length; ++g)
                            a(f[g]);
                    else
                        a();
                    setTimeout(function () {
                        b.Qa()
                    }, c)
                }
            }
        },
        T: function () {
            return this.n.Pa
        },
        j: function (a, b, c, d, e) {
            function f() {
                var f = !1,
                l = setTimeout(function () {
                    e && (f = !0, e())
                }, t["data.requesttimeout"]);
                h.n.j(a, b, h.Yb, c, function (a) {
                    f || (clearTimeout(l), d(a))
                })
            }
            var h = this;
            h.Aa && b & 2 ? h.Aa.push(f) : f()
        },
        Ka: function (a) {
            this.tc =
                a;
            r(this.Aa, oa("queued request"));
            delete this.Aa
        },
        ba: function (a, b, c, d, e) {
            if (this.T() && c in a) {
                a = a[c];
                var f = a.wb,
                h = !e || y(f);
                h || p(d, function (a, b) {
                    f[b] !== a && (h = !0)
                });
                h && b.lc(c, a.wb = d)
            }
        },
        qd: function (a) {
            a || (a = "");
            this.cb[a] = !0
        },
        pd: function (a) {
            a || (a = "");
            this.cb[a] = !1
        },
        Qc: function (a) {
            a || (a = "");
            return this.cb[a]
        },
        qb: function (a, b, c) {
            var d = this;
            d.tc || d.Ka(1);
            var e = d.n.q;
            d.qd(e);
            d.j(a, 1, b, function (a) {
                d.pd(e);
                r(a.result, function (a, b) {
                    d.ba(d.H, d.ta, c[b], a, !0)
                });
                d.za()
            })
        },
        Sa: function (a) {
            var b = this,
            c = b.n;
            if (null !==
                c.O && !y(b.va))
                switch (c.O || (b.L = 9), b.L) {
                case 9:
                    alert("INVALID LICENSE");
                case 5:
                case 6:
                    break;
                case 2:
                    var d = [],
                    e = [];
                    p(b.H, function (a, b) {
                        d.push(b);
                        e.push("address[]=" + encodeURIComponent(b))
                    });
                    return b.qb("read", e, d);
                case 4:
                    return b.qb("readprocessimage", null, b.ed);
                case 10:
                    b.tc || b.Ka(a);
                    break;
                case 7:
                    if (!b.tc)
                        return b.Ka(a), setTimeout(function () {
                            b.Sa()
                        }, 50);
                    e = {};
                    t["data.enablelongpoll"] || (e.longpoll = "false");
                    t["data.publishmaxresults"] && (e.maxresults = t["data.publishmaxresults"]);
                    var f = c.q;
                    b.qd(f);
                    b.j("publish",
                        1, S(e), function (a) {
                        b.pd(f);
                        a.error && a.errorstring && console.warn("Server responded with error: " + a.errorstring);
                        if (a.error && -1 == a.error)
                            b.ea(-2);
                        else if (a.error || 0 === a.httpstatus)
                            b.ea(-1);
                        else {
                            r(a.result, function (a) {
                                var c = a.subscriptionid;
                                delete a.subscriptionid;
                                r(c, function (c) {
                                    if (c == b.ab) {
                                        c = a.address;
                                        var d = a.type;
                                        delete a.type;
                                        if (1 == d)
                                            b.ba(b.H, b.ta, c, a, !1);
                                        else if (2 == d)
                                            b.ba(b.M, b.Ca, c, a, !1);
                                        else
                                            throw "Unknown type '" + d + "' of publish item.";
                                    } else if (b.T())
                                        if ("" == c)
                                            Bb(a);
                                        else if (c in b.F) {
                                            if (c = b.F[c],
                                                c in R)
                                                try {
                                                    R[c].K(a)
                                                } catch (e) {
                                                    F("publish callback of filter '" + c + "'", e)
                                                }
                                        } else
                                            console.warn("Unknown subscription " + c + ". Published item discarded.")
                                })
                            });
                            if (a.Redustatus) {
                                var d = H();
                                d.C !== b || "Active" != a.Redustatus || d.h.n.Xa() || va(d, d.h);
                                cb(b, a)
                            }
                            d = c.q;
                            console.log("Published " + a.result.length + " item(s)" + (d ? " @ '" + d + "'" : ""));
                            b.Lb ? delete b.Lb : c.q == f && b.za()
                        }
                    })
                }
        },
        za: function () {
            var a = this;
            if (!a.Qc(a.n.q) && !a.mc) {
                var b = t["data.publishinterval"];
                b ? (a.mc = !0, setTimeout(function () {
                        a.mc = !1;
                        a.za()
                    }, b)) : a.mc = !1;
                a.Sa()
            }
        },
        Gb: function (a, b, c) {
            if (b in a) {
                var d = a[b];
                if (4 == d.state || 3 == d.state)
                    return d.state = 3, this.ba(a, c, b, d.wb, !1)
            }
            a[b] = {
                state: 1
            };
            this.ca = !0
        },
        ia: function (a, b) {
            var c = a[b];
            1 == c.state || 9 == c.state ? delete a[b] : (c.state = 4, this.ca = !0)
        },
        Eb: function (a) {
            return this.Gb(this.H, a, this.ta)
        },
        xc: function (a) {
            return this.ia(this.H, a)
        },
        Db: function (a) {
            return this.Gb(this.M, a, this.Ca)
        },
        wc: function (a) {
            return this.ia(this.M, a)
        },
        xb: function (a) {
            function b(b, e, f, h) {
                var g = ["subscriptionid=" + encodeURIComponent(c.ab)],
                l = [],
                k = [];
                p(b,
                    function (a, b) {
                    1 == a.state ? l.push(b) : 4 == a.state && k.push(b)
                });
                return k.length ? (r(k, function (a) {
                        g.push("address[]=" + encodeURIComponent(a));
                        b[a].state = 5
                    }), c.j(h, 1, g, function (c) {
                        c = c.result;
                        if (c.length != k.length)
                            throw "Length of " + h + ".result doesn't match.";
                        r(c, function (a, c) {
                            var e = k[c],
                            f = b[e];
                            a.error ? (console.warn("Can't " + h + ": " + e), 1 == f.state ? f.state = 3 : -1 == a.error && delete b[e]) : 5 == f.state && delete b[e]
                        });
                        a()
                    }, function () {
                        a()
                    }), !0) : l.length ? (r(l, function (a) {
                        g.push("address[]=" + encodeURIComponent(a));
                        b[a].state =
                            2
                    }), c.j(f, 1, g, function (g) {
                        if (g.error)
                            return r(l, function (a) {
                                b[a].state = 9;
                                c.ba(b, e, a, g, !1)
                            });
                        var h = g.result;
                        if (h.length != l.length)
                            throw "Length of " + f + ".result doesn't match.";
                        r(h, function (a, g) {
                            var h = l[g],
                            k = b[h];
                            a.error ? (-4 != a.error && console.warn("Can't " + f + ": " + h), -3 == a.error ? (console.warn(h + " - " + a.errorstring), 2 == k.state && (k.state = 3)) : 4 == k.state ? delete b[h] : (k.state = 9, c.ba(b, e, h, a, !1))) : 2 == k.state && (k.state = 3)
                        });
                        a()
                    }, function () {
                        a()
                    }), !0) : !1
            }
            var c = this;
            if (c.ca && c.ab) {
                if (b(c.H, c.ta, "subscribedata",
                        "unsubscribedata") || b(c.M, c.Ca, "subscribealarm", "unsubscribealarm"))
                    return !0;
                c.ca = !1
            }
            return !1
        },
        fd: function () {
            p(self.H, function (a, b) {
                self.ta.lc(b, a.wb)
            });
            p(self.M, function (a, b) {
                self.Ca.lc(b, a.wb)
            })
        },
        dd: function (a, b) {
            var c = this,
            d = c.n;
            a.error && a.errorstring && console.warn("Server responded with error: " + a.errorstring);
            if (a.error && -1 == a.error)
                c.ea(-2);
            else if (a.error || 0 === a.httpstatus)
                c.ea(-1);
            else {
                r(a.result, function (a) {
                    var b = a.subscriptionid;
                    delete a.subscriptionid;
                    r(b, function (b) {
                        if (b == c.ab) {
                            b = a.address;
                            var d = a.type;
                            delete a.type;
                            if (1 == d)
                                c.ba(c.H, c.ta, b, a, !1);
                            else if (2 == d)
                                c.ba(c.M, c.Ca, b, a, !1);
                            else
                                throw "Unknown type '" + d + "' of publish item.";
                        } else if (c.T())
                            if ("" == b)
                                Bb(a);
                            else if (b in c.F) {
                                if (b = c.F[b], b in R)
                                    try {
                                        R[b].K(a)
                                    } catch (e) {
                                        F("publish callback of filter '" + b + "'", e)
                                    }
                            } else
                                console.warn("Unknown subscription " + b + ". Published item discarded.")
                    })
                });
                if (a.Redustatus) {
                    var e = H();
                    e.C !== c || "Active" != a.Redustatus || e.h.n.Xa() || va(e, e.h);
                    cb(c, a);
                    e = document.createElement("a");
                    e.href = b;
                    e.href = e.href;
                    var f =
                        e.hostname;
                    "ws:" == e.protocol ? f = f + ":" + ("" == e.port ? "80" : e.port) : "https:" == e.protocol && (f = f + ":" + ("" == e.port ? "443" : e.port));
                    e = null;
                    f != d.q && (d = d.Ya()) && 1 == d.wsState && c.j("connectionstatus", 1, "otherconnection=swap", function () {})
                }
                console.log("Received " + a.result.length + " item(s)" + (b ? " @ '" + b + "'" : ""))
            }
        },
        Ge: function () {
            function a(a) {
                p(a, function (b, e) {
                    a[e] = {
                        state: 1
                    }
                })
            }
            var b = this;
            b.F = {};
            a(b.H);
            a(b.M);
            p(R, function (a, d) {
                b.j("createsubscription", 3, null, function (e) {
                    var f = a.filter;
                    e = e.subscriptionid;
                    b.la(e, d);
                    f[0] =
                        "subscriptionid=" + encodeURIComponent(e);
                    b.j("subscribefilter", 3, f, function () {})
                })
            });
            b.ca = !0
        },
        Ia: function () {
            function a(a) {
                var b = {};
                p(a, function (a, c) {
                    b[c] = {
                        state: 1
                    }
                });
                return b
            }
            function b(a) {
                p(a, function (b, c) {
                    a[c] = {
                        state: 4
                    }
                })
            }
            var c = this,
            d = !1;
            p(c.H, function (a) {
                3 != a.state && 9 != a.state && (d = !0)
            });
            p(c.M, function (a) {
                3 != a.state && 9 != a.state && (d = !0)
            });
            if (!0 != c.hd && !d) {
                c.hd = !0;
                var e = a(c.H),
                f = a(c.M),
                h = JSON.parse(JSON.stringify(c.Ma()));
                p(R, function (a, b) {
                    p(h, function (d, e) {
                        b == d && c.j("deletesubscription", 3, "subscriptionid=" +
                            encodeURIComponent(e), function () {
                            delete c.Ma()[e];
                            c.j("createsubscription", 3, null, function (d) {
                                var e = a.filter;
                                d = d.subscriptionid;
                                c.la(d, parseInt(b));
                                e[0] = "subscriptionid=" + encodeURIComponent(d);
                                c.j("subscribefilter", 3, e, function () {})
                            })
                        })
                    })
                });
                b(c.H);
                b(c.M);
                c.ca = !0;
                setTimeout(function () {
                    setTimeout(function () {
                        c.hd = !1
                    }, 500);
                    c.H = e;
                    c.M = f;
                    c.ca = !0
                }, 60)
            }
        }
    });
    E(Fb, {
        we: function (a) {
            0 == this.status && (this.status = a);
            var b;
            b = this.status;
            b = "Sop" === b || "Snop" === b;
            var c = "Sop" === a || "Snop" === a;
            this.status = a;
            sa(this);
            b !=
            c && (this.C.state = 3, this.C.qc || this.C.qc(!0), this.h.bc || this.h.qc(!0))
        },
        vd: function () {
            function a(a, b) {
                p(b, function (b, c) {
                    a[c] = {
                        state: 1
                    }
                })
            }
            var b = this.h,
            c = this.h = this.C,
            b = this.C = b;
            delete c.Lb;
            c.ac = !0;
            c.F = {};
            p(R, function (a, b) {
                c.j("createsubscription", 3, null, function (f) {
                    var h = a.filter;
                    f = f.subscriptionid;
                    c.la(f, b);
                    h[0] = "subscriptionid=" + encodeURIComponent(f);
                    c.j("subscribefilter", 3, h, function () {})
                })
            });
            a(c.H, b.H);
            a(c.M, b.M);
            c.ca = !0;
            c.B = b.B;
            c.ga || (c.L = t["data.websocket"] ? 10 : 7);
            b.L = 6;
            b.cb = {};
            la[""] = c.n;
            null ===
            Ca || Ca(function () {});
            c.Aa || (c.Aa = []);
            c.Ka(1);
            7 != c.L || c.ga || c.za();
            delete c.ac
        },
        la: function (a, b) {
            return this.h.la(a, b)
        },
        Ma: function () {
            return this.h.Ma()
        },
        ea: function (a) {
            return this.h.ea(a)
        },
        Qa: function () {
            return this.h.Qa()
        },
        T: function () {
            return this.h.T()
        },
        j: function (a, b, c, d) {
            return this.h.j(a, b, c, d)
        },
        Ka: function (a) {
            return this.h.Ka(a)
        },
        ba: function (a, b, c, d, e) {
            return this.h.ba(a, b, c, d, e)
        },
        qb: function (a, b, c) {
            return this.h.qb(a, b, c)
        },
        Sa: function (a) {
            return this.h.Sa(a)
        },
        za: function () {
            return this.h.za()
        },
        Gb: function (a, b, c) {
            return this.h.Gb(a, b, c)
        },
        ia: function (a, b) {
            return this.h.ia(a, b)
        },
        Eb: function (a) {
            return this.h.Eb(a)
        },
        xc: function (a) {
            return this.h.xc(a)
        },
        Db: function (a) {
            return this.h.Db(a)
        },
        wc: function (a) {
            return this.h.wc(a)
        },
        xb: function (a) {
            return this.h.xb(a)
        },
        fd: function () {
            return this.h.fd()
        }
    });
    E(bb, {
        Od: function (a, b, c, d) {
            G ? (V(a).push(this.l[a] = new Fb(this, b, c, d)), this.l[a] = this.l[a].h) : V(a).push(this.l[a] = new Fa(this, b, c, [wb()]))
        },
        od: function () {
            var a = this,
            b = H();
            a.l[""] = b.C;
            a.l[""].wa(null, a.G);
            if (1 > a.G.length)
                throw Error("Invalid hostnames.");
            if (2 < a.G.length)
                throw Error("More than two hostnames specified.");
            (function () {
                var c = a.r;
                if (y(c) || b.h.n.r.length != c.length)
                    return !1;
                var d = !0;
                r(b.h.n.r, function (a, b) {
                    var h = c[b];
                    if (!B(a) || 0 == a.length || !B(h) || h.length != a.length)
                        return d = !1;
                    r(a, function (a, b) {
                        d = d && a === h[b]
                    })
                });
                return d
            })() || console.warn("Redundant servers have different serverlists.")
        },
        setActive: function (a) {
            this.Pa = a
        },
        T: function () {
            return this.Pa
        },
        Oe: function (a) {
            return this.q === a
        },
        Xa: function () {
            var a =
                this.V,
            b;
            for (b in a)
                if (a[b])
                    return b
        },
        Ld: function () {
            var a = this.Xa();
            if (a)
                return a;
            y(this.l[""]) && (this.l[""] = H().C, this.l[""].state = 3);
            this.l[""].ga = !0;
            this.l[""].Lb = !0
        },
        Nc: function () {
            function a() {
                !c.h.ga || t["data.websocket"] ? delete b.Hc : (c.C.j("publish", 1, null, function (a) {
                        "Active" === a.Redustatus && va(c, c.h)
                    }), b.Hc = setTimeout(a, 4E3))
            }
            var b = this,
            c = H();
            if (c) {
                var d = b.q,
                e = !1;
                if (b.V[b.bb])
                    b.q = b.bb;
                else {
                    var f = b.Ld();
                    f ? b.q = f : (e = !0, b.q = b.bb)
                }
                if (!e) {
                    e = function () {
                        var a = b.Ya();
                        1 < b.G.length && Object.keys(b.Z).length ==
                        b.G.length && a && 1 == a.wsState && (h ? d != b.bb && b.l[""].j("connectionstatus", 1, "otherconnection=swap", function () {}) : b.l[""].j("connectionstatus", 1, "otherconnection=offline", function () {
                                c.h != b.l[""] || b.l[""].ga || d == b.q || b.l[""].Ia()
                            }))
                    };
                    c.za();
                    var f = b.V,
                    h = !0,
                    g;
                    for (g in f)
                        f[g] || (h = !1);
                    y(b.l[""]) ? b.od() : e()
                }
                sa(c);
                y(b.Hc) && a()
            }
        },
        Ub: function (a) {
            a = xb(a);
            var b = this.va,
            c = b.encryptionexponent,
            b = b.encryptionmodulus;
            return u(c) && u(b) && "" != c && "" != b ? kc(a, c, b) : ""
        },
        Le: function () {
            return this.q
        },
        Md: function (a, b, c) {
            function d(a) {
                if (4 ==
                    a.readyState) {
                    if (200 == a.status) {
                        clearTimeout(l);
                        var d = a.responseText;
                        if (d && "" != d) {
                            try {
                                var f = JSON.parse(d)
                            } catch (h) {
                                F("parsing JSON", h);
                                ka(-1);
                                return
                            }
                            if (G) {
                                var p = "undefined" !== typeof f.error && -1 === f.error,
                                d = document.createElement("a");
                                d.href = a.Kb;
                                d.href = d.href;
                                var d = d.hostname,
                                w;
                                w = "undefined" != typeof e.l[""] ? e.l[""].n.q : w;
                                w = "undefined" != typeof w ? w.substring(0, w.indexOf(":")) : w;
                                if (p && w && w == d && e.l[""].state && 1 != e.l[""].state) {
                                    e.l[""].state = 3;
                                    e.l[""].wa(b.bind(null, a), e.l[""].n.G);
                                    return
                                }
                            }
                        }
                        return b(a,
                            p)
                    }
                    g || (c(), g = !0)
                }
            }
            var e = this,
            f = e.Ya(a);
            if (f && 1 == f.wsState) {
                var h;
                y(e.s) || (h = 'sessionid="' + e.s + '",cnonce="' + e.u + '",digest="' + Q(e.s + ":" + e.A + ":" + e.u) + '"');
                f.md("read", "", h, d, !0)
            } else {
                var f = new XMLHttpRequest,
                g = !1;
                a = null != a ? ha + a : "";
                f.open("POST", a + e.yc + "read", !0);
                f.Kb = "" == a ? ha + wb() : a;
                a == ha + location.hostname || "ntlm" != aa && "http" != aa || (f.withCredentials = "true");
                y(e.s) || f.setRequestHeader("X-WebMI", 'sessionid="' + e.s + '", cnonce="' + e.u + '", digest="' + Q(e.s + ":" + e.A + ":" + e.u) + '"');
                var l = setTimeout(function () {
                    c &&
                    !g && (g = !0, c())
                }, t["data.requesttimeout"]);
                f.onreadystatechange = function () {
                    d(this)
                };
                f.send(null);
                return f
            }
        },
        j: function (a, b, c, d, e, f) {
            function h(h, w) {
                try {
                    var s = h.status;
                    f = f ? f : 0;
                    if (200 == s) {
                        var r = "",
                        r = "arraybuffer" == h.responseType || "blob" == h.responseType || "document" == h.responseType ? "binaryData" : h.responseText;
                        if ("" != r) {
                            try {
                                var z = JSON.parse(r);
                                clearTimeout(A)
                            } catch (t) {
                                if (q && "binaryData" == r && h.response) {
                                    clearTimeout(A);
                                    e(h.response);
                                    return
                                }
                                if (q && "binaryData" != r && h.responseText && "" != h.responseText) {
                                    clearTimeout(A);
                                    e(h.responseText);
                                    return
                                }
                                F("parsing JSON", t);
                                ka(-1);
                                return
                            }
                            !fa || "undefined" == typeof z.username && "logout" != a || g.l[""].Ia();
                            if (-4 == z.error)
                                ta(a, d, z), g.l[""].Ia();
                            else if ("result" in z)
                                if (B(z.result)) {
                                    var s = [],
                                    u;
                                    for (u in d)
                                        "function" === typeof d[u].indexOf && 0 == d[u].indexOf("address[]") && s.push(d[u]);
                                    for (var x in z.result)
                                        "error" in z.result[x] && -4 == z.result[x].error && (s.length == z.result.length ? ta(a, s[x], z.result[x]) : ta(a, "unkown", z.result[x]), "read" != a && g.l[""].Ia())
                                } else  - 4 == z.result.error && (ta(a, d, z.result),
                                        g.l[""].Ia());
                            if (!q && -2 === z.error) {
                                Hb(g.l[""]);
                                return
                            }
                            if (!q && -1 === z.error && G) {
                                var L = function () {
                                    if (2 == v.state) {
                                        if (4 > f) {
                                            var h = "retry request: " + k,
                                            h = w ? h + l.join("") + "' (retry #" + f + ")" : h + a + "' (retry #" + f + ")";
                                            console.warn(h);
                                            g.j(a, b, c, d, e, f + 1)
                                        }
                                    } else
                                        setTimeout(function () {
                                            L()
                                        }, 50)
                                },
                                v = g.l[""];
                                v.ga && (delete v.ga, v.state = 3, y(v.ac) ? (z = function (a) {
                                        p(a, function (b, c) {
                                            a[c] = {
                                                state: 1
                                            }
                                        })
                                    }, z(v.H), z(v.M), v.wa(function () {
                                            p(R, function (a, b) {
                                                v.j("createsubscription", 3, null, function (c) {
                                                    var d = a.filter;
                                                    c = c.subscriptionid;
                                                    v.la(c,
                                                        b);
                                                    d[0] = "subscriptionid=" + encodeURIComponent(c);
                                                    v.j("subscribefilter", 3, d, function () {})
                                                })
                                            });
                                            v.ca = !0
                                        }, g.G)) : v.wa(null, g.G));
                                L();
                                return
                            }
                            e(z);
                            return
                        }
                        if ("connectionstatus" == a) {
                            e();
                            return
                        }
                        s = 0
                    }
                    if (!q || 201 != s && 204 != s && 205 != s && 403 != s) {
                        if (v = g.l[""], !y(v) && ("read" === a || 3 !== v.state)) {
                            if (12029 <= s && 12031 >= s || 12152 == s)
                                s = 0;
                            4 > f && 401 != s ? (z = "Can't receive response for '" + k, z = w ? z + l.join("") + "' (retry #" + f + ")" : z + a + "' (retry #" + f + ")", console.warn(z), a = q ? m + " " + a : a, g.j(a, b, c, d, e, f + 1)) : (1 == v.state && (v.state = 3), e({
                                    error: -1E3 -
                                    s,
                                    errorstring: "HTTP " + h.statusText,
                                    httpstatus: s
                                }))
                        }
                    } else
                        e(h)
                } catch (C) {
                    F("handling response", C)
                }
                finally {}
            }
            var g = this,
            l = [],
            k = "",
            m = "POST",
            q = !1;
            2 == a.split(" ").length && (q = !0);
            var s = g.Ya();
            if (!q && -1 < "read write subscribedata unsubscribedata changepassword subscribefilter unsubscribefilter deletesubscription acceptalarm getrights connectionstatus".split(" ").indexOf(a.toLowerCase()) && s && 1 == s.wsState) {
                var r;
                y(g.s) || (++g.u, r = 'sessionid="' + g.s + '",cnonce="' + g.u + '",digest="' + Q(g.s + ":" + g.A + ":" + g.u) + '"' + c);
                s.md(a,
                    y(d) || null === d ? {}
                     : d, r, function (a) {
                    a.date && !X(a.cmd, ["login", "publish", "queryfilter", "querynext", "queryrelease"]) && Db(Date.parse(a.date) - new Date);
                    h(a, !1)
                }, !1)
            } else {
                var w = new XMLHttpRequest;
                2 == a.split(" ").length ? (m = a.split(" ")[0], a = a.split(" ")[1], l = ["", a]) : l = [g.yc, a];
                y(g.q) || (k = g.q, l.unshift(ha + k));
                q && c && (s = c.replace(/\s+/g, "").replace(":", "=").replace('"', ""), -1 < s.indexOf("responseType=arraybuffer") ? w.responseType = "arraybuffer" : -1 < s.indexOf("responseType=blob") ? w.responseType = "blob" : -1 < s.indexOf("responseType=document") ?
                        w.responseType = "document" : -1 < s.indexOf("responseType=json") && (w.responseType = "json"));
                y(g.q) || !G || "ntlm" != aa && "http" != aa ? (w.open(m, l.join(""), b & 1 ? !0 : !1), G && ba && (w.withCredentials = "true")) : (w.open(m, l.join(""), !0), w.withCredentials = "true");
                q && e(null, w);
                y(g.s) || (++g.u, w.setRequestHeader("X-WebMI", 'sessionid="' + g.s + '", cnonce="' + g.u + '", digest="' + Q(g.s + ":" + g.A + ":" + g.u) + '"' + c));
                var A = setTimeout(function () {
                    nc({
                        request: a,
                        datastring: d
                    })
                }, t["data.failoverrequesttimeout"]),
                u = "onloadend" in w;
                u && (w.onloadend =
                    function () {
                    h(this, !0)
                });
                w.onreadystatechange = function () {
                    4 != w.readyState || u ? 2 != w.readyState || X(a, ["login", "publish", "queryfilter", "querynext", "queryrelease"]) || Db(Date.parse(w.getResponseHeader("Date")) - new Date) : h(this, !0)
                };
                null !== d && (B(d) && (d = d.join("&")), w.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"));
                w.send(d)
            }
        },
        Ya: function (a) {
            a || (a = this.q);
            if (this.Z)
                return a = y(a) ? Object.keys(this.Z)[0] : a, this.Z[a]
        }
    });
    E(db, {
        md: function (a, b, c, d, e) {
            a = {
                id: ++this.Be,
                cmd: a,
                data: b
            };
            c && (a.xwebmi =
                    c);
            e && this.kc.push(a.id);
            e && 1 < this.kc.length ? (this.wsState = 2, this.J.close(), d({
                    readyState: 4,
                    status: 404,
                    type: "ws",
                    webMIReadUrl: this.J.url
                })) : "function" == typeof d && (this.jb[a.id] = d);
            if (1 == this.wsState)
                try {
                    this.J.send(JSON.stringify(a))
                } catch (f) {
                    console.log("Sending websocket message failed. => websocket " + this.J.url + " is not connected (wsState: " + this.wsState + ").")
                }
        }
    });
    E(Ib, {
        be: function () {
            return na(this.da) && na(this.ya)
        },
        Ta: function (a) {
            var b = this;
            p(b.da, function (c, d) {
                p(c.Q, function (c, f) {
                    r(c, function (c,
                            e) {
                        a(b, d, f, c, e)
                    })
                })
            })
        },
        Tc: function (a) {
            this.Ta(function (b, c, d, e) {
                a.La(e.tb, c, e.K, d, e.$a)
            });
            this.Ta(function (a, c, d, e, f) {
                a.ia(c, d, f)
            })
        },
        La: function (a, b, c, d, e) {
            var f;
            f = this.da;
            b in f ? f = f[b] : (f = f[b] = {
                        state: 0,
                        Q: {}
                    }, r(this.gd, this.Za ? function (a) {
                        a.Db(b)
                    }
                         : function (a) {
                        a.Eb(b)
                    }));
            d in f.Q || (f.Q[d] = []);
            e || (e = ++Qc);
            f.Q[d].push({
                $a: e,
                tb: a,
                K: c
            });
            a = f.fe;
            y(a) || (a.address = d, c(a), delete a.address);
            return e
        },
        Ib: function (a) {
            var b = !1;
            this.Ta(function (c, d, e, f, h) {
                f.$a == a && (c.ia(d, e, h), b = !0)
            });
            return b
        },
        Jb: function (a) {
            var b =
                [];
            for (this.Ta(function (c, e, f, h, g) {
                    h.tb == a && b.push({
                        kb: e,
                        lb: f,
                        vb: g
                    })
                }); b.length; ) {
                var c = b.pop();
                this.ia(c.kb, c.lb, c.vb)
            }
        },
        ia: function (a, b, c) {
            var d = this.da[a].Q;
            d[b].splice(c, 1);
            d[b].length || (delete d[b], na(d) && (delete this.da[a], r(this.gd, this.Za ? function (b) {
                        b.wc(a)
                    }
                         : function (b) {
                        b.xc(a)
                    })))
        },
        vc: function (a) {
            var b = [];
            p(this.da, function (c, d) {
                p(c.Q, function (c) {
                    r(c, function (c) {
                        c.tb != a || X(d, b) || b.push(d)
                    })
                })
            });
            return b
        },
        Ab: function (a) {
            var b = [];
            a in this.ya || (this.ya[a] = []);
            for (this.Ta(function (c, e, f, h,
                        g) {
                    h.tb == a && b.push({
                        kb: e,
                        lb: f,
                        vb: g,
                        K: h.K,
                        $a: h.$a
                    })
                }); b.length; ) {
                var c = b.pop();
                this.ia(c.kb, c.lb, c.vb);
                delete c.vb;
                this.ya[a].push(c)
            }
        },
        Bb: function (a) {
            var b = this;
            a in b.ya && (r(b.ya[a], function (c) {
                    b.La(a, c.kb, c.K, c.lb, c.$a)
                }), delete b.ya[a])
        },
        lc: function (a, b) {
            if (a in this.da) {
                var c = this.da[a];
                p(c.Q, function (a, c) {
                    b.address = c;
                    r(a, function (a) {
                        try {
                            a.K(b)
                        } catch (d) {
                            F("publish callback of address '" + c + "'", d)
                        }
                    })
                });
                c.fe = b
            }
        },
        Hb: function (a) {
            p(this.da, this.Za ? function (b, c) {
                a.Db(c)
            }
                 : function (b, c) {
                a.Eb(c)
            });
            return this
        }
    });
    E(eb, {
        Ic: function () {
            var a = this.qa;
            p(a, function (b, c) {
                b.be() && "" != c && delete a[c]
            })
        },
        rb: function (a) {
            var b = this.qa;
            a in b || (b[a] = new Ib(this.Za, a));
            return b[a]
        },
        Uc: function (a) {
            var b = this.qa,
            c = this.rb("");
            null === a ? p(b, function (a, e) {
                a != c && (a.Tc(c), delete b[e])
            }) : (this.rb(a).Tc(c), delete b[a])
        },
        vc: function (a) {
            var b = {};
            p(this.qa, function (c, d) {
                b[d] = c.vc(a)
            });
            return b
        },
        Fb: function (a, b, c) {
            u(b) && x(c) || O();
            var d = ra(b);
            return this.rb(qa(b)).La(a, d, c, b)
        },
        wd: function (a, b) {
            var c = !1;
            p(this.qa, function (a) {
                a.Ib(b) &&
                (c = !0)
            });
            this.Ic();
            return c
        },
        La: function (a, b, c) {
            var d = this;
            if (B(b)) {
                var e = [];
                r(b, function (b, h) {
                    e[h] = d.Fb(a, b, c)
                });
                return e
            }
            return C(b) ? (e = {}, p(b, function (b, c) {
                    x(b) || O();
                    e[c] = d.Fb(a, c, b)
                }), e) : this.Fb(a, b, c)
        },
        Ib: function (a, b) {
            var c = this;
            if (B(b)) {
                var d = [];
                r(b, function (b, f) {
                    d[f] = c.wd(a, b)
                });
                return d
            }
            return this.wd(a, b)
        },
        Jb: function (a) {
            p(this.qa, function (b) {
                b.Jb(a)
            });
            this.Ic()
        },
        Ab: function (a) {
            p(this.qa, function (b) {
                b.Ab(a)
            })
        },
        Bb: function (a) {
            p(this.qa, function (b) {
                b.Bb(a)
            })
        },
        Hb: function (a, b) {
            return this.rb(a).Hb(b)
        }
    });
    E(Jb, {
        accept: function (a, b) {
            function c(a, b) {
                var c = qa(a);
                a = "address[]=" + encodeURIComponent(ra(a));
                c in e ? (e[c].push(b), f[c].push(a)) : (e[c] = [b], f[c] = [a])
            }
            var d = [],
            e = {},
            f = {};
            u(a) ? c(a) : B(a) ? r(a, c) : O();
            ea("acceptalarm", f, function (c) {
                p(c, function (b, c) {
                    var f = b.result;
                    u(a) ? d = b.error ? b : f[0] : r(e[c], function (a, c) {
                        d[a] = b.error ? b : f[c]
                    })
                });
                x(b) && b(d)
            })
        },
        acceptDisplay: function () {
            var a = Y.vc(this.p);
            p(a, function (a) {
                r(a, function (c, d) {
                    a[d] = "address[]=" + encodeURIComponent(c)
                })
            });
            ea("acceptalarm", a, function () {})
        },
        subscribe: function (a,
            b) {
            return Y.La(this.p, a, b)
        },
        unsubscribe: function (a) {
            return Y.Ib(this.p, a)
        }
    });
    E(Kb, {
        addEventListener: function (a, b) {
            "clientvariableschange" == a ? (this.cc.push(b), b(K)) : "permissionnotification" == a ? this.$c.push(b) : "servertimeoffsetchanged" == a ? (b($a), this.hc.push(b)) : "statechange" == a ? this.ic.push(b) : "serverstatechange" == a ? ("status" in $ && b($), this.gc.push(b)) : "requesttimeout" == a && this.ec.push(b)
        },
        removeEventListener: function () {},
        loadScript: function (a, b) {
            return v[this.p].Ha(a, b)
        },
        pause: function () {
            Z.Ab(this.p);
            Y.Ab(this.p);
            this.paused = !0
        },
        resume: function () {
            Z.Bb(this.p);
            Y.Bb(this.p);
            this.paused = !1
        },
        isPaused: function () {
            return this.paused
        },
        call: function (a, b, c, d) {
            var e = u(c) ? c : "",
            f = x(c) ? c : d;
            c = {};
            c[e] = u(b) ? b : S(b);
            ea(a, c, function (a) {
                if (x(f)) {
                    a = a[e];
                    for (var b in a)
                        if (B(a[b]) && "{" == a[b][0])
                            try {
                                a[b] = JSON.parse(a[b])
                            } catch (c) {}
                    f(a)
                }
            })
        },
        login: function (a, b, c, d) {
            "form" == aa ? (Ca = function (d) {
                var f = {},
                h = 0 == cc.indexOf("Bachmann Visutec GmbH, atvise SCADA") ? !1 : !0;
                p(la, function (d, e) {
                    f[e] = u(a) && u(b) ? ["username=" + encodeURIComponent(a),
                            "passwordcipher=" + encodeURIComponent(d.Ub(b))] : null;
                    h && f[e].push("passworddigest=" + encodeURIComponent(Q(d.s + ":" + d.A + ":" + b)));
                    if (C(c))
                        for (var g in c)
                            f[e].push(encodeURIComponent(g) + "=" + encodeURIComponent(c[g]))
                });
                if (G && ba) {
                    var g = H().C,
                    l = {};
                    if (2 == g.state) {
                        l[""] = u(a) && u(b) ? ["username=" + encodeURIComponent(a), "passwordcipher=" + encodeURIComponent(g.n.Ub(b))] : null;
                        h && l[""].push("passworddigest=" + encodeURIComponent(Q(g.n.s + ":" + g.n.A + ":" + b)));
                        if (C(c))
                            for (var k in c)
                                l[""].push(encodeURIComponent(k) + "=" + encodeURIComponent(c[k]));
                        g.n.j("login", 3, g.Yb, l[""], function () {})
                    }
                }
                ea("login", f, d)
            }, Ca(x(a) ? a : x(c) ? c : x(d) ? d : function () {})) : console.warn("Function 'login' only allowed with authentication method 'form'.")
        },
        logout: function (a) {
            if ("form" == aa) {
                var b = {};
                p(la, function (a, c) {
                    b[c] = null
                });
                K = {};
                Ca = null;
                if (G && ba) {
                    var c = H().C;
                    2 == c.state && c.n.j("logout", 3, c.Yb, null, function () {})
                }
                ea("logout", b, x(a) ? a : function () {})
            } else
                console.warn("Function 'logout' only allowed with authentication method 'form'.")
        },
        getRights: function (a, b, c) {
            function d(a,
                b, c) {
                var d = qa(a);
                a = "address[]=" + encodeURIComponent(ra(a)) + "&value[]=";
                var e = b;
                b in Ma && (e = {
                        userpermission: Ma[b]
                    });
                e = JSON.stringify(e);
                a += wa(e);
                d in l ? (l[d].push(c), k[d].push(a)) : (l[d] = [c], k[d] = [a])
            }
            function e(a, b, c) {
                if (b)
                    return !0 === c.userpermission ? {
                        address: a,
                        right: b,
                        value: c.userpermission
                    }
                 : {
                    address: a,
                    right: b,
                    value: !1
                };
                b = {};
                var d = 0;
                c.userpermission && (d = parseInt(c.userpermission));
                for (var e in Ma)
                    b[e] = d & Ma[e] ? !0 : !1;
                b.raw = d;
                return {
                    address: a,
                    rights: b
                }
            }
            if (!fa)
                return !1;
            var f = x(b) ? !1 : b,
            h = x(b) ? b : c,
            g = [],
            l = {},
            k = {};
            if (u(a))
                d(a, b);
            else if (B(a))
                if (B(b))
                    for (c = 0; c < a.length && c < b.length; ++c)
                        d(a[c], b[c], c);
                else
                    C(b) || r(a, function (a, c) {
                        d(a, b, c)
                    });
            else
                C(a) && (g = {}, p(a, function (a, b) {
                        d(b, a, b)
                    }));
            ea("getRights", k, function (b) {
                p(b, function (b, c) {
                    var d = b.result;
                    if (u(a))
                        g = b.error ? b : e(a, f, d[0]);
                    else if (b.error)
                        for (var h in a)
                            g[h] = b;
                    else
                        r(d, function (b, d) {
                            g[l[c][d]] = e(a[d], u(f) ? f : f[d], b)
                        })
                });
                x(h) && h(g)
            })
        },
        clearPermissionLog: function () {
            ua = []
        },
        getPermissionLog: function () {
            return ua
        },
        writePermissionLogEntry: function (a, b,
            c) {
            ta(a, "address[]=" + b, {
                errorstring: c
            })
        },
        read: function (a, b) {
            function c(a, b) {
                var c = qa(a);
                a = ra(a);
                c in e ? (e[c].push(b), f[c].push(a)) : (e[c] = [b], f[c] = [a])
            }
            var d = [],
            e = {},
            f = {};
            if (x(b)) {
                u(a) ? c(a) : B(a) ? r(a, c) : C(a) && (d = {}, p(a, c));
                var h = 0;
                p(f, function (c, f) {
                    h += c.length;
                    setTimeout(function () {
                        mc(f, c, e[f], function (c, e) {
                            if (u(a))
                                return b(c);
                            d[e] = c;
                            --h || b(d)
                        })
                    }, 0)
                })
            }
        },
        write: function (a, b, c) {
            function d(a, b, c) {
                var d = qa(a);
                a = "address[]=" + encodeURIComponent(ra(a)) + "&value[]=" + wa(b);
                d in h ? (h[d].push(c), g[d].push(a)) : (h[d] =
                        [c], g[d] = [a])
            }
            var e = x(b) ? b : c,
            f = [],
            h = {},
            g = {};
            if (u(a))
                d(a, b);
            else if (B(a))
                if (B(b))
                    for (c = 0; c < a.length && c < b.length; ++c)
                        d(a[c], b[c], c);
                else
                    C(b) || r(a, function (a, c) {
                        d(a, b, c)
                    });
            else
                C(a) && (f = {}, p(a, function (a, b) {
                        d(b, a, b)
                    }));
            ea("write", g, function (b) {
                p(b, function (b, c) {
                    var d = b.result;
                    if (u(a))
                        f = b.error ? b : d[0];
                    else if (b.error)
                        for (var e in a)
                            f[e] = b;
                    else
                        r(d, function (a, b) {
                            f[h[c][b]] = a
                        })
                });
                x(e) && e(f)
            })
        },
        subscribe: function (a, b) {
            return Z.La(this.p, a, b)
        },
        unsubscribe: function (a) {
            return Z.Ib(this.p, a)
        },
        subscribeBlock: function (a,
            b, c) {
            function d(a, b, c) {
                r(b, function (b, d) {
                    var e = a.Fb(h, b, function (a) {
                        k[d + c] = a;
                        g || (g = !0, r(k, function (a) {
                                g = g && !y(a)
                            }));
                        g && l && (l = !1, setTimeout(function () {
                                l = !0;
                                f(k)
                            }, 50))
                    });
                    m.push(e)
                })
            }
            var e = [],
            f = c;
            B(a) && B(b) && x(c) ? e = b : B(a) && x(b) ? f = b : O();
            var h = this.p,
            g = !1,
            l = !0,
            k = Array(a.length + e.length),
            m = [];
            d(Z, a, 0);
            d(Y, e, a.length);
            return m
        },
        subscribeFilter: function (a, b, c) {
            var d = u(b) ? b : "";
            b = x(b) ? b : c;
            var e = B(a) ? a : S(a);
            e.splice(0, 0, "");
            var f = ++Rc;
            this.F.push(f);
            R[f] = {
                K: b,
                filter: e
            };
            r(V(d), function (a) {
                a.j("createsubscription",
                    3, null, function (b) {
                    b = b.subscriptionid;
                    a.la(b, f);
                    e[0] = "subscriptionid=" + encodeURIComponent(b);
                    a.j("subscribefilter", 3, e, function () {})
                })
            });
            return f
        },
        unsubscribeFilter: function (a) {
            var b = this,
            c = !1;
            p(I, function (d) {
                r(d, function (d) {
                    var f = JSON.parse(JSON.stringify(d.Ma()));
                    p(f, function (b, f) {
                        b == a && (c = !0, d.j("deletesubscription", 3, "subscriptionid=" + encodeURIComponent(f), function () {}), delete d.Ma()[f])
                    });
                    !c && b.F && -1 < b.F.indexOf(a) && setTimeout(function () {
                        b.F && -1 < b.F.indexOf(a) && b.unsubscribeFilter(a)
                    }, 50)
                })
            });
            c && this.F && (P(this.F, function (b) {
                    return b == a
                }), delete R[a]);
            return c
        },
        queryFilter: function (a, b, c) {
            var d = this,
            e = u(b) ? b : "",
            f = x(b) ? b : c,
            h = S(a),
            g = H();
            x(f) || O();
            r(V(e), function (a) {
                a.T() && a.j("queryfilter", 3, h, function (b) {
                    var c = b.continuationpoint;
                    "undefined" != typeof c && 0 != c && (-1 == d.B.indexOf(c) && d.B.push(c), g ? a.h.Bc(c) : a.Bc(c), mb[c] = {
                            h: !0
                        });
                    f(b)
                })
            })
        },
        queryNext: function (a, b, c, d) {
            var e = this,
            f = "";
            if (C(b)) {
                f = b;
                f.continuationpoint = a;
                var h = S(f)
            } else
                h = S({
                    continuationpoint: a
                });
            var g = H(),
            l = "" == f ? u(b) ? b : "" : u(c) ?
                c : "",
            k = "" == f ? x(b) ? b : c : x(c) ? c : d;
            x(k) || O();
            r(V(l), function (b) {
                b.T() && b.j("querynext", 3, h, function (c) {
                    var d = c.continuationpoint;
                    "undefined" != typeof d && 0 == d && (d = g ? JSON.parse(JSON.stringify(b.h.B)) : JSON.parse(JSON.stringify(b.B)), p(d, function (c, d) {
                            d == a && (g ? delete b.h.B[d] : delete b.B[d])
                        }), P(e.B, function (b) {
                            return b == a
                        }), delete mb[a]);
                    k(c)
                })
            })
        },
        queryRelease: function (a, b, c) {
            var d = "";
            if (C(b)) {
                d = b;
                d.continuationpoint = a;
                var e = S(d)
            } else
                e = S({
                    continuationpoint: a
                });
            var f = x(b) ? b : c,
            h = H();
            p(I, function (b) {
                r(b, function (b) {
                    var c;
                    c = h ? JSON.parse(JSON.stringify(b.h.B)) : JSON.parse(JSON.stringify(b.B));
                    p(c, function (c, d) {
                        c == a && (b.j("queryrelease", 3, e, function (a) {
                                x(f) && f(a)
                            }), h ? delete b.h.B[d] : delete b.B[d])
                    })
                })
            });
            P(this.B, function (b) {
                return b == a
            });
            delete mb[a]
        },
        readFilter: function (a, b, c) {
            var d = u(b) ? b : "",
            e = x(b) ? b : c,
            f = S(a);
            x(e) || O();
            r(V(d), function (a) {
                a.T() && a.j("readfilter", 3, f, function (a) {
                    e(a)
                })
            })
        },
        customRequest: function (a, b, c, d, e, f) {
            var h = "POST GET PUT DELETE PATCH HEAD".split(" "),
            g = -1 == h.indexOf(a) ? a : null,
            l = null == g ? a : b,
            k = null ==
                g ? b : c,
            m = null == g ? x(c) ? "" : c : x(d) ? "" : d,
            q = x(c) ? null : m == d ? x(e) ? null : e : x(d) ? null : d,
            p = x(c) ? c : x(d) ? d : x(e) ? e : x(f) ? f : null;
            null == g && (g = "");
            "" != m && (m = ", " + m);
            if (-1 == h.indexOf(l))
                return F("customRequest function", Error("Invalid method in customRequest function"));
            if (y(k) || y(m) || y(q) || y(p))
                return F("customRequest function", Error("Invalid argument in customRequest function"));
            r(V(g), function (a) {
                (function () {
                    1 == a.n.O && 2 == a.state && a.n.Pa && a.n.j(l + " " + k, 3, m, q, function (a, b) {
                        x(p) && (null == a && 2 == p.length ? p(b, !0) : null !=
                            a && p(a))
                    })
                })()
            })
        }
    });
    E(Mb, {
        createURL: function (a, b) {
            var c = za(ob + encodeURIComponent(a) + nb, b),
            d = H();
            d && (d = d.h.n.q) && (c = ha + d + c);
            return c
        },
        getCurrentScaleFactor: function () {
            return this.c.I
        },
        getViewBox: function () {
            return this.c.S
        },
        getInitialViewBox: function () {
            return this.c.Ua
        },
        setViewBox: function (a, b, c, d) {
            var e = this.c;
            e.S = [a, b, c, d];
            this.isSVG() && e.$().setAttribute("viewBox", e.S.join(" "));
            e.Ve = !0;
            e.Fc()
        },
        getURLPostfix: function () {
            return nb
        },
        getURLPrefix: function () {
            return ob
        },
        getActiveFrames: function () {
            return (y(v[0]) ?
                this.i : v[0].m.document).querySelectorAll("div:not([style*='display: none']) > iframe")
        },
        isRoot: function () {
            return !this.c.p
        },
        isHTML: function () {
            return 1 == fb(this.c)
        },
        isSVG: function () {
            return 2 == fb(this.c)
        },
        isVML: function () {
            return !1
        },
        setEnableAutoFit: function (a) {
            t["frame.enableautofit"] = !!a
        },
        setForeignObjectHandler: function (a, b, c, d, e, f, h) {
            x(b) && (b = {
                    create: b,
                    destroy: function () {},
                    set: c,
                    add: d,
                    remove: e,
                    register: f,
                    applyOffsetsToMatrix: h
                }, console.warn("Using deprecated version of setForeignObjectHandler()"));
            this.c.ue(a, b)
        },
        setURLPostfix: function (a) {
            nb = a
        },
        setURLPrefix: function (a) {
            ob = a
        },
        setOpenUrlHandler: function (a) {
            pb = a
        },
        setOpenWindowHandler: function (a, b) {
            P(this.c.jc, function (b) {
                return b.oa == a
            });
            null === b || this.c.jc.push({
                oa: a,
                fa: b
            })
        },
        setShowPopupHandler: function (a, b) {
            P(this.c.rc, function (b) {
                return b.oa == a
            });
            null === b || this.c.rc.push({
                oa: a,
                fa: b
            })
        },
        getSrc: function (a, b, c) {
            var d = function () {
                if (!/MSIE/.test(navigator.userAgent))
                    return new XMLHttpRequest;
                for (var a = ["Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.3.0", "Msxml2.XMLHTTP",
                        "Microsoft.XMLHTTP"], b = 0; b < a.length; ++b)
                    try {
                        return new ActiveXObject(a[b])
                    } catch (c) {}
                throw "This browser does not support XMLHttpRequest.";
            }
            ();
            d.open("GET", za(a, {}, !0), b);
            d.onreadystatechange = function () {
                4 == d.readyState && 200 == d.status && c(d)
            };
            d.send(null)
        },
        setSrc: function (a, b) {
            a.src = za(b, {}, !0)
        },
        openDisplay: function (a, b, c) {
            webMI.rootWindow.currentContentDisplay && null != webMI.rootWindow.currentContentDisplay && a == webMI.rootWindow.contentDisplay && (a = webMI.rootWindow.currentContentDisplay);
            return this.openUrl(this.createURL(a),
                b, c)
        },
        openUrl: function (a, b, c) {
            y(c) && (c = this.c.m);
            return pb(za(a, b, !0), c)
        },
        openWindow: function (a, b, c, d, e, f, h, g) {
            var l = null,
            k = this;
            p(v, function (a) {
                p(a.jc, function (a) {
                    Pa(a.oa, k.i) && (l = a)
                })
            });
            if (l) {
                var m = k.c.xa,
                q;
                try {
                    q = l.fa.apply(null, arguments)
                } catch (s) {
                    q = l.fa.call(null, a, b, c, d, e, f, h, g)
                }
                if (!na(q)) {
                    var r = q.close;
                    q.close = function () {
                        P(m, function (a) {
                            return a == q
                        });
                        r.apply(q, arguments)
                    };
                    m.push(q)
                }
                return q
            }
        },
        closeWindow: function (a) {
            if (a && "close" in a)
                return a.cuba && a.cuba(), a.close();
            var b = !0,
            c = this.i;
            p(v, function (a) {
                a &&
                p(a.xa, function (a) {
                    Qa(a, c) && (a.close(), b = !1)
                })
            });
            b && this.c.m.close()
        },
        showPopup: function (a, b, c) {
            var d = null,
            e = this.i;
            p(v, function (a) {
                p(a.rc, function (a) {
                    Pa(a.oa, e) && (d = a)
                })
            });
            if (d)
                return d.fa(a, b, c)
        }
    });
    E(Ob, {
        resetAllKeyListener: function () {
            Ha = [];
            Ga = [];
            ya = [];
            Ia = []
        },
        addCombinationListener: function (a, b, c) {
            Ha.push({
                p: this.p,
                ke: a,
                ha: b,
                ua: c
            })
        },
        addDownListener: function (a, b) {
            Ga.push({
                p: this.p,
                ha: b,
                ua: a
            })
        },
        addUpListener: function (a, b) {
            ya.push({
                p: this.p,
                ha: b,
                ua: a
            })
        },
        addPressListener: function (a, b) {
            Ia.push({
                p: this.p,
                xd: b,
                ua: a
            })
        },
        isDown: function (a) {
            return a in xa
        }
    });
    E(Pb, {
        setHandler: function (a, b) {
            gc = a;
            gb = b
        },
        play: function () {
            var a = gc.apply(null, arguments);
            a && this.Cb.push(a);
            return a
        },
        stop: function () {
            var a = gb.apply(null, arguments);
            P(this.Cb, function (b) {
                return b == a
            });
            return a
        }
    });
    E(Qb, {
        author: function (a) {
            r(a, function (a, c) {
                D += D.charAt((1 << (9 - c ? 5 : 6)) + (c % 2 ? -1 : 1) * a)
            });
            return D.substr(4 * a[10] - 2, a[0] + a[1]).toUpperCase() + (ic(la[""] = new bb(t["data.url"])) ? D : "")
        }
        ([4, 2, -3, -11, -8, 5, 12, -3, 8, 1, 19, -4, -5, 8, -16, -4]),
        Bd: function (a) {
            this.dc.push(a)
        },
        Dc: function (a) {
            this.yb ? this.yb.push(a) : oa("load")(a)
        },
        Cd: function (a) {
            this.fc.push(a)
        },
        sa: function (a) {
            this.zb.push(a)
        },
        bd: function () {
            this.ee = new Date;
            this.qe = 5
        },
        Hd: function () {
            r(this.dc, oa("focus"))
        },
        Id: function (a) {
            function b() {
                0 < Object.keys(I).length ? (r(c.yb, oa("load")), c.yb = null) : setTimeout(b, 50)
            }
            var c = this;
            this.ub(a);
            "native" === t["frame.scaletype"] && t["frame.enableautofit"] || this.nd();
            (a = c.$()) && "xhtml" == t["frame.displaytype"] && (a.style.position = "absolute");
            b()
        },
        te: function (a, b, c, d) {
            if ("undefined" !=
                typeof a)
                return "native" == t["frame.scaletype"] ? {
                    x: b,
                    y: c
                }
             : this.Ba("undefined" == typeof d || !1 == d ? 0 : 1, b, c, a, !1)
        },
        xe: function (a, b, c, d) {
            function e(a) {
                a.addEventListener("mousedown", f, !0);
                a.addEventListener("mousemove", f, !0);
                a.addEventListener("mouseup", f, !0);
                a.addEventListener("mouseover", f, !0);
                a.addEventListener("click", f, !0);
                a.addEventListener("dblclick", f, !0);
                a.addEventListener("touchstart", f, !0);
                a.addEventListener("touchend", f, !0);
                a.addEventListener("touchmove", f, !0);
                a.addEventListener("touchcancel",
                    f, !0);
                a.addEventListener("touchleave", f, !0);
                a.addEventListener("touchenter", f, !0);
                a.addEventListener("drag", f, !0);
                a.addEventListener("dragend", f, !0);
                a.addEventListener("dragenter", f, !0);
                a.addEventListener("dragexit", f, !0);
                a.addEventListener("dragleave", f, !0);
                a.addEventListener("dragover", f, !0);
                a.addEventListener("dragstart", f, !0);
                a.addEventListener("drop", f, !0);
                m.sa(function () {
                    a.removeEventListener("mousedown", f, !0);
                    a.removeEventListener("mousemove", f, !0);
                    a.removeEventListener("mouseup", f, !0);
                    a.removeEventListener("mouseover",
                        f, !0);
                    a.removeEventListener("click", f, !0);
                    a.removeEventListener("dblclick", f, !0);
                    a.removeEventListener("touchstart", f, !0);
                    a.removeEventListener("touchend", f, !0);
                    a.removeEventListener("touchmove", f, !0);
                    a.removeEventListener("touchcancel", f, !0);
                    a.removeEventListener("touchleave", f, !0);
                    a.removeEventListener("touchenter", f, !0);
                    a.removeEventListener("drag", f, !0);
                    a.removeEventListener("dragend", f, !0);
                    a.removeEventListener("dragenter", f, !0);
                    a.removeEventListener("dragexit", f, !0);
                    a.removeEventListener("dragleave",
                        f, !0);
                    a.removeEventListener("dragover", f, !0);
                    a.removeEventListener("dragstart", f, !0);
                    a.removeEventListener("drop", f, !0);
                    a = null
                })
            }
            function f(a) {
                var e = !1;
                if ("false" == (a.target.getAttribute("scaleEvent") ? a.target.getAttribute("scaleEvent") : "true"))
                    e = !0;
                else
                    for (var f = 0; f < c.length; f++)
                        if (c[f] == a.target) {
                            e = !0;
                            break
                        }
                if (!a.atviseCustomEvent && !e) {
                    a.stopImmediatePropagation(!0);
                    var m = null;
                    if (-1 !== a.type.indexOf("mouse") || -1 !== a.type.indexOf("click"))
                        m = h(a, d, b);
                    else if (-1 !== a.type.indexOf("touch"))
                        m = g(a, d,
                                b);
                    else if (-1 !== a.type.indexOf("drag") || -1 !== a.type.indexOf("drop"))
                        m = l(a, d, b);
                    m.atviseOriginalEvent = a;
                    m.atviseCustomEvent = !0;
                    kb && "click" == a.type ? setTimeout(function () {
                        k(a.target, m)
                    }, 0) : k(a.target, m)
                }
            }
            function h(a, b, c) {
                var d = null,
                e;
                e = m.Ba(1, a.clientX, a.clientY, b, c);
                b = m.Ba(0, a.pageX, a.pageY, b, c);
                d = new CustomEvent(a.type, {
                    detail: a.detail,
                    bubbles: a.bubbles,
                    cancelable: a.cancelable
                });
                d.screenX = a.screenX;
                d.screenY = a.screenY;
                d.clientX = e.x;
                d.clientY = e.y;
                d.pageX = b.x;
                d.pageY = b.y;
                d.view = a.view;
                d.ctrlKey = a.ctrlKey;
                d.altKey = a.altKey;
                d.shiftKey = a.shiftKey;
                d.metaKey = a.metaKey;
                d.button = a.button;
                d.which = a.which;
                d.relatedTarget = a.relatedTarget;
                // d.preventDefault = function () {
                //     this.atviseOriginalEvent.preventDefault()
                // };
                return d
            }
            function g(a, b, c) {
                function d(a) {
                    var e = function () {
                        function a() {
                            var b = [];
                            b.push.apply(b, arguments);
                            b.__proto__ = a.prototype;
                            return b
                        }
                        a.prototype = [];
                        a.prototype.item = function (a) {
                            return this[a]
                        };
                        return new a
                    }
                    ();
                    r(a, function (a) {
                        var d,
                        f;
                        d = null;
                        d = m.Ba(1, a.clientX, a.clientY, b, c);
                        f = m.Ba(0, a.pageX, a.pageY,
                                b, c);
                        d = {
                            identifier: a.identifier,
                            target: a.target,
                            clientX: d.x,
                            clientY: d.y,
                            screenX: a.screenX,
                            screenY: a.screenY,
                            pageX: f.x,
                            pageY: f.y,
                            radiusX: a.radiusX,
                            radiusY: a.radiusY
                        };
                        e.push(d)
                    });
                    return e
                }
                var e = d(a.touches),
                f = d(a.targetTouches),
                g = d(a.changedTouches),
                h = null,
                h = new CustomEvent(a.type, {
                    detail: a.detail,
                    bubbles: a.bubbles,
                    cancelable: a.cancelable
                });
                h.composed = a.Ee;
                h.touches = e;
                h.targetTouches = f;
                h.changedTouches = g;
                h.view = a.view;
                h.ctrlKey = a.ctrlKey;
                h.altKey = a.altKey;
                h.shiftKey = a.shiftKey;
                h.metaKey = a.metaKey;
                h.sourceCapabilities =
                    a.Te;
                // h.preventDefault = function () {
                //     this.atviseOriginalEvent.preventDefault()
                // };
                return h
            }
            function l(a, b, c) {
                var d;
                d = m.Ba(1, a.clientX, a.clientY, b, c);
                b = m.Ba(0, a.clientX, a.clientY, b, c);
                customDragEvent = new CustomEvent(a.type, {
                    detail: a.detail,
                    bubbles: a.bubbles,
                    cancelable: a.cancelable
                });
                customDragEvent.screenX = a.screenX;
                customDragEvent.screenY = a.screenY;
                customDragEvent.clientX = d.x;
                customDragEvent.clientY = d.y;
                customDragEvent.pageX = b.x;
                customDragEvent.pageY = b.y;
                customDragEvent.view = a.view;
                customDragEvent.ctrlKey =
                    a.ctrlKey;
                customDragEvent.altKey = a.altKey;
                customDragEvent.shiftKey = a.shiftKey;
                customDragEvent.metaKey = a.metaKey;
                customDragEvent.button = a.button;
                customDragEvent.buttons = a.buttons;
                customDragEvent.mozPressure = a.Qe;
                customDragEvent.dataTransfer = a.dataTransfer;
                customDragEvent.relatedTarget = a.relatedTarget;
                customDragEvent.preventDefault = function () {
                    this.atviseOriginalEvent.preventDefault()
                };
                return customDragEvent
            }
            function k(a, b) {
                a.dispatchEvent ? a.dispatchEvent(b) : a.fireEvent && a.fireEvent("on" + type, b)
            }
            if ("native" !=
                t["frame.scaletype"]) {
                var m = this;
                d = "undefined" == typeof d ? a : d;
                b = "undefined" == typeof b ? !1 : b;
                Array.isArray(c) || (c = []);
                e(a)
            }
        },
        Ba: function (a, b, c, d, e) {
            var f = this.Wa("left", !0, d),
            h = this.Wa("top", !0, d),
            g = 1 / this.Fa(!0, d),
            l = {
                x: 0,
                y: 0
            };
            1 == a && (a = this.Mc(), f -= a.x, h -= a.y);
            a = b - f;
            var k = c - h;
            l.x = b - a + a * g;
            l.y = c - k + k * g;
            e && (b = this.Wa("left", !0, d, !0) - f, d = this.Wa("top", !0, d, !0) - h, l.x += b, l.y += d);
            return l
        },
        Gc: function () {
            r(this.zb, oa("unload"));
            this.zb = null;
            Ac(this)
        },
        Fc: function (a) {
            var b = this,
            c = b.m,
            d = b.i;
            b.ub(a);
            a = {};
            c.frameElement ?
            (c = b.Fa(!0), a = {
                    height: parseFloat(b.m.frameElement.parentNode.style.height) * c,
                    width: parseFloat(b.m.frameElement.parentNode.style.width) * c
                }) : a = d.body.getBoundingClientRect();
            b.Xd = Math.round(100 * a.height) / 100;
            b.Yd = Math.round(100 * a.width) / 100;
            r(b.fc, function (a) {
                a(b.Yd, b.Xd)
            })
        },
        Jd: function (a) {
            this.ub(a)
        },
        nd: function () {
            if (this.m.frameElement) {
                var a = 1,
                b = this.m.frameElement.id;
                "native" == t["frame.scaletype"] && "undefined" !== typeof this.I && (a = this.I);
                "mainframe" == b && (b = this.m.parent.document.getElementById("mainContainer"),
                    2 == this.Va ? (b.style.width = this.Ua[2] * a + "px", b.style.height = this.Ua[3] * a + "px") : (b.style.width = "100%", b.style.height = "100%"))
            }
        },
        Ha: function (a, b) {
            function c(a) {
                return function () {
                    this.readyState && "complete" != this.readyState || (a.loaded = !0, r(a.Q, function (b) {
                            b(a.url, !1)
                        }), a.Q = null)
                }
            }
            0 === a.indexOf(".") && (a = a.substr(1));
            0 === a.indexOf("/") && (a = a.substr(1));
            var d;
            d = v[0].m.document;
            var e = d.getElementsByTagName("head")[0],
            f = function (a) {
                for (var b = 0; b < ma.length; b++)
                    if (ma[b].url == a)
                        return ma[b];
                return null
            }
            (a),
            h =
                H();
            y(e) || ("function" !== typeof b && (b = function () {}), null !== f ? f.loaded ? b(a, !0) : f.Q.push(b) : (ma.push({
                        url: a,
                        loaded: !1,
                        Q: [b]
                    }), d = d.createElement("script"), d.type = "text/javascript", d.async = !0, d.setAttribute("atv:required", !0), d.onload = c(ma[ma.length - 1]), d.onerror = function () {}, f = la[""], fa && !ba && f && "username" in K && "" != K.username && (++f.u, a += (-1 != a.indexOf("?") ? "&" : "?") + ("X-WebMI-sid=" + f.s + "&X-WebMI-cnonce=" + f.u + "&X-WebMI-digest=" + Q(f.s + ":" + f.A + ":" + f.u))), d.src = h ? ha + h.h.n.q + "/" + a : a, e.appendChild(d)))
        },
        mb: function (a) {
            var b =
                this;
            return function (c) {
                if (!b.i)
                    return null;
                c = a + c;
                var d = b.i.getElementById(c);
                d || (d = b.Wd(c));
                return d
            }
        },
        Ke: function () {
            return this.i.documentElement
        },
        $: function () {
            var a = this.i.documentElement;
            return U(a, "svg") ? a : U(a, "html") && a.getElementsByTagName("body")[0] && U(a.getElementsByTagName("body")[0].firstElementChild, "svg") ? a.getElementsByTagName("body")[0].firstElementChild : null
        },
        Me: function () {
            return this.i.documentElement
        },
        Fa: function (a, b) {
            var c = 1,
            d = t["frame.scaletype"],
            e = this.m ? this.m.frameElement : null;
            b && (e = b);
            if (!e || "zoom" !== d && "transform" !== d)
                return c;
            for (e = e.parentNode; e && (a || "mainContainer" !== e.id) && "BODY" !== e.nodeName; )
                1 == e.nodeType && e.style && ("zoom" == t["frame.scaletype"] ? c = isNaN(parseFloat(e.style.zoom)) ? c : parseFloat(e.style.zoom) * c : "undefined" != typeof e.style && "undefined" != typeof e.style.transform && (c = isNaN(parseFloat(e.style.transform.slice(6, -1))) ? c : parseFloat(e.style.transform.slice(6, -1)) * c)), e = e.parentNode;
            return c
        },
        Wa: function (a, b, c, d) {
            var e = 0,
            f = t["frame.scaletype"],
            h = this.m ? this.m.frameElement :
                null,
            g = this.Mc();
            c && (h = c);
            if (!h)
                return factor;
            if (d)
                for (f = "offset" + a.charAt(0).toUpperCase() + a.slice(1); h && (b || "mainContainer" !== h.id) && "BODY" !== h.nodeName; )
                    c = g = 0, c = this.m.getComputedStyle(h, null), g = h[f], c = parseFloat(c.getPropertyValue("border-" + a + "-width")), g += c, e += g, h = h.parentNode;
            else {
                e = this.getBoundingClientRect(h)[a];
                if (bc && lb && !1 == t["frame.enableautofit"]) {
                    if (h = this.getBoundingClientRect(v[0].i.getElementById("mainContainer")), 0 !== h.left || 0 !== h.top)
                        e += g["left" == a ? "x" : "y"]
                } else
                    e += g["left" == a ?
                        "x" : "y"];
                b || (b = this.i, this.m.frameElement && this.m.frameElement.ownerDocument.We && (b = this.m.frameElement.ownerDocument), b = b.getElementById("mainContainer"), a = parseFloat(b.style[a]), b = this.Fa(!0, b.childNodes[0]), a = isNaN(a) ? 0 : a, e = 1 / b * ("zoom" == f ? e - a * b : e - a))
            }
            return e
        },
        Mc: function () {
            return {
                y: v[0].m.pageYOffset || v[0].i.documentElement.scrollTop,
                x: v[0].m.pageXOffset || v[0].i.documentElement.scrollLeft
            }
        },
        getBoundingClientRect: function (a) {
            var b = {
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                height: 0,
                width: 0
            },
            c = null;
            if (/\{\s*\[native code\]\s*\}/.test("" +
                    a.getBoundingClientRect))
                c = a.getBoundingClientRect();
            else {
                var c = v[0].i.createElement("div"),
                d = a.getBoundingClientRect;
                a.getBoundingClientRect = c.getBoundingClientRect;
                c = a.getBoundingClientRect();
                a.getBoundingClientRect = d
            }
            return "zoom" == t["frame.scaletype"] ? (d = this.Fa(!0, a), d = isNaN(parseFloat(a.style.zoom)) ? d : parseFloat(a.style.zoom) * d, b.top = c.top * d, b.left = c.left * d, b.width = c.width * d, b.height = c.height * d, b.right = b.left + b.width, b.bottom = b.top + b.height, b) : c
        },
        nb: function (a, b) {
            var c = this.$().createSVGPoint();
            c.x = a;
            c.y = b;
            return c
        },
        Ad: function (a, b, c, d) {
            var e = ++Pc;
            this.aa[e] = {
                Td: a,
                $d: c,
                functionName: d,
                value: b
            };
            return e
        },
        se: function (a, b) {
            this.aa[a] && this.aa[a].functionName == b && (this.aa[a] = null, delete this.aa[a])
        },
        ve: function (a) {
            this.Ua = a;
            this.S = a.slice(0, 4)
        },
        Vb: function (a) {
            var b = null;
            p(v, function (c) {
                p(c.sb, function (c) {
                    Pa(c.oa, a) && (b = c)
                })
            });
            return b
        },
        Nd: function (a, b, c, d, e, f, h, g, l) {
            try {
                var k = {
                    fa: a,
                    element: a.create(h),
                    id: b,
                    x: c,
                    y: d,
                    width: e,
                    height: f,
                    parent: g,
                    visibility: null === l ? null : "hidden" != l
                };
                this.k.push(k);
                k.fa.add(k.element);
                Ka(k.element, k.visibility);
                return k.element
            } catch (m) {
                F("foreigenObject create function", m)
            }
        },
        Cc: function (a, b, c, d, e, f, h, g, l) {
            var k = this.i,
            m = this.k.length,
            p = this.Vb(k);
            if (null === p) {
                var s = k.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
                s.setAttribute("id", b);
                s.setAttribute("x", c);
                s.setAttribute("y", d);
                s.setAttribute("width", e);
                s.setAttribute("height", f);
                r(h, function (a) {
                    s.appendChild(a)
                });
                a.appendChild(s)
            } else {
                var t = Xb(this.$(), a),
                w = this.nb(0, 0).matrixTransform(t),
                A = parseFloat(a.getAttribute("x")),
                u = parseFloat(a.getAttribute("y"));
                if (!a.getAttribute("clip-path") && (isNaN(A) || isNaN(u))) {
                    for (var A = a.getBBox(), u = {
                            nc: 1,
                            oc: 1
                        }, v = a; null != v; ) {
                        g = null;
                        "function" === typeof v.getAttribute && (g = v.getAttribute("transform"));
                        if (g)
                            var x = v.transform.baseVal.consolidate().matrix, u = {
                                nc: u.nc * x.a,
                                oc: u.oc * x.d
                            };
                        v = v.parentNode
                    }
                    w.x += A.x * u.nc;
                    w.y += A.y * u.oc
                }
                null === g || (t = Mc(k, t, g));
                s = this.Nd(p, b, w.x + c * t.a, w.y + d * t.d, e * t.a, f * t.d, h, a, l);
                if (null === l)
                    for (v = a; null !== v && "hasAttribute" in v; ) {
                        if (v.hasAttribute("visibility")) {
                            Ka(s,
                                "hidden" != v.getAttribute("visibility"));
                            break
                        }
                        v = v.parentNode
                    }
                try {
                    p.register(s, h)
                } catch (y) {
                    F("foreignObject register function", y)
                }
            }
            0 == m && this.ub(null);
            return s
        },
        re: function (a) {
            for (var b = this.Vb(this.i), c = 0; c < this.k.length; c++)
                if (this.k[c].element == a) {
                    b.remove(a);
                    this.k.splice(c, 1);
                    break
                }
        },
        ld: function () {
            for (var a = this.i.getElementsByTagNameNS("http://webmi.atvise.com/2007/svgext", "foreignObject"); a.length; ) {
                for (var b = a[0], c = [], d = J(b.getAttribute("x")), e = J(b.getAttribute("y")), f = J(b.getAttribute("width")),
                    h = J(b.getAttribute("height")); b.childNodes.length; )
                    c.push(b.removeChild(b.childNodes[0]));
                this.Cc(b.parentNode, b.getAttribute("id"), d, e, f, h, c, b.getAttribute("transform"), b.getAttribute("visibility"));
                b.parentNode.removeChild(b)
            }
        },
        Ja: function () {
            var a = 1;
            this.I && "native" == t["frame.scaletype"] && (a = this.I);
            r(this.k, function (b) {
                try {
                    var c = b.element.style.left ? b.element.style.left : b.x,
                    d = b.element.style.top ? b.element.style.top : b.y,
                    e = b.element.style.width ? b.element.style.width : b.width,
                    f = b.element.style.height ?
                        b.element.style.height : b.height;
                    "native" == t["frame.scaletype"] && (c = b.x, d = b.y, e = b.width, f = b.height);
                    b.fa.set(b.element, c * a, d * a, e * a, f * a, a)
                } catch (h) {
                    F("foreignObjects position function", h)
                }
            })
        },
        Wd: function (a) {
            function b(c) {
                if (c.id == a)
                    return c;
                if (c.childNodes)
                    for (var e = 0; e < c.childNodes.length; ++e) {
                        var f = b(c.childNodes[e]);
                        if (f)
                            return f
                    }
                return null
            }
            var c = null;
            r(this.k, function (d) {
                d.id == a && (c = d.element);
                c || (c = b(d.element))
            });
            return c
        },
        ue: function (a, b) {
            P(this.sb, function (b) {
                return b.oa == a
            });
            null === b || this.sb.push({
                oa: a,
                create: b.create,
                Rd: b.destroy,
                set: b.set,
                add: b.add,
                remove: b.remove,
                register: b.register,
                Ed: b.applyOffsetsToMatrix
            })
        },
        ub: function (a) {
            var b,
            c,
            d,
            e;
            function f() {
                "mainframe" === m ? (k.Na = p.documentElement.clientHeight, k.Oa = p.documentElement.clientWidth) : "zoom" == t["frame.scaletype"] ? (k.Na = parseFloat(r.style.height), k.Oa = parseFloat(r.style.width)) : (k.Na = k.i.documentElement.clientHeight || parseFloat(r.style.height), k.Oa = k.i.documentElement.clientWidth || parseFloat(r.style.width))
            }
            function h() {
                var a = t["frame.alignment"];
                if ("mainframe" !== m || k.$b)
                    a = "center";
                k.Na / k.S[3] < k.Oa / k.S[2] ? (k.gb = !1, k.I = k.Na / k.S[3]) : (k.gb = !0, k.I = k.Oa / k.S[2]);
                k.gb || "top" != a && "bottom" != a ? !k.gb || "left" != a && "right" != a || (a = "center") : a = "center";
                switch (a) {
                case "top":
                case "left":
                    k.offsetTop = 0;
                    k.offsetLeft = 0;
                    break;
                case "bottom":
                    k.offsetTop = k.Na - k.S[3] * k.I;
                    k.offsetTop = Math.round(1E4 * k.offsetTop) / 1E4;
                    k.offsetLeft = 0;
                    break;
                case "right":
                    k.offsetTop = 0;
                    k.offsetLeft = k.Oa - k.S[2] * k.I;
                    k.offsetLeft = Math.round(1E4 * k.offsetLeft) / 1E4;
                    break;
                default:
                    k.gb ? (k.offsetTop =
                            (k.Na - k.S[3] * k.I) / 2, k.offsetTop = Math.round(1E4 * k.offsetTop) / 1E4, k.offsetLeft = 0) : (k.offsetTop = 0, k.offsetLeft = (k.Oa - k.S[2] * k.I) / 2, k.offsetLeft = Math.round(1E4 * k.offsetLeft) / 1E4)
                }
                k.pa = 1 / k.I
            }
            function g() {
                if ("mainframe" !== m) {
                    if (!k.k[0])
                        return;
                    var f = k.$().getScreenCTM(),
                    g = k.nb(0, 0).matrixTransform(f),
                    f = k.nb(k.Ua[2], k.Ua[3]).matrixTransform(f),
                    h = k.k[0].element.parentNode;
                    c = b = 0;
                    "transform" == t["frame.scaletype"] ? (d = (f.x - g.x) * k.pa, e = (f.y - g.y) * k.pa, h.style.transform = "scale(" + k.I + ")", h.style.left = g.x + "px", h.style.top =
                            g.y + "px") : "zoom" == t["frame.scaletype"] ? (k.Ea = 1 / k.Wb(), d = (f.x - g.x) * k.pa * k.Ea, e = (f.y - g.y) * k.pa * k.Ea, h.style.zoom = k.I, h.style.left = g.x * k.pa * k.Ea + "px", h.style.top = g.y * k.pa * k.Ea + "px") : (d = f.x - g.x, e = f.y - g.y, h.style.left = g.x + "px", h.style.top = g.y + "px", k.Ja());
                    h.style.clip = "rect(" + b + "px," + d + "px," + e + "px," + c + "px)"
                } else if (t["frame.enableautofit"] || k.$b)
                    "transform" == t["frame.scaletype"] ? (u.style.transform = "scale(" + k.I + ")", u.style.left = k.offsetLeft + "px", u.style.top = k.offsetTop + "px") : "zoom" == t["frame.scaletype"] ?
                    (u.style.zoom = k.I, u.style.left = k.offsetLeft * k.pa + "px", u.style.top = k.offsetTop * k.pa + "px") : (u.style.left = k.offsetLeft + "px", u.style.top = k.offsetTop + "px", k.nd(), k.Ja());
                a && "load" == a.type && "native" !== t["frame.scaletype"] && (k.Ja(), k.Re = k.I)
            }
            function l() {
                if (!k.m.frameElement || k.frame.isRoot())
                    switch (a.type) {
                    case "load":
                        return !1;
                    case "orientationchange":
                    case "resize":
                        mainframeEl = k.i.getElementById("mainframe");
                        mainframeWindow = mainframeEl.contentWindow;
                        for (var b in v) {
                            var c = v[b];
                            if (c.m == mainframeWindow) {
                                k =
                                    c;
                                break
                            }
                        }
                        return void 0 === k || vb(mainframeEl.src, location) ? !1 : !0
                    }
                else
                    return !0
            }
            var k = this;
            if (!a || l()) {
                var m = k.m.frameElement.id;
                c = e = d = b = 0;
                var p = k.m.parent.document;
                if (2 == k.Va)
                    if ("mainframe" !== m) {
                        var r = k.m.frameElement.parentElement;
                        f();
                        h();
                        g()
                    } else if (t["frame.enableautofit"] || k.$b) {
                        var u = p.getElementById("mainContainer");
                        f();
                        h();
                        g()
                    } else
                        t["frame.enableautofit"] || k.Ja()
            }
        },
        Wb: function () {
            return this.gb ? this.$().getBoundingClientRect().width / this.m.frameElement.getBoundingClientRect().width : this.$().getBoundingClientRect().height /
            this.m.frameElement.getBoundingClientRect().height
        }
    });
    Sb();
    window.setInterval(function () {
        var a = new Date - 2E3;
        p(v, function (b, c) {
            c && b.ee < a && !--b.qe && b.Gc()
        })
    }, 500);
    E(Tb, {
        createTrend: function (a, b, c) {
            var d = this;
            if ("string" === typeof a)
                throw Error("Trendfactory only supports HTMLNodes as renderTo parameter!");
            Fc(b);
            (new Promise(function (a) {
                    Gc.call(d, b.additionalModules, b.skipDefaultModules, a)
                })).then(function () {
                return new Promise(function (a) {
                    Hc.call(d, b, a)
                })
            }).then(function () {
                var e = Highcharts.getOptions();
                delete e.atviseOptions;
                Highcharts.setOptions(e);
                for (e = 0; e < ca.length; e++)
                    if (ca[e].name == b.trendName)
                        throw Error("Trendname " + b.trendName + " already exists!");
                "undefined" == typeof b.trendConfig.atviseOptions ? delete atviseDefaults.atviseOptions : "undefined" == typeof b.trendConfig.atviseOptions.disableDownSampling && (atviseDefaults.atviseOptions.disableDownSampling = !0);
                "undefined" != typeof atviseDefaults && Highcharts.setOptions(atviseDefaults);
                var e = d.Oc.chart(a, b.trendConfig),
                f = new Ic(e, b.trendName, b.trendGroup);
                d.D.sa(function () {
                    f.destroy()
                });
                ca.push(f);
                P(d.ib, function (a) {
                    return a.name === f.name ? (a.K(f), !0) : !1
                });
                x(c) && c(f)
            })
        },
        getTrendByContainerID: function (a) {
            var b = null;
            r(ca, function (c) {
                c.containerID == a && (b = c)
            });
            return b
        },
        getTrendByName: function (a, b) {
            var c = this,
            d = null;
            r(ca, function (b) {
                b.name == a && (d = b)
            });
            "function" === typeof b && (null !== d ? b(d) : (this.ib.push({
                        name: a,
                        K: b
                    }), this.D.sa(function () {
                        c.ib && P(c.ib, function (b) {
                            return b.name === a ? !0 : !1
                        })
                    })));
            return d
        },
        getTrendByGroup: function (a) {
            var b = [];
            r(ca, function (c) {
                c.group ==
                a && b.push(c)
            });
            return b
        },
        getAllTrends: function () {
            return ca
        }
    });
    E(Rb, {
        Xb: function (a) {
            var b = "";
            r(this.i.namespaces, function (c) {
                c.urn == a && (b = c.name + ":")
            });
            return b
        },
        createElement: function (a, b) {
            return "createElementNS" in this.i ? this.i.createElementNS(a, b) : this.i.createElement(this.Xb(a) + b)
        },
        createTextNode: function (a) {
            return this.i.createTextNode(a)
        },
        getAttribute: function (a, b, c) {
            u(a) && (a = this.w(a));
            C(a) || O();
            return "getAttributeNS" in a ? a.getAttributeNS(b, c) : a.getAttribute(this.Xb(b) + c)
        },
        setAttribute: function (a,
            b, c, d) {
            u(a) && (a = this.w(a));
            C(a) || O();
            return "setAttributeNS" in a ? a.setAttributeNS(b, c, d) : a.setAttribute(this.Xb(b) + c, d)
        }
    });
    var hc = {
        addEventListener: function (a, b) {
            "visibilitychange" == a && this.c.ad.push(b)
        },
        createPoint: function (a, b) {
            return this.c.nb(a, b)
        },
        scaleEventCoordinates: function (a, b, c, d) {
            var e = null,
            e = u(a) ? this.w(a) : a;
            if (!e)
                throw "Can't find element '" + a + "'";
            return this.c.te(e, b, c, d)
        },
        setScaledEvents: function (a, b, c, d) {
            var e = null,
            e = u(a) ? this.w(a) : a;
            if (!e)
                throw "Can't find element '" + a + "'";
            return this.c.xe(e,
                b, c, d)
        },
        getAbsoluteScaleFactor: function (a, b) {
            var c = null;
            if ("undefined" !== typeof b && u(b)) {
                if (c = this.w(b), !c)
                    throw "Can't find element '" + b + "'";
            } else
                c = b;
            return this.c.Fa(a, c)
        },
        getAbsoluteOffset: function (a, b, c) {
            var d = null;
            if ("undefined" !== typeof c && u(c)) {
                if (d = this.w(c), !d)
                    throw "Can't find element '" + c + "'";
            } else
                d = c;
            return this.c.Wa(a, b, d)
        },
        getBoundingClientRect: function (a) {
            var b = null,
            b = u(a) ? this.w(a) : a;
            if (!b)
                throw "Can't find element '" + a + "'";
            return this.c.getBoundingClientRect(b)
        },
        getAttribute: function (a,
            b) {
            return a.getAttribute(b)
        },
        setAttribute: function (a, b, c) {
            return a.setAttribute(b, c)
        },
        ze: function (a, b, c) {
            u(a) && (a = this.w(a));
            if (!a)
                throw "Can't find element '" + a + "'";
            var d = a.id,
            e = this.c,
            f = J(e.R.getAttribute(a, "http://webmi.atvise.com/2007/svgext", "refpx")),
            h = J(e.R.getAttribute(a, "http://webmi.atvise.com/2007/svgext", "refpy")),
            g = J(e.R.getAttribute(a, "", "x")),
            l = J(e.R.getAttribute(a, "", "y")),
            k = J(e.R.getAttribute(a, "", "height")),
            e = J(e.R.getAttribute(a, "", "width"));
            if (U(a, "svg")) {
                var m = a.parentNode;
                null !==
                m && U(m, "g") && (a = m)
            }
            m = a.$ID$;
            y(m) && (a.$ID$ = m = ++this.Ud);
            switch (b) {
            case "Rotation":
                this.Pb[m] = c;
                break;
            case "MoveX":
                this.Nb[m] = c;
                break;
            case "MoveY":
                this.Ob[m] = c;
                break;
            case "ScaleX":
                this.Qb[m] = c ? c : 1E-13;
                break;
            case "ScaleY":
                this.Rb[m] = c ? c : 1E-13;
                break;
            case "SkewX":
                this.Sb[m] = c;
                break;
            case "SkewY":
                this.Tb[m] = c
            }
            "" == d && (d = null);
            this.Dd(a, m, f, h, isNaN(this.Pb[m]) ? 0 : this.Pb[m], isNaN(this.Nb[m]) ? 0 : this.Nb[m], isNaN(this.Ob[m]) ? 0 : this.Ob[m], isNaN(this.Qb[m]) ? 1 : this.Qb[m], isNaN(this.Rb[m]) ? 1 : this.Rb[m], isNaN(this.Sb[m]) ?
                0 : this.Sb[m], isNaN(this.Tb[m]) ? 0 : this.Tb[m], this.Vd, d, g, l, k, e)
        }
    };
    r("MoveX MoveY Rotation ScaleX ScaleY SkewX SkewY".split(" "), function (a) {
        hc["set" + a] = function (b, c) {
            return this.ze(b, a, c)
        }
    });
    E(ga, hc);
    E(ga, {
        addElement: function (a, b, c) {
            var d = this.c.i.createElementNS("http://www.w3.org/2000/svg", a),
            e = this;
            p(b, function (a, b) {
                var c = "set" + b.substr(0, 1).toUpperCase() + b.substr(1, b.length);
                if (c in e)
                    e[c](d, a)
            });
            c = Ja(this, c);
            C(c) && c.appendChild(d);
            return d
        },
        getScreenCTM: function (a, b) {
            if (y(a))
                a = this.ob;
            else if (u(a))
                a =
                    this.w(a);
            else if ("boolean" === typeof a)
                if (!0 == a) {
                    var c = !0;
                    a = this.ob
                } else if (!1 == a) {
                    var d = !0;
                    a = this.ob
                }
            if (b)
                var e = b.de;
            var f = this.c;
            U(a, "html") && (a = a.getElementsByTagName("svg")[0]);
            if ("getScreenCTM" in a) {
                if (!U(a, "svg"))
                    return a.getScreenCTM();
                var h = a.appendChild(f.R.createElement("http://www.w3.org/2000/svg", "g")),
                g = h.getScreenCTM();
                a.removeChild(h);
                if (c || e || d)
                    c = 1, d || (c = f.Fa(e)), "zoom" === t["frame.scaletype"] && f.Wb && (f.Ea = 1 / f.Wb(), c *= f.Ea), g = g.scale(c), g.e *= c, g.f *= c;
                return g
            }
            g = this.getScreenCTM(this.ob, {
                de: !0
            });
            return (d = f.Vb(f.i)) ? d.Ed(g) : g
        },
        addForeignObject: function (a, b) {
            var c = this.c;
            b = Ja(this, b);
            var d = c.Cc(b, a.id, a.x, a.y, a.width, a.height, a.childNodes, "transform" in a ? a.transform : null, "visibility" in a ? a.visibility : null);
            c.Ja();
            return d
        },
        removeForeignObject: function (a) {
            this.c.re(a)
        }
    });
    var Sc = {
        Fill: [function (a) {
                return (a = a.getAttribute("fill")) ? a.replace("url(#" + this.Kc, "url(#") : a
            }, function (a, b) {
                u(b) && (b = b.replace("url(#", "url(#" + this.Kc));
                return null === b ? a.removeAttribute("fill") : a.setAttribute("fill",
                    b)
            }
        ],
        Points: [function (a) {
                return a.points
            }, function (a, b) {
                if (B(b)) {
                    var c = [],
                    d;
                    for (d in b)
                        B(b[d]) && 2 == b[d].length ? c.push(b[d][0] + "," + b[d][1]) : C(b) ? c.push(b[d].x + "," + b[d].y) : c.push(b[d]);
                    return a.setAttribute("points", c.join(" "))
                }
            }
        ],
        Height: La("height"),
        Image: [function (a) {
                return a.hasAttributeNS("http://www.w3.org/1999/xlink", "href") ? a.getAttributeNS("http://www.w3.org/1999/xlink", "href") : null
            }, function (a, b) {
                if (null != b)
                    return a.setAttributeNS("http://www.w3.org/1999/xlink", "href", za(b, {}, !0))
            }
        ],
        StrokeDasharray: [function (a) {
                a =
                    a.getAttribute("stroke-dasharray");
                u(a) && (a = a.split(",").join(" "));
                return a
            }, function (a, b) {
                if (null === b)
                    return a.removeAttribute("stroke-dasharray");
                B(b) && (b = b.join(","));
                return a.setAttribute("stroke-dasharray", b)
            }
        ],
        Text: [function (a) {
                return a.firstChild ? a.firstChild.data : ""
            }, function (a, b) {
                null != b && (a.firstChild ? a.firstChild.data = b : a.appendChild(this.c.i.createTextNode(b)))
            }
        ],
        Visible: [function (a) {
                return "hidden" != a.getAttribute("visibility")
            }, function (a, b) {
                var c = null;
                "http://www.w3.org/2000/svg" !=
                a.namespaceURI ? p(this.c.k, function (b) {
                    b.element == a && (c = b)
                }) : (U(a, "g") || U(a, "svg")) && p(v, function (c) {
                    var e = c.i.documentElement;
                    r(c.k, function (c) {
                        var d;
                        do
                            if (d = y(d) ? c.parent : d.parentNode, d == a) {
                                null === c.visibility && Ka(c.element, b);
                                break
                            }
                        while (d != e)
                    })
                });
                if (c)
                    Ka(a, b), c.visibility = b;
                else if (null === b)
                    a.removeAttribute("visibility");
                else
                    return a.setAttribute("visibility", b ? "visible" : "hidden")
            }
        ],
        Width: La("width"),
        X: La("x"),
        Y: La("y")
    };
    p({
        Circle: "circle",
        Ellipse: "ellipse",
        Group: "g",
        Image: "image",
        Line: "line",
        Path: "path",
        Polygon: "polygon",
        Polyline: "polyline",
        Rect: "rect",
        Text: "text"
    }, function (a, b) {
        Wa(ga, "add" + b, function (b, d) {
            return this.addElement(a, b, d)
        })
    });
    p({
        X1: "x1",
        X2: "x2",
        Y1: "y1",
        Y2: "y2",
        CenterX: "cx",
        CenterY: "cy",
        RadiusX: "rx",
        RadiusY: "ry",
        Radius: "r",
        FontFamily: "font-family",
        FontSize: "font-size",
        FillOpacity: "fill-opacity",
        FillRule: "fill-rule",
        PathData: "d",
        Stroke: "stroke",
        StrokeLinejoin: "stroke-linejoin",
        StrokeOpacity: "stroke-opacity",
        StrokeWidth: "stroke-width",
        TextAnchor: "text-anchor"
    }, function (a, b) {
        Vb(ga,
            b, function (b) {
            return b.getAttribute(a)
        }, function (b, d) {
            return null === d ? b.removeAttribute(a) : b.setAttribute(a, d)
        })
    });
    p(Sc, function (a, b) {
        Vb(ga, b, a[0], a[1])
    });
    E(ib, {
        connect: function (a, b, c) {
            c = u(c) && c.length ? this.Da + c : this.Da.substr(0, this.Da.length - 1);
            var d = this.c.ra;
            d && (a in d ? c in d[a] ? d[a][c].push(b) : d[a][c] = [b] : (d[a] = {})[c] = [b])
        },
        fire: function (a, b, c) {
            function d(a) {
                var d = {
                    value: b,
                    context: c
                };
                r(a, function (a) {
                    a(d)
                })
            }
            var e = this;
            if (B(a))
                r(a, function (a, d) {
                    e.fire(a, B(b) ? b[d] : b, B(c) ? c[d] : c)
                });
            else if (!u(c))
                p(v,
                    function (b) {
                    b.data.paused || b.ra && a in b.ra && p(b.ra[a], d)
                });
            else if (e.c.ra && a in e.c.ra) {
                c = c.length ? this.Da + c : this.Da.substr(0, this.Da.length - 1);
                var f = e.c.ra[a];
                c in f && d(f[c])
            }
        }
    });
    E(Zb, {
        isChecked: function (a) {
            return this.w(a).checked
        },
        setChecked: function (a, b) {
            this.w(a).checked = b ? !0 : !1
        }
    });
    E($b, {
        addItem: function (a, b, c) {
            a = this.w(a);
            var d = a.ownerDocument;
            try {
                var e = d.createElementNS("http://www.w3.org/1999/xhtml", "option")
            } catch (f) {
                e = d.createElement("option")
            }
            e.value = y(c) ? b : c;
            return a.appendChild(e).appendChild(d.createTextNode(b))
        },
        setItems: function (a, b) {
            for (var c = this, d = this.w(a); d.childNodes.length; )
                d.removeChild(d.childNodes[0]);
            B(b) ? r(b, function (b) {
                c.addItem(a, b)
            }) : p(b, function (b, d) {
                c.addItem(a, b, d)
            })
        }
    });
    E(jb, {
        getDisabled: function (a) {
            return this.w(a).disabled
        },
        setDisabled: function (a, b) {
            this.w(a).disabled = b ? !0 : !1
        },
        getValue: function (a) {
            return this.w(a).value
        },
        setValue: function (a, b) {
            this.w(a).value = b
        }
    });
    Va = sb();
    E(hb, {
        isMobileTouchDevice: function () {
            return bc
        },
        addOnfocus: function (a) {
            this.c.Bd(a)
        },
        addOnload: function (a) {
            this.c.Dc(a)
        },
        addOnresize: function (a) {
            this.c.Cd(a)
        },
        addOnunload: function (a) {
            this.c.sa(a)
        },
        getClientInfo: function () {
            return Va
        },
        getAccessControlSupport: function () {
            return fa
        },
        getAccessControlVersion: function () {
            return dc
        },
        getCookieSupport: function () {
            return ba
        },
        getMethodSupport: function () {
            return fc
        },
        getFeatureSupport: function () {
            return ec
        },
        getFilterSupport: function () {
            return ia
        },
        getLoginMethod: function () {
            return aa
        },
        getState: function () {
            return Eb
        },
        getConfig: function (a) {
            return t[a]
        },
        setConfig: function (a, b) {
            return Ta(a, b)
        },
        hasLoginRequired: function (a) {
            return a ? Da : "username" in K && "" != K.username ? !1 : Da
        },
        hasRight: function (a) {
            return "right" in K && X(a, K.right)
        },
        setExtension: function (a, b, c) {
            Ra[a] = [{}, b, c]
        },
        getRootExtensions: function () {
            return Sa
        },
        inList: X,
        isRedundant: function () {
            return G
        },
        sprintf: yb,
        translate: tb,
        hashMD5: Q,
        secureString: function (a) {
            if ("" == a)
                return "";
            a = Xa(a);
            var b = ["img"],
            c = ["alt", "height", "src", "title", "width"],
            d = "<img> <b> <blockquote> <code> <del> <dd> <dl> <dt> <em> <h1> <h2> <h3> <i> <kbd> <li> <ol> <p> <pre> <s> <sup> <strong> <ul> <br> <hr> <br/> <hr/>".split(" ");
            for (n in b) {
                var e = a.match(new RegExp("(&lt;" + b[n] + "\\s)(.*?)(&gt;)", "ig"));
                for (result in e) {
                    var f = e[result].replace(/&lt;/g, "<").replace(/&gt;/g, ">");
                    a = a.replace(e[result], f)
                }
            }
            for (n in c)
                for (result in e = a.match(new RegExp("\\s*" + c[n] + "\\s*\\=\\s*(&quot;)(.*?)(&quot;)", "ig")), e)
                    f = e[result].replace(/&#x2F;/g, "/").replace(/&#34;/g, '"').replace(/&amp;/g, "&"), f = ub(f), a = a.replace(e[result], f);
            for (n in d)
                b = Xa(d[n]), c = b.replace("&lt;", "&lt;/"), a = a.replace(new RegExp(b, "ig"), d[n]).replace(new RegExp(c, "ig"),
                        d[n].replace("<", "</"));
            return a
        },
        escapeHTML: Xa,
        unescapeHTML: ub,
        isExternalHost: vb,
        proxy: function (a, b) {
            b || (b = window);
            "function" !== typeof b.Object.assign && (b.Object.assign = Object.assign);
            if (b.frameElement && "about:blank" == b.frameElement.src)
                b.frameElement.src = "about:blank";
            else {
                var c = b.document,
                d = null,
                e = b.webMI;
                y(e) && (zb(b), b.webMI = e = new hb(b, !0));
                p(v, function (a) {
                    p(a.xa, function (a) {
                        try {
                            Qa(a, c) && (b.close = function () {
                                a.close()
                            })
                        } catch (d) {}
                    })
                });
                null === a || jc(function (f) {
                    function h(f, g, k, l, m, r) {
                        var t = a[f],
                        u = t[0],
                        v = {};
                        t[3] && k in t[3] && (m = da(m, t[3][k]));
                        p(m, function (a, b) {
                            function c(b) {
                                var d = r.webMI.query;
                                return b in a && a[b]in d ? d[a[b]] : ""
                            }
                            if (C(a)) {
                                var d = {
                                    a: c("a"),
                                    b: c("b"),
                                    v: a.v
                                };
                                v[b] = d.b + ("v" in a ? d.v : "") + d.a;
                                C(d.a) && (v[b] = d.a);
                                C(d.b) && (v[b] = d.b);
                                C(d.v) && (v[b] = d.v)
                            } else
                                v[b] = a
                        });
                        var x = new Oc(b, e, f, g, l, da(t[2], v), r);
                        p(t[1], function (a, b) {
                            h(a[0], c.getElementById(l + b), l + b, l + b + "_", a[1], x.uc)
                        });
                        try {
                            u(x.ud, x.uc, x.td, x.uc)
                        } catch (y) {
                            d || (d = y)
                        }
                    }
                    var g = e.c.$();
                    null === g && (g = e.c.i.documentElement);
                    var l = e.c.R;
                    if (null ===
                        l)
                        e.c.ld();
                    else {
                        if (l = l.getAttribute(g, "http://webmi.atvise.com/2007/svgext", "oe")) {
                            var k = parseInt(l.substr(0, 1)),
                            m = 0;
                            r(l.substr(1), function (a, b) {
                                m = (m << 4) + D.indexOf(a) - parseInt(f.substr(b % f.length, 1), 16);
                                if (b % k == k - 1) {
                                    var d = c.getElementById("id_" + m);
                                    !d || 0 == m && "svg" == d.localName || d.parentNode.removeChild(d);
                                    m = 0
                                }
                            });
                            e.gfx.setVisible(g, null)
                        }
                        e.c.ld();
                        h("", g, "", "", e.query, b);
                        if (d)
                            throw d;
                    }
                })
            }
        },
        runInterval: function (a, b, c) {
            for (var d = 0; d < b; ++d)
                this.c.m.setTimeout(c, (d + 1) * a, d)
        },
        setInterval: function (a, b) {
            return this.c.m.setInterval(b,
                a)
        }
    });
    return new hb(window)
}
    ());
