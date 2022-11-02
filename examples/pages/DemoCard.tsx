import { defineComponent } from "vue";

// @ts-ignore
import { SaCard } from 'sa-ui'

export const DemoCard = defineComponent({
  setup() {


    return () => <div>
      <SaCard
        shadow="hover"
        pointer
        v-slots={{
          head: () => 'head',
          desc: () => 'desc',
          operator: () => 'operator',
          poster: () => 'poster',
          foot: () => 'foot'
        }}
      >
        hover shadow Card
      </SaCard>
    </div>
  }
})