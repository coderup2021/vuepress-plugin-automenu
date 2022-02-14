"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = require("colors");
const fs_1 = require("fs");
const path_1 = require("path");
const data_1 = require("./utils/data");
const MENU_FILE_NAME = 'topMenu';
const SIDEBAR_FILE_NAME = 'sideBar';
const defaultConfigOptions = {
    excludeDirNames: []
};
const AutoMenuPlugin = (configOptions = defaultConfigOptions, ctx) => {
    return {
        name: 'vuepress-plugin-auto-sidebar',
        // v1 生命周期
        enhanceAppFiles() {
            const sideBarFilePath = `${ctx.sourceDir}/.vuepress/${SIDEBAR_FILE_NAME}.js`;
            const topMenuFilePath = `${ctx.sourceDir}/.vuepress/${MENU_FILE_NAME}.js`;
            if ((0, fs_1.existsSync)(sideBarFilePath) && (0, fs_1.existsSync)(topMenuFilePath))
                return {
                    //prettier-ignore
                    content: `export default ({ siteData, options }) => {
          siteData.themeConfig.sidebar = ${JSON.stringify(require(sideBarFilePath))};
          siteData.themeConfig.nav = ${JSON.stringify(require(topMenuFilePath))};
          }`,
                    name: 'automenu-enhance'
                };
        },
        // v1
        extendCli(cli) {
            cli
                .command('automenu [targetDir]', '生成导航栏（generate nav file）')
                .option('-f, --force', `强制覆盖已存在的 ${MENU_FILE_NAME}.js 和 ${SIDEBAR_FILE_NAME}.js 文件（Forcibly overwrite the existing ${MENU_FILE_NAME}.js and ${SIDEBAR_FILE_NAME}.js file）`)
                .action((dir, options) => {
                options = Object.assign(Object.assign({}, configOptions), options);
                //prettier-ignore
                const sideBar = (0, path_1.join)(ctx.sourceDir, `.vuepress/${SIDEBAR_FILE_NAME}.js`);
                //prettier-ignore
                const menu = (0, path_1.join)(ctx.sourceDir, `.vuepress/${MENU_FILE_NAME}.js`);
                if (options.force || (!(0, fs_1.existsSync)(sideBar) && !(0, fs_1.existsSync)(menu))) {
                    const topMenuData = (0, data_1.genTopMenu)(ctx.sourceDir, options);
                    const sideBarData = (0, data_1.genSideBar)(ctx.sourceDir, options);
                    (0, fs_1.writeFileSync)(sideBar, `module.exports = ${JSON.stringify(sideBarData, null, 2)};`);
                    (0, fs_1.writeFileSync)(menu, `module.exports = ${JSON.stringify(topMenuData, null, 2)};`);
                    console.log(`已在 ${menu} 生成 ${MENU_FILE_NAME} 配置文件`);
                    console.log(`已在 ${sideBar} 生成 ${SIDEBAR_FILE_NAME} 配置文件`);
                }
                else {
                    const errInfo = '';
                    if ((0, fs_1.existsSync)(sideBar)) {
                        console.error((0, colors_1.red)(`Error: ${errInfo} 已存在文件，可使用 vuepress automenu ${dir} -f 覆盖配置文件`));
                        return false;
                    }
                    if ((0, fs_1.existsSync)(menu)) {
                        console.error((0, colors_1.red)(`Error: ${errInfo} 已存在文件，可使用 vuepress automenu ${dir} -f 覆盖配置文件`));
                        return false;
                    }
                }
            });
        }
    };
};
module.exports = AutoMenuPlugin;
