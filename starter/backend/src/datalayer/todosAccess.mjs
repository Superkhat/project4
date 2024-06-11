import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'

const DB = new DynamoDB()
const dbXRay = AWSXRay.captureAWSv3Client(DB)
const dbClient = DynamoDBDocument.from(dbXRay)

const todoTb = process.env.TODOS_TABLE
const todoByUserIdxTable = process.env.TODOS_BY_USER_INDEX

const createTodo = async (item) => {
    await dbClient.put({
      TableName: todoTb,
      IndexName: todoByUserIdxTable,
      Item: item
    })
    return item
  }

  const updateTodo = async (userId, todoId, item) => {
    await dbClient.update({
      TableName: todoTb,
      Key: {
        userId,
        todoId
      },
      UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
      ExpressionAttributeNames: {
        '#name': 'name'
      },
      ExpressionAttributeValues: {
        ':name': item.name,
        ':dueDate': item.dueDate,
        ':done': item.done
      }
    })
  }

const getTodos = async (userId) => {
  const result = await dbClient.query({
    TableName: todoTb,
    KeyConditionExpression: 'userId = :i',
    ExpressionAttributeValues: {
      ':i': userId
    },
    ScanIndexForward: false
  })
  return result.Items
}

const deleteTodo = async (userId, todoId) => {
  await dbClient.delete({
    TableName: todoTb,
    Key: {
      userId,
      todoId
    }
  })
}

const updateTodoImage = async (userId, todoId, uploadUrl) => {
  await dbClient.update({
    TableName: todoTb,
    Key: {
      userId,
      todoId
    },
    UpdateExpression: 'set #attachmentUrl = :attachmentUrl',
    ExpressionAttributeNames: {
      '#attachmentUrl': 'attachmentUrl'
    },
    ExpressionAttributeValues: {
      ':attachmentUrl': uploadUrl
    }
  })
}

export { createTodo, updateTodo, getTodos, deleteTodo, updateTodoImage }
