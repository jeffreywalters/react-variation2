import React, { Component, PropTypes } from 'react'
import classNames from 'classnames/bind'
import styles from './Loader.css'

const cx = classNames.bind(styles)

class Loader extends Component {
  static propTypes = {
    size: PropTypes.oneOf(['sm', '', 'lg']),
    timer: PropTypes.bool
  }

  static defaultProps = {
    size: '',
    timer: false
  };

  constructor(props) {
    super(props)
    this.state = {
      seconds: 0
    }
    // bind methods
    this.tick = this._tick.bind(this)
  }

  componentDidMount() {
    if (this.props.timer) {
      this.interval = setInterval(this.tick, 1000)
    }
  }

  componentWillUnmount() {
    if (this.props.timer) {
      clearInterval(this.interval)
    }
  }

  _tick() {
    this.setState({
      seconds: this.state.seconds + 1
    })
  }

  render() {
    const { size, timer } = this.props
    const { seconds } = this.state
    const sizeClass = `loader-${size}`

    let timerClass
    if (seconds >= 10) {
      timerClass = 'text-danger'
    } else if (seconds >= 5) {
      timerClass = 'text-warning'
    } else {
      timerClass = 'text-success'
    }

    return (
      <div className={cx('loader-container')}>
        <div className={cx('loader', sizeClass)}>
          <svg className={cx('circular')} viewBox='25 25 50 50'>
            <circle
              className={cx('path')}
              cx='50'
              cy='50'
              r='20'
              fill='none'
              strokeWidth='1'
              strokeMiterlimit='10'
            />
          </svg>
          {timer && <div className={cx('loader-timer', timerClass)}>{seconds}</div>}
        </div>
      </div>
    )
  }
}

export default Loader
