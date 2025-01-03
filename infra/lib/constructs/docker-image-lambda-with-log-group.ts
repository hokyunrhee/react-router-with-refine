import { Construct } from "constructs";
import {
  DockerImageFunction,
  DockerImageFunctionProps,
} from "aws-cdk-lib/aws-lambda";
import { LogGroupProps, RetentionDays } from "aws-cdk-lib/aws-logs";
import { LogGroup } from "aws-cdk-lib/aws-logs";
import { RemovalPolicy } from "aws-cdk-lib";

interface DockerImageLambdaWithLogGroupProps extends DockerImageFunctionProps {
  logGroupProps?: Omit<LogGroupProps, "logGroupName">;
}

const logGroupDefaultProps: Pick<LogGroupProps, "retention" | "removalPolicy"> =
  {
    retention: RetentionDays.ONE_WEEK,
    removalPolicy: RemovalPolicy.DESTROY,
  };

export class DockerImageLambdaWithLogGroup extends DockerImageFunction {
  constructor(
    scope: Construct,
    id: string,
    props: DockerImageLambdaWithLogGroupProps
  ) {
    const { logGroupProps, ...dockerImageFunctionProps } = props;

    super(scope, id, dockerImageFunctionProps);

    new LogGroup(this, "LogGroup", {
      logGroupName: `/aws/lambda/${this.functionName}`,
      ...logGroupDefaultProps,
      ...logGroupProps,
    });
  }
}
