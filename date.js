

function date() {
    const option = {
        weekday: "long",
        day: "numeric",
        month: "long",
      };
      let day = new Date().toLocaleDateString("en-US", option);

      return day;
};

module.exports = date;
 