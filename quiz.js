// =====================================================
//                 BCTP — quiz.js（最新修正版）
//       ✔ 對應 blablabla.json — questions[] & correctAnswerIndex
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    // -----------------------------------------------------
    // 1. 接收 query.html 傳來的行為類型
    // -----------------------------------------------------
    const selectedBehaviors = JSON.parse(localStorage.getItem("selectedBehaviors") || "[]");

    if (selectedBehaviors.length === 0) {
        alert("⚠ 未勾選行為標籤，請重新操作。");
        window.location.href = "query.html";
        return;
    }

    // 題庫 URL（你提供的格式）
    const QUIZ_URL = "https://raw.githubusercontent.com/augustttatf/bctp/refs/heads/main/blablabla.json";

    let quizData = [];            // 完整題庫
    let filtered = [];            // 按類型篩選後
    let selectedTypes = [];       // 1 / 2 / 3 / 4
    let quizQuestions = [];       // 最終抽出的 10 題
    let current = 0;              // 題目 index
    let score = 0;                // 分數

    const questionBox = document.getElementById("question-box");
    const nextBtn = document.getElementById("next-btn");


    // -----------------------------------------------------
    // 2. 工具：陣列亂數
    // -----------------------------------------------------
    function shuffle(arr) {
        return arr
            .map(v => [Math.random(), v])
            .sort((a, b) => a[0] - b[0])
            .map(v => v[1]);
    }


    // -----------------------------------------------------
    // 3. 按勾選行為平均抽題
    // -----------------------------------------------------
    function draw10QuestionsEvenly() {
        const NEED = 10;
        let result = [];

        let perType = Math.floor(NEED / selectedTypes.length);
        let remainder = NEED % selectedTypes.length;

        selectedTypes.forEach(type => {
            let pool = filtered.filter(q => q.questionType === type);
            pool = shuffle(pool);

            let take = perType;
            if (remainder > 0) {
                take++;
                remainder--;
            }

            if (pool.length <= take) {
                result.push(...pool);
            } else {
                result.push(...pool.slice(0, take));
            }
        });

        // 題目不足 → 用全部題目補滿
        if (result.length < NEED) {
            let extra = shuffle(filtered);
            for (let q of extra) {
                if (!result.includes(q)) {
                    result.push(q);
                    if (result.length >= NEED) break;
                }
            }
        }

        return shuffle(result).slice(0, NEED);
    }


    // -----------------------------------------------------
    // 4. 顯示題目
    // -----------------------------------------------------
    function renderQuestion() {
        const q = quizQuestions[current];

        questionBox.innerHTML = `
            <div class="quiz-card">
                <h2>第 ${current + 1} 題 / 共 ${quizQuestions.length} 題</h2>
                <p class="question-text">${q.question}</p>

                <div class="options">
                    ${q.options.map((opt, index) => `
                        <button class="option-btn" data-idx="${index}">${opt}</button>
                    `).join("")}
                </div>
            </div>
        `;

        document.querySelectorAll(".option-btn").forEach(btn => {
            btn.addEventListener("click", checkAnswer);
        });
    }


    // -----------------------------------------------------
    // 5. 檢查答案
    // -----------------------------------------------------
    function checkAnswer(e) {
        const userChoice = parseInt(e.target.dataset.idx);
        const correct = quizQuestions[current].correctAnswerIndex;

        // 顯示對錯
        if (userChoice === correct) {
            score++;
            e.target.classList.add("correct");
        } else {
            e.target.classList.add("wrong");
        }

        // 禁用全部按鈕
        document.querySelectorAll(".option-btn").forEach(b => b.disabled = true);

        nextBtn.style.display = "block";
    }


    // -----------------------------------------------------
    // 6. 下一題處理
    // -----------------------------------------------------
    nextBtn.addEventListener("click", () => {
        current++;
        nextBtn.style.display = "none";

        if (current >= quizQuestions.length) {
            showResult();
        } else {
            renderQuestion();
        }
    });


    // -----------------------------------------------------
    // 7. 顯示結果頁
    // -----------------------------------------------------
    function showResult() {
        questionBox.innerHTML = `
            <div class="quiz-result">
                <h2>✔ 完成測驗！</h2>
                <p>得分：<strong>${score} / ${quizQuestions.length}</strong></p>

                <button class="restart-btn" onclick="window.location.href='query.html'">
                    重新選擇行為
                </button>
            </div>
        `;
        nextBtn.style.display = "none";
    }


    // -----------------------------------------------------
    // 8. 初始化 → 載入題庫
    // -----------------------------------------------------
    async function init() {
        try {
            const res = await fetch(QUIZ_URL);
            const data = await res.json();

            quizData = data.questions || [];

            // query.html 存的 value 可能是 "physical-injury" → 所以用 data-type
            selectedTypes = selectedBehaviors
                .map(name => {
                    const match = name.match(/\d+/);
                    return match ? parseInt(match[0]) : null;
                })
                .filter(n => n !== null);

            filtered = quizData.filter(q => selectedTypes.includes(q.questionType));

            if (filtered.length === 0) {
                alert("⚠ 沒有符合此行為的測驗題，請重新選擇。");
                window.location.href = "query.html";
                return;
            }

            quizQuestions = draw10QuestionsEvenly();
            renderQuestion();

        } catch (err) {
            console.error(err);
            alert("❌ 測驗題載入失敗！");
        }
    }

    init();
});
