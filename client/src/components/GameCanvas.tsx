// Physics Lab 3D style reminder: React is the frame, Babylon owns the full-screen stage.

import { useEffect, useRef } from "react";
import { Engine } from "@babylonjs/core/Engines/engine";
import { createGameScene, type GameHandle } from "@/game/scene";
import type { PhysicsParams, PhysicsSnapshot } from "@/game/experiments";

type GameCanvasProps = {
  params: PhysicsParams;
  running: boolean;
  demo?: boolean;
  resetToken: number;
  onSnapshot: (snapshot: PhysicsSnapshot) => void;
};

export default function GameCanvas({ params, running, demo = false, resetToken, onSnapshot }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startedRef = useRef(false);
  const handleRef = useRef<GameHandle | null>(null);
  const listenerRef = useRef(onSnapshot);
  listenerRef.current = onSnapshot;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || startedRef.current) return;
    startedRef.current = true;
    let disposed = false;
    const engine = new Engine(canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      adaptToDeviceRatio: true,
    });

    createGameScene(engine, canvas).then((handle) => {
      if (disposed) {
        handle.dispose();
        return;
      }
      handleRef.current = handle;
      handle.setSnapshotListener((snapshot) => listenerRef.current(snapshot));
      handle.setParameters(params);
      handle.setLoop(demo);
      handle.setRunning(running || demo);
      engine.runRenderLoop(() => handle.scene.render());
    });

    const onResize = () => engine.resize();
    window.addEventListener("resize", onResize);
    return () => {
      disposed = true;
      window.removeEventListener("resize", onResize);
      handleRef.current?.dispose();
      handleRef.current = null;
      engine.dispose();
      startedRef.current = false;
    };
  }, []);

  useEffect(() => {
    handleRef.current?.setParameters(params);
  }, [params.mass, params.angle, params.friction, params.length]);

  useEffect(() => {
    handleRef.current?.setRunning(running || demo);
  }, [running, demo]);

  useEffect(() => {
    if (resetToken === 0) return;
    handleRef.current?.reset();
    handleRef.current?.setParameters(params);
  }, [resetToken]);

  return <canvas ref={canvasRef} className="lab-canvas" aria-label="Physics Lab 3D interactive simulation" style={{ touchAction: "none" }} />;
}

