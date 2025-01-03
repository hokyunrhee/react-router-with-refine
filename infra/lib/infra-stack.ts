import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { DockerImageLambdaWithLogGroup } from "./constructs/docker-image-lambda-with-log-group";
import { DockerImageCode } from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import { FunctionUrlAuthType } from "aws-cdk-lib/aws-lambda";
import { Platform } from "aws-cdk-lib/aws-ecr-assets";

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambda = new DockerImageLambdaWithLogGroup(
      this,
      "DockerImageLambdaWithLogGroup",
      {
        code: DockerImageCode.fromImageAsset(
          path.join(__dirname, "..", "..", "app"),
          {
            file: "Dockerfile",
            platform: Platform.LINUX_AMD64,
          }
        ),
        memorySize: 1024,
        timeout: cdk.Duration.seconds(20),
        environment: {
          AWS_LAMBDA_EXEC_WRAPPER: "/opt/bootstrap",
        },
      }
    );

    const functionUrl = lambda.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
    });

    new cdk.CfnOutput(this, "FunctionUrl", {
      value: functionUrl.url,
    });
  }
}
