import './index.css'
import webpackImg from './assets/webpack.png'

function component() {
  var element = document.createElement('div')
  element.innerHTML = 'components'
  element.className = 'container'

  var image = document.createElement('img')
  image.src = webpackImg
  element.appendChild(image)

  return element
}

document.body.appendChild(component())
