import data from './var_let_const_quiz.json' with {type: 'json'}

const app = document.getElementById('app');

const state = {
    screen: "welcome",
    currentQuestionIndex: 17,
    answerHistory: [],
    quizMode: "review"
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
    let codeVisible = q.code ? '' : 'hide';
    let html = `
    <div id="question">
        <span class="qText">${q.question}</span>
        <div class="code ${codeVisible}"><p>${q.code}</p></div>
        <div class="explanation "><p>${q.explanation}</p></div>
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
            <p>Thank you for completing the quiz</p>
            <p>You may now close this window</p>
        </div>
    `

    app.innerHTML = html;
}

function renderResults(){
    let results = getQuizResults();
    console.log("Results: ", results);

    let categoryHtml = `
    ${results.categories.map(category => {
        return renderCategoryData(category);
    }).join('')}
    `

    let html = `
        <div id="resultsWrapper">
            <p>Overall Results: </p>
            <p>Correct: ${results.totalCorrect} / ${results.totalAnswered} </p>
            <p>Incorrect: ${results.totalIncorrect} / ${results.totalAnswered}</p>

            <p>Results By Category:</p>
            ${categoryHtml}
            
        </div>
    `
    app.innerHTML = html;
}

function renderCategoryData(category){
    return `<p>${category.name} : <span>${category.correctCount} / ${category.totalAnswered}</span></p>`
}

function getQuizResults(){
    let totalAnswered = state.answerHistory.length;
    let totalCorrect = 0;
    let results = {categories: []};

    state.answerHistory.forEach(answer => {
        let questionIndex = answer.questionId - 1;
        let question = data.questions[questionIndex];
        let category = question.category;

        if(answer.isCorrect) totalCorrect++;

        if(category){
            if(!results[category]){
                results[category] = {
                    name: category,
                    totalAnswered: 1,
                    correctCount: answer.isCorrect === true ? 1 : 0
                }
                
                results.categories.push(results[category]);
            }else{
                results[category].totalAnswered++;
                if(answer.isCorrect){
                    results[category].correctCount++;
                }
            }
        } 
    });
    
    results.totalCorrect = totalCorrect;
    results.totalIncorrect = totalAnswered - totalCorrect;
    results.totalAnswered = totalAnswered;
  
    return results;
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
    recordAnswer(index);
    if(state.quizMode === "normal" || state.quizMode === "review"){
        advanceQuiz();
    }
}

function recordAnswer(index){
    let isCorrect = data.questions[state.currentQuestionIndex].correctAnswer === Number(index);
    state.answerHistory.push({
        questionId: data.questions[state.currentQuestionIndex].id,
        selectedAnswerIndex: Number(index),
        isCorrect
    });
}

function advanceQuiz(){
    if(state.currentQuestionIndex >= data.questions.length - 1){
        switch(state.quizMode){
            
            case "normal":
                state.screen = "thankYou";
                break;

            case "review":
                state.screen = "results";
                break;
        }
        
    }  else {
        state.currentQuestionIndex++;
    }
    render();
}