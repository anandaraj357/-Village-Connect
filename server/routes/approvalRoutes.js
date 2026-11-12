import express from 'express';
import ContentApproval from '../models/ContentApproval.js';
import CrawledRecord from '../models/CrawledRecord.js';
import { publishRecord } from '../services/approvalService.js';

const router = express.Router();

// Get pending approval items (with filtering and pagination)
router.get('/pending', async (req, res) => {
  try {
    const { recordType, status, page = 1, limit = 20 } = req.query;
    const filter = { status: status || 'pending' };
    if (recordType && recordType !== 'all') {
      filter.recordType = recordType;
    }

    const total = await ContentApproval.countDocuments(filter);
    const approvals = await ContentApproval.find(filter)
      .populate('recordId')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, total, approvals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get single record full preview
router.get('/record/:id', async (req, res) => {
  try {
    const approval = await ContentApproval.findById(req.params.id).populate('recordId');
    if (!approval) return res.status(404).json({ success: false, message: 'Approval item not found' });
    res.json({ success: true, approval });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Publish record (Approve & Publish to public portal)
router.post('/publish/:id', async (req, res) => {
  try {
    const { overrideData, adminComments } = req.body;
    const result = await publishRecord(req.params.id, null, overrideData);

    if (adminComments) {
      await ContentApproval.findByIdAndUpdate(req.params.id, { adminComments });
    }

    res.json({ success: true, message: 'Content published successfully to public portal', result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Edit pending record fields
router.put('/edit/:id', async (req, res) => {
  try {
    const { title, summary, summaryTamil, summaryTelugu, category, isImportant, editedFields } = req.body;
    const approval = await ContentApproval.findById(req.params.id);
    if (!approval) return res.status(404).json({ success: false, message: 'Item not found' });

    if (title) approval.title = title;
    if (summary) approval.summary = summary;
    if (summaryTamil) approval.summaryTamil = summaryTamil;
    if (summaryTelugu) approval.summaryTelugu = summaryTelugu;
    if (category) approval.category = category;
    if (isImportant !== undefined) approval.isImportant = isImportant;
    if (editedFields) {
      approval.editedFields = { ...(approval.editedFields || {}), ...editedFields };
    }
    approval.status = 'edited';
    await approval.save();

    res.json({ success: true, message: 'Item updated successfully', approval });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Reject record
router.post('/reject/:id', async (req, res) => {
  try {
    const { reason } = req.body;
    const approval = await ContentApproval.findById(req.params.id);
    if (!approval) return res.status(404).json({ success: false, message: 'Item not found' });

    approval.status = 'rejected';
    approval.adminComments = reason || 'Rejected by administrator';
    approval.reviewedAt = new Date();
    await approval.save();

    await CrawledRecord.findByIdAndUpdate(approval.recordId, { approvalStatus: 'rejected' });

    res.json({ success: true, message: 'Item marked as rejected', approval });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Toggle Mark as Important
router.post('/mark-important/:id', async (req, res) => {
  try {
    const approval = await ContentApproval.findById(req.params.id);
    if (!approval) return res.status(404).json({ success: false, message: 'Item not found' });

    approval.isImportant = !approval.isImportant;
    await approval.save();

    res.json({ success: true, isImportant: approval.isImportant });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete approval and associated crawled record
router.delete('/:id', async (req, res) => {
  try {
    const approval = await ContentApproval.findById(req.params.id);
    if (!approval) return res.status(404).json({ success: false, message: 'Item not found' });

    if (approval.recordId) {
      await CrawledRecord.findByIdAndDelete(approval.recordId);
    }
    await ContentApproval.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Item deleted permanently' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
