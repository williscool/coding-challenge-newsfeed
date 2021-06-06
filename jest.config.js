module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  "moduleFileExtensions": [ // https://stackoverflow.com/a/51994630/511710
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ]
};