/**
 * learning.js
 * 單一檔案版本：包含完整題庫（40 題）、出題、計分、遮罩/彈窗流程、通過放行機制
 *
 * 門檻：60 分（10 題，滿分 100）
 *
 * 注意：這個檔案假設放在同一目錄並被 learning.html 引用。
 */

/* ============================
   1) 40 題題庫（4 組各 10 題）請勿任意改動結構
   ============================ */
const ALL_QUESTIONS = [
  // --- 密集訊息騷擾（10 題） ---
  {
    question: "少年法院依《少年事件處理法》第 26 條責付時，對於密集訊息騷擾的少年，可以下達何種禁止行為的命令？",
    options: ["禁止少年在校園內使用手機", "禁止對被害人或其家屬為恐嚇、騷擾、接觸、跟蹤之行為", "禁止少年參與任何校外活動", "禁止少年與任何朋友交談"],
    correctAnswerIndex: 1
  },
  {
    question: "若密集訊息騷擾的行為嚴重到違反《跟蹤騷擾防制法》或構成強制罪，依《少年事件處理法》第 3 條，此事件應由哪個機關處理？",
    options: ["學校訓導處", "家長會", "少年法院", "當地里辦公室"],
    correctAnswerIndex: 2
  },
  {
    question: "《少年事件處理法》中規定，少年法院在正式審理事件後，應以裁定諭知四種類型的保護處分。下列何者不是這四種保護處分之一？",
    options: ["交付保護管束", "支付高額罰金給國庫", "訓誡並得予以假日生活輔導", "令入感化教育處所施以感化教育"],
    correctAnswerIndex: 1
  },
  {
    question: "依據第 42 條，保護處分中的『交付安置於適當機構輔導』，目的是什麼？",
    options: ["懲罰少年並限制其自由", "提供更專業的福利、教養或醫療輔導", "讓少年離開家庭自行生活", "強制少年參與勞動服務"],
    correctAnswerIndex: 1
  },
  {
    question: "若密集訊息騷擾事件情節輕微，少年法院依第 29 條第 1 項裁定不付審理時，下列哪一項是可對少年採取的處分？",
    options: ["將少年姓名公開於媒體", "交付少年之法定代理人或現在保護少年之人嚴加管教", "強制少年賠償十萬元以上", "強制轉介到少年監獄"],
    correctAnswerIndex: 1
  },
  {
    question: "在少年司法中，對於密集訊息騷擾這種造成精神壓力的行為，法院會優先考量以哪種方式進行處遇？",
    options: ["威嚇懲罰", "輔導教育", "經濟制裁", "終身隔離"],
    correctAnswerIndex: 1
  },
  {
    question: "當少年事件被轉介到少年法院時，最先進行工作，負責客觀事實調查、評估少年狀況的是誰？",
    options: ["法官", "少年調查官", "檢察官", "學校導師"],
    correctAnswerIndex: 1
  },
  {
    question: "如果少年被法院裁定『保護管束』處分，代表他必須定期接受誰的輔導與監督？",
    options: ["學校老師", "少年保護官", "社工人員", "少年之法定代理人"],
    correctAnswerIndex: 1
  },
  {
    question: "根據第 29 條第 1 項，少年法院若裁定不付審理，下列哪一項處分屬於由社會福利系統或專業機構執行的？",
    options: ["告誡", "轉介福利、教養機構等為適當之輔導", "交付嚴加管教", "訓誡"],
    correctAnswerIndex: 1
  },
  {
    question: "第 26 條中，法院裁定責付時，命少年遵守事項的目的是什麼？",
    options: ["懲罰少年過去的行為", "保護被害人或其家屬，並保障少年健全自我成長", "確保少年不會翹課", "強制少年必須搬家"],
    correctAnswerIndex: 1
  },

  // --- 威脅取財（10 題） ---
  {
    question: "少年以威脅方式向他人取財，依《少年事件處理法》第 3 條，此行為最可能構成刑法上的哪一類行為？",
    options: ["單純的借貸行為", "觸犯刑罰法律之行為（如恐嚇取財罪）", "校園惡作劇", "單純民事糾紛"],
    correctAnswerIndex: 1
  },
  {
    question: "威脅取財行為，如涉及對被害人或其家屬的『財產實施危害』，少年法院依第 26 條責付時，可以下達何種強制命令？",
    options: ["禁止少年在校園內活動", "禁止少年對被害人或其家屬的身體或財產實施危害", "要求少年向法院繳納保證金", "限制少年在夜間的門禁時間"],
    correctAnswerIndex: 1
  },
  {
    question: "少年法院審理威脅取財事件後，依第 42 條所諭知下列何者不屬於保護處分的類型？",
    options: ["訓誡，並得予以假日生活輔導", "交付成年法院進行刑事審判", "交付安置於適當機構輔導", "令入感化教育處所施以感化教育"],
    correctAnswerIndex: 1
  },
  {
    question: "對於情節輕微的威脅取財事件，少年法院經調查官調查後，可依第 29 條第 1 項裁定不付審理，下列哪一項是此裁定可搭配的處分？",
    options: ["強制進行高強度體能訓練", "轉介福利、教養機構等為適當之輔導", "要求少年公開道歉並登報", "禁止少年未來從事任何商業活動"],
    correctAnswerIndex: 1
  },
  {
    question: "影片中提及，少年事件處遇的目的是什麼？",
    options: ["提高少年的刑責", "以教育輔導取代懲罰，保障少年健全自我成長", "僅注重被害人的經濟賠償", "強制少年改變職業志向"],
    correctAnswerIndex: 1
  },
  {
    question: "威脅取財事件的少年如果被交付『保護管束』，通常會由誰來定期給予輔導與監督？",
    options: ["少年法院院長", "少年保護官", "學校的教官", "被害人的律師"],
    correctAnswerIndex: 1
  },
  {
    question: "根據第 29 條第 1 項，不付審理處分中的『交付少年之法定代理人或現在保護少年之人嚴加管教』，這屬於哪一類性質的處分？",
    options: ["交由司法機關管轄", "交由家庭或監護人執行", "交由學校老師執行", "交由警察機關執行"],
    correctAnswerIndex: 1
  },
  {
    question: "少年法院依第 42 條諭知『假日生活輔導』處分，通常會搭配下列哪一項處分？",
    options: ["交付保護管束", "感化教育", "訓誡", "轉介醫療機構"],
    correctAnswerIndex: 2
  },
  {
    question: "少年法院處理少年事件時，從事件發生到裁定處分，第一個階段的工作是？",
    options: ["立即判決", "少年調查官進行調查和評估", "直接實施感化教育", "將案件轉交檢察署"],
    correctAnswerIndex: 1
  },
  {
    question: "在少年事件中，『感化教育』通常被視為對少年所作出的哪一種性質的處分？",
    options: ["最輕微的告誡", "最嚴厲的教育輔導手段", "臨時性的安置措施", "家庭親職教育的替代方案"],
    correctAnswerIndex: 1
  },

  // --- 網路散布謠言（10 題） ---
  {
    question: "少年在網路上散布謠言造成他人名譽受損，依《少年事件處理法》第 3 條，該行為最可能被歸類為下列哪一項？",
    options: ["單純言論自由的範疇", "觸犯刑罰法律之行為", "網路文化，不具法律效力", "僅由網路平台業者處理的民事糾紛"],
    correctAnswerIndex: 1
  },
  {
    question: "依據《少年事件處理法》第 83 條，媒體、資訊或公示方式不得揭示哪類資訊，以保護涉案少年？",
    options: ["少年法院的地址", "足以知悉其人為該保護事件受調查之少年的記事或照片", "法院裁定的結果", "少年案件的審理日期"],
    correctAnswerIndex: 1
  },
  {
    question: "少年法院審理網路散布謠言事件後，依第 42 條諭知保護處分時，下列哪一項不屬於保護處分的類型？",
    options: ["交付安置輔導", "限制少年終身不得使用網路", "交付保護管束", "令入感化教育處所施以感化教育"],
    correctAnswerIndex: 1
  },
  {
    question: "在少年散布謠言事件中，如果情節輕微，法院依第 29 條第 1 項裁定不付審理，可以同時為下列哪種處分？",
    options: ["強制進行心理治療", "告誡", "立即罰款新臺幣五萬元", "公開少年姓名警示"],
    correctAnswerIndex: 1
  },
  {
    question: "網路散布謠言對被害人名譽造成損害，法院依第 29 條第 3 項促成修復時，下列哪一項是少年可能被命負起的責任？",
    options: ["免費幫被害人工作一年", "對被害人之損害負賠償責任", "撰寫一篇學術論文", "永久關閉所有社群媒體帳號"],
    correctAnswerIndex: 1
  },
  {
    question: "影片中提到，處理少年事件時，應優先考量哪個核心原則？",
    options: ["以懲罰少年為唯一目的", "保障少年健全自我成長，同時兼顧公共利益", "僅注重被害人的經濟賠償", "強制要求少年改變職業志向"],
    correctAnswerIndex: 1
  },
  {
    question: "少年在網路上的不當行為被認定為觸犯刑罰法律行為後，會由哪個單位來進行調查？",
    options: ["網路警察局的網安大隊", "學校的訓導處", "少年法院的少年調查官", "少年輔導委員會"],
    correctAnswerIndex: 2
  },
  {
    question: "依據第 29 條第 3 項的規定，少年法院在不付審理前轉介進行修復，必須獲得哪三方的同意？",
    options: ["少年、檢察官、法官", "少年、父母（法定代理人）、老師", "少年、少年之法定代理人、被害人", "少年、網路平臺管理者、學校"],
    correctAnswerIndex: 2
  },
  {
    question: "少年法院的『保護管束』處分，通常會搭配下列哪一種輔導措施？",
    options: ["每日強制打掃環境", "由保護官定期進行輔導晤談與追蹤", "限制少年出國旅遊", "強制要求少年從事高風險工作"],
    correctAnswerIndex: 1
  },
  {
    question: "少年法院在處理網路散布謠言事件時，如果決定不付審理，下列哪一個處分是交由少年家長執行的？",
    options: ["令入感化教育", "轉介醫療機構輔導", "交付少年之法定代理人或現在保護少年之人嚴加管教", "勞動服務"],
    correctAnswerIndex: 2
  },

  // --- 肢體推打（10 題） ---
  {
    question: "根據《少年事件處理法》第 3 條，少年肢體推打他人通常被歸類於下列哪一種行為？",
    options: ["無須處理的單純校園衝突", "觸犯刑罰法律之行為", "單純的情緒表達行為", "由學校自行處理的行政事件"],
    correctAnswerIndex: 1
  },
  {
    question: "少年法院依《少年事件處理法》第 42 條諭知保護處分時，不包括下列哪一項類型？",
    options: ["交付成年監獄施以懲罰", "訓誡，並得予以假日生活輔導", "交付保護管束並得命為勞動服務", "令入感化教育處所施以感化教育"],
    correctAnswerIndex: 0
  },
  {
    question: "少年法院在裁定責付少年時，如果事件涉及肢體推打或造成輕傷，法院依第 26 條可命少年遵守的事項是？",
    options: ["禁止對被害人或其家屬實施危害、恐嚇、騷擾等行為","禁止少年使用手機及電腦",  "強制轉學或休學", "強制少年賠償所有財產損失"],
    correctAnswerIndex: 0
  },
  {
    question: "根據第 29 條第 3 項，少年法院在不付審理裁定前，經當事人三方同意，可轉介進行修復，請問下列哪一項不是少年需對被害人做出的事項？",
    options: ["對被害人之損害負賠償責任", "立悔過書", "向被害人道歉", "終身避免接觸被害人"],
    correctAnswerIndex: 3
  },
  {
    question: "對於肢體推打這類情節輕微的少年事件，少年法院經調查後認為適當，可依第 29 條第 1 項裁定不付審理，並為下列何種處分？",
    options: ["強制送入感化教育", "告誡", "立即交付保護管束", "強制轉介醫療機構"],
    correctAnswerIndex: 1
  },
  {
    question: "若少年因肢體衝突致人輕傷，根據少年司法原則，法院會優先考慮下列哪一項處遇目標？",
    options: ["以最嚴厲的刑罰進行處罰", "只考慮被害人的感受和權益", "要求少年立即服兵役作為懲罰", "以保障少年健全自我成長為中心，同時兼顧公共利益"],
    correctAnswerIndex: 3
  },
  {
    question: "少年事件處理法中的『保護處分』，與刑法中的『刑罰』最主要的區別是什麼？",
    options: ["保護處分更注重經濟懲罰", "保護處分更注重輔導和教育，以取代威嚇性懲罰", "保護處分僅限於假日執行", "保護處分由警察而非法院決定"],
    correctAnswerIndex: 1
  },
  {
    question: "少年事件調查官在肢體推打事件中的主要職責是？",
    options: ["直接判決少年有罪或無罪", "進行客觀事實調查、評估少年狀況，並建議法院處遇方式", "僅負責對少年進行訓誡", "負責向被害人提供法律諮詢服務"],
    correctAnswerIndex: 1
  },
  {
    question: "根據少年法院審理的流程，第 42 條的保護處分是下列哪一個步驟的結果？",
    options: ["少年事件調查官調查前的處置", "少年法院審理事件後對少年做出的裁定", "少年在學校被記過後的懲罰", "警察機關將案件移送法院的步驟"],
    correctAnswerIndex: 1
  },
  {
    question: "在少年事件的修復程序中（第 29 條第 3 項），若要進行和解或賠償，必須獲得哪三方的同意？",
    options: ["少年、警察、老師", "少年、少年之法定代理人、被害人", "法官、檢察官、律師", "少年、輔導老師、學校校長"],
    correctAnswerIndex: 1
  }
];

/* ============================
   2) 設定與常用變數
   ============================ */
const PASS_THRESHOLD = 6; // 60 分門檻（10 題中的 6 題）
const TOTAL_QUESTIONS_PER_QUIZ = 10;

const container = document.getElementById('quiz-container');
const submitBtn = document.getElementById('submit-btn');
const reviewBtn = document.getElementById('review-btn');
const retryBtn = document.getElementById('retry-btn');
const resultEl = document.getElementById('result');
const nextLink = document.getElementById('next-link');

const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayMessage = document.getElementById('overlay-message');
const overlayOk = document.getElementById('overlay-ok');

/* 內部狀態 */
let currentQuiz = []; // 10 題（亂選）
let shuffledQuestions = []; // 此次 quiz 的題目（亂序）
let preparedQuestions = []; // 附帶 answer 屬性
let lastGrade = null;

/* ============================
   3) 工具與渲染函數
   ============================ */
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function prepareQuestions(qs) {
  return qs.map(q => ({ ...q, answer: q.options[q.correctAnswerIndex] }));
}

function pickRandomTenFromForty() {
  const pool = shuffleArray(ALL_QUESTIONS);
  return pool.slice(0, TOTAL_QUESTIONS_PER_QUIZ);
}

function renderQuiz() {
  // pick 10 題
  currentQuiz = pickRandomTenFromForty();
  preparedQuestions = prepareQuestions(currentQuiz);
  shuffledQuestions = shuffleArray(preparedQuestions);

  container.innerHTML = '';
  shuffledQuestions.forEach((q, i) => {
    const div = document.createElement('div');
    div.className = 'question-block';
    div.id = `qblock-${i}`;
    div.innerHTML = `<p><strong>${i + 1}. ${q.question}</strong></p>`;
    // 選項也亂序（但 answer 屬性仍是正確文字）
    const opts = shuffleArray(q.options);
    opts.forEach(opt => {
      const safe = opt.replace(/"/g, '&quot;');
      div.innerHTML += `
        <label class="option">
          <input type="radio" name="q${i}" value="${safe}">
          ${opt}
        </label>`;
    });
    container.appendChild(div);
  });

  // reset UI
  resultEl.classList.add('hidden');
  reviewBtn.classList.add('hidden');
  retryBtn.classList.add('hidden');
  nextLink.classList.add('hidden');
  submitBtn.disabled = false;
  submitBtn.querySelector('.default-text') && (submitBtn.querySelector('.default-text').textContent = '提交答案');
  lastGrade = null;
}

/* 檢查是否都作答 */
function allAnswered() {
  return shuffledQuestions.every((_, i) => !!document.querySelector(`input[name="q${i}"]:checked`));
}

/* 評分 */
function grade() {
  let score = 0;
  const details = [];

  shuffledQuestions.forEach((q, i) => {
    const sel = document.querySelector(`input[name="q${i}"]:checked`);
    const user = sel ? sel.value : null;
    const ok = user === q.answer;
    if (ok) score++;
    details.push({ index: i, selected: user, correct: q.answer, ok });
  });

  return { score, details };
}

/* 顯示結果區塊與按鈕 */
function showResult(g) {
  lastGrade = g;
  const passed = g.score >= PASS_THRESHOLD;
  resultEl.className = 'result ' + (passed ? 'pass' : 'fail');
  resultEl.innerHTML = `你答對 ${g.score} 題（共 ${shuffledQuestions.length} 題）。`;
  resultEl.classList.remove('hidden');

  // 顯示檢視、重試、下一步視情況
  reviewBtn.classList.remove('hidden');
  retryBtn.classList.toggle('hidden', passed); // 過關就隱藏重新作答
  nextLink.classList.toggle('hidden', !passed);

  // 如果過關，存標記（讓 form.html 可以讀取）
  if (passed) {
    localStorage.setItem('quizPassed', 'true');
    // 也可以把分數存起來
    localStorage.setItem('quizScore', String(g.score));
  } else {
    localStorage.removeItem('quizPassed');
    localStorage.setItem('quizScore', String(g.score));
  }
}

/* 顯示答案（詳細） */
function revealAnswers(details) {
  details.forEach(d => {
    const block = document.getElementById(`qblock-${d.index}`);
    if (!block) return;
    if (block.querySelector('.review-msg')) return; // 避免重複
    const msg = document.createElement('div');
    msg.className = d.ok ? 'correct small review-msg' : 'incorrect small review-msg';
    msg.textContent = d.ok ? '你的答案正確' : `你的答案：${d.selected ?? '未作答'}；正確答案：${d.correct}`;
    block.appendChild(msg);
  });
}

/* 重置並重新出題 */
function resetQuizAndRender() {
  // 清除先前提示
  document.querySelectorAll('.review-msg').forEach(el => el.remove());
  resultEl.classList.add('hidden');
  reviewBtn.classList.add('hidden');
  retryBtn.classList.add('hidden');
  nextLink.classList.add('hidden');
  submitBtn.disabled = false;
  renderQuiz();
}

/* ============================
   4) 遮罩 / modal 行為（提交期間與結果確認）
   ============================ */
function showOverlay(message, showOk = false, okText = '確定') {
  overlayTitle.textContent = '處理中…';
  overlayMessage.textContent = message;
  overlay.classList.remove('hidden');
  overlay.setAttribute('aria-hidden', 'false');

  // 顯示或隱藏 OK 按鈕
  if (showOk) {
    overlayOk.classList.remove('hidden');
    overlayOk.querySelector('.default-text') && (overlayOk.querySelector('.default-text').textContent = okText);
  } else {
    overlayOk.classList.add('hidden');
  }
}

function hideOverlay() {
  overlay.classList.add('hidden');
  overlay.setAttribute('aria-hidden', 'true');
}

/* overlay OK 被點擊後，收起遮罩（等待使用者確認） */
overlayOk.addEventListener('click', function () {
  hideOverlay();
});

/* ============================
   5) 事件綁定（按鈕互動）
   ============================ */
submitBtn.addEventListener('click', function () {
  if (!allAnswered()) {
    if (!confirm('尚未完成作答，仍要提交？')) return;
  }

  // 防止重複送出、鎖住所有輸入
  submitBtn.disabled = true;
  submitBtn.querySelector('.default-text') && (submitBtn.querySelector('.default-text').textContent = '提交中...');
  // 鎖住 radio（防止在評分期間變更）
  document.querySelectorAll('input[type="radio"]').forEach(r => r.disabled = true);

  // 顯示遮罩（處理中）
  showOverlay('系統正在評分中，請稍候...', false);

  // 模擬短暫處理時間（實際不需要，但給使用者反饋）
  setTimeout(() => {
    const g = grade();
    showResult(g);

    // 顯示結果的 overlay，並讓使用者按 OK 確認（確認後關遮罩）
    const passed = g.score >= PASS_THRESHOLD;
    showOverlay(passed ? `你已通過（${g.score} / ${shuffledQuestions.length}）。按「確定」前往下一步或檢視結果。` : `未通過（${g.score} / ${shuffledQuestions.length}），請檢視答案或重新作答。`, true, '我知道了');

    // 當使用者按 overlay OK 時關遮罩，但保留結果區塊與按鈕狀態
    overlayOk.onclick = function () {
      hideOverlay();
      // 如果未通過，開放重新作答與檢視
      if (g.score < PASS_THRESHOLD) {
        submitBtn.disabled = false;
        submitBtn.querySelector('.default-text') && (submitBtn.querySelector('.default-text').textContent = '提交答案');
      } else {
        // 過關後 nextLink 已顯示，submitBtn 保持 disabled（防止重複更改 localStorage）
        submitBtn.querySelector('.default-text') && (submitBtn.querySelector('.default-text').textContent = '已通過');
      }
    };

  }, 600); // short delay for UX
});

reviewBtn.addEventListener('click', function () {
  const g = lastGrade || grade();
  revealAnswers(g.details);
});

retryBtn.addEventListener('click', function () {
  // 重新作答：啟用 radio，重置按鈕狀態並出題
  document.querySelectorAll('input[type="radio"]').forEach(r => r.disabled = false);
  resetQuizAndRender();
});

/* nextLink 將使用 href 指向 form.html（HTML 中已設定） */
/* 但為了安全起見，在點擊前再確認是否通過 */
nextLink.addEventListener('click', function (e) {
  const passed = localStorage.getItem('quizPassed') === 'true';
  if (!passed) {
    e.preventDefault();
    alert('尚未達到通過標準，無法前往反思表單。');
  }
});

/* ============================
   6) 啟動
   ============================ */
renderQuiz();
