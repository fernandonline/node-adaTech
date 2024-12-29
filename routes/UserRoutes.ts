import { Router } from "express";
import { randomUUID } from 'crypto'
import path from 'path'
import dbJson from '../database.json'
import { writeFileSync } from 'fs'

type User = {
  id: string
  name: string
  age: number
}

type CreateUserDTO = Omit<User, 'id'> 

const userRoutes = Router()
const dbJsonPath = path.resolve(process.cwd(), 'database.json')
const users = dbJson.users

userRoutes.get('/api/users', (req, res) => {
  res.json(users)
})


userRoutes.post('/api/users', (req, res) => {
  const {name, age}: CreateUserDTO = req.body

  if(!name || Number(age) < 0) {
    const errMsg = 'Sem nome ou idade'
    res.status(400).json({error: errMsg})
  }

  const user = {id: randomUUID(), name, age}

  users.push(user)

  writeFileSync(dbJsonPath, JSON.stringify({...dbJson, users}))

  res.status(201).json(user)
})

userRoutes.delete('/api/users/:id', (req, res) => {
  const {id} = req.params
  if(!id) {
    res.status(400).json({error: 'Id não informado'})
  }

  const foundUser = users.find(user => user.id === id)
  if(!foundUser) {
    res.status(400).json({error: 'Usuário não encontrado'})
  }
  
  const deleteUser = users.filter(user => user.id !== id)
  writeFileSync(dbJsonPath, JSON.stringify({...dbJson, users: deleteUser}))

  res.status(204).send()
})

export { userRoutes }