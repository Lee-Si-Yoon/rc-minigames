import React, {
  ForwardedRef,
  ReactElement,
  cloneElement,
  forwardRef,
  isValidElement,
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
  TimerChangeHandler,
  Level,
  Phase,
  TypingProps,
  TypingRef,
} from "./model";
import { TextProps } from "./text/text";

const Typing = forwardRef<TypingRef, TypingProps>(function Typing(
  props: TypingProps,
  ref: ForwardedRef<TypingRef>
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<Controller | null>(null);

  /**
   * @summary RENDER LAYER
   */
  const [renderCanvasRef, setRenderCanvasRef] =
    useState<HTMLCanvasElement | null>(null);

  const getRenderLayerRef = useCallback((element: HTMLCanvasElement) => {
    if (!element) return;
    element.style["touchAction"] = "none";
    setRenderCanvasRef(element);
  }, []);

  /**
   * @summary NEW EDITOR
   * @url https://github.com/ascorbic/react-artboard/blob/main/src/components/Artboard.tsx
   */
  useEffect(() => {
    if (!renderCanvasRef) return;
    const editor = new Controller({
      renderLayer: renderCanvasRef,
      initData: props.initData,
    });
    editor.setFps(props.fps || 60);
    editor.setIsPlaying(Phase.PAUSED);
    setEditor(editor);

    return () => {
      editor.destroy();
    };
  }, [renderCanvasRef]);

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
        editor.renderFrame();
      }
    };
    // on init
    onResize();
    // on resize event
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [editor, containerRef.current, props.width, props.height]);

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
    (textProps: Omit<TextProps, "ctx">) => {
      editor?.addWord(textProps);
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

  const setLevel = useCallback(
    (level: Level) => editor?.setLevel(level),
    [editor]
  );

  /**
   * @summary TIMER HANDLER
   */
  const [timerChangeListeners, setTimerChangeListeners] = useState<
    TimerChangeHandler[]
  >([]);

  const addTimerChangeListener = useCallback((listener: TimerChangeHandler) => {
    setTimerChangeListeners((listeners) => [...listeners, listener]);
  }, []);

  const removeTimerChangeListener = useCallback(
    (listener: TimerChangeHandler) => {
      if (!editor) return;
      editor.removeEventListener(CanvasEvents.TIMER_CHANGE, listener);
      setTimerChangeListeners((listeners) =>
        listeners.filter((l) => l !== listener)
      );
    },
    [editor]
  );

  useEffect(() => {
    if (!editor) return;

    timerChangeListeners.forEach((listener) => {
      editor.addEventListener(CanvasEvents.TIMER_CHANGE, listener);
    });
    editor.emitControllerData();
    return () => {
      timerChangeListeners.forEach((listener) => {
        editor?.removeEventListener(CanvasEvents.TIMER_CHANGE, listener);
      });
    };
  }, [editor, timerChangeListeners]);

  /**
   * @summary IMPERATIVE HANDLE - makes the ref used in the place that uses the FC component
   * We will make our TypingRef manipulatable with the following functions
   */
  useImperativeHandle(
    ref,
    () => ({
      // for useController
      setIsPlaying,
      setLevel,
      addControllerChangeListener,
      removeControllerChangeListener,
      addTimerChangeListener,
      removeTimerChangeListener,
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
      setLevel,
      addControllerChangeListener,
      removeControllerChangeListener,
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
      {isValidElement(props.backgroundComponent) &&
        cloneElement(props.backgroundComponent as ReactElement, {
          ...props.backgroundComponent.props,
          style: {
            width: props.width,
            height: props.height,
            position: "absolute",
            outline: "none",
            touchAction: "none",
            ...props.backgroundComponent.props.style,
          },
        })}
      <canvas ref={getRenderLayerRef} style={{ position: "absolute" }} />
    </div>
  );
});

Typing.displayName = "TypingGame";

export default Typing;
