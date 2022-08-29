import { FC, useState } from 'react'
import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons'
import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components'

import { Alert, message, Tabs } from 'antd'
import { cacheSetSync } from '@/cache'
import { loginCommon, getFakeCaptcha } from '@/actions/simple/common'
import './index.less'

const LoginMessage: React.FC<{
  content: string
}> = (props) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      // eslint-disable-next-line react/prop-types
      message={props.content}
      type="error"
      showIcon
    />
  )
}

const Login: FC = (_props) => {
  const [userLoginState, setUserLoginState] = useState<any>({})
  const [type, setType] = useState<string>('account')

  const handleSubmit = async (values: any) => {
    try {
      // 登录
      const hideLoading = message.loading('登录中...')
      const res = await loginCommon({ ...values, type }, 'info')
      hideLoading()
      if (res.code === '200') {
        const defaultLoginSuccessMessage = '登录成功！'
        message.success(defaultLoginSuccessMessage)
        cacheSetSync('token', res.data.token)
        location.reload()
        return
      }

      // 如果失败去设置用户错误信息
      setUserLoginState({
        status: 'error',
        type: type,
      })
    } catch (error) {
      const defaultLoginFailureMessage = '登录失败，请重试！'
      message.error(defaultLoginFailureMessage)
    }
  }
  const { status, type: loginType } = userLoginState

  return (
    <div className="pages-login-index">
      <div className="content">
        <LoginForm
          logo={
            <img
              alt="logo"
              src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
            />
          }
          title="Ant Design"
          subTitle={'Ant Design 是西湖区最具影响力的 Web 设计规范'}
          initialValues={{
            autoLogin: true,
          }}
          actions={[
            <span key={'other'}>其他登录方式</span>,
            <AlipayCircleOutlined
              key="AlipayCircleOutlined"
              className="icon"
            />,
            <TaobaoCircleOutlined
              key="TaobaoCircleOutlined"
              className="icon"
            />,
            <WeiboCircleOutlined key="WeiboCircleOutlined" className="icon" />,
          ]}
          onFinish={async (values) => {
            await handleSubmit(values)
          }}
        >
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane key="account" tab={'账户密码登录'} />
            <Tabs.TabPane key="mobile" tab={'手机号登录'} />
          </Tabs>

          {status === 'error' && loginType === 'account' && (
            <LoginMessage content={'账户或密码错误'} />
          )}
          {type === 'account' && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className="prefixIcon" />,
                }}
                placeholder={'用户名: '}
                rules={[
                  {
                    required: true,
                    message: '请输入用户名!',
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={'prefixIcon'} />,
                }}
                placeholder={'密码: '}
                rules={[
                  {
                    required: true,
                    message: '请输入密码！',
                  },
                ]}
              />
            </>
          )}

          {status === 'error' && loginType === 'mobile' && (
            <LoginMessage content="验证码错误" />
          )}
          {type === 'mobile' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MobileOutlined className={'prefixIcon'} />,
                }}
                name="mobile"
                placeholder={'手机号'}
                rules={[
                  {
                    required: true,
                    message: '请输入手机号！',
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: '手机号格式错误！',
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={'prefixIcon'} />,
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder={'请输入验证码'}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} 获取验证码`
                  }
                  return '获取验证码'
                }}
                name="captcha"
                rules={[
                  {
                    required: true,
                    message: '请输入验证码！',
                  },
                ]}
                onGetCaptcha={async (phone) => {
                  const res = await getFakeCaptcha(
                    {
                      phone,
                    },
                    'info',
                  )
                  if (res.code !== '200') {
                    return
                  }
                  message.success('获取验证码成功！')
                }}
              />
            </>
          )}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              自动登录
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
            >
              忘记密码
            </a>
          </div>
        </LoginForm>
      </div>
    </div>
  )
}

export default Login
