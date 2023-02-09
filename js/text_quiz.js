// 設定
var n_options = 4
var n_questions = 5

//初期設定
var score = 0
var count = 0
var results = []

//メインの関数
function quiz() {
    //問題表示
    //第X問
    document.getElementById("quiz-number").innerHTML = "第" + (count + 1) + "問"
    //問題
    document.getElementById("quiz-question").innerHTML = textQuestions[count][0];
    //選択肢をシャッフル
    var shuffled = shuffle(textQuestions[count].slice(1))
    //選択肢
    var abcd = ["A. ", "B. ", "C. ", "D. "]
    for (var n=1; n<=n_options; n++) {
         document.getElementsByClassName("quiz-option")[n-1].innerHTML = abcd[n-1] + shuffled[n-1] 
    };
    //クイズの中断
    pauseQuit()
    //選択と正解チェック
    let options = document.querySelectorAll('div.quiz-option');
    for (const option of options) {
        option.addEventListener('click', branchNext);
        }
    //キー入力での回答
    document.addEventListener("keydown", keydownEvent, false)
}