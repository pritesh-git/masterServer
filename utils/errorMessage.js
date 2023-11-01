module.exports = errorMessage = ({ errorType = '', error = null }) => {
  var errorResponse

  if (error && error.kind === 'ObjectId') {
    errorResponse = {
      success: false,
      message: `No record found with id: ${error.value._id || error.value}.`,
    }
  } else if (errorType === 'invalidToken') {
    errorResponse = {
      success: false,
      message: 'Invalid Token: You have passed invalid token.',
    }
  } else if (errorType === 'noToken') {
    errorResponse = {
      success: false,
      message: 'Empty Token: You have not passed any token.',
    }
  } else if (errorType === 'userNotFound') {
    errorResponse = {
      success: false,
      message: 'Empty data: User not found.',
    }
  } else if (errorType === 'userFetchError') {
    errorResponse = {
      success: false,
      message: 'Fetch Error: An error occurred while fetching user.',
    }
  } else if (errorType === 'invalidUser') {
    errorResponse = {
      success: false,
      message: 'Invalid user: Number or Email not registered. Please sign up.',
    }
  } else if (errorType === 'deletedUser') {
    errorResponse = {
      success: false,
      message:
        'User deleted: Your account has been requested for deletion. Please contact support for assistance.',
    }
  } else if (errorType === 'unverifiedUser') {
    errorResponse = {
      success: false,
      message:
        'Verification issue: Your account is not verified. Please complete OTP verification.',
    }
  } else if (errorType === 'invalidPassword') {
    errorResponse = {
      success: false,
      message: 'Invalid Password: You have entered invalid password',
    }
  } else if (errorType === 'invalidOldPassword') {
    errorResponse = {
      success: false,
      message: 'Invalid Password: You have entered invalid old password',
    }
  } else if (errorType === 'existingEmail') {
    errorResponse = {
      success: false,
      message: 'Used Email: Already existing email id entered',
    }
  } else if (errorType === 'existingNumber') {
    errorResponse = {
      success: false,
      message: 'Phone number: Already existing phone number entered',
    }
  } else if (errorType === 'serverError') {
    errorResponse = {
      success: false,
      message:
        'Server Error: Something went wrong on our end. Please try again later.',
    }
  } else {
    errorResponse = {
      success: false,
      message: errorType,
    }
  }

  if (error) {
    if (typeof error === 'string') {
      errorResponse.error = error
    } else if (error.message && typeof error.message === 'string') {
      errorResponse.error = error.message
    } else {
      errorResponse.error = error
    }
    console.error(errorType + ': ' + errorResponse.error)
  }

  return errorResponse
}
