import * as path from "path";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  Architecture,
  Code,
  FunctionUrlAuthType,
  LayerVersion,
  Runtime,
} from "aws-cdk-lib/aws-lambda";
import { LambdaWithLogGroup } from "./constructs/lambda-with-log-group";
import { AssetHashType, Duration, FileSystem } from "aws-cdk-lib";

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const webAdapterLayer = LayerVersion.fromLayerVersionArn(
      this,
      "WebAdapterLayer",
      `arn:aws:lambda:${this.region}:753240598075:layer:LambdaAdapterLayerX86:23`
    );

    const lambda = new LambdaWithLogGroup(this, "Lambda", {
      runtime: Runtime.NODEJS_20_X,
      handler: "run.sh",
      layers: [webAdapterLayer],
      memorySize: 1024,
      timeout: Duration.seconds(10),
      architecture: Architecture.X86_64,
      code: Code.fromAsset(path.join(__dirname, "..", "..", "app"), {
        assetHash: FileSystem.fingerprint(
          path.join(__dirname, "..", "..", "app"),
          {
            exclude: ["node_modules", "build", ".git"],
          }
        ),
        assetHashType: AssetHashType.CUSTOM,
        bundling: {
          image: Runtime.NODEJS_20_X.bundlingImage,
          command: [
            "bash",
            "-c",
            [
              "npm install --cache /tmp/.npm",
              "npm run build",
              "npm prune --omit=dev",
              "cp -r ./build /asset-output/",
              "cp -r ./node_modules /asset-output/",
              "cp package.json /asset-output/",
              "cp server.js /asset-output/",
              "cp run.sh /asset-output/",
            ].join("&&"),
          ],
        },
      }),
      environment: {
        AWS_LAMBDA_EXEC_WRAPPER: "/opt/bootstrap",
        PORT: "8080",
      },
    });

    const functionUrl = lambda.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
    });

    new cdk.CfnOutput(this, "FunctionUrl", {
      value: functionUrl.url,
    });
  }
}
