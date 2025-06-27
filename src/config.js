module.exports = {
  presentation: {
    defaultAuthor: 'PPTX Generator API',
    defaultCompany: 'Generated via API',
    defaultRevision: '1',
    defaultSubject: 'Auto-generated presentation',
  },
  slide: {
    defaultBackground: { color: 'FFFFFF' },
    defaultMargin: 0.5,
  },
  text: {
    defaultFont: 'Arial',
    defaultFontSize: 18,
    defaultColor: '000000',
  },
  shapes: {
    defaultFillColor: '0088CC',
    defaultLineColor: '000000',
    defaultLineWidth: 1,
  },
  charts: {
    defaultColors: ['0088CC', 'FF6600', '00AA00', 'FF3366', 'FFD700', '6600CC'],
  },
  limits: {
    maxSlides: 100,
    maxFileSize: 50 * 1024 * 1024, // 50MB
  }
};