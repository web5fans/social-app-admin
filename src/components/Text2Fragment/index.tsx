import { type FC, Fragment, type ReactNode } from 'react';

type Translation2FragmentProps = {
  [p: string]: ReactNode
  value: string
};

const Translation2Fragment: FC<Translation2FragmentProps> = (props) => {
  const { value } = props
  return value
    .split(/(?={{.+?}})|(?<={{.+?}})/)
    .map((item, index) => {
      const [ , key ] = /^{{(.+?)}}$/.exec(item) ?? []
      const result = key ? props[key] : item
      return <Fragment key={ index }>{ result }</Fragment>
    })
}

export default Translation2Fragment;