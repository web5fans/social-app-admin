import { CDN_HOST } from "@/constant/Network.ts";
import { DOB_DATA_TYPE } from "@/constant/enums.ts";
import { attachIdToUrl } from "@/components/oss-image";

export function formatDOBContent(name: string, id: string, imageType: string ) {
  return JSON.stringify({name, resource: { url: CDN_HOST + `${attachIdToUrl(id)}`, type: imageType }})
}

export function getFormDOBContent(dataContent?: string, dataType?: number) {
  if (!dataContent || dataType !== DOB_DATA_TYPE.CONTENT_JSON) return dataContent

  const content = JSON.parse(dataContent) as any;
  const searchParams = new URL(content.resource.url).searchParams;

  return {id: searchParams.get('fileId'), imageType: content.resource.type}
}