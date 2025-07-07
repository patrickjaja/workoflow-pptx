const PptxGenJS = require('pptxgenjs');
const config = require('./config');

async function generatePresentation({ title, slides, options = {} }) {
  const pptx = new PptxGenJS();

  // Set presentation properties
  pptx.author = options.author || config.presentation.defaultAuthor;
  pptx.company = options.company || config.presentation.defaultCompany;
  pptx.revision = options.revision || config.presentation.defaultRevision;
  pptx.subject = options.subject || config.presentation.defaultSubject;
  pptx.title = title || 'Untitled Presentation';
  
  // Set layout if provided and valid
  if (options.layout) {
    // Layout should be one of: 'LAYOUT_4x3', 'LAYOUT_16x9', 'LAYOUT_16x10', 'LAYOUT_WIDE'
    pptx.layout = options.layout;
  }

  // Define slide masters if provided
  if (options.slideMasters && Array.isArray(options.slideMasters)) {
    for (const master of options.slideMasters) {
      await defineSlideLayoutEx(pptx, master);
    }
  }

  // Process each slide
  for (const slideData of slides) {
    // Add slide with optional master slide reference
    const slide = slideData.masterName 
      ? pptx.addSlide(slideData.masterName)
      : pptx.addSlide();

    // Set slide background if provided
    if (slideData.background) {
      slide.background = slideData.background;
    } else if (!slideData.masterName && config.slide.defaultBackground) {
      // Only apply default background if not using a master
      slide.background = config.slide.defaultBackground;
    }

    // Process slide content
    if (slideData.content && Array.isArray(slideData.content)) {
      for (const element of slideData.content) {
        await addElementToSlide(slide, element);
      }
    }

    // Add slide notes if provided
    if (slideData.notes) {
      slide.addNotes(slideData.notes);
    }
  }

  // Generate the presentation as a buffer
  const buffer = await pptx.write({ outputType: 'nodebuffer' });
  return buffer;
}

async function addElementToSlide(slide, element) {
  const { type, value, options = {} } = element;

  switch (type) {
    case 'text':
      addText(slide, value, options);
      break;
    case 'image':
      addImage(slide, value, options);
      break;
    case 'shape':
      addShape(slide, value, options);
      break;
    case 'table':
      addTable(slide, value, options);
      break;
    case 'chart':
      addChart(slide, value, options);
      break;
    default:
      console.warn(`Unknown element type: ${type}`);
  }
}

function addText(slide, text, options) {
  // If placeholder is specified, use it
  if (options.placeholder) {
    slide.addText(text, { placeholder: options.placeholder });
  } else {
    // Regular text options
    const textOptions = {
      x: options.x || 1,
      y: options.y || 1,
      w: options.w || '80%',
      h: options.h || 1,
      fontSize: options.fontSize || config.text.defaultFontSize,
      fontFace: options.fontFace || config.text.defaultFont,
      color: options.color || config.text.defaultColor,
      bold: options.bold || false,
      italic: options.italic || false,
      underline: options.underline || false,
      align: options.align || 'left',
      valign: options.valign || 'top',
      margin: options.margin || config.slide.defaultMargin,
    };

    if (options.fill) {
      textOptions.fill = options.fill;
    }

    slide.addText(text, textOptions);
  }
}

function addImage(slide, imageData, options) {
  const imageOptions = {
    x: options.x || 1,
    y: options.y || 1,
    w: options.w || 4,
    h: options.h || 3,
  };

  if (options.hyperlink) {
    imageOptions.hyperlink = options.hyperlink;
  }

  if (options.rounding) {
    imageOptions.rounding = options.rounding;
  }

  // Support both data URLs and file paths
  if (imageData.startsWith('data:')) {
    imageOptions.data = imageData;
  } else {
    imageOptions.path = imageData;
  }

  slide.addImage(imageOptions);
}

function addShape(slide, shapeType, options) {
  const shapeOptions = {
    x: options.x || 1,
    y: options.y || 1,
    w: options.w || 3,
    h: options.h || 3,
    fill: options.fill || { color: config.shapes.defaultFillColor },
    line: options.line || { color: config.shapes.defaultLineColor, width: config.shapes.defaultLineWidth },
  };

  slide.addShape(shapeType || 'rect', shapeOptions);
}

function addTable(slide, tableData, options) {
  if (!Array.isArray(tableData) || tableData.length === 0) {
    console.warn('Invalid table data provided');
    return;
  }

  const tableOptions = {
    x: options.x || 1,
    y: options.y || 1,
    w: options.w || 8,
    fontSize: options.fontSize || 14,
    autoPage: options.autoPage || false,
  };

  // Handle border option properly
  if (options.border !== undefined) {
    if (options.border === true) {
      tableOptions.border = { pt: 1, color: '000000' };
    } else if (typeof options.border === 'object') {
      tableOptions.border = options.border;
    }
  }

  if (options.colW) {
    tableOptions.colW = options.colW;
  }

  slide.addTable(tableData, tableOptions);
}

function addChart(slide, chartData, options) {
  const { type: chartType = 'bar', data, categories } = chartData;

  if (!data || !Array.isArray(data)) {
    console.warn('Invalid chart data provided');
    return;
  }

  const chartOptions = {
    x: options.x || 1,
    y: options.y || 1,
    w: options.w || 8,
    h: options.h || 4,
    chartColors: options.chartColors || config.charts.defaultColors,
  };

  if (options.showLegend !== undefined) {
    chartOptions.showLegend = options.showLegend;
  }

  if (options.showTitle !== undefined) {
    chartOptions.showTitle = options.showTitle;
  }

  if (options.title) {
    chartOptions.title = options.title;
  }

  const chartDefinition = data.map((series, index) => ({
    name: series.name || `Series ${index + 1}`,
    labels: categories || series.labels,
    values: series.values,
  }));

  slide.addChart(chartType, chartDefinition, chartOptions);
}

async function defineSlideLayoutEx(pptx, masterDefinition) {
  const { name, width, height, background, objects = [] } = masterDefinition;

  if (!name) {
    console.warn('Slide master definition missing required name property');
    return;
  }

  const masterOptions = {
    title: name,
    width: width || 10,
    height: height || 5.625,
  };

  if (background) {
    masterOptions.background = background;
  }

  if (objects && objects.length > 0) {
    masterOptions.objects = objects.map(obj => {
      const processedObj = {};
      
      // Handle placeholder objects according to PptxGenJS API
      if (obj.placeholder) {
        processedObj.placeholder = {
          options: {
            name: obj.placeholder,
            type: obj.type || 'body',
            x: obj.x,
            y: obj.y,
            w: obj.w,
            h: obj.h,
            // Include styling options from the original object
            fontSize: obj.options?.fontSize || config.text.defaultFontSize,
            fontFace: obj.options?.fontFace || config.text.defaultFont,
            color: obj.options?.color || config.text.defaultColor,
            bold: obj.options?.bold,
            italic: obj.options?.italic,
            align: obj.options?.align,
            valign: obj.options?.valign
          },
          text: obj.text || ''
        };
      }
      // Handle regular text objects
      else if (obj.text !== undefined && !obj.placeholder) {
        processedObj.text = {
          text: obj.text,
          options: {
            x: obj.x,
            y: obj.y,
            w: obj.w,
            h: obj.h,
            fontSize: obj.options?.fontSize || config.text.defaultFontSize,
            fontFace: obj.options?.fontFace || config.text.defaultFont,
            color: obj.options?.color || config.text.defaultColor,
            bold: obj.options?.bold,
            italic: obj.options?.italic,
            align: obj.options?.align,
            valign: obj.options?.valign
          }
        };
      }
      // Handle shapes
      else if (obj.shape === 'rect') {
        processedObj.rect = {
          x: obj.x,
          y: obj.y,
          w: obj.w,
          h: obj.h,
          fill: obj.fill
        };
      }

      else if (obj.type === 'image') {
        processedObj.image = {
          x: obj.x,
          y: obj.y,
          w: obj.w,
          h: obj.h,
          data: obj.data, // Assuming data is a base64 string or file path
        }
      }

      return processedObj;
    });
  }

  // Define the slide master
  pptx.defineSlideMaster(masterOptions);
}

module.exports = {
  generatePresentation,
};
