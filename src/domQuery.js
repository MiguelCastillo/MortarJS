define(function() {
  var domQuery = (function() {
    var aDOMFunc = [
          Element.prototype.removeAttribute,
          Element.prototype.setAttribute,
          CSSStyleDeclaration.prototype.removeProperty,
          CSSStyleDeclaration.prototype.setProperty
        ];

    function setSomething (bStyle, sProp, sVal) {
      var  bSet = Boolean(sVal), fAction = aDOMFunc[bSet | bStyle << 1],
           aArgs = Array.prototype.slice.call(arguments, 1, bSet ? 3 : 2),
           aNodeList = bStyle ? this.cssNodes : this.nodes;

      if (bSet && bStyle) { aArgs.push(""); }
      for (
        var nItem = 0, nLen = this.nodes.length;
        nItem < nLen;
        fAction.apply(aNodeList[nItem++], aArgs)
      );
      this.follow = setSomething.caller;
      return this;
    }

    function setStyles (sProp, sVal) { return setSomething.call(this, true, sProp, sVal); }
    function setAttribs (sProp, sVal) { return setSomething.call(this, false, sProp, sVal); }
    function getSelectors () { return this.selectors; };
    function getNodes () { return this.nodes; };

    return (function (sSelectors) {
      var oQuery = new Function("return arguments.callee.follow.apply(arguments.callee, arguments);");
      oQuery.selectors = sSelectors;
      oQuery.nodes = document.querySelectorAll(sSelectors);
      oQuery.cssNodes = Array.prototype.map.call(oQuery.nodes, function (oInlineCSS) { return oInlineCSS.style; });
      oQuery.attributes = setAttribs;
      oQuery.inlineStyle = setStyles;
      oQuery.follow = getNodes;
      oQuery.toString = getSelectors;
      oQuery.valueOf = getNodes;
      return oQuery;
    });
  })();

  return domQuery;
});
