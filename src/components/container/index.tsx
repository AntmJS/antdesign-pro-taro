import {
  PureComponent,
  ReactNode,
  useState,
  useContext,
  useEffect,
} from 'react'
import { message } from 'antd'
import { UniteContext, Popup } from '@antmjs/vantui'
import { EMlf } from '@antmjs/trace'
import { useDidShow } from '@tarojs/taro'
import { useRecoilValue } from 'recoil'
import { monitor } from '@/trace'
import { LOGIN_CODE } from '@/constants'
import { globalErrorStore } from '@/store'
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
  const globalError = useRecoilValue(globalErrorStore)

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
  useEffect(() => {
    if (
      !loading &&
      ctx.error &&
      ctx.error.code !== 'JSError' &&
      ctx.error.code !== 'BoundaryError'
    ) {
      if (!ignoreError) {
        message.error(ctx.error.message)
      }
      ctx.setError(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.error, loading])

  useEffect(() => {
    if (
      (loading && ctx.error && !ignoreError && ctx.error.code === LOGIN_CODE) ||
      globalError?.code === LOGIN_CODE
    ) {
      setLoginStatus(true)
    }
  }, [loading, ctx, ignoreError, globalError])

  function render() {
    if (
      loading ||
      ctx.error?.code === 'JSError' ||
      ctx.error?.code === 'BoundaryError' ||
      globalError
    ) {
      if (globalError && globalError.code === LOGIN_CODE) {
        return (
          <Error
            setError={ctx.setError as any}
            onRefresh={ctx.onRefresh}
            error={globalError}
          />
        )
      }
      if (ctx.error) {
        if (ignoreError) return <></>
        if (ctx.error.code !== LOGIN_CODE)
          return (
            <Error
              setError={ctx.setError as any}
              onRefresh={ctx.onRefresh}
              error={ctx.error}
            />
          )
      } else {
        return <Loading />
      }
    }
    return (
      <>
        <>{props.children}</>
        <Popup
          show={loginStatus}
          className="popup-with-login"
          closeIconPosition="top-right"
          position="bottom"
          closeable={false}
          safeAreaInsetTop
          style={{
            height: '100vh',
          }}
          onClose={async () => {
            setLoginStatus(false)
            ctx.setError(undefined)
            ctx.onRefresh()
          }}
        >
          <Login
            setLoginStatus={setLoginStatus}
            setError={ctx.setError as any}
            onRefresh={ctx.onRefresh}
          />
        </Popup>
      </>
    )
  }

  return (
    <ErrorBoundary setError={ctx.setError}>
      <>{render()}</>
    </ErrorBoundary>
  )
}
