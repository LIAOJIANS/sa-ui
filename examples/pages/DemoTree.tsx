import { defineComponent, ref } from "vue";
import { SaTree, SaButton, useMessage } from 'sa-ui'
import { CheckboxStatus, useRefs } from "src/hooks";

export default defineComponent({
  setup() {

    const { refs, onRef } = useRefs({
      el: SaTree
    })
    const $message = useMessage()

    const handler = {
      setCheckStatusByNodeKey: () => {
        refs
          .el!
          .methods
          .setCheckStatusByNodeKey(
            ['1'],
            CheckboxStatus.check
          )
      },

      setCheckStatusByNode: () => {
        refs
          .el!
          .methods
          .setCheckStatusByNode(
            [{
              id: '1-1-1-1',
              label: '节点1-1-1-1'
            },
            {
              id: '1-1-1-2',
              label: '节点1-1-2-2'
            },],
            CheckboxStatus.check
          )
      },

      getCheckStatus: () => {
        const keys = refs
          .el!
          .methods
          .getCheckStatusKey()

        console.log(keys);

        $message.info(JSON.stringify(keys))
      },

      getCheckStatusNode: () => {
        const keys = refs
          .el!
          .methods
          .getCheckStatusNode()

        console.log(keys);

        $message.info(JSON.stringify(keys))

      },

      checkAll: () => {
        refs
          .el!
          .methods
          .checkAll()
      },

      reverseSelection: () => {
        refs
          .el!
          .methods
          .reverseSelection()
      }
    }

    return () => <div>
      <p>基础组件</p>
      <SaTree
        data={
          [
            {
              title: '节点1',
              data: [
                {
                  title: '节点1-1',
                  data: [
                    {
                      title: '节点1-1-1',
                      data: [
                        {
                          title: '节点1-1-1-1'
                        },
                        {
                          title: '节点1-1-2-2'
                        },
                        {
                          title: '节点1-1-3-3'
                        }
                      ]
                    },
                    {
                      title: '节点1-1-2',
                      data: [
                        {
                          title: '节点1-1-2-2'
                        },
                        {
                          title: '节点1-1-3-3'
                        }
                      ]
                    },
                    {
                      title: '节点1-1-3'
                    }
                  ]
                },
                {
                  title: '节点1-2'
                }
              ]
            },
            {
              title: '节点2',
              data: [
                {
                  title: '节点2-1',
                }
              ]
            }
          ]
        }
        props={{
          label: 'title',
          childrens: 'data'
        }}
        highlightCurrent
        accordion
      />

      <p>checkbox选择树形</p>
      <SaButton label='获取tree-check 选中Key' onClick={handler.getCheckStatus} />
      <SaButton label='获取tree-check 选中Node' onClick={handler.getCheckStatusNode} />
      <SaButton label='根据node设置选中元素' onClick={handler.setCheckStatusByNode} />
      <SaButton label='根据nodeKey设置选中元素' onClick={handler.setCheckStatusByNodeKey} />

      <p></p>

      <SaButton label='全选' onClick={handler.checkAll} />
      <SaButton label='反选' onClick={handler.reverseSelection} />

      <SaTree
        ref={onRef.el}
        data={
          [
            {
              id: '1',
              label: '节点1',
              childrens: [
                {
                  id: '1-1',
                  label: '节点1-1',
                  childrens: [
                    {
                      id: '1-1-1',
                      label: '节点1-1-1',
                      childrens: [
                        {
                          id: '1-1-1-1',
                          label: '节点1-1-1-1'
                        },
                        {
                          id: '1-1-1-2',
                          label: '节点1-1-2-2'
                        },
                        {
                          id: '1-1-1-3',
                          label: '节点1-1-3-3'
                        }
                      ]
                    },
                    {
                      id: '1-1-2',
                      label: '节点1-1-2',
                      childrens: [
                        {
                          id: '1-1-2-1',
                          label: '节点1-1-2-2'
                        },
                        {
                          id: '1-1-2-2',
                          label: '节点1-1-3-3'
                        }
                      ]
                    },
                    {
                      id: '1-1-3',
                      label: '节点1-1-3'
                    }
                  ]
                },
                {
                  id: '1-2',
                  label: '节点1-2'
                }
              ]
            },
            {
              id: '2',
              label: '节点2',
              childrens: [
                {
                  id: '2-1',
                  label: '节点2-1',
                }
              ]
            }
          ]
        }
        nodeKey={'id'}
        checkbox
        defaultExpandAll
        checkStrictly
      />
    </div>
  }
})