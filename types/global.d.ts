/// <reference types="@tarojs/taro" />
/// <reference types="@tarojs/taro-h5" />
/// <reference types="antd" />

declare module '*.png'
declare module '*.gif'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.svg'
declare module '*.css'
declare module '*.less'
declare module '*.scss'
declare module '*.sass'
declare module '*.styl'
declare module 'cos-wx-sdk-v5'

declare interface IError {
  code: string
  message: string
  data?: any
}

declare type CreateFetchResponse<T> = {
  code: string
  header?: any
  data?: T
  message?: string
}

declare type MergerSettingsType<T> = Partial<T> & {
  primaryColor?: string
  colorWeak?: boolean
}

declare type TableListPagination = {
  total?: number
  pageSize?: number
  current?: number
}

declare type SortOrder = 'descend' | 'ascend' | null

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'production' | 'development'
    TARO_ENV: 'h5'
    API_ENV: 'stable' | 'real' | 'pre' | 'dev'
    WATCHING: 'true' | 'false'
    DEPLOY_VERSION: string
  }
}
