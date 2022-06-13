import React from 'react';
import Rooms from "./Rooms";
import Modal from 'react-modal';

Modal.setAppElement('#root')


class App extends React.Component {


  render(){
      return (
        <div>
          <nav className="navbar navbar-dark bg-primary h1">
            <a className="navbar-brand mx-auto" href= "#">Hotel Application </a>
          </nav>
          <br />
          <h5 style={{color: "white"}}> Select a room for reservation: </h5>
          <Rooms />
        </div>
      );
  }
}

export default App;
