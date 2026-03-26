/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./concat.js":
/*!*******************!*\
  !*** ./concat.js ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   javascript: () => (/* reexport safe */ _src_javascript_index_d_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])\n/* harmony export */ });\n/* harmony import */ var _src_javascript_index_d_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/javascript/index.d.js */ \"./src/javascript/index.d.js\");\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb25jYXQuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBb0QiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yaWRnZS1jb2RlbWlycm9yLy4vY29uY2F0LmpzPzExY2MiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGphdmFzY3JpcHQgZnJvbSAnLi9zcmMvamF2YXNjcmlwdC9pbmRleC5kLmpzJ1xuZXhwb3J0IHsgamF2YXNjcmlwdCB9Il0sIm5hbWVzIjpbImphdmFzY3JpcHQiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./concat.js\n");

/***/ }),

/***/ "./src/init.js":
/*!*********************!*\
  !*** ./src/init.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nconst getTheme = async name => {\n  const allThemes = await Promise.all(/*! import() */[__webpack_require__.e(\"vendors-node_modules_codemirror_view_dist_index_js\"), __webpack_require__.e(\"vendors-node_modules_codemirror_language_dist_index_js\"), __webpack_require__.e(\"vendors-node_modules_thememirror_dist_index_js\")]).then(__webpack_require__.bind(__webpack_require__, /*! thememirror */ \"../../node_modules/thememirror/dist/index.js\"));\n  if (allThemes[name]) {\n    return allThemes[name];\n  } else {\n    return null;\n  }\n};\nconst config = {\n  // eslint configuration\n  languageOptions: {\n    parserOptions: {\n      ecmaVersion: 2022,\n      sourceType: 'module'\n    }\n  },\n  rules: {\n    semi: ['error', 'never']\n  }\n};\nconst initEditor = async (div, type, theme, text) => {\n  if (div.editorComposite) {\n    div.editorComposite.destroy();\n  }\n  const {\n    EditorView,\n    basicSetup\n  } = await Promise.all(/*! import() */[__webpack_require__.e(\"vendors-node_modules_codemirror_view_dist_index_js\"), __webpack_require__.e(\"vendors-node_modules_codemirror_language_dist_index_js\"), __webpack_require__.e(\"vendors-node_modules_codemirror_autocomplete_dist_index_js\"), __webpack_require__.e(\"vendors-node_modules_codemirror_commands_dist_index_js\"), __webpack_require__.e(\"vendors-node_modules_codemirror_lint_dist_index_js\"), __webpack_require__.e(\"vendors-node_modules_codemirror_dist_index_js\")]).then(__webpack_require__.bind(__webpack_require__, /*! codemirror */ \"../../node_modules/codemirror/dist/index.js\"));\n  const {\n    tooltips,\n    keymap\n  } = await __webpack_require__.e(/*! import() */ \"vendors-node_modules_codemirror_view_dist_index_js\").then(__webpack_require__.bind(__webpack_require__, /*! @codemirror/view */ \"../../node_modules/@codemirror/view/dist/index.js\"));\n  const {\n    indentWithTab\n  } = await Promise.all(/*! import() */[__webpack_require__.e(\"vendors-node_modules_codemirror_view_dist_index_js\"), __webpack_require__.e(\"vendors-node_modules_codemirror_language_dist_index_js\"), __webpack_require__.e(\"vendors-node_modules_codemirror_commands_dist_index_js\")]).then(__webpack_require__.bind(__webpack_require__, /*! @codemirror/commands */ \"../../node_modules/@codemirror/commands/dist/index.js\"));\n  const extensions = [basicSetup, keymap.of([indentWithTab]), tooltips({\n    position: 'absolute'\n  })];\n  if (type === 'css') {\n    const {\n      css\n    } = await Promise.all(/*! import() */[__webpack_require__.e(\"vendors-node_modules_codemirror_view_dist_index_js\"), __webpack_require__.e(\"vendors-node_modules_codemirror_language_dist_index_js\"), __webpack_require__.e(\"vendors-node_modules_lezer_lr_dist_index_js\"), __webpack_require__.e(\"vendors-node_modules_codemirror_lang-css_dist_index_js\")]).then(__webpack_require__.bind(__webpack_require__, /*! @codemirror/lang-css */ \"../../node_modules/@codemirror/lang-css/dist/index.js\"));\n    extensions.push(css());\n  }\n  if (type === 'javascript') {\n    const {\n      Linter\n    } = await __webpack_require__.e(/*! import() | codemirror-linter */ \"codemirror-linter\").then(__webpack_require__.bind(__webpack_require__, /*! eslint-linter-browserify */ \"../../node_modules/eslint-linter-browserify/linter.mjs\"));\n    const {\n      javascript,\n      esLint\n    } = await Promise.all(/*! import() */[__webpack_require__.e(\"vendors-node_modules_codemirror_view_dist_index_js\"), __webpack_require__.e(\"vendors-node_modules_codemirror_language_dist_index_js\"), __webpack_require__.e(\"vendors-node_modules_lezer_lr_dist_index_js\"), __webpack_require__.e(\"vendors-node_modules_codemirror_autocomplete_dist_index_js\"), __webpack_require__.e(\"vendors-node_modules_codemirror_lang-javascript_dist_index_js\")]).then(__webpack_require__.bind(__webpack_require__, /*! @codemirror/lang-javascript */ \"../../node_modules/@codemirror/lang-javascript/dist/index.js\"));\n    const {\n      linter,\n      lintGutter\n    } = await Promise.all(/*! import() */[__webpack_require__.e(\"vendors-node_modules_codemirror_view_dist_index_js\"), __webpack_require__.e(\"vendors-node_modules_codemirror_lint_dist_index_js\")]).then(__webpack_require__.bind(__webpack_require__, /*! @codemirror/lint */ \"../../node_modules/@codemirror/lint/dist/index.js\"));\n    extensions.push(javascript());\n    extensions.push(lintGutter());\n    extensions.push(linter(esLint(new Linter(), config)));\n  }\n  if (type === 'json') {\n    const {\n      json\n    } = await Promise.all(/*! import() */[__webpack_require__.e(\"vendors-node_modules_codemirror_view_dist_index_js\"), __webpack_require__.e(\"vendors-node_modules_codemirror_language_dist_index_js\"), __webpack_require__.e(\"vendors-node_modules_lezer_lr_dist_index_js\"), __webpack_require__.e(\"node_modules_codemirror_lang-json_dist_index_js\")]).then(__webpack_require__.bind(__webpack_require__, /*! @codemirror/lang-json */ \"../../node_modules/@codemirror/lang-json/dist/index.js\"));\n    extensions.push(json());\n  }\n  const themeExt = await getTheme(theme);\n  if (themeExt) {\n    extensions.push(themeExt);\n  }\n  div.editorComposite = new EditorView({\n    doc: text,\n    extensions,\n    parent: div\n  });\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (initEditor);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvaW5pdC5qcyIsIm1hcHBpbmdzIjoiOzs7O0FBQUEsTUFBTUEsUUFBUSxHQUFHLE1BQU1DLElBQUksSUFBSTtFQUM3QixNQUFNQyxTQUFTLEdBQUcsTUFBTSwwWEFBcUI7RUFFN0MsSUFBSUEsU0FBUyxDQUFDRCxJQUFJLENBQUMsRUFBRTtJQUNuQixPQUFPQyxTQUFTLENBQUNELElBQUksQ0FBQztFQUN4QixDQUFDLE1BQU07SUFDTCxPQUFPLElBQUk7RUFDYjtBQUNGLENBQUM7QUFFRCxNQUFNRSxNQUFNLEdBQUc7RUFDYjtFQUNBQyxlQUFlLEVBQUU7SUFDZkMsYUFBYSxFQUFFO01BQ2JDLFdBQVcsRUFBRSxJQUFJO01BQ2pCQyxVQUFVLEVBQUU7SUFDZDtFQUNGLENBQUM7RUFDREMsS0FBSyxFQUFFO0lBQ0xDLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxPQUFPO0VBQ3pCO0FBQ0YsQ0FBQztBQUNELE1BQU1DLFVBQVUsR0FBRyxNQUFBQSxDQUFPQyxHQUFHLEVBQUVDLElBQUksRUFBRUMsS0FBSyxFQUFFQyxJQUFJLEtBQUs7RUFDbkQsSUFBSUgsR0FBRyxDQUFDSSxlQUFlLEVBQUU7SUFDdkJKLEdBQUcsQ0FBQ0ksZUFBZSxDQUFDQyxPQUFPLENBQUMsQ0FBQztFQUMvQjtFQUVBLE1BQU07SUFBRUMsVUFBVTtJQUFFQztFQUFXLENBQUMsR0FBRyxNQUFNLDBtQkFBb0I7RUFDN0QsTUFBTTtJQUFFQyxRQUFRO0lBQUVDO0VBQU8sQ0FBQyxHQUFHLE1BQU0sNE5BQTBCO0VBQzdELE1BQU07SUFBRUM7RUFBYyxDQUFDLEdBQUcsTUFBTSxvWkFBOEI7RUFFOUQsTUFBTUMsVUFBVSxHQUFHLENBQUNKLFVBQVUsRUFBRUUsTUFBTSxDQUFDRyxFQUFFLENBQUMsQ0FBQ0YsYUFBYSxDQUFDLENBQUMsRUFBRUYsUUFBUSxDQUFDO0lBQ25FSyxRQUFRLEVBQUU7RUFDWixDQUFDLENBQUMsQ0FBQztFQUVILElBQUlaLElBQUksS0FBSyxLQUFLLEVBQUU7SUFDbEIsTUFBTTtNQUFFYTtJQUFJLENBQUMsR0FBRyxNQUFNLDBkQUE4QjtJQUNwREgsVUFBVSxDQUFDSSxJQUFJLENBQUNELEdBQUcsQ0FBQyxDQUFDLENBQUM7RUFDeEI7RUFDQSxJQUFJYixJQUFJLEtBQUssWUFBWSxFQUFFO0lBQ3pCLE1BQU07TUFBRWU7SUFBTyxDQUFDLEdBQUcsTUFBTSw0TkFBOEU7SUFDdkcsTUFBTTtNQUFFQyxVQUFVO01BQUVDO0lBQU8sQ0FBQyxHQUFHLE1BQU0sb2tCQUFxQztJQUMxRSxNQUFNO01BQUVDLE1BQU07TUFBRUM7SUFBVyxDQUFDLEdBQUcsTUFBTSx1VEFBMEI7SUFDL0RULFVBQVUsQ0FBQ0ksSUFBSSxDQUFDRSxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQzdCTixVQUFVLENBQUNJLElBQUksQ0FBQ0ssVUFBVSxDQUFDLENBQUMsQ0FBQztJQUM3QlQsVUFBVSxDQUFDSSxJQUFJLENBQUNJLE1BQU0sQ0FBQ0QsTUFBTSxDQUFDLElBQUlGLE1BQU0sQ0FBQyxDQUFDLEVBQUV4QixNQUFNLENBQUMsQ0FBQyxDQUFDO0VBQ3ZEO0VBQ0EsSUFBSVMsSUFBSSxLQUFLLE1BQU0sRUFBRTtJQUNuQixNQUFNO01BQUVvQjtJQUFLLENBQUMsR0FBRyxNQUFNLHFkQUErQjtJQUN0RFYsVUFBVSxDQUFDSSxJQUFJLENBQUNNLElBQUksQ0FBQyxDQUFDLENBQUM7RUFDekI7RUFFQSxNQUFNQyxRQUFRLEdBQUcsTUFBTWpDLFFBQVEsQ0FBQ2EsS0FBSyxDQUFDO0VBQ3RDLElBQUlvQixRQUFRLEVBQUU7SUFDWlgsVUFBVSxDQUFDSSxJQUFJLENBQUNPLFFBQVEsQ0FBQztFQUMzQjtFQUNBdEIsR0FBRyxDQUFDSSxlQUFlLEdBQUcsSUFBSUUsVUFBVSxDQUFDO0lBQ25DaUIsR0FBRyxFQUFFcEIsSUFBSTtJQUNUUSxVQUFVO0lBQ1ZhLE1BQU0sRUFBRXhCO0VBQ1YsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUVELGlFQUFlRCxVQUFVIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcmlkZ2UtY29kZW1pcnJvci8uL3NyYy9pbml0LmpzP2Q5OWUiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZ2V0VGhlbWUgPSBhc3luYyBuYW1lID0+IHtcclxuICBjb25zdCBhbGxUaGVtZXMgPSBhd2FpdCBpbXBvcnQoJ3RoZW1lbWlycm9yJylcclxuXHJcbiAgaWYgKGFsbFRoZW1lc1tuYW1lXSkge1xyXG4gICAgcmV0dXJuIGFsbFRoZW1lc1tuYW1lXVxyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gbnVsbFxyXG4gIH1cclxufVxyXG5cclxuY29uc3QgY29uZmlnID0ge1xyXG4gIC8vIGVzbGludCBjb25maWd1cmF0aW9uXHJcbiAgbGFuZ3VhZ2VPcHRpb25zOiB7XHJcbiAgICBwYXJzZXJPcHRpb25zOiB7XHJcbiAgICAgIGVjbWFWZXJzaW9uOiAyMDIyLFxyXG4gICAgICBzb3VyY2VUeXBlOiAnbW9kdWxlJ1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgcnVsZXM6IHtcclxuICAgIHNlbWk6IFsnZXJyb3InLCAnbmV2ZXInXVxyXG4gIH1cclxufVxyXG5jb25zdCBpbml0RWRpdG9yID0gYXN5bmMgKGRpdiwgdHlwZSwgdGhlbWUsIHRleHQpID0+IHtcclxuICBpZiAoZGl2LmVkaXRvckNvbXBvc2l0ZSkge1xyXG4gICAgZGl2LmVkaXRvckNvbXBvc2l0ZS5kZXN0cm95KClcclxuICB9XHJcblxyXG4gIGNvbnN0IHsgRWRpdG9yVmlldywgYmFzaWNTZXR1cCB9ID0gYXdhaXQgaW1wb3J0KCdjb2RlbWlycm9yJylcclxuICBjb25zdCB7IHRvb2x0aXBzLCBrZXltYXAgfSA9IGF3YWl0IGltcG9ydCgnQGNvZGVtaXJyb3IvdmlldycpXHJcbiAgY29uc3QgeyBpbmRlbnRXaXRoVGFiIH0gPSBhd2FpdCBpbXBvcnQoJ0Bjb2RlbWlycm9yL2NvbW1hbmRzJylcclxuXHJcbiAgY29uc3QgZXh0ZW5zaW9ucyA9IFtiYXNpY1NldHVwLCBrZXltYXAub2YoW2luZGVudFdpdGhUYWJdKSwgdG9vbHRpcHMoe1xyXG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZSdcclxuICB9KV1cclxuXHJcbiAgaWYgKHR5cGUgPT09ICdjc3MnKSB7XHJcbiAgICBjb25zdCB7IGNzcyB9ID0gYXdhaXQgaW1wb3J0KCdAY29kZW1pcnJvci9sYW5nLWNzcycpXHJcbiAgICBleHRlbnNpb25zLnB1c2goY3NzKCkpXHJcbiAgfVxyXG4gIGlmICh0eXBlID09PSAnamF2YXNjcmlwdCcpIHtcclxuICAgIGNvbnN0IHsgTGludGVyIH0gPSBhd2FpdCBpbXBvcnQoLyogd2VicGFja0NodW5rTmFtZTogXCJjb2RlbWlycm9yLWxpbnRlclwiICovICdlc2xpbnQtbGludGVyLWJyb3dzZXJpZnknKVxyXG4gICAgY29uc3QgeyBqYXZhc2NyaXB0LCBlc0xpbnQgfSA9IGF3YWl0IGltcG9ydCgnQGNvZGVtaXJyb3IvbGFuZy1qYXZhc2NyaXB0JylcclxuICAgIGNvbnN0IHsgbGludGVyLCBsaW50R3V0dGVyIH0gPSBhd2FpdCBpbXBvcnQoJ0Bjb2RlbWlycm9yL2xpbnQnKVxyXG4gICAgZXh0ZW5zaW9ucy5wdXNoKGphdmFzY3JpcHQoKSlcclxuICAgIGV4dGVuc2lvbnMucHVzaChsaW50R3V0dGVyKCkpXHJcbiAgICBleHRlbnNpb25zLnB1c2gobGludGVyKGVzTGludChuZXcgTGludGVyKCksIGNvbmZpZykpKVxyXG4gIH1cclxuICBpZiAodHlwZSA9PT0gJ2pzb24nKSB7XHJcbiAgICBjb25zdCB7IGpzb24gfSA9IGF3YWl0IGltcG9ydCgnQGNvZGVtaXJyb3IvbGFuZy1qc29uJylcclxuICAgIGV4dGVuc2lvbnMucHVzaChqc29uKCkpXHJcbiAgfVxyXG5cclxuICBjb25zdCB0aGVtZUV4dCA9IGF3YWl0IGdldFRoZW1lKHRoZW1lKVxyXG4gIGlmICh0aGVtZUV4dCkge1xyXG4gICAgZXh0ZW5zaW9ucy5wdXNoKHRoZW1lRXh0KVxyXG4gIH1cclxuICBkaXYuZWRpdG9yQ29tcG9zaXRlID0gbmV3IEVkaXRvclZpZXcoe1xyXG4gICAgZG9jOiB0ZXh0LFxyXG4gICAgZXh0ZW5zaW9ucyxcclxuICAgIHBhcmVudDogZGl2XHJcbiAgfSlcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgaW5pdEVkaXRvclxyXG4iXSwibmFtZXMiOlsiZ2V0VGhlbWUiLCJuYW1lIiwiYWxsVGhlbWVzIiwiY29uZmlnIiwibGFuZ3VhZ2VPcHRpb25zIiwicGFyc2VyT3B0aW9ucyIsImVjbWFWZXJzaW9uIiwic291cmNlVHlwZSIsInJ1bGVzIiwic2VtaSIsImluaXRFZGl0b3IiLCJkaXYiLCJ0eXBlIiwidGhlbWUiLCJ0ZXh0IiwiZWRpdG9yQ29tcG9zaXRlIiwiZGVzdHJveSIsIkVkaXRvclZpZXciLCJiYXNpY1NldHVwIiwidG9vbHRpcHMiLCJrZXltYXAiLCJpbmRlbnRXaXRoVGFiIiwiZXh0ZW5zaW9ucyIsIm9mIiwicG9zaXRpb24iLCJjc3MiLCJwdXNoIiwiTGludGVyIiwiamF2YXNjcmlwdCIsImVzTGludCIsImxpbnRlciIsImxpbnRHdXR0ZXIiLCJqc29uIiwidGhlbWVFeHQiLCJkb2MiLCJwYXJlbnQiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/init.js\n");

/***/ }),

/***/ "./src/javascript/JSEditor.js":
/*!************************************!*\
  !*** ./src/javascript/JSEditor.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _init__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../init */ \"./src/init.js\");\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (/*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(({\n  text = '',\n  type = 'javascript',\n  theme = 'default',\n  onChange\n}, ref) => {\n  const el = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createRef(null);\n\n  // 使用useImperativeHandle来定义暴露给父组件的方法\n  (0,react__WEBPACK_IMPORTED_MODULE_0__.useImperativeHandle)(ref, () => ({\n    getCode: () => {\n      if (el.current.editorComposite) {\n        return el.current.editorComposite.state.doc.toString();\n      }\n    },\n    isValid: () => {}\n  }));\n  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {\n    (0,_init__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(el.current, type, theme, text);\n  });\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", {\n    ref: el,\n    style: {\n      width: '100%',\n      height: '100%'\n    }\n  });\n}));//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvamF2YXNjcmlwdC9KU0VkaXRvci5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQXlFO0FBQ3pDO0FBQ2hDLDhFQUFlRSxpREFBVSxDQUFDLENBQUM7RUFDekJHLElBQUksR0FBRyxFQUFFO0VBQ1RDLElBQUksR0FBRyxZQUFZO0VBQ25CQyxLQUFLLEdBQUcsU0FBUztFQUNqQkM7QUFDRixDQUFDLEVBQUVDLEdBQUcsS0FBSztFQUNULE1BQU1DLEVBQUUsZ0JBQUdWLHNEQUFlLENBQUMsSUFBSSxDQUFDOztFQUVoQztFQUNBRywwREFBbUIsQ0FBQ00sR0FBRyxFQUFFLE9BQU87SUFDOUJHLE9BQU8sRUFBRUEsQ0FBQSxLQUFNO01BQ2IsSUFBSUYsRUFBRSxDQUFDRyxPQUFPLENBQUNDLGVBQWUsRUFBRTtRQUM5QixPQUFPSixFQUFFLENBQUNHLE9BQU8sQ0FBQ0MsZUFBZSxDQUFDQyxLQUFLLENBQUNDLEdBQUcsQ0FBQ0MsUUFBUSxDQUFDLENBQUM7TUFDeEQ7SUFDRixDQUFDO0lBQ0RDLE9BQU8sRUFBRUEsQ0FBQSxLQUFNLENBRWY7RUFDRixDQUFDLENBQUMsQ0FBQztFQUVIakIsZ0RBQVMsQ0FBQyxNQUFNO0lBQ2RHLGlEQUFVLENBQUNNLEVBQUUsQ0FBQ0csT0FBTyxFQUFFUCxJQUFJLEVBQUVDLEtBQUssRUFBRUYsSUFBSSxDQUFDO0VBQzNDLENBQUMsQ0FBQztFQUNGLG9CQUNFTCwwREFBQTtJQUNFUyxHQUFHLEVBQUVDLEVBQUc7SUFBQ1UsS0FBSyxFQUFFO01BQ2RDLEtBQUssRUFBRSxNQUFNO01BQ2JDLE1BQU0sRUFBRTtJQUNWO0VBQUUsQ0FDSCxDQUFDO0FBRU4sQ0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcmlkZ2UtY29kZW1pcnJvci8uL3NyYy9qYXZhc2NyaXB0L0pTRWRpdG9yLmpzP2RkZTciXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgZm9yd2FyZFJlZiwgdXNlSW1wZXJhdGl2ZUhhbmRsZSB9IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgaW5pdEVkaXRvciBmcm9tICcuLi9pbml0J1xyXG5leHBvcnQgZGVmYXVsdCBmb3J3YXJkUmVmKCh7XHJcbiAgdGV4dCA9ICcnLFxyXG4gIHR5cGUgPSAnamF2YXNjcmlwdCcsXHJcbiAgdGhlbWUgPSAnZGVmYXVsdCcsXHJcbiAgb25DaGFuZ2VcclxufSwgcmVmKSA9PiB7XHJcbiAgY29uc3QgZWwgPSBSZWFjdC5jcmVhdGVSZWYobnVsbClcclxuXHJcbiAgLy8g5L2/55SodXNlSW1wZXJhdGl2ZUhhbmRsZeadpeWumuS5ieaatOmcsue7meeItue7hOS7tueahOaWueazlVxyXG4gIHVzZUltcGVyYXRpdmVIYW5kbGUocmVmLCAoKSA9PiAoe1xyXG4gICAgZ2V0Q29kZTogKCkgPT4ge1xyXG4gICAgICBpZiAoZWwuY3VycmVudC5lZGl0b3JDb21wb3NpdGUpIHtcclxuICAgICAgICByZXR1cm4gZWwuY3VycmVudC5lZGl0b3JDb21wb3NpdGUuc3RhdGUuZG9jLnRvU3RyaW5nKClcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGlzVmFsaWQ6ICgpID0+IHtcclxuXHJcbiAgICB9XHJcbiAgfSkpXHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpbml0RWRpdG9yKGVsLmN1cnJlbnQsIHR5cGUsIHRoZW1lLCB0ZXh0KVxyXG4gIH0pXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgcmVmPXtlbH0gc3R5bGU9e3tcclxuICAgICAgICB3aWR0aDogJzEwMCUnLFxyXG4gICAgICAgIGhlaWdodDogJzEwMCUnXHJcbiAgICAgIH19XHJcbiAgICAvPlxyXG4gIClcclxufSlcclxuIl0sIm5hbWVzIjpbIlJlYWN0IiwidXNlRWZmZWN0IiwiZm9yd2FyZFJlZiIsInVzZUltcGVyYXRpdmVIYW5kbGUiLCJpbml0RWRpdG9yIiwidGV4dCIsInR5cGUiLCJ0aGVtZSIsIm9uQ2hhbmdlIiwicmVmIiwiZWwiLCJjcmVhdGVSZWYiLCJnZXRDb2RlIiwiY3VycmVudCIsImVkaXRvckNvbXBvc2l0ZSIsInN0YXRlIiwiZG9jIiwidG9TdHJpbmciLCJpc1ZhbGlkIiwiY3JlYXRlRWxlbWVudCIsInN0eWxlIiwid2lkdGgiLCJoZWlnaHQiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/javascript/JSEditor.js\n");

/***/ }),

/***/ "./src/javascript/index.d.js":
/*!***********************************!*\
  !*** ./src/javascript/index.d.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var ridge_build_src_props__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ridge-build/src/props */ \"../../core/tools/src/props.js\");\n/* harmony import */ var _JSEditor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./JSEditor */ \"./src/javascript/JSEditor.js\");\n/* harmony import */ var _props__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../props */ \"./src/props.js\");\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n  name: 'javascript',\n  component: _JSEditor__WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  title: 'JS',\n  type: 'react',\n  icon: 'icons/javascript.svg',\n  props: [(0,ridge_build_src_props__WEBPACK_IMPORTED_MODULE_0__.radiogroup)('type', '类型', [{\n    label: 'js',\n    value: 'javascript'\n  }, {\n    label: 'css',\n    value: 'css'\n  }, {\n    label: 'json',\n    value: 'json'\n  }, {\n    label: 'md',\n    value: 'markdown'\n  }]), (0,ridge_build_src_props__WEBPACK_IMPORTED_MODULE_0__.string)('text', '代码内容', 'const name=\"Ridge\"', true), _props__WEBPACK_IMPORTED_MODULE_2__.theme],\n  width: 600,\n  height: 400\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvamF2YXNjcmlwdC9pbmRleC5kLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBa0U7QUFDakM7QUFDRDtBQUVoQyxpRUFBZTtFQUNiSyxJQUFJLEVBQUUsWUFBWTtFQUNsQkMsU0FBUyxFQUFFSCxpREFBUTtFQUNuQkksS0FBSyxFQUFFLElBQUk7RUFDWEMsSUFBSSxFQUFFLE9BQU87RUFDYkMsSUFBSSxFQUFFLHNCQUFzQjtFQUM1QkMsS0FBSyxFQUFFLENBQ0xWLGlFQUFVLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDO0lBQ3hCVyxLQUFLLEVBQUUsSUFBSTtJQUNYQyxLQUFLLEVBQUU7RUFDVCxDQUFDLEVBQUU7SUFDREQsS0FBSyxFQUFFLEtBQUs7SUFDWkMsS0FBSyxFQUFFO0VBQ1QsQ0FBQyxFQUFFO0lBQ0RELEtBQUssRUFBRSxNQUFNO0lBQ2JDLEtBQUssRUFBRTtFQUNULENBQUMsRUFBRTtJQUNERCxLQUFLLEVBQUUsSUFBSTtJQUNYQyxLQUFLLEVBQUU7RUFDVCxDQUFDLENBQUMsQ0FBQyxFQUNIViw2REFBTSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLEVBQ2xERSx5Q0FBSyxDQUNOO0VBQ0RTLEtBQUssRUFBRSxHQUFHO0VBQ1ZDLE1BQU0sRUFBRTtBQUNWLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yaWRnZS1jb2RlbWlycm9yLy4vc3JjL2phdmFzY3JpcHQvaW5kZXguZC5qcz8yN2Q2Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHJhZGlvZ3JvdXAsIHNlbGVjdCwgc3RyaW5nIH0gZnJvbSAncmlkZ2UtYnVpbGQvc3JjL3Byb3BzJ1xyXG5pbXBvcnQgSlNFZGl0b3IgZnJvbSAnLi9KU0VkaXRvcidcclxuaW1wb3J0IHsgdGhlbWUgfSBmcm9tICcuLi9wcm9wcydcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBuYW1lOiAnamF2YXNjcmlwdCcsXHJcbiAgY29tcG9uZW50OiBKU0VkaXRvcixcclxuICB0aXRsZTogJ0pTJyxcclxuICB0eXBlOiAncmVhY3QnLFxyXG4gIGljb246ICdpY29ucy9qYXZhc2NyaXB0LnN2ZycsXHJcbiAgcHJvcHM6IFtcclxuICAgIHJhZGlvZ3JvdXAoJ3R5cGUnLCAn57G75Z6LJywgW3tcclxuICAgICAgbGFiZWw6ICdqcycsXHJcbiAgICAgIHZhbHVlOiAnamF2YXNjcmlwdCdcclxuICAgIH0sIHtcclxuICAgICAgbGFiZWw6ICdjc3MnLFxyXG4gICAgICB2YWx1ZTogJ2NzcydcclxuICAgIH0sIHtcclxuICAgICAgbGFiZWw6ICdqc29uJyxcclxuICAgICAgdmFsdWU6ICdqc29uJ1xyXG4gICAgfSwge1xyXG4gICAgICBsYWJlbDogJ21kJyxcclxuICAgICAgdmFsdWU6ICdtYXJrZG93bidcclxuICAgIH1dKSxcclxuICAgIHN0cmluZygndGV4dCcsICfku6PnoIHlhoXlrrknLCAnY29uc3QgbmFtZT1cIlJpZGdlXCInLCB0cnVlKSxcclxuICAgIHRoZW1lXHJcbiAgXSxcclxuICB3aWR0aDogNjAwLFxyXG4gIGhlaWdodDogNDAwXHJcbn1cclxuIl0sIm5hbWVzIjpbInJhZGlvZ3JvdXAiLCJzZWxlY3QiLCJzdHJpbmciLCJKU0VkaXRvciIsInRoZW1lIiwibmFtZSIsImNvbXBvbmVudCIsInRpdGxlIiwidHlwZSIsImljb24iLCJwcm9wcyIsImxhYmVsIiwidmFsdWUiLCJ3aWR0aCIsImhlaWdodCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/javascript/index.d.js\n");

/***/ }),

/***/ "./src/props.js":
/*!**********************!*\
  !*** ./src/props.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   theme: () => (/* binding */ theme)\n/* harmony export */ });\n/* harmony import */ var ridge_build_src_props__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ridge-build/src/props */ \"../../core/tools/src/props.js\");\n\nconst theme = (0,ridge_build_src_props__WEBPACK_IMPORTED_MODULE_0__.select)('theme', '主题', [{\n  label: '默认',\n  value: 'default'\n}, {\n  label: 'amy',\n  value: 'amy'\n}, {\n  label: 'ayuLight',\n  value: 'ayuLight'\n}, {\n  label: 'barf',\n  value: 'barf'\n}, {\n  label: 'birdsOfParadise',\n  value: 'birdsOfParadise'\n}, {\n  label: 'clouds',\n  value: 'clouds'\n}, {\n  label: 'espresso',\n  value: 'espresso'\n}, {\n  label: 'solarizedLight',\n  value: 'solarizedLight'\n}], 'default');\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcHJvcHMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBOEM7QUFFOUMsTUFBTUMsS0FBSyxHQUFHRCw2REFBTSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQztFQUNuQ0UsS0FBSyxFQUFFLElBQUk7RUFDWEMsS0FBSyxFQUFFO0FBQ1QsQ0FBQyxFQUFFO0VBQ0RELEtBQUssRUFBRSxLQUFLO0VBQ1pDLEtBQUssRUFBRTtBQUNULENBQUMsRUFBRTtFQUNERCxLQUFLLEVBQUUsVUFBVTtFQUNqQkMsS0FBSyxFQUFFO0FBQ1QsQ0FBQyxFQUFFO0VBQ0RELEtBQUssRUFBRSxNQUFNO0VBQ2JDLEtBQUssRUFBRTtBQUNULENBQUMsRUFBRTtFQUNERCxLQUFLLEVBQUUsaUJBQWlCO0VBQ3hCQyxLQUFLLEVBQUU7QUFDVCxDQUFDLEVBQUU7RUFDREQsS0FBSyxFQUFFLFFBQVE7RUFDZkMsS0FBSyxFQUFFO0FBQ1QsQ0FBQyxFQUFFO0VBQ0RELEtBQUssRUFBRSxVQUFVO0VBQ2pCQyxLQUFLLEVBQUU7QUFDVCxDQUFDLEVBQUU7RUFDREQsS0FBSyxFQUFFLGdCQUFnQjtFQUN2QkMsS0FBSyxFQUFFO0FBQ1QsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcmlkZ2UtY29kZW1pcnJvci8uL3NyYy9wcm9wcy5qcz9jZDEwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHNlbGVjdCB9IGZyb20gJ3JpZGdlLWJ1aWxkL3NyYy9wcm9wcydcclxuXHJcbmNvbnN0IHRoZW1lID0gc2VsZWN0KCd0aGVtZScsICfkuLvpopgnLCBbe1xyXG4gIGxhYmVsOiAn6buY6K6kJyxcclxuICB2YWx1ZTogJ2RlZmF1bHQnXHJcbn0sIHtcclxuICBsYWJlbDogJ2FteScsXHJcbiAgdmFsdWU6ICdhbXknXHJcbn0sIHtcclxuICBsYWJlbDogJ2F5dUxpZ2h0JyxcclxuICB2YWx1ZTogJ2F5dUxpZ2h0J1xyXG59LCB7XHJcbiAgbGFiZWw6ICdiYXJmJyxcclxuICB2YWx1ZTogJ2JhcmYnXHJcbn0sIHtcclxuICBsYWJlbDogJ2JpcmRzT2ZQYXJhZGlzZScsXHJcbiAgdmFsdWU6ICdiaXJkc09mUGFyYWRpc2UnXHJcbn0sIHtcclxuICBsYWJlbDogJ2Nsb3VkcycsXHJcbiAgdmFsdWU6ICdjbG91ZHMnXHJcbn0sIHtcclxuICBsYWJlbDogJ2VzcHJlc3NvJyxcclxuICB2YWx1ZTogJ2VzcHJlc3NvJ1xyXG59LCB7XHJcbiAgbGFiZWw6ICdzb2xhcml6ZWRMaWdodCcsXHJcbiAgdmFsdWU6ICdzb2xhcml6ZWRMaWdodCdcclxufV0sICdkZWZhdWx0JylcclxuXHJcbmV4cG9ydCB7XHJcbiAgdGhlbWVcclxufVxyXG4iXSwibmFtZXMiOlsic2VsZWN0IiwidGhlbWUiLCJsYWJlbCIsInZhbHVlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/props.js\n");

/***/ }),

/***/ "../../core/tools/src/props.js":
/*!*************************************!*\
  !*** ../../core/tools/src/props.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   array: () => (/* binding */ array),\n/* harmony export */   boolean: () => (/* binding */ boolean),\n/* harmony export */   children: () => (/* binding */ children),\n/* harmony export */   classList: () => (/* binding */ classList),\n/* harmony export */   color: () => (/* binding */ color),\n/* harmony export */   event: () => (/* binding */ event),\n/* harmony export */   icon: () => (/* binding */ icon),\n/* harmony export */   image: () => (/* binding */ image),\n/* harmony export */   json: () => (/* binding */ json),\n/* harmony export */   number: () => (/* binding */ number),\n/* harmony export */   onChange: () => (/* binding */ onChange),\n/* harmony export */   onClick: () => (/* binding */ onClick),\n/* harmony export */   optionConfig: () => (/* binding */ optionConfig),\n/* harmony export */   radiogroup: () => (/* binding */ radiogroup),\n/* harmony export */   select: () => (/* binding */ select),\n/* harmony export */   slot: () => (/* binding */ slot),\n/* harmony export */   string: () => (/* binding */ string),\n/* harmony export */   value: () => (/* binding */ value)\n/* harmony export */ });\nconst boolean = (name = 'boolean', label = '布尔', defaultValue = true, connect = true) => {\n  return {\n    name,\n    label,\n    type: 'boolean',\n    width: '50%',\n    connect,\n    value: defaultValue\n  };\n};\nconst number = (name = 'number', label = '数字', defaultValue = 0, connect = true) => {\n  return {\n    name,\n    label,\n    type: 'number',\n    width: '50%',\n    connect,\n    value: defaultValue\n  };\n};\nconst icon = (name = 'icon', label = '图标') => {\n  return {\n    name,\n    label,\n    type: 'string',\n    control: 'icon'\n  };\n};\nconst string = (name = 'text', label = '文本', defaultValue = '文本', connect = true) => {\n  return {\n    name,\n    label,\n    type: 'string',\n    value: defaultValue,\n    connect\n  };\n};\nconst value = (type = 'string', label = '取值', value = '') => {\n  return {\n    name: 'value',\n    type,\n    label,\n    connect: true,\n    value\n  };\n};\nconst classList = (name = 'classList', label = '样式') => {\n  return {\n    name,\n    label,\n    type: 'style',\n    connect: true,\n    value: []\n  };\n};\nconst image = (name = 'src', label = '图片') => ({\n  name,\n  type: 'image',\n  label,\n  connect: true,\n  value: ''\n});\nconst mapOptionList = optionList => {\n  if (Array.isArray(optionList)) {\n    return optionList.map(item => {\n      if (typeof item === 'string') {\n        return {\n          label: item,\n          value: item\n        };\n      } else if (typeof item === 'object') {\n        return item;\n      }\n    });\n  }\n};\nconst radiogroup = (name = 'radiogroup', label = '切换', optionList = [{\n  label: '大',\n  value: 'btn-lg'\n}, {\n  label: '正常',\n  value: 'btn-normal'\n}, {\n  label: '小',\n  value: 'btn-sm'\n}], value, connect = true) => {\n  var _optionList$;\n  return {\n    name,\n    label,\n    type: 'string',\n    control: 'radiogroup',\n    optionList: mapOptionList(optionList),\n    connect,\n    value: value == null ? (_optionList$ = optionList[0]) === null || _optionList$ === void 0 ? void 0 : _optionList$.value : value\n  };\n};\nconst select = (name = 'select', label = '选择', optionList = [{\n  label: '大',\n  value: 'btn-lg'\n}, {\n  label: '正常',\n  value: 'btn-normal'\n}], value, connect = true, required = true) => {\n  let list = [];\n  if (Array.isArray(optionList)) {\n    list = optionList.map(item => {\n      if (typeof item === 'string') {\n        return {\n          label: item,\n          value: item\n        };\n      } else {\n        return item;\n      }\n    });\n  }\n  return {\n    name,\n    label,\n    type: 'string',\n    control: 'select',\n    optionList: list,\n    required,\n    connect,\n    value\n  };\n};\nconst slot = (name = 'slot', label = '插槽') => {\n  return {\n    name,\n    label,\n    type: 'slot'\n  };\n};\nconst color = (name = 'color', label = '颜色', value = '') => {\n  return {\n    name,\n    label,\n    type: 'color',\n    value\n  };\n};\nconst onClick = {\n  label: '单击',\n  name: 'onClick'\n};\nconst onChange = {\n  label: '改变',\n  name: 'onChange'\n};\nconst event = (name, label) => {\n  return {\n    label,\n    name\n  };\n};\nconst children = {\n  name: 'children',\n  hidden: true,\n  type: 'children'\n};\nconst optionConfig = (name = 'options', label = '选项列表', value = [{\n  label: '选项1',\n  value: 'value1'\n}, {\n  label: '选项2',\n  value: 'value2'\n}]) => {\n  return {\n    name,\n    label,\n    value,\n    type: 'string',\n    connect: true,\n    control: () => __webpack_require__.e(/*! import() */ \"core_editor_control_OptionConfig_jsx\").then(__webpack_require__.bind(__webpack_require__, /*! ridgejs-editor/control/OptionConfig.jsx */ \"../../core/editor/control/OptionConfig.jsx\"))\n  };\n};\nconst json = (name = 'json', label = '对象', value = {}, connect = false) => {\n  return {\n    name,\n    label,\n    value,\n    connect,\n    type: 'object'\n  };\n};\nconst array = (name = 'array', label = '数组', value = []) => {\n  return {\n    name,\n    label,\n    value,\n    type: 'object'\n  };\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LEVBQUUsVUFBVTtFQUNoQjhCLE1BQU0sRUFBRSxJQUFJO0VBQ1oxQixJQUFJLEVBQUU7QUFDUixDQUFDO0FBRUQsTUFBTTJCLFlBQVksR0FBR0EsQ0FBQy9CLElBQUksR0FBRyxTQUFTLEVBQUVDLEtBQUssR0FBRyxNQUFNLEVBQUVLLEtBQUssR0FBRyxDQUFDO0VBQy9ETCxLQUFLLEVBQUUsS0FBSztFQUNaSyxLQUFLLEVBQUU7QUFDVCxDQUFDLEVBQUU7RUFDREwsS0FBSyxFQUFFLEtBQUs7RUFDWkssS0FBSyxFQUFFO0FBQ1QsQ0FBQyxDQUFDLEtBQUs7RUFDTCxPQUFPO0lBQ0xOLElBQUk7SUFDSkMsS0FBSztJQUNMSyxLQUFLO0lBQ0xGLElBQUksRUFBRSxRQUFRO0lBQ2RELE9BQU8sRUFBRSxJQUFJO0lBQ2JNLE9BQU8sRUFBRUEsQ0FBQSxLQUFNLDhOQUFpRDtFQUNsRSxDQUFDO0FBQ0gsQ0FBQztBQUVELE1BQU11QixJQUFJLEdBQUdBLENBQUNoQyxJQUFJLEdBQUcsTUFBTSxFQUFFQyxLQUFLLEdBQUcsSUFBSSxFQUFFSyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUVILE9BQU8sR0FBRyxLQUFLLEtBQUs7RUFDekUsT0FBTztJQUNMSCxJQUFJO0lBQ0pDLEtBQUs7SUFDTEssS0FBSztJQUNMSCxPQUFPO0lBQ1BDLElBQUksRUFBRTtFQUNSLENBQUM7QUFDSCxDQUFDO0FBRUQsTUFBTTZCLEtBQUssR0FBR0EsQ0FBQ2pDLElBQUksR0FBRyxPQUFPLEVBQUVDLEtBQUssR0FBRyxJQUFJLEVBQUVLLEtBQUssR0FBRyxFQUFFLEtBQUs7RUFDMUQsT0FBTztJQUNMTixJQUFJO0lBQ0pDLEtBQUs7SUFDTEssS0FBSztJQUNMRixJQUFJLEVBQUU7RUFDUixDQUFDO0FBQ0gsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3JpZGdlLWNvZGVtaXJyb3IvLi4vLi4vY29yZS90b29scy9zcmMvcHJvcHMuanM/MTEzMiJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBib29sZWFuID0gKG5hbWUgPSAnYm9vbGVhbicsIGxhYmVsID0gJ+W4g+WwlCcsIGRlZmF1bHRWYWx1ZSA9IHRydWUsIGNvbm5lY3QgPSB0cnVlKSA9PiB7XHJcbiAgcmV0dXJuIHtcclxuICAgIG5hbWUsXHJcbiAgICBsYWJlbCxcclxuICAgIHR5cGU6ICdib29sZWFuJyxcclxuICAgIHdpZHRoOiAnNTAlJyxcclxuICAgIGNvbm5lY3QsXHJcbiAgICB2YWx1ZTogZGVmYXVsdFZhbHVlXHJcbiAgfVxyXG59XHJcblxyXG5jb25zdCBudW1iZXIgPSAobmFtZSA9ICdudW1iZXInLCBsYWJlbCA9ICfmlbDlrZcnLCBkZWZhdWx0VmFsdWUgPSAwLCBjb25uZWN0ID0gdHJ1ZSkgPT4ge1xyXG4gIHJldHVybiB7XHJcbiAgICBuYW1lLFxyXG4gICAgbGFiZWwsXHJcbiAgICB0eXBlOiAnbnVtYmVyJyxcclxuICAgIHdpZHRoOiAnNTAlJyxcclxuICAgIGNvbm5lY3QsXHJcbiAgICB2YWx1ZTogZGVmYXVsdFZhbHVlXHJcbiAgfVxyXG59XHJcblxyXG5jb25zdCBpY29uID0gKG5hbWUgPSAnaWNvbicsIGxhYmVsID0gJ+WbvuaghycpID0+IHtcclxuICByZXR1cm4ge1xyXG4gICAgbmFtZSxcclxuICAgIGxhYmVsLFxyXG4gICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICBjb250cm9sOiAnaWNvbidcclxuICB9XHJcbn1cclxuXHJcbmNvbnN0IHN0cmluZyA9IChuYW1lID0gJ3RleHQnLCBsYWJlbCA9ICfmlofmnKwnLCBkZWZhdWx0VmFsdWUgPSAn5paH5pysJywgY29ubmVjdCA9IHRydWUpID0+IHtcclxuICByZXR1cm4ge1xyXG4gICAgbmFtZSxcclxuICAgIGxhYmVsLFxyXG4gICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICB2YWx1ZTogZGVmYXVsdFZhbHVlLFxyXG4gICAgY29ubmVjdFxyXG4gIH1cclxufVxyXG5cclxuY29uc3QgdmFsdWUgPSAodHlwZSA9ICdzdHJpbmcnLCBsYWJlbCA9ICflj5blgLwnLCB2YWx1ZSA9ICcnKSA9PiB7XHJcbiAgcmV0dXJuIHtcclxuICAgIG5hbWU6ICd2YWx1ZScsXHJcbiAgICB0eXBlLFxyXG4gICAgbGFiZWwsXHJcbiAgICBjb25uZWN0OiB0cnVlLFxyXG4gICAgdmFsdWVcclxuICB9XHJcbn1cclxuXHJcbmNvbnN0IGNsYXNzTGlzdCA9IChuYW1lID0gJ2NsYXNzTGlzdCcsIGxhYmVsID0gJ+agt+W8jycpID0+IHtcclxuICByZXR1cm4ge1xyXG4gICAgbmFtZSxcclxuICAgIGxhYmVsLFxyXG4gICAgdHlwZTogJ3N0eWxlJyxcclxuICAgIGNvbm5lY3Q6IHRydWUsXHJcbiAgICB2YWx1ZTogW11cclxuICB9XHJcbn1cclxuXHJcbmNvbnN0IGltYWdlID0gKG5hbWUgPSAnc3JjJywgbGFiZWwgPSAn5Zu+54mHJykgPT4gKHtcclxuICBuYW1lLFxyXG4gIHR5cGU6ICdpbWFnZScsXHJcbiAgbGFiZWwsXHJcbiAgY29ubmVjdDogdHJ1ZSxcclxuICB2YWx1ZTogJydcclxufSlcclxuXHJcbmNvbnN0IG1hcE9wdGlvbkxpc3QgPSBvcHRpb25MaXN0ID0+IHtcclxuICBpZiAoQXJyYXkuaXNBcnJheShvcHRpb25MaXN0KSkge1xyXG4gICAgcmV0dXJuIG9wdGlvbkxpc3QubWFwKChpdGVtKSA9PiB7XHJcbiAgICAgIGlmICh0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgbGFiZWw6IGl0ZW0sXHJcbiAgICAgICAgICB2YWx1ZTogaXRlbVxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgaXRlbSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICByZXR1cm4gaXRlbVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH1cclxufVxyXG5cclxuY29uc3QgcmFkaW9ncm91cCA9IChuYW1lID0gJ3JhZGlvZ3JvdXAnLCBsYWJlbCA9ICfliIfmjaInLCBvcHRpb25MaXN0ID0gW3tcclxuICBsYWJlbDogJ+WkpycsXHJcbiAgdmFsdWU6ICdidG4tbGcnXHJcbn0sIHtcclxuICBsYWJlbDogJ+ato+W4uCcsXHJcbiAgdmFsdWU6ICdidG4tbm9ybWFsJ1xyXG59LCB7XHJcbiAgbGFiZWw6ICflsI8nLFxyXG4gIHZhbHVlOiAnYnRuLXNtJ1xyXG59XSwgdmFsdWUsIGNvbm5lY3QgPSB0cnVlKSA9PiB7XHJcbiAgcmV0dXJuIHtcclxuICAgIG5hbWUsXHJcbiAgICBsYWJlbCxcclxuICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgY29udHJvbDogJ3JhZGlvZ3JvdXAnLFxyXG4gICAgb3B0aW9uTGlzdDogbWFwT3B0aW9uTGlzdChvcHRpb25MaXN0KSxcclxuICAgIGNvbm5lY3QsXHJcbiAgICB2YWx1ZTogdmFsdWUgPT0gbnVsbCA/IG9wdGlvbkxpc3RbMF0/LnZhbHVlIDogdmFsdWVcclxuICB9XHJcbn1cclxuXHJcbmNvbnN0IHNlbGVjdCA9IChuYW1lID0gJ3NlbGVjdCcsIGxhYmVsID0gJ+mAieaLqScsIG9wdGlvbkxpc3QgPSBbXHJcbiAge1xyXG4gICAgbGFiZWw6ICflpKcnLFxyXG4gICAgdmFsdWU6ICdidG4tbGcnXHJcbiAgfSwge1xyXG4gICAgbGFiZWw6ICfmraPluLgnLFxyXG4gICAgdmFsdWU6ICdidG4tbm9ybWFsJ1xyXG4gIH1cclxuXSwgdmFsdWUsIGNvbm5lY3QgPSB0cnVlLCByZXF1aXJlZCA9IHRydWUpID0+IHtcclxuICBsZXQgbGlzdCA9IFtdXHJcbiAgaWYgKEFycmF5LmlzQXJyYXkob3B0aW9uTGlzdCkpIHtcclxuICAgIGxpc3QgPSBvcHRpb25MaXN0Lm1hcChpdGVtID0+IHtcclxuICAgICAgaWYgKHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBsYWJlbDogaXRlbSxcclxuICAgICAgICAgIHZhbHVlOiBpdGVtXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBpdGVtXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgbmFtZSxcclxuICAgIGxhYmVsLFxyXG4gICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICBjb250cm9sOiAnc2VsZWN0JyxcclxuICAgIG9wdGlvbkxpc3Q6IGxpc3QsXHJcbiAgICByZXF1aXJlZCxcclxuICAgIGNvbm5lY3QsXHJcbiAgICB2YWx1ZVxyXG4gIH1cclxufVxyXG5cclxuY29uc3Qgc2xvdCA9IChuYW1lID0gJ3Nsb3QnLCBsYWJlbCA9ICfmj5Lmp70nKSA9PiB7XHJcbiAgcmV0dXJuIHtcclxuICAgIG5hbWUsXHJcbiAgICBsYWJlbCxcclxuICAgIHR5cGU6ICdzbG90J1xyXG4gIH1cclxufVxyXG5cclxuY29uc3QgY29sb3IgPSAobmFtZSA9ICdjb2xvcicsIGxhYmVsID0gJ+minOiJsicsIHZhbHVlID0gJycpID0+IHtcclxuICByZXR1cm4ge1xyXG4gICAgbmFtZSxcclxuICAgIGxhYmVsLFxyXG4gICAgdHlwZTogJ2NvbG9yJyxcclxuICAgIHZhbHVlXHJcbiAgfVxyXG59XHJcblxyXG5jb25zdCBvbkNsaWNrID0ge1xyXG4gIGxhYmVsOiAn5Y2V5Ye7JyxcclxuICBuYW1lOiAnb25DbGljaydcclxufVxyXG5jb25zdCBvbkNoYW5nZSA9IHtcclxuICBsYWJlbDogJ+aUueWPmCcsXHJcbiAgbmFtZTogJ29uQ2hhbmdlJ1xyXG59XHJcblxyXG5jb25zdCBldmVudCA9IChuYW1lLCBsYWJlbCkgPT4ge1xyXG4gIHJldHVybiB7XHJcbiAgICBsYWJlbCwgbmFtZVxyXG4gIH1cclxufVxyXG5cclxuY29uc3QgY2hpbGRyZW4gPSB7XHJcbiAgbmFtZTogJ2NoaWxkcmVuJyxcclxuICBoaWRkZW46IHRydWUsXHJcbiAgdHlwZTogJ2NoaWxkcmVuJ1xyXG59XHJcblxyXG5jb25zdCBvcHRpb25Db25maWcgPSAobmFtZSA9ICdvcHRpb25zJywgbGFiZWwgPSAn6YCJ6aG55YiX6KGoJywgdmFsdWUgPSBbe1xyXG4gIGxhYmVsOiAn6YCJ6aG5MScsXHJcbiAgdmFsdWU6ICd2YWx1ZTEnXHJcbn0sIHtcclxuICBsYWJlbDogJ+mAiemhuTInLFxyXG4gIHZhbHVlOiAndmFsdWUyJ1xyXG59XSkgPT4ge1xyXG4gIHJldHVybiB7XHJcbiAgICBuYW1lLFxyXG4gICAgbGFiZWwsXHJcbiAgICB2YWx1ZSxcclxuICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgY29ubmVjdDogdHJ1ZSxcclxuICAgIGNvbnRyb2w6ICgpID0+IGltcG9ydCgncmlkZ2Vqcy1lZGl0b3IvY29udHJvbC9PcHRpb25Db25maWcuanN4JylcclxuICB9XHJcbn1cclxuXHJcbmNvbnN0IGpzb24gPSAobmFtZSA9ICdqc29uJywgbGFiZWwgPSAn5a+56LGhJywgdmFsdWUgPSB7fSwgY29ubmVjdCA9IGZhbHNlKSA9PiB7XHJcbiAgcmV0dXJuIHtcclxuICAgIG5hbWUsXHJcbiAgICBsYWJlbCxcclxuICAgIHZhbHVlLFxyXG4gICAgY29ubmVjdCxcclxuICAgIHR5cGU6ICdvYmplY3QnXHJcbiAgfVxyXG59XHJcblxyXG5jb25zdCBhcnJheSA9IChuYW1lID0gJ2FycmF5JywgbGFiZWwgPSAn5pWw57uEJywgdmFsdWUgPSBbXSkgPT4ge1xyXG4gIHJldHVybiB7XHJcbiAgICBuYW1lLFxyXG4gICAgbGFiZWwsXHJcbiAgICB2YWx1ZSxcclxuICAgIHR5cGU6ICdvYmplY3QnXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgeyBib29sZWFuLCBpbWFnZSwgbnVtYmVyLCB2YWx1ZSwgc3RyaW5nLCBqc29uLCBzZWxlY3QsIGFycmF5LCBpY29uLCBjb2xvciwgY2hpbGRyZW4sIGNsYXNzTGlzdCwgcmFkaW9ncm91cCwgb3B0aW9uQ29uZmlnLCBzbG90LCBvbkNsaWNrLCBvbkNoYW5nZSwgZXZlbnQgfVxyXG4iXSwibmFtZXMiOlsiYm9vbGVhbiIsIm5hbWUiLCJsYWJlbCIsImRlZmF1bHRWYWx1ZSIsImNvbm5lY3QiLCJ0eXBlIiwid2lkdGgiLCJ2YWx1ZSIsIm51bWJlciIsImljb24iLCJjb250cm9sIiwic3RyaW5nIiwiY2xhc3NMaXN0IiwiaW1hZ2UiLCJtYXBPcHRpb25MaXN0Iiwib3B0aW9uTGlzdCIsIkFycmF5IiwiaXNBcnJheSIsIm1hcCIsIml0ZW0iLCJyYWRpb2dyb3VwIiwiX29wdGlvbkxpc3QkIiwic2VsZWN0IiwicmVxdWlyZWQiLCJsaXN0Iiwic2xvdCIsImNvbG9yIiwib25DbGljayIsIm9uQ2hhbmdlIiwiZXZlbnQiLCJjaGlsZHJlbiIsImhpZGRlbiIsIm9wdGlvbkNvbmZpZyIsImpzb24iLCJhcnJheSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///../../core/tools/src/props.js\n");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = (function() { return this["React"]; }());

/***/ }),

/***/ "ridgejs":
/*!****************************!*\
  !*** external "RidgeCore" ***!
  \****************************/
/***/ ((module) => {

module.exports = (function() { return this["RidgeCore"]; }());

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".ridge.dist.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "ridge-codemirror:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 		
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 		
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = globalThis["webpackChunkridge_codemirror"] = globalThis["webpackChunkridge_codemirror"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval-source-map devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./concat.js");
/******/ 	this["ridge-codemirror"] = __webpack_exports__;
/******/ 	
/******/ })()
;