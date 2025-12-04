document.addEventListener('DOMContentLoaded', async function() {
  const QUIZ_JSON_URL = 'https://raw.githubusercontent.com/augustttatf/bctp/refs/heads/main/blablabla.json';

  const quizForm = document.getElementById('quiz-form');
  const submitBtn = document.getElementById('submit-btn');

  // 取得 query.html 傳來的 selectedQuestionTypes
  const selectedQuestionTypes = JSON.parse(localStorage.getItem('selectedQuestionTypes') || '[]');

  if (!selectedQuestionTypes.length) {
    alert('未選擇行為類型，將返回行為勾選頁');
    window.location.href = 'query.html';
    return;
  }

  let allQuestions = [];

  try {
    const res = await fetch(QUIZ_JSON_URL);
    const data = await res.json();
    // 篩選出 selectedQuestionTypes 對應的題目
    allQuestions = data.questions.filter(q => selectedQuestionTypes.includes(q.questionType));
  } catch (err) {
    console.error(err);
    alert('題庫載入失敗，請稍後再試');
    return;
  }

  if (!allQuestions.length) {
    quizForm.innerHTML = '<p class="note">沒有符合所選行為的題目。</p>';
    return;
  }

  // 隨機選出最多 10 題
  const shuffled = allQuestions.sort(() => 0.5 - Math.random());
  const quizQuestions = shuffled.slice(0, 10);

  // 生成題目 HTML
  quizQuestions.forEach((q, idx) => {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'quiz-question';

    const qTitle = document.createElement('h3');
    qTitle.textContent = `${idx + 1}. ${q.question}`;
    questionDiv.appendChild(qTitle);

    q.options.forEach((opt, i) => {
      const label = document.createElement('label');
      label.innerHTML = `<input type="radio" name="q${idx}" value="${i}"> ${opt}`;
      questionDiv.appendChild(label);
    });

    quizForm.appendChild(questionDiv);
  });

  // 提交按鈕
  submitBtn.addEventListener('click', function() {
    const answers = [];
    for (let i = 0; i < quizQuestions.length; i++) {
      const selected = quizForm.querySelector(`input[name="q${i}"]:checked`);
      answers.push(selected ? Number(selected.value) : null);
    }

    // 儲存答案到 localStorage，供 form.html 取用
    localStorage.setItem('quizAnswers', JSON.stringify({
      questionTypes: selectedQuestionTypes,
      answers: answers
    }));

    // 跳轉到表單頁
    window.location.href = 'form.html';
  });
});
