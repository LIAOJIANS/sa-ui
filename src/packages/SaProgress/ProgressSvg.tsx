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
        <svg viewBox="0 0 100 100">
          <path
            d="M 50 50 m 0 -47 a 47 47 0 1 1 0 94 a 47 47 0 1 1 0 -94"
            stroke="#e5e9f2"
            stroke-width="8"
            fill="none"
            style="stroke-dasharray: 295.31px, 295.31px; stroke-dashoffset: 0px;"
          />
          <path
            d="M 50 50 m 0 -47 a 47 47 0 1 1 0 94 a 47 47 0 1 1 0 -94"
            stroke="#20a0ff"
            fill="none"
            stroke-linecap="round"
            stroke-width="8"
            style="stroke-dasharray: 73.8274px, 295.31px; stroke-dashoffset: 0px; transition: stroke-dasharray 0.6s ease 0s, stroke 0.6s ease 0s;"
          />
        </svg>
      )

    }
  }
})

export default ProgressSvg