// Generated JS from Java: Node -----
function Node() {
    this.left = null;
    this.right = null;
    this.parent = null;
    this.s = null;
    this.id = null;
 
    if (arguments.length == 0) {
       jv_Object.call(this);
    this._NodeInit();
    }
    else if (arguments.length == 1) {
       var s = arguments[0];
       jv_Object.call(this);
    this._NodeInit();
       this.s = s;
    }}
 
 var Node_c = sc_newClass("Node", Node, jv_Object, null);
 
 Node_c.toString = function ()  {
    if (this.hasOwnProperty("$protoName")) {
       return jv_Class_c.toString.apply(this, arguments);
    }
    return "[" + (this.s !== null ? this.s : "") + (this.id !== null ? " id=" + this.id : "") + (this.left !== null ? (" : " + this.left.toString() + (this.right !== null ? ("," + this.right.toString()) : "")) : "") + "]";
 };
 Node_c.setIDRec = function (id)  {
    this.id = id;
    if (this.left !== null) {
       this.left.setIDRec(id + "0");
    }
    if (this.right !== null) {
       this.right.setIDRec(id + "1");
    }
 };
 Node_c.setID = function (id)  {
    this.id = id;
    jv_System_c.out.println("ID SET FOR" + Node_c.toString.call(this));
 };
 
 Node_c._NodeInit = function() {
    this.left = null;
       ;
    this.right = null;
       ;
    this.parent = null;
       ;
    this.s = null;
       ;
    this.id = null;
       ;
 };
 
 // Generated JS from Java: Abfahrt2 -----
 function Abfahrt2() {
    jv_Object.call(this);
 }
 
 var Abfahrt2_c = sc_newClass("Abfahrt2", Abfahrt2, jv_Object, null);
 
 Abfahrt2_c.toKNF = function (ns)  {
    var ret = new jv_ArrayList();
    ret.add("{T}");
    for (var _i = ns.iterator(); _i.hasNext();) {
       var n = _i.next();
       var a = n.left.s + n.left.id;
       var b = n.right.left.s + (n.right.left.id !== null ? n.right.left.id : "");
       var c = null;
       if (n.right.right !== null) {
          c = n.right.right.s + (n.right.right.id !== null ? n.right.right.id : "");
       }
       var not = "Â¬";
       var S = ", ";
       switch(n.right.s.charAt(0)) {
          case '!':
             {
                ret.add("{" + a + S + b + "}");
                ret.add("{" + not + a + S + not + b + "}");
                break;
          }
          case '<':
             {
                ret.add("{" + not + a + S + not + b + S + c + "}");
                ret.add("{" + not + a + S + b + S + not + c + "}");
                ret.add("{" + a + S + b + S + c + "}");
                ret.add("{" + a + S + not + b + S + not + c + "}");
                break;
          }
          case '-':
             {
                ret.add("{" + not + a + S + not + b + S + c + "}");
                ret.add("{" + a + S + b + "}");
                ret.add("{" + a + S + not + c + "}");
                break;
          }
          case '%':
             {
                ret.add("{" + not + a + S + not + b + S + c + "}");
                ret.add("{" + not + a + S + not + b + S + not + c + "}");
                ret.add("{" + a + S + not + b + S + c + "}");
                ret.add("{" + a + S + b + S + not + c + "}");
                break;
          }
          case '|':
             {
                ret.add("{" + not + a + S + b + S + c + "}");
                ret.add("{" + a + S + not + b + "}");
                ret.add("{" + a + S + not + c + "}");
                break;
          }
          case '&':
             {
                ret.add("{" + a + S + not + b + S + not + c + "}");
                ret.add("{" + not + a + S + b + "}");
                ret.add("{" + not + a + S + c + "}");
                break;
          }
       }
    }
    return ret;
 };
 Abfahrt2_c.generateClauses = function (n)  {
    var ret = new jv_ArrayList();
    var help = new Node("<");
    help.left = new Node("T");
    help.left.parent = help;
    help.left.setID(n.id);
    help.right = new Node(n.s);
    help.right.parent = help;
    if (n.left !== null) {
       help.right.left = new Node(Abfahrt2_c.isClauseChar(n.left.s.charAt(0)) ? "T" : n.left.s);
       help.right.left.parent = help.right;
       if (Abfahrt2_c.isClauseChar(n.left.s.charAt(0))) {
          help.right.left.setID(n.left.id);
          ret.addAll(Abfahrt2_c.generateClauses(n.left));
       }
       ret.add(0, help);
    }
    if (n.right !== null) {
       help.right.right = new Node(Abfahrt2_c.isClauseChar(n.right.s.charAt(0)) ? "T" : n.right.s);
       help.right.right.parent = help.right;
       if (Abfahrt2_c.isClauseChar(n.right.s.charAt(0))) {
          help.right.right.setID(n.right.id);
          ret.addAll(Abfahrt2_c.generateClauses(n.right));
       }
    }
    return ret;
 };
 Abfahrt2_c.isClauseChar = function (c)  {
    if (arguments.length == 0) return;
    return c === '!' || c === '<' || c === '-' || c === '|' || c === '&' || c === '%';
 };
 Abfahrt2_c.toInternRepresentation = function (s)  {
    s = s.replaceAll("Â¬", "!");
    s = s.replaceAll("â", "<");
    s = s.replaceAll("Â¡", "<");
    s = s.replaceAll("â", "-");
    s = s.replaceAll("Ã¦", "-");
    s = s.replaceAll("v", "|");
    s = s.replaceAll(",", "|");
    s = s.replaceAll("â§", "&");
    s = s.replaceAll("Â·", "&");
    s = s.replaceAll("â", "%");
    return s;
 };
 Abfahrt2_c.generateSyntaxTree = function (s)  {
    var main = new Node();
    var actual = main;
    s = s.replaceAll(" ", "");
    s = "(" + s + ")";
    s = Abfahrt2_c.toInternRepresentation(s);
    jv_System_c.out.println(s);
    for (var i = 0; i < s._length(); i++) {
       jv_System_c.out.println(s.charAt(i) + " :::" + main.toString());
       var switchhelp = s.charAt(i);
       if (Abfahrt2_c.isClauseChar(s.charAt(i))) {
          switchhelp = '!';
       }
       switch(switchhelp) {
          case '(':
             {
                actual.left = new Node();
                actual.left.parent = actual;
                actual = actual.left;
                break;
          }
          case ')':
             {
                actual = actual.parent;
                break;
          }
          case '!':
             {
                if (s.charAt(i) !== '!') {
                   actual.s = s.charAt(i) + "";
                   actual.right = new Node();
                   actual.right.parent = actual;
                   actual = actual.right;
             }
                else {
                   actual = actual.parent;
                   actual.s = s.charAt(i) + "";
                   actual = actual.left;
             }
                break;
          }
          default :
             {
                actual.s = s.charAt(i) + "";
                actual = actual.parent;
          }
       }
    }
    main.setIDRec("");
    return main;
 };
 
 
 