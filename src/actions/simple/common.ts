import { createFetch } from '@/utils/request'
import { IResponseData } from './commonTypes/response.d'

export const getRoleListCommon = createFetch<any, IResponseData<any>>(
  '/box/common/1.0/role/list',
  'GET',
)
export const getMenuListCommon = createFetch<any, IResponseData<any>>(
  '/box/common/1.0/role/list',
  'GET',
)
export const getUserInfoCommon = createFetch<any, IResponseData<any>>(
  '/box/common/1.0/role/list',
  'GET',
)

export const loginCommon = createFetch<any, IResponseData<any>>(
  '/box/common/1.0/login',
  'POST',
)
export const getFakeCaptcha = createFetch<any, IResponseData<any>>(
  '/box/common/1.0/login',
  'POST',
)
