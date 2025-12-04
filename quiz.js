// ===============================
//     quiz.js（完整可運作）
// ===============================

// 👉 讀取 query.html 勾選的行為（包含 type）
const selected = JSON.parse(localStorage.getItem("selected_behaviors") || "[]");

// 若無選項 → 不允許進入
if (!selected || selected.length === 0) {
    alert("請先在查詢頁面勾選行為！");
    window.location.href = "query.html";
}

// 取得 questionType 清單
const selectedTypes = selected.map(b => parseInt(b.type));

// ===============================
//      題庫（你會放 40 題）
// ===============================

const allQuestions = [
    // ==== 以下為示範題，你要自己換成你的 40 題 ====
    {
        question: "在少年事件的修復程序中，若要進行和解或賠償，必須獲得哪三方的同意？",
        options: [
            "少年、警察、老師",
            "少年、少年之法定代理人、被害人",
            "法官、檢察官、律師",
            "少年、輔導老師、校長"
        ],
        correctAnswerIndex: 1,
        questionType: 1
    },
    {
        question: "散布不實謠言造成他人名譽受損，屬於哪一類型的行為？",
        options: ["肢體傷害", "網路散播誹謗", "恐嚇取財", "精神壓迫"],
        correctAnswerIndex: 1,
        questionType: 2
    },
    {
        question: "威脅取財屬於哪種法律類別？",
        options: ["肢體傷害", "名譽損害", "恐嚇取財", "精神騷擾"],
        correctAnswerIndex: 2,
        questionType: 3
    },
    {
        question: "持續以訊息騷擾他人，屬於哪類型的霸凌行為？",
        options: ["肢體傷害", "名譽損害", "恐嚇取財", "精神騷擾"],
        correctAnswerIndex: 3,
        questionType: 4
    }
    // ==== 你在此自行貼入全部 40 題 ====
];

// ======================================
//       依行為類型過濾題目
// ======================================

const filtered = allQuestions.filter(q => selectedTypes.includes(q.questionType));

if (filtered.length === 0) {
    alert("目前沒有對應您勾選行為的學習題目！");
    window.location.href = "query.html";
}

// ======================================
//         平均抽題：合計 10 題
// ======================================

function drawQuestionsEvenly() {
    let result = [];
    let perType = Math.ceil(10 / selectedTypes.length); // 每類平均抽題

    for (let type of selectedTypes) {
        let pool = filtered.filter(q => q.questionType === type);
        pool = shuffle(pool);
        result = result.concat(pool.slice(0, perType));

        if (result.length >= 10) break;
    }

    result = shuffle(result).slice(0, 10); // 最終保留 10 題
    return result;
}

// Fisher–Yates shuffle
function shuffle(array) {
    let a = array.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const quizQuestions = drawQuestionsEvenly();

// ======================================
//          顯示題目（10 題）
// ======================================

const quizContainer = document.getElementById("quiz-container");

function renderQuiz() {
    let html = "";

    quizQuestions.forEach((q, idx) => {
        html += `
            <div class="quiz-question">
                <h3>${idx + 1}. ${q.question}</h3>
                ${q.options.map((op, i) => `
                    <label class="option">
                        <input type="radio" name="q${idx}" value="${i}">
                        ${op}
                    </label>
                `).join("")}
            </div>
        `;
    });

    quizContainer.innerHTML = html;
}

renderQuiz();

// ======================================
//         送出、算分數
// ======================================

document.getElementById("submit-btn").addEventListener("click", function () {

    let score = 0;

    quizQuestions.forEach((q, idx) => {
        let selected = document.querySelector(`input[name="q${idx}"]:checked`);
        if (selected && parseInt(selected.value) === q.correctAnswerIndex) {
            score += 10; // 每題 10 分（10 題共 100 分）
        }
    });

    localStorage.setItem("quiz_score", score);

    if (score >= 60) {
        alert(`恭喜！您得分 ${score} 分，已達及格標準！`);
        window.location.href = "reflection.html";
    } else {
        alert(`您得分 ${score} 分，未達 60 分，請重新作答。`);
        window.location.reload();
    }
});
