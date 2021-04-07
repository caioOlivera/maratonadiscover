let data = [
  {
    id: 1,
    name: "Pizzaria Guoloso",
    "daily-hours": 2,
    "total-hours": 60,
    createdAt: Date.now(), //atribuindo uma nova dat
  },
  {
    id: 2,
    name: "OneTwoProject",
    "daily-hours": 3,
    "total-hours": 47,
    createdAt: Date.now(),
  },
];

module.exports = {
  get() {
    return data;
  },

  update(newJob) {
    data = newJob;
  },
  delete(id) {
    data = data.filter((job) => Number(job.id) !== Number(id));
  },
};
