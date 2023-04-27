import { designComponent } from "src/advancedComponentionsApi/designComponent";
import { classname } from "src/hooks";
import { computed, reactive } from "vue";

import { UploadProp } from "./cros/use/upload.util";
import SaUpload from './Saupload'

export const SaUploadByDrag = designComponent({
  props: {
    ...UploadProp
  },

  name: 'sa-upload-by-drag',
  setup() {

    const parent = SaUpload.use.inject()

    const state = reactive({
      active: false
    })

    const classes = computed(() => classname([
      'sa-upload-drag',
      {
        'sa-upload-drag-active': state.active
      }
    ]))

    const handler = {
      handleDrag(e: DragEvent) {
        e.preventDefault()
      },

      handleDragover(e: DragEvent) {
        e.preventDefault()

        if(!state.active) {
          state.active = true
        }
        
        console.log(e);
        
      },

      handleDragLeave(e: DragEvent) {
        state.active = false
      }
    }

    return {
      render: () => (
        <div
          class={ classes.value }
          onDrop={ handler.handleDrag }
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