const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { generatePresentation } = require('./pptxGenerator');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.post('/api/generate-pptx', async (req, res) => {
  try {
    const { title, slides, options = {} } = req.body;

    if (!slides || !Array.isArray(slides) || slides.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid request', 
        message: 'Slides array is required and must not be empty' 
      });
    }

    const pptxBuffer = await generatePresentation({ title, slides, options });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    res.setHeader('Content-Disposition', `attachment; filename="${title || 'presentation'}.pptx"`);
    res.send(Buffer.from(pptxBuffer));
  } catch (error) {
    console.error('Error generating PPTX:', error);
    res.status(500).json({ 
      error: 'Failed to generate presentation', 
      message: error.message 
    });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`PPTX Generator API running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Generate PPTX: POST http://localhost:${PORT}/api/generate-pptx`);
});