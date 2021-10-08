import { defineComponent, onMounted, ref } from "vue";
import { SaInput } from '../../src/packages'

export default defineComponent({
  props: {},
  setup() {

    const onClickClearIcon = () => {
      console.log(1)
    }


    onMounted(() => {
      const saInput = SaInput.use.ref('myInput')
      console.log(saInput.value);
    })

    return () => (
      <div>
        <sa-input
          ref="myInput"
          status="danger"
          textarea
          onClickClearIcon={onClickClearIcon}
        />
      </div>
    )

  }
})