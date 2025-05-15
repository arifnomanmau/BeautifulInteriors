module.exports = (req, res) => {
  import('./index.js').then(module => {
    return module.default(req, res);
  }).catch(error => {
    console.error('Error loading the ES module:', error);
    res.status(500).json({ error: 'Internal server error' });
  });
};
