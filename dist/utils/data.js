"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genSideBar = exports.genTopMenu = void 0;
const path_1 = require("./path");
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
// 对 nav 进行简单排序
const handleNavSort = (nav) => nav.forEach(n => {
    if (n.items)
        handleNavSort(n.items);
    nav.sort((n1, n2) => (n1.text > n2.text ? 1 : -1));
});
const isDir = (menuPath) => {
    if (!menuPath)
        return false;
    const stat = fs.statSync(menuPath);
    return stat.isDirectory();
};
const filterNames = ['.vuepress', 'readme.md', '.git', 'node_modules'];
const filterNameFunc = (options) => (d) => {
    var _a;
    return (!filterNames.includes(d.toLowerCase()) &&
        !((_a = options.excludeDirNames) === null || _a === void 0 ? void 0 : _a.includes(d)) &&
        !d.endsWith('.js') &&
        !d.endsWith('.html') &&
        !d.endsWith('.png') &&
        !d.endsWith('.pdf'));
};
// 生成顶部导航栏数据
const genTopMenu = (sourceDir, options) => {
    const filenames = fs.readdirSync(sourceDir);
    const topMenus = filenames.filter(filterNameFunc(options)).map(filename => ({
        text: filename,
        link: (0, path_1.padWithSlash)(filename)
    }));
    return topMenus;
};
exports.genTopMenu = genTopMenu;
const getSubMenus = (options) => (dirName, sourceDir) => {
    const filePath = path.join(sourceDir, dirName);
    const fileNames = fs.readdirSync(filePath);
    return fileNames.filter(filterNameFunc(options)).map(filename => {
        const tmpPath = path.resolve(sourceDir, dirName, filename);
        if (isDir(tmpPath)) {
            const obj = Object.create(null);
            obj.title = filename;
            obj.collapsable = true;
            //prettier-ignore
            obj.children = getSubMenus(options)(path.join(dirName, filename), sourceDir);
            return obj;
        }
        else
            return `${(0, path_1.padWithSlash)(dirName)}${filename}`;
    });
};
// 生成边栏目录数据
const genSideBar = (sourceDir, options) => {
    const sideBarData = Object.create(null);
    const filenames = fs.readdirSync(sourceDir);
    filenames.filter(filterNameFunc(options)).forEach(filename => {
        sideBarData[(0, path_1.padWithSlash)(filename)] = getSubMenus(options)(filename, sourceDir);
    });
    return sideBarData;
};
exports.genSideBar = genSideBar;
