// @ts-nocheck

import { defineComponent } from "vue";
import { SaButton, useMessage } from 'sa-ui'

export default defineComponent({
  setup() {

    // const data = [['项目', 'H&', '基金管理人', '基金托管人'],
    // ['名称', 'H&', '广发基金管理有限公司', '中国银行股份有限公司'],
    // ['信息披露负责人', '姓名', '程才良', '许俊'],
    // ['V&', '联系电话', '020-83936666', '010-66594319'],
    // ['V&', '电子邮箱', 'ccl@gffunds.com.cn', 'fcid@bankofchina.com'],
    // ['客户服务电话', 'H&', '95105828', '95566'],
    // ['传真', 'H&', '020-89899158', '010-66594942'],
    // ['注册地址', 'H&', '广东省珠海市横琴新区宝华路6号105室-49848（集中办公区）', '北京市西城区复兴门内大街1号'],
    // ['办公地址', 'H&', '广州市海珠区琶洲大道东1号保利国际广场南塔31－33楼', '北京市西城区复兴门内大街1号'],
    // ['邮政编码', 'H&', '510308', '100818'],
    // ['法定代表人', 'H&', '孙树明', '刘连舸']]
    //   ; (() => {
    //     for (let i = 0; i < data.length; i++) {
    //       const white = {
    //         'H&': { row: 1, col: 2 },
    //         // 'V&': { col: 1, row: 3 }
    //       }

    //       // 处理V&
    //       if(!(data[i].includes('H&') || data[i].includes('V&'))) {
    //         let index = 1

    //         for(let j = i + 1; j < data.length; j++) {
    //           if(data[j].includes('V&')) {
    //             index += 1
    //           }
    //         }

    //         // white['V&'] = { col: 1, row: index }

    //         data[i] = data[i].map((c, z) => {
    //           return z === 0 ?  {
    //             value: c,
    //             ...{ col: 1, row: index }
    //           } : {
    //             value: c,
    //             row: 1,
    //             col: 1
    //           }
    //         }) 
            
    //       } else {
            
    //       data[i] = data[i].map((c, index) => {

    //         let child = data[i]
    //         if (child[index + 1] === 'H&') {
    //           const init = {
    //             value: c,
    //             ...white[child[index + 1]]
    //           }

    //           child.splice(index + 1, 1)

    //           return init
    //         } else {

    //           c === 'V&' &&  child.splice(index, 1)

    //           return {
    //             value: c,
    //             row: 1,
    //             col: 1
    //           }
    //         }
    //       }).filter(c => c)
    //       }


    //     }


    //     console.log(data);

    //   })()



    const $message = useMessage()
    return () => <div>
      <SaButton onClick={() => {
        $message.success('提示信息！')
      }
      }>点我弹出基本Message框</SaButton>



    </div>
  }
})