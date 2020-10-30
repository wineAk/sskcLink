'use strict'
const $ = require('jquery')
const fs = require('fs')
let HTML = ''
let HEAD = ''
let NAME = ''
$(function() {
  // UPLOAD
  $(document).on('click', '#upload', () => $('#file').click())
  // ファイルの処理
  $(document).on('change', '#file', (e) => {
    if (!e.target.files.length) return
    const fileName = $(e.target).prop('files')[0].name
    if (!/\.html?$/.test(fileName))  {
      alert('HTMLファイルを選択してください')
      return
    }
    $(e.target).next().text(fileName)
    const reader = new FileReader()
    reader.readAsText(e.target.files[0])
    reader.onload = () => {
      NAME = fileName.replace(/\..*/, '')
      HTML = reader.result
      let elm = ''
      $(HTML).find('a').each((index, element) => {
        const href = $(element).attr('href')
        const text = $(element).text().trim()
        const hrefRep = (href === '') ? '&nbsp;' : href
        const textRep = (text === '') ? '&nbsp;' : text
        const checked = (/&nbsp;|\[\[/.test(hrefRep)) ? 'disabled' : 'checked'
        elm +=
          `
          <tr id="rep${index}">
            <td>
              ${index}
            </td>
            <td>
              文字列<blockquote>${textRep}</blockquote>
              URL<blockquote>${hrefRep}</blockquote>
            </td>
            <td>
              <label>
                <input type="checkbox" ${checked}><span></span>
              </label>
            </td>
          </tr>
          `
      })
      $('tbody').html(elm)
    }
  })
  // SAVE
  $(document).on('click', '#download', (e) => {
    if (HTML === '') {
      alert('ファイルがありません')
      return
    }
    HEAD = HTML.match(/<!.*?<body[^<>]*>/)[0] // body以前が消えてしまうので保持しておく
    const html = HTML.replace(HEAD, '').replace(/<\/body>|<\/html>/, '') // body内だけ抽出して処理させる
    const $html = $(html)
    $html.find('a').each((index, element) => {
      const href = $(element).attr('href')
      const text = $(element).text().trim()
      const link = `[[lc:${href}|${text}]]`
      const checked = $(`#rep${index}`).find('input').prop('checked')
      if (checked) $html.find('a').eq(index).attr('href', link)
    })
    const body = $('<div>').append($html.clone()).html()
    const newHTML = `${HEAD}${body}</body></html>`
    $('<a>', {
      href: `data:text/html, ${encodeURIComponent(newHTML)}`,
      download: `${NAME}_カウンタ付リンク.html`
    })[0].click()
  })
})