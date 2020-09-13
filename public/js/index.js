/* document.querySelectorAll("[data-match-status]").forEach(el => {
    el.addEventListener("click", function (event) {
        const matchId = event.currentTarget.getAttribute("data-match-status");
        axios.post(`/match/${matchId}/accepted`)
            .then(() => {

                console.log('OK');

            })
    })
})  */


document.querySelectorAll("[data-match-status]").forEach(el => {
    el.addEventListener("click", function (event) {
        const matchBtn = event.currentTarget;
        const matchId = event.currentTarget.getAttribute("data-match-status");

        const matcherId = event.currentTarget.getAttribute("data-match-matcherid");
        const denyBtn = document.getElementById('match-deny-btn');
        //const denyBtn = event.currentTarget.getAttribute("data-match-matcherid");

        axios.post(`/match/${matchId}/accepted`)
            .then( () => {
                matchBtn.innerText = 'View Profile';
                //matchBtn.classList.remove('btn-warning');
                matchBtn.className = 'btn-sm btn btn-info waves-effect waves-light';

                matchBtn.href = `/user/${matcherId}/profilefeed`;

                denyBtn.innerHTML = '';
            })
    })
})

//Scroll Button
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

