import data from './var_let_const_quiz.json' with {type: 'json'}

const app = document.getElementById('app');

const state = {
    screen: "welcome",
    currentQuestionIndex: 17,
    answerHistory: [],
    quizMode: "review",
    reviewFilter: null,
    isReviewing: false,
    reviewQuestionIds: [],
    reviewQuestionIndex: 0,
    message: null
}

init();

function init(){
    addMessageButtonEvent();
    render();
}

function render(){
    console.log(state)
    switch(state.screen){
        case "welcome":
            renderWelcome();
            addStartEvent();
            break;
        
        case "question":
            renderQuestion();
            addAnswerEvents();
            addNextButtonEvent();
            break;

        case "thankYou":
            renderThankyou();
            break;

        case "results":
            renderResults();
            addReviewButtonEvents();
            break;
    }
}


// Renders ===========================================

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
    let q = getCurrentQuestion();
    
    // if(state.isReviewing){
    //     console.log('IS REVIEWING IF')
    //     q = data.questions.find(question => {
    //         return question.id === state.reviewQuestionIds[state.reviewQuestionIndex];
    //     })
    // } else {
    //     q = data.questions[state.currentQuestionIndex];
    // }
    
    console.log("Q: ", q, state)
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
        <div id="btnNextWrapper">
            ${state.isReviewing ? '<button id="btnNext">Next</button>' : ''}
        </div>
    </div>
    `

    app.innerHTML = html;
}

function renderAnswer(option, index){
    let style = "";
    if(state.isReviewing){
       style = getAnswerClass(index);
    }
    return `
        <button class="answer ${style}" data-answer-index="${index}">${option}</button>
    `
}

function getAnswerClass(index){
    let q = getCurrentQuestion();
    let currentAnswer = state.answerHistory.find(answer => {
        return answer.questionId === q.id;
    });

    if(currentAnswer.isCorrect){
        return currentAnswer.selectedAnswerIndex === index ? "correct" : "";
    }

    if(index === q.correctAnswer){
        return "correct";
    }

    if(index === currentAnswer.selectedAnswerIndex){
        return "incorrect";
    }

    return "";
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
            
            <div id="reviewOptionsWrapper">
                <button id="btnReviewAll">Review All Questions</button>
                <button id="btnReviewIncorrect">Review Incorrect Questions</button>
            </div>
        </div>
    `
    app.innerHTML = html;
}

function renderCategoryData(category){
    return `<p>${category.name} : <span>${category.correctCount} / ${category.totalAnswered}</span></p>`
}


// Add Events===================================

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

function addReviewButtonEvents(){
    document.getElementById("btnReviewAll").addEventListener('click', () => {
        startReview('all');
    });

    document.getElementById("btnReviewIncorrect").addEventListener('click', () => {
        startReview('incorrect')
    });
}

function addNextButtonEvent(){
    if(state.isReviewing){
        document.getElementById("btnNext").addEventListener('click', () => {
            console.log('clicked next')
            advanceReview();
        })
    }
}

function addMessageButtonEvent(){
    document.getElementById("btnMessageOk").addEventListener('click', () => {
        console.log('OK')
        let messageWrapper = document.getElementById("messageWrapper");
        messageWrapper.classList.add('hide');
    })
}

// Business Logic===============================

function showMessage(message){
    let messageWrapper = document.getElementById("messageWrapper");
    messageWrapper.querySelector('p').innerText = message;
    messageWrapper.classList.remove('hide');
}

function getCurrentQuestion(){
    if(state.isReviewing){
        let reviewQuestionId = state.reviewQuestionIds[state.reviewQuestionIndex];

        return data.questions.find(question => {
            return question.id === reviewQuestionId;
        });
    }

    return data.questions[state.currentQuestionIndex];
}

function handleAnswerSelected(index){
    if(!state.isReviewing){
        recordAnswer(index);
        if(state.quizMode === "normal" || state.quizMode === "review"){
            advanceQuiz();
        }
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

function getQuizResults(){
    let totalAnswered = state.answerHistory.length;
    let totalCorrect = 0;
    let results = {categories: []};

    state.answerHistory.forEach(answer => {
        let question = data.questions.find(question => question.id === answer.questionId);
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

function advanceQuiz(){
    if(state.currentQuestionIndex >= data.questions.length - 1){
        state.reviewFilter = null;
        switch(state.quizMode){
            
            case "review":
                state.screen = "results";
                break;

            default:
                state.screen = "thankYou";
                break;
        }
        
    }  else {
        state.currentQuestionIndex++;
    }
    render();
}

function advanceReview(){
    if(state.reviewQuestionIndex >= state.reviewQuestionIds.length - 1){
        state.reviewFilter = null;
        state.screen = "results";
        state.isReviewing = false;
        state.reviewQuestionIndex = 0;
    }else{
        state.reviewQuestionIndex++;
    }
    render();    
}

function startReview(filter){
    let reviewQuestionIds = buildReviewQuestionIds(filter);

    if(reviewQuestionIds.length === 0){
        state.message = 'No Questions to Review';
        showMessage(state.message);
        return;
    }

    state.reviewQuestionIds = reviewQuestionIds;
    state.isReviewing = true;
    state.reviewFilter = `${filter}`;
    state.reviewQuestionIndex = 0;
    state.screen = "question";
    
    render();

    
}

function buildReviewQuestionIds(filter){
    if(filter === 'all'){
        let questionIDs = state.answerHistory.map(answer => {
        return answer.questionId;
    });

        return questionIDs;
    }

    else if(filter === 'incorrect'){
        let incorrectQuestionIDArray = state.answerHistory.reduce((acc, answer) => {
            
            if(!answer.isCorrect){
                acc.push(answer.questionId);
            }
            return acc;
            
        }, [])
        return incorrectQuestionIDArray;
    }
}
