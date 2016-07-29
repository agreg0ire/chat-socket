const socket = io()
//emmitting
$('form').submit(() => {
  socket.emit('chat msg', $('#nickname').val()+$('#m').val())
  document.getElementById('messages').insertAdjacentHTML('afterbegin', '<li><b><u>YOU said: </u></b>'+document.getElementById('m').value+'</li>')
  $('#m').val('')
  document.getElementById('m').addEventListener('keyup', isTyping) //event listener should BE added again here
  return false
})

document.getElementById('m').addEventListener('keyup', isTyping)

function isTyping(e) {

  console.log(`e ${e}`);

  if(e.which !== 13) {
    socket.emit('isTyping', ' is typing...')
    document.getElementById('m').removeEventListener('keyup', isTyping)
  }
}

const events = ['chat msg', 'disconnected', 'new user connected', 'isTyping']

//reception
events.forEach(event => {

  if(event === 'isTyping') {

      socket.on(event, msg => {

        let i = 0
        let interval = setInterval(() => {

          console.log(`i => ${i}`);

          if(i === 0) {
            if(document.getElementById(msg) == null) {
              document.getElementById('messages').insertAdjacentHTML('afterbegin', `<li id="${msg}"><b><u>${msg} is typing...</u></b></li>`)
            }else{//to reset on the top again
              document.getElementById('messages').removeChild(document.getElementById(msg))
              document.getElementById('messages').insertAdjacentHTML('afterbegin', `<li id="${msg}"><b><u>${msg} is typing...</u></b></li>`)
            }
          }

          if(i > 2) { // we choose to wait 3 seconds
            i = 0 //to be able to re add event listener
            document.getElementById(msg).style.display = 'none'
            clearInterval(interval)
          }
          i++//attention
        }, 1000)
    })

}else{
    socket.on(event, msg => document.getElementById('messages').insertAdjacentHTML('afterbegin', `<li>${msg}</li>`))
  }
})
