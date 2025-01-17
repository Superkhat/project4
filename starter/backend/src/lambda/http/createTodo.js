import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'
import { createTodoAction } from '../../businesslogic/todo.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const userId = getUserId(event)
    const newTodo = JSON.parse(event.body)
    const todo = await createTodoAction(userId, newTodo)

    return JSON.stringify({
      item: todo
    })
  })