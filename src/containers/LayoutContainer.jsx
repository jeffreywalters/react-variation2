import React from 'react'

const Layout = (props) => (
  <div>
    <header className='container' style={{backgroundColor: '#eee'}}>
      <div className="page-header">
        <h2>React Challenge <small>Jeff Walters</small></h2>
      </div>
    </header>
    <div className='container' style={{backgroundColor: '#F9F9F9'}}>
      {props.children}
    </div>
    <footer className='container' style={{ backgroundColor: '#eee', padding: '20px' }}>
      https://github.com/jeffreywalters/react-challenge
    </footer>
  </div>
)
Layout.propTypes = {
  children: React.PropTypes.element.isRequired
}

export default Layout
