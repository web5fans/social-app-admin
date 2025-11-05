import { Progress, ProgressProps } from "antd";

const VoteProgress = (props: {
  numerator?: number;
  denominator?: number;
  color?: ProgressProps['strokeColor']
}) => {
  const { numerator = 0, denominator = 0 } = props;
  const percentage = ((numerator / denominator) * 100);

  return <Progress
    percent={Math.round(percentage)}
    format={percent => `${numerator} (${percent}%)`}
    strokeColor={props.color}
  />
}

export default VoteProgress;