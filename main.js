import data from './var_let_const_quiz.json' with {type: 'json'}

// Create Main Title/Info
let state = [];
let currentQuestion = 18;
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
            <div class="answerWrapper" data-question-number="${question.id}" data-category="${question.category}">
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
            
            if(handleNextQuestion()){
                document.getElementsByClassName('question')[currentQuestion].classList.add('active')
            } else{
                finishQuiz();
            }
            
        })
    }
}



function handleNextQuestion(){
    let numberOfQuestions = document.getElementsByClassName('question').length - 1;

    if(currentQuestion + 1 > numberOfQuestions){
        return false;
    }

    currentQuestion++
    return true;
}

function finishQuiz(){
    document.getElementById('app').style.display = 0;
    document.getElementById('msgWrapper').classList.remove('hide');
}

function handleAnswerClick(event){
    let target = event.target;
    
    if(target.classList.contains('answer') && target.dataset.iscorrect === 'correct'){
        target.classList.add('correct')    
        target.parentElement.style.pointerEvents = 'none';
        updateState(target.parentElement, true);
        
    } else if(target.classList.contains('answer') && target.dataset.iscorrect === 'incorrect'){
        target.parentElement.style.pointerEvents = 'none';
        target.parentElement.previousElementSibling.children[1].style.display = 'block';
        let answerNodeArr = target.parentElement.children;
        updateState(target.parentElement, false);

        for(let i = 0; i < answerNodeArr.length; i++){
            if(answerNodeArr[i].dataset.iscorrect === 'correct'){
                answerNodeArr[i].classList.add('correct');
            } else {
                answerNodeArr[i].classList.add('incorrect');
            }
        }
    }

    function updateState(element, isCorrect){
        console.log(element, element.dataset.questionNumber)
        state.push({
            questionNumber: element.dataset.questionNumber,
            category: element.dataset.category,
            isCorrect
        })
        console.log(state)
    }

    target.parentElement.nextElementSibling.style.visibility = 'unset'
}