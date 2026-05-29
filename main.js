import data from './var_let_const_quiz.json' with {type: 'json'}

// Create Main Title/Info

let html = '';
init()

function init(){
    renderQuizTitle(data.title);
    renderQuestions(data.questions);
    document.getElementById('app').innerHTML = html;
    addEvents();
}

function renderQuizTitle(title){
   html += `<header id="quizTitle">
                <p>${title}</p>
            </header>`
    
}

function renderQuestions(questions){
    questions.forEach((question, index) => {

        let code = question.code !== null ? question.code : '';
        let codeClass = question.code !== null ? 'code' : '';

        html += `
                <div class="question ${index === 0 ? "active" : ""}">
                    <div class="qDetails">
                        <span class="qNum">Q: ${question.id}</span><span class="category">${question.category}</span><span class="difficulty">${question.difficulty}</span>
                    </div>
                    <div class="questionText">
                        <p>${question.question}</p>
                    </div>

                    <div class="explanation">
                    <code class=${codeClass}>${code}</code>
                        <p>${question.explanation}</p>
                    </div>
                    ${renderAnswers(question)}
                </div>
                `
    })
}

function renderAnswers(question){
    
    return `
            <div class="answerWrapper">
                ${question.options.map((answer, index) => {
                    let isCorrect = index === question.correctAnswer ? 'correct' : 'incorrect';
                    return `<div class="answer" data-isCorrect="${isCorrect}">${answer}</div>`;
                }).join('')}
            </div>
            <button class="btnNext">Next</button>
        `
}

// Add Event to Each Answer

function addEvents(){
    let answersArr = document.getElementsByClassName('answer');
        
    for(let i = 0; i < answersArr.length; i++){
        answersArr[i].addEventListener('click', (event) => {
            handleAnswerClick(event);
        })
    }

    let btnNext = document.getElementsByClassName('btnNext');

    for(let i = 0; i < btnNext.length; i++){
        btnNext[i].addEventListener('click', ()=> {
            btnNext[i].parentElement.classList.remove('active');
            currentQuestion++;
            document.getElementsByClassName('question')[currentQuestion].classList.add('active')
        })
    }
}

let currentQuestion = 0;

function handleAnswerClick(event){
    let target = event.target;
    if(target.classList.contains('answer') && target.dataset.iscorrect === 'correct'){
        target.classList.add('correct')    
        target.parentElement.style.pointerEvents = 'none';
        
    } else if(target.classList.contains('answer') && target.dataset.iscorrect === 'incorrect'){
        target.parentElement.style.pointerEvents = 'none';
        target.parentElement.previousElementSibling.children[1].style.display = 'block';
        let answerNodeArr = target.parentElement.children;

        for(let i = 0; i < answerNodeArr.length; i++){
            if(answerNodeArr[i].dataset.iscorrect === 'correct'){
                answerNodeArr[i].classList.add('correct');
            } else {
                answerNodeArr[i].classList.add('incorrect');
            }
        }
    }

    target.parentElement.nextElementSibling.style.visibility = 'unset'
}