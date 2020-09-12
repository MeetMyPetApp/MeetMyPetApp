document.querySelectorAll("[data-like-post]").forEach(el => {
    el.addEventListener("click", function () {
        axios.get(`/post/${this.dataset.likePost}/like`)
            .then(response => {
                const likesContainer = this.querySelector(".likes-count")
                likesContainer.innerText = Number(likesContainer.innerText) + response.data.like
            })
    })
  })


document.querySelectorAll("[data-match-status]").forEach(el => {
    el.addEventListener("click", function (event) {
        const matchId = event.currentTarget.getAttribute("data-match-status");
        axios.post(`/match/${matchId}/accepted`)
            .then(() => {
    
                console.log('OK');
               
            })
    })
})