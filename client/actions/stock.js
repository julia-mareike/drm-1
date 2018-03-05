import request from '../utils/api'

export const REQUEST_ITEMS = 'REQUEST_ITEMS'
export const RECEIVE_ITEMS = 'RECEIVE_ITEMS'
export const DELIVER_ITEMS = 'DELIVER_ITEMS'

export const receiveItems = (items) => {
  return {
    type: RECEIVE_ITEMS,
    items: items
  }
}

export const doDeliverItems = (item, qty) => {
  return {
    type: DELIVER_ITEMS,
    latestQty: qty,
    locationStockId: item
  }
}

export function requestItems () {
  return (dispatch) => {
    request('get', '/stock')
      .then(res => {
        dispatch(receiveItems(res.body))
      })
  }
}

export function increaseItems (locationStockId, qty) {
  return (dispatch) => {
    request('post', '/increment', {id: locationStockId, quantity: qty})
      .then(res => {
        dispatch(doDeliverItems(locationStockId, res.body.quantity))
      })
  }
}

export function deliverItems (locationStockId, qty, callback) {
  return (dispatch) => {
    request('post', '/decrement', {id: locationStockId, quantity: qty})
      .then(res => {
        callback(res.body.quantity)
        dispatch(doDeliverItems(res.body.quantity))
      })
  }
}
