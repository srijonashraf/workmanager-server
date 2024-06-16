//This query is to set compound text index basically needed for search text across the document
use("WorkManager");
db.works.createIndex(
  {
    workTitle: "text",
    workDescription: "text",
  },
  {
    weights: {
      workTitle: 1,
      workDescription: 1,
    },
    name: "TextIndex",
  }
);
