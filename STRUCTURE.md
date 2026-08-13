# Physics Lab 3D 架構

## 分層

React 只負責「畫框」：雙語控制面板、按鈕、量測欄與教學邊註。Babylon.js 負責「畫布」：相機、燈光、程序化實驗器材、向量、軌跡與渲染迴圈。`client/src/game/` 只放不依賴 React 的物理與場景類別。

## 目錄規劃

```text
client/
  src/
    App.tsx                     # React 畫框與頁面狀態
    index.css                   # 天窗物理劇場的全域視覺語言
    components/
      GameCanvas.tsx            # Babylon Engine / Scene 生命周期
      LabShell.tsx              # 雙語索引、量測、教學邊註
    game/
      scene.ts                  # createGameScene 與 GameHandle
      PhysicsWorld.ts            # 固定時間步長、重力與斜坡運動
      experiments.ts             # 實驗資料、雙語標籤與教學內容
      vectors.ts                 # 力、速度、加速度視覺化
      materials.ts               # 材質、背景與測量線
```

## 資料流

`LabShell` 持有選取實驗、語言、播放狀態與參數；`GameCanvas` 只接收可序列化的實驗設定，透過 callback 把模擬快照送回 React。`PhysicsWorld` 以固定步長更新狀態，產出 position、velocity、acceleration、normalForce 與 frictionForce；Babylon 場景把這些值映射成網格、向量與軌跡，React 只呈現數值與文字。

## 延伸邊界

新增實驗時，必須實作同一組 `ExperimentDefinition` 介面，不得把新的物理公式直接塞進 React 元件。之後可加入碰撞、彈簧、拋體與波動，但每個實驗都應提供重置方法、固定步長更新、量測快照與雙語教學任務。

