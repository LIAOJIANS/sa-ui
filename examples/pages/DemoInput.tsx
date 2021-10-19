import { defineComponent, onMounted, ref } from "vue";
import { SaInput, SaTitle } from '../../src/packages'

export default defineComponent({
  props: {},
  setup() {

    const onClickClearIcon = () => {
      console.log(1)
    }

    const val = ref('')


    onMounted(() => {
      // const saInput = SaInput.use.ref('myInput')
      // console.log(saInput.value);
    })

    const blur = (e) => {
      console.log(e)
    }

    return () => (
      <div>
        <SaTitle 
          title="基本用法"
          mode='vline'
        />
        <p style={{ margin: '10px 0' }}></p>
        <SaInput
          v-model={ val.value }
        />
      </div>
    )

  }
})