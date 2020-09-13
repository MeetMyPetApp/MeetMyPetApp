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

