import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { DynamoDBClient, GetItemCommand, AttributeValue } from '@aws-sdk/client-dynamodb';

const ddbClient = new DynamoDBClient({});

const featureFlagName = 'HelloWorldEnabled';

const TABLE_NAME = process.env.FEATURE_FLAG_TABLE_NAME!;

export const handler: Handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	try {	
		const getFeatureFlagCommand = new GetItemCommand({
			TableName: TABLE_NAME,
			Key: {
				FeatureFlagName: { S: featureFlagName }
			}
		});

	const response = await ddbClient.send(getFeatureFlagCommand);

	const isEnabled = response.Item!.IsEnabled!.BOOL!;
	if (!isEnabled) {
		throw new Error("Feature is not enabled");
	}
    	return {
    		statusCode: 200,
			body: JSON.stringify({
				message: "Hello World from WannaWatchMeCode!",
			})
		};
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};

