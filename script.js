
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
let cards = [
    {
        priority: 'High',
        status: 'pending',
        title: 'Read Lupin Book',
        description: 'Read the book and write a review about it',
        dueTime: '2026-06-30 10:00:00',
        tag: 'leisure',
        id: crypto.randomUUID()

    },
    {
        priority: 'Medium',
        status: 'pending',
        title: 'Read hilton deacon book',
        description: 'Read the book and write a review about it',
        dueTime: '2026-06-30 10:00:00',
        tag: 'leisure',
        id: crypto.randomUUID()

    },
    {
        priority: 'Low',
        status: 'pending',
        title: 'Read maxwell article',
        description: 'Read the book and write a review about it',
        dueTime: '2026-06-30 10:00:00',
        tag: 'leisure',
        id: crypto.randomUUID()

    }
]



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

                <button class="collapse-btn js-collapse" data-id="${card.id}">
                     Collapse
                </button>

                    <span data-testid="test-todo-priority" aria-label="Card priority" class="card-priority js-card-priority-${card.id}">
                        <img class="icons js-card-priority-icon-${card.id}" src="./images/${card.priority}-priority-icon.svg" alt=""> ${card.priority} Priority
                    </span>

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
                                <input type="checkbox" class="checkbox js-toggle toggle-${card.id}" data-id="${card.id}" aria-label="Toggle complete">
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

                            <button data-testid="test-todo-edit-button" aria-label="Edit card" data-id="${card.id}" class="edit js-edit js-edit-${card.id}">
                            <img class="icons" src="./images/edit-icon.svg" alt="">Edit
                        </button>
                        <button data-testid="test-todo-delete-button" aria-label="Delete card" data-id="${card.id}" class="delete js-delete js-delete-${card.id}">
                            <img class="icons" src="./images/delete-icon.svg" alt="">Delete
                        </button>
                
                    
                    </div>
                </div>

            </section>
       `
    })

    const cardContainer = document.querySelector('.card-container').innerHTML = cardHtml;

}

// running the function to display the cards on page load
displayCards();


// delete buttons event listeners to delete a card from the 
// cards array and remove it from the page

document.querySelector('.card-container').addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.js-delete');
    if (!deleteBtn) return;

    const cardId = deleteBtn.dataset.id;

    const titleElement = document.querySelector(`.card-title-${cardId}`);
    const descriptionElement = document.querySelector(`.card-description-${cardId}`);
    const tagElement = document.querySelector(`.card-tag-${cardId}`);
    const priorityElement = document.querySelector(`.js-card-priority-${cardId}`);
    const dueTimeElement = document.querySelector(`.js-due-time-${cardId}`);
    const deleteBtnElement = document.querySelector(`.js-delete-${cardId}`);
    const editBtnElement = document.querySelector(`.js-edit-${cardId}`);


    const isEditing = deleteBtnElement.classList.contains('editing')

    if (isEditing) {
        cards.forEach((card) => {

            if (card.id === cardId) {
                card.priority = priority.value,
                    card.title = titleElement.innerText,
                    card.description = descriptionElement.innerText,
                    card.dueTime = getDueTime(dueTimeElement.value),
                    card.tag = tagElement.innerText
            }

            deleteBtnElement.innerHTML = `
                    <img class="icons" src="./images/done.svg" alt=""> Done
                `;

            editBtnElement.innerHTML = `
                    <img class="icons" src="./images/cancel.svg" alt=""> Cancel
                `;

            editBtnElement.classList.remove('editing')
            deleteBtnElement.classList.remove('editing')

        });
    }

    else {
        document.querySelector(`.js-card-${cardId}`).remove();

        cards = cards.filter((card) => card.id !== cardId)
        displayCards()
    }


});


const backup = {}

// edit buttons event listeners to edit a card from the
document.querySelector('.card-container').addEventListener('click', (e) => {
    const editBtn = e.target.closest('.js-edit');
    if (!editBtn) return;

    const cardId = editBtn.dataset.id;

    const titleElement = document.querySelector(`.card-title-${cardId}`);
    const descriptionElement = document.querySelector(`.card-description-${cardId}`);
    const tagElement = document.querySelector(`.card-tag-${cardId}`);
    const priorityElement = document.querySelector(`.js-card-priority-${cardId}`);
    const dueTimeElement = document.querySelector(`.js-due-time-${cardId}`);
    const editBtnElement = document.querySelector(`.js-edit-${cardId}`);
    const deleteBtnElement = document.querySelector(`.js-delete-${cardId}`);


    const isEditing = editBtnElement.classList.contains('editing')


    if (!isEditing) {

        editBtnElement.classList.add('editing')
        deleteBtnElement.classList.add('editing')

        backup[cardId] = {
            title: titleElement.innerText,
            description: descriptionElement.innerText,
            tag: tagElement.innerHTML,
            priority: priorityElement.innerHTML,
            dueTime: dueTimeElement.innerHTML
        }

        titleElement.classList.add('edit-outline');
        descriptionElement.classList.add('edit-outline');
        tagElement.classList.add('edit-outline');

        titleElement.contentEditable = true;
        descriptionElement.contentEditable = true;
        tagElement.contentEditable = true;


        priorityElement.innerHTML = `
                    
                            <label>Priority</label>
                            <select class="edit-priority edit-outline">
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        
                `;

        dueTimeElement.innerHTML = `
                    <label>Time</label>
                    <input class="edit-outline" type="datetime-local" name="due-time" id="due-time">               
                `;
        deleteBtnElement.innerHTML = `
                    <img class="icons" src="./images/done.svg" alt=""> Done
                `;

        editBtnElement.innerHTML = `
                    <img class="icons" src="./images/cancel.svg" alt=""> Cancel
       
                `;
    }

    else {

        editBtnElement.classList.remove('editing');

        const saved = backup[cardId];

        priorityElement.innerHTML = saved.priority;

        tagElement.innerHTML = saved.tag;

        titleElement.innerText = saved.title;

        descriptionElement.innerText = saved.description;

        dueTimeElement.innerHTML = saved.dueTime;

        deleteBtnElement.innerHTML = `
                    <img class="icons" src="./images/delete-icon.svg" alt=""> Delete
                `

        editBtnElement.innerHTML = `
                    <img class="icons" src="./images/edit-icon.svg" alt=""> Edit
       
                `
        titleElement.classList.remove('edit-outline');
        descriptionElement.classList.remove('edit-outline');
        tagElement.classList.remove('edit-outline');

        titleElement.contentEditable = false;
        descriptionElement.contentEditable = false;
        tagElement.contentEditable = false;
    }
});





// toggle buttons event listeners to toggle the complete
//  status of a card and update the status on the page

document.querySelector('.card-container').addEventListener('change', (e) => {
    const toggle = e.target.closest('.js-toggle');
    if (!toggle) return;

    const cardId = toggle.dataset.id;

    const statusElement = document.querySelector(`.js-card-status-${cardId}`);
    const titleElement = document.querySelector(`.card-title-${cardId}`);

    if (toggle.checked) {
        statusElement.innerHTML = 'Status: <img class="icons" src="./images/done-icon.svg"> Done';
        titleElement.style.textDecoration = 'line-through';
    } else {
        statusElement.innerHTML = 'Status: <img class="icons" src="./images/pending-icon.svg"> Pending';
        titleElement.style.textDecoration = 'none';
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
        collapseBtn.textContent = 'Expand';
    } else {
        collapseBtn.textContent = 'Collapse';
    }

});





