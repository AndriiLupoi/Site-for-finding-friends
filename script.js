// successful even if incorrect input

let usernameInput = document.getElementById("username");
let emailInput = document.getElementById("reg-email");
let passwordInput = document.getElementById("reg-password");
let repPasswordInput = document.getElementById("reg-rep-password");
let currentTab = '';
function openTab(tabName) {
  currentTab = tabName;
  const tabcontents = document.getElementsByClassName('form');

  for (let i = 0; i < tabcontents.length; i++) {
    tabcontents[i].classList.remove('active');
  }

  const tabToActivate = document.getElementById(tabName);
  tabToActivate.classList.add('active');

  if(tabName === "register") {
    emailInput = document.getElementById("reg-email");
    passwordInput = document.getElementById("reg-password");
  }
  else {
    emailInput = document.getElementById("log-email");
    passwordInput = document.getElementById("log-password");
  }
}

// Показуємо лоадер під час відправлення
function toggleLoader() {
  const loader = document.getElementById('loader')
  loader.classList.toggle('hidden')
}

function validateEmail(value) {
  if (!value) {
    emailInput.classList.remove('valid');
    emailInput.classList.add('invalid');

    document.getElementById(`error-${emailInput.id}`).innerText = 'Required';
    return false;
  }

  else if (!/^([\w\-_+]+(?:\.[\w\-_+]+)*)@((?:[a-z0-9\-]+\.)*[a-z0-9][a-z0-9\-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(value)) {
    emailInput.classList.remove('valid');
    emailInput.classList.add('invalid');
      
    document.getElementById(`error-${emailInput.id}`).innerText =  'Wrong email format';
    return false;
  }

  else {
    emailInput.classList.remove('invalid');
    emailInput.classList.add('valid');
    document.getElementById(`error-${emailInput.id}`).innerText =  "";
    return true;
  }
}

function validateUsername(value) {
  if (!value) {
    usernameInput.classList.remove('valid');
    usernameInput.classList.add('invalid');
  
    document.getElementById(`error-${usernameInput.id}`).innerText = 'Required';
    return false;
  }

  else if (!/^[a-zа-яiъї]+$/i.test(value)) {
    usernameInput.classList.remove('valid');
    usernameInput.classList.add('invalid');
  
    document.getElementById(`error-${usernameInput.id}`).innerText = 'Should contain only letters latin/cyrillic';
    return false;
  }

  else {
    usernameInput.classList.remove('invalid');
    usernameInput.classList.add('valid');
    document.getElementById(`error-${usernameInput.id}`).innerText = "";
    return true;
  }
}

function validatePassword(value) {
  if (!value) {
    passwordInput.classList.remove('valid');
    passwordInput.classList.add('invalid');

    document.getElementById(`error-${passwordInput.id}`).innerText = 'Required';
    return false;
  }

  else if (value.length < 8) {
    passwordInput.classList.remove('valid');
    passwordInput.classList.add('invalid');

    document.getElementById(`error-${passwordInput.id}`).innerText = 'Should contain at least 8 characters';
    return false;
  }

  else if (!/\d/.test(value)) {
    passwordInput.classList.remove('valid');
    passwordInput.classList.add('invalid');

    document.getElementById(`error-${passwordInput.id}`).innerText = 'Should contain at least one digit';
    return false;
  }

  else if (!/[^\da-z]/i.test(value)) {
    passwordInput.classList.remove('valid');
    passwordInput.classList.add('invalid');

    document.getElementById(`error-${passwordInput.id}`).innerText = 'Should contain at least one special character';
    return false;
  }

  else if (!/[A-Z]/.test(value)) {
    passwordInput.classList.remove('valid');
    passwordInput.classList.add('invalid');

    document.getElementById(`error-${passwordInput.id}`).innerText = 'Should contain at least one uppercase letter';
    return false;
  }

  else {
    passwordInput.classList.remove('invalid');
    passwordInput.classList.add('valid');
    document.getElementById(`error-${passwordInput.id}`).innerText = "";
    return true;
  }
}

function validateConfirmPassword(value) {
  if (!value) {
    repPasswordInput.classList.remove('valid');
    repPasswordInput.classList.add('invalid');
  
    document.getElementById(`error-${repPasswordInput.id}`).innerText = 'Required';
    return false;
  }

  else if(value !== passwordInput.value) {
    repPasswordInput.classList.remove('valid');
    repPasswordInput.classList.add('invalid');

    document.getElementById(`error-${repPasswordInput.id}`).innerText = 'passwords mismatch';
    return false;
  } 

  else {
    repPasswordInput.classList.remove('invalid');
    repPasswordInput.classList.add('valid');
    document.getElementById(`error-${repPasswordInput.id}`).innerText = '';
    return true;
  }
}

// Функцію, яка перевірятиме валідність форми і блокуватиме кнопку, якщо потрібно.
// Аргументом вона приймає подію введення з клавіатури на полях вводу.
document.getElementById('reg-submit').disabled = true;
document.getElementById('log-submit').disabled = true;

function checkValidity(event) {
  isValid = true;
  if(document.activeElement === usernameInput && !validateUsername(usernameInput.value)) isValid = false;
  if(document.activeElement === emailInput && !validateEmail(emailInput.value)) isValid = false;
  if(document.activeElement === passwordInput && !validatePassword(passwordInput.value)) isValid = false;
  if(document.activeElement === repPasswordInput && !validateConfirmPassword(repPasswordInput.value)) isValid = false;

  if(currentTab === 'register') {
    if(usernameInput.value === ''
    || emailInput.value === ''
    || passwordInput.value === ''
    || repPasswordInput.value === '') {
      isValid = false;
    }
  }
  else {
    if(emailInput.value === ''
    || passwordInput.value === '') {
      isValid = false;
    }
  }
  
  // Оскільки подія введення відбуватиметься на полях, а не на самій формі, то значення event.target - це поле.
  // Щоб отримати форму, скористаємося властивістю form, значенням якої є посилання на батьківську форму.
  const formNode = event.target.form;
  // Перевіряти валідність форми будемо за допомогою методу checkValidity() форми.
  // Він запускає стандартні перевірки.
  // Результат перевірки використовуватимемо для того, щоб встановити властивість disabled кнопки в значення true, якщо потрібно заблокувати, і false, якщо кнопка має бути доступною.
  formNode.querySelector('button').disabled = !isValid;
  return isValid;
}

// Обробляємо успішне відправлення
function onSuccess(message) {
  console.log(message)
}

// Обробляємо помилки
function onError(error) {
  console.log(error.message)
}

// Збираємо всі дані з форми
function serializeForm(formNode) {
  console.log(formNode)
  return new FormData(formNode)
}

async function sendData(data) {
  // Функція буде асинхронною, тому що працює з мережевими запитами. Як аргумент вона приймає FormData і надсилає запит за допомогою виклику fetch.
  // Нам потрібно вказати правильний заголовок
  // Content-Type у запиті, для форми він 'multipart/form-data':
  // return await fetch('/api/apply/', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'multipart/form-data' },
  //     body: data,
  // })

  // Щоб перевірити, як працює
  // обробка відповіді, можна використовувати
  // підроблену відповідь від сервера:

  return new Promise((resolve, reject) => {
    let isSuccess = Math.floor(Math.random() * 2);
    alert(isSuccess);
    setTimeout(() => {
      if(isSuccess) {
        resolve({status: 200, message: 'Your application has been successfully sent!'})
      }
      else {
        reject({ status: 404, message: "error!"});
      }
    })
  })
}

async function handleFormSubmit(event) {
  // Просимо форму не надсилати дані самостійно
  event.preventDefault();
  // Збираємо всі дані з форми
  const data = serializeForm(event.target);

  toggleLoader()
  // Відправлення на сервер

  await sendData(data)
      .then((response) => {
          console.log(response);
          // Перенаправлення на іншу сторінку
          window.location.href = 'index2.html';
      })
      .catch((error) => {
          console.log(error);
      });

  setTimeout(toggleLoader, 1500);
}


// Знаходимо форму
const RegisterForm = document.getElementById('register');
const LoginForm = document.getElementById('login');

// Сабмітимо форму handleFormSubmit
RegisterForm.addEventListener('submit', handleFormSubmit)
RegisterForm.addEventListener('input', checkValidity)

LoginForm.addEventListener('submit', handleFormSubmit)
LoginForm.addEventListener('input', checkValidity)

openTab("register");