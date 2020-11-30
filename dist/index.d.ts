import * as AWS from 'aws-sdk';
export interface GotAWSOptions {
    /**
     * A provider or a list of providers used to search for AWS credentials. If no providers are provided,
     * it will use the [EnvironmentCredentials](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EnvironmentCredentials.html) provider.
     *
     * See the [CredentialProviderChain](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CredentialProviderChain.html) documentation for more information.
     */
    providers?: AWS.Credentials | AWS.Credentials[];
    /**
     * The AWS service the request is being signed for. Will try to be inferred by the URL if not provided.
     *
     * For example, when signing a request for API Gateway with a custom domain, this should be `execute-api`.
     */
    service?: string;
    /**
     * The region of the service being invoked. If it could not be inferred through the URL, it will default to `us-east-1`.
     */
    region?: string;
}
/**
 * Create a Got instance which will automatically sign the requests with a [AWS Version 4 signature](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html).
 *
 * @param awsOptions - A provider or a list of providers used to search for AWS credentials.
 */
declare const got4aws: (awsOptions?: GotAWSOptions) => import("got/dist/source").Got;
export default got4aws;
