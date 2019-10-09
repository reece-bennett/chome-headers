const $ = selectors => document.querySelector(selectors)
const tableBody = $('tbody')

function createRow(header) {
  const row = document.createElement('tr')

  const checkboxCell = document.createElement('td')
  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.name = 'isEnabled'
  checkbox.checked = header.isEnabled
  checkbox.addEventListener('change', event => {
    updateRow(header, event)
  })
  checkboxCell.appendChild(checkbox)
  row.appendChild(checkboxCell)

  const nameCell = document.createElement('td')
  const nameInput = document.createElement('input')
  nameInput.type = 'text'
  nameInput.name = 'name'
  nameInput.value = header.name
  nameInput.addEventListener('input', event => {
    updateRow(header, event)
  })
  nameCell.appendChild(nameInput)
  row.appendChild(nameCell)

  const valueCell = document.createElement('td')
  const valueInput = document.createElement('input')
  valueInput.type = 'text'
  valueInput.name = 'value'
  valueInput.value = header.value
  valueInput.addEventListener('input', event => {
    updateRow(header, event)
  })
  valueCell.appendChild(valueInput)
  row.appendChild(valueCell)

  const deleteCell = document.createElement('td')
  const deleteButton = document.createElement('button')
  deleteButton.innerHTML = '&#x2716;'
  deleteButton.addEventListener('click', () => {
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
  chrome.storage.sync.get('headers', data => {
    const headers = data.headers
    const id = headers.length ? headers[headers.length - 1].id + 1 : 0
    headers.push({ id, name: '', value: '', isEnabled: true })
    chrome.storage.sync.set({ headers }, () => {
      refreshRows(headers)
    })
  })
}

function deleteRow(header) {
  chrome.storage.sync.get('headers', data => {
    const headers = data.headers
    const newHeaders = headers.filter(h => h.id !== header.id)
    chrome.storage.sync.set({ headers: newHeaders }, () => {
      refreshRows(newHeaders)
    })
  })
}

function updateRow(header, event) {
  const el = event.target
  chrome.storage.sync.get('headers', data => {
    const headers = data.headers.map(h => {
      if (h.id === header.id) {
        h[el.name] = el.type === 'checkbox' ? el.checked : el.value
      }
      return h
    })
    chrome.storage.sync.set({ headers })
  })
}

chrome.storage.sync.get('headers', data => {
  refreshRows(data.headers)
})

$('#addRow').addEventListener('click', addRow)
