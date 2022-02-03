import { Context } from 'vuepress-types'
import { red } from 'colors'
import { existsSync, writeFileSync } from 'fs'
import { join } from 'path'
import { AutoSidebarPluginOptions } from './types'
import { genTopMenu, genSideBar } from './utils/data'

const MENU_FILE_NAME = 'topMenu'
const SIDEBAR_FILE_NAME = 'sideBar'

const AutoMenuPlugin = (options: AutoSidebarPluginOptions, ctx: Context) => {
  return {
    name: 'vuepress-plugin-auto-sidebar',
    // v1 生命周期
    enhanceAppFiles() {
      const sideBarFilePath = `${ctx.sourceDir}/.vuepress/${SIDEBAR_FILE_NAME}.js`
      const topMenuFilePath = `${ctx.sourceDir}/.vuepress/${MENU_FILE_NAME}.js`
      if (existsSync(sideBarFilePath) && existsSync(topMenuFilePath))
        return {
          //prettier-ignore
          content: `export default ({ siteData, options }) => {
          siteData.themeConfig.sidebar = ${JSON.stringify( require(sideBarFilePath) )};
          siteData.themeConfig.nav = ${JSON.stringify( require(topMenuFilePath) )};
          }`,
          name: 'automenu-enhance'
        }
    },
    // v1
    extendCli(cli: any) {
      cli
        .command('automenu [targetDir]', '生成导航栏（generate nav file）')
        .option(
          '-f, --force',
          `强制覆盖已存在的 ${MENU_FILE_NAME}.js 和 ${SIDEBAR_FILE_NAME}.js 文件（Forcibly overwrite the existing ${MENU_FILE_NAME}.js and ${SIDEBAR_FILE_NAME}.js file）`
        )
        .action((dir: string, options: any) => {
          options.topMenuLevels = options.topMenuLevels || 1
          //prettier-ignore
          const sideBar = join(ctx.sourceDir, `.vuepress/${SIDEBAR_FILE_NAME}.js`)
          //prettier-ignore
          const menu = join(ctx.sourceDir, `.vuepress/${MENU_FILE_NAME}.js`)

          if (options.force || (!existsSync(sideBar) && !existsSync(menu))) {
            const topMenuData = genTopMenu(ctx.sourceDir, options)
            const sideBarData = genSideBar(ctx.sourceDir, options)
            writeFileSync(
              sideBar,
              `module.exports = ${JSON.stringify(sideBarData, null, 2)};`
            )
            writeFileSync(
              menu,
              `module.exports = ${JSON.stringify(topMenuData, null, 2)};`
            )

            console.log(`已在 ${menu} 生成 ${MENU_FILE_NAME} 配置文件`)
            console.log(`已在 ${sideBar} 生成 ${SIDEBAR_FILE_NAME} 配置文件`)
          } else {
            const errInfo = ''
            if (existsSync(sideBar)) {
              console.error(
                red(
                  `Error: ${errInfo} 已存在文件，可使用 vuepress automenu ${dir} -f 覆盖配置文件`
                )
              )
              return false
            }
            if (existsSync(menu)) {
              console.error(
                red(
                  `Error: ${errInfo} 已存在文件，可使用 vuepress automenu ${dir} -f 覆盖配置文件`
                )
              )
              return false
            }
          }
        })
    }
  }
}

module.exports = AutoMenuPlugin
