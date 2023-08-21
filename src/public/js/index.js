const socket = io()
let user
let chatBox = document.getElementById("chatBox")
let submitButton = document.getElementById("submitButton")


Swal.fire({
    title: "¿Cómo te Llamas?",
    input: "text",
    text: "Ingresa tu Nombre de Usuario",
    inputValidator: (value) => {
        return !value && "Necesitas escribir un Nombre de Usuario"
    },
    allowOutsideClick: false
}).then(result => {
    user = result.value
    socket.emit('authenticated', user)
})

chatBox.addEventListener('keyup', event => {
    if (event.key === "Enter") {
        if (chatBox.value.trim().length > 0) {
            socket.emit("message", { user: user, message: chatBox.value })
            chatBox.value = ""
        }
    }
})
submitButton.addEventListener('click', () => {
    if (chatBox.value.trim().length > 0) {
        socket.emit("message", { user: user, message: chatBox.value })
        chatBox.value = ""
    }
})


socket.on('messageLogs', data => {
    let log = document.getElementById("messageLogs")
    let messages = ""
    data.forEach(message => {
        messages += `${message.user}: ${message.message} <br>`
    });
    log.innerHTML = messages
})

socket.on('newUserConnected', data => {
    if (!user) return
    Swal.fire({
        toast: true,
        position: "top-right",
        title: `${data} se ha unido al Chat`,
        timer: 2000,
        showConfirmButton: false,
        icon: "info"
    })
})