const express = require('express')
const router  = express.Router()

router.get('/', (req, res) => {
    res.json('Hello Admin!')
  })

module.exports = router