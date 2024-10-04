import './App.css'
import Game from './Components/Game'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Login from './Components/Login'

function App() {


  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element = {<Login/>}></Route>
        <Route path='/game' element = {<Game/>}></Route>
      </Routes>
    </Router>
      
    </>
  )
}

export default App
