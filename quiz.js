document.addEventListener('DOMContentLoaded', async function() {
    const QUIZ_JSON_URL = 'https://raw.githubusercontent.com/augustttatf/bctp/refs/heads/main/blablabla.json';
    const quizWrapper = document.getElementById('quiz-wrapper');
    const quizForm = document.getElementById('quiz-form');

    // 從 localStorage 取得使用者選的行為類型
    let selectedBehaviors = JSON.parse(localStorage.getItem('selectedBehaviors')) || [];

    if (selectedBehaviors.length === 0) {
        alert('未選擇行為類型，將返回首頁');
        window.location.href = 'index.html';
        return;
    }

    try {
        const res = await fetch(QUIZ_JSON_URL);
        const quizData = await res.json();

        // 過濾出符合使用者勾選行為的題目
        let filteredQuestions = quizData.questions.filter(q => selectedBehaviors.includes(q.questionType.toString()));

        // 如果題目超過 10 題，隨機挑選 10 題
        if (filteredQuestions.length > 10) {
            filteredQuestions = shuffleArray(filteredQuestions).slice(0, 10);
        }

        // 生成題目 HTML
        filteredQuestions.forEach((q, idx) => {
            const qDiv = document.createElement('div');
            qDiv.className = 'quiz-question';
            let html = `<h3>第 ${idx + 1} 題：${q.question}</h3>`;
            html += '<ul class="options-list">';
            q.options.forEach((opt, i) => {
                html += `<li>
                    <label>
                        <input type="radio" name="q${idx}" value="${i}" required>
                        ${opt}
                    </label>
                </li>`;
            });
            html += '</ul>';
            qDiv.innerHTML = html;
            quizWrapper.appendChild(qDiv);
        });

        // 提交事件
        quizForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let score = 0;
            filteredQuestions.forEach((q, idx) => {
                const selected = quizForm[`q${idx}`].value;
                if (parseInt(selected) === q.correctAnswerIndex) score++;
            });

            // 將分數存入 localStorage，方便 form.html 讀取
            localStorage.setItem('quizScore', score);
            localStorage.setItem('quizTotal', filteredQuestions.length);

            // 跳轉表單頁
            window.location.href = 'form.html';
        });

    } catch (error) {
        console.error('載入測驗資料失敗:', error);
        alert('測驗資料載入失敗，請稍後再試');
    }

    // 隨機打散陣列
    function shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }
});
