export default class ZzuDate {
  constructor(id, date = '', day = '', cnDay = '', e = null, isChecked = false, isPastTime = false, lunar, body, tip) {
    this.id = id
    this.date = date
    this.day = day
    this.cnDay = cnDay
    this.isChecked = isChecked
    this.e = e
    this.lunar = lunar
    this.isPastTime = isPastTime
    this.tip = tip
    this.body = body
  }
}
