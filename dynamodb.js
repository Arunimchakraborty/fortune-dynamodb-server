require("dotenv").config();

var DynamoDBClient = require("@aws-sdk/client-dynamodb").DynamoDBClient;
var DynamoDBDocumentClient =
  require("@aws-sdk/lib-dynamodb").DynamoDBDocumentClient;
var PutCommand = require("@aws-sdk/lib-dynamodb").PutCommand;
var ScanCommand = require("@aws-sdk/lib-dynamodb").ScanCommand;
const { v4: uuidv4 } = require("uuid");

var client = new DynamoDBClient({
  region: process.env.PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.PUBLIC_AWS_SECRET_ACCESS_KEY,
  },
});

var docClient = DynamoDBDocumentClient.from(client);

var TableName = "fortuneTable";

var readAllFromDB = async function () {
  var command = new ScanCommand({
    TableName: TableName,
    Limit: 20,
  });

  var response = await docClient.send(command);
  console.log(response);
  if (response.Items) {
    return response.Items;
  } else {
    return [];
  }
};

var writeToDB = async function (quote) {
  const newID = uuidv4();
  var command = new PutCommand({
    TableName: TableName,
    Item: {
      ID: newID,
      value: quote,
    },
  });

  var response = await docClient.send(command);
  console.log(response);
  return response;
};

module.exports.readAllFromDB = readAllFromDB;
module.exports.writeToDB = writeToDB;