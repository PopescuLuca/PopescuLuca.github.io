let url = "http://localhost:3001/";

let globalRequestParameters = {
  method: "GET",
  mode: "cors",
  cache: "no-cache",
  credentials: "same-origin",
  headers: {
    "Content-Type": "application/json",
  },
  redirect: "follow",
  referrerPolicy: "no-referrer",
};

module.exports.url = url;
module.exports.globalRequestParameters = globalRequestParameters;
