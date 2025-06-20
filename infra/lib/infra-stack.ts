import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2'
import * as integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import * as path from 'path'

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const fn = new NodejsFunction(this, 'lambda', {
      entry: '../apps/api/src/index.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_22_X,
      bundling: {
        commandHooks: {
          afterBundling(inputDir: string, outputDir: string): string[] {
            // publicディレクトリをoutputDirにコピー
            return [
              `cp -r ${path.join(__dirname, '../../apps/api/public')} ${outputDir}/public`
            ];
          },
          beforeBundling() { return [
            'cd ../apps/web',
            'npm install',
            `npm run build:local`,
          ]; },
          beforeInstall() { return []; }
        }
      }
    })
    fn.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE, // 認証なしに設定
    })
    // HTTP API Gatewayの作成
    const httpApi = new apigwv2.HttpApi(this, 'myHttpApi', {
      apiName: 'myapi',
      defaultIntegration: new integrations.HttpLambdaIntegration('LambdaIntegration', fn),
    })

    new cdk.CfnOutput(this, 'HttpApiUrl', {
      value: httpApi.url || '',
    })
  }
}