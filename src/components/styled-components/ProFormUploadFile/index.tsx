import { Button, GetProp, Image, message, Upload, UploadProps } from 'antd';
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import S from './index.module.less';
import { ProFormItem } from "@ant-design/pro-components";
import { FieldProps } from "rc-field-form/lib/Field";
import cx from "classnames";
import server from "@/server";
import { useEffect, useState } from "react";
import { UploadFile } from "antd/lib";
import { useTranslation } from "react-i18next";

type ProFormUploadFileProps = {
  label?: string;
  name?: FieldProps['name'];
  formItemProps?: FieldProps
} & StyledUploadFormProps

const ProFormUploadFile = (props: ProFormUploadFileProps) => {
  const {
    formItemProps,
    label,
    name,
    ...rest
  } = props;

  return <>
    <ProFormItem
      label={label}
      name={name}
      {...props.formItemProps}
    >
      <StyledUpload {...rest} />
    </ProFormItem>
  </>
}

export default ProFormUploadFile;

type StyledUploadProps = {
  maxSize?: number | string;
  accept?: string;
  maxCount?: number;
  disabled?: boolean
  value?: string | string[],
  onChange?: (value: string[] | string) => void;
  buttonText: string
};

type StyledUploadFormProps = {
  className?: string;
  children?: React.ReactNode;
  responseType?: 'id' | 'full'
} & StyledUploadProps

const StyledUpload = (props: StyledUploadFormProps) => {
  const {
    className = '',
    value,
    onChange,
    maxCount,
    accept,
    maxSize,
    disabled,
    responseType = 'full',
    ...rest
  } = props;

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const { t } = useTranslation('translation');

  useEffect(() => {
    const fileIdList = ([]).concat(value || []);

    setFileList(prevList => {
      const hash = prevList.reduce((h, item) => {
        h[item.response] = item
        return h
      }, {} as Record<string, UploadFile>);

      return fileIdList.map((info: string) => {
        let fileId = info as string;
        let fileName = ''
        if (props.responseType !== 'id') {
          const [fileType, fileRealId, ...rest] = info.split('-');
          fileName = rest.join('-');
          fileId = fileRealId
        }

        const url = `/api/v1/file/download?fileId=${fileId}&fileType=2`;


        if (hash[fileId]) {
          return ({ ...hash[fileId], url })
        }

        return ({
          uid: fileId,
          name: fileName,
          response: info,
          url,
          status: 'done'
        })
      })
    });
  }, [value])

  const beforeUpload = (file: any) => {
    if (!maxSize) return true
    let limitSize = maxSize ?? 5;
    let isReachLimit = false;
    const isNoNumber = isNaN(+maxSize);

    if (isNoNumber && typeof maxSize === 'string' && maxSize.includes('kb')) {
      isReachLimit = file.size / 1024 > +maxSize.replace('kb', '');
    } else {
      isReachLimit = file.size / 1024 / 1024 > +maxSize;
    }

    if (isReachLimit) {
      message.warning(`${t("validate.maxFileSize", { size: isNoNumber ? limitSize : `${limitSize}MB` })}`);
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  return <div className={'flex items-baseline'}>
    <Upload
      disabled={disabled}
      beforeUpload={beforeUpload}
      customRequest={async function customRequest(options) {
        const { file } = options;

        try {
          const response = await server.dao("POST /file/upload", { file, fileType: '2' });
          if (props.responseType === 'id') {
            const [fileType, fileRealId, ...rest] = response.fileId.split('-');
            options.onSuccess?.(fileRealId);
          } else {
            options.onSuccess?.(response.fileId);
          }

        } catch (e) {
          options.onError?.(e);
          return;
        }
      }}
      accept={accept}
      maxCount={maxCount}
      itemRender={(node) => {
        return node;
      }}
      fileList={fileList}
      onChange={({ fileList: nextFileList }) => {
        setFileList([...nextFileList]);
        const fileIds = nextFileList.map(item => item.response as string);
        if (fileIds.some(i => !i)) return;
        const files = maxCount
          ? (maxCount === 1 ? fileIds[0] : fileIds.slice(0, maxCount + 1)) : fileIds;
        onChange?.(files)
      }}
      className={cx(S.antUpload, className)}
    >
      <Button
        icon={<UploadOutlined style={{ opacity: 0.25 }} />}
        className={'text-[#42576C]'}
      >{props.buttonText}</Button>
    </Upload>
    {props.children}
  </div>
}