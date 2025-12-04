document.addEventListener('DOMContentLoaded', async function() {
  const QUIZ_JSON_URL = 'https://raw.githubusercontent.com/augustttatf/bctp/refs/heads/main/blablabla.json';
  const quizContainer = document.getElementById('quiz-container');
  const submitBtn = document.getElementById('submit-btn');
  const loadingMessage = document.getElementById('loading-message');

  // 取得使用者勾選行為
  const selectedBehaviors = JSON.parse(localStorage.getItem('selectedBehaviors') || '[]');
  if (selectedBehaviors.length === 0) {
    alert('未選擇行為，將返回查詢頁');
    window.location.href = 'query.html';
    return;
  }

  // 讀取題目 JSON
  let quizData;
  try {
    const res = await fetch(QUIZ_JSON_URL);
    if (!res.ok) throw new Error(`讀取題目失敗 (${res.status})`);
    quizData = await res.json();
  } catch (err) {
    console.error(err);
    quizContainer.innerHTML = `<p class="note">題目載入失敗，請稍後再試。</p>`;
    return;
  }

  // 過濾題目：僅選擇與 selectedBehaviors 對應的 questionType
  const questionTypeMapping = quizData.questionType_mapping;
  const filteredQuestions = quizData.questions.filter(q => selectedBehaviors.includes(Object.keys(questionTypeMapping).find(k => parseInt(k) === q.questionType)));
  
  // 只取前 10 題
  const questions = filteredQuestions.slice(0, 10);

  if (questions.length === 0) {
    quizContainer.innerHTML = '<p class="note">沒有符合所選行為的題目。</p>';
    return;
  }

  loadingMessage?.remove();

  // 生成題目 DOM
  const formEl = document.createElement('form');
  formEl.id = 'quiz-form';
  questions.forEach((q, idx) => {
    const qDiv = document.createElement('div');
    qDiv.className = 'quiz-question';
    qDiv.innerHTML = `
      <p class="question-text">${idx + 1}. ${q.question}</p>
      ${q.options.map((opt, i) => `
        <label>
          <input type="radio" name="q${idx}" value="${i}" required>
          ${opt}
        </label>
      `).join('')}
    `;
    formEl.appendChild(qDiv);
  });

  quizContainer.appendChild(formEl);

  // 提交按鈕事件
  submitBtn.addEventListener('click', function() {
    const form = document.getElementById('quiz-form');
    if (!form.checkValidity()) {
      alert('請完成所有題目');
      return;
    }

    // 蒐集答案
    const answers = {};
    questions.forEach((q, idx) => {
      const selected = form.querySelector(`input[name="q${idx}"]:checked`);
      answers[`q${idx}`] = selected ? parseInt(selected.value) : null;
    });

    // 存到 localStorage 以便 form.html 使用
    localStorage.setItem('quizAnswers', JSON.stringify({
      selectedBehaviors,
      answers
    }));

    // 跳轉表單頁
    window.location.href = 'form.html';
  });
});
