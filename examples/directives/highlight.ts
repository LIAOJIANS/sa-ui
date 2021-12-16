
import "highlight.js/scss/base16/solarized-dark.scss" 
import highlight from 'highlight.js'
import { App } from "vue"

export function dirHeighLight(app: App) {
  app.directive('highlight', {
    mounted(el) {
      let blocks = el.querySelectorAll('pre code')
      for (let i = 0; i < blocks.length; i++) {
        highlight.highlightBlock(blocks[i]);
      }
    }
  })
}