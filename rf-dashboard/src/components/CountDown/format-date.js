import moment from 'moment'

export default function formatDate(toDate, targetFormatMask, sourceFormatMask) {
  // impedir que retorne duração negativa
  const countdownMillisecond = Math.max(0, getDelta(toDate, sourceFormatMask))
  const duration = moment.duration(countdownMillisecond)

  // para exibir corretamente a contagem regressiva da unidade mais granular
  const countdownString = moment.utc(duration.as('milliseconds')).format(targetFormatMask)

  return [countdownMillisecond, countdownString]
}

export function getDelta(toDate, sourceFormatMask) {
  if (!moment.isMoment(toDate)) {
    const convert = moment.isDate(toDate)
      ? moment(toDate)
      : moment(toDate, sourceFormatMask)

    return convert.diff(moment())
  }

  return toDate.diff(moment())
}