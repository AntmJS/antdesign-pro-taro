import { Unite } from '@antmjs/unite'
import {
  ActionType,
  ProTable,
  TableDropdown,
  ProColumns,
} from '@ant-design/pro-components'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { useRef } from 'react'
import { Tooltip } from 'antd'
import { getRoleListCommon } from '@/actions/simple/common'
import Container from '@/components/container'
// import { petClient } from '@/actions/swagger/petstore'
import './index.less'

type TableListItem = {
  key: number
  name: string
  containers: number
  creator?: string
  status: string
  createdAt: number
  memo: string
}

const valueEnum = {
  0: 'close',
  1: 'running',
  2: 'online',
  3: 'error',
}

export default Unite(
  {
    state: {},
    async onLoad() {},
    async getTableList(
      params: Record<string, any> & {
        pageSize?: number
        current?: number
        keyword?: string
      },
      sort: Record<string, SortOrder>,
      filter: Record<string, (string | number)[] | null>,
    ) {
      console.log(params, sort, filter)
      // table的数据请求使用info模式，否则报错无法向下继续执行
      const res = await getRoleListCommon(params, 'info')
      if (res.code === '200') {
        const tableListDataSource: TableListItem[] = []

        const creators = ['付小小', '曲丽丽', '林东东', '陈帅帅', '兼某某']

        for (let i = 0; i < 5; i += 1) {
          tableListDataSource.push({
            key: i,
            name: 'AppName',
            containers: Math.floor(Math.random() * 20),
            creator: creators[Math.floor(Math.random() * creators.length)],
            status: valueEnum[Math.floor(Math.random() * 10) % 4],
            createdAt: Date.now() - Math.floor(Math.random() * 100000),
            memo:
              i % 2 === 1
                ? '很长很长很长很长很长很长很长的文字要展示但是要留下尾巴'
                : '简短备注文案',
          })
        }
        return {
          data: tableListDataSource,
          total: tableListDataSource.length,
          success: true,
        }
      } else {
        return this.setError(res as IError)
      }
    },
  },
  function ({ events }) {
    // 可以将hooks的数据传递到实例上面，可以通过this.hooks['xxx']获取到，不过hooks是异步的，所以在不同的阶段取值有可能取不到，这是由业务决定的
    const actionRef = useRef<ActionType>()
    const columns: ProColumns<TableListItem>[] = [
      {
        title: '应用名称',
        width: 80,
        dataIndex: 'name',
        render: (_) => <a>{_}</a>,
      },
      {
        title: '容器数量',
        dataIndex: 'containers',
        align: 'right',
        sorter: (a, b) => a.containers - b.containers,
      },
      {
        title: '状态',
        width: 80,
        dataIndex: 'status',
        initialValue: 'all',
        valueEnum: {
          all: { text: '全部', status: 'Default' },
          close: { text: '关闭', status: 'Default' },
          running: { text: '运行中', status: 'Processing' },
          online: { text: '已上线', status: 'Success' },
          error: { text: '异常', status: 'Error' },
        },
      },
      {
        title: '创建者',
        width: 80,
        dataIndex: 'creator',
        valueEnum: {
          all: { text: '全部' },
          付小小: { text: '付小小' },
          曲丽丽: { text: '曲丽丽' },
          林东东: { text: '林东东' },
          陈帅帅: { text: '陈帅帅' },
          兼某某: { text: '兼某某' },
        },
      },
      {
        title: (
          <>
            创建时间
            <Tooltip placement="top" title="这是一段描述">
              <QuestionCircleOutlined style={{ marginLeft: 4 }} />
            </Tooltip>
          </>
        ),
        width: 140,
        key: 'since',
        dataIndex: 'createdAt',
        valueType: 'date',
        sorter: (a, b) => a.createdAt - b.createdAt,
      },
      {
        title: '备注',
        dataIndex: 'memo',
        ellipsis: true,
        copyable: true,
      },
      {
        title: '操作',
        width: 180,
        key: 'option',
        valueType: 'option',
        render: () => [
          <a key="link">链路</a>,
          <a key="link2">报警</a>,
          <a key="link3">监控</a>,
          <TableDropdown
            key="actionGroup"
            menus={[
              { key: 'copy', name: '复制' },
              { key: 'delete', name: '删除' },
            ]}
          />,
        ],
      },
    ]
    return (
      <Container navTitle="one" className="pages-index-index">
        <ProTable<TableListItem, TableListPagination>
          headerTitle="one"
          rowKey="key"
          request={events.getTableList as any}
          actionRef={actionRef}
          columns={columns}
          cardBordered={false}
          search={{ defaultCollapsed: false }}
          toolBarRender={() => []}
        />
      </Container>
    )
  },
  { page: true },
)
