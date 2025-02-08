import FlagDemo from './components/FlagDemo'
import reactLogo from './assets/react.svg'
import './App.css'

function App() {

  return (
    <>
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" style={{ height: '100px' }} />
        </a>
        <FlagDemo />
      </div>
    </>
  )
}

export default App
