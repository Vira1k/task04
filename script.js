const API = "https://opentdb.com/api.php?amount=10&type=multiple";
let questions = [];
const quiz = document.getElementById("quizContainer");
const form = document.getElementById("quizForm");
const result = document.getElementById("result");
const score = document.getElementById("score");
const message = document.getElementById("message");
async function loadQuiz() {
    try {
        message.innerText = "Loading questions...";
        const response = await fetch(API);
        if (!response.ok) {
            throw new Error("API Error " + response.status);
        }
        const data = await response.json();
        if (!data.results) {
            throw new Error("Questions not found");
        }
        questions = data.results;
        questions.forEach((q, i) => {
            let options = [
                q.correct_answer,
                ...q.incorrect_answers
            ];
            options.sort(() => Math.random() - 0.5);
            quiz.innerHTML += `
                <div class="question-card">
                    <h3>Question ${i + 1}</h3>
                    <p>${q.question}</p>
                    ${options.map(option => `
                                <label>
                                    <input type="radio" name="q${i}" value="${option}"> ${option} 
                                </label>
                            `)
                    .join("")}
                </div>
            `;
        });
        message.innerText = "";
    } catch (error) {
        console.log(error);
        message.innerText = "Unable to load quiz. Please try again later.";
    }       
}
form.onsubmit = function (event) {
    event.preventDefault();
    let marks = 0;
    questions.forEach((q, i) => {
        const answer = document.querySelector(
            `input[name="q${i}"]:checked`
        );
        if (answer && answer.value === q.correct_answer) {
            marks++;
        }
    });
    score.innerText = `${marks}/${questions.length}`;
    result.classList.remove("hidden");
};
document.getElementById("restartBtn").onclick = function () {
    result.classList.add("hidden");
    loadQuiz();
};
loadQuiz();