const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'

const USER_PER_PAGE = 1

const users = []
const dataPanel = document.querySelector('#data-panel')

const list = JSON.parse(localStorage.getItem("favoriteUsers")) || []
const unlikelist = JSON.parse(localStorage.getItem("unlikedUsers")) || []


function renderUserList(data) {
  let rawHTML = ''
  data.forEach((item) => {
    // title, image
    rawHTML += `<div class="col-sm-4 mx-auto">
    <img class="card-img-top user-image" data-toggle="modal" data-target="#user-modal" data-id="${item.id}" src="${item.avatar}" alt="User Image">
    <div class="card text-center" >
      <div class="card-body">
        <h3 class="card-title">${item.name}</h3>
        <h5 class="card-age">${item.age} years old</h5>
      
          <button class="btn btn-light btn-unlike" data-id="${item.id}"><i class="bi bi-emoji-frown" style="font-size: 3rem; color: cornflowerblue;"></i></button>
          <button class="btn btn-light btn-add-favorite" data-id="${item.id
      }"><i class="bi bi-emoji-heart-eyes" style="font-size: 3rem; color: cornflowerblue;"></i>
</button>
  </div>
    </div>
  </div>
</div>`
  })
  dataPanel.innerHTML = rawHTML
}

function addToFavorite(id) {
  const user = users.find((user) => user.id === id)
  const userIndex = users.findIndex((user) => user.id === id)

  users.splice(userIndex, 1)
  list.push(user)
  localStorage.setItem("favoriteUsers", JSON.stringify(list))
  renderUserList(displayUser())
}

function unlike(id) {
  const user = users.find((user) => user.id === id)
  const userIndex = users.findIndex((user) => user.id === id)

  users.splice(userIndex, 1)
  unlikelist.push(user)
  localStorage.setItem("unlikedUsers", JSON.stringify(unlikelist))
  renderUserList(displayUser())
}

function showUserModal(id) {
  const modalAvatar = document.querySelector('#user-modal-avatar')
  const modalName = document.querySelector('#user-modal-name')
  const modalGender = document.querySelector('#user-modal-gender')
  const modalAge = document.querySelector('#user-modal-age')
  const modalEmail = document.querySelector('#user-modal-email')
  const modalRegion = document.querySelector('#user-modal-region')
  const modalBirthday = document.querySelector('#user-modal-birthday')


  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data

    modalAvatar.innerHTML = `<img src="${data.avatar}" class="rounded-circle" alt="Responsive image">`

    modalName.innerHTML = `${data.name} ${data.surname}`
    modalGender.innerHTML = `Gender: ${data.gender}`
    modalAge.innerText = 'Age: ' + data.age
    modalEmail.innerText = 'Email: ' + data.email
    modalRegion.innerText = 'Region: ' + data.region
    modalBirthday.innerText = 'Birthday: ' + data.birthday
  })
}

function displayUser() {

  return users.filter(user => !list.some(item => user.id === item.id) && !unlikelist.some(item => user.id === item.id)).splice(0, 1)
}



dataPanel.addEventListener('click', function onPanelClicked(event) {
  event.preventDefault()
  if (event.target.matches('.user-image')) {
    showUserModal(event.target.dataset.id)
  } else if (event.target.matches(".btn-add-favorite")) {
    addToFavorite(Number(event.target.dataset.id))
  } else if (event.target.matches(".btn-unlike")) {
    unlike(Number(event.target.dataset.id))
  }
})

axios
  .get(INDEX_URL)
  .then((response) => {
    users.push(...response.data.results)
    renderUserList(displayUser())

  })
  .catch((err) => console.log(err))