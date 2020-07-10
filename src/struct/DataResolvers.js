const PastebinError = require("./PastebinError")

module.exports = class Resolvers {
    constructor() { throw new PastebinError() }

    /**
     * The content of a paste. If an object, it will be stringified as JSON. If a Buffer or a primitive value, it will be converted with `String()`
     * @typedef {*} ContentResolvable
     */
    static resolveContent(value) {
        if (!value)
            throw new PastebinError("Paste content is invalid.")
        else if (typeof value !== "object" || value instanceof Buffer)
            value = String(value)
        else if (typeof value === "object")
            value = JSON.stringify(value)
        if (value.length > 512000)
            throw new PastebinError("Paste content must not exceed 512,000 characters.")
        return value
    }

    static resolveTitle(value) {
        if (typeof value !== "string")
            throw new PastebinError("Paste title must be a string.")
        if (value.length > 255)
            throw new PastebinError("Paste title must not exceed 255 characters.")
        return value
    }

    /**
     * A "format," which will be used for syntax highlighting. You can see the full list [here](https://pastebin.com/api#5).
     * @typedef {string} Format
     */
    static resolveFormat(value) {
        const formats = ["4cs","6502acme","6502kickass","6502tasm","abap","actionscript","actionscript3","ada","aimms","algol68","apache","applescript","apt_sources","arduino","arm","asm","asp","asymptote","autoconf","autohotkey","autoit","avisynth","awk","bascomavr","bash","basic4gl","dos","bibtex","blitzbasic","b3d","bmx","bnf","boo","bf","c","c_winapi","c_mac","cil","csharp","cpp","cpp-winapi","cpp-qt","c_loadrunner","caddcl","cadlisp","ceylon","cfdg","chaiscript","chapel","clojure","klonec","klonecpp","cmake","cobol","coffeescript","cfm","css","cuesheet","d","dart","dcl","dcpu16","dcs","delphi","oxygene","diff","div","dot","e","ezt","ecmascript","eiffel","email","epc","erlang","euphoria","fsharp","falcon","filemaker","fo","f1","fortran","freebasic","freeswitch","gambas","gml","gdb","genero","genie","gettext","go","groovy","gwbasic","haskell","haxe","hicest","hq9plus","html4strict","html5","icon","idl","ini","inno","intercal","io","ispfpanel","j","java","java5","javascript","jcl","jquery","json","julia","kixtart","kotlin","latex","ldif","lb","lsl2","lisp","llvm","locobasic","logtalk","lolcode","lotusformulas","lotusscript","lscript","lua","m68k","magiksf","make","mapbasic","markdown","matlab","mirc","mmix","modula2","modula3","68000devpac","mpasm","mxml","mysql","nagios","netrexx","newlisp","nginx","nim","text","nsis","oberon2","objeck","objc","ocaml","ocaml-brief","octave","oorexx","pf","glsl","oobas","oracle11","oracle8","oz","parasail","parigp","pascal","pawn","pcre","per","perl","perl6","php","php-brief","pic16","pike","pixelbender","pli","plsql","postgresql","postscript","povray","powerbuilder","powershell","proftpd","progress","prolog","properties","providex","puppet","purebasic","pycon","python","pys60","q","qbasic","qml","rsplus","racket","rails","rbs","rebol","reg","rexx","robots","rpmspec","ruby","gnuplot","rust","sas","scala","scheme","scilab","scl","sdlbasic","smalltalk","smarty","spark","sparql","sqf","sql","standardml","stonescript","sclang","swift","systemverilog","tsql","tcl","teraterm","thinbasic","typoscript","unicon","uscript","upc","urbi","vala","vbnet","vbscript","vedit","verilog","vhdl","vim","visualprolog","vb","visualfoxpro","whitespace","whois","winbatch","xbasic","xml","xorg_conf","xpp","yaml","z80","zxbasic"]
        if (typeof value !== "string")
            throw new PastebinError("Paste format must be a string.")
        value = String.prototype.toLowerCase.call(value)
        if (!formats.includes(value))
            throw new PastebinError("Paste format must be a valid format.")
        return value
    }

    /**
     * A privacy setting. Can be one of the following:
     * * `0` (or `"public"`)
     * * `1` (or `"unlisted"`)
     * * `2` (or `"private"`)
     * @typedef {(string|number)} Privacy
     */
    static resolvePrivacy(value) {
        const privacyValues = ["public", "unlisted", "private"]
        if (typeof value !== "number" && typeof value !== "string")
            throw new PastebinError("Paste privacy must be a number or a string.")
        if (typeof value === "number" && ![0, 1, 2].includes(value))
            throw new PastebinError("As a number, paste privacy must be 0, 1, or 2.")
        if (typeof value === "string" && !privacyValues.includes(value.toLowerCase()))
            throw new PastebinError("As a string, paste privacy must be 'public', 'unlisted' or 'private'.")

        if (typeof value === "string") return privacyValues.indexOf(value)
        else return value
    }

    /**
     * An expiry setting. Can be one of the following:
     * * `"NEVER"` (or `"N"`)
     * * `"10 MINUTES"` (or `"10M"`)
     * * `"1 HOUR"` (or `"1H"`)
     * * `"1 DAY"` (or `"1D"`)
     * * `"1 WEEK"` (or `"1W"`)
     * * `"2 WEEKS"` (or `"2W"`)
     * * `"1 MONTH"` (or `"1M"`)
     * * `"6 MONTHS"` (or `"6M"`)
     * * `"1 YEAR"` (or `"1Y"`)
     * @typedef {(string|number)} Expiry
     */
    static resolveExpiry(value) {
        const expiryValues = {
            "never": "n",
            "10 minutes": "10m",
            "1 hour": "1h",
            "1 day": "1d",
            "1 week": "1w",
            "2 weeks": "2w",
            "1 month": "1m",
            "6 months": "6m",
            "1 year": "1y"
        }
        if (typeof value !== "string")
            throw new PastebinError("Paste expiry must be a string.")
        value = value.toLowerCase()
        if (!Object.keys(expiryValues).includes(value) && !Object.values(expiryValues).includes(value))
            throw new PastebinError("Paste expiry must be 'n' (never), '10m', '1h', '1d', '1w', '2w', '1m', '6m', '1y', or their long equivalents.")
        if (Object.keys(expiryValues).includes(value))
            value = expiryValues[value]
        return value.toUpperCase()
    }
}