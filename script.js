// 確保網頁內容完全載入後才執行程式碼
document.addEventListener('DOMContentLoaded', function() {
    
    // 獲取按鈕和文字元素
    const button = document.getElementById('color-button');
    const demoText = document.getElementById('demo-text');
    
    // 定義一個顏色列表
    const colors = ['#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8'];
    let colorIndex = 0;
    
    // 為按鈕添加點擊事件監聽器
    button.addEventListener('click', function() {
        // 改變文字顏色
        demoText.style.color = colors[colorIndex];
        
        // 循環到下一個顏色
        colorIndex = (colorIndex + 1) % colors.length;
        
        // 改變文字內容
        demoText.textContent = `文字顏色已變更為：${demoText.style.color}`;
    });

});
