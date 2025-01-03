import { Construct } from "constructs";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { LogGroupProps, RetentionDays } from "aws-cdk-lib/aws-logs";
import { LogGroup } from "aws-cdk-lib/aws-logs";
import { RemovalPolicy } from "aws-cdk-lib";

interface LambdaWithLogGroupProps extends NodejsFunctionProps {
  logGroupProps: Omit<LogGroupProps, "logGroupName">;
}

const logGroupDefaultProps: Pick<LogGroupProps, "retention" | "removalPolicy"> =
  {
    retention: RetentionDays.ONE_WEEK,
    removalPolicy: RemovalPolicy.DESTROY,
  };

export class LambdaWithLogGroup extends NodejsFunction {
  constructor(scope: Construct, id: string, props: LambdaWithLogGroupProps) {
    const { logGroupProps, ...nodejsFunctionProps } = props;

    super(scope, id, nodejsFunctionProps);

    new LogGroup(this, "LogGroup", {
      logGroupName: `/aws/lambda/${this.functionName}`,
      ...logGroupDefaultProps,
      ...logGroupProps,
    });
  }
}
