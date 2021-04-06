const express = require("express");
const routes = express.Router();

const views = __dirname + "/views/";

const Profile = {
  data: {
    name: "Caio",
    avatar: "https://avatars.githubusercontent.com/u/73246374?v=4",
    "monthly-budget": 3000,
    "days-per-week": 5,
    "hours-per-day": 5,
    "vacation-per-year": 4,
    "value-hour": 75,
  },
  controllers: {
    index(req, res) {
      return res.render(views + "profile", { profile: Profile.data });
    },
    update(req, res) {
      // req.body para pegar os dados
      const data = req.body;
      const weeksPerYear = 52;
      //remover as semansa de ferias do ano , para pegar quantas semana tem em 1 mes
      const weeksPerMonth = (weeksPerYear - data["vacation-per-year"]) / 12;
      // quantas horas por semana eu trabalho
      const weekTotalHours = data["hours-per-day"] * data["days-per-week"];
      // horas trabalahdasa no mes
      const monthlyTotalHours = weekTotalHours * weeksPerMonth;

      // qual sera o valor da minha horas
      const valueHour = data["monthly-budget"] / monthlyTotalHours;
      Profile.data = {
        ...Profile.data,
        ...req.body,
        "value-hour": valueHour,
      };
      return res.redirect("/profile");
    },
  },
};

const Job = {
  data: [
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
  ],
  controllers: {
    index(req, res) {
      const updatedJobs = Job.data.map((job) => {
        //ajustes no jobs
        const remaining = Job.services.remainingDays(job);
        const status = remaining <= 0 ? "done" : "progress";
        return {
          ...job,
          remaining,
          status,
          budget: Job.services.calculateBudget(job, Profile.data["value-hour"]),
        };
      });

      return res.render(views + "index", { jobs: updatedJobs });
    },
    create(req, res) {
      return res.render(views + "job");
    },
    save(req, res) {
      const lastId = Job.data[Job.data.length - 1]
        ? Job.data[Job.data.length - 1].id
        : 0;

      Job.data.push({
        id: lastId + 1,
        name: req.body.name,
        "daily-hours": req.body["daily-hours"],
        "total-hours": req.body["total-hours"],
        createdAt: Date.now(), //atribuindo uma nova dat
      });
      return res.redirect("/");
    },
    show(req, res) {
      const jobId = req.params.id;

      const job = Job.data.find((job) => Number(job.id) === Number(jobId));

      if (!job) {
        return res.send("job not found");
      }

      job.budget = Job.services.calculateBudget(
        job,
        Profile.data["value-hour"]
      );

      return res.render(views + "job-edit", { job });
    },
    update(req, res) {
      const jobId = req.params.id;

      const job = Job.data.find((job) => Number(job.id) === Number(jobId));

      if (!job) {
        return res.send("job not found");
      }

      const updatedJob = {
        ...job,
        name: req.body.name,
        "total-hours": req.body["total-hours"],
        "daily-hours": req.body["daily-hours"],
      };
      Job.data = Job.data.map((job) => {
        if (Number(job.id) === Number(jobId)) {
          job = updatedJob;
        }
        return job;
      });

      res.redirect("/job/" + jobId);
    },
    delete(req, res) {
      const jobId = req.params.id;
      Job.data = Job.data.filter((job) => Number(job.id) !== Number(jobId));

      return res.redirect("/");
    },
  },
  services: {
    remainingDays(job) {
      //calculo de tempo restante
      const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed();
      const createdDate = new Date(job.createdAt);
      const dueDay = createdDate.getDate() + Number(remainingDays);
      const dueDateInMs = createdDate.setDate(dueDay);

      const timeDiffInMs = dueDateInMs - Date.now();
      //transformar milli em dias
      const dayInMs = 1000 * 60 * 60 * 24;
      const dayDiff = Math.floor(timeDiffInMs / dayInMs);
      return dayDiff;
    },
    calculateBudget: (job, valueHour) => valueHour * job["total-hours"],
  },
};

routes.get("/", Job.controllers.index);
routes.get("/job", Job.controllers.create);
routes.post("/job", Job.controllers.save);
routes.get("/job/:id", Job.controllers.show);
routes.post("/job/:id", Job.controllers.update);
routes.post("/job/delete/:id", Job.controllers.delete);
routes.get("/profile", Profile.controllers.index);
routes.post("/profile", Profile.controllers.update);

module.exports = routes;
