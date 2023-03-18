"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkmy_webpack_project"] = self["webpackChunkmy_webpack_project"] || []).push([["src_components_chatWelcomeMsg_js"],{

/***/ "./src/components/chatWelcomeMsg.js":
/*!******************************************!*\
  !*** ./src/components/chatWelcomeMsg.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ ChatWelcomeMsg)\n/* harmony export */ });\nfunction _typeof(obj) { \"@babel/helpers - typeof\"; return _typeof = \"function\" == typeof Symbol && \"symbol\" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && \"function\" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }, _typeof(obj); }\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, \"prototype\", { writable: false }); return Constructor; }\nfunction _toPropertyKey(arg) { var key = _toPrimitive(arg, \"string\"); return _typeof(key) === \"symbol\" ? key : String(key); }\nfunction _toPrimitive(input, hint) { if (_typeof(input) !== \"object\" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || \"default\"); if (_typeof(res) !== \"object\") return res; throw new TypeError(\"@@toPrimitive must return a primitive value.\"); } return (hint === \"string\" ? String : Number)(input); }\nvar ChatWelcomeMsg = /*#__PURE__*/function () {\n  function ChatWelcomeMsg() {\n    _classCallCheck(this, ChatWelcomeMsg);\n  }\n  _createClass(ChatWelcomeMsg, [{\n    key: \"init\",\n    value: function init() {\n      this.$message = null;\n      this.$messageWrapper = null;\n    }\n  }, {\n    key: \"createMessage\",\n    value: function createMessage() {\n      this.$messageWrapper = document.createElement('div');\n      this.$message = document.createElement('div');\n      this.$messageWrapper.append(this.$message);\n      return this.$messageWrapper;\n    }\n  }, {\n    key: \"toggleMessageVisibility\",\n    value: function toggleMessageVisibility(show) {\n      this.$messageWrapper.classList[show ? 'remove' : 'add']('qfchat__hidden');\n    }\n  }]);\n  return ChatWelcomeMsg;\n}();\n\n\n//# sourceURL=webpack://my-webpack-project/./src/components/chatWelcomeMsg.js?");

/***/ })

}]);