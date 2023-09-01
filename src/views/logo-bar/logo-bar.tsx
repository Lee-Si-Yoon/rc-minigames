import React from "react";
import classes from "./logo-bar.module.scss";
import { ChevronIcon } from "../../svg";
import { useNavigate } from "react-router-dom";
import logoImg from "./gymboxx-logo.png";

interface LogoBarProps {
  to?: string;
}

function LogoBar(props: LogoBarProps) {
  const { to } = props;
  const navigate = useNavigate();
  return (
    <section className={classes.LogoBar}>
      {to ? (
        <button
          className={classes.BackButton}
          onClick={() => navigate(to ?? "")}
        >
          <ChevronIcon width={20} height={20} fill="#B0B8C1" />
        </button>
      ) : (
        <div />
      )}
      <img width={130} src={logoImg} alt="gymboxx-logo" />
      <div />
    </section>
  );
}

LogoBar.displayName = "LogoBar";

export default LogoBar;
