import data from './var_let_const_quiz.json' with {type: 'json'}

// Create Main Title/Info

let quizTitle = document.getElementById('quizTitle');
quizTitle.children[0].innerText = data.title;

document.body.appendChild(quizTitle);


for(let questionIndex = 0; questionIndex < data.questions.length; questionIndex++){

    let question = document.createElement('div');
    question.className = "question";
    let qData = data.questions[questionIndex];
    let code = qData.code !== null ? qData.code : '';
    let codeClass = qData.code !== null ? 'code' : '';
    question.innerHTML = 

        `
            <div class="qDetails">
                <span class="qNum">Q: ${qData.id}</span><span class="category">${qData.category}</span><span class="difficulty">${qData.difficulty}</span>
            </div>
            <div class="questionText">
                <p>${qData.question}</p>
            </div>

            <div class="explaination">
            <code class=${codeClass}>${code}</code>
                <p></p>
            </div>
        `;

    let answer = document.createElement('div');
    answer.className = "answerWrapper";

    for(let answerIndex = 0; answerIndex < data.questions[answerIndex].options.length; answerIndex++){
        let iscorrect = answerIndex === qData.correctAnswer ? 'correct' : 'incorrect';
        answer.innerHTML += `<div class="answer" data-isCorrect=${iscorrect}>${qData.options[answerIndex]}</div>`;
    }

    // Add Event to Each Answer
    
    answer.addEventListener('click', (event) => {
        let target = event.target;
        if(target.classList.contains('answer') && target.dataset.iscorrect === 'correct'){
            target.classList.add('correct')    
            target.parentElement.style.pointerEvents = 'none';
            
        } else if(target.classList.contains('answer') && target.dataset.iscorrect === 'incorrect'){
            target.parentElement.style.pointerEvents = 'none';

            let answerNodeArr = target.parentElement.children;

            for(let i = 0; i < answerNodeArr.length; i++){
                if(answerNodeArr[i].dataset.iscorrect === 'correct'){
                    answerNodeArr[i].classList.add('correct');
                } else {
                    answerNodeArr[i].classList.add('incorrect');
                }
            }
        }
    })


    question.appendChild(answer);

    document.body.appendChild(question);
}
