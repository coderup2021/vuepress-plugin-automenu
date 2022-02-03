"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterRootMarkdowns = exports.getMenuPath = exports.padWithSlash = void 0;
// 在 path 前后补全 `/`
const padWithSlash = (path) => `${path.startsWith('/') ? '' : '/'}${path}${path.endsWith('/') ? '' : '/'}`;
exports.padWithSlash = padWithSlash;
// 获取除文件名外的 path
const getMenuPath = (path) => (0, exports.padWithSlash)(path.split('/').slice(0, -1).join('/'));
exports.getMenuPath = getMenuPath;
// 过滤根节点的 path
const filterRootMarkdowns = (page) => page.menuPath !== '//';
exports.filterRootMarkdowns = filterRootMarkdowns;
