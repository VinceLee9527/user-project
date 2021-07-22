const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'


const users = JSON.parse(localStorage.getItem('favoriteUsers')) || []
const dataPanel = document.querySelector('#data-panel')
let filteredUsers = []

const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')




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
      
          <div class="card-footer">
          <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">Not interesed anymore</button>
        </div>
  </div>
    </div>
  </div>
</div>`
  })
  dataPanel.innerHTML = rawHTML
}


function removeFromFavorite(id) {
  const userIndex = users.findIndex((user) => user.id === id)

  users.splice(userIndex, 1)
  renderUserList(users)
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

searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()

  filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(keyword)
  )

  if (filteredUsers.length === 0) {
    alert(`Cannot find user with name: ` + keyword)
  }
  renderUserList(filteredUsers)
})



dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.user-image')) {
    showUserModal(event.target.dataset.id)
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

renderUserList(users)
