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

/***/ "../../core/tools/src/props.js":
/*!*************************************!*\
  !*** ../../core/tools/src/props.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   array: () => (/* binding */ array),\n/* harmony export */   boolean: () => (/* binding */ boolean),\n/* harmony export */   children: () => (/* binding */ children),\n/* harmony export */   classList: () => (/* binding */ classList),\n/* harmony export */   color: () => (/* binding */ color),\n/* harmony export */   event: () => (/* binding */ event),\n/* harmony export */   file: () => (/* binding */ file),\n/* harmony export */   icon: () => (/* binding */ icon),\n/* harmony export */   image: () => (/* binding */ image),\n/* harmony export */   json: () => (/* binding */ json),\n/* harmony export */   number: () => (/* binding */ number),\n/* harmony export */   objectFit: () => (/* binding */ objectFit),\n/* harmony export */   onChange: () => (/* binding */ onChange),\n/* harmony export */   onClick: () => (/* binding */ onClick),\n/* harmony export */   optionConfig: () => (/* binding */ optionConfig),\n/* harmony export */   radiogroup: () => (/* binding */ radiogroup),\n/* harmony export */   select: () => (/* binding */ select),\n/* harmony export */   slot: () => (/* binding */ slot),\n/* harmony export */   string: () => (/* binding */ string),\n/* harmony export */   value: () => (/* binding */ value)\n/* harmony export */ });\nconst boolean = (name = 'boolean', label = '布尔', defaultValue = true, connect = true) => {\n  return {\n    name,\n    label,\n    type: 'boolean',\n    width: '50%',\n    connect,\n    value: defaultValue\n  };\n};\nconst number = (name = 'number', label = '数字', defaultValue = 0, connect = true) => {\n  return {\n    name,\n    label,\n    type: 'number',\n    width: '50%',\n    connect,\n    value: defaultValue\n  };\n};\nconst icon = (name = 'icon', label = '图标') => {\n  return {\n    name,\n    label,\n    type: 'string',\n    control: 'icon'\n  };\n};\nconst string = (name = 'text', label = '文本', defaultValue = '文本', connect = true) => {\n  return {\n    name,\n    label,\n    type: 'string',\n    value: defaultValue,\n    connect\n  };\n};\nconst value = (type = 'string', label = '取值', value = '') => {\n  return {\n    name: 'value',\n    type,\n    label,\n    connect: true,\n    value\n  };\n};\nconst classList = (name = 'classList', label = '样式') => {\n  return {\n    name,\n    label,\n    type: 'style',\n    connect: true,\n    value: []\n  };\n};\nconst image = (name = 'src', label = '图片') => ({\n  name,\n  type: 'file',\n  fileType: 'image',\n  multiple: false,\n  label,\n  connect: true,\n  value: ''\n});\nconst mapOptionList = optionList => {\n  if (Array.isArray(optionList)) {\n    return optionList.map(item => {\n      if (typeof item === 'string') {\n        return {\n          label: item,\n          value: item\n        };\n      } else {\n        return item;\n      }\n    });\n  } else if (typeof optionList === 'string') {\n    const list = optionList.split(/[, ;]/);\n    return mapOptionList(list);\n  }\n};\nconst radiogroup = (name = 'radiogroup', label = '切换', optionList = [{\n  label: '大',\n  value: 'btn-lg'\n}, {\n  label: '正常',\n  value: 'btn-normal'\n}, {\n  label: '小',\n  value: 'btn-sm'\n}], value, connect = true) => {\n  var _optionList$;\n  return {\n    name,\n    label,\n    type: 'string',\n    control: 'radiogroup',\n    optionList: mapOptionList(optionList),\n    connect,\n    value: value == null ? (_optionList$ = optionList[0]) === null || _optionList$ === void 0 ? void 0 : _optionList$.value : value\n  };\n};\nconst select = (name = 'select', label = '选择', optionList = [{\n  label: '大',\n  value: 'btn-lg'\n}, {\n  label: '正常',\n  value: 'btn-normal'\n}], value, connect = true, required = true) => {\n  let list = [];\n  if (Array.isArray(optionList)) {\n    list = optionList.map(item => {\n      if (typeof item === 'string') {\n        return {\n          label: item,\n          value: item\n        };\n      } else {\n        return item;\n      }\n    });\n  }\n  return {\n    name,\n    label,\n    type: 'string',\n    control: 'select',\n    optionList: list,\n    required,\n    connect,\n    value\n  };\n};\nconst slot = (name = 'slot', label = '插槽') => {\n  return {\n    name,\n    label,\n    type: 'slot'\n  };\n};\nconst color = (name = 'color', label = '颜色', value = '', connect = true) => {\n  return {\n    name,\n    label,\n    type: 'color',\n    value,\n    connect\n  };\n};\nconst onClick = {\n  label: '单击',\n  name: 'onClick'\n};\nconst onChange = {\n  label: '改变',\n  name: 'onChange'\n};\nconst event = (name, label) => {\n  return {\n    label,\n    name\n  };\n};\nconst children = {\n  name: 'children',\n  hidden: true,\n  type: 'children'\n};\nconst optionConfig = (name = 'options', label = '选项列表', value = [{\n  label: '选项1',\n  value: 'value1'\n}, {\n  label: '选项2',\n  value: 'value2'\n}]) => {\n  return {\n    name,\n    label,\n    value,\n    type: 'string',\n    connect: true,\n    control: () => __webpack_require__.e(/*! import() */ \"core_editor_control_OptionConfig_jsx\").then(__webpack_require__.bind(__webpack_require__, /*! ridgejs-editor/control/OptionConfig.jsx */ \"../../core/editor/control/OptionConfig.jsx\"))\n  };\n};\nconst objectFit = {\n  label: '适应',\n  name: 'objectFit',\n  type: 'string',\n  control: 'select',\n  optionList: [{\n    label: '填充',\n    value: 'object-fit-fill'\n  }, {\n    label: '适应',\n    value: 'object-fit-contain'\n  }, {\n    label: '拉伸',\n    value: 'object-fit-cover'\n  }, {\n    label: '原始',\n    value: 'object-fit-none'\n  }, {\n    label: '重复',\n    value: 'object-fit-repeat'\n  }]\n};\nconst json = (name = 'json', label = '对象', value = {}, connect = true) => {\n  return {\n    name,\n    label,\n    value,\n    connect,\n    type: 'object'\n  };\n};\nconst file = (name = 'file', label = '文件', value = '', connect = true) => {\n  return {\n    name,\n    label,\n    value,\n    connect,\n    type: 'file'\n  };\n};\nconst array = (name = 'array', label = '数组', value = []) => {\n  return {\n    name,\n    label,\n    value,\n    type: 'object'\n  };\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi4vLi4vY29yZS90b29scy9zcmMvcHJvcHMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxNQUFNQSxPQUFPLEdBQUdBLENBQUNDLElBQUksR0FBRyxTQUFTLEVBQUVDLEtBQUssR0FBRyxJQUFJLEVBQUVDLFlBQVksR0FBRyxJQUFJLEVBQUVDLE9BQU8sR0FBRyxJQUFJLEtBQUs7RUFDdkYsT0FBTztJQUNMSCxJQUFJO0lBQ0pDLEtBQUs7SUFDTEcsSUFBSSxFQUFFLFNBQVM7SUFDZkMsS0FBSyxFQUFFLEtBQUs7SUFDWkYsT0FBTztJQUNQRyxLQUFLLEVBQUVKO0VBQ1QsQ0FBQztBQUNILENBQUM7QUFFRCxNQUFNSyxNQUFNLEdBQUdBLENBQUNQLElBQUksR0FBRyxRQUFRLEVBQUVDLEtBQUssR0FBRyxJQUFJLEVBQUVDLFlBQVksR0FBRyxDQUFDLEVBQUVDLE9BQU8sR0FBRyxJQUFJLEtBQUs7RUFDbEYsT0FBTztJQUNMSCxJQUFJO0lBQ0pDLEtBQUs7SUFDTEcsSUFBSSxFQUFFLFFBQVE7SUFDZEMsS0FBSyxFQUFFLEtBQUs7SUFDWkYsT0FBTztJQUNQRyxLQUFLLEVBQUVKO0VBQ1QsQ0FBQztBQUNILENBQUM7QUFFRCxNQUFNTSxJQUFJLEdBQUdBLENBQUNSLElBQUksR0FBRyxNQUFNLEVBQUVDLEtBQUssR0FBRyxJQUFJLEtBQUs7RUFDNUMsT0FBTztJQUNMRCxJQUFJO0lBQ0pDLEtBQUs7SUFDTEcsSUFBSSxFQUFFLFFBQVE7SUFDZEssT0FBTyxFQUFFO0VBQ1gsQ0FBQztBQUNILENBQUM7QUFFRCxNQUFNQyxNQUFNLEdBQUdBLENBQUNWLElBQUksR0FBRyxNQUFNLEVBQUVDLEtBQUssR0FBRyxJQUFJLEVBQUVDLFlBQVksR0FBRyxJQUFJLEVBQUVDLE9BQU8sR0FBRyxJQUFJLEtBQUs7RUFDbkYsT0FBTztJQUNMSCxJQUFJO0lBQ0pDLEtBQUs7SUFDTEcsSUFBSSxFQUFFLFFBQVE7SUFDZEUsS0FBSyxFQUFFSixZQUFZO0lBQ25CQztFQUNGLENBQUM7QUFDSCxDQUFDO0FBRUQsTUFBTUcsS0FBSyxHQUFHQSxDQUFDRixJQUFJLEdBQUcsUUFBUSxFQUFFSCxLQUFLLEdBQUcsSUFBSSxFQUFFSyxLQUFLLEdBQUcsRUFBRSxLQUFLO0VBQzNELE9BQU87SUFDTE4sSUFBSSxFQUFFLE9BQU87SUFDYkksSUFBSTtJQUNKSCxLQUFLO0lBQ0xFLE9BQU8sRUFBRSxJQUFJO0lBQ2JHO0VBQ0YsQ0FBQztBQUNILENBQUM7QUFFRCxNQUFNSyxTQUFTLEdBQUdBLENBQUNYLElBQUksR0FBRyxXQUFXLEVBQUVDLEtBQUssR0FBRyxJQUFJLEtBQUs7RUFDdEQsT0FBTztJQUNMRCxJQUFJO0lBQ0pDLEtBQUs7SUFDTEcsSUFBSSxFQUFFLE9BQU87SUFDYkQsT0FBTyxFQUFFLElBQUk7SUFDYkcsS0FBSyxFQUFFO0VBQ1QsQ0FBQztBQUNILENBQUM7QUFFRCxNQUFNTSxLQUFLLEdBQUdBLENBQUNaLElBQUksR0FBRyxLQUFLLEVBQUVDLEtBQUssR0FBRyxJQUFJLE1BQU07RUFDN0NELElBQUk7RUFDSkksSUFBSSxFQUFFLE1BQU07RUFDWlMsUUFBUSxFQUFFLE9BQU87RUFDakJDLFFBQVEsRUFBRSxLQUFLO0VBQ2ZiLEtBQUs7RUFDTEUsT0FBTyxFQUFFLElBQUk7RUFDYkcsS0FBSyxFQUFFO0FBQ1QsQ0FBQyxDQUFDO0FBRUYsTUFBTVMsYUFBYSxHQUFHQyxVQUFVLElBQUk7RUFDbEMsSUFBSUMsS0FBSyxDQUFDQyxPQUFPLENBQUNGLFVBQVUsQ0FBQyxFQUFFO0lBQzdCLE9BQU9BLFVBQVUsQ0FBQ0csR0FBRyxDQUFDQyxJQUFJLElBQUk7TUFDNUIsSUFBSSxPQUFPQSxJQUFJLEtBQUssUUFBUSxFQUFFO1FBQzVCLE9BQU87VUFDTG5CLEtBQUssRUFBRW1CLElBQUk7VUFDWGQsS0FBSyxFQUFFYztRQUNULENBQUM7TUFDSCxDQUFDLE1BQU07UUFDTCxPQUFPQSxJQUFJO01BQ2I7SUFDRixDQUFDLENBQUM7RUFDSixDQUFDLE1BQU0sSUFBSSxPQUFPSixVQUFVLEtBQUssUUFBUSxFQUFFO0lBQ3pDLE1BQU1LLElBQUksR0FBR0wsVUFBVSxDQUFDTSxLQUFLLENBQUMsT0FBTyxDQUFDO0lBQ3RDLE9BQU9QLGFBQWEsQ0FBQ00sSUFBSSxDQUFDO0VBQzVCO0FBQ0YsQ0FBQztBQUVELE1BQU1FLFVBQVUsR0FBR0EsQ0FBQ3ZCLElBQUksR0FBRyxZQUFZLEVBQUVDLEtBQUssR0FBRyxJQUFJLEVBQUVlLFVBQVUsR0FBRyxDQUFDO0VBQ25FZixLQUFLLEVBQUUsR0FBRztFQUNWSyxLQUFLLEVBQUU7QUFDVCxDQUFDLEVBQUU7RUFDREwsS0FBSyxFQUFFLElBQUk7RUFDWEssS0FBSyxFQUFFO0FBQ1QsQ0FBQyxFQUFFO0VBQ0RMLEtBQUssRUFBRSxHQUFHO0VBQ1ZLLEtBQUssRUFBRTtBQUNULENBQUMsQ0FBQyxFQUFFQSxLQUFLLEVBQUVILE9BQU8sR0FBRyxJQUFJLEtBQUs7RUFBQSxJQUFBcUIsWUFBQTtFQUM1QixPQUFPO0lBQ0x4QixJQUFJO0lBQ0pDLEtBQUs7SUFDTEcsSUFBSSxFQUFFLFFBQVE7SUFDZEssT0FBTyxFQUFFLFlBQVk7SUFDckJPLFVBQVUsRUFBRUQsYUFBYSxDQUFDQyxVQUFVLENBQUM7SUFDckNiLE9BQU87SUFDUEcsS0FBSyxFQUFFQSxLQUFLLElBQUksSUFBSSxJQUFBa0IsWUFBQSxHQUFHUixVQUFVLENBQUMsQ0FBQyxDQUFDLGNBQUFRLFlBQUEsdUJBQWJBLFlBQUEsQ0FBZWxCLEtBQUssR0FBR0E7RUFDaEQsQ0FBQztBQUNILENBQUM7QUFFRCxNQUFNbUIsTUFBTSxHQUFHQSxDQUFDekIsSUFBSSxHQUFHLFFBQVEsRUFBRUMsS0FBSyxHQUFHLElBQUksRUFBRWUsVUFBVSxHQUFHLENBQzFEO0VBQ0VmLEtBQUssRUFBRSxHQUFHO0VBQ1ZLLEtBQUssRUFBRTtBQUNULENBQUMsRUFBRTtFQUNETCxLQUFLLEVBQUUsSUFBSTtFQUNYSyxLQUFLLEVBQUU7QUFDVCxDQUFDLENBQ0YsRUFBRUEsS0FBSyxFQUFFSCxPQUFPLEdBQUcsSUFBSSxFQUFFdUIsUUFBUSxHQUFHLElBQUksS0FBSztFQUM1QyxJQUFJTCxJQUFJLEdBQUcsRUFBRTtFQUNiLElBQUlKLEtBQUssQ0FBQ0MsT0FBTyxDQUFDRixVQUFVLENBQUMsRUFBRTtJQUM3QkssSUFBSSxHQUFHTCxVQUFVLENBQUNHLEdBQUcsQ0FBQ0MsSUFBSSxJQUFJO01BQzVCLElBQUksT0FBT0EsSUFBSSxLQUFLLFFBQVEsRUFBRTtRQUM1QixPQUFPO1VBQ0xuQixLQUFLLEVBQUVtQixJQUFJO1VBQ1hkLEtBQUssRUFBRWM7UUFDVCxDQUFDO01BQ0gsQ0FBQyxNQUFNO1FBQ0wsT0FBT0EsSUFBSTtNQUNiO0lBQ0YsQ0FBQyxDQUFDO0VBQ0o7RUFFQSxPQUFPO0lBQ0xwQixJQUFJO0lBQ0pDLEtBQUs7SUFDTEcsSUFBSSxFQUFFLFFBQVE7SUFDZEssT0FBTyxFQUFFLFFBQVE7SUFDakJPLFVBQVUsRUFBRUssSUFBSTtJQUNoQkssUUFBUTtJQUNSdkIsT0FBTztJQUNQRztFQUNGLENBQUM7QUFDSCxDQUFDO0FBRUQsTUFBTXFCLElBQUksR0FBR0EsQ0FBQzNCLElBQUksR0FBRyxNQUFNLEVBQUVDLEtBQUssR0FBRyxJQUFJLEtBQUs7RUFDNUMsT0FBTztJQUNMRCxJQUFJO0lBQ0pDLEtBQUs7SUFDTEcsSUFBSSxFQUFFO0VBQ1IsQ0FBQztBQUNILENBQUM7QUFFRCxNQUFNd0IsS0FBSyxHQUFHQSxDQUFDNUIsSUFBSSxHQUFHLE9BQU8sRUFBRUMsS0FBSyxHQUFHLElBQUksRUFBRUssS0FBSyxHQUFHLEVBQUUsRUFBRUgsT0FBTyxHQUFHLElBQUksS0FBSztFQUMxRSxPQUFPO0lBQ0xILElBQUk7SUFDSkMsS0FBSztJQUNMRyxJQUFJLEVBQUUsT0FBTztJQUNiRSxLQUFLO0lBQ0xIO0VBQ0YsQ0FBQztBQUNILENBQUM7QUFFRCxNQUFNMEIsT0FBTyxHQUFHO0VBQ2Q1QixLQUFLLEVBQUUsSUFBSTtFQUNYRCxJQUFJLEVBQUU7QUFDUixDQUFDO0FBQ0QsTUFBTThCLFFBQVEsR0FBRztFQUNmN0IsS0FBSyxFQUFFLElBQUk7RUFDWEQsSUFBSSxFQUFFO0FBQ1IsQ0FBQztBQUVELE1BQU0rQixLQUFLLEdBQUdBLENBQUMvQixJQUFJLEVBQUVDLEtBQUssS0FBSztFQUM3QixPQUFPO0lBQ0xBLEtBQUs7SUFBRUQ7RUFDVCxDQUFDO0FBQ0gsQ0FBQztBQUVELE1BQU1nQyxRQUFRLEdBQUc7RUFDZmhDLElBQUksRUFBRSxVQUFVO0VBQ2hCaUMsTUFBTSxFQUFFLElBQUk7RUFDWjdCLElBQUksRUFBRTtBQUNSLENBQUM7QUFFRCxNQUFNOEIsWUFBWSxHQUFHQSxDQUFDbEMsSUFBSSxHQUFHLFNBQVMsRUFBRUMsS0FBSyxHQUFHLE1BQU0sRUFBRUssS0FBSyxHQUFHLENBQUM7RUFDL0RMLEtBQUssRUFBRSxLQUFLO0VBQ1pLLEtBQUssRUFBRTtBQUNULENBQUMsRUFBRTtFQUNETCxLQUFLLEVBQUUsS0FBSztFQUNaSyxLQUFLLEVBQUU7QUFDVCxDQUFDLENBQUMsS0FBSztFQUNMLE9BQU87SUFDTE4sSUFBSTtJQUNKQyxLQUFLO0lBQ0xLLEtBQUs7SUFDTEYsSUFBSSxFQUFFLFFBQVE7SUFDZEQsT0FBTyxFQUFFLElBQUk7SUFDYk0sT0FBTyxFQUFFQSxDQUFBLEtBQU0sOE5BQWlEO0VBQ2xFLENBQUM7QUFDSCxDQUFDO0FBRUQsTUFBTTBCLFNBQVMsR0FBRztFQUNoQmxDLEtBQUssRUFBRSxJQUFJO0VBQ1hELElBQUksRUFBRSxXQUFXO0VBQ2pCSSxJQUFJLEVBQUUsUUFBUTtFQUNkSyxPQUFPLEVBQUUsUUFBUTtFQUNqQk8sVUFBVSxFQUFFLENBQUM7SUFDWGYsS0FBSyxFQUFFLElBQUk7SUFDWEssS0FBSyxFQUFFO0VBQ1QsQ0FBQyxFQUFFO0lBQ0RMLEtBQUssRUFBRSxJQUFJO0lBQ1hLLEtBQUssRUFBRTtFQUNULENBQUMsRUFBRTtJQUNETCxLQUFLLEVBQUUsSUFBSTtJQUNYSyxLQUFLLEVBQUU7RUFDVCxDQUFDLEVBQUU7SUFDREwsS0FBSyxFQUFFLElBQUk7SUFDWEssS0FBSyxFQUFFO0VBQ1QsQ0FBQyxFQUFFO0lBQ0RMLEtBQUssRUFBRSxJQUFJO0lBQ1hLLEtBQUssRUFBRTtFQUNULENBQUM7QUFDSCxDQUFDO0FBQ0QsTUFBTThCLElBQUksR0FBR0EsQ0FBQ3BDLElBQUksR0FBRyxNQUFNLEVBQUVDLEtBQUssR0FBRyxJQUFJLEVBQUVLLEtBQUssR0FBRyxDQUFDLENBQUMsRUFBRUgsT0FBTyxHQUFHLElBQUksS0FBSztFQUN4RSxPQUFPO0lBQ0xILElBQUk7SUFDSkMsS0FBSztJQUNMSyxLQUFLO0lBQ0xILE9BQU87SUFDUEMsSUFBSSxFQUFFO0VBQ1IsQ0FBQztBQUNILENBQUM7QUFFRCxNQUFNaUMsSUFBSSxHQUFHQSxDQUFDckMsSUFBSSxHQUFHLE1BQU0sRUFBRUMsS0FBSyxHQUFHLElBQUksRUFBRUssS0FBSyxHQUFHLEVBQUUsRUFBRUgsT0FBTyxHQUFHLElBQUksS0FBSztFQUN4RSxPQUFPO0lBQ0xILElBQUk7SUFDSkMsS0FBSztJQUNMSyxLQUFLO0lBQ0xILE9BQU87SUFDUEMsSUFBSSxFQUFFO0VBQ1IsQ0FBQztBQUNILENBQUM7QUFFRCxNQUFNa0MsS0FBSyxHQUFHQSxDQUFDdEMsSUFBSSxHQUFHLE9BQU8sRUFBRUMsS0FBSyxHQUFHLElBQUksRUFBRUssS0FBSyxHQUFHLEVBQUUsS0FBSztFQUMxRCxPQUFPO0lBQ0xOLElBQUk7SUFDSkMsS0FBSztJQUNMSyxLQUFLO0lBQ0xGLElBQUksRUFBRTtFQUNSLENBQUM7QUFDSCxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcmlkZ2Utc3dpcGVyLy4uLy4uL2NvcmUvdG9vbHMvc3JjL3Byb3BzLmpzPzExMzIiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgYm9vbGVhbiA9IChuYW1lID0gJ2Jvb2xlYW4nLCBsYWJlbCA9ICfluIPlsJQnLCBkZWZhdWx0VmFsdWUgPSB0cnVlLCBjb25uZWN0ID0gdHJ1ZSkgPT4ge1xyXG4gIHJldHVybiB7XHJcbiAgICBuYW1lLFxyXG4gICAgbGFiZWwsXHJcbiAgICB0eXBlOiAnYm9vbGVhbicsXHJcbiAgICB3aWR0aDogJzUwJScsXHJcbiAgICBjb25uZWN0LFxyXG4gICAgdmFsdWU6IGRlZmF1bHRWYWx1ZVxyXG4gIH1cclxufVxyXG5cclxuY29uc3QgbnVtYmVyID0gKG5hbWUgPSAnbnVtYmVyJywgbGFiZWwgPSAn5pWw5a2XJywgZGVmYXVsdFZhbHVlID0gMCwgY29ubmVjdCA9IHRydWUpID0+IHtcclxuICByZXR1cm4ge1xyXG4gICAgbmFtZSxcclxuICAgIGxhYmVsLFxyXG4gICAgdHlwZTogJ251bWJlcicsXHJcbiAgICB3aWR0aDogJzUwJScsXHJcbiAgICBjb25uZWN0LFxyXG4gICAgdmFsdWU6IGRlZmF1bHRWYWx1ZVxyXG4gIH1cclxufVxyXG5cclxuY29uc3QgaWNvbiA9IChuYW1lID0gJ2ljb24nLCBsYWJlbCA9ICflm77moIcnKSA9PiB7XHJcbiAgcmV0dXJuIHtcclxuICAgIG5hbWUsXHJcbiAgICBsYWJlbCxcclxuICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgY29udHJvbDogJ2ljb24nXHJcbiAgfVxyXG59XHJcblxyXG5jb25zdCBzdHJpbmcgPSAobmFtZSA9ICd0ZXh0JywgbGFiZWwgPSAn5paH5pysJywgZGVmYXVsdFZhbHVlID0gJ+aWh+acrCcsIGNvbm5lY3QgPSB0cnVlKSA9PiB7XHJcbiAgcmV0dXJuIHtcclxuICAgIG5hbWUsXHJcbiAgICBsYWJlbCxcclxuICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgdmFsdWU6IGRlZmF1bHRWYWx1ZSxcclxuICAgIGNvbm5lY3RcclxuICB9XHJcbn1cclxuXHJcbmNvbnN0IHZhbHVlID0gKHR5cGUgPSAnc3RyaW5nJywgbGFiZWwgPSAn5Y+W5YC8JywgdmFsdWUgPSAnJykgPT4ge1xyXG4gIHJldHVybiB7XHJcbiAgICBuYW1lOiAndmFsdWUnLFxyXG4gICAgdHlwZSxcclxuICAgIGxhYmVsLFxyXG4gICAgY29ubmVjdDogdHJ1ZSxcclxuICAgIHZhbHVlXHJcbiAgfVxyXG59XHJcblxyXG5jb25zdCBjbGFzc0xpc3QgPSAobmFtZSA9ICdjbGFzc0xpc3QnLCBsYWJlbCA9ICfmoLflvI8nKSA9PiB7XHJcbiAgcmV0dXJuIHtcclxuICAgIG5hbWUsXHJcbiAgICBsYWJlbCxcclxuICAgIHR5cGU6ICdzdHlsZScsXHJcbiAgICBjb25uZWN0OiB0cnVlLFxyXG4gICAgdmFsdWU6IFtdXHJcbiAgfVxyXG59XHJcblxyXG5jb25zdCBpbWFnZSA9IChuYW1lID0gJ3NyYycsIGxhYmVsID0gJ+WbvueJhycpID0+ICh7XHJcbiAgbmFtZSxcclxuICB0eXBlOiAnZmlsZScsXHJcbiAgZmlsZVR5cGU6ICdpbWFnZScsXHJcbiAgbXVsdGlwbGU6IGZhbHNlLFxyXG4gIGxhYmVsLFxyXG4gIGNvbm5lY3Q6IHRydWUsXHJcbiAgdmFsdWU6ICcnXHJcbn0pXHJcblxyXG5jb25zdCBtYXBPcHRpb25MaXN0ID0gb3B0aW9uTGlzdCA9PiB7XHJcbiAgaWYgKEFycmF5LmlzQXJyYXkob3B0aW9uTGlzdCkpIHtcclxuICAgIHJldHVybiBvcHRpb25MaXN0Lm1hcChpdGVtID0+IHtcclxuICAgICAgaWYgKHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBsYWJlbDogaXRlbSxcclxuICAgICAgICAgIHZhbHVlOiBpdGVtXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBpdGVtXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9uTGlzdCA9PT0gJ3N0cmluZycpIHtcclxuICAgIGNvbnN0IGxpc3QgPSBvcHRpb25MaXN0LnNwbGl0KC9bLCA7XS8pXHJcbiAgICByZXR1cm4gbWFwT3B0aW9uTGlzdChsaXN0KVxyXG4gIH1cclxufVxyXG5cclxuY29uc3QgcmFkaW9ncm91cCA9IChuYW1lID0gJ3JhZGlvZ3JvdXAnLCBsYWJlbCA9ICfliIfmjaInLCBvcHRpb25MaXN0ID0gW3tcclxuICBsYWJlbDogJ+WkpycsXHJcbiAgdmFsdWU6ICdidG4tbGcnXHJcbn0sIHtcclxuICBsYWJlbDogJ+ato+W4uCcsXHJcbiAgdmFsdWU6ICdidG4tbm9ybWFsJ1xyXG59LCB7XHJcbiAgbGFiZWw6ICflsI8nLFxyXG4gIHZhbHVlOiAnYnRuLXNtJ1xyXG59XSwgdmFsdWUsIGNvbm5lY3QgPSB0cnVlKSA9PiB7XHJcbiAgcmV0dXJuIHtcclxuICAgIG5hbWUsXHJcbiAgICBsYWJlbCxcclxuICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgY29udHJvbDogJ3JhZGlvZ3JvdXAnLFxyXG4gICAgb3B0aW9uTGlzdDogbWFwT3B0aW9uTGlzdChvcHRpb25MaXN0KSxcclxuICAgIGNvbm5lY3QsXHJcbiAgICB2YWx1ZTogdmFsdWUgPT0gbnVsbCA/IG9wdGlvbkxpc3RbMF0/LnZhbHVlIDogdmFsdWVcclxuICB9XHJcbn1cclxuXHJcbmNvbnN0IHNlbGVjdCA9IChuYW1lID0gJ3NlbGVjdCcsIGxhYmVsID0gJ+mAieaLqScsIG9wdGlvbkxpc3QgPSBbXHJcbiAge1xyXG4gICAgbGFiZWw6ICflpKcnLFxyXG4gICAgdmFsdWU6ICdidG4tbGcnXHJcbiAgfSwge1xyXG4gICAgbGFiZWw6ICfmraPluLgnLFxyXG4gICAgdmFsdWU6ICdidG4tbm9ybWFsJ1xyXG4gIH1cclxuXSwgdmFsdWUsIGNvbm5lY3QgPSB0cnVlLCByZXF1aXJlZCA9IHRydWUpID0+IHtcclxuICBsZXQgbGlzdCA9IFtdXHJcbiAgaWYgKEFycmF5LmlzQXJyYXkob3B0aW9uTGlzdCkpIHtcclxuICAgIGxpc3QgPSBvcHRpb25MaXN0Lm1hcChpdGVtID0+IHtcclxuICAgICAgaWYgKHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBsYWJlbDogaXRlbSxcclxuICAgICAgICAgIHZhbHVlOiBpdGVtXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBpdGVtXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgbmFtZSxcclxuICAgIGxhYmVsLFxyXG4gICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICBjb250cm9sOiAnc2VsZWN0JyxcclxuICAgIG9wdGlvbkxpc3Q6IGxpc3QsXHJcbiAgICByZXF1aXJlZCxcclxuICAgIGNvbm5lY3QsXHJcbiAgICB2YWx1ZVxyXG4gIH1cclxufVxyXG5cclxuY29uc3Qgc2xvdCA9IChuYW1lID0gJ3Nsb3QnLCBsYWJlbCA9ICfmj5Lmp70nKSA9PiB7XHJcbiAgcmV0dXJuIHtcclxuICAgIG5hbWUsXHJcbiAgICBsYWJlbCxcclxuICAgIHR5cGU6ICdzbG90J1xyXG4gIH1cclxufVxyXG5cclxuY29uc3QgY29sb3IgPSAobmFtZSA9ICdjb2xvcicsIGxhYmVsID0gJ+minOiJsicsIHZhbHVlID0gJycsIGNvbm5lY3QgPSB0cnVlKSA9PiB7XHJcbiAgcmV0dXJuIHtcclxuICAgIG5hbWUsXHJcbiAgICBsYWJlbCxcclxuICAgIHR5cGU6ICdjb2xvcicsXHJcbiAgICB2YWx1ZSxcclxuICAgIGNvbm5lY3RcclxuICB9XHJcbn1cclxuXHJcbmNvbnN0IG9uQ2xpY2sgPSB7XHJcbiAgbGFiZWw6ICfljZXlh7snLFxyXG4gIG5hbWU6ICdvbkNsaWNrJ1xyXG59XHJcbmNvbnN0IG9uQ2hhbmdlID0ge1xyXG4gIGxhYmVsOiAn5pS55Y+YJyxcclxuICBuYW1lOiAnb25DaGFuZ2UnXHJcbn1cclxuXHJcbmNvbnN0IGV2ZW50ID0gKG5hbWUsIGxhYmVsKSA9PiB7XHJcbiAgcmV0dXJuIHtcclxuICAgIGxhYmVsLCBuYW1lXHJcbiAgfVxyXG59XHJcblxyXG5jb25zdCBjaGlsZHJlbiA9IHtcclxuICBuYW1lOiAnY2hpbGRyZW4nLFxyXG4gIGhpZGRlbjogdHJ1ZSxcclxuICB0eXBlOiAnY2hpbGRyZW4nXHJcbn1cclxuXHJcbmNvbnN0IG9wdGlvbkNvbmZpZyA9IChuYW1lID0gJ29wdGlvbnMnLCBsYWJlbCA9ICfpgInpobnliJfooagnLCB2YWx1ZSA9IFt7XHJcbiAgbGFiZWw6ICfpgInpobkxJyxcclxuICB2YWx1ZTogJ3ZhbHVlMSdcclxufSwge1xyXG4gIGxhYmVsOiAn6YCJ6aG5MicsXHJcbiAgdmFsdWU6ICd2YWx1ZTInXHJcbn1dKSA9PiB7XHJcbiAgcmV0dXJuIHtcclxuICAgIG5hbWUsXHJcbiAgICBsYWJlbCxcclxuICAgIHZhbHVlLFxyXG4gICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICBjb25uZWN0OiB0cnVlLFxyXG4gICAgY29udHJvbDogKCkgPT4gaW1wb3J0KCdyaWRnZWpzLWVkaXRvci9jb250cm9sL09wdGlvbkNvbmZpZy5qc3gnKVxyXG4gIH1cclxufVxyXG5cclxuY29uc3Qgb2JqZWN0Rml0ID0ge1xyXG4gIGxhYmVsOiAn6YCC5bqUJyxcclxuICBuYW1lOiAnb2JqZWN0Rml0JyxcclxuICB0eXBlOiAnc3RyaW5nJyxcclxuICBjb250cm9sOiAnc2VsZWN0JyxcclxuICBvcHRpb25MaXN0OiBbe1xyXG4gICAgbGFiZWw6ICfloavlhYUnLFxyXG4gICAgdmFsdWU6ICdvYmplY3QtZml0LWZpbGwnXHJcbiAgfSwge1xyXG4gICAgbGFiZWw6ICfpgILlupQnLFxyXG4gICAgdmFsdWU6ICdvYmplY3QtZml0LWNvbnRhaW4nXHJcbiAgfSwge1xyXG4gICAgbGFiZWw6ICfmi4nkvLgnLFxyXG4gICAgdmFsdWU6ICdvYmplY3QtZml0LWNvdmVyJ1xyXG4gIH0sIHtcclxuICAgIGxhYmVsOiAn5Y6f5aeLJyxcclxuICAgIHZhbHVlOiAnb2JqZWN0LWZpdC1ub25lJ1xyXG4gIH0sIHtcclxuICAgIGxhYmVsOiAn6YeN5aSNJyxcclxuICAgIHZhbHVlOiAnb2JqZWN0LWZpdC1yZXBlYXQnXHJcbiAgfV1cclxufVxyXG5jb25zdCBqc29uID0gKG5hbWUgPSAnanNvbicsIGxhYmVsID0gJ+WvueixoScsIHZhbHVlID0ge30sIGNvbm5lY3QgPSB0cnVlKSA9PiB7XHJcbiAgcmV0dXJuIHtcclxuICAgIG5hbWUsXHJcbiAgICBsYWJlbCxcclxuICAgIHZhbHVlLFxyXG4gICAgY29ubmVjdCxcclxuICAgIHR5cGU6ICdvYmplY3QnXHJcbiAgfVxyXG59XHJcblxyXG5jb25zdCBmaWxlID0gKG5hbWUgPSAnZmlsZScsIGxhYmVsID0gJ+aWh+S7ticsIHZhbHVlID0gJycsIGNvbm5lY3QgPSB0cnVlKSA9PiB7XHJcbiAgcmV0dXJuIHtcclxuICAgIG5hbWUsXHJcbiAgICBsYWJlbCxcclxuICAgIHZhbHVlLFxyXG4gICAgY29ubmVjdCxcclxuICAgIHR5cGU6ICdmaWxlJ1xyXG4gIH1cclxufVxyXG5cclxuY29uc3QgYXJyYXkgPSAobmFtZSA9ICdhcnJheScsIGxhYmVsID0gJ+aVsOe7hCcsIHZhbHVlID0gW10pID0+IHtcclxuICByZXR1cm4ge1xyXG4gICAgbmFtZSxcclxuICAgIGxhYmVsLFxyXG4gICAgdmFsdWUsXHJcbiAgICB0eXBlOiAnb2JqZWN0J1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IHsgYm9vbGVhbiwgaW1hZ2UsIG51bWJlciwgdmFsdWUsIHN0cmluZywgZmlsZSwganNvbiwgc2VsZWN0LCBhcnJheSwgaWNvbiwgY29sb3IsIGNoaWxkcmVuLCBjbGFzc0xpc3QsIHJhZGlvZ3JvdXAsIG9wdGlvbkNvbmZpZywgc2xvdCwgb25DbGljaywgb25DaGFuZ2UsIGV2ZW50LCBvYmplY3RGaXQgfVxyXG4iXSwibmFtZXMiOlsiYm9vbGVhbiIsIm5hbWUiLCJsYWJlbCIsImRlZmF1bHRWYWx1ZSIsImNvbm5lY3QiLCJ0eXBlIiwid2lkdGgiLCJ2YWx1ZSIsIm51bWJlciIsImljb24iLCJjb250cm9sIiwic3RyaW5nIiwiY2xhc3NMaXN0IiwiaW1hZ2UiLCJmaWxlVHlwZSIsIm11bHRpcGxlIiwibWFwT3B0aW9uTGlzdCIsIm9wdGlvbkxpc3QiLCJBcnJheSIsImlzQXJyYXkiLCJtYXAiLCJpdGVtIiwibGlzdCIsInNwbGl0IiwicmFkaW9ncm91cCIsIl9vcHRpb25MaXN0JCIsInNlbGVjdCIsInJlcXVpcmVkIiwic2xvdCIsImNvbG9yIiwib25DbGljayIsIm9uQ2hhbmdlIiwiZXZlbnQiLCJjaGlsZHJlbiIsImhpZGRlbiIsIm9wdGlvbkNvbmZpZyIsIm9iamVjdEZpdCIsImpzb24iLCJmaWxlIiwiYXJyYXkiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///../../core/tools/src/props.js\n");

/***/ }),

/***/ "./concat.js":
/*!*******************!*\
  !*** ./concat.js ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   swiper: () => (/* reexport safe */ _src_swiper_index_d_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])\n/* harmony export */ });\n/* harmony import */ var _src_swiper_index_d_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/swiper/index.d.js */ \"./src/swiper/index.d.js\");\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb25jYXQuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBNEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yaWRnZS1zd2lwZXIvLi9jb25jYXQuanM/MTFjYyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc3dpcGVyIGZyb20gJy4vc3JjL3N3aXBlci9pbmRleC5kLmpzJ1xuZXhwb3J0IHsgc3dpcGVyIH0iXSwibmFtZXMiOlsic3dpcGVyIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./concat.js\n");

/***/ }),

/***/ "./src/swiper/Swiper.jsx":
/*!*******************************!*\
  !*** ./src/swiper/Swiper.jsx ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (({\n  children\n}) => {\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", {\n    className: \"swiper\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", {\n    className: \"swiper-wrapper\"\n  }, children && children.map((content, idx) => {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", {\n      key: idx,\n      className: \"swiper-slide\"\n    }, content());\n  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", {\n    className: \"swiper-pagination\"\n  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", {\n    className: \"swiper-button-prev\"\n  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", {\n    className: \"swiper-button-next\"\n  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", {\n    className: \"swiper-scrollbar\"\n  }));\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc3dpcGVyL1N3aXBlci5qc3giLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQXlCO0FBQ3pCLGlFQUFlLENBQUM7RUFDZEM7QUFDRixDQUFDLEtBQUs7RUFDSixvQkFDRUQsMERBQUE7SUFBS0csU0FBUyxFQUFDO0VBQVEsZ0JBQ3JCSCwwREFBQTtJQUFLRyxTQUFTLEVBQUM7RUFBZ0IsR0FDNUJGLFFBQVEsSUFBSUEsUUFBUSxDQUFDRyxHQUFHLENBQUMsQ0FBQ0MsT0FBTyxFQUFFQyxHQUFHLEtBQUs7SUFDMUMsb0JBQU9OLDBEQUFBO01BQUtPLEdBQUcsRUFBRUQsR0FBSTtNQUFDSCxTQUFTLEVBQUM7SUFBYyxHQUFFRSxPQUFPLENBQUMsQ0FBTyxDQUFDO0VBQ2xFLENBQUMsQ0FDRSxDQUFDLGVBQ05MLDBEQUFBO0lBQUtHLFNBQVMsRUFBQztFQUFtQixDQUFFLENBQUMsZUFFckNILDBEQUFBO0lBQUtHLFNBQVMsRUFBQztFQUFvQixDQUFFLENBQUMsZUFDdENILDBEQUFBO0lBQUtHLFNBQVMsRUFBQztFQUFvQixDQUFFLENBQUMsZUFFdENILDBEQUFBO0lBQUtHLFNBQVMsRUFBQztFQUFrQixDQUFFLENBQ2hDLENBQUM7QUFFVixDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcmlkZ2Utc3dpcGVyLy4vc3JjL3N3aXBlci9Td2lwZXIuanN4PzhjYzQiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5leHBvcnQgZGVmYXVsdCAoe1xyXG4gIGNoaWxkcmVuXHJcbn0pID0+IHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9J3N3aXBlcic+XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdzd2lwZXItd3JhcHBlcic+XHJcbiAgICAgICAge2NoaWxkcmVuICYmIGNoaWxkcmVuLm1hcCgoY29udGVudCwgaWR4KSA9PiB7XHJcbiAgICAgICAgICByZXR1cm4gPGRpdiBrZXk9e2lkeH0gY2xhc3NOYW1lPSdzd2lwZXItc2xpZGUnPntjb250ZW50KCl9PC9kaXY+XHJcbiAgICAgICAgfSl9XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nc3dpcGVyLXBhZ2luYXRpb24nIC8+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nc3dpcGVyLWJ1dHRvbi1wcmV2JyAvPlxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nc3dpcGVyLWJ1dHRvbi1uZXh0JyAvPlxyXG5cclxuICAgICAgPGRpdiBjbGFzc05hbWU9J3N3aXBlci1zY3JvbGxiYXInIC8+XHJcbiAgICA8L2Rpdj5cclxuICApXHJcbn1cclxuIl0sIm5hbWVzIjpbIlJlYWN0IiwiY2hpbGRyZW4iLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwibWFwIiwiY29udGVudCIsImlkeCIsImtleSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/swiper/Swiper.jsx\n");

/***/ }),

/***/ "./src/swiper/index.d.js":
/*!*******************************!*\
  !*** ./src/swiper/index.d.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _Swiper_jsx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Swiper.jsx */ \"./src/swiper/Swiper.jsx\");\n/* harmony import */ var ridge_build_src_props_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ridge-build/src/props.js */ \"../../core/tools/src/props.js\");\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n  name: 'Swiper',\n  title: 'Swiper',\n  component: _Swiper_jsx__WEBPACK_IMPORTED_MODULE_0__[\"default\"],\n  icon: 'icons/swiper-logo.svg',\n  type: 'react',\n  props: [ridge_build_src_props_js__WEBPACK_IMPORTED_MODULE_1__.children],\n  events: [ridge_build_src_props_js__WEBPACK_IMPORTED_MODULE_1__.onChange],\n  width: 300,\n  height: 40\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc3dpcGVyL2luZGV4LmQuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQWlDO0FBQ2tFO0FBQ25HLGlFQUFlO0VBQ2JRLElBQUksRUFBRSxRQUFRO0VBQ2RDLEtBQUssRUFBRSxRQUFRO0VBQ2ZDLFNBQVMsRUFBRVYsbURBQU07RUFDakJXLElBQUksRUFBRSx1QkFBdUI7RUFDN0JDLElBQUksRUFBRSxPQUFPO0VBQ2JDLEtBQUssRUFBRSxDQUNMTiw4REFBUSxDQUNUO0VBQ0RPLE1BQU0sRUFBRSxDQUFDVCw4REFBUSxDQUFDO0VBQ2xCVSxLQUFLLEVBQUUsR0FBRztFQUNWQyxNQUFNLEVBQUU7QUFFVixDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcmlkZ2Utc3dpcGVyLy4vc3JjL3N3aXBlci9pbmRleC5kLmpzPzNmNmUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFN3aXBlciBmcm9tICcuL1N3aXBlci5qc3gnXHJcbmltcG9ydCB7IGJvb2xlYW4sIHN0cmluZywgbnVtYmVyLCB2YWx1ZSwgb25DaGFuZ2UsIHNsb3QsIGNoaWxkcmVuIH0gZnJvbSAncmlkZ2UtYnVpbGQvc3JjL3Byb3BzLmpzJ1xyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgbmFtZTogJ1N3aXBlcicsXHJcbiAgdGl0bGU6ICdTd2lwZXInLFxyXG4gIGNvbXBvbmVudDogU3dpcGVyLFxyXG4gIGljb246ICdpY29ucy9zd2lwZXItbG9nby5zdmcnLFxyXG4gIHR5cGU6ICdyZWFjdCcsXHJcbiAgcHJvcHM6IFtcclxuICAgIGNoaWxkcmVuXHJcbiAgXSxcclxuICBldmVudHM6IFtvbkNoYW5nZV0sXHJcbiAgd2lkdGg6IDMwMCxcclxuICBoZWlnaHQ6IDQwXHJcblxyXG59XHJcbiJdLCJuYW1lcyI6WyJTd2lwZXIiLCJib29sZWFuIiwic3RyaW5nIiwibnVtYmVyIiwidmFsdWUiLCJvbkNoYW5nZSIsInNsb3QiLCJjaGlsZHJlbiIsIm5hbWUiLCJ0aXRsZSIsImNvbXBvbmVudCIsImljb24iLCJ0eXBlIiwicHJvcHMiLCJldmVudHMiLCJ3aWR0aCIsImhlaWdodCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/swiper/index.d.js\n");

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
/******/ 		var dataWebpackPrefix = "ridge-swiper:";
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
/******/ 			if (document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT')
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
/******/ 		scriptUrl = scriptUrl.replace(/^blob:/, "").replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
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
/******/ 		var chunkLoadingGlobal = globalThis["webpackChunkridge_swiper"] = globalThis["webpackChunkridge_swiper"] || [];
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
/******/ 	this["ridge-swiper"] = __webpack_exports__;
/******/ 	
/******/ })()
;