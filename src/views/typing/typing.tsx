import React, {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Controller from "./controller";
import { CanvasEvents } from "./events";
import {
  CanvasDataChangeHandler,
  ControllerChangeHandler,
  Phase,
  TypingProps,
  TypingRef,
} from "./model";

const Typing = forwardRef<TypingRef, TypingProps>(function Typing(
  props: TypingProps,
  ref: ForwardedRef<TypingRef>
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<Controller | null>(null);

  /**
   * @summary BACKGROUND CANVAS
   */
  const [backgroundRef, setBackgroundRef] = useState<HTMLCanvasElement | null>(
    null
  );

  const getBackgroundRef = useCallback((element: HTMLCanvasElement) => {
    if (!element) return;
    element.style["touchAction"] = "none";
    setBackgroundRef(element);
  }, []);

  /**
   * @summary DATA CANVAS
   */
  const [dataCanvasRef, setDataCanvasRef] = useState<HTMLCanvasElement | null>(
    null
  );

  const getDataRef = useCallback((element: HTMLCanvasElement) => {
    if (!element) return;
    element.style["touchAction"] = "none";
    setDataCanvasRef(element);
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
    if (!backgroundRef || !dataCanvasRef || !interactionCanvasRef) return;
    const editor = new Controller({
      backgroundLayer: backgroundRef,
      dataLayer: dataCanvasRef,
      interactionLayer: interactionCanvasRef,
      initData: props.initData,
    });
    editor.setFps(props.fps || 60);
    editor.setIsPlaying(Phase.PAUSED);
    setEditor(editor);

    return () => {
      editor.destroy();
    };
  }, [backgroundRef, dataCanvasRef, interactionCanvasRef]);

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
        editor.renderAll();
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

  /**
   * @summary CANVAS EVENTS
   * @alert not for use now but may have to use if panning & zoom in is allowed, we have to manually block it
   */
  const [canvasElementEventListeners, setCanvasElementEventListeners] =
    useState<
      Array<{
        type: string;
        listener: EventListenerOrEventListenerObject;
      }>
    >([]);

  /**
   * @summary The below is to add event listeners directly to the canvas element
   * @example for mousemove, mousedown, mouseup, etc.
   */
  useEffect(() => {
    if (!editor) return;

    canvasElementEventListeners.forEach(({ type, listener }) => {
      const canvasElement = editor.getCanvasElement();
      canvasElement?.addEventListener(type, listener);
    });
    return () => {
      canvasElementEventListeners.forEach(({ type, listener }) => {
        const canvasElement = editor.getCanvasElement();
        canvasElement?.removeEventListener(type, listener);
      });
    };
  }, [editor, canvasElementEventListeners]);

  const addCanvasElementEventListener = useCallback(
    (type: string, listener: EventListenerOrEventListenerObject) => {
      setCanvasElementEventListeners((listeners) => [
        ...listeners,
        { type, listener },
      ]);
    },
    [editor]
  );

  const removeCanvasElementEventListener = useCallback(
    (type: string, listener: EventListenerOrEventListenerObject) => {
      if (!editor) {
        return;
      }
      const canvasElement = editor.getCanvasElement();
      canvasElement?.removeEventListener(type, listener);
      setCanvasElementEventListeners((listeners) =>
        listeners.filter((l) => l.type !== type && l.listener !== listener)
      );
    },
    [editor]
  );

  /**
   * @summary DATA HANDLER
   */
  const [dataChangeListeners, setDataChangeListeners] = useState<
    CanvasDataChangeHandler[]
  >([]);

  const addDataChangeListener = useCallback(
    (listener: CanvasDataChangeHandler) => {
      setDataChangeListeners((listeners) => [...listeners, listener]);
    },
    []
  );

  const removeDataChangeListener = useCallback(
    (listener: CanvasDataChangeHandler) => {
      if (!editor) return;
      editor.removeEventListener(CanvasEvents.DATA_CHANGE, listener);
      setDataChangeListeners((listeners) =>
        listeners.filter((l) => l !== listener)
      );
    },
    [editor]
  );

  useEffect(() => {
    if (!editor) return;

    dataChangeListeners.forEach((listener) => {
      editor.addEventListener(CanvasEvents.DATA_CHANGE, listener);
    });
    editor.emitCurrentData();
    return () => {
      dataChangeListeners.forEach((listener) => {
        editor?.removeEventListener(CanvasEvents.DATA_CHANGE, listener);
      });
    };
  }, [editor, dataChangeListeners]);

  const removeWord = useCallback(
    (word: string) => {
      editor?.removeWord(word);
    },
    [editor]
  );

  const addWord = useCallback(
    (word: string) => {
      editor?.addWord(word);
    },
    [editor]
  );

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

  const setIsPlaying = useCallback(
    (isPlaying: Phase) => {
      editor?.setIsPlaying(isPlaying);
    },
    [editor]
  );

  /**
   * @summary IMPERATIVE HANDLE - makes the ref used in the place that uses the FC component
   * We will make our TypingRef manipulatable with the following functions
   */
  useImperativeHandle(
    ref,
    () => ({
      // for useController
      addControllerChangeListener,
      removeControllerChangeListener,
      setIsPlaying,
      // for useData
      addWord,
      removeWord,
      addDataChangeListener,
      removeDataChangeListener,
      // for canvas element listener
      addCanvasElementEventListener,
      removeCanvasElementEventListener,
    }),
    [
      // for useController
      setIsPlaying,
      // for useData
      addWord,
      removeWord,
      addDataChangeListener,
      removeDataChangeListener,
      // for canvas element listener
      addCanvasElementEventListener,
      removeCanvasElementEventListener,
    ]
  );

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      style={{ width: props.width, height: props.height, outline: "none" }}
    >
      <canvas
        ref={getBackgroundRef}
        style={{ position: "absolute", border: "1px solid #555555" }}
      />
      <canvas
        ref={getDataRef}
        style={{ position: "absolute", border: "1px solid #555555" }}
      />
      <canvas
        ref={getInteractionRef}
        style={{ position: "absolute", border: "1px solid #555555" }}
      />
    </div>
  );
});

Typing.displayName = "TypingGame";

export default Typing;
