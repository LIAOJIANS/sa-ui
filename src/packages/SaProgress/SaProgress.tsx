import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { computed } from "vue";
import { typeOf } from "js-hodgepodge";
import './SaProgress.scss'

import SaIcon from "../SaIcon/SaIcon";
import ProgressSvg from './ProgressSvg'
import { StyleProps } from "src/hooks";

enum ProgressType {
  Line = 'line',  // 直线条
  Circle = 'circle', // 原型
  Dashboard = 'dashboard'  // 仪表板
}

export const SaProgress = designComponent({
  name: 'SaProgress',

  props: {
    percentage: { type: [Number, String] },                       // 百分比
    type: { type: String, default: ProgressType.Line },           // 进度条类型
    width: { type: [String, Number] },                            // 进度条的宽度，单位 px
    textInside: { type: Boolean },                                // 进度条显示文字内置在进度条内（只在 type=line 时可用）
    status: StyleProps.status,                                    // 进度条状态
    color: { type: String },                                      // 进度条背景颜色
    gradients: { type: Array },                                   // 渐变色  ---- 只作用于line
    gradientsAnimation: { type: Boolean },                        // 是否启用渐变动画  ---- 只作用于line
    contentFormat: { type: Function },                            // 自定义进度条内容  
    showText: { type: Boolean, default: true }                    // 是否显示进度条文字
  },

  setup({ props }) {

    const contentFormat = computed(() => {
      if(!!props.contentFormat) {
        if(typeOf(props.contentFormat) !== 'function') {
          console.error('contentFormat must be a function ！')
        }

        return props.contentFormat
      }

      return () => null
    })

    return {
      render: () => (
        <div class="sa-progress">
          <div class="sa-progress-bar">
            <div class="sa-progress-bar-outer">
              <div class="sa-progress-bar-inner">
                <ProgressSvg 
                  percentage={ props.percentage || 80 }
                  color={ props.color || '#000' }
                  width={ props.width || 8 }
                />
              </div>
            </div>
            <div class="el-progress-text">
              { props.showText ? !!contentFormat.value() ? contentFormat.value() : (
                  !!props.status ? <SaIcon status={ props.status } /> : `${props.percentage || 0}%`
                ) : null }
            </div>
          </div>
        </div>
      )
    }
  }
})

export default SaProgress