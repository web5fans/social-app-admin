import { ImgHTMLAttributes } from "react";
import { Image } from "antd";



type OssImageProps = Omit<ImgHTMLAttributes<any>, 'src'> & {
  attachId?: string;
  defaultSrc?: string;
  preview?: boolean
  srcType?: 'id' | 'url'
}


export function attachIdToUrl(attachId?: string) {
  if (!attachId) return '';
  try {
    if (attachId.split('-').length > 1) {
      const [fileType, fileId] = attachId.split('-');
      return `/api/v1/file/download?fileId=${fileId}&fileType=${fileType}`;
    } else {
      return `/api/v1/file/download?fileId=${attachId}&fileType=1`;
    }
  } catch (e) {
    return '';
  }
}

export default function OssImage(props: OssImageProps) {
  const { attachId, defaultSrc, srcType = 'id', ...imgProps } = props;
  const src = (srcType === 'id' ? attachIdToUrl(attachId) : attachId) || defaultSrc;

  if (imgProps.preview) {
    return <Image {...imgProps} src={src}  />
  }

  return <img {...imgProps} src={src} />
}