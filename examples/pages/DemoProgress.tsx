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
        { num: 100, status: 'primary', contentFormat: (percentage: number) => <div>{percentage}</div> },
        {
          num: 90, status: 'primary', contentFormat: (percentage: number) => (
            <div style={{ width: '100px' }} >{percentage === 100 ? '满' : `加载中。。。${percentage}`}</div>
          )
        },
        {
          num: 100, status: 'success', contentFormat: (percentage: number) => (
            <SaPopper
              message="达到100%之后即是成功上传"
              title="提示"
              placement="top"
            >
              <p style={{ width: '100px', margin: 0 }}>成功 <SaIcon icon="el-icon-success" status="success" size={14}></SaIcon></p>
            </SaPopper>
          )
        },
        {
          num: 90, status: 'error', contentFormat: (percentage: number) => (
            <SaPopper
              message="上传中断~~~~"
              title="提示"
              placement="top"
            >
              <p style={{ width: '200px', margin: 0 }}>失败 <SaIcon icon="el-icon-error" status="error" size={14}></SaIcon> <SaButton>重新上传</SaButton> </p>
            </SaPopper>
          )
        },
        { num: 80, status: 'warn', contentFormat: () => <div>警告</div> },
        { num: 70, status: 'info', contentFormat: (percentage: number) => <span>{percentage}</span> },
      ],
      progressCodeText2: `
        
      // script
      const state = reactive({ 
        nums: [
          { num: 100, status: 'primary', contentFormat: (percentage: number) => <div>{ percentage }</div>  },
          { num: 90, status: 'primary', contentFormat: (percentage: number) => (
            <div style={{ width: '100px' }} >{ percentage === 100 ? '满' : '加载中。。。' + percentage }</div>
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
      })

      // html
      state.nums1.map(c => (
        <SaProgress
          key={ c.status }
          percentage={c.num}
          status={ c.status }
          contentFormat={ c.contentFormat }
        />
      ))
      `,

      nums2: [
        { num: 100, color: 'red' },
        { num: 50, color: '#000' },
        { num: 80, gradients: ['#00ffd5 20%', '#008cff 80%'] },
      ],
      progressCodeText3: `
        // script
        const state = reactive({ 
          nums: [
            { num: 100, color: 'red' },
            { num: 50, color: '#000' },
            { num: 80, gradients: ['#00ffd5 20%', '#008cff 80%'] },
          ],
        })

        // html
        state.nums.map(c => (
          <SaProgress
            key={ c.color }
            percentage={c.num}
            color={ c.color }
            gradients={ c.gradients }
          />
        ))
      `,

      nums3: [
        { num: 100, color: 'red' },
        { num: 50, color: '#000' }
      ],
      progressCodeText4: `
        // script
        const state = reactive({ 
          nums: [
            { num: 100, color: 'red' },
            { num: 50, color: '#000' }
          ],
        })

        // html
        state.nums.map(c => (
          <SaProgress
            key={ c.color }
            percentage={c.num}
            color={ c.color }
            textInside
            width={ 26 }
          />
        ))
      `,

      nums4: [
        { num: 0, status: 'primary' },
        { num: 80, status: 'primary' },
        { num: 100, status: 'success' },
        { num: 40, status: 'error' },
        { num: 50, status: 'warn' },
        { num: 70, status: 'info' },
      ],
      progressCodeText5: `
        // script
        const state = reactive({ 
          nums: [
            { num: 0, status: 'primary' },
            { num: 80, status: 'primary' },
            { num: 100, status: 'success' },
            { num: 40, status: 'error' },
            { num: 50, status: 'warn' },
            { num: 70, status: 'info' },
          ],
        })

        // html
        state.nums.map(c => (
          <SaProgress
            key={c.status}
            percentage={c.num}
            status={c.status}
            type="circle"
          />
        })
      `,

      num5: 10,
      progressCodeText6: `
        // script
        const state = reactive({ 
          num5: 10,
        })

        // html
        <SaButton
          icon="el-icon-jiahao"
          onClick={() => state.num5 += 10}
        />
        <SaButton
          icon="el-icon-minus"
          onClick={() => state.num5 -= 10}
        />
        <p></p>
        <SaProgress
          type="dashboard"
          percentage={state.num5}
          status={ state.num5 > 50 && 'error' }
          contentFormat={
            (percentage: number) => (
              percentage > 50 ? (
                <SaPopper
                  message="上传中断~~~~"
                  title="提示"
                  placement="top"
                >
                  <SaIcon icon="el-icon-error" status="error" size={14}></SaIcon>
                </SaPopper>
              ) : percentage + '%'
            )
          }
        />
      `,

      nums6: [
        { num: 80, type: 'line',status: 'primary' },
        { num: 60, type: 'circle', status: 'primary' },
        { num: 100, type: 'dashboard', status: 'success' },
      ],
      progressCodeText7: `
        // script
        const state = reactive({ 
          nums: [
            { num: 80, type: 'line',status: 'primary' },
            { num: 60, type: 'circle', status: 'primary' },
            { num: 100, type: 'dashboard', status: 'success' },
          ]
        })

        // html
        state.nums.map(c => (
          <SaProgress
            key={c.status}
            percentage={c.num}
            status={c.status}
            type={ c.type }
            gradientsAnimation
          />
        })
      `,

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
                  key={c.status}
                  percentage={c.num}
                  status={c.status}
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
                  key={c.status}
                  percentage={c.num}
                  status={c.status}
                  contentFormat={c.contentFormat}
                />
              ))
            }
          </div>
        </DemoContainer>

        <DemoContainer
          label="自定义颜色"
          describe="可以通过 color 设置进度条的颜色，通过gradients 设置进度调的渐变色"
          codeText={state.progressCodeText3}
        >
          {/* @ts-ignore */}
          <div slot="title">
            {
              state.nums2.map(c => (
                <SaProgress
                  key={c.color}
                  percentage={c.num}
                  color={c.color}
                  gradients={ c.gradients }
                />
              ))
            }
          </div>
        </DemoContainer>

        <DemoContainer
          label="百分比内显"
          describe="百分比不占用额外控件，适用于文件上传等场景。"
          codeText={state.progressCodeText4}
        >
          {/* @ts-ignore */}
          <div slot="title">
            {
              state.nums3.map(c => (
                <SaProgress
                  key={c.color}
                  percentage={c.num}
                  color={c.color}
                  textInside
                  width={26}
                />
              ))
            }
          </div>
        </DemoContainer>

        <DemoContainer
          label="环形进度条"
          describe="Progress 组件可通过 type 属性来指定使用环形进度条，在环形进度条中，还可以通过 width 属性来设置其大小。"
          codeText={state.progressCodeText5}
        >
          {/* @ts-ignore */}
          <div slot="title">
            {
              state.nums4.map(c => (
                <SaProgress
                  key={c.status}
                  percentage={c.num}
                  status={c.status}
                  type="circle"
                />
              ))
            }
          </div>
        </DemoContainer>
      
        <DemoContainer
          label="仪表盘形进度条"
          describe="仪表盘形进度条"
          codeText={state.progressCodeText6}
        >
          {/* @ts-ignore */}
          <div slot="title">
            <SaButton
              icon="el-icon-jiahao"
              onClick={() => state.num5 += 10}
            />
            <SaButton
              icon="el-icon-minus"
              onClick={() => state.num5 -= 10}
            />
            <p></p>
            <SaProgress
              type="dashboard"
              percentage={state.num5}
              status={ state.num5 > 50 ? 'error' : 'primary' }
              contentFormat={
                (percentage: number) => (
                  percentage > 50 ? (
                    <SaPopper
                      message="上传中断~~~~"
                      title="提示"
                      placement="top"
                    >
                      <div style={{ marginLeft: '5px' }}><SaIcon icon="el-icon-error" status="error" size={14}></SaIcon></div>
                    </SaPopper>
                  ) : `${percentage}%`
                )
              }
            />
          </div>
        </DemoContainer>
      
        <DemoContainer
          label="开启进度条动画"
          describe="通过 gradientsAnimation 开启进度条的过度动画"
          codeText={state.progressCodeText7}
        >
          {/* @ts-ignore */}
          <div slot="title">
            {
              state.nums6.map(c => (
                <SaProgress
                  key={c.status}
                  percentage={c.num}
                  status={c.status}
                  type={ c.type }
                  gradientsAnimation
                />
              ))
            }
          </div>
        </DemoContainer>
      </>
    )
  }
})