type ControllerProps = { playTime: number };
type ControllerChangeParams = { data: ControllerProps };
type ControllerChangeHandler = (params: ControllerChangeParams) => void;

export type {
  ControllerChangeHandler,
  ControllerChangeParams,
  ControllerProps,
};
