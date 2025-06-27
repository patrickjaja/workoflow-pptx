# PPTX Generator API

A REST API service for generating PowerPoint presentations programmatically using Node.js and PptxGenJS.

## Features

- Generate PowerPoint presentations via REST API
- Support for multiple slide types and content
- Text, images, shapes, tables, and charts
- Customizable styling and formatting
- Docker support for easy deployment
- Binary response for direct file download

## Quick Start

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### Docker Deployment

Using Docker Compose:
```bash
docker-compose up -d
```

Or build and run manually:
```bash
docker build -t pptx-generator-api .
docker run -p 3000:3000 pptx-generator-api
```

## API Documentation

### Health Check

```
GET /health
```

Returns the health status of the API.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2023-12-08T10:30:00.000Z"
}
```

### Generate PowerPoint

```
POST /api/generate-pptx
Content-Type: application/json
```

Generates a PowerPoint presentation and returns it as a binary file.

**Request Body:**
```json
{
  "title": "My Presentation",
  "slides": [
    {
      "background": { "color": "FFFFFF" },
      "content": [
        {
          "type": "text",
          "value": "Welcome to My Presentation",
          "options": {
            "x": 1,
            "y": 1,
            "w": 8,
            "h": 2,
            "fontSize": 36,
            "color": "363636",
            "bold": true,
            "align": "center"
          }
        }
      ],
      "notes": "Speaker notes for this slide"
    }
  ],
  "options": {
    "author": "John Doe",
    "company": "ACME Corp",
    "subject": "Quarterly Report",
    "layout": "16x9"
  }
}
```

**Response:**
- Content-Type: `application/vnd.openxmlformats-officedocument.presentationml.presentation`
- Binary PPTX file

## Content Types

### Text
```json
{
  "type": "text",
  "value": "Hello World",
  "options": {
    "x": 1,
    "y": 1,
    "w": "80%",
    "h": 1,
    "fontSize": 18,
    "fontFace": "Arial",
    "color": "000000",
    "bold": false,
    "italic": false,
    "underline": false,
    "align": "left",
    "valign": "top"
  }
}
```

### Image
```json
{
  "type": "image",
  "value": "data:image/png;base64,iVBORw0KG...",
  "options": {
    "x": 1,
    "y": 1,
    "w": 4,
    "h": 3,
    "hyperlink": "https://example.com"
  }
}
```

### Shape
```json
{
  "type": "shape",
  "value": "rect",
  "options": {
    "x": 1,
    "y": 1,
    "w": 3,
    "h": 3,
    "fill": { "color": "0088CC" },
    "line": { "color": "000000", "width": 1 }
  }
}
```

### Table
```json
{
  "type": "table",
  "value": [
    ["Header 1", "Header 2", "Header 3"],
    ["Row 1 Col 1", "Row 1 Col 2", "Row 1 Col 3"],
    ["Row 2 Col 1", "Row 2 Col 2", "Row 2 Col 3"]
  ],
  "options": {
    "x": 1,
    "y": 1,
    "w": 8,
    "fontSize": 14,
    "border": true,
    "colW": [2.5, 2.5, 3]
  }
}
```

### Chart
```json
{
  "type": "chart",
  "value": {
    "type": "bar",
    "data": [
      {
        "name": "Series 1",
        "values": [25, 40, 30, 35]
      }
    ],
    "categories": ["Q1", "Q2", "Q3", "Q4"]
  },
  "options": {
    "x": 1,
    "y": 1,
    "w": 8,
    "h": 4,
    "showLegend": true,
    "title": "Quarterly Sales"
  }
}
```

## Examples

### Simple Text Presentation

```bash
curl -X POST http://localhost:3000/api/generate-pptx \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Simple Presentation",
    "slides": [
      {
        "content": [
          {
            "type": "text",
            "value": "Hello World!",
            "options": {
              "x": "10%",
              "y": "45%",
              "w": "80%",
              "fontSize": 48,
              "align": "center"
            }
          }
        ]
      }
    ]
  }' \
  --output presentation.pptx
```

### Multi-Slide with Mixed Content

```javascript
const axios = require('axios');
const fs = require('fs');

const presentationData = {
  title: "Company Report",
  slides: [
    {
      background: { color: "003366" },
      content: [
        {
          type: "text",
          value: "Annual Report 2023",
          options: {
            x: 1,
            y: 2,
            w: 8,
            h: 2,
            fontSize: 44,
            color: "FFFFFF",
            bold: true,
            align: "center"
          }
        },
        {
          type: "text",
          value: "ACME Corporation",
          options: {
            x: 1,
            y: 4,
            w: 8,
            h: 1,
            fontSize: 24,
            color: "FFFFFF",
            align: "center"
          }
        }
      ]
    },
    {
      content: [
        {
          type: "text",
          value: "Sales Performance",
          options: {
            x: 1,
            y: 0.5,
            fontSize: 32,
            bold: true
          }
        },
        {
          type: "chart",
          value: {
            type: "bar",
            data: [
              {
                name: "2023",
                values: [45, 52, 61, 68]
              },
              {
                name: "2022",
                values: [38, 45, 52, 55]
              }
            ],
            categories: ["Q1", "Q2", "Q3", "Q4"]
          },
          options: {
            x: 1,
            y: 1.5,
            w: 8,
            h: 4,
            showLegend: true,
            title: "Quarterly Revenue (in millions)"
          }
        }
      ]
    }
  ],
  options: {
    author: "Jane Doe",
    company: "ACME Corporation"
  }
};

axios.post('http://localhost:3000/api/generate-pptx', presentationData, {
  responseType: 'arraybuffer'
})
.then(response => {
  fs.writeFileSync('report.pptx', response.data);
  console.log('Presentation saved as report.pptx');
})
.catch(error => {
  console.error('Error generating presentation:', error);
});
```

## Configuration

Default configuration can be found in `src/config.js`. You can modify defaults for:
- Presentation properties
- Slide backgrounds
- Text formatting
- Shape styles
- Chart colors
- File size limits

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (development/production)

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success, returns PPTX file
- `400` - Bad request (invalid input)
- `404` - Endpoint not found
- `500` - Server error

Error response format:
```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

## License

ISC