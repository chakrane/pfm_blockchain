const Rectangle = artifacts.require("Rectangle");

module.exports = async function (deployer) {
  await deployer.deploy(Rectangle, 1, 2, 10, 5);
};
