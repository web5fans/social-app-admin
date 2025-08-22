import useTemplates from "@/hooks/useTemplates.ts";

const DownLoadTemplate = (props: {
  temName: keyof APIDao.WebEndpointsAdminTemplateAdminTemplateIdVo
}) => {
  const { templates } = useTemplates()
  const fileId = templates?.[props.temName]
  const url = fileId ? `/api/v1/file/download?fileId=${fileId}&fileType=2` : ''

  return <a href={url}>下载模板</a>
}

export default DownLoadTemplate;