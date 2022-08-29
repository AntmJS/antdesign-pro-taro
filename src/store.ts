import { atom, RecoilState } from 'recoil'

export interface IUserStore {
  id: number
  name: string
  phone: string
  avatar: string
}

// 和UI有关的全局数据存储在这里，和UI无关的全局数据存储在cache.ts文件中

export const userStore = atom({
  key: 'userStore',
  default: undefined,
}) as RecoilState<IUserStore | undefined>

export const needLoginStore = atom({
  key: 'needLoginStore',
  default: false,
}) as RecoilState<boolean>
