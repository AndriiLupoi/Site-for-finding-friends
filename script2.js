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

let debounceTimer;
let usersData = [];
let currentPage = 1;


function createUserCard(user) {
  const gender = user.gender.charAt(0).toUpperCase() + user.gender.slice(1);
  const userCard = document.createElement('div');
  userCard.className = 'user-card';
  userCard.innerHTML = `
    <div class="user-card-header">
      <h2 class="username ${user.gender}">${user.name.first} ${user.name.last}</h2>
      <img src="${user.picture.large}" alt="${user.name.first} ${user.name.last}">
    </div>
    <div class="user-card-body">
      <p>Age: ${user.dob.age}</p>
      <p>Email: ${user.email}</p>
      <p>Phone: ${user.phone}</p>
      <p>Location: ${user.location.city}, ${user.location.country}</p>
      <p class="gender ${user.gender}">${gender}</p>
    </div>
  `;
  return userCard;
}

function displayUsers(users) {
  userCardsContainer.innerHTML = '';
  users.forEach(user => {
    const userCard = createUserCard(user);
    userCardsContainer.appendChild(userCard);
  });
  usersData = [...users];
}

let originalUsersData = [];

async function fetchNextUsers() {
  const loadingIndicator = document.getElementById('loading-indicator');
  loadingIndicator.style.display = 'block';

  try {
    const response = await fetch(`https://randomuser.me/api/?results=6&page=${currentPage}`, {
      credentials: 'omit'
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    originalUsersData = [...originalUsersData, ...data.results];
    displayUsers(originalUsersData);
    currentPage++;
  } catch (error) {
    console.error('Error fetching data:', error.message);
  } finally {
    loadingIndicator.style.display = 'none';
  }
}


function handleInfiniteScroll() {
  const scrollHeight = document.documentElement.scrollHeight;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const clientHeight = document.documentElement.clientHeight;

  if (scrollTop + clientHeight >= scrollHeight) {
    fetchNextUsers(); // Завантажуємо наступну партію користувачів, коли користувач дійде до кінця сторінки
  }
}


// Function to handle logout
async function handleLogout(event) {
  event.preventDefault();

  await sendLogoutRequest()
    .then((response) => {
      console.log(response);
      window.location.href = 'index.html'; // Change 'index.html' to your actual login page URL
    })
    .catch((error) => {
      console.log(error);
    });

  setTimeout(toggleLoader, 1);
}

// Function to send logout request
async function sendLogoutRequest() {
  // Simulating a server request for the logout process
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

// Function to handle search
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

function resetFilters() {
  filterAgeInput.value = '';
  filterNameInput.value = '';
  filterLocationInput.value = '';
  filterEmailInput.value = '';

  usersData = [...originalUsersData];

  displayUsers(usersData);
}

function updateQueryString(params) {
  const url = new URL(window.location.href);
  url.search = new URLSearchParams(params).toString();
  window.history.pushState({}, '', url.href);
}


function getQueryStringParams() {
  const url = new URL(window.location.href);
  return Object.fromEntries(url.searchParams.entries());
}


const queryParams = getQueryStringParams();
if (queryParams.search) {
  searchInput.value = queryParams.search;
  handleSearch();
}
if (queryParams.sortBy) {
  if (queryParams.sortBy === 'name') {
    if (queryParams.order === 'asc') {
      sortUsersByName('asc');
    } else {
      sortUsersByName('desc');
    }
  } else if (queryParams.sortBy === 'age') {
    if (queryParams.order === 'asc') {
      sortUsersByAge('asc');
    } else {
      sortUsersByAge('desc');
    }
  }
}
if (queryParams.filterAge) {
  filterAgeInput.value = queryParams.filterAge;
}
if (queryParams.filterName) {
  filterNameInput.value = queryParams.filterName;
}
if (queryParams.filterLocation) {
  filterLocationInput.value = queryParams.filterLocation;
}
if (queryParams.filterEmail) {
  filterEmailInput.value = queryParams.filterEmail;
}


searchInput.addEventListener('input', () => {
  updateQueryString({ search: searchInput.value.trim() });
});

sortByNameAscButton.addEventListener('click', () => {
  updateQueryString({ sortBy: 'name', order: 'asc' });
  sortUsersByName('asc');
});

sortByNameDescButton.addEventListener('click', () => {
  updateQueryString({ sortBy: 'name', order: 'desc' });
  sortUsersByName('desc');
});

sortByAgeAscButton.addEventListener('click', () => {
  updateQueryString({ sortBy: 'age', order: 'asc' });
  sortUsersByAge('asc');
});

sortByAgeDescButton.addEventListener('click', () => {
  updateQueryString({ sortBy: 'age', order: 'desc' });
  sortUsersByAge('desc');
});

applyFiltersButton.addEventListener('click', () => {
  const params = {};
  if (filterAgeInput.value.trim() !== '') {
    params.filterAge = filterAgeInput.value.trim();
  }
  if (filterNameInput.value.trim() !== '') {
    params.filterName = filterNameInput.value.trim();
  }
  if (filterLocationInput.value.trim() !== '') {
    params.filterLocation = filterLocationInput.value.trim();
  }
  if (filterEmailInput.value.trim() !== '') {
    params.filterEmail = filterEmailInput.value.trim();
  }
  updateQueryString(params);
  applyFilters();
});

resetFiltersButton.addEventListener('click', () => {
  updateQueryString({});
  resetFilters();
});

logoutButton.addEventListener('click', handleLogout);
searchInput.addEventListener('input', handleSearch);
sortByNameAscButton.addEventListener('click', () => sortUsersByName('asc'));
sortByNameDescButton.addEventListener('click', () => sortUsersByName('desc'));
sortByAgeAscButton.addEventListener('click', () => sortUsersByAge('asc'));
sortByAgeDescButton.addEventListener('click', () => sortUsersByAge('desc'));
applyFiltersButton.addEventListener('click', applyFilters);
resetFiltersButton.addEventListener('click', resetFilters);
userCardsContainer.addEventListener('scroll', handleInfiniteScroll);

fetchNextUsers();
