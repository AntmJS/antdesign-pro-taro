import {
  PureComponent,
  ReactNode,
  useState,
  useContext,
  useEffect,
} from 'react'
import { message, Modal } from 'antd'
import { UniteContext } from '@antmjs/unite'
import { EMlf } from '@antmjs/trace'
import { useDidShow } from '@tarojs/taro'
import { useRecoilValue } from 'recoil'
import { monitor } from '@/trace'
import { LOGIN_CODE } from '@/constants'
import { needLoginStore } from '@/store'
import Error from '../fullScreen/error'
import Login from '../fullScreen/login'
import Loading from '../fullScreen/loading'
import './index.less'

const hackSyncWechatTitle = () => {
  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  iframe.src = '/favicon.ico'
  iframe.onload = () => {
    setTimeout(() => {
      document.body.removeChild(iframe)
    }, 10)
  }
  document.body.appendChild(iframe)
}

class ErrorBoundary extends PureComponent<{ setError: any; children: any }> {
  constructor(props: any) {
    super(props)
  }
  componentDidCatch(error: any, errorInfo: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('componentDidCatch', error, errorInfo)
    }
    monitor(EMlf.js, {
      d1: 'componentDidCatch',
      d2: JSON.stringify(error || ''),
      d3: JSON.stringify(errorInfo || ''),
    })
    const showError = {
      code: 'BoundaryError',
      message: '渲染出现了小故障',
      data: { error, errorInfo },
    }
    this.props.setError(showError)
  }

  clearError() {
    this.setState({
      error: null,
    })
  }

  render() {
    return this.props.children
  }
}

type IProps = {
  className: string
  children: ReactNode
  navTitle?: string
  loading?: any
  ignoreError?: boolean
}

export default function Index(props: IProps) {
  const { navTitle, loading, ignoreError } = props
  const ctx = useContext(UniteContext)
  const [loginStatus, setLoginStatus] = useState(false)
  const needLogin = useRecoilValue(needLoginStore)

  useDidShow(() => {
    // 设置title
    try {
      document.title = navTitle?.toString?.() || ''
    } catch {
      document.title = ''
    }
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      hackSyncWechatTitle()
    }
  })

  // 异常来自于三个部分 1: Request Code 2 JSError 3: BoundaryError
  // 有初始数据但是请求接口报错了，则toast。JSError BoundaryError Login 三个直接展示全屏错误
  useEffect(() => {
    if (
      !loading &&
      ctx.error &&
      ctx.error.code !== 'JSError' &&
      ctx.error.code !== 'BoundaryError' &&
      ctx.error.code !== LOGIN_CODE
    ) {
      if (!ignoreError) {
        message.error(ctx.error.message)
      }
      ctx.setError(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.error, loading])

  useEffect(() => {
    // Login报错 直接展示全屏错误
    if ((ctx.error && ctx.error.code === LOGIN_CODE) || needLogin) {
      setLoginStatus(true)
    }
  }, [ctx, needLogin])

  function render() {
    // JSError、 BoundaryError、 没有初始数据并且报错并且不是登录错误  则全屏展示
    if (
      ctx.error?.code === 'JSError' ||
      ctx.error?.code === 'BoundaryError' ||
      (loading && ctx.error && ctx.error?.code !== LOGIN_CODE)
    ) {
      if (ignoreError || needLogin) return <></>
      return <Error error={ctx.error} />
    }
    if (loading) return <Loading />
    return <>{props.children}</>
  }

  return (
    <ErrorBoundary setError={ctx.setError}>
      <>{render()}</>
      <Modal
        visible={loginStatus}
        title="登录"
        width={'100vw'}
        className="popup-with-login"
        onCancel={async () => {
          setLoginStatus(false)
          ctx.setError(undefined)
          ctx.onRefresh()
        }}
      >
        <Login />
      </Modal>
    </ErrorBoundary>
  )
}
