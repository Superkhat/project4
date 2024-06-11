import { v4 as uuidv4 } from 'uuid'
import {createTodo, updateTodo, getTodos, deleteTodo, updateTodoImage} from '../datalayer/todosAccess.mjs'
import { generateImageUrl } from '../filestorage/attachmentUtils.mjs'

const getTodosAction = async (userId) => {
  return await getTodos(userId)
}

const createTodoAction = async (userId, item) => {
  const createdAt = new Date().toISOString()
  const newTodo = {
    ...item,
    userId,
    todoId: uuidv4(),
    createdAt
  }
  return await createTodo(newTodo)
}

const updateTodoAction = async (userId, todoId, item) => {
  await updateTodo(userId, todoId, item)
}

const deleteTodoAction = async (userId, todoId) => {
  await deleteTodo(userId, todoId)
}

const generateImageUrlAction = async (userId, todoId) => {
  const imageId = uuidv4()
  const { presignedUrl, imageUrl } = await generateImageUrl(imageId)
  await updateTodoImage(userId, todoId, imageUrl)
  return presignedUrl
}

export { getTodosAction, createTodoAction, updateTodoAction, deleteTodoAction, generateImageUrlAction }
