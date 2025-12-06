document.addEventListener('DOMContentLoaded', async function () {
  const QUIZ_JSON_URL =
    'https://raw.githubusercontent.com/augustttatf/bctp/refs/heads/main/blablabla.json';

  const quizForm = document.getElementById('quiz-form');
  const submitBtn = document.getElementById('submit-btn');
  const scoreDisplay = document.getElementById('score-display');

  // 取得 query.html 傳來的 selectedQuestionTypes（數字陣列）
  const selectedQuestionTypes = JSON.parse(
    localStorage.getItem('selectedQuestionTypes') || '[]'
  );

  if (!selectedQuestionTypes.length) {
    alert('未選擇行為類型，將返回行為勾選頁');
    window.location.href = 'query.html';
    return;
  }

  let allQuestions = [];

  try {
    const res = await fetch(QUIZ_JSON_URL);
    const data = await res.json();

    // 依選取的類型篩題
    allQuestions = data.questions.filter((q) =>
      selectedQuestionTypes.includes(q.questionType)
    );
  } catch (err) {
    console.error(err);
    alert('題庫載入失敗');
    return;
  }

  if (!allQuestions.length) {
    quizForm.innerHTML = '<p>沒有符合的題目。</p>';
    return;
  }

  // 取最多 10 題
  const shuffled = allQuestions.sort(() => 0.5 - Math.random());
  const quizQuestions = shuffled.slice(0, 10);

  // 產生題目
  quizQuestions.forEach((q, idx) => {
    const div = document.createElement('div');
    div.className = 'quiz-question';

    div.innerHTML = `<h3>${idx + 1}. ${q.question}</h3>`;

    q.options.forEach((opt, i) => {
      div.innerHTML += `
        <label>
          <input type="radio" name="q${idx}" value="${i}"> ${opt}
        </label><br>
      `;
    });

    quizForm.appendChild(div);
  });

  // ================
  //   點擊送出測驗
  // ================
  submitBtn.addEventListener('click', function () {
    let score = 0;
    let answeredCount = 0;

    for (let i = 0; i < quizQuestions.length; i++) {
      const selected = quizForm.querySelector(
        `input[name="q${i}"]:checked`
      );

      if (selected) {
        answeredCount++;
        if (Number(selected.value) === quizQuestions[i].answer) {
          score += 10; // 每題 10 分
        }
      }
    }

    // 顯示分數
    scoreDisplay.textContent = `您的得分：${score} 分`;
/*
    // 檢查是否答完（可選）
    if (answeredCount < quizQuestions.length) {
      alert('請完成所有題目再提交！');
      return;
    }
    */

    // **60 分才能進入表單**
    if (score < 60) {
      alert('分數未達 60 分，請再試一次！');
      return;
    }

    // 過關 → 儲存分數 & 跳到 form.html
    localStorage.setItem(
      'quizResult',
      JSON.stringify({
        selectedQuestionTypes: selectedQuestionTypes,
        score: score
      })
    );

    window.location.href = 'form.html';
  });
});
