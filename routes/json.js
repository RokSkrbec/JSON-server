const express = require('express')
const fs = require('fs')
const router = express.Router()

const assetsDir = 'public/files'
const logsDir = 'public/logs'

// retuns names of all .json files on the server
router.get('/', (req, res) => {
  // itterates through public folder and adds .json files to jsonFiles array
  fs.readdir(assetsDir, (err, files) => {
    let jsonFiles = files.filter((file) => {
      if(file.includes('.json')) {
        return file
      }
    })
    // natural sort of files <-- code from Stackoverflow, changed to arrow function
    jsonFiles.sort((a,b) => {
      return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
    })
    res.send(jsonFiles)
  })
})

// returns json file with specific index
router.get('/:index', (req, res) => {
  fs.readFile(`${assetsDir}/${req.params.index}.json`, (err, data) => {
    if(err) {
      console.log(err);
      res.send('no such index')
    } else {
      const jsonData = JSON.parse(data)
      res.json(jsonData)
    }
  })
})

// creates new json file in public folder
router.put('/', (req, res) => {
  if(req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
  } else {
    let newJsonIndex = 0
    let json = req.body
    const date = new Date()
    date.toISOString()
    // readdir to get the number of files in public folder
    fs.readdir(assetsDir, (err, files) => {
      newJsonIndex = files.length+1
      
      // writing new json file to public folder
      fs.writeFile(`${assetsDir}/${newJsonIndex}.json`, JSON.stringify(json, null, 2), (err) => {
        if (err) {
          return console.log('firstErr: ' + err)
        }
        // appending date, file name and json file content to input.log in public folder
        fs.appendFile(`${logsDir}/input.log`, `\r\n${date} ${newJsonIndex}.json ${JSON.stringify(json)}`, (err) => {
          if(err) {
            return console.log('secondErr:' + err)
          }
          res.sendStatus(200)
        })
      })
    })
  }
})

module.exports = router