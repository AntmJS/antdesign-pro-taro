import { Space, Spin } from 'antd'
import './index.less'
export default function Index() {
  return (
    <div className="loading-box">
      <Space size="middle">
        <Spin size="large" />
      </Space>
    </div>
  )
}
