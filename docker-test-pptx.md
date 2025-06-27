# Docker Test PPTX Generation

## Test Command

```bash
curl -X POST http://localhost:3001/api/generate-pptx \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Docker Test Presentation",
    "slides": [
      {
        "background": { "color": "F0F0F0" },
        "content": [
          {
            "type": "text",
            "value": "Welcome to PPTX Generator API",
            "options": {
              "x": 1,
              "y": 1,
              "w": 8,
              "h": 1.5,
              "fontSize": 44,
              "color": "363636",
              "bold": true,
              "align": "center"
            }
          },
          {
            "type": "text",
            "value": "Running in Docker Container",
            "options": {
              "x": 1,
              "y": 3,
              "w": 8,
              "h": 1,
              "fontSize": 24,
              "color": "666666",
              "align": "center"
            }
          }
        ]
      },
      {
        "content": [
          {
            "type": "text",
            "value": "Features",
            "options": {
              "x": 1,
              "y": 0.5,
              "fontSize": 36,
              "bold": true
            }
          },
          {
            "type": "text",
            "value": "• Generate PowerPoint files via REST API\n• Support for text, images, shapes, tables, and charts\n• Customizable styling and formatting\n• Docker support for easy deployment",
            "options": {
              "x": 1,
              "y": 2,
              "w": 8,
              "h": 3,
              "fontSize": 18,
              "color": "333333"
            }
          }
        ]
      }
    ],
    "options": {
      "author": "Docker Test",
      "company": "PPTX Generator API"
    }
  }' \
  --output docker-test.pptx -s -w "\nHTTP Status: %{http_code}\nContent-Type: %{content_type}\nFile Size: %{size_download} bytes\n"
```

## Expected Output

```
HTTP Status: 200
Content-Type: application/vnd.openxmlformats-officedocument.presentationml.presentation
File Size: 53460 bytes
```

## What This Creates

A PowerPoint presentation with:
- **Slide 1**: Title slide with light gray background
  - Main title: "Welcome to PPTX Generator API" (44pt, bold, centered)
  - Subtitle: "Running in Docker Container" (24pt, centered)
- **Slide 2**: Features slide
  - Header: "Features" (36pt, bold)
  - Bullet points listing API capabilities (18pt)