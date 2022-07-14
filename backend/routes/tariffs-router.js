
const express = require('express')

const TariffsCtrl = require('../controllers/tariffs-ctrl')

const router = express.Router()

router.post('/tariffs', TariffsCtrl.upsertTariffs)
router.get('/tariffs/:providerId', TariffsCtrl.getTariffs)

module.exports = router