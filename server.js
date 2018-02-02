const express = require("express");
const bodyParser = require("body-parser");
const { graphqlExpress, graphiqlExpress } = require("apollo-server-express");
const { makeExecutableSchema } = require("graphql-tools");
const { find, filter } = require("lodash");
var cors = require("cors");

// some fake data
const games = [
  {
    name: "Mirror Play",
    description:
      "During tummy-time, prop up a mirror in front of your baby so they'll see themselves when they look up and forwards.  This can be an engaging and mentally stimulating activity for your little one.",
    bonus:
      "Sit behind your baby so that you appear in the reflection. Then try popping in and out of frame. This version of peek-a-boo is very popular with babies around your child's age.",
    skillId: "59d29d1a734d1d42e49ed324"
  },
  {
    name: "Pull to a Sit",
    description:
      "With your baby lying on her back over your lap (facing you), let her grasp your fingers.  Supporting her so she doesn't fall down, gradually pull your baby up into a seated position.  Once she's seated, congratulate her! You made it!",
    bonus:
      "If you'd like, you can start bouncing your baby up and down (like riding a horse), once their in a seated position.  This movement will signal that they've accomplished the previous task and engage them in a new way.",
    skillId: "59d2cb8e734d1d42e49eebdc"
  }
];

const skills = [
  {
    id: "59d29d1a734d1d42e49ed324",
    ageId: 1,
    name: "Holding up their head during tummy time"
  },
  {
    id: "59d2cb8e734d1d42e49eebdc",
    ageId: 1,
    name: "Grasping a toy"
  },
  {
    id: "59d2cbd3734d1d42e49eecdf",
    ageId: 1,
    name: "Rolling front to back"
  },
  {
    id: "59d2cbf6734d1d42e49eece1",
    ageId: 2,
    name: "Rolling back to front"
  },
  {
    id: "59d2cc0c734d1d42e49eece2",
    ageId: 2,
    name: "Sitting Up"
  },
  {
    id: "59d2cc23734d1d42e49eecee",
    ageId: 2,
    name: "Crawling"
  },
  {
    id: "59d2cc47734d1d42e49eecf2",
    ageId: 3,
    name: "Standing without support"
  },
  {
    id: "59d2cc7a734d1d42e49eecf3",
    ageId: 3,
    name: "Walking"
  }
];

const ages = [
  {
    id: 1,
    range: "ZeroToFour"
  },
  {
    id: 2,
    range: "FiveToEight"
  },
  {
    id: 3,
    range: "NineToTwelve"
  }
];

// the graphql schema in string form
const typeDefs = `
  type Age { 
    id: Int
    range: String!, 
    skills: [Skill] 
  }

  type Skill { 
    id: String, 
    name: String,
    ageId: Int
  }

  type Game { 
    name: String,
    description: String, 
    bonus: String,
    skillId: String
  }

  type Query { 
    games: [Game],
    ages: [Age],
    age(range: String!): [Skill],
    skills(ageId: Int!): [Skill],
    game(skillId: String!): Game
  }
`;

// the resolvers
const resolvers = {
  Query: {
    games: () => games,
    ages: () => ages,
    age: (_, { id }) => find(skills, { ageId: range }),
    skills: (_, { ageId }) => filter(skills, { ageId: ageId }),
    game: (_, { skillId }) => find(games, { skillId: skillId })
  }
};

// put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const app = express();

app.use(cors());

// the graphql endpoint
app.use("/graphql", bodyParser.json(), graphqlExpress({ schema }));

// graphiql, a visual editor for queries
app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

// start the server
app.listen(4000, () => {
  console.log("Go to http://localhost:4000/graphiql to run a test query");
});

// // Construct a schema, using GraphQL schema language
// const schema = buildSchema(`
//   type Query {
//     hello: String
//   }
// `);

// // The root provides a resolver function for each API endpoint
// const root = {
//   hello: () => {
//     return "Hello world!";
//   }
// };

// const app = express();
// app.use(
//   "/graphql",
//   graphqlHTTP({
//     schema: schema,
//     rootValue: root,
//     graphiql: true
//   })
// );
// app.listen(4000);
// console.log("Running a GraphQL API server at localhost:4000/graphql");
