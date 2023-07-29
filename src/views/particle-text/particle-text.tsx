import React, {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ParticleTextProps, ParticleTextRef } from "./model";
import Controller from "./controller";
import { ControllerChangeHandler } from "./hooks/model";
import { CanvasEvents } from "./events";

const ParticleText = forwardRef<ParticleTextRef, ParticleTextProps>(
  function ParticleText(
    props: ParticleTextProps,
    ref: ForwardedRef<ParticleTextRef>
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [editor, setEditor] = useState<Controller | null>(null);

    /**
     * @summary BACKGROUND CANVAS
     */
    const [backgroundRef, setBackgroundRef] =
      useState<HTMLCanvasElement | null>(null);

    const getBackgroundRef = useCallback((element: HTMLCanvasElement) => {
      if (!element) return;
      element.style["touchAction"] = "none";
      setBackgroundRef(element);
    }, []);

    /**
     * @summary INTERACTION CANVAS
     */
    const [interactionCanvasRef, setInteractionCanvasRef] =
      useState<HTMLCanvasElement | null>(null);

    const getInteractionRef = useCallback((element: HTMLCanvasElement) => {
      if (!element) return;
      element.style["touchAction"] = "none";
      setInteractionCanvasRef(element);
    }, []);

    /**
     * @summary NEW EDITOR
     * @url https://github.com/ascorbic/react-artboard/blob/main/src/components/Artboard.tsx
     */
    useEffect(() => {
      if (!backgroundRef || !interactionCanvasRef) return;
      const editor = new Controller({
        backgroundLayer: backgroundRef,
        interactionLayer: interactionCanvasRef,
      });
      editor.setFps(props.fps || 60);
      setEditor(editor);

      return () => {
        editor.destroy();
      };
    }, [backgroundRef, interactionCanvasRef]);

    /**
     * @summary RESIZE EVENTS
     */
    useEffect(() => {
      const onResize = () => {
        if (containerRef.current && editor) {
          const dpr = window.devicePixelRatio;
          const rect = containerRef.current.getBoundingClientRect();
          editor.setSizes(rect.width, rect.height, dpr);
          editor.setScales(dpr, dpr);
          editor.render();
        }
      };
      // on init
      onResize();
      // on resize event
      window.addEventListener("resize", onResize);
      return () => {
        window.removeEventListener("resize", onResize);
      };
    }, [editor, props.width, props.height]);

    const removeWord = useCallback((word: string) => {
      console.log(word);
    }, []);

    /**
     * @summary CONTROLLER HANDLER
     */
    const [controllerChangeListeners, setControllerChangeListeners] = useState<
      ControllerChangeHandler[]
    >([]);

    const addControllerChangeListener = useCallback(
      (listener: ControllerChangeHandler) => {
        setControllerChangeListeners((listeners) => [...listeners, listener]);
      },
      []
    );

    const removeControllerChangeListener = useCallback(
      (listener: ControllerChangeHandler) => {
        if (!editor) return;
        editor.removeEventListener(CanvasEvents.CONTROLLER_EVENT, listener);
        setControllerChangeListeners((listeners) =>
          listeners.filter((l) => l !== listener)
        );
      },
      [editor]
    );

    useEffect(() => {
      if (!editor) return;

      controllerChangeListeners.forEach((listener) => {
        editor.addEventListener(CanvasEvents.CONTROLLER_EVENT, listener);
      });
      editor.emitControllerData();
      return () => {
        controllerChangeListeners.forEach((listener) => {
          editor?.removeEventListener(CanvasEvents.CONTROLLER_EVENT, listener);
        });
      };
    }, [editor, controllerChangeListeners]);

    useImperativeHandle(
      ref,
      () => ({
        removeWord,
        addControllerChangeListener,
        removeControllerChangeListener,
      }),
      [removeWord, addControllerChangeListener, removeControllerChangeListener]
    );

    return (
      <div
        ref={containerRef}
        tabIndex={-1}
        role="presentation"
        style={{ width: props.width, height: props.height, outline: "none" }}
      >
        <canvas
          ref={getBackgroundRef}
          style={{ position: "absolute", border: "1px solid #555555" }}
        />
        <canvas
          ref={getInteractionRef}
          style={{ position: "absolute", border: "1px solid #555555" }}
        />
      </div>
    );
  }
);

export default ParticleText;
