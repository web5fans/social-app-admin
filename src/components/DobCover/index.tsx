import { FC } from "react";
import { DOB_TYPE } from "@/constant/enums.ts";
import OssImage from "@/components/oss-image";
import { Image } from "antd";

type DobCoverProps = {
  cover?: string
  dobType?: DOB_TYPE
  className?: string
  preview?: boolean
}

type ImageJSONResourceType = {
  resource: {
    // image mimie
    type: string;
    url: string;
  }
}

const DobCover: FC<DobCoverProps> = ({ cover, dobType = DOB_TYPE.SINGLE, className, preview = false }) => {

  if (!cover) return null

  if (dobType === DOB_TYPE.SINGLE) {
    let src = cover
    if (cover.startsWith('{')) {
      const json  = JSON.parse(cover) as ImageJSONResourceType;
      src = json?.resource?.url ?? ""
    }
    return <Image preview={preview} src={src} alt={''} className={className} />
  }
  return <OssImage attachId={cover} className={className} preview={preview}  />
}

export default DobCover;

/**
 *
 * @param source
 * @param formatAssert 图片数据源字符串结构
 * @returns
 */
export function extractImageUrl(source: string | undefined) {
  if (!source) return "";

  if (source[1] === '-') {
    const fileId = source.split('-')[1];
    return fileId;
  }

  if(source[0] === '{') {
    try {
      const json = JSON.parse(source) as ImageJSONResourceType;
      return json?.resource?.url ?? "";
    } catch (error) {
      return "";
    }
  }

  return source;

}