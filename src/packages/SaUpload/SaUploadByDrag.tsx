import { designComponent } from "src/advancedComponentionsApi/designComponent";

import { UploadProp } from "./cros/use/upload.util";
import SaUpload from './Saupload'

export const SaUploadByDrag = designComponent({
  props: {
    ...UploadProp
  },

  name: 'sa-upload-by-drag',
  setup() {

    const parent = SaUpload.use.inject()

    const handler = {
      handleDrag(e: DragEvent) {
        e.preventDefault()

        console.log(e, '2');
        
      },

      handleDragover(e: DragEvent) {
        e.preventDefault()

        console.log(e, '1');
        
      },

      handleDragLeave(e: DragEvent) {
        e.preventDefault()

        console.log('离开了');
        
      }
    }

    return {
      render: () => (
        <div
          class="sa-upload-drag"
          onDrag={ handler.handleDrag }
          onDragover={ handler.handleDragover }
          onDragleave={ handler.handleDragLeave }

          onClick={ parent.handler.handleUploadBtn }
        >
          Drag
        </div>
      )
    }
  }
})

export default SaUploadByDrag