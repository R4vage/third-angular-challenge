async function getPosts () {
  const jsonb = await fetch ("js/defaultPosts.json");
  const res = await jsonb.json ();
  return res;
}
let defaultPosts = await getPosts ();

const navLinks = document.querySelectorAll (".nav__item");
const navToggle = document.querySelector (".nav-toggle");
const navButtons = document.querySelectorAll (".js-tag-button");
const homeButton = document.getElementById ("home-button");
const logo = document.getElementById ("logo");

const searchInput = document.getElementById ("search-input");
const searchImage = document.getElementById ("search-image");

const featuredTitle = document.getElementById ("featured-title");
const featuredList = document.getElementById ("featured-list");
const currentList = document.getElementById ("post-list");
const currentListWarning = document.getElementById ("post-list__warning");
const pages = document.getElementById ("post-list__pages");

const modal = document.getElementById ("single-post-modal");
const singlePost = document.getElementById ("post-page");
const modalCross = document.getElementById ("post-page__cross");
const postForm = document.getElementById ("post-page__form");
const postImg = document.getElementById ("post-page__img");
const postImgUrl = document.getElementById ("post-page__image-url");
const postEdit = document.getElementById ("post__edit");
const postDelete = document.getElementById ("post__delete");
const postSave = document.getElementById ("post__save");
const postLabels = document.querySelectorAll (".post-page__form label");
const addPostButton = document.getElementById ("add-post");

class Post {
  constructor (imgUrl, title, body, author, tag, id) {
    (this.imgUrl = imgUrl),
      (this.title = title),
      (this.body = body),
      (this.author = author),
      (this.tag = tag),
      (this.readTime = Math.ceil (body.split (" ").length / 150)),
      (this.createdAt = new Date ().getTime ());
    this.id = id;
  }
}

class Storage {
  constructor (key) {
    this.key = key;
    if (
      !JSON.parse (localStorage.getItem (key)) ||
      JSON.parse (localStorage.getItem (key)).length === 0
    ) {
      this.setStorage (defaultPosts.posts);
    } else {
      this.value = JSON.parse (localStorage.getItem (key));
    }
  }

  getStorage () {
    return JSON.parse (localStorage.getItem (this.key));
  }

  setValue (value) {
    this.value = value;
  }

  setStorage (value) {
    this.setValue (value);
    localStorage.setItem (this.key, JSON.stringify (value));
  }

  removeItem (id) {
    let removedItemIndex = this.value.findIndex ((element) => element.id === id);
    this.value.splice (removedItemIndex, 1);
    this.setStorage (this.value);
  }

  modifyItem (id, newItem) {
    let index = this.value.findIndex ((element) => element.id === id);
    this.value[index] = newItem;
    this.setStorage (this.value);
  }

  addItem (item) {
    this.value.unshift (item);
    this.setStorage (this.value);
  }

  getItemsCount () {
    return this.value.length;
  }

  getLastId () {
    return Math.max (...this.value.map ((item) => parseInt (item.id)));
  }

  getItemIndex (id) {
    return this.value.findIndex ((element) => element.id === id);
  }
}

class UI {
  preparePost (post) {
    const date = new Date (parseInt (post.createdAt)).toLocaleString ([], {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
    const postHtml = `<img src="${post.imgUrl}">
      <div class="post__content">
        <h3>${post.title}</h3>
        <p class="post__body">${post.body}</p>
        <br>
        <div>
          <p class="post__author">${post.author} in ${post.tag}</p>
          <p class="post__created-at">${date} - ${post.readTime}min read</p>
        </div>
      </div>`;
    return postHtml;
  }

  displayPosts (posts, parent) {
    parent.style.overflow = "hidden";
    parent.style.transform = "translateX(200vw)";

    setTimeout (() => {
      parent.style.opacity = 0;
      pages.style.opacity = 0;
      addPostButton.style.display = "none";
      parent.style.transform = "translateX(-400vw)";
      parent.innerHTML = "";
      setTimeout (() => {
        posts.forEach ((post) => {
          let div = document.createElement ("div");
          div.className = "post";
          div.onclick = () => {
            modalState.setViewMode ();
            modalState.changeModal (post);
          };
          div.innerHTML = this.preparePost (post);
          parent.appendChild (div);
          parent.style.opacity = null;
          parent.style.transform = "translateX(0)";
          parent.style.overflow = null;
          pages.style.opacity = null;
          addPostButton.style.display = null;
        });
      }, 200);
    }, 200);
  }

  changePosts (posts, parent) {
    parent.innerHTML = "";
    posts.forEach ((post) => {
      let div = document.createElement ("div");
      div.className = "post";
      div.onclick = () => {
        modalState.setViewMode ();
        modalState.changeModal (post);
      };
      div.innerHTML = this.preparePost (post);
      parent.appendChild (div);
    });
  }

  openModal () {
    modal.style.display = "flex";
    setTimeout (() => {
      modal.style.opacity = "100";
      singlePost.style.marginTop = "0";
    }, 100);
  }

  closeModal () {
    modal.style.opacity = "0";
    singlePost.style.marginTop = "-100%";
    setTimeout (() => {
      modal.style.display = "none";
    }, 200);
  }

  prepareModal (post) {
    postForm.elements["title"].value = post.title;
    postForm.elements["author"].value = post.author;
    postForm.elements["body"].value = post.body;
    postForm.elements["image-url"].value = post.imgUrl;
    postForm.elements["tag"].value = post.tag;
    postImg.src = post.imgUrl;
  }

  changeModalToEdit () {
    postForm.className = "post-page__form--edit";
    postForm.elements["title"].readOnly = false;
    postForm.elements["author"].readOnly = false;
    postForm.elements["body"].readOnly = false;
    postForm.elements["tag"].disabled = false;
    postImgUrl.style.display = "flex";
    postEdit.style.display = "none";
    postSave.style.display = "block";
    postLabels[0].children[0].style.display = "block";
    postLabels[4].children[0].style.display = "block";
  }

  changeModalToView () {
    postForm.className = "";
    postForm.elements["title"].readOnly = true;
    postForm.elements["author"].readOnly = true;
    postForm.elements["body"].readOnly = true;
    postForm.elements["tag"].disabled = true;
    postImgUrl.style.display = "none";
    postSave.style.display = "none";
    postEdit.style.display = "block";
    postLabels[0].children[0].style.display = "none";
    postLabels[4].children[0].style.display = "none";
  }

  hideFeatured () {
    featuredList.style.display = "none";
    featuredTitle.style.display = "none";
  }

  showFeatured () {
    featuredList.style.display = null;
    featuredTitle.style.display = null;
  }

  addPages (currentPage, totalPages) {
    if (totalPages < 2) {
      pages.innerHTML = "";
      pages.style.display = "none";
    } else {
      if (totalPages > 1) {
        pages.innerHTML = "";
        pages.style.display = "flex";
        const pagesList = [];
        for (var i = currentPage - 3; i < currentPage + 3; i++) {
          if (i > 0 && i <= totalPages) {
            pagesList.push (i);
          }
        }
        if (currentPage > 1) {
          let newP = document.createElement ("p");
          newP.className = "pages__arrows";
          newP.innerText = "<";
          newP.onclick = () => {
            pageState.changePage (currentPage - 1);
            this.addPages (currentPage - 1, totalPages);
          };
          pages.appendChild (newP);
        }
        if (pagesList[0] > 1) {
          let newP = document.createElement ("p");
          newP.className = "pages__dots";
          newP.innerText = "⋯";
          pages.appendChild (newP);
        }
        pagesList.map ((page) => {
          let newP = document.createElement ("p");
          if (page === currentPage) {
            newP.className = "pages__page pages__current";
          } else {
            newP.className = "pages__page";
          }
          newP.innerText = page;
          newP.onclick = () => {
            pageState.changePage (page);
            this.addPages (page, totalPages);
          };
          pages.appendChild (newP);
        });
        if (pagesList[pagesList.length - 1] < totalPages) {
          let newP = document.createElement ("p");
          newP.className = "pages__dots";
          newP.innerText = "⋯";
          pages.appendChild (newP);
        }
        if (currentPage < totalPages) {
          let newP = document.createElement ("p");
          newP.className = "pages__arrows";
          newP.innerText = ">";
          newP.onclick = () => {
            pageState.changePage (currentPage + 1);
            this.addPages (currentPage + 1, totalPages);
          };
          pages.appendChild (newP);
        }
      } else {
        pages.style.display = "none";
      }
    }
  }

  displayDefaultNavButtons () {
    navButtons.forEach ((button) => {
      button.style.fontWeight = "300";
      button.style.color = "grey";
      button.style.cursor = "pointer";
    });
    homeButton.style.fontWeight = "300";
    homeButton.style.color = "grey";
    homeButton.style.cursor = "pointer";
  }

  displayWarning (text) {
    currentListWarning.style.display = "block";
    currentListWarning.innerText = text;
  }

  hideWarning () {
    currentListWarning.style.display = "none";
  }
}

class PageState {
  constructor (homePage) {
    this.currentSection = homePage;
    this.currentPage = 1;
    this.currentTotalPages = 0;
    this.currentSearchValue = "";
    this.goToHome (1);
  }

  setCurrentSection (section) {
    this.currentSection = section;
  }

  setCurrentPage (page) {
    this.currentPage = page;
  }

  setCurrentTotalPages (totalPages) {
    this.currentTotalPages = totalPages;
  }

  setCurrentSearchValue (value) {
    this.currentSearchValue = value;
  }

  goToHome (page) {
    let totalPages = Math.ceil (postStorage.value.length / 5);
    currentUI.hideWarning ();
    currentUI.displayPosts (postStorage.value.slice (0, 5), featuredList);
    currentUI.showFeatured ();
    currentUI.displayPosts (
      postStorage.value.slice (5 * page, 5 * (page + 1)),
      currentList
    );
    currentUI.addPages (page, totalPages - 1);
    this.setCurrentPage (page);
    this.setCurrentTotalPages (totalPages);
    this.setCurrentSection ("home");
  }
  changeSection (section, page) {
    if (section === "home") {
      this.goToHome (page);
    } else if (section === "search") {
      let formattedValue = this.currentSearchValue;
      let filteredPosts = postStorage.value.filter ((post) =>
        post.title.toLowerCase ().includes (formattedValue)
      );
      if (filteredPosts.length === 0) {
        currentUI.displayWarning ("There are no results for this search");
      } else {
        currentUI.hideWarning ();
      }
      let totalPages = Math.ceil (filteredPosts.length / 5);
      this.setCurrentTotalPages (totalPages);
      currentUI.displayPosts (
        filteredPosts.slice (5 * (page - 1), 5 * page),
        currentList
      );
      currentUI.addPages (page, totalPages);
    } else {
      currentUI.hideWarning ();
      currentUI.showFeatured ();
      let filteredPosts = postStorage.value.filter (
        (post) => post.tag === section
      );
      if (filteredPosts.length === 0) {
        currentUI.displayWarning ("There are no posts in this section");
      } else {
        currentUI.hideWarning ();
      }
      let totalPages = Math.ceil (filteredPosts.length / 5);
      currentUI.addPages (page, totalPages - 1);
      currentUI.displayPosts (filteredPosts.slice (0, 5), featuredList);
      currentUI.displayPosts (
        filteredPosts.slice (5 * page, 5 * (page + 1)),
        currentList
      );
      this.setCurrentSection (section);
      this.setCurrentPage (page);
      this.setCurrentTotalPages (totalPages);
    }
  }

  changePage (page) {
    if (this.currentSection === "home") {
      currentUI.changePosts (
        postStorage.value.slice (5 * page, 5 * (page + 1)),
        currentList
      );
      currentUI.addPages (page, this.currentTotalPages - 1);
    } else if (this.currentSection === "search") {
      console.log (this.currentSearchValue);
      let formattedValue = this.currentSearchValue.trim ().toLowerCase ();
      let filteredPosts = postStorage.value.filter ((post) =>
        post.title.toLowerCase ().includes (formattedValue)
      );
      currentUI.changePosts (
        filteredPosts.slice (5 * (page - 1), 5 * page),
        currentList
      );
      currentUI.addPages (page, this.currentTotalPages);
    } else {
      let filteredPosts = postStorage.value.filter (
        (post) => post.tag === this.currentSection
      );
      currentUI.changePosts (
        filteredPosts.slice (5 * page, 5 * (page + 1)),
        currentList
      );
      currentUI.addPages (page, this.currentTotalPages - 1);
    }
    this.setCurrentPage (page);
  }

  searchPage (value, page) {
    if (value === "" || !value) {
      this.goToHome (1);
    } else {
      currentUI.displayDefaultNavButtons ();
      this.setCurrentSearchValue (value.trim ().toLowerCase ());
      this.setCurrentSection ("search");
      let formattedValue = value.trim ().toLowerCase ();
      currentUI.hideFeatured ();
      let filteredPosts = postStorage.value.filter ((post) =>
        post.title.toLowerCase ().includes (formattedValue)
      );
      if (filteredPosts.length === 0) {
        currentUI.displayWarning ("There are no results for this search");
      }
      let totalPages = Math.ceil (filteredPosts.length / 5);
      this.setCurrentTotalPages (totalPages);
      currentUI.displayPosts (
        filteredPosts.slice (5 * page, 5 * (page + 1)),
        currentList
      );
      currentUI.addPages (page, totalPages);
    }
  }
}

class ModalState {
  constructor () {
    this.currentPost = "";
    this.currentMode = "view";
  }

  setPost (post) {
    this.currentPost = post;
  }

  setMode (mode) {
    this.currentMode = mode;
  }
  changeModal (post) {
    currentUI.prepareModal (post);
    currentUI.openModal ();
    this.setPost (post);
  }

  setEditMode () {
    this.setMode ("edit");
    currentUI.changeModalToEdit ();
  }

  setViewMode () {
    this.setMode ("view");
    currentUI.changeModalToView ();
  }
}

const postStorage = new Storage ("posts");
const currentUI = new UI ();
const pageState = new PageState ("home");
const modalState = new ModalState ();

navButtons.forEach ((button) => {
  button.onclick = () => {
    let section = capitalize (button.innerText);
    if (pageState.currentSection !== section) {
      pageState.changeSection (section, 1);
      currentUI.displayDefaultNavButtons ();
      button.style.color = "black";
      button.style.fontWeight = "600";
      button.style.cursor = "default";
    }
  };
});

logo.onclick = () => {
  pageState.goToHome (1);
};

homeButton.onclick = () => {
  if (pageState.currentSection !== "home") {
    pageState.goToHome (1);
    currentUI.displayDefaultNavButtons ();
    homeButton.style.color = "black";
    homeButton.style.fontWeight = "600";
    homeButton.style.cursor = "default";
  }
};

modalCross.onclick = () => {
  currentUI.closeModal ();
  modalState.setViewMode ();
};

postEdit.onclick = () => {
  modalState.setEditMode ();
};

postForm.onsubmit = function (event) {
  event.preventDefault ();
  let unmodifiedPost = modalState.currentPost;
  modalState.setViewMode ();
  let post = new Post (
    postForm.elements["image-url"].value,
    postForm.elements["title"].value,
    postForm.elements["body"].value,
    postForm.elements["author"].value,
    postForm.elements["tag"].value,
    unmodifiedPost.id
  );

  if (postStorage.getItemIndex (post.id) !== -1) {
    postStorage.modifyItem (post.id, post);
  } else {
    postStorage.addItem (post);
  }
  modalState.changeModal (post);
  pageState.changeSection (pageState.currentSection, pageState.currentPage);
};

postDelete.onclick = () => {
  let id = modalState.currentPost.id;
  postStorage.removeItem (id);
  pageState.changeSection (pageState.currentSection, pageState.currentPage);
  currentUI.closeModal ();
};

addPostButton.onclick = () => {
  let post;
  if (pageState.currentSection !== "home") {
    post = new Post (
      "",
      "",
      "",
      "",
      pageState.currentSection,
      postStorage.getLastId () + 1
    );
  } else {
    post = new Post ("", "", "", "", "Culture", postStorage.getLastId () + 1);
  }
  modalState.setEditMode ();
  modalState.changeModal (post);
};

searchImage.onclick = () => {
  pageState.searchPage (searchInput.value, 0);
};

navToggle.addEventListener ("click", () => {
  document.body.classList.toggle ("nav-open");
});

navLinks.forEach ((link) => {
  link.addEventListener ("click", () => {
    document.body.classList.remove ("nav-open");
  });
});

/* Helpers */

function capitalize (word) {
  let wordLowerCase = word.toLowerCase ();
  return wordLowerCase[0].toUpperCase () + wordLowerCase.substring (1);
}


