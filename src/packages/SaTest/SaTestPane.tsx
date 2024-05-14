import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { useNumber } from "./use/useNumber";

export const SaTestPane = designComponent({

  setup() {

    const { num } = useNumber()

    return {
      render: () => <div>
          { num.value }
        </div>
    }
  }

})

export default SaTestPane