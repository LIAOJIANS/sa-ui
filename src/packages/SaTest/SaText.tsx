import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { useNumber } from "./use/useNumber";
export const SaTest = designComponent({
  name: 'sa-test',
  setup() {


    const { methods, num } = useNumber()

    return {
      render: () => <div>
        <button onClick={methods.increment}>add</button>
        <button onClick={methods.decrement}>dec</button>
        <br />
        { num.value } 
      </div>   
    }
  }
})

export default SaTest