module.exports = successMessage = ({
  message = '',
  data = null,
  limit = null,
  totalRows = null,
  token = null,
}) => {
  let response = {
    success: true,
    message: message,
    data: data,
  }

  if (limit !== null && totalRows !== null) {
    response.perPageRows = limit
    response.totalPages = Math.ceil(totalRows / limit)
    response.totalData = totalRows
  }
  if (token) {
    response.token = token
  }

  return response
}
