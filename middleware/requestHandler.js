const multer = require('multer')

const setRole = (role = 'user') => {
  return (req, res, next) => {
    req.body.role = role // Set custom value in req.body
    next() // Move to the next middleware or route handler
  }
}

const generateCustomFilename = (req, file, cb) => {
  const originalname = file.originalname
  const extension = originalname.split('.').pop() // Get the file extension
  const originalnameWithoutExtension = originalname.split('.')[0] // Get the original filename without extension
  const sanitizedOriginalname = originalnameWithoutExtension.replace(
    /[^a-zA-Z0-9]/g,
    '',
  ) // Remove non-alphanumeric characters
  const uniqueFilename = sanitizedOriginalname + Date.now() // Combine sanitized filename and timestamp

  const finalFilename = uniqueFilename + '.' + extension // Combine with extension

  cb(null, finalFilename) // Use the customized filename
}

// File upload filter to only upload image file
const filterExt = (req, file, callback) => {
  const fileType = file.mimetype.split('/')[0]
  if (fileType === 'image') {
    // Check file extension
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif']
    const fileExtension = file.originalname.split('.').pop().toLowerCase()
    if (validExtensions.includes(fileExtension)) {
      callback(null, true)
    } else {
      // Remove uploaded file if extension doesn't match
      req.fileValidationError = 'Invalid file extension'
      callback(null, false)
    }
  } else {
    callback(new Error('Only image formats allowed!'))
  }
}

// File upload error handling middleware
const handleFileUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer error occurred during file upload
    res.status(400).json({
      success: false,
      message: 'File upload error',
      error: err.message,
    })
  } else if (err) {
    // Other error occurred during file upload
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: err.message,
    })
  } else {
    next()
  }
}

// Middleware for handling pagination limits and page numbers
const limitPagination = (req, res, next) => {
  const paramData = req.query

  // Set the default limit to 10 or use the limit value from the request query
  let limit = Number(paramData.limit) || 10

  let page_number = 0
  if (paramData.page_number) {
    // Calculate the starting index for pagination based on the page number and limit
    if (paramData.page_number > 1) {
      page_number = (paramData.page_number - 1) * limit
    } else {
      page_number = 0
    }
  } else {
    page_number = 0
  }

  // Limit the maximum value of the limit to 50
  if (limit > 50) {
    limit = 50
  }

  // Update the request query object with the modified limit and page_number values
  req.pagination = {
    skip: page_number,
    limit,
  }

  next()
}

module.exports = {
  setRole,
  filterExt,
  limitPagination,
  handleFileUploadError,
  generateCustomFilename,
}
