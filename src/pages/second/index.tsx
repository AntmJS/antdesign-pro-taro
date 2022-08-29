import { Unite } from '@antmjs/unite'
import { getRoleListCommon } from '@/actions/simple/common'
import Container from '@/components/container'
// import { petClient } from '@/actions/swagger/petstore'
import './index.less'

export default Unite(
  {
    state: {
      info: null,
    },
    async onLoad() {
      // const datap = await petClient.addPet({
      //   body: { name: 'xx', photoUrls: ['xxx'] },
      // })
      const data = await getRoleListCommon({})
      this.setState({
        info: data,
      })
    },
  },
  function ({ state }) {
    const { info } = state
    // 可以将hooks的数据传递到实例上面，可以通过this.hooks['xxx']获取到，不过hooks是异步的，所以在不同的阶段取值有可能取不到，这是由业务决定的
    return (
      <Container navTitle="two" className="pages-second-index" loading={!info}>
        kkkkkkkkkkk
      </Container>
    )
  },
  { page: true },
)
