const posts = [
    {
        "id": 1,
        "user": {
            "name": "Cooper Black",
            "handle": "@cb",
            "avatar": "https://mux8.com/img/CGPT/CooperBlack0.webp"
        },
        "content": "This is a sample zing. <span class='active'>#TwitterClone #XClone</span>",
        "likes": 5,
        "rezings": 2,
        "comments": 3
    },
    {
        "id": 2,
        "user": {
            "name": "Wan De",
            "handle": "@wan",
            "avatar": "https://mux8.com/img/CGPT/WanDe0.webp"
        },
        "content": "Check out my new project on GitHub!<br> <span class='active'>https://github.com/MuxAI</span>",
        "likes": 12,
        "rezings": 5,
        "comments": 4
    },
    {
        "id": 3,
        "user": {
            "name": "Adam Jucas",
            "handle": "@deadmanalive",
            "avatar": "https://mux8.com/img/CGPT/AdamJucas0.webp"
        },
        "content": "Had an amazing weekend trip to the mountains! <span class='active'>#travel #outdoors</span>",
        "likes": 8,
        "rezings": 1,
        "comments": 0
    }
];

function renderPosts() {
    const postFeed = document.getElementById("post-feed");
    postFeed.innerHTML = '';

    posts.forEach(post => {
        const postElement = document.createElement("div");
        postElement.classList.add("post");

        postElement.innerHTML = `
            <div class="user">
                <img src="${post.user.avatar}" alt="Avatar">
                <div>
                    <strong>${post.user.name}<span class="verified-badge">
        <i class="fa-solid fa-certificate badge-bg"></i>
        <i class="fa-solid fa-circle badge-middle"></i>
        <i class="fa-solid fa-check-circle badge-check"></i>  
    </span></strong>
                    <span style="color: gray;">${post.user.handle}</span>
                </div>
            </div>
            <p>${post.content}</p>
            <div class="post-actions">
                <span onclick="likePost(${post.id})"><i class="fa-regular fa-heart"></i> ${post.likes}</span>
                <span onclick="rezingPost(${post.id})"><i class="fa-solid fa-retweet"></i> ${post.rezings}</span>
                <span onclick="commentPost(${post.id})"><i class="fa-regular fa-comment"></i> ${post.comments}</span>
            </div>
        `;
        postFeed.appendChild(postElement);
    });
}

function likePost(postId) {
    const post = posts.find(p => p.id === postId);
    post.likes++;
    renderPosts();
}

function rezingPost(postId) {
    const post = posts.find(p => p.id === postId);
    post.rezings++;
    renderPosts();
}

function commentPost(postId) {
    alert("Comment functionality coming soon!");
}

document.getElementById("zing-button").addEventListener("click", function () {
    const zingInput = document.getElementById("zing-input").value;
    if (zingInput.trim() !== "") {
        posts.unshift({
            "id": posts.length + 1,
            "user": {
                "name": "Jake",
                "handle": "@jakexcalibur",
                "avatar": "https://mux8.com/img/805595708_Nendoroid.png"
            },
            "content": zingInput,
            "likes": 0,
            "rezings": 0,
            "comments": 0
        });
        document.getElementById("zing-input").value = "";
        renderPosts();
    }
});

document.addEventListener("DOMContentLoaded", renderPosts);
