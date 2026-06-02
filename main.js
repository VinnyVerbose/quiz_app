import data from './var_let_const_quiz.json' with {type: 'json'}

const app = document.getElementById('app');

const state = {
    screen: "welcome",
    currentQuestionIndex: 0
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
            ${q.options.map(option => {
                return renderAnswer(option);
            }).join('')}
        </div>
    </div>
    `

    app.innerHTML = html;
}

function renderAnswer(option){
    return `
        <button class="answer">${option}</button>
    `
}

// Add Events
function addStartEvent(){
    document.getElementById('btnStart').addEventListener('click', () => {
        state.screen = "question";
        render();
    })
}