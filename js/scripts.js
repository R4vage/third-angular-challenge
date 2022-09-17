import defaultPosts from "./defaultPosts.json" assert { type: "json" };

const featuredList = document.getElementById("featured-list");
const currentList = document.getElementById("post-list");
const navButtons = document.querySelectorAll(".js-tag-button");
const homeButton = document.getElementById("home-button");

const modal = document.getElementById("single-post-modal");
const singlePost = document.getElementById("post-page");
const modalCross = document.getElementById("post-page__cross");
const postForm = document.getElementById("post-page__form");
const postImg = document.getElementById("post-page__img");
const postImgUrl = document.getElementById("post-page__image-url");
const postEdit = document.getElementById("post__edit");
const postDelete = document.getElementById("post__delete");
const postSave = document.getElementById("post__save");

class Post {
  constructor(imgUrl, title, body, author, tag, id) {
    (this.imgUrl = imgUrl),
      (this.title = title),
      (this.body = body),
      (this.author = author),
      (this.tag = tag),
      (this.readTime = Math.ceil(body.split(" ").length / 150)),
      (this.createdAt = new Date().getTime());
    this.id = id;
  }
}

class Storage {
  constructor(key) {
    this.key = key;
    if (
      !JSON.parse(localStorage.getItem(key)) ||
      JSON.parse(localStorage.getItem(key)).length === 0
    ) {
      this.setStorage(defaultPosts.posts);
    } else {
      this.value = JSON.parse(localStorage.getItem(key));
    }
  }

  getStorage() {
    return JSON.parse(localStorage.getItem(this.key));
  }

  setStorage(value) {
    this.value = value;
    localStorage.setItem(this.key, JSON.stringify(value));
  }

  removeItem(id) {
    let removedItemIndex = this.value.findIndex((element) => element.id === id);
    this.value.splice(removedItemIndex, 1);
    this.setStorage(this.value);
  }

  modifyItem(id, newItem) {
    let index = this.value.findIndex((element) => element.id === id);
    this.value[index] = newItem;
    this.setStorage(this.value);
  }

  addItem(task) {
    this.value.push(task);
    this.setStorage(this.value);
  }

  getItemsCount() {
    return this.value.length;
  }

  getLastId() {
    return parseInt(this.value[this.value.length - 1].id);
  }

  getItemIndex(id) {
    return this.value.findIndex((element) => element.id === id);
  }
}

class UI {
  preparePost(post) {
    const date = new Date(parseInt(post.createdAt)).toLocaleString([], {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
    const postHtml = `<img src="${post.imgUrl}">
            <div class="post__content">
                <h3>${post.title}</h3>
                <p class="post__body">${post.body.replace(
                  /^(.{90}[^\s]*).*/,
                  "$1"
                )}</p>
                <br>
                <div>
                    <p class="post__author">${post.author} in ${post.tag}</p>
                    <p class="post__created-at">${date} - ${
      post.readTime
    }min read</p>
                </div>
            </div>`;

    return postHtml;
  }

  displayPosts(posts, parent) {
    parent.innerHTML = "";
    posts.forEach((post) => {
      let div = document.createElement("div");
      div.className = "post";
      div.onclick = () => {
        modalState.changeModal(post);
      };
      div.innerHTML = this.preparePost(post);
      parent.appendChild(div);
    });
  }

  openModal() {
    modal.style.display = "flex";
    setTimeout(() => {
      modal.style.opacity = "100";
      singlePost.style.marginTop = "0";
    }, 100);
  }

  closeModal() {
    modal.style.opacity = "0";
    singlePost.style.marginTop = "-100%";
    setTimeout(() => {
      modal.style.display = "none";
    }, 200);
  }

  prepareModal(post) {
    postForm.elements["title"].value = post.title;
    postForm.elements["author"].value = post.author;
    postForm.elements["body"].value = post.body;
    postForm.elements["image-url"].value = post.imgUrl;
    postForm.elements["tag"].value = post.tag;
    postImg.src = post.imgUrl;
  }
}

class PageState {
  constructor(homePage) {
    this.currentPage = homePage;
    this.goToHome();
  }

  goToHome() {
    currentUI.displayPosts(postStorage.value.slice(0, 5), featuredList);
    currentUI.displayPosts(postStorage.value.slice(5, 10), currentList);
    this.currentPage = "home";
  }
  changePage(page) {
    if (page === "home") {
      this.goToHome();
    } else {
      let filteredPosts = postStorage.value.filter((post) => post.tag === page);
      currentUI.displayPosts(filteredPosts.slice(0, 5), featuredList);
      currentUI.displayPosts(filteredPosts.slice(5, 10), currentList);
      this.currentPage = page;
    }
  }
}

class ModalState {
  constructor() {
    this.currentPost = "";
    this.currentMode = "view";
  }

  setPost(post) {
    this.currentPost = post;
  }

  setMode(mode) {
    this.currentMode = mode;
  }
  changeModal(post) {
    currentUI.prepareModal(post);
    currentUI.openModal();
    this.setPost(post);
  }

  setEditMode() {
    this.setMode("edit");
    postForm.className = "post-page__form--edit";
    postForm.elements["title"].readOnly = false;
    postForm.elements["author"].readOnly = false;
    postForm.elements["body"].readOnly = false;
    postForm.elements["tag"].disabled = false;
    postImgUrl.style.display = "flex";
  }

  setViewMode() {
    this.setMode("view");
    postForm.className = "";
    postForm.elements["title"].readOnly = true;
    postForm.elements["author"].readOnly = true;
    postForm.elements["body"].readOnly = true;
    postForm.elements["tag"].disabled = true;
    postImgUrl.style.display = "none";
  }
}

const postStorage = new Storage("posts");
const currentUI = new UI();
const pageState = new PageState("home");
const modalState = new ModalState();

navButtons.forEach((button) => {
  button.onclick = () => {
    pageState.changePage(capitalize(button.innerText));
  };
});

homeButton.onclick = () => {
  pageState.goToHome();
};

modalCross.onclick = () => {
  currentUI.closeModal();
  modalState.setViewMode();
};

postEdit.onclick = () => {
  modalState.setEditMode();
};

postForm.onsubmit = function (event) {
  event.preventDefault();
  let unmodifiedPost = modalState.currentPost;
  modalState.setViewMode();
  let post = new Post(
    postForm.elements["image-url"].value,
    postForm.elements["title"].value,
    postForm.elements["body"].value,
    postForm.elements["author"].value,
    postForm.elements["tag"].value,
    unmodifiedPost.id
  );
  modalState.setPost(post);
  postStorage.modifyItem(post.id, post);
  pageState.changePage(pageState.currentPage);
  console.log(pageState.currentPage);
};

function capitalize(word) {
  let wordLowerCase = word.toLowerCase();
  return wordLowerCase[0].toUpperCase() + wordLowerCase.substring(1);
}
