import { NavbarResult, SideMenu, SideMenuData } from '../types'
import { padWithSlash } from './path'
import * as fs from 'fs-extra'
import * as path from 'path'
import { TopMenu } from '../types/index'

// 对 nav 进行简单排序
const handleNavSort = (nav: NavbarResult) =>
  nav.forEach(n => {
    if (n.items) handleNavSort(n.items)

    nav.sort((n1, n2) => (n1.text > n2.text ? 1 : -1))
  })

const isDir = (menuPath: string): boolean => {
  if (!menuPath) return false
  const stat = fs.statSync(menuPath)
  return stat.isDirectory()
}

const filterNames = ['.vuepress', 'readme.md', '.git', 'node_modules']

const filterNameFunc = (d: string) => {
  return (
    !filterNames.includes(d.toLowerCase()) &&
    !d.endsWith('.js') &&
    !d.endsWith('.html') &&
    !d.endsWith('.png') &&
    !d.endsWith('.pdf')
  )
}

// 生成顶部导航栏数据
export const genTopMenu = (sourceDir: string, options: any): TopMenu[] => {
  const filenames = fs.readdirSync(sourceDir)
  const topMenus = filenames.filter(filterNameFunc).map(filename => ({
    text: filename,
    link: padWithSlash(filename)
  }))
  return topMenus
}

const getSubMenus = (dirName: string, sourceDir: string): SideMenu[] => {
  const filePath = path.join(sourceDir, dirName)
  const fileNames = fs.readdirSync(filePath)
  return fileNames.filter(filterNameFunc).map(filename => {
    const tmpPath = path.resolve(sourceDir, dirName, filename)
    if (isDir(tmpPath)) {
      const obj: SideMenuData = Object.create(null)
      obj.title = filename
      obj.collapsable = true
      //prettier-ignore
      obj.children = getSubMenus(path.join(dirName, filename), sourceDir)
      return obj
    } else return `${padWithSlash(dirName)}${filename}`
  })
}

// 生成边栏目录数据
export const genSideBar = (sourceDir: string, options: any): SideMenu[] => {
  const sideBarData = Object.create(null)
  const filenames = fs.readdirSync(sourceDir)
  filenames.filter(filterNameFunc).forEach(filename => {
    sideBarData[padWithSlash(filename)] = getSubMenus(filename, sourceDir)
  })
  return sideBarData
}
