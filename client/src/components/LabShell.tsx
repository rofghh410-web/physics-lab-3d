// Physics Lab 3D style reminder: use asymmetric editorial panels, precise labels, and bilingual parity.

import { useMemo, useState } from "react";
import {
  Activity,
  BookOpen,
  ChevronRight,
  CircleGauge,
  FlaskConical,
  Globe2,
  Info,
  LockKeyhole,
  Move3d,
  Pause,
  Play,
  RotateCcw,
  Ruler,
  Sparkles,
  TimerReset,
} from "lucide-react";
import GameCanvas from "./GameCanvas";
import {
  bilingual,
  defaultPhysicsParams,
  rampExperiment,
  type Language,
  type PhysicsParams,
  type PhysicsSnapshot,
} from "@/game/experiments";

function number(value: number, digits = 2) {
  return value.toFixed(digits);
}

function signed(value: number, digits = 2) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(digits)}`;
}

export default function LabShell() {
  const demoMode = useMemo(() => new URLSearchParams(window.location.search).has("demo"), []);
  const [language, setLanguage] = useState<Language>("zh");
  const [params, setParams] = useState<PhysicsParams>(defaultPhysicsParams);
  const [snapshot, setSnapshot] = useState<PhysicsSnapshot>({
    time: 0,
    position: 0,
    velocity: 0,
    acceleration: 0,
    netForce: 0,
    normalForce: 0,
    frictionForce: 0,
    distance: 0,
    progress: 0,
    complete: false,
    blocked: false,
  });
  const [running, setRunning] = useState(demoMode);
  const [resetToken, setResetToken] = useState(0);
  const [step, setStep] = useState(0);

  const copy = (zh: string, en: string) => bilingual(language, { zh, en });
  const setParam = (key: keyof PhysicsParams, value: number) => setParams((current) => ({ ...current, [key]: value }));
  const reset = () => {
    setRunning(false);
    setResetToken((value) => value + 1);
    setSnapshot((current) => ({ ...current, time: 0, position: 0, velocity: 0, distance: 0, progress: 0, complete: false }));
  };

  const currentStep = rampExperiment.steps[step];
  const criticalFriction = Math.tan((params.angle * Math.PI) / 180);
  const observed = snapshot.blocked ? copy("靜止：摩擦抵銷了沿斜面方向的重力。", "REST: friction cancels gravity along the ramp.") : snapshot.complete ? copy("完成一次下滑測量。", "One descent measurement complete.") : running ? copy("正在取樣運動狀態。", "Sampling motion state.") : copy("準備開始觀察。", "Ready to observe.");

  return (
    <main className="lab-app">
      <div className="lab-skyline" aria-hidden="true" />
      <div className="lab-grain" aria-hidden="true" />
      <GameCanvas params={params} running={running} demo={demoMode} resetToken={resetToken} onSnapshot={setSnapshot} />

      <header className="lab-header">
        <div className="brand-lockup">
          <div className="brand-symbol" aria-hidden="true">
            <span className="brand-symbol-arc" />
            <span className="brand-symbol-point" />
            <img className="brand-mark-source" src="/manus-storage/physics-lab-mark_b485d841.png" alt="" />
          </div>
          <div>
            <div className="brand-name">PHYSICS LAB <span>3D</span></div>
            <div className="brand-kicker">雙語物理實驗室 / BILINGUAL PHYSICS LAB</div>
          </div>
        </div>
        <div className="header-actions">
          <div className="unit-chip"><span className="chip-dot" /> SI UNIT SYSTEM</div>
          <button className="lang-toggle" onClick={() => setLanguage((value) => (value === "zh" ? "en" : "zh"))} aria-label="Switch language">
            <Globe2 size={14} /> <span className={language === "zh" ? "active" : ""}>中</span><span className="lang-slash">/</span><span className={language === "en" ? "active" : ""}>EN</span>
          </button>
          <button className="icon-button" onClick={reset} aria-label={copy("重置實驗", "Reset experiment")}><RotateCcw size={16} /></button>
        </div>
      </header>

      <aside className="lab-index panel-surface">
        <div className="panel-label"><span>EXPERIMENT INDEX</span><span className="panel-rule" /></div>
        <div className="index-heading">
          <span className="chapter-number">01</span>
          <div><h1>{copy("運動與力", "Motion & Force")}</h1><p>{copy("把公式放進空間裡", "Put the formula in space")}</p></div>
        </div>
        <div className="index-list">
          <button className="index-item selected" onClick={() => setStep(0)}>
            <span className="index-item-number">01</span><span><strong>{copy("斜坡上的球", "Ball on a Ramp")}</strong><small>{copy("位移與加速度", "Position & acceleration")}</small></span><ChevronRight size={15} />
          </button>
          <button className="index-item muted" onClick={() => setStep(1)}>
            <span className="index-item-number">02</span><span><strong>{copy("摩擦的臨界點", "Friction Threshold")}</strong><small>{copy("穩定與滑動", "Stability & sliding")}</small></span><LockKeyhole size={13} />
          </button>
          <button className="index-item muted" onClick={() => setStep(2)}>
            <span className="index-item-number">03</span><span><strong>{copy("向量拆解", "Vector Breakdown")}</strong><small>{copy("方向與合力", "Direction & net force")}</small></span><LockKeyhole size={13} />
          </button>
        </div>
        <div className="index-footer">
          <div className="progress-meta"><span>{copy("章節進度", "CHAPTER PROGRESS")}</span><span>1 / 3</span></div>
          <div className="progress-line"><span /></div>
          <p>{copy("完成本次測量以解鎖下一張實驗卡。", "Complete this measurement to unlock the next experiment card.")}</p>
        </div>
      </aside>

      <section className="stage-caption">
        <div className="caption-eyebrow"><span className="live-dot" /> {copy("即時實驗舞台", "LIVE EXPERIMENT STAGE")}</div>
        <div className="caption-title">{copy("斜坡上的球", "BALL ON A RAMP")}</div>
        <div className="caption-subtitle">{copy("觀察重力如何變成加速度", "WATCH GRAVITY BECOME ACCELERATION")}</div>
      </section>

      <div className="stage-annotation annotation-force"><span className="annotation-symbol amber">F↓</span><div><strong>{copy("重力", "GRAVITY")}</strong><small>m × g</small></div></div>
      <div className="stage-annotation annotation-velocity"><span className="annotation-symbol cobalt">v→</span><div><strong>{copy("速度向量", "VELOCITY VECTOR")}</strong><small>dx / dt</small></div></div>
      <div className="stage-annotation annotation-angle"><span className="angle-arc" /><strong>θ = {params.angle}°</strong><small>{copy("斜面角度", "INCLINE")}</small></div>
      <div className="stage-annotation annotation-equation"><span>a = g (sin θ − μ cos θ)</span><small>{copy("沿斜面方向的加速度", "along-slope acceleration")}</small></div>
      <div className="trajectory-tag"><span className="trajectory-line" /> x(t) / {copy("運動軌跡", "TRAJECTORY")}</div>

      <aside className="lab-readout panel-surface">
        <div className="panel-label"><span>MEASUREMENT / 量測</span><span className="panel-rule" /></div>
        <div className="readout-object"><span className="object-dot" /><div><strong>{copy("測試質量", "TEST MASS")}</strong><small>{copy("鋼球 · 斜面運動", "Steel sphere · inclined motion")}</small></div><Move3d size={17} /></div>

        <div className="readout-section">
          <div className="section-title"><span>{copy("實驗參數", "EXPERIMENT PARAMETERS")}</span><Info size={13} /></div>
          <label className="measure-control"><span><b>{copy("質量", "MASS")}</b><em>m</em></span><strong>{number(params.mass, 1)} <small>kg</small></strong><input type="range" min="0.5" max="5" step="0.1" value={params.mass} onChange={(event) => setParam("mass", Number(event.target.value))} /></label>
          <label className="measure-control"><span><b>{copy("斜坡角度", "INCLINE ANGLE")}</b><em>θ</em></span><strong>{number(params.angle, 0)} <small>°</small></strong><input type="range" min="5" max="42" step="1" value={params.angle} onChange={(event) => setParam("angle", Number(event.target.value))} /></label>
          <label className="measure-control"><span><b>{copy("摩擦係數", "FRICTION")}</b><em>μ</em></span><strong>{number(params.friction, 2)}</strong><input type="range" min="0" max="0.6" step="0.01" value={params.friction} onChange={(event) => setParam("friction", Number(event.target.value))} /></label>
        </div>

        <div className="readout-section formula-section">
          <div className="section-title"><span>{copy("模型讀數", "MODEL READOUT")}</span><CircleGauge size={13} /></div>
          <div className="formula">a = g (sin θ − μ cos θ)</div>
          <div className="readout-grid">
            <div><span>{copy("時間", "TIME")}</span><strong>{number(snapshot.time, 2)}<small>s</small></strong></div>
            <div><span>{copy("位移", "POSITION")}</span><strong>{number(snapshot.position, 2)}<small>m</small></strong></div>
            <div><span>{copy("速度", "VELOCITY")}</span><strong className="cobalt-text">{number(snapshot.velocity, 2)}<small>m/s</small></strong></div>
            <div><span>{copy("加速度", "ACCELERATION")}</span><strong className="mint-text">{number(snapshot.acceleration, 2)}<small>m/s²</small></strong></div>
          </div>
        </div>

        <div className={`status-note ${snapshot.blocked ? "warning" : ""}`}><span className="status-icon">{snapshot.blocked ? "!" : "i"}</span><span>{observed}</span></div>
      </aside>

      <section className="observation-note panel-surface">
        <div className="note-rail"><Sparkles size={15} /><span>FIELD NOTE</span><span className="note-line" /></div>
        <div className="note-content"><div className="note-kicker">{bilingual(language, currentStep.eyebrow)}</div><h2>{bilingual(language, currentStep.title)}</h2><p>{bilingual(language, currentStep.copy)}</p></div>
        <div className="note-actions"><button className="text-button" onClick={() => setStep((value) => (value + 1) % rampExperiment.steps.length)}>{copy("下一則邊註", "Next field note")} <ChevronRight size={16} /></button></div>
      </section>

      <footer className="lab-controls panel-surface">
        <div className="control-context"><span className="control-index">{rampExperiment.number}</span><div><strong>{copy("斜面運動試次", "INCLINE MOTION TRIAL")}</strong><small>{copy("固定時間步長 · 即時向量", "Fixed timestep · live vectors")}</small></div></div>
        <div className="control-actions"><button className="play-button" onClick={() => setRunning((value) => !value)}>{running ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}<span>{running ? copy("暫停", "PAUSE") : copy("開始觀察", "OBSERVE")}</span></button><button className="reset-button" onClick={reset}><TimerReset size={16} /><span>{copy("重新試驗", "RESET TRIAL")}</span></button></div>
        <div className="control-legend"><div><i className="legend-dot cobalt" />{copy("速度向量", "velocity")}</div><div><i className="legend-dot amber" />{copy("重力", "gravity")}</div><div><i className="legend-dot mint" />{copy("加速度", "acceleration")}</div></div>
      </footer>

      <div className="camera-hint"><BookOpen size={13} /> {copy("拖曳畫布旋轉視角 · 滑輪縮放", "Drag canvas to orbit · wheel to zoom")}</div>
      <div className="version-stamp"><FlaskConical size={12} /> PL-3D / 0.1.0 — {copy("研究版", "RESEARCH BUILD")}</div>
    </main>
  );
}
