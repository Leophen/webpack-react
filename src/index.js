import './index.css'

function component() {
  var element = document.createElement('div')

  element.innerHTML = 'components'
  element.className = 'container'

  return element
}

document.body.appendChild(component())
