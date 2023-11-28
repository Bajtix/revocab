var questions = []
var current_question = 0;
var current_inverted = false;

var current_q = "";
var current_a = "";

var ds_question = undefined
var ds_answer = undefined
var ds_hist = undefined
var ds_streak = undefined


var rep = 1;
var streak = 0;
var lately = 0;
var correct = 0;
var incorrect = 0;
var answered = 0;

var lasts = []


function update_info() {

    ds_streak.innerHTML = `rep: <pre>${rep}</pre> acc: <pre>${Math.round((correct / answered) * 100)}%</pre> streak: <pre>${streak}</pre> lately: <pre>${Math.round(lately * 100)}%</pre>`;
}

function check(e) {
    ans = ds_answer.value;
    ans = ans.trim().toLowerCase();

    if (ans == current_a) {
        ds_hist.innerHTML = `<b>${ds_question.innerHTML}</b><br><span style='color:green'>✓ ${current_a}</span><br><br>` + ds_hist.innerHTML;
        correct++;
        streak++;
        lasts.push(true);
    } else {
        ds_hist.innerHTML = `<b>${ds_question.innerHTML}</b><br><span style='color:red'>✗ ${current_a}</span><br><br>` + ds_hist.innerHTML;
        incorrect++;
        streak = 0;
        lasts.push(false)
    }

    if (lasts > 30) lasts.pop();
    lately = 0;
    lasts.forEach(v => { if (v) lately++; });
    lately = lately / lasts.length;

    answered++;

    update_info();
    next_question();
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

function next_question() {
    ds_answer.value = "";
    ds_question.innerHTML = "";
    ds_question.focus();



    if (current_question >= questions.length) {
        questions = shuffle(questions);
        rep++;
        correct = 0;
        incorrect = 0;
        current_question = 0;
        answered = 0;
    };

    current_inverted = Math.random() >= 0.5;

    if (current_inverted) {
        current_a = questions[current_question].q;
        current_q = questions[current_question].a;
    } else {
        current_a = questions[current_question].a;
        current_q = questions[current_question].q;
    }

    ds_question.innerHTML = current_q;


    current_question += 1;

    ds_answer.focus();
}

function begin_quiz(text) {
    lines = text.split('\n');
    lines.forEach(v => {
        line = v.trim();
        if (line == "") return;
        line = line.split('|');
        questions.push({
            q: line[0].trim(),
            a: line[1].trim()
        })

    });
    questions = shuffle(questions);
    next_question();
}

window.onload = function () {
    document.querySelector('#quizbox').addEventListener("submit", check);
    ds_question = document.querySelector('#question');
    ds_answer = document.querySelector('#answer');
    ds_hist = document.querySelector('#history');
    ds_streak = document.querySelector('#streakinfo');
    fetch('questions.txt').then(response => {
        response.text().then(text => {
            begin_quiz(text);
        })
    })
}