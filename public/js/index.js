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
        const matchBtn = event.currentTarget;
        const matchId = event.currentTarget.getAttribute("data-match-status");
        const matcherId = event.currentTarget.getAttribute("data-matcherid");

        const denyBtn = document.getElementById(matchId);
        const denyBtnParent = denyBtn.parentNode;

        axios.post(`/match/${matchId}/accepted`)
            .then( () => {
                matchBtn.innerText = 'View Profile';
                matchBtn.className = 'col-12 btn btn-sm btn-info waves-effect waves-light';
                matchBtn.href = `/user/${matcherId}/profilefeed`;

                matchBtn.parentNode.className= 'text-center col-12';

                denyBtnParent.removeChild(denyBtn)
            })
    })
})



document.querySelectorAll("[data-match-requestbtn]").forEach(el => {
    el.addEventListener("click", function (event) {
        const matchRequestBtn = event.currentTarget;
        console.log(matchRequestBtn);
        const btnParent = matchRequestBtn.parentNode;
        btnParent.removeChild(matchRequestBtn);
    })
})

//Scroll Button in feedview to write posts
mybutton = document.getElementById("myBtn");

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

availableChange = document.getElementById("pet-status");


if (availableChange.innerHTML === "not available") {
    availableChange.style.color = "red";
}
