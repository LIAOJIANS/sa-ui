import { defineComponent, reactive, ref } from "vue";
import { SaPopper, SaButton, SaDrawerCard } from 'sa-ui'


export default defineComponent({
  setup() {

    const popperState = ref(false)


    const state = reactive({
      showContent: false
    })

    const handler = {
      showPopper: () => {
        popperState.value = true
      }
    }

    return () => <div>

      <SaDrawerCard
        animation
        title={`${state.showContent ? '收起代码' : '展开代码'}`}
        showContent={state.showContent}
        onClickBclokTitle={(showContent: boolean) => state.showContent = !showContent}
      >

        <div slot="title">
          <SaPopper
            v-model={popperState.value}
            message="我是我啊"
            title="你是你啊"
          >
            <SaButton mode="plain" onClick={handler.showPopper}>hover激活</SaButton>
          </SaPopper>

          <SaPopper
            message="你是我啊"
            title="1111"
          >
            <SaButton status="primary">click激活</SaButton>
          </SaPopper>

          <SaPopper
            v-slots={{
              default: () => <SaButton status="primary">自定义popper</SaButton>,
              head: () => <> <SaButton status="primary">自定义头部</SaButton> </>,
              popper: () => <>

              </>
            }}
          >
            <div>
              1
            </div>
          </SaPopper>

        </div>
        <div slot="content" style={{ padding: '20px' }}>
          代码
        </div>
      </SaDrawerCard>
    </div>
  }
})