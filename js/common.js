// csvファイルの読み込み。文字コードはUTF-8であること。エクセルのデフォルトでcsvはshift-jisで出力されるので注意。
//一番上の行（列名）と一番左の列（id）は読み込まれない
function readCsv(path){
    // CSVファイルを取得
    let csv = new XMLHttpRequest();
    // CSVファイルへのパス
    csv.open("GET", path, false); 
    // csvファイル読み込み失敗時のエラー対応
    try {
      csv.send(null);
    } catch (err) {
      console.log(err);
    }
      
    // 配列を定義
    let csvArray = [];    
    // 改行ごとに配列化
    let lines = csv.responseText.split(/\r\n|\n/);    
    // 1行ごとに処理
    for (let i = 1; i < lines.length-1; ++i) {
      let cells = lines[i].split(",").slice(1);
      if (cells.length != 1) {
        csvArray.push(cells);
      }
    }
    return csvArray
}

//問題をランダムに選択
function selectQuestion(questionArray, numQuestion) {
  for (let i = questionArray.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questionArray[i], questionArray[j]] = [questionArray[j], questionArray[i]];
  }
  return questionArray.slice(0, numQuestion);
}   

//選択肢をシャッフル
function shuffle(answerArray) {
  for (let i = answerArray.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [answerArray[i], answerArray[j]] = [answerArray[j], answerArray[i]];
  }
  return answerArray;
}   

//選択肢をシャッフルして個数抽出
function shuffleSelect(answerText, wrongAnswerArray) {
    let selected = new Array(answerText)
    let filteredAnswer = wrongAnswerArray.filter(Boolean) // nullを削除
    selected = selected.concat(shuffle(filteredAnswer).slice(0, n_options))
    let set = new Set(selected) //重複削除
    let setArray = [...set].slice(0, n_options) 
    return shuffle(setArray)
}   

//ちょっと待たせる
function wait(time, func){
    const sleep = waitTime => new Promise( resolve => setTimeout(resolve, waitTime) );
    const aFunc = async function( ){
        await sleep( time );
        func()
    }
    aFunc()
} 

//正解の判定　マウス入力の場合
function checkAnswer(text){
    if(text === textQuestions[count][1]){
        score = score + 1
        results.push(1)
        correctAnswer()
        // alert("正解")
    }else{
        results.push(0)
        wrongAnswer()
        };
    //ちょっと待ってから次の問題表示
    wait(1000, nextQuestion)
}

//次の問題に問題送る。最後の問題になったらおしまいの表示
function nextQuestion(){
  count ++;
  quiz()
}

//全体の進行、次の問題送りか最後の結果発表かの切り替え
function branchNext(){
  if(count < n_questions-1){
      checkAnswer(this.textContent.slice(3))
  }else {
      if(this.textContent.slice(3) === textQuestions[count][1]){
          score = score + 1
          results.push(1)
      }
      count ++;
      finalResults()
  }
}

//正解の判定と進行　キー入力の場合
function keydownEvent(event){
  let overlay = document.getElementById('overlay');
  let pause = document.getElementById('pause');
  if(overlay.classList.value === 'overlay-event' && pause.classList.value === 'pause-event'){
    let hit
    if(event.key === "a" || event.key === "A"){
      hit = document.getElementById('op_a').textContent.slice(3);
    } else if(event.key === "b" || event.key === "B"){
      hit = document.getElementById('op_b').textContent.slice(3)
    } else if(event.key === "c" || event.key === "C"){
      hit = document.getElementById('op_c').textContent.slice(3)
    } else if(event.key === "d" || event.key === "D"){
      hit = document.getElementById('op_d').textContent.slice(3)
    }
  if(hit != undefined){
      if(count < n_questions-1){
          checkAnswer(hit)
      }else {
          if(hit === textQuestions[count][1]){
              score = score + 1
              results.push(1)
          }
          count ++;
          finalResults()
      }
    }
  }
}


//最後の結果発表
function finalResults(){
    document.getElementById("quiz-top").innerHTML =  "<div style = 'font-size :70px; font-weight: bold; text-align: center; '>結果発表！ </div>";
    document.getElementsByClassName("quiz-below")[0].innerHTML = ""
    document.getElementById("footer").innerHTML = ""
    PlaySound("./sound/Results.mp3") //効果音
    score = score * 100/n_questions
    wait(2100, results)
    function results (){
        if(score === 100){
        document.getElementsByClassName("quiz-below")[0].innerHTML = "<div class = 'results'>おめでとう！" + "<div class = 'score'>" 
            + Math.round(score) +" 点</div>"  + "<center>パーフェクト！！</div>" 
            + '<a href="index.html"><div class="btn_restart">はじめに戻る</div></a>'
        wait(600, function(){PlaySound("./sound/Perfect.mp3")} )
        }else if (score > 80){
        document.getElementsByClassName("quiz-below")[0].innerHTML = "<div class = 'results'>あなたの得点は" + "<div class = 'score'>" 
            + Math.round(score) +" 点</div>"  +"<center>よくできました！</div>"
            + '<a href="index.html"><div class="btn_restart">はじめに戻る</div></a>'
        }else if (score  > 50){
        document.getElementsByClassName("quiz-below")[0].innerHTML = "<div class = 'results'>あなたの得点" + "<div class = 'score'>" 
            + Math.round(score) +" 点</div>"  +"<center>がんばったね！</div>"
            + '<a href="index.html"><div class="btn_restart">はじめに戻る</div></a>'
            }else if (score > 25){
        document.getElementsByClassName("quiz-below")[0].innerHTML = "<div class = 'results'>あなたの得点は" + "<div class = 'score'>" 
            + Math.round(score) +" 点</div>"  +"<center>次もがんばってね！</div>"
            + '<a href="index.html"><div class="btn_restart">はじめに戻る</div></a>'
        }else{
        document.getElementsByClassName("quiz-below")[0].innerHTML = "<div class = 'results'>あなたの得点は" + "<div class = 'score'>" 
            + Math.round(score) +" 点</div>"  +"<center>また挑戦してね！</div>"
            + '<a href="index.html"><div class="btn_restart">はじめに戻る</div></a>'
        wait(700, function(){PlaySound("./sound/Zannen.mp3")} )
        }
      backToTop()
    }
}

//はじめに戻るのキー操作
function backToTop(){
  document.addEventListener("keydown", hitBackToTopEvent, false)
  let keys = [ "a" , "b", "c", "d", "A", "B", "C", "D", "Enter"]
  function hitBackToTopEvent(event){
    for(let key of keys){
      if(event.key === key){
      window.location.href = "./index.html";
      }
    }
  } 
}


//正解のときの丸表示オーバーレイ
function correctAnswer(){
    let overlay = document.getElementById('overlay');
    overlay.classList.toggle('overlay-on');
    const answerText = document.getElementById('answer');
    answerText.innerHTML = "<div style = 'font-size:50px'>正 解<br> <img src = './image/maru.png' width = 250px></div>"
    PlaySound("./sound/Correct_Answer.mp3") //効果音 
    closeOverlayEnter() 
}

//不正解のときのバツ表示オーバーレイ
function wrongAnswer(){
    let overlay= document.getElementById('overlay');
    overlay.classList.toggle('overlay-on');
    const answerText = document.getElementById('answer');
    answerText.innerHTML = "<div style = 'font-size:50px'>残 念 <br> <img src = './image/batsu.png' width = 250px> </div>"
    PlaySound("./sound/Wrong_Buzzer.mp3") //効果音
    closeOverlayEnter() 
}


//効果音を鳴らす
function PlaySound(mp3Path) {
    var audioElem = new Audio();
    audioElem.src = mp3Path;
    audioElem.play();
}

//クイズをやめる画面を出す
function pauseQuit(){
  document.addEventListener("keydown", hitEnterEvent, false)
  function hitEnterEvent(event){ 
    if(overlay.classList.value === 'overlay-event' && count < n_questions){
      if(event.key === 'Enter'){pause.classList.toggle('pause-on');}
    }
  }
  let quit_btn = document.getElementById('quit-btn')
  quit_btn.addEventListener('click', ()=>{pause.classList.toggle('pause-on')})

  //クイズをやめる画面でのキーでの選択
  document.addEventListener("keyup", quitOrResume, false)
  function quitOrResume(event){
    let overlay = document.getElementById('overlay');
    let pause = document.getElementById('pause');
    if(overlay.classList.value === 'overlay-event' && pause.classList.value === 'pause-event pause-on'){
      if(event.key === "a" || event.key === "A"){
        pause.classList.toggle('pause-on')
      } else if(event.key === "b" || event.key === "B"){
        wait(2000, () => window.location.href = "./index.html")
      } 
    }
  }
} 

//オーバーレイが出ているときエンターキーで閉じる
function closeOverlayEnter(){
    document.addEventListener("keyup", keydownEnter, false)
    function keydownEnter (event){
      if(overlay.classList.value === 'overlay-event overlay-on'){
      if(event.key === 'Enter'){overlay.classList.toggle('overlay-on');}
    }
  }   
}

// オーバレイを閉じる
document.addEventListener('DOMContentLoaded', function(){
  
  // オーバレイを開閉する関数
  const overlay = document.getElementById('overlay');
  
  function overlayToggle() {
    overlay.classList.toggle('overlay-on');
  }
  // 指定した要素に対して上記関数を実行するクリックイベントを設定
  const clickArea = document.getElementsByClassName('overlay-event');
  for(let i = 0; i < clickArea.length; i++) {
   clickArea[i].addEventListener('click', overlayToggle, false);
 }
  // イベントに対してバブリングを停止
  function stopEvent(event) {
    event.stopPropagation();
  }
  const overlayInner = document.getElementById('overlay-inner');
  overlayInner.addEventListener('click', stopEvent, false);
}, false);

// オーバレイを閉じる -Pause
document.addEventListener('DOMContentLoaded', function(){
  
  // オーバレイを開閉する関数
  const pause = document.getElementById('pause');
  
  function overlayToggle() {
    pause.classList.toggle('pause-on');
  }
  // 指定した要素に対して上記関数を実行するクリックイベントを設定
  const clickArea = document.getElementsByClassName('pause-event');
  for(let i = 0; i < clickArea.length; i++) {
   clickArea[i].addEventListener('click', overlayToggle, false);
 }
  // イベントに対してバブリングを停止
  function stopEvent(event) {
    event.stopPropagation();
  }
  const pauseInner = document.getElementById('pause-inner');
  pauseInner.addEventListener('click', stopEvent, false);
}, false);

