# Docker Test PPTX Generation

## Test Command

### Basic Test (Without Slide Master)

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
            "value": "• Generate PowerPoint files via REST API\n• Support for text, images, shapes, tables, and charts\n• Customizable styling and formatting\n• Slide master/layout support for consistent design\n• Docker support for easy deployment",
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

### Test with Slide Master

```bash
curl -X POST http://localhost:3001/api/generate-pptx \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Docker Master Test",
    "slides": [
      {
        "masterName": "DOCKER_MASTER",
        "content": [
          {
            "type": "text",
            "value": "Docker Container Deployment",
            "options": {
              "placeholder": "title"
            }
          },
          {
            "type": "text",
            "value": "Version 1.0.0",
            "options": {
              "placeholder": "subtitle"
            }
          }
        ]
      },
      {
        "masterName": "DOCKER_MASTER",
        "content": [
          {
            "type": "text",
            "value": "Container Benefits",
            "options": {
              "placeholder": "title"
            }
          },
          {
            "type": "text",
            "value": "• Consistent environment across platforms\n• Easy scaling and deployment\n• Isolated dependencies\n• Quick setup with docker-compose",
            "options": {
              "placeholder": "body"
            }
          }
        ]
      },
      {
        "masterName": "DOCKER_MASTER",
        "content": [
          {
            "type": "text",
            "value": "API Endpoints",
            "options": {
              "placeholder": "title"
            }
          },
          {
            "type": "table",
            "value": [
              ["Endpoint", "Method", "Description"],
              ["/health", "GET", "Health check"],
              ["/api/generate-pptx", "POST", "Generate presentation"]
            ],
            "options": {
              "x": 1,
              "y": 2,
              "w": 8,
              "fontSize": 14,
              "border": true
            }
          }
        ]
      }
    ],
    "options": {
      "author": "Docker Test",
      "company": "PPTX Generator API",
      "slideMasters": [
        {
          "name": "DOCKER_MASTER",
          "background": {
            "color": "1E3A5F"
          },
          "objects": [
            {
              "placeholder": "title",
              "text": "Title Placeholder",
              "x": 0.5,
              "y": 0.5,
              "w": 9,
              "h": 1.2,
              "options": {
                "fontSize": 40,
                "bold": true,
                "color": "FFFFFF",
                "align": "center"
              }
            },
            {
              "placeholder": "subtitle",
              "x": 0.5,
              "y": 1.8,
              "w": 9,
              "h": 0.8,
              "options": {
                "fontSize": 20,
                "color": "A0C4FF",
                "align": "center"
              }
            },
            {
              "placeholder": "body",
              "x": 1,
              "y": 2.5,
              "w": 8,
              "h": 2.5,
              "options": {
                "fontSize": 18,
                "color": "FFFFFF"
              }
            },
            {
              "shape": "rect",
              "x": 0,
              "y": 5.3,
              "w": 10,
              "h": 0.3,
              "fill": {
                "color": "0066CC"
              }
            },
            {
              "text": "🐳 Powered by Docker",
              "x": 7.5,
              "y": 5.35,
              "w": 2.3,
              "h": 0.2,
              "options": {
                "fontSize": 10,
                "color": "FFFFFF",
                "align": "right"
              }
            }
          ]
        }
      ]
    }
  }' \
  --output docker-master-test.pptx -s -w "\nHTTP Status: %{http_code}\nContent-Type: %{content_type}\nFile Size: %{size_download} bytes\n"
```

## Expected Output for Slide Master Test

```
HTTP Status: 200
Content-Type: application/vnd.openxmlformats-officedocument.presentationml.presentation
File Size: ~55000 bytes
```

## What the Slide Master Test Creates

A PowerPoint presentation with a consistent Docker-themed design:
- **Master Layout**: Dark blue background (1E3A5F) with Docker branding
  - Title placeholder: White text, 40pt, bold, centered
  - Subtitle placeholder: Light blue text (A0C4FF), 20pt, centered
  - Body placeholder: White text, 18pt
  - Blue footer bar with "🐳 Powered by Docker" text
- **Slide 1**: Title slide using the master
  - Title: "Docker Container Deployment"
  - Subtitle: "Version 1.0.0"
- **Slide 2**: Content slide with bullet points
  - Title: "Container Benefits"
  - Body: List of Docker advantages
- **Slide 3**: Mixed content with table
  - Title: "API Endpoints"
  - Table showing available endpoints