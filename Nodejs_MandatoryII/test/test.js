const forTestUser = require("../app/forTestUser.js");


const chai = require("chai");
const assert = chai.assert;

describe("Make a user", () => {
    it("should make a user", () => {
        var testUser = forTestUser.makeAuser();
        assert.equal(testUser.userIsMade, false);
    });
}); 