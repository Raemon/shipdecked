import React from 'react';

const SeasonCountdown = ({dayCount}: {dayCount: number}) => {
  if (dayCount < 20) {
    return <div>{20 - dayCount} days till <br/>Monsoon Season</div>
  } else if (dayCount < 40) {
    return <div>{40 - dayCount} days till <br/>Summer</div>
  } else if (dayCount < 60) {
    return <div>{60 - dayCount} days till <br/>Dry Season</div>
  }
}

export default SeasonCountdown;