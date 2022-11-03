import { designComponent } from "src/advancedComponentionsApi/designComponent";

export const ProgressSvg = designComponent({
  name: 'ProgressSvg',

  props: {
    color: { type: String },
    width: { type: [String, Number] },
    percentage: { type: [Number, String] }
  },

  setup({ props }) {


    return {
      render: () => (
        <svg width="150px" height="150px">
          <circle r="70" cy="75" cx="75" stroke-width={ props.width } stroke="#EAEFF4" stroke-linejoin="round" stroke-linecap="round" fill="none"/>
          <circle class="progress" r="70" cy="75" cx="75" stroke-width={ props.width } stroke={ props.color } stroke-linejoin="round" stroke-linecap="round" fill="none" stroke-dashoffset='0'  stroke-dasharray={ `${Number(props.percentage) * 4.75}, 475` } />
        </svg>
      )
      
    }
  }
})

export default ProgressSvg