import FlagDemo from './components/FlagDemo'
import reactLogo from './assets/react.svg'
import ldLogoBlack from './assets/ld_logo_black.png'
import ldLogoWhite from './assets/lg_logo_white.png'
import './App.css'

function App() {

  return (
    <>
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <a href="https://launchdarkly.com" target="_blank" rel="noopener noreferrer" style={{ marginRight: '20px' }}>
          <picture>
            <source srcSet={ldLogoWhite} media="(prefers-color-scheme: dark)" />
            <img src={ldLogoBlack} className="logo launchdarkly" alt="LaunchDarkly logo" />
          </picture>
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <FlagDemo />
      </div>
    </>
  )
}

export default App
