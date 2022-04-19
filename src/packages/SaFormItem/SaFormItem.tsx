import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { FormCollector } from "../SaForm/SaForm";




const SaFormItem = designComponent({
  
  name: 'sa-form-item',
  setup() {

    const from = FormCollector.child

    return {
      render: () => <div>111</div>
    }
  }
})


export default SaFormItem