import { ref } from 'vue'

export const useNumber = () => {
  const num = ref(0)

  const methods = {
    increment: () => {
      num.value++

      console.log(num.value);
      
    },

    decrement: () => {
      num.value--
    } 
  }

  return {
    num,
    methods
  }
}
