document.addEventListener('DOMContentLoaded', async function() {
    const QUIZ_JSON_URL = 'https://raw.githubusercontent.com/augustttatf/bctp/refs/heads/main/blablabla.json';
    const quizWrapper = document.getElementById('quiz-wrapper');
    const submitBtn = document.getElementById('submit-btn');

    // 從 localStorage 讀取使用者勾選的行為
    let selectedQuestionTypes = JSON.parse(localStorage.getItem('selectedQuestionTypes') || '[]');
    let selectedBehaviors = JSON.parse(localStorage.getItem('selectedBehaviors') || '[]');

    if(selectedQuestionTypes.length === 0 || selectedBehaviors.length === 0){
        quizWrapper.innerHTML = '<p class="note">未選擇任何行為，無法生成題目。請返回查詢頁面勾選行為。</p>';
        submitBtn.style.display = 'none';
        return;
    }

    try {
        const response = await fetch(QUIZ_JSON_URL);
        if(!response.ok) throw new Error(`載入題庫失敗 (HTTP ${response.status})`);
        const data = await response.json();

        const allQuestions = data.questions.filter(q => selectedQuestionTypes.includes(q.questionType));
        if(allQuestions.length === 0){
            quizWrapper.innerHTML = '<p class="note">選擇的行為目前無對應題目。</p>';
            submitBtn.style.display = 'none';
            return;
        }

        // 隨機選 10 題或全部
        const shuffled = allQuestions.sort(() => 0.5 - Math.random());
        const quizQuestions = shuffled.slice(0, 10);

        // 儲存使用者答案
        const userAnswers = Array(quizQuestions.length).fill(null);

        // 生成題目
        quizWrapper.innerHTML = '';
        quizQuestions.forEach((q, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'quiz-question';
            questionDiv.innerHTML = `<h3>題目 ${index + 1}: ${q.question}</h3>`;
            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'quiz-options';
            q.options.forEach((opt, optIndex) => {
                const label = document.createElement('label');
                label.innerHTML = `<input type="radio" name="q${index}" value="${optIndex}"> ${opt}`;
                optionsDiv.appendChild(label);
            });
            questionDiv.appendChild(optionsDiv);
            quizWrapper.appendChild(questionDiv);
        });

        // 送出按鈕
        submitBtn.addEventListener('click', function(){
            // 收集答案
            quizQuestions.forEach((q, index) => {
                const selected = document.querySelector(`input[name="q${index}"]:checked`);
                userAnswers[index] = selected ? parseInt(selected.value) : null;
            });

            // 檢查是否都作答
            const unanswered = userAnswers.some(a => a === null);
            if(unanswered){
                if(!confirm('有題目尚未作答，仍要送出嗎？')) return;
            }

            // 存進 localStorage 送到 form.html
            localStorage.setItem('quizAnswers', JSON.stringify(userAnswers));
            localStorage.setItem('quizQuestions', JSON.stringify(quizQuestions));
            window.location.href = 'form.html';
        });

    } catch (err){
        console.error(err);
        quizWrapper.innerHTML = `<p class="note">載入題目發生錯誤：${err.message}</p>`;
        submitBtn.style.display = 'none';
    }
});
