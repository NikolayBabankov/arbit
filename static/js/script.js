window.addEventListener('DOMContentLoaded', () => {



  // Получение даты и вывод их в верстку
  let today = new Date();
  let saleday = new Date();
  today.setDate(today.getDate() - 5);
  saleday.setDate(saleday.getDate() + 1);
  let d = String(today.getDate()).padStart(2, '0');
  let m = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let y = today.getFullYear();
  let dd = String(saleday.getDate()).padStart(2, '0');
  let mm = String(saleday.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yy = saleday.getFullYear();
  today = d + '.' + m + '.' + y;
  saleday = dd + '.' + mm + '.' + yy;
  let sale = document.createElement('span');
  let day = document.createElement('span');
  sale.innerHTML = `${today}`
  day.innerHTML = `до ${saleday}`
  day.style.color = 'red';
  const addTodoForm = document.getElementById("addTodoForm"),
        leadForm = document.getElementById("formLead"),
        saleDay = document.querySelector('.sale_day'),
        saleAdd = document.querySelector('.sale_add');  
  saleAdd.insertAdjacentElement('beforeend', sale)
  saleDay.insertAdjacentElement('afterend', day)

  // $("#lead_phone").mask("+77 (999) 999-99-99");


  // Рулетка розыгрыша
  let resultWrapper = document.querySelector('.spin-result-wrapper');
  let wheel = document.querySelector('.wheel-img');

  function spin() {
    if (wheel.classList.contains('rotated')) {
        resultWrapper.style.display = "block";
    } else {
        wheel.classList.add('super-rotation');
        setTimeout(function() {
            resultWrapper.style.display = "block";
        }, 8000);
        setTimeout(function() {
            $('.spin-wrapper').slideUp();
             $('.order_block').slideDown();
             start_timer();
        }, 10000);
        wheel.classList.add('rotated');
    }
}
  var closePopup = document.querySelector('.close-popup');
  $('.close-popup, .pop-up-button').click(function(e){
    e.preventDefault();
  $('.spin-result-wrapper').fadeOut();
  });


  // Обработчик события на форму отправки комментария
  addTodoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = {
        name: addTodoForm.elements["todoTaskPost"].value,
        text: addTodoForm.elements["todoTaskPost1"].value,
    }
    addComent(allTodosUrl, formData);
    addTodoForm.reset();
    getAllComment(allTodosUrl);
    setTimeout(getAllComment(allTodosUrl), 3000);
  });


  // Получение UTM меток http://127.0.0.1:8000/?utm_source=123123&utm_campaign=2131234413&utm_content=343242
  let params = (new URL(document.location)).searchParams;
  const siteId = params.get("sub_id1"),
        campId = params.get("utm_campaign"),
        bannerId =params.get("utm_content");

  // Обработчик события на форму отправки заявки
  leadForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formDataLead = {
        name: leadForm.elements["first_name"].value,
        phone: leadForm.elements["lead_phone"].value,
        sub_id1: siteId,
        utm_campaign: campId,
        utm_content: bannerId,
    }
    console.log('formDataLead');
    leadForm.style.display = 'none';
    addComent(leadFormUrl, formDataLead);
    leadForm.reset();
  });


// Функция ответа на комментарий, получает id комментария
function addAnswerForm(item){
  item.addEventListener('click', (e) => {
    const idComment = item.parentNode.getAttribute('id');
    const comment = document.getElementById(idComment);
    let formans = document.createElement('div');
    formans.id = 'anscomm';
    formans.innerHTML = `    
    <form id="addTodoForm1" class="anwerForm">
    ${csfr}
    <div class="text-danger" id="recaptchaError"></div>
    <div class="mb-3">
      <input name = "name" type="text" class="form-control" id="Post" required placeholder="Ваше имя">
    </div>
    <div class="mb-3">
      <textarea name="comment" class="comment_form_text" id="Post1" rows="4" required placeholder = "Комментарий"></textarea>
     </div>
    <button type="submit" class= "comment_form_btn" >Отправить</button>
    </form>`
    OneForm = document.getElementById('anscomm');
    if (OneForm === null){
      comment.insertAdjacentElement('beforeend', formans);
      const btnAnswer = formans.querySelector('.anwerForm');
      btnAnswer.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = {
          id:idComment,
          name: btnAnswer.elements["Post"].value,
          text: btnAnswer.elements["Post1"].value,
        }
        addComent(allTodosUrl, formData);
        btnAnswer.reset();
        getAllComment(allTodosUrl);
        setTimeout(getAllComment(allTodosUrl), 3000);
      }); 
    }
    else{
      OneForm.remove();
    }
  });
}

const comm = document.querySelector('.bottom_comment'),
      todoList = document.getElementById("todoList");

let chekIndex = 0;

// Интерактивное добавление комментария при прокрутке до элемента комментарий
function interactiveComment(){
  let interactive = document.createElement('div');
  interactive.id = '1000';
  interactive.innerHTML = `
  <div class="comment_item" style="margin-top:30px;">
  <div class="comment_item_header">
  <div class="comment_item_header_name">Колько</div>
  <div class="comment_item_header_time">только что</div>
  </div>
  <div class="comment_item_text">Мы с женой не так давно тоже взяли себе упаковочку "Домашнего Фермера", гранат взяли. Какие они вкусные, не передать совами. Второй заход зреет))) Спасибо производителю за такую хорошую вещь!</div>
  <button class='ansbtn comment_item_btn'>Ответить</button>
  </div>`
  todoList.insertAdjacentElement('afterbegin', interactive);
}


window.addEventListener('scroll', function() {
  Visible (comm);
});



const addComentBtn = document.querySelector('.comment_header_addbtn'),
      formComment = document.querySelector('.comment_form');
addComentBtn.addEventListener("click", () => {
  if (formComment.classList.contains('hidden') ){
    formComment.classList.add("show");
    formComment.classList.remove('hidden');
  }
  else{
    formComment.classList.add("hidden");
    formComment.classList.remove('show');
  }
  
});


// Отслеживание видимости элемента
function Visible(target) {
  // Все позиции элемента
  var targetPosition = {
      top: window.pageYOffset + target.getBoundingClientRect().top,
      left: window.pageXOffset + target.getBoundingClientRect().left,
      right: window.pageXOffset + target.getBoundingClientRect().right,
      bottom: window.pageYOffset + target.getBoundingClientRect().bottom
    },
    // Получаем позиции окна
    windowPosition = {
      top: window.pageYOffset,
      left: window.pageXOffset,
      right: window.pageXOffset + document.documentElement.clientWidth,
      bottom: window.pageYOffset + document.documentElement.clientHeight
    };

  if (targetPosition.bottom > windowPosition.top && // Если позиция нижней части элемента больше позиции верхней чайти окна, то элемент виден сверху
    targetPosition.top < windowPosition.bottom && // Если позиция верхней части элемента меньше позиции нижней чайти окна, то элемент виден снизу
    targetPosition.right > windowPosition.left && // Если позиция правой стороны элемента больше позиции левой части окна, то элемент виден слева
    targetPosition.left < windowPosition.right) { // Если позиция левой стороны элемента меньше позиции правой чайти окна, то элемент виден справа
    // Если элемент полностью видно, то запускаем следующий код
    console.clear();
    console.log('Вы видите элемент :)');
    if (chekIndex === 0){
      setTimeout(interactiveComment, 2000);
      chekIndex += 1;
    }
  } else {
    // Если элемент не видно, то запускаем этот код
    console.clear();
  };
};


// Функция вывода комментариев
function getAllComment(url) {
    fetch(url, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      }
    })
    .then(response => response.json())
    .then(data => {
      todoList.innerHTML = "";
      (data.comment).forEach((todo, index) => {
        let date;
        console.log(todo.update_at)
        if(todo.update_at){
          date = todo.update_at;
        }
        else{
          date = todo.created_at;
        }

        const todoHTMLElement = `
          <div class="comment_item" id=${todo.id} style="margin-top:30px;">
          <div class="comment_item_header">
          <div class="comment_item_header_name">${todo.name}</div>
          <div class="comment_item_header_time">${date}</div>
          </div>
          <div class="comment_item_text">${todo.text}</div>
          <button class='ansbtn comment_item_btn'>Ответить</button>
          </div>`
          todoList.innerHTML += todoHTMLElement;
          if(todo.photo.length != 0){
            let row = document.createElement("div");
            row.className = 'row';
            todo.photo.forEach((el) => {
              const todoHTMLElementimg = `
                <div class="col">
                  <img src=${el} alt="" class="img_comment">
                </div>
                `
                row.innerHTML += todoHTMLElementimg;
            })
            todoList.insertAdjacentElement('beforeend', row);
          }
          
          if(todo.answer.length != 0){
            todo.answer.forEach((element) => {
              const todoHTMLElement2 =`
              <div class="comment_item comment_answer" id=${todo.id}>
              <div class="comment_item_header">
              <div class="comment_item_header_name">${element.name}</div>
              <div class="comment_item_header_time">${element.created_at}</div>
              </div>
              <div class="comment_item_text">${element.text}</div>
              </div>`
              todoList.innerHTML += todoHTMLElement2;
            })
          }
      });
      const btnArray = todoList.querySelectorAll('.ansbtn');
      btnArray.forEach(item => {
        addAnswerForm(item);
      });
    });
  }

// Получение токена 
function getCookie(name) {
      let cookieValue = null;
      if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === (name + "=")) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }
      return cookieValue;
    }


// Функция отправки комментари/ответа на комментарии на сервер
async function addComent(url, payload) {
      let data = await fetch(url, {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify({payload: payload})
      });
      let resp = await data.json();
      const result = await resp["lead"];
      const name = await resp["name"];
      const phone = await resp["phone"];
      if (result){
        console.log(name);
        console.log(phone);
        let urlOpen = confUrl + `?name=${name}&phone=${phone}`
        window.open(urlOpen, '_top');
      }
      return result;
    }
  
getAllComment(allTodosUrl);


// Запуск таймера
var time = 600;
var intr;
function start_timer1() {
intr = setInterval(tick1, 1000);
}
function tick1() {
time = time-1;
var mins = Math.floor(time/60);
var secs = time - mins*60;
if( mins == 0 && secs == 0 ) {
clearInterval(intr);
}
secs = secs >= 10 ? secs : "0"+secs;
$("#min1").html("0"+mins);
$("#sec1").html(secs);
}

start_timer1();

});





