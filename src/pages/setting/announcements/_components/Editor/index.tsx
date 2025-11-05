import QuillEditor, { type QuillEditorApi } from '@/components/Quill'
import server from "@/server";
import { Input } from "antd";
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import S from './index.module.less'

export type EditorApi = {
  validate: () => void
  getData: () => Promise<{ name: string, attachId: string }>
  setData: (title: string, attachId: string) => Promise<void>
}

type EditorProps = {}

const Editor = forwardRef<EditorApi, EditorProps>((_props, ref) => {

  const quillRef = useRef<QuillEditorApi>(null)

  const [ title, setTitle ] = useState('')

  useImperativeHandle(
    ref,
    () => {
      return {
        validate: () => {
          if (!title) {
            throw new Error("请输入公告标题")
          }

          if (!quillRef.current?.getHtml()) {
            throw new Error("请输入公告内容")
          }
        },
        getData: async () => {
          const content = quillRef.current?.getHtml() ?? ""

          const fileResponse = await server.dao(
            "POST /file/upload",
            {
              fileType: 1,
              file: new File([ content ], "announcement.html", { type: "text/html" })
            }
          );

          return {
            name: title,
            attachId: fileResponse!.fileId
          }
        },
        setData: async (title: string, attachId: string) => {
          setTitle(title)

          const [ fileType, fileId ] = attachId.split('-')
          const blob = await server.dao(
            "GET /file/download",
            // @ts-ignore
            { fileType, fileId, autoDownload: true },
            {
              getWholeBizData: true,
              responseType: 'blob'
            }
          )
          // @ts-ignore
          quillRef.current?.setHtml(await blob.text())
        }
      }
    }
  )


  return (
    <div className={ S.wrap }>
      <div className={ S.contents }>

        <div className={ S.title }>
          <label className={ S.label } htmlFor="announcement-title">标题：</label>
          <Input
            id="announcement-title"
            className={ S.input }
            size="small"
            placeholder="请输入"
            value={ title }
            onChange={ e => setTitle(e.target.value) }
          />
        </div>

        <QuillEditor
          ref={ quillRef }
          className={ S.editor }
        />
      </div>
    </div>
  )
})

export default Editor
