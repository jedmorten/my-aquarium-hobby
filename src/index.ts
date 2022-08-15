import {Application} from 'express'
import {Request, Response} from 'express'
import { check } from 'express-validator'
const express = require('express')
const morgan = require('morgan')
const bodyParser = require("body-parser")
const Recaptcha = require('express-recaptcha').RecaptchaV2
require('dotenv').config()

//start express app
const app: Application = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(bodyParser.urlencoded({extend:false}))
app.use(bodyParser.json())

const recaptcha = new Recaptcha(process.env.RECAPTCHA_SITE_KEY, process.env.RECAPTCHA_SECRET_KEY)
const handleGetRequest = ((request: Request, response: Response)=> {
  return response.json("this thing is on!")
})
const validation = [
  check("name", "A valid name is required").not().isEmpty().trim().escape(),
  check("email", "Please provide a valid email").isEmail(),
  check("subject").optional().trim().escape(),
  check("message", "A message must be shorter than 2000 characters").trim().escape().isLength({min:1, max:2000})
]
function handlePostRequest(request: Request, response: Response) {
  response.append("Content-Type", "text/html")
  const {name, email, subject, message} = request.body
}

const indexRoute = express.Router()

indexRoute.route('/')
  .get(handleGetRequest).post(recaptcha.middleware.verify, validation, handlePostRequest)

app.use('/apis', indexRoute)

app.listen(4200, () => {
console.log("express built successfully")
})
