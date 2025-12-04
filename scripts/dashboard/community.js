// update post avatar with user initial
function updatePostAvatar() {
    const userName = localStorage.getItem('userName');
    const avatarSpan = document.querySelector('.post-content__avatar span');
    
    if (userName && avatarSpan) {
        const initial = userName.trim().charAt(0).toUpperCase();
        avatarSpan.textContent = initial;
    }
}

updatePostAvatar()
