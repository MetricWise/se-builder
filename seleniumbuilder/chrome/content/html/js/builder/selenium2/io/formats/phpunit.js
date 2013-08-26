builder.selenium2.io.addLangFormatter({
  name: "PHP/PHPUnit",
  extension: ".php",
  not: "! ",
  start:
  "<?php\n"+
  "require_once('selenium/SeleniumTestCase.php');\n" +
  "\n" +
  "class {scriptName} extends SeleniumTestCase\n" +
  "{\n"+
  "    public function test() {\n",
  end:
  "    }\n" +
  "\n" +
  "    public function tearDown() {\n" +
    "        $this->closeWindow();\n" +
  "    }\n" +
  "}\n",
  lineForType: {
    "get":
      "        $this->url({url});\n",
    "goBack":
      "        $this->back();\n",
    "goForward":
      "        $this->forward();\n",
    "refresh":
      "        $this->refresh();\n",
    "clickElement":
      "        $this->{locatorBy}({locator})->click();\n",
    "setElementText":
      "        $this->{locatorBy}({locator})->value({text});\n",
    "sendKeysToElement":
      "        $this->sendKeys($this->{locatorBy}({locator}), {text});\n",
    "setElementSelected":
      "        $this->select($this->{locatorBy}({locator}));\n",
    "setElementNotSelected":
      "        $this->select(NULL);\n",
    "submitElement":
      "        $this->{locatorBy}({locator})->submit();\n",
    "close":
      "        $this->close();",
    "switchToFrame":
      "        $this->frame({identifier});\n",
    "switchToFrameByIndex":
      "        $this->frame({index});\n",
    "switchToWindow":
      "        $this->window({name});\n",
    "switchToDefaultContent":
      "        $this->frame(NULL);\n",
    "answerAlert":
      "        $this->alertText({text});\n" +
      "        $this->acceptAlert();\n",
    "acceptAlert":
      "        $this->acceptAlert();\n",
    "dismissAlert":
      "        $this->dismissAlert();\n",
    "print":
      "        echo {text};\n",
    "store":
      "        $this->{variable} = {text};\n"
  },
  locatorByForType: function(stepType, locatorType, locatorIndex) {
    return {
        "class": "byClassName",
        "id": "byId",
        "link text": "byLinkText",
        "xpath": "byXPath",
        "css selector": "byCssSelector",
        "name": "byName"}[locatorType];
  },
  assert: function(step, escapeValue, doSubs, getter) {
    if (step.negated) {
      return doSubs(
        "if ({getter} == {cmp}) {\n" +
        "    $this->close();\n" +
        "    throw new Exception(\"!{stepTypeName} failed\");\n" +
        "}\n", getter);
    } else {
      return doSubs(
        "if ({getter} != {cmp}) {\n" +
        "    $this->close();\n" +
        "    throw new Exception(\"!{stepTypeName} failed\");\n" +
        "}\n", getter);
    }
  },
  verify: function(step, escapeValue, doSubs, getter) {
    if (step.negated) {
      return doSubs(
        "if ({getter} == {cmp}) {\n" +
        "    echo \"!{stepTypeName} failed\";\n" +
        "}\n", getter);
    } else {
      return doSubs(
        "if ({getter} != {cmp}) {\n" +
        "    echo \"{stepTypeName} failed\";\n" +
        "}\n", getter);
    }
  },
  waitFor: "",
  store:
    "${{variable}} = {getter};\n",
  boolean_assert:
    "if ({posNot}{getter}) {\n" +
    "    $this->close();\n" +
    "    throw new Exception(\"{negNot}{stepTypeName} failed\");\n" +
    "}\n",
  boolean_verify:
    "if ({posNot}{getter}) {\n" +
    "    echo \"{negNot}{stepTypeName} failed\";\n" +
    "}\n",
  boolean_waitFor: "",
  boolean_store:
    "${{variable}} = {getter};\n",
  boolean_getters: {
    "TextPresent": {
      getter: "(strpos($this->element(\"tag name\", \"html\")->text(), {text}) !== false)",
      vartype: ""
    },
    "ElementPresent": {
      getter: "(strlen($this->{locatorBy}({locator})) != 0)",
      vartype: ""
    },
    "ElementSelected": {
      getter: "($this->{locatorBy}({locator})->selected())",
      vartype: ""
    },
    "CookiePresent": {
      getter: "($this->getAllCookie({name}))",
      vartype: ""
    },
    "AlertPresent": {
      getter: "alert_present($this)",
      vartype: ""
    }
  },
  getters: {
    "BodyText": {
      getter: "$this->element(\"tag name\", \"html\")->text()",
      cmp: "{text}",
      vartype: ""
    },
    "PageSource": {
      getter: "$this->source()",
      cmp: "{source}",
      vartype: ""
    },
    "Text": {
      getter: "$this->{locatorBy}({locator})->text()",
      cmp: "{text}",
      vartype: ""
    },
    "CurrentUrl": {
      getter: "$this->url()",
      cmp: "{url}",
      vartype: ""
    },
    "Title": {
      getter: "$this->title()",
      cmp: "{title}",
      vartype: ""
    },
    "ElementValue": {
      getter: "$this->{locatorBy}({locator})->attribute(\"value\")",
      cmp: "{value}",
      vartype: ""
    },
    "ElementAttribute": {
      getter: "$this->{locatorBy}({locator})->attribute({attributeName})",
      cmp: "{value}",
      vartype: "String"
    },
    "CookieByName": {
      getter: "get_cookie($this->getAllCookies(), {name})",
      cmp: "{value}",
      vartype: ""
    },
    "AlertText": {
      getter: "$this->alertText()",
      cmp: "{text}",
      vartype: ""
    },
    "Eval": {
      getter: "$this->execute({script})",
      cmp: "{value}",
      vartype: ""
    }
  },
  /**
   * Processes a parameter value into an appropriately escaped expression. Mentions of variables
   * with the ${foo} syntax are transformed into expressions that concatenate the variables and
   * literals.  
   * For example:
   * a${b}c
   * becomes:
   * "a" . b . "c"
   * 
   */
  escapeValue: function(stepType, value, pName) {
    if (stepType.name.startsWith("store") && pName == "variable") { return value; }
    if (stepType.name == "switchToFrameByIndex" && pName == "index") { return value; }
    // This function takes a string literal and escapes it and wraps it in quotes.
    function esc(v) { return "\"" + v.replace(/\\/g, "\\\\").replace(/"/g, "\\\"") + "\""; }

    // The following is a transducer that produces the escaped expression by going over each
    // character of the input.
    var output = "";       // Escaped expression.
    var lastChunk = "";    // Accumulates letters of the current literal.
    var hasDollar = false; // Whether we've just encountered a $ character.
    var insideVar = false; // Whether we are reading in the name of a variable.
    var varName = "";      // Accumulates letters of the current variable.
    for (var i = 0; i < value.length; i++) {
      var ch = value.substring(i, i + 1);
      if (insideVar) {
        if (ch == "}") {
          // We've finished reading in the name of a variable.
          // If this isn't the start of the expression, use + to concatenate it.
          if (output.length > 0) { output += " . "; }
          output += "$this->" + varName;
          insideVar = false;
          hasDollar = false;
          varName = "";
        } else {
          // This letter is part of the name of the variable we're reading in.
          varName += ch;
        }
      } else {
        // We're not currently reading in the name of a variable.
        if (hasDollar) {
          // But we *have* just encountered a $, so if this character is a {, we are about to
          // do a variable.
          if (ch == "{") {
            insideVar = true;
            if (lastChunk.length > 0) {
              // Add the literal we've read in to the text.
              if (output.length > 0) { output += " . "; }
              output += esc(lastChunk);
            }
            lastChunk = "";
          } else {
            // No, it was just a lone $.
            hasDollar = false;
            lastChunk += "$" + ch;
          }
        } else {
          // This is the "normal case" - accumulating the letters of a literal. Unless the letter
          // is a $, in which case this may be the start of a...
          if (ch == "$") { hasDollar = true; } else { lastChunk += ch; }
        }
      }
    }
    // Append the final literal, if any, to the output.
    if (lastChunk.length > 0) {
      if (output.length > 0) { output += " . "; }
      output += esc(lastChunk);
    }
    return output;
  },
  usedVar: function(varName) { return "$" + varName; },
  unusedVar: function(varName) { return "$" + varName; }
});