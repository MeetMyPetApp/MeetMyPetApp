const chatTimer = setTimeout(() => {

    //const chatId = document.body.querySelector('[data-chat-identifier]').getAttribute('data-chat-identifier');
    window.location.assign(`http://localhost:3000/chat/${chatId}`)
    /* axios.get(`/chat/${chatId}`)
        .then(response => {
            console.log(response.data);
        })
        .catch(err => console.log(err)); 
    window.location.reload(); */
}, 3000)

clearTimeout(chatTimer);