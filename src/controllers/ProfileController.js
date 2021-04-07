/* aqui estamos exportando os controller do profile e estamos refatorando o codigo pra saber 
onde achar as coisas mais facil*/
// No modelo MVC, controller trabalha com as funcoes que controlam e alteram o codigo

const Profile = require("../model/Profile");

module.exports = {
  index(req, res) {
    return res.render("profile", { profile: Profile.get() });
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
    Profile.update({
      ...Profile.get(),
      ...req.body,
      "value-hour": valueHour,
    });
    return res.redirect("/profile");
  },
};
