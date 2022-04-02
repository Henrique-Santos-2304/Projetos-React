import React, { useEffect, useState } from "react";
import Buttons from "../Buttons";
import Display from "../Display";

// Função que recebe como parâmetro os operando faz os calculos devidos
//  da calculadora
const opCalculator = (num1, op, num2) => {
  if (op === "+") {
    return num1 + num2;
  } else if (op === "-") {
    return num1 - num2;
  } else if (op === "/") {
    return num1 / num2;
  } else if (op === "*") {
    return num1 * num2;
  }
};

export default function Calculator() {
  // States da aplicação
  const [displayValue, setDisplayValue] = useState("0");
  const [opperation, setOpperation] = useState(null);
  const [clearDisplay, setClearDisplay] = useState(false);
  const [values, setValues] = useState([0, 0]);
  const [current, setCurrent] = useState(0);

  // Ao apertar o botão AC limpa a tela e os numeros da calculadora, reseta tudo
  const clearMemory = (e) => {
    setDisplayValue("0");
    setValues([0, 0]);
    setOpperation(null);
    setClearDisplay(false);
    setCurrent(0);
  };
  // Ao apertar algum dos botões de operações matemáticas aciona essa função
  // que faz a lógica verificando se os parâmetros são válidos, e só então chama
  // a função que realmente realiza os cálculos de acordo com o operando
  const setOperations = (op) => {
    if (current === 0) {
      setOpperation(op);
      setCurrent(1);
      setClearDisplay(true);
    } else {
      const equals = op === "=";
      const thisOpperation = opperation;
      let value = [...values];
      const result = opCalculator(value[0], thisOpperation, value[1]);
      value[0] = result;
      value[1] = 0;
      setDisplayValue(value[0]);
      setOpperation(equals ? null : op);
      setCurrent(equals ? 0 : 1);
      setClearDisplay(true);
      setValues(equals ? [0, 0] : value);
    }
  };
  // Função que checa os requisitos e mostra os números digitados no display
  const addDigit = (ad) => {
    if (ad === "." && displayValue.includes(".")) {
      return;
    }
    const clearDisplay2 = displayValue === "0" || clearDisplay;
    const valueCurrent = clearDisplay2 ? "" : displayValue;
    setDisplayValue(valueCurrent + ad);
    setClearDisplay(false);
  };
  // Salva os números digitados no array value do seState quando
  // displayValue sofre alteração
  useEffect(() => {
    const addValue = parseFloat(displayValue);
    const value = [...values];
    value[current] = addValue;
    setValues(value);
  }, [displayValue]);
  // Array com os usseEffect que atualiza o component cada vez um dos itens
  //  do array de dependências sofrer algum tipo de alteração
  useEffect(() => {}, [clearDisplay, values, opperation, current]);

  return (
    <div className="container">
      <Display value={displayValue} />
      <Buttons btnStyles="triple" label="AC" click={clearMemory} />
      <Buttons btnStyles="operations" label="/" click={setOperations} />
      <Buttons label="7" click={addDigit} />
      <Buttons label="8" click={addDigit} />
      <Buttons label="9" click={addDigit} />
      <Buttons btnStyles="operations" label="*" click={setOperations} />
      <Buttons label="4" click={addDigit} />
      <Buttons label="5" click={addDigit} />
      <Buttons label="6" click={addDigit} />
      <Buttons btnStyles="operations" label="-" click={setOperations} />
      <Buttons label="1" click={addDigit} />
      <Buttons label="2" click={addDigit} />
      <Buttons label="3" click={addDigit} />
      <Buttons btnStyles="operations" label="+" click={setOperations} />
      <Buttons btnStyles="double" label="0" click={addDigit} />
      <Buttons label="." click={addDigit} />
      <Buttons btnStyles="operations" label="=" click={setOperations} />
    </div>
  );
}
