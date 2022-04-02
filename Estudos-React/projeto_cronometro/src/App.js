import React, { Component } from "react";
import "./css/style.css";

export default class App extends Component {
  constructor(props) {
    super(props);

    // Estados dos Componentes
    this.state = {
      cronometro: 0,
      btn: "Iniciar",
    };

    this.timer = null; //Contador do Cronometro inicia como nulo

    // Amarração dos métodos de classe, invocados com click nos botões
    this.go = this.go.bind(this);
    this.end = this.end.bind(this);
  }

  // Função de Inicio e pausa do Cronometro
  go() {
    const state = this.state;

    // Quando o botão é clicado checa se o timer esta ativo,
    // se estiver ele limpa o timer, volta ele ao estado padrão dele,
    // Volta o botão para Iniciar e atualiza os estados
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      state.btn = "Iniciar";
      this.setState(state);
    } else {
    /*
    Se não estiver ativo ele ativa o cronometro de miléssimo em miléssimo 
    atualizando o cronometro e mudando o estado do botão para Pausar e 
    então atualiza os estado
    */
      this.timer = setInterval(() => {
        state.cronometro += 0.1;
        state.btn = "PAUSAR";
        this.setState(state);
      }, 100);
    }
  }

  //  Função que para o cronometro Limpando o timer, setando as
  // configurações do cronometro e do botão aos padrões
  end() {
    const state = this.state;

    clearInterval(this.timer);
    this.timer = null;
    state.cronometro = 0;
    this.setState(state);
    state.btn = "Iniciar";
  }

  // Renderização dos Componentes na tela
  render() {
    return (
      <div className="container">
        <div className="cronometer">
          <h1>{this.state.cronometro.toFixed(1)}</h1>
          <div className="buttons">
            <button onClick={this.go}>{this.state.btn}</button>
            <button onClick={this.end}>Cancelar</button>
          </div>
        </div>
      </div>
    );
  }
}
