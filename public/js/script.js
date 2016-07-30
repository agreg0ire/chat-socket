const socket = io()
//emmitting
$('form').submit(() => {

  if(document.getElementById('m').value.trim() != ''){
    socket.emit('chat msg', $('#nickname').val()+$('#m').val())
    document.getElementById('messages').insertAdjacentHTML('afterbegin', '<li><b><u>YOU said: </u></b>'+document.getElementById('m').value+'</li>')
    $('#m').val('')
  }
return false
})

document.getElementById('m').addEventListener('keyup', isTyping)

function isTyping(e) {

  if(e.which !== 13) {
    socket.emit('isTyping', ' is typing...')

    let i = 0
    let interval = setInterval(() => {

      if(i === 0) {
        document.getElementById('m').removeEventListener('keyup', isTyping)
      }

      if(i > 2) {
        document.getElementById('m').addEventListener('keyup', isTyping)
        clearInterval(interval)
      }
      i++
    }, 1000)
  }

}

const events = ['chat msg', 'disconnected', 'new user connected', 'isTyping']

//reception
events.forEach(event => {

  if(event === 'isTyping') {

      socket.on(event, msg => {

        let i = 0
        let interval = setInterval(() => {

          if(i === 0) {

            if(document.getElementById(msg) == null) {
              document.getElementById('messages').insertAdjacentHTML('afterbegin', `<li id="${msg}"><b><u>${msg} is typing...</u></b></li>`)
            }else{//to reset on the top again
              document.getElementById('messages').removeChild(document.getElementById(msg))
              document.getElementById('messages').insertAdjacentHTML('afterbegin', `<li id="${msg}"><b><u>${msg} is typing...</u></b></li>`)
            }
          }

          if(i > 2) { // we choose to wait 3 seconds
            i = 0 //still better to reset
            document.getElementById(msg).style.display = 'none'
            clearInterval(interval)
          }
          i++//attention
        }, 1000)
    })

}else if(event === 'chat msg'){

  socket.on(event, payload => {
    let ip = JSON.parse(payload).ip
    let msg = JSON.parse(payload).msg

if(document.getElementById(ip)) {
  document.getElementById(ip).style.display = 'none'
}

    document.getElementById('messages').insertAdjacentHTML('afterbegin', `<li><b><u>${ip} said:</u></b> ${msg}</li>`)
  })

}else{
    socket.on(event, msg => document.getElementById('messages').insertAdjacentHTML('afterbegin', `<li>${msg}</li>`))
  }
})
