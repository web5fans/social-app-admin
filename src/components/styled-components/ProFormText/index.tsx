import { ProFormText } from "@ant-design/pro-components";
import { ComponentProps } from "react";



type StyledProFormTextProps = ComponentProps<typeof ProFormText>

export default function StyledProFormText(props: StyledProFormTextProps) {

  return (
    <ProFormText
      {...props}
      transform={v => v?.trim() ?? '-'}
      fieldProps={{
        maxLength: 128,
        showCount: {
          formatter: ({ count, maxLength }) => (maxLength && (count > 0.9 * maxLength) ? `${count}/${maxLength}` : null)
        },
        ...props.fieldProps,
        // count: {
        //   // max: props.fieldProps?.count?.max ?? 10,
        //   ...props.fieldProps?.count,
        // }
      }}
    />
  )
}