'use strict'
document.addEventListener('DOMContentLoaded', () => {
  let HTML = ''
  let NAME = ''
  document.getElementById('upload').addEventListener('click', event => {
    document.getElementById('file').click()
  })
  document.getElementById('download').addEventListener('click', event => {
    if (HTML === '') return
    const parent = document.createElement('a')
    parent.href = `data:text/html, ${encodeURIComponent(HTML)}`
    parent.download = `${NAME}_カウンタ付リンク.html`
    parent.click()
  })
  document.getElementById('file').addEventListener('change', (event) => {
    const template = document.getElementById('list').innerHTML
    const files = event.target.files
    if (!files.length) return
    const file = files[0]
    const fileName = file.name
    if (!/\.html?$/.test(fileName)) {
      alert('HTMLファイルを選択してください')
      return
    }
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onload = () => {
      const anchorReg = /<a (?:(?!<a |<\/a>).)*<\/a>/g // href="([^"]*)"
      const name = fileName.replace(/\..*/, '')
      const html = reader.result
      const anchorMatchs = html.match(anchorReg)
      if (anchorMatchs == null) {
        alert('リンクが1つも存在しないHTMLファイルです')
        return
      }
      let liHtml = ''
      const newHTML = html.replace(
        anchorReg,
        (element) => {
          const parent = document.createElement('div')
          parent.innerHTML = element
          const img = parent.getElementsByTagName('img')
          const alt = (img.length) ? img[0].getAttribute('alt').trim() : ''
          const text = parent.textContent.replace(/[\|\[\]]/g, ' ').trim()
          const newText = (text.length) ? text : (alt.length) ? alt : 'テキストなし'
          const url = parent.getElementsByTagName('a')[0].getAttribute('href')
          const webform = url.match(/secure-link\.jp\/wf\/\?c=(wf\d{8})/)
          const newUrl = (webform === null) ? `[[lc:${url}|${newText}]]` : `[[wf:${webform[1]}|${newText}]]`
          if (url === '' || /\$dt_|\[\[/.test(url)) return element
          const newElement = element.replace(url, newUrl)
          const templateParent = document.createElement('div')
          templateParent.innerHTML = template
          templateParent.getElementsByTagName('span')[0].textContent = (text.length) ? text : (alt.length) ? alt : ''
          templateParent.getElementsByTagName('span')[1].innerHTML = `<a href="${url}" target="_blank">${url}</a>`
          liHtml += templateParent.innerHTML
          return newElement
        }
      )
      if (!liHtml.length) {
        alert('変換が必要なリンクが1つも存在しないHTMLファイルです')
        return
      }
      document.getElementById('list').innerHTML = liHtml
      document.getElementById('filename').textContent = fileName
      HTML = newHTML
      NAME = name
    }
  })
}, false)