import cx from 'classnames';
import type { FC, ReactElement, ReactNode } from 'react';
import { PageContainer } from "@ant-design/pro-components";
import S from './index.module.less';
import { PageContainerProps } from "@ant-design/pro-components";

type PageProps = {
  title?: ReactElement | string
  full?: boolean;
  children: ReactNode
  className?: string
  header?: PageContainerProps['header']
};

const fullStyle = {
  minHeight: 'calc(100vh - 64px - 88px)',
}

const Page: FC<PageProps> = (props) => {
  const { full = false, title, children, className , header } = props


  return (
    <PageContainer
      className={S.pageContainer}
      header={{
        breadcrumb: header?.breadcrumb,
        ...(header || {}),
        title,
      }}
    >
      <div
        className={cx("rounded-2", className)}
        style={full ? fullStyle : {}}
      >
        {/*{*/}
        {/*  title && <Title title={title} level={titleLevel} />*/}
        {/*}*/}

        {children}
      </div>
    </PageContainer>
  )
}

export default Page;