import type { BasicLayoutProps, MenuDataItem } from '@ant-design/pro-components'
import { HeartOutlined, SmileOutlined } from '@ant-design/icons'
import { ConfigProvider, message } from 'antd'
import { ProLayout } from '@ant-design/pro-components'
import { useEffect } from 'react'
import { RecoilRoot, useRecoilState, useSetRecoilState } from 'recoil'
import {
  useDidShow,
  useDidHide,
  nextTick,
  getCurrentInstance,
} from '@tarojs/taro'
import { history, reLaunch } from '@tarojs/router'
import moment from 'moment'
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from 'antd/es/locale/zh_CN'
import 'moment/locale/zh-cn'
import { setSysInfoAsync } from '@/utils'
import { getMenuListCommon, getUserInfoCommon } from '@/actions/simple/common'
import Footer from '@/components/footer'
import Loading from '@/components/fullScreen/loading'
import RightContent from '@/components/rightContent'
import { Index_Page } from './constants/config'
import { userStore, needLoginStore } from './store'
import './cache'
import './app.less'
import { LOGIN_CODE } from './constants'

let cachePages
const IconMap = {
  smile: <SmileOutlined />,
  heart: <HeartOutlined />,
}

// eslint-disable-next-line import/no-named-as-default-member
moment.locale('zh-cn')

function IndexCom(props: any) {
  const [user, setUser] = useRecoilState(userStore)
  const setNeedLoginStore = useSetRecoilState(needLoginStore)

  useEffect(() => {
    getUserInfoCommon({}, 'info').then((res) => {
      if (res.code === '200') {
        setUser({
          id: 1,
          name: '测试',
          phone: '18765676676',
          avatar:
            'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
        })
      } else if (res.code === LOGIN_CODE) {
        setNeedLoginStore(true)
      } else {
        message.error(res.message)
      }
    })
    return function () {
      // 这个暂时不确定会不会触发
      console.log('app unlaunch')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const loopMenuItem = (menus: MenuDataItem[]): MenuDataItem[] =>
    menus.map(({ icon, routes, ...item }) => ({
      ...item,
      icon: icon && IconMap[icon as string],
      routes: routes && loopMenuItem(routes),
    }))

  const layout: BasicLayoutProps = {
    rightContentRender: () => <RightContent />,
    footerRender: () => <Footer />,
    onPageChange: (location) => {
      if (!cachePages) {
        const ins = getCurrentInstance()
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        cachePages = ins.app?.config?.pages
      }

      if (cachePages && !cachePages.includes(location.pathname.substring(1))) {
        reLaunch({
          url: Index_Page,
        })
      }
    },
    locale: 'zh-CN',
    disableContentMargin: false,
    waterMarkProps: {
      content: user?.name,
    },
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    navTheme: 'light',
    pure: false,
    // 拂晓蓝
    primaryColor: '#1890ff',
    layout: 'mix',
    contentWidth: 'Fluid',
    fixedHeader: false,
    fixSiderbar: true,
    colorWeak: false,
    title: 'Ant Design Pro',
    logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
    iconfontUrl: '',
    menu: {
      request: async () => {
        const res = await getMenuListCommon({}, 'info')
        if (res.code === '200') {
          res.data = [
            {
              path: '/pages/index/index',
              name: 'one',
              icon: 'smile',
            },
            {
              path: '/pages/second/index',
              name: 'two',
              icon: 'heart',
            },
          ]
          return loopMenuItem(res.data)
        } else {
          return []
        }
      },
    },
    history: history,
    menuItemRender: (item, dom) => (
      <a
        onClick={() => {
          reLaunch({ url: item.path || Index_Page })
        }}
      >
        {dom}
      </a>
    ),
  }

  return (
    <ProLayout {...layout}>
      {props.children.props.children.length === 0 ? (
        <Loading />
      ) : (
        props.children
      )}
    </ProLayout>
  )
}

export default function App(props: any) {
  // 可以使用所有的 React Hooks
  useEffect(() => {
    console.log('app launch')
    return function () {
      // 这个暂时不确定会不会触发
      console.log('app unlaunch')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 对应 onShow
  useDidShow(() => {
    nextTick(() => {
      setSysInfoAsync()
    })
  })

  // 对应 onHide
  useDidHide(() => {
    console.log('app hide')
  })

  return (
    // 在入口组件不会渲染任何内容，但我们可以在这里做类似于状态管理的事情
    <RecoilRoot>
      <ConfigProvider locale={zhCN}>
        <IndexCom>{props.children}</IndexCom>
      </ConfigProvider>
    </RecoilRoot>
  )
}
