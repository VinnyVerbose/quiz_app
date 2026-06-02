import data from './var_let_const_quiz.json' with {type: 'json'}

const app = document.getElementById('app');

const state = {
    screen: "welcome",
    currentQuestionIndex: 0,
    answerHistory: []
}

init();

function init(){
    render();
}

function render(){
    switch(state.screen){
        case "welcome":
            renderWelcome();
            addStartEvent();
            break;
        
        case "question":
            renderQuestion();
            addAnswerEvents();
            break;

        case "thankYou":
            renderThankyou();
            break;

        case "results":
            renderResults();
            break;
    }
}

function renderWelcome(){
    let html = 
     `
        <div id="welcome">
            <p>Welcome to: ${data.title} quiz.  Press start to continue.</p>
            <button id="btnStart">Start</button>
         </div>
    `;

    app.innerHTML = html;
}

function renderQuestion(){
    let q = data.questions[state.currentQuestionIndex];
    let html = `
    <div id="question">
        <span class="qText">${q.question}</span>
        <div class="answersWrapper">
            ${q.options.map((option, index) => {
                return renderAnswer(option, index);
            }).join('')}
        </div>
    </div>
    `

    app.innerHTML = html;
}

function renderAnswer(option, index){
    return `
        <button class="answer" data-answer-index="${index}">${option}</button>
    `
}

function renderThankyou(){
    let html = `
        <div id="thankYouWrapper">
            <p>Thank you for completing the quiz<p>
            <p>You may now close this window</p>
    `

    app.innerHTML = html;
}

// Add Events
function addStartEvent(){
    document.getElementById('btnStart').addEventListener('click', () => {
        state.screen = "question";
        render();
    });
}

function addAnswerEvents(){
    let answers = document.getElementsByClassName('answer');

    for(let i = 0; i < answers.length; i++){
        answers[i].addEventListener('click', ()=> {
            handleAnswerSelected(answers[i].dataset.answerIndex);
        });
    }
}

function handleAnswerSelected(index){
    console.log(data.questions[state.currentQuestionIndex].correctAnswer, index)
    let isCorrect = data.questions[state.currentQuestionIndex].correctAnswer === Number(index);

    state.answerHistory.push({
        questionId: data.questions[state.currentQuestionIndex].id,
        selectedAnswerIndex: Number(index),
        isCorrect
    });
    
    if(state.currentQuestionIndex >= data.questions.length - 1){
        state.screen = "thankYou";
    }  else {
        state.currentQuestionIndex++;
    }
    console.log(state)
    render();
}