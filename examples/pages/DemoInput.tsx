import { computed, defineComponent, onMounted, reactive, ref, watch } from "vue";
import { SaInput, SaTitle } from '../../src/packages'

export default defineComponent({
  props: {},
  setup() {

    const onClickClearIcon = () => {
      console.log(1)
    }

    const state = reactive({
      inputValue: '',
      textarea: '',
      inputValue1: '',
      inputValue2: '',
      inputValue3: '',
      inputValue4: '',
      inputValue5: ''
    })


    watch(() => state, newState => {
      console.log(newState);

    }, { deep: true })

    onMounted(() => {
      // const saInput = SaInput.use.ref('myInput')
      // console.log(saInput.value);
    })

    const blur = (e) => {
      console.log(e)
    }

    const onChange = (row) => {
      console.log(row);
    }

    return () => (
      <div>
        <SaTitle
          title="基本用法"
          mode='vline'
        />
        <p style={{ margin: '10px 0' }}></p>
        <SaInput
          v-model={state.inputValue1}
        />

        <SaTitle
          title="textarea"
          mode='vline'
        />
        <p style={{ margin: '10px 0' }}></p>
        <SaInput
          v-model={state.textarea}
          textarea
        />

        <SaTitle
          title='phone 类型'
          mode='vline'
        />
        <p style={{ margin: '10px 0' }}></p>
        <SaInput
          v-model={state.inputValue}
          type="phone"
          onInputChange={(row) => onChange(row)}
        />

        <SaTitle
          title='date 类型'
          mode='vline'
        />
        <p style={{ margin: '10px 0' }}></p>
        <SaInput
          v-model={state.inputValue2}
          type="date"
          onInputChange={(row) => onChange(row)}
        />

        <SaTitle
          title='time 类型'
          mode='vline'
        />
        <p style={{ margin: '10px 0' }}></p>
        <SaInput
          v-model={state.inputValue3}
          type="time"
          onInputChange={(row) => onChange(row)}
        />


        <SaTitle
          title='number 正数，并且保留两位小数'
          mode='vline'
        />
        <p style={{ margin: '10px 0' }}></p>
        <SaInput
          v-model={state.inputValue4}
          number="integer"
          toFixed="2"
          onInputChange={(row) => onChange(row)}
        />

        <SaTitle
          title='number 负数，并且保留两位小数'
          mode='vline'
        />
        <p style={{ margin: '10px 0' }}></p>
        <SaInput
          v-model={state.inputValue5}
          number="negative"
          toFixed="2"
          onInputChange={(row) => onChange(row)}
        />
      </div>
    )

  }
})