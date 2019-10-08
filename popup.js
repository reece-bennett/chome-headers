const $ = selectors => document.querySelector(selectors)
const tableBody = $('tbody')
$('#addRow').addEventListener('click', addRow)

function createRow(header) {
  const row = document.createElement('tr')

  const checkboxCell = document.createElement('td')
  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.checked = header.isEnabled
  checkboxCell.appendChild(checkbox)
  row.appendChild(checkboxCell)

  const nameCell = document.createElement('td')
  const nameInput = document.createElement('input')
  nameInput.type = 'text'
  nameInput.value = header.name
  nameCell.appendChild(nameInput)
  row.appendChild(nameCell)

  const valueCell = document.createElement('td')
  const valueInput = document.createElement('input')
  valueInput.type = 'text'
  valueInput.value = header.value
  valueCell.appendChild(valueInput)
  row.appendChild(valueCell)

  const deleteCell = document.createElement('td')
  const deleteButton = document.createElement('button')
  deleteButton.innerHTML = '&#x2716;'
  deleteButton.addEventListener('click', function() {
    deleteRow(header)
  })
  deleteCell.appendChild(deleteButton)
  row.appendChild(deleteCell)

  return row
}

function refreshRows(headers) {
  tableBody.innerHTML = ''

  for (let header of headers) {
    tableBody.appendChild(createRow(header))
  }
}

function addRow() {
  chrome.storage.sync.get('headers', function(data) {
    const headers = data.headers
    const id = headers.length ? headers[headers.length - 1].id + 1 : 0
    headers.push({ id, name: '', value: '', isEnabled: true })
    chrome.storage.sync.set({ headers }, function() {
      refreshRows(headers)
    })
  })
}

function deleteRow(header) {
  chrome.storage.sync.get('headers', function(data) {
    const headers = data.headers
    const newHeaders = headers.filter(h => h.id !== header.id)
    chrome.storage.sync.set({ headers: newHeaders }, function() {
      refreshRows(newHeaders)
    })
  })
}

function updateName(header, event) {

}

function updateValue(header, event) {
  
}

chrome.storage.sync.get('headers', function(data) {
  console.log(data)
  refreshRows(data.headers)
})
