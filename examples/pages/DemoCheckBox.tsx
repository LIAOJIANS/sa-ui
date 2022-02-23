//@ts-nocheck

import { defineComponent, reactive } from "vue";
import DemoContainer from '../components/container'
import { SaCheckbox, SaButton, SaCheckboxGroup } from 'sa-ui'


export default defineComponent({

  setup(props) {

    const state = reactive({
      initInfo: {
        checkboxStatus1: false,
        checkboxStatus2: false,
        describe: '单独使用可以表示两种状态之间的切换，写在标签中的内容为 checkbox 按钮后的介绍。',
        codeText: `
        import { defineComponent, reactive } from "vue";
        import { SaCheckbox, SaButton } from 'sa-ui'
        export default defineComponent({

          setup(props) {

            const state = reactive({
              initInfo: {
                checkboxStatus1: false,
                checkboxStatus2: false,
              }

            })
            return () => <div>
              <SaButton onClick={() => state.initInfo.checkboxStatus1 = !state.initInfo.checkboxStatus1}>{
                state.initInfo.checkboxStatus1 ? '点我选中' : '点我取消'
              }</SaButton>
              <SaCheckbox v-model={state.initInfo.checkboxStatus1} label="测试"></SaCheckbox>
              {/* 自定义内容 */}
              <SaCheckbox v-model={state.initInfo.checkboxStatus2}>
                <SaButton mode="plain">我是自定义内容</SaButton>
              </SaCheckbox>

            </div>
          }
        })
        `
      },

      disabled: {
        checkboxStatus1: false,
        checkboxStatus2: false,
        checkAll: [],
        describe: '多选框不可用状态。',
        codeText: `
        <SaCheckbox v-model={state.disabled.checkboxStatus1} disabled label='测试'></SaCheckbox>
        <SaCheckbox style={{ marginLeft: '10px' }} v-model={state.disabled.checkboxStatus2} disabled>
          <SaButton mode="plain">我是自定义内容</SaButton>
        </SaCheckbox>
        `
      },

      checkboxGroup: {
        checkAll:[2, 1],
        val1: '',
        describe: '适用于多个勾选框绑定到同一个数组的情景，通过是否勾选来表示这一组选项中选中的项。',
        codeText: `
        import { defineComponent, reactive } from "vue";
        import { SaCheckbox, SaCheckboxGroup } from 'sa-ui'
        export default defineComponent({

          setup(props) {

            const state = reactive({
              checkboxGroup: {
                checkAll:[2, 1]
              }

            })
            return () => <div>
              <SaCheckboxGroup v-model={ state.checkboxGroup.checkAll }>
                <SaCheckbox label="全选" checkboxForAll />
                {
                  ['苹果', '西瓜', '黄瓜'].map((c, i) => <SaCheckbox label={ c } value={ i } key={ i } />)
                }
              </SaCheckboxGroup>
            </div>
          }
        })
        `
      }

    })
    return () => <div>
      <h1 style={{ color: '#333' }}>checkbox 复选框</h1>
      <span style={{ color: '#666', fontSize: '14px' }}>复选框操作主要用于多选</span>

      <DemoContainer
        label="基本用法"
        describe={state.initInfo.describe}
        codeText={state.initInfo.codeText}
      >
        <div slot="title">
          <SaButton onClick={() => state.initInfo.checkboxStatus1 = !state.initInfo.checkboxStatus1}>{
            state.initInfo.checkboxStatus1 ? '点我选中' : '点我取消'
          }</SaButton>
          <p style={{ margin: '10px 0' }}></p>
          <SaCheckbox v-model={state.initInfo.checkboxStatus1} label={ `测试${state.initInfo.checkboxStatus1}` }></SaCheckbox>
          <p style={{ margin: '10px 0' }}>自定义内容：优先级别label 大于 slot</p>
          <SaCheckbox v-model={state.initInfo.checkboxStatus2}>
            <SaButton mode="plain">我是自定义内容</SaButton>
          </SaCheckbox>
        </div>
      </DemoContainer>

      <DemoContainer
        label="禁用状态"
        describe={state.disabled.describe}
        codeText={state.disabled.codeText}
      >
        <div slot="title">
          <p style={{ margin: '10px 0' }}></p>
          <SaCheckbox v-model={state.disabled.checkboxStatus1} disabled label={ `测试` }></SaCheckbox>
          <SaCheckbox style={{ marginLeft: '10px' }} v-model={state.disabled.checkboxStatus2} disabled>
            <SaButton mode="plain">我是自定义内容</SaButton>
          </SaCheckbox>
        </div>
      </DemoContainer>

      <DemoContainer
        label="复选框组"
        describe={state.checkboxGroup.describe}
        codeText={state.checkboxGroup.codeText}
      >
        <div slot="title">
          <p>{ JSON.stringify(state.checkboxGroup.checkAll) }</p>
          <SaCheckboxGroup v-model={ state.checkboxGroup.checkAll }>
            <SaCheckbox label="全选" checkboxForAll />
            {
              ['苹果', '西瓜', '黄瓜'].map((c, i) => <SaCheckbox label={ c } value={ i } key={ i } />)
            }
          </SaCheckboxGroup>
        </div>
      </DemoContainer>

    </div>
  }
})