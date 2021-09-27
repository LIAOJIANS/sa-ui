import { defineComponent } from "vue";

export const SaInput = defineComponent({

  name: 'sa-input',
  setup() {
    return () => (
      <div>
        <input type="text" />
      </div>
    )
  }
})


export default SaInput