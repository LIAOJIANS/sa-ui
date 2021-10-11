import { defineComponent, onMounted, ref } from "vue";
import { SaInput } from '../../src/packages'

export default defineComponent({
  props: {},
  setup() {

    const onClickClearIcon = () => {
      console.log(1)
    }

    const val = ref(100)


    onMounted(() => {
      // const saInput = SaInput.use.ref('myInput')
      // console.log(saInput.value);
    })

    const blur = (e) => {
      console.log(e)
    }

    return () => (
      <div>
        <SaInput
        v-model={ val.value }
          ref="myInput"
          status="danger"
          clearIcon
        />
      </div>
    )

  }
})