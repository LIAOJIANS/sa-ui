// @ts-nocheck

import { defineComponent, reactive, ref } from "vue";
import { SaPopper, SaButton, SaDrawerCard, SaInput, SaTitle, SaIcon } from 'sa-ui'


export default defineComponent({
  setup() {

    const popperState = ref(false)


    const state = reactive({
      showContent: false,
      inputValue: ''
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
            message="我是我啊"
            title="你是你啊"
            placement="left-start"
          >
            <p style={{ width: '200px'}}>1111111</p>
          </SaPopper>



          <SaPopper
            message="你是我啊"
            title="1111"
            tirgger="click"
            placement="right-center"
          >
            <SaButton status="primary" >click激活</SaButton>
          </SaPopper>


          <SaPopper
           placement="top-center"
           tirgger="click"
            v-slots={{
              default: () => <SaButton status="primary"  >自定义popper</SaButton>,
              head: () => <> <div>
                <SaTitle
                  direction='left'
                  mode='hline'
                >
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                    <p>请输入时间</p>
                    <SaIcon icon="el-icon-circle-plus" />
                  </div>
                </SaTitle>
              </div> </>,
              popper: () => <>
                <SaInput
                  v-model={state.inputValue}
                  type='time'
                />
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