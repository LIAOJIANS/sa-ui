import { defineComponent, reactive, ref } from "vue";
import { SaTree, SaButton, useMessage } from 'sa-ui'
import { CheckboxStatus, useRefs } from "sa-ui@hooks";
import DemoContainer from '../components/container'

export default defineComponent({
  setup() {

    const { refs, onRef } = useRefs({
      el: SaTree
    })

    const state = reactive({
      data1: [
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
      ],
      initTimeText1: `
        const state = reactive({
          data1: [
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
        })

        <SaTree
          data={ state.data1 }
          props={{
            label: 'title',
            childrens: 'data'
          }}
          highlightCurrent
          accordion
        />
      `,

      data2: [
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
      ],

      initTimeText2: `
        import { SaTree, SaButton, useMessage } from 'sa-ui'
        import { CheckboxStatus, useRefs } from "sa-ui@hooks";
        const { refs, onRef } = useRefs({
          el: SaTree
        })

        const state = reactive({
          data2: [
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
          ],
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

        <SaButton label='获取tree-check 选中Key' onClick={handler.getCheckStatus} />
        <SaButton label='获取tree-check 选中Node' onClick={handler.getCheckStatusNode} />
        <SaButton label='根据node设置选中元素' onClick={handler.setCheckStatusByNode} />
        <SaButton label='根据nodeKey设置选中元素' onClick={handler.setCheckStatusByNodeKey} />
        <p></p>

        <SaButton label='全选' onClick={handler.checkAll} />
        <SaButton label='反选' onClick={handler.reverseSelection} />

        <SaTree
          ref={onRef.el}
          data={state.data2}
          nodeKey={'id'}
          checkbox
          defaultExpandAll
          checkStrictly
        />
      `
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
      <h1 style={{ color: '#333' }}>Tree 树形控件</h1>
      <span style={{ color: '#666', fontSize: '14px' }}>用清晰的层级结构展示信息，可展开或折叠。</span>
    
      <DemoContainer
        label="基础用法"
        describe="基础的树形结构展示。          "
        codeText={state.initTimeText1}
      >
        {/* @ts-ignore */}
        <div slot="title">
          <SaTree
            data={ state.data1 }
            props={{
              label: 'title',
              childrens: 'data'
            }}
            highlightCurrent
            accordion
          />
        </div>
      </DemoContainer>

      <DemoContainer
          label="树形Checkbox"
          describe="开启checkbox之后的功能操作"
          codeText={state.initTimeText2}
        >
          {/* @ts-ignore */}
          <div slot="title">
            <SaButton label='获取tree-check 选中Key' onClick={handler.getCheckStatus} />
            <SaButton label='获取tree-check 选中Node' onClick={handler.getCheckStatusNode} />
            <SaButton label='根据node设置选中元素' onClick={handler.setCheckStatusByNode} />
            <SaButton label='根据nodeKey设置选中元素' onClick={handler.setCheckStatusByNodeKey} />
            <p></p>

            <SaButton label='全选' onClick={handler.checkAll} />
            <SaButton label='反选' onClick={handler.reverseSelection} />

            <SaTree
              ref={onRef.el}
              data={state.data2}
              nodeKey={'id'}
              checkbox
              defaultExpandAll
              checkStrictly
            />
          </div>
        </DemoContainer>

     
    </div>
  }
})