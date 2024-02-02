import React from 'react';

const SeasonCountdown = ({dayCount}: {dayCount: number}) => {
  return <div>{20 - dayCount} days till <br/>Monsoon Season</div>
}

export default SeasonCountdown;