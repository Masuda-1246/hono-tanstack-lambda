import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2'
import * as integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import * as logs from 'aws-cdk-lib/aws-logs'
import * as path from 'path'

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)
    const s3KmsKey = new cdk.aws_kms.Key(this, 'S3KmsKey', {
      description: 'KMS key for S3 bucket encryption',
      enableKeyRotation: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // KMSキーのエイリアスを作成
    new cdk.aws_kms.Alias(this, 'S3KmsKeyAlias', {
      aliasName: `alias/s3-analysis-bucket-${this.account}-${this.region}`,
      targetKey: s3KmsKey,
    });

    const s3 = new cdk.aws_s3.Bucket(this, 'AnalysisBucket', {
      bucketName: `analysis-bucket-masuda-yosuke`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      eventBridgeEnabled: true,
      encryption: cdk.aws_s3.BucketEncryption.KMS,
      encryptionKey: s3KmsKey,
      bucketKeyEnabled: true,
    });

    // ローカルでビルドしたDuckDB Layer
    const duckdbLayer = new lambda.LayerVersion(this, 'DuckDBLayer', {
      code: lambda.Code.fromAsset('layer/dist/duckdb-layer.zip'),
      compatibleRuntimes: [lambda.Runtime.NODEJS_22_X],
      description: 'DuckDB Layer for Lambda (locally built)',
    });

    // CloudWatchログループの作成
    const lambdaLogGroup = new logs.LogGroup(this, 'LambdaLogGroup', {
      logGroupName: '/aws/lambda/hono-api-lambda',
      retention: logs.RetentionDays.ONE_WEEK, // 1週間保持
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const fn = new NodejsFunction(this, 'lambda', {
      entry: '../apps/api/src/index.ts',
      handler: 'handler',
      memorySize: 512,
      runtime: lambda.Runtime.NODEJS_22_X,
      architecture: lambda.Architecture.X86_64,
      layers: [duckdbLayer],
      timeout: cdk.Duration.seconds(300),
      logGroup: lambdaLogGroup, // CloudWatchログループを明示的に設定
      bundling: {
        externalModules: [
          "@duckdb"
        ],
        esbuildArgs: {
          '--loader:.html': 'text'
        },
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
      },
      environment: {
        S3_BUCKET_NAME: s3.bucketName,
        // Node.jsのログレベルを設定
        NODE_OPTIONS: '--enable-source-maps',
      },
    })
    fn.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE, // 認証なしに設定
    })
    s3.grantReadWrite(fn)
    // HTTP API Gatewayの作成
    const httpApi = new apigwv2.HttpApi(this, 'myHttpApi', {
      apiName: 'myapi',
      defaultIntegration: new integrations.HttpLambdaIntegration('LambdaIntegration', fn),
    })

    new cdk.CfnOutput(this, 'HttpApiUrl', {
      value: httpApi.url || '',
    })

    // CloudWatchログループのARNを出力
    new cdk.CfnOutput(this, 'LambdaLogGroupArn', {
      value: lambdaLogGroup.logGroupArn,
      description: 'Lambda関数のCloudWatchログローダーのARN',
    })
  }
}