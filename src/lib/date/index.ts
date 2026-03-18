import { DATE_FORMAT } from '@/constants/date'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import duration, { DurationUnitType } from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(duration)
dayjs.extend(relativeTime)

export const formatDate = (
  value?: string | Date | number,
  format: string = DATE_FORMAT
) => {
  if (!format || !value) return

  const date = dayjs(value)
  if (!date.isValid()) return '---'

  return date.format(format)
}

export function formatDuration(
  durationTime: number,
  durationType: DurationUnitType = 'milliseconds'
): string {
  if (durationTime <= 0) return '---'
  return dayjs.duration(durationTime, durationType).humanize()
}

/**
 * Get duration from current time to a given Unix timestamp (in seconds)
 * @param {number} unixTimestamp - Unix timestamp in seconds
 * @returns {dayjs.Duration} duration object
 */
function getDurationFromNow(unixTimestamp: number) {
  const now = dayjs()
  const target = dayjs(unixTimestamp) // Convert seconds to dayjs
  const diffMs = target.diff(now) // Get absolute diff in milliseconds
  return dayjs.duration(diffMs)
}

/**
 * Get human-readable duration from now to timestamp
 * @param {number} unixTimestamp - Unix timestamp in seconds
 * @returns {string} - humanized duration string
 */
export function getDurationStringFromNow(unixTimestamp: number) {
  const durationObj = getDurationFromNow(unixTimestamp)
  return durationObj.humanize()
}
