document.addEventListener('DOMContentLoaded', function() {// Задаємо початкові значення та отримуємо посилання на елементи сторінки
const userCardsContainer = document.getElementById('user-cards-container');
const logoutButton = document.getElementById('logout-button');
const searchInput = document.getElementById('searchInput');
const sortByNameAscButton = document.getElementById('sortByNameAsc');
const sortByNameDescButton = document.getElementById('sortByNameDesc');
const sortByAgeAscButton = document.getElementById('sortByAgeAsc');
const sortByAgeDescButton = document.getElementById('sortByAgeDesc');
const filterAgeInput = document.getElementById('filterAge');
const filterNameInput = document.getElementById('filterName');
const filterLocationInput = document.getElementById('filterLocation');
const filterEmailInput = document.getElementById('filterEmail');
const applyFiltersButton = document.getElementById('applyFilters');
const resetFiltersButton = document.getElementById('resetFilters');
const loadingIndicator = document.getElementById('loading-indicator');
const showMoreButton = document.createElement('button');

let debounceTimer;
let usersData = [];
let originalUsersData = []; // Зберігаємо оригінальні дані
let currentPage = 1;
const resultsPerPage = 12;
const apiUrl = `https://randomuser.me/api/?results=${resultsPerPage}`;


function displayUsers(users) {
  userCardsContainer.innerHTML = '';
  users.forEach(user => {
    const userCard = createUserCard(user);
    userCardsContainer.appendChild(userCard);
  });
  usersData = [...users];

  showMoreButton.innerText = 'Показати ще';
  showMoreButton.classList.add('show-more-button');
  userCardsContainer.appendChild(showMoreButton);
}

// Функція для створення картки користувача
function createUserCard(user) {
  var dateOfBirth = new Date(user.dob.date);
  var ageDate = new Date(Date.now() - dateOfBirth.getTime());
  var age = Math.abs(ageDate.getUTCFullYear() - 1980);

  const gender = user.gender.charAt(0).toUpperCase() + user.gender.slice(1);
  const userCard = document.createElement('div');
  userCard.classList.add('user-card');
  userCard.innerHTML = `
      <div class="user-card-header">
          <h2 class="username ${user.gender}">${user.name.first} ${user.name.last}</h2>
          <img src="${user.picture.large}" alt="${user.name.first} ${user.name.last}">
      </div>
      <div class="user-card-body">
          <p>Age: ${age}</p>
          <p>Email: ${user.email}</p>
          <p>Phone: ${user.phone}</p>
          <p>Location: ${user.location.city}, ${user.location.country}</p>
          <p class="gender ${user.gender}">${gender}</p>
      </div>
  `;
  return userCard;
}

// Функція для завантаження даних з сервера
function fetchInformation(url) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      usersData = data.results;
      originalUsersData = [...usersData]; // Зберігаємо оригінальні дані
      displayUsers(usersData);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

// Функція для обробки виходу користувача
async function handleLogout(event) {
  event.preventDefault();

  await sendLogoutRequest()
    .then(response => {
      console.log(response);
      window.location.href = 'index.html'; // Змініть 'index.html' на вашу фактичну сторінку входу
    })
    .catch(error => {
      console.error('Logout failed:', error);
    });

  setTimeout(toggleLoader, 1);
}

// Функція для відправлення запиту на вихід
async function sendLogoutRequest() {
  // Симулюємо запит на сервері для процесу виходу
  return new Promise((resolve, reject) => {
    let isSuccess = Math.floor(Math.random() * 2);
    setTimeout(() => {
      if (isSuccess) {
        resolve({ status: 200, message: 'Logged out successfully!' });
      } else {
        reject({ status: 500, message: 'Logout failed!' });
      }
    }, 1);
  });
}

// Функція для обробки пошуку
function handleSearch() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const userCards = document.querySelectorAll('.user-card');

    userCards.forEach(card => {
      const username = card.querySelector('.username').textContent.toLowerCase();

      if (username.includes(searchTerm)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }, 300);
}

// Функції для сортування за ім'ям
function sortUsersByName(order) {
  const sortedCards = usersData.sort((a, b) => {
    const nameA = `${a.name.first} ${a.name.last}`.toUpperCase();
    const nameB = `${b.name.first} ${b.name.last}`.toUpperCase();

    if (order === 'asc') {
      return nameA.localeCompare(nameB);
    } else {
      return nameB.localeCompare(nameA);
    }
  });

  displayUsers(sortedCards);
}

// Функції для сортування за віком
function sortUsersByAge(order) {
  const sortedCards = usersData.sort((a, b) => {
    if (order === 'asc') {
      return a.dob.age - b.dob.age;
    } else {
      return b.dob.age - a.dob.age;
    }
  });

  displayUsers(sortedCards);
}

// Функція для застосування фільтрів
function applyFilters() {
  let filteredUsers = [...usersData];

  const filterAge = parseInt(filterAgeInput.value.trim());
  const filterName = filterNameInput.value.toLowerCase().trim();
  const filterLocation = filterLocationInput.value.toLowerCase().trim();
  const filterEmail = filterEmailInput.value.toLowerCase().trim();

  if (!isNaN(filterAge)) {
    filteredUsers = filteredUsers.filter(user => user.dob.age === filterAge);
  }

  if (filterName !== '') {
    filteredUsers = filteredUsers.filter(user => {
      const fullName = `${user.name.first.toLowerCase()} ${user.name.last.toLowerCase()}`;
      return fullName.includes(filterName);
    });
  }

  if (filterLocation !== '') {
    filteredUsers = filteredUsers.filter(user => {
      const location = `${user.location.city.toLowerCase()}, ${user.location.country.toLowerCase()}`;
      return location.includes(filterLocation);
    });
  }

  if (filterEmail !== '') {
    filteredUsers = filteredUsers.filter(user => user.email.toLowerCase().includes(filterEmail));
  }

  displayUsers(filteredUsers);
}

// Функція для скидання фільтрів
function resetFilters() {
  filterAgeInput.value = '';
  filterNameInput.value = '';
  filterLocationInput.value = '';
  filterEmailInput.value = '';

  usersData = [...originalUsersData]; // Повертаємо до початкових даних
  displayUsers(usersData);
}

function loadMoreUsers() {
  currentPage++;
  const nextPageUrl = `https://randomuser.me/api/?results=${resultsPerPage}&page=${currentPage}`;

  fetch(nextPageUrl)
    .then(response => response.json())
    .then(data => {
      const newUsers = data.results;
      usersData = [...usersData, ...newUsers];
      displayUsers(usersData);

      // Перевіряємо, чи є ще користувачі для завантаження
      if (newUsers.length === resultsPerPage) {
        showMoreButton.style.display = 'block';
      } else {        
        showMoreButton.style.display = 'none';
    }
  })
  .catch(error => {
    console.error('Error loading more users:', error);
  });
}


// Обробники подій для кнопок сортування, фільтрації, показу додаткових користувачів та ін.
sortByNameAscButton.addEventListener('click', () => sortUsersByName('asc'));
sortByNameDescButton.addEventListener('click', () => sortUsersByName('desc'));
sortByAgeAscButton.addEventListener('click', () => sortUsersByAge('asc'));
sortByAgeDescButton.addEventListener('click', () => sortUsersByAge('desc'));
applyFiltersButton.addEventListener('click', applyFilters);
resetFiltersButton.addEventListener('click', resetFilters);
logoutButton.addEventListener('click', handleLogout);
searchInput.addEventListener('input', handleSearch);
showMoreButton.addEventListener('click', loadMoreUsers);

// Завантаження даних після завантаження сторінки
fetchInformation(apiUrl);
});
