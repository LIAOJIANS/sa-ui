import { defineComponent, reactive } from "vue";

import { SaTimeLine, SaTimeLineItem, SaCard, SaRadio, SaRadioGroup, SaIcon } from 'sa-ui'
import DemoContainer from '../components/container'

export const DemoTimeLine = defineComponent({
  setup() {

    const state = reactive({
      reverse: false,
      initTimeText: `
        // script
        const state = reactive({
          reverse: false,
          activities: [{
            content: '活动按期开始',
            timestamp: '2022-04-15'
          }, {
            content: '通过审核',
            timestamp: '2022-04-13'
          }, {
            content: '创建成功',
            timestamp: '2022-04-11'
          }]
        })

        // html
        <SaRadioGroup v-model={state.reverse} style={{ marginBottom: '20px' }} >
        <SaRadio label="倒叙" value={true} />
        <SaRadio label="正序" value={false} />
        </SaRadioGroup>
        <SaTimeLine
          reverse={state.reverse}
        >
          {
            state.activities.map(c => (
              <SaTimeLineItem
                timestamp={c.timestamp}
              >
                {c.content}
              </SaTimeLineItem>
            ))
          }
        </SaTimeLine>
      `,

      activities: [{
        content: '活动按期开始',
        timestamp: '2022-04-15'
      }, {
        content: '通过审核',
        timestamp: '2022-04-13'
      }, {
        content: '创建成功',
        timestamp: '2022-04-11'
      }],

      activities1: [{
        content: '支持使用图标',
        timestamp: '2022-04-15',
        icon: 'el-icon-more',
        color: 'green'
      }, {
        content: '支持自定义颜色',
        timestamp: '2022-04-13',
        size: 'large',
        color: 'red'
      }, {
        content: '支持自定义尺寸',
        timestamp: '2022-04-11',
        size: 'large',
      },
      {
        content: '默认样式的节点',
        timestamp: '2022-04-19'
      }],

      initTimeText1: `
        // script
        const state = reactive({
          activities1: [{
            content: '支持使用图标',
            timestamp: '2022-04-15',
            icon: 'el-icon-more',
            color: 'green'
          }, {
            content: '支持自定义颜色',
            timestamp: '2022-04-13',
            size: 'large',
            color: 'red'
          }, {
            content: '支持自定义尺寸',
            timestamp: '2022-04-11',
            size: 'large',
          },
          {
            content: '默认样式的节点',
            timestamp: '2022-04-19'
          }]
        })

        // html
        <SaTimeLine>
          {
            state.activities1.map(c => (
              <SaTimeLineItem
                timestamp={c.timestamp}
                size={c.size}
                icon={ c.icon }
                color={ c.color }
              >
                {c.content}
              </SaTimeLineItem>
            ))
          }
        </SaTimeLine>
      `,

      activities2: [{
        content: '自定义Icon',
        timestamp: '2022-04-15',
        icon: (props: any) => <SaIcon icon="el-icon-caret-left" {...props} />,
        color: 'green'
      }, {
        content: '默认样式的节点',
        timestamp: '2022-04-19'
      }],

      initTimeText2: `
        // script
        const state = reactive({
          activities2: [{
            content: '自定义Icon',
            timestamp: '2022-04-15',
            icon: (props: any) => <SaIcon icon="el-icon-caret-left" {...props} />,
            color: 'green'
          }, {
            content: '默认样式的节点',
            timestamp: '2022-04-19'
          }]    
        })

        // html
        <SaTimeLine>
          {
            state.activities1.map(c => (
              <SaTimeLineItem
                timestamp={c.timestamp}
                size={c.size}
                icon={ c.icon }
                color={ c.color }
              >
                {c.content}
              </SaTimeLineItem>
            ))
          }
        </SaTimeLine>
      `,

      activities3: [{
        content: '更新 Github 模板',
        name: '小杰',
        timestamp: '2022-04-15 17:56:02',
        timestampFormat: '{Y}-{M}-{D}',
        placement: 'bottom',
      }, {
        content: '更新 Github 模板',
        name: '小杰',
        timestamp: '2022-04-15 16:56:02',
        timestampFormat: '{Y}-{M}-{D}',
        placement: 'top',
      }, {
        content: '更新 Github 模板',
        name: '小杰',
        timestamp: '2022-04-15 12:56:02',
        timestampFormat: '{Y}-{M}-{D}',
        placement: 'top',
      }],

      initTimeText3: `
        // script
        const state = reactive({
          activities3: [{
            content: '更新 Github 模板',
            name: '小杰',
            timestamp: '2022-04-15 17:56:02',
            timestampFormat: '{Y}-{M}-{D}',
            placement: 'bottom',
          }, {
            content: '更新 Github 模板',
            name: '小杰',
            timestamp: '2022-04-15 16:56:02',
            timestampFormat: '{Y}-{M}-{D}',
            placement: 'top',
          }, {
            content: '更新 Github 模板',
            name: '小杰',
            timestamp: '2022-04-15 12:56:02',
            timestampFormat: '{Y}-{M}-{D}',
            placement: 'top',
          }]  
        })

        // html
        <SaTimeLine>
          {
            state.activities3.map(c => (
              <SaTimeLineItem
                timestamp={c.timestamp}
                placement={ c.placement }
                timestampFormat={ c.timestampFormat }
              >
                <SaCard>
                  <h4>{ c.content }</h4>
                  <p>{ c.name } 提交于 { c.timestamp }</p>
                </SaCard>
              </SaTimeLineItem>
            ))
          }
        </SaTimeLine>
      `,
    })

    // timestampFormat="{Y}-{MM}-{DD} {hh}:{ii}:{ss}"
    return () => (
      <>
        <h1 style={{ color: '#333' }}>TimeLine 按钮</h1>
        <span style={{ color: '#666', fontSize: '14px' }}>可视化地呈现时间流信息。</span>
        <DemoContainer
          label="基础用法"
          describe="Timeline 可拆分成多个按照时间戳正序或倒序排列的 activity，时间戳是其区分于其他控件的重要特征，使⽤时注意与 Steps 步骤条等区分。"
          codeText={state.initTimeText}
        >
          {/* @ts-ignore */}
          <div slot="title">
            <SaRadioGroup v-model={state.reverse} style={{ marginBottom: '20px' }} >
              <SaRadio label="倒叙" value={true} />
              <SaRadio label="正序" value={false} />
            </SaRadioGroup>
            <SaTimeLine
              reverse={state.reverse}
            >
              {
                state.activities.map(c => (
                  <SaTimeLineItem
                    timestamp={c.timestamp}
                  >
                    {c.content}
                  </SaTimeLineItem>
                ))
              }
            </SaTimeLine>
          </div>
        </DemoContainer>

        <DemoContainer
          label="⾃定义节点样式"
          describe="可根据实际场景⾃定义节点尺⼨、颜⾊，或直接使⽤图标。"
          codeText={state.initTimeText1}
        >
          {/* @ts-ignore */}
          <div slot="title">
            <SaTimeLine>
              {
                state.activities1.map(c => (
                  <SaTimeLineItem
                    timestamp={c.timestamp}
                    size={c.size}
                    icon={c.icon}
                    color={c.color}
                  >
                    {c.content}
                  </SaTimeLineItem>
                ))
              }
            </SaTimeLine>
          </div>
        </DemoContainer>

        <DemoContainer
          label="自定义Icon"
          describe="可根据实际场景⾃定义节点Icon"
          codeText={state.initTimeText2}
        >
          {/* @ts-ignore */}
          <div slot="title">
            <SaTimeLine>
              {
                state.activities2.map(c => (
                  <SaTimeLineItem
                    timestamp={c.timestamp}
                    icon={c.icon}
                    color={c.color}
                  >
                    {c.content}
                  </SaTimeLineItem>
                ))
              }
            </SaTimeLine>
          </div>
        </DemoContainer>

        <DemoContainer
          label="自定义时间戳位置与时间戳格式"
          describe="可将时间戳置于内容上方，或者内容下方, 时间戳格式：{Y}-{M}-{D}"
          codeText={state.initTimeText3}
        >
          {/* @ts-ignore */}
          <div slot="title">
            <SaTimeLine>
              {
                state.activities3.map(c => (
                  <SaTimeLineItem
                    timestamp={c.timestamp}
                    placement={ c.placement }
                    timestampFormat={ c.timestampFormat }
                  >
                    <SaCard>
                      <h4>{ c.content }</h4>
                      <p>{ c.name } 提交于 { c.timestamp }</p>
                    </SaCard>
                  </SaTimeLineItem>
                ))
              }
            </SaTimeLine>
          </div>
        </DemoContainer>
      </>
    )
  }
})