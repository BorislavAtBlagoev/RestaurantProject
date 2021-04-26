function getActiveOrder(orders, tableId) {
  return orders.find((order) => order.table === tableId && order.status === 'In progress');
}

export default getActiveOrder;
