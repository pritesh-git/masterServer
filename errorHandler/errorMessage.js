module.exports = errorMessage = error => {
  var data

  if (error.kind === 'ObjectId') {
    data = {
      success: false,
      message: `No record found with id: ${error.value._id || error.value}.`,
    }
  } else if (error === 'invalidToken') {
    data = {
      success: false,
      message: 'Invalid Token: You have passed invalid token.',
    }
  } else if (error === 'noToken') {
    data = {
      success: false,
      message: 'Invalid Token: You have not passed any token.',
    }
  } else if (error === 'postUnavailable') {
    data = {
      success: false,
      message: 'Invalid Post Id: You have passed invalid post id.',
    }
  } else if (error === 'invalidOldPassword') {
    data = {
      success: false,
      message: 'Invalid Password: You have Entered Old Password Wrong',
    }
  } else {
    data = {
      success: false,
      message: error,
    }
  }

  return data
}
