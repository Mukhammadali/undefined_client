var Volunteer = artifacts.require("./Volunteer.sol");

module.exports = function(deployer) {
  deployer.deploy(Volunteer);
};
