import { Page, PageFrontmatter } from 'vuepress-types'

export type ArraySortFn<T> = (pageA: T, pageB: T) => number
export type ArrayMapFn<T> = (value: T, index: number, array: T[]) => any[]

export enum VuePressVersion {
  V1 = 'v1',
  V2 = 'v2'
}

interface AutoSidebarPageFrontmatter {
  autoPrev?: string
  autoNext?: string
  autoGroup?: string
  autoIgnore?: boolean
}

export interface AutoSidebarPage extends Partial<Page> {
  relativePath: string
  filePath?: string // v2
  menuPath: string
  frontmatter: PageFrontmatter & AutoSidebarPageFrontmatter
  date: string
  filename: string
  createdTime: number
  gitStatus?: 'add' | 'commit' // v2
}

type SIDEBAR_OPTIONS_SORT =
  | 'asc' // 升序
  | 'desc' // 降序
  | 'custom' // 自定义
  | 'created_time_asc' // 时间升序
  | 'created_time_desc' // 时间降序

type SIDEBAR_OPTIONS_TITLE =
  | 'default'
  | 'lowercase'
  | 'uppercase'
  | 'capitalize'
  | 'camelcase'
  | 'kebabcase'
  | 'titlecase'

interface IgnoreOption {
  menu: string
  regex?: RegExp
}

export type IgnoreOptions = IgnoreOption[]

export interface SortOptions {
  mode?: SIDEBAR_OPTIONS_SORT
  fn?: ArraySortFn<AutoSidebarPage>
  readmeFirst: boolean
  readmeFirstForce?: boolean
  // sortKey: keyof AutoSidebarPage
}

interface TitleMap {
  [key: string]: string
}

export interface TitleOptions {
  mode: SIDEBAR_OPTIONS_TITLE
  map: TitleMap
}

export interface CollapseOptions {
  open?: boolean
  collapseList?: string[]
  uncollapseList?: string[]
}

interface OutputOptions {
  filename: string
}

interface GitOptions {
  trackStatus: 'all' | 'add' | 'commit'
}

export interface AutoSidebarPluginOptions {
  version: VuePressVersion
  output: OutputOptions
  sort: SortOptions
  title: TitleOptions
  sidebarDepth: number
  collapse: CollapseOptions
  ignore: IgnoreOptions
  git: GitOptions
}

export interface GroupPagesResult {
  [key: string]: AutoSidebarPage[]
}

export interface SidebarGroupResult {
  [key: string]: {
    title: string
    collapsable: boolean
    sidebarDepth: number
    children: string[]
  }[]
}

interface Navbar {
  text: string
  link?: string
  items?: Navbar[]
}

export type NavbarResult = Navbar[]

export interface BuiltInSortRules {
  [key: string]: ArraySortFn<AutoSidebarPage>
}

export interface BuiltInTitleRules {
  default: (str: string) => string
  lowercase: (str: string) => string
  uppercase: (str: string) => string
  capitalize: (str: string[]) => string
  camelcase: (str: string) => string
  kebabcase: (str: string) => string
  titlecase: (str: string) => string
}

export interface TopMenu {
  text: string
  link: string
}
export type SideMenu = SideMenuData | string
export interface SideMenuData {
  title: string
  collapsable?: boolean
  children?: SideMenu[] | string[]
}
export interface SideMenuObj {
  [prop: string]: SideMenu[]
}

export interface AutomenuOptions {
  excludeDirNames?: string[]
  force?: boolean
}
