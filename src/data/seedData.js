const users = [
  { name: 'Shalabh Kamboj', age: 24, city: 'Yamunanagar', email: 'shalabh@example.com' },
  { name: 'Taman', age: 29, city: 'Mohali', email: 'taman@example.com' },
  { name: 'Vishal', age: 31, city: 'Rajasthan', email: 'vishal@example.com' },
];

function buildOrders(userDocs) {
  const byName = userDocs.reduce((acc, user) => {
    acc[user.name] = user._id;
    return acc;
  }, {});

  return [
    { userId: byName['Shalabh Kamboj'], amount: 1200, status: 'completed', orderDate: new Date('2026-01-02') },
    { userId: byName['Taman'], amount: 650, status: 'pending', orderDate: new Date('2026-01-10') },
    { userId: byName['Vishal'], amount: 3000, status: 'cancelled', orderDate: new Date('2026-01-12') },
  ];
}

module.exports = {
  users,
  buildOrders,
};
