
const title = document.querySelector('.input-title > input');
const description = document.querySelector('.input-description > textarea');
const priority = document.querySelector('.input-priority > select');
const dueTime = document.querySelector('#due-time');
const tag = document.querySelector('.input-tag > input');


// creating an event listener for the add button to add a new card 
// to the cards array and display it on the page
document.querySelector('.add-btn').addEventListener('click', () => {
    addCard();
})


// the cards array to hold the todo cards
let cards = JSON.parse(localStorage.getItem('cards')) || [
    {
        priority: high,
        status: 'pending',
        title: 'playing',
        description: 'playing football',
        dueTime: getDueTime(75845665445),
        tag: 'work',
        id: crypto.randomUUID()
    }
];


function saveToCards() {
    localStorage.setItem('cards', JSON.stringify(cards));
}


// add Todo card to the cards array 
// and display it on the page
function addCard() {

    if (priority.value && title.value && description.value && dueTime.value && tag.value) {

        cards.push({
            priority: priority.value,
            status: 'pending',
            title: title.value,
            description: description.value,
            dueTime: getDueTime(dueTime.value),
            tag: tag.value,
            id: crypto.randomUUID()
        });



        priority.value = 'High';
        title.value = '';
        description.value = '';
        dueTime.value = '';
        tag.value = '';

    }

    else {
        alert('Please fill in all fields');
    }
    saveToCards()
    displayCards();

}


// inputted due time converted to a date object(milliseconds)
function getDueTime(time) {

    const dueTimeValue = dayjs(time);
    return dueTimeValue.format('YYYY-MM-DD HH:mm:ss');
}


// getting the remaining time until the due time 
// and converting it to days, hours, minutes and seconds
function getRemainingTime(givenDueTime) {

    const dueTimeValue = dayjs(givenDueTime);

    const now = dayjs();

    const timeDiff = dueTimeValue.diff(now);

    let difference = "";

    if (timeDiff < 0) {
        difference = timeDiff * -1;
    } else {
        difference = timeDiff;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    if (timeDiff < 0) {
        const timeRemaining = `Overdue by ${days} days, ${hours} hrs, ${minutes} mins and ${seconds} secs`;
        return timeRemaining;
    } else if (timeDiff > 0) {
        const timeRemaining = `Due in ${days} days, ${hours} hrs, ${minutes} mins and ${seconds} secs`;
        return timeRemaining;
    } else {
        const timeRemaining = 'Due now';
        return timeRemaining;
    }
}

function updateRemainingTime() {

    cards.forEach((card) => {
        const timeRemainingcontainer = document.querySelector(`.time-remaining-${card.id}`);

        if (timeRemainingcontainer) {
            const newTimeRemaining = getRemainingTime(card.dueTime);
            timeRemainingcontainer.textContent = ` ${newTimeRemaining}`;

        }
    })

}

setInterval(updateRemainingTime, 1000);



// function to display the cards on the page by looping through
// the cards array and creating a card for each todo card
function displayCards() {

    let cardHtml = '';
    cards.forEach((card) => {

        cardHtml += `
          <section class="cards js-card-${card.id}" data-testid="test-todo-card" role="region">
    
                <div class="card-layer-one">
                    <div class="collapse-priority-container">
                        <button aria-label="collapse card" class="collapse-btn js-collapse" data-id="${card.id}">
                            <img class="collapse-icons"  src="./images/collapse.svg" alt="">
                        </button>

                        <span data-testid="test-todo-priority" aria-label="Card priority" class="card-priority js-card-priority-${card.id}">
                            <img class="icons js-card-priority-icon-${card.id}" src="./images/${card.priority}-priority-icon.svg" alt=""> ${card.priority} Priority
                        </span>
                    </div>
                    <span data-testid="test-todo-status" aria-label="Card status" class="card-status js-card-status-${card.id}">
                        Status: <img class="icons" src="./images/pending-icon.svg" alt=""> Pending
                    </span>
                </div>

                    <h3 class="card-title card-title-${card.id}" data-testid="test-todo-title">${card.title}</h3>
                <div class="card-body js-card-body-${card.id}">
                        <p class="card-description card-description-${card.id}" data-testid="test-todo-description">${card.description}</p>
                
                    <div class="time-container">
                        <time data-testid="test-todo-time-remaining" aria-live="polite" class="time-remaining-${card.id}" datetime="${card.timeRemaining}">
                            
                        </time>

                        <time class="js-due-time-${card.id}" data-testid="test-todo-due-date" datetime="${card.dueTime}">
                            Time: ${card.dueTime}
                        </time>
                    </div>

                    <div class="card-layer-three">
                        <div data-testid="test-todo-complete-toggle" class="switch-container">
                            Completed:
                            <label class="switch">
                                <input type="checkbox" class="toggle js-toggle toggle-${card.id}" data-id="${card.id}" aria-label="Toggle complete">
                                <span class="slider"></span>
                            </label>
                        </div>
                        <div>
                            <div data-testid="test-todo-tags" role="list" class="tag-container">
                                <img class="icons" src="./images/tag-icon.svg" alt="">Tag: <span class='card-tag-${card.id}'> ${card.tag} </span>
                            </div>
                        </div>
                    </div>

                    <div class="card-layer-four">

                            <button aria-label="Edit button" data-id="${card.id}" class="edit js-edit js-edit-${card.id}">
                            <img class="icons" src="./images/edit-icon.svg" alt=""> <span class="icon-texts"> Edit </span>
                        </button>
                        <button aria-label="Delete button" data-id="${card.id}" class="delete js-delete js-delete-${card.id}">
                            <img class="icons" src="./images/delete-icon.svg" alt=""> <span  class="icon-texts"> Delete </span>
                        </button>
                
                    
                    </div>
                </div>

            </section>
       `
    })

    const cardContainer = document.querySelector('.card-container').innerHTML = cardHtml;

}

// running the function to display the cards on page load
saveToCards();
displayCards();


// delete buttons event listeners to delete a card from the 
// cards array and remove it from the page

document.querySelector('.card-container').addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.js-delete');
    if (!deleteBtn) return;

    const cardId = deleteBtn.dataset.id;


    const deleteBtnElem = document.querySelector(`.js-delete-${cardId}`);


    document.querySelector(`.js-card-${cardId}`).remove();

    cards = cards.filter((card) => card.id !== cardId)
    saveToCards()
    displayCards()

});


const backup = {}


// edit buttons event listeners to edit a card from the
document.querySelector('.card-container').addEventListener('click', (e) => {
    const editBtn = e.target.closest('.js-edit');
    if (!editBtn) return;

    const cardId = editBtn.dataset.id;
    const titleElem = document.querySelector(`.card-title-${cardId}`);
    const descriptionElem = document.querySelector(`.card-description-${cardId}`);
    const tagElem = document.querySelector(`.card-tag-${cardId}`);
    const priorityElem = document.querySelector(`.js-card-priority-${cardId}`);
    const dueTimeElem = document.querySelector(`.js-due-time-${cardId}`);
    const cardElem = document.querySelector(`.js-card-${cardId}`);
    const deleteBtnElem = document.querySelector(`.js-delete-${cardId}`);
    const editBtnElem = document.querySelector(`.js-edit-${cardId}`);

    backup[cardId] = {
        title: titleElem.innerText,
        description: descriptionElem.innerText,
        tag: tagElem.innerHTML,
        priority: priorityElem.innerText,
        dueTime: dueTimeElem.value
    }

    const saved = backup[cardId];

    cardElem.classList.remove('cards')
    cardElem.classList.add('edit-container')

    cardElem.setAttribute('data-id', 'test-todo-edit-title-input');


    cardElem.innerHTML = `
                   
            <div class="input-title">
                <label>Title</label>
                <input data-testid="test-todo-edit-title-input"  class="edited-title-${cardId}" type="text" value="${saved.title}" id="title">
            </div>

            <div class="input-description">
                <label>Description</label>
                <textarea data-testid="test-todo-edit-description-input" class="edited-description-${cardId}"  name="description">${saved.description}</textarea>
            </div>

            <div class="input-layer-three">
                <div class="input-due-time">
                    <label>Time</label>
                    <input data-testid="test-todo-edit-time-input" class="edited-time-${cardId}"  value="${getDueTime(saved.dueTime)}" type="datetime-local" name="due-time" id="due-time">
                </div>

                <div class="input-priority">
                    <label>Priority</label>
                    <select data-testid="test-todo-edit-priority-input" class="edited-priority-${cardId}"  name="priority">
                        <option  value="high">High</option>
                        <option  value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>

                <div class="input-tag">
                    <label for="tag">Tag</label>
                    <input data-testid="test-todo-edit-tag-input" class="edited-tag-${cardId}" value="${saved.tag}" type="text" name="tag">
                </div>

            </div>

            <div class='editing-btns'>
                <button aria-label="Cancel button" class="cancel-btn cancel-btn-${cardId}" data-id="${cardId}">
                 <img class="icons" src="./images/cancel.svg" alt=""> <span class="icon-texts"> Cancel </span>
                </button>

                <button aria-label="Done button"  class='done-btn done-btn-${cardId}'  data-id="${cardId}">
                   <img class="icons " src="./images/done.svg" alt=""> <span class="icon-texts"> Done </span>
                </button>

            </div>
    `
});


document.querySelector('.card-container').addEventListener('click', (e) => {
    const cancelBtn = e.target.closest('.cancel-btn');
    if (!cancelBtn) return;

    const cardId = cancelBtn.dataset.id;
    const cardElem = document.querySelector(`.js-card-${cardId}`);
    cardElem.classList.add('cards')
    cardElem.classList.remove('edit-container')
    const saved = backup[cardId];
    let savedText = ''
    savedText = saved.priority
    const savedPriority = savedText.split(' ')[0];
    cardElem.setAttribute('data-id', 'test-todo-card');

    cardElem.innerHTML = `
                <div class="card-layer-one">
                    <div class="collapse-priority-container">
                        <button aria-label="collapse button" class="collapse-btn js-collapse" data-id="${cardId}">
                            <img class="collapse-icons"  src="./images/collapse.svg" alt="">
                        </button>

                        <span data-testid="test-todo-priority" aria-label="Card priority" class="card-priority js-card-priority-${cardId}">
                            <img class="icons js-card-priority-icon-${cardId}" src="./images/${savedPriority}-priority-icon.svg" alt=""> ${savedPriority} Priority
                        </span>
                    </div>
                    <span data-testid="test-todo-status" aria-label="Card status" class="card-status js-card-status-${cardId}">
                        Status: <img class="icons" src="./images/pending-icon.svg" alt=""> Pending
                    </span>
                </div>

                    <h3 class="card-title card-title-${cardId}" data-testid="test-todo-title">${saved.title}</h3>
                <div class="card-body js-card-body-${cardId}">
                        <p class="card-description card-description-${cardId}" data-testid="test-todo-description">${saved.description}</p>
                
                    <div class="time-container">
                        <time data-testid="test-todo-time-remaining" aria-live="polite" class="time-remaining-${cardId}" datetime="${saved.timeRemaining}">
                            
                        </time>

                        <time class="js-due-time-${cardId}" data-testid="test-todo-due-date" datetime="${saved.dueTime}">
                            Time: ${getDueTime(saved.dueTime)}
                        </time>
                    </div>

                    <div class="card-layer-three">
                        <div data-testid="test-todo-complete-toggle" class="switch-container">
                            Completed:
                            <label class="switch">
                                <input type="checkbox" class="toggle js-toggle toggle-${cardId}" data-id="${cardId}" aria-label="Toggle complete">
                                <span class="slider"></span>
                            </label>
                        </div>
                        <div>
                            <div data-testid="test-todo-tags" role="list" class="tag-container">
                                <img class="icons" src="./images/tag-icon.svg" alt="">Tag: <span class='card-tag-${cardId}'> ${saved.tag} </span>
                            </div>
                        </div>
                    </div>

                    <div class="card-layer-four">

                        <button aria-label="Edit button" data-id="${cardId}" class="edit js-edit js-edit-${cardId}">
                            <img class="icons" src="./images/edit-icon.svg" alt=""> <span class="icon-texts"> Edit </span>
                        </button>
                        <button  aria-label="Delete button" data-id="${cardId}" class="delete js-delete js-delete-${cardId}">
                            <img class="icons" src="./images/delete-icon.svg" alt=""> <span  class="icon-texts"> Delete </span>
                        </button>
                
                    
                    </div>
                </div>
    `
})

const editedCard = {}

document.querySelector('.card-container').addEventListener('click', (e) => {

    const done = e.target.closest('.done-btn');
    if (!done) return;

    const cardId = done.dataset.id
    const titleElem = document.querySelector(`.edited-title-${cardId}`);
    const descriptionElem = document.querySelector(`.edited-description-${cardId}`);
    const tagElem = document.querySelector(`.edited-tag-${cardId}`);
    const priorityElem = document.querySelector(`.edited-priority-${cardId}`);
    const dueTimeElem = document.querySelector(`.edited-time-${cardId}`);
    const cardElem = document.querySelector(`.js-card-${cardId}`);

    cardElem.classList.add('cards')
    cardElem.classList.remove('edit-container')
    cardElem.setAttribute('data-id', 'test-todo-card');

    editedCard[cardId] = {
        priority: priorityElem.value,
        title: titleElem.value,
        description: descriptionElem.value,
        time: getDueTime(dueTimeElem.value),
        tag: tagElem.value
    }

    const editedValue = editedCard[cardId];

    cards.forEach((card) => {
        if (card.id === cardId) {
            card.priority = editedValue.priority;
            card.title = editedValue.title;
            card.description = editedValue.description;
            card.dueTime = getDueTime(editedValue.time);
            card.tag = editedValue.tag;
        }
    });

    saveToCards();
    displayCards();

    cardElem.innerHTML = `
                <div class="card-layer-one">
                    <div class="collapse-priority-container">
                        <button aria-label="collapse button" class="collapse-btn js-collapse" data-id="${cardId}">
                            <img class="collapse-icons"  src="./images/collapse.svg" alt="">
                        </button>

                        <span data-testid="test-todo-priority" aria-label="Card priority" class="card-priority js-card-priority-${cardId}">
                                  <img class="icons js-card-priority-icon-${cardId}" src="./images/${editedValue.priority}-priority-icon.svg" alt=""> ${editedValue.priority} Priority
                        </span>
                    </div>
                    <span data-testid="test-todo-status" aria-label="Card status" class="card-status js-card-status-${cardId}">
                        Status: <img class="icons" src="./images/pending-icon.svg" alt=""> Pending
                    </span>
                </div>

                    <h3 class="card-title card-title-${cardId}" data-testid="test-todo-title">${editedValue.title}</h3>
                <div class="card-body js-card-body-${cardId}">
                        <p class="card-description card-description-${cardId}" data-testid="test-todo-description">${editedValue.description}</p>
                
                    <div class="time-container">
                        <time data-testid="test-todo-time-remaining" aria-live="polite" class="time-remaining-${cardId}" datetime="${editedCard.timeRemaining}">
                            
                        </time>

                        <time class="js-due-time-${cardId}" data-testid="test-todo-due-date" datetime="${editedCard.time}">
                            Time: ${getDueTime(editedValue.time)}
                        </time>
                    </div>

                    <div class="card-layer-three">
                        <div data-testid="test-todo-complete-toggle" class="switch-container">
                            Completed:
                            <label class="switch">
                                <input type="checkbox" class="toggle js-toggle toggle-${cardId}" data-id="${cardId}" aria-label="Toggle complete">
                                <span class="slider"></span>
                            </label>
                        </div>
                        <div>
                            <div data-testid="test-todo-tags" role="list" class="tag-container">
                                <img class="icons" src="./images/tag-icon.svg" alt="">Tag: <span class='card-tag-${cardId}'> ${editedValue.tag} </span>
                            </div>
                        </div>
                    </div>

                    <div class="card-layer-four">

                            <button aria-label="Edit card" data-id="${cardId}" class="edit js-edit js-edit-${cardId}">
                            <img class="icons" src="./images/edit-icon.svg" alt=""> <span class="icon-texts"> Edit </span>
                        </button>
                        <button  aria-label="Delete card" data-id="${cardId}" class="delete js-delete js-delete-${cardId}">
                            <img class="icons" src="./images/delete-icon.svg" alt=""> <span  class="icon-texts"> Delete </span>
                        </button>
                                    
                    </div>
                </div>
    `
})



// toggle buttons event listeners to toggle the complete
//  status of a card and update the status on the page 

document.querySelector('.card-container').addEventListener('change', (e) => {
    const toggle = e.target.closest('.js-toggle');
    if (!toggle) return;

    const cardId = toggle.dataset.id;

    const statusElem = document.querySelector(`.js-card-status-${cardId}`);
    const titleElem = document.querySelector(`.card-title-${cardId}`);

    if (toggle.checked) {
        statusElem.innerHTML = 'Status: <img class="icons" src="./images/done-icon.svg"> Done';
        titleElem.style.textDecoration = 'line-through';
    } else {
        statusElem.innerHTML = 'Status: <img class="icons" src="./images/pending-icon.svg"> Pending';
        titleElem.style.textDecoration = 'none';
    }
});



//  all keyboard functions 
document.addEventListener('keydown', (e) => {

    switch (e.key) {
        case 'Enter':
            addCard();
            break;

        default:
            break;
    }
})


document.querySelector('.card-container').addEventListener('click', (e) => {

    const collapseBtn = e.target.closest('.js-collapse');
    if (!collapseBtn) return;

    const cardId = collapseBtn.dataset.id;
    const card = document.querySelector(`.js-card-${cardId}`);

    card.classList.toggle('collapsed');

    if (card.classList.contains('collapsed')) {
        collapseBtn.innerHTML = '<img  class="collapse-icons" src="./images/expand.svg" alt=""></img>';
    } else {
        collapseBtn.innerHTML = '<img class="collapse-icons" src="./images/collapse.svg" alt=""></img>';
    }
});





