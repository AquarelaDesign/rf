import React, { useState, useEffect } from 'react'
import { MdTimer } from 'react-icons/md'

const CountDown = () => {
  const [seconds, setSeconds] = useState(20)
  const [time, setTime] = useState({})
  
  let timer = 0

  const secondsToTime = (secs) => {
    let hours = Math.floor(secs / (60 * 60))

    let divisor_for_minutes = secs % (60 * 60)
    let minutes = Math.floor(divisor_for_minutes / 60)

    let divisor_for_seconds = divisor_for_minutes % 60
    let seconds = Math.ceil(divisor_for_seconds)

    let obj = {
      "h": hours,
      "m": minutes,
      "s": seconds
    }
    return obj
  }

  useEffect(() => {
    let timeLeftVar = secondsToTime(seconds)
    setTime(timeLeftVar)
  }, [])

  const startTimer = () => {
    if (timer == 0 && seconds > 0) {
      timer = setInterval(countDown, 1000)
    }
  }

  const countDown = () => {
    let second = seconds - 1
    setTime(secondsToTime(second))
    setSeconds(second)
    
    if (second == 0) { 
      clearInterval(timer)
    }
  }

  return(
    <div>
      <button onClick={startTimer}>Start</button>
      m: {time.m} s: {time.s}
    </div>
  )
}

export default CountDown