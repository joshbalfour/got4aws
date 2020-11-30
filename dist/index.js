"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const got_1 = require("got");
const AWS = require("aws-sdk");
const aws4 = require("aws4");
// Name of the header used for X-ray tracing
const XRAY_TRACE_HEADER = 'x-amzn-trace-id';
/**
 * Create a Got instance which will automatically sign the requests with a [AWS Version 4 signature](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html).
 *
 * @param awsOptions - A provider or a list of providers used to search for AWS credentials.
 */
const got4aws = (awsOptions = {}) => {
    let credentialProviders;
    if (awsOptions.providers) {
        credentialProviders = Array.isArray(awsOptions.providers) ? awsOptions.providers : [awsOptions.providers];
    }
    // Setup the credential provider chain to retrieve the signature credentials
    const chain = new AWS.CredentialProviderChain(credentialProviders);
    return got_1.default.extend({
        responseType: 'json',
        hooks: {
            beforeRequest: [
                async (options) => {
                    if (options.isStream) {
                        // Don't touch streams
                        return;
                    }
                    // Make sure the credentials are resolved
                    const credentials = await chain.resolvePromise();
                    const { url, headers } = options;
                    // Extract the Amazon trace id from the headers as it shouldn't be used for signing
                    const { [XRAY_TRACE_HEADER]: amazonTraceId, ...signingHeaders } = headers;
                    // Map the request to something that is signable by aws4
                    const request = {
                        protocol: url.protocol,
                        host: url.host,
                        path: url.pathname + (url.search || ''),
                        headers: signingHeaders,
                        body: options.json ? JSON.stringify(options.json) : options.body,
                        service: awsOptions.service,
                        region: awsOptions.region
                    };
                    aws4.sign(request, credentials);
                    options.headers = {
                        ...request.headers,
                        // Put back the trace id if we have one
                        ...(amazonTraceId ? { [XRAY_TRACE_HEADER]: amazonTraceId } : {})
                    };
                }
            ]
        }
    });
};
exports.default = got4aws;
// For CommonJS default export support
module.exports = got4aws;
module.exports.default = got4aws;
