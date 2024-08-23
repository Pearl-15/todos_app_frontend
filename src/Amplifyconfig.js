const DEVConfig = {
    Auth: {
      userPoolId: "us-east-1_UZTM6SK6b",
      userPoolWebClientId: "7kl5tq18g0t0hd5j6gtcqe8sch",
    },
    API: {
        endpoints: [
          {
            name: "todoapi",
            endpoint:
              "https://az90jhxew5.execute-api.us-east-1.amazonaws.com/dev",
            region: "us-east-1",
          },
        ],
      }
};


export default DEVConfig;