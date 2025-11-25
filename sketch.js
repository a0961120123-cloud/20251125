let spritesheet_walk; // 走路的精靈圖檔
let spritesheet_run; // 跑步的精靈圖檔
let spritesheet_jump; // 跳躍的精靈圖檔
let animation_walk = []; // 儲存走路動畫的每一格
let animation_run = []; // 儲存跑步動畫的每一格
let animation_jump = []; // 儲存跳躍動畫的每一格

// 走路動畫的參數
const spriteWidth_walk = 1246;
const spriteHeight_walk = 198;
const numFrames_walk = 9;
const frameWidth_walk = spriteWidth_walk / numFrames_walk;

// 跑步動畫的參數
const spriteWidth_run = 2323;
const spriteHeight_run = 168;
const numFrames_run = 12;
const frameWidth_run = spriteWidth_run / numFrames_run;

// 跳躍動畫的參數
const spriteWidth_jump = 829;
const spriteHeight_jump = 172;
const numFrames_jump = 6;
const frameWidth_jump = spriteWidth_jump / numFrames_jump;

let animationSpeed = 0.1; // 動畫播放速度

// 角色的屬性
let characterX;
let characterY;
let characterSpeed = 5; // 角色移動速度

// 跳躍相關的物理屬性
let isJumping = false; // 角色是否正在跳躍
let velocityY = 0; // Y軸上的速度
const gravity = 0.6; // 重力加速度
const jumpForce = -15; // 向上跳躍的初始力量
let groundY; // 地面的Y座標

// 在 setup() 執行前預先載入圖片資源
function preload() {
  // 載入走路和跑步的圖片
  spritesheet_walk = loadImage('走路/ALL1246198.png');
  spritesheet_run = loadImage('RUN/ALL2323168.png');
  spritesheet_jump = loadImage('跳/all829172.png');
}

function setup() {
  // 創建一個全螢幕的畫布
  createCanvas(windowWidth, windowHeight);

  // 初始化角色位置在畫布中央
  characterX = width / 2;
  characterY = height / 2;
  groundY = height / 2; // 設定地面高度為初始高度

  // 切割走路的 spritesheet
  for (let i = 0; i < numFrames_walk; i++) {
    let frame = spritesheet_walk.get(i * frameWidth_walk, 0, frameWidth_walk, spriteHeight_walk);
    animation_walk.push(frame);
  }

  // 切割跑步的 spritesheet
  for (let i = 0; i < numFrames_run; i++) {
    let frame = spritesheet_run.get(i * frameWidth_run, 0, frameWidth_run, spriteHeight_run);
    animation_run.push(frame);
  }

  // 切割跳躍的 spritesheet
  for (let i = 0; i < numFrames_jump; i++) {
    let frame = spritesheet_jump.get(i * frameWidth_jump, 0, frameWidth_jump, spriteHeight_jump);
    animation_jump.push(frame);
  }
}

function draw() {
  // 設定背景顏色
  background('#9a031e');

  // --- 跳躍物理更新 ---
  // 如果角色正在跳躍，就更新他的垂直位置
  if (isJumping) {
    velocityY += gravity; // 速度受重力影響
    characterY += velocityY; // 位置受速度影響

    // 如果角色落回或低於地面
    if (characterY >= groundY) {
      characterY = groundY; // 將角色固定在地面上
      isJumping = false; // 結束跳躍狀態
      velocityY = 0; // 重設垂直速度
    }
  }

  // 檢查鍵盤右方向鍵是否被按下
  if (keyIsDown(RIGHT_ARROW)) {
    // 更新角色X座標，使其向右移動
    characterX += characterSpeed;

    // 如果角色完全移出右邊界，就讓他從左邊界重新出現
    if (characterX - frameWidth_run / 2 > width) {
      characterX = -frameWidth_run / 2;
    }

    // 播放跑步動畫
    let frameIndex = floor(frameCount * animationSpeed) % numFrames_run;
    image(animation_run[frameIndex], characterX - frameWidth_run / 2, characterY - spriteHeight_run / 2);
  } else if (keyIsDown(LEFT_ARROW)) {
    // 更新角色X座標，使其向左移動
    characterX -= characterSpeed;

    // 如果角色完全移出左邊界，就讓他從右邊界重新出現
    if (characterX + frameWidth_run / 2 < 0) {
      characterX = width + frameWidth_run / 2;
    }

    // 播放跑步動畫 (向左翻轉)
    let frameIndex = floor(frameCount * animationSpeed) % numFrames_run;
    push(); // 保存當前的繪圖設置
    translate(characterX, characterY); // 將原點移動到角色位置
    scale(-1, 1); // 水平翻轉X軸
    image(animation_run[frameIndex], -frameWidth_run / 2, -spriteHeight_run / 2); // 在翻轉後的座標系上繪圖
    pop(); // 恢復原本的繪圖設置
  } else if (isJumping) {
    // 播放跳躍動畫
    let frameIndex = floor(frameCount * animationSpeed) % numFrames_jump;
    image(animation_jump[frameIndex], characterX - frameWidth_jump / 2, characterY - spriteHeight_jump / 2);
  }
  else {
    // 若無任何操作，則播放走路動畫 (待機)
    let frameIndex = floor(frameCount * animationSpeed) % numFrames_walk;
    image(animation_walk[frameIndex], characterX - frameWidth_walk / 2, characterY - spriteHeight_walk / 2);
  }
}

// // 禁用右鍵選單，這樣在畫布上按右鍵才不會跳出瀏覽器的選單 (已改為鍵盤控制，此行可選)
// document.oncontextmenu = function() {
//   return false;
// }

// 當瀏覽器視窗大小改變時，自動調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// 監聽鍵盤按下事件 (只觸發一次)
function keyPressed() {
  // 如果按下向上鍵且角色不在跳躍中
  if (keyCode === UP_ARROW && !isJumping) {
    isJumping = true; // 開始跳躍
    velocityY = jumpForce; // 給予向上的初始力量
  }
}
