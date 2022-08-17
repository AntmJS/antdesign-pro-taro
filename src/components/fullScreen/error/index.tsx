import { Button, Result } from 'antd'
import './index.less'
interface IProps {
  error: {
    code: string
    message: string
    data: any
  }
  onRefresh: () => void
  setError: React.Dispatch<
    | React.SetStateAction<{
        code: string
        message: string
        data: any
      }>
    | undefined
  >
}

export default function Index(props: IProps) {
  const { error } = props

  const clearError = async function () {
    location.reload()
  }

  return (
    <div className="components-fullScreen-error">
      <Result
        status="error"
        title={error.code}
        subTitle={error.message}
        extra={
          <Button onClick={clearError} type="primary">
            刷新
          </Button>
        }
      />
    </div>
  )
}
