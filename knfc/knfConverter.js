// Generated JS from Java: Node -----
class Node {
  constructor(s = "") {
    this.left = null;
    this.right = null;
    this.parent = null;
    this.s = s;
    this.id = "";
  }

  toString() {
    if (this.hasOwnProperty("$protoName")) {
      return jv_Class_c.toString.apply(this, arguments);
    }
    return (
      "[" +
      (this.s !== null ? this.s : "") +
      (this.id !== null ? " id=" + this.id : "") +
      (this.left !== null
        ? " : " +
          this.left.toString() +
          (this.right !== null ? "," + this.right.toString() : "")
        : "") +
      "]"
    );
  }

  setIDRec(id) {
    this.id = id;
    if (this.left !== null) {
      this.left.setIDRec(id + "0");
    }
    if (this.right !== null) {
      this.right.setIDRec(id + "1");
    }
  }

  setID(id) {
    this.id = id;
    console.log("ID SET FOR" + this.toString());
  }
}

class KnfConverter {
  static toKNF(ns) {
    var ret = [];
    ret.push("{T}");
    console.log(ns);
    for (const n of ns) {
      //console.log(n)
      var a = n.left.s + n.left.id;
      var b =
        n.right.left.s + (n.right.left.id !== null ? n.right.left.id : "");
      var c = null;
      if (n.right.right !== null) {
        c =
          n.right.right.s + (n.right.right.id !== null ? n.right.right.id : "");
      }
      var not = "¬";
      var S = ", ";
      switch (n.right.s.charAt(0)) {
        case "!": {
          ret.push("{" + a + S + b + "}");
          ret.push("{" + not + a + S + not + b + "}");
          break;
        }
        case "<": {
          ret.push("{" + not + a + S + not + b + S + c + "}");
          ret.push("{" + not + a + S + b + S + not + c + "}");
          ret.push("{" + a + S + b + S + c + "}");
          ret.push("{" + a + S + not + b + S + not + c + "}");
          break;
        }
        case "-": {
          ret.push("{" + not + a + S + not + b + S + c + "}");
          ret.push("{" + a + S + b + "}");
          ret.push("{" + a + S + not + c + "}");
          break;
        }
        case "%": {
          ret.push("{" + not + a + S + not + b + S + c + "}");
          ret.push("{" + not + a + S + not + b + S + not + c + "}");
          ret.push("{" + a + S + not + b + S + c + "}");
          ret.push("{" + a + S + b + S + not + c + "}");
          break;
        }
        case "|": {
          ret.push("{" + not + a + S + b + S + c + "}");
          ret.push("{" + a + S + not + b + "}");
          ret.push("{" + a + S + not + c + "}");
          break;
        }
        case "&": {
          ret.push("{" + a + S + not + b + S + not + c + "}");
          ret.push("{" + not + a + S + b + "}");
          ret.push("{" + not + a + S + c + "}");
          break;
        }
      }
    }
    return ret;
  }

  static generateClauses(n) {
    var ret = [];
    var help = new Node("<");
    help.left = new Node("T");
    help.left.parent = help;
    help.left.setID(n.id);
    help.right = new Node(n.s);
    help.right.parent = help;
    if (n.left !== null) {
      help.right.left = new Node(
        KnfConverter.isClauseChar(n.left.s.charAt(0)) ? "T" : n.left.s
      );
      help.right.left.parent = help.right;
      if (KnfConverter.isClauseChar(n.left.s.charAt(0))) {
        help.right.left.setID(n.left.id);
        ret.push(...KnfConverter.generateClauses(n.left));
      }
      ret.splice(0, 0, help);
    }
    if (n.right !== null) {
      help.right.right = new Node(
        KnfConverter.isClauseChar(n.right.s.charAt(0)) ? "T" : n.right.s
      );
      help.right.right.parent = help.right;
      if (KnfConverter.isClauseChar(n.right.s.charAt(0))) {
        help.right.right.setID(n.right.id);
        ret.push(...KnfConverter.generateClauses(n.right));
      }
    }
    return ret;
  }

  static isClauseChar(c) {
    if (arguments.length == 0) return;
    return (
      c === "!" || c === "<" || c === "-" || c === "|" || c === "&" || c === "%"
    );
  }

  static replaceAlternativeCharacters(s) {
    // GDW (¡ should be ↔)
    s = s.replaceAll("\u00a1", "\u2194");

    // Impli (æ should be →)
    s = s.replaceAll("\u00e6", "\u2192");

    // Or (, should be v)
    s = s.replaceAll("\u002c", "\u0076");

    // And (· should be ∧)
    s = s.replaceAll("\u00b7", "\u2227");

    return s;
  }

  static toInternRepresentation(s) {
    s = KnfConverter.replaceAlternativeCharacters(s);

    for (const [special, internal] of Object.entries(
      KnfConverter.symbolMappings()
    )) {
      s = s.replaceAll(special, internal);
    }

    return s;
  }

  static symbolMappings() {
    return {
      // Not (¬)
      "\u00AC": "!",

      // GDW (↔)
      "\u2194": "<",

      // Impli (→)
      "\u2192": "-",

      // Or (v)
      "\u0076": "|",

      // And (∧)
      "\u2227": "&",

      // Xor (⊕)
      "\u2295": "%",
    };
  }

  static generateSyntaxTree(s) {
    var main = new Node();
    var current = main;
    s = s.replaceAll(" ", "");
    s = "(" + s + ")";
    s = KnfConverter.toInternRepresentation(s);

    for (var i = 0; i < s.length; i++) {
      console.log(s.charAt(i) + " :::" + main.toString());
      var switchhelp = s.charAt(i);
      if (KnfConverter.isClauseChar(s.charAt(i))) {
        switchhelp = "!";
      }
      switch (switchhelp) {
        case "(": {
          current.left = new Node();
          current.left.parent = current;
          current = current.left;
          break;
        }
        case ")": {
          current = current.parent;
          break;
        }
        case "!": {
          if (s.charAt(i) !== "!") {
            current.s = s.charAt(i) + "";
            current.right = new Node();
            current.right.parent = current;
            current = current.right;
          } else {
            current = current.parent;
            current.s = s.charAt(i) + "";
            current = current.left;
          }
          break;
        }
        default: {
          current.s = s.charAt(i) + "";
          current = current.parent;
        }
      }
    }

    main.setIDRec("");
    return main;
  }

  // eg: (p v q) v ((l v (l v (l v m))) v (l v m))
  static convertToKnf(formula) {
    const n = KnfConverter.generateSyntaxTree(formula);
    console.log(n.toString());
    const ns = KnfConverter.generateClauses(n);
    //ns.forEach(x => console.log(x));
    return KnfConverter.toKNF(ns);
  }
}
