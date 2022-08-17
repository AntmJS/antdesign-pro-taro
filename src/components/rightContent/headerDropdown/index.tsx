import type { DropDownProps } from 'antd/es/dropdown'
import { Dropdown } from 'antd'
import React from 'react'
import './index.less'

export type HeaderDropdownProps = {
  overlayClassName?: string
  overlay: React.ReactNode | (() => React.ReactNode) | any
  placement?:
    | 'bottomLeft'
    | 'bottomRight'
    | 'topLeft'
    | 'topCenter'
    | 'topRight'
    | 'bottomCenter'
} & Omit<DropDownProps, 'overlay'>

const HeaderDropdown: React.FC<HeaderDropdownProps> = ({
  overlayClassName: cls,
  ...restProps
}) => (
  <Dropdown
    overlayClassName={`components-rightcontent-headerdropdown' ${cls || ''}`}
    {...restProps}
  />
)

export default HeaderDropdown
