import { getSystemInfo } from '@tarojs/taro'
import { cacheGet, cacheSet } from '@/cache'

export function setSysInfoAsync(force = false) {
  if (force) {
    getSystemInfo({
      success(sysInfo) {
        cacheSet({
          key: 'sysInfo',
          data: sysInfo,
        })
      },
    })
  } else {
    cacheGet({ key: 'sysInfo' }).then((si) => {
      if (!si) {
        getSystemInfo({
          success(sysInfo) {
            cacheSet({
              key: 'sysInfo',
              data: sysInfo,
            })
          },
        })
      }
    })
  }
}

export function randomNum(min: number, max: number) {
  return Math.floor(Math.random() * (max + 1 - min) + min)
}

export function bound(
  position: number,
  min: number | undefined,
  max: number | undefined,
) {
  let ret = position
  if (min !== undefined) {
    ret = Math.max(position, min)
  }
  if (max !== undefined) {
    ret = Math.min(ret, max)
  }
  return ret
}

export function rubberband(
  distance: number,
  dimension: number,
  constant: number,
) {
  return (distance * dimension * constant) / (dimension + constant * distance)
}

export function rubberbandIfOutOfBounds(
  position: number,
  min: number,
  max: number,
  dimension: number,
  constant = 0.15,
) {
  if (constant === 0) return bound(position, min, max)
  if (position < min)
    return -rubberband(min - position, dimension, constant) + min
  if (position > max)
    return +rubberband(position - max, dimension, constant) + max
  return position
}

export const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time))
