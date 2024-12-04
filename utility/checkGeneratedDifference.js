import dayjs from 'dayjs'
dayjs().format()

export function checkDate(item) {
    const timeNow = Date.now()
    const date1 = dayjs(timeNow)
    const check = item.imagesUrl ? item.imagesUrl.generated ? item.imagesUrl.generated : "2019-01-25" : "2019-01-25"
    const date2 = dayjs(check)
    const timeUrlLastGenerated = date1.diff(date2, 'day', true)
    return timeUrlLastGenerated
}