const chatTimer = setInterval(() => {

    const chatId = document.body.querySelector('[data-chat-identifier]').getAttribute('data-chat-identifier');
    axios.get(`/chat/${chatId}`)
        .then(() => {
            window.location.reload();
        })
        .catch(err => console.log(err)); 
}, 4000)

document.getElementById('chat-message-textarea').addEventListener('input', function () {
    clearInterval(chatTimer)
})

document.getElementById('chat-message-sendbtn').addEventListener('click', function () {
    return chatTimer
})