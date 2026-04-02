const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readJobs, writeJobs } = require('../utils/fileDb');

const router = express.Router();

router.get('/', (req, res) => {
  const jobs = readJobs();
  res.json(jobs);
});

router.post('/', (req, res) => {
  const jobs = readJobs();
  const newJob = { id: uuidv4(), ...req.body };
  jobs.unshift(newJob);
  writeJobs(jobs);
  res.status(201).json(newJob);
});

router.put('/:id', (req, res) => {
  const jobs = readJobs();
  const index = jobs.findIndex((job) => job.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Job not found' });
  }

  jobs[index] = { ...jobs[index], ...req.body, id: req.params.id };
  writeJobs(jobs);
  res.json(jobs[index]);
});

router.delete('/:id', (req, res) => {
  const jobs = readJobs();
  const updated = jobs.filter((job) => job.id !== req.params.id);
  writeJobs(updated);
  res.json({ message: 'Job deleted' });
});

module.exports = router;
