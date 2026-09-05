const express = require('express');
const router = express.Router();
const { getPendingApprovals, getApprovalById, processApproval } = require('../controllers/approvalController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getPendingApprovals);
router.get('/:id', protect, getApprovalById);
router.post('/:id/action', protect, processApproval);

module.exports = router;
