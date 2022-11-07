import { defineComponent, reactive } from "vue";
import DemoContainer from '../components/container'
import { SaProgress, SaButton, SaPopper, SaIcon } from 'sa-ui'

export default defineComponent({
  setup() {

    const state = reactive({
      num: 50,
      progressCodeText: `
        // script
        const state = reactive({ num: 50 })

        // html
        <SaButton
          icon="el-icon-jiahao"
          onClick={() => state.num += 10}
        />
        <SaButton
          icon="el-icon-minus"
          onClick={() => state.num -= 10}
        />
        <p></p>
        <SaProgress
          percentage={state.num}
        />
      `,

      nums: [
        { num: 100, status: 'primary' },
        { num: 100, status: 'success' },
        { num: 90, status: 'error' },
        { num: 80, status: 'warn' },
        { num: 70, status: 'info' },
      ],
      progressCodeText1: `
        // script
        const state = reactive({ 
          nums: [
            { num: 100, status: 'primary' },
            { num: 100, status: 'primary', },
            { num: 100, status: 'success' },
            { num: 90, status: 'error' },
            { num: 80, status: 'warn' },
            { num: 70, status: 'info' },
          ],
        })

        // html
        state.nums.map(c => (
          <SaProgress
            key={ c.status }
            percentage={c.num}
            status={ c.status }
          />
        ))
      `,

      nums1: [
        { num: 100, status: 'primary', contentFormat: (percentage: number) => <div>{ percentage }</div>  },
        { num: 90, status: 'primary', contentFormat: (percentage: number) => (
          <div style={{ width: '100px' }} >{ percentage === 100 ? '满' : `加载中。。。${percentage}` }</div>
        ) },
        { num: 100, status: 'success', contentFormat: (percentage: number) => (
          <SaPopper
            message="达到100%之后即是成功上传"
            title="提示"
            placement="top"
          >
            <p style={{ width: '100px', margin: 0 }}>成功 <SaIcon icon="el-icon-success" status="success" size={ 14 }></SaIcon></p>
          </SaPopper>
        ) },
        { num: 90, status: 'error', contentFormat: (percentage: number) => (
          <SaPopper
            message="上传中断~~~~"
            title="提示"
            placement="top"
          >
              <p style={{ width: '200px', margin: 0 }}>失败 <SaIcon icon="el-icon-error" status="error" size={ 14 }></SaIcon> <SaButton>重新上传</SaButton> </p>
          </SaPopper>
        ) },
        { num: 80, status: 'warn', contentFormat: () => <div>警告</div> },
        { num: 70, status: 'info', contentFormat: (percentage: number) => <span>{ percentage }</span> },
      ],
      progressCodeText2: `
        // script
        const state = reactive({ 
          nums: [
            { num: 100, status: 'primary' },
            { num: 100, status: 'primary', },
            { num: 100, status: 'success' },
            { num: 90, status: 'error' },
            { num: 80, status: 'warn' },
            { num: 70, status: 'info' },
          ],
        })

        // html
        state.nums.map(c => (
          <SaProgress
            key={ c.status }
            percentage={c.num}
            status={ c.status }
          />
        ))
      `
    })

    return () => (
      <>
        <h1 style={{ color: '#333' }}>Progress 进度条</h1>
        <span style={{ color: '#666', fontSize: '14px' }}>用于展示操作进度，告知用户当前状态和预期。</span>

        <DemoContainer
          label="基础用法"
          describe="Progress 基础用法"
          codeText={state.progressCodeText}
        >
          {/* @ts-ignore */}
          <div slot="title">
            <SaButton
              icon="el-icon-jiahao"
              onClick={() => state.num += 10}
            />
            <SaButton
              icon="el-icon-minus"
              onClick={() => state.num -= 10}
            />
            <p></p>
            <SaProgress
              percentage={state.num}
            />
          </div>
        </DemoContainer>

        <DemoContainer
          label="状态进度条"
          describe="Progress 各种状态进度条，提示用户当前业务的操作状态"
          codeText={state.progressCodeText1}
        >
          {/* @ts-ignore */}
          <div slot="title">
            {
              state.nums.map(c => (
                <SaProgress
                  key={ c.status }
                  percentage={c.num}
                  status={ c.status }
                />
              ))
            }
          </div>
        </DemoContainer>
        
        <DemoContainer
          label="进度条内容自定义"
          describe="Progress 的提示内容可以根据 contentFormat: () => HTMLDivElement 属性自定义内容"
          codeText={state.progressCodeText2}
        >
          {/* @ts-ignore */}
          <div slot="title">
            {
              state.nums1.map(c => (
                <SaProgress
                  key={ c.status }
                  percentage={c.num}
                  status={ c.status }
                  contentFormat={ c.contentFormat }
                />
              ))
            }
          </div>
        </DemoContainer>
      </>
    )
  }
})