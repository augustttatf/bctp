document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('search-button');
    const checkboxes = document.querySelectorAll('input[name="action"]');
    const initialMessage = document.getElementById('initial-message');
    const statuteResult = document.getElementById('statute-result');
    const caseResult = document.getElementById('case-result');

    // 模擬後端資料庫 (僅用於靜態原型展示)
    const mockResults = {
        'physical-minor': {
            statute: '刑法第 277 條 傷害罪',
            statuteSummary: '對人施以強暴傷害，可處三年以下有期徒刑、拘役或一萬元以下罰金。',
            caseSummary: '真實判例摘要：某國中生因肢體衝突造成同學輕傷，法院判決父母需負連帶賠償責任。',
            compensation: '民事判賠金額：新臺幣 8 萬元整。'
        },
        'verbal-reputation': {
            statute: '刑法第 309 條 公然侮辱罪 及 第 310 條 誹謗罪',
            statuteSummary: '公然侮辱或散布足以損害他人名譽之事項，可能構成刑事責任，並附帶民事賠償。',
            caseSummary: '真實判例摘要：某高職生在社群軟體上發布不實言論，造成同學名譽受損。',
            compensation: '民事判賠金額：新臺幣 5 萬元整。'
        }
        // ... 其他行為若未勾選，則不顯示
    };

    searchButton.addEventListener('click', function() {
        // 隱藏所有結果，準備顯示新的
        initialMessage.classList.add('hidden');
        statuteResult.classList.add('hidden');
        caseResult.classList.add('hidden');

        // 檢查被勾選的選項
        let selectedAction = null;
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                // 模擬：只取第一個勾選的選項來展示結果 (實際專案中會有多重判斷邏輯)
                selectedAction = checkbox.value;
            }
        });

        if (selectedAction && mockResults[selectedAction]) {
            const result = mockResults[selectedAction];
            
            // 填充並顯示法律條文卡片
            statuteResult.querySelector('.statute-title').textContent = result.statute;
            statuteResult.querySelector('.statute-summary').textContent = result.statuteSummary;
            statuteResult.classList.remove('hidden');

            // 填充並顯示判例卡片
            caseResult.querySelector('.case-summary').textContent = result.caseSummary;
            caseResult.querySelector('.case-compensation').textContent = result.compensation;
            caseResult.classList.remove('hidden');

        } else {
            // 如果沒有勾選，則顯示提示訊息
            initialMessage.classList.remove('hidden');
            initialMessage.querySelector('p').textContent = '請至少勾選一個行為來查看後果警示。';
        }
    });
});
