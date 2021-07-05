'use strict'
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1]
          return t[1]
        },
        trys: [],
        ops: []
      },
      f,
      y,
      t,
      g
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this
        }),
      g
    )
    function verb(n) {
      return function (v) {
        return step([n, v])
      }
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.')
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t
          if (((y = 0), t)) op = [op[0] & 2, t.value]
          switch (op[0]) {
            case 0:
            case 1:
              t = op
              break
            case 4:
              _.label++
              return { value: op[1], done: false }
            case 5:
              _.label++
              y = op[1]
              op = [0]
              continue
            case 7:
              op = _.ops.pop()
              _.trys.pop()
              continue
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0
                continue
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1]
                break
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1]
                t = op
                break
              }
              if (t && _.label < t[2]) {
                _.label = t[2]
                _.ops.push(op)
                break
              }
              if (t[2]) _.ops.pop()
              _.trys.pop()
              continue
          }
          op = body.call(thisArg, _)
        } catch (e) {
          op = [6, e]
          y = 0
        } finally {
          f = t = 0
        }
      if (op[0] & 5) throw op[1]
      return { value: op[0] ? op[1] : void 0, done: true }
    }
  }
Object.defineProperty(exports, '__esModule', { value: true })
var utils_1 = require('@comunion/utils')
var compiler_sfc_1 = require('@vue/compiler-sfc')
var fs_1 = require('fs')
var path_1 = require('path')
var svgo_1 = require('svgo')
var util_1 = require('util')
var sourceDir = path_1.join(__dirname, '../src')
var outlinedDir = path_1.join(sourceDir, 'outlined')
var filledDir = path_1.join(sourceDir, 'filled')
var targetDir = path_1.join(__dirname, '../dist')
function optimizeSvg(filename, content) {
  return svgo_1.optimize(content, {
    path: filename,
    js2svg: {
      indent: 2,
      pretty: true // boolean, false by default
    },
    plugins: ['removeXMLNS']
  }).data
}
function compileSvg(filename, content) {
  var code = compiler_sfc_1.compileTemplate({
    source: content,
    id: '1',
    filename: filename
  }).code
  return code.replace('export function render(', 'export default function render(')
}
function buildType(suffix, dirPath, filename) {
  return __awaiter(this, void 0, void 0, function () {
    var svgFile, content, CamelCaseFilename, optimized, componentCode
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          svgFile = path_1.join(dirPath, filename)
          return [4 /*yield*/, util_1.promisify(fs_1.readFile)(svgFile, { encoding: 'utf-8' })]
        case 1:
          content = _a.sent()
          CamelCaseFilename = utils_1.convertCamelCase(filename, true)
          optimized = optimizeSvg(CamelCaseFilename, content)
          componentCode = compileSvg(CamelCaseFilename, optimized)
          return [
            4 /*yield*/,
            util_1.promisify(fs_1.writeFile)(
              path_1.join(targetDir, CamelCaseFilename.replace(/\.svg/, suffix + '.esm.js')),
              componentCode,
              {
                encoding: 'utf-8'
              }
            )
          ]
        case 2:
          _a.sent()
          return [2 /*return*/, CamelCaseFilename.replace(/\.svg/, suffix)]
      }
    })
  })
}
function addExportEntry(entryName) {
  return 'export { default as ' + entryName + " } from './" + entryName + ".esm.js'"
}
function build() {
  return __awaiter(this, void 0, void 0, function () {
    var exportEntries, svgs, _i, svgs_1, svg, _a, _b, _c, _d, svgs_2, svg, _e, _f, _g
    return __generator(this, function (_h) {
      switch (_h.label) {
        case 0:
          exportEntries = []
          return [4 /*yield*/, util_1.promisify(fs_1.readdir)(outlinedDir)]
        case 1:
          svgs = _h.sent()
          ;(_i = 0), (svgs_1 = svgs)
          _h.label = 2
        case 2:
          if (!(_i < svgs_1.length)) return [3 /*break*/, 5]
          svg = svgs_1[_i]
          if (!(svg !== '.gitkeep')) return [3 /*break*/, 4]
          _b = (_a = exportEntries).push
          _c = addExportEntry
          return [4 /*yield*/, buildType('Outlined', outlinedDir, svg)]
        case 3:
          _b.apply(_a, [_c.apply(void 0, [_h.sent()])])
          _h.label = 4
        case 4:
          _i++
          return [3 /*break*/, 2]
        case 5:
          return [4 /*yield*/, util_1.promisify(fs_1.readdir)(filledDir)]
        case 6:
          svgs = _h.sent()
          ;(_d = 0), (svgs_2 = svgs)
          _h.label = 7
        case 7:
          if (!(_d < svgs_2.length)) return [3 /*break*/, 10]
          svg = svgs_2[_d]
          if (!(svg !== '.gitkeep')) return [3 /*break*/, 9]
          _f = (_e = exportEntries).push
          _g = addExportEntry
          return [4 /*yield*/, buildType('Filled', filledDir, svg)]
        case 8:
          _f.apply(_e, [_g.apply(void 0, [_h.sent()])])
          _h.label = 9
        case 9:
          _d++
          return [3 /*break*/, 7]
        case 10:
          return [
            4 /*yield*/,
            util_1.promisify(fs_1.writeFile)(
              path_1.join(targetDir, 'index.esm.js'),
              exportEntries.join('\n'),
              {
                encoding: 'utf-8'
              }
            )
          ]
        case 11:
          _h.sent()
          return [2 /*return*/]
      }
    })
  })
}
build()
//# sourceMappingURL=build.js.map
