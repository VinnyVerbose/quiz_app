import data from './var_let_const_quiz.json' with {type: 'json'}

const app = document.getElementById('app');

const state = {
    screen: "welcome",
    currentQuestionIndex: 17,
    answerHistory: [],
    quizMode: "review",
    reviewFilter: null,
    isReviewing: false,
    reviewQuestionsIds: [],
    reviewQuestionIndex: 0
}

init();

function init(){
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
    let q = null;
    if(state.isReviewing){
        console.log('IS REVIEWING IF')
        q = data.questions.find(question => {
            return question.id === state.reviewQuestionsIds[state.reviewQuestionIndex];
        })
    } else {
        q = data.questions[state.currentQuestionIndex];
    }
    
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
    let id = null;
    if(!state.isReviewing){
        id = data.questions[state.currentQuestionIndex].id;
    } else {
        id = state.reviewQuestionsIds[state.reviewQuestionIndex];
    }
    
    
    let currentAnswer = state.answerHistory.find(answer => answer.questionId === id);


    if(currentAnswer.isCorrect){
        return currentAnswer.selectedAnswerIndex === index ? "correct" : "";
    }
    else{
        if(index === data.questions[state.currentQuestionIndex].correctAnswer){
            return "correct";
        }
        if(index === currentAnswer.selectedAnswerIndex){
            return "incorrect";
        }
        return "";
    }
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
        state.isReviewing = true;
        state.reviewFilter = "all";
        state.screen = "question";
        state.currentQuestionIndex = 17;
        render();
    });

    document.getElementById("btnReviewIncorrect").addEventListener('click', () => {
        state.isReviewing = true;
        state.reviewFilter = "incorrect";
        state.screen = "question";
        state.currentQuestionIndex = 0;
        handleReviewIncorrect();
        render();
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

// Business Logic===============================

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

function handleReviewIncorrect(){
    // getAnsweredQueestions
    let incorrectQuestionIDArray = state.answerHistory.reduce((acc, answer) => {
        
        if(!answer.isCorrect){
            acc.push(answer.questionId);
        }
        return acc;
        
    }, [])

    state.reviewQuestionsIds = incorrectQuestionIDArray;
    console.log('Inc State: ', state)
}

function advanceReview(){
    if(state.currentQuestionIndex >= data.questions.length - 1){
        state.reviewFilter = null;
        state.screen = "results";
        state.isReviewing = false;
    }else{
        state.currentQuestionIndex++;
    }
    render();    
}