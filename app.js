import express from "express"
import { createClient } from "@supabase/supabase-js"
import morgan from "morgan"
import cors from "cors"
import bodyParser from "body-parser"
import { config } from "dotenv"
const express = require("express")
const { createClient } = require("@supabase/supabase-js")
const morgan = require("morgan")
const cors = require("cors")
const bodyParser = require("body-parser")
const { config } = require("dotenv")

config()

const app = express()

app.use(cors())
app.use(morgan("combined"))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const supabase = createClient(
  process.env.SUPABASE_API_URL,
  process.env.SUPABASE_API_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: false,
      detectSessionInUrl: true
    }
  }
)

app.get("/players", async (req, res) => {
  let request = supabase
    .from("players")
    .select()
    .order("score", { ascending: false })
  if (req.query._sort) {
    request = request.order(req.query._sort, {
      ascending: req.query?._order === "asc"
    })
  }
  const { data, error } = await request
  res.send(data)
})

app.patch("/players/:id", async (req, res) => {
  const { error } = await supabase
    .from("players")
    .update({
      firstname: req.body.firstname,
      url: req.body.url,
      score: req.body.score
    })
    .eq("id", req.params.id)
  if (error) {
    res.send(error)
  }
  res.send("updated!!")
})

app.get("/", (req, res) => {
  res.send("Catmash API")
})

app.get("*", (req, res) => {
  res.send("Catmash API")
})

app.listen(3000, () => {
  console.log(`> Ready on http://localhost:3000`)
})

module.exports = app
