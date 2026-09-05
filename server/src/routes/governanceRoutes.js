const express = require('express');
const router = express.Router();
const { getGovernanceRules, updateGovernanceRules } = require('../controllers/governanceController');

router.get('/', getGovernanceRules);
router.put('/', updateGovernanceRules);

module.exports = router;
