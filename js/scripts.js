import defaultPosts from './defaultPosts.json' assert {type: 'json'};

const featuredList = document.getElementById('featured-list')
const currentList = document.getElementById('post-list')
const navButtons = document.querySelectorAll('.js-tag-button')
const homeButton = document.getElementById('home-button')



class Post {
    constructor (imgUrl, title, body, author, tag, id) {
        this.imgUrl = imgUrl,
        this.title = title,
        this.body = body,
        this.author = author,
        this.tag = tag,
        this.readTime = parseInt(body.split(' ').lenght/200),
        this.createdAt = new Date()
        this.id = id
    }
}


class Storage {
    constructor (key) {
        this.key = key
        if (!JSON.parse (localStorage.getItem (key)) || JSON.parse (localStorage.getItem (key)).length === 0) {
            this.setStorage(defaultPosts.posts) 
        } else {
            this.value = JSON.parse (localStorage.getItem (key))
        }
    }

    getStorage () {
        return JSON.parse (localStorage.getItem (this.key))
    }

    setStorage (value) {
        this.value = value
        localStorage.setItem (this.key, JSON.stringify (value)) 
    }

    removeItem (id) {
        let removedItemIndex = this.value.findIndex (element => element.id === id)
        this.value.splice (removedItemIndex, 1)
        this.setStorageKey(this.value)
    }

    modifyItem (index, newItem) {
        this.value[index] = newItem
        this.setStorageKey(this.value)
    }

    addItem (task) {
        this.value.push (task)
        this.setStorageKey(this.value)  
    }

    getItemsCount () {
        return this.value.length
    }

    getLastId () {
        return parseInt (this.value[this.value.length-1].id)
    }

    getItemIndex (id) {
        return this.value.findIndex (element => element.id === id)
    }
}

class UI {
    preparePost (post){
        const date = new Date(parseInt(post.createdAt)).toLocaleString ([], {year: 'numeric', month: 'numeric', day: 'numeric'})
        const postHtml = 
            `<img src="${post.imgUrl}">
            <div class="post__content">
                <h3>${post.title}</h3>
                <p class="post__author">${post.body.replace(/^(.{30}[^\s]*).*/, "$1")}</p>
                <br>
                <div>
                    <p class="post__author">${post.author} in ${post.tag}</p>
                    <p class="post__created-at">${date} - ${post.readTime}min read</p>
                </div>
            </div>`

        return postHtml
    }

    displayPosts (posts, parent){
        parent.innerHTML = ''
        posts.forEach((post) =>{
            let div = document.createElement('div')
            div.className = 'post'
            div.innerHTML = this.preparePost(post)
            parent.appendChild(div)
        })
    }
}

class Navigator {
    constructor (homePage) {
        this.currentPage = homePage
    }

    goToHome(){
        currentUI.displayPosts(postStorage.value.slice(0,5), featuredList)
        currentUI.displayPosts(postStorage.value.slice(5,10), currentList)
    }
    changePage(page){
        let filteredPosts = postStorage.value.filter(post => post.tag === page)
        console.log(page)
        currentUI.displayPosts(filteredPosts.slice(0,5), featuredList)
        currentUI.displayPosts(filteredPosts.slice(5,10), currentList)
    }

}

const postStorage = new Storage('posts')
const currentUI = new UI()
const navigator = new Navigator()

currentUI.displayPosts(postStorage.value.slice(0,5), featuredList)
currentUI.displayPosts(postStorage.value.slice(5,10), currentList)

navButtons.forEach(button => {
    
    button.onclick = () =>{
        console.log(button.innerText.toLowerCase())
        navigator.changePage(button.innerText.toLowerCase())
   
    }
})

homeButton.onclick = () => {navigator.goToHome()}
