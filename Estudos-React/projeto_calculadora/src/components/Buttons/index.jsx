import React from "react";

export default function Buttons(props) {
  // Checa se foi passado alguma classe pelas props para diferenciar os botões
  const classButton = props.btnStyles ? props.btnStyles : "";
  return (
    <button
      className={`
  btns ${classButton}
  `}
      onClick={(e) => {
        props.click(props.label);
      }}
    >
      {props.label}
    </button>
  );
}
