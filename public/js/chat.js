const socket = io()

socket.on('message', (msg) => {
  console.log(msg)
})

document.querySelector('.msg').addEventListener('submit', (e) => {
  e.preventDefault()

  const message = document.querySelector('.msgText').value

  socket.emit('sendMessage', message, (error) => {
    if (error) {
      return console.log(error)
    }
    console.log('Message delivered.')
  })
})

document.querySelector('.shareLocation').addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported')
  }

  navigator.geolocation.getCurrentPosition((pos) => {
    socket.emit(
      'sendLocation',
      {
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
      },
      (ackMsg) => {
        console.log(ackMsg)
      }
    )
  })
})
