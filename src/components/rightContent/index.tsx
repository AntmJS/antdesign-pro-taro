import type { ItemType } from 'antd/lib/menu/hooks/useItems'
import type { MenuInfo } from 'rc-menu/lib/interface'
import { LogoutOutlined } from '@ant-design/icons'
import { Avatar, Menu, Spin, Space } from 'antd'
import React, { useCallback } from 'react'
import { useRecoilValue } from 'recoil'
import { userStore } from '@/store'
import { cacheRemove } from '@/cache'
import HeaderDropdown from './headerDropdown'
import './index.less'

export type GlobalHeaderRightProps = {
  menu?: boolean
}

const RightContent: React.FC<GlobalHeaderRightProps> = () => {
  const currentUser = useRecoilValue(userStore)
  const onMenuClick = useCallback((event: MenuInfo) => {
    const { key } = event
    if (key === 'logout') {
      cacheRemove({ key: 'token' })
      location.reload()
      return
    }
  }, [])

  const loading = (
    <span className={`action account`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  )

  if (!currentUser || !currentUser.name) {
    return loading
  }

  const menuItems: ItemType[] = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ]

  const menuHeaderDropdown = (
    <Menu
      className={'menu'}
      selectedKeys={[]}
      onClick={onMenuClick}
      items={menuItems}
    />
  )

  return (
    <div className="components-rightcontent">
      <Space className="right">
        <HeaderDropdown overlay={menuHeaderDropdown}>
          <span className={'action account'}>
            <Avatar
              size="small"
              className={'avatar'}
              src={currentUser.avatar}
              alt="avatar"
            />
            <span className={`name anticon`}>{currentUser.name}</span>
          </span>
        </HeaderDropdown>
      </Space>
    </div>
  )
}

export default RightContent
