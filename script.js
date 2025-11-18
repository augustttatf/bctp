document.addEventListener('DOMContentLoaded', function() {
    // 檢查是否有查詢按鈕，確保程式碼只在 query.html 執行
    if (document.getElementById('search-button')) {
        const searchButton = document.getElementById('search-button');
        const checkboxes = document.querySelectorAll('input[name="action"]');
        const initialMessage = document.getElementById('initial-message');
        const statuteResult = document.getElementById('statute-result');
        const caseResult = document.getElementById('case-result');

        // 模擬後端資料庫 (核心目標：讓後果可預期、可查詢)
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
            },
            'extortion': {
                statute: '刑法第 346 條 恐嚇取財罪',
                statuteSummary: '意圖為自己或第三人不法之所有，以恐嚇危害安全之方法，得財產者，處六月以上五年以下有期徒刑。',
                caseSummary: '真實判例摘要：某學生團體長期威脅低年級同學交出零用錢，經家長報案後，少年法庭裁定保護管束。',
                compensation: '民事判賠金額：新臺幣 12 萬元整。'
            },
            'cyber-harassment': {
                statute: '民法第 184 條 侵權行為 及 少年事件處理法',
                statuteSummary: '持續性網路騷擾已構成侵害他人隱私與精神損害，家長需負擔連帶賠償責任，學生則依少事法處置。',
                caseSummary: '真實判例摘要：某國中生長期以訊息騷擾同學，導致同學憂鬱，法院判決父母賠償並要求學生接受輔導。',
                compensation: '民事判賠金額：新臺幣 7 萬元整。'
            }
        };

        searchButton.addEventListener('click', function() {
            // 隱藏所有結果，準備顯示新的
            initialMessage.classList.add('hidden');
            statuteResult.classList.add('hidden');
            caseResult.classList.add('hidden');

            let selectedAction = null;
            checkboxes.forEach(checkbox => {
                if (checkbox.checked && !selectedAction) {
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
                // 如果沒有勾選
                initialMessage.classList.remove('hidden');
                initialMessage.querySelector('p').textContent = '請至少勾選一個行為來查看後果警示。';
            }
        });
    }
});
